/* ==========================================================================
   GAINAGE Cart Drawer JS
   Open/close, qty update, free shipping bar, T&C checkbox gates checkout
   ========================================================================== */

(function () {
  'use strict';

  var drawer = document.getElementById('gainage-cart-drawer');
  if (!drawer) return;

  /* ---------- Open / Close ---------- */
  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event listeners for close buttons and overlay
  drawer.querySelectorAll('[data-drawer-close]').forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Custom event to open
  document.addEventListener('cart:open', openDrawer);

  /* ---------- T&C Checkbox ---------- */
  var termsCheck = drawer.querySelector('[data-terms-check]');
  var checkoutBtn = drawer.querySelector('[data-checkout-btn]');

  if (termsCheck && checkoutBtn) {
    termsCheck.addEventListener('change', function () {
      if (this.checked) {
        checkoutBtn.removeAttribute('aria-disabled');
        checkoutBtn.style.pointerEvents = '';
      } else {
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.pointerEvents = 'none';
      }
    });
  }

  /* ---------- Qty Update ---------- */
  drawer.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty-minus], [data-qty-plus]');
    if (!btn) return;

    var lineKey = btn.getAttribute('data-line-key');
    var item = btn.closest('[data-line-item]');
    var qtyEl = item ? item.querySelector('[data-qty-value]') : null;
    var currentQty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    var newQty = btn.hasAttribute('data-qty-plus') ? currentQty + 1 : currentQty - 1;

    if (newQty < 0) newQty = 0;

    // Optimistic UI update
    if (qtyEl && newQty > 0) {
      qtyEl.textContent = newQty;
    }

    updateCartItem(lineKey, newQty);
  });

  function updateCartItem(lineKey, quantity) {
    fetch(window.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lineKey, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        refreshDrawer(cart);
      })
      .catch(function (err) {
        console.error('Cart update error:', err);
      });
  }

  function refreshDrawer(cart) {
    // Update header count
    document.dispatchEvent(new CustomEvent('cart:updated', {
      detail: { item_count: cart.item_count, cart: cart }
    }));

    // Update drawer count
    var countEl = drawer.querySelector('[data-drawer-count]');
    if (countEl) {
      countEl.textContent = cart.item_count + ' ' + (cart.item_count === 1 ? 'ITEM' : 'ITEMS');
    }

    // Update subtotal
    var subtotalEl = drawer.querySelector('[data-drawer-subtotal]');
    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(cart.total_price);
    }

    // Update free shipping bar
    updateShippingBar(cart.total_price);

    // Re-render items via Section Rendering API
    fetch(window.location.pathname + '?section_id=gainage-cart-drawer')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var newItems = doc.querySelector('[data-drawer-items]');
        var newFooter = doc.querySelector('.gainage-drawer__footer');
        var currentItems = drawer.querySelector('[data-drawer-items]');
        var currentFooter = drawer.querySelector('.gainage-drawer__footer');

        if (newItems && currentItems) {
          currentItems.innerHTML = newItems.innerHTML;
        }
        if (newFooter && currentFooter) {
          currentFooter.innerHTML = newFooter.innerHTML;
          rebindTermsCheckbox();
        } else if (!newFooter && currentFooter) {
          currentFooter.remove();
        }
      });
  }

  function rebindTermsCheckbox() {
    termsCheck = drawer.querySelector('[data-terms-check]');
    checkoutBtn = drawer.querySelector('[data-checkout-btn]');
    if (termsCheck && checkoutBtn) {
      termsCheck.addEventListener('change', function () {
        if (this.checked) {
          checkoutBtn.removeAttribute('aria-disabled');
          checkoutBtn.style.pointerEvents = '';
        } else {
          checkoutBtn.setAttribute('aria-disabled', 'true');
          checkoutBtn.style.pointerEvents = 'none';
        }
      });
    }
  }

  /* ---------- Free Shipping Bar ---------- */
  function updateShippingBar(totalPrice) {
    var bar = drawer.querySelector('[data-shipping-bar]');
    if (!bar) return;

    var threshold = parseInt(bar.getAttribute('data-threshold'), 10) || 5000;
    var fill = bar.querySelector('[data-shipping-fill]');
    var text = bar.querySelector('[data-shipping-text]');
    var pct = Math.min((totalPrice / threshold) * 100, 100);

    if (fill) fill.style.width = pct + '%';
    if (text) {
      if (totalPrice >= threshold) {
        text.textContent = "YOU'VE UNLOCKED FREE SHIPPING";
      } else {
        var remaining = (threshold - totalPrice) / 100;
        text.textContent = '£' + remaining.toFixed(0) + ' AWAY FROM FREE SHIPPING';
      }
    }
  }

  /* ---------- Format Money ---------- */
  function formatMoney(cents) {
    var amount = cents / 100;
    if (amount === Math.floor(amount)) {
      return '£' + amount.toFixed(0);
    }
    return '£' + amount.toFixed(2);
  }

})();
