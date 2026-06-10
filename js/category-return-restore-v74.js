/* MeerPakkers Category Return Restore v74
   Herstelt de scrollpositie/dealcard wanneer een bezoeker vanaf een categoriepagina
   naar een deal gaat en via Terug terugkomt.
*/
(function(){
  var STORAGE_PREFIX = "mp_category_return_v74:";
  var MAX_AGE_MS = 30 * 60 * 1000;

  function isCategoryPage(){
    var body = document.body || {};
    return !!(
      body.dataset && body.dataset.categoryId ||
      body.getAttribute && body.getAttribute("data-meepakker-result") === "true" ||
      document.getElementById("mpMobileCategory") ||
      document.getElementById("categoryDealList") ||
      document.getElementById("meepakkerResults")
    );
  }

  function keyForCurrentPage(){
    return STORAGE_PREFIX + window.location.pathname + window.location.search;
  }

  function saveReturnPosition(link){
    if(!isCategoryPage()) return;

    var card = link && link.closest ? link.closest("[data-deal-id], .mp-deal-card-component, .mp-clean-deal-card, .mp-category-deal") : null;
    var dealId = card && card.getAttribute ? card.getAttribute("data-deal-id") : "";
    if(!dealId) dealId = inferDealIdFromLink(link);

    var returnTo = window.location.pathname + window.location.search;
    var category = currentCategoryFromPage();

    try {
      sessionStorage.setItem(keyForCurrentPage(), JSON.stringify({
        path: returnTo,
        scrollY: window.scrollY || document.documentElement.scrollTop || 0,
        dealId: dealId || "",
        savedAt: Date.now()
      }));

      // Centrale return-context voor de dynamische dealdetailpagina.
      // Dit voorkomt dat oude provider/static fallbacks de terugroute kapen.
      if(dealId){
        sessionStorage.setItem("mp_deal_return_context_v1", JSON.stringify({
          dealId: dealId,
          category: category || "",
          returnTo: returnTo,
          scrollKey: keyForCurrentPage(),
          savedAt: Date.now()
        }));
      }
    } catch(e) {}
  }

  function findDealCard(dealId){
    if(!dealId) return null;
    if(window.CSS && CSS.escape){
      return document.querySelector('[data-deal-id="' + CSS.escape(dealId) + '"]');
    }
    return document.querySelector('[data-deal-id="' + String(dealId).replace(/"/g, '\\"') + '"]');
  }

  function restoreReturnPosition(){
    if(!isCategoryPage()) return;

    var raw;
    try { raw = sessionStorage.getItem(keyForCurrentPage()); } catch(e) { raw = null; }
    if(!raw) return;

    var data;
    try { data = JSON.parse(raw); } catch(e) { data = null; }
    if(!data || !data.savedAt || Date.now() - data.savedAt > MAX_AGE_MS){
      try { sessionStorage.removeItem(keyForCurrentPage()); } catch(e) {}
      return;
    }

    var tries = 0;
    var maxTries = 40;

    function attempt(){
      tries += 1;
      var card = findDealCard(data.dealId);
      if(card){
        card.scrollIntoView({block: "center", inline: "nearest"});
        try { sessionStorage.removeItem(keyForCurrentPage()); } catch(e) {}
        return;
      }

      var listReady = document.querySelector("[data-deal-id], .mp-deal-card-component, .mp-clean-deal-card, .mp-category-deal");
      if(listReady || tries >= maxTries){
        window.scrollTo(0, Number(data.scrollY || 0));
        try { sessionStorage.removeItem(keyForCurrentPage()); } catch(e) {}
        return;
      }

      window.setTimeout(attempt, 100);
    }

    window.setTimeout(attempt, 80);
  }


  function currentCategoryFromPage(){
    var body = document.body || {};
    if(body.dataset && body.dataset.categoryId) return body.dataset.categoryId;
    var path = window.location.pathname || "";
    if(path.indexOf("/streaming/") === 0) return "streaming";
    if(path.indexOf("/internet-tv/") === 0) return "internet-tv";
    if(path.indexOf("/sim-only/") === 0) return "sim-only";
    if(path.indexOf("/mobiel/") === 0) return "mobiel";
    return "";
  }

  function inferDealIdFromLink(link){
    if(!link) return "";
    var card = link.closest ? link.closest("[data-deal-id]") : null;
    var cardId = card && card.getAttribute ? card.getAttribute("data-deal-id") : "";
    if(cardId) return cardId;
    try {
      var u = new URL(link.getAttribute("href"), window.location.origin);
      var q = u.searchParams.get("deal");
      if(q) return q;
      var m = u.pathname.match(/\/deals\/([^\/]+)\.html$/);
      if(m) return m[1];
    } catch(e) {}
    return "";
  }

  function hardenDealLink(link){
    if(!isCategoryPage() || !link || !link.getAttribute) return;
    var href = link.getAttribute("href") || "";
    if(href.indexOf("/deal/") === -1 && href.indexOf("/deals/") === -1) return;

    var category = currentCategoryFromPage();
    if(!category) return;

    var dealId = inferDealIdFromLink(link);
    if(!dealId) return;

    var returnTo = window.location.pathname + window.location.search;
    var params = new URLSearchParams();
    params.set("deal", dealId);
    params.set("category", category);
    params.set("return", returnTo);
    link.setAttribute("href", "/deal/?" + params.toString());
  }

  document.addEventListener("click", function(event){
    var link = event.target && event.target.closest ? event.target.closest('a[href*="/deal/"], a[href^="../deal/"], a[href^="/deal/"], a[href*="/deals/"], a[href^="../deals/"], a[href^="/deals/"]') : null;
    if(link){
      hardenDealLink(link);
      saveReturnPosition(link);
    }
  }, true);

  function hardenExistingDealLinks(){
    if(!isCategoryPage()) return;
    var links = document.querySelectorAll('a[href*="/deal/"], a[href^="../deal/"], a[href^="/deal/"], a[href*="/deals/"], a[href^="../deals/"], a[href^="/deals/"]');
    Array.prototype.forEach.call(links, hardenDealLink);
  }

  function startLinkObserver(){
    if(!isCategoryPage() || !window.MutationObserver) return;
    var observer = new MutationObserver(function(){ hardenExistingDealLinks(); });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    window.setTimeout(function(){ try { observer.disconnect(); } catch(e){} }, 10000);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){ hardenExistingDealLinks(); startLinkObserver(); restoreReturnPosition(); });
  } else {
    hardenExistingDealLinks(); startLinkObserver(); restoreReturnPosition();
  }

  window.addEventListener("pageshow", function(event){
    if(event.persisted) restoreReturnPosition();
  });
})();
