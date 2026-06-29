/* MeerPakkers — Kies je Meepakker result pages v2
   Meepakker-overzicht opent nu aparte resultaatpagina's.
*/
(function(){
  var labels = {
    ps5: 'PlayStation 5',
    airpods: 'AirPods',
    switch: 'Nintendo Switch',
    smartwatch: 'Smartwatch',
    cadeaukaart: 'Cadeaukaart',
    cashback: 'Cashback',
    tablet: 'Tablet',
    streaming: 'Gratis streaming',
    tickets: 'Tickets'
  };

  var slugs = {
    ps5: 'ps5',
    airpods: 'airpods',
    switch: 'nintendo-switch',
    smartwatch: 'smartwatch',
    cadeaukaart: 'cadeaukaart',
    cashback: 'cashback',
    tablet: 'tablet',
    streaming: 'gratis-streaming',
    tickets: 'tickets'
  };

  function keyFromSlug(slug){
    slug = String(slug || '').replace(/^\/+|\/+$/g, '');
    for(var key in slugs){
      if(slugs[key] === slug) return key;
    }
    return '';
  }

  function norm(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' en ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function textFor(deal){
    return norm([
      deal.provider,
      deal.providerId,
      deal.title,
      deal.category,
      deal.giftType,
      deal.giftName,
      (deal.benefits || []).join(' '),
      (deal.benefitTypes || []).join(' ')
    ].join(' '));
  }

  function matches(deal, key){
    var text = textFor(deal);
    if(key === 'ps5') return /\bps5\b|playstation/.test(text);
    if(key === 'airpods') return /airpods|oordopjes|buds|earbuds/.test(text);
    if(key === 'switch') return /nintendo|switch/.test(text);
    if(key === 'smartwatch') return /smartwatch|wearable|horloge/.test(text);
    if(key === 'cadeaukaart') return /cadeaukaart/.test(text);
    if(key === 'cashback') return /cashback/.test(text);
    if(key === 'tablet') return /\btablet\b|tab a11|galaxy tab|ipad/.test(text);
    if(key === 'streaming') return /streaming|netflix|disney|videoland|hbo|max|prime|skyshowtime|viaplay|espn|sport/.test(text);
    if(key === 'tickets') return /ticket|tickets|event|bioscoop|voucher/.test(text);
    return false;
  }

  function totalValue(deal){
    return Number(deal.totalBenefitValue || 0) ||
      Number(deal.giftValue || 0) + Number(deal.cashbackValue || 0) + Number(deal.discountValue || 0) + Number(deal.extraValue || 0);
  }

  function renderEmpty(root, label){
    root.innerHTML = '<article class="meepakker-empty-result">'
      + '<h2>' + label + ' deals</h2>'
      + '<p>Voor deze Meepakker staan er nu nog geen gecontroleerde acties klaar. We tonen alleen deals waarvan voordeel en voorwaarden zijn bevestigd.</p>'
      + '<a href="/kies-je-meepakker/">Terug naar alle meepakkers</a>'
      + '</article>';
  }

  function renderResults(root, selected, deals){
    var label = labels[selected] || 'Meepakker';
    var isResultPage = document.body && document.body.getAttribute('data-meepakker-result') === 'true';
    var grid = document.querySelector('.meepakker-grid');
    if(grid) grid.hidden = true;

    if(!deals.length){
      renderEmpty(root, label);
      root.hidden = false;
      return;
    }

    var head = isResultPage
      ? '<div class="meepakker-results-head meepakker-results-head--compact"><p>' + deals.length + ' deals gevonden</p></div>'
      : '<div class="meepakker-results-head"><a href="/kies-je-meepakker/" class="meepakker-results-back">Alle meepakkers</a><h2>' + label + ' deals</h2><p>' + deals.length + ' deals gevonden</p></div>';

    root.innerHTML = head
      + '<div class="meepakker-results-list">'
      + deals.map(function(deal){
          if(window.MPCardComponents && typeof window.MPCardComponents.renderNormalDealCard === 'function'){
            return window.MPCardComponents.renderNormalDealCard(deal);
          }
          return '<article class="meepakker-simple-result"><h3>' + (deal.provider || '') + '</h3><p>' + (deal.title || '') + '</p></article>';
        }).join('')
      + '</div>';
    root.hidden = false;

    if(window.MPSavedDealsUI && typeof window.MPSavedDealsUI.refresh === 'function'){
      window.MPSavedDealsUI.refresh();
    }
  }

  function init(){
    var params = new URLSearchParams(window.location.search);
    var selected = params.get('meepakker') || (document.body && document.body.getAttribute('data-meepakker')) || '';

    // Oude query-links blijven werken, maar sturen door naar de nieuwe aparte pagina.
    if(params.get('meepakker') && slugs[selected]){
      window.location.replace('/kies-je-meepakker/' + slugs[selected] + '/');
      return;
    }

    var root = document.getElementById('meepakkerResults');
    if(!selected || !root) return;

    fetch('/data/deals.json')
      .then(function(res){ return res.json(); })
      .then(function(data){
        var publicDeals = Array.isArray(data)
          ? (window.MPDealLifecycle ? window.MPDealLifecycle.filterCurrent(data) : data)
          : [];
        var deals = publicDeals.filter(function(deal){ return matches(deal, selected); });
        deals.sort(function(a,b){ return (Number(b.meerPakScore || 0) - Number(a.meerPakScore || 0)) || (totalValue(b) - totalValue(a)); });
        renderResults(root, selected, deals);
      })
      .catch(function(){ renderEmpty(root, labels[selected] || 'Meepakker'); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
