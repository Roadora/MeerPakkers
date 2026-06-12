# Technische fix – Opgeslagen Deals Header v1

## Probleem
Op de pagina `/opgeslagen/` werd `saved-deals-header-v50.js` wel geladen, maar de bijbehorende CSS `saved-deals-header-v50.css` niet. Daardoor werd de desktop favorieten-link na JS-replacement ongestyled weergegeven, met een veel te groot hart-icoon.

## Oorzaak
De CSS-link ontbrak al in de fallback vóór Stap 3. Dit is dus niet veroorzaakt door de legacy-JS cleanup.

## Fix
Alleen in `opgeslagen/index.html` is deze stylesheet toegevoegd:

```html
<link rel="stylesheet" href="../css/saved-deals-header-v50.css">
```

## Niet aangepast
- Topbar CSS niet gewijzigd
- Footer Clean Rebuild niet gewijzigd
- Mobiele topbar niet gewijzigd
- Dealcards niet gewijzigd
- JS niet gewijzigd
- Data/deals niet gewijzigd

## Verwacht resultaat
De desktop-header op `/opgeslagen/` gebruikt weer dezelfde compacte opgeslagen-deals knop/teller als de rest van de site.
