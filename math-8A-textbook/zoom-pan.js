(function () {

  var LEVELS = [1, 1.5, 2, 3, 4];
  var K_MIN = LEVELS[0], K_MAX = LEVELS[LEVELS.length - 1], DBL_K = 2;
  var k = 1, tx = 0, ty = 0;
  var dragging = false, sx = 0, sy = 0, stx = 0, sty = 0, moved = 0, activeId = null;

  function modal() { return document.getElementById('zoomModal'); }
  function body()  { return document.getElementById('zoomBody'); }

  function penBusy() {
    var app = document.querySelector('.app');
    return !!app && (app.classList.contains('pen-on') || app.classList.contains('laser-on'));
  }
  function clearPen() {
    var c = document.getElementById('penCanvas');
    if (!c) return;
    var x = c.getContext && c.getContext('2d');
    if (x) x.clearRect(0, 0, c.width, c.height);
  }

  function baseXY() {
    var m = modal(), b = body();
    var r = m.getBoundingClientRect();
    return { x: r.left - m.scrollLeft + b.offsetLeft, y: r.top - m.scrollTop + b.offsetTop };
  }

  var box = null;
  function contentBox(fresh) {
    var b = body();
    if (!b) return null;
    if (box && !fresh) return box;
    var prev = b.style.transform;
    b.style.transform = 'none';
    var br = b.getBoundingClientRect();
    var l = Infinity, t = Infinity, r = -Infinity, bo = -Infinity;
    [].forEach.call(b.children, function (el) {
      var q = el.getBoundingClientRect();
      if (!q.width && !q.height) return;
      l = Math.min(l, q.left - br.left);  t = Math.min(t, q.top - br.top);
      r = Math.max(r, q.right - br.left); bo = Math.max(bo, q.bottom - br.top);
    });
    b.style.transform = prev;
    box = (l === Infinity)
      ? { x: 0, y: 0, w: b.offsetWidth, h: b.offsetHeight }
      : { x: l, y: t, w: r - l, h: bo - t };
    return box;
  }

  function clamp() {
    var m = modal(), c = contentBox();
    if (!m || !c) return;
    var vw = m.clientWidth, vh = m.clientHeight;
    var cw = c.w * k, ch = c.h * k;
    tx = cw > vw ? Math.min(-k * c.x, Math.max(vw - k * (c.x + c.w), tx))
                 : (vw - cw) / 2 - k * c.x;
    ty = ch > vh ? Math.min(-k * c.y, Math.max(vh - k * (c.y + c.h), ty))
                 : (vh - ch) / 2 - k * c.y;
  }

  function apply(quiet) {
    var m = modal(), b = body();
    if (!m || !b) return;
    if (k <= 1.0001) { k = 1; tx = 0; ty = 0; }
    else clamp();
    b.style.transformOrigin = '0 0';
    b.style.transform = k === 1 ? '' : 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + k.toFixed(4) + ')';
    m.classList.toggle('zp-on', k > 1);
    var lab = document.getElementById('zpLevel');
    if (lab) lab.textContent = k === 1 ? '1×' : (Math.round(k * 10) / 10) + '×';
    var btn = document.getElementById('zpReset');
    if (btn) btn.disabled = (k === 1);
    if (!quiet) clearPen();
  }

  function nextK(dir) {
    if (dir > 0) {
      for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i] > k + 1e-4) return LEVELS[i];
      return K_MAX;
    }
    for (var j = LEVELS.length - 1; j >= 0; j--) if (LEVELS[j] < k - 1e-4) return LEVELS[j];
    return K_MIN;
  }

  function setK(nk, clientX, clientY) {
    nk = Math.max(K_MIN, Math.min(K_MAX, nk));
    if (Math.abs(nk - k) < 1e-4) return;
    var m = modal();
    var base = baseXY();

    if (clientX == null) {
      var c = contentBox(true);
      clientX = base.x + tx + k * (c.x + c.w / 2);
      clientY = base.y + ty + k * (c.y + c.h / 2);
    }
    var qx = clientX - base.x, qy = clientY - base.y;
    var r2 = nk / k;
    tx = qx * (1 - r2) + r2 * tx;
    ty = qy * (1 - r2) + r2 * ty;
    k = nk;
    apply();
  }

  function reset(quiet) { k = 1; tx = 0; ty = 0; box = null; apply(quiet); }

  function inject() {
    var bar = document.getElementById('zoomBar');
    if (!bar || document.getElementById('zpIn')) return;
    var close = document.getElementById('zoomClose');
    var wrap = document.createElement('span');
    wrap.className = 'zp-group';
    wrap.innerHTML =
      '<button class="zoom-btn zp-btn" id="zpOut" title="縮小">−</button>' +
      '<span class="zp-level" id="zpLevel">1×</span>' +
      '<button class="zoom-btn zp-btn" id="zpIn" title="放大">＋</button>' +
      '<button class="zoom-btn zp-btn" id="zpReset" title="回到 1 倍" disabled>重設</button>';
    if (close) bar.insertBefore(wrap, close); else bar.appendChild(wrap);
    document.getElementById('zpIn').onclick    = function () { setK(nextK(1)); };
    document.getElementById('zpOut').onclick   = function () { setK(nextK(-1)); };
    document.getElementById('zpReset').onclick = function () { reset(); };
    apply(true);
  }

  function onDown(e) {
    var m = modal();
    if (!m || m.classList.contains('hidden') || k === 1 || penBusy()) return;
    if (e.target.closest('.zoom-bar, input, button, select, textarea, .ictrl')) return;
    if (e.isPrimary === false) return;
    if (dragging) return;
    dragging = true; moved = 0; activeId = (e.pointerId != null ? e.pointerId : 'mouse');
    sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
    m.classList.add('zp-drag');
    if (e.pointerId != null && m.setPointerCapture) { try { m.setPointerCapture(e.pointerId); } catch (_) {} }
  }
  function onMove(e) {
    if (!dragging) return;
    if ((e.pointerId != null ? e.pointerId : 'mouse') !== activeId) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    tx = stx + dx; ty = sty + dy;
    apply(true);
    e.preventDefault();
  }
  function onUp(e) {
    if (!dragging) return;
    if (e && (e.pointerId != null ? e.pointerId : 'mouse') !== activeId) return;
    dragging = false; activeId = null;
    var m = modal();
    if (m) {
      m.classList.remove('zp-drag');
      if (e && e.pointerId != null && m.releasePointerCapture) {
        try { m.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    }
    if (moved > 3) clearPen();
  }

  function onDbl(e) {
    var m = modal();
    if (!m || m.classList.contains('hidden') || penBusy()) return;
    if (e.target.closest('.zoom-bar, input, button, select, textarea, .ictrl')) return;
    if (k > 1) reset(); else setK(DBL_K, e.clientX, e.clientY);
  }

  document.addEventListener('pointerdown', onDown, true);
  document.addEventListener('pointermove', onMove, true);
  document.addEventListener('pointerup', onUp, true);
  document.addEventListener('pointercancel', onUp, true);
  document.addEventListener('dblclick', onDbl, true);

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function () {
      inject();
      var m = modal();
      if (m && m.classList.contains('hidden')) { box = null; if (k !== 1) reset(true); }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('click', inject, true);
  window.addEventListener('resize', function () { box = null; if (k !== 1) { contentBox(true); apply(true); } });
  inject();
})();
