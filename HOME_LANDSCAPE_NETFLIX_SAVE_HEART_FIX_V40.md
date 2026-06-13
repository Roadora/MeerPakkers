# MeerPakkers v40 – Home Landscape Netflix Save Heart Fix

Gebouwd vanaf: `Meerpakkers_Home_Heart_Breakpoint_Contract_v39.zip`

## Oorzaak
Het hartje rechtsboven in home landscape was niet de header-opgeslagen-knop.
Het was de save-button van de Netflix/dealcard:
- `.mp-save-deal-btn-v47`
- geïnjecteerd door `js/saved-deals-ui-v47.js`
- gestyled in `css/deal-card-actions-v1.css`

Daarom ging de Opgeslagen-teller naar 1 wanneer je erop klikte.

## Fix
- Home dealcard save-hartjes worden in phone-landscape / wide mobile shell verborgen/verwijderd.
- Portrait home blijft onaangeraakt.
- De echte Opgeslagen-knop naast de zoekbalk blijft staan.
- Het portrait home-hartje bovenin blijft staan.

## Aangepast
- `css/deal-card-actions-v1.css`
- `js/saved-deals-ui-v47.js`

## Niet aangepast
- Geen header/topbar contract.
- Geen dealcard layout buiten deze save-heart guard.
- Geen categoriezoekbalk.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen data/affiliate/admin.
