/* Browser client, part 3: mobile menu, header search, scroll reveal. */
export const client3 = `
  var mbtn = qs('#menuBtn');
  var mnav = qs('#mobileNav');
  if (mbtn && mnav) {
    mbtn.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    qsa('a', mnav).forEach(function (a) {
      a.addEventListener('click', function () {
        mnav.classList.remove('open');
        mbtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var idxEl = qs('#searchIndex');
  var INDEX = [];
  if (idxEl) { try { INDEX = JSON.parse(idxEl.textContent) || []; } catch (err) { INDEX = []; } }

  var sInput = qs('#searchInput');
  var sBox = qs('#searchResults');
  if (sInput && sBox && INDEX.length) {
    var closeRes = function () { sBox.hidden = true; sBox.textContent = ''; };
    var runSearch = function () {
      var q = sInput.value.trim().toLowerCase();
      if (q.length < 2) { closeRes(); return; }
      var hits = [];
      for (var i = 0; i < INDEX.length && hits.length < 8; i++) {
        var it = INDEX[i];
        var hay = (it.name + ' ' + it.cat + ' ' + (it.blurb || '')).toLowerCase();
        if (hay.indexOf(q) > -1) hits.push(it);
      }
      sBox.textContent = '';
      if (!hits.length) {
        var n = document.createElement('div');
        n.className = 'none';
        n.textContent = 'Nothing matched that. Try iPhone, iPad, Mac, Watch, PS5, AirPods or JBL.';
        sBox.appendChild(n);
      } else {
        hits.forEach(function (it) {
          var a = document.createElement('a');
          a.href = it.url;
          var th = document.createElement('span');
          th.className = 'th';
          th.innerHTML = icon(it.art);
          var tx = document.createElement('span');
          tx.className = 'tx';
          var t = document.createElement('span');
          t.className = 't';
          t.textContent = it.name;
          var s = document.createElement('span');
          s.className = 's';
          s.textContent = it.cat + (it.price == null ? ' | Ask for price' : ' | ' + money(it.price));
          tx.appendChild(t);
          tx.appendChild(s);
          a.appendChild(th);
          a.appendChild(tx);
          sBox.appendChild(a);
        });
      }
      sBox.hidden = false;
    };
    sInput.addEventListener('input', runSearch);
    sInput.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeRes(); });
    document.addEventListener('click', function (e) {
      if (!sBox.hidden && !e.target.closest('.search')) closeRes();
    });
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  qsa('.reveal').forEach(function (el) {
    if (io) { io.observe(el); } else { el.classList.add('in'); }
  });
`;
