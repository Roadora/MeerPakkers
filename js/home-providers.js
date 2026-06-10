window.MPHomeProviders = {
  selectedCategories(){
    return [...window.MPHomeState.state.categories];
  },

  providerTypeForSelectedCategories(){
    const cats = this.selectedCategories();
    if (cats.length === 1 && cats[0] === "streaming") return "streamingdienst";
    return "provider";
  },

  providerTitle(){
    return this.providerTypeForSelectedCategories() === "streamingdienst" ? "Streamingdienst" : "Provider";
  },

  availableFilterProviders(){
    const state = window.MPHomeState.state;
    const cats = this.selectedCategories();
    const type = this.providerTypeForSelectedCategories();

    return state.providersData
      .filter(p => p.type === type)
      .filter(p => {
        if (!cats.length) return true;
        return cats.some(cat => p.categories.includes(cat));
      })
      .sort((a,b) => a.priority - b.priority);
  },

  renderProviderFilters(){
    const state = window.MPHomeState.state;
    const title = document.getElementById("providerFilterTitle");
    if (title) title.textContent = this.providerTitle();

    const providers = this.availableFilterProviders();
    state.providers = new Set([...state.providers].filter(p => providers.some(item => item.name === p)));

    const el = document.getElementById("providerFilters");
    if (!el) return;
    el.innerHTML = providers.map(p => `
      <label><input type="checkbox" data-filter="providers" value="${p.name}" ${state.providers.has(p.name) ? "checked" : ""}> ${p.name}</label>
    `).join("");
  },

  renderProviders(){
    const state = window.MPHomeState.state;
    const el = document.getElementById("providerList");
    if (!el) return;

    const normalProviders = state.providersData
      .filter(p => p.type === "provider")
      .sort((a,b) => a.priority - b.priority)
      .slice(0,8);

    el.innerHTML = normalProviders
      .map(p => `<div class="provider-pill">${p.name}</div>`)
      .join("");
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



