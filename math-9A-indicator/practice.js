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
    const figSteps = (window.FIG && window.FIG.accentCount) ? window.FIG.accentCount(fig) : 0;
    const lines = d.steps.concat(d.ans ? ['答：' + d.ans] : []);
    const total = Math.max(lines.length, figSteps);
    const col = SRCCOL[d.src] || '#2563eb';
    const hasFig = !!(fig && window.FIG && window.FIG.render(fig, { accentStep: 0 }));

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
          ${!hasFig && d.ref ? `<div style="font-size:12px;color:${GREY};margin-top:4px">（${d.ref}）</div>` : ''}</div>
      </div>
      <div class="q-body" style="display:flex;gap:10px;align-items:stretch">
        ${hasFig ? `<div class="q-fig" style="flex:0 0 44%;min-width:0;overflow:hidden;background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:6px;display:flex;align-items:center;justify-content:center"></div>` : ''}
        <div style="flex:1 1 0;min-width:0;background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:12px 16px 26px;display:flex;flex-direction:column;gap:20px">${stepsHtml}</div>
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
        figBox.innerHTML = `<div class="q-figin" style="width:100%">${window.FIG.render(fig, { accentStep: figStepAt(k) }) || ''}</div>`;

        figWide(figBox, Math.round(h.clientHeight * 0.52));
      }

      if (k >= total) { next.disabled = true; next.style.opacity = '.4'; next.style.cursor = 'default'; }
    };

    if (figBox && typeof ResizeObserver !== 'undefined') new ResizeObserver(refitAll).observe(figBox);

    next.onclick = () => { if (k < total) { k++; while (k < lines.length && isAsk[k]) k++; paint(); } };
    h.querySelector('.q-all').onclick = () => { k = total; paint(); };
    h.querySelector('.q-back').onclick = back;
    paint();
    if (window.MJ) MJ(h);
    fit(h);
    return true;
  }

  function fit(h) {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => {
      const st = h.firstElementChild;
      if (!st || !h.clientHeight) return;
      st.style.zoom = '';
      const cs = window.getComputedStyle(h);
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const need = st.scrollHeight, have = h.clientHeight - pad;
      if (have > 0 && need > have) st.style.zoom = Math.max(0.55, (have / need) * 0.985).toFixed(3);
      if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    };
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([h]).then(go).catch(go);
    else setTimeout(go, 60);
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

    const art = inner.querySelector('svg');
    if (art && capH > 0) { art.style.maxHeight = (capH - 14) + 'px'; art.style.height = 'auto'; }
    box.dataset.fitW = Math.round(box.clientWidth);
  }

  function refitAll() {
    document.querySelectorAll('.q-fig').forEach(box => {
      const w = Math.round(box.clientWidth);
      if (!w || w === +box.dataset.fitW) return;
      const host = box.closest('.visual-host');
      figWide(box, host ? Math.round(host.clientHeight * 0.52) : 0);
    });
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', () => {
      setTimeout(refitAll, 120);
      setTimeout(refitAll, 600);
    }, true);
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
  return { page, detail };
})();
