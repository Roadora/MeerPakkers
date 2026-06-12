# Technische fix - Opgeslagen Header Font Sync v1

Basis: Meerpakkers_Opgeslagen_Header_Size_Sync_v1.

## Probleem
Op /opgeslagen/ leek het Opgeslagen-component in de desktop topbar iets kleiner/anders dan op categoriepagina's.

## Oorzaak
De pagina /opgeslagen/ had in css/saved-deals-v49.css een eigen body font-stack:
`system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`

De rest van de site gebruikt via base.css:
`Inter,Arial,sans-serif`

Daardoor werd de tekst in hetzelfde headercomponent net anders gerenderd.

## Fix
Alleen css/saved-deals-v49.css aangepast:
- body.mp-saved-page gebruikt nu dezelfde font-stack als de rest: `Inter,Arial,sans-serif`.

## Niet aangepast
- header.css niet aangepast
- topbar-final-lock-v17.css niet aangepast
- footer niet aangepast
- mobile layout niet aangepast
- dealcards niet aangepast
- JS niet aangepast

## Checks
- 0 ontbrekende lokale CSS/JS/assets-links
- 0 JS-syntaxfouten
- 0 JSON-fouten
- 0 CSS brace-fouten
