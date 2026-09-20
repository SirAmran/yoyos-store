/* Browser client, part 1: helpers, icons, cart state, toast, badge. */
export const client1 = `
  var qs = function (s, r) { return (r || document).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var ICON = {
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M10.5 5.4h3"/>',
    tablet: '<rect x="4.5" y="3" width="15" height="18" rx="2.2"/><path d="M11 18.4h2"/>',
    laptop: '<rect x="4" y="5" width="16" height="10" rx="1.6"/><path d="M2 18.5h20"/>',
    watch: '<rect x="7" y="7" width="10" height="10" rx="3"/><path d="M9.5 7V3.4h5V7M9.5 17v3.6h5V17"/>',
    console: '<rect x="6" y="2.5" width="12" height="19" rx="2.4"/><path d="M9.6 3.5v17M14.4 3.5v17"/>',
    speaker: '<rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="7.6" cy="12" r="1.6"/><circle cx="16.4" cy="12" r="1.6"/>',
    earbuds: '<circle cx="8" cy="8" r="3.2"/><circle cx="16" cy="8" r="3.2"/><path d="M9.4 10.6v7.2M14.6 10.6v7.2"/>',
    headphones: '<path d="M4 15v-3.5a8 8 0 0 1 16 0V15"/><rect x="2.4" y="13.6" width="4.6" height="7" rx="2.2"/><rect x="17" y="13.6" width="4.6" height="7" rx="2.2"/>',
    box: '<rect x="4" y="5" width="16" height="14" rx="2.2"/><path d="M8 11h8"/>'
  };
  var icon = function (t) {
    var d = ICON[t] || ICON.box;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };

  var CART_KEY = 'yoyos-cart-v1';
  var readCart = function () {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Object.prototype.toString.call(raw) === '[object Array]'
        ? raw.filter(function (l) { return l && l.slug && Number(l.qty) > 0; })
        : [];
    } catch (e) { return []; }
  };
  var cart = readCart();
  var writeCart = function () {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  };
  var cartCount = function () {
    return cart.reduce(function (n, l) { return n + Number(l.qty || 0); }, 0);
  };
  var cartTotal = function () {
    return cart.reduce(function (n, l) { return n + (Number(l.price) || 0) * Number(l.qty || 0); }, 0);
  };
  /* True when any line has no published price. A money total would then be a
     lie: it would quietly leave those lines out and read as the whole order. */
  var anyAsk = function () {
    var a = false;
    cart.forEach(function (l) { if (l.price == null) a = true; });
    return a;
  };
  var totalText = function () {
    if (!cart.length) return money(0);
    return anyAsk() ? 'On request' : money(cartTotal());
  };
  var money = function (n) {
    return n == null ? '' : STORE.symbol + Number(n).toLocaleString('en-NG');
  };

  var toastTimer = null;
  var toast = function (msg) {
    var t = qs('#toast');
    if (!t) return;
    qs('#toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  };

  var paintBadge = function () {
    var n = cartCount();
    qsa('[data-cart-count]').forEach(function (el) {
      el.textContent = n > 99 ? '99+' : String(n);
      el.hidden = n === 0;
    });
  };
`;
