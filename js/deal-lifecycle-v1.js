/* MeerPakkers Deal Lifecycle v1
   Centrale publicatieguard voor echte acties.
   Een deal is alleen publiek zichtbaar wanneer:
   - hij gepubliceerd en actief is;
   - de affiliate-status geschikt is voor live gebruik;
   - de startdatum is bereikt;
   - de einddatum nog niet voorbij is (einddatum telt volledig mee).
   Datumvergelijking gebruikt Europe/Amsterdam, zodat acties niet te vroeg
   verdwijnen rond middernacht of bij bezoekers in een andere tijdzone.
*/
(function(){
  "use strict";

  // Scheduled-campaign transport. Public pages keep requesting the familiar
  // static JSON paths; this small guard transparently prefers the server-side
  // endpoints, which can keep embargoed campaigns private until their start date.
  // If the API is unavailable, MeerPakkers falls back to the existing static data.
  (function installScheduledDataFetchGuard(){
    if(!window.fetch || window.__mpScheduledFetchGuardInstalled) return;
    window.__mpScheduledFetchGuardInstalled = true;
    var nativeFetch = window.fetch.bind(window);

    function requestUrl(input){
      if(typeof input === "string") return input;
      if(input && typeof input.url === "string") return input.url;
      return "";
    }

    function scheduledApiFor(url){
      var cleanUrl = String(url || "").split("?")[0];
      if(/(?:^|\/)data\/deals\.json$/.test(cleanUrl)) return "/api/deals";
      if(/(?:^|\/)data\/affiliate-links\.json$/.test(cleanUrl)) return "/api/affiliate-links";
      return "";
    }

    window.fetch = function(input, init){
      var originalUrl = requestUrl(input);
      var apiUrl = scheduledApiFor(originalUrl);
      if(!apiUrl) return nativeFetch(input, init);

      var apiInit = Object.assign({}, init || {}, {cache: "no-store"});
      return nativeFetch(apiUrl, apiInit).then(function(response){
        if(response && response.ok) return response;
        return nativeFetch(input, init);
      }).catch(function(){
        return nativeFetch(input, init);
      });
    };
  })();

  var LIVE_AFFILIATE_STATUSES = {
    approved: true,
    live: true
  };

  function clean(value){
    return String(value == null ? "" : value).trim().toLowerCase();
  }

  function isIsoDate(value){
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  function todayInAmsterdam(){
    try{
      var parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Amsterdam",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).formatToParts(new Date());
      var values = {};
      parts.forEach(function(part){
        if(part.type !== "literal") values[part.type] = part.value;
      });
      if(values.year && values.month && values.day){
        return values.year + "-" + values.month + "-" + values.day;
      }
    }catch(error){}
    var now = new Date();
    return [
      String(now.getFullYear()).padStart(4, "0"),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  function hasPassed(value, today){
    return isIsoDate(value) && value < today;
  }

  function hasNotStarted(value, today){
    return isIsoDate(value) && value > today;
  }

  function publicationReady(deal){
    if(!deal || typeof deal !== "object") return false;

    var publication = clean(deal.publicationStatus);
    if(publication && publication !== "published") return false;

    var dealStatus = clean(deal.dealStatus);
    if(dealStatus === "paused" || dealStatus === "expired" || dealStatus === "draft" || dealStatus === "demo") return false;

    var affiliateStatus = clean(deal.affiliateStatus);
    if(affiliateStatus && !LIVE_AFFILIATE_STATUSES[affiliateStatus]) return false;

    return true;
  }

  function stateFor(deal, dateOverride){
    if(!publicationReady(deal)) return "unavailable";

    var today = isIsoDate(dateOverride) ? dateOverride : todayInAmsterdam();
    if(hasNotStarted(deal.startsAt, today)) return "upcoming";
    if(hasPassed(deal.expiresAt, today)) return "expired";
    return "active";
  }

  function isCurrent(deal, dateOverride){
    return stateFor(deal, dateOverride) === "active";
  }

  function isUpcoming(deal, dateOverride){
    return stateFor(deal, dateOverride) === "upcoming";
  }

  function filterCurrent(deals, dateOverride){
    return (Array.isArray(deals) ? deals : []).filter(function(deal){
      return isCurrent(deal, dateOverride);
    });
  }

  window.MPDealLifecycle = Object.freeze({
    today: todayInAmsterdam,
    state: stateFor,
    isCurrent: isCurrent,
    isUpcoming: isUpcoming,
    filterCurrent: filterCurrent
  });
})();
