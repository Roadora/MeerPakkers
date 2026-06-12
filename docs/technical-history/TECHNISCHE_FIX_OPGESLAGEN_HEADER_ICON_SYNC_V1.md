# Technische fix - Opgeslagen header icon sync v1

## Doel
De desktop topbar van `/opgeslagen/` gelijk trekken met de rest van de website.

## Probleem
De rest van de website toont in het opgeslagen-component: `hartje + Opgeslagen + teller`.
Op `/opgeslagen/` was het component inhoudelijk aanwezig, maar het hart-icoon werd niet gelijk weergegeven omdat de icon-styling afhankelijk kon zijn van CSS die op die pagina niet geladen werd.

## Aanpassing
Alleen `css/saved-deals-header-v50.css` aangepast zodat het headercomponent zijn eigen hart-icoon styling bezit:
- `.mp-saved-icon-v50` expliciet inline-flex gemaakt
- `.mp-heart-icon` expliciet 16x16, stroke, fill en overflow ingesteld

## Niet aangepast
- Geen topbar layout CSS aangepast
- Geen header.css aangepast
- Geen topbar-final-lock-v17.css aangepast
- Geen footer aangepast
- Geen mobiele layout aangepast
- Geen dealcards aangepast
- Geen JS aangepast

## Resultaat
`/opgeslagen/` gebruikt nu visueel hetzelfde opgeslagen-component als de rest: hartje, tekst en teller.
