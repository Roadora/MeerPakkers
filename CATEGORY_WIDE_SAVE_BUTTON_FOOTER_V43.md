# MeerPakkers v43 – Category Wide Save Button Footer

Gebouwd vanaf: `Meerpakkers_Category_Wide_Save_Heart_Hard_Fix_v42.zip`

## Waarom
v42 haalde het zwevende Netflix/dealcard-hartje weg, maar daardoor kon je in wide/landscape category-runtime niet meer opslaan vanuit de card.

## Fix
- Save-knop op `#mpMobileCategory` wordt vanaf 769px niet meer verborgen.
- In wide/landscape category-runtime wordt de save-actie een normale footerknop naast `Bekijk deal`.
- Het zwevende top-right hartje-effect verdwijnt.
- Opslaan vanuit de Netflix/Viaplay/category card blijft mogelijk.
- Portrait mobiel blijft ongemoeid.

## Aangepast
- `css/deal-card-actions-v1.css`
- `js/saved-deals-ui-v47.js`

## Niet aangepast
- Geen data/deals.json.
- Geen header/topbar.
- Geen providers.
- Geen Kies je Meepakker.
- Geen footer.
- Geen affiliate/admin.
