#!/usr/bin/env node
/* Static site generator for the Yoyos Devices store.
   Node only, no dependencies. Reads catalog/*.json, writes a self-contained dist/. */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { doc } from './lib/layout.mjs';
import { homePage, categoryPage, productPage } from './lib/pages.mjs';
import { shopPage, checkoutPage, policyPages, contactPage, notFoundPage } from './lib/pages-b.mjs';
import { ART_TYPES } from './lib/art.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(ROOT, 'catalog');
const DIST = join(ROOT, 'dist');
const ASSETS = join(ROOT, 'assets');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const store = readJson(join(CATALOG, 'site.json'));
const cats = store.categories;
const byCat = {};
cats.forEach((c) => { byCat[c.id] = readJson(join(CATALOG, c.file)).items; });

/* Fail loudly on a broken catalogue rather than shipping a broken page. */
const problems = [];
const seen = new Set();
cats.forEach((c) => {
  byCat[c.id].forEach((it) => {
    const where = c.id + '/' + (it.slug || '(no slug)');
    if (!it.slug) problems.push(where + ': missing slug');
    if (!it.name) problems.push(where + ': missing name');
    if (!it.blurb) problems.push(where + ': missing blurb');
    if (!ART_TYPES.includes(it.art)) problems.push(where + ': unknown art type "' + it.art + '"');
    if (seen.has(where)) problems.push(where + ': duplicate slug');
    seen.add(where);
  });
});
if (problems.length) {
  console.error('Catalogue problems:');
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

const index = [];
cats.forEach((c) => byCat[c.id].forEach((it) => {
  index.push({
    name: it.name, cat: c.name, blurb: it.blurb,
    art: it.art, price: it.price, url: '/' + c.id + '/' + it.slug + '/'
  });
}));

const ctx = { cats, byCat, index };

const pages = [];
const add = (path, page) => pages.push({ path, page });
add('index.html', homePage(store, ctx));
add('shop/index.html', shopPage(store, ctx));
add('checkout/index.html', checkoutPage(store, ctx));
add('contact/index.html', contactPage(store, ctx));
add('404.html', notFoundPage(store, ctx));
policyPages(store).forEach((p) => add(p.path.replace(/^\//, '') + 'index.html', p));
cats.forEach((c) => {
  add(c.id + '/index.html', categoryPage(store, ctx, c));
  byCat[c.id].forEach((it) => add(c.id + '/' + it.slug + '/index.html', productPage(store, ctx, c, it)));
});

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

/* Page paths come through as "shop/index.html", so the sitemap needs the
   leading slash putting back before the site URL is prefixed. Without it every
   URL ran together as "...com.ngshop/". */
const href = (p) => {
  const clean = p.replace(/index\.html$/, '');
  const path = clean.startsWith('/') ? clean : '/' + clean;
  return store.siteUrl ? store.siteUrl + path : path;
};

pages.forEach(({ path, page }) => {
  const full = join(DIST, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, doc(store, ctx, page), 'utf8');
});

/* Sitemap, robots and the favicon. */
const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.filter((p) => p.path !== '404.html')
    .map((p) => '  <url><loc>' + href(p.path) + '</loc><lastmod>' + today + '</lastmod></url>')
    .join('\n') +
  '\n</urlset>\n';
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

writeFileSync(join(DIST, 'robots.txt'),
  'User-agent: *\nAllow: /\n' +
  (store.siteUrl ? 'Sitemap: ' + store.siteUrl + '/sitemap.xml\n' : ''), 'utf8');

writeFileSync(join(DIST, 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" rx="15" fill="#0d1524"/>' +
  '<text x="32" y="44" font-family="Sora,Inter,sans-serif" font-size="36" font-weight="800" ' +
  'fill="#ffffff" text-anchor="middle">' + store.brand.charAt(0) + '</text></svg>', 'utf8');

/* Anything dropped into assets/ ships as-is, including real product photos. */
if (existsSync(ASSETS)) {
  cpSync(ASSETS, DIST, { recursive: true });
}

const drafts = index.filter((i) => i.price == null).length;
console.log('Built ' + pages.length + ' pages into dist/');
console.log('  categories: ' + cats.length);
console.log('  products:   ' + index.length + (drafts ? ' (' + drafts + ' with no price yet)' : ''));
console.log('  pricesSet:  ' + (store.pricesSet ? 'yes' : 'NO, draft banner is showing'));
console.log('  siteUrl:    ' + (store.siteUrl || 'not set, no canonical or sitemap URLs'));
