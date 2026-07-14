# Vodafone safe cleanup v18

Gebouwd vanaf: Meerpakkers_Public_Copy_AI_Scope_v16_GitHub.zip

Waarom:
De vorige v17 cleanup was te agressief en kon homepage-layout/wrappers raken.

Wijziging:
- Vodafone-deals in data/deals.json verborgen/verlopen gemaakt.
- Vodafone deal/providerpagina's op noindex + redirect naar /mobiel/.
- Vodafone-URL's uit sitemap.xml verwijderd.
- Geen brede HTML-verwijdering meer op index.html of algemene pagina's.

Doel:
Layout herstellen en tegelijk verlopen Vodafone-acties niet actief tonen.
