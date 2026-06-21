/* MeerPakkers Saved Deals UI v48
   Thin adapter only: injects save buttons after existing cards render.
   Does not modify deal-card.js, Home Controller, router, or templates.
*/
(function (window, document) {
  'use strict';

  var STORE = window.MeerPakkersSavedDealsStore;
  var BUTTON_CLASS = 'mp-save-deal-btn-v47';
  var CARD_SELECTOR = '.mp-normal-deal-card';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' en ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getDealId(card) {
    var existing = String(card.getAttribute('data-deal-id') || '').trim();
    if (existing) return existing;

    var link = card.querySelector('.mp-clean-card-bottom a[href], a[href]');
    if (link) {
      var href = link.getAttribute('href') || '';
      try {
        var url = new URL(href, window.location.href);
        var dealParam = url.searchParams.get('deal');
        if (dealParam) return String(dealParam).trim();
      } catch (e) {}
      if (href && href !== '#') return slugify(href);
    }

    var provider = cleanText(card.querySelector('.mp-clean-card-head h3') && card.querySelector('.mp-clean-card-head h3').textContent);
    var title = cleanText(card.querySelector('.mp-clean-card-head p') && card.querySelector('.mp-clean-card-head p').textContent);
    var category = cleanText(card.querySelector('.mp-clean-card-category') && card.querySelector('.mp-clean-card-category').textContent);
    return slugify([provider, title, category].filter(Boolean).join(' '));
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getDealUrl(card) {
    var link = card.querySelector('.mp-clean-card-bottom a[href], a[href]');
    return link ? link.getAttribute('href') : '';
  }

  function collectBenefitPills(card) {
    var pills = card.querySelectorAll('.mp-clean-benefits span');
    var values = Array.prototype.map.call(pills, function (pill) {
      return cleanText(pill.textContent);
    }).filter(Boolean);

    if (values.length) return values;

    var fallback = cleanText(card.querySelector('.mp-clean-benefits') && card.querySelector('.mp-clean-benefits').textContent);
    return fallback ? [fallback] : [];
  }

  function collectDealSnapshot(card) {
    // v68: save only the stable dealId. Full card data is resolved from data/deals.json.
    return { id: getDealId(card) };
  }

  function setButtonState(button, isSaved) {
    button.classList.toggle('is-saved', !!isSaved);
    button.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    button.innerHTML = '<span class="mp-save-heart-v52"><svg class="mp-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-6.8-4.2-9.3-8.1C.7 9 .9 5.5 3.4 3.7c2.1-1.5 5-.9 6.6 1.1L12 7.2l2-2.4c1.6-2 4.5-2.6 6.6-1.1 2.5 1.8 2.7 5.3.7 8.4-2.5 3.9-9.3 8.1-9.3 8.1z"/></svg></span> Opslaan';
  }

  function createButton(card) {
    var id = getDealId(card);
    if (!id || !STORE) return null;
    card.setAttribute('data-deal-id', id);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.setAttribute('data-save-deal-id', id);
    button.setAttribute('aria-label', 'Deal opslaan');
    setButtonState(button, STORE.isDealSaved(id));

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      var snapshot = collectDealSnapshot(card);
      STORE.toggleSavedDeal(snapshot);
      setButtonState(button, STORE.isDealSaved(snapshot.id));
      updateAllButtons();
    }, true);

    return button;
  }

  function enhanceCard(card) {
    if (!card || card.querySelector('.' + BUTTON_CLASS)) return;
    if (card.querySelector('.meepakker-save-heart[data-save-deal-id]')) return;

    var bottom = card.querySelector('.mp-clean-card-bottom');
    if (!bottom) return;

    var button = createButton(card);
    if (!button) return;

    /* Home dealcards use an absolute top-right save heart. Append it to the card
       instead of the bottom action row so it cannot collide with the CTA/circle. */
    if (card.closest && card.closest('body.home-cleanup #dealList')) {
      card.appendChild(button);
      return;
    }

    bottom.insertBefore(button, bottom.lastElementChild || null);
  }


  function updateMeepakkerHearts() {
    if (!STORE) return;
    var hearts = document.querySelectorAll('.meepakker-save-heart[data-save-deal-id]');
    Array.prototype.forEach.call(hearts, function (heart) {
      var id = String(heart.getAttribute('data-save-deal-id') || '').trim();
      var isSaved = STORE.isDealSaved(id);
      heart.classList.toggle('is-saved', !!isSaved);
      heart.textContent = isSaved ? '♥' : '♡';
      heart.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    });
  }

  function handleMeepakkerHeartClick(event) {
    var heart = event.target && event.target.closest ? event.target.closest('.meepakker-save-heart[data-save-deal-id]') : null;
    if (!heart || !STORE) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();

    var id = String(heart.getAttribute('data-save-deal-id') || '').trim();
    if (!id) return;

    STORE.toggleSavedDeal({ id: id });
    updateMeepakkerHearts();
    updateAllButtons();
  }

  function bindMeepakkerHearts() {
    document.addEventListener('click', handleMeepakkerHeartClick, true);
    document.addEventListener('keydown', function (event) {
      var key = event.key || event.code;
      if (key !== 'Enter' && key !== ' ') return;
      handleMeepakkerHeartClick(event);
    }, true);
  }

  function enhanceCards() {
    if (!STORE) return;
    var cards = document.querySelectorAll(CARD_SELECTOR);
    Array.prototype.forEach.call(cards, enhanceCard);
    updateAllButtons();
  }

  function updateAllButtons() {
    if (!STORE) return;
    updateMeepakkerHearts();
    var buttons = document.querySelectorAll('.' + BUTTON_CLASS + '[data-save-deal-id]');
    Array.prototype.forEach.call(buttons, function (button) {
      var id = String(button.getAttribute('data-save-deal-id') || '').trim();
      setButtonState(button, STORE.isDealSaved(id));
    });
  }

  function observeDealRoots() {
    if (!window.MutationObserver) return;
    var roots = [
      document.getElementById('featuredDeal'),
      document.getElementById('mpCleanTopDeals'),
      document.getElementById('mpCategoryDeals'),
      document.getElementById('mpMobileCategory')
    ].filter(Boolean);
    if (!roots.length) roots = [document.body];

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(function () {
        scheduled = false;
        enhanceCards();
      }, 0);
    });

    roots.forEach(function (root) {
      observer.observe(root, { childList: true, subtree: true });
    });
  }

  function init() {
    if (!STORE) return;
    bindMeepakkerHearts();
    enhanceCards();
    updateMeepakkerHearts();
    observeDealRoots();
  }

  ready(init);

  window.MeerPakkersSavedDealsUI = {
    version: 'v68-single-source',
    enhanceCards: enhanceCards,
    updateAllButtons: updateAllButtons
  };
})(window, document);
