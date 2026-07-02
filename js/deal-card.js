/* MeerPakkers DealCard Component v2
   Officiële dealcard: gebaseerd op de rustige Home/Kies je Meepakker-card.
   Featured cards blijven bewust een apart component.
*/
(function(){
  function euro(value){
    return "€" + Number(value || 0).toLocaleString("nl-NL");
  }

  function categoryLabel(category){
    return {
      "mobiel":"Mobiel",
      "sim-only":"Sim Only",
      "internet-tv":"Internet & TV",
      "streaming":"Streaming"
    }[category] || category || "Deal";
  }

  function categoryIcon(category, customIcon){
    return customIcon || {
      "mobiel":"📱",
      "sim-only":"📶",
      "internet-tv":"🌐",
      "streaming":"▶️"
    }[category] || "🎁";
  }

  function slugify(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " en ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function dealId(d){
    return String((d && (d.id || d.seoSlug)) || slugify(((d && d.provider) || "aanbieder") + " " + ((d && (d.title || d.name)) || "deal")));
  }

  function dealUrl(d, category){
    var activeCategory = category || (d && d.category) || "";
    var currentPath = window.location.pathname || "/";
    var currentSearch = window.location.search || "";
    var returnTo = currentPath + currentSearch;

    // Category pages should return to their own page, not to providers or old static deal pages.
    // Keep query filters when the user opened a deal from a filtered category page.
    if(activeCategory && currentPath.indexOf("/" + activeCategory + "/") === 0){
      returnTo = "/" + activeCategory + "/" + currentSearch;
    }

    var params = new URLSearchParams();
    params.set("deal", dealId(d));
    if(activeCategory) params.set("category", activeCategory);
    params.set("return", returnTo);
    return "/deal/?" + params.toString();
  }


  function normalize(deal){
    var d = Object.assign({}, deal || {});
    var calculated = Number(d.giftValue || 0) + Number(d.cashbackValue || 0) + Number(d.discountValue || 0) + Number(d.extraValue || 0);
    d.totalBenefitValue = Number(d.totalBenefitValue || calculated || d.benefitValue || 0);
    return d;
  }

  function normalizeBenefitLabel(value){
    var text = String(value || "").replace(/\s+/g, " ").trim();
    return text.replace(/🎁\s*cadeaukaart/i, "🎁 €100 cadeaukaart");
  }

  function benefitRows(deal){
    var d = normalize(deal);
    var rows = [];
    if(Array.isArray(d.benefits) && d.benefits.length){
      rows = d.benefits.slice(0,3).map(normalizeBenefitLabel).filter(Boolean);
    } else {
      if(d.giftType || d.giftValue){
        rows.push("🎁 " + (d.giftType || "Cadeau") + (d.giftValue && !String(d.giftType || "").includes("€") ? " t.w.v. " + euro(d.giftValue) : ""));
      }
      if(d.cashbackValue) rows.push("💸 " + euro(d.cashbackValue) + " cashback");
      if(d.discountValue) rows.push("🏷️ " + euro(d.discountValue) + " korting");
    }
    if(!rows.length) rows = ["🎁 Extra voordeel"];
    return rows.slice(0,3);
  }

  function totalBenefitLabel(deal){
    var d = normalize(deal);
    return d.totalBenefitLabel || euro(d.totalBenefitValue || d.benefitValue || 0);
  }

  function benefitPills(deal){
    return benefitRows(deal).map(function(p){ return '<span>' + escapeHtml(p) + '</span>'; }).join('');
  }

  function render(deal, options){
    var d = normalize(deal);
    var opts = options || {};
    var category = opts.category || d.category || "";
    var icon = d.giftValue ? "🎁" : (d.cashbackValue ? "💰" : (d.discountValue ? "🏷️" : categoryIcon(category, d.icon)));
    var url = opts.url || (opts.returnUrl ? (function(){
      var params = new URLSearchParams();
      params.set("deal", dealId(d));
      if(category) params.set("category", category);
      params.set("return", opts.returnUrl);
      return "/deal/?" + params.toString();
    })() : dealUrl(d, category));
    var id = dealId(d);
    var value = d.totalBenefitValue || d.benefitValue || 0;
    var rank = opts.rank ? '<div class="mp-clean-rank mp-official-rank">#' + escapeHtml(opts.rank) + '</div>' : '';

    return '<article class="mp-clean-deal-card mp-deal-card-component mp-official-deal-card mp-home-meepakker-deal-card" data-deal-id="' + escapeHtml(id) + '">'
      + rank
      + '<button class="meepakker-save-heart" type="button" aria-label="Deal opslaan" data-save-deal-id="' + escapeHtml(id) + '">♡</button>'
      + '<div class="mp-clean-card-head mp-official-card-content">'
        + '<div class="meepakker-icon mp-clean-card-icon" aria-hidden="true">' + escapeHtml(icon) + '</div>'
        + '<div class="mp-official-copy">'
          + '<div class="mp-clean-card-category">' + escapeHtml(opts.categoryLabel || categoryLabel(category)) + '</div>'
          + '<h3>' + escapeHtml(d.provider || "Aanbieder") + '</h3>'
          + '<p class="mp-card-title"><strong>' + escapeHtml(d.title || d.name || "Actie met extra voordeel") + '</strong></p>'
          + '<div class="mp-clean-benefits mp-card-benefits-pill" aria-label="Extra voordelen">' + benefitPills(d) + '</div>'
        + '</div>'
      + '</div>'
      + '<div class="mp-clean-card-bottom mp-card-footer" aria-label="Totaal voordeel en bekijken">'
        + '<div class="mp-card-total"><small>Totaal voordeel</small><strong>' + escapeHtml(d.totalBenefitLabel || euro(value)) + '</strong></div>'
        + '<a class="mp-card-cta" href="' + escapeHtml(url) + '">Bekijk deal</a>'
      + '</div>'
    + '</article>';
  }

  window.MPDealCard = {
    version: 'v2-official-meepakker-card',
    render: render,
    euro: euro,
    benefitPills: benefitPills,
    categoryLabel: categoryLabel,
    normalize: normalize,
    dealUrl: dealUrl,
    dealId: dealId,
    totalBenefitLabel: totalBenefitLabel
  };
})();
