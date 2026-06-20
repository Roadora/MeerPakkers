
/* MeerPakkers Topbar Component v14
   Runtime-safe single topbar component.
   If any page script removes the topbar, this restores the same component as first body child.
*/
(function(window, document){
  "use strict";

  var STYLE_ID = "mp-topbar-runtime-style-v14";
  var ROOT_SELECTOR = '[data-mp-topbar-root="v1"]';

  function currentScriptDir(){
    var scripts = document.getElementsByTagName("script");
    for(var i=scripts.length-1;i>=0;i--){
      var src = scripts[i].getAttribute("src") || "";
      if(src.indexOf("topbar-component-v1.js") !== -1){
        return src.replace(/js\/topbar-component-v1\.js.*$/, "");
      }
    }
    return "";
  }

  function assetPath(path){
    var base = currentScriptDir();
    if(base && base.indexOf("http") === 0) return base + path;
    if(base) return base + path;
    return "/" + path;
  }

  function ready(fn){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function currentPath(){
    return window.location.pathname || "/";
  }

  function isHome(){
    var p = currentPath();
    return p === "/" || p.endsWith("/index.html") || document.body.classList.contains("home-cleanup");
  }

  function backHref(){
    var p = currentPath();
    if(isHome()) return "#";
    if(p.indexOf("/uitleg/") !== -1 && !p.endsWith("/uitleg/")) return assetPath("uitleg/");
    return assetPath("");
  }

  function topbarMarkup(){
    return '<div data-mp-topbar-root="v1" class="mp-topbar-root">' +
      '<header class="mp-topbar" data-mp-topbar-component="v1" aria-label="MeerPakkers topbar">' +
        '<div class="mp-topbar__inner">' +
          '<a class="mp-topbar__back" href="/" aria-label="Terug">‹</a>' +
          '<a class="mp-topbar__brand" href="' + assetPath("") + '" aria-label="MeerPakkers home">' +
            '<img class="mp-topbar__logo" src="' + assetPath("assets/brand/mpplus-logo-balanced-v12.png") + '" alt="MP+">' +
            '<span class="mp-topbar__copy">' +
              '<span class="mp-topbar__slogan">meer cadeau,<br>meer korting.</span>' +
              '<strong class="mp-topbar__name">MeerPakkers</strong>' +
            '</span>' +
          '</a>' +
          '<nav class="mp-topbar__nav" aria-label="Hoofdnavigatie">' +
            '<a href="' + assetPath("mobiel/") + '">Mobiel</a>' +
            '<a href="' + assetPath("sim-only/") + '">Sim Only</a>' +
            '<a href="' + assetPath("internet-tv/") + '">Internet &amp; TV</a>' +
            '<a href="' + assetPath("streaming/") + '">Streaming</a>' +
            '<a href="' + assetPath("providers/") + '">Providers</a>' +
            '<a href="' + assetPath("kies-je-meepakker/") + '">Kies je Meepakker</a>' +
          '</nav>' +
          '<div class="mp-topbar__actions">' +
            '<input class="mp-topbar__search" id="mpTopbarSearch" type="search" placeholder="Zoek deals, providers..." aria-label="Zoek deals en providers">' +
            '<a class="mp-topbar__saved" href="' + assetPath("opgeslagen/") + '" aria-label="Opgeslagen deals">' +
              '<span class="mp-topbar__heart" aria-hidden="true">♡</span>' +
              '<span class="mp-topbar__saved-label">Opgeslagen</span>' +
              '<span class="mp-topbar__count" data-saved-deals-count>0</span>' +
            '</a>' +
          '</div>' +
          '<a class="mp-topbar__mobile-saved" href="' + assetPath("opgeslagen/") + '" aria-label="Opgeslagen deals">' +
            '<span class="mp-topbar__heart" aria-hidden="true">♡</span>' +
            '<span class="mp-topbar__count" data-saved-deals-count>0</span>' +
          '</a>' +
        '</div>' +
      '</header>' +
    '</div>';
  }

  function cssText(){
    return ':root{--mp-topbar-bg:#f7efe4;--mp-topbar-green:#06483d;--mp-topbar-gold:#c9952d}' +
    'html body>.mp-topbar-root,html body>[data-mp-topbar-root="v1"]{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;max-width:100%!important;height:110px!important;min-height:110px!important;max-height:110px!important;margin:0!important;padding:0!important;position:relative!important;z-index:2147483640!important;background:#f7efe4!important;overflow:visible!important;transform:none!important;box-sizing:border-box!important}' +
    '.mp-topbar,.mp-topbar *{box-sizing:border-box!important}.mp-topbar{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;max-width:100%!important;height:110px!important;min-height:110px!important;max-height:110px!important;margin:0!important;padding:0!important;position:relative!important;z-index:2147483640!important;background:#f7efe4!important;border-bottom:1px solid rgba(222,208,185,.78)!important;color:#06483d!important;font-family:Inter,Arial,sans-serif!important;box-shadow:none!important;overflow:visible!important;transform:none!important}.mp-topbar a{color:inherit!important;text-decoration:none!important}' +
    '.mp-topbar__inner{display:grid!important;grid-template-columns:40px minmax(0,1fr) 40px!important;align-items:center!important;gap:8px!important;width:100%!important;height:92px!important;min-height:92px!important;max-height:92px!important;margin:0 0 18px!important;padding:0!important;position:relative!important;overflow:visible!important}' +
    '.mp-topbar__back,.mp-topbar__mobile-saved{display:inline-flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;width:40px!important;height:40px!important;min-width:40px!important;min-height:40px!important;max-width:40px!important;max-height:40px!important;margin:0!important;padding:0!important;border-radius:14px!important;background:#fffdf8!important;border:1px solid rgba(222,208,185,.9)!important;color:#06483d!important;text-decoration:none!important;font-size:22px!important;line-height:1!important;font-weight:950!important;box-shadow:0 8px 18px rgba(6,72,61,.06)!important;position:relative!important;overflow:visible!important}' +
    '.mp-topbar__back{grid-column:1!important;justify-self:start!important}body.home-cleanup .mp-topbar__back{visibility:hidden!important;pointer-events:none!important}.mp-topbar__mobile-saved{grid-column:3!important;justify-self:end!important}' +
    '.mp-topbar__brand{grid-column:2!important;justify-self:center!important;align-self:center!important;display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;max-width:100%!important;height:92px!important;min-height:92px!important;max-height:92px!important;margin:0!important;padding:0!important;gap:0!important;background:none!important;text-indent:0!important;overflow:visible!important;position:static!important}' +
    '.mp-topbar__logo{display:block!important;width:140px!important;height:86px!important;min-width:140px!important;max-width:140px!important;flex:0 0 140px!important;margin:0 -25px 0 0!important;padding:0!important;object-fit:contain!important;object-position:center right!important;border:0!important;box-shadow:none!important;background:transparent!important}' +
    '.mp-topbar__copy{display:block!important;flex:0 1 auto!important;min-width:0!important;max-width:128px!important;margin:0!important;padding:0!important;line-height:1!important;color:#06483d!important;overflow:visible!important}.mp-topbar__slogan{display:block!important;color:#c9952d!important;font-size:15px!important;line-height:.98!important;font-weight:950!important;white-space:normal!important}.mp-topbar__name{display:block!important;color:#06483d!important;font-size:24px!important;line-height:1!important;font-weight:950!important;white-space:nowrap!important}' +
    '.mp-topbar__nav,.mp-topbar__actions,.mp-topbar__search,.mp-topbar__saved{display:none!important}.mp-topbar__heart{font-size:18px!important;line-height:1!important}.mp-topbar__count{min-width:18px!important;height:18px!important;padding:0 5px!important;border-radius:999px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#c9952d!important;color:#fffdf8!important;font-size:11px!important;line-height:18px!important;font-weight:950!important;z-index:3!important}.mp-topbar__mobile-saved .mp-topbar__count{position:absolute!important;top:-7px!important;right:-7px!important}' +
    'html body>[data-mp-topbar-root="v1"]+*,html body>.mp-topbar-root+*{position:relative!important;z-index:1!important}' +
    '@media(min-width:761px){html body>.mp-topbar-root,html body>[data-mp-topbar-root="v1"]{height:auto!important;min-height:96px!important;max-height:none!important;background:rgba(251,246,237,.96)!important}.mp-topbar{height:auto!important;min-height:96px!important;max-height:none!important;background:rgba(251,246,237,.96)!important;border-bottom:1px solid rgba(222,208,185,.82)!important}.mp-topbar__inner{width:100%!important;min-height:96px!important;height:auto!important;max-height:none!important;padding:0 48px!important;display:grid!important;grid-template-columns:360px minmax(520px,1fr) minmax(250px,.9fr)!important;gap:18px!important;align-items:center!important;margin:0!important}.mp-topbar__back,.mp-topbar__mobile-saved{display:none!important}.mp-topbar__brand{grid-column:1!important;justify-self:start!important;display:flex!important;align-items:center!important;width:360px!important;height:78px!important;min-height:78px!important;max-height:78px!important;background-image:url(' + assetPath("assets/brand/mpplus-desktop-lockup-v1.png") + ')!important;background-repeat:no-repeat!important;background-position:left center!important;background-size:contain!important;overflow:hidden!important;text-indent:-9999px!important}.mp-topbar__logo,.mp-topbar__copy{display:none!important}.mp-topbar__nav{grid-column:2!important;display:flex!important;align-items:center!important;justify-self:start!important;justify-content:flex-start!important;gap:6px!important;padding:6px!important;border:1px solid rgba(222,208,185,.76)!important;border-radius:999px!important;background:rgba(255,253,248,.76)!important;font-size:14px!important;font-weight:900!important;white-space:nowrap!important;max-width:100%!important;overflow-x:auto!important}.mp-topbar__nav a{min-height:38px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0 14px!important;border-radius:999px!important}.mp-topbar__actions{grid-column:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:12px!important}.mp-topbar__search{display:block!important;width:min(300px,100%)!important;height:44px!important;border:1px solid rgba(222,208,185,.9)!important;border-radius:999px!important;padding:0 16px!important;background:#fffdf8!important;color:#06483d!important;font-weight:750!important}.mp-topbar__saved{position:relative!important;min-height:44px!important;padding:0 16px 0 14px!important;border-radius:999px!important;border:1px solid rgba(222,208,185,.86)!important;background:#fffdf8!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;font-weight:950!important;white-space:nowrap!important}}';
  }

  function ensureStyle(){
    var style = document.getElementById(STYLE_ID);
    if(!style){
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = cssText();
      document.head.appendChild(style);
    }
  }

  function ensureTopbar(){
    if(!document.body) return null;
    ensureStyle();
    var root = document.querySelector(ROOT_SELECTOR);
    if(!root || !root.querySelector('.mp-topbar')){
      var temp = document.createElement("div");
      temp.innerHTML = topbarMarkup();
      var fresh = temp.firstChild;
      if(root && root.parentNode) root.parentNode.replaceChild(fresh, root);
      else document.body.insertBefore(fresh, document.body.firstChild);
      root = fresh;
    }
    if(document.body.firstElementChild !== root){
      document.body.insertBefore(root, document.body.firstElementChild);
    }
    return root;
  }

  function getSavedCount(){
    var keys = ["meerpakkers:savedDeals:v1", "meerpakkersSavedDeals", "mpSavedDeals"];
    try{
      for(var i=0;i<keys.length;i++){
        var raw = window.localStorage.getItem(keys[i]);
        if(!raw) continue;
        var parsed = JSON.parse(raw);
        if(Array.isArray(parsed)) return parsed.length;
        if(parsed && Array.isArray(parsed.items)) return parsed.items.length;
        if(parsed && typeof parsed === "object") return Object.keys(parsed).length;
      }
    }catch(e){}
    return 0;
  }

  function updateCounts(){
    var count = getSavedCount();
    var nodes = document.querySelectorAll("[data-saved-deals-count], .mp-topbar__count");
    Array.prototype.forEach.call(nodes, function(node){
      node.textContent = String(count);
      node.classList.toggle("has-saved", count > 0);
      node.classList.toggle("is-empty", count === 0);
    });
  }

  function enhance(){
    var root = ensureTopbar();
    if(!root) return;
    var back = root.querySelector(".mp-topbar__back");
    if(back){
      back.setAttribute("href", backHref());
      if(isHome()) back.setAttribute("aria-hidden", "true");
      else back.removeAttribute("aria-hidden");
    }
    var input = root.querySelector("#mpTopbarSearch");
    if(input && input.dataset.bound !== "true"){
      input.dataset.bound = "true";
      input.addEventListener("keydown", function(e){
        if(e.key !== "Enter") return;
        var q = (input.value || "").trim();
        if(!q) return;
        e.preventDefault();
        window.location.href = assetPath("deals/?q=" + encodeURIComponent(q));
      });
    }
    updateCounts();
  }

  function scheduleEnhance(){
    if(scheduleEnhance._busy) return;
    scheduleEnhance._busy = true;
    window.setTimeout(function(){
      scheduleEnhance._busy = false;
      enhance();
    }, 30);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance);
  else enhance();

  window.addEventListener("load", enhance);
  window.addEventListener("storage", updateCounts);
  window.setTimeout(enhance, 250);
  window.setTimeout(enhance, 1000);

  if(window.MutationObserver){
    var mo = new MutationObserver(function(){ scheduleEnhance(); });
    if(document.documentElement){
      mo.observe(document.documentElement, {childList:true, subtree:true});
    }
  }

  window.MeerPakkersTopbar = {
    version:"v14-runtime-safe",
    init:enhance,
    updateCounts:updateCounts
  };
})(window, document);
