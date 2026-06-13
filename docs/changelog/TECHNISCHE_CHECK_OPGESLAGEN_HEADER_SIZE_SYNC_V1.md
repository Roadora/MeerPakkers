# MeerPakkers - Opgeslagen Header Size Sync v1

Doel: verklaren en fixen waarom de Opgeslagen-knop op /opgeslagen/ visueel iets kleiner leek dan op de rest van de site.

Oorzaak:
- /opgeslagen/index.html had een afwijkende CSS-volgorde: saved-deals-header-v50.css stond vóór header.css/topbar styling.
- Daardoor werd het Opgeslagen-component op deze pagina niet exact in dezelfde cascade opgebouwd als op categoriepagina’s.
- De styling is nu extra self-contained gemaakt in saved-deals-header-v50.css, zodat het component overal dezelfde desktopmaat gebruikt.

Aangepast:
- Alleen /opgeslagen/index.html: CSS-volgorde gecorrigeerd.
- Alleen css/saved-deals-header-v50.css: geïsoleerde desktop-size-sync toegevoegd voor het Opgeslagen-component.

Niet aangepast:
- header.css
- topbar-final-lock-v17.css
- footer.css
- mobile CSS
- dealcards
- JS
- data/JSON
