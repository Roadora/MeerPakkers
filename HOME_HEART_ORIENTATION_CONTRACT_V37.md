# MeerPakkers v37 – Home Heart Orientation Contract

Gebouwd vanaf: `Meerpakkers_Home_Heart_Decoupled_v36.zip`

## Waar ging het fout?
1. Er stonden nog oude, brede CSS-regels uit eerdere fixes zoals:
   `body.home-cleanup .mp-clean-mobile-header a[href*="opgeslagen"]`
   Die verbergen óók het nieuwe portrait-hartje, omdat het natuurlijk ook naar `/opgeslagen/` linkt.

2. De JS gebruikte `matchMedia('(orientation: portrait)')`.
   Op Android/Chrome kan landscape met browserbalken/viewport resize tijdelijk inconsistent reageren.

3. Bij draaien van het toestel werd de heart-state niet hard opnieuw bepaald.

## Fix
- JS bepaalt portrait/landscape nu met `window.innerHeight >= window.innerWidth`.
- JS draait opnieuw bij `resize` en `orientationchange`.
- Portrait-hartje blijft losgekoppeld via `.mp-home-portrait-heart`.
- Laatste CSS-contract:
  - portrait: `.mp-home-portrait-heart` expliciet tonen;
  - landscape/korte viewport: alle home-header hearts expliciet verbergen.
- De Opgeslagen-knop naast de zoekbalk blijft onaangeraakt.

## Niet aangepast
- Geen dealcards.
- Geen categoriezoekbalk.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen data/affiliate/admin.
