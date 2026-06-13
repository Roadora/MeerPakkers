# Technische Check Stap 9 — Livegang SEO / Sitemap / Robots

Basis: Meerpakkers_Stap_8_Admin_Data_Ready.zip
Datum: 2026-06-12

## Uitgevoerd

- `sitemap.xml` opnieuw opgebouwd vanuit de bestaande publieke HTML-pagina's.
- Niet-publieke of technische pagina's uit de sitemap gehouden.
- `robots.txt` gecontroleerd en netjes gehouden: Google mag crawlen en de sitemap staat erin.
- `noindex,follow` toegevoegd aan pagina's die niet als losse SEO-landingspagina bedoeld zijn:
  - `/deal/` dynamische/generieke detailpagina
  - `/deals/` redirectpagina naar home
  - `/providers/disney.html` redirect naar `/providers/disney-plus.html`
  - `/opgeslagen/` persoonlijke opgeslagen-deals pagina
- Sitemap bevat nu alleen echte publieke landingspagina's: home, categorieën, providers, meepakker-pagina's, uitleg/content, juridische/contactpagina's en statische dealpagina's.

## Niet aangepast

- Geen topbar CSS
- Geen footer CSS
- Geen mobile layout
- Geen dealcard design
- Geen affiliate-links of dealdata inhoudelijk aangepast

## Resultaat

- Publieke sitemap-URL's: 62
- Robots staat open voor indexatie.
- Sitemap verwijst niet meer naar persoonlijke/redirect/generieke pagina's.
