/* Page bodies, part two: shop, checkout, policies, contact, 404. */
import { esc, money, svgIc, IC } from './layout.mjs';
import { crumb, faqBlock, productCard } from './pages.mjs';

const STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

const field = (id, label, type, opts) => {
  const o = opts || {};
  return '<div class="field">' +
    '<label for="' + id + '">' + esc(label) +
      (o.optional ? ' <span class="hint">(optional)</span>' : '') + '</label>' +
    '<input id="' + id + '" name="' + esc(o.name || id) + '" type="' + type + '"' +
      (o.required ? ' required' : '') +
      (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') +
      (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + '>' +
    '<span class="msg"></span>' +
  '</div>';
};

export const shopPage = (store, ctx) => {
  const all = [];
  ctx.cats.forEach((c) => ctx.byCat[c.id].forEach((it) => all.push({ cat: c, item: it })));
  const body = crumb(store, [['All devices']]) +
    '<div class="wrap"><div class="chead">' +
      '<div><h1>All devices</h1><p>Everything ' + esc(store.brand) + ' stocks, across every category.</p></div>' +
      '<span class="n">' + all.length + ' devices</span>' +
    '</div></div>' +
    '<section class="sect-tight"><div class="wrap">' +
      '<div class="grid">' + all.map((a) => productCard(store, a.cat, a.item, '-shop')).join('') + '</div>' +
    '</div></section>';

  return {
    title: 'All devices | ' + store.brand,
    desc: 'Every device in the ' + store.brand + ' store. Free nationwide shipping, pay by bank transfer.',
    path: '/shop/',
    active: 'shop',
    body: body,
    jsonld: []
  };
};

export const checkoutPage = (store, ctx) => {
  const body = crumb(store, [['Checkout']]) +
    '<div class="wrap">' +
      '<div class="done" id="coDone">' +
        '<div class="tick">' + svgIc(IC.check) + '</div>' +
        '<h2>Order ready to send</h2>' +
        '<p class="muted">We opened WhatsApp with your order already filled in. Send it there and we reply to confirm the price and the delivery window.</p>' +
        '<div class="ref" id="doneRef"></div>' +
        '<div class="facts" id="doneFacts"></div>' +
        '<div class="sendrow">' +
          '<a class="btn btn-primary" id="doneWa" href="#" target="_blank" rel="noopener">' + svgIc(IC.whatsapp, 'ic') + 'Send on WhatsApp</a>' +
          '<a class="btn btn-ghost" id="doneMail" href="#" hidden>Send by email</a>' +
        '</div>' +
        '<div class="tip">WhatsApp did not open? Use the buttons above, or message us on ' + esc('+' + store.whatsapp) + '. Keep the reference above so we can find your order.</div>' +
        '<a class="btn btn-dark" href="/">Back to the store</a>' +
      '</div>' +
      '<div class="co">' +
        '<div id="coFormWrap">' +
          '<div class="coform">' +
            '<h2>Delivery details</h2>' +
            '<p class="lead">Fill this in and we open WhatsApp with your order ready to send. We confirm the price and the delivery window before anything ships, and nothing is charged online.</p>' +
            /* No server sits behind this form. The order is handed to WhatsApp
               (and offered by email) by the client, so the browser's own
               validation bubble is suppressed and the custom messages run. */
            '<form id="coForm" novalidate>' +
              '<input type="hidden" name="orderReference" id="orderReference" value="">' +
              '<input type="hidden" name="orderItems" id="orderItems" value="">' +
              '<div class="grp">' +
                '<h4>Who it is for</h4>' +
                '<div class="field-row">' +
                  field('fullName', 'Full name', 'text', { required: true, autocomplete: 'name' }) +
                  field('phone', 'Phone number', 'tel', { required: true, autocomplete: 'tel', placeholder: '0803 000 0000' }) +
                '</div>' +
                field('email', 'Email', 'email', { optional: true, autocomplete: 'email' }) +
              '</div>' +
              '<div class="grp">' +
                '<h4>Where it goes</h4>' +
                field('address', 'Street address', 'text', { required: true, autocomplete: 'street-address' }) +
                '<div class="field-row">' +
                  field('city', 'City', 'text', { required: true, autocomplete: 'address-level2' }) +
                  '<div class="field"><label for="stateName">State</label>' +
                    '<select id="stateName" name="state" required>' +
                    '<option value="">Choose a state</option>' +
                    STATES.map((s) => '<option value="' + esc(s) + '">' + esc(s) + '</option>').join('') +
                    '</select><span class="msg"></span></div>' +
                '</div>' +
                '<div class="field"><label for="note">Anything else <span class="hint">(optional)</span></label>' +
                  '<textarea id="note" name="note" placeholder="Landmark, best time to call, colour preference"></textarea>' +
                  '<span class="msg"></span></div>' +
              '</div>' +
              '<button class="btn btn-primary btn-block" id="placeBtn" type="submit">Place order</button>' +
              '<div class="fstatus" id="formStatus" role="status" aria-live="polite"></div>' +
            '</form>' +
          '</div>' +
        '</div>' +
        '<aside class="sum">' +
          '<div class="sh">Order summary</div>' +
          '<div class="lines" id="coLines"></div>' +
          '<div class="tot">' +
            '<div class="r"><span>Subtotal</span><span class="money" id="coSub">' + esc(store.symbol) + '0</span></div>' +
            '<div class="r"><span>Delivery</span><span>Free</span></div>' +
            '<div class="r grand"><span>Total</span><span class="money" id="coGrand">' + esc(store.symbol) + '0</span></div>' +
          '</div>' +
          '<div class="note" id="coNote">' + esc(store.payment) + '. We call to confirm the order and the delivery window before dispatch. ' + esc(store.delivery) + '</div>' +
        '</aside>' +
      '</div>' +
    '</div>';

  return {
    title: 'Checkout | ' + store.brand,
    desc: 'Place your order with ' + store.brand + '. Free nationwide shipping, pay by bank transfer.',
    path: '/checkout/',
    active: 'checkout',
    body: body,
    jsonld: []
  };
};

const prose = (h1, intro, sections) =>
  '<div class="wrap"><div class="prose">' +
    '<h1>' + esc(h1) + '</h1>' +
    '<p>' + esc(intro) + '</p>' +
    sections.map((s) =>
      '<h2>' + esc(s[0]) + '</h2>' +
      (s[1].length ? '<p>' + esc(s[1][0]) + '</p>' : '') +
      (s[1].length > 1 ? '<ul>' + s[1].slice(1).map((li) => '<li>' + esc(li) + '</li>').join('') + '</ul>' : '')
    ).join('') +
  '</div></div>';

export const policyPages = (store) => [
  {
    slug: 'delivery',
    title: 'Delivery and returns',
    desc: 'How ' + store.brand + ' delivers, how long it takes, and how returns work.',
    body: prose('Delivery and returns',
      'We deliver anywhere in Nigeria. Delivery is free on every order.', [
      ['How long it takes', ['Lagos orders usually arrive within 24 hours.', 'Everywhere else in Nigeria takes 3-5 days outside Lagos.', 'We call you before dispatch to agree a delivery window.']],
      ['What it costs', ['Delivery is free. There is no separate shipping charge on any order.']],
      ['Paying', ['Payment is by bank transfer, arranged when we confirm your order. Nothing is charged on this site.']],
      ['Returns', ['If a device arrives damaged or is not what you ordered, contact us within 7 days and we will replace it or refund you.', 'Keep the packaging and the accessories with the device until you have checked it over.']],
      ['Tracking your order', ['Message us on WhatsApp with your order reference and we will tell you exactly where it is.']]
    ])
  },
  {
    slug: 'warranty',
    title: 'Warranty',
    desc: 'What the ' + store.brand + ' warranty covers.',
    body: prose('Warranty',
      'Every device we sell carries a warranty. This page explains what that covers and what it does not.', [
      ['What is covered', ['Manufacturing faults in the device itself for the warranty period.', 'If a covered fault appears, contact us and we will repair or replace the device.']],
      ['What is not covered', ['Physical damage from drops, cracks or liquid.', 'Damage from unauthorised repairs or parts.', 'Normal wear on batteries, cables and accessories.']],
      ['How to claim', ['Message us on WhatsApp with your order reference and a short description of the fault.', 'We will tell you the next step, and where to take the device if it needs to be seen.']]
    ])
  },
  {
    slug: 'payment',
    title: 'Payment',
    desc: 'How payment works when you order from ' + store.brand + '.',
    body: prose('Payment',
      'You do not pay anything online. Send the order, we confirm the price and the delivery window with you, and we dispatch once the payment settles.', [
      ['How it works', ['Send your order from the store, or message us on WhatsApp.', 'We confirm the price, the colour and the delivery window with you.', 'You pay by bank transfer, and the device ships once it clears.']],
      ['Bank transfer', ['Ask us for the account details when we confirm your order.', 'We only ever send account details from our own WhatsApp number or over the phone.']],
      ['Card payments', ['Card payment online is coming. Until then, payment is by bank transfer.']],
      ['Staying safe', ['We will never ask for your card PIN, your bank password or an OTP.', 'If anyone claims to be us and asks for those, stop and call us on the number on this site.']]
    ])
  }
].map((p) => ({
  title: p.title + ' | ' + store.brand,
  desc: p.desc,
  path: '/policies/' + p.slug + '/',
  active: 'policies',
  body: p.body,
  jsonld: []
}));

export const contactPage = (store, ctx) => {
  const wa = 'https://wa.me/' + esc(store.whatsapp);
  const body = crumb(store, [['Contact']]) +
    '<div class="wrap"><div class="chead">' +
      '<div><h1>Talk to us</h1><p>Fastest way to reach us is WhatsApp. We answer every message.</p></div>' +
    '</div></div>' +
    '<section class="sect-tight"><div class="wrap">' +
      '<div class="grid grid-2">' +
        '<div class="card panel">' +
          '<h3>WhatsApp</h3>' +
          '<p class="muted lead">Send us the device you want and your city. We will confirm price and delivery right away.</p>' +
          '<a class="btn btn-primary" href="' + wa + '">' + svgIc(IC.whatsapp, 'ic') + 'Open WhatsApp</a>' +
        '</div>' +
        '<div class="card panel">' +
          '<h3>Phone</h3>' +
          '<p class="muted">Call or message any day between 9am and 8pm.</p>' +
          '<p class="tel-lg">' + esc('+' + store.whatsapp) + '</p>' +
          '<a class="btn btn-ghost" href="tel:+' + esc(store.whatsapp) + '">' + svgIc(IC.phone, 'ic') + 'Call now</a>' +
        '</div>' +
        '<div class="card panel">' +
          '<h3>Email</h3>' +
          '<p class="muted">Best for bulk orders, invoice requests and anything you want in writing.</p>' +
          '<p class="tel-lg mail">' + esc(store.email || '') + '</p>' +
          '<a class="btn btn-ghost" href="mailto:' + esc(store.email || '') + '">' + svgIc(IC.mail, 'ic') + 'Send an email</a>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-2 mt-lg">' +
        '<div class="card panel">' +
          '<h3>What to send us</h3>' +
          '<ul class="tick-list">' +
            ['The device and the storage size you want.',
             'The colour, if you have one in mind.',
             'Your city, so we can confirm the delivery window.',
             'Whether you want eSIM only or a physical SIM too.'].map((t) =>
              '<li><span class="ic">' + svgIc(IC.check) + '</span><span>' + esc(t) + '</span></li>').join('') +
          '</ul>' +
        '</div>' +
        '<div class="card panel">' +
          '<h3>Good to know</h3>' +
          '<ul class="tick-list">' +
            [esc(store.payment) + ' on every order.',
             'Free delivery nationwide.',
             esc(store.delivery),
             'Every order confirmed by phone before it ships.'].map((t) =>
              '<li><span class="ic">' + svgIc(IC.check) + '</span><span>' + t + '</span></li>').join('') +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div></section>' +
    '<section class="sect" style="padding-top:0"><div class="wrap">' +
      '<div class="shead"><div><h2>Questions people ask</h2></div></div>' + faqBlock() +
    '</div></section>';

  return {
    title: 'Contact | ' + store.brand,
    desc: 'Reach ' + store.brand + ' on WhatsApp or by phone. We answer every message.',
    path: '/contact/',
    active: 'contact',
    body: body,
    jsonld: []
  };
};

export const notFoundPage = (store, ctx) => ({
  title: 'Page not found | ' + store.brand,
  desc: 'That page does not exist. Browse the store instead.',
  path: '/404.html',
  active: '',
  body: '<div class="wrap"><div class="empty pad-tall">' +
    '<h1 style="margin-bottom:12px">We could not find that page</h1>' +
    '<p style="margin-bottom:24px">The link may be old, or the device may have moved.</p>' +
    '<a class="btn btn-primary" href="/shop/">Browse all devices</a>' +
    '</div></div>',
  jsonld: []
});
