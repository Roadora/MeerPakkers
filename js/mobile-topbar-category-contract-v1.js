/*
  MeerPakkers Mobile Topbar — Category Contract v1
  STATUS: DORMANT / NOT LOADED IN THIS VERSION

  Purpose:
  - Isolate the proven category-page mobile topbar structure.
  - Define one future source of truth for non-home mobile pages.
  - Do NOT touch Home. Home keeps mp-clean-mobile-header as a locked exception.
  - This file does not execute, render, mutate DOM, register listeners or change styles.
*/
(function (window) {
  "use strict";

  var CATEGORY_MOBILE_TOPBAR_CONTRACT = {
    id: "mp-mobile-topbar-category-contract-v1",
    status: "dormant-not-loaded",
    homePolicy: "excluded-and-locked",
    canonicalHeaderClass: "mp-mobile-top-header mp-mobile-topbar-unified-v3",
    canonicalMarkup:
      '<header class="mp-mobile-top-header mp-mobile-topbar-unified-v3" aria-label="MeerPakkers pagina header">' +
        '<a href="{{backHref}}" class="mp-mobile-back" aria-label="{{backLabel}}">&lt;</a>' +
        '<a href="/" class="mp-mobile-brand-lockup" aria-label="MeerPakkers home">' +
          '<span class="mp-mobile-brand-logo">MP+</span>' +
          '<span class="mp-mobile-brand-copy">' +
            '<span class="mp-mobile-brand-lines">meer cadeau,<br>meer korting.</span>' +
            '<strong class="mp-mobile-brand-name">MeerPakkers</strong>' +
          '</span>' +
        '</a>' +
        '<a href="/opgeslagen/" class="mp-mobile-heart-link" aria-label="Opgeslagen deals">' +
          '♡<span class="mp-mobile-heart-count" data-saved-deals-count>0</span>' +
        '</a>' +
      '</header>',
    requiredClasses: [
      "mp-mobile-top-header", "mp-mobile-topbar-unified-v3", "mp-mobile-back",
      "mp-mobile-brand-lockup", "mp-mobile-brand-logo", "mp-mobile-brand-copy",
      "mp-mobile-brand-lines", "mp-mobile-brand-name", "mp-mobile-heart-link",
      "mp-mobile-heart-count"
    ],
    canonicalSource: {
      renderer: "js/mobile-category-v1.js",
      rendererFunction: "mobileTopHeader",
      primaryStyle: "css/mobile-topbar-unified-v3.css",
      runtimeNormalizer: "js/mobile-topbar-component-v1.js"
    },
    excludedFromFirstMigration: ["index.html", "Home mp-clean-mobile-header"]
  };

  // Exposed only for future audit/build use. This version does not load this file.
  window.MeerPakkersMobileTopbarCategoryContract = CATEGORY_MOBILE_TOPBAR_CONTRACT;
})(window);
