export const categoryState = {
  categoryId: null,
  category: null,
  deals: [],
  providers: [],
  categories: [],
  filters: {
    benefit: new Set(),
    provider: new Set(),
    contract: new Set(),
    giftType: new Set(),
    price: new Set(),
    extra: new Set(),
    dealType: new Set()
  }
};

export function resetCategoryFilters(){
  Object.values(categoryState.filters).forEach(set => set.clear());
}
