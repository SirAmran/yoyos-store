/* Shared bits for the product illustrations. */
export const INK = 'rgba(13,21,36,.16)';
export const DEF = '#c9ced8';

export const defs = uid =>
  '<defs>' +
  '<linearGradient id="g' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
  '<stop offset="0" stop-color="#2b3346"/><stop offset="1" stop-color="#0d1220"/>' +
  '</linearGradient>' +
  '<linearGradient id="s' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0" stop-color="#ffffff" stop-opacity=".34"/>' +
  '<stop offset=".55" stop-color="#ffffff" stop-opacity="0"/>' +
  '</linearGradient>' +
  '</defs>';

export const wrap = (w, h, uid, inner) =>
  '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
  defs(uid) + inner + '</svg>';
