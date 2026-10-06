(function () {
  var pen = document.getElementById('penCanvas');
  var app = document.querySelector('.app');
  var btn = document.getElementById('dkBoard');
  if (!pen || !app) return;

  var layer = null, bar = null, badge = null, qbox = null, figArea = null, stepsBox = null;
  var bQ = null, bS = null, bPrev = null, bNext = null;
  var quad = null, bAll = null, bNone = null, bGPrev = null, bGNext = null, quadCells = [], quadMode = false;
  var cur = null;
  var showQ = true, showS = false;
  var TOP = 78, LEFT = 28, DOCK = 104;

  function clearPen() {
    var x = pen.getContext && pen.getContext('2d');
    if (x) x.clearRect(0, 0, pen.width, pen.height);
  }
  function isOpen() { return !!layer && !layer.classList.contains('hidden'); }
  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function ensure() {
    if (layer) return;
    layer = el('div', 'bd-layer hidden', document.body);
    layer.id = 'bdLayer';
    qbox = el('div', 'bd-q', layer);
    figArea = el('div', 'bd-fig', layer);
    stepsBox = el('div', 'bd-steps', layer);
    quad = el('div', 'bd-quad hidden', layer);
    bar = el('div', 'zoom-bar bd-bar hidden', document.body);
    bar.id = 'bdBar';
    badge = el('div', 'zoom-badge', bar);
    function b(id, text, cls) { var x = el('button', 'zoom-btn' + (cls ? ' ' + cls : ''), bar); x.id = id; x.textContent = text; return x; }
    bQ = b('bdQ', '題目');
    bS = b('bdS', '步驟');
    bPrev = b('bdPrev', '‹ 上一步');
    bNext = b('bdNext', '下一步 ›');
    bGPrev = b('bdGPrev', '‹ 上一組');
    bGNext = b('bdGNext', '下一組 ›');
    bAll = b('bdAll', '全部顯示');
    bNone = b('bdNone', '全部收起');
    b('bdClose', '✕ 關閉', 'zoom-x').onclick = close;

    bQ.onclick = function () { showQ = !showQ; clearPen(); place(); paintToggles(); };
    bS.onclick = function () {
      showS = !showS;
      if (showS) { fillSteps(); if (!stepsBox.childNodes.length && cur && cur.hook && cur.hook.k() === 0) { step(1); return; } }
      paintToggles();
    };
    bPrev.onclick = function () { step(-1); };
    bNext.onclick = function () { step(1); };
    bAll.onclick = function () { quadCells.forEach(function (c) { c.k = c.n; c.paint(); }); };
    bNone.onclick = function () { quadCells.forEach(function (c) { c.k = 0; c.paint(); }); };
    bGPrev.onclick = function () { quadGo(-1); };
    bGNext.onclick = function () { quadGo(1); };
    window.addEventListener('resize', function () { if (!isOpen()) return; if (quadMode) placeQuad(); else place(); });
  }

  var picked = new WeakMap();
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('.p-row');
    var host = row && row.closest('.visual-host');
    var body = row && row.querySelector('.p-tag + span');
    if (!host || !body) return;
    var tag = row.querySelector('.p-tag');
    picked.set(host, { label: tag ? tag.textContent.trim() : '', body: body.cloneNode(true) });
  }, true);

  function zoomOpen() {
    var zm = document.getElementById('zoomModal');
    return !!zm && !zm.classList.contains('hidden');
  }
  function scope() { return document.getElementById(zoomOpen() ? 'zoomBody' : 'slide'); }

  function titleOf(host) {
    var s = host && host.querySelector('span');
    return s ? s.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function question(host) {
    var qEl = host && host.querySelector('.p-qtext');
    if (qEl) {
      var got = picked.get(host);
      return got ? { label: got.label, body: got.body.cloneNode(true) } : { label: titleOf(host), body: qEl.cloneNode(true) };
    }
    var sc = scope();
    var ex = sc && sc.querySelector(zoomOpen() ? '.zoom-q' : '.ex-q');
    return ex && ex.textContent.trim() ? { label: '範例', body: ex.cloneNode(true) } : null;
  }

  function fillQuestion(q) {
    qbox.innerHTML = '';
    if (!q) return;
    if (q.label) el('div', 'bd-q-label', qbox).textContent = q.label;
    var c = q.body;
    c.removeAttribute('style'); c.removeAttribute('class');
    c.querySelectorAll('button, a, .bd-figbtn, .q-fig').forEach(function (x) { x.remove(); });
    qbox.appendChild(c);
  }

  function fillSteps() {
    stepsBox.innerHTML = '';
    if (!cur || !cur.host) return;
    cur.host.querySelectorAll('.q-line, .q-ask, .p-line, .p-ask').forEach(function (line) {
      if (line.style.visibility === 'hidden') return;
      var c = line.cloneNode(true);
      c.removeAttribute('style'); c.className = 'bd-step';
      stepsBox.appendChild(c);
    });
  }

  function figHtml() {
    var box = cur && cur.figBox;
    if (!box) return '';
    if (cur.hook && cur.hook.fig) return cur.hook.fig();
    var c = box.cloneNode(true);
    c.querySelectorAll('.bd-figbtn').forEach(function (x) { x.remove(); });
    return c.innerHTML;
  }

  function fillFig() {
    figArea.innerHTML = '';
    var tmp = document.createElement('div');
    tmp.innerHTML = figHtml();

    Array.prototype.slice.call(tmp.children).forEach(function (x) {
      var cell = el('div', 'bd-cell', figArea);
      var svg = x.tagName.toLowerCase() === 'svg' ? x : x.querySelector(':scope > svg');
      if (svg) {
        svg.removeAttribute('width'); svg.removeAttribute('height');
        svg.style.cssText = 'width:100%;height:100%;max-width:none;max-height:none;display:block';
        cell.appendChild(svg);
      } else {
        cell.classList.add('bd-html');
        cell.appendChild(x);
      }
    });
    layout();
    fitHtml();
  }

  function layout() {
    var cells = figArea.querySelectorAll('.bd-cell');
    Array.prototype.forEach.call(cells, function (c) {
      c.style.flex = '';
      if (c.firstElementChild) c.firstElementChild.style.zoom = '';
    });
    if (cells.length < 2) { figArea.style.flexDirection = ''; return; }
    var sizes = Array.prototype.map.call(cells, function (c) {
      var s = c.querySelector(':scope > svg');
      var vb = s && s.viewBox && s.viewBox.baseVal;
      if (vb && vb.width) return [vb.width, vb.height];
      var t = c.querySelector('table') || c.firstElementChild;
      return [t.offsetWidth || 1, t.offsetHeight || 1];
    });
    var W = figArea.clientWidth, H = figArea.clientHeight;
    var gaps = 24 * (cells.length - 1);
    var sum = function (i) { return sizes.reduce(function (a, s) { return a + s[i]; }, 0); };
    var max = function (i) { return Math.max.apply(null, sizes.map(function (s) { return s[i]; })); };
    var kCol = Math.min(W / max(0), (H - gaps) / sum(1));
    var kRow = Math.min((W - gaps) / sum(0), H / max(1));
    var isCol = kCol >= kRow, k = isCol ? kCol : kRow;
    figArea.style.flexDirection = isCol ? 'column' : 'row';
    Array.prototype.forEach.call(cells, function (c, i) {
      c.style.flex = '0 0 ' + Math.floor(sizes[i][isCol ? 1 : 0] * k) + 'px';
    });
  }

  function fitHtml() {
    figArea.querySelectorAll('.bd-cell.bd-html').forEach(function (cell) {
      var inner = cell.firstElementChild;
      if (!inner) return;
      inner.style.zoom = '';
      var t = inner.querySelector('table') || inner;
      var w = t.offsetWidth, h = t.offsetHeight;
      if (!w || !h) return;
      var k = Math.min(cell.clientWidth / w, cell.clientHeight / h) * 0.96;
      inner.style.zoom = Math.max(1, k).toFixed(3);
    });
  }

  function place() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var hasFig = !!(cur && cur.figBox);
    var hasQ = qbox.childNodes.length > 0 && showQ;
    var figW = Math.round(vw * 0.62) - LEFT;
    qbox.style.top = TOP + 'px'; qbox.style.left = LEFT + 'px';
    qbox.style.display = showQ ? '' : 'none';
    qbox.style.maxWidth = (hasFig ? figW : Math.round(vw * 0.6)) + 'px';

    qbox.style.fontSize = '';
    if (hasFig && hasQ) {
      var fs = 28;
      while (qbox.offsetHeight > vh * 0.3 && fs > 16) { fs -= 2; qbox.style.fontSize = fs + 'px'; }
    }
    var figTop = hasQ ? TOP + qbox.offsetHeight + 14 : TOP;
    figArea.style.display = hasFig ? '' : 'none';
    if (hasFig) {
      figArea.style.left = LEFT + 'px'; figArea.style.top = figTop + 'px';
      figArea.style.width = figW + 'px'; figArea.style.height = Math.max(160, vh - figTop - 20) + 'px';
    }
    var sLeft = hasFig ? LEFT + figW + 28 : Math.round(vw * 0.64);
    stepsBox.style.top = TOP + 'px'; stepsBox.style.left = sLeft + 'px';
    stepsBox.style.width = Math.max(200, vw - sLeft - DOCK) + 'px';
    if (hasFig) fillFig();
  }

  function paintToggles() {
    bAll.style.display = bNone.style.display = quadMode ? '' : 'none';
    bGPrev.style.display = bGNext.style.display = quadMode && quadSpec && quadSpec.groups && quadSpec.groups.length > 1 ? '' : 'none';
    if (quadMode) { bQ.style.display = bS.style.display = bPrev.style.display = bNext.style.display = 'none'; return; }
    var hasQ = qbox.childNodes.length > 0;
    bQ.style.display = hasQ ? '' : 'none';
    bQ.classList.toggle('bd-on', showQ);
    qbox.style.display = showQ ? '' : 'none';
    var hasS = !!(cur && cur.host && cur.host.querySelector('.q-line, .q-ask, .p-line, .p-ask'));
    bS.style.display = hasS ? '' : 'none';
    bS.classList.toggle('bd-on', showS);
    stepsBox.style.display = showS && hasS ? '' : 'none';
    var h = cur && cur.hook;
    bPrev.style.display = bNext.style.display = h ? '' : 'none';
    if (h) { bPrev.disabled = h.k() <= 0; bNext.disabled = h.k() >= h.total; }
  }

  function step(d) {
    var h = cur && cur.hook;
    if (!h) return;
    if (d > 0) h.next(); else h.prev();
    if (!h.fig) showS = true;
    fillFig();
    if (showS) fillSteps();
    paintToggles();
  }

  function open(fromBox) {
    ensure();
    var sc = scope();
    var figBox = fromBox || (sc && sc.querySelector('.q-fig')) || null;
    var host = (figBox && figBox.closest('.visual-host')) ||
               (sc && sc.querySelector('.p-qtext') && sc.querySelector('.p-qtext').closest('.visual-host')) || null;
    var hs = host && host.__steps;
    cur = { host: host, figBox: figBox,
            hook: figBox && figBox.__board ? figBox.__board : (hs && host.contains(hs.live) ? hs : null) };
    showQ = true; showS = false;
    leaveQuad();
    var q = question(host);
    fillQuestion(q);
    badge.innerHTML = '';
    badge.appendChild(document.createTextNode('計算紙' + (q && q.label && q.label !== '範例' ? '　' + q.label : '')));
    el('span', 'bd-note', badge).textContent = '關閉後筆跡不保留';
    stepsBox.innerHTML = '';
    clearPen();
    document.body.classList.add('bd-open');
    layer.classList.remove('hidden');
    bar.classList.remove('hidden');
    if (btn) btn.classList.add('active');
    place();
    paintToggles();
    if (!app.classList.contains('pen-on')) document.getElementById('dkPen').click();
  }

  function close() {
    if (!isOpen()) return;
    clearPen();
    qbox.innerHTML = ''; figArea.innerHTML = ''; stepsBox.innerHTML = '';
    leaveQuad();
    cur = null;
    layer.classList.add('hidden');
    bar.classList.add('hidden');
    document.body.classList.remove('bd-open');
    if (btn) btn.classList.remove('active');
  }

  function leaveQuad() {
    quadMode = false; quadSpec = null;
    if (!quad) return;
    quad.classList.add('hidden'); quad.innerHTML = '';
    quadCells.forEach(function (c) { if (c.btn) c.btn.remove(); });
    quadCells = [];
    qbox.style.display = '';
  }

  var quadSpec = null, quadGroup = 0;
  function openQuad(spec) {
    ensure();
    leaveQuad();
    quadMode = true; quadSpec = spec; quadGroup = 0;
    cur = null; showQ = false; showS = false;
    qbox.innerHTML = ''; figArea.innerHTML = ''; stepsBox.innerHTML = '';
    qbox.style.display = 'none'; figArea.style.display = 'none'; stepsBox.style.display = 'none';
    clearPen();
    document.body.classList.add('bd-open');
    layer.classList.remove('hidden');
    bar.classList.remove('hidden');
    if (btn) btn.classList.add('active');
    fillQuad();
    if (!app.classList.contains('pen-on')) document.getElementById('dkPen').click();
  }

  function fillQuad() {
    var spec = quadSpec, gs = spec.groups || [{ label: spec.label, cells: spec.cells }];
    var g = gs[quadGroup] || gs[0];
    quadCells.forEach(function (c) { if (c.btn) c.btn.remove(); });
    quadCells = [];
    quad.innerHTML = '';
    quad.style.gridTemplateColumns = 'repeat(' + (spec.cols || 2) + ', 1fr)';
    quad.style.gridTemplateRows = 'repeat(' + (spec.rows || 2) + ', 1fr)';
    badge.innerHTML = '';
    badge.appendChild(document.createTextNode((spec.title || '計算紙（四題）') + (g.label ? '　' + g.label : '')));
    el('span', 'bd-note', badge).textContent = (spec.note || '點一格看下一步') + '　關閉後筆跡不保留';
    quad.classList.remove('hidden');
    (g.cells || []).forEach(function (cd) {
      var cell = el('div', 'bd-qc', quad);
      var q = el('div', 'bd-qc-q', cell);
      el('span', 'bd-qc-no', q).textContent = cd.no || '';
      var qb = el('span', '', q);
      if (cd.q) { var c = cd.q.cloneNode(true); c.removeAttribute('style'); qb.appendChild(c); }
      else if (cd.qHtml) qb.innerHTML = cd.qHtml;
      var box = el('div', 'bd-qc-steps', cell);
      var n;
      if (cd.html) { box.classList.add('bd-qc-free'); cell.classList.add('bd-qc-ld'); box.innerHTML = cd.html; n = cd.n; }
      else {
        box.innerHTML = (cd.lines || []).map(function (l, i) {
          return '<div class="bd-qc-ln bd-r' + (l.cont ? ' cont' : '') + (l.fin ? ' fin' : '') + '" data-r="' + i + '">' +
            (l.why ? '<span class="bd-qc-why">' + l.why + '</span>' : '') + l.html + '</div>';
        }).join('');
        n = (cd.lines || []).length;
      }
      var rs = box.querySelectorAll('.bd-r');
      var nb = el('button', 'zoom-btn bd-qnext', document.body);
      nb.type = 'button';
      var it = { cell: cell, btn: nb, k: 0, n: n };
      it.paint = function () {
        Array.prototype.forEach.call(rs, function (x) { x.classList.toggle('on', +x.getAttribute('data-r') < it.k); });
        nb.textContent = it.k >= it.n ? '✓ 收起' : (cd.no || '') + ' ' + (spec.stepWord || '下一步') + ' ›';
        nb.classList.toggle('bd-on', it.k >= it.n);
      };
      it.go = function () { it.k = it.k >= it.n ? 0 : it.k + 1; it.paint(); };
      nb.onclick = function (e) { e.stopPropagation(); it.go(); };
      cell.onclick = it.go;
      it.paint();
      quadCells.push(it);
    });
    paintToggles();
    placeQuad();
    var mj = window.MathJax && window.MathJax.typesetPromise;
    if (mj) window.MathJax.typesetPromise([quad]).then(placeQuad).catch(placeQuad);
  }
  function quadGo(d) {
    var gs = quadSpec && quadSpec.groups;
    if (!gs || gs.length < 2) return;
    quadGroup = (quadGroup + d + gs.length) % gs.length;
    clearPen();
    fillQuad();
  }

  function placeQuad() {
    if (!quadMode) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    quad.style.top = (TOP - 8) + 'px'; quad.style.left = '0px';
    quad.style.width = (vw - DOCK) + 'px'; quad.style.height = (vh - TOP + 8) + 'px';
    var big = quadSpec && quadSpec.rows === 1 ? 1.25 : 1;
    var base = Math.max(16, Math.min(44 * big, vw * 0.024 * big, vh * 0.044 * big));
    quadCells.forEach(function (it) {
      var fs = base;
      it.cell.style.fontSize = fs + 'px';
      while ((it.cell.scrollHeight > it.cell.clientHeight + 1 || it.cell.scrollWidth > it.cell.clientWidth + 1) && fs > 16) { fs -= 2; it.cell.style.fontSize = fs + 'px'; }
      var r = it.cell.getBoundingClientRect();
      it.btn.style.top = Math.round(r.bottom - 52) + 'px';
      it.btn.style.left = Math.round(r.right - it.btn.offsetWidth - 16) + 'px';
    });
  }

  window.BOARD = { openQuad: openQuad };

  if (btn) btn.onclick = function () { if (isOpen()) close(); else open(null); };

  window.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    var h = cur && cur.hook;
    if (h && (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ')) { e.preventDefault(); e.stopImmediatePropagation(); step(1); return; }
    if (h && (e.key === 'ArrowLeft' || e.key === 'PageUp')) { e.preventDefault(); e.stopImmediatePropagation(); step(-1); return; }
    if (['Escape', 'ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'].indexOf(e.key) >= 0) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }, true);

  function decorate(root) {
    (root.querySelectorAll ? root.querySelectorAll('.q-fig') : []).forEach(function (box) {
      if (box.querySelector(':scope > .bd-figbtn')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bd-figbtn';
      b.textContent = '🔍 只看圖';
      b.onclick = function (e) { e.stopPropagation(); open(box); };
      box.appendChild(b);
    });
  }
  new MutationObserver(function () { decorate(document); })
    .observe(document.body, { childList: true, subtree: true });
  decorate(document);
})();
