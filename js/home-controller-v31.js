
/* MeerPakkers Home Controller v31
   Eén controller voor:
   - deals laden
   - zoeken op Home
   - load-more
   - correcte CTA per deal
   - terugkomen bij dezelfde dealcard

   Vervangt de losse v20/v24/v26/scroll-restore flows.
*/
(function(){
  const INITIAL_COUNT = 3;
  const STEP_COUNT = 10;
  const KEY_RETURN_DEAL = "mpReturnDealId";
  const KEY_VISIBLE_COUNT = "mpVisibleDealCount";
  const KEY_SCROLL_Y = "mpScrollPosition";

  let allDeals = [];
  let filteredDeals = [];
  let visibleCount = INITIAL_COUNT;
  let currentQuery = "";

  function norm(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function rankedDeals(deals){
    return (Array.isArray(deals) ? deals : [])
      .slice()
      .sort(function(a,b){
        return (Number(b.featured || 0) - Number(a.featured || 0)) ||
          (Number(b.meerPakScore || b.score || 0) - Number(a.meerPakScore || a.score || 0)) ||
          (Number(b.totalBenefitValue || b.benefitValue || 0) - Number(a.totalBenefitValue || a.benefitValue || 0));
      });
  }

  function dealText(deal){
    return norm([
      deal.id,
      deal.seoSlug,
      deal.provider,
      deal.providerId,
      deal.title,
      deal.category,
      deal.giftType,
      deal.giftName,
      deal.contract,
      deal.dealType,
      ...(deal.benefits || []),
      ...(deal.benefitTypes || [])
    ].join(" "));
  }

  function dealId(deal){
    return String(deal.id || deal.seoSlug || ((deal.provider || "") + "-" + (deal.title || "")));
  }

  function dealUrl(deal){
    if(window.MPDealCard && typeof window.MPDealCard.dealUrl === "function") return window.MPDealCard.dealUrl(deal, deal.category);
    const params = new URLSearchParams();
    params.set("deal", dealId(deal));
    if(deal.category) params.set("category", deal.category);
    params.set("return", window.location.pathname + window.location.search);
    return "/deal/?" + params.toString();
  }

  function setVisibleForReturnDeal(){
    try{
      const returnDealId = sessionStorage.getItem(KEY_RETURN_DEAL) || "";

      // v39: gewone refresh/home-open moet altijd terug naar de Top 3.
      // Alleen wanneer de gebruiker terugkomt vanaf een dealdetail mag de
      // eerder geopende lijst tijdelijk worden hersteld, zodat dezelfde card zichtbaar blijft.
      if(!returnDealId){
        visibleCount = INITIAL_COUNT;
        sessionStorage.removeItem(KEY_VISIBLE_COUNT);
        sessionStorage.removeItem(KEY_SCROLL_Y);
        return;
      }

      const savedVisible = Number(sessionStorage.getItem(KEY_VISIBLE_COUNT) || 0);
      if(savedVisible){
        visibleCount = Math.max(visibleCount, savedVisible);
      }

      const idx = filteredDeals.findIndex(function(d){ return dealId(d) === returnDealId; });
      if(idx >= 0){
        visibleCount = Math.max(visibleCount, idx + 1);
      }
    }catch(e){}
  }

  function render(){
    const root = document.getElementById("mpCleanTopDeals");
    const btn = document.getElementById("mpLoadMoreDeals");
    if(!root || !window.MPDealCard) return;

    const visible = filteredDeals.slice(0, visibleCount);

    if(!visible.length){
      root.innerHTML = '<div class="mp-clean-empty-state"><strong>Nog geen gecontroleerde deal gevonden</strong><span>We tonen alleen acties met bevestigd voordeel.</span></div>';
    }else{
      root.innerHTML = visible.map(function(deal, index){
        const html = window.MPDealCard.render(deal, {
          rank:index + 1,
          category:deal.category,
          url:dealUrl(deal)
        });
        return html.replace('<article class="mp-clean-deal-card mp-deal-card-component"', '<article class="mp-clean-deal-card mp-deal-card-component" data-deal-id="' + dealId(deal) + '"');
      }).join("");
    }

    if(btn){
      const remaining = Math.max(0, filteredDeals.length - visibleCount);
      if(!filteredDeals.length){
        btn.style.display = "none";
      }else{
        btn.style.display = "";
        if(remaining <= 0){
          btn.textContent = "Alle deals geladen";
          btn.disabled = true;
          btn.classList.add("is-disabled");
        }else{
          btn.textContent = "Toon " + Math.min(STEP_COUNT, remaining) + " meer deals";
          btn.disabled = false;
          btn.classList.remove("is-disabled");
        }
      }
    }

    restoreReturnPosition();
  }

  function applySearch(query){
    currentQuery = norm(query).trim();
    visibleCount = INITIAL_COUNT;

    if(!currentQuery){
      filteredDeals = allDeals.slice();
    }else{
      filteredDeals = allDeals.filter(function(deal){
        return dealText(deal).includes(currentQuery);
      });
    }

    render();
  }

  function restoreReturnPosition(){
    try{
      const returnDealId = sessionStorage.getItem(KEY_RETURN_DEAL) || "";
      if(!returnDealId) return;

      const card = document.querySelector('[data-deal-id="' + CSS.escape(returnDealId) + '"]');
      if(!card) return;

      setTimeout(function(){
        card.scrollIntoView({block:"center", inline:"nearest"});
      }, 80);

      // voorkom dat elke latere render of refresh opnieuw de volledige lijst opent
      sessionStorage.removeItem(KEY_RETURN_DEAL);
      sessionStorage.removeItem(KEY_VISIBLE_COUNT);
      sessionStorage.removeItem(KEY_SCROLL_Y);
    }catch(e){}
  }

  function saveReturnState(deal){
    try{
      sessionStorage.setItem(KEY_RETURN_DEAL, dealId(deal));
      sessionStorage.setItem(KEY_VISIBLE_COUNT, String(visibleCount));
      sessionStorage.setItem(KEY_SCROLL_Y, String(window.scrollY || window.pageYOffset || 0));
    }catch(e){}
  }

  function bindSearch(){
    const input = document.querySelector(".mp-clean-mobile-home .mp-clean-search input");
    if(!input) return;

    input.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        e.stopImmediatePropagation();
        applySearch(input.value);
      }
    }, true);

    input.addEventListener("input", function(){
      applySearch(input.value);
    });

    input.setAttribute("autocomplete", "off");
  }

  function bindLoadMore(){
    const btn = document.getElementById("mpLoadMoreDeals");
    if(!btn) return;

    btn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      visibleCount += STEP_COUNT;
      render();
    }, true);
  }

  function bindDealClicks(){
    document.addEventListener("click", function(e){
      const link = e.target.closest("#mpCleanTopDeals a, #mpCleanTopDeals button");
      if(!link) return;
      const label = (link.textContent || "").toLowerCase();
      if(!label.includes("bekijk deal")) return;

      const card = link.closest("[data-deal-id]");
      if(!card) return;
      const id = card.getAttribute("data-deal-id");
      const deal = filteredDeals.find(function(d){ return dealId(d) === id; });
      if(!deal) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      saveReturnState(deal);
      window.location.href = dealUrl(deal);
    }, true);
  }

  function load(){
    const root = document.getElementById("mpCleanTopDeals");
    if(!root) return;

    fetch("data/deals.json")
      .then(function(res){ return res.json(); })
      .then(function(deals){
        allDeals = rankedDeals(deals);
        filteredDeals = allDeals.slice();
        setVisibleForReturnDeal();
        render();
      })
      .catch(function(){
        root.innerHTML = '<div class="mp-clean-empty-state"><strong>Deals konden niet geladen worden</strong><span>Probeer het later opnieuw.</span></div>';
      });
  }

  function init(){
    bindSearch();
    bindLoadMore();
    bindDealClicks();
    load();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
