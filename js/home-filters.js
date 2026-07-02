window.MPHomeFilters = {
  syncStateFromInputs(){
    const state = window.MPHomeState.state;
    for (const key of ["benefitTypes","categories","providers","giftTypes","contracts"]) state[key] = new Set();

    document.querySelectorAll("[data-filter]").forEach(input => {
      const key = input.dataset.filter;
      if (input.type === "checkbox" && input.checked && state[key] instanceof Set) state[key].add(input.value);
    });

    const searchInput = document.getElementById("searchInput");
    state.search = searchInput ? searchInput.value.trim().toLowerCase() : "";
  },

  getFilteredDeals(){
    const state = window.MPHomeState.state;
    return state.deals.filter(d => {
      const text = (d.provider + " " + d.title + " " + d.benefits.join(" ")).toLowerCase();
      if (state.search && !text.includes(state.search)) return false;
      if (state.quick !== "all" && !d.benefitTypes.includes(state.quick)) return false;
      if (state.benefitTypes.size && !d.benefitTypes.some(v => state.benefitTypes.has(v))) return false;
      if (state.categories.size && !state.categories.has(d.category)) return false;
      if (state.providers.size && !state.providers.has(d.provider)) return false;
      if (state.giftTypes.size && !state.giftTypes.has(d.giftType)) return false;
      if (state.contracts.size && !state.contracts.has(d.contract)) return false;
      return true;
    }).sort((a,b) => {
      const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featured) return featured;
      const value = Number(b.totalBenefitValue || b.benefitValue || 0) - Number(a.totalBenefitValue || a.benefitValue || 0);
      if (value) return value;
      return Number(a.monthlyPrice || Number.POSITIVE_INFINITY) - Number(b.monthlyPrice || Number.POSITIVE_INFINITY);
    });
  },

  renderChips(){
    const state = window.MPHomeState.state;
    const labels = window.MPHomeState.labels;
    const chips = [];

    for (const key of ["benefitTypes","categories","providers","giftTypes","contracts"]) {
      state[key].forEach(v => chips.push(labels[v] || v));
    }
    if (state.quick !== "all") chips.push(labels[state.quick] || state.quick);

    const activeChipsEl = document.getElementById("activeChips");
    if (activeChipsEl) activeChipsEl.innerHTML = chips.length ? chips.map(c => `<span class="chip">${c}</span>`).join("") : `<span class="chip">Geen filters</span>`;
  },

  resetFilters(){
    const state = window.MPHomeState.state;
    document.querySelectorAll("[data-filter]").forEach(input => {
      if (input.type === "checkbox") input.checked = false;
    });
    state.quick = "all";
    document.querySelectorAll(".quick-filter").forEach(b => b.classList.toggle("active", b.dataset.quick === "all"));
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



