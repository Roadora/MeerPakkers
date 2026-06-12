# Foldables Tablet Header Fix v2

Gebouwd vanaf Foldables Category Header Fix v1.

Probleem: op iPad mini/foldable breedtes rond 769-900px vielen Providers/Kies je Meepakker terug naar een half desktop/half mobile header: losse navtekst, zoekveld en logo overlapten. Categoriepagina’s konden rond dezelfde zone ook ongestyled ogen.

Fix:
- Category mobile runtime uitgebreid van max-width 768px naar max-width 900px.
- Desktop category JS guard gelijkgetrokken naar max-width 900px.
- In css/foldables-responsive-v1.css een gerichte tablet-headerlaag toegevoegd voor 761-900px.
- Desktop header verborgen op categoriepagina’s, Providers en Kies je Meepakker in deze band.
- Mobile/tablet topbar, intro, zoekbalk/category pills en grids expliciet gestyled.

Niet aangepast: footer, desktop boven 900px, telefoon onder 760px, dealdata, affiliate/admin, sitemap/robots.
