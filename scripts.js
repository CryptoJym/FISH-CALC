// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Data for certification cards
    const certData = [
        {
            id: 'angel-fish',
            name: 'Angel-FISH',
            imageSrc: 'assets/icon--angel-fish-colors--teal-cyan-with-deep-blue-.svg',
            altText: 'Angel-FISH Icon',
            totalCerts: 15000,
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
            imageSrc: 'assets/COD FISH CERT.svg',
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
            imageSrc: 'assets/icon--tuna-colors--teal-cyan-with-deep-blue-highli.svg',
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
            imageSrc: 'assets/SWORD FISH CERT.svg',
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
            imageSrc: 'assets/icon--kingfish-colors--teal-cyan-with-deep-blue-hi.svg',
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

    const collectionContainer = document.getElementById('cert-collection');

    // Function to create certification cards dynamically
    function createCertCards() {
        certData.forEach(cert => {
            const card = document.createElement('div');
            card.classList.add('cert-card');
            card.id = cert.id;

            card.innerHTML = `
                <div class="cert-inner">
                    <div class="cert-front">
                        <div class="cert-image-box">
                            <div class="cert-image">
                                <img src="${cert.imageSrc}" alt="${cert.altText}" width="200" height="200" loading="lazy">
                            </div>
                        </div>
                        <div class="cert-text-box">
                            <h2>${cert.name}</h2>
                            <div class="cert-details">
                                <p><span class="label">Total CERTs:</span><span class="value">${cert.totalCerts.toLocaleString()}</span></p>
                                <p><span class="label">Harvest Eff.:</span><span class="value">${cert.harvestEfficiency}</span></p>
                                <p><span class="label">Price Step:</span><span class="value">${cert.priceStep}</span></p>
                                <p><span class="label">Starting Price:</span><span class="value">${cert.startingPriceDisplay}</span></p>
                            </div>
                        </div>
                        <button class="purchase-button" aria-label="View ${cert.name} details" role="button">VIEW DETAILS</button>
                    </div>
                    <div class="cert-back">
                        <div class="cert-text-box">
                            <h2>${cert.name} Details</h2>
                            <div class="cert-details">
                                <p><span class="label">Available CERTs:</span><span class="value cert-remaining">${cert.totalCerts.toLocaleString()}</span></p>
                                <p><span class="label">Phase 2 Multiplier:</span><span class="value">${cert.phase2Multiplier}x</span></p>
                                <p><span class="label">Min Harvest/Day:</span><span class="value min-harvest-value">${cert.minHarvestPerDayPerCert.toFixed(2)}</span></p>
                                <p><span class="label">Total:</span><span class="value total-cost-value">$0</span></p>
                            </div>
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

    // Now, get references to the cert cards
    const certCards = document.querySelectorAll('.cert-card');

    const globalLicenseCounter = document.querySelector('#global-counter .counter-value');
    const userCollectionDiv = document.getElementById('user-collection');
    const tokenPriceContainer = document.getElementById('token-price-container');
    const financialProjectionsContainer = document.getElementById('financial-projections-container');
    const graphContainer = document.getElementById('graph-container');
    let totalLicensesOwned = 0;
    let collectionCreated = false; // Flag to track if collection is created

    // Create a mapping for cert colors
    const certColors = {};
    certData.forEach(cert => {
        certColors[cert.name] = cert.certColor;
    });

    const cardTotalLicenses = {};
    certData.forEach(cert => {
        cardTotalLicenses[cert.id] = cert.totalCerts;
    });

    function calculateTotalCost(quantity, startingPrice, incrementAmount, incrementInterval) {
        let totalCost = 0;
        let remainingQuantity = quantity;
        let currentPrice = startingPrice;
        let totalSold = 0;

        while (remainingQuantity > 0) {
            let nextIncrementAt = incrementInterval - (totalSold % incrementInterval);
            let quantityAtCurrentPrice = Math.min(remainingQuantity, nextIncrementAt);

            totalCost += quantityAtCurrentPrice * currentPrice;
            remainingQuantity -= quantityAtCurrentPrice;
            totalSold += quantityAtCurrentPrice;

            if (remainingQuantity > 0) {
                currentPrice += incrementAmount;
            }
        }

        return totalCost;
    }

    certCards.forEach(card => {
        const viewButton = card.querySelector('.purchase-button');
        const inputField = card.querySelector('.cert-counter input');
        const minusButton = card.querySelector('.minus-button');
        const plusButton = card.querySelector('.plus-button');
        const cardId = card.id;
        const totalCertsDisplay = card.querySelector('.cert-front .cert-details p:first-child .value');
        const initialTotal = cardTotalLicenses[cardId];

        // Event listeners for card flipping
        viewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('flipped');
        });

        card.addEventListener('click', (e) => {
            if (card.classList.contains('flipped')) {
                if (!e.target.closest('.cert-back .cert-counter') && !e.target.closest('.counter-button') && !e.target.closest('.cert-counter input')) {
                    e.stopPropagation();
                    card.classList.remove('flipped');
                }
            }
        });

        function updateCounters(change) {
            let currentValue = parseInt(inputField.value) || 0;
            let newValue = currentValue + change;
            newValue = Math.max(0, Math.min(newValue, initialTotal));
            inputField.value = newValue;
            totalLicensesOwned = Array.from(certCards).reduce((sum, currentCard) => {
                const currentInput = currentCard.querySelector('.cert-counter input');
                return sum + (parseInt(currentInput ? currentInput.value : 0) || 0);
            }, 0);
            globalLicenseCounter.textContent = totalLicensesOwned.toLocaleString();
            const remainingCerts = initialTotal - newValue;
            totalCertsDisplay.textContent = remainingCerts.toLocaleString();
            const backCertsDisplay = card.querySelector('.cert-back .cert-remaining');
            if (backCertsDisplay) {
                backCertsDisplay.textContent = remainingCerts.toLocaleString();
            }

            // Update Min Harvest/Day
            const certDataItem = certData.find(cert => cert.id === cardId);
            const minHarvestPerDayPerCert = certDataItem.minHarvestPerDayPerCert;
            const quantity = newValue;
            const minHarvestPerDay = minHarvestPerDayPerCert * Math.max(1, quantity);
            const minHarvestDisplay = card.querySelector('.cert-back .min-harvest-value');
            if (minHarvestDisplay) {
                minHarvestDisplay.textContent = minHarvestPerDay.toFixed(2);
            }

            // Update Total Cost
            const totalCost = calculateTotalCost(quantity, certDataItem.startingPrice, certDataItem.incrementAmount, certDataItem.incrementInterval);
            const totalCostDisplay = card.querySelector('.cert-back .total-cost-value');
            if (totalCostDisplay) {
                totalCostDisplay.textContent = '$' + totalCost.toLocaleString();
            }

            // Only update calculations if the collection has been created
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
                let value = parseInt(e.target.value) || 0;
                value = Math.max(0, Math.min(value, initialTotal));
                inputField.value = value;
                updateCounters(0);
            });
        }
    });

    const purchaseButton = document.getElementById('purchase-button');
    const financialProjections = document.getElementById('financial-projections');
    let phase2StartYear = 5; // Default to Year 5

    const phase2Buttons = document.querySelectorAll('.phase2-button');
    phase2Buttons.forEach(button => {
        button.addEventListener('click', () => {
            phase2Buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            phase2StartYear = parseInt(button.getAttribute('data-year'));
            updateCalculations();
        });
    });

    purchaseButton.addEventListener('click', () => {
        collectionCreated = true; // Set the flag to true
        updateUserCollection();
        userCollectionDiv.style.display = 'block';
        tokenPriceContainer.style.display = 'block';
        financialProjectionsContainer.style.display = 'block';
        graphContainer.style.display = 'block';
        updateCalculations();
    });

    const tokenPriceOptions = document.getElementsByName('token-price');
    tokenPriceOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateCalculations();
        });
    });

    const graphToggleButtons = document.querySelectorAll('.graph-toggle-button');
    graphToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            graphToggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateCalculations();
        });
    });

    let chartInstance;
    function updateCalculations() {
        if (!collectionCreated) return; // Prevent running if collection not created

        const selectedTokenPrice = parseFloat(document.querySelector('input[name="token-price"]:checked').value);
        const graphType = document.querySelector('.graph-toggle-button.active').dataset.type;

        const usersSelections = {};
        const totalInvestments = {};
        certCards.forEach(card => {
            const cardId = card.id;
            const quantity = parseInt(card.querySelector('.cert-counter input').value) || 0;
            usersSelections[cardId] = quantity;
            if (quantity > 0) {
                const certDataItem = certData.find(cert => cert.id === cardId);
                const totalCost = calculateTotalCost(quantity, certDataItem.startingPrice, certDataItem.incrementAmount, certDataItem.incrementInterval);
                totalInvestments[cardId] = totalCost;
            }
        });

        const labels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);
        const datasets = [];

        const projectionData = {};

        for (const certId in usersSelections) {
            const quantity = usersSelections[certId];
            if (quantity > 0) {
                const certDataItem = certData.find(cert => cert.id === certId);
                const dailyMiningRatePerCert = certDataItem.minHarvestPerDayPerCert;
                const dailyMiningRate = dailyMiningRatePerCert * quantity;
                const yearlyMiningRates = calculateMiningRates(dailyMiningRate, phase2StartYear, certDataItem.phase2Multiplier);

                // Calculate total cost
                const totalCost = totalInvestments[certId];
                const investment = totalCost;

                const dailyValue = dailyMiningRate * selectedTokenPrice;
                const monthlyValue = dailyValue * 30;
                const yearlyValue = dailyValue * 365;

                // Calculate cumulative earnings up to year 1,3,5,10
                let cumulativeEarnings = 0;
                const cumulativeEarningsY = {};
                for (let year = 1; year <= 10; year++) {
                    const dailyRate = yearlyMiningRates[year - 1];
                    const yearlyEarnings = dailyRate * 365 * selectedTokenPrice;
                    cumulativeEarnings += yearlyEarnings;
                    if ([1, 3, 5, 10].includes(year)) {
                        cumulativeEarningsY[year] = cumulativeEarnings;
                    }
                }

                const corY1 = (cumulativeEarningsY[1] / investment) * 100;
                const corY3 = (cumulativeEarningsY[3] / investment) * 100;
                const corY5 = (cumulativeEarningsY[5] / investment) * 100;
                const corY10 = (cumulativeEarningsY[10] / investment) * 100;

                projectionData[certDataItem.name] = {
                    dailyValue: dailyValue,
                    monthlyValue: monthlyValue,
                    yearlyValue: yearlyValue,
                    corY1: corY1,
                    corY3: corY3,
                    corY5: corY5,
                    corY10: corY10,
                    investment: investment,
                };

                datasets.push({
                    label: certDataItem.name,
                    data: (graphType === 'cor') ? calculateCOR(investment, yearlyMiningRates, selectedTokenPrice) : yearlyMiningRates,
                    borderColor: certDataItem.certColor,
                    fill: false,
                    stepped: true,
                });
            }
        }

        // Check if there are datasets to display
        if (datasets.length === 0) {
            // Hide the chart and projections, or display a message
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
                layout: {
                    padding: {
                        left: 20
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3,
                        tension: 0.4,
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 7,
                        backgroundColor: '#00e5ff',
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.2)',
                        },
                        ticks: {
                            color: '#00ffff',
                            font: {
                                family: 'Orbitron',
                                size: 14,
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 255, 255, 0.2)',
                        },
                        ticks: {
                            color: '#00ffff',
                            font: {
                                family: 'Orbitron',
                                size: 14,
                            },
                            padding: 10
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#00ffff',
                            font: {
                                family: 'Orbitron',
                                size: 14,
                                weight: 'bold',
                            },
                            padding: 25,
                        },
                    },
                    tooltip: {
                        backgroundColor: '#001f29',
                        titleColor: '#00e5ff',
                        titleFont: {
                            family: 'Orbitron',
                            size: 16,
                            weight: 'bold',
                        },
                        bodyColor: '#00ffff',
                        bodyFont: {
                            family: 'Orbitron',
                            size: 14,
                        },
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

    function calculateMiningRates(initialRate, phase2StartYear, multiplier) {
        const rates = [];
        for (let year = 1; year <= 10; year++) {
            let rate = initialRate * Math.pow(0.5, year - 1);
            if (year >= phase2StartYear) {
                rate *= multiplier;
            }
            rates.push(Number(rate.toFixed(2)));
        }
        return rates;
    }

    function calculateCOR(investment, yearlyMiningRates, tokenPrice) {
        const corRates = [];
        let cumulativeEarnings = 0;

        for (let year = 1; year <= yearlyMiningRates.length; year++) {
            const dailyRate = yearlyMiningRates[year - 1];
            const yearlyEarnings = dailyRate * 365 * tokenPrice;
            cumulativeEarnings += yearlyEarnings;
            const cor = (cumulativeEarnings / investment) * 100;
            corRates.push(Number(cor.toFixed(2)));
        }
        return corRates;
    }

    function generateProjectionTable(projectionData) {
        const financialProjections = document.getElementById('financial-projections');
        const table = document.createElement('table');
        table.classList.add('projection-table');

        // Create header row
        const headerRow = document.createElement('tr');
        const firstHeaderCell = document.createElement('th');
        firstHeaderCell.textContent = '';
        headerRow.appendChild(firstHeaderCell);

        for (const certName in projectionData) {
            const th = document.createElement('th');
            th.textContent = certName;
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Define the rows and corresponding keys
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

        rows.forEach(rowInfo => {
            const tr = document.createElement('tr');
            const labelCell = document.createElement('td');
            labelCell.textContent = rowInfo.label;
            tr.appendChild(labelCell);

            for (const certName in projectionData) {
                const td = document.createElement('td');
                const value = projectionData[certName][rowInfo.key];
                td.textContent = rowInfo.format(value);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        });

        // Wrap the table inside a container div
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        tableContainer.appendChild(table);

        financialProjections.innerHTML = '';
        financialProjections.appendChild(tableContainer);
    }

    function updateUserCollection() {
        const certCards = document.querySelectorAll('.cert-card');
        let collectionHTML = '<h2>Your Collection</h2><div class="user-collection-container">';

        certCards.forEach(card => {
            const quantity = parseInt(card.querySelector('.cert-counter input').value) || 0;
            if (quantity > 0) {
                const certName = card.querySelector('.cert-front h2').textContent;
                const certImage = card.querySelector('.cert-image img').outerHTML;
                collectionHTML += '<div class="user-cert-card">';
                collectionHTML += certImage;
                collectionHTML += '<h3>' + certName + '</h3>';
                collectionHTML += '<p>Quantity: ' + quantity + '</p>';
                collectionHTML += '</div>';
            }
        });

        collectionHTML += '</div>';
        userCollectionDiv.innerHTML = collectionHTML;
        userCollectionDiv.style.display = 'block';
        // Scroll to the user's collection
        userCollectionDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
