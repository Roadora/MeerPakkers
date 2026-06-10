import { syncCategoryFiltersFromInputs, getFilteredCategoryDeals } from "./category-filters.js";
import { renderCategoryDeals, renderCategorySideCards } from "./category-render.js";
import { categoryState, resetCategoryFilters } from "./category-state.js";

export function bindCategoryEvents(){
  const panel = document.getElementById("categoryFilterPanel");
  if (!panel) return;

  panel.addEventListener("change", event => {
    if (!event.target.matches("[data-category-filter]")) return;
    updateCategoryResults();
  });

  panel.addEventListener("click", event => {
    if (event.target.id !== "resetCategoryFilters") return;
    resetCategoryFilters();
    panel.querySelectorAll("[data-category-filter]").forEach(input => { input.checked = false; });
    updateCategoryResults();
  });
}

export function updateCategoryResults(){
  syncCategoryFiltersFromInputs();
  const filteredDeals = getFilteredCategoryDeals();
  const providers = categoryState.providers
    .filter(provider => (provider.categories || []).includes(categoryState.categoryId))
    .sort((a,b) => (a.priority || 99) - (b.priority || 99));

  renderCategoryDeals(filteredDeals);
  renderCategorySideCards(categoryState.category, filteredDeals, providers);
}
