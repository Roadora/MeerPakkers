# Technische check stap 8 – Admin/Data Ready

Basis: `Meerpakkers_Stap_7_Affiliate_Safety_Ready.zip`.

## Doel

De data- en affiliate-structuur klaarmaken voor latere admin/import/feed-koppeling, zonder design of frontend-layout te wijzigen.

## Aangepast

- `data/deals.json` aangevuld met admin-ready metadata: `dealStatus`, `publicationStatus`, `startsAt`, `expiresAt`, `sourceType`, `sourceId`, `adminNotes`, `termsSummary`, `lastDataReviewAt`.
- `data/affiliate-links.json` aangevuld met affiliate/admin metadata: `startsAt`, `expiresAt`, `approvedAt`, `sourceType`, `adminNotes`, `utmCampaign`, `subIdTemplate`.
- `data/deal.schema.json` geüpdatet naar contract v1.1.
- `data/affiliate-link.schema.json` geüpdatet naar contract v1.1.
- `data/admin-field-map.json` geüpdatet naar contract v1.1.
- `data/provider-affiliate-status.json` toegevoegd voor provider-aanvragen/goedkeuringen.
- `data/templates/affiliate-link-import-template.csv` toegevoegd.
- `data/templates/deal-import-template.csv` verbeterd voor admin/import gebruik.
- `docs/admin-affiliate/ADMIN_DATA_CONTRACT_V1.md` toegevoegd.
- `js/affiliate.js` accepteert nu naast `live`/`approved` ook `active` als veilige live-status voor toekomstige data/imports.

## Niet aangepast

- Geen topbar CSS.
- Geen footer CSS.
- Geen mobile layout.
- Geen dealcard design.
- Geen provider/categorie/detail HTML design.
- Geen echte affiliate-links ingevuld.

## Resultaat

De site blijft static/local bruikbaar, maar de data is nu klaar om later door een adminpaneel, CSV-import of affiliate feed gevuld te worden.
