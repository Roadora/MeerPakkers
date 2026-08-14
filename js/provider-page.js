async function loadProviderPage(){
  const slug = document.body.dataset.providerId;
  const [providerRes, dealsRes] = await Promise.all([
    fetch("/data/providers.json"),
    fetch("/data/deals.json")
  ]);
  const providers = await providerRes.json();
  const deals = await dealsRes.json();
  const provider = providers.find(p => p.id === slug);
  const publicDeals = window.MPDealLifecycle
    ? window.MPDealLifecycle.filterCurrent(deals)
    : deals;
  const providerDeals = publicDeals
    .filter(d => d.providerId === slug)
    .sort((a,b) => ((b.meerPakScore || 0) - (a.meerPakScore || 0)) || ((b.totalBenefitValue || 0) - (a.totalBenefitValue || 0)));

  const countEl = document.getElementById("providerDealCount");
  if (countEl) countEl.textContent = `${providerDeals.length} deals gevonden`;

  const list = document.getElementById("providerDealList");
  if (list) {
    if (window.MPCardComponents && typeof window.MPCardComponents.renderNormalDealCard === "function") {
      list.innerHTML = providerDeals.map((deal) => window.MPCardComponents.renderNormalDealCard(deal)).join("") || `<p>Voor deze aanbieder staan er nog geen gecontroleerde acties klaar.</p>`;
      list.classList.add("mp-provider-card-list", "mp-shared-deal-grid");
      return;
    }

    list.innerHTML = `<p>De dealkaart-component kon niet geladen worden. Vernieuw de pagina of probeer het later opnieuw.</p>`;
  }
}
document.addEventListener("DOMContentLoaded", function(){ loadProviderPage().catch(function(error){ console.warn("[MeerPakkers] Providerdata kon niet worden ververst; crawlbare fallback blijft zichtbaar.", error); }); });


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
