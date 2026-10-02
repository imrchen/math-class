(function () {
  var key = 'mathdeck.theme:' + location.pathname.replace(/[^\/]*$/, ''), cur = '';
  try {
    var m = location.search.match(/[?&]theme=(\w*)/);
    if (m) { cur = m[1]; localStorage.setItem(key, cur); } else cur = localStorage.getItem(key) || '';
  } catch (e) {}
  if (cur !== 'warm') cur = '';
  var root = document.documentElement;
  if (cur) root.dataset.theme = cur;

  var DEFAULT = {
    '#2563eb': '#8a3b1e', '#1d4ed8': '#8a3b1e', '#1e40af': '#8a3b1e',
    '#7c3aed': '#5a3d78', '#6d28d9': '#5a3d78',
    '#059669': '#3d5a26', '#065f46': '#3d5a26',
    '#d97706': '#704708', '#92400e': '#704708',
    '#e11d48': '#8a2638', '#be123c': '#8a2638',
    '#0891b2': '#2f5f5a', '#0e7490': '#2f5f5a', '#155e75': '#2f5f5a',
    '#172033': '#1f1c17', '#0b1220': '#1f1c17',
    '#334155': '#45403a', '#475569': '#57514a', '#657187': '#57514a', '#8a94a6': '#6f685e',
    '#94a3b8': '#a0927c', '#dce3ee': '#d9cfc0', '#c3cddd': '#cfc4b3',
    '#eff6ff': '#f7efe6', '#f2f6ff': '#f7efe6', '#ecfeff': '#eef3ef', '#eef2f9': '#efe8dd', '#f3f5f9': '#f3eee6', '#f8fafc': '#f8f4ec'
  };
  var T = window.DECK_THEME = {
    list: [{ id: '', label: '原色' }, { id: 'warm', label: '暖色' }],
    current: cur,
    colors: DEFAULT,
    set: function (id) {
      try { localStorage.setItem(key, id); } catch (e) {}

      var on = document.querySelector('.toc-item.active');
      var q = location.search.replace(/([?&])theme=\w*&?/, '$1').replace(/[?&]$/, '');
      history.replaceState(null, '', location.pathname + q + (on ? '#p=' + on.dataset.i : ''));
      location.reload();
    }
  };
  if (!cur || typeof MutationObserver === 'undefined') return;

  var HEX = /#[0-9a-fA-F]{6}\b/g;
  function fix(el) {
    if (el.nodeType !== 1 || el instanceof SVGElement) return;
    var s = el.getAttribute('style');
    if (!s || s.indexOf('#') < 0) return;
    var t = s.replace(HEX, function (h) { return T.colors[h.toLowerCase()] || h; });
    if (t !== s) el.setAttribute('style', t);
  }
  function sweep(node) {
    if (node.nodeType !== 1 || node instanceof SVGElement) return;
    fix(node);
    var all = node.querySelectorAll('[style]');
    for (var i = 0; i < all.length; i++) fix(all[i]);
  }
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 'attributes') fix(r.target);
      else for (var j = 0; j < r.addedNodes.length; j++) sweep(r.addedNodes[j]);
    }
  }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  document.addEventListener('DOMContentLoaded', function () { sweep(document.body); });
})();
