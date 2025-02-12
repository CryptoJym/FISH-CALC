/* --- IIFE Wrapper Start --- */
(function() {
  "use strict";

// Function to fetch on-chain minted counts per category
// /* Removed old fetchCategoryCounts() function to avoid making over 400 calls and logging 'Total minted tokens' */

// --- GLOBAL DECLARATIONS (moved to top of file) ---
// Move these from inside DOMContentLoaded to the top

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
  }
];

// Global minted counts will be updated with live on-chain data
let globalMinted = {
  'angel-fish': 0,
  'cod-fish': 0,
  'tuna-fish': 0,
  'sword-fish': 0,
  'king-fish': 0
};

window.getGlobalMintedCount = function(certId) {
  return globalMinted[certId] || 0;
};

    const totalStakerPool = 5.49e9;
let phase2StartYear = 5;
let collectionCreated = false;
let selectedTokenPrice = parseFloat(document.querySelector('input[name="token-price"]:checked')?.value || '0.025');

// DOM element references that can be set once
const collectionContainer = document.getElementById('cert-collection');
const purchaseButton = document.getElementById('purchase-button');
const globalLicenseCounter = document.querySelector('#global-counter .counter-value');
const userCollectionDiv = document.getElementById('user-collection');
const tokenPriceContainer = document.getElementById('token-price-container');
const financialProjectionsContainer = document.getElementById('financial-projections-container');
const graphContainer = document.getElementById('graph-container');
const financialProjections = document.getElementById('financial-projections');

// Declare certCards globally
let certCards;

// --- Updated initGlobalSoldDisplay to update slider and count elements ---
function initGlobalSoldDisplay() {
  certData.forEach(cert => {
    // Update card text
    const card = document.getElementById(cert.id);
    if (card) {
      const globalSoldEl = card.querySelector('.global-sold');
      if (globalSoldEl) {
        const mintedNum = globalMinted[cert.id] || 0;
        globalSoldEl.textContent = `${mintedNum.toLocaleString()} / ${cert.totalCerts.toLocaleString()}`;
      }
    }
    // Update slider display if elements exist (IDs: '<cert.id>-global-range', '<cert.id>-val', '<cert.id>-count')
    const sliderEl = document.getElementById(`${cert.id}-global-range`);
    const labelEl = document.getElementById(`${cert.id}-val`);
    const countEl = document.getElementById(`${cert.id}-count`);
    if (sliderEl && labelEl && countEl) {
      const minted = globalMinted[cert.id] || 0;
      const percentage = (minted / cert.totalCerts) * 100;
      const roundedPct = Math.round(percentage);
      sliderEl.value = roundedPct;
      labelEl.textContent = `${roundedPct}%`;
      countEl.textContent = `${minted.toLocaleString()} / ${cert.totalCerts.toLocaleString()}`;
    }
  });
}

// --- Updated DOMContentLoaded: Remove duplicate globals and reorder initialization ---

