/* ==========================================================================
   GAINAGE Size Selector JS
   Pill click toggles selected state and updates hidden variant input
   ========================================================================== */

(function () {
  'use strict';

  /* Load variant inventory data */
  var variantData = {};
  var dataEl = document.getElementById('gainage-variant-data');
  if (dataEl) {
    try {
      JSON.parse(dataEl.textContent).forEach(function (v) { variantData[v.id] = v; });
    } catch (e) {}
  }

  var stockEl    = document.querySelector('[data-stock-indicator]');
  var stockLabel = stockEl ? stockEl.querySelector('[data-stock-label]') : null;

  function updateStock(variantId) {
    if (!stockEl) return;
    var v = variantData[parseInt(variantId, 10)];
    if (!v) return;

    stockEl.classList.remove('gainage-stock--low', 'gainage-stock--in', 'gainage-stock--out');
    stockEl.style.display = 'flex';

    if (!v.available) {
      stockEl.classList.add('gainage-stock--out');
      if (stockLabel) stockLabel.textContent = 'Out of stock';
    } else if (v.inventory_management && v.inventory_quantity <= 5) {
      stockEl.classList.add('gainage-stock--low');
      if (stockLabel) stockLabel.textContent = 'Low stock';
    } else {
      stockEl.classList.add('gainage-stock--in');
      if (stockLabel) stockLabel.textContent = 'In stock';
    }
  }

  /* Show stock on page load using first available variant */
  var firstVariant = Object.values(variantData)[0];
  if (firstVariant) updateStock(firstVariant.id);

  document.querySelectorAll('[data-size-selector]').forEach(function (selector) {
    var pills = selector.querySelectorAll('.gainage-sizes__pill:not(.gainage-sizes__pill--soldout)');
    var variantInput = document.querySelector('[data-variant-input]');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        selector.querySelectorAll('.gainage-sizes__pill').forEach(function (p) {
          p.classList.remove('is-selected');
          p.setAttribute('aria-checked', 'false');
        });

        this.classList.add('is-selected');
        this.setAttribute('aria-checked', 'true');

        var variantId = this.getAttribute('data-variant-id');
        if (variantInput && variantId) {
          variantInput.value = variantId;
        }

        updateStock(variantId);

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
