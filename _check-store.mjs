#!/usr/bin/env node
/* Checks the generated store. Run after build.mjs. Exits 1 on any failure. */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

const walk = (dir, out) => {
  const acc = out || [];
  readdirSync(dir).forEach((e) => {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  });
  return acc;
};

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));
const fail = [];
const warn = [];

const stripStyle = (s) => s.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/ style="[^"]*"/g, '');
const stripScript = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '');

html.forEach((f) => {
  const rel = relative(DIST, f).replace(/\\/g, '/');
  const src = readFileSync(f, 'utf8');
  const visible = stripScript(stripStyle(src));
  const say = (m) => fail.push(rel + ': ' + m);

  if (/[–—]/.test(visible)) say('em or en dash in visible text');
  if (/--/.test(visible)) say('double hyphen in visible text');

  if (!/<title>[^<]+<\/title>/.test(src)) say('missing or empty title');
  if (!/<meta name="description" content="[^"]+"/.test(src)) say('missing meta description');
  if (!/<meta name="viewport"/.test(src)) say('missing viewport');
  if (/aggregateRating/.test(src)) say('aggregateRating present, must not be');

  if (!/id="cartDrawer"/.test(src)) say('no cart drawer');
  if (!/id="searchIndex"/.test(src)) say('no search index');
  if (!/id="cartLines"/.test(src)) say('no cart lines container');
  if (!/data-open-cart/.test(src)) say('no cart button');
  if (!/<script>\(function\(\)/.test(src)) say('no client script');

  const ld = src.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
  ld.forEach((block) => {
    const body = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    try { JSON.parse(body); } catch (e) { say('JSON-LD does not parse: ' + e.message); }
  });

  const hrefs = (src.match(/href="(\/[^"#?]*)"/g) || []).map((h) => h.slice(7, -1));
  hrefs.forEach((h) => {
    if (h.startsWith('//')) return;
    const target = h.endsWith('/') ? join(DIST, h, 'index.html') : join(DIST, h);
    if (!existsSync(target)) fail.push(rel + ': dead internal link ' + h);
  });

  (src.match(/<img [^>]*>/g) || []).forEach((tag) => {
    if (!/alt="/.test(tag)) say('img without alt: ' + tag.slice(0, 70));
  });
});

const placeholders = /(TODO|FIXME|Lorem ipsum)/;
html.forEach((f) => {
  const src = readFileSync(f, 'utf8');
  if (placeholders.test(src)) warn.push(relative(DIST, f).replace(/\\/g, '/') + ': placeholder text');
});

console.log('Checked ' + html.length + ' pages, ' + files.length + ' files.');
if (warn.length) { console.log('\nWarnings:'); warn.forEach((w) => console.log('  ' + w)); }
if (fail.length) {
  console.log('\nFailures (' + fail.length + '):');
  fail.slice(0, 40).forEach((x) => console.log('  ' + x));
  process.exit(1);
}
console.log('All checks passed.');