document.addEventListener('DOMContentLoaded', async () => {
  // First, build the certification cards so that UI elements exist
  createCertCards();
  // Capture the created certification cards globally for use in other functions
  certCards = document.querySelectorAll('.cert-card');

  // Now fetch the live on-chain minted counts (only once)
  if (!window.onChainDataLoaded) {
    window.onChainDataLoaded = true;
    try {
      const onChainCounts = await fetchAllMintCounts();
      console.log("Fetched on-chain package counts:", onChainCounts);
      globalMinted['angel-fish'] = onChainCounts[1] ?? 0;
      globalMinted['cod-fish']   = onChainCounts[2] ?? 0;
      globalMinted['tuna-fish']  = onChainCounts[3] ?? 0;
      globalMinted['sword-fish'] = onChainCounts[4] ?? 0;
      globalMinted['king-fish']  = onChainCounts[5] ?? 0;
    } catch (error) {
      console.warn("On-chain mint counts not available:", error);
    }
    // Now update the UI with the live data
    initGlobalSoldDisplay();
  }

  // Inserted in DOMContentLoaded after initGlobalSoldDisplay() call
  if (!window.initialMintedCounts) {
    window.initialMintedCounts = Object.assign({}, globalMinted);
  }

  var gmContainer = document.getElementById('global-minted-controls');
  if (gmContainer) {
    var resetButton = document.createElement('button');
    resetButton.id = 'reset-global-minted';
    resetButton.textContent = 'Reset to Live Data';
    resetButton.style.padding = '10px 20px';
    resetButton.style.border = '2px solid #00FFFF';
    resetButton.style.borderRadius = '5px';
    resetButton.style.backgroundColor = 'transparent';
    resetButton.style.color = '#00FFFF';
    resetButton.style.marginLeft = '10px';
    resetButton.addEventListener('click', () => {
      globalMinted = Object.assign({}, window.initialMintedCounts);
      initGlobalSoldDisplay();
      recalcAllCards();
      updateGlobalLicenseCount();
    });
    gmContainer.appendChild(resetButton);
  }

  // Remove duplicate declarations of certData and globalMinted that were here before (if any)

  // ... (rest of your initialization and event listener setup remains unchanged) ...

  // --- Delegated Card Interactivity: Attach event listeners to the collection container ---
  collectionContainer.addEventListener('click', function(e) {
    const plusBtn = e.target.closest('.plus-button');
    const minusBtn = e.target.closest('.minus-button');
    const purchaseBtn = e.target.closest('.purchase-button');
    const card = e.target.closest('.cert-card');

    if (plusBtn && card) {
      e.preventDefault();
      updateCardQty(card, 1);
      return;
    }
    if (minusBtn && card) {
      e.preventDefault();
      updateCardQty(card, -1);
      return;
    }
    if (purchaseBtn && card) {
      e.stopPropagation();
      card.classList.add('flipped');
      return;
    }
    if (card && card.classList.contains('flipped')) {
      if (!e.target.closest('.roi-estimate') && !e.target.closest('.cert-counter')) {
        card.classList.remove('flipped');
      }
    }
  });

  collectionContainer.addEventListener('input', function(e) {
    const input = e.target;
    if (input.matches('.cert-counter input')) {
      const card = input.closest('.cert-card');
      if (card) {
        const newVal = parseInt(input.value) || 0;
        setCardQuantity(card, newVal);
      }
    }
  });

  // --- CARD INTERACTIVITY ---
  certCards.forEach(card => {
    const fishId = card.id;
    const plusBtn = card.querySelector('.plus-button');
    const minusBtn = card.querySelector('.minus-button');
    const qtyInput = card.querySelector('.cert-counter input');
    const viewBtn = card.querySelector('.purchase-button');

    // Flip card on "VIEW DETAILS"
    viewBtn.addEventListener('click', e => {
      e.stopPropagation();
      card.classList.add('flipped');
    });

    // Flip back if user clicks outside the counter area
    card.addEventListener('click', e => {
      if (card.classList.contains('flipped')) {
        const insideROI = e.target.closest('.roi-estimate');
        const insideCount = e.target.closest('.cert-counter');
        if (!insideROI && !insideCount) {
          card.classList.remove('flipped');
        }
      }
    });

    // For plus/minus buttons, increment/decrement quantity
    plusBtn.addEventListener('click', e => {
      e.stopPropagation();
      updateQuantity(card, 1);
    });

    minusBtn.addEventListener('click', e => {
      e.stopPropagation();
      updateQuantity(card, -1);
    });

    // For direct input change, set the quantity as absolute
    qtyInput.addEventListener('change', e => {
      e.stopPropagation();
      const typedVal = parseInt(e.target.value) || 0;
      setCardQuantity(card, typedVal);
    });
  });
  // --- End CARD INTERACTIVITY ---

  // ... (rest of your DOMContentLoaded initialization remains unchanged) ...

  // Attach click event for manual editing to all slider count elements (for all tiers) on DOMContentLoaded
  document.querySelectorAll('.slider-count').forEach(function(countSpan) {
    var fishId = countSpan.id.replace('-count', '');
    var slider = document.getElementById(fishId + '-global-range');
    if (slider) {
      countSpan.style.cursor = 'pointer';
      countSpan.onclick = function(e) {
        // Prevent multiple inputs
        if (e.target.tagName === 'INPUT') return;
        var cert = certData.find(c => c.id === fishId);
        if (!cert) return;
        var currentVal = parseInt(slider.value);
        var currCount = Math.floor((currentVal / 100) * cert.totalCerts);
        var input = document.createElement('input');
        input.type = 'number';
        input.value = currCount;
        input.className = 'slider-count-input';
        input.min = 0;
        input.max = cert.totalCerts;

        input.onfocus = function() { this.select(); };

        input.onkeydown = function(e) {
          if (e.key === 'Enter') {
            this.blur();
          } else if (e.key === 'Escape') {
            this.value = currCount;
            this.blur();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.value = Math.min(parseInt(this.value) + 1, cert.totalCerts);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.value = Math.max(parseInt(this.value) - 1, 0);
          }
        };

        input.onblur = function() {
          var newCount = Math.min(Math.max(0, parseInt(this.value) || 0), cert.totalCerts);
          var newPercentage = (newCount / cert.totalCerts) * 100;
          slider.value = newPercentage;

          var labelSpan = document.getElementById(fishId + '-val');
          if (labelSpan) {
            labelSpan.textContent = newPercentage.toFixed(0) + '%';
          }
          countSpan.textContent = newCount.toLocaleString() + '/' + cert.totalCerts.toLocaleString();
          globalMinted[fishId] = newCount;

          var card = document.getElementById(fishId);
          if (card) {
            var globalSoldEl = card.querySelector('.global-sold');
            if (globalSoldEl) {
              var currentPrice = getCurrentPriceForCert(cert, newCount);
              globalSoldEl.textContent = newCount.toLocaleString() + ' / ' + cert.totalCerts.toLocaleString() + ' (Current Price: $' + currentPrice + ')';
            }
          }
          recalcAllCards();
          if (collectionCreated) updateCalculations();
        };

        countSpan.textContent = '';
        countSpan.appendChild(input);
        input.focus();
      };
    }
  });
});

