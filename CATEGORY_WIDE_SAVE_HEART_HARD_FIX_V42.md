# MeerPakkers v42 – Category Wide Save Heart Hard Fix

Gebouwd vanaf: `Meerpakkers_Mobile_Category_Landscape_Save_Heart_Fix_v41.zip`

## Oorzaak
De boosdoener is de save-button op de Netflix/dealcard binnen de mobiele categorie-runtime:
- `#mpMobileCategory .mp-save-deal-btn-v47`

De vorige v41-fix was te smal door landscape/max-height conditions. De screenshot valt in een bredere mobile/tablet runtime.

## Fix
- Vanaf `min-width:769px` worden save-hartjes binnen `#mpMobileCategory` verborgen en verwijderd.
- Onder 769px blijft portrait mobiel ongemoeid.
- `Opgeslagen` naast de zoekbalk blijft staan.
- `Bekijk deal` blijft staan.
- Data/deals.json is niet aangepast.

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
