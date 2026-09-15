(function () {
  if (typeof document === 'undefined') return;

  const NAME = {};
  (window.DECK || []).forEach(c => (c.slides || []).forEach(s => {
    if (s.sec && s.secName && !NAME[s.sec]) NAME[s.sec] = s.secName;
  }));

  function group(chap) {
    const items = chap.querySelector('.toc-items');
    if (!items || items.dataset.sectioned) return;
    const kids = [...items.children];
    if (!kids.length) return;
    let box = null, cur = null;
    kids.forEach(btn => {
      const tag = btn.querySelector('.ti-sec');
      const sec = tag ? tag.textContent.trim() : '';
      if (sec !== cur) {
        cur = sec;

        const self = document.createElement('div');
        box = self;
        self.className = 'toc-section';
        const head = document.createElement('div');
        head.className = 'toc-shead';
        head.innerHTML = '<span class="ts-sec">' + sec + '</span>'
          + '<span class="ts-name">' + (NAME[sec] || '') + '</span>'
          + '<span class="ts-n"></span>';
        head.addEventListener('click', (e) => {
          e.stopPropagation();
          self.classList.toggle('open');
        });
        self.appendChild(head);
        items.appendChild(self);
      }

      if (!btn.title) btn.title = btn.textContent.replace(/^\s*[0-9-]+\s*/, '').trim();
      if (!btn.querySelector('.ti-txt')) {
        const txt = document.createElement('span');
        txt.className = 'ti-txt';
        while (btn.firstChild) txt.appendChild(btn.firstChild);
        btn.appendChild(txt);
      }
      box.appendChild(btn);
    });
    items.querySelectorAll('.toc-section').forEach(sec => {
      sec.querySelector('.ts-n').textContent = sec.querySelectorAll('.toc-item').length;
    });
    items.dataset.sectioned = '1';
  }

  let lastSec = null;
  function openActive() {
    const act = document.querySelector('.toc-item.active');
    if (!act) return;
    const sec = act.closest('.toc-section');
    if (!sec || sec === lastSec) return;
    lastSec = sec;
    sec.classList.add('open');
  }

  function run() {
    const toc = document.getElementById('toc');
    if (!toc) return false;
    const chaps = toc.querySelectorAll('.toc-chapter');
    if (!chaps.length) return false;
    chaps.forEach(group);
    openActive();

    new MutationObserver((muts) => {
      if (muts.some(m => m.target.classList && m.target.classList.contains('toc-item'))) openActive();
    }).observe(toc, { subtree: true, attributes: true, attributeFilter: ['class'] });
    return true;
  }

  if (!run()) {
    let n = 0;
    const t = setInterval(() => { if (run() || ++n > 40) clearInterval(t); }, 50);
    document.addEventListener('DOMContentLoaded', run);
  }
})();
