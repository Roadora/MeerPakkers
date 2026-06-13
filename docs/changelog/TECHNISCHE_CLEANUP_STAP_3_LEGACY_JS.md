# MeerPakkers technische cleanup stap 3 — Legacy JS cleanup

Basis: `Meerpakkers_Provider_Uitleg_Component_Sync_v1.zip`

## Doel
Veilige technische schoonmaak zonder designwijzigingen.

## Niet aangeraakt
- Topbar bestanden en styling
- Footer Clean Rebuild
- Mobiele layout en mobiele breakpoints
- Dealcards en provider/categorie componenten
- HTML-structuur van pagina's
- Data/deals JSON-inhoud

## Uitgevoerd
Na dependency-check zijn oude losse JavaScript-bestanden uit `js/` verwijderd uit de actieve package zodat ze niet meer als bron van toekomstige conflicten kunnen dienen.

Verwijderd:
- `js/data.js`
- `js/deals.js`
- `js/filters.js`
- `js/home-cta-order-fix-v24.js`
- `js/home-load-more-v20.js`
- `js/home-search-filter-v26.js`
- `js/meepakker-search-v1.js`
- `js/providers.js`
- `js/router.js`
- `js/storage.js`

## Waarom veilig
Deze bestanden werden niet direct via HTML `<script src>` geladen en kwamen niet voor als actieve module-import. De huidige actieve flow gebruikt o.a.:
- `home-controller-v31.js` + home modules
- `category-page.js` + `category-*` modules
- `mobile-category-v1.js`
- `provider-page.js`
- `deal-card.js`
- saved-deals modules
- cookie/banner/topbar scripts

## Rollback
Rollback blijft mogelijk via de vorige fallback zip: `Meerpakkers_Provider_Uitleg_Component_Sync_v1.zip`.

## Resultaat
Minder legacy-JS in de actieve map, minder kans op dubbele window-globals/conflicten, zonder zichtbare designwijziging.

## Controle na cleanup
- JS syntaxfouten: 0
- JSON-fouten: 0
- CSS brace-fouten: 0
- Ontbrekende lokale CSS/JS/assets-links: 0
- Actieve HTML-script/module-import referenties naar verwijderde legacy JS-bestanden: 0
