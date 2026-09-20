/* Document shell: head, top strip, header, cart drawer, footer. */
import { css } from './theme.mjs';
import { client } from './client.mjs';

export const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const money = (store, n) =>
  n == null ? null : store.symbol + Number(n).toLocaleString('en-NG');

export const tel = (wa) => {
  const s = String(wa || '');
  if (s.length === 13 && s.slice(0, 3) === '234') {
    return '+234 ' + s.slice(3, 6) + ' ' + s.slice(6, 9) + ' ' + s.slice(9);
  }
  return '+' + s;
};

export const IC = {
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2.4 12.2h12L21.5 7H6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  truck: '<path d="M2.5 6.5h11v10h-11z"/><path d="M13.5 10h4l3 3v3.5h-7z"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/>',
  shield: '<path d="M12 3l7 2.6v5.6c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V5.6z"/><path d="M9 12.2l2.1 2.1 4-4"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z"/><path d="M9 9.2c0 3 2.4 5.4 5.4 5.4.6 0 1.1-.5 1.1-1.1l-1.6-.8-.9.9a4.6 4.6 0 0 1-2-2l.9-.9-.8-1.6c-.6 0-1.1.5-1.1 1.1z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  pin: '<path d="M12 21s6.5-5.4 6.5-10a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21z"/><circle cx="12" cy="11" r="2.4"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.2"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.1"/>',
  box: '<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.2l8 4.2 8-4.2M12 11.4V21"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="M3.5 7.2l8.5 6 8.5-6"/>',
  spark: '<path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7z"/>'
};

export const svgIc = (d, cls) =>
  '<svg' + (cls ? ' class="' + cls + '"' : '') +
  ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"' +
  ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';

const safeJson = (obj) =>
  JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

const brandMark = (store) =>
  '<a class="brand" href="/">' +
  '<img class="mark" src="/logo.svg" alt="" width="30" height="30">' +
  '<span>' + esc(store.brand) + '<small>Official store</small></span>' +
  '</a>';

/* The top strip and the footer badges read from the admin, so a field Yoyo has
   cleared must drop out of the markup rather than leave a stranded word or a
   bare separator behind. */
const topStrip = (store) => {
  const pay = String(store.payment || '').trim();
  return '<div class="topbar"><div class="wrap">' +
  (pay ? '<span>' + svgIc(IC.wallet) + '<b>' + esc(pay) + '</b> nationwide</span>' : '') +
  '<span>' + svgIc(IC.clock) + esc(store.delivery) + '</span>' +
  '<span>' + svgIc(IC.phone) + '<b>' + esc(tel(store.whatsapp)) + '</b></span>' +
  '</div></div>';
};

const headerBar = (store, cats, active) => {
  const navLink = (id, name, href) =>
    '<a href="' + href + '"' + (active === id ? ' aria-current="page"' : '') + '>' + esc(name) + '</a>';
  const catLinks = cats.map((c) => navLink(c.id, c.name, '/' + c.id + '/')).join('');
  return '' +
    '<header class="hdr"><div class="wrap">' +
      brandMark(store) +
      '<nav class="nav" aria-label="Categories">' + catLinks +
        navLink('contact', 'Contact', '/contact/') + '</nav>' +
      '<div class="search">' +
        '<span class="mag">' + svgIc(IC.search) + '</span>' +
        '<input id="searchInput" type="search" placeholder="Search devices" aria-label="Search devices" autocomplete="off">' +
        '<div class="sres" id="searchResults" hidden></div>' +
      '</div>' +
      '<button class="menubtn" id="menuBtn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav">' + svgIc(IC.menu) + '</button>' +
      '<button class="cartbtn" type="button" data-open-cart aria-label="Open cart">' +
        '<span class="ic">' + svgIc(IC.cart) + '</span>' +
        '<span class="lbl">Cart</span>' +
        '<span class="n" data-cart-count hidden>0</span>' +
      '</button>' +
    '</div></header>' +
    '<div class="mnav" id="mobileNav"><div class="wrap">' +
      cats.map((c) => '<a href="/' + c.id + '/">' + esc(c.name) + '</a>').join('') +
      '<a href="/contact/">Contact</a><a href="/policies/delivery/">Delivery and returns</a>' +
    '</div></div>' +
    '<div class="catbar"><div class="wrap"><ul>' +
      '<li><a href="/shop/"' + (active === 'shop' ? ' aria-current="page"' : '') + '>All devices</a></li>' +
      cats.map((c) =>
        '<li><a href="/' + c.id + '/"' + (active === c.id ? ' aria-current="page"' : '') + '>' +
        svgIc(IC[c.art] || IC.box) + esc(c.name) + '</a></li>').join('') +
    '</ul></div></div>';
};

