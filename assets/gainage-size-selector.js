/* ==========================================================================
   GAINAGE Size Selector JS
   Pill click toggles selected state and updates hidden variant input
   ========================================================================== */

(function () {
  'use strict';

  document.querySelectorAll('[data-size-selector]').forEach(function (selector) {
    var pills = selector.querySelectorAll('.gainage-sizes__pill:not(.gainage-sizes__pill--soldout)');
    var variantInput = document.querySelector('[data-variant-input]');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        // Deselect all
        selector.querySelectorAll('.gainage-sizes__pill').forEach(function (p) {
          p.classList.remove('is-selected');
          p.setAttribute('aria-checked', 'false');
        });

        // Select this one
        this.classList.add('is-selected');
        this.setAttribute('aria-checked', 'true');

        // Update hidden variant input
        var variantId = this.getAttribute('data-variant-id');
        if (variantInput && variantId) {
          variantInput.value = variantId;
        }

        // Enable ATC button and update label
        var atcButton = document.querySelector('.gainage-buy-form__submit');
        if (atcButton && atcButton.textContent.trim() !== 'SOLD OUT') {
          atcButton.disabled = false;
          atcButton.removeAttribute('aria-disabled');
          atcButton.textContent = 'ADD TO CART';
        }
      });
    });
  });
})();
