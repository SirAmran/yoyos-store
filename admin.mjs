#!/usr/bin/env node
/* Local price admin for the Yoyos Devices store.

   Loopback only. No dependencies. Edits catalog/*.json, rebuilds dist/, and runs
   the checker. Nothing here is uploaded or exposed on the network: the server
   binds 127.0.0.1 and rejects any request whose Host header is not loopback, so a
   page in a browser cannot reach it by DNS rebinding.

   Run:  node admin.mjs        then open  http://127.0.0.1:8796/
   Or:   double-click admin.bat

   Prices live in catalog/<category>.json at items[].price. A null price renders
   as "Ask for price" and keeps the red DRAFT bar on. Set pricesSet to true in the
   site panel once the numbers are real.
*/
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tokens } from './lib/tokens.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(ROOT, 'catalog');
const SITE_PATH = join(CATALOG, 'site.json');
const PORT = Number(process.env.PORT || 8796);
const HOST = '127.0.0.1';

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const writeJson = (p, o) => writeFileSync(p, JSON.stringify(o, null, 2) + '\n', 'utf8');
const site = () => readJson(SITE_PATH);

/* Site keys the panel is allowed to write. Anything else is ignored, so a stray
   field in a request body cannot land in site.json. */
const SITE_KEYS = ['tagline', 'whatsapp', 'delivery', 'payment', 'siteUrl', 'pixelId', 'pricesSet'];

const snapshot = () => {
  const s = site();
  return {
    site: s,
    cats: s.categories.map((c) => {
      const d = readJson(join(CATALOG, c.file));
      return {
        id: c.id,
        name: c.name,
        items: d.items.map((it) => ({
          slug: it.slug,
          name: it.name,
          blurb: it.blurb,
          price: it.price,
          note: it.note || '',
          photo: it.photo || ''
        }))
      };
    })
  };
};

/* Writes prices back to the category files. Returns the keys that actually moved,
   so the panel can say what changed instead of claiming a save that was a no-op. */
const savePrices = (prices) => {
  if (!prices || typeof prices !== 'object') return [];
  const s = site();
  const changed = [];
  s.categories.forEach((c) => {
    const file = join(CATALOG, c.file);
    const d = readJson(file);
    let dirty = false;
    d.items.forEach((it) => {
      const key = c.id + '/' + it.slug;
      if (!Object.prototype.hasOwnProperty.call(prices, key)) return;
      const raw = prices[key];
      const next = raw === '' || raw == null ? null : Number(raw);
      if (next != null && (!Number.isFinite(next) || next < 0)) {
        throw new Error(key + ': "' + raw + '" is not a price');
      }
      if (next !== it.price) {
        it.price = next;
        dirty = true;
        changed.push(key);
      }
    });
    if (dirty) writeJson(file, d);
  });
  return changed;
};

const saveSite = (patch) => {
  if (!patch || typeof patch !== 'object') return;
  const s = site();
  SITE_KEYS.forEach((k) => {
    if (!Object.prototype.hasOwnProperty.call(patch, k)) return;
    s[k] = typeof patch[k] === 'string' ? patch[k].trim() : patch[k];
  });
  writeJson(SITE_PATH, s);
};

/* Runs a child script and returns its output whatever the exit code, so a failing
   checker is reported to the panel instead of throwing the server over. */
const run = (script) => {
  try {
    return { ok: true, out: execFileSync(process.execPath, [join(ROOT, script)], { cwd: ROOT, encoding: 'utf8' }) };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') || String(e.message) };
  }
};

const git = (args) => {
  try {
    return { ok: true, out: execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }) };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') || String(e.message) };
  }
};

const hasRemote = () => git(['remote', 'get-url', 'origin']).ok;

const money0 = (n) => (n == null ? '' : String(n));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

const row = (catId, it) =>
  '<tr' + (it.price == null ? ' class="unpriced"' : '') + '>' +
    '<td class="nm"><b>' + esc(it.name) + '</b><small>' + esc(it.blurb) + '</small>' +
      (it.note ? '<em class="flag">' + esc(it.note) + '</em>' : '') + '</td>' +
    '<td class="ph">' + (it.photo ? '<span class="ok">photo</span>' : '<span class="no">art</span>') + '</td>' +
    '<td class="pr"><span class="cur">' + esc(site().symbol) + '</span>' +
      '<input type="number" min="0" step="500" inputmode="numeric" data-key="' + esc(catId + '/' + it.slug) + '"' +
      ' value="' + esc(money0(it.price)) + '" placeholder="ask"></td>' +
  '</tr>';

