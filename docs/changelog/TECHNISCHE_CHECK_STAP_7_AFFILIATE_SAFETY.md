# MeerPakkers – Stap 7 Affiliate Safety + CTA fallback check

Gebouwd vanaf: `Meerpakkers_Featured_Deals_Opslaan_Fix_v1.zip` / Stap 6 Affiliate Flow Ready.

## Doel
Voorkomen dat bezoekers op dode of neppe affiliate-links terechtkomen zolang echte affiliate-links nog niet zijn goedgekeurd of ingevuld.

## Aangepast
Alleen `js/affiliate.js` is functioneel uitgebreid.

## Nieuw gedrag
- Affiliate-links met status `live` of `approved` en een echte `http(s)` URL openen veilig in een nieuw tabblad.
- Placeholder-, pending-, paused- of lege links navigeren niet meer naar een dode `#affiliate-*` link.
- Bij placeholder-links krijgt de bezoeker een nette melding:
  “Deze deal is nog demo. De veilige aanbieder-link wordt binnenkort gekoppeld.”
- Affiliate-clicks worden nog steeds lokaal gelogd voor test/audit.
- De centrale affiliate-laag leest `data/affiliate-links.json` en gebruikt dat als bron voor status en uiteindelijke URL.

## Niet aangepast
- Geen topbar CSS.
- Geen footer CSS.
- Geen mobile layout.
- Geen dealcard design.
- Geen actieve dealdata.
- Geen echte affiliate-links ingevuld.

## Belangrijk voor later
Als een affiliate-link is goedgekeurd, hoeft later alleen de juiste entry in `data/affiliate-links.json` aangepast te worden:

```json
{
  "dealId": "voorbeeld-deal",
  "network": "daisycon",
  "deepLink": "https://...",
  "finalUrl": "https://...",
  "status": "live"
}
```

Daarna laat de CTA automatisch door naar de aanbieder.
