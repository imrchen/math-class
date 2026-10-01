window.ANSWER_KEY = (function () {
  const MATH = {
    dollar: { has: /\$/, is: /^\$/, split: /(\$[^$]+\$)/ },
    paren:  { has: /\\\(/, is: /^\\\(/, split: /(\\\([\s\S]*?\\\))/ },
  };
  const clean = (a) => String(a || '').trim().replace(/^答\s*[：:]\s*/, '');
  let cur = null;

  function answerKey(h, sec, groups) {
    const A = cur, M = A.math === 'paren' ? MATH.paren : MATH.dollar;
    const K = '#0b1220', ANS = '#1e3a8a', MISS = '#b91c1c';

    const letter = (a) => { const m = /^選?\s*[\(（]\s*([A-Ea-e])\s*[\)）]/.exec(String(a).replace(/\\[()]/g, '').trim()); return m ? m[1].toUpperCase() : null; };

    const vis = (a) => a.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
      .replace(/\\[()]/g, '').replace(/\\[a-zA-Z]+/g, 'x').replace(/[${}^_\s]/g, '').length;

    const dropLab = (no, a) => {
      const labs = String(a).match(/[①-⑳]|[(（]\d+[)）]/g) || [];
      const m = /^\s*([①-⑳]|[(（]\d+[)）])\s*/.exec(a);
      return m && labs.length === 1 && String(no).includes(m[1]) ? a.slice(m[0].length) : a;
    };
    const items = (g) => g.items.map(([no, tag]) => {
      const d = A.get(sec, tag);

      const a = dropLab(no, clean(d ? (d.key || d.ans) : ''));
      const L = letter(a);
      return { no, a, L, tiny: !!L || (a && vis(a) <= 2) };
    });

    const texOne = (a) => !M.has.test(a) ? a : a.split(M.split).map(s =>
      M.is.test(s) ? A.tex(s) : (s.trim() ? `<span style="color:${K};font-size:.82em">${s}</span>` : s)).join('');

    const ALT = '#92400e';
    const MARK = /([①-⑳]|[(（]\d+[)）])/;
    const texAns = (a) => {
      const parts = String(a).split(M.split);
      const segs = [''];
      parts.forEach(p => {
        if (M.is.test(p)) { segs[segs.length - 1] += p; return; }
        p.split(MARK).forEach(q => { if (MARK.test(q) && q.length <= 4) segs.push(q); else segs[segs.length - 1] += q; });
      });
      if (segs.length < 3) return texOne(a);
      return (segs[0] ? texOne(segs[0]) : '') + segs.slice(1).map((s, i) =>
        `<span style="color:${i % 2 ? ALT : ANS}">${texOne(s)}</span>`).join('');
    };
    const big = (it) => `<div style="border:3px solid ${K};border-radius:10px;background:#fff;
        text-align:center;padding:6px 2px 4px;min-width:0">
      <div style="font-size:20px;font-weight:800;color:${K};line-height:1.15;white-space:nowrap">${it.no}</div>
      <div style="font-size:52px;font-weight:900;color:${it.a ? ANS : MISS};line-height:1.05">${
        it.L || (it.a ? A.tex(it.a) : '？')}</div>
    </div>`;
    const pair = (it) => `<div style="display:grid;grid-template-columns:auto 1fr;align-items:center;
        border:3px solid ${K};border-radius:10px;background:#fff;min-width:0">
      <div style="font-size:24px;font-weight:800;color:${K};padding:8px 12px;white-space:nowrap;
        border-right:2px solid #64748b;align-self:stretch;display:flex;align-items:center">${it.no}</div>
      <div class="ak-a" style="font-size:28px;font-weight:700;color:${it.a ? ANS : MISS};padding:8px 16px;
        line-height:1.45;min-width:0;white-space:nowrap">${
        it.L || (it.a ? texAns(it.a) : '（查無答案）')}</div>
    </div>`;
    const block = (g) => {
      const its = items(g);
      const head = `<div style="display:flex;align-items:center;gap:10px;margin:0 0 8px;
          font-size:24px;font-weight:800;color:${K}">
        <span style="display:inline-block;width:9px;height:26px;border-radius:2px;background:var(--edition,#d9480f)"></span>${g.label}</div>`;
      if (its.every(it => it.tiny)) {

        const n = its.length, cols = n <= 10 ? Math.max(n, 4) : Math.ceil(n / 2);
        return `<div>${head}<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:10px">
          ${its.map(big).join('')}</div></div>`;
      }

      const ws = its.map(it => it.L ? 1 : vis(it.a)).sort((a, b) => a - b);
      const w = ws[Math.floor((ws.length - 1) * 0.75)];
      const cols = w <= 8 ? 3 : w <= 18 ? 2 : 1;
      const max = w <= 8 ? 5 : w <= 18 ? 3 : 2;
      return `<div>${head}<div class="ak-grid" data-cols="${cols}" data-max="${max}"
          style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:10px 16px">
        ${its.map(pair).join('')}</div></div>`;
    };

    h.innerHTML = `<div class="ak-root" style="width:98%;margin:0 auto;display:flex;flex-direction:column;gap:20px">`
      + `<style>.ak-a mjx-container{font-size:120% !important;max-width:none !important}
          .ak-a mjx-container>svg{max-width:none !important}</style>`
      + groups.map(block).join('') + `</div>`;
    if (window.MJ) window.MJ(h);

    const settle = () => akRefresh(h.querySelector('.ak-root'), true);
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([h]).then(settle).catch(settle);
    } else A.fit(h);
    if (typeof setTimeout === 'function') { setTimeout(settle, 400); setTimeout(settle, 1200); }
  }

  function akLayout(root, key) {
    root.querySelectorAll('.ak-grid').forEach(g => {
      const cells = [...g.children];
      let n = +g.dataset[key] || 1;
      const lay = () => {
        g.style.gridTemplateColumns = `repeat(${n},minmax(0,1fr))`;
        cells.forEach(c => {
          c.style.gridColumn = '';
          const a = c.querySelector('.ak-a'); if (a) a.style.whiteSpace = 'nowrap';
        });
        let wide = 0;
        cells.forEach(c => {
          const a = c.querySelector('.ak-a');
          if (n > 1 && a && a.scrollWidth > a.clientWidth + 1) { c.style.gridColumn = '1 / -1'; wide += 1; }
        });
        return wide;
      };
      while (n > 1 && lay() * 2 > cells.length) n -= 1;
      lay();

      cells.forEach(c => {
        const a = c.querySelector('.ak-a');
        if (a && a.scrollWidth > a.clientWidth + 1) a.style.whiteSpace = 'normal';
      });
    });
  }

  function akRefresh(root, force) {
    if (!root || !root.isConnected) return;
    const host = root.closest('.visual-host') || root.parentElement;
    const body = root.closest('#zoomBody');
    if (!body) {
      const back = root.dataset.mode === 'wide';
      if (!force && !back) return;
      if (back || !root.dataset.mode) {
        root.style.zoom = '';
        akLayout(root, 'cols');
        root.dataset.mode = 'normal';
      } else akLayout(root, 'cols');

      A.fit(host, 0.3);
      return;
    }

    const cs = window.getComputedStyle(body);
    const padV = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const padH = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const BW = body.clientWidth - padH;
    const BH = window.innerHeight - Math.max(0, body.getBoundingClientRect().top) - padV - 8;
    if (BW <= 0 || BH <= 0) return;
    if (root.dataset.mode === 'wide' && host.style.transform === root.dataset.tf) return;
    const baseW = +host.dataset.zoomBase || 460;
    host.style.margin = '0 auto';
    host.style.transformOrigin = 'top center';
    host.style.flex = 'none';
    host.style.height = 'auto';
    host.style.transform = 'none';
    root.style.zoom = '';
    let best = null;
    [1, 1.25, 1.5, 1.75, 2, 2.4].forEach(m => {
      const W = Math.round(baseW * m);
      if (W > BW) return;
      host.style.width = W + 'px';
      akLayout(root, 'max');
      const needH = host.scrollHeight;
      const k = Math.min(BW / W, BH / needH, 3.4);
      if (!best || k > best.k + 0.01) best = { W, k };
    });
    if (!best) return;
    host.style.width = best.W + 'px';
    akLayout(root, 'max');

    const tf = 'scale(' + Math.max(0.5, best.k).toFixed(4) + ')';
    host.style.transform = tf;
    root.dataset.tf = tf;
    root.dataset.mode = 'wide';
  }
  (function watchZoom() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    let timers = [], busy = false;
    const run = () => {
      if (busy) return; busy = true;
      try { document.querySelectorAll('.ak-root').forEach(akRefresh); } finally { busy = false; }
    };
    const schedule = () => {
      timers.forEach(clearTimeout);
      timers = [0, 150, 400, 800, 1400, 2200, 3200].map(ms => setTimeout(run, ms));
    };
    new MutationObserver(recs => {
      if (busy) return;
      for (const r of recs) {
        const el = r.target;
        if (el.id === 'zoomModal' || (el.classList && el.classList.contains('visual-host'))) { schedule(); return; }
      }
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    document.addEventListener('click', schedule, true);
    window.addEventListener('resize', schedule);
  })();

  return {
    create(adapter) { cur = adapter; return answerKey; },
  };
})();
