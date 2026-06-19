# MeerPakkers Pak Deze Meepakker Affiliate Fix v1

Basis: Meerpakkers_Budget_Affiliate_Link_ID_Sync_v1.zip

## Aangepast
- deals/budget-thuis-internet-tv.html

## Wat is gedaan
- Budget dealdetailpagina krijgt extra veiligheidsbinding voor de CTA `Pak deze Meepakker`.
- Als de CTA als link staat, wordt de href direct naar de correcte Daisycon-link gezet.
- Als de CTA via JS als button/div wordt gerenderd, opent hij alsnog de correcte Daisycon-link.

## Correcte affiliate-link
`https://dc.budgetthuis.nl/c/?si=14524&li=1923068&wi=422185&ws=mp-internet-budget-thuis`

## Audit
- Correcte affiliate-link count op Budget dealpagina: 2
- Afwijkende Budget affiliate-links op Budget dealpagina: 0
- Alle Budget Daisycon URL's gevonden: 9
- Afwijkende Budget Daisycon URL's in hele site: 0
- Bestanden met zichtbare Pak Meepakker tekst: 2
- JS/JSON/CSS errors: 0
- Missing refs: 0

## Niet aangeraakt
- Topbar
- Footer
- Layout/dealcards
- SEO-template