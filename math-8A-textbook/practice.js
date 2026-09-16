window.PRACTICE = (function () {
  const INK = '#172033', GREY = '#8a94a6', GRN = '#059669', C = '#2563eb';
  const SRCCOL = {
    '課本・隨堂練習': '#2563eb',
    '習作・基礎練習': '#d97706',
    '課本・自我評量': '#7c3aed',
  };

  const CONT = ['', ' 續', ' 續一', ' 續二', ' 續三', ' 續四', ' 續五'];

  const S = (sec) => (window.SOLUTIONS || {})[sec] || {};
  const figSvg = (d) => (d && d.fig && (window.FIGURES || {})[d.fig]) || null;
  const tex = (t) => String(t || '').replace(/\$([^$]+)\$/g, (_, m) => '\\(' + m + '\\)');

  const BOILER = /^承上[，,]?[^$]{0,24}。?$/;

  function merged(sec, tag) {
    const d0 = S(sec)[tag];
    if (!d0) return null;
    const steps = [], ansParts = [], qParts = [];
    for (const suf of CONT) {
      const d = S(sec)[tag + suf];
      if (!d) continue;

      const q = String(d.q || '').trim();
      if (q && !qParts.includes(q) && !BOILER.test(q)) qParts.push(q);
      for (const st of d.steps || []) steps.push(st);
      if (d.ans && !ansParts.includes(d.ans)) ansParts.push(d.ans);
    }
    return { src: d0.src, page: d0.page, q: qParts.join('\n'), steps,
             ans: ansParts.join('　'), fig: d0.fig || null };
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
    return `<div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:7px 15px">
        <span style="font-size:16px;font-weight:900;color:#fff;letter-spacing:.03em">${src}</span>
        <span style="font-size:15px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 10px">${page}</span>
      </div>
      <div style="padding:8px 15px 10px">${sub ? `<div style="font-size:13.5px;color:#657187;margin-bottom:4px">${sub}</div>` : ''}${rows}</div></div>`;
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
      <div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
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
      <div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:13px 18px 22px;display:flex;flex-direction:column;gap:${gap}px;min-height:${Math.max(130, lines.length * 52)}px">
        ${lines.map((l, i) => `<div class="${l.q ? 'q-ask' : 'q-line'}" data-i="${i}" style="${l.q ? '' : 'visibility:hidden;'}font-size:${l.fin ? fs + 2 : fs}px;
          font-weight:${l.fin ? 900 : l.q ? 800 : 700};color:${l.fin ? GRN : INK};line-height:1.45${l.q ? '' : ';padding-left:18px'}">${l.t}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center">
        <button class="q-next" style="border:1.5px solid ${C};background:${C};color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一行</button>
        <button class="q-all" style="border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
        <button class="q-back" style="border:1.5px solid #c3cddd;background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
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

  function fit(h) {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => {
      const st = h.firstElementChild;
      if (!st || !h.clientHeight) return;
      st.style.zoom = '';
      const cs = window.getComputedStyle(h);
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const need = st.scrollHeight, have = h.clientHeight - pad;
      if (have > 0 && need > have) st.style.zoom = Math.max(0.6, (have / need) * 0.985).toFixed(3);
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

    const splitChoice = (a) => {
      const m = /^選\s*(\([A-Da-d]\))\s*(.*)$/.exec(String(a || '').trim());
      return m ? { big: m[1], sub: m[2] } : { big: String(a || ''), sub: '' };
    };
    const cell = (no, tag) => {
      const d = merged(sec, tag);
      const a = d ? d.ans : '';
      const { big, sub } = splitChoice(a);
      const miss = !a;
      return `<div style="border:1.5px solid #dbe3f0;border-radius:10px;background:#fff;
          padding:7px 9px;display:flex;align-items:baseline;gap:8px;min-width:0">
        <span style="flex:0 0 auto;font-size:15px;font-weight:700;color:${GREY}">${no}</span>
        <span style="min-width:0;flex:1">
          <span style="font-size:21px;font-weight:700;color:${miss ? '#e11d48' : GRN};
            display:block;line-height:1.3;word-break:break-word">${miss ? '（查無答案）' : tex(big)}</span>
          ${sub ? `<span style="font-size:13.5px;color:${GREY};display:block;line-height:1.4">${tex(sub)}</span>` : ''}
        </span>
      </div>`;
    };
    const block = (g) => `<div>
      <div style="font-size:14px;font-weight:700;color:${C};margin:0 0 6px 2px">${g.label}</div>
      <div style="display:grid;grid-template-columns:repeat(${g.cols || 4},minmax(0,1fr));gap:7px">
        ${g.items.map(it => cell(it[0], it[1])).join('')}
      </div>
    </div>`;
    h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:12px">`
      + groups.map(block).join('') + `</div>`;
    if (window.MJ) MJ(h);
    fit(h);
  }

  return { page, detail, merged, answerKey };
})();
