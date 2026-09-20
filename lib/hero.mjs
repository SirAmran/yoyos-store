/* Home hero, trust strip, category header, breadcrumb. */
export const hero = `
.hero{position:relative;background:var(--navy);color:#fff;overflow:hidden}
.hero::after{content:'';position:absolute;top:-30%;right:-12%;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(226,83,20,.30),transparent 62%);pointer-events:none}
.hero .wrap{position:relative;z-index:1;padding-block:clamp(48px,8vw,96px);display:grid;gap:clamp(30px,5vw,56px);grid-template-columns:1.05fr .95fr;align-items:center}
.hero h1{color:#fff;margin-bottom:16px}
.hero h1 em{font-style:normal;color:#ff9a5e}
.hero .lede{font-size:clamp(15.5px,1.7vw,18px);color:rgba(255,255,255,.76);max-width:52ch;line-height:1.6}
.hero .cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}
.hero .btn-ghost{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.24)}
.hero .btn-ghost:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.4)}
.hero .chips{display:flex;gap:18px;flex-wrap:wrap;margin-top:26px;font-size:13.5px;color:rgba(255,255,255,.7)}
.hero .chips span{display:inline-flex;align-items:center;gap:8px}
.hero .chips svg{width:15px;height:15px;color:#7fe0b0;flex:none}
.heroart{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.heroart .tile{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:var(--r-lg);padding:18px;display:grid;place-items:center;aspect-ratio:1/1}
.heroart .tile svg{width:auto;height:100%;max-height:120px}
/* First and last span both columns, so the grid closes as wide / square square /
   wide. Without the last one the fourth tile sits alone in a half-empty row. */
.heroart .tile:nth-child(1),.heroart .tile:nth-child(4){grid-column:span 2;aspect-ratio:2/1}
.heroart .tile:nth-child(1) svg{max-height:150px}
@media (max-width:900px){
  .hero .wrap{grid-template-columns:1fr}
  .heroart{order:-1}
}

.trust{background:var(--surface);border-bottom:1px solid var(--border)}
.trust .wrap{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:6px}
.trust .it{display:flex;gap:12px;align-items:flex-start;padding:22px 4px}
.trust .ic{width:38px;height:38px;border-radius:11px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;flex:none}
.trust .ic svg{width:19px;height:19px}
.trust .it b{display:block;font-family:var(--font-display);font-size:14.5px;margin-bottom:2px}
.trust .it small{font-size:13px;color:var(--ink-soft);line-height:1.45;display:block}

.crumb{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-faint);padding-top:22px;flex-wrap:wrap}
.crumb a:hover{color:var(--ink)}
.crumb svg{width:13px;height:13px;opacity:.5}

.chead{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;flex-wrap:wrap;padding-block:26px 22px;border-bottom:1px solid var(--border)}
.chead h1{font-size:clamp(26px,4vw,40px);margin-bottom:8px}
.chead p{color:var(--ink-soft);font-size:15.5px;max-width:62ch}
.chead .n{font-size:13px;color:var(--ink-faint);font-weight:600;white-space:nowrap}
`;
