# Technische Fix Topbar Consistency v1

Doel: desktop topbar consistent maken op Opgeslagen deals en MeerPakkers Uitleg zonder topbar/footer/mobile/dealcards te restylen.

Wijzigingen:
- De desktop-nav link `MeerPakkers Uitleg` is uit de hoofd-topbar verwijderd waar deze direct na `Kies je Meepakker` stond. De footer-link naar MeerPakkers Uitleg blijft bestaan.
- `/uitleg/` en `/uitleg/abonnement-met-cadeau/` laden nu dezelfde saved-deals header CSS/JS als de rest van de site, zodat de desktop action rechts consistent wordt opgebouwd.
- Geen wijzigingen aan header.css, topbar-final-lock-v17.css, footer.css, dealcard CSS/JS of mobile layout.

Aantal aangepaste HTML-bestanden voor desktop-nav cleanup: 65

Aangepaste uitlegpagina's:
- uitleg/index.html
- uitleg/abonnement-met-cadeau/index.html
