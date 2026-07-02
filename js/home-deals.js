window.MPHomeDeals = {
  rankedDeals(deals = window.MPHomeState.state.deals){
    return [...deals].sort((a,b) => {
      const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featured) return featured;

      const value = (b.totalBenefitValue || b.benefitValue || 0) - (a.totalBenefitValue || a.benefitValue || 0);
      if (value) return value;

      const priceA = Number(a.monthlyPrice || Number.POSITIVE_INFINITY);
      const priceB = Number(b.monthlyPrice || Number.POSITIVE_INFINITY);
      if (priceA !== priceB) return priceA - priceB;

      return String(a.provider || '').localeCompare(String(b.provider || '')) ||
        String(a.title || '').localeCompare(String(b.title || ''));
    });
  },

  getHomepageDeals(){
    const state = window.MPHomeState.state;

    return this.rankedDeals(state.deals).filter(deal => {
      const searchableText = [
        deal.provider,
        deal.title,
        ...(deal.benefits || []),
        deal.category,
        deal.giftType,
        deal.contract
      ].join(" ").toLowerCase();

      if (state.search && !searchableText.includes(state.search)) return false;
      if (state.quick !== "all" && !(deal.benefitTypes || []).includes(state.quick)) return false;

      return true;
    });
  },

  getCategoryWinner(categoryId){
    return this.rankedDeals().find(deal => deal.category === categoryId);
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



