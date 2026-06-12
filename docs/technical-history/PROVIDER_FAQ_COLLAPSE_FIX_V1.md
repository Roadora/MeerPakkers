# Provider FAQ Collapse Fix v1

Doel: op provider-detailpagina's het MeerPakkers Uitleg / FAQ-blok standaard ingeklapt tonen.

Aangepast:
- Alle `providers/*.html` pagina's: `article.provider-faq-block` omgezet naar `details.provider-faq-block` zonder `open` attribuut.
- `css/provider-pages.css`: kleine, provider-specifieke styling toegevoegd voor de inklapbare hoofdtitel.

Niet aangepast:
- Topbar
- Footer Clean Rebuild
- Mobiele topbar componenten
- Dealcard component
- Data/deals/affiliate structuur
- Actieve JavaScript logica

Controle:
- FAQ content blijft aanwezig voor gebruiker en SEO-structured-data blijft in de head staan.
- De onderliggende vragen blijven hun bestaande `<details>` structuur houden.
