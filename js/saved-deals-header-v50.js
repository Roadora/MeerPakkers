/* MeerPakkers Saved Deals Header Entry v52
   Keeps Mijn Deals heart in the mobile hero/header next to the slogan, not inside the search bar.
*/
(function(window, document){
  'use strict';

  var STORE = window.MeerPakkersSavedDealsStore;
  var HEADER_CLASS = 'mp-saved-header-link-v50';
  var DESKTOP_CLASS = 'mp-saved-desktop-link-v50';
  var COUNT_CLASS = 'mp-saved-count-v50';
  var TARGET_URL = '/opgeslagen/';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function getCount(){
    if(!STORE || typeof STORE.getSavedDeals !== 'function') return 0;
    try { return STORE.getSavedDeals().length || 0; }
    catch(e){ return 0; }
  }

  function updateCounts(){
    var count = getCount();
    var label = count ? 'Opgeslagen deals: ' + count : 'Opgeslagen deals';
    var links = document.querySelectorAll('.' + HEADER_CLASS + ', .' + DESKTOP_CLASS + ', .mp-mobile-heart-link, .mp-mobile-heart-button, .mp-home-portrait-heart');
    Array.prototype.forEach.call(links, function(link){
      link.classList.toggle('has-saved', count > 0);
      if(link.tagName && link.tagName.toLowerCase() === 'a') link.setAttribute('aria-label', label);
      var countNode = link.querySelector('.' + COUNT_CLASS + ', [data-saved-deals-count]');
      if(countNode) countNode.textContent = String(count);
    });
  }

  function createMobileLink(){
    var link = document.createElement('a');
    link.className = HEADER_CLASS + ' mp-legacy-header-heart';
    link.href = TARGET_URL;
    link.setAttribute('aria-label', 'Opgeslagen deals');
    link.setAttribute('data-mp-legacy-header-heart', 'true');
    link.innerHTML = '<span class="mp-saved-icon-v50" aria-hidden="true"><svg class="mp-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-6.8-4.2-9.3-8.1C.7 9 .9 5.5 3.4 3.7c2.1-1.5 5-.9 6.6 1.1L12 7.2l2-2.4c1.6-2 4.5-2.6 6.6-1.1 2.5 1.8 2.7 5.3.7 8.4-2.5 3.9-9.3 8.1-9.3 8.1z"/></svg></span><span class="' + COUNT_CLASS + '" aria-hidden="true">0</span>';
    return link;
  }

  function createDesktopLink(){
    var link = document.createElement('a');
    link.className = DESKTOP_CLASS;
    link.href = TARGET_URL;
    link.setAttribute('aria-label', 'Opgeslagen deals');
    link.innerHTML = '<span class="mp-saved-icon-v50" aria-hidden="true"><svg class="mp-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-6.8-4.2-9.3-8.1C.7 9 .9 5.5 3.4 3.7c2.1-1.5 5-.9 6.6 1.1L12 7.2l2-2.4c1.6-2 4.5-2.6 6.6-1.1 2.5 1.8 2.7 5.3.7 8.4-2.5 3.9-9.3 8.1-9.3 8.1z"/></svg></span><span>Opgeslagen</span><span class="' + COUNT_CLASS + '" aria-hidden="true">0</span>';
    return link;
  }

  function ensureHomeMobileEntry(){
    /* v36 decoupled home heart:
       Home portrait heart no longer uses the legacy saved-header class.
       It uses .mp-home-portrait-heart only.
       Landscape removes it entirely, so it cannot reappear through old component styling. */
    if(!document.body || !document.body.classList || !document.body.classList.contains('home-cleanup')) return;

    var isPortrait = false;
    try{
      isPortrait = window.matchMedia && window.matchMedia('(orientation: portrait)').matches;
    }catch(e){ isPortrait = false; }

    var header = document.querySelector('.mp-clean-mobile-home .mp-clean-mobile-header');

    /* Remove every legacy saved/header heart on home. */
    var legacyNodes = document.querySelectorAll(
      '.mp-saved-header-link-v50:not(.mp-saved-desktop-link-v50),' +
      '.mp-mobile-heart-link,' +
      '.mp-mobile-heart-button,' +
      '.mp-legacy-header-heart,' +
      '[data-mp-legacy-header-heart="true"]'
    );

    Array.prototype.forEach.call(legacyNodes, function(node){
      if(!node || !node.parentNode) return;

      if(node.closest && node.closest('.mp-desktop-actions')) return;
      if(node.closest && node.closest('.mp-clean-search')) return;
      if(node.closest && node.closest('.mp-clean-search-row')) return;
      if(node.closest && node.closest('.mp-clean-search-actions')) return;

      node.parentNode.removeChild(node);
    });

    /* Landscape: remove the home-only portrait heart. */
    if(!isPortrait){
      var oldPortraitHearts = document.querySelectorAll('.mp-home-portrait-heart');
      Array.prototype.forEach.call(oldPortraitHearts, function(node){
        if(node && node.parentNode) node.parentNode.removeChild(node);
      });
      return;
    }

    /* Portrait: create/keep a separate, home-only heart. */
    if(header && !header.querySelector('.mp-home-portrait-heart')){
      var link = document.createElement('a');
      link.className = 'mp-home-portrait-heart';
      link.href = TARGET_URL;
      link.setAttribute('aria-label', 'Opgeslagen deals');
      link.innerHTML = '<span class="mp-saved-icon-v50" aria-hidden="true"><svg class="mp-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-6.8-4.2-9.3-8.1C.7 9 .9 5.5 3.4 3.7c2.1-1.5 5-.9 6.6 1.1L12 7.2l2-2.4c1.6-2 4.5-2.6 6.6-1.1 2.5 1.8 2.7 5.3.7 8.4-2.5 3.9-9.3 8.1-9.3 8.1z"/></svg></span><span class="' + COUNT_CLASS + '" aria-hidden="true">0</span>';
      header.appendChild(link);
    }
  }

  function ensureCategoryMobileEntry(){
    var header = document.querySelector('#mpMobileCategory .mp-cat-header');
    if(!header || header.querySelector('.' + HEADER_CLASS)) return;
    header.appendChild(createMobileLink());
  }

  function ensureDesktopEntry(){
    var containers = document.querySelectorAll('.mp-desktop-actions, .top-actions:not(.mp-clean-search-actions):not(.mp-clean-search-row)');
    Array.prototype.forEach.call(containers, function(container){
      if(container.querySelector('.' + DESKTOP_CLASS)) return;
      var oldButton = container.querySelector('button');
      var link = createDesktopLink();
      if(oldButton) container.replaceChild(link, oldButton);
      else container.appendChild(link);
    });
  }

  function ensureEntries(){
    ensureHomeMobileEntry();
    ensureCategoryMobileEntry();
    ensureDesktopEntry();
    updateCounts();
  }

  function patchStoreForLiveUpdates(){
    if(!STORE || STORE.__mpHeaderV50Patched) return;
    ['saveDeal','removeSavedDeal','toggleSavedDeal','clearSavedDeals'].forEach(function(method){
      if(typeof STORE[method] !== 'function') return;
      var original = STORE[method];
      STORE[method] = function(){
        var result = original.apply(STORE, arguments);
        window.setTimeout(updateCounts, 0);
        return result;
      };
    });
    STORE.__mpHeaderV50Patched = true;
  }

  function observeDynamicHeaders(){
    if(!window.MutationObserver) return;
    var scheduled = false;
    var observer = new MutationObserver(function(){
      if(scheduled) return;
      scheduled = true;
      window.setTimeout(function(){
        scheduled = false;
        ensureEntries();
      }, 0);
    });
    observer.observe(document.body, {childList:true, subtree:true});
  }

  function init(){
    patchStoreForLiveUpdates();
    ensureEntries();
    observeDynamicHeaders();
    window.addEventListener('storage', updateCounts);
  }

  ready(init);

  window.MeerPakkersSavedDealsHeader = {
    version:'v52',
    refresh:ensureEntries,
    updateCounts:updateCounts
  };
})(window, document);
