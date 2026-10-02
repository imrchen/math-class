(function () {
  var slideEl = document.getElementById('slide');
  var btn = document.getElementById('dkText');
  if (!slideEl) return;

  var MIN = 0.8, MAX = 1.5, STEP = 0.1, FLOOR = 0.5;

  var PRACTICE = '.q-row, .p-row, .q-line, .p-line, .q-ask, .p-ask, .q-body, .p-qtext, .ak-root';
  var KEY = 'mathdeck.textScale:' + location.pathname.replace(/[^\/]*$/, '');

  function clamp(v) { return Math.round(Math.min(MAX, Math.max(MIN, v)) * 10) / 10; }
  var want = 1;
  try { var saved = parseFloat(localStorage.getItem(KEY)); if (saved > 0) want = clamp(saved); } catch (e) {}
  var used = 1;

  function practiceFloor() {
    var cfg = window.PRACTICE && window.PRACTICE.config;
    return (cfg && cfg.fitFloor) || 0.55;
  }

  function apply() {
    var vis = slideEl.querySelector(':scope > .slide-visual');
    var h = vis && vis.querySelector(':scope > .visual-host');
    if (!h) { used = 1; return sync(); }

    if (h.querySelector(':scope > div > svg')) {
      vis.style.removeProperty('--ts-hz'); vis.style.removeProperty('--ts-fit');
      used = 1; return sync();
    }
    if (!h.clientHeight) return;

    var practice = !!h.querySelector(PRACTICE);
    var kids = practice ? [h.firstElementChild].filter(Boolean) : [];
    var cs = getComputedStyle(h);
    var pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

    function setHz(z) { if (z === 1) vis.style.removeProperty('--ts-hz'); else vis.style.setProperty('--ts-hz', z.toFixed(3)); }
    function reset() {
      if (practice) kids.forEach(function (k) { k.style.zoom = ''; });
      else vis.style.removeProperty('--ts-fit');
    }
    function fits() { return h.scrollHeight <= h.clientHeight + 1 && h.scrollWidth <= h.clientWidth + 1; }

    reset();
    var hz = want;
    if (want > 1) {
      setHz(want);
      if (!fits()) {
        setHz(1);
        if (fits()) {
          var lo = 1, hi = want;
          for (var i = 0; i < 6; i++) {
            var mid = (lo + hi) / 2;
            setHz(mid);
            if (fits()) lo = mid; else hi = mid;
          }
          hz = Math.floor(lo * 100) / 100;
        } else hz = 1;
      }
    }
    setHz(hz);
    used = hz;

    var floor = practice ? practiceFloor() : FLOOR, z = 1;
    for (var n = 0; n < 8 && !fits() && z > floor; n++) {
      var need = h.scrollHeight - pad, have = h.clientHeight - pad;
      var r = Math.min(have > 0 && need > 0 ? have / need : 1, h.clientWidth / (h.scrollWidth || 1)) * 0.985;
      z = Math.max(floor, z * (n ? Math.min(r, 0.95) : r));
      if (practice) kids.forEach(function (k) { k.style.zoom = z.toFixed(3); });
      else vis.style.setProperty('--ts-fit', z.toFixed(3));
    }

    if (fits() && h.style.transform && h.style.transform !== 'none') h.style.transform = 'none';
    sync();
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  new MutationObserver(schedule).observe(slideEl, { childList: true, subtree: true });
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

  var pop = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function hasFont(name) {

    try {
      var c = document.createElement('canvas').getContext('2d'), t = 'mmmmmmmmmmlliWW 0123';
      return ['monospace', 'serif'].some(function (fb) {
        c.font = '40px ' + fb; var a = c.measureText(t).width;
        c.font = '40px "' + name + '", ' + fb; return c.measureText(t).width !== a;
      });
    } catch (e) { return false; }
  }
  function fontName() {
    var list = [['Noto Sans TC', 'Noto Sans TC'], ['Microsoft JhengHei', '微軟正黑體'], ['PingFang TC', '蘋方'], ['Heiti TC', '黑體']];
    for (var i = 0; i < list.length; i++) if (hasFont(list[i][0])) return list[i][1];
    return '系統預設';
  }

  function build() {
    pop = el('div', 'ts-pop hidden');
    pop.setAttribute('role', 'group');
    pop.setAttribute('aria-label', '字級');
    var row = el('div', 'ts-row');
    var dn = el('button', 'ts-btn', 'A−'); dn.dataset.d = '-1'; dn.title = '字小一點';
    var val = el('button', 'ts-val'); val.title = '回到 100%';
    var up = el('button', 'ts-btn', 'A＋'); up.dataset.d = '1'; up.title = '字大一點';
    row.appendChild(dn); row.appendChild(val); row.appendChild(up);
    pop.appendChild(row);
    pop.appendChild(el('div', 'ts-note'));

    var TH = window.DECK_THEME;
    if (TH && TH.list) {
      var tr = el('div', 'ts-row ts-theme');
      tr.appendChild(el('span', 'ts-label', '配色'));
      TH.list.forEach(function (t) {
        var b = el('button', 'ts-th', t.label); b.dataset.theme = t.id;
        b.classList.toggle('on', t.id === TH.current);
        tr.appendChild(b);
      });
      pop.appendChild(tr);
    }
    pop.appendChild(el('div', 'ts-info'));
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      e.stopPropagation();
      if (b.classList.contains('ts-th')) { if (!b.classList.contains('on')) window.DECK_THEME.set(b.dataset.theme); return; }
      set(b.classList.contains('ts-val') ? 1 : want + (+b.dataset.d) * STEP);
    });
    btn.parentNode.appendChild(pop);
  }

  function sync() {
    if (!pop || pop.classList.contains('hidden')) return;
    var q = function (s) { return pop.querySelector(s); };
    q('.ts-val').textContent = Math.round(want * 100) + '%';
    q('.ts-btn[data-d="-1"]').disabled = want <= MIN + 1e-6;
    q('.ts-btn[data-d="1"]').disabled = want >= MAX - 1e-6;
    q('.ts-note').textContent = used < want - 0.005 ? '這一頁放不下，實際 ' + Math.round(used * 100) + '%' : '';
    q('.ts-info').textContent = '畫面 ' + innerWidth + '×' + innerHeight + '　縮放 ×' +
      (Math.round((window.devicePixelRatio || 1) * 100) / 100) + '　' + fontName();
  }

  function set(v) {
    want = clamp(v);
    try { localStorage.setItem(KEY, String(want)); } catch (e) {}
    apply();

    [200, 500, 1000, 2000, 4000].forEach(function (t) { setTimeout(schedule, t); });
  }

  function place() {

    pop.style.top = btn.offsetTop + 'px';
  }
  function open(on) {
    pop.classList.toggle('hidden', !on);
    btn.classList.toggle('active', on);
    if (on) { place(); sync(); }
  }

  if (btn) {
    build();
    btn.addEventListener('click', function (e) { e.stopPropagation(); open(pop.classList.contains('hidden')); });
    document.addEventListener('click', function (e) { if (!pop.contains(e.target) && e.target !== btn) open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    window.addEventListener('resize', function () { if (!pop.classList.contains('hidden')) { place(); sync(); } });
  }
  schedule();
})();
