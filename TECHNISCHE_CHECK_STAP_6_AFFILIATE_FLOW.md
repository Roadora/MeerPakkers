# MeerPakkers Technische Check Stap 6 — Affiliate Flow Ready

Datum: 2026-06-12

## Doel
Eindcheck uitvoeren op de schone basis en de affiliate-click flow voorbereiden zonder design te wijzigen.

## Uitgevoerd
- Statische dealpagina's in `/deals/*.html` gecontroleerd.
- De aanbieder-CTA `Bekijk deal →` op statische dealpagina's gekoppeld aan de centrale affiliate-laag.
- `js/affiliate.js` toegevoegd aan de statische dealpagina's waar die nog ontbrak.
- Affiliate metadata toegevoegd aan statische deal CTA's:
  - `data-affiliate-link`
  - `data-affiliate-deal-id`
  - `data-affiliate-provider-id`
  - `data-affiliate-category`
  - `data-affiliate-network`
  - `data-affiliate-campaign-id`
  - `data-affiliate-tracking-id`
  - `data-affiliate-merchant-id`
- Dynamische `/deal/` CTA's aangevuld met dezelfde affiliate metadata.

## Bewust niet aangepast
- Geen topbar CSS.
- Geen footer CSS.
- Geen mobile layout.
- Geen dealcard design.
- Geen actieve dealdata-waarden.
- Geen echte affiliate links ingevuld. Placeholder links blijven veilig staan tot goedkeuring.

## Resultaat
De affiliate-flow is nu klaar voor echte links: zodra een `affiliateUrl` of `finalUrl` wordt vervangen door een echte partnerlink, loopt de CTA via dezelfde centrale laag en opent een echte link veilig met sponsored/noopener/noreferrer. Placeholder links worden nog geblokkeerd en gelogd in localStorage.

## Checks na stap 6
- 0 ontbrekende lokale CSS/JS/assets-links.
- 0 JS-syntaxfouten.
- 0 JSON-fouten.
- 0 CSS brace-fouten.
- Alle deals in `data/deals.json` hebben een bijpassende entry in `data/affiliate-links.json`.
- Alle statische dealpagina's hebben nu `js/affiliate.js` en `data-affiliate-deal-id` op de aanbieder-CTA.
