/* Page bodies: home, category, product, checkout, policies, contact, 404. */
import { art } from './art.mjs';
import { esc, money, svgIc, IC } from './layout.mjs';

export const FAQS = [
  ['Do you deliver outside Lagos?',
   'Yes, we deliver anywhere in Nigeria, and delivery is free on every order. We confirm the address on the phone before the order leaves us.'],
  ['How do I pay?',
   'By bank transfer or Paystack. Send the order and we confirm the price and the delivery window with you, then we send the account details or a Paystack link. Nothing is charged on this site.'],
  ['Are the devices original and sealed?',
   'Yes. Every device we sell is genuine and sealed, with the accessories in the box.'],
  ['Is there a warranty?',
   'Yes. Every device carries a warranty. If anything goes wrong within the warranty period, contact us and we will sort it out.'],
  ['Can I pick a colour and storage?',
   'Yes. Choose the colour, storage and SIM type on the product page. We confirm exactly what is in stock when we call you.'],
  ['Do you sell both eSIM and physical SIM iPhones?',
   'Yes, both. Some models are eSIM only and some take a physical SIM as well. Each product page says which is which.']
];

export const crumb = (store, trail) =>
  '<nav class="crumb wrap" aria-label="Breadcrumb">' +
  '<a href="/">Home</a>' +
  trail.map((t) => svgIc(IC.chevron) + (t[1] ? '<a href="' + t[1] + '">' + esc(t[0]) + '</a>' : '<span>' + esc(t[0]) + '</span>')).join('') +
  '</nav>';

const priceHtml = (store, price) => {
  const p = money(store, price);
  return p
    ? '<span class="price money">' + esc(p) + '</span>'
    : '<span class="price-ask">Ask for price</span>';
};

/* Real photography, when a product has it.

   item.photos maps a colour name to its own picture, so every colour in a gallery
   is a photo of that colour. item.photo is the older single-image field and still
   covers the first slot. A product with neither keeps its illustration, which is
   why a half-photographed catalogue still renders one consistent gallery each.
   Paths point into assets/products/, which build.mjs copies to /products/. */
const photoFor = (item, colorName, i) =>
  (item.photos && colorName && item.photos[colorName]) ||
  (i === 0 ? item.photo : null) ||
  null;

const shotImg = (item, colorName, i, alt, lazy) =>
  '<img src="' + esc(photoFor(item, colorName, i)) + '" alt="' + esc(alt) + '"' +
  (lazy ? ' loading="lazy"' : '') + '>';

export const productCard = (store, cat, item, uidSuffix) => {
  const colors = item.colors || [];
  const dots = colors.slice(0, 4)
    .map((c) => '<span class="dot" style="background:' + esc(c.hex) + '" title="' + esc(c.name) + '"></span>')
    .join('');
  const more = colors.length > 4 ? '<span class="dot-more">+' + (colors.length - 4) + '</span>' : '';
  return '<a class="pcard reveal" href="/' + cat.id + '/' + item.slug + '/">' +
    '<div class="pcard-art">' +
      (item.note ? '<span class="badge badge-warn pcard-tag">Confirm stock</span>' : '') +
      (photoFor(item, colors.length ? colors[0].name : null, 0)
        ? shotImg(item, colors.length ? colors[0].name : null, 0, item.name, true)
        : art(item.art, colors.length ? colors[0].hex : null, item.slug + (uidSuffix || ''))) +
    '</div>' +
    '<div class="pcard-body">' +
      '<div class="pcard-name">' + esc(item.name) + '</div>' +
      '<div class="pcard-blurb">' + esc(item.blurb) + '</div>' +
      '<div class="pcard-foot">' + priceHtml(store, item.price) +
        (dots ? '<span class="dots">' + dots + more + '</span>' : '') +
      '</div>' +
    '</div>' +
  '</a>';
};

export const faqBlock = () =>
  '<div class="faq">' + FAQS.map((f) =>
    '<details><summary>' + esc(f[0]) + '</summary><div class="a">' + esc(f[1]) + '</div></details>'
  ).join('') + '</div>';

