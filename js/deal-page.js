/* MeerPakkers Static Deal Page Enhancer v68
   Static /deals/{seoSlug}.html pages are SEO landing pages.
   This script only hydrates related deals from data/deals.json.
   The dynamic app detail route remains /deal/?deal={id} via deal-detail-v1.js.
*/
(function(){
  'use strict';

  function norm(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g,' en ')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function currentDealId(){
    var bodyId = document.body && document.body.dataset ? document.body.dataset.dealId : '';
    if(bodyId) return bodyId;
    var path = window.location.pathname.split('/').pop() || '';
    return path.replace(/\.html$/i, '');
  }

  function score(deal){
    return Number(deal.meerPakScore || deal.score || 0);
  }

  function value(deal){
    return Number(deal.totalBenefitValue || deal.benefitValue || 0);
  }

  function detailUrl(deal){
    var id = deal.id || deal.seoSlug || norm((deal.provider || '') + ' ' + (deal.title || ''));
    return '/deal/?deal=' + encodeURIComponent(id) + (deal.category ? '&category=' + encodeURIComponent(deal.category) : '');
  }

  function renderRelated(deal, allDeals){
    var relatedEl = document.getElementById('relatedDeals');
    if(!relatedEl || !deal) return;

    var related = allDeals
      .filter(function(item){ return item.id !== deal.id && item.seoSlug !== deal.seoSlug && (item.category === deal.category || item.providerId === deal.providerId); })
      .sort(function(a,b){ return (score(b)-score(a)) || (value(b)-value(a)); })
      .slice(0,3);

    relatedEl.innerHTML = related.map(function(item){
      return '<a class="deal-related-card" href="' + detailUrl(item) + '">' +
        '<strong>' + (item.provider || 'Aanbieder') + ' - ' + (item.title || 'Deal') + '</strong>' +
        '<span>€' + value(item).toLocaleString('nl-NL') + ' voordeel</span>' +
      '</a>';
    }).join('');
  }

  function init(){
    var requested = currentDealId();
    fetch('/data/deals.json', {cache:'no-store'})
      .then(function(res){ return res.json(); })
      .then(function(deals){
        deals = Array.isArray(deals) ? deals : [];
        var deal = deals.find(function(item){ return item.id === requested || item.seoSlug === requested || norm(item.id) === norm(requested) || norm(item.seoSlug) === norm(requested); });
        renderRelated(deal, deals);
      })
      .catch(function(){});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
