# MeerPakkers v41 – Mobile Category Landscape Save Heart Fix

Gebouwd vanaf: `Meerpakkers_Home_Landscape_Netflix_Save_Heart_Fix_v40.zip`

## Oorzaak
De zichtbare boosdoener in landscape is de save-button op de Netflix/Viaplay/mobile-category cards:
- `#mpMobileCategory .mp-save-deal-btn-v47`
- geïnjecteerd door `js/saved-deals-ui-v47.js`
- gestyled door `css/deal-card-actions-v1.css`

Daarom werd de Opgeslagen-teller verhoogd als je erop klikte.

## Fix
- In phone-landscape / wide mobile shell worden save-hartjes binnen `#mpMobileCategory` verborgen en niet meer geïnjecteerd.
- Dit is specifiek gescoped op de mobiele categorie-runtime.
- Portrait home-hartje blijft onaangeraakt.
- Opgeslagen naast de zoekbalk blijft onaangeraakt.
- Dealcard CTA “Bekijk deal” blijft onaangeraakt.

## Aangepast
- `css/deal-card-actions-v1.css`
- `js/saved-deals-ui-v47.js`

## Niet aangepast
- Geen header/topbar.
- Geen data/deals.json.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen affiliate/admin.