const page = (snap) => {
  const total = snap.cats.reduce((n, c) => n + c.items.length, 0);
  const priced = snap.cats.reduce((n, c) => n + c.items.filter((i) => i.price != null).length, 0);
  const s = snap.site;

  const catBlock = (c) => {
    const missing = c.items.filter((i) => i.price == null).length;
    return '<section class="cat"><h2>' + esc(c.name) +
      '<span class="pill' + (missing ? ' warn' : ' good') + '">' +
        (missing ? missing + ' unpriced' : 'all priced') + '</span></h2>' +
      '<table><tbody>' + c.items.map((it) => row(c.id, it)).join('') + '</tbody></table></section>';
  };

  const body = '' +
  '<header><div class="wrap">' +
    '<div><h1>Price admin</h1><p>' + esc(s.brand) + ' store. Prices write to <code>catalog/*.json</code>, then the store rebuilds.</p></div>' +
    '<div class="score"><b>' + priced + '/' + total + '</b><small>priced</small></div>' +
  '</div></header>' +
  '<main class="wrap">' +
    '<section class="panel">' +
      '<h2>Store settings</h2>' +
      '<div class="fields">' +
        '<label>Site URL<input id="s_siteUrl" type="url" placeholder="https://....netlify.app" value="' + esc(s.siteUrl) + '"></label>' +
        '<label>Meta Pixel ID<input id="s_pixelId" type="text" placeholder="1234567890" value="' + esc(s.pixelId) + '"></label>' +
        '<label>WhatsApp<input id="s_whatsapp" type="text" value="' + esc(s.whatsapp) + '"></label>' +
        '<label>Delivery line<input id="s_delivery" type="text" value="' + esc(s.delivery) + '"></label>' +
        '<label>Payment line<input id="s_payment" type="text" value="' + esc(s.payment) + '"></label>' +
      '</div>' +
      '<label class="switch"><input id="s_pricesSet" type="checkbox"' + (s.pricesSet ? ' checked' : '') + '>' +
        '<span>Prices are real, hide the draft banner</span></label>' +
      '<p class="hint" id="draftHint"></p>' +
    '</section>' +
    '<div class="bar">' +
      '<button id="save" type="button">Save and rebuild</button>' +
      '<button id="publish" type="button" class="ghost">Publish to the live site</button>' +
      '<span class="status" id="status"></span>' +
    '</div>' +
    snap.cats.map(catBlock).join('') +
  '</main>' +
  '<script id="boot" type="application/json">' + safeJson({ hasRemote: hasRemote() }) + '</script>' +
  '<script>' + CLIENT + '</script>';

  return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>Price admin | ' + esc(s.brand) + '</title>\n' +
    '<style>' + tokens + ADMIN_CSS + '</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>';
};

