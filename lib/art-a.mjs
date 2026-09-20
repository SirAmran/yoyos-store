import { INK, wrap } from './art-core.mjs';

export const shapesA = {

  phone: (u, c) => wrap(200, 260, u,
    '<rect x="42" y="8" width="116" height="244" rx="27" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="48" y="14" width="104" height="232" rx="22" fill="#0b0d12"/>' +
    '<rect x="52" y="18" width="96" height="224" rx="19" fill="url(#g' + u + ')"/>' +
    '<rect x="52" y="18" width="96" height="224" rx="19" fill="url(#s' + u + ')"/>' +
    '<rect x="89" y="26" width="22" height="7" rx="3.5" fill="#05060a"/>' +
    '<rect x="37" y="70" width="5" height="24" rx="2.5" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="37" y="104" width="5" height="40" rx="2.5" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="158" y="84" width="5" height="52" rx="2.5" fill="' + c + '" stroke="' + INK + '"/>'),

  tablet: (u, c) => wrap(220, 260, u,
    '<rect x="30" y="16" width="160" height="228" rx="18" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="37" y="23" width="146" height="214" rx="13" fill="#0b0d12"/>' +
    '<rect x="41" y="27" width="138" height="206" rx="10" fill="url(#g' + u + ')"/>' +
    '<rect x="41" y="27" width="138" height="206" rx="10" fill="url(#s' + u + ')"/>' +
    '<circle cx="110" cy="34" r="2" fill="#05060a"/>'),

  laptop: (u, c) => wrap(260, 180, u,
    '<rect x="40" y="6" width="180" height="122" rx="11" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="47" y="13" width="166" height="108" rx="7" fill="#0b0d12"/>' +
    '<rect x="50" y="16" width="160" height="102" rx="5" fill="url(#g' + u + ')"/>' +
    '<rect x="50" y="16" width="160" height="102" rx="5" fill="url(#s' + u + ')"/>' +
    '<rect x="119" y="9" width="22" height="3" rx="1.5" fill="#05060a"/>' +
    '<path d="M20 130h220l12 17a5 5 0 0 1-4 8H12a5 5 0 0 1-4-8z" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="106" y="139" width="48" height="6" rx="3" fill="rgba(13,21,36,.1)"/>'),

  watch: (u, c) => wrap(160, 230, u,
    '<rect x="58" y="4" width="44" height="72" rx="21" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="58" y="154" width="44" height="72" rx="21" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="38" y="56" width="84" height="118" rx="27" fill="' + c + '" stroke="' + INK + '"/>' +
    '<rect x="45" y="63" width="70" height="104" rx="21" fill="#0b0d12"/>' +
    '<rect x="48" y="66" width="64" height="98" rx="18" fill="url(#g' + u + ')"/>' +
    '<rect x="48" y="66" width="64" height="98" rx="18" fill="url(#s' + u + ')"/>' +
    '<rect x="122" y="88" width="6" height="22" rx="3" fill="' + c + '" stroke="' + INK + '"/>')
};
