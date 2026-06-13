# MeerPakkers – Stap 10 Affiliate Status Dashboard

Gebouwd vanaf: `Meerpakkers_Stap_9_Livegang_SEO_Check.zip`

## Doel
Een intern, niet-geïndexeerd overzicht toevoegen voor affiliate/admin opvolging, zonder design/topbar/footer/mobile/dealcards te wijzigen.

## Toegevoegd
- `admin/affiliate-status/index.html`
- `css/admin-affiliate-status.css`
- `js/admin-affiliate-status.js`

## Functionaliteit
- Laadt `data/provider-affiliate-status.json`
- Laadt `data/deals.json`
- Laadt `data/affiliate-links.json`
- Toont providers met aanvraagstatus en affiliate-status
- Toont deal affiliate-links en placeholder/live status
- Berekent aantallen providers, deals, live/approved links en placeholder links
- Bevat filters voor providers: alles, nog aanvragen, aangevraagd, goedgekeurd en live

## SEO/veiligheid
- Dashboard heeft `noindex,nofollow`
- `robots.txt` bevat `Disallow: /admin/`
- Dashboard is niet toegevoegd aan `sitemap.xml`

## Niet aangepast
- Geen topbar CSS
- Geen footer CSS
- Geen mobile layout
- Geen dealcard design
- Geen bestaande dealdata inhoudelijk gewijzigd
- Geen echte affiliate-links ingevuld

## Checkresultaat
- 0 ontbrekende lokale CSS/JS/assets-links
- 0 JS-syntaxfouten
- 0 JSON-fouten
- 0 CSS brace-fouten
- 0 sitemap-missers
