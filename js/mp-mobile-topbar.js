/* MeerPakkers Global Mobile Topbar v1
   The only mobile header for every non-Home page.
   Home deliberately does not load this file.
*/
(function(window, document){
  "use strict";

  var ROOT_ID = "mp-global-mobile-topbar-root";
  var STORAGE_KEY = "meerpakkers:savedDeals:v1";

  function normalPath(){
    var path = window.location.pathname || "/";
    path = path.replace(/\/index\.html$/i, "/");
    return path;
  }

  function routeConfig(){
    var path = normalPath().replace(/\/+$/, "") || "/";
    var config = {
      backHref: "/",
      backLabel: "Terug naar home"
    };

    if(path === "/uitleg"){
      return config;
    }
    if(path.indexOf("/uitleg/") === 0){
      return { backHref: "/uitleg/", backLabel: "Terug naar MeerPakkers Uitleg" };
    }
    if(path === "/providers"){
      return config;
    }
    if(path.indexOf("/providers/") === 0){
      return { backHref: "/providers/", backLabel: "Terug naar providers" };
    }
    if(path === "/deals"){
      return config;
    }
    if(path.indexOf("/deals/") === 0 || path === "/deal"){
      return { backHref: "/deals/", backLabel: "Terug naar deals" };
    }
    if(path === "/opgeslagen"){
      return config;
    }
    return config;
  }

  function savedCount(){
    try{
      if(window.MeerPakkersSavedDealsStore &&
          typeof window.MeerPakkersSavedDealsStore.getSavedDeals === "function"){
        var stored = window.MeerPakkersSavedDealsStore.getSavedDeals();
        return Array.isArray(stored) ? stored.length : 0;
      }
      var raw = window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.length : 0;
    }catch(error){
      return 0;
    }
  }

  function render(){
    var existing = document.getElementById(ROOT_ID);
    if(existing){ return existing; }

    var config = routeConfig();
    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "mp-global-mobile-topbar-shell";
    root.setAttribute("data-mp-global-mobile-topbar", "v1");

    root.innerHTML =
      '<header class="mp-global-mobile-topbar" aria-label="MeerPakkers navigatie">' +
        '<a class="mp-global-mobile-topbar__back" href="' + config.backHref + '" aria-label="' + config.backLabel + '">' +
          '<span aria-hidden="true">‹</span>' +
        '</a>' +
        '<a class="mp-global-mobile-topbar__brand" href="/" aria-label="MeerPakkers home">' +
          '<img src="/assets/brand/mpplus-logo-transparent-v1.png" alt="" class="mp-global-mobile-topbar__mark">' +
          '<span class="mp-global-mobile-topbar__wordmark">' +
            '<span class="mp-global-mobile-topbar__tagline">meer cadeau,<br>meer korting.</span>' +
            '<strong>MeerPakkers</strong>' +
          '</span>' +
        '</a>' +
        '<a class="mp-global-mobile-topbar__saved" href="/opgeslagen/" aria-label="Opgeslagen deals">' +
          '<span class="mp-global-mobile-topbar__heart" aria-hidden="true">♡</span>' +
          '<span class="mp-global-mobile-topbar__count" data-mp-global-saved-count>0</span>' +
        '</a>' +
      '</header>';

    document.body.insertBefore(root, document.body.firstChild);
    return root;
  }

  function updateCount(){
    var count = savedCount();
    var label = count ? ("Opgeslagen deals: " + count) : "Opgeslagen deals";
    document.querySelectorAll("[data-mp-global-saved-count]").forEach(function(node){
      node.textContent = String(count);
      node.hidden = count < 1;
    });
    var saved = document.querySelector(".mp-global-mobile-topbar__saved");
    if(saved){
      saved.setAttribute("aria-label", label);
      saved.classList.toggle("has-saved", count > 0);
    }
  }

  function boot(){
    render();
    updateCount();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  }else{
    boot();
  }

  window.addEventListener("storage", function(event){
    if(event.key === STORAGE_KEY){ updateCount(); }
  });

  window.MeerPakkersGlobalMobileTopbar = {
    version: "v1",
    render: render,
    updateCount: updateCount
  };
})(window, document);
