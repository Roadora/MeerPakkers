/* MeerPakkers V20.6 - Desktop browser-back scroll restore
   Doel: wanneer een bezoeker vanaf Home op een dealcard klikt en daarna
   de browser-terugknop gebruikt, terugkeren naar dezelfde dealcard.
   Scope: desktop Home only. Geen mobile/category/deal-detail wijzigingen.
*/
(function(){
  'use strict';

  var KEY = 'mp_home_desktop_return_v20_6';
  var MAX_AGE = 30 * 60 * 1000;
  var restored = false;

  function isDesktopHome(){
    return window.matchMedia && window.matchMedia('(min-width: 901px)').matches &&
      (window.location.pathname === '/' || /\/index\.html$/i.test(window.location.pathname));
  }

  function getScrollY(){
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function safeParse(raw){
    try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
  }

  function saveReturn(card){
    if(!isDesktopHome() || !card) return;
    var dealId = card.getAttribute('data-deal-id') || '';
    if(!dealId) return;

    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        dealId: dealId,
        path: window.location.pathname + window.location.search,
        scrollY: getScrollY(),
        savedAt: Date.now()
      }));
    } catch(e) {}
  }

  function readReturn(){
    if(!isDesktopHome()) return null;
    var data = null;
    try { data = safeParse(sessionStorage.getItem(KEY)); } catch(e) { data = null; }
    if(!data || !data.dealId || !data.savedAt) return null;
    if(Date.now() - Number(data.savedAt) > MAX_AGE){
      try { sessionStorage.removeItem(KEY); } catch(e) {}
      return null;
    }
    return data;
  }

  function restoreOnce(){
    if(restored) return true;
    var data = readReturn();
    if(!data) return false;

    var selector = '[data-deal-id="' + (window.CSS && CSS.escape ? CSS.escape(data.dealId) : String(data.dealId).replace(/"/g, '\\"')) + '"]';
    var card = document.querySelector('#dealList ' + selector) || document.querySelector('#featuredDeal ' + selector) || document.querySelector(selector);

    if(card){
      restored = true;
      try { history.scrollRestoration = 'manual'; } catch(e) {}
      window.setTimeout(function(){
        try { card.scrollIntoView({block:'center', inline:'nearest'}); }
        catch(e){ window.scrollTo(0, Number(data.scrollY || 0)); }
        try { sessionStorage.removeItem(KEY); } catch(e) {}
      }, 40);
      return true;
    }

    return false;
  }

  function scheduleRestore(){
    if(!isDesktopHome()) return;
    [0, 80, 180, 350, 700, 1200].forEach(function(delay){
      window.setTimeout(restoreOnce, delay);
    });
  }

  document.addEventListener('click', function(event){
    if(!isDesktopHome()) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href*="/deal/"]') : null;
    if(!link) return;
    var card = link.closest('#dealList [data-deal-id], #featuredDeal [data-deal-id]');
    saveReturn(card);
  }, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleRestore);
  else scheduleRestore();

  window.addEventListener('pageshow', function(){
    restored = false;
    scheduleRestore();
  });

  try {
    var observer = new MutationObserver(function(){ restoreOnce(); });
    document.addEventListener('DOMContentLoaded', function(){
      var list = document.getElementById('dealList');
      var featured = document.getElementById('featuredDeal');
      if(list) observer.observe(list, {childList:true, subtree:true});
      if(featured) observer.observe(featured, {childList:true, subtree:true});
    });
  } catch(e) {}
})();
