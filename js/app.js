window.MPHomeApp = {
  renderAll(){
    // Side filters may change supporting UI, like provider options, but the homepage deal list
    // has its own source. This keeps the middle area filled even if the left filter menu
    // is replaced, hidden or rebuilt later.
    window.MPHomeFilters.syncStateFromInputs();
    window.MPHomeProviders.renderProviderFilters();
    window.MPHomeFilters.syncStateFromInputs();

    const homepageDeals = window.MPHomeDeals.getHomepageDeals();
    window.MPHomeRender.renderFeatured();
    window.MPHomeRender.renderCompare(homepageDeals);
    window.MPHomeRender.renderDeals(homepageDeals);
    window.MPHomeFilters.renderChips();
  },

  async init(){
    await window.MPHomeData.load();
    window.MPHomeProviders.renderProviderFilters();
    window.MPHomeProviders.renderProviders();
    window.MPHomeEvents.bind(() => this.renderAll());
    this.renderAll();
  }
};

document.addEventListener("DOMContentLoaded", () => window.MPHomeApp.init());


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



