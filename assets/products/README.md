# Product photos

Real photography for the store lives here. Anything in this folder is copied
into `dist/products/` by `build.mjs`, so a file at `assets/products/foo.png` is
served as `/products/foo.png`.

The illustrations in `lib/art*.mjs` are still the fallback. A product with no
photo keeps its illustration, so the catalogue can be half photographed without
any page looking broken.

## How to use a photo

Set a `photos` map on the item in the matching `catalog/<category>.json`, keyed
by the colour name exactly as it appears in that item's `colors` array:

```json
"photos": {
  "Lavender": "/products/iphone-17-lavender.png",
  "Sage": "/products/iphone-17-sage.png"
}
```

Every colour with an entry gets its own picture in the gallery, the thumbnail
strip and the grid card. Colours with no entry fall back to the illustration.
The older single `photo` field still works and fills the first gallery slot.

## What belongs here

A photo may only be used when it is certainly the exact model being sold.
A press shot of a newer generation than the one in the catalogue advertises a
device the shop does not sell, which is worse than an illustration.

Two things to check before adding one:

1. **Same generation.** Apple replaces product photography each cycle. Current
   MacBook shots are the 2026 machines, so they cannot stand in for an M4.
2. **Same colour.** These are colour-specific shots. If the finish is not in the
   catalogue's `colors` array, the photo does not belong on that product.

## Sources

Apple retail product shots follow this pattern, where the slug ends in the year
and month of that generation:

```
https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/<slug>_GEO_US?wid=940&hei=1112&fmt=png-alpha
```

`<slug>` is `<product>-finish-select-<colour>-<YYYYMM>` for the product on a
transparent background. Drop `-select-` and you get the small colour swatch
instead of the device. The shop's gallery is portrait, so `wid=940&hei=1112`
matches it; `fmt=png-alpha` is what keeps the background transparent.

PlayStation imagery is on `gmedia.playstation.com` and is not transparent, so it
does not drop into this gallery cleanly.

## Rights

These are manufacturer product images, used to sell that manufacturer's
products. Replace them with photographs of actual stock when those are
available. Own photos are both safer and more convincing to a buyer.