const ADMIN_CSS = `
body{background:var(--bg)}
.wrap{max-width:1040px}
header{background:var(--navy);color:#fff;padding:26px 0}
header .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px}
header h1{font-size:26px}
header p{color:#aab3c4;font-size:13.5px;margin-top:4px}
header code{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:5px;font-size:12.5px}
.score{text-align:right;flex:none}
.score b{display:block;font-family:var(--font-display);font-size:30px;font-weight:800}
.score small{color:#aab3c4;font-size:12px}
main{padding-block:24px 70px}
.panel,.cat{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-sm);padding:22px 24px;margin-bottom:20px}
.panel h2,.cat h2{font-size:17px;margin-bottom:14px;display:flex;align-items:center;gap:10px}
.pill{font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:var(--r-pill);font-family:var(--font-body)}
.pill.warn{background:var(--warn-soft);color:var(--warn)}
.pill.good{background:var(--success-soft);color:var(--success)}
.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.fields label,.switch{font-size:12.5px;font-weight:600;color:var(--ink-soft);display:block}
.fields input{width:100%;margin-top:5px;padding:10px 12px;border:1px solid var(--border-strong);border-radius:var(--r-sm);background:var(--surface);font-size:14px}
.fields input:focus{outline:2px solid var(--accent);outline-offset:-1px;border-color:var(--accent)}
.switch{display:flex;align-items:center;gap:9px;margin-top:16px;font-size:14px;color:var(--ink)}
.switch input{width:17px;height:17px;accent-color:var(--accent)}
.hint{font-size:12.5px;color:var(--warn);margin-top:8px;font-weight:600}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);padding:12px 0;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--border);margin-bottom:20px}
.bar button{background:var(--accent);color:#fff;font-weight:700;font-size:14.5px;padding:12px 22px;border-radius:var(--r-sm)}
.bar button:hover{background:var(--accent-hi)}
.bar button.ghost{background:var(--surface);color:var(--ink);border:1px solid var(--border-strong)}
.bar button:disabled{opacity:.5;cursor:default}
.status{font-size:13.5px;color:var(--ink-soft);font-weight:600}
.status.bad{color:#c0392b}
.status.good{color:var(--success)}
table{width:100%;border-collapse:collapse}
tr{border-top:1px solid var(--border)}
tr:first-child{border-top:0}
td{padding:11px 0;vertical-align:middle}
.nm b{display:block;font-size:14.5px}
.nm small{display:block;color:var(--ink-faint);font-size:12.5px;margin-top:2px}
.nm .flag{display:block;font-size:12px;color:var(--warn);background:var(--warn-soft);padding:3px 8px;border-radius:5px;margin-top:6px;font-style:normal;font-weight:600}
.ph{width:70px;text-align:center}
.ph span{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:var(--r-pill)}
.ph .ok{background:var(--success-soft);color:var(--success)}
.ph .no{background:var(--surface-3);color:var(--ink-faint)}
.pr{width:190px;text-align:right;white-space:nowrap}
.pr .cur{color:var(--ink-faint);margin-right:5px;font-size:14px}
.pr input{width:140px;text-align:right;padding:9px 11px;border:1px solid var(--border-strong);border-radius:var(--r-sm);font-size:14.5px;font-variant-numeric:tabular-nums}
.pr input:focus{outline:2px solid var(--accent);outline-offset:-1px;border-color:var(--accent)}
tr.unpriced .pr input{background:var(--warn-soft);border-color:#e8cf9a}
@media (max-width:620px){
  .pr{width:120px}.pr input{width:96px}
  .ph{display:none}
  header .wrap{flex-direction:column;align-items:flex-start}
  .score{text-align:left}
}`;

/* Client. Plain string concatenation, no template literals, so this file's own
   template strings stay readable. */
const CLIENT = [
'(function(){',
'  var boot = JSON.parse(document.getElementById("boot").textContent);',
'  var status = document.getElementById("status");',
'  var saveBtn = document.getElementById("save");',
'  var pubBtn = document.getElementById("publish");',
'  var pricesSet = document.getElementById("s_pricesSet");',
'  var draftHint = document.getElementById("draftHint");',
'',
'  if (!boot.hasRemote) {',
'    pubBtn.disabled = true;',
'    pubBtn.title = "No git remote yet. Publish by hand the first time.";',
'  }',
'',
'  function say(msg, cls) {',
'    status.textContent = msg;',
'    status.className = "status" + (cls ? " " + cls : "");',
'  }',
'',
'  function checkDraft() {',
'    var blanks = document.querySelectorAll(".pr input");',
'    var missing = 0;',
'    for (var i = 0; i < blanks.length; i++) if (blanks[i].value === "") missing++;',
'    if (pricesSet.checked && missing) {',
'      draftHint.textContent = missing + " still unpriced. They will show as \\"Ask for price\\" on the live site.";',
'    } else {',
'      draftHint.textContent = "";',
'    }',
'  }',
'  pricesSet.addEventListener("change", checkDraft);',
'  document.addEventListener("input", checkDraft);',
'  checkDraft();',
'',
'  function collect() {',
'    var prices = {};',
'    var inputs = document.querySelectorAll(".pr input");',
'    for (var i = 0; i < inputs.length; i++) {',
'      var el = inputs[i];',
'      prices[el.getAttribute("data-key")] = el.value === "" ? null : el.value;',
'    }',
'    return {',
'      prices: prices,',
'      site: {',
'        siteUrl: document.getElementById("s_siteUrl").value,',
'        pixelId: document.getElementById("s_pixelId").value,',
'        whatsapp: document.getElementById("s_whatsapp").value,',
'        delivery: document.getElementById("s_delivery").value,',
'        payment: document.getElementById("s_payment").value,',
'        pricesSet: pricesSet.checked',
'      }',
'    };',
'  }',
'',
'  function post(url, body) {',
'    return fetch(url, {',
'      method: "POST",',
'      headers: { "Content-Type": "application/json" },',
'      body: JSON.stringify(body || {})',
'    }).then(function(r){ return r.json().then(function(j){ return { ok: r.ok, body: j }; }); });',
'  }',
'',
'  saveBtn.addEventListener("click", function(){',
'    saveBtn.disabled = true;',
'    say("Saving...");',
'    post("/api/save", collect()).then(function(res){',
'      saveBtn.disabled = false;',
'      if (!res.ok) { say(res.body.error || "Save failed.", "bad"); return; }',
'      var n = res.body.changed.length;',
'      say(n ? "Saved " + n + " price" + (n === 1 ? "" : "s") + ". " + res.body.check : "Nothing changed. " + res.body.check,',
'          res.body.checkOk ? "good" : "bad");',
'      if (res.body.checkOk && n) setTimeout(function(){ location.reload(); }, 900);',
'      else if (!res.body.checkOk) pubBtn.disabled = true;',
'    }).catch(function(e){ saveBtn.disabled = false; say(String(e), "bad"); });',
'  });',
'',
'  pubBtn.addEventListener("click", function(){',
'    if (!confirm("Save, then commit and push to GitHub? This updates the live site.")) return;',
'    pubBtn.disabled = true;',
'    say("Publishing...");',
'    post("/api/publish", collect()).then(function(res){',
'      pubBtn.disabled = false;',
'      if (!res.ok) { say(res.body.error || "Publish failed.", "bad"); return; }',
'      say(res.body.message, res.body.pushed ? "good" : "bad");',
'    }).catch(function(e){ pubBtn.disabled = false; say(String(e), "bad"); });',
'  });',
'})();'
].join('\n');

