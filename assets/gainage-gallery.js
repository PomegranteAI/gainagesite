/* ==========================================================================
   GAINAGE Gallery JS
   Desktop: thumbnail click swaps main image
   Mobile: scrollBy arrow controls
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Desktop gallery ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var images = gallery.querySelectorAll('.gainage-gallery-desktop__image');
    var thumbs = gallery.querySelectorAll('.gainage-gallery-desktop__thumb');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var index = this.getAttribute('data-thumb-index');

        images.forEach(function (img) {
          img.classList.toggle('is-active', img.getAttribute('data-media-index') === index);
        });

        thumbs.forEach(function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-thumb-index') === index);
        });
      });
    });
  });

  /* ---------- Mobile gallery ---------- */
  document.querySelectorAll('[data-gallery-mobile]').forEach(function (gallery) {
    var track = gallery.querySelector('.gainage-gallery-mobile__track');
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');

    if (!track) return;

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -track.offsetWidth, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: track.offsetWidth, behavior: 'smooth' });
      });
    }
  });
})();
