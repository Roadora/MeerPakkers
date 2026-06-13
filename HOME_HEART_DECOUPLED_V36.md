# MeerPakkers v36 – Home Heart Decoupled

Gebouwd vanaf: `Meerpakkers_Home_Portrait_Heart_Back_Landscape_Hide_v35.zip`

## Echte oorzaak
Het home-hartje gebruikte dezelfde legacy class als de oude algemene saved-header component:
- `mp-saved-header-link-v50`
- `mp-mobile-heart-link`

Daardoor kon het in landscape terugkomen via oude componentlogica/styling.

## Fix
- Het home portrait-hartje is losgekoppeld en gebruikt nu alleen:
  - `mp-home-portrait-heart`
- Legacy saved/header hearts worden op home verwijderd.
- Portrait: `mp-home-portrait-heart` wordt getoond.
- Landscape: `mp-home-portrait-heart` wordt verwijderd/verborgen.
- De officiële Opgeslagen-knop naast de zoekbalk blijft onaangeraakt.

## Aangepast
- `js/saved-deals-header-v50.js`
- `css/foldables-responsive-v1.css`
- `css/saved-deals-header-v50.css`

## Niet aangepast
- Geen dealcards.
- Geen categoriezoekbalk.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen data/affiliate/admin.
