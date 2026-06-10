/* MeerPakkers Meepakker Search v1 - small mobile framework helper */
(function(){
  function init(){
    var input = document.getElementById('meepakkerSearch');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.meepakker-card'));
    if(!input || !cards.length) return;
    input.addEventListener('input', function(){
      var q = String(input.value || '').toLowerCase().trim();
      cards.forEach(function(card){
        var text = card.textContent.toLowerCase();
        card.style.display = !q || text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
