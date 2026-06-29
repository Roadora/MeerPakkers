
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
    var activeCategory = category || (deal && deal.category) || "";
    var currentPath = window.location.pathname || "/";
    var currentSearch = window.location.search || "";
    var returnTo = currentPath + currentSearch;

    // Keep a visitor in the same category context after returning from a detail page.
    if(activeCategory && currentPath.indexOf("/" + activeCategory + "/") === 0){
      returnTo = "/" + activeCategory + "/" + currentSearch;
    }

    var params = new URLSearchParams();
    params.set("deal", dealId(deal));
    if(activeCategory) params.set("category", activeCategory);
    params.set("return", returnTo);
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

  function cardProductImageHtml(deal){
    var src = String((deal && deal.cardImage) || '').trim();
    if(!src) return '';
    var alt = String((deal && deal.cardImageAlt) || '').trim();
    var variant = String((deal && deal.cardImageVariant) || '').toLowerCase();
    var isLandscape = variant === 'landscape';
    var isSquare = variant === 'square';
    var isSquareLarge = variant === 'square-large';
    var variantClass = isLandscape
      ? ' mp-card-product-image--landscape'
      : (isSquareLarge ? ' mp-card-product-image--square-large' : (isSquare ? ' mp-card-product-image--square' : ''));
    return '' +
      '<span class="mp-card-product-image' + variantClass + '" aria-hidden="' + (alt ? 'false' : 'true') + '">' +
        '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '" loading="lazy" decoding="async">' +
      '</span>';
  }

  /*
   * Normal DealCard is the single card component across MeerPakkers.
   * The saved-deals page uses the same content/benefits/card shell, with a
   * deliberate action-slot variant: Bekijk deal + Verwijder sit side by side.
   * Other pages keep the existing save-heart behaviour and markup unchanged.
   */
  function renderNormalDealCard(deal, categoryOverride, options){
    var d = normalizeDeal(deal);
    var id = dealId(d);
    var url = dealUrl(d, categoryOverride || d.category);
    var benefits = benefitHtml(d);
    var opts = Object.assign({ mode: 'default' }, options || {});
    var isSavedMode = opts.mode === 'saved';
    var provider = escapeHtml(d.provider || "Aanbieder");
    var title = escapeHtml(d.title || d.name || "Actie met extra voordeel");
    var cta = escapeHtml(d.ctaLabel || 'Bekijk deal');
    var productImage = cardProductImageHtml(d);

    if (isSavedMode) {
      return '' +
        '<article class="mp-normal-deal-card mp-normal-deal-card--saved mp-saved-component-card' + (productImage ? ' mp-normal-deal-card--with-product-image' : '') + '" data-card-component="normal-v2" data-card-mode="saved" data-deal-id="' + escapeHtml(id) + '">' +
          '<a class="mp-normal-deal-card-link" href="' + escapeHtml(url) + '" aria-label="Bekijk ' + provider + ' ' + title + '">' +
            '<div class="mp-normal-deal-card-content">' +
              '<div class="mp-card-top-row">' +
                '<div class="mp-card-copy">' +
                  '<h3>' + provider + '</h3>' +
                  '<div class="mp-card-title"><strong>' + title + '</strong></div>' +
                '</div>' +
                productImage +
              '</div>' +
              '<div class="mp-card-benefits-pill" aria-label="Extra voordelen">' + benefits + '</div>' +
            '</div>' +
          '</a>' +
          '<div class="mp-normal-deal-card-actions" aria-label="Dealacties">' +
            '<button class="mp-normal-deal-card-remove" type="button" data-remove-saved-deal="' + escapeHtml(id) + '" aria-label="Verwijder ' + provider + ' ' + title + ' uit opgeslagen deals">Verwijder</button>' +
            '<a class="mp-normal-deal-card-cta" href="' + escapeHtml(url) + '">' + cta + '</a>' +
          '</div>' +
        '</article>';
    }

    return '' +
      '<a class="mp-normal-deal-card' + (productImage ? ' mp-normal-deal-card--with-product-image' : '') + '" href="' + escapeHtml(url) + '" data-card-component="normal-v2" data-deal-id="' + escapeHtml(id) + '">' +
        '<button class="meepakker-save-heart" type="button" aria-label="Deal opslaan" data-save-deal-id="' + escapeHtml(id) + '">♡</button>' +
        '<div class="mp-normal-deal-card-content">' +
          '<div class="mp-card-top-row">' +
            '<div class="mp-card-copy">' +
              '<h3>' + provider + '</h3>' +
              '<div class="mp-card-title"><strong>' + title + '</strong></div>' +
            '</div>' +
            productImage +
          '</div>' +
          '<div class="mp-card-benefits-pill" aria-label="Extra voordelen">' + benefits + '</div>' +
        '</div>' +
        '<span class="mp-normal-deal-card-cta">' + cta + '</span>' +
      '</a>';
  }

  /*
   * Home "Gecontroleerde deals" is now only a section/container variant.
   * Every real deal uses the same normal DealCard DOM renderer as category,
   * provider and saved-deal views. Placeholders remain a separate state.
   */
  function renderCheckedDealCard(deal, item){
    return renderNormalDealCard(deal, item && item.id ? item.id : (deal && deal.category));
  }

  /*
   * Home "Beste deals per categorie" component.
   * One renderer owns both real deals and "Binnenkort" placeholders so the shared
   * DOM contract never drifts between the two states. This component deliberately
   * has no normal-dealcard half-circle decoration.
   */
  function renderBestCategoryCard(options){
    var o = Object.assign({ isPlaceholder: false }, options || {});
    var d = normalizeDeal(o.deal || {});
    var category = o.category || d.category || "";
    var id = dealId(d);
    var isPlaceholder = Boolean(o.isPlaceholder);
    var provider = isPlaceholder ? "Binnenkort" : (d.provider || "Aanbieder");
    var title = isPlaceholder
      ? (o.placeholderTitle || "Nieuwe deals worden binnenkort toegevoegd.")
      : (d.title || d.name || "Actie met extra voordeel");
    var benefits = isPlaceholder
      ? '<span>' + escapeHtml(o.placeholderBenefit || "Alleen bevestigd voordeel") + '</span>'
      : benefitHtml(d);
    var url = isPlaceholder
      ? (o.placeholderUrl || (category ? "/" + category + "/" : "/deals/"))
      : dealUrl(d, category);
    var cta = isPlaceholder
      ? (o.placeholderCta || "Bekijk categorie →")
      : (d.ctaLabel || "Bekijk deal");
    // Best-per-category cards are editorial/featured cards, not saveable deal cards.
    // Keep this component intentionally free of the normal dealcard heart action.
    var saveButton = "";
    var modifier = isPlaceholder ? " mp-best-category-card--placeholder" : "";

    return '' +
      '<article class="mp-best-category-card' + modifier + '" data-card-component="best-category-v2"' + (isPlaceholder ? '' : ' data-deal-id="' + escapeHtml(id) + '"') + '>' +
        saveButton +
        '<div class="mp-best-category-card-content">' +
          '<h3 class="mp-best-category-provider">' + escapeHtml(provider) + '</h3>' +
          '<p class="mp-best-category-title">' + escapeHtml(title) + '</p>' +
          '<div class="mp-best-category-benefits" aria-label="Voordelen">' + benefits + '</div>' +
        '</div>' +
        '<div class="mp-best-category-footer">' +
          '<a class="mp-best-category-cta" href="' + escapeHtml(url) + '">' + escapeHtml(cta) + '</a>' +
        '</div>' +
      '</article>';
  }

  function renderBestCategoryDealCard(deal, categoryOverride){
    return renderBestCategoryCard({ deal: deal, category: categoryOverride || (deal && deal.category) });
  }

  function renderBestCategoryPlaceholderCard(options){
    return renderBestCategoryCard(Object.assign({}, options || {}, { isPlaceholder: true }));
  }

  window.MPCardComponents = {
    version: "normal-dealcard-v2-plus-best-category-v2",
    renderNormalDealCard: renderNormalDealCard,
    renderCheckedDealCard: renderCheckedDealCard,
    renderBestCategoryCard: renderBestCategoryCard,
    renderBestCategoryDealCard: renderBestCategoryDealCard,
    renderBestCategoryPlaceholderCard: renderBestCategoryPlaceholderCard,
    dealUrl: dealUrl,
    dealId: dealId,
    cleanBenefit: cleanBenefit
  };
})();
