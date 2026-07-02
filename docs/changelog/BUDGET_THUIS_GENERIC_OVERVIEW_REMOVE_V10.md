# Budget Thuis generic overview removed v10

- Removed the generic `budget-thuis-internet-tv` deal from `data/deals.json`.
- Removed its generic Daisycon campaign URL (`li=1923068`) from `data/affiliate-links.json`.
- Kept only the three exact Internet & TV product-feed deals: 1 year discount, 2 year discount and welkomstcadeau.
- Each remaining deal retains its own approved Daisycon product deeplink with `pid` and `dl=internet`.
- Removed the old static overview page that could send visitors to Budget Thuis's general homepage.
- Existing saved copies of the retired overview card are ignored; current saved deals and their UI are unchanged.
