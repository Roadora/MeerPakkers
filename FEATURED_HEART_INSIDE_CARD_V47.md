# MeerPakkers v47 – Featured Heart Inside Card

Gebouwd vanaf: `Meerpakkers_Topbar_DesktopVisible_Heart_Remove_v46.zip`

## Echte oorzaak
Het hartje dat rechtsboven in landscape zichtbaar bleef, bleek het save-hartje van de featured Netflix-card:
- `js/home-render.js`
- `.mp-featured-heart.meepakker-save-heart`
- `data-save-deal-id="netflix-actie"`

Het hartje hoort te blijven bestaan, maar moet binnen de Netflix-card blijven en niet visueel in de topbar lekken.

## Fix
- Featured-card hearts blijven overal bestaan.
- Netflix/Vodafone/Youfone/KPN hearts blijven opslaan.
- `.mp-featured-heart` wordt op alle viewports vastgezet binnen `.mp-featured-highlight-card`.
- Extra landscape/foldable fallback toegevoegd omdat `foldables-responsive-v1.css` als laatste wordt geladen.

## Niet aangepast
- Geen deal data.
- Geen saved-store.
- Geen Opgeslagen teller.
- Geen footer.
- Geen providers.
- Geen affiliate/admin.
