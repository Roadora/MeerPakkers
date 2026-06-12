# MeerPakkers technische audit + cleanup stap 1

Basisbestand: Meerpakkers_Uitleg_Remove_Why_Block_v1_CSS_Brace_Fix.zip
Datum: 2026-06-12

## Beschermde onderdelen
- Topbar niet aangepast.
- Footer Clean Rebuild niet aangepast.
- Mobiele layout niet aangepast.
- Geen actieve HTML/CSS/JS componenten gewijzigd.

## Auditresultaat
- 66 HTML-pagina's gevonden.
- 48 actieve CSS-bestanden in /css gevonden vóór cleanup.
- 43 actieve JS-bestanden in /js gevonden vóór cleanup.
- Geen ontbrekende stylesheet- of scriptreferenties gevonden.
- Alle JSON-bestanden valideren correct.
- Alle JS-bestanden in /js slagen voor node --check.
- CSS-brace balance gecontroleerd: geen open/dubbele braces gevonden.

## Gevonden rommel/conflictrisico
- Veel oude audit-notities stonden in de root. Die zijn niet nodig voor livegang en maken het pakket onoverzichtelijk.
- css/_archive_unused bevatte oude CSS-versies die niet actief gelinkt waren.
- js/_archive_unused bevatte oude JS-versies die niet actief gelinkt waren.
- Er zijn nog enkele niet-direct-gelinkte legacy CSS/JS bestanden in /css en /js. Die zijn in stap 1 bewust nog niet verwijderd, omdat sommige later nog via imports of toekomstige pagina's gebruikt kunnen worden.

## Uitgevoerde cleanup stap 1
- Oude root-notities verwijderd: *_NOTES.txt, *_AUDIT.txt, *_BASIS.txt.
- css/_archive_unused verwijderd.
- js/_archive_unused verwijderd.
- Affiliate/data voorbereiding toegevoegd zonder frontend te raken:
  - data/affiliate-link.schema.json
  - data/affiliate-links.json
  - BACKEND_AFFILIATE_STRUCTUUR_V1.md

## Affiliate/data voorbereiding
De huidige data/deals.json bevat al velden zoals affiliateUrl, network, campaignId, trackingId, merchantId, deepLink en affiliateStatus.
De nieuwe affiliate-links structuur is bedoeld als tussenlaag voor later backend/admin beheer, zodat echte affiliate links later toegevoegd kunnen worden zonder dealcards of design te wijzigen.

## Volgende veilige cleanup stap
Stap 2 kan zijn: actieve legacy CSS/JS inventariseren per pagina en alleen bestanden verwijderen die:
1. nergens in HTML staan,
2. nergens geïmporteerd worden,
3. geen bekende fallback/componentfunctie meer hebben,
4. niet nodig zijn voor topbar, footer, mobiel, deals, opgeslagen deals of detailpagina's.
