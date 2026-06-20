/* MeerPakkers Mobile Topbar Visible v18 */
(function(window, document){
  "use strict";
  function ready(fn){ if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  function savedCount(){
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
    var c=String(savedCount());
    document.querySelectorAll("[data-saved-deals-count], .mp-mobile-topbar-v18__count").forEach(function(el){ el.textContent=c; });
  }
  ready(update);
  window.addEventListener("storage", update);
  window.MeerPakkersMobileTopbar={version:"v18-visible", update:update};
})(window, document);
