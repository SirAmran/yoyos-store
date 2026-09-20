#!/usr/bin/env node
/* Serves dist/ and drives it in headless Edge over CDP.
   Exercises the cart and checkout for real, and writes screenshots to _shots/. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const SHOTS = join(ROOT, '_shots');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
/* Assigned a free port at startup. A fixed port collides with a leftover Edge
   from an earlier run, and then the driver silently drives the wrong browser. */
let PORT = 0;
let EDGE_PROC = null;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
};

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(DIST, p);
  if (!file.startsWith(DIST) || !existsSync(file)) {
    const nf = join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(existsSync(nf) ? readFileSync(nf) : 'Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok: !!ok, detail: detail == null ? '' : String(detail) });
  console.log((ok ? 'ok   ' : 'FAIL ') + name + (detail ? '  [' + detail + ']' : ''));
};

const getJson = async (path) => (await fetch('http://127.0.0.1:' + PORT + path)).json();

const connect = (url) => new Promise((resolve, reject) => {
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => resolve(ws));
  ws.addEventListener('error', () => reject(new Error('websocket failed: ' + url)));
});

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.consoleErrors = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        if (m.error) reject(new Error(m.error.message)); else resolve(m.result);
        return;
      }
      if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params.exceptionDetails;
        this.consoleErrors.push('exception: ' + (d.exception && d.exception.description ? d.exception.description : d.text));
      }
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.consoleErrors.push('console.error: ' + m.params.args.map((a) => a.value || a.description || '').join(' '));
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout on ' + method)); }
      }, 30000);
    });
  }
  async js(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: '(function(){' + expr + '})()', awaitPromise: true, returnByValue: true
    });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error(d.exception && d.exception.description ? d.exception.description : d.text);
    }
    return r.result.value;
  }
}

