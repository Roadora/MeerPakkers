/* MeerPakkers Shared Mobile Topbar Component v5
   Single component contract without layout shift.
   - Does not rebuild the full header.
   - Normalizes one canonical brand/logo structure.
   - Updates only href/classes/counts.
*/
(function(window, document){
  "use strict";

  function safeHref(value, fallback){
    var v = String(value || "").trim();
    if(!v || v === "#") return fallback || "/";
    return v;
  }

  function heartSvgMarkup(){
    return '<span class="mp-saved-icon-v50" aria-hidden="true"><svg class="mp-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-6.8-4.2-9.3-8.1C.7 9 .9 5.5 3.4 3.7c2.1-1.5 5-.9 6.6 1.1L12 7.2l2-2.4c1.6-2 4.5-2.6 6.6-1.1 2.5 1.8 2.7 5.3.7 8.4-2.5 3.9-9.3 8.1-9.3 8.1z"/></svg></span>';
  }

  function getSavedCount(){
    try{
      if(window.MeerPakkersSavedDealsStore && typeof window.MeerPakkersSavedDealsStore.getSavedDeals === "function"){
        return window.MeerPakkersSavedDealsStore.getSavedDeals().length || 0;
      }
      var raw = window.localStorage && window.localStorage.getItem("meerpakkers:savedDeals:v1");
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    }catch(e){ return 0; }
  }

  function normalizedClassName(header){
    var keep = [];
    if(header.classList && header.classList.contains("mp-mobile-only")) keep.push("mp-mobile-only");
    return "mp-mobile-top-header mp-mobile-topbar-unified-v3" + (keep.length ? " " + keep.join(" ") : "");
  }

  function ensureBrandMarkup(brand){
    if(!brand) return;
    brand.className = "mp-mobile-brand-lockup";
    brand.setAttribute("href", safeHref(brand.getAttribute("href"), "/"));
    brand.setAttribute("aria-label", "MeerPakkers home");

    var logo = brand.querySelector(".mp-mobile-brand-logo");
    if(!logo){
      logo = document.createElement("span");
      brand.insertBefore(logo, brand.firstChild);
    }
    logo.className = "mp-mobile-brand-logo";
    logo.textContent = "MP+";

    var copy = brand.querySelector(".mp-mobile-brand-copy");
    if(!copy){
      copy = document.createElement("span");
      brand.appendChild(copy);
    }
    copy.className = "mp-mobile-brand-copy";

    var lines = copy.querySelector(".mp-mobile-brand-lines");
    if(!lines){
      lines = document.createElement("span");
      copy.insertBefore(lines, copy.firstChild);
    }
    lines.className = "mp-mobile-brand-lines";
    lines.innerHTML = "meer cadeau,<br>meer korting.";

    var name = copy.querySelector(".mp-mobile-brand-name");
    if(!name){
      name = document.createElement("strong");
      copy.appendChild(name);
    }
    name.className = "mp-mobile-brand-name";
    name.textContent = "MeerPakkers";
  }

  function ensureHeartMarkup(heart){
    if(!heart) return;
    heart.classList.add("mp-mobile-heart-link");
    heart.classList.remove("mp-mobile-heart-button");
    heart.setAttribute("href", safeHref(heart.getAttribute("href"), "/opgeslagen/"));
    if(!heart.querySelector(".mp-heart-icon")){
      var countNode = heart.querySelector("[data-saved-deals-count], .mp-mobile-heart-count, .mp-saved-count-v50");
      var count = countNode ? String(countNode.textContent || "0").trim() : "0";
      heart.innerHTML = heartSvgMarkup() + '<span class="mp-mobile-heart-count" data-saved-deals-count>' + count + '</span>';
    }
  }

  function normalize(header, options){
    if(!header) return;
    var opts = options || {};
    header.className = normalizedClassName(header);
    header.setAttribute("aria-label", "MeerPakkers pagina header");

    var back = header.querySelector(".mp-mobile-back");
    if(back){
      back.setAttribute("href", safeHref(opts.backHref || back.getAttribute("href"), "/"));
      if(!back.getAttribute("aria-label")) back.setAttribute("aria-label", opts.backLabel || "Terug");
    }

    ensureBrandMarkup(header.querySelector(".mp-mobile-brand-lockup"));
    ensureHeartMarkup(header.querySelector(".mp-mobile-heart-link, .mp-mobile-heart-button"));
    updateCounts();
  }

  function updateCounts(){
    var count = getSavedCount();
    var label = count ? "Opgeslagen deals: " + count : "Opgeslagen deals";
    var hearts = document.querySelectorAll(".mp-mobile-heart-link, .mp-mobile-heart-button");
    Array.prototype.forEach.call(hearts, function(heart){
      ensureHeartMarkup(heart);
      heart.classList.toggle("has-saved", count > 0);
      heart.setAttribute("aria-label", label);
      var countNode = heart.querySelector("[data-saved-deals-count], .mp-mobile-heart-count");
      if(countNode) countNode.textContent = String(count);
    });
  }

  function normalizeAll(){
    var headers = document.querySelectorAll(".mp-mobile-top-header");
    Array.prototype.forEach.call(headers, function(header){ normalize(header); });
    updateCounts();
  }

  window.MeerPakkersMobileTopbar = {
    version: "v5-single-component",
    normalize: normalize,
    normalizeAll: normalizeAll,
    updateCounts: updateCounts
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", normalizeAll);
  else normalizeAll();

  window.addEventListener("storage", updateCounts);

  if(window.MutationObserver){
    var scheduled = false;
    var observer = new MutationObserver(function(mutations){
      var shouldRun = false;
      for(var i=0; i<mutations.length; i++){
        if(mutations[i].type === "childList") { shouldRun = true; break; }
      }
      if(!shouldRun || scheduled) return;
      scheduled = true;
      window.setTimeout(function(){ scheduled = false; normalizeAll(); }, 40);
    });
    if(document.body) observer.observe(document.body, {childList:true, subtree:true});
  }
})(window, document);
