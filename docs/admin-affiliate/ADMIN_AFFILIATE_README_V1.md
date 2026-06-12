# MeerPakkers Admin & Affiliate voorbereiding v1

Deze map beschrijft de toekomstige admin/data-laag zonder de huidige frontend te wijzigen.

## Doel
- Deals handmatig kunnen invoeren of importeren vanuit affiliate-netwerken.
- Affiliate-links centraal beheren.
- Demo-deals later veilig vervangen door echte campagnes.
- Frontend blijft lezen uit `data/deals.json`, `data/providers.json`, `data/categories.json` en `data/affiliate-links.json`.

## Aanbevolen adminvelden
- dealId
- providerId
- category
- title
- benefitTypes
- giftName
- giftValue
- cashbackValue
- discountValue
- totalBenefitValue
- monthlyPrice
- originalMonthlyPrice
- contractLengthMonths
- network
- campaignId
- merchantId
- trackingId
- deepLink
- affiliateUrl
- affiliateStatus
- startsAt
- expiresAt
- lastCheckedAt
- isDemo
- isPublished

## Workflow bij affiliate-goedkeuring
1. Nieuwe partner toevoegen aan `data/affiliate-links.json`.
2. Deal in `data/deals.json` koppelen via `providerId`, `network`, `merchantId`, `campaignId` en `affiliateUrl`.
3. `affiliateStatus` van `placeholder` naar `active` zetten.
4. Demo-tekst verwijderen of `isDemo` op `false` zetten zodra deal echt is.
5. Controleer categoriepagina, providerpagina, detailpagina en opgeslagen-deals flow.
