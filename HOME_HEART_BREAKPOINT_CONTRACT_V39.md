# MeerPakkers v39 – Home Heart Breakpoint Contract

Gebouwd vanaf: `Meerpakkers_Home_Heart_Clean_Contract_v38.zip`

## Oorzaak
Het probleem zat niet in portrait/landscape zelf, maar in het breakpoint:
- Portrait gebruikt de mobiele home-header.
- Phone landscape schakelt visueel naar de tablet/desktop header vanaf 769px+.
- Daardoor staat `Opgeslagen` al naast de zoekbalk en moet het losse home-hartje weg.

## Fix
- JS gebruikt nu `window.innerWidth < 769` als contract.
- CSS gebruikt nu:
  - `@media (max-width:768px)` → portrait/mobile hartje tonen.
  - `@media (min-width:769px)` → standalone home-hartjes verbergen.
- De Opgeslagen-knop naast de zoekbalk blijft onaangeraakt.
- De desktop Opgeslagen-link blijft onaangeraakt.

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
