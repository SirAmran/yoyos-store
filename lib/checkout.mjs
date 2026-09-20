/* Checkout, order summary, confirmation, prose pages, draft banner. */
export const checkout = `
.draft{background:#b3261e;color:#fff;font-size:13.5px;font-weight:600;text-align:center;padding:9px 16px;letter-spacing:.01em}
.draft[hidden]{display:none}

.co{display:grid;gap:clamp(24px,4vw,44px);grid-template-columns:1.25fr .75fr;padding-block:clamp(24px,4vw,40px);align-items:start}
@media (max-width:880px){.co{grid-template-columns:1fr}}
.coform{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-sm);padding:clamp(20px,3vw,30px)}
.coform h2{font-size:20px;margin-bottom:6px}
.coform .lead{font-size:14.5px;color:var(--ink-soft);margin-bottom:22px}
.coform .grp{display:grid;gap:15px;margin-bottom:22px}
.coform .grp:last-of-type{margin-bottom:0}
.coform h4{font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:2px}
.field.err input,.field.err select,.field.err textarea{border-color:#c0392b;box-shadow:0 0 0 3px rgba(192,57,43,.1)}
.field .msg{font-size:12.5px;color:#c0392b;font-weight:600}
.fstatus{display:none;margin-top:16px;padding:13px 15px;border-radius:var(--r-sm);background:#fdecea;color:#a3271d;font-size:14px;line-height:1.5}
.fstatus.show{display:block}

.sum{position:sticky;top:calc(var(--headh) + 16px);background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-sm);overflow:hidden}
@media (max-width:880px){.sum{position:static}}
.sum .sh{padding:17px 20px;border-bottom:1px solid var(--border);font-family:var(--font-display);font-weight:700;font-size:15px}
.sum .lines{padding:6px 20px;max-height:340px;overflow-y:auto}
.sum .line{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border)}
.sum .line:last-child{border-bottom:0}
.sum .line .th{width:50px;height:50px;border-radius:9px;background:var(--surface-2);display:grid;place-items:center;flex:none}
.sum .line .th svg{width:34px;height:34px}
.sum .line .m{flex:1;min-width:0}
.sum .line .nm{font-weight:700;font-size:13.5px;line-height:1.3}
.sum .line .vr{font-size:12px;color:var(--ink-faint)}
.sum .line .p{font-weight:700;font-size:13.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
.sum .tot{padding:16px 20px;border-top:1px solid var(--border);background:var(--surface-2)}
.sum .tot .r{display:flex;justify-content:space-between;font-size:14px;color:var(--ink-soft);margin-bottom:9px}
.sum .tot .r.grand{font-size:15px;color:var(--ink);font-weight:700;margin-bottom:0}
.sum .tot .r.grand span:last-child{font-family:var(--font-display);font-weight:800;font-size:21px;font-variant-numeric:tabular-nums}
.sum .note{padding:14px 20px;font-size:12.5px;color:var(--ink-faint);line-height:1.55;border-top:1px solid var(--border)}

.done{display:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-md);padding:clamp(24px,3.4vw,38px);text-align:center}
.done.show{display:block}
.done .tick{width:60px;height:60px;border-radius:50%;background:var(--success-soft);color:var(--success);display:grid;place-items:center;margin:0 auto 18px}
.done .tick svg{width:29px;height:29px}
.done h2{margin-bottom:10px}
.done .ref{display:inline-block;font-family:var(--font-display);font-weight:800;font-size:17px;letter-spacing:.02em;background:var(--surface-2);border:1px dashed var(--border-strong);padding:11px 18px;border-radius:var(--r-sm);margin:6px 0 20px}
.done .facts{text-align:left;max-width:460px;margin:0 auto 22px;border-top:1px solid var(--border)}
.done .facts div{display:flex;justify-content:space-between;gap:16px;padding:13px 2px;border-bottom:1px solid var(--border);font-size:14.5px}
.done .facts .k{color:var(--ink-soft)}
.done .facts .v{font-weight:700;text-align:right}
.done .tip{font-size:14px;color:var(--ink-soft);background:var(--warn-soft);color:var(--warn);padding:14px 16px;border-radius:var(--r-sm);max-width:460px;margin:0 auto 22px;text-align:left;line-height:1.55}
.done .sendrow{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:20px}
.done .sendrow .btn{margin:0}
.tel-lg.mail{font-size:16px;word-break:break-all;margin-bottom:18px}

.prose{max-width:70ch;padding-block:clamp(26px,4vw,44px)}
.prose h2{font-size:21px;margin:34px 0 12px}
.prose h2:first-child{margin-top:0}
.prose p,.prose li{font-size:15.5px;color:var(--ink-soft);line-height:1.75}
.prose p{margin-bottom:14px}
.prose ul{display:grid;gap:8px;margin-bottom:14px}
.prose li{position:relative;padding-left:20px}
.prose li::before{content:'';position:absolute;left:2px;top:10px;width:6px;height:6px;border-radius:50%;background:var(--accent)}
.prose a{color:var(--accent);font-weight:600;text-decoration:underline}
`;
