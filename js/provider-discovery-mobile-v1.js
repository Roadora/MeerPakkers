/* Providers Stable v1 */
(function(){
  const GROUPS = {
    all:{title:"Alle providers",subtitle:"Kies een provider en bekijk alle deals.",categories:["mobiel","sim-only","internet-tv","streaming"]},
    "mobiel":{title:"Mobiele providers",subtitle:"Providers met mobiele abonnementen.",categories:["mobiel"]},
    "sim-only":{title:"Sim Only providers",subtitle:"Providers met sim only deals.",categories:["sim-only"]},
    "internet-tv":{title:"Internet & TV providers",subtitle:"Internet- en tv-aanbieders.",categories:["internet-tv"]},
    "streaming":{title:"Streamingdiensten",subtitle:"Streamingdiensten met acties.",categories:["streaming"]}
  };
  let cachedDeals = null;
  let currentProviderGroup = "all";

  function slugify(value){
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g," en ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  }
  function normalizeCategory(value){
    const v = String(value || "").toLowerCase();
    if(v.includes("sim")) return "sim-only";
    if(v.includes("internet") || v.includes("tv")) return "internet-tv";
    if(v.includes("stream")) return "streaming";
    return "mobiel";
  }
  async function getDeals(){
    if(Array.isArray(cachedDeals)) return cachedDeals;
    if(Array.isArray(window.MEERPAKKERS_DEALS)){
      cachedDeals = window.MEERPAKKERS_DEALS;
      return cachedDeals;
    }
    try{
      const response = await fetch("/data/deals.json", { cache:"no-store" });
      if(!response.ok) throw new Error("Kan /data/deals.json niet laden");
      const data = await response.json();
      cachedDeals = Array.isArray(data) ? data : [];
      window.MEERPAKKERS_DEALS = cachedDeals;
      return cachedDeals;
    }catch(error){
      console.warn("[MeerPakkers] Providerdata niet geladen:", error);
      cachedDeals = [];
      return cachedDeals;
    }
  }
  function providerName(deal){ return deal.provider || deal.providerName || deal.brand || "Provider"; }
  function providerId(deal){ return deal.providerId || slugify(providerName(deal)); }
  function currentReturnUrl(){
    var path = window.location.pathname || "/providers/";
    var params = new URLSearchParams(window.location.search || "");
    if(currentProviderGroup && currentProviderGroup !== "all") params.set("groep", currentProviderGroup);
    else params.delete("groep");
    var qs = params.toString();
    return path + (qs ? "?" + qs : "");
  }

  const PROVIDER_SCROLL_KEY_PREFIX = "mp_provider_scroll_restore_v1:";
  function providerScrollKey(){
    return PROVIDER_SCROLL_KEY_PREFIX + currentReturnUrl();
  }
  function saveProviderScroll(providerId){
    try{
      sessionStorage.setItem(providerScrollKey(), JSON.stringify({
        providerId: providerId || "",
        scrollY: window.scrollY || document.documentElement.scrollTop || 0,
        savedAt: Date.now()
      }));
    }catch(e){}
  }
  function restoreProviderScroll(){
    let raw = null;
    try{ raw = sessionStorage.getItem(providerScrollKey()); }catch(e){}
    if(!raw) return;
    let data = null;
    try{ data = JSON.parse(raw); }catch(e){}
    if(!data || !data.savedAt || Date.now() - data.savedAt > 30 * 60 * 1000){
      try{ sessionStorage.removeItem(providerScrollKey()); }catch(e){}
      return;
    }
    let tries = 0;
    function attempt(){
      tries += 1;
      let card = null;
      if(data.providerId && window.CSS && CSS.escape){
        card = document.querySelector('[data-provider-id="' + CSS.escape(data.providerId) + '"]');
      } else if(data.providerId){
        card = document.querySelector('[data-provider-id="' + String(data.providerId).replace(/"/g, '\\"') + '"]');
      }
      if(card){
        card.scrollIntoView({block:"center", inline:"nearest"});
        try{ sessionStorage.removeItem(providerScrollKey()); }catch(e){}
        return;
      }
      const ready = document.querySelector(".mp-discovery-card");
      if(ready || tries >= 40){
        window.scrollTo(0, Number(data.scrollY || 0));
        try{ sessionStorage.removeItem(providerScrollKey()); }catch(e){}
        return;
      }
      window.setTimeout(attempt, 100);
    }
    window.setTimeout(attempt, 80);
  }
  function providerUrl(provider){
    const id = provider && (provider.id || provider.providerId) ? (provider.id || provider.providerId) : slugify(provider && provider.name ? provider.name : provider);
    const url = new URL("/providers/" + id + ".html", window.location.origin);
    url.searchParams.set("return", currentReturnUrl());
    return url.pathname + url.search;
  }
  function buildProviderStats(deals, categories){
    const wanted = new Set(categories);
    const map = new Map();
    deals.forEach(deal => {
      const cat = normalizeCategory(deal.category || deal.type || deal.productCategory);
      if(!wanted.has(cat)) return;
      const name = providerName(deal);
      const id = providerId(deal);
      const key = String(id || name).toLowerCase();
      if(!map.has(key)) map.set(key, {id, name, count:0});
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a,b) => (b.count-a.count) || a.name.localeCompare(b.name,"nl"));
  }
  function providerCard(provider){
    const dealsText = provider.count === 1 ? "1 deal" : provider.count + " deals";
    return `<a class="mp-discovery-card" data-provider-id="${provider.id}" href="${providerUrl(provider)}"><span class="mp-discovery-card-main"><strong>${provider.name}</strong><small>${dealsText}</small><em>Bekijk</em></span></a>`;
  }
  function init(){
    const list = document.getElementById("providerDiscoveryList");
    const title = document.getElementById("providerResultsTitle");
    const subtitle = document.getElementById("providerResultsSubtitle");
    const count = document.getElementById("providerResultsCount");
    const results = document.querySelector(".provider-discovery-results");
    const buttons = Array.from(document.querySelectorAll("[data-provider-group]"));
    if(!list || !title || !subtitle || !count || !results) return;
    const initialParams = new URLSearchParams(window.location.search || "");
    let activeGroup = initialParams.get("groep") || initialParams.get("providerGroup") || initialParams.get("category") || "all";
    if(!GROUPS[activeGroup]) activeGroup = "all";
    currentProviderGroup = activeGroup;
    function syncGroupUrl(){
      currentProviderGroup = activeGroup;
      const params = new URLSearchParams(window.location.search || "");
      if(activeGroup && activeGroup !== "all") params.set("groep", activeGroup);
      else params.delete("groep");
      const next = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", next);
    }
    async function render(){
      syncGroupUrl();
      buttons.forEach(btn => {
        const active = btn.dataset.providerGroup === activeGroup;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const group = GROUPS[activeGroup] || GROUPS.all;
      title.textContent = group.title;
      subtitle.textContent = group.subtitle;
      count.textContent = "";
      list.innerHTML = `<div class="provider-empty-state">Providers laden...</div>`;
      results.hidden = false;
      const providers = buildProviderStats(await getDeals(), group.categories);
      if(!providers.length){
        count.textContent = "0 providers";
        list.innerHTML = `<div class="provider-empty-state">Nog geen providers gevonden.</div>`;
        return;
      }
      count.textContent = providers.length === 1 ? "1 provider" : providers.length + " providers";
      list.innerHTML = providers.map(providerCard).join("");
      restoreProviderScroll();
    }
    list.addEventListener("click", function(event){
      const card = event.target && event.target.closest ? event.target.closest(".mp-discovery-card") : null;
      if(card) saveProviderScroll(card.getAttribute("data-provider-id") || "");
    }, true);
    buttons.forEach(btn => btn.addEventListener("click", () => {
      const next = btn.dataset.providerGroup || "all";
      activeGroup = activeGroup === next ? "all" : next;
      render();
    }));
    render();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
