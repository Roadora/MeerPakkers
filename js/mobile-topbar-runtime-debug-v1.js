
/* Tijdelijke runtime-diagnose voor één Uitleg-artikel */
(function(){
  "use strict";

  function addLine(lines, key, value){
    lines.push(key + ": " + value);
  }

  function run(){
    var panel = document.getElementById("mp-mobile-topbar-runtime-debug");
    var root = document.getElementById("mp-mobile-topbar-debug-root");
    var lines = [];
    var api = window.MeerPakkersMobileTopbar;

    addLine(lines, "DOM ready", "ja");
    addLine(lines, "component API", api ? "aanwezig" : "ONTBREKT");
    addLine(lines, "renderMarkup", api && typeof api.renderMarkup === "function" ? "aanwezig" : "ONTBREKT");
    addLine(lines, "mountAll", api && typeof api.mountAll === "function" ? "aanwezig" : "ontbreekt (niet per se fout)");
    addLine(lines, "debug-root", root ? "gevonden" : "ONTBREKT");

    if(root){
      var rootStyle = window.getComputedStyle(root);
      addLine(lines, "root display", rootStyle.display);
      addLine(lines, "root visibility", rootStyle.visibility);
      addLine(lines, "root hoogte", Math.round(root.getBoundingClientRect().height) + "px");
    }

    if(root && api && typeof api.renderMarkup === "function"){
      try{
        root.innerHTML = api.renderMarkup({
          backHref: "../../uitleg/",
          homeHref: "../../",
          savedHref: "../../opgeslagen/",
          backLabel: "Terug naar MeerPakkers Uitleg",
          headerLabel: "DEBUG: MeerPakkers Uitleg artikel header"
        });
        var header = root.querySelector(".mp-mobile-top-header");
        addLine(lines, "render resultaat", header ? "header gemaakt" : "GEEN header");
        if(header){
          var hs = window.getComputedStyle(header);
          addLine(lines, "header display", hs.display);
          addLine(lines, "header hoogte", Math.round(header.getBoundingClientRect().height) + "px");
          addLine(lines, "header positie", hs.position);
        }
        if(typeof api.normalizeAll === "function"){ api.normalizeAll(root); }
        if(typeof api.updateCounts === "function"){ api.updateCounts(root); }
      }catch(error){
        addLine(lines, "render fout", error && error.message ? error.message : String(error));
      }
    }

    if(panel){
      panel.textContent = "TOPBAR DEBUG (tijdelijk)\n" + lines.join("\n");
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", run, {once:true});
  }else{
    run();
  }
})();
