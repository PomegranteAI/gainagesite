/* ==========================================================================
   GAINAGE Cart Page JS
   Qty +/-, remove, T&C checkbox, Section Rendering API re-renders
   ========================================================================== */

(function () {
  'use strict';

  var cartPage = document.querySelector('.gainage-cart-page');
  if (!cartPage) return;

  /* ---------- T&C Checkbox ---------- */
  function bindTerms() {
    var check = cartPage.querySelector('[data-terms-check]');
    var btn = cartPage.querySelector('[data-checkout-btn]');
    if (check && btn) {
      check.addEventListener('change', function () {
        if (this.checked) {
          btn.removeAttribute('aria-disabled');
          btn.style.pointerEvents = '';
        } else {
          btn.setAttribute('aria-disabled', 'true');
          btn.style.pointerEvents = 'none';
        }
      });
    }
  }
  bindTerms();

  /* ---------- Qty Update ---------- */
  cartPage.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty-minus], [data-qty-plus], [data-qty-remove]');
    if (!btn) return;

    var lineKey = btn.getAttribute('data-line-key');
    var item = btn.closest('[data-line-item]');
    var qtyEl = item ? item.querySelector('[data-qty-value]') : null;
    var currentQty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

    var newQty;
    if (btn.hasAttribute('data-qty-remove')) {
      newQty = 0;
    } else if (btn.hasAttribute('data-qty-plus')) {
      newQty = currentQty + 1;
    } else {
      newQty = Math.max(0, currentQty - 1);
    }

    updateCart(lineKey, newQty);
  });

  function updateCart(lineKey, quantity) {
    fetch(window.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lineKey, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { item_count: cart.item_count, cart: cart }
        }));
        refreshPage();
      });
  }

  function refreshPage() {
    fetch(window.location.pathname + '?section_id=gainage-cart-page')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newContent = doc.querySelector('.gainage-cart-page');
        if (newContent) {
          cartPage.innerHTML = newContent.innerHTML;
          bindTerms();
        }
      });
  }
})();
