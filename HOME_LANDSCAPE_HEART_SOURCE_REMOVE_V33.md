# MeerPakkers v33 – Home Landscape Heart Source Remove

Gebouwd vanaf: `Meerpakkers_Home_Landscape_Heart_Final_Remove_v32.zip`

## Auditbevinding
Het hartje bleef zichtbaar in telefoon-landscape omdat het uit de legacy saved-header component kwam:
- `js/saved-deals-header-v50.js`
- `.mp-saved-header-link-v50`
- `.mp-mobile-heart-link`
- oude home/header laag

## Fix
- Legacy heart-links krijgen nu een herkenbare marker `mp-legacy-header-heart`.
- Op home worden alle legacy standalone heart-links hard uit de DOM verwijderd.
- De officiële `Opgeslagen`-knop naast de zoekbalk blijft onaangeraakt.
- Extra cascade guards toegevoegd in:
  - `css/saved-deals-header-v50.css`
  - `css/foldables-responsive-v1.css`

## Niet aangepast
- Geen dealcards.
- Geen category/search layout.
- Geen provider cards.
- Geen Kies je Meepakker cards.
- Geen footer.
- Geen affiliate/admin/data.
