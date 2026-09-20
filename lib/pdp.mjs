/* Product detail page: gallery, buy box, swatches, options, spec table. */
export const pdp = `
.pdp{display:grid;gap:clamp(26px,4vw,52px);grid-template-columns:1.05fr .95fr;padding-block:clamp(26px,4vw,44px);align-items:start}
@media (max-width:880px){.pdp{grid-template-columns:1fr}}
.gal{position:sticky;top:calc(var(--headh) + 16px)}
@media (max-width:880px){.gal{position:static}}
.gal .main{background:linear-gradient(165deg,var(--surface-2),var(--surface-3));border:1px solid var(--border);border-radius:var(--r-lg);aspect-ratio:4/3;display:grid;place-items:center;padding:34px;position:relative;overflow:hidden}
.gal .main .shot{display:none}
.gal .main .shot.on{display:grid;place-items:center;height:100%}
.gal .main svg{width:auto;height:100%;max-height:340px}
.gal .flag{position:absolute;top:16px;left:16px}
.gal .thumbs{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}
.gal .thumbs button{width:66px;height:66px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surface-2);display:grid;place-items:center;transition:border-color .15s}
.gal .thumbs button[aria-pressed=true]{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-soft)}
.gal .thumbs svg{width:42px;height:42px}

.buy h1{font-size:clamp(24px,3.4vw,36px);margin-bottom:10px}
.buy .sub{color:var(--ink-soft);font-size:15.5px;line-height:1.6;margin-bottom:20px}
.buy .pricerow{display:flex;align-items:baseline;gap:12px;margin-bottom:6px;flex-wrap:wrap}
.buy .bigprice{font-family:var(--font-display);font-weight:800;font-size:clamp(26px,3.6vw,34px);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.buy .askprice{font-family:var(--font-display);font-weight:800;font-size:clamp(20px,2.6vw,26px);color:var(--accent)}
.buy .payline{font-size:13.5px;color:var(--ink-soft);margin-bottom:20px}
.opt{margin-bottom:18px}
.opt .lb{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:9px}
.opt .lb b{font-size:13.5px}
.opt .lb span{font-size:13px;color:var(--ink-soft);font-weight:600}
.swatches{display:flex;gap:9px;flex-wrap:wrap}
/* The inset hairline keeps pale colours (Silver, Cloud White, Starlight)
   from vanishing into the white card behind them. */
.sw{width:38px;height:38px;border-radius:50%;border:2px solid transparent;box-shadow:0 0 0 1px rgba(13,21,36,.3),inset 0 0 0 1px rgba(13,21,36,.12);position:relative;transition:box-shadow .15s}
.sw:hover{box-shadow:0 0 0 1px rgba(13,21,36,.6),inset 0 0 0 1px rgba(13,21,36,.12)}
.sw[aria-pressed=true]{border-color:var(--surface);box-shadow:0 0 0 2px var(--accent),inset 0 0 0 1px rgba(13,21,36,.12)}
.opts{display:flex;gap:9px;flex-wrap:wrap}
.buybox{border-top:1px solid var(--border);margin-top:22px;padding-top:20px;display:grid;gap:12px}
.buybox .row{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px}
.buybox .row .k{color:var(--ink-soft);display:inline-flex;align-items:center;gap:9px}
.buybox .row svg{width:16px;height:16px;color:var(--success);flex:none}
.buybox .row .v{font-weight:700;text-align:right}
.qtyw{display:flex;align-items:center;gap:12px;margin:20px 0 14px}
.qtyw .qty{border-radius:var(--r-pill)}
.qtyw .qty button{width:38px;height:38px}
.qtyw .qty span{min-width:34px;font-size:15px}

.specs{width:100%;border-collapse:collapse;font-size:14.5px}
.specs th,.specs td{text-align:left;padding:13px 14px;border-bottom:1px solid var(--border)}
.specs th{width:38%;font-weight:600;color:var(--ink-soft);background:var(--surface-2);font-size:14px}
.specs tr:last-child th,.specs tr:last-child td{border-bottom:0}
.specwrap{border:1px solid var(--border);border-radius:var(--r-md);overflow:hidden;background:var(--surface)}

.faq{display:grid;gap:10px}
.faq details{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);overflow:hidden}
.faq summary{padding:16px 18px;font-weight:700;font-size:15px;font-family:var(--font-display);cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:14px;align-items:center}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:'+';font-size:20px;color:var(--ink-faint);font-weight:400;line-height:1}
.faq details[open] summary::after{content:'-'}
.faq .a{padding:0 18px 17px;font-size:14.5px;color:var(--ink-soft);line-height:1.65}
`;
