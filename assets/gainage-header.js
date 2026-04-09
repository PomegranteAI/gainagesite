/* ==========================================================================
   GAINAGE Header JS
   Mobile hamburger toggle, cart count updates, cart drawer trigger
   ========================================================================== */

(function () {
  'use strict';

  const sidebar = document.getElementById('gainage-sidebar');
  const toggles = document.querySelectorAll('[data-hamburger-toggle]');
  const cartCountEls = document.querySelectorAll('[data-cart-count]');

  /* ---------- Mobile hamburger ---------- */
  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle('is-open');
    toggles.forEach(function (btn) {
      if (btn.hasAttribute('aria-expanded')) {
        btn.setAttribute('aria-expanded', String(isOpen));
      }
    });
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', toggleSidebar);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      toggleSidebar();
    }
  });

  /* ---------- Cart count sync ---------- */
  function updateCartCount(count) {
    cartCountEls.forEach(function (el) {
      el.textContent = count;
    });
  }

  /* Listen for Dawn's PUB_SUB cart update events */
  if (window.PUB_SUB_EVENTS && typeof subscribe === 'function') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, function (event) {
      if (event && event.cart) {
        updateCartCount(event.cart.item_count);
      }
    });
  }

  /* Also listen for our custom cart:updated event */
  document.addEventListener('cart:updated', function (e) {
    if (e.detail && typeof e.detail.item_count !== 'undefined') {
      updateCartCount(e.detail.item_count);
    }
  });

  /* ---------- Cart drawer open trigger ---------- */
  var cartToggle = document.querySelector('[data-cart-toggle]');
  if (cartToggle) {
    cartToggle.addEventListener('click', function (e) {
      var drawer = document.getElementById('gainage-cart-drawer');
      if (drawer) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('cart:open'));
      }
    });
  }
})();
