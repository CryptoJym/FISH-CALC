/*
 * onboarding.js - Guided Onboarding Module for FISH Rewards Simulator
 *
 * This module creates an onboarding overlay that guides new users through key sections
 * of the simulator in a step-by-step manner. It adheres to the general rules for
 * consistency, commenting, and code structure. The overlay highlights important UI
 * components and provides Next/Skip controls for navigation.
 */

(function() {
  "use strict";

  /**
   * Initializes the onboarding process by creating a full-screen overlay with
   * instructions and Next/Skip buttons. The onboarding steps guide the user through
   * token price selection, global minted sliders, and certification cards.
   */
  function initOnboarding() {
    console.log('initOnboarding called. localStorage onboardingComplete:', localStorage.getItem('onboardingComplete'), 'URL search:', window.location.search);
    
    // For testing: if URL contains '?debugOnboarding=true', force show overlay by ignoring localStorage flag
    const debugMode = window.location.search.includes('debugOnboarding=true');
    
    // Check if the onboarding tour has been completed previously (unless debug mode is active)
    if (localStorage.getItem('onboardingComplete') && !debugMode) {
      console.log('Onboarding already completed. Exiting initOnboarding.');
      return;
    } else if (debugMode) {
      console.log('Debug mode enabled. Forcing onboarding overlay display.');
    }

    // Create overlay element covering the viewport
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.padding = '20px';
    overlay.style.textAlign = 'center';

    // Create content container for onboarding instructions
    const content = document.createElement('div');
    content.id = 'onboarding-content';
    content.style.maxWidth = '600px';
    content.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    content.style.padding = '30px';
    content.style.border = '2px solid #00FFFF';
    content.style.borderRadius = '10px';
    content.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';

    // Create element for instructional message
    const messageEl = document.createElement('p');
    messageEl.id = 'onboarding-message';
    messageEl.style.fontSize = '1.2rem';
    messageEl.style.marginBottom = '20px';
    messageEl.textContent = 'Welcome to the FISH Rewards Simulator! Click "Next" to start a brief tour.';

    // Create container for Next and Skip buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';
    buttonContainer.style.width = '100%';

    // Create Next button
    const nextBtn = document.createElement('button');
    nextBtn.id = 'onboarding-next';
    nextBtn.textContent = 'Next';
    nextBtn.style.padding = '10px 20px';
    nextBtn.style.fontSize = '1rem';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.border = '2px solid #00FFFF';
    nextBtn.style.borderRadius = '5px';
    nextBtn.style.backgroundColor = 'transparent';
    nextBtn.style.color = '#00FFFF';

    // Create Skip button
    const skipBtn = document.createElement('button');
    skipBtn.id = 'onboarding-skip';
    skipBtn.textContent = 'Skip Tour';
    skipBtn.style.padding = '10px 20px';
    skipBtn.style.fontSize = '1rem';
    skipBtn.style.cursor = 'pointer';
    skipBtn.style.border = '2px solid #00FFFF';
    skipBtn.style.borderRadius = '5px';
    skipBtn.style.backgroundColor = 'transparent';
    skipBtn.style.color = '#00FFFF';

    // Append buttons to button container
    buttonContainer.appendChild(skipBtn);
    buttonContainer.appendChild(nextBtn);

    // Append message and button container to content
    content.appendChild(messageEl);
    content.appendChild(buttonContainer);

    // Append content to overlay
    overlay.appendChild(content);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Define onboarding steps with associated messages and optional element highlights
    const steps = [
      {
        message: 'Step 1: Select Your Hypothetical Token Price. Use the options above to choose the token price. Click "Next" to continue.',
        highlightSelector: '#token-price-section'
      },
      {
        message: 'Step 2: Set CERT Number Sold. Adjust the sliders to update global sold counts. Click "Next" to continue.',
        highlightSelector: '#global-minted-controls'
      },
      {
        message: 'Step 3: Select Your FISH CERTs. Click on the cards to view details and adjust quantities. Click "Next" to finish the tour.',
        highlightSelector: '#cert-collection'
      },
      {
        message: 'You are all set! Enjoy exploring the FISH Rewards Simulator.',
        highlightSelector: null
      }
    ];

    let currentStep = 0;

    /**
     * Updates the onboarding overlay with the current step's message and highlights the related element if applicable.
     */
    function updateStep() {
      const step = steps[currentStep];
      messageEl.textContent = step.message;

      // Remove any previous highlights
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });

      // If a highlight selector is provided, add a highlight class to that element
      if (step.highlightSelector) {
        const element = document.querySelector(step.highlightSelector);
        if (element) {
          element.classList.add('onboarding-highlight');
          // Scroll the element into view for user focus
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // Event listener for the Next button
    nextBtn.addEventListener('click', function() {
      currentStep++;
      if (currentStep < steps.length) {
        updateStep();
      } else {
        // End the onboarding tour and remove the overlay
        document.body.removeChild(overlay);
        // Remove highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
          el.classList.remove('onboarding-highlight');
        });
        // Mark the tour as complete so it doesn't show again on subsequent visits
        localStorage.setItem('onboardingComplete', 'true');
      }
    });

    // Event listener for the Skip button to exit the tour immediately
    skipBtn.addEventListener('click', function() {
      document.body.removeChild(overlay);
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
      localStorage.setItem('onboardingComplete', 'true');
    });

    // Initialize the first step of the tour
    updateStep();
  }

  // Function to handle tour restart
  function restartTour() {
    localStorage.removeItem('onboardingComplete');
    initOnboarding();
  }

  // Expose the functions to the global scope
  window.initOnboarding = initOnboarding;
  window.restartTour = restartTour;

  // Add event listener for restart button when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const restartButton = document.getElementById('restart-tour');
    if (restartButton) {
      restartButton.addEventListener('click', restartTour);
    }
  });

})(); 