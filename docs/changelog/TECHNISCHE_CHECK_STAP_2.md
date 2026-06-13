# MeerPakkers – Technische check stap 2

Basisbestand: `Meerpakkers_Cleanup_Stap_1_Audit_Affiliate_Structuur.zip`

## Doel
Extra controle na cleanup stap 1, zonder designwijzigingen en zonder topbar/footer/mobile aan te raken.

## Uitgevoerde checks

### 1. HTML dependency-check
- Aantal HTML-bestanden gecontroleerd: 66
- CSS/JS/assets vanuit HTML gecontroleerd, inclusief absolute `/css/...`, `/js/...` en `/assets/...` paden.
- Resultaat: **0 ontbrekende links**.

### 2. CSS-check
- Alle CSS-bestanden gecontroleerd op brace-balans.
- Resultaat: **geen CSS brace-fouten**.
- Actief gelinkte CSS-bestanden: 32.

### 3. JS-check
- Alle actieve en aanwezige JS-bestanden gecontroleerd met `node --check`.
- Resultaat: **geen JS syntaxfouten**.
- Actieve JS is ook transitive gecontroleerd via ES module imports.

### 4. JSON-check
- Alle JSON-bestanden gecontroleerd op geldige JSON.
- Resultaat: **alle JSON-bestanden geldig**.

### 5. Sitemap-check
- Sitemap URLs gecontroleerd tegen lokale bestanden.
- Resultaat: **0 ontbrekende sitemap-pagina’s**.

### 6. Debug/merge-conflict check
- Geen `console.log`, `debugger`, `TODO`, `FIXME`, `<<<<<<<` of `>>>>>>>` gevonden in actieve bronbestanden.
- Alleen de audit-notitie noemt `_archive_unused` als historisch verwijderde map.

## Belangrijke conclusie
De site is na cleanup stap 1 technisch stabiel genoeg om door te gaan met gerichte cleanup. Topbar, footer en mobiele basis hoeven niet opengebroken te worden.

## Nog aanwezige losse bestanden die mogelijk legacy zijn

Deze bestanden zijn niet direct via HTML gelinkt. Een deel is waarschijnlijk oude rommel, maar nog niet automatisch verwijderd in deze check.

### CSS mogelijk legacy / ongebruikt
- `css/affiliate.css`
- `css/cards-compact-v2.css`
- `css/cards.css`
- `css/categories.css`
- `css/desktop-header.css`
- `css/discovery-shared.css`
- `css/hero.css`
- `css/mobile-app-home-v3.css`
- `css/mobile-home-v2.css`
- `css/mobile-topbar-final-lock-v11.css`
- `css/mobile.css`
- `css/newsletter.css`
- `css/providers.css`
- `css/saved-deals-v43.css`
- `css/saved-deals-v44.css`
- `css/style.css`

### JS waarschijnlijk legacy / ongebruikt
Deze zijn niet via HTML of actieve ES-module imports nodig:
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

## Niet verwijderen in stap 2 zonder extra controle
Deze JS-bestanden leken eerst ongebruikt, maar zijn via ES-module imports actief nodig op categoriepagina’s:
- `js/category-data.js`
- `js/category-events.js`
- `js/category-filters.js`
- `js/category-render.js`
- `js/category-state.js`

## Advies voor volgende veilige cleanup stap
Stap 3 kan veilig beginnen met het verplaatsen of verwijderen van alleen de **waarschijnlijk legacy JS-bestanden** die geen actieve HTML-link en geen actieve import hebben. Daarna opnieuw testen en zippen.

Voor CSS is extra voorzichtigheid nodig, omdat sommige oude CSS-bestanden alsnog via overlappende classnamen belangrijk kunnen lijken tijdens ontwerpvergelijking. Advies: CSS pas na JS-legacy cleanup aanpakken, en dan per bestand controleren op unieke selectors.
