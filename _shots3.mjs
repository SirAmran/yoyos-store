/* Derive real product cut-outs from Apple's colour swatch slugs.

   Apple's buy pages carry a small colour chip per finish, named
   "<family>-<colour>-select-<YYYYMM>_SW_COLOR". The chip is useless in the
   gallery, but the same slug without the "_SW_COLOR" suffix is the product
   cut-out on a transparent background. That is where the earlier harvest went
   wrong: the filter dropped every _SW_COLOR slug, which is exactly the marker
   that identifies a finish.

   Run: node _shots3.mjs   (writes _shots/candidates.json) */
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';
const CDN = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/';

const PAGES = [
  'https://www.apple.com/shop/buy-mac/macbook-air',
  'https://www.apple.com/shop/buy-mac/macbook-pro',
  'https://www.apple.com/shop/buy-watch/apple-watch',
  'https://www.apple.com/shop/buy-watch/apple-watch-se',
  'https://www.apple.com/shop/buy-watch/apple-watch-ultra',
  'https://www.apple.com/shop/buy-airpods/airpods-4',
  'https://www.apple.com/shop/buy-airpods/airpods-pro',
  'https://www.apple.com/shop/buy-airpods/airpods-max'
];

/* Every finish chip Apple lists, as "<base>|<full slug>". */
const swatches = new Set();
for (const url of PAGES) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) { console.log('  page ' + r.status + '  ' + url); continue; }
    const html = await r.text();
    const hits = html.match(/as-images\.apple\.com\/is\/[A-Za-z0-9_.\-]+_SW_COLOR/g) || [];
    hits.forEach((h) => swatches.add(h.replace('as-images.apple.com/is/', '')));
    console.log('  ' + String(hits.length).padStart(3) + ' finish chips  ' + url);
  } catch (e) {
    console.log('  ERR ' + url + ': ' + e.message);
  }
}

const bases = [...new Set([...swatches].map((s) => s.replace(/_SW_COLOR$/, '')))];
console.log('\n' + bases.length + ' distinct finishes found:');
bases.forEach((b) => console.log('   ' + b));

/* Test each base, plus the same finish across the sibling sizes and the other
   colours in its own family. One step of inference from a slug Apple itself
   published, never a blind guess, and a miss costs one 15 byte request. */
const wanted = new Set(bases);
for (const b of bases) {
  const m = b.match(/^([a-z0-9]+?)(\d{2})?-([a-z]+)-select-(\d{6})$/);
  if (!m) continue;
  const [, fam, size, colour, date] = m;
  const colours = ['skyblue', 'silver', 'starlight', 'midnight', 'spacegray', 'spaceblack', 'gold', 'blue', 'purple', 'pink', 'green', 'yellow', 'orange', 'black', 'white', 'natural', 'jetblack'];
  const sizes = size ? [size, size === '13' ? '15' : '13'] : [''];
  for (const s of sizes) for (const c of colours) wanted.add(fam + s + '-' + c + '-select-' + date);
}

const results = [];
for (const slug of wanted) {
  try {
    const r = await fetch(CDN + slug + '?wid=940&hei=1112&fmt=png-alpha', { headers: { 'User-Agent': UA } });
    const b = Buffer.from(await r.arrayBuffer());
    if (b.length < 20000 || b.slice(1, 4).toString() !== 'PNG') continue;
    results.push({
      slug,
      bytes: b.length,
      w: b.readUInt32BE(16),
      h: b.readUInt32BE(20),
      alpha: b[25] === 6
    });
  } catch { /* a miss is the expected outcome for most combinations */ }
}

results.sort((a, b) => a.slug.localeCompare(b.slug));
console.log('\n' + results.length + ' usable cut-outs:');
results.forEach((r) => console.log('   ' + r.slug.padEnd(46) + r.w + 'x' + r.h + '  ' + Math.round(r.bytes / 1024) + 'kb  alpha=' + r.alpha));

mkdirSync('_shots', { recursive: true });
writeFileSync('_shots/candidates.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\nwrote _shots/candidates.json');
