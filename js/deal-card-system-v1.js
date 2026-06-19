
(function(){
  "use strict";

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function slugify(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " en ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function dealId(deal){
    return String((deal && (deal.id || deal.seoSlug)) || slugify(((deal && deal.provider) || "aanbieder") + " " + ((deal && (deal.title || deal.name)) || "deal")));
  }

  function dealUrl(deal, category){
    if(window.MPDealCard && typeof window.MPDealCard.dealUrl === "function"){
      return window.MPDealCard.dealUrl(deal, category || deal.category);
    }
    var params = new URLSearchParams();
    params.set("deal", dealId(deal));
    if(category || (deal && deal.category)) params.set("category", category || deal.category);
    params.set("return", window.location.pathname + window.location.search);
    return "/deal/?" + params.toString();
  }

  function cleanBenefit(value){
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/^\s*[🎁🏷️💸✨✅☑️✔️➕]\s*/u, "")
      .trim();
  }

  function normalizeDeal(deal){
    return Object.assign({}, deal || {});
  }

  function benefitHtml(deal, cls){
    var benefits = Array.isArray(deal.benefits) ? deal.benefits : [];
    return benefits.slice(0,3).map(function(item){
      return '<span>' + escapeHtml(cleanBenefit(item)) + '</span>';
    }).join("");
  }

  function renderNormalDealCard(deal){
    var d = normalizeDeal(deal);
    var id = dealId(d);
    var url = dealUrl(d, d.category);
    var benefits = benefitHtml(d);

    return '' +
      '<a class="mp-normal-deal-card" href="' + escapeHtml(url) + '" data-deal-id="' + escapeHtml(id) + '">' +
        '<button class="meepakker-save-heart" type="button" aria-label="Deal opslaan" data-save-deal-id="' + escapeHtml(id) + '">♡</button>' +
        '<div class="mp-normal-deal-card-content">' +
          '<h3>' + escapeHtml(d.provider || "Aanbieder") + '</h3>' +
          '<div class="mp-card-title"><strong>' + escapeHtml(d.title || d.name || "Actie met extra voordeel") + '</strong></div>' +
          '<div class="mp-card-benefits-pill" aria-label="Extra voordelen">' + benefits + '</div>' +
        '</div>' +
        '<span class="mp-normal-deal-card-cta">Bekijk deal</span>' +
      '</a>';
  }

  function renderCheckedDealCard(deal, item){
    var d = normalizeDeal(deal);
    var id = dealId(d);
    var url = dealUrl(d, item && item.id ? item.id : d.category);
    var benefits = benefitHtml(d);

    return '' +
      '<article class="mp-checked-deal-card category-winner-card--real" data-deal-id="' + escapeHtml(id) + '">' +
        '<button class="mp-featured-heart meepakker-save-heart" type="button" aria-label="Deal opslaan" data-save-deal-id="' + escapeHtml(id) + '">♡</button>' +
        '<div class="mp-checked-deal-card-main">' +
          '<h3 class="category-winner-provider">' + escapeHtml(d.provider || "Aanbieder") + '</h3>' +
          '<p class="category-winner-title">' + escapeHtml(d.title || d.name || "Actie met extra voordeel") + '</p>' +
          '<div class="category-winner-benefits">' + benefits + '</div>' +
        '</div>' +
        '<div class="category-winner-footer category-winner-footer--cta-only">' +
          '<a href="' + escapeHtml(url) + '">' + escapeHtml(d.ctaLabel || "Bekijk deal") + ' →</a>' +
        '</div>' +
      '</article>';
  }

  window.MPCardComponents = {
    renderNormalDealCard: renderNormalDealCard,
    renderCheckedDealCard: renderCheckedDealCard,
    dealUrl: dealUrl,
    dealId: dealId,
    cleanBenefit: cleanBenefit
  };
})();
