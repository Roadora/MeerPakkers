# MeerPakkers v50 – Tablet Home 10 + Load More

Gebouwd vanaf: `Meerpakkers_Tablet_Deal_Grid_2Col_v49.zip`

## Doel
Op tablet/foldable Home wordt `Alle deals met voordeel` niet meer met alle 21 deals in één keer getoond.

## Gedrag
- Tablet/foldable Home: eerst 10 deals.
- CTA: `Toon 10 meer deals`.
- Daarna volgende 10.
- Laatste staat: `Alle deals geladen`.
- Telefoon portrait en desktop blijven hun bestaande flow houden.

## Scope
Alleen Home `#dealList` / `.mp-home-meepakker-grid` in de tablet/foldable band.

## Aangepast
- `js/home-render.js`
- `js/home-events.js`
- `css/foldables-responsive-v1.css`

## Niet aangepast
- Geen categoriepagina’s.
- Geen topbar.
- Geen v47 featured-heart fix.
- Geen v48 detail-topbar.
- Geen footer.
- Geen data/deals.json.
- Geen providers.
- Geen affiliate/admin.
