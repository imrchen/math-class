(function () {
  var btn = document.getElementById('dkBoard');
  var pen = document.getElementById('penCanvas');
  var app = document.querySelector('.app');
  if (!btn || !pen || !app) return;

  var layer = null, bar = null;

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
      + '<button class="zoom-btn zoom-x" id="wbClose">✕ 關閉</button>';
    document.body.appendChild(bar);
    bar.querySelector('#wbClose').onclick = close;
  }

  function open() {
    ensure();
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
