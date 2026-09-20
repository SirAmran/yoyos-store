/* Browser client, part 4: product page controls, checkout submit, confirmation. */
export const client4 = `
  var track = function (evt, data) {
    if (window.fbq) { try { window.fbq('track', evt, data || {}); } catch (e) {} }
  };

  var pdp = qs('#pdp');
  if (pdp) {
    var pSlug = pdp.getAttribute('data-slug') || '';
    var pName = pdp.getAttribute('data-name') || '';
    var pUrl = pdp.getAttribute('data-url') || '';
    var pArt = pdp.getAttribute('data-art') || 'box';
    var rawPrice = pdp.getAttribute('data-price');
    var pPrice = (rawPrice === null || rawPrice === '') ? null : Number(rawPrice);
    var pQty = 1;
    var chosen = {};

    qsa('.opt', pdp).forEach(function (grp) {
      var key = grp.getAttribute('data-opt');
      var on = qs('.chip[aria-pressed="true"]', grp);
      if (key && on) chosen[key] = on.getAttribute('data-val');
    });
    var firstSw = qs('.sw', pdp);
    if (firstSw) chosen.Color = firstSw.getAttribute('data-color');

    var variantText = function () {
      var parts = [];
      if (chosen.Color) parts.push(chosen.Color);
      Object.keys(chosen).forEach(function (k) { if (k !== 'Color') parts.push(chosen[k]); });
      return parts.length ? parts.join(', ') : 'Standard';
    };
    var paintVariant = function () {
      var out = qs('#variantOut');
      if (out) out.textContent = variantText();
    };

    var pickColor = function (color) {
      chosen.Color = color || '';
      qsa('.shot', pdp).forEach(function (s) {
        s.classList.toggle('on', (s.getAttribute('data-color') || '') === chosen.Color);
      });
      var mark = function (b) {
        b.setAttribute('aria-pressed', (b.getAttribute('data-color') || '') === chosen.Color ? 'true' : 'false');
      };
      qsa('.sw', pdp).forEach(mark);
      qsa('.thumbs button', pdp).forEach(mark);
      paintVariant();
    };

    qsa('.sw', pdp).forEach(function (b) {
      b.addEventListener('click', function () { pickColor(b.getAttribute('data-color')); });
    });
    qsa('.thumbs button', pdp).forEach(function (b) {
      b.addEventListener('click', function () { pickColor(b.getAttribute('data-color')); });
    });
    qsa('.opt', pdp).forEach(function (grp) {
      var key = grp.getAttribute('data-opt');
      qsa('.chip', grp).forEach(function (b) {
        b.addEventListener('click', function () {
          qsa('.chip', grp).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          if (key) chosen[key] = b.getAttribute('data-val');
          paintVariant();
        });
      });
    });

    var qtyOut = qs('#qtyOut');
    var paintQty = function () { if (qtyOut) qtyOut.textContent = String(pQty); };
    var qi = qs('[data-q-inc]');
    var qd = qs('[data-q-dec]');
    if (qi) qi.addEventListener('click', function () { pQty = Math.min(20, pQty + 1); paintQty(); });
    if (qd) qd.addEventListener('click', function () { pQty = Math.max(1, pQty - 1); paintQty(); });
    paintVariant();
    paintQty();

    var addBtn = qs('#addBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addToCart({
          slug: pSlug, name: pName, variant: variantText(),
          price: pPrice, art: pArt, url: pUrl, qty: pQty
        });
        toast('Added to cart');
        track('AddToCart', { content_name: pName, value: pPrice || undefined, currency: 'NGN' });
      });
    }
  }

  var coForm = qs('#coForm');
  if (coForm) {
    var refField = qs('#orderReference');
    var itemsField = qs('#orderItems');
    var newRef = function () {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      var stamp = p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
      var L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return 'YOYOS-' + stamp + '-' + L[Math.floor(Math.random() * 26)] + L[Math.floor(Math.random() * 26)];
    };
    if (refField) refField.value = newRef();

    var linesText = function () {
      return cart.map(function (l) {
        var v = l.variant ? ' (' + l.variant + ')' : '';
        var c = l.price == null ? ' [price on request]' : ' = ' + money(l.price * l.qty);
        return l.qty + ' x ' + l.name + v + c;
      }).join('; ');
    };
    if (itemsField) itemsField.value = linesText();

    var paintSummary = function () {
      var box = qs('#coLines');
      if (!box) return;
      box.textContent = '';
      if (!cart.length) {
        var e = document.createElement('div');
        e.className = 'empty';
        var h = document.createElement('h3');
        h.textContent = 'Your cart is empty';
        var ep = document.createElement('p');
        ep.textContent = 'Add a device first, then come back here to place the order.';
        e.appendChild(h);
        e.appendChild(ep);
        box.appendChild(e);
      } else {
        cart.forEach(function (l) {
          var row = document.createElement('div');
          row.className = 'line';
          row.innerHTML = '<div class="th">' + icon(l.art) + '</div>'
            + '<div class="m"><div class="nm"></div><div class="vr"></div></div>'
            + '<div class="p money"></div>';
          qs('.nm', row).textContent = l.qty + ' x ' + l.name;
          qs('.vr', row).textContent = l.variant || '';
          qs('.p', row).textContent = l.price == null ? 'On request' : money(l.price * l.qty);
          box.appendChild(row);
        });
      }
      var g = qs('#coGrand');
      if (g) g.textContent = totalText();
      var sb = qs('#coSub');
      if (sb) sb.textContent = totalText();
      var nt = qs('#coNote');
      if (nt) {
        nt.textContent = anyAsk()
          ? 'Some items are priced on request, so the total is confirmed when we call. ' + STORE.payment + '.'
          : STORE.payment + '. We call to confirm the order and the delivery window before dispatch. ' + STORE.delivery;
      }
      var place = qs('#placeBtn');
      if (place) place.disabled = cart.length === 0;
    };
    paintSummary();

    var setStatus = function (msg) {
      var el = qs('#formStatus');
      if (!el) return;
      el.textContent = msg || '';
      el.classList.toggle('show', !!msg);
    };
    var lockForm = function (on) {
      qsa('input,select,textarea,button', coForm).forEach(function (el) { el.disabled = !!on; });
      var b = qs('#placeBtn');
      if (b) b.textContent = on ? 'Sending your order...' : 'Place order';
    };

    /* The whole order as plain text. This is what the customer sends us, so it
       carries everything needed to confirm by phone without asking again. */
    var buildOrderText = function (ref) {
      var gv = function (id) { var el = qs('#' + id); return el ? String(el.value || '').trim() : ''; };
      var L = ['New order ' + ref, ''];
      cart.forEach(function (l) {
        var v = l.variant ? ' (' + l.variant + ')' : '';
        L.push(l.qty + ' x ' + l.name + v + ' = ' + (l.price == null ? 'price on request' : money(l.price * l.qty)));
      });
      L.push('');
      L.push('Total: ' + totalText());
      L.push('');
      L.push('Name: ' + gv('fullName'));
      L.push('Phone: ' + gv('phone'));
      if (gv('email')) L.push('Email: ' + gv('email'));
      L.push('Deliver to: ' + [gv('address'), gv('city'), gv('stateName')].filter(Boolean).join(', '));
      if (gv('note')) L.push('Note: ' + gv('note'));
      L.push('');
      L.push('Sent from the ' + STORE.brand + ' store.');
      return L.join('\\n');
    };

    var showDone = function (ref, waLink, mailLink) {
      var done = qs('#coDone');
      var wrap = qs('#coFormWrap');
      var r = qs('#doneRef');
      if (r) r.textContent = ref;
      var wa = qs('#doneWa');
      if (wa) wa.setAttribute('href', waLink);
      var ml = qs('#doneMail');
      if (ml) {
        if (mailLink) { ml.setAttribute('href', mailLink); ml.hidden = false; }
        else { ml.hidden = true; }
      }
      var facts = qs('#doneFacts');
      if (facts) {
        facts.textContent = '';
        var gv = function (id) { var el = qs('#' + id); return el ? String(el.value || '') : ''; };
        var rows = [
          ['Name', gv('fullName')],
          ['Phone', gv('phone')],
          ['Deliver to', [gv('address'), gv('city'), gv('stateName')].filter(Boolean).join(', ')],
          ['Total', totalText()]
        ];
        rows.forEach(function (row) {
          var d = document.createElement('div');
          var k = document.createElement('span');
          k.className = 'k';
          k.textContent = row[0];
          var v = document.createElement('span');
          v.className = 'v';
          v.textContent = row[1];
          d.appendChild(k);
          d.appendChild(v);
          facts.appendChild(d);
        });
      }
      if (done) done.classList.add('show');
      if (wrap) wrap.hidden = true;
      cart = [];
      writeCart();
      paintBadge();
      if (refField) refField.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    coForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      qsa('.field.err', coForm).forEach(function (f) { f.classList.remove('err'); });
      qsa('.field .msg', coForm).forEach(function (m) { m.textContent = ''; });
      qsa('[aria-invalid]', coForm).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      setStatus('');

      var bad = null;
      qsa('[required]', coForm).forEach(function (el) {
        if (!bad && !String(el.value || '').trim()) bad = el;
      });
      var phoneEl = qs('#phone', coForm);
      if (!bad && phoneEl && String(phoneEl.value).replace(/[^0-9]/g, '').length < 10) bad = phoneEl;
      if (bad) {
        var f = bad.closest('.field');
        if (f) {
          f.classList.add('err');
          bad.setAttribute('aria-invalid', 'true');
          var m = qs('.msg', f);
          if (m) m.textContent = (bad === phoneEl) ? 'Enter a phone number we can reach you on.' : 'This one is needed.';
        }
        bad.focus();
        setStatus('Please check the highlighted field and send again.');
        return;
      }
      if (!cart.length) {
        setStatus('Your cart is empty. Add a device first.');
        return;
      }

      if (itemsField) itemsField.value = linesText();
      if (refField) refField.value = newRef();
      var thisRef = refField ? refField.value : '';
      var orderTotal = cartTotal();
      var orderText = buildOrderText(thisRef);
      lockForm(true);

      var waLink = 'https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(orderText);
      var mailLink = STORE.email
        ? 'mailto:' + STORE.email + '?subject=' + encodeURIComponent('Order ' + thisRef) + '&body=' + encodeURIComponent(orderText)
        : '';

      track('Lead', { content_name: 'Yoyos Store order', value: orderTotal || undefined, currency: 'NGN' });

      /* The store is static, so no server ever receives this. The order goes to
         WhatsApp instead, which is where the business already runs, and the same
         text is offered by email alongside it. Opening the window stays inside
         the click so the browser's popup blocker does not swallow it. */
      window.open(waLink, '_blank');
      showDone(thisRef, waLink, mailLink);
    });
  }
`;
