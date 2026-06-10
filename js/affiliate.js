/* MeerPakkers Affiliate Foundation v69
   Centrale affiliate-click laag voor toekomstige Daisycon / TradeTracker / Awin koppelingen.
   Overzicht-cards blijven intern naar /deal/. Alleen echte aanbieder-CTA's lopen via deze laag.
*/
(function(){
  var STORAGE_KEY = 'mp_affiliate_clicks_v69';

  function isPlaceholderUrl(url){
    return !url || url === '#' || String(url).indexOf('#affiliate-') === 0;
  }

  function safeJsonParse(value, fallback){
    try { return JSON.parse(value); } catch(e){ return fallback; }
  }

  function readClicks(){
    return safeJsonParse(localStorage.getItem(STORAGE_KEY), []);
  }

  function writeClick(payload){
    try {
      var clicks = readClicks();
      clicks.push(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clicks.slice(-100)));
    } catch(e) {
      // Tracking mag nooit de gebruiker of CTA blokkeren.
    }
  }

  function buildPayload(link){
    return {
      dealId: link.getAttribute('data-affiliate-deal-id') || '',
      providerId: link.getAttribute('data-affiliate-provider-id') || '',
      category: link.getAttribute('data-affiliate-category') || '',
      network: link.getAttribute('data-affiliate-network') || 'placeholder',
      campaignId: link.getAttribute('data-affiliate-campaign-id') || '',
      trackingId: link.getAttribute('data-affiliate-tracking-id') || '',
      merchantId: link.getAttribute('data-affiliate-merchant-id') || '',
      href: link.getAttribute('href') || '',
      sourcePath: window.location.pathname,
      clickedAt: new Date().toISOString()
    };
  }

  function normalizeLink(link){
    if(!link) return;
    link.setAttribute('rel', 'sponsored noopener noreferrer');
    if(!isPlaceholderUrl(link.getAttribute('href'))) {
      link.setAttribute('target', '_blank');
    } else {
      link.removeAttribute('target');
    }
  }

  function normalizeAllLinks(){
    document.querySelectorAll('[data-affiliate-link="true"], .js-affiliate-link').forEach(normalizeLink);
  }

  function handleClick(event){
    var link = event.target.closest('[data-affiliate-link="true"], .js-affiliate-link');
    if(!link) return;

    normalizeLink(link);
    var payload = buildPayload(link);
    writeClick(payload);

    if(isPlaceholderUrl(payload.href)){
      event.preventDefault();
      link.classList.add('is-affiliate-placeholder');
      link.setAttribute('aria-label', 'Affiliate link wordt binnenkort gekoppeld');
    }
  }

  function init(){
    normalizeAllLinks();
    document.addEventListener('click', handleClick);
  }

  window.MPAffiliate = {
    init: init,
    normalizeAllLinks: normalizeAllLinks,
    isPlaceholderUrl: isPlaceholderUrl,
    readClicks: readClicks
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