// --- Function to fetch on-chain minted counts from the Fish_Purchase contract ---
async function fetchMintCountForPackage(packageId) {
  const purchaseContractAddress = "0x43bf526abad45cfae684e706cdbec1cf52a91646";
  const purchaseABI = [
    "function mintCountPerPackage(uint256) view returns (uint256)"
  ];
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
  const purchaseContract = new ethers.Contract(purchaseContractAddress, purchaseABI, provider);
  try {
    const countBN = await purchaseContract.mintCountPerPackage(packageId);
    console.log("Raw count for package " + packageId + ":", countBN);
    if (!countBN) {
      console.warn("Received undefined count for package " + packageId);
    } else {
      console.log("Parsed count string for package " + packageId + ":", countBN.toString());
    }
    return parseInt(countBN.toString());
  } catch (error) {
    console.error(`Error fetching minted count for package ${packageId}:`, error);
    return 0;
  }
}

// Add a helper function to pause execution
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Update fetchAllMintCounts to call fetchMintCountForPackage sequentially with a delay
async function fetchAllMintCounts() {
  const counts = {};
  for (let pkgId = 1; pkgId <= 5; pkgId++) {
    counts[pkgId] = await fetchMintCountForPackage(pkgId);
    await sleep(200); // 200ms delay between calls
  }
  return counts;
}

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
                <span class="value global-sold" contenteditable="true">
                  0 / ${cert.totalCerts.toLocaleString()}
                </span>
              </p>
              <p>
                <span class="label">Your CERTs:</span>
                                   <span class="value user-qty">0</span>
                                </p>
              <p>
                <span class="label">Your Purchase:</span>
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

// Initialize "Global Sold" text for each card
initGlobalSoldDisplay();

/**************************************************************
 * 3. GLOBAL MINTED SLIDERS => Adjust minted% => stored in globalMinted
 **************************************************************/
