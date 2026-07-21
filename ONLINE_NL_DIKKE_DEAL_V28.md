# ONLINE_NL_DIKKE_DEAL_V28

## Toegevoegd

- Online.nl Internet & TV: 9 maanden korting t.w.v. €198, €150 cashback en geen aansluitkosten t.w.v. €30.
- Online.nl Internet Only: 9 maanden korting t.w.v. €180, €110 cashback en geen aansluitkosten t.w.v. €30.
- Tekst-only providerpagina zonder zelfgemaakt of onbevestigd providerlogo.
- Twee neutrale MeerPakkers-productvisuals zonder logo.
- Provider toegevoegd aan `data/providers.json` en affiliate-status toegevoegd.
- Sitemap uitgebreid met `/providers/online-nl.html`.

## Affiliatekoppeling

De productfeed bevat actuele productlinks, maar deze update zet geen willekeurig statisch pakket vast. De CTA's lopen via:

- `/api/online-redirect?deal=internet-tv`
- `/api/online-redirect?deal=internet-only`

De Vercel-functie haalt server-side de actuele Daisycon-feed op voor campagne `14155`, selecteert een passende trackinglink met MeerPakkers media-ID `422185` en voegt een eigen `ws`-sub-ID toe. De feed wordt 15 minuten gecachet. Alleen wanneer de feed niet bereikbaar is of geen passende affiliate-URL bevat, wordt doorgestuurd naar de officiële Online.nl-actiepagina zonder affiliatetracking, zodat de publieke CTA niet doodloopt.

## Actievoorwaarden

- Cashback alleen bij internet via het KPN-netwerk.
- Uitbetaling na twee succesvolle afschrijvingen.
- Actievoorwaarden geldig t/m 31 augustus 2026.
- Pakket, techniek, snelheid en prijs zijn adresafhankelijk.

## Bron

- Daisycon-feed: `https://daisycon.io/datafeed/?media_id=422185&standard_id=22&language_code=nl&locale_id=1&type=JSON&program_id=14155&html_transform=none&rawdata=false&encoding=utf8&general=false`
- Officiële Online.nl Dikke Deal-pagina's en voorwaarden, gecontroleerd op 21 juli 2026.
