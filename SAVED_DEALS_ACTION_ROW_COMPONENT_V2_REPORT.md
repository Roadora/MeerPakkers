# Saved Deals Action Row Component v2

## Change
Saved deals now use the shared `renderNormalDealCard()` renderer in `mode: 'saved'`.
The same normal DealCard shell renders an explicit action slot with **Verwijder** and **Bekijk deal** beside each other.

## Component contract
- Shared normal card: `mp-normal-deal-card`
- Saved variant: `mp-normal-deal-card--saved`
- Shared action slot: `mp-normal-deal-card-actions`
- Buttons: `mp-normal-deal-card-remove` + `mp-normal-deal-card-cta`

## Scope
Only `/opgeslagen/` uses this saved-mode action row. Home, categories, providers and mobile save hearts remain unchanged.
