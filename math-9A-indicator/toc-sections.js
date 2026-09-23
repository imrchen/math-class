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
      subgroup(sec);
    });
    items.dataset.sectioned = '1';
  }

  const RULES = (window.TOC_GROUPS || []).map(([name, re]) => [name, new RegExp(re)]);
  const REST = window.TOC_GROUP_REST || '其他';
  function kind(btn) {
    const t = btn.title || btn.textContent;
    for (const [name, re] of RULES) if (re.test(t)) return name;
    return REST;
  }
  function subgroup(sec) {
    if (!RULES.length) return;
    const btns = [...sec.querySelectorAll(':scope > .toc-item')];
    if (new Set(btns.map(kind)).size < 2) return;
    let box = null, cur = null;
    btns.forEach(btn => {
      const k = kind(btn);
      if (k !== cur) {
        cur = k;
        const self = document.createElement('div');
        box = self;
        self.className = 'toc-group';
        const head = document.createElement('div');
        head.className = 'toc-ghead';
        head.innerHTML = '<span class="tg-name">' + k + '</span><span class="tg-n"></span>';
        head.addEventListener('click', (e) => {
          e.stopPropagation();
          self.classList.toggle('open');
        });
        self.appendChild(head);
        sec.appendChild(self);
      }
      box.appendChild(btn);
    });
    sec.querySelectorAll(':scope > .toc-group').forEach(g => {
      g.querySelector('.tg-n').textContent = g.querySelectorAll('.toc-item').length;
    });
  }

  let lastSec = null, lastGroup = null;
  function openActive() {
    const act = document.querySelector('.toc-item.active');
    if (!act) return;
    const grp = act.closest('.toc-group');
    if (grp && grp !== lastGroup) { lastGroup = grp; grp.classList.add('open'); }
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
