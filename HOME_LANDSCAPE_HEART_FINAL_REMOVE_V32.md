# MeerPakkers v32 – Home Landscape Heart Final Remove

Gebouwd vanaf: `Meerpakkers_Category_Landscape_Search_Fix_v31.zip`

## Auditbevinding
Het hartje rechtsboven in telefoon-landscape kwam uit de oude saved/header-laag:
- `js/saved-deals-header-v50.js` kan standalone saved-heart links bijwerken/toevoegen.
- `css/saved-deals-header-v50.css` en mobile/foldable header CSS hebben oude regels voor `.mp-saved-header-link-v50` en `.mp-mobile-heart-link`.
- In landscape zat de link niet betrouwbaar in alleen `.mp-clean-mobile-header`, waardoor eerdere selectors hem niet altijd raakten.

## Fix
- `ensureHomeMobileEntry()` in `js/saved-deals-header-v50.js` aangescherpt.
- Op home worden nu alle standalone `opgeslagen`/heart-links verwijderd, behalve:
  - de desktop/header Opgeslagen-pill;
  - de officiële Opgeslagen-knop naast de zoekbalk.
- Extra CSS hard-hide toegevoegd voor legacy heart-links in de home brand/header laag.

## Niet aangepast
- Geen dealcards.
- Geen provider cards.
- Geen Kies je Meepakker cards.
- Geen footer.
- Geen data/affiliate/admin.
