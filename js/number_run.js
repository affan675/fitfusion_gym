/* ═══════════════════════════════════════════════
   FITFUSION GYM - NUMBER ANIMATION (number_run.js)
   Animates numbers in the hero section when in view.
   ═══════════════════════════════════════════════ */

(function() {
    'use strict';

    const heroStatNums = document.querySelectorAll('.hero-stat-num');

    /**
     * Animates a number from 0 to a target value.
     * @param {HTMLElement} element - The DOM element to update.
     * @param {number} targetNumber - The final number to reach.
     * @param {number} duration - The duration of the animation in milliseconds.
     */
    function animateNumber(element, targetNumber, duration) {
        let startTimestamp = null;
        const startNumber = 0;
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');

        function step(currentTime) {
            if (!startTimestamp) startTimestamp = currentTime;
            const progress = Math.min((currentTime - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (targetNumber - startNumber) + startNumber);

            element.textContent = currentValue + (hasPlus ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = targetNumber + (hasPlus ? '+' : ''); // Ensure exact final value
            }
        }

        requestAnimationFrame(step);
    }

    // Trigger animation for each number when it enters the viewport
    heroStatNums.forEach(numElement => {
        const targetValue = parseInt(numElement.textContent.replace(/\D/g, ''), 10); // Extract number, remove non-digits
        // Animate each number over 2 seconds
        animateNumber(numElement, targetValue, 2000);
    });
})();