# MeerPakkers backend/data/affiliate structuur v1

Doel: affiliate links later veilig kunnen koppelen zonder design, topbar, footer of mobiele flows te wijzigen.

## Huidige situatie
- data/deals.json blijft de bron voor zichtbare deals.
- js/affiliate.js vangt toekomstige affiliate-clicks af.
- Placeholder links zoals #affiliate-vodafone worden bewust niet geopend.

## Nieuwe voorbereidende laag
- data/affiliate-links.json bevat per deal/provider de toekomstige affiliate metadata.
- data/affiliate-link.schema.json beschrijft het verwachte format.

## Later admin/backend
Een admin panel kan later deze velden beheren:
- dealId
- providerId
- category
- network
- merchantId
- campaignId
- trackingId
- deepLink
- finalUrl
- status
- lastCheckedAt

## Belangrijk
De frontend hoeft later alleen de echte link uit deze laag te lezen of tijdens build/deploy in deals.json te injecteren.
