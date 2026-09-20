/* Buttons, chips, badges, form fields, cards, section headers. One exported string. */
export const ui = `
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  font-family:var(--font-display);font-weight:700;font-size:15px;
  padding:13px 22px;border-radius:var(--r-pill);border:1px solid transparent;
  transition:transform .15s ease,background .15s ease,box-shadow .15s ease,color .15s ease;
  white-space:nowrap;
}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 6px 18px rgba(200,68,15,.24)}
.btn-primary:hover{background:var(--accent-hi)}
.btn-dark{background:var(--navy);color:#fff}
.btn-dark:hover{background:var(--navy-2)}
.btn-ghost{background:var(--surface);color:var(--ink);border-color:var(--border-strong)}
.btn-ghost:hover{border-color:var(--ink);background:var(--surface-2)}
.btn-quiet{background:transparent;color:var(--ink);border-color:transparent;padding:9px 12px}
.btn-quiet:hover{background:var(--surface-2)}
.btn-sm{padding:9px 16px;font-size:13.5px}
.btn-block{width:100%}
.btn[disabled],.btn[aria-disabled=true]{opacity:.5;pointer-events:none}
.btn[hidden]{display:none}
.btn .ic{width:18px;height:18px;flex:none}

.chip{
  display:inline-flex;align-items:center;gap:7px;
  padding:9px 15px;border-radius:var(--r-pill);
  background:var(--surface);border:1px solid var(--border-strong);
  font-size:13.5px;font-weight:600;color:var(--ink-soft);
  transition:border-color .15s,color .15s,background .15s;
}
.chip:hover{border-color:var(--ink-faint);color:var(--ink)}
.chip[aria-pressed=true]{background:var(--navy);border-color:var(--navy);color:#fff}

.badge{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  padding:5px 11px;border-radius:var(--r-pill);
  background:var(--surface-2);color:var(--ink-soft);
}
.badge-accent{background:var(--accent-soft);color:var(--accent)}
.badge-ok{background:var(--success-soft);color:var(--success)}
.badge-warn{background:var(--warn-soft);color:var(--warn)}
.badge-dark{background:var(--navy);color:#fff}

.notice{
  display:flex;gap:12px;align-items:flex-start;
  padding:14px 16px;border-radius:var(--r-md);
  background:var(--warn-soft);color:var(--warn);
  font-size:14px;line-height:1.5;border:1px solid rgba(138,90,0,.16);
}
.notice .ic{width:18px;height:18px;flex:none;margin-top:2px}
.notice-info{background:var(--surface-2);color:var(--ink-soft);border-color:var(--border)}

.shead{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:26px}
.shead h2{margin-bottom:6px}
.shead p{color:var(--ink-soft);font-size:15.5px;max-width:60ch}
.shead .link{font-weight:700;font-size:14.5px;color:var(--accent);display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.shead .link:hover{color:var(--accent-hi)}

.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);box-shadow:var(--shadow-sm);
}

.grid{display:grid;gap:clamp(14px,2vw,22px);grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
.grid-2{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}

.pcard{
  display:flex;flex-direction:column;overflow:hidden;
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);box-shadow:var(--shadow-sm);
  transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
}
.pcard:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--border-strong)}
.pcard-art{
  position:relative;aspect-ratio:4/3;
  background:linear-gradient(160deg,var(--surface-2),var(--surface-3));
  display:flex;align-items:center;justify-content:center;padding:18px;
}
.pcard-art svg{width:auto;height:100%;max-height:190px}
.pcard-tag{position:absolute;top:12px;left:12px}
.pcard-body{padding:15px 16px 17px;display:flex;flex-direction:column;gap:5px;flex:1}
.pcard-name{font-family:var(--font-display);font-weight:700;font-size:15.5px;line-height:1.3}
.pcard-blurb{font-size:13.5px;color:var(--ink-soft);line-height:1.45;flex:1}
.pcard-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}
.price{font-family:var(--font-display);font-weight:800;font-size:16px;letter-spacing:-.01em}
.price-ask{font-size:13px;font-weight:700;color:var(--accent)}
.dots{display:flex;gap:5px;align-items:center}
/* Same reason as the pdp swatches: a White dot on a white card needs its own
   edge, or the colour is simply not there. */
.dot{width:14px;height:14px;border-radius:50%;border:1px solid rgba(13,21,36,.28);box-shadow:inset 0 0 0 1px rgba(13,21,36,.1)}
.dot-more{font-size:11.5px;color:var(--ink-faint);font-weight:600}

.field{display:flex;flex-direction:column;gap:7px}
.field label{font-size:13.5px;font-weight:700;color:var(--ink)}
.field .hint{font-size:12.5px;color:var(--ink-faint)}
.field input,.field select,.field textarea{
  width:100%;padding:12px 14px;border-radius:var(--r-sm);
  border:1px solid var(--border-strong);background:var(--surface);
  font-size:15px;transition:border-color .15s,box-shadow .15s;
}
.field input:focus,.field select:focus,.field textarea:focus{
  outline:0;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);
}
.field textarea{min-height:96px;resize:vertical}
.field-row{display:grid;gap:14px;grid-template-columns:1fr 1fr}
@media (max-width:560px){.field-row{grid-template-columns:1fr}}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

.pill-row{display:flex;flex-wrap:wrap;gap:9px}
.empty{padding:52px 22px;text-align:center;color:var(--ink-soft)}
.empty h3{margin-bottom:8px;color:var(--ink)}

.sect-flush{padding-top:0}
.mt-lg{margin-top:clamp(24px,4vw,44px)}
.pad-tall{padding-block:clamp(60px,12vw,140px)}
.panel{padding:clamp(20px,3vw,30px)}
.panel h3{margin-bottom:12px}
.panel .lead{margin-bottom:18px}
.link-plain{font-size:13.5px;font-weight:700;color:var(--accent)}
.qty-lbl{font-size:14px;color:var(--ink-soft)}
.sel-line{font-size:13.5px;color:var(--ink-soft);margin-bottom:14px}
.tel-lg{font-family:var(--font-display);font-weight:800;font-size:20px;margin-bottom:18px}
.tick-list{display:grid;gap:10px;color:var(--ink-soft)}
.tick-list li{display:flex;gap:10px;align-items:flex-start}
.tick-list .ic{color:var(--success);flex:none;margin-top:2px}
.tick-list .ic svg{width:17px;height:17px}
`;
