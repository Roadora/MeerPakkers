(function(){
  var KEY = 'mp_cookie_choice_v40';
  try { if (localStorage.getItem(KEY)) return; } catch(e) {}
  function currentScriptBase(){
    var s = document.currentScript;
    if(!s || !s.src) return '/';
    var url = new URL(s.src, window.location.href);
    return url.pathname.replace(/js\/cookie-banner-v40\.js$/, '');
  }
  function save(choice){
    try { localStorage.setItem(KEY, JSON.stringify({choice:choice, date:new Date().toISOString()})); } catch(e) {}
    var banner = document.querySelector('.mp-cookie-banner');
    if(banner) banner.setAttribute('hidden','hidden');
  }
  function mount(){
    if(document.querySelector('.mp-cookie-banner')) return;
    var base = currentScriptBase();
    var div = document.createElement('div');
    div.className = 'mp-cookie-banner';
    div.setAttribute('role','dialog');
    div.setAttribute('aria-label','Cookie melding');
    div.innerHTML = '<p class="mp-cookie-title">Wij gebruiken cookies</p>'+
      '<p class="mp-cookie-text">MeerPakkers gebruikt noodzakelijke cookies voor de werking van de website en, na toestemming, analytische en affiliate cookies om de site te verbeteren en vergoedingen correct te registreren.</p>'+
      '<div class="mp-cookie-actions">'+
        '<button class="mp-cookie-accept" type="button" data-cookie-choice="all">Accepteren</button>'+
        '<button class="mp-cookie-necessary" type="button" data-cookie-choice="necessary">Alleen noodzakelijk</button>'+
        '<a class="mp-cookie-policy" href="'+base+'cookies/">Cookiebeleid</a>'+
      '</div>';
    document.body.appendChild(div);
    div.addEventListener('click', function(e){
      var btn = e.target.closest('[data-cookie-choice]');
      if(!btn) return;
      save(btn.getAttribute('data-cookie-choice'));
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
