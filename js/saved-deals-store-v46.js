/* MeerPakkers Saved Deals Store v46
   Foundation only: no UI, no routing, no deal-card changes.
   Current persistence: localStorage. Later replace adapter with API/account sync.
*/
(function (window) {
  'use strict';

  var STORAGE_KEY = 'meerpakkers:savedDeals:v1';
  // Retired generic overview cards must not remain visible in saved deals.
  // The three exact Budget Thuis Internet & TV feed deals remain available.
  var RETIRED_DEAL_IDS = {
    'budget-thuis-internet-tv': true
  };

  function safeParse(value) {
    if (!value) return [];
    try {
      var parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function canUseLocalStorage() {
    try {
      var testKey = '__mp_saved_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readSavedDeals() {
    if (!canUseLocalStorage()) return [];
    return safeParse(window.localStorage.getItem(STORAGE_KEY)).filter(function(item) {
      var id = normalizeDealId(item && item.id);
      return id && !RETIRED_DEAL_IDS[id];
    });
  }

  function writeSavedDeals(deals) {
    if (!canUseLocalStorage()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deals || []));
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalizeDealId(dealId) {
    if (dealId === null || dealId === undefined) return '';
    return String(dealId).trim();
  }

  function getSavedDeals() {
    return readSavedDeals();
  }

  function getSavedDealIds() {
    return readSavedDeals().map(function (item) {
      return item.id;
    }).filter(Boolean);
  }

  function isDealSaved(dealId) {
    var id = normalizeDealId(dealId);
    if (!id) return false;
    return getSavedDealIds().indexOf(id) !== -1;
  }

  function saveDeal(deal) {
    if (!deal) return false;

    var id = normalizeDealId(typeof deal === 'object' ? deal.id : deal);
    if (!id) return false;

    var savedDeals = readSavedDeals();
    var existingIndex = savedDeals.findIndex(function (item) {
      return item && item.id === id;
    });

    // v68: store only the stable dealId + metadata.
    // The saved page hydrates the card from data/deals.json, so updated prices, affiliate
    // links and benefit text stay in sync with the single source of truth.
    var savedItem = {
      id: id,
      savedAt: (typeof deal === 'object' && deal.savedAt) ? deal.savedAt : new Date().toISOString()
    };

    if (existingIndex >= 0) {
      savedDeals[existingIndex] = Object.assign({}, savedDeals[existingIndex], savedItem);
    } else {
      savedDeals.unshift(savedItem);
    }

    return writeSavedDeals(savedDeals);
  }

  function removeSavedDeal(dealId) {
    var id = normalizeDealId(dealId);
    if (!id) return false;

    var nextDeals = readSavedDeals().filter(function (item) {
      return item && item.id !== id;
    });

    return writeSavedDeals(nextDeals);
  }

  function toggleSavedDeal(deal) {
    var id = normalizeDealId(typeof deal === 'object' ? deal.id : deal);
    if (!id) return false;

    if (isDealSaved(id)) {
      return removeSavedDeal(id);
    }

    return saveDeal(deal);
  }

  function clearSavedDeals() {
    return writeSavedDeals([]);
  }

  window.MeerPakkersSavedDealsStore = {
    version: 'v69-retired-deal-cleanup',
    storageKey: STORAGE_KEY,
    getSavedDeals: getSavedDeals,
    getSavedDealIds: getSavedDealIds,
    isDealSaved: isDealSaved,
    saveDeal: saveDeal,
    removeSavedDeal: removeSavedDeal,
    toggleSavedDeal: toggleSavedDeal,
    clearSavedDeals: clearSavedDeals
  };
})(window);
