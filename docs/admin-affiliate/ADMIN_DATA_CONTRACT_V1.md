# MeerPakkers Admin/Data Contract v1

Deze stap maakt de data klaar voor affiliate en later admin, zonder een echte backend te bouwen.

## Bronnen

- `data/deals.json` = zichtbare deals en content.
- `data/affiliate-links.json` = echte aanbiederlinks en affiliate-status.
- `data/provider-affiliate-status.json` = overzicht van provider-aanvragen en goedkeuringen.
- `data/admin-field-map.json` = veldcontract voor toekomstig adminpaneel.
- `data/templates/deal-import-template.csv` = importtemplate voor nieuwe deals.
- `data/templates/affiliate-link-import-template.csv` = importtemplate voor affiliate links.

## Statussen

Dealstatus:
- `demo`: toonbare demodeal.
- `active`: echte/live deal.
- `paused`: tijdelijk uit.
- `expired`: verlopen.

Publicatiestatus:
- `draft`: niet publiceren.
- `published`: tonen op site.
- `hidden`: tijdelijk verborgen.

Affiliate-status:
- `placeholder`: nog geen echte link; CTA toont melding.
- `pending`: aangevraagd/nog niet goedgekeurd; CTA toont melding.
- `approved`: goedgekeurd en klikbaar met echte URL.
- `live`: live en klikbaar met echte URL.
- `paused`: tijdelijk uit.
- `expired`: verlopen.

## Belangrijk

Topbar, footer, mobile layout en dealcards zijn niet aangepast. Deze bestanden zijn voorbereiding voor beheer en affiliate-koppeling.
