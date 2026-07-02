import { categoryState, resetCategoryFilters } from "./category-state.js";
import { sortDealsByBenefitAndPrice } from "./category-data.js";

export const filterOptions = {
  "Voordeel": [
    { label: "Cadeau", type: "benefit", value: "cadeau" },
    { label: "Cadeaukaart", type: "benefit", value: "cadeaukaart" },
    { label: "Cashback", type: "benefit", value: "cashback" },
    { label: "Korting of cadeau bij overstappen", type: "benefit", value: "korting" },
    { label: "Gratis extra's", type: "benefit", value: "gratis-extra" },
    { label: "Gratis maanden", type: "benefit", value: "gratis-maanden" }
  ],
  "Klanttype": [
    { label: "Overstappen", type: "dealType", value: "nieuw" },
    { label: "Verlengen", type: "dealType", value: "verlengen" }
  ],
  "Provider": [],
  "Streamingdienst": [
    { label: "Netflix", type: "provider", value: "netflix" },
    { label: "Disney+", type: "provider", value: "disney-plus" },
    { label: "Viaplay", type: "provider", value: "viaplay" },
    { label: "HBO Max", type: "provider", value: "hbo-max" }
  ],
  "Telefoonmerk": [
    { label: "Apple", type: "extra", value: "apple" },
    { label: "Samsung", type: "extra", value: "samsung" },
    { label: "Google", type: "extra", value: "google" },
    { label: "Xiaomi", type: "extra", value: "xiaomi" },
    { label: "OPPO", type: "extra", value: "oppo" }
  ],
  "Toestel": [
    { label: "iPhone", type: "extra", value: "iphone" },
    { label: "Samsung Galaxy", type: "extra", value: "galaxy" },
    { label: "Google Pixel", type: "extra", value: "pixel" }
  ],
  "Databundel": [
    { label: "5GB+", type: "extra", value: "5gb" },
    { label: "20GB+", type: "extra", value: "20gb" },
    { label: "50GB+", type: "extra", value: "50gb" },
    { label: "Onbeperkt", type: "extra", value: "unlimited" }
  ],
  "Internetsnelheid": [
    { label: "100 Mbit+", type: "extra", value: "100" },
    { label: "500 Mbit+", type: "extra", value: "500" },
    { label: "1 Gbit", type: "extra", value: "gbit" }
  ],
  "Glasvezel": [
    { label: "Glasvezel beschikbaar", type: "extra", value: "glasvezel" }
  ],
  "TV-pakket": [
    { label: "TV pakket", type: "extra", value: "tv" },
    { label: "Sportpakket", type: "giftType", value: "sportpakket" },
    { label: "Entertainment", type: "extra", value: "entertainment" }
  ],
  "Films": [{ label: "Films", type: "extra", value: "films" }],
  "Series": [{ label: "Series", type: "extra", value: "series" }],
  "Sport": [{ label: "Sport", type: "giftType", value: "sportpakket" }],
  "Prijs per maand": [
    { label: "Onder €10", type: "price", value: "10" },
    { label: "Onder €20", type: "price", value: "20" },
    { label: "Onder €50", type: "price", value: "50" }
  ],
  "Contract": [
    { label: "Maandelijks", type: "contract", value: "maandelijks" },
    { label: "1 jaar", type: "contract", value: "1-jaar" },
    { label: "2 jaar", type: "contract", value: "2-jaar" }
  ],
  "Cadeautype": [
    { label: "AirPods / oordopjes", type: "giftType", value: "oordopjes" },
    { label: "Nintendo Switch", type: "giftType", value: "nintendo-switch" },
    { label: "PlayStation", type: "giftType", value: "playstation" },
    { label: "Smartwatch", type: "giftType", value: "smartwatch" },
    { label: "Cadeaukaart", type: "giftType", value: "cadeaukaart" },
    { label: "Tablet", type: "giftType", value: "tablet" },
    { label: "Streaming", type: "giftType", value: "streaming" },
    { label: "Sportpakket", type: "giftType", value: "sport" }
  ]
};

export function getOptionsForFilter(filterName, providers = []){
  if (filterName === "Provider"){
    return providers.map(provider => ({ label: provider.name, type: "provider", value: provider.id }));
  }

  return filterOptions[filterName] || [];
}

export function syncCategoryFiltersFromInputs(){
  resetCategoryFilters();

  document.querySelectorAll("[data-category-filter]:checked").forEach(input => {
    const type = input.dataset.filterType;
    const value = input.dataset.filterValue;
    if (categoryState.filters[type]){
      categoryState.filters[type].add(value);
    }
  });
}

function normalizeFilterText(value){
  return String(value || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dealHasGiftType(deal, selectedGiftTypes){
  const haystack = [
    deal.giftType,
    deal.giftName,
    deal.title,
    ...(deal.benefits || [])
  ].map(normalizeFilterText).join(" ");

  return [...selectedGiftTypes].some(value => {
    const needle = normalizeFilterText(value);
    if (needle === "oordopjes") return /oordopjes|airpods|buds|earbuds/.test(haystack);
    if (needle === "nintendo-switch") return /nintendo|switch/.test(haystack);
    if (needle === "playstation") return /playstation|ps5|ps4/.test(haystack);
    if (needle === "sport") return /sport|espn|viaplay/.test(haystack);
    return haystack.includes(needle);
  });
}

function dealMatchesExtra(deal, selectedExtras){
  const haystack = [deal.title, deal.provider, deal.giftName, ...(deal.benefits || [])]
    .map(normalizeFilterText)
    .join(" ");

  return [...selectedExtras].some(value => haystack.includes(normalizeFilterText(value)));
}

export function getFilteredCategoryDeals(){
  const categoryDeals = categoryState.deals.filter(deal => deal.category === categoryState.categoryId);
  const active = categoryState.filters;

  return sortDealsByBenefitAndPrice(categoryDeals.filter(deal => {
    if (active.benefit.size && ![...active.benefit].some(value => (deal.benefitTypes || []).includes(value))){
      return false;
    }

    if (active.dealType.size && !active.dealType.has(deal.dealType || "nieuw")){
      return false;
    }

    if (active.provider.size && !active.provider.has(deal.providerId)){
      return false;
    }

    if (active.contract.size && !active.contract.has(deal.contract)){
      return false;
    }

    if (active.giftType.size && !dealHasGiftType(deal, active.giftType)){
      return false;
    }

    if (active.extra.size && !dealMatchesExtra(deal, active.extra)){
      return false;
    }


    if (active.price.size){
      const maxPrice = Math.min(...[...active.price].map(Number));
      if ((deal.monthlyPrice || 0) > maxPrice) return false;
    }

    return true;
  }));
}

export function hasActiveCategoryFilters(){
  return Object.values(categoryState.filters).some(set => set.size > 0);
}
