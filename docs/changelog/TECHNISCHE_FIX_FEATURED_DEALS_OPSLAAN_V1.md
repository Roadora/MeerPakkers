# MeerPakkers – Featured Deals Opslaan Fix v1

## Doel
De hartjes op de desktop Home-sectie **Beste deals per categorie** koppelen aan dezelfde opgeslagen-deals logica als de normale dealcards.

## Probleem
De featured/category-winner cards hadden wel een visueel hartje (`.mp-featured-heart`), maar geen `data-save-deal-id` en geen gedeelde save-heart class. Daardoor kon de bestaande `saved-deals-ui-v47.js` deze hartjes niet herkennen of opslaan.

## Aangepast
- `js/home-render.js`
  - Featured heart krijgt nu ook `meepakker-save-heart`.
  - Featured heart krijgt nu `data-save-deal-id` met dezelfde stabiele deal-id als de card.
  - Na render wordt `mpEnhanceSavedButtons()` aangeroepen zodat state direct wordt gesynchroniseerd.

- `js/saved-deals-ui-v47.js`
  - MutationObserver kijkt nu ook naar `#featuredDeal`, zodat later gerenderde featured cards ook automatisch worden gesynchroniseerd.

## Niet aangepast
- Geen card design aangepast.
- Geen topbar aangepast.
- Geen footer aangepast.
- Geen mobile layout aangepast.
- Geen dealdata aangepast.
- Geen affiliate/admin structuur aangepast.

## Checks
- 0 ontbrekende lokale CSS/JS/assets-links.
- 0 JS-syntaxfouten.
- 0 JSON-fouten.
- 0 CSS brace-fouten.
