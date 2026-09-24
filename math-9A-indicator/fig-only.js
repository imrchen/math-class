(function () {
  var layer = null, bar = null, badge = null;

  function clearPen() {
    var c = document.getElementById('penCanvas');
    var x = c && c.getContext && c.getContext('2d');
    if (x) x.clearRect(0, 0, c.width, c.height);
  }
  function isOpen() { return !!layer && !layer.classList.contains('hidden'); }

  function ensure() {
    if (layer) return;
    layer = document.createElement('div');
    layer.id = 'figOnly'; layer.className = 'fo-layer hidden';
    document.body.appendChild(layer);
    bar = document.createElement('div');
    bar.id = 'figOnlyBar'; bar.className = 'zoom-bar fo-bar hidden';
    bar.innerHTML = '<div class="zoom-badge" id="figOnlyBadge"></div>'
      + '<button class="zoom-btn zoom-x" id="figOnlyClose">✕ 關閉</button>';
    document.body.appendChild(bar);
    badge = bar.querySelector('#figOnlyBadge');
    bar.querySelector('#figOnlyClose').onclick = close;
    window.addEventListener('resize', function () { if (isOpen()) { layout(); fitHtml(); } });
  }

  function titleOf(box) {
    var body = box.closest('.q-body');
    var card = body && body.previousElementSibling;
    var s = card && card.querySelector('span');
    return s ? s.textContent.trim() : '';
  }

  function figHtml(box) {
    if (typeof box.__figOnly === 'function') return box.__figOnly();
    var c = box.cloneNode(true);
    c.querySelectorAll('.fo-btn').forEach(function (b) { b.remove(); });
    return c.innerHTML;
  }

  function layout() {
    var cells = layer.querySelectorAll('.fo-cell');
    Array.prototype.forEach.call(cells, function (c) {
      c.style.flex = '';
      if (c.firstElementChild) c.firstElementChild.style.zoom = '';
    });
    if (cells.length < 2) { layer.style.flexDirection = ''; layer.style.justifyContent = ''; return; }
    var sizes = Array.prototype.map.call(cells, function (c) {
      var s = c.querySelector(':scope > svg');
      var vb = s && s.viewBox && s.viewBox.baseVal;
      if (vb && vb.width) return [vb.width, vb.height];
      var t = c.querySelector('table') || c.firstElementChild;
      return [t.offsetWidth || 1, t.offsetHeight || 1];
    });
    var cs = getComputedStyle(layer);
    var W = layer.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var H = layer.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var gaps = 24 * (cells.length - 1);
    var sum = function (i) { return sizes.reduce(function (a, s) { return a + s[i]; }, 0); };
    var max = function (i) { return Math.max.apply(null, sizes.map(function (s) { return s[i]; })); };
    var kCol = Math.min(W / max(0), (H - gaps) / sum(1));
    var kRow = Math.min((W - gaps) / sum(0), H / max(1));
    var isCol = kCol >= kRow, k = isCol ? kCol : kRow;
    layer.style.flexDirection = isCol ? 'column' : 'row';
    layer.style.justifyContent = 'center';
    Array.prototype.forEach.call(cells, function (c, i) {
      c.style.flex = '0 0 ' + Math.floor(sizes[i][isCol ? 1 : 0] * k) + 'px';
    });
  }

  function fitHtml() {
    layer.querySelectorAll('.fo-cell.fo-html').forEach(function (cell) {
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

  function open(box) {
    ensure();
    var tmp = document.createElement('div');
    tmp.innerHTML = figHtml(box);
    layer.innerHTML = '';

    Array.prototype.slice.call(tmp.children).forEach(function (el) {
      var cell = document.createElement('div');
      cell.className = 'fo-cell';
      var svg = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector(':scope > svg');
      if (svg) {
        svg.removeAttribute('width'); svg.removeAttribute('height');
        svg.style.cssText = 'width:100%;height:100%;max-width:none;max-height:none;display:block';
        cell.appendChild(svg);
      } else {
        cell.classList.add('fo-html');
        cell.appendChild(el);
      }
      layer.appendChild(cell);
    });
    var t = titleOf(box);
    badge.textContent = '只看圖' + (t ? '　' + t : '');
    clearPen();
    document.body.classList.add('fo-open');
    layer.classList.remove('hidden');
    bar.classList.remove('hidden');
    layout();
    fitHtml();
  }

  function close() {
    if (!isOpen()) return;
    clearPen();
    layer.classList.add('hidden');
    bar.classList.add('hidden');
    layer.innerHTML = '';
    document.body.classList.remove('fo-open');
  }

  window.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'].indexOf(e.key) >= 0) {
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  document.addEventListener('click', function (e) {
    if (isOpen() && e.target.closest && e.target.closest('#dkPrev, #dkNext')) close();
  }, true);

  function decorate(root) {
    (root.querySelectorAll ? root.querySelectorAll('.q-fig') : []).forEach(function (box) {
      if (box.querySelector(':scope > .fo-btn')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fo-btn';
      b.textContent = '🔍 只看圖';
      b.onclick = function (e) { e.stopPropagation(); open(box); };
      box.appendChild(b);
    });
  }
  new MutationObserver(function () { decorate(document); })
    .observe(document.body, { childList: true, subtree: true });
  decorate(document);
})();