const server = createServer((req, res) => {
  /* Loopback only. A page in the browser cannot reach this by pointing a hostname
     at 127.0.0.1, because the Host header would carry that hostname. */
  const host = String(req.headers.host || '').split(':')[0];
  if (host !== '127.0.0.1' && host !== 'localhost' && host !== '[::1]') {
    res.writeHead(403).end('Loopback only.');
    return;
  }

  const json = (code, obj) => {
    res.writeHead(code, { 'Content-Type': 'application/json' }).end(JSON.stringify(obj));
  };

  const readBody = (cb) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { cb(null, raw ? JSON.parse(raw) : {}); } catch (e) { cb(e); }
    });
  };

  const url = (req.url || '/').split('?')[0];

  if (req.method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(page(snapshot()));
    return;
  }

  if (req.method === 'POST' && url === '/api/save') {
    readBody((err, body) => {
      if (err) return json(400, { error: 'Bad request body.' });
      try {
        const changed = savePrices(body.prices);
        saveSite(body.site);
        const build = run('build.mjs');
        if (!build.ok) return json(200, { changed: changed, check: 'Build failed.', checkOk: false, error: build.out });
        const check = run('_check-store.mjs');
        json(200, {
          changed: changed,
          checkOk: check.ok,
          check: check.ok ? 'Checker passed.' : 'Checker failed: ' + check.out.split('\n').slice(0, 3).join(' ')
        });
      } catch (e) {
        json(400, { error: e.message });
      }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/publish') {
    readBody((err, body) => {
      if (err) return json(400, { error: 'Bad request body.' });
      try {
        const changed = savePrices(body.prices);
        saveSite(body.site);
        const build = run('build.mjs');
        if (!build.ok) return json(200, { pushed: false, message: 'Build failed, nothing pushed.' });
        const check = run('_check-store.mjs');
        if (!check.ok) return json(200, { pushed: false, message: 'Checker failed, nothing pushed. Fix the errors and save again.' });
        if (!hasRemote()) return json(200, { pushed: false, message: 'No git remote. The first publish has to be done by hand.' });

        git(['add', '-A']);
        const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const commit = git(['commit', '-m', 'Update store prices (' + stamp + ')' + (changed.length ? '\n\n' + changed.length + ' price(s) changed.' : '')]);
        if (!commit.ok && !/nothing to commit/i.test(commit.out)) {
          return json(200, { pushed: false, message: 'Commit failed: ' + commit.out.split('\n')[0] });
        }
        const push = git(['push']);
        json(200, {
          pushed: push.ok,
          message: push.ok
            ? 'Pushed. Netlify will redeploy in about a minute.'
            : 'Pushed failed: ' + push.out.split('\n').slice(0, 2).join(' ')
        });
      } catch (e) {
        json(400, { error: e.message });
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found.');
});

server.listen(PORT, HOST, () => {
  console.log('Price admin on http://' + HOST + ':' + PORT + '/');
  console.log('Catalog: ' + CATALOG);
  console.log('Ctrl+C to stop.');
});
