/* ==========================================================================
   GAINAGE Gallery JS
   Desktop: scroll-snap carousel with arrow controls + thumbnail sync
   Mobile: scrollBy arrow controls
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Desktop gallery ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var wrapper = gallery.querySelector('[data-gallery-wrapper]');
    var track = gallery.querySelector('.gainage-gallery-desktop__track');
    var slides = gallery.querySelectorAll('.gainage-gallery-desktop__slide');
    var thumbs = gallery.querySelectorAll('.gainage-gallery-desktop__thumb');
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');

    if (!track) return;

    function updateAspectRatio(index) {
      var slide = slides[index];
      if (!slide || !wrapper) return;
      var ar = parseFloat(slide.dataset.aspectRatio);
      if (ar) wrapper.style.aspectRatio = ar;
    }

    function scrollToSlide(index) {
      var slideWidth = track.offsetWidth;
      track.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
      updateAspectRatio(index);
    }

    /* Initialise with first slide */
    updateAspectRatio(0);

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.max(0, index - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var slideCount = slides.length;
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.min(slideCount - 1, index + 1));
      });
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        scrollToSlide(i);
      });
    });

    /* Sync thumbnail active state and aspect ratio on manual scroll */
    track.addEventListener('scroll', function () {
      var index = Math.round(track.scrollLeft / track.offsetWidth);
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
      updateAspectRatio(index);
    }, { passive: true });
  });

  /* ---------- Mobile gallery ---------- */
  document.querySelectorAll('[data-gallery-mobile]').forEach(function (gallery) {
    var track = gallery.querySelector('.gainage-gallery-mobile__track');
    var thumbs = gallery.querySelectorAll('[data-mobile-thumb]');
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');
    var slideCount = track ? track.querySelectorAll('.gainage-gallery-mobile__slide').length : 0;

    if (!track) return;

    function scrollToSlide(index) {
      track.scrollTo({ left: track.offsetWidth * index, behavior: 'smooth' });
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        scrollToSlide(i);
      });
    });

    track.addEventListener('scroll', function () {
      var index = Math.round(track.scrollLeft / track.offsetWidth);
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === index);
      });
    }, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.max(0, index - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var index = Math.round(track.scrollLeft / track.offsetWidth);
        scrollToSlide(Math.min(slideCount - 1, index + 1));
      });
    }
  });
})();
