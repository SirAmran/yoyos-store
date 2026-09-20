/* Cart drawer, quantity stepper, toast. */
export const drawer = `
.drawer{position:fixed;inset:0;z-index:100;pointer-events:none}
.drawer .ov{position:absolute;inset:0;background:rgba(13,21,36,.42);opacity:0;transition:opacity .25s ease}
.drawer .panel{position:absolute;top:0;right:0;height:100%;width:min(420px,100%);background:var(--surface);box-shadow:var(--shadow-lg);display:flex;flex-direction:column;transform:translateX(100%);transition:transform .28s cubic-bezier(.2,.7,.3,1)}
.drawer.open{pointer-events:auto}
.drawer.open .ov{opacity:1}
.drawer.open .panel{transform:none}
.dhead{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--border)}
.dhead h3{font-size:17px}
.dclose{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--border-strong)}
.dclose:hover{background:var(--surface-2)}
.dclose svg{width:17px;height:17px}
.dlines{flex:1;overflow-y:auto;padding:8px 20px}
.dline{display:flex;gap:13px;padding:15px 0;border-bottom:1px solid var(--border)}
.dline:last-child{border-bottom:0}
.dline .th{width:62px;height:62px;border-radius:var(--r-sm);background:var(--surface-2);display:grid;place-items:center;flex:none}
.dline .th svg{width:42px;height:42px}
.dline .meta{flex:1;min-width:0}
.dline .nm{font-weight:700;font-size:14.5px;line-height:1.3}
.dline .vr{font-size:12.5px;color:var(--ink-faint);margin-top:2px}
.dline .rw{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px}
.qty{display:inline-flex;align-items:center;border:1px solid var(--border-strong);border-radius:var(--r-pill);overflow:hidden}
.qty button{width:30px;height:30px;display:grid;place-items:center;font-weight:700;color:var(--ink-soft)}
.qty button:hover{background:var(--surface-2);color:var(--ink)}
.qty span{min-width:26px;text-align:center;font-weight:700;font-size:14px;font-variant-numeric:tabular-nums}
.dline .pr{font-weight:800;font-family:var(--font-display);font-size:14.5px}
.dline .rm{font-size:12px;color:var(--ink-faint);text-decoration:underline}
.dline .rm:hover{color:var(--accent)}
.dfoot{padding:18px 20px;border-top:1px solid var(--border);background:var(--surface)}
.dtot{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px}
.dtot .l{font-size:14px;color:var(--ink-soft)}
.dtot .v{font-family:var(--font-display);font-weight:800;font-size:22px;font-variant-numeric:tabular-nums}
.dnote{font-size:12.5px;color:var(--ink-faint);margin-bottom:14px}

.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,140%);z-index:120;background:var(--navy);color:#fff;padding:13px 20px;border-radius:var(--r-pill);font-size:14px;font-weight:600;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:10px;max-width:calc(100% - 32px)}
.toast.show{transform:translate(-50%,0);transition:transform .3s cubic-bezier(.2,.7,.3,1)}
.toast svg{width:16px;height:16px;flex:none;color:#7fe0b0}
`;
