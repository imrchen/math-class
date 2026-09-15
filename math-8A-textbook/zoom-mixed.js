(function () {
  var busy = false, timers = [];

  function isMixed(host) {
    return !!host.querySelector('.q-fig') && !!host.querySelector('svg:not(mjx-container svg)');
  }

  function fit() {
    if (busy) return;
    var body = document.getElementById('zoomBody');
    if (!body) return;
    var host = body.querySelector('.visual-host');
    if (!host || !isMixed(host)) return;
    busy = true;
    try {
      var baseW = +host.dataset.zoomBase || 460;
      host.style.width = baseW + 'px';
      host.style.margin = '0 auto';
      host.style.transformOrigin = 'top center';
      host.style.flex = 'none';
      host.style.height = 'auto';
      host.style.transform = 'none';

      if (window.PRACTICE && typeof window.PRACTICE.refit === 'function') window.PRACTICE.refit();
      var needH = host.scrollHeight;
      if (!needH) return;
      var k = Math.max(1, Math.min(body.clientWidth / baseW, body.clientHeight / needH, 3.4));
      host.style.transform = 'scale(' + k.toFixed(4) + ')';
    } finally { busy = false; }
  }

  function schedule() {
    timers.forEach(clearTimeout); timers = [];
    [0, 150, 400, 800, 1400, 2200, 3200].forEach(function (t) { timers.push(setTimeout(fit, t)); });
  }
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function (recs) {
      if (busy) return;
      for (var i = 0; i < recs.length; i++) {
        var el = recs[i].target;
        if (el.id === 'zoomModal' || (el.classList && el.classList.contains('visual-host'))) { schedule(); return; }
      }
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }
  document.addEventListener('click', schedule, true);
  window.addEventListener('resize', fit);
})();
