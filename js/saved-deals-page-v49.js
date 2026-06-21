/* MeerPakkers Saved Deals Page v68
   Single Source cleanup: saved deals store only dealId; this page hydrates cards from data/deals.json.
   Legacy snapshots in localStorage are still supported as fallback.
*/
(function(window, document){
  'use strict';

  var STORE = window.MeerPakkersSavedDealsStore;
  var list = document.getElementById('mpSavedDealsList');
  if (list) list.classList.add('mp-shared-deal-grid');
  var count = document.getElementById('mpSavedCount');

  function clean(value){
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function toNumber(value){
    var normalized = String(value || '').replace(/[^0-9,.-]/g, '').replace(',', '.');
    var number = Number(normalized);
    return Number.isFinite(number) ? number : 0;
  }

  function normalizeCategory(value){
    var label = clean(value).toLowerCase();
    if (label === 'mobiel') return 'mobiel';
    if (label === 'sim only' || label === 'sim-only') return 'sim-only';
    if (label === 'internet & tv' || label === 'internet-tv') return 'internet-tv';
    if (label === 'streaming') return 'streaming';
    return label || 'deal';
  }

  function splitBenefitText(value){
    var text = clean(value);
    if (!text) return [];
    var matches = text.match(/(?:🎁|💸|🏷️|🏷|🎟️|🎟)[^🎁💸🏷🎟]+/g);
    if (matches && matches.length > 1) return matches.map(clean).filter(Boolean).slice(0, 2);
    return [text];
  }

  function legacySnapshotToDeal(deal){
    var benefits = Array.isArray(deal.benefits) ? deal.benefits.map(clean).filter(Boolean) : splitBenefitText(deal.benefit);
    return {
      id: clean(deal.id),
      provider: clean(deal.provider) || 'Aanbieder',
      title: clean(deal.title || deal.name) || 'Actie met extra voordeel',
      category: normalizeCategory(deal.category),
      icon: clean(deal.icon),
      benefits: benefits.length ? benefits : ['🎁 Extra voordeel'],
      meerPakScore: toNumber(deal.meerPakScore) || deal.meerPakScore || '',
      totalBenefitValue: toNumber(deal.totalBenefit),
      url: deal.url
    };
  }

  function renderEmpty(){
    list.innerHTML = '<div class="mp-saved-empty">' +
      '<strong>Nog geen deals opgeslagen</strong>' +
      '<p>Gebruik de knop “Opslaan” op een dealcard om je favoriete deals hier terug te vinden.</p>' +
      '<a href="../">Bekijk deals</a>' +
    '</div>';
  }

  function loadDealsJson(){
    return fetch('../data/deals.json', {cache:'no-store'})
      .then(function(res){ if(res.ok) return res; return fetch('/data/deals.json', {cache:'no-store'}); })
      .then(function(res){ return res.json(); })
      .then(function(deals){ return Array.isArray(deals) ? deals : []; })
      .catch(function(){ return []; });
  }

  function dealId(deal){
    return clean(deal && deal.id);
  }

  function hydrateSavedDeals(savedItems, sourceDeals){
    var byId = {};
    sourceDeals.forEach(function(deal){
      if(deal && deal.id) byId[String(deal.id)] = deal;
    });

    return savedItems.map(function(item){
      var id = clean(item && item.id);
      if(id && byId[id]) return byId[id];
      return legacySnapshotToDeal(item || {});
    }).filter(function(deal){ return deal && dealId(deal); });
  }

  function render(){
    if (!STORE || !list || !count) return;
    var savedItems = STORE.getSavedDeals();
    count.textContent = savedItems.length === 1 ? '1 opgeslagen' : savedItems.length + ' opgeslagen';

    if (!savedItems.length) {
      renderEmpty();
      return;
    }

    if (!window.MPCardComponents || typeof window.MPCardComponents.renderNormalDealCard !== 'function') {
      list.innerHTML = '<div class="mp-saved-empty"><strong>Opgeslagen deals konden niet worden geladen</strong><p>Probeer de pagina opnieuw te openen.</p><a href="../">Bekijk deals</a></div>';
      return;
    }

    list.innerHTML = '<div class="mp-saved-empty"><strong>Opgeslagen deals laden...</strong></div>';

    loadDealsJson().then(function(sourceDeals){
      var hydratedDeals = hydrateSavedDeals(savedItems, sourceDeals);
      list.innerHTML = hydratedDeals.map(function(deal){
        return window.MPCardComponents.renderNormalDealCard(deal, deal.category, { mode: 'saved' });
      }).join('');
    });
  }

  function onClick(event){
    var button = event.target.closest('[data-remove-saved-deal]');
    if (!button || !STORE) return;
    event.preventDefault();
    var id = button.getAttribute('data-remove-saved-deal');
    STORE.removeSavedDeal(id);
    render();
    if (window.MeerPakkersSavedDealsHeader && typeof window.MeerPakkersSavedDealsHeader.updateCounts === 'function') {
      window.MeerPakkersSavedDealsHeader.updateCounts();
    }
  }

  document.addEventListener('click', onClick);
  render();
})(window, document);
