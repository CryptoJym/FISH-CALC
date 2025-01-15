/* scripts.js */

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------
    // 1. CERT DATA
    // -----------------------
    const certData = [
        {
            id: 'angel-fish',
            name: 'Angel-FISH',
            imageSrc: 'assets/icon--angel-fish-colors--teal-cyan-with-deep-blue-.png',
            altText: 'Angel-FISH Icon',
            totalCerts: 15000,
            // Renamed for clarity, but we’ll still store '25%' if you like
            harvestEfficiency: '25%', 
            priceStep: '$10/100',
            startingPriceDisplay: '$25',
            startingPrice: 25,
            phase2Multiplier: 2,
            minHarvestPerDayPerCert: 60.165,
            incrementAmount: 10,
            incrementInterval: 100,
            certColor: '#0AFFFF',
        },
        {
            id: 'cod-fish',
            name: 'Cod-FISH',
            imageSrc: 'assets/COD FISH CERT.png',
            altText: 'Cod-FISH Icon',
            totalCerts: 12500,
            harvestEfficiency: '50%',
            priceStep: '$25/100',
            startingPriceDisplay: '$250',
            startingPrice: 250,
            phase2Multiplier: 2,
            minHarvestPerDayPerCert: 120.33,
            incrementAmount: 25,
            incrementInterval: 100,
            certColor: '#FC54FF',
        },
        {
            id: 'tuna-fish',
            name: 'Tuna-FISH',
            imageSrc: 'assets/icon--tuna-colors--teal-cyan-with-deep-blue-highli.png',
            altText: 'Tuna-FISH Icon',
            totalCerts: 10000,
            harvestEfficiency: '75%',
            priceStep: '$50/100',
            startingPriceDisplay: '$500',
            startingPrice: 500,
            phase2Multiplier: 3,
            minHarvestPerDayPerCert: 180.495,
            incrementAmount: 50,
            incrementInterval: 100,
            certColor: '#FFE800',
        },
        {
            id: 'sword-fish',
            name: 'Sword-FISH',
            imageSrc: 'assets/SWORD FISH CERT.png',
            altText: 'Sword-FISH Icon',
            totalCerts: 7500,
            harvestEfficiency: '100%',
            priceStep: '$75/100',
            startingPriceDisplay: '$750',
            startingPrice: 750,
            phase2Multiplier: 4,
            minHarvestPerDayPerCert: 240.66,
            incrementAmount: 75,
            incrementInterval: 100,
            certColor: '#FF3D3D',
        },
        {
            id: 'king-fish',
            name: 'King-FISH',
            imageSrc: 'assets/icon--kingfish-colors--teal-cyan-with-deep-blue-hi.png',
            altText: 'King-FISH Icon',
            totalCerts: 5000,
            harvestEfficiency: '125%',
            priceStep: '$100/100',
            startingPriceDisplay: '$1,000',
            startingPrice: 1000,
            phase2Multiplier: 5,
            minHarvestPerDayPerCert: 300.825,
            incrementAmount: 100,
            incrementInterval: 100,
            certColor: '#39FF14',
        },
    ];

    // If you want a floating summary bar, ensure you have something like:
    // <div id="floating-summary" class="floating-summary">
    //   <p>Total CERTs: <span id="summary-certs">0</span></p>
    //   <p>Est. Daily Harvest: <span id="summary-daily">0</span></p>
    //   <p>Break-even: <span id="summary-bep">-- days</span></p>
    // </div>
    //
    // in your HTML. Then this script will update it automatically.

    // Grab references
    const collectionContainer = document.getElementById('cert-collection');
    const globalLicenseCounter = document.querySelector('#global-counter .counter-value');
    const userCollectionDiv = document.getElementById('user-collection');
    const tokenPriceContainer = document.getElementById('token-price-container');
    const financialProjectionsContainer = document.getElementById('financial-projections-container');
    const graphContainer = document.getElementById('graph-container');

    const purchaseButton = document.getElementById('purchase-button');
    const financialProjections = document.getElementById('financial-projections');

    // We'll track if the user created a collection
    let collectionCreated = false;
    let totalLicensesOwned = 0; // total across all fish

    // Phase2 default
    let phase2StartYear = 5; 

    // -----------------------
    // 2. CREATE THE CARDS
    // -----------------------
    function createCertCards() {
        certData.forEach(cert => {
            const card = document.createElement('div');
            card.classList.add('cert-card');
            card.id = cert.id;

            // Create a tooltip icon next to daily harvest rate (formerly harvestEfficiency)
            // We’ll also rename “Harvest Efficiency” to “Daily Harvest Rate” for clarity
            // Also adding a '?' icon next to Price Step example
            card.innerHTML = `
                <div class="cert-inner">
                    <!-- FRONT -->
                    <div class="cert-front">
                        <div class="cert-image-box">
                            <div class="cert-image">
                                <img src="${cert.imageSrc}" alt="${cert.altText}" 
                                     width="200" height="200" loading="lazy">
                            </div>
                        </div>
                        <div class="cert-text-box">
                            <h2>${cert.name}</h2>
                            <div class="cert-details">
                                <p><span class="label">Total CERTs:</span>
                                   <span class="value">${cert.totalCerts.toLocaleString()}</span>
                                </p>
                                <p>
                                  <span class="label">
                                    Daily Harvest Rate
                                    <span class="info-icon" data-tooltip="Your daily harvest % of fish tokens. Higher means more tokens per day.">?</span>
                                  </span>
                                  <span class="value">${cert.harvestEfficiency}</span>
                                </p>
                                <p>
                                  <span class="label">
                                    Price Step
                                    <span class="info-icon" data-tooltip="Price increases by ${cert.priceStep} each time 100 units are sold.">?</span>
                                  </span>
                                  <span class="value">${cert.priceStep}</span>
                                </p>
                                <p><span class="label">Starting Price:</span>
                                   <span class="value">${cert.startingPriceDisplay}</span>
                                </p>
                            </div>
                        </div>
                        <button class="purchase-button" 
                                aria-label="View ${cert.name} details" 
                                role="button">
                          VIEW DETAILS
                        </button>
                    </div>

                    <!-- BACK -->
                    <div class="cert-back">
                        <div class="cert-text-box">
                            <h2>${cert.name} Details</h2>
                            <div class="cert-details">
                                <p><span class="label">Available CERTs:</span>
                                   <span class="value cert-remaining">${cert.totalCerts.toLocaleString()}</span>
                                </p>
                                <p><span class="label">Phase 2 Multiplier:</span>
                                   <span class="value">${cert.phase2Multiplier}x</span>
                                </p>
                                <p><span class="label">Min Harvest/Day:</span>
                                   <span class="value min-harvest-value">${cert.minHarvestPerDayPerCert.toFixed(2)}</span>
                                </p>
                                <p><span class="label">Total Cost:</span>
                                   <span class="value total-cost-value">$0</span>
                                </p>
                            </div>
                        </div>

                        <!-- ROI area: daily USD & break-even -->
                        <div class="roi-estimate" style="margin-top:10px; font-size:0.9em; color:#00ffff;">
                            <!-- We dynamically fill these in updateCounters / updateCardROI -->
                            <p><strong>Est. Daily Income:</strong> <span class="daily-income">$0</span></p>
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

    // Grab references to all newly created cards
    const certCards = document.querySelectorAll('.cert-card');

    // If you want tooltip functionality for '.info-icon', here’s a quick approach:
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

    // ----------------------------------------------------------
    // 3. HELPER: Calculate incremental total cost
    // ----------------------------------------------------------
    function calculateTotalCost(quantity, startingPrice, incrementAmount, incrementInterval) {
        let totalCost = 0;
        let remainingQuantity = quantity;
        let currentPrice = startingPrice;
        let totalSold = 0;

        while (remainingQuantity > 0) {
            const nextIncrementAt = incrementInterval - (totalSold % incrementInterval);
            const quantityAtCurrentPrice = Math.min(remainingQuantity, nextIncrementAt);

            totalCost += quantityAtCurrentPrice * currentPrice;
            remainingQuantity -= quantityAtCurrentPrice;
            totalSold += quantityAtCurrentPrice;

            if (remainingQuantity > 0) {
                currentPrice += incrementAmount;
            }
        }
        return totalCost;
    }

    // ----------------------------------------------------------
    // 4. CARD INTERACTIVITY: Flip, plus/minus, update counters
    // ----------------------------------------------------------
    const cardTotalLicenses = {};
    certData.forEach(cert => {
        cardTotalLicenses[cert.id] = cert.totalCerts;
    });

    // We’ll track a “selectedTokenPrice” for daily income calculations
    // This is updated by radio buttons in your UI.
    let selectedTokenPrice = parseFloat(document.querySelector('input[name="token-price"]:checked')?.value || '0.025');

    certCards.forEach(card => {
        const viewButton = card.querySelector('.purchase-button');
        const inputField = card.querySelector('.cert-counter input');
        const minusButton = card.querySelector('.minus-button');
        const plusButton = card.querySelector('.plus-button');
        const cardId = card.id;
        const totalCertsDisplay = card.querySelector('.cert-front .cert-details p:first-child .value');
        const initialTotal = cardTotalLicenses[cardId];

        // Flip to backside
        viewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('flipped');
        });

        // Flip back if user clicks away from the counter area
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

        // Master function to handle quantity changes
        function updateCounters(change) {
            const currentValue = parseInt(inputField.value) || 0;
            let newValue = currentValue + change;
            newValue = Math.max(0, Math.min(newValue, initialTotal));
            inputField.value = newValue;

            // Recalculate total licenses owned (sum across all cards)
            totalLicensesOwned = Array.from(certCards).reduce((sum, cCard) => {
                const cInput = cCard.querySelector('.cert-counter input');
                return sum + (parseInt(cInput ? cInput.value : 0) || 0);
            }, 0);

            // Update global counter
            if (globalLicenseCounter) {
                globalLicenseCounter.textContent = totalLicensesOwned.toLocaleString();
            }

            // Update available certs display (front + back)
            const remainingCerts = initialTotal - newValue;
            totalCertsDisplay.textContent = remainingCerts.toLocaleString();
            const backCertsDisplay = card.querySelector('.cert-back .cert-remaining');
            if (backCertsDisplay) {
                backCertsDisplay.textContent = remainingCerts.toLocaleString();
            }

            // Update total cost on backside
            const certDataItem = certData.find(cd => cd.id === cardId);
            const totalCost = calculateTotalCost(newValue, certDataItem.startingPrice, certDataItem.incrementAmount, certDataItem.incrementInterval);
            const totalCostDisplay = card.querySelector('.cert-back .total-cost-value');
            if (totalCostDisplay) {
                totalCostDisplay.textContent = '$' + totalCost.toLocaleString();
            }

            // Update min harvest/day (just as you had, but we can factor in newValue=0 => no harvest)
            const minHarvestDisplay = card.querySelector('.cert-back .min-harvest-value');
            const dailyIncomeDisplay = card.querySelector('.roi-estimate .daily-income');
            const breakEvenDisplay = card.querySelector('.roi-estimate .break-even');

            if (certDataItem && minHarvestDisplay && dailyIncomeDisplay && breakEvenDisplay) {
                const dailyHarvestPerCert = certDataItem.minHarvestPerDayPerCert;
                // If newValue > 0, total daily harvest is dailyHarvestPerCert * newValue
                const totalDailyHarvest = dailyHarvestPerCert * newValue;
                minHarvestDisplay.textContent = totalDailyHarvest.toFixed(2);

                // Now let’s guess daily income in USD terms
                const dailyUSD = totalDailyHarvest * selectedTokenPrice;
                dailyIncomeDisplay.textContent = `$${dailyUSD.toFixed(2)}`;

                // Approx break-even = totalCost / dailyUSD
                let breakEvenDays = '--';
                if (dailyUSD > 0) {
                    breakEvenDays = (totalCost / dailyUSD).toFixed(1) + ' days';
                }
                breakEvenDisplay.textContent = breakEvenDays;
            }

            // Update floating summary bar
            updateSummaryBar();

            // If user has already created collection, we re-run updateCalculations
            if (collectionCreated) {
                updateCalculations();
            }
        }

        if (plusButton) {
            plusButton.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCounters(1);
            });
        }
        if (minusButton) {
            minusButton.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCounters(-1);
            });
        }
        if (inputField) {
            inputField.addEventListener('change', (e) => {
                e.stopPropagation();
                let val = parseInt(e.target.value) || 0;
                val = Math.max(0, Math.min(val, initialTotal));
                inputField.value = val;
                updateCounters(0);
            });
        }
    });

    // ----------------------------------------------------------
    // 5. FLOATING SUMMARY BAR (Optional)
    // ----------------------------------------------------------
    function updateSummaryBar() {
        const summaryCerts = document.getElementById('summary-certs');
        const summaryDaily = document.getElementById('summary-daily');
        const summaryBEP = document.getElementById('summary-bep');
        if (!summaryCerts || !summaryDaily || !summaryBEP) return; // If user hasn’t added these to HTML

        // Recompute total cost & total daily harvest across all cards
        let totalCostAll = 0;
        let totalDailyHarvestAll = 0;

        certCards.forEach(card => {
            const cardId = card.id;
            const quantity = parseInt(card.querySelector('.cert-counter input').value) || 0;
            if (quantity > 0) {
                const cData = certData.find(cd => cd.id === cardId);
                const cCost = calculateTotalCost(quantity, cData.startingPrice, cData.incrementAmount, cData.incrementInterval);
                totalCostAll += cCost;
                totalDailyHarvestAll += cData.minHarvestPerDayPerCert * quantity;
            }
        });

        summaryCerts.textContent = totalLicensesOwned.toString();

        // If we’re using selectedTokenPrice to convert daily harvest into daily USD
        const dailyUSD = totalDailyHarvestAll * selectedTokenPrice;
        summaryDaily.textContent = `$${dailyUSD.toFixed(2)}`;

        // Break-even
        let beDays = '--';
        if (dailyUSD > 0) {
            beDays = (totalCostAll / dailyUSD).toFixed(1) + ' days';
        }
        summaryBEP.textContent = beDays;
    }

    // ----------------------------------------------------------
    // 6. PHASE 2, PURCHASE BUTTONS, CHART, CALCULATIONS
    // ----------------------------------------------------------
    const phase2Buttons = document.querySelectorAll('.phase2-button');
    phase2Buttons.forEach(button => {
        button.addEventListener('click', () => {
            phase2Buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            phase2StartYear = parseInt(button.getAttribute('data-year'));
            updateCalculations();
        });
    });

    // The “Create Collection” or “Purchase” button
    purchaseButton.addEventListener('click', () => {
        collectionCreated = true; 
        updateUserCollection();
        // Show relevant sections
        if (userCollectionDiv) userCollectionDiv.style.display = 'block';
        if (tokenPriceContainer) tokenPriceContainer.style.display = 'block';
        if (financialProjectionsContainer) financialProjectionsContainer.style.display = 'block';
        if (graphContainer) graphContainer.style.display = 'block';

        updateCalculations();
    });

    function recalcAllCards() {
        certCards.forEach(card => {
            const inputField = card.querySelector('.cert-counter input');
            const quantity = parseInt(inputField.value) || 0;
            
            const cardId = card.id;
            const dataItem = certData.find(d => d.id === cardId);
            const totalCost = calculateTotalCost(quantity, dataItem.startingPrice, dataItem.incrementAmount, dataItem.incrementInterval);

            const dailyHarvestPerCert = dataItem.minHarvestPerDayPerCert;
            const totalDailyHarvest = dailyHarvestPerCert * quantity;

            const dailyIncomeEl = card.querySelector('.roi-estimate .daily-income');
            const breakEvenEl = card.querySelector('.roi-estimate .break-even');
            if (dailyIncomeEl && breakEvenEl) {
                const dailyUSD = totalDailyHarvest * selectedTokenPrice;
                dailyIncomeEl.textContent = `$${dailyUSD.toFixed(2)}`;

                let breakEvenDays = '--';
                if (dailyUSD > 0) {
                    breakEvenDays = (totalCost / dailyUSD).toFixed(1) + ' days';
                }
                breakEvenEl.textContent = breakEvenDays;
            }
        });
    }

    // Monitor token price radio buttons
    const tokenPriceOptions = document.getElementsByName('token-price');
    tokenPriceOptions.forEach(option => {
        option.addEventListener('change', () => {
            selectedTokenPrice = parseFloat(option.value);
            recalcAllCards();
            updateSummaryBar();
            if (collectionCreated) {
                updateCalculations();
            }
        });
    });

    // Graph toggle logic (existing)
    const graphToggleButtons = document.querySelectorAll('.graph-toggle-button');
    graphToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            graphToggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateCalculations();
        });
    });

    // Now let’s keep your existing chart logic
    let chartInstance;

    function updateCalculations() {
        if (!collectionCreated) return; // only run if user has created a collection

        const graphType = document.querySelector('.graph-toggle-button.active')?.dataset.type || 'cor';

        // Build the user selections
        const usersSelections = {};
        const totalInvestments = {};
        certCards.forEach(card => {
            const cardId = card.id;
            const quantity = parseInt(card.querySelector('.cert-counter input').value) || 0;
            usersSelections[cardId] = quantity;
            if (quantity > 0) {
                const cDataItem = certData.find(cd => cd.id === cardId);
                const tCost = calculateTotalCost(quantity, cDataItem.startingPrice, cDataItem.incrementAmount, cDataItem.incrementInterval);
                totalInvestments[cardId] = tCost;
            }
        });

        const labels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);
        const datasets = [];
        const projectionData = {};

        for (const certId in usersSelections) {
            const qty = usersSelections[certId];
            if (qty > 0) {
                const cDataItem = certData.find(c => c.id === certId);
                const dailyRate = cDataItem.minHarvestPerDayPerCert * qty;
                const yearlyRates = calculateMiningRates(dailyRate, phase2StartYear, cDataItem.phase2Multiplier);

                // cost
                const cost = totalInvestments[certId];
                const dailyValue = dailyRate * selectedTokenPrice;
                const monthlyValue = dailyValue * 30;
                const yearlyValue = dailyValue * 365;

                // cumulative earnings
                let cumEarnings = 0;
                const cumEarningsY = {};
                for (let year = 1; year <= 10; year++) {
                    const rate = yearlyRates[year - 1];
                    const yEarnings = rate * 365 * selectedTokenPrice;
                    cumEarnings += yEarnings;
                    if ([1, 3, 5, 10].includes(year)) {
                        cumEarningsY[year] = cumEarnings;
                    }
                }

                const corY1 = (cumEarningsY[1] / cost) * 100 || 0;
                const corY3 = (cumEarningsY[3] / cost) * 100 || 0;
                const corY5 = (cumEarningsY[5] / cost) * 100 || 0;
                const corY10 = (cumEarningsY[10] / cost) * 100 || 0;

                projectionData[cDataItem.name] = {
                    dailyValue: dailyValue,
                    monthlyValue: monthlyValue,
                    yearlyValue: yearlyValue,
                    corY1, corY3, corY5, corY10,
                    investment: cost,
                };

                // Build dataset
                datasets.push({
                    label: cDataItem.name,
                    data: (graphType === 'cor') 
                        ? calculateCOR(cost, yearlyRates, selectedTokenPrice) 
                        : yearlyRates,
                    borderColor: cDataItem.certColor,
                    fill: false,
                    stepped: true,
                });
            }
        }

        // If no datasets, hide the chart
        if (datasets.length === 0) {
            document.getElementById('chartCanvas').style.display = 'none';
            financialProjections.innerHTML = '<p>Please select at least one CERT to view projections.</p>';
            return;
        } else {
            document.getElementById('chartCanvas').style.display = 'block';
        }

        generateProjectionTable(projectionData);

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('chartCanvas').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                layout: { padding: { left: 20 } },
                elements: {
                    line: { borderWidth: 3, tension: 0.4 },
                    point: { radius: 5, hoverRadius: 7, backgroundColor: '#00e5ff' },
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0, 255, 255, 0.2)' },
                        ticks: {
                            color: '#00ffff',
                            font: { family: 'Orbitron', size: 14 },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 255, 255, 0.2)' },
                        ticks: {
                            color: '#00ffff',
                            font: { family: 'Orbitron', size: 14 },
                            padding: 10
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#00ffff',
                            font: { family: 'Orbitron', size: 14, weight: 'bold' },
                            padding: 25,
                        },
                    },
                    tooltip: {
                        backgroundColor: '#001f29',
                        titleColor: '#00e5ff',
                        titleFont: { family: 'Orbitron', size: 16, weight: 'bold' },
                        bodyColor: '#00ffff',
                        bodyFont: { family: 'Orbitron', size: 14 },
                        borderColor: '#00e5ff',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (graphType === 'cor') {
                                    label += ': ' + context.parsed.y + '%';
                                } else {
                                    label += ': ' + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    },
                },
            },
        });
    }

    function calculateMiningRates(initialRate, phase2Start, multiplier) {
        const rates = [];
        for (let year = 1; year <= 10; year++) {
            let rate = initialRate * Math.pow(0.5, year - 1);
            if (year >= phase2Start) {
                rate *= multiplier;
            }
            rates.push(Number(rate.toFixed(2)));
        }
        return rates;
    }

    function calculateCOR(investment, yearlyRates, tokenPrice) {
        const corRates = [];
        let cumEarnings = 0;
        for (let year = 1; year <= yearlyRates.length; year++) {
            const dailyRate = yearlyRates[year - 1];
            const yEarnings = dailyRate * 365 * tokenPrice;
            cumEarnings += yEarnings;
            const cor = (cumEarnings / investment) * 100;
            corRates.push(Number(cor.toFixed(2)));
        }
        return corRates;
    }

    function generateProjectionTable(projectionData) {
        financialProjections.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('projection-table');

        // Create thead and tbody
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Header row
        const headerRow = document.createElement('tr');
        const firstHeaderCell = document.createElement('th');
        firstHeaderCell.textContent = '';
        headerRow.appendChild(firstHeaderCell);

        for (const certName in projectionData) {
            const th = document.createElement('th');
            th.textContent = certName;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Define tooltips for each row
        const tooltips = {
            investment: 'Total cost of CERTs purchased',
            dailyValue: 'Estimated daily earnings based on current token price',
            monthlyValue: 'Estimated monthly earnings (daily × 30)',
            yearlyValue: 'Estimated yearly earnings (daily × 365)',
            corY1: 'Cumulative % Return after Year 1',
            corY3: 'Cumulative % Return after Year 3',
            corY5: 'Cumulative % Return after Year 5',
            corY10: 'Cumulative % Return after Year 10'
        };

        // Rows
        const rows = [
            { label: 'CERTs Purchased', key: 'investment', format: (v) => `$${v.toLocaleString()}` },
            { label: 'Daily Value', key: 'dailyValue', format: (v) => `$${v.toFixed(2)}` },
            { label: 'Monthly Value', key: 'monthlyValue', format: (v) => `$${v.toFixed(2)}` },
            { label: 'Yearly Value', key: 'yearlyValue', format: (v) => `$${v.toFixed(2)}` },
            { label: 'COR Y1', key: 'corY1', format: (v) => `${v.toFixed(2)}%` },
            { label: 'COR Y3', key: 'corY3', format: (v) => `${v.toFixed(2)}%` },
            { label: 'COR Y5', key: 'corY5', format: (v) => `${v.toFixed(2)}%` },
            { label: 'COR Y10', key: 'corY10', format: (v) => `${v.toFixed(2)}%` },
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            const labelCell = document.createElement('td');
            
            // Add label with tooltip
            const labelSpan = document.createElement('span');
            labelSpan.textContent = row.label;
            labelCell.appendChild(labelSpan);
            
            if (tooltips[row.key]) {
                const infoIcon = document.createElement('span');
                infoIcon.className = 'info-icon';
                infoIcon.textContent = '?';
                infoIcon.setAttribute('data-tooltip', tooltips[row.key]);
                labelCell.appendChild(infoIcon);
            }
            
            tr.appendChild(labelCell);

            // Find max and min values for this row
            const values = Object.values(projectionData).map(data => data[row.key]);
            const maxVal = Math.max(...values);
            const minVal = Math.min(...values);

            // Add data cells
            for (const certName in projectionData) {
                const td = document.createElement('td');
                const val = projectionData[certName][row.key];
                td.textContent = row.format(val);
                
                // Highlight max/min values
                if (val === maxVal && values.length > 1) {
                    td.classList.add('highlight-max');
                } else if (val === minVal && values.length > 1) {
                    td.classList.add('highlight-min');
                }
                
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        tableContainer.appendChild(table);

        financialProjections.appendChild(tableContainer);
    }

    // ----------------------------------------------------------
    // 7. USER COLLECTION
    // ----------------------------------------------------------
    function updateUserCollection() {
        let collectionHTML = '<h2>Your Collection</h2><div class="user-collection-container">';

        certCards.forEach(card => {
            const quantity = parseInt(card.querySelector('.cert-counter input').value) || 0;
            if (quantity > 0) {
                const certName = card.querySelector('.cert-front h2').textContent;
                const certImage = card.querySelector('.cert-image img').outerHTML;
                collectionHTML += `
                  <div class="user-cert-card">
                    ${certImage}
                    <h3>${certName}</h3>
                    <p>Quantity: ${quantity}</p>
                  </div>
                `;
            }
        });

        collectionHTML += '</div>';
        userCollectionDiv.innerHTML = collectionHTML;
        userCollectionDiv.style.display = 'block';
        userCollectionDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
