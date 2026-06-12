# Technische Cleanup Stap 5 — CSS dependency clean + admin/affiliate voorbereiding

Basis: `Meerpakkers_Opgeslagen_Header_Font_Sync_v1.zip`

## Uitgevoerd
- CSS dependency-audit gedaan op alle HTML-bestanden, inclusief absolute `/css/...` paden.
- Alleen CSS verwijderd die nergens actief wordt geladen en ook nergens in HTML/JS/CSS als bestandsnaam voorkomt.
- Oude technische rapporten uit de root verplaatst naar `docs/technical-history/`.
- Intern auditscript uit de root verwijderd.
- Admin/affiliate voorbereiding toegevoegd zonder runtime-impact.

## Verwijderde ongekoppelde legacy CSS
- css/affiliate.css
- css/cards-compact-v2.css
- css/cards.css
- css/categories.css
- css/desktop-header.css
- css/discovery-shared.css
- css/hero.css
- css/mobile-app-home-v3.css
- css/mobile-home-v2.css
- css/mobile-topbar-final-lock-v11.css
- css/mobile.css
- css/newsletter.css
- css/providers.css
- css/saved-deals-v43.css
- css/saved-deals-v44.css
- css/style.css

## Bewust behouden omdat ze actief gekoppeld zijn
- `css/category-pages.css`
- `css/deal-pages.css`
- `css/discovery-card-component-v1.css`
- `css/mobile-page-header.css`
- `css/provider-pages.css`

## Toegevoegd voor affiliate/admin
- `docs/admin-affiliate/ADMIN_AFFILIATE_README_V1.md`
- `data/admin-field-map.json`
- `data/affiliate-networks.json`
- `data/templates/deal-import-template.csv`

## Niet aangepast
- Topbar CSS lock-bestanden
- Footer Clean Rebuild
- Mobiele layout
- Dealcards
- JS-logica
- Actieve dealdata
