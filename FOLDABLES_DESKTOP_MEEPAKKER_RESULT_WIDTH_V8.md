# MeerPakkers Foldables/Desktop Meepakker Result Width v8

Gebouwd vanaf: `Meerpakkers_Foldables_Category_Width_Polish_v7.zip`

## Aanleiding
Op desktop/grote iPad werden Meepakker-resultaatpagina's zoals Cashback/AirPods als één brede kolom getoond. Daardoor werden dealcards erg lang en over de volle contentbreedte uitgerekt.

## Aanpassing
- Alleen `css/meepakker.css` aangepast.
- Alleen voor `body[data-meepakker-result="true"]`.
- Alleen vanaf `901px` breedte.
- Meepakker-resultaatlijsten tonen nu in 2 kolommen.

## Niet aangepast
- Mobile onder 901px.
- Foldable/tablet fixes in `foldables-responsive-v1.css`.
- Topbar/footer/dealcards inhoud.
- JS.
- Affiliate/admin/data.
- Sitemap/robots.
