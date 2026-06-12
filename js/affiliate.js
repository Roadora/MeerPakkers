/* MeerPakkers Affiliate Safety Layer v70
   Centrale affiliate-click laag voor toekomstige Daisycon / TradeTracker / Awin koppelingen.
   Overzicht-cards blijven intern naar /deal/. Alleen echte aanbieder-CTA's lopen via deze laag.

   Safety policy:
   - Live/approved/active links met echte http(s)-URL openen veilig in nieuw tabblad.
   - Placeholder/pending/paused links navigeren niet naar # en tonen een nette melding.
   - Clicks worden lokaal gelogd voor test/audit, maar blokkeren nooit de UI.
*/
(function(){
  var STORAGE_KEY = 'mp_affiliate_clicks_v70';
  var AFFILIATE_DATA_URL = '/data/affiliate-links.json';
  var linkMap = Object.create(null);
  var dataReady = false;
  var toastTimer = null;

  function isRealUrl(url){
    return /^https?:\/\//i.test(String(url || '').trim());
  }

  function isPlaceholderUrl(url){
    var value = String(url || '').trim();
    return !value || value === '#' || value.indexOf('#affiliate-') === 0 || value === 'about:blank';
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clicks.slice(-150)));
    } catch(e) {
      // Tracking mag nooit de gebruiker of CTA blokkeren.
    }
  }

  function getDealId(link){
    return link && (link.getAttribute('data-affiliate-deal-id') || link.getAttribute('data-deal-id') || '');
  }

  function getEntryForLink(link){
    var dealId = getDealId(link);
    return dealId && linkMap[dealId] ? linkMap[dealId] : null;
  }

  function preferredUrl(entry, link){
    if(entry && isRealUrl(entry.finalUrl)) return entry.finalUrl;
    if(entry && isRealUrl(entry.deepLink)) return entry.deepLink;
    if(link && isRealUrl(link.getAttribute('href'))) return link.getAttribute('href');
    return (entry && (entry.finalUrl || entry.deepLink)) || (link && link.getAttribute('href')) || '';
  }

  function statusFor(entry, link){
    return String((entry && entry.status) || (link && link.getAttribute('data-affiliate-status')) || '').toLowerCase() || 'placeholder';
  }

  function canNavigate(entry, link){
    var status = statusFor(entry, link);
    var url = preferredUrl(entry, link);
    return isRealUrl(url) && (status === 'live' || status === 'approved' || status === 'active');
  }

  function buildPayload(link, entry, blocked){
    var url = preferredUrl(entry, link);
    return {
      dealId: getDealId(link),
      providerId: (entry && entry.providerId) || link.getAttribute('data-affiliate-provider-id') || '',
      category: (entry && entry.category) || link.getAttribute('data-affiliate-category') || '',
      network: (entry && entry.network) || link.getAttribute('data-affiliate-network') || 'placeholder',
      campaignId: (entry && entry.campaignId) || link.getAttribute('data-affiliate-campaign-id') || '',
      trackingId: (entry && entry.trackingId) || link.getAttribute('data-affiliate-tracking-id') || '',
      merchantId: (entry && entry.merchantId) || link.getAttribute('data-affiliate-merchant-id') || '',
      status: statusFor(entry, link),
      href: url,
      blocked: !!blocked,
      sourcePath: window.location.pathname,
      clickedAt: new Date().toISOString()
    };
  }

  function ensureToast(){
    var toast = document.getElementById('mpAffiliateToast');
    if(toast) return toast;

    toast = document.createElement('div');
    toast.id = 'mpAffiliateToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.bottom = '24px';
    toast.style.transform = 'translateX(-50%) translateY(16px)';
    toast.style.zIndex = '9999';
    toast.style.maxWidth = 'min(420px, calc(100vw - 32px))';
    toast.style.padding = '14px 16px';
    toast.style.borderRadius = '18px';
    toast.style.background = '#06483d';
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 18px 48px rgba(20, 15, 10, .22)';
    toast.style.fontFamily = 'Inter, Arial, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '750';
    toast.style.lineHeight = '1.35';
    toast.style.textAlign = 'center';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity .18s ease, transform .18s ease';
    document.body.appendChild(toast);
    return toast;
  }

  function showPlaceholderMessage(link, entry){
    var provider = (entry && entry.providerId) || link.getAttribute('data-affiliate-provider-id') || 'de aanbieder';
    var toast = ensureToast();
    toast.textContent = 'Deze deal is nog demo. De veilige aanbieder-link voor ' + provider + ' wordt binnenkort gekoppeld.';
    window.clearTimeout(toastTimer);
    requestAnimationFrame(function(){
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    toastTimer = window.setTimeout(function(){
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(16px)';
    }, 3600);
  }

  function normalizeLink(link){
    if(!link) return;
    var entry = getEntryForLink(link);
    var url = preferredUrl(entry, link);
    var status = statusFor(entry, link);

    link.setAttribute('rel', 'sponsored noopener noreferrer');
    link.setAttribute('data-affiliate-status', status);

    if(canNavigate(entry, link)){
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.removeAttribute('aria-disabled');
      link.classList.remove('is-affiliate-placeholder');
    } else {
      // Laat de CTA klikbaar voor uitleg, maar voorkom navigatie naar een dode # link.
      link.setAttribute('href', url || '#');
      link.removeAttribute('target');
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('is-affiliate-placeholder');
    }
  }

  function normalizeAllLinks(){
    document.querySelectorAll('[data-affiliate-link="true"], .js-affiliate-link').forEach(normalizeLink);
  }

  function handleClick(event){
    var link = event.target.closest('[data-affiliate-link="true"], .js-affiliate-link');
    if(!link) return;

    var entry = getEntryForLink(link);
    normalizeLink(link);

    if(!canNavigate(entry, link)){
      event.preventDefault();
      writeClick(buildPayload(link, entry, true));
      showPlaceholderMessage(link, entry);
      return;
    }

    writeClick(buildPayload(link, entry, false));
  }

  function loadAffiliateData(){
    return fetch(AFFILIATE_DATA_URL, {cache: 'no-store'})
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(items){
        (Array.isArray(items) ? items : []).forEach(function(item){
          if(item && item.dealId) linkMap[item.dealId] = item;
        });
        dataReady = true;
        normalizeAllLinks();
      })
      .catch(function(){
        dataReady = true;
        normalizeAllLinks();
      });
  }

  function init(){
    normalizeAllLinks();
    loadAffiliateData();
    document.addEventListener('click', handleClick);
  }

  window.MPAffiliate = {
    init: init,
    normalizeAllLinks: normalizeAllLinks,
    isPlaceholderUrl: isPlaceholderUrl,
    isRealUrl: isRealUrl,
    readClicks: readClicks,
    getLinkStatus: function(link){ return statusFor(getEntryForLink(link), link); },
    isDataReady: function(){ return dataReady; }
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
