/* Site footer. */
export const foot = `
.ft{background:var(--navy);color:rgba(255,255,255,.66);margin-top:var(--sect)}
.ft .wrap{padding-block:clamp(40px,6vw,64px)}
.ftop{display:grid;gap:34px;grid-template-columns:1.4fr 1fr 1fr 1.2fr}
.ft .brand{color:#fff;margin-bottom:12px}
.ft .brand .mark{background:var(--accent)}
.ft p{font-size:14px;line-height:1.65;max-width:38ch}
.ft h4{color:#fff;font-family:var(--font-display);font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px}
.ft ul{display:grid;gap:9px}
.ft a{font-size:14px}
.ft a:hover{color:#fff}
.ft .tel{color:#fff;font-weight:700;font-size:15px}
.fbot{border-top:1px solid rgba(255,255,255,.12);margin-top:38px;padding-top:22px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px}
.fwa{display:inline-flex;align-items:center;gap:9px;background:var(--success);color:#fff;padding:12px 18px;border-radius:var(--r-pill);font-weight:700;font-size:14.5px;margin-top:16px}
.fwa:hover{filter:brightness(1.08)}
.fwa svg{width:17px;height:17px}
.ft .pay{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}
.ft .pay span{font-size:12px;font-weight:600;padding:7px 12px;border-radius:var(--r-pill);background:rgba(255,255,255,.09);color:rgba(255,255,255,.8)}
@media (max-width:1000px){.ftop{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.ftop{grid-template-columns:1fr}}
`;
