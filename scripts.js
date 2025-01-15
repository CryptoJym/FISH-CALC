// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    /**************************************************************
     *    1. CERT DATA + GLOBAL SETTINGS
     **************************************************************/
    const certData = [
        {
            id: 'angel-fish',
            name: 'Angel-FISH',
            imageSrc: 'assets/icon--angel-fish-colors--teal-cyan-with-deep-blue-.png',
            altText: 'Angel-FISH Icon',
            totalCerts: 15000, // max possible
            weightingFactor: 0.25,
            phase2Multiplier: 2,
            certColor: '#0AFFFF',
            startingPriceDisplay: '$25',
            incrementAmount: 10,
            incrementInterval: 100,
        },
        {
            id: 'cod-fish',
            name: 'Cod-FISH',
            imageSrc: 'assets/COD FISH CERT.png',
            altText: 'Cod-FISH Icon',
            totalCerts: 12500,
            weightingFactor: 0.50,
            phase2Multiplier: 2,
            certColor: '#FC54FF',
            startingPriceDisplay: '$35',
            incrementAmount: 15,
            incrementInterval: 100,
        },
        {
            id: 'tuna-fish',
            name: 'Tuna-FISH',
            imageSrc: 'assets/icon--tuna-colors--teal-cyan-with-deep-blue-highli.png',
            altText: 'Tuna-FISH Icon',
            totalCerts: 10000,
            weightingFactor: 0.75,
            phase2Multiplier: 3,
            certColor: '#FFE800',
            startingPriceDisplay: '$45',
            incrementAmount: 20,
            incrementInterval: 100,
        },
        {
            id: 'sword-fish',
            name: 'Sword-FISH',
            imageSrc: 'assets/SWORD FISH CERT.png',
            altText: 'Sword-FISH Icon',
            totalCerts: 7500,
            weightingFactor: 1.00,
            phase2Multiplier: 4,
            certColor: '#FF3D3D',
            startingPriceDisplay: '$55',
            incrementAmount: 25,
            incrementInterval: 100,
        },
        {
            id: 'king-fish',
            name: 'King-FISH',
            imageSrc: 'assets/icon--kingfish-colors--teal-cyan-with-deep-blue-hi.png',
            altText: 'King-FISH Icon',
            totalCerts: 5000,
            weightingFactor: 1.25,
            phase2Multiplier: 5,
            certColor: '#39FF14',
            startingPriceDisplay: '$65',
            incrementAmount: 30,
            incrementInterval: 100,
        },
    ];

    // 1.1. This is the total staker pool for 10 years: 5.49e9
    // The distribution halved each year:
    //   Year 1 = 2.745e9
    //   Year 2 = 1.3725e9
    //   ...
    const totalStakerPool = 5.49e9;  

    // We'll store the "global minted percentage" for each fish,
    // e.g. if user sets 50% for Angel-FISH => 7500 minted globally.
    let globalPercentMinted = {
        'angel-fish': 50,
        'cod-fish': 50,
        'tuna-fish': 50,
        'sword-fish': 50,
        'king-fish': 50
    };

    // 1.2. Weighted stake for "global minted" (everyone, not just the user).
    // The user will select how many they personally want to buy (qAngel, qCod, etc.).
    // Then we do Weighted Stake ratio => user portion of each year's pool.

    // Phase2 default
    let phase2StartYear = 5; 

    // We'll track if the user created a collection
    let collectionCreated = false;

    // Track the user’s total cost
    let userInvestment = 0;

    // Grab references to key DOM elements
    const collectionContainer = document.getElementById('cert-collection');
    const purchaseButton = document.getElementById('purchase-button');
    const globalLicenseCounter = document.querySelector('#global-counter .counter-value');

    const userCollectionDiv = document.getElementById('user-collection');
    const tokenPriceContainer = document.getElementById('token-price-container');
    const financialProjectionsContainer = document.getElementById('financial-projections-container');
    const graphContainer = document.getElementById('graph-container');
    const financialProjections = document.getElementById('financial-projections');

    // The currently selected token price
    let selectedTokenPrice = parseFloat(document.querySelector('input[name="token-price"]:checked')?.value || '0.025');

    // 1.3. We’ll build the UI for each fish card:
    function createCertCards() {
        certData.forEach(cert => {
            const card = document.createElement('div');
            card.classList.add('cert-card');
            card.id = cert.id;

            card.innerHTML = `
                <div class="cert-inner">
                    <!-- FRONT -->
                    <div class="cert-front">
                        <div class="cert-image-box">
                            <div class="cert-image">
                                <img src="${cert.imageSrc}" alt="${cert.altText}" width="200" height="200" loading="lazy">
                            </div>
                        </div>
                        <div class="cert-text-box">
                            <h2>${cert.name}</h2>
                            <div class="cert-details">
                                <p><span class="label">Max CERTs:</span>
                                   <span class="value">${cert.totalCerts.toLocaleString()}</span>
                                </p>
                                <!-- We might show minted% in a separate UI,
                                     but let's just display total for now -->
                                <p><span class="label">Weighted Factor:</span>
                                   <span class="value">${cert.weightingFactor.toFixed(2)}</span>
                                </p>
                                <p><span class="label">Phase 2 Multiplier:</span>
                                   <span class="value">${cert.phase2Multiplier}x</span>
                                </p>
                            </div>
                        </div>
                        <button class="purchase-button" aria-label="View ${cert.name} details" role="button">
                            VIEW DETAILS
                        </button>
                    </div>

                    <!-- BACK -->
                    <div class="cert-back">
                        <div class="cert-text-box">
                            <h2>${cert.name} Details</h2>
                            <div class="cert-details">
                                <p><span class="label">Global Sold (%):</span>
                                   <span class="value global-sold">${globalPercentMinted[cert.id]}%</span>
                                </p>
                                <p><span class="label">User CERTs:</span>
                                   <span class="value user-qty">0</span>
                                </p>
                                <p><span class="label">Your Investment:</span>
                                   <span class="value total-cost-value">$0</span>
                                </p>
                            </div>
                        </div>

                        <!-- ROI area: daily USD & break-even (just placeholders for now) -->
                        <div class="roi-estimate" style="margin-top:10px; font-size:0.9em; color:#00ffff;">
                            <p><strong>Est. Year 1 Tokens:</strong> <span class="year1-tokens">--</span></p>
                            <p><strong>Break-even:</strong> <span class="break-even">-- days</span></p>
                        </div>

                        <div class="cert-counter">
                            <button class="counter-button minus-button" aria-label="Decrease quantity">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" />
                                </svg>
                            </button>
                            <input type="number" value="0" min="0" aria-label="Quantity">
                            <button class="counter-button plus-button" aria-label="Increase quantity">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" />
                                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            collectionContainer.appendChild(card);
        });
    }

    createCertCards();
    const certCards = document.querySelectorAll('.cert-card');

    // 1.4. We might also have a UI for global minted percentages. 
    // This code snippet assumes you have sliders or inputs somewhere 
    // that call `updateGlobalMinted(fishId, newPercent)`.

    function updateGlobalMinted(fishId, newPercent) {
        globalPercentMinted[fishId] = newPercent;
        // Also re-render the card backside text 
        const card = document.getElementById(fishId);
        if (card) {
            const globalSoldEl = card.querySelector('.global-sold');
            if (globalSoldEl) {
                globalSoldEl.textContent = newPercent + '%';
            }
        }
        if (collectionCreated) updateCalculations();
    }

    /**************************************************************
     *    2. YEARLY POOL & Weighted Stake
     **************************************************************/

    // 2.1. Build array of halving distribution 
    // yearPool[1] = 2.745e9, yearPool[2] = 1.3725e9, ...
    function computeYearlyPool() {
        const yearlyPool = [];
        let halfOfTotal = totalStakerPool / 2; // Year 1 is half => 2.745e9
        for (let y = 1; y <= 10; y++) {
            if (y === 1) {
                yearlyPool[y] = halfOfTotal;
            } else {
                halfOfTotal = halfOfTotal / 2;
                yearlyPool[y] = halfOfTotal;
            }
        }
        return yearlyPool;
    }

    function getGlobalMintedCount(fishId) {
        const cd = certData.find(c => c.id === fishId);
        const percent = globalPercentMinted[fishId] / 100;
        return Math.floor(cd.totalCerts * percent);
    }

    // Weighted stake in year Y (factoring phase2 multiplier)
    function getWeightedStakeForYear(year) {
        let userWeight = 0;
        let globalWeight = 0;

        certData.forEach(cert => {
            const fishId = cert.id;
            // Global minted
            let gQty = getGlobalMintedCount(fishId);
            // User minted
            const card = document.getElementById(fishId);
            const qtyInput = card.querySelector('.cert-counter input');
            const userQty = parseInt(qtyInput.value) || 0;

            // If year >= phase2 => multiply both user & global if you want 
            // or only user if that’s your logic. 
            let finalUserQty = userQty;
            let finalGlobalQty = gQty;

            if (year >= phase2StartYear) {
                finalUserQty *= cert.phase2Multiplier;
                // Some designs might multiply only user’s or also global minted.
                finalGlobalQty *= cert.phase2Multiplier;
            }

            userWeight += finalUserQty * cert.weightingFactor;
            globalWeight += finalGlobalQty * cert.weightingFactor;
        });

        return { userWeight, globalWeight };
    }

    // 2.2. Build a function to compute year-by-year user tokens
    // and ROI data
    function computeYearlyRewards() {
        const pool = computeYearlyPool(); // e.g. array of 10
        let cumTokens = 0;
        let resultsPerYear = [];
        const userCost = getUserTotalInvestment(); // total cost user spent

        for (let y = 1; y <= 10; y++) {
            const { userWeight, globalWeight } = getWeightedStakeForYear(y);
            const yearPool = pool[y];

            let userShareY = 0;
            if (globalWeight > 0) {
                userShareY = (userWeight / globalWeight) * yearPool;
            }

            cumTokens += userShareY;

            // Value in USD
            const yearValue = userShareY * selectedTokenPrice;
            const cumValue = cumTokens * selectedTokenPrice;
            // COR => (cumValue / userCost) * 100
            const cor = userCost > 0 ? (cumValue / userCost) * 100 : 0;

            resultsPerYear.push({
                year: y,
                userTokens: userShareY,
                dailyTokens: userShareY / 365,
                cumTokens,
                yearValue,
                cumValue,
                cor
            });
        }
        return resultsPerYear;
    }

    function getUserTotalInvestment() {
        // sum up cost for each fish type (like your old code)
        let total = 0;
        certData.forEach(cert => {
            const card = document.getElementById(cert.id);
            const qtyInput = card.querySelector('.cert-counter input');
            const quantity = parseInt(qtyInput.value) || 0;
            // optionally, if you have a price step logic for purchase cost:
            // For simplicity: price = ???

            // example: let's do a simple approach: cost = quantity * some price 
            // (But you'd presumably have your incremental price function.)
            // Here, we skip it or do a direct approach if needed:

            const costForThisFish = calculateTotalCostOfFish(cert, quantity);
            total += costForThisFish;
        });
        return total;
    }

    // If you still want incremental pricing for each fish, define it:
    function calculateTotalCostOfFish(cert, quantity) {
        // e.g. your old code that increments by cert.incrementAmount each 100 sold
        // or keep it simpler for demonstration:
        let totalCost = 0;
        let remaining = quantity;
        let currentPrice = parseFloat(cert.startingPriceDisplay.replace(/[^0-9.]/g, '')) || 25;
        let increment = cert.incrementAmount || 10;
        let incrementInterval = cert.incrementInterval || 100;
        let sold = 0;

        while (remaining > 0) {
            const nextIncrementAt = incrementInterval - (sold % incrementInterval);
            const qtyAtThisPrice = Math.min(nextIncrementAt, remaining);
            totalCost += qtyAtThisPrice * currentPrice;
            sold += qtyAtThisPrice;
            remaining -= qtyAtThisPrice;
            if (remaining > 0) {
                currentPrice += increment;
            }
        }
        return totalCost;
    }

    /**************************************************************
     *    3. Interactivity for Each Card
     **************************************************************/
    certCards.forEach(card => {
        const fishId = card.id;
        const viewButton = card.querySelector('.purchase-button');
        const inputField = card.querySelector('.cert-counter input');
        const minusButton = card.querySelector('.minus-button');
        const plusButton = card.querySelector('.plus-button');

        // Flip card
        viewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('flipped');
        });
        card.addEventListener('click', (e) => {
            if (card.classList.contains('flipped')) {
                const clickedInsideCounter = e.target.closest('.cert-back .cert-counter') ||
                                             e.target.closest('.counter-button') ||
                                             e.target.closest('.cert-counter input') ||
                                             e.target.closest('.roi-estimate');
                if (!clickedInsideCounter) {
                    card.classList.remove('flipped');
                }
            }
        });

        function updateQuantity(change) {
            let currentVal = parseInt(inputField.value) || 0;
            const certDef = certData.find(c => c.id === fishId);
            const maxVal = certDef.totalCerts; // or maybe no max if partial minted?

            let newVal = currentVal + change;
            newVal = Math.max(0, Math.min(newVal, maxVal));
            inputField.value = newVal;

            // Update "User CERTs" display
            const userQtyEl = card.querySelector('.user-qty');
            if (userQtyEl) userQtyEl.textContent = newVal.toString();

            // Recompute cost
            const cost = calculateTotalCostOfFish(certDef, newVal);
            const totalCostEl = card.querySelector('.total-cost-value');
            if (totalCostEl) {
                totalCostEl.textContent = '$' + cost.toLocaleString();
            }

            // Update global license counter (the sum of user picks)
            const userTotalLic = getUserTotalLicenses();
            globalLicenseCounter.textContent = userTotalLic.toLocaleString();

            // We'll also store it to "userInvestment" if we want:
            userInvestment = getUserTotalInvestment();

            // If collection created, run big update
            if (collectionCreated) {
                updateCalculations();
            }
        }

        plusButton.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(1);
        });
        minusButton.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(-1);
        });
        inputField.addEventListener('change', (e) => {
            e.stopPropagation();
            const val = parseInt(e.target.value) || 0;
            updateQuantity(val - 0); // triggers the logic
        });
    });

    function getUserTotalLicenses() {
        let total = 0;
        certCards.forEach(card => {
            const qtyInput = card.querySelector('.cert-counter input');
            total += parseInt(qtyInput.value) || 0;
        });
        return total;
    }

    /**************************************************************
     *    4. Purchase Button => Creates Collection, Shows Sections
     **************************************************************/
    purchaseButton.addEventListener('click', () => {
        collectionCreated = true;
        updateUserCollection();
        userCollectionDiv.style.display = 'block';
        tokenPriceContainer.style.display = 'block';
        financialProjectionsContainer.style.display = 'block';
        graphContainer.style.display = 'block';

        // updateCalculations => builds chart & table
        updateCalculations();
    });

    function updateUserCollection() {
        let html = '<h2>Your Collection</h2><div class="user-collection-container">';
        certCards.forEach(card => {
            const qtyInput = card.querySelector('.cert-counter input');
            const quantity = parseInt(qtyInput.value) || 0;
            if (quantity > 0) {
                const fishName = card.querySelector('.cert-front h2').textContent;
                const imgHtml = card.querySelector('.cert-image img').outerHTML;
                html += `
                  <div class="user-cert-card">
                    ${imgHtml}
                    <h3>${fishName}</h3>
                    <p>Quantity: ${quantity}</p>
                  </div>
                `;
            }
        });
        html += '</div>';
        userCollectionDiv.innerHTML = html;
        userCollectionDiv.scrollIntoView({ behavior: 'smooth' });
    }

    /**************************************************************
     *    5. Token Price Radio + Phase 2 Buttons
     **************************************************************/
    const tokenPriceOptions = document.getElementsByName('token-price');
    tokenPriceOptions.forEach(opt => {
        opt.addEventListener('change', () => {
            selectedTokenPrice = parseFloat(opt.value);
            if (collectionCreated) updateCalculations();
        });
    });

    const phase2Buttons = document.querySelectorAll('.phase2-button');
    phase2Buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            phase2Buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            phase2StartYear = parseInt(btn.getAttribute('data-year'));
            if (collectionCreated) updateCalculations();
        });
    });

    // Graph toggle
    const graphToggleButtons = document.querySelectorAll('.graph-toggle-button');
    let chartInstance;
    graphToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            graphToggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (collectionCreated) updateCalculations();
        });
    });

    /**************************************************************
     *    6. The Main Calculation -> Harvesting or COR Graph
     **************************************************************/
    function updateCalculations() {
        // Recompute user’s & global Weighted Stake etc.
        const results = computeYearlyRewards(); // returns array of 10 years
        // Build the chart & table from these results
        buildChart(results);
        buildProjectionTable(results);
    }

    function buildChart(yearlyData) {
        const chartCanvas = document.getElementById('chartCanvas');
        if (!chartCanvas) return;

        const activeGraphType = document.querySelector('.graph-toggle-button.active')?.dataset.type || 'harvesting';

        const labels = yearlyData.map(d => `Year ${d.year}`);
        let dataset = null;
        if (activeGraphType === 'harvesting') {
            // show daily harvest or userTokens (yearly)
            dataset = {
                label: 'Yearly Tokens',
                data: yearlyData.map(d => d.userTokens),
                borderColor: '#0FF',
                fill: false
            };
        } else {
            // cor
            dataset = {
                label: 'COR (%)',
                data: yearlyData.map(d => d.cor),
                borderColor: '#FF3D3D',
                fill: false
            };
        }

        // If no tokens, hide
        const anyTokens = yearlyData.some(d => d.userTokens > 0);
        if (!anyTokens) {
            chartCanvas.style.display = 'none';
            financialProjections.innerHTML = '<p>Please select at least one CERT to view projections.</p>';
            return;
        } else {
            chartCanvas.style.display = 'block';
        }

        if (chartInstance) chartInstance.destroy();
        const ctx = chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [ dataset ]
            },
            options: {
                responsive: true,
                elements: {
                    line: { borderWidth: 3 },
                    point: { radius: 5, hoverRadius: 7, backgroundColor: '#00e5ff' },
                },
                scales: {
                    y: {
                        type: (activeGraphType === 'cor') ? 'logarithmic' : 'linear',
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                if (activeGraphType === 'cor') {
                                    return value + '%';
                                }
                                return value;
                            },
                            color: '#00ffff'
                        },
                        grid: { color: 'rgba(0,255,255,0.2)' }
                    },
                    x: {
                        grid: { color: 'rgba(0,255,255,0.2)' },
                        ticks: { color: '#00ffff' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#00ffff' } },
                    tooltip: {
                        backgroundColor: '#001f29',
                        titleColor: '#00e5ff',
                        bodyColor: '#00ffff',
                        borderColor: '#00e5ff',
                        borderWidth: 1,
                        callbacks: {
                            label: function(ctx) {
                                let lbl = ctx.dataset.label || '';
                                if (activeGraphType === 'cor') {
                                    return lbl + ': ' + ctx.parsed.y + '%';
                                } else {
                                    return lbl + ': ' + ctx.parsed.y.toFixed(2);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function buildProjectionTable(yearlyData) {
        // Just like your old generateProjectionTable() but we now have a single user dataset
        // because Weighted Stake lumps everything into one distribution
        financialProjections.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('projection-table');

        // We’ll do a simple 1-col approach for each year
        // You can adapt to show fish by fish, but Weighted Stake lumps them together
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Year</th>
                <th>User Tokens (Year)</th>
                <th>Cumulative Tokens</th>
                <th>Year Value (USD)</th>
                <th>Cumulative Value (USD)</th>
                <th>COR (%)</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        yearlyData.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Year ${d.year}</td>
                <td>${d.userTokens.toFixed(2)}</td>
                <td>${d.cumTokens.toFixed(2)}</td>
                <td>$${d.yearValue.toFixed(2)}</td>
                <td>$${d.cumValue.toFixed(2)}</td>
                <td>${d.cor.toFixed(2)}%</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        const tableDiv = document.createElement('div');
        tableDiv.classList.add('table-container');
        tableDiv.appendChild(table);

        financialProjections.appendChild(tableDiv);
    }

    /**************************************************************
     *   (Optional) If you want tooltip icons, here's a snippet:
     **************************************************************/
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.matches('.info-icon')) {
            const tip = e.target.getAttribute('data-tooltip');
            if (tip) {
                const tooltipEl = document.createElement('div');
                tooltipEl.classList.add('custom-tooltip');
                tooltipEl.textContent = tip;
                document.body.appendChild(tooltipEl);

                const rect = e.target.getBoundingClientRect();
                tooltipEl.style.left = `${rect.left + window.scrollX + 20}px`;
                tooltipEl.style.top = `${rect.top + window.scrollY}px`;

                e.target.addEventListener('mouseout', () => {
                    if (tooltipEl) tooltipEl.remove();
                }, { once: true });
            }
        }
    });

});