const cartDrawer = (store) =>
  '<div class="drawer" id="cartDrawer">' +
    '<div class="ov" data-close-cart></div>' +
    '<aside class="panel" role="dialog" aria-label="Your cart">' +
      '<div class="dhead"><h3>Your cart</h3>' +
        '<button class="dclose" type="button" data-close-cart aria-label="Close cart">' + svgIc(IC.close) + '</button>' +
      '</div>' +
      '<div class="dlines" id="cartLines"></div>' +
      '<div class="dfoot">' +
        '<div class="dtot"><span class="l">Subtotal</span><span class="v money" id="cartSubtotal">' + esc(store.symbol) + '0</span></div>' +
        '<p class="dnote" id="cartNote">Payment is by bank transfer. We confirm the total when we call you.</p>' +
        '<a class="btn btn-primary btn-block" id="cartCheckout" href="/checkout/" hidden>Checkout</a>' +
      '</div>' +
    '</aside>' +
  '</div>' +
  '<div class="toast" id="toast">' + svgIc(IC.check) + '<span id="toastMsg"></span></div>';

const footerBar = (store, cats) => {
  const year = new Date().getFullYear();
  return '' +
  '<footer class="ft"><div class="wrap">' +
    '<div class="ftop">' +
      '<div>' +
        brandMark(store) +
        '<p>' + esc(store.brand) + ' sells iPhones, iPads, MacBooks, Apple Watch, PlayStation and audio gear, delivered anywhere in Nigeria. Every order is confirmed by phone before it ships.</p>' +
        '<a class="fwa" href="https://wa.me/' + esc(store.whatsapp) + '">' + svgIc(IC.whatsapp) + 'Chat on WhatsApp</a>' +
      '</div>' +
      '<div><h4>Shop</h4><ul>' +
        cats.map((c) => '<li><a href="/' + c.id + '/">' + esc(c.name) + '</a></li>').join('') +
      '</ul></div>' +
      '<div><h4>Help</h4><ul>' +
        '<li><a href="/policies/delivery/">Delivery and returns</a></li>' +
        '<li><a href="/policies/warranty/">Warranty</a></li>' +
        '<li><a href="/policies/payment/">Payment</a></li>' +
        '<li><a href="/contact/">Contact us</a></li>' +
      '</ul></div>' +
      '<div><h4>Talk to us</h4><ul>' +
        '<li><a class="tel" href="https://wa.me/' + esc(store.whatsapp) + '">' + esc(tel(store.whatsapp)) + '</a></li>' +
        '<li>Open every day, 9am to 8pm</li>' +
        '<li>' + esc(store.delivery) + '</li>' +
      '</ul>' +
      '<div class="pay">' +
        (String(store.payment || '').trim() ? '<span>' + esc(store.payment) + '</span>' : '') +
        '<span>Free delivery nationwide</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="fbot">' +
      '<span>&copy; ' + year + ' ' + esc(store.brand) + '. All rights reserved.</span>' +
      '<span>Prices in Naira. ' + esc(store.delivery) + '</span>' +
    '</div>' +
  '</div></footer>';
};

export const doc = (store, ctx, o) => {
  const title = o.title;
  const desc = o.desc;
  const draftOn = store.pricesSet === false;
  const url = store.siteUrl ? store.siteUrl + (o.path || '/') : '';
  const jsonld = []
    .concat(o.jsonld || [])
    .filter(Boolean)
    .map((j) => '<script type="application/ld+json">' + safeJson(j) + '</script>')
    .join('\n');
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(title) + '</title>\n' +
    '<meta name="description" content="' + esc(desc) + '">\n' +
    (url ? '<link rel="canonical" href="' + esc(url) + '">\n' : '') +
    '<meta name="theme-color" content="#0d1524">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="' + esc(store.brand) + '">\n' +
    '<meta property="og:title" content="' + esc(title) + '">\n' +
    '<meta property="og:description" content="' + esc(desc) + '">\n' +
    (url ? '<meta property="og:url" content="' + esc(url) + '">\n' : '') +
    /* Facebook and Instagram fetch the card image by absolute URL, so this one
       has to be built from siteUrl rather than served relative like the icon. */
    (store.siteUrl ? '<meta property="og:image" content="' + esc(store.siteUrl) + '/og.png">\n' +
      '<meta property="og:image:width" content="1200">\n' +
      '<meta property="og:image:height" content="630">\n' +
      '<meta property="og:image:alt" content="' + esc(store.brand) + ', official store">\n' : '') +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n' +
    '<link rel="apple-touch-icon" href="/logo-180.png">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n' +
    '<style>' + css + '</style>\n' +
    jsonld + '\n' +
    '</head>\n<body>\n' +
    '<a class="skip" href="#main">Skip to content</a>\n' +
    (draftOn ? '<div class="draft">Draft: prices are not published yet. Orders come through as enquiries and we confirm the total on the call.</div>\n' : '') +
    topStrip(store) +
    headerBar(store, ctx.cats, o.active) +
    '<main id="main">\n' + o.body + '\n</main>\n' +
    footerBar(store, ctx.cats) +
    cartDrawer(store) +
    '<script id="searchIndex" type="application/json">' + safeJson(ctx.index || []) + '</script>\n' +
    '<script>' + client({ symbol: store.symbol, payment: store.payment, delivery: store.delivery, whatsapp: store.whatsapp, email: store.email || '', brand: store.brand }) + '</script>\n' +
    '</body>\n</html>';
};
