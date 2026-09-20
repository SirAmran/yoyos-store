/* Fetch the product photography that is verifiably the right model and colour.

   Every entry below was checked by hand against the catalogue: the slug's
   generation has to match what the catalogue actually sells, and the slug's
   colour has to be the colour we are labelling it. Anything I could not confirm
   that way is deliberately absent, and those products keep their illustration
   rather than getting a picture of the wrong device.

   Run: node _fetch-photos.mjs */
import { writeFileSync } from 'node:fs';

const CDN = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';

/* file to write  ->  Apple slug */
const WANT = {
  /* iPhone 17 Pro and Pro Max, September 2025. The catalogue sells these. */
  'iphone-17-pro-cosmicorange':   'iphone-17-pro-finish-select-cosmicorange-202509',
  'iphone-17-pro-deepblue':       'iphone-17-pro-finish-select-deepblue-202509',
  'iphone-17-pro-silver':         'iphone-17-pro-finish-select-silver-202509',
  'iphone-17-pro-max-cosmicorange':'iphone-17-pro-max-finish-select-cosmicorange-202509',
  'iphone-17-pro-max-deepblue':   'iphone-17-pro-max-finish-select-deepblue-202509',
  'iphone-17-pro-max-silver':     'iphone-17-pro-max-finish-select-silver-202509',

  /* iPhone 18 Pro and Pro Max, September 2026. Only black and silver exist so
     far; the other colours are not pictured on Apple's CDN, so those keep their
     illustrations rather than borrowing a colour we cannot show honestly. */
  'iphone-18-pro-black':          'iphone-18-pro-finish-select-black-202609',
  'iphone-18-pro-silver':         'iphone-18-pro-finish-select-silver-202609',
  'iphone-18-pro-max-black':      'iphone-18-pro-max-finish-select-black-202609',
  'iphone-18-pro-max-silver':     'iphone-18-pro-max-finish-select-silver-202609',

  /* iPad 10th generation, 2022. */
  'ipad-10-blue':                 'ipad-2022-hero-blue-wifi-select',
  'ipad-10-pink':                 'ipad-2022-hero-pink-wifi-select',
  'ipad-10-silver':               'ipad-2022-hero-silver-wifi-select',
  'ipad-10-yellow':               'ipad-2022-hero-yellow-wifi-select',

  /* iPad Air, May 2024. Apple spells it spacegray, the catalogue says Space Grey. */
  'ipad-air-11-blue':             'ipad-air-select-11in-wifi-blue-202405',
  'ipad-air-11-purple':           'ipad-air-select-11in-wifi-purple-202405',
  'ipad-air-11-starlight':        'ipad-air-select-11in-wifi-starlight-202405',
  'ipad-air-11-spacegrey':        'ipad-air-select-11in-wifi-spacegray-202405',
  'ipad-air-13-blue':             'ipad-air-select-13in-wifi-blue-202405',
  'ipad-air-13-purple':           'ipad-air-select-13in-wifi-purple-202405',
  'ipad-air-13-starlight':        'ipad-air-select-13in-wifi-starlight-202405',
  'ipad-air-13-spacegrey':        'ipad-air-select-13in-wifi-spacegray-202405',
};

let ok = 0, bad = 0;
for (const [file, slug] of Object.entries(WANT)) {
  const url = CDN + slug + '?wid=940&hei=1112&fmt=png-alpha';
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    const b = Buffer.from(await r.arrayBuffer());
    if (b.slice(1, 4).toString() !== 'PNG' || b.length < 20000) {
      console.log('  MISS  ' + file + '  (' + slug + ')  ' + b.length + ' bytes');
      bad++;
      continue;
    }
    writeFileSync('assets/products/' + file + '.png', b);
    console.log('  ok    ' + file.padEnd(30) + b.readUInt32BE(16) + 'x' + b.readUInt32BE(20) + '  ' + Math.round(b.length / 1024) + 'kb');
    ok++;
  } catch (e) {
    console.log('  ERR   ' + file + ': ' + e.message);
    bad++;
  }
}
console.log('\n' + ok + ' saved, ' + bad + ' failed');