const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f[0],
    acceptedAnswer: { '@type': 'Answer', text: f[1] }
  }))
});

const trustStrip = (store) =>
  '<section class="trust"><div class="wrap">' +
  [
    [IC.wallet, 'Pay by transfer or Paystack', 'We confirm your order first, then send the account details or a Paystack link.'],
    [IC.truck, 'Free nationwide delivery', store.delivery],
    [IC.shield, 'Genuine and sealed', 'Original devices, sealed, with the box accessories.'],
    [IC.phone, 'Confirmed by phone', 'We call to confirm every order before it ships.']
  ].map((t) =>
    '<div class="it"><span class="ic">' + svgIc(t[0]) + '</span>' +
    '<span><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></span></div>'
  ).join('') +
  '</div></section>';

export const homePage = (store, ctx) => {
  const heroArt = ['phone', 'tablet', 'laptop', 'console'];
  const featured = [];
  ctx.cats.forEach((c) => {
    ctx.byCat[c.id].slice(0, 2).forEach((it) => featured.push({ cat: c, item: it }));
  });

  const body = '' +
    '<section class="hero"><div class="wrap">' +
      '<div>' +
        '<h1>' + esc(store.brand) + ', <em>delivered nationwide</em></h1>' +
        '<p class="lede">' + esc(store.tagline) + '. iPhone 18 Pro and 17, iPad, MacBook, Apple Watch, PlayStation 5, AirPods and JBL. Pick your colour, place the order, and we confirm it on the phone before it ships.</p>' +
        '<div class="cta">' +
          '<a class="btn btn-primary" href="/shop/">Browse the store' + svgIc(IC.arrow, 'ic') + '</a>' +
          '<a class="btn btn-ghost" href="https://wa.me/' + esc(store.whatsapp) + '">' + svgIc(IC.whatsapp, 'ic') + 'Chat on WhatsApp</a>' +
        '</div>' +
        '<div class="chips">' +
          '<span>' + svgIc(IC.check) + ' Pay by transfer or Paystack</span>' +
          '<span>' + svgIc(IC.check) + ' Free delivery</span>' +
          '<span>' + svgIc(IC.check) + ' ' + esc(store.delivery) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="heroart">' +
        heroArt.map((t) => '<div class="tile">' + art(t, null, 'hero-' + t) + '</div>').join('') +
      '</div>' +
    '</div></section>' +
    trustStrip(store) +
    '<section class="sect"><div class="wrap">' +
      '<div class="shead"><div><h2>Shop by category</h2><p>Everything we stock, in one place.</p></div>' +
      '<a class="link" href="/shop/">All devices' + svgIc(IC.arrow) + '</a></div>' +
      '<div class="grid">' + ctx.cats.map((c) =>
        '<a class="pcard reveal" href="/' + c.id + '/">' +
          '<div class="pcard-art">' + art(c.art, null, 'cat-' + c.id) + '</div>' +
          '<div class="pcard-body">' +
            '<div class="pcard-name">' + esc(c.name) + '</div>' +
            '<div class="pcard-blurb">' + esc(c.blurb) + '</div>' +
            '<div class="pcard-foot"><span class="badge">' + ctx.byCat[c.id].length + ' devices</span>' +
              '<span class="link-plain">View</span></div>' +
          '</div>' +
        '</a>').join('') +
      '</div>' +
    '</div></section>' +
    '<section class="sect sect-flush"><div class="wrap">' +
      '<div class="shead"><div><h2>Popular right now</h2><p>The devices people ask for most.</p></div></div>' +
      '<div class="grid">' + featured.map((f) => productCard(store, f.cat, f.item, '-home')).join('') + '</div>' +
    '</div></section>' +
    '<section class="sect sect-flush"><div class="wrap">' +
      '<div class="shead"><div><h2>Questions people ask</h2><p>If yours is not here, message us on WhatsApp.</p></div></div>' +
      faqBlock() +
    '</div></section>';

  return {
    title: store.brand + ' | ' + store.tagline,
    desc: 'Buy iPhone 18 Pro, iPhone 17, iPad, MacBook, Apple Watch, PlayStation 5, AirPods and JBL in Nigeria. Free nationwide shipping, pay by bank transfer or Paystack, every order confirmed by phone.',
    path: '/',
    active: 'home',
    body: body,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: store.brand,
        description: store.tagline,
        url: store.siteUrl || undefined,
        telephone: '+' + store.whatsapp,
        areaServed: 'Nigeria',
        ...(store.address ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: store.address,
            addressLocality: 'Ikeja',
            addressRegion: 'Lagos',
            addressCountry: 'NG'
          }
        } : {})
      },
      faqJsonLd()
    ]
  };
};

