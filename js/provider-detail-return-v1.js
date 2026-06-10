/* MeerPakkers Provider Detail Return v1
   Zorgt dat provider-detail teruggaat naar de juiste context:
   - /providers/?groep=streaming als je vanuit een provider-categorie kwam
   - /streaming/ als een provider vanuit een categoriepagina werd geopend
   - anders /providers/
*/
(function(){
  function safeInternalPath(value){
    var v = String(value || "");
    if(!v || v.charAt(0) !== "/") return "";
    if(v.indexOf("//") === 0) return "";
    return v;
  }

  function categoryPath(category){
    return ({
      "mobiel":"/mobiel/",
      "sim-only":"/sim-only/",
      "internet-tv":"/internet-tv/",
      "streaming":"/streaming/"
    })[String(category || "")] || "";
  }

  function detectReturn(){
    var params = new URLSearchParams(window.location.search || "");
    var explicitReturn = safeInternalPath(params.get("return"));
    if(explicitReturn) return explicitReturn;

    var cat = params.get("category") || params.get("categorie") || params.get("groep");
    var catPath = categoryPath(cat);
    if(catPath) return catPath;

    try {
      var raw = sessionStorage.getItem("mp_provider_return_context_v1");
      if(raw){
        var ctx = JSON.parse(raw);
        if(ctx && ctx.savedAt && (Date.now() - ctx.savedAt < 30 * 60 * 1000)){
          var stored = safeInternalPath(ctx.returnTo);
          if(stored) return stored;
        }
      }
    } catch(e) {}

    try {
      if(document.referrer){
        var ref = new URL(document.referrer);
        if(ref.origin === window.location.origin){
          var path = ref.pathname + ref.search;
          if(path.indexOf("/providers/") === 0 || path === "/mobiel/" || path === "/sim-only/" || path === "/internet-tv/" || path === "/streaming/"){
            return path;
          }
        }
      }
    } catch(e) {}

    return "/providers/";
  }

  function apply(){
    var target = detectReturn();
    document.querySelectorAll(".mp-provider-detail-page .mp-mobile-back, .mp-provider-detail-shell .mp-mobile-back").forEach(function(a){
      a.setAttribute("href", target);
      a.setAttribute("aria-label", target.indexOf("/providers/") === 0 ? "Terug naar providers" : "Terug naar categorie");
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
