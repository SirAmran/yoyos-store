/* Build the Yoyos Devices logo.

   Writes assets/logo.svg (the vector mark the site uses) and renders the PNGs
   that Facebook and Instagram need: a square profile picture and a link preview
   card. The PNGs bake in Sora, so the letterforms are right even on a machine
   that has never seen the font.

   Edge's --screenshot flag writes nothing on this build, so the renders go
   through the DevTools protocol instead, the same way _drive.mjs does it.

   Run: node _make-logo.mjs */
import { writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TMP = '_logo/tmp';
const PORT = 9333;
const root = process.cwd().replace(/\\/g, '/');

/* The Y itself: white arms, stem in the brand accent. */
const Y_PATHS = `
    <path d="M19.5 20.5 L32 35 L44.5 20.5" fill="none" stroke="#ffffff" stroke-width="7"
          stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 35 L32 46.5" fill="none" stroke="#e25314" stroke-width="7" stroke-linecap="round"/>`;

/* The Y on its own navy tile, for places that sit on a light background. */
const tile = (id, rx) => `
    <defs>
      <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#22304a"/>
        <stop offset="1" stop-color="#0d1524"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="${rx}" fill="url(#g${id})"/>` + Y_PATHS;

/* 1. The vector mark, used by the site header and as the favicon. */
mkdirSync('assets', { recursive: true });
writeFileSync('assets/logo.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">` +
  tile('a', 15) + `\n</svg>\n`, 'utf8');
console.log('wrote assets/logo.svg');

/* 2. The Sora webfont, so the rendered PNGs use the real letterforms. */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36';
const css = await (await fetch('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&display=swap',
  { headers: { 'User-Agent': UA } })).text();
const woff = (css.match(/U\+0000-00FF[^}]*url\((https:[^)]+\.woff2)\)/) || css.match(/url\((https:[^)]+\.woff2)\)/))[1];
const fontB64 = Buffer.from(await (await fetch(woff, { headers: { 'User-Agent': UA } })).arrayBuffer()).toString('base64');
const FONT = `@font-face{font-family:Sora;font-style:normal;font-weight:400 800;src:url(data:font/woff2;base64,${fontB64}) format('woff2')}`;
console.log('font embedded, ' + Math.round(fontB64.length / 1024) + 'kb base64');

mkdirSync(TMP, { recursive: true });

const shell = (w, h, body) =>
  `<!doctype html><meta charset="utf-8"><style>${FONT}
   *{margin:0;padding:0;box-sizing:border-box}
   body{width:${w}px;height:${h}px;overflow:hidden;font-family:Sora,sans-serif;-webkit-font-smoothing:antialiased}
   </style>${body}`;

/* 3. Profile picture. Facebook and Instagram mask it to a circle, so the mark
      sits well inside the square and the tile runs full bleed to the edges. */
const profile = (px) => shell(px, px,
  `<div style="width:${px}px;height:${px}px;background:linear-gradient(135deg,#22304a 0%,#0d1524 100%);
     display:flex;align-items:center;justify-content:center">
     <svg viewBox="0 0 64 64" width="${Math.round(px * 0.62)}" height="${Math.round(px * 0.62)}">${Y_PATHS}
     </svg>
   </div>`);

/* 4. Link preview card. This is what shows when the store link is posted. */
const OG_W = 1200, OG_H = 630;
const ogCard = shell(OG_W, OG_H,
  `<div style="width:${OG_W}px;height:${OG_H}px;background:linear-gradient(135deg,#162034 0%,#0d1524 70%);
     padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between">
     <div style="display:flex;align-items:center;gap:26px">
       <svg viewBox="0 0 64 64" width="104" height="104">${tile('og', 15)}</svg>
       <div>
         <div style="font-size:64px;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1.05">Yoyos Devices</div>
         <div style="font-size:26px;font-weight:600;color:#e25314;margin-top:6px">Official store</div>
       </div>
     </div>
     <div style="font-size:38px;font-weight:600;color:#c9d1e0;line-height:1.35;letter-spacing:-.01em">
       iPhones, iPads, MacBooks, Apple Watch,<br>PlayStation and audio gear.
     </div>
     <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #2b3a55;padding-top:30px">
       <div style="font-size:30px;font-weight:600;color:#fff">Pay on delivery &nbsp;&#183;&nbsp; Nationwide in Nigeria</div>
       <div style="font-size:30px;font-weight:700;color:#e25314">store.yoyosdevices.com.ng</div>
     </div>
   </div>`);

const WANT = [
  ['logo-1024', 1024, 1024, profile(1024)],
  ['logo-512', 512, 512, profile(512)],
  ['logo-180', 180, 180, profile(180)],
  ['og', OG_W, OG_H, ogCard],
];

/* ---- Drive headless Edge over the DevTools protocol ---- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const proc = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + tmpdir().replace(/\\/g, '/') + '/yoyos-logo',
  '--window-size=1400,900', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

let version = null;
for (let i = 0; i < 80 && !version; i++) {
  try { version = await (await fetch('http://127.0.0.1:' + PORT + '/json/version')).json(); }
  catch { await sleep(250); }
}
if (!version) { proc.kill(); throw new Error('headless Edge never came up'); }
console.log('browser: ' + version.Browser);

const targets = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res);
  ws.addEventListener('error', () => rej(new Error('websocket refused')));
});

let seq = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) reject(new Error(m.error.message)); else resolve(m.result);
  }
});
const send = (method, params) => new Promise((resolve, reject) => {
  const id = ++seq;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params: params || {} }));
});

await send('Page.enable');
await send('Runtime.enable');

for (const [name, w, h, body] of WANT) {
  writeFileSync(TMP + '/' + name + '.html', body, 'utf8');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file:///' + root + '/' + TMP + '/' + name + '.html' });
  /* Wait for the webfont, or the wordmark renders in a fallback face. */
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => 1)', awaitPromise: true });
  await sleep(250);
  const r = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: false,
    clip: { x: 0, y: 0, width: w, height: h, scale: 1 },
  });
  const out = 'assets/' + name + '.png';
  writeFileSync(out, Buffer.from(r.data, 'base64'));
  console.log('  rendered ' + out.padEnd(22) + w + 'x' + h + '  ' + Math.round(statSync(out).size / 1024) + 'kb');
}

ws.close();
proc.kill();
rmSync(TMP, { recursive: true, force: true });
console.log('\ndone');
process.exit(0);