export const categoryPage = (store, ctx, cat) => {
  const items = ctx.byCat[cat.id];
  const body = crumb(store, [[cat.name]]) +
    '<div class="wrap">' +
      '<div class="chead">' +
        '<div><h1>' + esc(cat.name) + '</h1><p>' + esc(cat.blurb) + '</p></div>' +
        '<span class="n">' + items.length + ' device' + (items.length === 1 ? '' : 's') + '</span>' +
      '</div>' +
    '</div>' +
    '<section class="sect-tight"><div class="wrap">' +
      '<div class="grid">' + items.map((it) => productCard(store, cat, it, '-cat')).join('') + '</div>' +
    '</div></section>' +
    '<section class="sect sect-flush"><div class="wrap">' +
      '<div class="shead"><div><h2>Before you order</h2></div></div>' + faqBlock() +
    '</div></section>';

  return {
    title: cat.name + ' | ' + store.brand,
    desc: cat.blurb + ' Free nationwide shipping from ' + store.brand + '. Pay by bank transfer or Paystack.',
    path: '/' + cat.id + '/',
    active: cat.id,
    body: body,
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: cat.name,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: (store.siteUrl || '') + '/' + cat.id + '/' + it.slug + '/'
      }))
    }]
  };
};

export const productPage = (store, ctx, cat, item) => {
  const colors = item.colors || [];
  const options = item.options || [];
  const shots = (colors.length ? colors.map((c) => c) : [{ name: '', hex: null }])
    .map((c, i) =>
      '<span class="shot' + (i === 0 ? ' on' : '') + '" data-color="' + esc(c.name) + '">' +
      (photoFor(item, c.name, i)
        ? shotImg(item, c.name, i, item.name + (c.name ? ', ' + c.name : ''), false)
        : art(item.art, c.hex, item.slug + '-s' + i)) + '</span>').join('');

  const thumbs = colors.length > 1
    ? '<div class="thumbs">' + colors.map((c, i) =>
        '<button type="button" data-color="' + esc(c.name) + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(c.name) + '">' +
        (photoFor(item, c.name, i)
          ? shotImg(item, c.name, i, c.name, true)
          : art(item.art, c.hex, item.slug + '-t' + i)) + '</button>').join('') + '</div>'
    : '';

  const swatches = colors.length
    ? '<div class="opt"><div class="lb"><b>Colour</b><span>' + esc(colors[0].name) + '</span></div>' +
      '<div class="swatches">' + colors.map((c, i) =>
        '<button class="sw" type="button" data-color="' + esc(c.name) + '" data-hex="' + esc(c.hex) + '"' +
        ' style="background:' + esc(c.hex) + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(c.name) + '"' +
        ' title="' + esc(c.name) + '"></button>').join('') + '</div></div>'
    : '';

  const optionBlocks = options.map((o) =>
    '<div class="opt" data-opt="' + esc(o.name) + '">' +
      '<div class="lb"><b>' + esc(o.name) + '</b></div>' +
      '<div class="opts">' + o.values.map((v, i) =>
        '<button class="chip" type="button" data-val="' + esc(v) + '" aria-pressed="' + (i === 0) + '">' + esc(v) + '</button>'
      ).join('') + '</div>' +
    '</div>').join('');

  const specRows = [['Model', item.name], ['Category', cat.name]]
    .concat(options.map((o) => [o.name, o.values.join(', ')]))
    .concat(colors.length ? [['Colours', colors.map((c) => c.name).join(', ')]] : [])
    .concat([
      ['Warranty', 'Covered'],
      ['Delivery', store.delivery],
      ['Payment', store.payment]
    ]);

  const body = crumb(store, [[cat.name, '/' + cat.id + '/'], [item.name]]) +
    '<div class="wrap">' +
      '<div class="pdp" id="pdp" data-slug="' + esc(item.slug) + '" data-name="' + esc(item.name) + '"' +
        ' data-art="' + esc(item.art) + '" data-price="' + (item.price == null ? '' : esc(item.price)) + '"' +
        ' data-url="/' + cat.id + '/' + item.slug + '/">' +
        '<div class="gal">' +
          '<div class="main">' +
            (item.note ? '<span class="badge badge-warn flag">Confirm stock</span>' : '') +
            shots +
          '</div>' +
          thumbs +
        '</div>' +
        '<div class="buy">' +
          '<h1>' + esc(item.name) + '</h1>' +
          '<p class="sub">' + esc(item.blurb) + '</p>' +
          '<div class="pricerow">' +
            (money(store, item.price)
              ? '<span class="bigprice money">' + esc(money(store, item.price)) + '</span>'
              : '<span class="askprice">Ask for price</span>') +
          '</div>' +
          '<p class="payline">' + esc(store.payment) + '. We call to confirm before it ships.</p>' +
          swatches +
          optionBlocks +
          '<div class="qtyw">' +
            '<span class="qty">' +
              '<button type="button" data-q-dec aria-label="One fewer">-</button>' +
              '<span id="qtyOut">1</span>' +
              '<button type="button" data-q-inc aria-label="One more">+</button>' +
            '</span>' +
            '<span class="qty-lbl">Quantity</span>' +
          '</div>' +
          '<div class="sel-line">Selected: <b id="variantOut">Standard</b></div>' +
          '<button class="btn btn-primary btn-block" id="addBtn" type="button">' + svgIc(IC.cart, 'ic') + 'Add to cart</button>' +
          '<div class="buybox">' +
            '<div class="row"><span class="k">' + svgIc(IC.check) + ' Bank transfer or Paystack</span><span class="v">Nationwide</span></div>' +
            '<div class="row"><span class="k">' + svgIc(IC.check) + ' Delivery</span><span class="v">' + esc(store.delivery) + '</span></div>' +
            '<div class="row"><span class="k">' + svgIc(IC.check) + ' Warranty</span><span class="v">Covered</span></div>' +
            '<div class="row"><span class="k">' + svgIc(IC.refresh) + ' Returns</span><span class="v">Within 7 days</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<section class="sect sect-flush"><div class="wrap">' +
      '<div class="shead"><div><h2>Details</h2></div></div>' +
      '<div class="specwrap"><table class="specs"><tbody>' +
      specRows.map((r) => '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>').join('') +
      '</tbody></table></div>' +
    '</div></section>' +
    '<section class="sect sect-flush"><div class="wrap">' +
      '<div class="shead"><div><h2>Questions people ask</h2></div></div>' + faqBlock() +
    '</div></section>';

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.blurb,
    category: cat.name,
    brand: { '@type': 'Brand', name: store.brand }
  };
  if (item.price != null) {
    jsonld.offers = {
      '@type': 'Offer',
      priceCurrency: store.currency,
      price: item.price,
      availability: 'https://schema.org/InStock',
      url: (store.siteUrl || '') + '/' + cat.id + '/' + item.slug + '/'
    };
  }

  return {
    title: item.name + ' | ' + store.brand,
    desc: item.blurb + ' ' + store.payment + ', free delivery, ' + store.delivery + '.',
    path: '/' + cat.id + '/' + item.slug + '/',
    active: cat.id,
    body: body,
    jsonld: [jsonld]
  };
};
