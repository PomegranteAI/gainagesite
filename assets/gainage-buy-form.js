/* ==========================================================================
   GAINAGE Buy Form JS
   Intercepts form submit, adds to cart via AJAX, dispatches events
   ========================================================================== */

(function () {
  'use strict';

  document.querySelectorAll('[data-buy-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var variantInput = form.querySelector('[data-variant-input]');
      if (!variantInput || !variantInput.value) return;

      // Check if a size has been selected
      var sizeSelector = document.querySelector('[data-size-selector]');
      if (sizeSelector) {
        var selected = sizeSelector.querySelector('.gainage-sizes__pill.is-selected');
        if (!selected) {
          // Flash the size label to indicate selection required
          var label = sizeSelector.querySelector('.gainage-sizes__label');
          if (label) {
            label.style.color = '#ff4444';
            setTimeout(function () { label.style.color = ''; }, 1500);
          }
          return;
        }
      }

      var submitBtn = form.querySelector('.gainage-buy-form__submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ADDING...';
      }

      var formData = {
        items: [{
          id: parseInt(variantInput.value, 10),
          quantity: 1
        }]
      };

      fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Add to cart failed');
          return response.json();
        })
        .then(function () {
          // Fetch updated cart for count
          return fetch(window.routes.cart_url + '.js', {
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .then(function (response) { return response.json(); })
        .then(function (cart) {
          // Update cart count
          document.dispatchEvent(new CustomEvent('cart:updated', {
            detail: { item_count: cart.item_count, cart: cart }
          }));

          // Open cart drawer
          document.dispatchEvent(new CustomEvent('cart:open'));

          // Reset button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ADD TO CART';
          }
        })
        .catch(function (err) {
          console.error('Cart error:', err);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ADD TO CART';
          }
        });
    });
  });
})();
