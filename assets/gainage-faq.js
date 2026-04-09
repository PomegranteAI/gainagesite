/* ==========================================================================
   GAINAGE FAQ Accordion JS
   ========================================================================== */

(function () {
  'use strict';

  document.querySelectorAll('[data-faq-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answer = this.nextElementSibling;

      this.setAttribute('aria-expanded', String(!expanded));

      if (answer) {
        answer.hidden = expanded;
      }
    });
  });
})();
