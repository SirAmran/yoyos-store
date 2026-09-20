/* Top strip, sticky header, nav, search, category bar. */
export const head = `
.topbar{background:var(--navy);color:rgba(255,255,255,.82);font-size:12.5px}
.topbar .wrap{display:flex;align-items:center;justify-content:center;gap:22px;min-height:36px;flex-wrap:wrap;padding-block:7px}
.topbar span{display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.topbar svg{width:14px;height:14px;flex:none;opacity:.75}
.topbar b{color:#fff;font-weight:600}

.hdr{position:sticky;top:0;z-index:60;background:rgba(255,255,255,.92);backdrop-filter:saturate(160%) blur(12px);border-bottom:1px solid var(--border)}
.hdr .wrap{display:flex;align-items:center;gap:16px;min-height:var(--headh)}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:800;font-size:18px;letter-spacing:-.03em;flex:none}
.brand .mark{width:30px;height:30px;border-radius:9px;display:block;flex:none}
.brand small{display:block;font-family:var(--font-body);font-weight:600;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}

.nav{display:flex;align-items:center;gap:2px;margin-left:8px}
.nav a{padding:9px 12px;border-radius:var(--r-sm);font-size:14.5px;font-weight:600;color:var(--ink-soft);white-space:nowrap}
.nav a:hover{background:var(--surface-2);color:var(--ink)}
.nav a[aria-current=page]{color:var(--ink);background:var(--surface-2)}

.search{position:relative;margin-left:auto;flex:1 1 200px;max-width:320px}
.search input{width:100%;padding:11px 14px 11px 40px;border-radius:var(--r-pill);border:1px solid var(--border-strong);background:var(--surface-2);font-size:14.5px}
.search input:focus{outline:0;border-color:var(--accent);background:var(--surface);box-shadow:0 0 0 3px var(--accent-soft)}
.search .mag{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--ink-faint);pointer-events:none}
.sres{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);box-shadow:var(--shadow-lg);max-height:min(60vh,420px);overflow-y:auto;z-index:70}
.sres a{display:flex;align-items:center;gap:11px;padding:11px 14px;border-bottom:1px solid var(--border)}
.sres a:last-child{border-bottom:0}
.sres a:hover{background:var(--surface-2)}
.sres .tx{display:block;min-width:0}
.sres .t{display:block;font-size:14px;font-weight:600;line-height:1.3}
.sres .s{display:block;font-size:12px;color:var(--ink-faint)}
.sres .th{width:34px;height:34px;border-radius:8px;background:var(--surface-2);display:grid;place-items:center;flex:none}
.sres .th svg{width:22px;height:22px}
.sres .none{padding:16px 14px;font-size:14px;color:var(--ink-soft)}

.cartbtn{position:relative;display:inline-flex;align-items:center;gap:9px;padding:10px 16px;border-radius:var(--r-pill);background:var(--navy);color:#fff;font-weight:700;font-size:14px;flex:none}
.cartbtn:hover{background:var(--navy-2)}
.cartbtn .ic{width:17px;height:17px}
.cartbtn .n{position:absolute;top:-5px;right:-5px;min-width:20px;height:20px;padding:0 5px;border-radius:var(--r-pill);background:var(--accent);color:#fff;font-size:11.5px;font-weight:800;display:grid;place-items:center;border:2px solid var(--surface)}
.cartbtn .n[hidden]{display:none}

.menubtn{display:none;width:42px;height:42px;border-radius:var(--r-sm);border:1px solid var(--border-strong);align-items:center;justify-content:center;flex:none}
.menubtn svg{width:20px;height:20px}
.mnav{display:none;border-bottom:1px solid var(--border);background:var(--surface)}
.mnav.open{display:block}
.mnav .wrap{padding-block:10px;display:grid;gap:2px}
.mnav a{padding:12px 10px;border-radius:var(--r-sm);font-weight:600;font-size:15px}
.mnav a:hover{background:var(--surface-2)}

.catbar{background:var(--surface);border-bottom:1px solid var(--border);overflow-x:auto}
.catbar ul{display:flex;gap:4px;padding:9px 0;min-width:max-content}
.catbar a{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:var(--r-pill);font-size:14px;font-weight:600;color:var(--ink-soft);white-space:nowrap}
.catbar a:hover{background:var(--surface-2);color:var(--ink)}
.catbar a[aria-current=page]{background:var(--navy);color:#fff}
.catbar svg{width:16px;height:16px}

@media (max-width:900px){
  .nav{display:none}
  .menubtn{display:inline-flex}
  .search{max-width:none}
  .brand small{display:none}
}
@media (max-width:560px){
  .cartbtn span.lbl{display:none}
  .cartbtn{padding:11px 13px}
}
`;
