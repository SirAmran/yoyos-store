/* Harvest product images from Apple's own marketing and buy pages.

   The buy pages alone were not enough: they yielded clean "finish-select" shots
   for iPad and iPhone but almost nothing usable for Mac, Watch or AirPods. This
   pulls every as-images.apple.com slug out of a wider set of pages per family,
   then reports the ones that are actually usable in the shop gallery, which
   needs a transparent cut-out rather than a lifestyle photo on a background.

   Run: node _shots2.mjs   (writes _shots/apple-slugs-2.json) */
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';
const CDN = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/';

const PAGES = {
  'macbook-air': [
    'https://www.apple.com/macbook-air/',
    'https://www.apple.com/shop/buy-mac/macbook-air',
    'https://www.apple.com/mac/compare/'
  ],
  'macbook-pro': [
    'https://www.apple.com/macbook-pro/',
    'https://www.apple.com/shop/buy-mac/macbook-pro'
  ],
  watch: [
    'https://www.apple.com/watch/',
    'https://www.apple.com/apple-watch-series-11/',
    'https://www.apple.com/apple-watch-se/',
    'https://www.apple.com/apple-watch-ultra-3/',
    'https://www.apple.com/watch/compare/'
  ],
  airpods: [
    'https://www.apple.com/airpods-4/',
    'https://www.apple.com/airpods-pro/',
    'https://www.apple.com/airpods-max/',
    'https://www.apple.com/airpods/compare/'
  ]
};

/* Everything that is plainly not a product cut-out. */
const JUNK = /_SW_COLOR|thumbnail|logo|og-|applecard|APPLECARE|apple-care|trade-in|tradein|vid1|gallery|services-|software|step1|personal-setup|installment|engraving|education|refurb|monthly|-card-|card-40|card-50|hero-.*-og|compare-header|accessories|bands|siri|fitness|runners/i;

const out = {};
for (const [family, urls] of Object.entries(PAGES)) {
  const found = new Set();
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!r.ok) { console.log('  page ' + r.status + '  ' + url); continue; }
      const html = await r.text();
      const hits = html.match(/as-images\.apple\.com\/is\/[A-Za-z0-9_.\-]+/g) || [];
      hits.forEach((h) => found.add(h.replace('as-images.apple.com/is/', '')));
      console.log('  ' + String(hits.length).padStart(4) + ' slugs  ' + url);
    } catch (e) {
      console.log('  ERR ' + url + ': ' + e.message);
    }
  }
  const real = [...found].filter((s) => !JUNK.test(s));
  console.log('=== ' + family + ': ' + found.size + ' found, ' + real.length + ' after filtering ===');
  out[family] = real;
}

mkdirSync('_shots', { recursive: true });
writeFileSync('_shots/apple-slugs-2.json', JSON.stringify(out, null, 2), 'utf8');
console.log('\nwrote _shots/apple-slugs-2.json');
