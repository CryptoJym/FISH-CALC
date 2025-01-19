document.addEventListener('DOMContentLoaded', () => {
    /**************************************************************
     * 1. CERT DATA + GLOBAL SETTINGS
     **************************************************************/
    const certData = [
        {
            id: 'angel-fish',
            name: 'Angel-FISH',
            imageSrc: 'assets/Angel-FISH-NBG-sml.png',
            altText: 'Angel-FISH Icon',
            totalCerts: 15000,
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
            imageSrc: 'assets/Cod-FISH-NBG-sml.png',
            altText: 'Cod-FISH Icon',
            totalCerts: 12500,
            weightingFactor: 0.50,
            phase2Multiplier: 2,
            certColor: '#FC54FF',
            startingPriceDisplay: '$250',
            incrementAmount: 25,
            incrementInterval: 100,
        },
        {
            id: 'tuna-fish',
            name: 'Tuna-FISH',
            imageSrc: 'assets/Tuna-FISH-NBG-sml.png',
            altText: 'Tuna-FISH Icon',
            totalCerts: 10000,
            weightingFactor: 0.75,
            phase2Multiplier: 3,
            certColor: '#FFE800',
            startingPriceDisplay: '$500',
            incrementAmount: 50,
            incrementInterval: 100,
        },
        {
            id: 'sword-fish',
            name: 'Sword-FISH',
            imageSrc: 'assets/Sword-FISH-NBG-sml.png',
            altText: 'Sword-FISH Icon',
            totalCerts: 7500,
            weightingFactor: 1.00,
            phase2Multiplier: 4,
            certColor: '#FF3D3D',
            startingPriceDisplay: '$750',
            incrementAmount: 75,
            incrementInterval: 100,
        },
        {
            id: 'king-fish',
            name: 'King-FISH',
            imageSrc: 'assets/King-FISH-NBG-sml.png',
            altText: 'King-FISH Icon',
            totalCerts: 5000,
            weightingFactor: 1.25,
            phase2Multiplier: 5,
            certColor: '#39FF14',
            startingPriceDisplay: '$1000',
            incrementAmount: 100,
            incrementInterval: 100,
        },
    ];

    // The total token pool for distributing over 10 years
    const totalStakerPool = 5.49e9;  // e.g., 5.49B tokens (half each year, etc.)

    // Phase 2 default (the year at which multiplication occurs)
    let phase2StartYear = 5;

    // Whether user has “Created Collection”
    let collectionCreated = false;

    // Currently selected token price from the radio set (defaults to 0.025 if none is checked)
    let selectedTokenPrice = parseFloat(
        document.querySelector('input[name="token-price"]:checked')?.value || '0.025'
    );

    // Tracking how many are minted globally (in #, not %).
    // The range sliders let the user adjust minted % => these get converted to these numbers.
    let globalMinted = {
        'angel-fish': 750,    // 5% of 15000
        'cod-fish': 625,      // 5% of 12500
        'tuna-fish': 500,     // 5% of 10000
        'sword-fish': 375,    // 5% of 7500
        'king-fish': 250      // 5% of 5000
    };

    // DOM references
    const collectionContainer = document.getElementById('cert-collection');
    const purchaseButton = document.getElementById('purchase-button');
    const globalLicenseCounter = document.querySelector('#global-counter .counter-value');
    const userCollectionDiv = document.getElementById('user-collection');
    const tokenPriceContainer = document.getElementById('token-price-container');
    const financialProjectionsContainer = document.getElementById('financial-projections-container');
    const graphContainer = document.getElementById('graph-container');
    const financialProjections = document.getElementById('financial-projections');

    /**************************************************************
     * 2. BUILD CARDS: FRONT + BACK
     **************************************************************/
    function createCertCards() {
        certData.forEach(cert => {
            const card = document.createElement('div');
            card.classList.add('cert-card');
            card.id = cert.id;

            // Microcopy for sustainable mention, a quick note on real-world synergy
            const sustainabilityNote = `
                <p class="note" style="font-size:0.8em;">
                  <em>By owning ${cert.name} CERTs, 
                  you support sustainable aquaculture & local jobs 
                  in fish commodity projects.</em>
                </p>
            `;

            card.innerHTML = `
                <div class="cert-inner">
                    <!-- FRONT: Quick overview -->
                    <div class="cert-front">
                        <div class="cert-image-box">
                            <div class="cert-image">
                                <img src="${cert.imageSrc}" alt="${cert.altText}" width="200" height="200" loading="lazy">
                            </div>
                        </div>
                        <div class="cert-text-box">
                            <h2>${cert.name}</h2>
                            <div class="cert-details">
                                <p>
                                  <span class="label">Max CERTs:</span>
                                  <span class="value">${cert.totalCerts.toLocaleString()}</span>
                                </p>
                                <p>
                                  <span class="label">Weight Factor
                                    <span class="info-icon" data-tooltip="This factor influences your share of daily tokens. A higher factor means more tokens per day.">i</span>
                                  </span>
                                  <span class="value">${cert.weightingFactor.toFixed(2)}</span>
                                </p>
                                <p>
                                  <span class="label">Phase2 x
                                    <span class="info-icon" data-tooltip="Once Phase 2 triggers, each CERT multiplies by this factor, drastically increasing your daily harvest.">i</span>
                                  </span>
                                  <span class="value">${cert.phase2Multiplier}</span>
                                </p>
                                ${sustainabilityNote}
                            </div>
                        </div>
                        <button class="purchase-button" role="button">
                            VIEW DETAILS
                        </button>
                    </div>

                    <!-- BACK: Detailed stats & user adjustments -->
                    <div class="cert-back">
                        <div class="cert-text-box">
                            <h2>${cert.name} Details</h2>
                            <div class="cert-details">
                                <p>
                                  <span class="label">Global Sold:</span>
                                  <span class="value global-sold">
                                     0 / ${cert.totalCerts.toLocaleString()}
                                  </span>
                                </p>
                                <p>
                                  <span class="label">Your CERTs:</span>
                                  <span class="value user-qty">0</span>
                                </p>
                                <p>
                                  <span class="label">Your Investment:</span>
                                  <span class="value total-cost-value">$0</span>
                                </p>
                            </div>
                        </div>

                        <div class="cert-text-box">
                            <h2>Harvest Metrics</h2>
                            <div class="cert-details">
                                <p>
                                    <span class="label">Daily Rate:</span>
                                    <span class="value current-harvest">-- tokens/day</span>
                                </p>
                                <p>
                                    <span class="label">Year 1:</span>
                                    <span class="value year1-tokens">--</span>
                                </p>
                                <p>
                                    <span class="label">Break-even:</span>
                                    <span class="value break-even">-- days</span>
                                </p>
                            </div>
                        </div>

                        <!-- +/- buttons + input for user cert quantity -->
                        <div class="cert-counter">
                            <button class="counter-button minus-button" aria-label="Decrease quantity">-</button>
                            <input type="number" value="0" min="0" aria-label="Quantity">
                            <button class="counter-button plus-button" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                </div>
            `;
            collectionContainer.appendChild(card);
        });
    }

    createCertCards();
    const certCards = document.querySelectorAll('.cert-card');

    // Initialize "Global Sold" text for each card
    function initGlobalSoldDisplay() {
        certData.forEach(cert => {
            const card = document.getElementById(cert.id);
            if (!card) return;
            const globalSoldEl = card.querySelector('.global-sold');
            if (globalSoldEl) {
                const mintedNum = globalMinted[cert.id] || 0;
                globalSoldEl.textContent = `${mintedNum.toLocaleString()} / ${cert.totalCerts.toLocaleString()}`;
            }
        });
    }
    initGlobalSoldDisplay();

    /**************************************************************
     * 3. GLOBAL MINTED SLIDERS => Adjust minted% => stored in globalMinted
     **************************************************************/
    const mintedSliders = document.querySelectorAll('.slider-group input[type="range"]');
    mintedSliders.forEach(slider => {
        slider.addEventListener('input', e => {
            const val = parseInt(e.target.value);
            const fishId = slider.id.replace('-global-range','');
            const labelSpan = document.getElementById(`${fishId}-val`);
            if (labelSpan) labelSpan.textContent = val + '%';

            const cDef = certData.find(cd => cd.id===fishId);
            if (!cDef) return;

            // Convert slider % => minted count
            const mintedCount = Math.floor((val/100)* cDef.totalCerts);
            globalMinted[fishId] = mintedCount;

            // Update the card's "Global Sold" text and current price
            const card = document.getElementById(fishId);
            if (card) {
                const globalSoldEl = card.querySelector('.global-sold');
                if (globalSoldEl) {
                    const currentPrice = getCurrentPriceForCert(cDef, mintedCount);
                    globalSoldEl.textContent = `${mintedCount.toLocaleString()} / ${cDef.totalCerts.toLocaleString()} (Current Price: $${currentPrice})`;
                }
            }

            // Recompute cost & daily harvest
            recalcAllCards();
            if (collectionCreated) updateCalculations();
        });
    });

    /**************************************************************
     * 4. PRICE & COST CALCULATIONS
     **************************************************************/
    function getBasePriceForCert(cert) {
        return parseFloat(cert.startingPriceDisplay.replace(/[^0-9.]/g, ''));
    }

    function getCurrentPriceForCert(cert, globalCount) {
        const incrementsSoFar = Math.floor(globalCount / cert.incrementInterval);
        const base = getBasePriceForCert(cert);
        return base + (incrementsSoFar * cert.incrementAmount);
    }

    function calculateCostForQuantity(cert, quantity, globalCount) {
        let totalCost = 0;
        let remain = quantity;
        let minted = globalCount; 
        while (remain > 0) {
            const nextStep = cert.incrementInterval - (minted % cert.incrementInterval);
            const buyNow = Math.min(remain, nextStep);
            const currentPrice = getCurrentPriceForCert(cert, minted);
            totalCost += (buyNow * currentPrice);

            remain -= buyNow;
            minted += buyNow;
        }
        return totalCost;
    }

    function getGlobalMintedCount(fishId) {
        return globalMinted[fishId] || 0;
    }

    function getUserCost(cert, userQty) {
        const mintedCount = getGlobalMintedCount(cert.id);
        return calculateCostForQuantity(cert, userQty, mintedCount);
    }

    /**************************************************************
     * 5. WEIGHTED STAKE & HARVEST LOGIC
     **************************************************************/
    function computeYearlyPools() {
        const arr = [];
        let half = totalStakerPool / 2;
        for (let y = 1; y <= 10; y++) {
            if (y === 1) arr[y] = half;
            else {
                half = half / 2;
                arr[y] = half;
            }
        }
        return arr;
    }

    function getWeightedStake(year) {
        let userW = 0, globalW = 0;
        certData.forEach(cd => {
            const mintedGlobal = getGlobalMintedCount(cd.id);
            let finalGlobalQty = mintedGlobal;

            // user minted
            const card = document.getElementById(cd.id);
            const userQty = parseInt(card.querySelector('.cert-counter input').value) || 0;
            let finalUserQty = userQty;

            // If year >= phase2 => multiply
            if (year >= phase2StartYear) {
                finalGlobalQty *= cd.phase2Multiplier;
                finalUserQty *= cd.phase2Multiplier;
            }

            userW   += (finalUserQty * cd.weightingFactor);
            globalW += (finalGlobalQty * cd.weightingFactor);
        });
        return { userW, globalW };
    }

    // Our main function to compute user’s yearly distribution
    function computeYearlyRewards() {
        const yearPool = computeYearlyPools();
        const userTotalCost = getUserTotalCostAll();

        let cumTokens = 0;
        const results = [];
        for (let y = 1; y <= 10; y++) {
            const { userW, globalW } = getWeightedStake(y);

            let userShareY = 0;
            if (globalW > 0) {
                userShareY = (userW / globalW) * yearPool[y];
            }
            cumTokens += userShareY;

            const yearValue = userShareY * selectedTokenPrice;
            const cumValue  = cumTokens * selectedTokenPrice;
            const cor = userTotalCost > 0 
                        ? (cumValue / userTotalCost) * 100 
                        : 0;

            results.push({
                year: y,
                userTokens: userShareY,
                dailyTokens: userShareY / 365,
                cumTokens,
                yearValue,
                cumValue,
                cor
            });
        }
        return results;
    }

    // For daily calculations, we treat it as if we’re in “Year 1”
    // or year = 1 until phase2 triggers.
    function calcDailyRateForCert(cert) {
        const year = 1; // simple approach
        const arr  = computeYearlyPools();
        const cycleTokens = arr[year]; 
        if(!cycleTokens) return 0;

        const dailyPool = cycleTokens / 365;

        // Weighted stake for year=1
        let globalW = 0;
        certData.forEach(cd => {
            let mintedCount = getGlobalMintedCount(cd.id);
            if(year >= phase2StartYear) mintedCount *= cd.phase2Multiplier;
            globalW += (mintedCount * cd.weightingFactor);
        });

        // user minted
        const card   = document.getElementById(cert.id);
        const userQ  = parseInt(card.querySelector('.cert-counter input').value) || 0;
        let finalQ   = userQ;
        if(year >= phase2StartYear) finalQ *= cert.phase2Multiplier;

        const userW  = finalQ * cert.weightingFactor;
        if(globalW <= 0) return 0;

        return (userW / globalW) * dailyPool;
    }

    /**************************************************************
     * 6. CARD INTERACTIVITY
     **************************************************************/
    certCards.forEach(card => {
        const fishId = card.id;
        const plusBtn  = card.querySelector('.plus-button');
        const minusBtn = card.querySelector('.minus-button');
        const qtyInput = card.querySelector('.cert-counter input');
        const viewBtn  = card.querySelector('.purchase-button');

        // Flip card on "VIEW DETAILS"
        viewBtn.addEventListener('click', e => {
            e.stopPropagation();
            card.classList.add('flipped');
        });
        // Flip back if user clicks outside the counter area
        card.addEventListener('click', e => {
            if(card.classList.contains('flipped')) {
                const insideROI  = e.target.closest('.roi-estimate');
                const insideCount= e.target.closest('.cert-counter');
                if(!insideROI && !insideCount) {
                    card.classList.remove('flipped');
                }
            }
        });

        function setQty(newVal) {
            const cDef = certData.find(x => x.id === fishId);
            if (!cDef) return;

            const safeVal = Math.max(0, Math.min(newVal, cDef.totalCerts));
            qtyInput.value = safeVal;

            // Update user-qty label
            const userQtyEl = card.querySelector('.user-qty');
            if(userQtyEl) userQtyEl.textContent = safeVal;

            // Calculate cost
            const cost = getUserCost(cDef, safeVal);
            const costEl = card.querySelector('.total-cost-value');
            if(costEl) costEl.textContent = '$'+ cost.toLocaleString();

            // Calculate daily rate
            const dailyRate = calcDailyRateForCert(cDef);
            const harvestEl = card.querySelector('.current-harvest');
            if(harvestEl) harvestEl.textContent = dailyRate.toFixed(2)+' tokens/day';

            // Calculate year1 tokens
            const y1El = card.querySelector('.year1-tokens');
            if(y1El) y1El.textContent = (dailyRate*365).toFixed(2)+' tokens';

            // Calculate break-even
            const dailyUSD = dailyRate * selectedTokenPrice;
            const beEl = card.querySelector('.break-even');
            if(beEl) {
                let beDays = '--';
                if(dailyUSD > 0) {
                    beDays = Math.ceil(cost / dailyUSD) + ' days';
                }
                beEl.textContent = beDays;
            }

            // Update totals
            updateGlobalLicenseCount();
            if(collectionCreated) updateCalculations();
        }

        function updateQty(delta) {
            const currentVal = parseInt(qtyInput.value) || 0;
            setQty(currentVal + delta);
        }

        plusBtn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            updateQty(1);
        });

        minusBtn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            updateQty(-1);
        });

        qtyInput.addEventListener('input', e => {
            e.stopPropagation();
            const val = parseInt(e.target.value) || 0;
            setQty(val);
        });
    });

    function updateGlobalLicenseCount() {
        let sum = 0;
        let totalDailyRewards = 0;
        let longestBreakEven = 0;

        certCards.forEach(card => {
            const q = parseInt(card.querySelector('.cert-counter input').value) || 0;
            sum += q;

            // Get daily rate for rewards calculation
            const dailyRateEl = card.querySelector('.current-harvest');
            if (dailyRateEl) {
                const rateText = dailyRateEl.textContent;
                const dailyTokens = parseFloat(rateText.split(' ')[0]) || 0;
                totalDailyRewards += (dailyTokens * selectedTokenPrice);
            }

            // Check break-even days
            const beEl = card.querySelector('.break-even');
            if (beEl && beEl.textContent !== '--') {
                const days = parseInt(beEl.textContent) || 0;
                if (days > longestBreakEven) longestBreakEven = days;
            }
        });

        // Update all summary values
        if (globalLicenseCounter) {
            globalLicenseCounter.textContent = sum.toLocaleString();
        }

        // Update floating summary bar
        const summaryCerts = document.getElementById('summary-certs');
        const summaryDaily = document.getElementById('summary-daily');
        const summaryBep = document.getElementById('summary-bep');

        if (summaryCerts) summaryCerts.textContent = sum.toLocaleString();
        if (summaryDaily) summaryDaily.textContent = '$' + totalDailyRewards.toFixed(2);
        if (summaryBep) summaryBep.textContent = longestBreakEven > 0 ? longestBreakEven + ' days' : '-- days';
    }

    // For all cards (like if minted slider changed, or user changed token price radio):
    function recalcAllCards(){
        certCards.forEach(card => {
            const fishId = card.id;
            const cDef   = certData.find(x=> x.id === fishId);
            const q      = parseInt(card.querySelector('.cert-counter input').value)||0;

            const cost   = getUserCost(cDef, q);
            card.querySelector('.total-cost-value').textContent = '$' + cost.toLocaleString();

            const dailyRate = calcDailyRateForCert(cDef);
            card.querySelector('.current-harvest').textContent  = dailyRate.toFixed(2)+' tokens/day';
            card.querySelector('.year1-tokens').textContent      = (dailyRate*365).toFixed(2)+' tokens';

            const dailyUSD = dailyRate* selectedTokenPrice;
            let beDays = '--';
            if(dailyUSD > 0) {
                beDays = Math.ceil(cost/dailyUSD)+' days';
            }
            card.querySelector('.break-even').textContent = beDays;
        });
    }

    /**************************************************************
     * 7. “Create Collection” => finalize user selection
     **************************************************************/
    purchaseButton.addEventListener('click', () => {
        // Update collection first
        updateUserCollection();

        // Reveal the previously hidden sections
        userCollectionDiv.style.display = 'block';
        tokenPriceContainer.style.display = 'block';
        financialProjectionsContainer.style.display = 'block';
        graphContainer.style.display = 'block';

        // Do calculations
        updateCalculations();
    });

    function updateUserCollection(){
        let html = '<h2>Your Collection</h2><div class="user-collection-container">';

        certCards.forEach(card => {
            const fishId= card.id;
            const cDef  = certData.find(x=> x.id=== fishId);
            const q     = parseInt(card.querySelector('.cert-counter input').value)||0;

            if(q > 0){
                const nm   = card.querySelector('.cert-front h2').textContent;
                const im   = card.querySelector('.cert-image img').outerHTML;

                html += `
                  <div class="user-cert-card">
                    ${im}
                    <h3>${nm}</h3>
                    <p>Quantity: ${q}</p>
                  </div>
                `;
            }
        });

        html += '</div>';
        userCollectionDiv.innerHTML = html;
        userCollectionDiv.scrollIntoView({behavior:'smooth'});
    }

    function getUserTotalCostAll(){
        let total=0;
        certData.forEach(cd => {
            const card = document.getElementById(cd.id);
            const q    = parseInt(card.querySelector('.cert-counter input').value)||0;
            total     += getUserCost(cd,q);
        });
        return total;
    }

    /**************************************************************
     * 8. Phase2 + Token Price + Graph Toggles
     **************************************************************/
    const phase2Buttons = document.querySelectorAll('.phase2-button');
    phase2Buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            phase2Buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            phase2StartYear = parseInt(btn.getAttribute('data-year'));
            if(collectionCreated) updateCalculations();
        });
    });

    const priceOpts = document.getElementsByName('token-price');
    priceOpts.forEach(opt => {
        opt.addEventListener('change', () => {
            selectedTokenPrice = parseFloat(opt.value);
            recalcAllCards();
            updateGlobalLicenseCount(); // Add this to update summary bar
            if(collectionCreated) updateCalculations();
        });
    });

    const graphToggleBtns = document.querySelectorAll('.graph-toggle-button');
    let chartInstance;
    graphToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            graphToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if(collectionCreated) updateCalculations();
        });
    });

    /**************************************************************
     * 9. Build the Chart & Projections
     **************************************************************/
    function updateCalculations(){
        const yearlyData = computeYearlyRewards();
        buildChart(yearlyData);
        buildProjectionTable(yearlyData);
    }

    function buildChart(yearlyData){
        const chartCanvas = document.getElementById('chartCanvas');
        if(!chartCanvas) return;

        const activeType = document.querySelector('.graph-toggle-button.active')?.dataset.type || 'harvesting';

        // Get active fish types (ones user has selected)
        const activeFish = certData.filter(cd => {
            const card = document.getElementById(cd.id);
            const qty = parseInt(card.querySelector('.cert-counter input').value) || 0;
            return qty > 0;
        });

        if(activeFish.length === 0) {
            chartCanvas.style.display = 'none';
            financialProjections.innerHTML='<p>Please select at least one CERT to view projections.</p>';
            return;
        }

        chartCanvas.style.display = 'block';
        const labels = yearlyData.map(d => 'Year '+ d.year);
        let datasets = [];
        let yAxisType = activeType === 'harvesting' ? 'linear' : 'logarithmic';

        // Calculate per-fish metrics
        activeFish.forEach(fish => {
            const card = document.getElementById(fish.id);
            const qty = parseInt(card.querySelector('.cert-counter input').value) || 0;
            
            const yearlyMetrics = yearlyData.map((yd) => {
                const multiplier = yd.year >= phase2StartYear ? fish.phase2Multiplier : 1;
                const weightedQty = qty * fish.weightingFactor * multiplier;
                const { userW, globalW } = getWeightedStake(yd.year);
                
                if(activeType === 'harvesting') {
                    return (weightedQty / globalW) * yd.userTokens;
                } else {
                    const cost = getUserCost(fish, qty);
                    if (cost <= 0) return 0;
                    // Calculate COR using yearly value from yearlyData
                    return ((yd.yearValue / cost) * 100);
                }
            });

            datasets.push({
                label: fish.name,
                data: yearlyMetrics,
                borderColor: fish.certColor,
                fill: false
            });
        });

        if(chartInstance) chartInstance.destroy();

        const ctx = chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type:'line',
            data: {
                labels,
                datasets
            },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                scales:{
                    y:{
                        type: yAxisType,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks:{
                            color: '#00FFFF',
                            callback: (val) => {
                                if(activeType === 'cor') return val + '%';
                                return val;
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#00FFFF'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#00FFFF',
                            font: {
                                family: 'Orbitron'
                            }
                        }
                    }
                }
            }
        });
    }

    function buildProjectionTable(yearlyData){
        financialProjections.innerHTML='';
        const table = document.createElement('table');
        table.classList.add('projection-table');

        // Create header for years
        const thead = document.createElement('thead');
        const yearRow = document.createElement('tr');
        yearRow.innerHTML = '<th>Metric</th>' + yearlyData.map(d => `<th>Year ${d.year}</th>`).join('');
        thead.appendChild(yearRow);
        table.appendChild(thead);

        // Create rows for each metric
        const tbody = document.createElement('tbody');

        // User Tokens Row
        const tokenRow = document.createElement('tr');
        tokenRow.innerHTML = `
            <td>User Tokens <span class="info-icon" data-tooltip="This is how many FISH tokens you'll harvest in that year.">i</span></td>
            ${yearlyData.map(d => `<td>${d.userTokens.toFixed(2)}</td>`).join('')}
        `;
        tbody.appendChild(tokenRow);

        // Cumulative Tokens Row
        const cumTokenRow = document.createElement('tr');
        cumTokenRow.innerHTML = `
            <td>Cumulative Tokens <span class="info-icon" data-tooltip="Total FISH tokens from start to that year.">i</span></td>
            ${yearlyData.map(d => `<td>${d.cumTokens.toFixed(2)}</td>`).join('')}
        `;
        tbody.appendChild(cumTokenRow);

        // Year Value Row
        const yearValueRow = document.createElement('tr');
        yearValueRow.innerHTML = `
            <td>Year Value (USD)</td>
            ${yearlyData.map(d => `<td>$${d.yearValue.toFixed(2)}</td>`).join('')}
        `;
        tbody.appendChild(yearValueRow);

        // Cumulative Value Row
        const cumValueRow = document.createElement('tr');
        cumValueRow.innerHTML = `
            <td>Cumulative Value (USD)</td>
            ${yearlyData.map(d => `<td>$${d.cumValue.toFixed(2)}</td>`).join('')}
        `;
        tbody.appendChild(cumValueRow);

        // COR Row
        const corRow = document.createElement('tr');
        corRow.innerHTML = `
            <td>COR (%) <span class="info-icon" data-tooltip="Cumulative % Return on your original cost. If this is over 100%, you're effectively beyond breakeven.">i</span></td>
            ${yearlyData.map(d => `<td>${d.cor.toFixed(2)}%</td>`).join('')}
        `;
        tbody.appendChild(corRow);

        table.appendChild(tbody);
        financialProjections.appendChild(table);
    }

    /**************************************************************
     * 10. OPTIONAL: Info-Icon Tooltips for advanced terms
     **************************************************************/
    document.body.addEventListener('mouseover', (e) => {
        if(e.target.matches('.info-icon')) {
            const tip = e.target.getAttribute('data-tooltip');
            if(tip) {
                const tooltipDiv = document.createElement('div');
                tooltipDiv.classList.add('custom-tooltip');
                tooltipDiv.textContent = tip;
                document.body.appendChild(tooltipDiv);

                const rect = e.target.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Add tooltip to DOM to get its dimensions
                tooltipDiv.style.visibility = 'hidden';
                document.body.appendChild(tooltipDiv);
                const tipRect = tooltipDiv.getBoundingClientRect();

                // Calculate positions
                let left = rect.left + window.scrollX + 20;
                let top = rect.top + window.scrollY;

                // Check right edge
                if (left + tipRect.width > viewportWidth) {
                    left = rect.left + window.scrollX - tipRect.width - 10;
                }

                // Check bottom edge
                if (top + tipRect.height > viewportHeight) {
                    top = rect.top + window.scrollY - tipRect.height;
                }

                // Apply final position
                tooltipDiv.style.left = Math.max(10, left) + 'px';
                tooltipDiv.style.top = Math.max(10, top) + 'px';
                tooltipDiv.style.visibility = 'visible';

                e.target.addEventListener('mouseout', () => {
                    if(tooltipDiv) tooltipDiv.remove();
                }, { once: true });
            }
        }
    });
});