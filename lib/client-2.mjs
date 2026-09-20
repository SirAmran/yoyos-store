/* Browser client, part 2: cart drawer render, open and close, add to cart. */
export const client2 = `
  var drawer = qs('#cartDrawer');
  var openCart = function () {
    if (!drawer) return;
    paintCart();
    drawer.classList.add('open');
    document.body.classList.add('locked');
  };
  var closeCart = function () {
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('locked');
  };

  var paintCart = function () {
    var box = qs('#cartLines');
    if (!box) return;
    box.textContent = '';
    if (!cart.length) {
      var e = document.createElement('div');
      e.className = 'empty';
      var h = document.createElement('h3');
      h.textContent = 'Your cart is empty';
      var p = document.createElement('p');
      p.textContent = 'Add a device and it will show up here.';
      e.appendChild(h);
      e.appendChild(p);
      box.appendChild(e);
    } else {
      cart.forEach(function (l, i) {
        var row = document.createElement('div');
        row.className = 'dline';
        row.innerHTML = '<div class="th">' + icon(l.art) + '</div>'
          + '<div class="meta"><div class="nm"></div><div class="vr"></div>'
          + '<div class="rw"><span class="qty">'
          + '<button type="button" data-dec="' + i + '" aria-label="One fewer">-</button>'
          + '<span></span>'
          + '<button type="button" data-inc="' + i + '" aria-label="One more">+</button>'
          + '</span><span class="pr money"></span></div>'
          + '<button type="button" class="rm" data-rm="' + i + '">Remove</button></div>';
        qs('.nm', row).textContent = l.name;
        qs('.vr', row).textContent = l.variant || '';
        qs('.qty span', row).textContent = String(l.qty);
        qs('.pr', row).textContent = l.price == null ? 'Ask for price' : money(l.price * l.qty);
        box.appendChild(row);
      });
    }
    var sub = qs('#cartSubtotal');
    if (sub) sub.textContent = totalText();
    var go = qs('#cartCheckout');
    if (go) go.hidden = cart.length === 0;
    var note = qs('#cartNote');
    if (note) {
      var anyAsk = false;
      cart.forEach(function (l) { if (l.price == null) anyAsk = true; });
      note.textContent = anyAsk
        ? 'Some items are priced on request. Send the order and we will confirm the total when we call you.'
        : 'You pay the rider when the order reaches you.';
    }
  };

  var addToCart = function (line) {
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].slug === line.slug && (cart[i].variant || '') === (line.variant || '')) { found = cart[i]; break; }
    }
    if (found) { found.qty = Number(found.qty) + Number(line.qty || 1); }
    else { line.qty = Number(line.qty || 1); cart.push(line); }
    writeCart();
    paintBadge();
    openCart();
  };

  if (drawer) {
    drawer.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t.closest('[data-close-cart]') || t.classList.contains('ov')) { closeCart(); return; }
      var inc = t.closest('[data-inc]');
      var dec = t.closest('[data-dec]');
      var rm = t.closest('[data-rm]');
      if (inc) {
        cart[Number(inc.getAttribute('data-inc'))].qty++;
        writeCart(); paintCart(); paintBadge();
      } else if (dec) {
        var k = Number(dec.getAttribute('data-dec'));
        cart[k].qty--;
        if (cart[k].qty < 1) cart.splice(k, 1);
        writeCart(); paintCart(); paintBadge();
      } else if (rm) {
        cart.splice(Number(rm.getAttribute('data-rm')), 1);
        writeCart(); paintCart(); paintBadge();
        toast('Removed from cart');
      }
    });
  }

  qsa('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  qsa('[data-close-cart]').forEach(function (b) { b.addEventListener('click', closeCart); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  /* Paint both on load. paintCart alone leaves the header badge showing
     nothing, so a returning visitor with a full cart sees an empty badge
     until they add something. */
  paintCart();
  paintBadge();
`;
