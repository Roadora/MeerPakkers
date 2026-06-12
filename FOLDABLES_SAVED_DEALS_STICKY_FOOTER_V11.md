# Foldables Saved Deals Sticky Footer v11

Basis: `Meerpakkers_Foldables_Saved_Deals_Footer_Heart_Polish_v10.zip`.

## Doel
Op iPad mini/foldables stond de footer op `/opgeslagen/` midden op de pagina met een groot beige vlak eronder wanneer er weinig opgeslagen deals waren.

## Oorzaak
De pagina-inhoud was korter dan de viewport. De footer stond direct na de content, maar de body vulde daarna de resterende hoogte met achtergrondkleur. Daardoor leek de footer te hoog te staan.

## Fix
Alleen in `css/foldables-responsive-v1.css`:
- `body.mp-saved-page` krijgt in de 761-900px band een flex-column page layout.
- `.mp-saved-shell` groeit mee als contentgebied.
- `.mp-site-footer` krijgt `margin-top:auto`, zodat hij onderaan de viewport landt bij korte content.

## Scope
- Alleen `/opgeslagen/`.
- Alleen 761px t/m 900px.
- Geen telefoonlayout onder 761px aangepast.
- Geen desktop boven 900px aangepast.
- Geen topbar/footer basisbestanden gewijzigd.
- Geen JS, dealcards, affiliate/admin/data of sitemap/robots gewijzigd.
