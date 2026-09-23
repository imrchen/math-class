window.PRACTICE = (function () {
  const INK = '#0b1220', GREY = '#475569', GRN = '#065f46', C = '#1e40af';
  const SRCCOL = {
    '課本・隨堂練習': '#1e40af',
    '習作・基礎練習': '#92400e',
    '課本・自我評量': '#6d28d9',
  };

  const CONT = ['', ' 續', ' 續一', ' 續二', ' 續三', ' 續四', ' 續五'];

  const S = (sec) => (window.SOLUTIONS || {})[sec] || {};

  const figSvg = (d) => (d && d.fig && ((window.FIGURES_LOCAL || {})[d.fig] || (window.FIGURES || {})[d.fig])) || null;
  const tex = (t) => String(t || '').replace(/\$([^$]+)\$/g, (_, m) => '\\(' + m + '\\)');

  const BOILER = /^承上[，,]?[^$]{0,24}。?$/;

  function merged(sec, tag) {
    const d0 = S(sec)[tag];
    if (!d0) return null;
    const steps = [], ansParts = [], qParts = [], keyParts = [];
    for (const suf of CONT) {
      const d = S(sec)[tag + suf];
      if (!d) continue;

      const q = String(d.q || '').trim();
      if (q && !qParts.includes(q) && !BOILER.test(q)) qParts.push(q);
      for (const st of d.steps || []) steps.push(st);
      if (d.ans && !ansParts.includes(d.ans)) ansParts.push(d.ans);

      const k = d.key || d.ans;
      if (k && !keyParts.includes(k)) keyParts.push(k);
    }
    return { src: d0.src, page: d0.page, q: qParts.join('\n'), steps,
             ans: ansParts.join('　'), key: keyParts.join('　'), fig: d0.fig || null };
  }

  const texWide = (p) => p
    .replace(/\$/g, '')
    .replace(/\\(?:frac|dfrac|tfrac|overline|sqrt|times|div|cdot|ne|le|ge|pm|left|right|text|mathrm)\b/g, 'xx')
    .replace(/\\[a-zA-Z]+/g, 'x')
    .replace(/[{}]/g, '')
    .length;

  const short = (s, n) => {
    const one = String(s || '').split('\n')[0];
    const parts = one.split(/(\$[^$]*\$)/).filter(Boolean);
    let out = '', len = 0, gotMath = false;
    for (const p of parts) {
      const math = p.startsWith('$');
      const vis = math ? texWide(p) : p.length;
      if (len + vis > n && !(math && !gotMath)) {
        if (!math) out += p.slice(0, Math.max(0, n - len));
        return tex(out.replace(/\s+$/, '')) + '…';
      }
      out += p; len += vis;
      if (math) gotMath = true;
    }
    return tex(out.replace(/\s+/g, ' ').trim());
  };

  const rowLabel = (tag, d) =>
    /^印\s*\d+/.test(tag) && d.page ? tag.replace(/^印\s*\d+/, d.page.replace(/\s+/g, ' ')) : tag;

  const qHtml = (q) => String(q || '').split('\n').filter(Boolean)
    .map((seg, i) => `<div style="${i ? 'margin-top:7px' : ''}">${tex(seg)}</div>`).join('');

  function row(sec, tag) {
    const d = merged(sec, tag);
    if (!d) return '';
    return `<div class="q-row" data-tag="${tag}" style="display:flex;gap:12px;align-items:baseline;padding:9px 0;border-radius:8px;cursor:pointer">
      <span style="flex:0 0 92px;font-size:15px;font-weight:900;color:${GREY};white-space:nowrap">${rowLabel(tag, d)}</span>
      <span style="flex:1;font-size:18px;color:${INK};line-height:1.5">${short(d.q, 26)}</span>
      ${d.fig && !figSvg(d) ? `<span title="ocho 沒有這張圖，要看紙本" style="flex:0 0 auto;font-size:12px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:6px;padding:0 6px;white-space:nowrap">無圖</span>` : ''}
      <span style="flex:0 0 14px;text-align:right;font-size:20px;font-weight:900;color:${C}">›</span></div>`;
  }

  const card = (src, page, sub, rows) => {
    const col = SRCCOL[src] || C;
    return `<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:7px 15px">
        <span style="font-size:16px;font-weight:900;color:#fff;letter-spacing:.03em">${src}</span>
        <span style="font-size:15px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 10px">${page}</span>
      </div>
      <div style="padding:8px 15px 10px">${sub ? `<div style="font-size:13.5px;color:#334155;margin-bottom:4px">${sub}</div>` : ''}${rows}</div></div>`;
  };

  function parts(sec, tag) {
    const d0 = S(sec)[tag];
    if (!d0) return [];
    const raw = [];
    for (const suf of CONT) {
      const d = S(sec)[tag + suf];
      if (!d) continue;
      const q = String(d.q || '').trim();
      raw.push({
        q: (!q || BOILER.test(q)) ? String(d0.q || '') : q,
        steps: d.steps || [], ans: d.ans || '', fig: d.fig || d0.fig || null
      });
    }

    const nOf = (p) => p.steps.length + (p.ans ? 1 : 0) + (p.fig ? 3 : 0);
    const out = [];
    for (const p of raw) {
      const last = out[out.length - 1];
      if (last && last.q === p.q && nOf(last) + nOf(p) - (last.fig && p.fig ? 3 : 0) <= 7) {
        last.steps = last.steps.concat(p.steps);
        last.ans = [last.ans, p.ans].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join('　');
        last.fig = last.fig || p.fig;
      } else out.push({ q: p.q, steps: p.steps.slice(), ans: p.ans, fig: p.fig });
    }
    return out;
  }

  function detail(h, sec, tag, back) {
    const ps = parts(sec, tag);
    if (!ps.length) return false;
    const d0 = merged(sec, tag);
    const col = SRCCOL[d0.src] || C;
    let idx = 0;

    const render = () => {
      const p = ps[idx];
      const svg = figSvg(p);

      const QNUM = /^\s*[\u2460-\u2473]/;
      const lines = [...p.steps.map(t => ({ t: tex(t), q: QNUM.test(String(t)) })),
                     ...(p.ans ? [{ t: '答：' + tex(p.ans), fin: 1 }] : [])];

      const n = lines.length + (svg ? 3 : 0);
      const fs = n <= 7 ? 20 : n <= 10 ? 18 : 16;
      const gap = n <= 7 ? 26 : n <= 10 ? 18 : 11;
      const more = ps.length > 1;

      h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">
      <div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:5px 13px">
          <span style="font-size:13.5px;font-weight:900;color:#fff">${d0.src}　${rowLabel(tag, d0)}</span>
          <span style="display:flex;gap:7px;align-items:center">
            ${more ? `<button class="q-prev-part" ${idx ? '' : 'disabled'} style="border:0;background:rgba(255,255,255,${idx ? '.28' : '.10'});color:#fff;font-weight:900;font-size:13px;border-radius:7px;padding:1px 8px;cursor:${idx ? 'pointer' : 'default'};opacity:${idx ? 1 : .5}">‹</button>
            <span style="font-size:12.5px;font-weight:900;color:#fff;opacity:.92">第 ${idx + 1}／${ps.length} 段</span>
            <button class="q-next-part" ${idx < ps.length - 1 ? '' : 'disabled'} style="border:0;background:rgba(255,255,255,${idx < ps.length - 1 ? '.28' : '.10'});color:#fff;font-weight:900;font-size:13px;border-radius:7px;padding:1px 8px;cursor:${idx < ps.length - 1 ? 'pointer' : 'default'};opacity:${idx < ps.length - 1 ? 1 : .5}">›</button>` : ''}
            <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${d0.page}</span>
          </span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 14px">
          <div style="flex:1 1 0;min-width:0;font-size:18px;color:${INK};line-height:1.5">${qHtml(p.q)}
            ${p.fig && !svg ? `<div style="margin-top:6px;font-size:13px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:8px;padding:4px 10px;display:inline-block">⚠ ocho 沒有這張圖，請看紙本 ${d0.page}</div>` : ''}</div>
          ${svg ? `<div class="q-fig" style="flex:0 0 40%;max-width:40%;height:220px;display:flex;align-items:center;justify-content:center">${svg}</div>` : ''}
        </div>
      </div>
      <div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:13px 18px 22px;display:flex;flex-direction:column;gap:${gap}px;min-height:${Math.max(130, lines.length * 52)}px">
        ${lines.map((l, i) => `<div class="${l.q ? 'q-ask' : 'q-line'}" data-i="${i}" style="${l.q ? '' : 'visibility:hidden;'}font-size:${l.fin ? fs + 2 : fs}px;
          font-weight:${l.fin ? 900 : l.q ? 800 : 700};color:${l.fin ? GRN : INK};line-height:1.45${l.q ? '' : ';padding-left:18px'}">${l.t}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center">
        <button class="q-next" style="border:1.5px solid ${C};background:${C};color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一行</button>
        <button class="q-all" style="border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
        <button class="q-back" style="border:1.5px solid #94a3b8;background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
      </div></div>`;

      const els = [...h.querySelectorAll('.q-line')];
      const next = h.querySelector('.q-next');
      let shown = 0;
      const step = () => {
        if (shown < els.length) els[shown++].style.visibility = 'visible';
        if (shown >= els.length) { next.disabled = true; next.style.opacity = '.4'; next.style.cursor = 'default'; }
      };
      next.onclick = step;
      h.querySelector('.q-all').onclick = () => { while (shown < els.length) step(); };
      h.querySelector('.q-back').onclick = back;
      const go = (i) => { idx = i; render(); };
      const prevB = h.querySelector('.q-prev-part'), nextB = h.querySelector('.q-next-part');
      if (prevB && idx > 0) prevB.onclick = () => go(idx - 1);
      if (nextB && idx < ps.length - 1) nextB.onclick = () => go(idx + 1);
      if (window.MJ) MJ(h);
      fit(h);
    };

    render();
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
      if (have > 0 && need > have) st.style.zoom = Math.max(floor || 0.6, (have / need) * 0.985).toFixed(3);
      if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    };
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([h]).then(go).catch(go);
    else setTimeout(go, 60);
  }

  function page(h, sec, groups) {
    const render = () => {
      h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:9px">` +
        groups.map(g => card(g.src, g.page, g.sub, g.tags.map(t => row(sec, t)).join(''))).join('') +
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

    const letter = (a) => { const m = /^選?\s*[\(（]\s*([A-Ea-e])\s*[\)）]/.exec(a); return m ? m[1].toUpperCase() : null; };

    const vis = (a) => a.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
      .replace(/\\[a-zA-Z]+/g, 'x').replace(/[${}^_\s]/g, '').length;

    const dropLab = (no, a) => {
      const labs = String(a).match(/[①-⑳]|[(（]\d+[)）]/g) || [];
      const m = /^\s*([①-⑳]|[(（]\d+[)）])\s*/.exec(a);
      return m && labs.length === 1 && String(no).includes(m[1]) ? a.slice(m[0].length) : a;
    };
    const items = (g) => g.items.map(([no, tag]) => {
      const d = merged(sec, tag);

      const a = dropLab(no, clean(d ? (d.key || d.ans) : ''));
      const L = letter(a);
      return { no, a, L, tiny: !!L || (a && vis(a) <= 2) };
    });

    const texAns = (a) => !/\$/.test(a) ? a : a.split(/(\$[^$]+\$)/).map(s =>
      /^\$/.test(s) ? tex(s) : (s.trim() ? `<span style="color:${K};font-size:.82em">${s}</span>` : s)).join('');
    const big = (it) => `<div style="border:3px solid ${K};border-radius:10px;background:#fff;
        text-align:center;padding:6px 2px 4px;min-width:0">
      <div style="font-size:20px;font-weight:800;color:${K};line-height:1.15;white-space:nowrap">${it.no}</div>
      <div style="font-size:52px;font-weight:900;color:${it.a ? ANS : MISS};line-height:1.05">${
        it.L || (it.a ? tex(it.a) : '？')}</div>
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
        const n = its.length, cols = n <= 10 ? n : Math.ceil(n / 2);
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

  return { page, detail, merged, answerKey };
})();
