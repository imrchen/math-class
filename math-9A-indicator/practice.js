window.PRACTICE = (function () {
  const INK = '#172033', GREY = '#8a94a6', ANS = '#059669';
  const SRCCOL = { '課本・隨堂練習': '#2563eb', '習作': '#d97706', '習作・章末總習題': '#7c3aed', '習作・暖身題': '#0891b2' };

  const S = (sec) => (window.SOLUTIONS || {})[sec] || {};

  function conceptOf(sec, tag) {
    const d = S(sec)[tag] || {};
    if (d.concept && d.concept.length) return d.concept;
    const parent = String(tag).replace(/\s*[⑴-⑿]\s*$/, '');
    if (parent === tag) return null;
    const sib = S(sec)[parent + ' ⑴'];
    return sib && sib.concept && sib.concept.length ? sib.concept : null;
  }
  const strip = (s) => String(s || '').replace(/\\\(|\\\)/g, '').replace(/\s+/g, ' ').trim();

  const texWide = (p) => p
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\(?:frac|dfrac|tfrac|overline|triangle|angle|therefore|degree|sim|cong|times|div|ne|le|ge|cdot|left|right|text|mathrm)\b/g, 'xx')
    .replace(/\\[a-zA-Z]+/g, 'x')
    .replace(/[{}]/g, '')
    .length;

  const short = (s, n) => {
    const one = String(s || '').split('\n')[0];
    const parts = one.split(/(\\\([\s\S]*?\\\))/).filter(Boolean);
    let out = '', len = 0;
    for (const p of parts) {
      const math = /^\\\(/.test(p);
      const vis = math ? texWide(p) : p.length;
      if (len + vis > n) {
        if (!math) out += p.slice(0, Math.max(0, n - len));
        return out.replace(/\s+$/, '') + '…';
      }
      out += p; len += vis;
    }
    return out.replace(/\s+/g, ' ').trim();
  };

  function row(sec, tag, opt) {
    const d = S(sec)[tag];
    if (!d) return '';
    const lv = opt && opt.level ? `<span style="flex:0 0 auto;font-size:11px;font-weight:900;color:${ANS}">${opt.level}</span>` : '';
    return `<div class="q-row" data-tag="${tag}" style="display:flex;gap:9px;align-items:baseline;padding:3px 0;border-radius:8px;cursor:pointer">
      <span style="flex:0 0 92px;font-size:11.5px;font-weight:900;color:${GREY};white-space:nowrap">${tag}</span>
      <span style="flex:1;font-size:13px;color:${INK};line-height:1.5">${short(d.q, 30)}</span>
      ${lv}<span style="flex:0 0 12px;text-align:right;font-size:15px;font-weight:900;color:#2563eb">›</span></div>`;
  }
  const card = (src, page, sub, rows) => {
    const col = SRCCOL[src] || '#2563eb';
    return `<div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:4px 13px">
        <span style="font-size:13px;font-weight:900;color:#fff">${src}</span>
        <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${page}</span>
      </div>
      <div style="padding:5px 13px 7px">${sub ? `<div style="font-size:11.5px;color:#657187;margin-bottom:1px">${sub}</div>` : ''}${rows}</div></div>`;
  };

  function detail(h, sec, tag, back) {
    const d = S(sec)[tag];
    if (!d) return false;

    const fig = d.fig;
    const canDraw = (f) => !!(f && window.FIG && window.FIG.render(f, { accentStep: 0 }));
    const figList = (d.figs && d.figs.length ? d.figs : (fig ? [fig] : [])).filter(canDraw);
    const figSteps = (window.FIG && window.FIG.accentCount) ? window.FIG.accentCount(figList[0]) : 0;
    const lines = d.steps.concat(d.ans ? ['答：' + d.ans] : []);
    const total = Math.max(lines.length, figSteps);
    const col = SRCCOL[d.src] || '#2563eb';
    const hasFig = figList.length > 0;

    const allFigs = (d.figs && d.figs.length ? d.figs : (fig ? [fig] : []));
    const needRef = figList.length < allFigs.length || !hasFig;

    const cpt = conceptOf(sec, tag);
    const cptHtml = cpt ? `<div style="margin:8px 14px 0;background:#ecfeff;border:1.5px solid #67e8f9;
      border-left:5px solid #0891b2;border-radius:10px;padding:7px 12px">
      <div style="font-size:11.5px;font-weight:900;color:#0e7490;letter-spacing:.05em;margin-bottom:2px">概念提示</div>
      ${cpt.map(c => `<div style="font-size:14px;color:${INK};line-height:1.55">${c.replace(/\n/g, '<br>')}</div>`).join('')}
    </div>` : '';

    const QNUM = /^\s*[\u2460-\u2473]/;
    const isAsk = lines.map(t => QNUM.test(String(t)));
    const stepsHtml = lines.map((t, i) =>
      `<div class="q-line" data-i="${i}" style="${isAsk[i] ? '' : 'visibility:hidden;'}font-size:${i === lines.length - 1 && d.ans ? 19 : 17}px;
        font-weight:${i === lines.length - 1 && d.ans ? 900 : isAsk[i] ? 800 : 700};color:${i === lines.length - 1 && d.ans ? ANS : INK};line-height:1.5${isAsk[i] ? '' : ';padding-left:20px'}">${t}</div>`).join('');

    h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:9px">
      <div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:4px 13px">
          <span style="font-size:13px;font-weight:900;color:#fff">${d.src} ${tag}</span>
          <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${d.page}</span>
        </div>
        ${cptHtml}
        <div style="padding:8px 14px;font-size:15px;color:${INK};line-height:1.55">${d.q.replace(/\n/g, '<br>')}
          ${needRef && d.ref ? `<div style="font-size:12px;color:${GREY};margin-top:4px">（${d.ref}）</div>` : ''}</div>
      </div>
      <div class="q-body" style="display:flex;gap:10px;align-items:stretch">
        ${hasFig ? `<div class="q-fig" style="flex:0 0 44%;min-width:0;overflow:hidden;background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:6px;display:flex;align-items:center;justify-content:center"></div>` : ''}
        <div class="q-stepbox" style="flex:1 1 0;min-width:0;background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:12px 16px 26px">
          <div class="q-steps" style="display:flex;flex-direction:column;gap:20px">${stepsHtml}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button class="q-next" style="border:1.5px solid #2563eb;background:#2563eb;color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一步</button>
        <button class="q-all" style="border:1.5px solid ${ANS};background:#fff;color:${ANS};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
        <button class="q-back" style="border:1.5px solid #c3cddd;background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
      </div></div>`;

    const figStepAt = (k) => {
      if (figSteps <= 0) return 0;
      if (k >= total) return figSteps;
      if (total <= 1) return 0;
      return Math.min(figSteps - 1, Math.ceil(k * (figSteps - 1) / (total - 1)));
    };

    const figBox = h.querySelector('.q-fig');
    const els = [...h.querySelectorAll('.q-line')];
    const next = h.querySelector('.q-next');
    let k = 0;
    const paint = () => {
      els.forEach((e, i) => { e.style.visibility = (isAsk[i] || i < Math.min(k, lines.length)) ? 'visible' : 'hidden'; });
      if (figBox) {
        figBox.innerHTML = `<div class="q-figin" style="width:100%;display:flex;flex-direction:column;gap:6px">`
          + figList.map((f, idx) => window.FIG.render(f,
              { accentStep: idx === 0 ? figStepAt(k) : window.FIG.accentCount(f) }) || '').join('')
          + `</div>`;

        figWide(figBox, Math.round(h.clientHeight * 0.52));
      }

      if (k >= total) { next.disabled = true; next.style.opacity = '.4'; next.style.cursor = 'default'; }
    };

    if (figBox && typeof ResizeObserver !== 'undefined') new ResizeObserver(scheduleRefit).observe(figBox);

    next.onclick = () => { if (k < total) { k++; while (k < lines.length && isAsk[k]) k++; paint(); } };
    h.querySelector('.q-all').onclick = () => { k = total; paint(); };
    h.querySelector('.q-back').onclick = back;
    paint();
    if (window.MJ) MJ(h);
    fit(h);

    setTimeout(() => { const box = h.querySelector('.q-stepbox'); if (box) fitSteps(box); }, 120);
    return true;
  }

  function fit(h, floor) {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => {
      const st = h.firstElementChild;
      if (!st || !h.clientHeight) return;
      st.style.zoom = '';
      const cs = window.getComputedStyle(h);
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const need = st.scrollHeight, have = h.clientHeight - pad;
      if (have > 0 && need > have) st.style.zoom = Math.max(floor || 0.55, (have / need) * 0.985).toFixed(3);
      if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    };
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([h]).then(go).catch(go);
    else setTimeout(go, 60);
  }

  function fitSteps(outer) {
    if (typeof window === 'undefined') return;
    const wrap = outer.querySelector('.q-steps');
    if (!wrap) return;
    wrap.style.zoom = '';
    outer.querySelectorAll('mjx-container svg').forEach(v => { v.style.maxWidth = 'none'; });
    const cs = window.getComputedStyle(outer);
    const have = outer.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    let need = 0;
    wrap.querySelectorAll('.q-line').forEach(l => {
      const pl = parseFloat(window.getComputedStyle(l).paddingLeft) || 0;
      let w = l.scrollWidth;
      l.querySelectorAll('mjx-container').forEach(c => { w = Math.max(w, pl + c.offsetWidth); });
      need = Math.max(need, w);
    });

    if (have > 0 && need > have) wrap.style.zoom = Math.max(0.55, (have / need) * 0.985).toFixed(3);
    outer.dataset.fitW = Math.round(outer.clientWidth);
  }

  function figWide(box, capH) {
    if (typeof window === 'undefined') return;
    const inner = box.querySelector('.q-figin');
    if (!inner) return;
    inner.style.zoom = '';

    const wide = inner.querySelector('table, svg');
    const haveW = box.clientWidth - 12;
    const needW = Math.max(inner.scrollWidth, wide ? wide.scrollWidth : 0);
    let z = 1;
    if (haveW > 0 && needW > haveW) z = Math.min(z, (haveW / needW) * 0.99);

    const inZoom = !!box.closest('#zoomBody');
    if (z < 1) inner.style.zoom = Math.max(inZoom ? 0.25 : 0.42, z).toFixed(3);

    box.style.maxHeight = capH > 0 ? capH + 'px' : '';

    const arts = inner.querySelectorAll('svg');
    if (arts.length && capH > 0) {
      const each = (capH - 14 - (arts.length - 1) * 6) / arts.length;
      arts.forEach(a => { a.style.maxHeight = Math.max(60, each) + 'px'; a.style.height = 'auto'; });
    }
    box.dataset.fitW = Math.round(box.clientWidth);
  }

  function needsRefit(box) {
    const w = Math.round(box.clientWidth);
    if (!w) return false;
    if (w !== +box.dataset.fitW) return true;
    const inner = box.querySelector('.q-figin');
    if (!inner) return false;
    const wide = inner.querySelector('table, svg');
    const z = parseFloat(inner.style.zoom) || 1;
    const need = Math.max(inner.scrollWidth, wide ? wide.scrollWidth : 0) * z;
    return need > w - 11;
  }

  function refitAll() {
    document.querySelectorAll('.q-fig').forEach(box => {
      if (!needsRefit(box)) return;
      const host = box.closest('.visual-host');
      figWide(box, host ? Math.round(host.clientHeight * 0.52) : 0);
    });

    document.querySelectorAll('.q-stepbox').forEach(box => {
      const w = Math.round(box.clientWidth);
      if (w && w !== +box.dataset.fitW) fitSteps(box);
    });
  }

  function scheduleRefit() {
    if (scheduleRefit._q) return;
    scheduleRefit._q = true;
    requestAnimationFrame(() => { scheduleRefit._q = false; refitAll(); });
  }
  function settle() { [100, 320, 700, 1200, 1900, 2800, 3800].forEach(t => setTimeout(refitAll, t)); }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', settle, true);
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(recs => {
        for (const r of recs) {
          const t = r.target;
          if (t.nodeType === 1 && t.classList && t.classList.contains('visual-host')) { scheduleRefit(); return; }
        }
      }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style'] });
    }
    if (typeof window !== 'undefined') window.addEventListener('resize', scheduleRefit);
  }

  function page(h, sec, groups) {
    const render = () => {
      h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:8px">` +
        groups.map(g => card(g.src, g.page, g.sub, g.tags.map(t => row(sec, t, g)).join(''))).join('') +
        `</div>`;
      h.querySelectorAll('.q-row').forEach(r => {
        const tag = r.dataset.tag;
        if (!S(sec)[tag]) { r.style.cursor = ''; r.querySelector('span:last-child').remove(); return; }
        r.onmouseenter = () => { r.style.background = '#f2f6ff'; };
        r.onmouseleave = () => { r.style.background = ''; };
        r.onclick = () => detail(h, sec, tag, render);
      });
      if (window.MJ) MJ(h);
      fit(h);
    };
    render();
  }

  function answerKey(h, sec, groups) {
    const K = '#0b1220', ANS = '#1e3a8a', MISS = '#b91c1c';
    const clean = (a) => String(a || '').trim().replace(/^答\s*[：:]\s*/, '');

    const letter = (a) => { const m = /^選?\s*[\(（]\s*([A-Ea-e])\s*[\)）]/.exec(String(a).replace(/\\[()]/g, '').trim()); return m ? m[1].toUpperCase() : null; };

    const vis = (a) => a.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
      .replace(/\\[()]/g, '').replace(/\\[a-zA-Z]+/g, 'x').replace(/[${}^_\s]/g, '').length;

    const dropLab = (no, a) => {
      const labs = String(a).match(/[①-⑳]|[(（]\d+[)）]/g) || [];
      const m = /^\s*([①-⑳]|[(（]\d+[)）])\s*/.exec(a);
      return m && labs.length === 1 && String(no).includes(m[1]) ? a.slice(m[0].length) : a;
    };
    const items = (g) => g.items.map(([no, tag]) => {

      const d = S(sec)[tag];
      const a = dropLab(no, clean(d ? (d.key || d.ans) : ''));
      const L = letter(a);
      return { no, a, L, tiny: !!L || (a && vis(a) <= 2) };
    });

    const texAns = (a) => !/\\\(/.test(a) ? a : a.split(/(\\\([\s\S]*?\\\))/).map(s =>
      /^\\\(/.test(s) ? s : (s.trim() ? `<span style="color:${K};font-size:.82em">${s}</span>` : s)).join('');
    const big = (it) => `<div style="border:3px solid ${K};border-radius:10px;background:#fff;
        text-align:center;padding:6px 2px 4px;min-width:0">
      <div style="font-size:20px;font-weight:800;color:${K};line-height:1.15;white-space:nowrap">${it.no}</div>
      <div style="font-size:52px;font-weight:900;color:${it.a ? ANS : MISS};line-height:1.05">${
        it.L || (it.a ? it.a : '？')}</div>
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
    if (window.MJ) MJ(h);

    const settle = () => akRefresh(h.querySelector('.ak-root'), true);
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([h]).then(settle).catch(settle);
    } else fit(h);
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

      fit(host, 0.3);
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

  return { page, detail, answerKey, refit: refitAll };
})();
