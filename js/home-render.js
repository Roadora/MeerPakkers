
function mpSlugify(value){
  return String(value || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mpDealId(deal){
  if(window.MPDealCard && typeof window.MPDealCard.dealId === "function") return window.MPDealCard.dealId(deal);
  return String(deal.id || deal.seoSlug || mpSlugify((deal.provider || "aanbieder") + " " + (deal.title || deal.name || "deal")));
}

function mpDealUrl(deal, category){
  if(window.MPDealCard && typeof window.MPDealCard.dealUrl === "function") return window.MPDealCard.dealUrl(deal, category || deal.category);
  const provider = deal.provider || deal.providerName || "aanbieder";
  const title = deal.title || deal.name || "deal";
  const slug = mpSlugify(provider + " " + title);
  const params = new URLSearchParams();
  params.set("deal", slug);
  if(category || deal.category) params.set("category", mpSlugify(category || deal.category));
  params.set("return", window.location.pathname + window.location.search);
  return "deal/?" + params.toString();
}

function mpEscapeHomeHtml(value){
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mpNormalizeBenefitLabel(label){
  const text = String(label || "");
  const lower = text.toLowerCase();
  if(lower.includes("cashback")) return "💸 " + text;
  if(lower.includes("korting") || lower.includes("gratis") || lower.includes("maanden")) return "🏷️ " + text;
  return "🎁 " + text;
}

function mpNormalizeHomeDeal(deal){
  const d = Object.assign({}, deal || {});
  d.totalBenefitValue = Number(d.totalBenefitValue || d.benefitValue || 0);
  d.meerPakScore = Number(d.meerPakScore || d.score || 0);
  return d;
}

function mpEnhanceSavedButtons(){
  if (window.MeerPakkersSavedDealsUI && typeof window.MeerPakkersSavedDealsUI.enhanceCards === "function") {
    window.MeerPakkersSavedDealsUI.enhanceCards();
  }
}

window.MPHomeRender = {
  bestDealByCategory(categoryId){
    return window.MPHomeDeals.getCategoryWinner(categoryId);
  },

  renderCategoryWinners(){
    const el = document.getElementById("featuredDeal");
    if (!el) return;

    const config = [
      {id:"mobiel", label:"Mobiel", icon:"📱"},
      {id:"sim-only", label:"Sim Only", icon:"📶"},
      {id:"internet-tv", label:"Internet & TV", icon:"🌐"},
      {id:"streaming", label:"Streaming", icon:"🎬"}
    ];

    el.className = "category-winners-grid mp-featured-highlight-grid";

    el.innerHTML = config.map(item => {
      const raw = this.bestDealByCategory(item.id);
      if (!raw) {
        return `<article class="category-winner-card mp-featured-highlight-card">
          <div>
            <h3 class="category-winner-provider">Binnenkort</h3>
            <p class="category-winner-title">Nieuwe ${mpEscapeHomeHtml(item.label)} deals volgen snel.</p>
            <div class="category-winner-benefits"><span>🎁 Extra voordeel</span></div>
          </div>
          <div class="category-winner-footer">
            <div class="category-winner-value"><small>Totaal voordeel</small><strong>€0</strong></div>
            <a href="/${mpEscapeHomeHtml(item.id)}/">Bekijk ${mpEscapeHomeHtml(item.label)} →</a>
          </div>
        </article>`;
      }

      const d = mpNormalizeHomeDeal(raw);
      const value = d.totalBenefitValue || d.benefitValue || 0;
      const benefits = (d.benefits || []).slice(0,2).map(b => `<span>${mpEscapeHomeHtml(mpNormalizeBenefitLabel(b))}</span>`).join("");
      return `<article class="category-winner-card mp-featured-highlight-card" data-deal-id="${mpEscapeHomeHtml(mpDealId(d))}">
        <button class="mp-featured-heart meepakker-save-heart" type="button" aria-label="Deal opslaan" data-save-deal-id="${mpEscapeHomeHtml(mpDealId(d))}">♡</button><div class="mp-featured-highlight-main">
          <h3 class="category-winner-provider">${mpEscapeHomeHtml(d.provider)}</h3>
          <p class="category-winner-title">${mpEscapeHomeHtml(d.title || d.name)}</p>
          <div class="category-winner-benefits">${benefits}</div>
        </div>
        <div class="category-winner-footer">
          <div class="category-winner-value"><small>Totaal voordeel</small><strong>€${mpEscapeHomeHtml(value)}</strong></div>
          <a href="${mpEscapeHomeHtml(mpDealUrl(d, item.id))}">Bekijk deal →</a>
        </div>
      </article>`;
    }).join("");
    mpEnhanceSavedButtons();
  },

  renderFeatured(){
    this.renderCategoryWinners();
  },

  renderCompare(deals){
    const el = document.getElementById("compareStrip");
    if (!el) return;
    el.innerHTML = deals.slice(0,4).map((d,i) => `
      <article><strong>${d.provider}</strong><span>€${d.totalBenefitValue} voordeel</span>${i === 0 ? "<em>Beste keuze</em>" : ""}</article>
    `).join("");
  },

  renderDeals(deals){
    const count = document.getElementById("resultCount");
    const list = document.getElementById("dealList");
    if (count) count.textContent = `${deals.length} deals gevonden`;
    if (!list) return;

    // Home gebruikt nu exact de kaarttaal van /kies-je-meepakker/.
    // Geen legacy mp-home-list-card CSS meer op deze sectie.
    list.className = "meepakker-grid mp-home-meepakker-grid";

    list.innerHTML = deals.map((raw) => {
      const d = mpNormalizeHomeDeal(raw);
      if (window.MPDealCard && typeof window.MPDealCard.render === "function") {
        return window.MPDealCard.render(d, {
          category: d.category,
          url: mpDealUrl(d, d.category)
        });
      }
      const value = d.totalBenefitValue || d.benefitValue || 0;
      const benefitRows = (d.benefits && d.benefits.length)
        ? d.benefits.slice(0, 3).map(b => mpNormalizeBenefitLabel(b)).filter(Boolean)
        : [
            d.giftValue ? `🎁 ${d.giftType || "Cadeau"} t.w.v. €${d.giftValue}` : "",
            d.cashbackValue ? `💸 €${d.cashbackValue} cashback` : "",
            d.discountValue ? `🏷️ €${d.discountValue} korting` : ""
          ].filter(Boolean).slice(0, 3);
      const benefits = benefitRows.length ? benefitRows : ["Extra voordeel"];
      const benefitsHtml = benefits.map(b => `<span>${mpEscapeHomeHtml(b)}</span>`).join("");
      const icon = d.giftValue ? "🎁" : (d.cashbackValue ? "💰" : (d.discountValue ? "🏷️" : "🎁"));
      return `<a class="meepakker-card mp-home-meepakker-deal-card" href="${mpEscapeHomeHtml(mpDealUrl(d, d.category))}" data-deal-id="${mpEscapeHomeHtml(mpDealId(d))}">
        <div class="meepakker-save-heart" role="button" tabindex="0" aria-label="Deal opslaan" data-save-deal-id="${mpEscapeHomeHtml(mpDealId(d))}">♡</div>
        <div>
          <div class="meepakker-icon">${icon}</div>
          <h3>${mpEscapeHomeHtml(d.provider || "Aanbieder")}</h3>
          <div class="mp-card-title"><strong>${mpEscapeHomeHtml(d.title || d.name || "Actie met extra voordeel")}</strong></div>
          <div class="mp-card-benefits-pill" aria-label="Extra voordelen">${benefitsHtml}</div>
        </div>
        <div class="mp-card-footer" aria-label="Totaal voordeel en bekijken">
          <div class="mp-card-total">
            <small>Totaal voordeel</small>
            <strong>€${mpEscapeHomeHtml(value)}</strong>
          </div>
          <span class="mp-card-cta">Bekijk deal</span>
        </div>
      </a>`;
    }).join("");
  }

};


document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('input[type="search"]').forEach(function(inp){
    inp.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        const q = (inp.value || '').trim();
        if(q){
          window.location.href = '/mobiel/?q=' + encodeURIComponent(q);
        }
      }
    });
  });

  document.querySelectorAll('a,button').forEach(function(el){
    const t = (el.textContent || '').toLowerCase();
    if(t.includes('toon meer acties')){
      el.addEventListener('click', function(ev){
        if(el.tagName !== 'A'){
          ev.preventDefault();
          window.location.href='/mobiel/';
        }
      });
    }
  });
});


