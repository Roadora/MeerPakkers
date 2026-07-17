/* MeerPakkers — Odido Thuis Afeller campaign v1
   Prelaunch countdown only. The actual deal is date-gated centrally by
   deal-lifecycle-v1.js and becomes public on 20 July 2026 (Amsterdam time).
*/
(function(){
  "use strict";

  var START_AT = new Date("2026-07-20T00:00:00+02:00");
  var END_AT = new Date("2026-08-10T00:00:00+02:00"); // 9 August counts fully.
  var IMAGE_URL = "https://www.awin1.com/cshow.php?s=4834442&v=8400&q=533064&r=2947269";
  var DETAIL_URL = "/deal/?deal=odido-thuis-affeller-2026&category=internet-tv&return=%2Finternet-tv%2F";
  var timer = null;

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function phase(now){
    var time = (now || new Date()).getTime();
    if(time < START_AT.getTime()) return "upcoming";
    if(time < END_AT.getTime()) return "active";
    return "ended";
  }

  function countdownParts(now){
    var remaining = Math.max(0, START_AT.getTime() - (now || new Date()).getTime());
    var totalSeconds = Math.floor(remaining / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  }

  function unit(value, label){
    return '<span class="mp-odido-affeller__time"><strong>' + String(value).padStart(2,"0") + '</strong><small>' + escapeHtml(label) + '</small></span>';
  }

  function markup(titleId){
    var parts = countdownParts(new Date());
    return '' +
      '<article class="mp-odido-affeller" aria-labelledby="' + escapeHtml(titleId) + '">' +
        '<div class="mp-odido-affeller__creative">' +
          '<img src="' + escapeHtml(IMAGE_URL) + '" alt="Officiële banner van de Odido Thuis-actie" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="mp-odido-affeller__content">' +
          '<span class="mp-odido-affeller__eyebrow">Nieuwe actie vanaf 20 juli</span>' +
          '<h2 id="' + escapeHtml(titleId) + '">Odido Glasvezel + TV</h2>' +
          '<p class="mp-odido-affeller__lead">1 jaar gratis ESPN Compleet, met een aparte tijdelijke maandprijs voor 1 of 2 jaar.</p>' +
          '<ul>' +
            '<li><strong>2 jaar:</strong> de eerste 12 maanden €25 p/m</li>' +
            '<li><strong>1 jaar:</strong> de eerste 6 maanden €26 p/m</li>' +
            '<li>Actie loopt van 20 juli t/m 9 augustus 2026</li>' +
          '</ul>' +
          '<div class="mp-odido-affeller__countdown" role="timer" aria-live="off" aria-label="Aftellen tot de start van de Odido-actie">' +
            unit(parts.days,"dagen") + unit(parts.hours,"uur") + unit(parts.minutes,"min") + unit(parts.seconds,"sec") +
          '</div>' +
          '<a class="mp-odido-affeller__details" href="' + escapeHtml(DETAIL_URL) + '">Bekijk de actie alvast</a>' +
          '<p class="mp-odido-affeller__disclosure">MeerPakkers is onafhankelijk. Odido is niet verantwoordelijk voor de inhoud van deze pagina.</p>' +
        '</div>' +
      '</article>';
  }

  function refresh(){
    var slots = document.querySelectorAll('[data-odido-affeller-countdown]');
    var currentPhase = phase(new Date());
    slots.forEach(function(slot, index){
      if(currentPhase !== "upcoming"){
        slot.hidden = true;
        slot.innerHTML = "";
        return;
      }
      slot.hidden = false;
      slot.innerHTML = markup("mpOdidoAffellerTitle" + String(index + 1));
    });

    if(currentPhase === "upcoming" && slots.length){
      if(!timer) timer = window.setInterval(refresh, 1000);
    }else if(timer){
      window.clearInterval(timer);
      timer = null;
    }
  }

  window.MPOdidoAffellerCampaign = Object.freeze({
    startAt: START_AT,
    endAt: END_AT,
    phase: phase,
    refresh: refresh
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh);
  else refresh();
})();
