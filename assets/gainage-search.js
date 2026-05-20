(function () {
  'use strict';

  var panel = document.getElementById('gainage-search-panel');
  if (!panel) return;

  var toggleBtn = document.querySelector('[data-search-toggle]');
  var closeBtn  = panel.querySelector('[data-search-close]');
  var input     = panel.querySelector('[data-search-input]');
  var resultsEl = panel.querySelector('[data-search-results]');

  var debounceTimer;
  var currentQuery = '';

  /* ---------- Open / Close ---------- */
  function openPanel() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    if (input) {
      input.value = '';
      resultsEl.innerHTML = '';
      currentQuery = '';
      setTimeout(function () { input.focus(); }, 50);
    }
  }

  function closePanel() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('is-open')) return;
    if (!panel.contains(e.target) && !e.target.closest('[data-search-toggle]')) closePanel();
  });

  /* ---------- Predictive search ---------- */
  if (input) {
    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q === currentQuery) return;
      currentQuery = q;
      clearTimeout(debounceTimer);
      if (q.length < 2) { resultsEl.innerHTML = ''; return; }
      debounceTimer = setTimeout(function () { fetchResults(q); }, 300);
    });
  }

  function fetchResults(query) {
    fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=6')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        renderResults(products, query);
      })
      .catch(function () { resultsEl.innerHTML = ''; });
  }

  function renderResults(products, query) {
    if (!products.length) {
      resultsEl.innerHTML = '<p class="gainage-search-panel__empty">NO RESULTS FOR &ldquo;' + escHtml(query.toUpperCase()) + '&rdquo;</p>';
      return;
    }
    var html = products.map(function (p) {
      var imgUrl = p.featured_image && p.featured_image.url ? p.featured_image.url + '&width=96' : '';
      var imgHtml = imgUrl
        ? '<img src="' + imgUrl + '" alt="' + escHtml(p.title) + '" class="gainage-search-panel__result-img" width="48" height="48" loading="lazy">'
        : '<div class="gainage-search-panel__result-img gainage-search-panel__result-img--empty"></div>';
      var price = p.price ? '£' + (p.price / 100).toFixed(2) : '';
      return '<a href="' + p.url + '" class="gainage-search-panel__result">'
        + imgHtml
        + '<span class="gainage-search-panel__result-title">' + escHtml(p.title) + '</span>'
        + (price ? '<span class="gainage-search-panel__result-price">' + price + '</span>' : '')
        + '</a>';
    }).join('');
    resultsEl.innerHTML = html;
    resultsEl.querySelectorAll('.gainage-search-panel__result').forEach(function (el) {
      el.addEventListener('click', closePanel);
    });
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
