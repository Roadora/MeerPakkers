# MeerPakkers Foldables Category Header Fix v1

Gebouwd vanaf: Meerpakkers_Foldables_Responsive_Audit_v1.zip

## Probleem
Op iPad mini / 768px breedte renderde de mobiele categoriepagina wel via `mobile-category-v1.js`, maar de gedeelde mobile topbar/framework CSS stopte op 760px. Daardoor werden de header, zoekbalk en categorieknoppen rond 761-768px deels ongestyled getoond.

## Fix
In `css/foldables-responsive-v1.css` is een gerichte band toegevoegd voor `761px–768px`:
- mobile category shell blijft zichtbaar en gecentreerd;
- mobile topbar wordt opnieuw als grid gerenderd;
- logo-lockup gebruikt opnieuw het juiste MP+ beeld;
- hartje/teller en terugknop krijgen dezelfde mobiele styling;
- zoekbalk, intro en categoriepills krijgen de mobiele framework-styling terug.

## Niet aangepast
- Geen topbar lock CSS gewijzigd.
- Geen footer rebuild gewijzigd.
- Geen desktop layout aangepast.
- Geen normale telefoonlayout onder 760px aangepast.
- Geen JS, dealdata, affiliate/admin of sitemap gewijzigd.
