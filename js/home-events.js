window.MPHomeEvents = {
  bind(renderAll){
    document.addEventListener("change", e => {
      if (e.target.matches("[data-filter]")) {
        if(window.MPHomeRender && typeof window.MPHomeRender.resetTabletHomeVisibleCount === "function") window.MPHomeRender.resetTabletHomeVisibleCount();
        renderAll();
      }
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", function(){
      if(window.MPHomeRender && typeof window.MPHomeRender.resetTabletHomeVisibleCount === "function") window.MPHomeRender.resetTabletHomeVisibleCount();
      renderAll();
    });

    document.querySelectorAll(".quick-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".quick-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.MPHomeState.state.quick = btn.dataset.quick;
        if(window.MPHomeRender && typeof window.MPHomeRender.resetTabletHomeVisibleCount === "function") window.MPHomeRender.resetTabletHomeVisibleCount();
        renderAll();
      });
    });

    const resetButton = document.getElementById("resetFilters");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        window.MPHomeFilters.resetFilters();
        if(window.MPHomeRender && typeof window.MPHomeRender.resetTabletHomeVisibleCount === "function") window.MPHomeRender.resetTabletHomeVisibleCount();
        renderAll();
      });
    }
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



