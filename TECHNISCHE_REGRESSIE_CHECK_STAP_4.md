# MeerPakkers - Technische regressie-check stap 4

Basis/fallback: `Meerpakkers_Topbar_Consistency_Fix_v1.zip`

## Doel
Volledige regressie-check na de topbar-fix, voordat verdere cleanup wordt gedaan.

## Belangrijkste bevinding
De basis was technisch schoon, maar de topbar was nog niet 100% consistent op alle desktoppagina's:

- `index.html` had nog `MeerPakkers Uitleg` in de desktop hoofdnav.
- Een aantal statische pagina's gebruikte nog het oude losse favorieten-hartje in `.mp-desktop-actions`.
- Een aantal pagina's miste de bijbehorende `saved-deals-header-v50.css` en/of `saved-deals-header-v50.js`.

## Uitgevoerde veilige fix binnen stap 4
Alleen de topbar-headercomponent is gelijkgetrokken, zonder CSS-designbestanden te wijzigen:

- `MeerPakkers Uitleg` verwijderd uit de desktop hoofdnav waar die nog stond.
- Oude losse favorietenknop vervangen door hetzelfde `mp-saved-desktop-link-v50` component.
- Ontbrekende `saved-deals-header-v50.css`, `saved-deals-store-v46.js` en `saved-deals-header-v50.js` aangevuld op pagina's met desktop header.

## Niet aangepast

- Geen `header.css` aangepast.
- Geen `topbar-final-lock-v17.css` aangepast.
- Geen footer-CSS aangepast.
- Geen mobile layout aangepast.
- Geen dealcards aangepast.
- Geen data/deals JSON aangepast.
- Geen affiliate/data model aangepast.

## Checks na fix

- 0 ontbrekende lokale CSS/JS/assets links.
- 0 JS-syntaxfouten.
- 0 JSON-fouten.
- 0 CSS brace-fouten.
- 0 sitemap-pagina's ontbreken.
- 0 verwijzingen naar verwijderde legacy-JS bestanden.
- 0 `console.log`, `debugger`, `TODO`, `FIXME` of merge-conflict markers.
- 0 desktop headers met `MeerPakkers Uitleg` in de hoofdnav.
- 0 desktop headers met oude `Favorieten` knop.
- Alle desktop headers met `.mp-desktop-actions` hebben nu het opgeslagen-deals component.

## Advies voor volgende stap
Stap 5 kan nu veilig verder met een CSS-inventarisatie, maar nog niet blind verwijderen. Eerst bepalen welke CSS-bestanden actief geladen worden en welke legacy/overlap veroorzaken.
