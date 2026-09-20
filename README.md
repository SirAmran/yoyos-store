# Yoyos Devices store

The storefront for Yoyos Devices. Pay on delivery, nationwide in Nigeria.

Live at **https://store.yoyosdevices.com.ng**

## How it works

A static site generator with no dependencies. `build.mjs` reads the JSON files
in `catalog/` and writes a complete site into `dist/`. Node is the only
requirement:

```
node build.mjs         # build into dist/
node _check-store.mjs  # verify the output, exits 1 on any failure
node _drive.mjs        # serve dist/, drive it in headless Edge, 70 checks
node admin.mjs         # local price admin on http://127.0.0.1:8796/
```

## Setting prices

Prices fluctuate, so they are not edited by hand. Double-click `admin.bat`,
change the numbers, and press Save. That writes back to `catalog/*.json`,
rebuilds, and runs the checker. Press Publish to commit and push, which
redeploys the live site.

A price left empty shows as "Ask for price" rather than a wrong number. The
business confirms every order by phone before it ships, so that is a normal
state and not a gap.

The admin binds to loopback only and rejects any request whose Host header is
not `127.0.0.1`, `localhost` or `[::1]`, so a page in a browser cannot reach it
by DNS rebinding. It is not exposed on the network.

## How orders work

There is no server. The checkout form collects the delivery details, builds the
whole order as text, and hands it to WhatsApp with everything pre-filled. The
same text is offered by email as a second route. Every order is confirmed by
phone before dispatch.

## Logo and link preview

The mark is generated, not drawn by hand. `node _make-logo.mjs` writes every
file from one source: `assets/logo.svg` for the header and the favicon, a square
`logo-1024.png` and `logo-512.png` for the Facebook and Instagram profile
pictures, `logo-180.png` for the iPhone home screen icon, and `og.png`, the
1200x630 card that shows when the store link is posted. The renders bake in the
Sora webfont, so they look right on a machine that has never seen it.

`build.mjs` copies `assets/logo.svg` to `dist/favicon.svg`, so the tab icon and
the header logo are always the same file. Re-run `_make-logo.mjs` after changing
the mark, then rebuild.

## Product photos

Real photography lives in `assets/products/` and is wired per colour, so each
colour in a gallery shows a picture of that colour. Products with no photo keep
their SVG illustration, which is why the catalogue can be part photographed
without any page looking broken. See `assets/products/README.md` for how to add
one and when a photo is safe to use.

## Layout

```
catalog/     the store: site settings and one JSON file per category
lib/         the generator: layout, pages, illustrations, cart and checkout
assets/      files copied verbatim into the build, including product photos
build.mjs    runs the whole build
admin.mjs    the local price admin
```

## Copy rules

No em dashes, en dashes or double hyphens in anything on the page. `_check-store.mjs`
fails the build if one appears in visible text, along with missing titles or
descriptions, unparseable JSON-LD, dead internal links and images without alt
text. A build that does not pass the checker does not ship.
