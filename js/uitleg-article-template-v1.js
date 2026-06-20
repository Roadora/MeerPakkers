/*
 * MeerPakkers Uitleg Article Template — shared mobile header renderer v1
 *
 * Phase 1 foundation only: this file is deliberately NOT linked from live pages yet.
 * A migrated article opts in with one empty mount:
 *   <div data-mp-uitleg-mobile-header data-back-href="/uitleg/" data-back-label="Terug naar uitleg"></div>
 *
 * The renderer is idempotent. It renders one header only and never searches for or
 * rewrites legacy headers. That makes migration safe: legacy markup must be removed
 * from an article before this script is linked on that article.
 */
(function (window, document) {
  'use strict';

  var MOUNT_SELECTOR = '[data-mp-uitleg-mobile-header]';

  function safeHref(value, fallback) {
    var href = String(value || '').trim();
    return href && href !== '#' ? href : fallback;
  }


  function safeInternalReturn(value) {
    var target = String(value || '').trim();
    if (!target || target.charAt(0) !== '/') return '';
    if (target.indexOf('//') === 0 || target.indexOf('\\') !== -1) return '';
    // Keep return navigation on MeerPakkers. Only page paths and optional hash/query are allowed.
    return target;
  }

  function getContextualBackHref(fallback) {
    var fallbackHref = safeHref(fallback, '/uitleg/');
    var params;
    try {
      params = new URLSearchParams(window.location.search || '');
    } catch (error) {
      return fallbackHref;
    }

    // Used by links from contextual modules such as "Meer uitleg bij deze actie".
    // Direct visits and Google visits do not have returnTo and therefore retain /uitleg/.
    return safeInternalReturn(params.get('returnTo')) || fallbackHref;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char];
    });
  }

  function fallbackMarkup(options) {
    var backHref = escapeHtml(safeHref(options.backHref, '/uitleg/'));
    var homeHref = escapeHtml(safeHref(options.homeHref, '/'));
    var savedHref = escapeHtml(safeHref(options.savedHref, '/opgeslagen/'));
    var backLabel = escapeHtml(options.backLabel || 'Terug naar uitleg');
    var headerLabel = escapeHtml(options.headerLabel || 'MeerPakkers uitleg header');

    return '<header class="mp-mobile-top-header mp-mobile-topbar-unified-v3 mp-mobile-only mp-uitleg-template-mobile-header" aria-label="' + headerLabel + '">' +
      '<a href="' + backHref + '" class="mp-mobile-back" aria-label="' + backLabel + '">&lt;</a>' +
      '<a href="' + homeHref + '" class="mp-mobile-brand-lockup" aria-label="MeerPakkers home">' +
        '<span class="mp-mobile-brand-logo">MP+</span>' +
        '<span class="mp-mobile-brand-copy"><span class="mp-mobile-brand-lines">meer cadeau,<br>meer korting.</span><strong class="mp-mobile-brand-name">MeerPakkers</strong></span>' +
      '</a>' +
      '<a href="' + savedHref + '" class="mp-mobile-heart-link" aria-label="Opgeslagen deals">♡<span class="mp-mobile-heart-count" data-saved-deals-count>0</span></a>' +
    '</header>';
  }

  function renderMount(mount) {
    if (!mount || mount.dataset.mpUitlegHeaderRendered === 'true') return false;
    if (mount.querySelector('.mp-mobile-top-header')) {
      mount.dataset.mpUitlegHeaderRendered = 'true';
      return false;
    }

    var options = {
      backHref: getContextualBackHref(mount.getAttribute('data-back-href') || '/uitleg/'),
      homeHref: mount.getAttribute('data-home-href') || '/',
      savedHref: mount.getAttribute('data-saved-href') || '/opgeslagen/',
      backLabel: mount.getAttribute('data-back-label') || 'Terug naar uitleg',
      headerLabel: mount.getAttribute('data-header-label') || 'MeerPakkers uitleg header'
    };

    var topbar = window.MeerPakkersMobileTopbar;
    mount.innerHTML = topbar && typeof topbar.renderMarkup === 'function'
      ? topbar.renderMarkup(options)
      : fallbackMarkup(options);
    mount.dataset.mpUitlegHeaderRendered = 'true';

    if (topbar && typeof topbar.normalizeAll === 'function') topbar.normalizeAll();
    return true;
  }

  function init() {
    var mounts = document.querySelectorAll(MOUNT_SELECTOR);
    for (var i = 0; i < mounts.length; i += 1) renderMount(mounts[i]);
  }

  window.MeerPakkersUitlegArticleTemplate = {
    version: 'v1-phase-1-foundation',
    renderMount: renderMount,
    init: init
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}(window, document));
