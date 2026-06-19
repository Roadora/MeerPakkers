
(function(){
  function isMobileCategoryRuntime(){
    return !!document.getElementById("mpMobileCategory") && window.matchMedia("(max-width: 900px)").matches;
  }

  const CATEGORY_CONFIG = {
    "mobiel": {
      title: "Mobiel deals",
      intro: "Kies het cadeau, de cashback of korting die jij wilt. MeerPakkers zet de beste deals bovenaan.",
      search: "Zoek cadeau, provider of toestel...",
      icon: "📱",
      label: "Mobiel",
      seoTitle: "Mobiel abonnement met cadeau vergelijken",
      seoIntro: "Vergelijk niet alleen de maandprijs, maar vooral wat je extra krijgt: cadeau, cashback, korting of gratis extra’s.",
      seoPoints: ["Cadeauwaarde en cashback naast elkaar", "Maandprijs, contractduur en totaal voordeel in één overzicht", "Snel filteren op provider, toestelmerk en voordeeltype"],
      faq: [["Waar moet ik op letten bij een mobiel abonnement met cadeau?", "Kijk naar de maandprijs, contractduur, totale voordeelwaarde en of de actie past bij overstappen of verlengen."], ["Waarom vergelijkt MeerPakkers op extra voordeel?", "Omdat je vaak meer kunt krijgen bij hetzelfde soort abonnement: cadeau, cashback, korting of gratis extra’s."]],
      filters: [
        {key:"voordeel", title:"Voordeel", hint:"Waarvoor kom je kijken?", options:[
          ["cadeau","🎁 Cadeau"],["cashback","💸 Cashback"],["korting","🏷️ Korting"]
        ]},
        {key:"cadeau", title:"Cadeautype", hint:"Kies het cadeau dat je wilt hebben.", options:[
          ["airpods","AirPods / oordopjes"],["nintendo-switch","Nintendo Switch"],["playstation","PlayStation"],["smartwatch","Smartwatch"],["cadeaukaart","Cadeaukaart"],["tablet","Tablet"]
        ]},
        {key:"klanttype", title:"Dealtype", options:[
          ["overstappen","Overstappen"],["verlengen","Verlengen"]
        ]},
        {key:"provider", title:"Provider", options:[
          ["vodafone","Vodafone"],["kpn","KPN"],["odido","Odido"],["hollandsnieuwe","hollandsnieuwe"],["youfone","Youfone"]
        ]},
        {key:"brand", title:"Telefoonmerk", options:[
          ["apple","Apple"],["samsung","Samsung"],["google","Google"],["xiaomi","Xiaomi"],["oppo","OPPO"]
        ]},
        {key:"contract", title:"Contractduur", options:[
          ["1-jaar","1 jaar"],["2-jaar","2 jaar"]
        ]}
      ],
      fallbackDeals: []
    },
    "sim-only": {
      title: "Sim Only deals",
      intro: "Kies cashback, korting of extra’s. MeerPakkers toont de beste sim only deals bovenaan.",
      search: "Zoek sim only voordeel...",
      icon: "📶",
      label: "Sim Only",
      seoTitle: "Sim Only deals met cashback en korting vergelijken",
      seoIntro: "Bij Sim Only draait het vaak om lagere maandlasten, maar extra cashback, korting of gratis extra’s kunnen het verschil maken.",
      seoPoints: ["Cashback en korting duidelijk zichtbaar", "Databundel en contractduur makkelijk vergelijken", "Handig voor overstappen én verlengen"],
      faq: [["Wanneer is een Sim Only deal interessant?", "Vooral wanneer de maandprijs laag blijft en het extra voordeel, zoals cashback of korting, echt meetelt over de looptijd."], ["Kan ik Sim Only deals ook op cadeau vergelijken?", "Ja, MeerPakkers sorteert op voordeeltype zoals cadeau, cashback, korting en gratis extra’s."]],
      filters: [
        {key:"voordeel", title:"Voordeel", options:[
          ["cadeau","🎁 Cadeau"],["cashback","💸 Cashback"],["korting","🏷️ Korting"]
        ]},
        {key:"cadeau", title:"Cadeautype", options:[
          ["cadeaukaart","Cadeaukaart"],["streaming","Streaming extra"],["gratis-extra","Gratis extra"],["cashback","Cashback"]
        ]},
        {key:"klanttype", title:"Dealtype", options:[
          ["overstappen","Overstappen"],["verlengen","Verlengen"]
        ]},
        {key:"provider", title:"Provider", options:[
          ["odido","Odido"],["ben","Ben"],["simyo","Simyo"],["youfone","Youfone"],["lebara","Lebara"]
        ]},
        {key:"data", title:"Databundel", options:[
          ["10gb","10 GB"],["20gb","20 GB"],["unlimited","Unlimited"]
        ]},
        {key:"contract", title:"Contractduur", options:[
          ["maandelijks","Maandelijks"],["1-jaar","1 jaar"],["2-jaar","2 jaar"]
        ]}
      ],
      fallbackDeals: []
    },
    "internet-tv": {
      title: "Internet & TV deals",
      intro: "Vind cadeaukaarten, cashback, sportpakketten en korting bij internet en tv.",
      search: "Zoek internet, cadeau of provider...",
      icon: "🌐",
      label: "Internet & TV",
      seoTitle: "Internet & TV deals met extra voordeel vergelijken",
      seoIntro: "Internet & TV acties verschillen sterk door cadeaukaarten, sportpakketten, streamingbundels en tijdelijke kortingen.",
      seoPoints: ["Vergelijk snelheid, tv-pakket en totaal voordeel", "Zet cashback, korting en cadeauwaarde naast elkaar", "Handig bij overstappen naar glasvezel of kabel"],
      faq: [["Wat maakt een Internet & TV deal goed?", "Een goede deal combineert passende snelheid, betrouwbare provider en duidelijk extra voordeel zoals korting of een cadeaukaart."], ["Telt een gratis sportpakket ook mee?", "Ja, gratis extra’s zoals sport, streaming of entertainment kunnen worden meegenomen in de voordeelvergelijking."]],
      filters: [
        {key:"voordeel", title:"Voordeel", options:[
          ["cadeau","🎁 Cadeau"],["cashback","💸 Cashback"],["korting","🏷️ Korting"]
        ]},
        {key:"cadeau", title:"Cadeautype", options:[
          ["cadeaukaart","Cadeaukaart"],["sport","Sportpakket"],["streaming","Streaming"],["gratis-extra","Gratis extra"]
        ]},
        {key:"klanttype", title:"Dealtype", options:[
          ["overstappen","Overstappen"],["verlengen","Verlengen"]
        ]},
        {key:"provider", title:"Provider", options:[
          ["kpn","KPN"],["ziggo","Ziggo"],["odido","Odido"],["youfone","Youfone"],["delta","DELTA"]
        ]},
        {key:"speed", title:"Internetsnelheid", options:[
          ["100mb","100 Mbit"],["500mb","500 Mbit"],["1gb","1 Gbit"]
        ]},
        {key:"tv", title:"TV pakket", options:[
          ["basis","Basis TV"],["sport","Sport"],["entertainment","Entertainment"]
        ]},
        {key:"contract", title:"Contractduur", options:[
          ["1-jaar","1 jaar"],["2-jaar","2 jaar"]
        ]}
      ],
      fallbackDeals: []
    },
    "streaming": {
      title: "Streaming deals",
      intro: "Vergelijk streamingacties met korting, gratis maanden en bundelvoordeel.",
      search: "Zoek streaming voordeel...",
      icon: "▶️",
      label: "Streaming",
      seoTitle: "Streaming deals en gratis maanden vergelijken",
      seoIntro: "Streamingacties zijn vaak tijdelijk. MeerPakkers helpt om gratis maanden, bundelkorting en sportacties snel naast elkaar te zetten.",
      seoPoints: ["Bekijk gratis maanden en tijdelijke korting", "Vergelijk video, series, films en sport", "Handig voor losse acties en bundeldeals"],
      faq: [["Welke streaming deals vergelijkt MeerPakkers?", "We vergelijken acties met korting, gratis maanden, bundelvoordeel en extra content zoals sport."], ["Zijn streaming deals maandelijks opzegbaar?", "Dat verschilt per aanbieder en actie. Controleer altijd de voorwaarden op de detailpagina of bij de aanbieder."]],
      filters: [
        {key:"voordeel", title:"Voordeel", options:[
          ["cadeau","🎁 Gratis extra"],["cashback","💸 Cashback"],["korting","🏷️ Korting"]
        ]},
        {key:"cadeau", title:"Cadeautype", options:[
          ["gratis-maanden","Gratis maanden"],["sport","Sportpakket"],["bundel","Bundelvoordeel"]
        ]},
        {key:"provider", title:"Provider", options:[
          ["netflix","Netflix"],["videoland","Videoland"],["disney-plus","Disney+"],["spotify","Spotify"],["viaplay","Viaplay"]
        ]},
        {key:"content", title:"Content", options:[
          ["films","Films"],["series","Series"],["sport","Sport"]
        ]},
        {key:"contract", title:"Contractduur", options:[
          ["maandelijks","Maandelijks"],["1-jaar","1 jaar"]
        ]}
      ],
      fallbackDeals: []
    }
  };

  function currentCategory(){
    const path = window.location.pathname.toLowerCase();
    if(path.includes("streaming")) return "streaming";
    if(path.includes("internet-tv")) return "internet-tv";
    if(path.includes("sim-only")) return "sim-only";
    return "mobiel";
  }

  const categoryKey = currentCategory();
  const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.mobiel;

  const state = {
    filtersOpen:false,
    openSections:new Set(),
    selected:{},
    drawerScrollTop:0,
    searchTerm:"",
    realDeals:null,
    dataLoaded:false,
    dataError:false
  };

  function rememberDrawerScroll(){
    const drawer = document.getElementById("mpFilterDrawer");
    if(drawer) state.drawerScrollTop = drawer.scrollTop || 0;
  }

  function restoreDrawerScroll(){
    const drawer = document.getElementById("mpFilterDrawer");
    if(!drawer || !state.filtersOpen) return;
    requestAnimationFrame(() => {
      drawer.scrollTop = state.drawerScrollTop || 0;
    });
  }


  config.filters.forEach(group => state.selected[group.key] = new Set());

  function readFiltersFromUrl(){
    const params = new URLSearchParams(window.location.search);
    config.filters.forEach(group => {
      const raw = params.get(group.key);
      if(!raw) return;
      raw.split(",").map(v => v.trim()).filter(Boolean).forEach(value => {
        state.selected[group.key].add(value);
      });
    });
  }

  function writeFiltersToUrl(){
    const params = new URLSearchParams(window.location.search);
    config.filters.forEach(group => {
      const values = Array.from(state.selected[group.key] || []);
      if(values.length) params.set(group.key, values.join(","));
      else params.delete(group.key);
    });
    const next = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", next);
  }

  function currentReturnUrl(){
    return window.location.pathname + window.location.search;
  }

  readFiltersFromUrl();

  state.searchTerm = (new URLSearchParams(window.location.search).get("q") || "").trim();

  function euro(v){
    return "€" + Number(v||0).toLocaleString("nl-NL");
  }

  function normalizeFilterText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " en ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function textContainsDealValue(d, value){
    const haystack = [d.provider, d.title, d.giftType, d.giftName, ...(d.benefits || []), ...(d.benefitTypes || [])]
      .map(normalizeFilterText)
      .join(" ");
    const needle = normalizeFilterText(value);

    if(needle === "airpods") return /airpods|oordopjes|buds|earbuds/.test(haystack);
    if(needle === "nintendo-switch") return /nintendo|switch/.test(haystack);
    if(needle === "playstation") return /playstation|ps5|ps4/.test(haystack);
    if(needle === "sport") return /sport|espn|viaplay/.test(haystack);
    if(needle === "gratis-extra") return /gratis|extra|pakket/.test(haystack);
    if(needle === "gratis-maanden") return /gratis|maanden/.test(haystack);
    return haystack.includes(needle);
  }

  function slugify(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " en ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function dealId(d){
    return String(d.id || d.seoSlug || slugify((d.provider || "aanbieder") + " " + (d.title || d.name || "deal")));
  }

  function dealUrl(d){
    // Hard category return fix: mobile category cards must always use the
    // single dynamic detail page with an explicit category + return URL.
    // This prevents old /deals/*.html pages or provider fallbacks from
    // hijacking the back flow, especially on Streaming/Disney+.
    var returnTo = currentReturnUrl();
    if(!returnTo || returnTo === "/") returnTo = "/" + categoryKey + "/";

    var params = new URLSearchParams();
    params.set("deal", dealId(d));
    params.set("category", categoryKey);
    params.set("return", returnTo);
    return "/deal/?" + params.toString();
  }


  function saveDealReturnContext(dealIdValue){
    if(!dealIdValue) return;
    try {
      var returnTo = currentReturnUrl();
      if(!returnTo || returnTo === "/") returnTo = "/" + categoryKey + "/";
      var scrollKey = "mp_category_return_v74:" + returnTo;
      sessionStorage.setItem(scrollKey, JSON.stringify({
        path: returnTo,
        scrollY: window.scrollY || document.documentElement.scrollTop || 0,
        dealId: dealIdValue,
        savedAt: Date.now()
      }));
      sessionStorage.setItem("mp_deal_return_context_v1", JSON.stringify({
        dealId: dealIdValue,
        category: categoryKey,
        returnTo: returnTo,
        scrollKey: scrollKey,
        savedAt: Date.now()
      }));
    } catch(e) {}
  }

  function enforceCardNavigation(){
    var root = document.getElementById("mpMobileCategory");
    if(!root || root.dataset.mpDealNavBound === "true") return;
    root.dataset.mpDealNavBound = "true";

    root.addEventListener("click", function(event){
      if(event.target && event.target.closest && event.target.closest("button, .meepakker-save-heart, .mp-save-deal-btn-v47")) return;
      var link = event.target && event.target.closest ? event.target.closest('a[href*="/deal/"], a[href*="/deals/"]') : null;
      var card = event.target && event.target.closest ? event.target.closest("[data-deal-id].mp-clean-deal-card, [data-deal-id].mp-deal-card-component, [data-deal-id].mp-category-deal") : null;
      if(!link && !card) return;
      if(!card && link && link.closest) card = link.closest("[data-deal-id]");
      var id = card && card.getAttribute ? card.getAttribute("data-deal-id") : "";
      if(!id && link){
        try { id = new URL(link.getAttribute("href"), window.location.origin).searchParams.get("deal") || ""; } catch(e) {}
      }
      if(!id) return;
      event.preventDefault();
      saveDealReturnContext(id);
      window.location.href = "/deal/?deal=" + encodeURIComponent(id) + "&category=" + encodeURIComponent(categoryKey) + "&return=" + encodeURIComponent(currentReturnUrl() || ("/" + categoryKey + "/"));
    }, true);
  }

  function getDeals(){
    const realDeals = Array.isArray(state.realDeals) ? state.realDeals : [];
    let allDeals = realDeals.filter(d => d.category === categoryKey);

    // Fallback is only a visual emergency state. Real mobile category cards must
    // normally come from data/deals.json so internal detail links use stable deal.id values.
    if(!allDeals.length && state.dataError) allDeals = config.fallbackDeals;

    return allDeals
      .map(d => {
        const copy = {...d};
        copy.totalBenefitValue = Number(copy.totalBenefitValue || 0) || (
          Number(copy.giftValue||0) + Number(copy.cashbackValue||0) + Number(copy.discountValue||0) + Number(copy.extraValue||0)
        );
        return copy;
      })
      .sort((a,b)=>(Number(b.meerPakScore||0)-Number(a.meerPakScore||0)) || (Number(b.totalBenefitValue||0)-Number(a.totalBenefitValue||0)));
  }

  function activeFilterCount(){
    return Object.values(state.selected).reduce((total,set) => total + set.size, 0);
  }

  function hasActiveFilters(){
    return activeFilterCount() > 0;
  }

  function dealMatchesGroup(d, groupKey){
    const selected = state.selected[groupKey];
    if(!selected || !selected.size) return true;

    if(groupKey === "voordeel"){
      return (selected.has("cadeau") && (d.giftValue || d.giftType || (d.benefitTypes || []).includes("cadeau") || (d.benefitTypes || []).includes("cadeaukaart") || (d.benefitTypes || []).includes("gratis-extra"))) ||
        (selected.has("cashback") && (d.cashbackValue || (d.benefitTypes || []).includes("cashback"))) ||
        (selected.has("korting") && (d.discountValue || (d.benefitTypes || []).includes("korting") || (d.benefitTypes || []).includes("gratis-maanden")));
    }

    if(groupKey === "cadeau"){
      return Array.from(selected).some(value => textContainsDealValue(d, value));
    }

    if(groupKey === "klanttype"){
      const type = String(d.klanttype || d.dealType || "overstappen").toLowerCase();
      return selected.has(type) || (selected.has("overstappen") && type === "nieuw");
    }

    if(groupKey === "provider"){
      const providerId = normalizeFilterText(d.providerId || d.provider || "");
      return Array.from(selected).some(value => providerId === normalizeFilterText(value));
    }

    return Array.from(selected).some(value => {
      const direct = normalizeFilterText(d[groupKey] || "");
      return direct === normalizeFilterText(value) || textContainsDealValue(d, value);
    });
  }

  function dealMatchesSearch(d){
    const q = normalizeFilterText(state.searchTerm || "");
    if(!q) return true;
    const haystack = [
      d.provider,
      d.providerId,
      d.title,
      d.category,
      d.giftType,
      d.giftName,
      d.brand,
      d.data,
      d.speed,
      d.tv,
      d.content,
      d.contract,
      ...(d.benefits || []),
      ...(d.benefitTypes || [])
    ].map(normalizeFilterText).join(" ");
    return haystack.includes(q);
  }

  function filteredDeals(){
    return getDeals().filter(d =>
      dealMatchesSearch(d) &&
      config.filters.every(group => dealMatchesGroup(d, group.key))
    );
  }

  function benefitPills(d){
    const pills = [];
    if(d.giftType || d.giftValue) pills.push("🎁 " + (d.giftType || "Cadeau") + (d.giftValue && !String(d.giftType||"").includes("€") ? " t.w.v. " + euro(d.giftValue) : ""));
    if(d.cashbackValue) pills.push("💸 " + euro(d.cashbackValue) + " cashback");
    if(d.discountValue) pills.push("🏷️ " + euro(d.discountValue) + " korting");
    return pills.slice(0,2).map(p => `<span>${p}</span>`).join("");
  }

  function filterOption(group, value, label){
    const active = state.selected[group].has(value);
    return `<button class="mp-filter-option ${active ? "is-active" : ""}" data-filter-group="${group}" data-filter-value="${value}" type="button">
      <span>${label}</span>
      <b>${active ? "✓" : ""}</b>
    </button>`;
  }

  function renderFilterSections(){
    return config.filters.map(group => `
      <div class="mp-filter-section ${state.openSections.has(group.key) ? "is-open" : ""}">
        <button class="mp-filter-section-toggle" data-filter-section="${group.key}" type="button"><span>${group.title}${state.selected[group.key] && state.selected[group.key].size ? ` <em>${state.selected[group.key].size}</em>` : ""}</span><b>⌄</b></button>
        <div class="mp-filter-section-body">
          ${group.hint ? `<p class="mp-filter-hint">${group.hint}</p>` : ""}
          ${group.options.map(opt => filterOption(group.key, opt[0], opt[1])).join("")}
        </div>
      </div>
    `).join("");
  }

  function compactBenefitFooterLabel(d){
    const label = String((d && d.totalBenefitLabel) || "").trim();
    const value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
    return label && value <= 0 ? "Meepakker" : "Totaal voordeel";
  }

  function compactBenefitValue(d){
    const label = String((d && d.totalBenefitLabel) || "").trim();
    const value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
    return label && value <= 0 ? label : euro(value);
  }

  function renderDeals(){
    const root = document.getElementById("mpCategoryDeals");
    const deals = filteredDeals();
    if(!deals.length){
      root.innerHTML = `<article class="mp-empty-card">
        <h3>Geen deals gevonden</h3>
        <p>Pas je zoekopdracht of filters aan, of toon alle ${config.label.toLowerCase()} deals.</p>
      </article>`;
      return;
    }

    root.innerHTML = deals.map((d,i)=>{
      if(window.MPDealCard){
        var html = window.MPDealCard.render(d, {
          category:categoryKey,
          categoryLabel:config.label,
          url:dealUrl(d)
        });
        var id = dealId(d);
        return html.replace('<article class="mp-clean-deal-card mp-deal-card-component"', '<article class="mp-clean-deal-card mp-deal-card-component" data-deal-id="' + id + '"');
      }
      return `<article class="mp-category-deal mp-category-deal-compact">
        <div class="mp-rank">#${i+1}</div>
        <div class="mp-compact-benefit">${benefitPills(d) || "<span>🎁 Extra voordeel</span>"}</div>
        <div class="mp-compact-provider"><div class="mp-deal-icon">${d.icon || config.icon}</div><div><div class="mp-deal-cat">${config.label}</div><h3>${d.provider || "Aanbieder"}</h3><p>${d.title || "Actie met voordeel"}</p></div></div>
        <div class="mp-compact-bottom"><div><small>${compactBenefitFooterLabel(d)}</small><strong>${escapeHtml(compactBenefitValue(d))}</strong></div><a href="${dealUrl(d)}">${escapeHtml(d.ctaLabel || "Bekijk deal")}</a></div>
      </article>`;
    }).join("");
  }

  function quickButton(value,label){
    const active = state.selected.voordeel && state.selected.voordeel.has(value);
    return `<button class="${active ? "is-active" : ""}" data-quick-filter="${value}" type="button">${label}</button>`;
  }

  function escapeHtml(value){
    return String(value || "").replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch] || ch));
  }

  function renderSeoContent(){
    return "";
  }

  function categoryPills(){
    const items = [
      ["/mobiel/","📱","Mobiel","Deals","mobiel"],
      ["/sim-only/","📶","Sim Only","Deals","sim-only"],
      ["/internet-tv/","🌐","Internet & TV","Deals","internet-tv"],
      ["/streaming/","🎬","Streaming","Deals","streaming"]
    ];
    return `<nav class="mp-mobile-category-pills" aria-label="Categorieën">
      ${items.map(item => `<a class="mp-mobile-category-pill ${item[4] === categoryKey ? "is-active" : ""}" href="${item[0]}"><span>${item[1]}</span><b>${item[2]}</b><small>${item[3]}</small></a>`).join("")}
    </nav>`;
  }

  function mobileTopHeader(){
    return `<header class="mp-mobile-top-header" aria-label="MeerPakkers pagina header">
      <a href="../" class="mp-mobile-back" aria-label="Terug naar home">&lt;</a>
      <a href="../" class="mp-mobile-brand-lockup" aria-label="MeerPakkers home">
        <span class="mp-mobile-brand-logo">MP+</span>
        <span class="mp-mobile-brand-copy"><span class="mp-mobile-brand-lines">meer cadeau,<br>meer korting.</span><strong class="mp-mobile-brand-name">MeerPakkers</strong></span>
      </a>
      <a href="../opgeslagen/" class="mp-mobile-heart-link" aria-label="Opgeslagen deals">♡<span class="mp-mobile-heart-count" data-saved-deals-count>0</span></a>
    </header>`;
  }

  function render(){
    const root = document.getElementById("mpMobileCategory");
    if(!root) return;

    root.innerHTML = `
      <section class="mp-category-mobile mp-mobile-framework">
        ${mobileTopHeader()}

        <section class="mp-mobile-intro" aria-labelledby="mpCategoryTitle">
          <p class="mp-mobile-intro__eyebrow">MeerPakkers</p>
          <h1 class="mp-mobile-intro__title" id="mpCategoryTitle">${config.title}</h1>
          <p class="mp-mobile-intro__subtitle">${config.intro}</p>
        </section>

        <label class="mp-mobile-search" for="mpCategorySearchInput">
          <span>🔍</span>
          <input id="mpCategorySearchInput" type="search" value="${state.searchTerm.replace(/"/g, "&quot;")}" placeholder="${config.search}" aria-label="${config.search}">
        </label>

        ${categoryPills()}

        <div class="mp-cat-actions mp-cat-actions-compact" aria-label="Filters en snelle voordeeltypes">
          <button id="mpOpenFilters" class="mp-open-filters" type="button">
            ⚙️ Filters ${hasActiveFilters() ? `<span>${activeFilterCount()}</span>` : ""}
          </button>
          <div class="mp-quick-filters" aria-label="Snelle filters">
            ${quickButton("cadeau","🎁 Cadeau")}
            ${quickButton("cashback","💸 Cashback")}
            ${quickButton("korting","🏷️ Korting")}
          </div>
        </div>

        <section id="mpCategoryDeals" class="mp-category-deals mp-shared-deal-grid" aria-label="Deals"></section>
        ${renderSeoContent()}
        <footer class="mp-site-footer mp-site-footer--mobile-category" aria-label="MeerPakkers footer">
          <div class="mp-site-footer__brand">
            <strong>MeerPakkers</strong>
            <span>Meer cadeau, meer korting.</span>
          </div>
          <nav class="mp-site-footer__nav" aria-label="Footer navigatie">
            <a href="../over-ons/">Over ons</a>
            <a href="../uitleg/">MeerPakkers Uitleg</a>
            <a href="../contact/">Contact</a>
            <a href="../privacy/">Privacy</a>
            <a href="../cookies/">Cookies</a>
            <a href="../disclaimer/">Disclaimer</a>
            <a href="../voorwaarden/">Voorwaarden</a>
          </nav>
          <small class="mp-site-footer__copy">© 2026 MeerPakkers</small>
        </footer>
      </section>

      <div id="mpFilterOverlay" class="mp-filter-overlay ${state.filtersOpen ? "is-open" : ""}"></div>
      <aside id="mpFilterDrawer" class="mp-filter-drawer ${state.filtersOpen ? "is-open" : ""}" aria-label="Filters">
        <div class="mp-filter-head">
          <div>
            <h2>Filters</h2>
            <p>Kies wat je wilt krijgen. MeerPakkers rangschikt de beste deals.</p>
          </div>
          <button id="mpCloseFilters" type="button">×</button>
        </div>

        ${renderFilterSections()}

        <div class="mp-filter-footer">
          <button id="mpResetFilters" class="mp-reset" type="button">Wis filters</button>
          <button id="mpShowDeals" class="mp-show" type="button">Toon ${filteredDeals().length} deals</button>
        </div>
      </aside>
    `;

    bind();
    renderDeals();
    enforceCardNavigation();
    restoreDrawerScroll();
    if (window.MeerPakkersSavedDealsHeader && typeof window.MeerPakkersSavedDealsHeader.updateCounts === "function") {
      window.MeerPakkersSavedDealsHeader.updateCounts();
    }
  }

  function bind(){
    const open = document.getElementById("mpOpenFilters");
    const close = document.getElementById("mpCloseFilters");
    const overlay = document.getElementById("mpFilterOverlay");
    const show = document.getElementById("mpShowDeals");
    const reset = document.getElementById("mpResetFilters");

    function openDrawer(){ state.filtersOpen = true; state.openSections.clear(); state.drawerScrollTop = 0; render(); }
    function closeDrawer(){ state.filtersOpen = false; render(); }

    open && open.addEventListener("click", openDrawer);
    close && close.addEventListener("click", closeDrawer);
    overlay && overlay.addEventListener("click", closeDrawer);
    show && show.addEventListener("click", closeDrawer);
    reset && reset.addEventListener("click", function(){
      Object.values(state.selected).forEach(set => set.clear());
      writeFiltersToUrl();
      render();
    });

    document.querySelectorAll("[data-filter-section]").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filterSection;
        rememberDrawerScroll();
        if(state.openSections.has(key)) state.openSections.delete(key);
        else state.openSections.add(key);
        render();
      });
    });

    document.querySelectorAll("[data-quick-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.quickFilter;
        const set = state.selected.voordeel;
        rememberDrawerScroll();
        if(set.has(value)) set.delete(value);
        else set.add(value);
        writeFiltersToUrl();
        render();
      });
    });

    const categorySearch = document.getElementById("mpCategorySearchInput");
    categorySearch && categorySearch.addEventListener("keydown", e => {
      if(e.key === "Enter"){
        state.searchTerm = (categorySearch.value || "").trim();
        const params = new URLSearchParams(window.location.search);
        if(state.searchTerm) params.set("q", state.searchTerm);
        else params.delete("q");
        const next = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, "", next);
        render();
      }
    });

    document.querySelectorAll("[data-filter-group]").forEach(btn => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.filterGroup;
        const value = btn.dataset.filterValue;
        const set = state.selected[group];
        rememberDrawerScroll();
        if(set.has(value)) set.delete(value);
        else set.add(value);
        writeFiltersToUrl();
        render();
      });
    });
  }

  function loadRealDeals(){
    return fetch("../data/deals.json", {cache:"no-store"})
      .then(function(res){
        if(res.ok) return res;
        return fetch("/data/deals.json", {cache:"no-store"});
      })
      .then(function(res){ return res.json(); })
      .then(function(deals){
        state.realDeals = Array.isArray(deals) ? deals : [];
        state.dataLoaded = true;
        state.dataError = false;
      })
      .catch(function(){
        state.realDeals = [];
        state.dataLoaded = true;
        state.dataError = true;
      });
  }

  function init(){
    if(!isMobileCategoryRuntime()) return;
    const root = document.getElementById("mpMobileCategory");
    if(root){
      root.innerHTML = `<section class="mp-category-mobile"><article class="mp-empty-card"><h3>Deals laden...</h3><p>We halen de actuele ${config.label.toLowerCase()} deals op.</p></article></section>`;
    }
    loadRealDeals().then(render);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

