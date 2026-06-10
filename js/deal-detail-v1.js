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
    const rows = [];
    if(d.giftName || d.giftType || d.giftValue){
      rows.push(["🎁", d.giftName || d.giftType || "Cadeau", d.giftValue ? "t.w.v. " + euro(d.giftValue) : ""]);
    }
    if(d.cashbackValue){
      rows.push(["💸", "Cashback", euro(d.cashbackValue)]);
    }
    if(d.discountValue){
      rows.push(["🏷️", "Korting", euro(d.discountValue)]);
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
        title:"Korting",
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
          rel="sponsored noopener noreferrer">Pak deze Meepakker</a>
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
        label:"Korting",
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
    var rows = [];
    if(d.giftName || d.giftType || d.giftValue){
      rows.push(["🎁", d.giftName || d.giftType || "Cadeau", d.giftValue ? "t.w.v. " + euro(d.giftValue) : ""]);
    }
    if(d.cashbackValue) rows.push(["💰", "Cashback", euro(d.cashbackValue)]);
    if(d.discountValue) rows.push(["🏷️", "Korting", euro(d.discountValue)]);
    return rows.slice(0,3).map(function(r){
      return `<div class="mp-dd-summary-line"><span>${r[0]}</span><strong>${escapeHtml(r[1])}</strong><em>${escapeHtml(r[2])}</em></div>`;
    }).join("");
  }

  function renderWhyText(d){
    var provider = d.provider || "deze aanbieder";
    var total = euro(d.totalBenefitValue || d.benefitValue || 0);
    var parts = [];
    if(d.giftName || d.giftType) parts.push((d.giftName || d.giftType) + " cadeau");
    if(d.cashbackValue) parts.push(euro(d.cashbackValue) + " cashback");
    if(d.discountValue) parts.push(euro(d.discountValue) + " korting");
    var extras = parts.length ? " Je krijgt " + parts.join(", ") + "." : " Je krijgt extra voordeel bovenop het abonnement.";
    return "Met deze " + provider + " deal krijg je meer dan alleen een standaard abonnement." + extras + " Daardoor loopt jouw totale voordeel op tot " + total + ".";
  }

  function renderWhyChecks(d){
    var checks = [];
    if(d.giftName || d.giftType || d.giftValue) checks.push((d.giftName || d.giftType || "Cadeau") + (d.giftValue ? " t.w.v. " + euro(d.giftValue) : ""));
    if(d.cashbackValue) checks.push(euro(d.cashbackValue) + " cashback");
    if(d.discountValue) checks.push(euro(d.discountValue) + " korting");
    if(d.data || d.dataBundle) checks.push(detailValue(d, ["data","dataBundle"], "") + " data");
    checks.push("Totaal voordeel " + euro(d.totalBenefitValue || d.benefitValue || 0));
    return checks.slice(0,5).map(function(c){ return `<li>${escapeHtml(c)}</li>`; }).join("");
  }


  function renderMobileDeal(d, root){
    root.innerHTML = `
        <header class="mp-detail-intro">
          <p>${categoryLabel(d.category)}</p>
          <h1>${d.provider || "Aanbieder"}</h1>
        </header>

        <section class="mp-detail-card mp-detail-advantage">
          <h3>Wat krijg je extra?</h3>
          <div class="mp-detail-benefits">
            ${benefitRows(d) || "<p>Extra voordeel via deze aanbieder.</p>"}
          </div>

          <div class="mp-advantage-total">
            <small>Totaal voordeel</small>
            <strong>${euro(d.totalBenefitValue || d.benefitValue || 0)}</strong>
          </div>
        </section>

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
           aria-label="Pak deze MeerPakker">Pak deze MeerPakker →</a>
    `;
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
        <div class="mp-v23-top">
          <section class="mp-v23-left">
            <h1>Wat krijg je?</h1>
            <div class="mp-v23-benefit-grid">
              ${mpVisualBenefitCards(d)}
            </div>
          </section>

          <aside class="mp-v23-summary">
            <h2>Jouw Meepakker</h2>
            <div class="mp-v23-summary-list">
              ${renderMeepakkerSummary(d)}
            </div>

            <div class="mp-v23-total">
              <span>Totaal voordeel</span>
              <strong>${euro(d.totalBenefitValue || d.benefitValue || 0)}</strong>
            </div>

            <a class="mp-v23-primary js-affiliate-link"
              href="${d.affiliateUrl || "#"}"
              data-affiliate-link="true"
              data-affiliate-deal-id="${d.id || ""}"
              data-affiliate-provider-id="${d.providerId || ""}"
              data-affiliate-category="${d.category || ""}"
              rel="sponsored noopener noreferrer">Pak deze Meepakker</a>
          </aside>
        </div><section class="mp-v23-details">
          <h2>De details</h2>
          <div class="mp-v23-detail-grid mp-v23-detail-grid--why-first">
            <article class="mp-v23-detail-card mp-v23-detail-card--why">
              <div class="mp-v23-detail-icon">🎁</div>
              <div class="mp-v23-detail-why-copy">
                <h3>Waarom is dit een Meepakker?</h3>
                <p>${renderWhyText(d)}</p>
              </div>
              <ul class="mp-v23-checks mp-v23-detail-checks">${renderWhyChecks(d)}</ul>
            </article>

            <article class="mp-v23-detail-card mp-v23-detail-card--contract">
              <div class="mp-v23-detail-icon">🗓️</div>
              <h3>Contractinformatie</h3>
              <dl>
                <div><dt>Looptijd</dt><dd>${escapeHtml(d.contract || (d.contractLengthMonths ? d.contractLengthMonths + " maanden" : "Bekijk aanbieder"))}</dd></div>
                <div><dt>Type</dt><dd>${escapeHtml(d.dealType || d.klanttype || "Beschikbaar")}</dd></div>
                <div><dt>Provider</dt><dd>${escapeHtml(d.provider || "Aanbieder")}</dd></div>
                <div><dt>Maandprijs</dt><dd>${escapeHtml(d.monthlyPrice ? "€" + d.monthlyPrice + " p/m" : "Bekijk aanbieder")}</dd></div>
              </dl>
            </article>
          </div>
        </section>

      </section>
    `;


    window.setTimeout(refreshSavedHeader, 0);
    window.setTimeout(refreshSavedHeader, 120);
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
