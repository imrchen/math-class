(function () {
  var btn = document.getElementById('dkBoard');
  var pen = document.getElementById('penCanvas');
  var app = document.querySelector('.app');
  if (!btn || !pen || !app) return;

  var layer = null, bar = null, qbox = null, qbtn = null;

  function clearPen() {
    var x = pen.getContext && pen.getContext('2d');
    if (x) x.clearRect(0, 0, pen.width, pen.height);
  }
  function isOpen() { return !!layer && !layer.classList.contains('hidden'); }

  function ensure() {
    if (layer) return;
    layer = document.createElement('div');
    layer.id = 'wbLayer'; layer.className = 'wb-layer hidden';
    document.body.appendChild(layer);
    bar = document.createElement('div');
    bar.id = 'wbBar'; bar.className = 'zoom-bar wb-bar hidden';
    bar.innerHTML = '<div class="zoom-badge">計算紙<span class="wb-note">關閉後筆跡不保留</span></div>'
      + '<button class="zoom-btn" id="wbQToggle">隱藏題目</button>'
      + '<button class="zoom-btn zoom-x" id="wbClose">✕ 關閉</button>';
    document.body.appendChild(bar);
    bar.querySelector('#wbClose').onclick = close;
    qbtn = bar.querySelector('#wbQToggle');
    qbtn.onclick = function () {
      var hide = !qbox.classList.contains('hidden');
      qbox.classList.toggle('hidden', hide);
      qbtn.textContent = hide ? '顯示題目' : '隱藏題目';
    };
    qbox = document.createElement('div');
    qbox.className = 'wb-q hidden';
    layer.appendChild(qbox);
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

  function question() {
    var zm = document.getElementById('zoomModal');
    var zoomOpen = zm && !zm.classList.contains('hidden');
    var sc = document.getElementById(zoomOpen ? 'zoomBody' : 'slide');
    if (!sc) return null;
    var q = sc.querySelector('.p-qtext');
    if (q) {
      var got = picked.get(q.closest('.visual-host'));
      return got ? { label: got.label, body: got.body.cloneNode(true) } : { label: '', body: q.cloneNode(true) };
    }
    var ex = sc.querySelector(zoomOpen ? '.zoom-q' : '.ex-q');
    return ex && ex.textContent.trim() ? { label: '範例', body: ex.cloneNode(true) } : null;
  }

  function fillQuestion() {
    qbox.innerHTML = '';
    var q = question();
    if (q) {
      if (q.label) {
        var lb = document.createElement('div');
        lb.className = 'wb-q-label'; lb.textContent = q.label;
        qbox.appendChild(lb);
      }
      var c = q.body;
      c.removeAttribute('style'); c.removeAttribute('class');
      c.querySelectorAll('button, .fo-btn, .q-fig').forEach(function (b) { b.remove(); });
      qbox.appendChild(c);
    }
    qbox.classList.toggle('hidden', !q);
    qbtn.style.display = q ? '' : 'none';
    qbtn.textContent = '隱藏題目';
  }

  function open() {
    ensure();
    fillQuestion();
    clearPen();
    document.body.classList.add('wb-open');
    layer.classList.remove('hidden');
    bar.classList.remove('hidden');
    btn.classList.add('active');
    if (!app.classList.contains('pen-on')) document.getElementById('dkPen').click();
  }

  function close() {
    if (!isOpen()) return;
    clearPen();
    qbox.innerHTML = '';
    layer.classList.add('hidden');
    bar.classList.add('hidden');
    document.body.classList.remove('wb-open');
    btn.classList.remove('active');
  }

  btn.onclick = function () { if (isOpen()) close(); else open(); };

  window.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (['Escape', 'ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'].indexOf(e.key) >= 0) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }, true);
})();
