/* Yoyos Store, design tokens, reset, typography, motion. One exported string. */
export const tokens = `
:root{
  --bg:#f7f8fa;
  --surface:#ffffff;
  --surface-2:#f2f4f7;
  --surface-3:#e8ebf0;
  --ink:#12151b;
  --ink-soft:#5a6273;
  --ink-faint:#8b93a3;
  --navy:#0d1524;
  --navy-2:#162034;
  --navy-3:#22304a;
  --accent:#c8440f;
  --accent-hi:#e25314;
  --accent-soft:#fdeee7;
  --success:#16794f;
  --success-soft:#e8f6ef;
  --warn:#8a5a00;
  --warn-soft:#fff6e5;
  --border:#e3e5ea;
  --border-strong:#d2d6de;
  --font-display:'Sora','Inter',sans-serif;
  --font-body:'Inter','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
  --r-sm:10px; --r-md:16px; --r-lg:22px; --r-pill:999px;
  --shadow-sm:0 1px 2px rgba(13,21,36,.06), 0 1px 3px rgba(13,21,36,.05);
  --shadow-md:0 4px 14px rgba(13,21,36,.07), 0 2px 6px rgba(13,21,36,.04);
  --shadow-lg:0 18px 44px rgba(13,21,36,.13), 0 6px 16px rgba(13,21,36,.06);
  --maxw:1200px;
  --pad:clamp(16px,4.5vw,40px);
  --sect:clamp(46px,7vw,86px);
  --headh:64px;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  margin:0;background:var(--bg);color:var(--ink);
  font-family:var(--font-body);font-size:16px;line-height:1.6;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
}
body.locked{overflow:hidden}
img,svg,video{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer;background:none;border:0;padding:0}
h1,h2,h3,h4{font-family:var(--font-display);line-height:1.12;letter-spacing:-.02em;margin:0}
h1{font-size:clamp(30px,5.2vw,54px);font-weight:800}
h2{font-size:clamp(23px,3.4vw,34px);font-weight:700}
h3{font-size:clamp(17px,2.1vw,21px);font-weight:700}
h4{font-size:15px;font-weight:700;letter-spacing:0}
p{margin:0}
ul,ol{margin:0;padding:0;list-style:none}
hr{border:0;border-top:1px solid var(--border);margin:0}
.wrap{max-width:var(--maxw);margin:0 auto;padding-inline:var(--pad)}
.sect{padding-block:var(--sect)}
.sect-tight{padding-block:clamp(28px,4vw,52px)}
.muted{color:var(--ink-soft)}
.faint{color:var(--ink-faint)}
.money{font-variant-numeric:tabular-nums}
.center{text-align:center}
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;left:-999px;top:0;z-index:200;background:var(--navy);color:#fff;padding:12px 18px;border-radius:0 0 var(--r-sm) 0}
.skip:focus{left:0}
.reveal{opacity:0;transform:translateY(14px)}
.reveal.in{opacity:1;transform:none;transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.3,1)}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1;transform:none}
  .reveal.in{transition:none}
  *{animation-duration:.001ms !important;transition-duration:.001ms !important}
}
`;
