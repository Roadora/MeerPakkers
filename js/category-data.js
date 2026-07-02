export async function loadCategoryData(){
  const [dealsRes, providersRes, categoriesRes] = await Promise.all([
    fetch("/data/deals.json"),
    fetch("/data/providers.json"),
    fetch("/data/categories.json")
  ]);

  if (!dealsRes.ok || !providersRes.ok || !categoriesRes.ok){
    throw new Error("Categorie data kon niet worden geladen");
  }

  const [deals, providers, categories] = await Promise.all([
    dealsRes.json(),
    providersRes.json(),
    categoriesRes.json()
  ]);

  const publicDeals = window.MPDealLifecycle
    ? window.MPDealLifecycle.filterCurrent(deals)
    : deals;

  return { deals: publicDeals, providers, categories };
}

export function sortDealsByBenefitAndPrice(deals){
  return [...deals].sort((a,b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDiff) return featuredDiff;

    const benefitDiff = getTotalValue(b) - getTotalValue(a);
    if (benefitDiff) return benefitDiff;

    const priceA = Number(a.monthlyPrice || Number.POSITIVE_INFINITY);
    const priceB = Number(b.monthlyPrice || Number.POSITIVE_INFINITY);
    if (priceA !== priceB) return priceA - priceB;

    return String(a.provider || '').localeCompare(String(b.provider || '')) ||
      String(a.title || '').localeCompare(String(b.title || ''));
  });
}

export function getTotalValue(deal){
  return deal.totalBenefitValue || deal.benefitValue || 0;
}

export function getCategoryProviders(providers, categoryId){
  return providers
    .filter(provider => (provider.categories || []).includes(categoryId))
    .sort((a,b) => (a.priority || 99) - (b.priority || 99));
}
