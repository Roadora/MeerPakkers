# Foldables Saved Deals Header Fix v9

Gebouwd vanaf: `Meerpakkers_Desktop_Meepakker_Result_Width_v8.zip`

## Doel
Fix voor `/opgeslagen/` op iPad mini/foldable breedtes rond 761–900px.

## Probleem
Opgeslagen deals viel in deze breedte terug naar een half-desktop/half-mobile header:
- desktopnav bovenin zichtbaar;
- mobiele headertekst daaronder zichtbaar;
- logo/nav/search lagen door elkaar.

## Aanpassing
Alleen `css/foldables-responsive-v1.css` aangepast.

Voor `body.mp-saved-page` tussen 761px en 900px:
- desktopheader verborgen;
- mobile/tablet topbar expliciet zichtbaar en gestyled;
- opgeslagen shell max-width 760px;
- intro/samenvatting/cards binnen veilige contentbreedte.

## Niet aangepast
- telefoonlayout onder 761px;
- desktop boven 900px;
- topbar lock CSS;
- footer;
- JS;
- dealcards;
- affiliate/admin/data;
- sitemap/robots.
