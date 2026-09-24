(function () {
  var pen = document.getElementById('penCanvas');
  var btn = document.getElementById('dkHl');
  var app = document.querySelector('.app');
  if (!pen || !btn || !app) return;

  var COLOR = '#fde047', WIDTH = 22, ERASE_W = 26;
  var hl = document.createElement('canvas');
  hl.id = 'hlCanvas'; hl.className = 'hl-canvas';
  document.body.appendChild(hl);
  var ctx = hl.getContext('2d');
  var on = false, drawing = false, last = null, eraseDown = false, eraseLast = null;

  function fit() {
    var w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
    if (hl._w === w && hl._h === h) return;
    hl._w = w; hl._h = h;
    hl.width = Math.round(w * dpr); hl.height = Math.round(h * dpr);
    hl.style.width = w + 'px'; hl.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }
  fit();
  window.addEventListener('resize', fit);
  function clearHl() { ctx.clearRect(0, 0, hl.width, hl.height); }

  var pctx = pen.getContext('2d');
  var origClear = pctx.clearRect.bind(pctx);
  pctx.clearRect = function (x, y, w, h) {
    origClear(x, y, w, h);
    if (x <= 0 && y <= 0 && w >= pen.width && h >= pen.height) clearHl();
  };

  function setOn(v) {
    on = v;
    btn.classList.toggle('active', v);
    if (v) document.querySelectorAll('.dcolor').forEach(function (b) { b.classList.remove('active'); });
  }
  function erasing() { var e = document.getElementById('dkErase'); return !!e && e.classList.contains('active'); }

  btn.onclick = function () {
    if (on) { setOn(false); var first = document.querySelector('.dcolor'); if (first) first.click(); return; }
    if (erasing()) document.getElementById('dkErase').click();
    if (!app.classList.contains('pen-on')) document.getElementById('dkPen').click();
    setOn(true);
  };

  document.querySelectorAll('.dcolor, #dkErase').forEach(function (b) {
    b.addEventListener('click', function () { setOn(false); });
  });

  new MutationObserver(function () {
    if (on && !app.classList.contains('pen-on')) {
      setOn(false);
      var first = document.querySelector('.dcolor.active') || document.querySelector('.dcolor');
      if (first) first.classList.add('active');
    }
  }).observe(app, { attributes: true, attributeFilter: ['class'] });

  function pt(e) { var t = e.touches ? e.touches[0] : e; return { x: t.clientX, y: t.clientY }; }
  function seg(a, b, w, mode) {
    ctx.globalCompositeOperation = mode;
    ctx.strokeStyle = COLOR; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  function start(e) {
    if (e.target !== pen) return;
    if (on) {
      e.stopPropagation(); e.preventDefault();
      drawing = true; last = pt(e);
      seg(last, last, WIDTH, 'source-over');
    } else if (erasing()) {
      eraseDown = true; eraseLast = pt(e);
    }
  }
  function move(e) {
    if (on && drawing) {
      e.stopPropagation(); e.preventDefault();
      var p = pt(e); seg(last, p, WIDTH, 'source-over'); last = p;
    } else if (eraseDown && erasing()) {
      var q = pt(e); seg(eraseLast, q, ERASE_W, 'destination-out'); eraseLast = q;
    }
  }
  function end() { drawing = false; eraseDown = false; }

  window.addEventListener('mousedown', start, true);
  window.addEventListener('mousemove', move, true);
  window.addEventListener('mouseup', end, true);
  window.addEventListener('touchstart', start, { capture: true, passive: false });
  window.addEventListener('touchmove', move, { capture: true, passive: false });
  window.addEventListener('touchend', end, true);
})();
