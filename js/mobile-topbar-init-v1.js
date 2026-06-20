/* MeerPakkers Mobile Topbar Initializer v1
   Runs only for explicitly marked non-Home pages, below 768px.
*/
(function(window, document){
  "use strict";

  var MOBILE_QUERY = "(max-width: 767px)";
  var SELECTOR = "[data-mobile-topbar-page]";

  function isMobile(){
    return !window.matchMedia || window.matchMedia(MOBILE_QUERY).matches;
  }

  function getOptions(root){
    return {
      backHref: root.getAttribute("data-mp-back-href") || "/uitleg/",
      homeHref: root.getAttribute("data-mp-home-href") || "/",
      savedHref: root.getAttribute("data-mp-saved-href") || "/opgeslagen/",
      backLabel: root.getAttribute("data-mp-back-label") || "Terug naar MeerPakkers Uitleg",
      headerLabel: root.getAttribute("data-mp-header-label") || "MeerPakkers Uitleg artikel header"
    };
  }

  function mount(root){
    if(!root || !isMobile()){ return false; }
    if(root.getAttribute("data-mobile-topbar-mounted") === "v1"){ return true; }

    var api = window.MeerPakkersMobileTopbar;
    if(!api || typeof api.renderMarkup !== "function"){
      root.setAttribute("data-mobile-topbar-mounted", "waiting");
      return false;
    }

    try{
      root.innerHTML = api.renderMarkup(getOptions(root));
      root.setAttribute("data-mobile-topbar-mounted", "v1");
      if(typeof api.normalizeAll === "function"){ api.normalizeAll(); }
      if(typeof api.updateCounts === "function"){ api.updateCounts(); }
      return true;
    }catch(error){
      root.setAttribute("data-mobile-topbar-mounted", "failed");
      return false;
    }
  }

  function mountAll(){
    if(!isMobile()){ return; }
    var roots = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(roots, mount);
  }

  function boot(){
    mountAll();
    // Component script and saved-deals state can arrive later on legacy pages.
    window.setTimeout(mountAll, 80);
    window.setTimeout(mountAll, 300);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  }else{
    boot();
  }

  if(window.matchMedia){
    var media = window.matchMedia(MOBILE_QUERY);
    if(media.addEventListener){
      media.addEventListener("change", function(event){ if(event.matches){ mountAll(); } });
    }
  }

  window.MeerPakkersMobileTopbarInit = {
    version: "v1",
    mountAll: mountAll
  };
})(window, document);
