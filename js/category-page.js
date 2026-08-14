import { categoryState } from "./category-state.js";
import { loadCategoryData } from "./category-data.js";
import { renderCategoryPage } from "./category-render.js";
import { bindCategoryEvents, updateCategoryResults } from "./category-events.js";

async function initCategoryPage(){
  if (document.getElementById("mpMobileCategory") && window.matchMedia("(max-width: 900px)").matches) return;
  try {
    categoryState.categoryId = document.body.dataset.categoryId;
    const { deals, providers, categories } = await loadCategoryData();

    categoryState.deals = deals;
    categoryState.providers = providers;
    categoryState.categories = categories;
    categoryState.category = categories.find(category => category.id === categoryState.categoryId);

    if (!categoryState.category){
      throw new Error(`Onbekende categorie: ${categoryState.categoryId}`);
    }

    renderCategoryPage();
    bindCategoryEvents();
    updateCategoryResults();
  } catch (error){
    const list = document.getElementById("categoryDealList");
    if (list){
      if (!list.querySelector("[data-seo-fallback]")) list.innerHTML = `<div class="category-empty">Deze categorie kon niet geladen worden.</div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", initCategoryPage);


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
