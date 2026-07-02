# Budget Thuis card image native ratio fix v17

Scope: only the three current Budget Thuis Internet & TV product-feed deals.

The card image asset is an official 300×250 campaign creative (6:5). In v16, the
card data still referenced the generic `square-large` treatment, so the shared
square card CSS continued to crop the image. The three Budget Thuis deals now
use the existing `budget-square` variant, which already renders the asset at its
native 6:5 ratio with `object-fit: contain`. No image file was altered or added.

Unchanged: deal data/copy, affiliate deeplinks, CTA labels, headers, footer,
shared card markup, mobile structure, and all non-Budget deals.
