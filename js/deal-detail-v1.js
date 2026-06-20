/* MeerPakkers Deal Detail Single Source v69
   Eén bron van waarheid: data/deals.json
   Aanbieder-CTA loopt via centrale affiliate foundation.
*/
(function(){
  function euro(v){
    return "€" + Number(v || 0).toLocaleString("nl-NL");
  }

  function slugify(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " en ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function categoryLabel(category){
    return {
      "mobiel":"Mobiel",
      "sim-only":"Sim Only",
      "internet-tv":"Internet & TV",
      "streaming":"Streaming"
    }[category] || category || "Deal";
  }

  function safeReturn(value){
    const ret = String(value || "");
    if(!ret) return "";
    // Only allow internal site paths as return targets. Never return to old static /deals pages.
    if(ret.charAt(0) !== "/") return "";
    if(ret.indexOf("/deals/") === 0) return "";
    if(ret.indexOf("//") === 0) return "";
    return ret;
  }

  function returnUrl(d){
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("deal") || "";
    const category = params.get("category") || (d && d.category);

    // URL return is the source of truth for category/detail navigation.
    // Previously a stale sessionStorage context could override /streaming/ and send users back to Providers.
    const ret = safeReturn(params.get("return"));
    if(ret) return ret;

    try {
      const raw = sessionStorage.getItem("mp_deal_return_context_v1");
      if(raw){
        const ctx = JSON.parse(raw);
        const fresh = ctx && ctx.savedAt && (Date.now() - ctx.savedAt < 30 * 60 * 1000);
        const sameDeal = ctx && (slugify(ctx.dealId || "") === slugify(requested || "") || slugify(ctx.dealId || "") === slugify((d && (d.id || d.seoSlug)) || ""));
        const sameCategory = !category || !ctx.category || String(ctx.category) === String(category);
        const storedReturn = safeReturn(ctx && ctx.returnTo);
        if(fresh && sameDeal && sameCategory && storedReturn){
          return storedReturn;
        }
      }
    } catch(e) {}

    return {
      "mobiel":"/mobiel/",
      "sim-only":"/sim-only/",
      "internet-tv":"/internet-tv/",
      "streaming":"/streaming/"
    }[category] || "/";
  }

  function matchesDeal(d, requested){
    const r = slugify(requested || "");
    if(!r) return false;

    return slugify(d.id || "") === r ||
      slugify(d.seoSlug || "") === r ||
      slugify((d.provider || "") + " " + (d.title || "")) === r ||
      slugify((d.provider || "") + "-" + (d.title || "")) === r;
  }

  function benefitRows(d){
    if(isChoiceBenefitDetail(d)){
      return [
        ["", "Korting of cadeau", "bij je overstap"],
        ["", "Tot 14 maanden korting", "8 maanden bij 1 jaar · 14 maanden bij 2 jaar"],
        ["", "Cadeau tot €349", "bijvoorbeeld tablet of wifi-versterkers"]
      ].map(function(r){
        return `
          <div class="mp-detail-benefit">
            <span>${r[0]}</span>
            <div><strong>${escapeHtml(r[1])}</strong><small>${escapeHtml(r[2])}</small></div>
          </div>
        `;
      }).join("");
    }

    const rows = [];
    if(d.giftName || d.giftType || d.giftValue){
      rows.push(["", d.giftName || d.giftType || "Cadeau", d.giftValue ? "t.w.v. " + euro(d.giftValue) : ""]);
    }
    if(d.cashbackValue){
      rows.push(["💸", "Cashback", euro(d.cashbackValue)]);
    }
    if(d.discountValue){
      rows.push(["🏷️", "Korting of cadeau bij overstappen", euro(d.discountValue)]);
    }
    if(!rows.length && Array.isArray(d.benefits)){
      d.benefits.slice(0,3).forEach(function(b){
        rows.push(["🎁", b, ""]);
      });
    }

    return rows.map(function(r){
      return `
        <div class="mp-detail-benefit">
          <span>${r[0]}</span>
          <div><strong>${r[1]}</strong><small>${r[2]}</small></div>
        </div>
      `;
    }).join("");
  }


  function refreshSavedHeader(){
    try {
      if(window.MeerPakkersMobileTopbar && typeof window.MeerPakkersMobileTopbar.normalizeAll === "function"){
        window.MeerPakkersMobileTopbar.normalizeAll();
      }
      if(window.MeerPakkersSavedDealsHeader && typeof window.MeerPakkersSavedDealsHeader.updateCounts === "function"){
        window.MeerPakkersSavedDealsHeader.updateCounts();
      }
      if(window.MeerPakkersSavedDealsHeader && typeof window.MeerPakkersSavedDealsHeader.refresh === "function"){
        window.MeerPakkersSavedDealsHeader.refresh();
      }
    } catch(e) {}
  }


  function updateStaticTopbarBack(href){
    try {
      var link = document.querySelector(".mp-deal-detail-page .mp-mobile-top-header .mp-mobile-back");
      if(link){
        link.setAttribute("href", href || "/");
        link.setAttribute("aria-label", "Terug");
      }
      if(window.MeerPakkersMobileTopbar && typeof window.MeerPakkersMobileTopbar.normalizeAll === "function"){
        window.MeerPakkersMobileTopbar.normalizeAll();
      }
    } catch(e) {}
  }


  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function detailValue(d, keys, fallback){
    for(var i=0;i<keys.length;i++){
      var v = d && d[keys[i]];
      if(v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return fallback || "";
  }


  function mpAssetVisual(d, type){
    var text = String((d && (d.giftName || d.giftType || d.title || d.provider || d.category)) || "").toLowerCase();
    if(type === "cashback") return '<div class="mp-v23-cash-visual"><span>€</span></div>';
    if(type === "discount") return '<div class="mp-v23-discount-visual"><span>%</span></div>';
    if(/airpods|oordop|buds|headphone|koptelefoon/.test(text)) return '<div class="mp-v23-product-visual mp-v23-airpods"><span></span><span></span></div>';
    if(/iphone|samsung|galaxy|pixel|telefoon|smartphone/.test(text)) return '<div class="mp-v23-product-visual mp-v23-phone"><span></span></div>';
    if(/playstation|ps5|nintendo|switch|xbox|game/.test(text)) return '<div class="mp-v23-product-visual mp-v23-console"><span></span></div>';
    if(/cadeaukaart|giftcard|kaart/.test(text)) return '<div class="mp-v23-product-visual mp-v23-giftcard"><strong>cadeau</strong></div>';
    if(/streaming|netflix|disney|espn|spotify|videoland|hbo/.test(text)) return '<div class="mp-v23-product-visual mp-v23-stream"><span>▶</span></div>';
    if(/internet|glasvezel|wifi|tv/.test(text)) return '<div class="mp-v23-product-visual mp-v23-router"><span></span></div>';
    return '<div class="mp-v23-product-visual mp-v23-generic"><span>+</span></div>';
  }

  function mpProductLabel(d){
    return d.title || d.giftName || d.giftType || "Actie met extra voordeel";
  }

  function mpProductSub(d){
    if(d.category === "mobiel") return d.provider ? "via " + d.provider : "Mobiele deal";
    if(d.category === "internet-tv") return d.provider ? "bij " + d.provider : "Internet & TV";
    if(d.category === "streaming") return d.provider ? "via " + d.provider : "Streaming deal";
    return d.provider || "MeerPakkers deal";
  }

  function mpVisualBenefitCards(d){
    if(isChoiceBenefitDetail(d)){
      return choiceDetailBenefits(d).map(function(card){
        return `
          <article class="mp-v23-benefit-card mp-v23-benefit-card--${card.type} mp-v23-benefit-card--choice">
            <div class="mp-v23-benefit-visual">${choiceVisual(card.type)}</div>
            <div class="mp-v23-benefit-copy">
              <h3>${escapeHtml(card.title)}</h3>
              <p>${escapeHtml(card.sub)}</p>
            </div>
          </article>
        `;
      }).join("");
    }

    var cards = [];
    var seen = [];

    function cleanText(value){
      return String(value || "").toLowerCase().replace(/[^a-z0-9€]+/g, " ").trim();
    }

    function addCard(card){
      var key = cleanText((card.title || "") + " " + (card.sub || ""));
      if(!key) return;
      if(seen.some(function(existing){ return key.indexOf(existing) !== -1 || existing.indexOf(key) !== -1; })) return;
      seen.push(key);
      cards.push(card);
    }

    if(d.giftName || d.giftType || d.giftValue){
      addCard({
        type:"gift",
        visual:mpAssetVisual(d, "gift"),
        title:d.giftName || d.giftType || "Cadeau",
        sub:d.giftValue ? "t.w.v. " + euro(d.giftValue) : "Extra cadeau"
      });
    }

    if(d.cashbackValue){
      addCard({
        type:"cashback",
        visual:mpAssetVisual(d, "cashback"),
        title:euro(d.cashbackValue) + " cashback",
        sub:d.provider ? "via " + d.provider : "Cashback"
      });
    }

    if(d.discountValue){
      addCard({
        type:"discount",
        visual:mpAssetVisual(d, "discount"),
        title:"Korting of cadeau bij overstappen",
        sub:euro(d.discountValue) + " voordeel"
      });
    }

    /*
      Raw benefits are often descriptive duplicates of the structured fields above
      (for example: "AirPods 4 cadeau t.w.v. €199" while giftName/giftValue already exist).
      For the desktop detail hero we only use raw benefits as a fallback, so the page never
      renders duplicate benefit cards or empty placeholder cards.
    */
    if(!cards.length && Array.isArray(d.benefits)){
      d.benefits.filter(Boolean).forEach(function(b){
        addCard({
          type:"extra",
          visual:mpAssetVisual(d, "gift"),
          title:String(b),
          sub:"Extra voordeel"
        });
      });
    }

    if(d.title){
      addCard({
        type:"product",
        visual:mpAssetVisual(d, "product"),
        title:d.title,
        sub:d.provider ? "via " + d.provider : "Bekijk aanbieder"
      });
    }

    if(!cards.length){
      addCard({
        type:"extra",
        visual:mpAssetVisual(d, "gift"),
        title:"Extra voordeel",
        sub:d.provider ? "via " + d.provider : "Bekijk aanbieder"
      });
    }

    return cards.map(function(card){
      return `
        <article class="mp-v23-benefit-card mp-v23-benefit-card--${card.type}">
          <div class="mp-v23-benefit-visual">${card.visual}</div>
          <div class="mp-v23-benefit-copy">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.sub)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function mpWhyVisual(d){
    return `
      <div class="mp-v23-why-visual">
        <div class="mp-v23-why-main">${mpAssetVisual(d, "gift")}</div>
        <div class="mp-v23-why-badge">${euro(d.totalBenefitValue || d.benefitValue || 0)}</div>
      </div>
    `;
  }


  function detailCtaLabel(d){
    return d.detailCtaLabel || d.ctaLabel || "Pak deze Meepakker";
  }

  function mpFinalCta(d){
    return `
      <section class="mp-v23-final">
        <div class="mp-v23-final-icon">${mpAssetVisual(d, "gift")}</div>
        <div class="mp-v23-final-copy">
          <h2>Pak deze Meepakker</h2>
          <p>Ga veilig naar de aanbieder en pak het voordeel zolang deze actie beschikbaar is.</p>
        </div>
        <a class="mp-v23-final-cta js-affiliate-link"
          href="${d.affiliateUrl || "#"}"
          data-affiliate-link="true"
          data-affiliate-deal-id="${d.id || ""}"
          data-affiliate-provider-id="${d.providerId || ""}"
          data-affiliate-category="${d.category || ""}"
          data-affiliate-network="${d.network || "placeholder"}"
          data-affiliate-campaign-id="${d.campaignId || ""}"
          data-affiliate-tracking-id="${d.trackingId || ""}"
          data-affiliate-merchant-id="${d.merchantId || d.providerId || ""}"
          rel="sponsored noopener noreferrer">${escapeHtml(detailCtaLabel(d))}</a>
        <button class="mp-v23-save" type="button">♡ Bewaar deal</button>
      </section>

      <section class="mp-v23-trust">
        <div><span>🛡️</span><strong>Betrouwbare partners</strong><small>Geselecteerde aanbieders</small></div>
        <div><span>🏅</span><strong>100% onafhankelijk</strong><small>Voordeel eerst vergelijken</small></div>
        <div><span>💬</span><strong>Duidelijke uitleg</strong><small>Direct zien wat je krijgt</small></div>
        <div><span>🔄</span><strong>Actuele deals</strong><small>Klaar voor affiliate links</small></div>
      </section>
    `;
  }

  function renderDesktopBenefitCards(d){
    var cards = [];

    if(d.giftName || d.giftType || d.giftValue){
      cards.push({
        icon:"🎁",
        label:d.giftName || d.giftType || "Cadeau",
        value:d.giftValue ? "t.w.v. " + euro(d.giftValue) : "Extra cadeau",
        type:"gift"
      });
    }

    if(d.cashbackValue){
      cards.push({
        icon:"💰",
        label:"Cashback",
        value:euro(d.cashbackValue) + " terug",
        type:"cashback"
      });
    }

    if(d.discountValue){
      cards.push({
        icon:"🏷️",
        label:"Korting of cadeau bij overstappen",
        value:euro(d.discountValue) + " voordeel",
        type:"discount"
      });
    }

    if(Array.isArray(d.benefits)){
      d.benefits.slice(0, Math.max(0, 3 - cards.length)).forEach(function(b){
        cards.push({icon:"✨",label:String(b),value:"Extra voordeel",type:"extra"});
      });
    }

    if(!cards.length){
      cards.push({
        icon:"✨",
        label:"Extra voordeel",
        value:"Via " + (d.provider || "de aanbieder"),
        type:"extra"
      });
    }

    return cards.slice(0,3).map(function(card){
      return `
        <article class="mp-dd-real-benefit mp-dd-real-benefit--${card.type}">
          <div class="mp-dd-real-benefit-icon">${card.icon}</div>
          <div class="mp-dd-real-benefit-content">
            <h3>${escapeHtml(card.label)}</h3>
            <span>${escapeHtml(card.value)}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderMeepakkerSummary(d){
    if(isChoiceBenefitDetail(d)){
      return `
        <div class="mp-dd-summary-line"><strong>Budget Thuis Internet & TV</strong><em>actie bij overstap</em></div>
      `;
    }

    var rows = [];
    if(d.giftName || d.giftType || d.giftValue){
      rows.push(["", d.giftName || d.giftType || "Cadeau", d.giftValue ? "t.w.v. " + euro(d.giftValue) : ""]);
    }
    if(d.cashbackValue) rows.push(["", "Cashback", euro(d.cashbackValue)]);
    if(d.discountValue) rows.push(["", "Korting of cadeau bij overstappen", euro(d.discountValue)]);
    return rows.slice(0,3).map(function(r){
      return `<div class="mp-dd-summary-line"><span>${r[0]}</span><strong>${escapeHtml(r[1])}</strong><em>${escapeHtml(r[2])}</em></div>`;
    }).join("");
  }


  function renderWhyTitle(d){
    if(isChoiceBenefitDetail(d)){
      return d.detailWhyTitle || "Actie in het kort";
    }
    if(isPeriodBenefitDetail(d)){
      return d.detailWhyTitle || "Waarom is dit een Meepakker?";
    }
    return "Waarom is dit een Meepakker?";
  }

  function renderWhyText(d){
    if(isChoiceBenefitDetail(d)){
      return d.detailWhyText || "Profiteer tijdelijk van een actie bij Internet van Budget Thuis. Je krijgt korting of een aantrekkelijk welkomstcadeau. Via Budget Thuis kies je de deal die bij jouw pakket past.";
    }
    if(isPeriodBenefitDetail(d)){
      return d.detailWhyText || "Deze tijdelijke actie geeft extra voordeel tijdens de eerste maanden. Controleer altijd het actuele aanbod en de voorwaarden bij de aanbieder.";
    }

    var provider = d.provider || "deze aanbieder";
    var total = euro(d.totalBenefitValue || d.benefitValue || 0);
    var parts = [];
    if(d.giftName || d.giftType) parts.push((d.giftName || d.giftType) + " cadeau");
    if(d.cashbackValue) parts.push(euro(d.cashbackValue) + " cashback");
    if(d.discountValue) parts.push(euro(d.discountValue) + " korting");
    var extras = parts.length ? " Je krijgt " + parts.join(", ") + "." : " Je krijgt extra voordeel bovenop het abonnement.";
    return "Met deze " + provider + " deal krijg je meer dan alleen een standaard abonnement." + extras + " Daardoor loopt jouw totale voordeel op tot " + total + ".";
  }

  function isPeriodBenefitDetail(d){
    // One offer-overview component: explicit deal data is leading.
    // Budget Internet & TV uses "choice" and Budget Sim Only uses "period";
    // both render through the same master overview markup and CSS.
    var explicit = String((d && d.benefitDisplayType) || "").toLowerCase();
    if(explicit === "period") return true;

    // Legacy fallback for older period actions without the explicit field.
    var label = String((d && d.totalBenefitLabel) || "").trim();
    var value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
    return !!label && value <= 0;
  }


  function isChoiceBenefitDetail(d){
    var explicit = String((d && d.benefitDisplayType) || "").toLowerCase();
    var types = Array.isArray(d && d.benefitTypes) ? d.benefitTypes.map(function(t){ return String(t).toLowerCase(); }) : [];
    return explicit === "choice" || (types.indexOf("korting") !== -1 && types.indexOf("cadeau") !== -1);
  }

  function choiceDetailBenefits(d){
    var direct = Array.isArray(d && d.detailBenefits) ? d.detailBenefits : [];
    if(direct.length) return direct.slice(0,3);
    return [
      {type:"discount", title:"Tot 14 maanden korting", sub:"8 maanden bij 1 jaar · 14 maanden bij 2 jaar"},
      {type:"gift", title:"Cadeau tot €349", sub:"Bijvoorbeeld tablet of wifi-versterkers"},
      {type:"product", title:d && d.title ? d.title : "Internet & TV", sub:d && d.provider ? "via " + d.provider : "Bekijk aanbieder"}
    ];
  }

  function choiceVisual(type){
    if(type === "discount") return '<div class="mp-v23-product-visual mp-v23-discount-visual"><span>%</span></div>';
    if(type === "gift") return '<div class="mp-v23-product-visual mp-v23-giftcard"><strong>cadeau</strong></div>';
    return '<div class="mp-v23-product-visual mp-v23-router"><span></span></div>';
  }

  function benefitSummaryLabelDetail(d){
    return (isPeriodBenefitDetail(d) || isChoiceBenefitDetail(d)) ? "Meepakker" : "Totaal voordeel";
  }

  function detailSummaryValue(d){
    if(isChoiceBenefitDetail(d)){
      return d.detailSummaryValue || "Tot 14 maanden voordeel";
    }
    return d.totalBenefitLabel || euro(d.totalBenefitValue || d.benefitValue || 0);
  }

  function detailPriceLines(d){
    if(!isChoiceBenefitDetail(d)) return "";
    var line1 = d.priceDuringDiscount || "Vanaf €23,50 p/m tijdens de korting";
    return `
      <div class="mp-v23-summary-price-lines">
        <span>${escapeHtml(line1)}</span>
      </div>
    `;
  }

  function detailSummarySubLine(d){
    if(!isChoiceBenefitDetail(d)) return "";
    return `<p class="mp-v23-summary-subline">${escapeHtml(d.summaryLine || "Kies korting of cadeau tot €349")}</p>`;
  }


  function renderWhyChecks(d){
    if(isChoiceBenefitDetail(d)){
      var items = Array.isArray(d.detailConditionItems) ? d.detailConditionItems : [
        "Internetabonnement",
        "TV-abonnement",
        "Internet en TV",
        "Overstappen naar Internet en TV",
        "Alles-in-1"
      ];
      return items.slice(0,5).map(function(c){ return `<li>${escapeHtml(c)}</li>`; }).join("");
    }

    var checks = [];
    if(d.giftName || d.giftType || d.giftValue) checks.push((d.giftName || d.giftType || "Cadeau") + (d.giftValue ? " t.w.v. " + euro(d.giftValue) : ""));
    if(d.cashbackValue) checks.push(euro(d.cashbackValue) + " cashback");
    if(d.discountValue) checks.push(euro(d.discountValue) + " korting");
    if(d.data || d.dataBundle) checks.push(detailValue(d, ["data","dataBundle"], "") + " data");
    if(isPeriodBenefitDetail(d)) checks.push("Meepakker: " + (d.totalBenefitLabel || "extra voordeel"));
    else checks.push("Totaal voordeel " + euro(d.totalBenefitValue || d.benefitValue || 0));
    return checks.slice(0,5).map(function(c){ return `<li>${escapeHtml(c)}</li>`; }).join("");
  }



  function renderOverviewCta(d){
    return `
      <a class="mp-v23-master-secondary js-affiliate-link"
        href="${escapeHtml(d.affiliateUrl || "#")}"
        data-affiliate-link="true"
        data-affiliate-deal-id="${escapeHtml(d.id || "")}"
        data-affiliate-provider-id="${escapeHtml(d.providerId || "")}"
        data-affiliate-category="${escapeHtml(d.category || "")}"
        data-affiliate-network="${escapeHtml(d.network || "daisycon")}"
        data-affiliate-campaign-id="${escapeHtml(d.campaignId || "")}"
        data-affiliate-tracking-id="${escapeHtml(d.trackingId || "")}"
        data-affiliate-merchant-id="${escapeHtml(d.merchantId || d.providerId || "")}"
        rel="sponsored noopener noreferrer">${escapeHtml(detailCtaLabel(d))}</a>
    `;
  }

  function renderOverviewCard(d, cards, subtitle, disclaimer){
    return `
      <section class="mp-v23-left mp-v23-left--master-intro">
        <article class="mp-v23-master-intro-card">
          <div class="mp-v23-master-intro-kicker">Aanbiedingsoverzicht</div>
          <h1>${escapeHtml(d.detailIntroTitle || d.title || "Aanbieding")}</h1>
          <p class="mp-v23-master-intro-subtitle">${escapeHtml(subtitle || d.detailIntroSubtitle || "Tijdelijke actie")}</p>
          <div class="mp-v23-master-mini-grid">
            ${cards.slice(0,3).map(function(card){
              return `
                <div class="mp-v23-master-mini">
                  <strong>${escapeHtml(card.title)}</strong>
                  <span>${escapeHtml(card.text).replace(/\n/g, "<br>")}</span>
                </div>
              `;
            }).join("")}
          </div>
          <p class="mp-v23-master-disclaimer">${escapeHtml(disclaimer || d.termsSummary || "Controleer altijd het actuele aanbod en de voorwaarden bij de aanbieder.")}</p>
          ${renderOverviewCta(d)}
        </article>
      </section>
    `;
  }

  function periodOverviewCards(d){
    var direct = Array.isArray(d.detailIntroCards) ? d.detailIntroCards : [];
    if(direct.length) return direct;

    var service = d.category === "sim-only" ? "Onbeperkt bellen en data" : "Onbeperkt bellen, sms'en en data";
    return [
      {title: d.detailSummaryValue || d.totalBenefitLabel || "Tijdelijk voordeel", text: "op " + (d.title || "dit abonnement")},
      {title: service, text: d.category === "sim-only" ? "Sim Only via " + (d.provider || "de aanbieder") : "Mobiel abonnement via " + (d.provider || "de aanbieder")},
      {title: "Actie t/m 1 juli 2026", text: "Controleer het actuele aanbod"}
    ];
  }

  function renderDetailLeftColumn(d){
    if(isChoiceBenefitDetail(d)){
      var choiceCards = Array.isArray(d.detailIntroCards) ? d.detailIntroCards : [
        {title:"Tot 14 maanden korting", text:"8 maanden bij 1 jaar · 14 maanden bij 2 jaar"},
        {title:"Cadeau tot €349", text:"Bijvoorbeeld tablet of wifi-versterkers"},
        {title:"Vanaf €23,50 p/m", text:"Tijdens de kortingsperiode"}
      ];
      return renderOverviewCard(
        d,
        choiceCards,
        d.detailIntroSubtitle || "Welkomstactie bij overstap",
        "Deze actie is bedoeld voor nieuwe klanten of overstappers. Bestaande klanten of wijzigingen binnen een lopend contract kunnen zijn uitgesloten. Controleer altijd de actuele voorwaarden bij Budget Thuis."
      );
    }

    if(isPeriodBenefitDetail(d)){
      return renderOverviewCard(
        d,
        periodOverviewCards(d),
        d.detailIntroSubtitle || "Tijdelijke actie op " + (d.title || "dit abonnement"),
        d.termsSummary || "Controleer altijd het actuele aanbod en de voorwaarden bij de aanbieder."
      );
    }

    return `
      <section class="mp-v23-left">
        <h1>Wat krijg je?</h1>
        <div class="mp-v23-benefit-grid">
          ${mpVisualBenefitCards(d)}
        </div>
      </section>
    `;
  }


  function renderMobileDeal(d, root){
    var isPeriod = isPeriodBenefitDetail(d);
    var mobileOverview = isPeriod ? `
      <section class="mp-detail-card mp-detail-advantage mp-detail-advantage--overview">
        <p class="mp-mobile-overview-kicker">Aanbiedingsoverzicht</p>
        <h3>${escapeHtml(d.detailIntroTitle || d.title || "Aanbieding")}</h3>
        <p>${escapeHtml(d.detailIntroSubtitle || "Tijdelijke actie bij " + (d.provider || "de aanbieder"))}</p>
        <div class="mp-detail-benefits">
          ${periodOverviewCards(d).map(function(card){ return `<div class="mp-detail-benefit"><div><strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.text)}</small></div></div>`; }).join("")}
        </div>
        <p class="mp-mobile-overview-disclaimer">${escapeHtml(d.termsSummary || "Controleer altijd het actuele aanbod en de voorwaarden bij de aanbieder.")}</p>
      </section>
    ` : `
      <section class="mp-detail-card mp-detail-advantage">
        <h3>Wat krijg je extra?</h3>
        <div class="mp-detail-benefits">
          ${benefitRows(d) || "<p>Extra voordeel via deze aanbieder.</p>"}
        </div>
        <div class="mp-advantage-total">
          <small>${escapeHtml(benefitSummaryLabelDetail(d))}</small>
          <strong>${escapeHtml(detailSummaryValue(d))}</strong>
          ${detailPriceLines(d)}
        </div>
      </section>
    `;

    root.innerHTML = `
        <header class="mp-detail-intro">
          <p>${categoryLabel(d.category)}</p>
          <h1>${d.provider || "Aanbieder"}</h1>
        </header>

        ${mobileOverview}

        <section class="mp-detail-card mp-detail-product">
          <h3>${d.provider || "Aanbieder"}</h3>
          <p>${d.title || "Actie met extra voordeel"}</p>
        </section>

        <section class="mp-detail-card mp-detail-specs">
          <h3>Dealgegevens</h3>
          <div><span>Prijs per maand</span><strong>${d.price || (d.monthlyPrice ? euro(d.monthlyPrice) + " / maand" : "Bekijk aanbieder")}</strong></div>
          <div><span>Contractduur</span><strong>${d.contract || (d.contractLengthMonths ? d.contractLengthMonths + " maanden" : "Bekijk aanbieder")}</strong></div>
          <div><span>Klanttype</span><strong>${d.dealType || d.klanttype || "Beschikbaar"}</strong></div>
          <div><span>Provider</span><strong>${d.provider || "Aanbieder"}</strong></div>
        </section>

        <a class="mp-provider-cta js-affiliate-link"
           href="${d.affiliateUrl || "#"}"
           data-affiliate-link="true"
           data-affiliate-deal-id="${d.id || ""}"
           data-affiliate-provider-id="${d.providerId || ""}"
           data-affiliate-category="${d.category || ""}"
           data-affiliate-network="${d.network || "placeholder"}"
           data-affiliate-campaign-id="${d.campaignId || ""}"
           data-affiliate-tracking-id="${d.trackingId || ""}"
           data-affiliate-merchant-id="${d.merchantId || d.providerId || ""}"
           rel="sponsored noopener noreferrer"
           aria-label="Pak deze MeerPakker">${escapeHtml(detailCtaLabel(d))}</a>
    `;
  }



  function renderSummaryAside(d){
    if(isChoiceBenefitDetail(d)) return "";
    return "";
  }


  function renderDeal(d){
    const root = document.getElementById("mpDealDetail");
    if(!root) return;
    updateStaticTopbarBack("../");
    updateStaticTopbarBack(returnUrl(d));

    if(window.matchMedia && window.matchMedia("(max-width: 1023px)").matches){
      renderMobileDeal(d, root);
      window.setTimeout(refreshSavedHeader, 0);
      window.setTimeout(refreshSavedHeader, 120);
      return;
    }

    
    
    
    root.innerHTML = `
      <section class="mp-v23-shell">
        <div class="mp-v23-top ${(isChoiceBenefitDetail(d) || isPeriodBenefitDetail(d)) ? "mp-v23-top--single-master" : ""}">
          ${renderDetailLeftColumn(d)}

          ${renderSummaryAside(d)}
        </div><section class="mp-v23-details">
          <h2>De details</h2>
          <div class="mp-v23-detail-grid mp-v23-detail-grid--why-first">
            <article class="mp-v23-detail-card mp-v23-detail-card--why">
              
              <div class="mp-v23-detail-why-copy">
                <h3>${escapeHtml(renderWhyTitle(d))}</h3>
                <p>${renderWhyText(d)}</p>
              </div>
              <ul class="mp-v23-checks mp-v23-detail-checks">${renderWhyChecks(d)}</ul>
            </article>

            <article class="mp-v23-detail-card mp-v23-detail-card--contract">
              
              <h3>Contractinformatie</h3>
              <dl>
                <div><dt>Looptijd</dt><dd>${escapeHtml(d.contract || (d.contractLengthMonths ? d.contractLengthMonths + " maanden" : "Bekijk aanbieder"))}</dd></div>
                <div><dt>Type</dt><dd>${escapeHtml(d.dealType || d.klanttype || "Beschikbaar")}</dd></div>
                <div><dt>Provider</dt><dd>${escapeHtml(d.provider || "Aanbieder")}</dd></div>
                <div><dt>Maandprijs</dt><dd>${escapeHtml(isChoiceBenefitDetail(d) ? (d.contractPriceLabel || "Bekijk aanbieder") : (d.monthlyPrice ? "€" + d.monthlyPrice + " p/m" : "Bekijk aanbieder"))}</dd></div>
              </dl>
            </article>
          </div>

          ${renderProviderDescriptionBlock(d)}
        </section>

        ${renderSeoSupportBlock(d)}
      </section>
    `;


    window.setTimeout(refreshSavedHeader, 0);
    window.setTimeout(refreshSavedHeader, 120);
  }


  function renderSeoSupportBlock(d){
    const fallback = isChoiceBenefitDetail(d) ? {
      eyebrow: "Meer weten voordat je kiest?",
      title: "Uitleg bij deze Internet & TV actie",
      description: "Lees hoe korting, cadeaus, vanafprijzen en welkomstacties werken voordat je doorklikt naar de aanbieder.",
      links: [
        { label: "Internet & TV met korting", href: "/uitleg/internet-tv-met-korting/" },
        { label: "Internet & TV met cadeau", href: "/uitleg/internet-tv-met-cadeau/" },
        { label: "Korting of cadeau kiezen", href: "/uitleg/korting-of-cadeau-kiezen/" },
        { label: "Wat betekent vanafprijs?", href: "/uitleg/vanafprijs-abonnementen/" }
      ]
    } : null;

    const support = d && d.seoSupport ? d.seoSupport : fallback;
    if(!support || !Array.isArray(support.links) || !support.links.length) return "";

    const returnTo = "/deals/" + encodeURIComponent((d && d.seoSlug) || "") + ".html%23mpDealDetail";
    const links = support.links.map(function(link){
      const href = String(link.href || "/uitleg/");
      const separator = href.indexOf("?") > -1 ? "&" : "?";
      return '<a href="' + escapeHtml(href + separator + "returnTo=" + returnTo) + '">' + escapeHtml(link.label || "Meer uitleg") + '</a>';
    }).join("");

    return `
      <section class="mp-v23-seo-support">
        <div>
          <span>${escapeHtml(support.eyebrow || "Meer weten voordat je kiest?")}</span>
          <h2>${escapeHtml(support.title || "Meer uitleg")}</h2>
          <p>${escapeHtml(support.description || "Lees meer voordat je doorklikt naar de aanbieder.")}</p>
        </div>
        <div class="mp-v23-seo-support-links">${links}</div>
      </section>
    `;
  }


  function renderProviderDescriptionBlock(d){
    if(!d || !d.providerDescription) return "";
    return `
      <article class="mp-v23-detail-card mp-v23-detail-card--provider-description">
        
        <div class="mp-v23-detail-why-copy">
          <h3>${escapeHtml(d.providerDescriptionTitle || "Over de aanbieder")}</h3>
          <p>${escapeHtml(d.providerDescription)}</p>
        </div>
      </article>
    `;
  }

  function renderNotFound(){
    const root = document.getElementById("mpDealDetail");
    if(!root) return;

    root.innerHTML = `
        <header class="mp-detail-intro">
          <p>Deal</p>
          <h1>Deal niet gevonden</h1>
        </header>
        <section class="mp-detail-card">
          <h3>Deze deal konden we niet vinden</h3>
          <p>Ga terug naar MeerPakkers en kies opnieuw een deal.</p>
        </section>
    `;
    window.setTimeout(refreshSavedHeader, 0);
    window.setTimeout(refreshSavedHeader, 120);
  }

  function load(){
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("deal");

    fetch("../data/deals.json")
      .then(function(res){
        if(!res.ok) return fetch("/data/deals.json");
        return res;
      })
      .then(function(res){ return res.json(); })
      .then(function(deals){
        const deal = (Array.isArray(deals) ? deals : []).find(function(d){
          return matchesDeal(d, requested);
        });

        if(deal) renderDeal(deal);
        else renderNotFound();
      })
      .catch(renderNotFound);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
