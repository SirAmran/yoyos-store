/* Pull the product images Apple's own buy pages embed, and keep only the ones
   that come back as a real photo. Run: node _shots.mjs */
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';
const CDN = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/';

const PAGES = {
  ipad:         'https://www.apple.com/shop/buy-ipad/ipad',
  'ipad-air':   'https://www.apple.com/shop/buy-ipad/ipad-air',
  'macbook-air':'https://www.apple.com/shop/buy-mac/macbook-air',
  'macbook-pro':'https://www.apple.com/shop/buy-mac/macbook-pro',
  watch:        'https://www.apple.com/shop/buy-watch',
  airpods:      'https://www.apple.com/shop/buy-airpods',
};

const get = async (url, asText) => {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  return asText ? r.text() : r;
};

/* The buy pages name their product images either <family>-finish-select-... or
   by part number with a _DEFAULT_FV / _AV suffix. Both are real renders; the
   colour swatches (_SW_COLOR) are dots, not products, so they are dropped. */
const slugRe = /as-images\.apple\.com\/is\/([A-Za-z0-9._-]+)/g;

const out = {};
for (const [name, url] of Object.entries(PAGES)) {
  let html = '';
  try { html = await get(url, true); } catch (e) { console.log(name + ': fetch failed ' + e.message); continue; }

  const slugs = [...new Set([...html.matchAll(slugRe)].map((m) => m[1]))]
    .filter((s) => !/_SW_COLOR$/.test(s))
    .filter((s) => !/^(og-|applecard|APPLECARE)/i.test(s))
    .filter((s) => !/-thumb|thumbnail|logo|icon/i.test(s));

  const hits = [];
  for (const s of slugs) {
    try {
      const r = await fetch(CDN + s + '?wid=940&hei=1112&fmt=png-alpha', { headers: { 'User-Agent': UA } });
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length > 20000 && b.slice(1, 4).toString() === 'PNG') {
        hits.push({ slug: s, kb: Math.round(b.length / 1024), w: b.readUInt32BE(16), h: b.readUInt32BE(20) });
      }
    } catch { /* a miss is just a miss */ }
  }
  hits.sort((a, b) => b.kb - a.kb);
  out[name] = hits;
  console.log('\n=== ' + name + '  (' + hits.length + ' real images of ' + slugs.length + ' slugs) ===');
  hits.slice(0, 14).forEach((h) => console.log('   ' + h.slug.padEnd(52) + h.w + 'x' + h.h + '  ' + h.kb + 'kb'));
}

mkdirSync('_shots', { recursive: true });
writeFileSync('_shots/apple-slugs.json', JSON.stringify(out, null, 2), 'utf8');
console.log('\nwrote _shots/apple-slugs.json');
