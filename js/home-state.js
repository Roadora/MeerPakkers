window.MPHomeState = {
  state: {
    quick: "all",
    search: "",
    benefitTypes: new Set(["cadeau","cashback"]),
    categories: new Set(["mobiel"]),
    providers: new Set(["Vodafone"]),
    giftTypes: new Set(),
    contracts: new Set(),
    minScore: 0,
    deals: [],
    providersData: []
  },
  labels: {
    cadeau:"Cadeau", cashback:"Cashback", korting:"Korting", cadeaukaart:"Cadeaukaart",
    "gratis-maanden":"Gratis maanden","gratis-extra":"Gratis extra's",
    mobiel:"Mobiel","sim-only":"Sim Only","internet-tv":"Internet & TV",streaming:"Streaming",
    oordopjes:"Oordopjes", sport:"Sportpakket", overig:"Overig",
    maandelijks:"Maandelijks", "1-jaar":"1 jaar", "2-jaar":"2 jaar", verlengdeal:"Verlengdeal", "nieuwe-klant":"Nieuwe klant"
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



