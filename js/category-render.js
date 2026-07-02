import { categoryState } from "./category-state.js";
import { getTotalValue, sortDealsByBenefitAndPrice } from "./category-data.js";
import { getOptionsForFilter, hasActiveCategoryFilters } from "./category-filters.js";

export function euro(value){
  return `€${Number(value || 0).toLocaleString("nl-NL", {maximumFractionDigits:0})}`;
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
  return String(deal.id || deal.seoSlug || slugify((deal.provider || "aanbieder") + " " + (deal.title || deal.name || "deal")));
}

function sharedDealUrl(deal){
  if(window.MPCardComponents && typeof window.MPCardComponents.dealUrl === "function") return window.MPCardComponents.dealUrl(deal, deal.category);
  const params = new URLSearchParams();
  params.set("deal", dealId(deal));
  if(deal.category) params.set("category", deal.category);
  params.set("return", window.location.pathname + window.location.search);
  return "/deal/?" + params.toString();
}

export function renderCategoryFilterPanel(category, providers){
  const el = document.getElementById("categoryFilterPanel");
  if (!el) return;

  el.innerHTML = `
    <div class="category-filter-head">
      <h2>Verfijn voordeel</h2>
      <button id="resetCategoryFilters" type="button">Reset</button>
    </div>
    ${(category.filters || []).map((filter, index) => {
      const options = getOptionsForFilter(filter, providers);
      return `
        <details>
          <summary>${filter}</summary>
          ${options.map(option => `
            <label>
              <input type="checkbox" data-category-filter data-filter-type="${option.type}" data-filter-value="${option.value}">
              ${option.label}
            </label>
          `).join("")}
        </details>
      `;
    }).join("")}
  `;
}

export function renderCategoryDeals(deals){
  const count = document.getElementById("categoryDealCount");
  if (count){
    const suffix = hasActiveCategoryFilters() ? " na filters" : " gevonden";
    count.textContent = `${deals.length} gecontroleerde deal${deals.length === 1 ? "" : "s"}${suffix}`;
  }

  const list = document.getElementById("categoryDealList");
  if (!list) return;
  list.classList.add("mp-shared-deal-grid");

  if (!deals.length){
    list.innerHTML = `<div class="category-empty"><strong>Nog geen gecontroleerde deals in deze categorie.</strong><br>We voegen alleen acties toe waarvan voordeel, link en voorwaarden zijn bevestigd.</div>`;
    return;
  }

  if (window.MPCardComponents && typeof window.MPCardComponents.renderNormalDealCard === "function") {
    list.innerHTML = deals.map((deal) => {
      const componentDeal = Object.assign({}, deal, {
        totalBenefitValue: deal.totalBenefitValue || getTotalValue(deal)
      });
      return window.MPCardComponents.renderNormalDealCard(componentDeal);
    }).join("");
    if (window.MeerPakkersSavedDealsUI && typeof window.MeerPakkersSavedDealsUI.enhanceCards === "function") {
      window.MeerPakkersSavedDealsUI.enhanceCards();
    }
    return;
  }

  list.innerHTML = `<div class="category-empty">De dealkaart-component kon niet geladen worden. Vernieuw de pagina of probeer het later opnieuw.</div>`;
}

export function renderCategorySideCards(category, deals, providers){
  const best = deals[0];
  const bestEl = document.getElementById("bestCategoryDeal");

  if (bestEl && best){
    bestEl.innerHTML = `<h3>Beste ${category.name} deal</h3><p><strong>${best.provider}</strong> - ${best.title}</p><p>${euro(getTotalValue(best))} totaal voordeel</p>`;
  } else if (bestEl){
    bestEl.innerHTML = `<h3>Beste ${category.name} deal</h3><p>Nog geen gecontroleerde deal beschikbaar.</p>`;
  }

  const providersEl = document.getElementById("categoryProvidersSide");
  if (providersEl){
    providersEl.innerHTML = providers.slice(0,6).map(provider => `<p>✓ ${provider.name}</p>`).join("");
  }
}

export function renderCategoryProviderStrip(providers, deals){
  const el = document.getElementById("categoryProviderStrip");
  if (!el) return;

  el.innerHTML = providers.slice(0,8).map(provider => {
    const count = deals.filter(deal => deal.providerId === provider.id).length;
    return `<article class="category-provider-card"><strong>${provider.name}</strong><span>${count} deal${count === 1 ? "" : "s"}</span></article>`;
  }).join("");
}

export function renderCategoryPage(){
  const categoryDeals = categoryState.deals.filter(deal => deal.category === categoryState.categoryId);
  const categoryProviders = categoryState.providers
    .filter(provider => (provider.categories || []).includes(categoryState.categoryId))
    .sort((a,b) => (a.priority || 99) - (b.priority || 99));

  renderCategoryFilterPanel(categoryState.category, categoryProviders);
  renderCategoryProviderStrip(categoryProviders, categoryDeals);
  const rankedDeals = sortDealsByBenefitAndPrice(categoryDeals);
  renderCategoryDeals(rankedDeals);
  renderCategorySideCards(categoryState.category, rankedDeals, categoryProviders);
}
