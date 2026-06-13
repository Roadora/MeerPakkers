# MeerPakkers Foldables Detail Header Fix v6

Gebouwd vanaf: Meerpakkers_Foldables_Provider_Detail_CTA_Fix_v5.zip

## Doel
De resterende iPad mini/foldable regressies oplossen op detailpagina's rond 761-900px.

## Probleem
- Statische dealpagina's (`/deals/*.html`) hadden geen mobiele header, maar kregen rond iPad mini-breedtes een half gestapelde desktopheader waar nav, logo en zoekbalk door elkaar liepen.
- Dynamische detailpagina's en Meepakker-resultaatpagina's hadden wel een mobiele header, maar werden in de tablet/foldable zone nog niet overal correct geactiveerd.

## Aanpassing
Alleen `css/foldables-responsive-v1.css` is aangepast.

- Statische dealpagina's met `body[data-deal-id]` houden een compacte, gestapelde desktopheader in 761-900px.
- Dynamische detailpagina's met `body.mp-deal-detail-page` gebruiken de bestaande mobile/tablet header in 761-900px.
- Meepakker-resultaatpagina's met `body[data-meepakker-result="true"]` gebruiken de bestaande mobile/tablet header in 761-900px.

## Niet aangepast
- Telefoonlayout onder 761px
- Desktop boven 900px
- Topbar lock CSS
- Footer
- JS
- Dealcards
- Affiliate/admin/data
- Sitemap/robots
