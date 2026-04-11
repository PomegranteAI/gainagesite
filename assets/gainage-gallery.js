/* ==========================================================================
   GAINAGE Gallery JS
   Desktop: scroll-snap carousel with arrow controls + thumbnail sync
   Mobile: scrollBy arrow controls
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Desktop gallery ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var track = gallery.querySelector('.gainage-gallery-desktop__track');
    var thumbs = gallery.querySelectorAll('.gainage-gallery-desktop__thumb');
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');

    if (!track) return;

    function scrollToSlide(index) {
      var slideWidth = track.offsetWidth;
      track.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.max(0, index - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var slideCount = track.querySelectorAll('.gainage-gallery-desktop__slide').length;
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.min(slideCount - 1, index + 1));
      });
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        scrollToSlide(i);
      });
    });

    /* Sync thumbnail active state on manual scroll */
    track.addEventListener('scroll', function () {
      var index = Math.round(track.scrollLeft / track.offsetWidth);
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
    }, { passive: true });
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
