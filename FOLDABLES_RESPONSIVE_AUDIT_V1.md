# MeerPakkers Foldables Responsive Audit v1

Gebouwd vanaf: `Meerpakkers_Uitleg_Content_Fill_v1.zip`

## Doel
Veilige foldable/small-tablet audit en CSS-hardening voor schermbreedtes tussen gewone mobiel en tablet/desktop.

Geteste doelbreedtes voor de audit-richting:
- 320px kleine mobiel
- 360px standaard mobiel
- 390px Pixel/iPhone-achtig
- 430px grote mobiel
- 540px foldable/small tablet
- 600px foldable open
- 720px foldable open
- 768px tablet/foldable overgang
- 820px small tablet
- 1024px tablet/kleine desktop

## Belangrijkste risico gevonden
De bestaande responsive contracten hadden een gevoelige overgang rond `761px - 768px`:

- mobile topbar-lagen werken voornamelijk tot `760px`
- desktop header startte vanaf `769px`
- home had wel mobile styling tot `768px`
- sommige subpagina's konden rond exact deze overgang onvoorspelbaar renderen

## Uitgevoerde veilige fix
Toegevoegd:

- `css/foldables-responsive-v1.css`

Deze CSS-laag doet alleen foldable/small-tablet hardening:

- voorkomt horizontale overflow tussen 521px en 900px
- geeft de desktop-header een compacte gestapelde layout tussen 761px en 900px
- dicht de 761px-768px header-overgang
- maakt categorie/deal/provider/uitleg layouts voorspelbaar 1 of 2 kolommen
- houdt topbar, footer, mobile, dealcards en affiliate/admin logica inhoudelijk onaangeraakt

## Niet aangepast
- Geen topbar lock CSS gewijzigd
- Geen footer rebuild CSS gewijzigd
- Geen bestaande dealcard componenten herschreven
- Geen JS-logica gewijzigd
- Geen affiliate/admin/data gewijzigd
- Geen sitemap/robots gewijzigd
- Geen persoonlijke naam of bedrijfsnaam toegevoegd

## Checks
- 0 ontbrekende lokale CSS/JS/assets-links
- 0 JS-syntaxfouten
- 0 JSON-fouten
- 0 CSS brace-fouten
- 0 persoonlijke naam / Steef / Totaalbouw verwijzingen

## Handmatige testadvies na upload
Controleer live met Chrome DevTools device toolbar of op echte apparaten:

1. Home
2. Mobiel
3. Sim Only
4. Internet & TV
5. Streaming
6. Providers
7. Kies je Meepakker
8. Opgeslagen deals
9. MeerPakkers Uitleg
10. Een statische dealpagina

Let vooral op breedtes 600, 720, 768 en 820px.
