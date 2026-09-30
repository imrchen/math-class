(function () {
  var dock = document.getElementById('dock');
  if (!dock) return;

  var KEYS = { dkPrev: '←', dkNext: '→', dkLaser: 'L', dkPen: 'P', dkClear: 'C' };
  var tip = document.createElement('div');
  tip.className = 'dock-tip hidden';
  document.body.appendChild(tip);
  var timer = null;

  function hide() { clearTimeout(timer); timer = null; tip.classList.add('hidden'); }

  function show(b) {
    var r = b.getBoundingClientRect();
    if (!r.width) return;
    var key = KEYS[b.id];
    tip.innerHTML = '';
    tip.appendChild(document.createTextNode(b.dataset.tip));
    if (key) {
      var k = document.createElement('kbd');
      k.textContent = key;
      tip.appendChild(k);
    }
    tip.classList.remove('hidden');
    tip.style.top = (r.top + r.height / 2 - tip.offsetHeight / 2) + 'px';
    tip.style.left = (r.left - tip.offsetWidth - 12) + 'px';
  }

  dock.querySelectorAll('button[title]').forEach(function (b) {
    var t = b.getAttribute('title').replace(/\s*\([^)]*\)\s*$/, '');
    b.dataset.tip = t;
    b.setAttribute('aria-label', t);
    b.removeAttribute('title');
    b.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(function () { show(b); }, 300);
    });
    b.addEventListener('pointerleave', hide);
    b.addEventListener('pointerdown', hide);
  });
})();
