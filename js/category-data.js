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

  return { deals, providers, categories };
}

export function sortDealsByScoreAndValue(deals){
  return [...deals].sort((a,b) => {
    const scoreDiff = (b.meerPakScore || 0) - (a.meerPakScore || 0);
    if (scoreDiff) return scoreDiff;
    return getTotalValue(b) - getTotalValue(a);
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
