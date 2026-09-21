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

## What is here

Photos that are wired into the catalogue:

| Product | Colours wired |
|---|---|
| iPhone 18 Pro | Burgundy, Glacier, Silver, Black |
| iPhone 18 Pro Max | Burgundy, Glacier, Silver, Black |
| iPhone 17 | Lavender, Mist Blue, Sage, Black, White |
| iPhone 17 Air | Sky Blue, Light Gold, Cloud White, Space Black |
| iPhone 17 Pro | Cosmic Orange, Deep Blue, Silver |
| iPhone 17 Pro Max | Cosmic Orange, Deep Blue, Silver |
| iPad (10th generation) | Blue, Pink, Silver, Yellow |
| iPad (11th generation) | Blue, Pink, Silver, Yellow |
| iPad Air 11 inch | Space Grey, Blue, Purple, Starlight |
| iPad Air 13 inch | Space Grey, Blue, Purple, Starlight |
| MacBook Air 13 inch, M4 and M5 | Sky Blue, Silver, Starlight, Midnight |
| MacBook Air 15 inch, M4 and M5 | Sky Blue, Silver, Starlight, Midnight |
| MacBook Pro 14 inch, M4 Pro and M5 Pro | Space Black, Silver |
| MacBook Pro 16 inch, M4 Pro and M5 Pro | Space Black, Silver |
| Apple Watch SE | Midnight, Starlight |
| Apple Watch Series 11 | single `photo` |
| PlayStation 5 (Disc Edition) | single `photo` |

The iPhone 17, iPhone 18 Pro and iPad 10 and iPad Air shots were fetched by
`_fetch-photos.mjs` from Apple's own retail CDN. The MacBook, iPad 11, Apple
Watch and PlayStation 5 shots were supplied by Yoyo on 2026-09-21. The MacBook
photos are cut-outs and sit on the gallery gradient correctly; the others were
checked in the built page.

There is no plain **iPhone 18** and no **iPhone 18 Air**. Apple's 2026 line is
iPhone Duo, iPhone 18 Pro, iPhone 18 Pro Max, iPhone Air, iPhone 17, iPhone 17e
and iPhone 16; `buy-iphone/iphone-18` returns 404. Read the finish slugs off
Apple's own buy page rather than assuming which colours exist: a first pass
concluded the 18 Pro shipped in only black and silver, and burgundy and glacier
were sitting on the CDN the whole time.

Apple Watch Ultra 3, PlayStation 5 Digital and Pro, and everything in audio keep
their illustration, because there is no photo for them yet. A wrong device in the
gallery is worse than an illustration.

## Not wired yet

Family-level photos Yoyo supplied on 2026-09-21 that nothing points at yet. They
are here so a rebuild cannot lose them (`build.mjs` wipes `dist/`):

`watch-se-aluminium.jpg`, `watch-series-11-rosegold.jpg`,
`watch-series-11-display.jpg`, `ipad-11-home.webp`, `ps5-home.png`,
`ps5-digital-home.png`, `macbook-home.jpg`, `macbook-pro-home.jpg`,
`macbook-air-skyblue.jpg`, `macbook-air-silver.webp`, `macbook-air-starlight.jpg`,
`macbook-air-midnight.jpg`, `macbook-pro-silver.avif`,
`macbook-pro-spaceblack.webp`.

The `*-home` files are the per-family homepage shots. The rest duplicate a wired
colour at a different crop or file format.


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