const main = async () => {
  rmSync(SHOTS, { recursive: true, force: true });
  mkdirSync(SHOTS, { recursive: true });

  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  check('static server started', port > 0, 'port ' + port);

  PORT = await new Promise((resolve) => {
    const probe = createServer();
    probe.listen(0, '127.0.0.1', () => {
      const p = probe.address().port;
      probe.close(() => resolve(p));
    });
  });

  const stop = () => { try { if (EDGE_PROC) EDGE_PROC.kill(); } catch (e) {} };
  /* Nothing here should take two minutes. If it does, a browser is wedged. */
  const watchdog = setTimeout(() => {
    console.error('driver stalled for 120s, killing Edge and giving up');
    stop(); server.close(); process.exit(3);
  }, 120000);

  const profile = join(tmpdir(), 'yoyos-edge-' + Date.now());
  EDGE_PROC = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile,
    '--window-size=1440,1000', '--hide-scrollbars', 'about:blank'
  ], { stdio: 'ignore' });

  let version = null;
  for (let i = 0; i < 60 && !version; i++) {
    try { version = await getJson('/json/version'); } catch (e) { await sleep(250); }
  }
  if (!version) { check('headless Edge started', false, 'no devtools endpoint'); clearTimeout(watchdog); stop(); server.close(); process.exit(1); }
  check('headless Edge started', true, version.Browser);

  const list = await getJson('/json/list');
  const page = list.find((t) => t.type === 'page');
  const cdp = new CDP(await connect(page.webSocketDebuggerUrl));
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  /* --window-size is ignored by headless Edge, so the viewport has to be set
     explicitly or every "desktop" check silently runs at 500x450. */
  const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
  await cdp.send('Emulation.setDeviceMetricsOverride', DESKTOP);

  const base = 'http://127.0.0.1:' + port;
  const go = async (path) => {
    await cdp.send('Page.navigate', { url: base + path });
    for (let i = 0; i < 120; i++) {
      try { if (await cdp.js('return document.readyState') === 'complete') { await sleep(180); return; } } catch (e) {}
      await sleep(80);
    }
    throw new Error('page never loaded: ' + path);
  };
  const shot = async (name, full) => {
    let params = { format: 'png' };
    if (full) {
      const m = await cdp.send('Page.getLayoutMetrics');
      const cs = m.cssContentSize || m.contentSize;
      params = {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: Math.round(cs.width), height: Math.round(Math.min(cs.height, 7000)), scale: 1 }
      };
    }
    const r = await cdp.send('Page.captureScreenshot', params);
    writeFileSync(join(SHOTS, name + '.png'), Buffer.from(r.data, 'base64'));
  };
  const overflow = async () => {
    const v = (await cdp.js('return document.documentElement.scrollWidth + "|" + window.innerWidth')).split('|').map(Number);
    return { sw: v[0], iw: v[1], ok: v[0] <= v[1] + 1 };
  };

  /* ---- 1. Home ---- */
  await go('/');
  check('viewport really is desktop width', (await cdp.js('return window.innerWidth')) === 1440,
    await cdp.js('return window.innerWidth + "px"'));
  check('desktop nav is shown', await cdp.js('return getComputedStyle(document.querySelector(".nav")).display !== "none"'));
  check('desktop menu button is hidden',
    await cdp.js('return getComputedStyle(document.getElementById("menuBtn")).display === "none"'));
  check('home renders a title', (await cdp.js('return document.title')).indexOf('Yoyos') > -1,
    await cdp.js('return document.title'));
  check('draft banner is showing', await cdp.js('return !!document.querySelector(".draft")'));
  check('category bar is populated', (await cdp.js('return document.querySelectorAll(".catbar a").length')) >= 6,
    await cdp.js('return document.querySelectorAll(".catbar a").length + " links"'));
  check('category tiles rendered', (await cdp.js('return document.querySelectorAll(".pcard").length')) >= 12,
    await cdp.js('return document.querySelectorAll(".pcard").length + " cards"'));
  check('search index holds all 36 products',
    (await cdp.js('return JSON.parse(document.getElementById("searchIndex").textContent).length')) === 36);
  check('hero art rendered as inline svg', (await cdp.js('return document.querySelectorAll(".heroart svg").length')) === 4);
  const dOv = await overflow();
  check('no horizontal overflow at 1440px', dOv.ok, dOv.sw + ' vs ' + dOv.iw);
  await shot('01-home', true);

  /* ---- 2. Search ---- */
  await cdp.js('var i=document.getElementById("searchInput"); i.value="airpods"; i.dispatchEvent(new Event("input")); return 1');
  await sleep(150);
  const hits = await cdp.js('return document.querySelectorAll("#searchResults a").length');
  check('search finds AirPods', hits >= 3, hits + ' hits');
  await cdp.js('var i=document.getElementById("searchInput"); i.value="zzzz"; i.dispatchEvent(new Event("input")); return 1');
  await sleep(120);
  check('search shows an empty state', await cdp.js('return !!document.querySelector("#searchResults .none")'));

  /* ---- 3. Category ---- */
  await go('/iphone/');
  check('iphone category lists 8 devices', (await cdp.js('return document.querySelectorAll(".pcard").length')) === 8);
  check('category emits ItemList schema',
    (await cdp.js('var s=document.querySelectorAll(\'script[type="application/ld+json"]\'); var t=[];' +
      'for(var i=0;i<s.length;i++){try{t.push(JSON.parse(s[i].textContent)["@type"]);}catch(e){}} return t.join(",");'
    )).indexOf('ItemList') > -1,
    await cdp.js('return document.querySelectorAll(\'script[type="application/ld+json"]\').length + " ld+json blocks"'));
  await shot('02-category', true);

  /* ---- 4. Product page ---- */
  await go('/iphone/iphone-17-pro/');
  check('pdp shows the product name', (await cdp.js('return document.querySelector("#pdp h1").textContent')).indexOf('iPhone 17 Pro') > -1);
  check('pdp has 3 colour swatches', (await cdp.js('return document.querySelectorAll("#pdp .sw").length')) === 3);
  check('pdp has 2 option groups', (await cdp.js('return document.querySelectorAll("#pdp .opt[data-opt]").length')) === 2);
  check('exactly one shot is showing', (await cdp.js('return document.querySelectorAll("#pdp .shot.on").length')) === 1);

  const beforeShot = await cdp.js('return document.querySelector("#pdp .shot.on").getAttribute("data-color")');
  await cdp.js('document.querySelectorAll("#pdp .sw")[2].click(); return 1');
  await sleep(100);
  const afterShot = await cdp.js('return document.querySelector("#pdp .shot.on").getAttribute("data-color")');
  check('clicking a swatch switches the shot', beforeShot !== afterShot, beforeShot + ' -> ' + afterShot);
  check('swatch aria-pressed follows', (await cdp.js('return document.querySelectorAll("#pdp .sw")[2].getAttribute("aria-pressed")')) === 'true');
  check('switching colour starts no error', cdp.consoleErrors.length === 0);

  await cdp.js('document.querySelectorAll("#pdp .opt[data-opt=\'Storage\'] .chip")[2].click(); return 1');
  await sleep(80);
  const variant = await cdp.js('return document.querySelector("#variantOut").textContent');
  check('option updates the variant line', variant.indexOf('1TB') > -1, variant);

  await cdp.js('document.querySelector("[data-q-inc]").click(); document.querySelector("[data-q-inc]").click(); return 1');
  check('quantity stepper reaches 3', (await cdp.js('return document.querySelector("#qtyOut").textContent')) === '3');

  /* ---- 5. Add to cart ---- */
  await cdp.js('document.getElementById("addBtn").click(); return 1');
  await sleep(250);
  check('cart badge reads 3', (await cdp.js('return document.querySelector("[data-cart-count]").textContent')) === '3',
    await cdp.js('return document.querySelector("[data-cart-count]").textContent'));
  check('drawer opened on add', await cdp.js('return document.getElementById("cartDrawer").classList.contains("open")'));
  check('drawer holds one line', (await cdp.js('return document.querySelectorAll("#cartLines .dline").length')) === 1);
  check('drawer line carries the variant',
    (await cdp.js('return document.querySelector("#cartLines .vr").textContent')).indexOf('1TB') > -1,
    await cdp.js('return document.querySelector("#cartLines .vr").textContent'));
  check('unpriced cart explains itself',
    (await cdp.js('return document.getElementById("cartNote").textContent')).indexOf('priced on request') > -1);
  await shot('03-product-cart-open');

  /* ---- 6. Drawer controls ---- */
  await cdp.js('document.querySelector("#cartLines [data-inc]").click(); return 1');
  await sleep(100);
  check('drawer increment works', (await cdp.js('return document.querySelector("#cartLines .qty span").textContent')) === '4');
  await cdp.js('document.querySelector("#cartLines [data-dec]").click(); return 1');
  await sleep(100);
  check('drawer decrement works', (await cdp.js('return document.querySelector("#cartLines .qty span").textContent')) === '3');

  await cdp.js('document.querySelector("#cartLines [data-rm]").click(); return 1');
  await sleep(150);
  check('remove empties the cart', (await cdp.js('return document.querySelectorAll("#cartLines .dline").length')) === 0);
  check('badge hides when the cart empties', await cdp.js('return document.querySelector("[data-cart-count]").hidden === true'));
  check('checkout button hides when empty', await cdp.js('return document.getElementById("cartCheckout").hidden === true'));

  /* re-add two different devices so the order has real content */
  await cdp.js('document.querySelectorAll("#pdp .sw")[0].click(); document.querySelector("[data-q-dec]").click(); document.getElementById("addBtn").click(); return 1');
  await sleep(200);
  const badgeBefore = await cdp.js('return document.querySelector("[data-cart-count]").textContent');
  await go('/ipad/');
  await cdp.js('document.querySelectorAll(".pcard")[0].click(); return 1');
  await sleep(500);
  check('card click navigates to a product', (await cdp.js('return location.pathname')).indexOf('/ipad/') === 0,
    await cdp.js('return location.pathname'));
  const badgeAfter = await cdp.js('return document.querySelector("[data-cart-count]").textContent');
  check('cart survives navigation', badgeAfter === badgeBefore, badgeBefore + ' -> ' + badgeAfter);
  const stored = await cdp.js('return localStorage.getItem("yoyos-cart-v1")');
  check('cart is in localStorage as expected', (stored || '').indexOf('"qty":2') > -1, stored);
  await cdp.js('document.getElementById("addBtn").click(); return 1');
  await sleep(250);
  check('second device joins the first', (await cdp.js('return document.querySelectorAll("#cartLines .dline").length')) === 2,
    await cdp.js('return document.querySelectorAll("#cartLines .dline").length + " lines"'));

  /* ---- 7. Checkout ---- */
  await go('/checkout/');
  check('checkout summary mirrors the cart', (await cdp.js('return document.querySelectorAll("#coLines .line").length')) === 2,
    await cdp.js('return document.querySelectorAll("#coLines .line").length + " lines"'));
  check('order reference is pre-filled',
    (await cdp.js('return (document.getElementById("orderReference").value||"").indexOf("YOYOS-")===0')),
    await cdp.js('return document.getElementById("orderReference").value'));
  check('hidden items field is populated', (await cdp.js('return document.getElementById("orderItems").value.length')) > 5,
    await cdp.js('return document.getElementById("orderItems").value'));
  await shot('04-checkout', true);

  /* an empty submit must be caught by our own validation, not the browser bubble */
  await cdp.js('document.getElementById("placeBtn").click(); return 1');
  await sleep(200);
  check('empty submit is blocked in-page', await cdp.js('return document.getElementById("formStatus").classList.contains("show")'),
    await cdp.js('return document.getElementById("formStatus").textContent'));
  check('the offending field is marked', (await cdp.js('return document.querySelectorAll("#coForm .field.err").length')) > 0);
  check('marked field is flagged for screen readers',
    (await cdp.js('return document.querySelector("#coForm .field.err input").getAttribute("aria-invalid")')) === 'true');
  check('form is still on screen, nothing sent', await cdp.js('return document.getElementById("coFormWrap").hidden === false'));

  /* a short phone number is the rule native validation cannot express */
  const refBefore = await cdp.js('return document.getElementById("orderReference").value');
  await cdp.js(`
    var set=function(id,v){var e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input'));};
    set('fullName','Imran Test'); set('phone','0803');
    set('address','12 Test Close'); set('city','Lekki');
    document.getElementById('stateName').value='Lagos';
    return 1;
  `);
  await cdp.js('document.getElementById("placeBtn").click(); return 1');
  await sleep(200);
  check('short phone number is rejected',
    (await cdp.js('var f=document.getElementById("phone").closest(".field"); var m=f?f.querySelector(".msg"):null; return m?m.textContent:""'))
      .indexOf('phone number') > -1,
    await cdp.js('var f=document.getElementById("phone").closest(".field"); var m=f?f.querySelector(".msg"):null; return m?m.textContent:""'));
  check('short phone number marks the field',
    (await cdp.js('return document.getElementById("phone").getAttribute("aria-invalid")')) === 'true');

  /* now fill it properly and send */
  await cdp.js('var e=document.getElementById("phone"); e.value="08031234567"; e.dispatchEvent(new Event("input")); return 1');
  await cdp.js('document.getElementById("placeBtn").click(); return 1');
  await sleep(900);
  const done = await cdp.js('return document.getElementById("coDone").classList.contains("show")');
  const ref = await cdp.js('return document.getElementById("doneRef").textContent');
  check('order confirmation shows', done, done ? 'reference ' + ref : 'no confirmation, status: ' + await cdp.js('return document.getElementById("formStatus").textContent'));
  check('reference is a fresh one, not the pre-filled value', ref && ref !== refBefore, refBefore + ' -> ' + ref);
  check('confirmation lists four facts', (await cdp.js('return document.querySelectorAll("#doneFacts div").length')) === 4);
  check('confirmation carries the delivery address',
    (await cdp.js('return document.getElementById("doneFacts").textContent')).indexOf('Lekki') > -1,
    await cdp.js('return document.getElementById("doneFacts").textContent'));
  check('form is hidden after success', await cdp.js('return document.getElementById("coFormWrap").hidden === true'));
  check('cart is emptied after success', await cdp.js('return document.querySelector("[data-cart-count]").hidden === true'));
  check('order reference field was cleared', await cdp.js('return document.getElementById("orderReference").value === ""'));
  await shot('05-confirmation');

  /* ---- 7b. Totals must not quietly drop unpriced lines ---- */
  const cart = (rows) => 'localStorage.setItem("yoyos-cart-v1", JSON.stringify([' + rows + '])); return 1';
  await go('/');
  await cdp.js(cart(
    '{slug:"a",name:"Priced thing",variant:"",price:250000,art:"phone",url:"/",qty:2},' +
    '{slug:"b",name:"Unpriced thing",variant:"",price:null,art:"box",url:"/",qty:1}'));
  await go('/checkout/');
  check('mixed cart total says On request, not a partial sum',
    (await cdp.js('return document.getElementById("coGrand").textContent')) === 'On request',
    await cdp.js('return document.getElementById("coGrand").textContent'));
  check('mixed cart subtotal agrees',
    (await cdp.js('return document.getElementById("coSub").textContent')) === 'On request');
  check('checkout note explains why',
    (await cdp.js('return document.getElementById("coNote").textContent')).indexOf('priced on request') > -1,
    await cdp.js('return document.getElementById("coNote").textContent'));
  check('checkout note does not repeat the payment line',
    (await cdp.js('return (document.getElementById("coNote").textContent.match(/Pay on delivery/g)||[]).length')) === 1,
    await cdp.js('return document.getElementById("coNote").textContent'));

  await cdp.js(cart('{slug:"a",name:"Priced thing",variant:"",price:250000,art:"phone",url:"/",qty:2}'));
  await go('/checkout/');
  check('all-priced cart shows the real total',
    (await cdp.js('return document.getElementById("coGrand").textContent')).indexOf('500,000') > -1,
    await cdp.js('return document.getElementById("coGrand").textContent'));
  check('all-priced cart restores the normal note',
    (await cdp.js('return document.getElementById("coNote").textContent')).indexOf('priced on request') === -1,
    await cdp.js('return document.getElementById("coNote").textContent'));

  await cdp.js(cart('{slug:"a",name:"Priced thing",variant:"",price:250000,art:"phone",url:"/",qty:2}'));
  await go('/iphone/');
  check('cart badge paints on load without touching the cart',
    (await cdp.js('return document.querySelector("[data-cart-count]").textContent')) === '2',
    await cdp.js('return document.querySelector("[data-cart-count]").textContent'));

  /* ---- 8. Mobile ---- */
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await go('/');
  check('mobile menu button is visible',
    await cdp.js('return getComputedStyle(document.getElementById("menuBtn")).display !== "none"'));
  check('desktop nav is hidden on mobile',
    await cdp.js('return getComputedStyle(document.querySelector(".nav")).display === "none"'));
  await cdp.js('document.getElementById("menuBtn").click(); return 1');
  await sleep(150);
  check('mobile menu opens', await cdp.js('return document.getElementById("mobileNav").classList.contains("open")'));
  const w = await overflow();
  check('no horizontal overflow at 390px', w.ok, w.sw + ' vs ' + w.iw);
  await shot('06-mobile-home', true);

  await go('/iphone/iphone-17-pro/');
  const w2 = await overflow();
  check('no horizontal overflow on the product page', w2.ok, w2.sw + ' vs ' + w2.iw);
  await shot('07-mobile-product', true);

  await go('/checkout/');
  const w3 = await overflow();
  check('no horizontal overflow on checkout', w3.ok, w3.sw + ' vs ' + w3.iw);
  await cdp.send('Emulation.setDeviceMetricsOverride', DESKTOP);

  /* ---- 9. 404 and console health ---- */
  await go('/no-such-page/');
  check('404 page is served',
    (await cdp.js('return document.body.textContent')).indexOf('could not find') > -1);

  const errs = cdp.consoleErrors;
  check('no console errors across the whole run', errs.length === 0, errs.slice(0, 3).join(' | '));

  clearTimeout(watchdog);
  stop();
  server.close();

  const failed = results.filter((r) => !r.ok);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' checks passed. Screenshots in _shots/');
  process.exit(failed.length ? 1 : 0);
};

main().catch((e) => {
  try { if (EDGE_PROC) EDGE_PROC.kill(); } catch (err) {}
  console.error('driver crashed: ' + e.message);
  process.exit(1);
});
