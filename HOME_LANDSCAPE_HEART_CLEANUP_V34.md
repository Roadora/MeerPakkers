# MeerPakkers v34 – Home Landscape Heart Cleanup

Gebouwd vanaf: `Meerpakkers_Home_Landscape_Heart_Source_Remove_v33.zip`

## Probleem
In portrait was het losse hartje weg, maar in landscape bleef het zichtbaar terwijl de Opgeslagen-knop naast de zoekbalk al aanwezig is.

## Oorzaak
Landscape gebruikt een brede mobile/tablet shell waarbij de oude saved-header laag nog een standalone heart-link kan tonen.

## Fix
- In `js/saved-deals-header-v50.js` wordt op `body.home-cleanup` elke losse saved/heart-link verwijderd, behalve:
  - de desktop Opgeslagen-link in `.mp-desktop-actions`;
  - de officiële Opgeslagen-knop naast de zoekbalk.
- Oude home-header-heart styling in `css/saved-deals-header-v50.css` geneutraliseerd.
- Landscape-only cascade guard toegevoegd in `css/foldables-responsive-v1.css`.

## Niet aangepast
- Geen dealcards.
- Geen categoriezoekbalk.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen data/affiliate/admin.
