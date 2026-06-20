/* MeerPakkers Mobile Topbar Restore v15 - count/back sync only */
(function(window, document){
  "use strict";
  function ready(fn){ if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  function count(){
    var keys=["meerpakkers:savedDeals:v1","meerpakkersSavedDeals","mpSavedDeals"];
    try{
      for(var i=0;i<keys.length;i++){
        var raw=localStorage.getItem(keys[i]); if(!raw) continue;
        var v=JSON.parse(raw);
        if(Array.isArray(v)) return v.length;
        if(v && Array.isArray(v.items)) return v.items.length;
        if(v && typeof v==="object") return Object.keys(v).length;
      }
    }catch(e){}
    return 0;
  }
  function update(){
    var c=String(count());
    document.querySelectorAll("[data-saved-deals-count], .mp-mobile-topbar-v15__count").forEach(function(el){ el.textContent=c; });
  }
  ready(update);
  window.addEventListener("storage", update);
  window.MeerPakkersMobileTopbarRestore={version:"v15", update:update};
})(window, document);
