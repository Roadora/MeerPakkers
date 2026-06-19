
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
  return String(label || "")
    .replace(/^\s*[🎁🏷️💸✨✅☑️✔️➕]\s*/u, "")
    .trim();
}


function mpBenefitFooterLabelHome(d){
  const label = String((d && d.totalBenefitLabel) || "").trim();
  const value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
  return label && value <= 0 ? "Meepakker" : "Totaal voordeel";
}

function mpBenefitValueClassHome(d){
  const label = String((d && d.totalBenefitLabel) || "").trim();
  const value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
  return label && value <= 0 ? " mp-card-total--period" : "";
}

function mpIsChoiceDealHome(d){
  const explicit = String((d && d.benefitDisplayType) || "").trim().toLowerCase();
  if(explicit === "choice") return true;
  const types = Array.isArray(d && d.benefitTypes) ? d.benefitTypes.map(t => String(t).toLowerCase()) : [];
  return types.includes("korting") && types.includes("cadeau");
}


function mpCategoryWinnerValueClassHome(d){
  const label = String((d && d.totalBenefitLabel) || "").trim();
  const value = Number((d && (d.totalBenefitValue || d.benefitValue)) || 0);
  return label && value <= 0 ? " category-winner-value--period" : "";
}

function mpNormalizeHomeDeal(deal){
  const d = Object.assign({}, deal || {});
  d.totalBenefitValue = Number(d.totalBenefitValue || d.benefitValue || 0);
  d.meerPakScore = Number(d.meerPakScore || d.score || 0);
  return d;
}


const MP_TABLET_HOME_INITIAL_COUNT = 10;
const MP_TABLET_HOME_STEP_COUNT = 10;
let mpTabletHomeVisibleCount = MP_TABLET_HOME_INITIAL_COUNT;

function mpIsTabletHomeDealGrid(){
  try{
    return !!(document.body && document.body.classList && document.body.classList.contains("home-cleanup"))
      && (window.innerWidth || 0) >= 700
      && (window.innerWidth || 0) <= 900;
  }catch(e){
    return false;
  }
}

function mpEnsureTabletHomeLoadMoreButton(list){
  let btn = document.getElementById("mpTabletHomeLoadMoreDeals");
  if(!btn){
    btn = document.createElement("button");
    btn.id = "mpTabletHomeLoadMoreDeals";
    btn.type = "button";
    btn.className = "mp-clean-more mp-tablet-home-load-more";
    btn.addEventListener("click", function(){
      mpTabletHomeVisibleCount += MP_TABLET_HOME_STEP_COUNT;
      if(window.MPHomeRender && typeof window.MPHomeRender.renderDeals === "function" && window.MPHomeDeals && typeof window.MPHomeDeals.getHomepageDeals === "function"){
        window.MPHomeRender.renderDeals(window.MPHomeDeals.getHomepageDeals());
      }
    });
    list.insertAdjacentElement("afterend", btn);
  }
  return btn;
}

function mpResetTabletHomeVisibleCount(){
  mpTabletHomeVisibleCount = MP_TABLET_HOME_INITIAL_COUNT;
}

function mpEnhanceSavedButtons(){
  if (window.MeerPakkersSavedDealsUI && typeof window.MeerPakkersSavedDealsUI.enhanceCards === "function") {
    window.MeerPakkersSavedDealsUI.enhanceCards();
  }
}



function mpRenderNormalDealCard(d){
  if(window.MPCardComponents && typeof window.MPCardComponents.renderNormalDealCard === "function"){
    return window.MPCardComponents.renderNormalDealCard(d);
  }
  return "";
}

function mpRenderCheckedDealCard(d, item){
  if(window.MPCardComponents && typeof window.MPCardComponents.renderCheckedDealCard === "function"){
    return window.MPCardComponents.renderCheckedDealCard(d, item);
  }
  return "";
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
        return `<article class="category-winner-card mp-featured-highlight-card category-winner-card--placeholder">
          <div>
            <h3 class="category-winner-provider">Binnenkort</h3>
            <p class="category-winner-title">Nieuwe ${mpEscapeHomeHtml(item.label)} deals worden gecontroleerd.</p>
            <div class="category-winner-benefits"><span>Alleen bevestigd voordeel</span></div>
          </div>
          <div class="category-winner-footer category-winner-footer--placeholder">
            <a href="/${mpEscapeHomeHtml(item.id)}/">Bekijk ${mpEscapeHomeHtml(item.label)} →</a>
          </div>
        </article>`;
      }

      const d = mpNormalizeHomeDeal(raw);
      return mpRenderCheckedDealCard(d, item);
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
      <article><strong>${d.provider}</strong><span>${d.totalBenefitLabel || ("€" + d.totalBenefitValue)} voordeel</span>${i === 0 ? "<em>Beste keuze</em>" : ""}</article>
    `).join("");
  },

  renderDeals(deals){
    const count = document.getElementById("resultCount");
    const list = document.getElementById("dealList");
    if (count) count.textContent = `${deals.length} deals gevonden`;
    if (!list) return;

    const isTabletHomeGrid = mpIsTabletHomeDealGrid();
    const visibleDeals = isTabletHomeGrid ? deals.slice(0, mpTabletHomeVisibleCount) : deals;

    // Home gebruikt nu exact de kaarttaal van /kies-je-meepakker/.
    // Geen legacy mp-home-list-card CSS meer op deze sectie.
    list.className = "meepakker-grid mp-home-meepakker-grid";

    list.innerHTML = visibleDeals.map((raw) => {
      const d = mpNormalizeHomeDeal(raw);
      return mpRenderNormalDealCard(d);
    }).join("");

    const tabletBtn = mpEnsureTabletHomeLoadMoreButton(list);
    if(isTabletHomeGrid && deals.length > MP_TABLET_HOME_INITIAL_COUNT){
      const remaining = Math.max(0, deals.length - mpTabletHomeVisibleCount);
      tabletBtn.style.display = "";
      if(remaining <= 0){
        tabletBtn.textContent = "Alle deals geladen";
        tabletBtn.disabled = true;
        tabletBtn.classList.add("is-disabled");
      }else{
        tabletBtn.textContent = "Toon " + Math.min(MP_TABLET_HOME_STEP_COUNT, remaining) + " meer deals";
        tabletBtn.disabled = false;
        tabletBtn.classList.remove("is-disabled");
      }
    }else{
      tabletBtn.style.display = "none";
      tabletBtn.disabled = true;
    }

    mpEnhanceSavedButtons();
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

  /* v50 tablet home load more resize sync */
  window.addEventListener('resize', function(){
    if(window.MPHomeRender && typeof window.MPHomeRender.renderDeals === "function" && window.MPHomeDeals && typeof window.MPHomeDeals.getHomepageDeals === "function"){
      window.MPHomeRender.renderDeals(window.MPHomeDeals.getHomepageDeals());
    }
  }, {passive:true});

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