const mintedSliders = document.querySelectorAll('.slider-group input[type="range"]');
mintedSliders.forEach(slider => {
  slider.addEventListener('pointerdown', function(e) {
    var rect = slider.getBoundingClientRect();
    var min = slider.min ? parseFloat(slider.min) : 0;
    var max = slider.max ? parseFloat(slider.max) : 100;
    var value = slider.value ? parseFloat(slider.value) : 0;
    var ratio = (value - min) / (max - min);
    var thumbX = rect.left + ratio * rect.width;
    var threshold = 30; // allowed distance in pixels for intentional interaction
    if (Math.abs(e.clientX - thumbX) > threshold) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  slider.addEventListener('input', e => {
    const val = parseInt(e.target.value);
    const fishId = slider.id.replace('-global-range', '');
    const labelSpan = document.getElementById(`${fishId}-val`);
    const countSpan = document.getElementById(`${fishId}-count`);

    const cert = certData.find(cd => cd.id === fishId);
    if (!cert) return;

    const count = Math.floor((val / 100) * cert.totalCerts);

    if (labelSpan) labelSpan.textContent = val + '%';
    if (countSpan) {
      countSpan.textContent = `${count.toLocaleString()}/${cert.totalCerts.toLocaleString()}`;

      // Make count number clickable and editable
      countSpan.style.cursor = 'pointer';
      countSpan.onclick = function (e) {
        // Prevent multiple inputs from being created
        if (e.target.tagName === 'INPUT') return;

        const input = document.createElement('input');
        input.type = 'number';
        input.value = count;
        input.className = 'slider-count-input';
        input.min = 0;
        input.max = cert.totalCerts;

        // Select all text when focused
        input.onfocus = function () {
          this.select();
        };

        // Handle keyboard navigation
        input.onkeydown = function (e) {
          if (e.key === 'Enter') {
            this.blur();
          } else if (e.key === 'Escape') {
            this.value = count;
            this.blur();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newVal = Math.min(parseInt(this.value) + 1, cert.totalCerts);
            this.value = newVal;
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newVal = Math.max(parseInt(this.value) - 1, 0);
            this.value = newVal;
          }
        };

        input.onblur = function () {
          const newCount = Math.min(Math.max(0, parseInt(this.value) || 0), cert.totalCerts);
          const newPercentage = (newCount / cert.totalCerts) * 100;
          slider.value = newPercentage;

          // Update all displays
          labelSpan.textContent = newPercentage.toFixed(0) + '%';
          countSpan.textContent = `${newCount.toLocaleString()}/${cert.totalCerts.toLocaleString()}`;

          // Update global minted
          globalMinted[fishId] = newCount;

          // Update card displays
        const card = document.getElementById(fishId);
        if (card) {
            const globalSoldEl = card.querySelector('.global-sold');
            if (globalSoldEl) {
              const currentPrice = getCurrentPriceForCert(cert, newCount);
              globalSoldEl.textContent = `${newCount.toLocaleString()} / ${cert.totalCerts.toLocaleString()} (Current Price: $${currentPrice})`;
            }
          }

          // Recalculate everything
          recalcAllCards();
          updateGlobalLicenseCount();
        };

        input.onkeypress = function (e) {
          if (e.key === 'Enter') {
            this.blur();
          }
        };

        countSpan.textContent = '';
        countSpan.appendChild(input);
        input.focus();
      };
    }

    const cDef = certData.find(cd => cd.id === fishId);
    if (!cDef) return;

    // Convert slider % => minted count
    const mintedCount = Math.floor((val / 100) * cDef.totalCerts);
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

// --- BUSINESS LOGIC FUNCTIONS ---

/* === Business Logic Functions Start === */

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

function getUserCost(cert, userQty) {
  const mintedCount = window.getGlobalMintedCount(cert.id);
  return calculateCostForQuantity(cert, userQty, mintedCount);
}

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
    const mintedGlobal = window.getGlobalMintedCount(cd.id);
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

    userW += (finalUserQty * cd.weightingFactor);
    globalW += (finalGlobalQty * cd.weightingFactor);
        });
  return { userW, globalW };
    }

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
            const cumValue = cumTokens * selectedTokenPrice;
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

function calcDailyRateForCert(cert) {
  const year = 1; // simple approach
  const arr = computeYearlyPools();
  const cycleTokens = arr[year];
  if (!cycleTokens) return 0;

  const dailyPool = cycleTokens / 365;

  // Weighted stake for year=1
  let globalW = 0;
  certData.forEach(cd => {
    let mintedCount = window.getGlobalMintedCount(cd.id);
    if (year >= phase2StartYear) mintedCount *= cd.phase2Multiplier;
    globalW += (mintedCount * cd.weightingFactor);
  });

  // user minted
  const card = document.getElementById(cert.id);
  const userQ = parseInt(card.querySelector('.cert-counter input').value) || 0;
  let finalQ = userQ;
  if (year >= phase2StartYear) finalQ *= cert.phase2Multiplier;

  const userW = finalQ * cert.weightingFactor;
  if (globalW <= 0) return 0;

  return (userW / globalW) * dailyPool;
}
/* === Business Logic Functions End === */

// --- UI Functions and DOM Interaction ---

function updateGlobalLicenseCount() {
  let sum = 0;
  let totalDailyRewards = 0;
  let longestBreakEven = 0;

  // Update selected certs display
  const selectedCertsList = document.querySelector('.selected-certs-list');
  selectedCertsList.innerHTML = '';

    certCards.forEach(card => {
    const q = parseInt(card.querySelector('.cert-counter input').value) || 0;
    sum += q;

    if (q > 0) {
      const certImg = card.querySelector('.cert-image img').getAttribute('src');
      const certItem = document.createElement('div');
      certItem.className = 'selected-cert-item';
      certItem.innerHTML = `
        <img src="${certImg}" alt="Selected CERT">
        <span class="selected-cert-count">×${q}</span>
      `;
      selectedCertsList.appendChild(certItem);
    }

    // Get daily rate for rewards calculation
    const cDef = certData.find(cd => cd.id === card.id);
    if (cDef) {
      const dailyTokens = calcDailyRateForCert(cDef);
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
  if (summaryDaily) summaryDaily.textContent = '$' + Math.round(totalDailyRewards).toLocaleString();
  if (summaryBep) summaryBep.textContent = longestBreakEven > 0 ? longestBreakEven + ' days' : '-- days';
}

// For all cards (like if minted slider changed, or user changed token price radio):
function recalcAllCards() {
  certCards.forEach(card => {
    const fishId = card.id;
    const cDef = certData.find(x => x.id === fishId);
    const q = parseInt(card.querySelector('.cert-counter input').value) || 0;

    const cost = getUserCost(cDef, q);
    card.querySelector('.total-cost-value').textContent = '$' + cost.toLocaleString();

    const dailyRate = calcDailyRateForCert(cDef);
    card.querySelector('.current-harvest').textContent = Math.round(dailyRate).toLocaleString() + ' tokens/day';
    card.querySelector('.year1-tokens').textContent = Math.round(dailyRate * 365).toLocaleString() + ' tokens';

    const dailyUSD = dailyRate * selectedTokenPrice;
    let beDays = '--';
    if (dailyUSD > 0) {
      beDays = Math.ceil(cost / dailyUSD) + ' days';
    }
    card.querySelector('.break-even').textContent = beDays;
  });
    }

    /**************************************************************
 * 7. "Create Collection" => finalize user selection
     **************************************************************/
    purchaseButton.addEventListener('click', () => {
  // Update collection first
        updateUserCollection();

  // Set collection as created
  collectionCreated = true;

  // Reveal only sections that exist
  if (userCollectionDiv) userCollectionDiv.style.display = 'block';
  if (financialProjectionsContainer) financialProjectionsContainer.style.display = 'block';
  if (graphContainer) graphContainer.style.display = 'block';

  // Do calculations and ensure graph is visible
        updateCalculations();
    });

    function updateUserCollection() {
        let html = '<h2>Your Collection</h2><div class="user-collection-container">';

        certCards.forEach(card => {
    const fishId = card.id;
    const cDef = certData.find(x => x.id === fishId);
    const q = parseInt(card.querySelector('.cert-counter input').value) || 0;

    if (q > 0) {
      const nm = card.querySelector('.cert-front h2').textContent;
      const im = card.querySelector('.cert-image img').outerHTML;

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
        userCollectionDiv.scrollIntoView({ behavior: 'smooth' });
    }

function getUserTotalCostAll() {
  let total = 0;
  certData.forEach(cd => {
    const card = document.getElementById(cd.id);
    const q = parseInt(card.querySelector('.cert-counter input').value) || 0;
    total += getUserCost(cd, q);
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
            if (collectionCreated) updateCalculations();
        });
    });

// Get the manual price input element
const manualPriceInput = document.getElementById('manual-token-price');

const priceOpts = document.getElementsByName('token-price');
priceOpts.forEach(opt => {
  opt.addEventListener('change', () => {
    selectedTokenPrice = parseFloat(opt.value);
    // Clear manual price input if a radio option is selected
    if (manualPriceInput) {
      manualPriceInput.value = "";
    }
    recalcAllCards();
    updateGlobalLicenseCount();
    if (collectionCreated) updateCalculations();
  });
});

// Add event listener for manual price input
if (manualPriceInput) {
  manualPriceInput.addEventListener('input', (e) => {
    const newVal = parseFloat(e.target.value);
    if (!isNaN(newVal) && newVal > 0) {
      selectedTokenPrice = newVal;
      // Clear the radio selection so manual takes precedence
      const priceRadios = document.getElementsByName('token-price');
      priceRadios.forEach(radio => radio.checked = false);
      recalcAllCards();
      updateGlobalLicenseCount();
      if (collectionCreated) updateCalculations();
    }
  });
}

const graphToggleBtns = document.querySelectorAll('.graph-toggle-button');
    let chartInstance;
graphToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
    graphToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (collectionCreated) updateCalculations();
        });
    });

    /**************************************************************
 * 9. Build the Chart & Projections
     **************************************************************/
    function updateCalculations() {
  const yearlyData = computeYearlyRewards();
  buildChart(yearlyData);
  buildProjectionTable(yearlyData);
    }

    function buildChart(yearlyData) {
        const chartCanvas = document.getElementById('chartCanvas');
  const chartContainer = document.querySelector('.chart-container');
  if (!chartCanvas || !chartContainer) return;

  // Ensure chart container is visible
  chartContainer.style.display = 'block';
  chartCanvas.style.display = 'block';

  const activeType = document.querySelector('.graph-toggle-button.active')?.dataset.type || 'harvesting';

  // Get active fish types (ones user has selected)
  const activeFish = certData.filter(cd => {
    const card = document.getElementById(cd.id);
    const qty = parseInt(card.querySelector('.cert-counter input').value) || 0;
    return qty > 0;
  });

  if (activeFish.length === 0) {
            chartCanvas.style.display = 'none';
            financialProjections.innerHTML = '<p>Please select at least one CERT to view projections.</p>';
            return;
  }

            chartCanvas.style.display = 'block';
  const labels = yearlyData.map(d => 'Year ' + d.year);
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

      if (activeType === 'harvesting') {
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

        if (chartInstance) chartInstance.destroy();

        const ctx = chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
      datasets
            },
            options: {
                responsive: true,
      maintainAspectRatio: false,
                scales: {
                    y: {
          type: yAxisType,
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 255, 255, 0.1)'
          },
                        ticks: {
            color: '#00FFFF',
            callback: (val) => {
              if (activeType === 'cor') return val + '%';
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

    function buildProjectionTable(yearlyData) {
        financialProjections.innerHTML = '';
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
    ${yearlyData.map(d => `<td>${Math.round(d.userTokens).toLocaleString()}</td>`).join('')}
  `;
  tbody.appendChild(tokenRow);

  // Cumulative Tokens Row
  const cumTokenRow = document.createElement('tr');
  cumTokenRow.innerHTML = `
    <td>Cumulative Tokens <span class="info-icon" data-tooltip="Total FISH tokens from start to that year.">i</span></td>
    ${yearlyData.map(d => `<td>${Math.round(d.cumTokens).toLocaleString()}</td>`).join('')}
  `;
  tbody.appendChild(cumTokenRow);

  // Year Value Row
  const yearValueRow = document.createElement('tr');
  yearValueRow.innerHTML = `
    <td>Year Value (USD)</td>
    ${yearlyData.map(d => `<td>$${Math.round(d.yearValue).toLocaleString()}</td>`).join('')}
  `;
  tbody.appendChild(yearValueRow);

  // Cumulative Value Row
  const cumValueRow = document.createElement('tr');
  cumValueRow.innerHTML = `
    <td>Cumulative Value (USD)</td>
    ${yearlyData.map(d => `<td>$${Math.round(d.cumValue).toLocaleString()}</td>`).join('')}
  `;
  tbody.appendChild(cumValueRow);

  // COR Row
  const corRow = document.createElement('tr');
  corRow.innerHTML = `
    <td>COR (%) <span class="info-icon" data-tooltip="Cumulative % Return on your original cost. If this is over 100%, you're effectively beyond breakeven.">i</span></td>
    ${yearlyData.map(d => `<td>${Math.round(d.cor).toLocaleString()}%</td>`).join('')}
  `;
  tbody.appendChild(corRow);

  table.appendChild(tbody);
  financialProjections.appendChild(table);
    }

    /**************************************************************
 * 10. OPTIONAL: Info-Icon Tooltips for advanced terms
     **************************************************************/
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.matches('.info-icon')) {
            const tip = e.target.getAttribute('data-tooltip');
            if (tip) {
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
        if (tooltipDiv) tooltipDiv.remove();
                }, { once: true });
            }
        }
    });

// Add event listener for editable global sold counts
const globalSoldElements = document.querySelectorAll('.global-sold');
globalSoldElements.forEach(element => {
  element.addEventListener('input', function () {
    const text = this.textContent;
    const parts = text.split('/');
    if (parts.length === 2) {
      const sold = parseInt(parts[0].replace(/[^0-9]/g, '')) || 0;
      const total = parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
      const fishId = this.parentElement.parentElement.parentElement.parentElement.id;

      if (!isNaN(sold) && sold >= 0 && sold <= total) {
        globalMinted[fishId] = sold;
        recalcAllCards();
        updateGlobalLicenseCount();
      } else {
        this.textContent = `${globalMinted[fishId] || 0} / ${total}`;
      }
    }
  });
  element.addEventListener('blur', function () {
    const text = this.textContent;
    const parts = text.split('/');
    if (parts.length === 2) {
      const sold = parseInt(parts[0].replace(/[^0-9]/g, '')) || 0;
      const total = parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
      const fishId = this.parentElement.parentElement.parentElement.parentElement.id;

      if (!isNaN(sold) && sold >= 0 && sold <= total) {
        globalMinted[fishId] = sold;
        const currentPrice = getCurrentPriceForCert(certData.find(x => x.id === fishId), sold);
        this.textContent = `${sold.toLocaleString()} / ${total} (Current Price: $${currentPrice})`;
      } else {
        this.textContent = `${globalMinted[fishId] || 0} / ${total}`;
      }
    }
    recalcAllCards();
    updateGlobalLicenseCount();
  });
});

// --- Counter Functions: Added implementations to update the back counter on fish cards ---
function updateCardQty(card, delta) {
  const input = card.querySelector('.cert-counter input');
  if (!input) return;
  let currentQty = parseInt(input.value) || 0;
  let newQty = currentQty + delta;
  // Limit the new quantity between 0 and the total certificates defined for this card
  const cDef = certData.find(cert => cert.id === card.id);
  if (cDef) {
    if (newQty > cDef.totalCerts) newQty = cDef.totalCerts;
    if (newQty < 0) newQty = 0;
  } else {
    newQty = Math.max(0, newQty);
  }
  input.value = newQty;

  // Update the 'Your CERTs:' display on the back of the card
  const userQtyEl = card.querySelector('.user-qty');
  if (userQtyEl) {
    userQtyEl.textContent = newQty;
  }

  // Recalculate card dependent metrics & global counters
  recalcAllCards();
  updateGlobalLicenseCount();
}

function updateQuantity(card, delta) {
  // Alias to updateCardQty
  updateCardQty(card, delta);
}

function setCardQuantity(card, newQty) {
  const input = card.querySelector('.cert-counter input');
  if (!input) return;
  // Ensure newQty is within valid range
  const cDef = certData.find(cert => cert.id === card.id);
  if (cDef) {
    if (newQty > cDef.totalCerts) newQty = cDef.totalCerts;
    if (newQty < 0) newQty = 0;
  } else {
    newQty = Math.max(0, newQty);
  }
  input.value = newQty;

  // Update display for 'Your CERTs:'
  const userQtyEl = card.querySelector('.user-qty');
  if (userQtyEl) {
    userQtyEl.textContent = newQty;
  }
  recalcAllCards();
  updateGlobalLicenseCount();
}

// --- End of Counter Functions ---

/* --- IIFE Wrapper End --- */
})();