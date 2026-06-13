# Home iPad Header Heart Hard Remove v27

Gebouwd vanaf v26.

Audit-resultaat: het overgebleven hartje zat niet in de Opgeslagen-pill naast de zoekbalk, maar in de legacy/mobile brand-header laag. Eerdere fixes verborgen alleen een deel van de mogelijke selectors.

Aanpassing:
- `css/foldables-responsive-v1.css`: brede iPad/foldable guard tot 1400px toegevoegd voor alle legacy saved-heart varianten binnen de home brand-header.
- `js/saved-deals-header-v50.js`: `ensureHomeMobileEntry()` verwijdert nu actief alle legacy standalone heart varianten uit `.mp-clean-mobile-home`, behalve de Opgeslagen-pill naast de zoekbalk.

Niet aangepast:
- dealcards
- Opgeslagen-pill naast zoekbalk
- desktop topbar
- footer
- data/affiliate/admin
