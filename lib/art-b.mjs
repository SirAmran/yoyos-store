import { INK, wrap } from './art-core.mjs';

export const shapesB = {

  console: (u, c) => wrap(200, 262, u,
    '<rect x="48" y="16" width="104" height="226" rx="12" fill="#0b0d12"/>' +
    '<path d="M48 30c0-8 6-14 14-14h5v226h-5c-8 0-14-6-14-14z" fill="#f4f5f7" stroke="' + INK + '"/>' +
    '<path d="M152 30c0-8-6-14-14-14h-5v226h5c8 0 14-6 14-14z" fill="#e6e8ec" stroke="' + INK + '"/>' +
    '<rect x="88" y="42" width="24" height="3" rx="1.5" fill="#39414f"/>' +
    '<rect x="86" y="70" width="28" height="3" rx="1.5" fill="#2b3444"/>' +
    '<rect x="78" y="98" width="44" height="3" rx="1.5" fill="#232c3c"/>' +
    '<rect x="86" y="190" width="28" height="3" rx="1.5" fill="#2b3444"/>' +
    '<path d="M64 242h72l7 9H57z" fill="' + c + '" stroke="' + INK + '"/>'),

  speaker: (u, c) => wrap(200, 220, u,
    '<path d="M42 62c14-16 102-16 116 0" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round" opacity=".85"/>' +
    '<rect x="24" y="58" width="152" height="104" rx="52" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="38" y="72" width="124" height="76" rx="38" fill="rgba(13,21,36,.26)"/>' +
    '<circle cx="56" cy="110" r="17" fill="rgba(13,21,36,.4)"/>' +
    '<circle cx="144" cy="110" r="17" fill="rgba(13,21,36,.4)"/>' +
    '<rect x="92" y="80" width="16" height="60" rx="8" fill="rgba(255,255,255,.1)"/>' +
    '<rect x="24" y="58" width="152" height="104" rx="52" fill="url(#s' + u + ')"/>'),

  earbuds: (u, c) => wrap(200, 200, u,
    '<circle cx="74" cy="60" r="22" fill="#f7f8fa" stroke="' + INK + '"/>' +
    '<rect x="84" y="74" width="13" height="38" rx="6.5" fill="#f7f8fa" stroke="' + INK + '"/>' +
    '<circle cx="126" cy="60" r="22" fill="#f2f3f6" stroke="' + INK + '"/>' +
    '<rect x="103" y="74" width="13" height="38" rx="6.5" fill="#f2f3f6" stroke="' + INK + '"/>' +
    '<circle cx="74" cy="60" r="8" fill="rgba(13,21,36,.22)"/>' +
    '<circle cx="126" cy="60" r="8" fill="rgba(13,21,36,.22)"/>' +
    '<rect x="44" y="108" width="112" height="76" rx="26" fill="#f7f8fa" stroke="' + INK + '"/>' +
    '<rect x="44" y="108" width="112" height="76" rx="26" fill="url(#s' + u + ')"/>' +
    '<rect x="62" y="156" width="76" height="5" rx="2.5" fill="rgba(13,21,36,.14)"/>' +
    '<circle cx="100" cy="176" r="4" fill="' + c + '" opacity=".55"/>'),

  headphones: (u, c) => wrap(220, 220, u,
    '<path d="M44 142v-32a66 66 0 0 1 132 0v32" fill="none" stroke="' + c + '" stroke-width="19" stroke-linecap="round"/>' +
    '<path d="M44 142v-32a66 66 0 0 1 132 0v32" fill="none" stroke="url(#s' + u + ')" stroke-width="19" stroke-linecap="round"/>' +
    '<rect x="22" y="124" width="46" height="68" rx="21" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="152" y="124" width="46" height="68" rx="21" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="31" y="135" width="28" height="46" rx="14" fill="rgba(13,21,36,.2)"/>' +
    '<rect x="161" y="135" width="28" height="46" rx="14" fill="rgba(13,21,36,.2)"/>'),

  box: (u, c) => wrap(200, 200, u,
    '<rect x="38" y="52" width="124" height="104" rx="16" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="38" y="52" width="124" height="104" rx="16" fill="url(#s' + u + ')"/>' +
    '<rect x="60" y="88" width="80" height="8" rx="4" fill="rgba(13,21,36,.2)"/>' +
    '<rect x="76" y="108" width="48" height="8" rx="4" fill="rgba(13,21,36,.14)"/>')
};
