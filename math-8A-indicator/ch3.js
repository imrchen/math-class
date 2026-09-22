window.DECK = window.DECK || [];
(function () {
  const C = '#059669';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}"${o.op !== undefined ? ` opacity="${o.op}"` : ''}>${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

  function xoRows(rows) {
    return `<div class="xo-wrap" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">` +
      rows.map(r => `<div class="xo-row" style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-cell" style="flex:1;background:#fdeef2;border:1.5px solid #f3c4d0;border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:4px">✗ ${r.tag || '常見錯誤'}</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.bad}</div></div>
        <div class="xo-cell" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:4px">✓ 正確</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.good}</div></div>
      </div>`).join('') + `</div>`;
  }

  const pDropCont = (t) => t.replace(/\s*續[一二三四五六七八九十]?\s*$/, '');
  const pLabel = (sec, tag) => {
    if (!/^印\s*\d+/.test(tag)) return pDropCont(tag);
    const S = (window.SOLUTIONS || {})[sec] || {};
    const d = S[tag] || S[tag.replace(/\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫].*$/, '')];
    return pDropCont(d && d.page ? tag.replace(/^印\s*\d+/, d.page.replace(/\s+/g, ' ')) : tag);
  };

  const pRelabel = (h, sec) => h.querySelectorAll('.p-row').forEach(r => {
    const el = r.querySelector('.p-tag');

    if (el) el.textContent = r.dataset.label || pLabel(sec, r.dataset.tag);
  });

  const pRow = (tag, bodyHtml, ans, fs, label) =>
    `<div class="p-row" data-tag="${tag}"${label ? ` data-label="${label}"` : ''} style="display:flex;gap:9px;align-items:baseline;padding:2px 0;border-radius:8px">
       <span class="p-tag" style="flex:0 0 72px;font-size:11px;font-weight:900;color:${GREY};white-space:nowrap">${tag}</span>
       <span style="flex:1;font-size:${fs};color:${INK};line-height:1.55">${bodyHtml}</span>
       ${ans ? `<span class="p-ans" style="flex:0 0 auto;font-size:12.5px;font-weight:900;color:${GRN};white-space:nowrap;overflow:hidden;max-width:0;opacity:0;transition:opacity .12s">${ans}</span>` : ''}
       <span class="p-go" style="flex:0 0 auto;width:12px;text-align:right;font-size:16px;font-weight:900;color:${C};opacity:0">›</span></div>`;
  const pItem = (tag, tex, ans, label) => pRow(tag, `\\(${tex}\\)`, ans, '13.5px', label);
  const pText = (tag, html, ans, label) => pRow(tag, html, ans, '13px', label);
  const pCard = (src, page, col, sub, rows) =>
    `<div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
       <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:4px 13px">
         <span style="font-size:13px;font-weight:900;color:#fff;letter-spacing:.03em">${src}</span>
         <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${page}</span>
       </div>
       <div style="padding:5px 13px 7px">
         ${sub ? `<div style="font-size:11.5px;color:#657187;margin-bottom:1px">${sub}</div>` : ''}
         ${rows}</div></div>`;
  const pWrap = (cards) =>
    `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:8px">${cards}
       <button class="p-sol" style="align-self:center;margin-top:2px;border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:4px 18px;cursor:pointer">顯示解答</button></div>`;

  const CONT = ['', ' 續', ' 續一', ' 續二', ' 續三', ' 續四', ' 續五'];
  const SUBRE = /\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫].*$/;

  const BOILER = /^承上[，,]?[^$]{0,24}。?$/;
  const pMerge = (S, tag) => {
    if (SUBRE.test(tag) && S[tag]) return S[tag];
    const base = S[tag] ? tag : tag.replace(SUBRE, '');
    const d0 = S[base];
    if (!d0) return null;
    const steps = [], ans = [], qs = [];
    for (const suf of CONT) {
      const d = S[base + suf];
      if (!d) continue;

      const q = String(d.q || '').trim();
      if (q && qs.indexOf(q) < 0 && !BOILER.test(q)) qs.push(q);
      for (const st of d.steps || []) steps.push(st);
      if (d.ans && ans.indexOf(d.ans) < 0) ans.push(d.ans);
    }
    return Object.assign({}, d0, { q: qs.join('\n'), steps, ans: ans.join('　') });
  };

  const pFig = (d) => (d && d.fig && (window.FIGURES || {})[d.fig]) || null;

  const pDetail = (h, sec, tag, back) => {
    const S = (window.SOLUTIONS || {})[sec] || {};

    const d = pMerge(S, tag);
    if (!d) return false;
    const tex = t => (t || '').replace(/\$([^$]+)\$/g, (_, m) => '\\(' + m + '\\)');

    const QNUM = /^\s*[\u2460-\u2473]/;
    const lines = [...d.steps.map(t => ({ t: tex(t), q: QNUM.test(String(t)) })),
                   ...(d.ans ? [{ t: '答：' + tex(d.ans), fin: 1 }] : [])];

    h.innerHTML =
      `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">
         <div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;overflow:hidden">
           <div style="display:flex;justify-content:space-between;align-items:center;background:${C};padding:5px 13px">
             <span style="font-size:13px;font-weight:900;color:#fff">${d.src} ${pLabel(sec, tag)}</span>
             <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${d.page}</span>
           </div>
           <div style="padding:10px 14px">
             <div style="font-size:19px;color:${INK};line-height:1.5">${String(d.q || '').split('\n').filter(Boolean).map((seg, i) => `<div style="${i ? 'margin-top:7px' : ''}">${tex(seg)}</div>`).join('')}
               ${d.fig && !pFig(d) ? `<div style="margin-top:6px;font-size:13px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:8px;padding:4px 10px;display:inline-block">⚠ ocho 沒有這張圖，請看紙本 ${d.page}</div>` : ''}</div>
             ${pFig(d) ? `<div class="q-fig" style="margin-top:8px;width:100%;height:220px;display:flex;align-items:center;justify-content:center">${pFig(d)}</div>` : ''}
           </div>
         </div>
         <div style="background:#fff;border:1.5px solid #dce3ee;border-radius:14px;padding:14px 18px 30px;display:flex;flex-direction:column;gap:26px;min-height:${Math.max(150, lines.length * 62)}px">
           ${lines.map((l, i) => `<div class="${l.q ? 'p-ask' : 'p-line'}" data-i="${i}" style="${l.q ? '' : 'visibility:hidden;'}font-size:${l.fin ? 22 : 20}px;font-weight:${l.fin ? 900 : l.q ? 800 : 700};color:${l.fin ? GRN : INK}${l.q ? '' : ';padding-left:20px'}">${l.t}</div>`).join('')}
         </div>
         <div style="display:flex;gap:8px;justify-content:center">
           <button class="p-next" style="border:1.5px solid ${C};background:${C};color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一行</button>
           <button class="p-all" style="border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
           <button class="p-back" style="border:1.5px solid #c3cddd;background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
         </div>
       </div>`;
    const els = [...h.querySelectorAll('.p-line')];
    let shown = 0;
    const next = h.querySelector('.p-next');
    const step = () => {
      if (shown < els.length) els[shown++].style.visibility = 'visible';
      if (shown >= els.length) { next.disabled = true; next.style.opacity = '.4'; next.style.cursor = 'default'; }
    };
    next.onclick = step;
    h.querySelector('.p-all').onclick = () => { while (shown < els.length) step(); };
    h.querySelector('.p-back').onclick = back;
    MJ(h);
    pAfter(h);
    return true;
  };

  const pFit = (h) => {
    if (typeof window === 'undefined') return;
    const stack = h.firstElementChild;
    if (!stack || !h.clientHeight) return;
    stack.style.zoom = '';

    const cs = window.getComputedStyle(h);
    const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

    if (h.closest && h.closest('#zoomBody')) {

      const W = h.clientWidth, Hh = h.clientHeight - pad;
      let bw = +h.dataset.zoomBase || 460, bz = 0;
      [bw, Math.round(W * 0.42), Math.round(W * 0.52), Math.round(W * 0.64), Math.round(W * 0.78)]
        .forEach(w => {
          if (w < 280 || w > W) return;
          stack.style.width = w + 'px';
          const z = Math.min(W / w, Hh / (stack.scrollHeight || 1), 2.8);
          if (z > bz) { bz = z; bw = w; }
        });
      stack.style.width = bw + 'px';
      stack.style.margin = '0 auto';

      if (bz < 0.995 || bz > 1.02) stack.style.zoom = Math.max(0.6, bz).toFixed(3);
      return;
    }
    stack.style.width = '';
    stack.style.margin = '';

    const need = stack.scrollHeight, have = h.clientHeight - pad;
    if (have > 0 && need > have) stack.style.zoom = Math.max(0.62, (have / need) * 0.985).toFixed(3);
  };

  if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__pFitZoomHook) {
    window.__pFitZoomHook = true;
    const sweep = () => document.querySelectorAll('.visual-host').forEach(el => {
      if (el.firstElementChild && el.querySelector('.p-line, .p-ask')) pFit(el);
    });
    document.addEventListener('click', () => { setTimeout(sweep, 150); setTimeout(sweep, 700); }, true);
  }

  const pAfter = (h) => {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => { pFit(h); if (window.dispatchEvent) window.dispatchEvent(new Event('resize')); };
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([h]).then(go).catch(go);
    } else { setTimeout(go, 60); }
  };

  const pMount = (h, cards, sec) => {
    const render = () => {
      h.innerHTML = pWrap(cards);
      const btn = h.querySelector('.p-sol');
      const ans = [...h.querySelectorAll('.p-ans')];
      if (btn) btn.onclick = () => {
        const on = !(ans[0] && ans[0].style.opacity === '1');
        ans.forEach(e => {
          e.style.maxWidth = on ? 'none' : '0';
          e.style.opacity = on ? '1' : '0';
        });
        btn.textContent = on ? '收起解答' : '顯示解答';
        pAfter(h);
      };

      if (!(sec && window.SOLUTIONS && window.SOLUTIONS[sec])) {
        h.querySelectorAll('.p-go').forEach(e => e.remove());
      }

      if (sec && window.SOLUTIONS && window.SOLUTIONS[sec]) {
        h.querySelectorAll('.p-row').forEach(row => {
          const tag = row.dataset.tag;
          const S = window.SOLUTIONS[sec];
          if (!(S[tag] || S[tag.replace(/\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫].*$/, '')])) {
            row.querySelector('.p-go').remove(); return;
          }
          row.style.cursor = 'pointer';
          row.querySelector('.p-go').style.opacity = '.55';
          row.onmouseenter = () => { row.style.background = '#f2f6ff'; };
          row.onmouseleave = () => { row.style.background = ''; };
          row.onclick = () => pDetail(h, sec, tag, render);
        });
      }
      pRelabel(h, sec);
      MJ(h);
      pAfter(h);
    };
    render();
  };

  const xterm = (a) => (a === 1 ? 'x' : a === -1 ? '−x' : `${a}x`).replace('-', '−');
  const xnum = (b) => (b >= 0 ? `＋${b}` : `−${-b}`);
  const xcross = (x, y, a1, b1, a2, b2, o = {}) => {
    const k = o.k === undefined ? 1 : o.k;
    const L = x + 34, R = x + 150, T = y + 28, B = y + 96;
    let s = '';
    s += TX(L, T, xterm(a1), { anchor: 'middle', fs: 19, c: INK, op: k });
    s += TX(R, T, xnum(b1), { anchor: 'middle', fs: 19, c: INK, op: k });
    s += TX(L, B, xterm(a2), { anchor: 'middle', fs: 19, c: INK, op: k });
    s += TX(R, B, xnum(b2), { anchor: 'middle', fs: 19, c: INK, op: k });
    s += SV.seg(L + 20, T + 6, R - 24, B - 16, AMB, 2.2);
    s += SV.seg(L + 20, B - 16, R - 24, T + 6, BLU, 2.2);
    if (o.sum !== false) {
      const p = a1 * b2, q = a2 * b1;
      const str = `${xterm(p)} ${q >= 0 ? '＋' : '−'} ${xterm(Math.abs(q))} ＝ ${xterm(p + q)}`;
      s += TX(x + 92, y + 128, str, { anchor: 'middle', fs: 16, c: o.ok === false ? RED : GRN, op: k });
    }
    return s;
  };

  window.DECK.push({
    ch: 3,
    title: '因式分解',
    color: C,
    sections: ['3-1 利用提公因式與乘法公式做因式分解', '3-2 利用十字交乘法做因式分解'],
    slides: [

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：把一個「<b>加減</b>」的式子，改寫成「<b>相乘</b>」。',
          '<b>長什麼樣</b>：相乘的每一塊叫<span class="k">因式</span>，原來那個式子是它們的<span class="k">倍式</span>。',
          '<b>做什麼</b>：先提公因式，再看看能不能套乘法公式。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 116–131</span>', tex: 'x^2+3x=x(x+3)' },
        visual: (h) => {
          const card = (y, n, q, a, col) =>
            BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
            `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
            TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
            TX(80, y + 28, q, { fs: 15.5, c: INK }) +
            TX(80, y + 52, a, { fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 250',
            card(6, '1', '什麼叫做因式分解？', '把加減的式子，改寫成相乘的式子', VIO) +
            card(88, '2', '因式、倍式是什麼？', '相乘的每一塊是因式，整個式子是倍式', BLU) +
            card(170, '3', '有哪些招？', '先提公因式，再看能不能套乘法公式', GRN));
        },
        caption: '整節只做一件事：把「＋、−」換成「×」。',
        example: {
          q: '\\(x^2+3x=x(x+3)\\)，哪些是因式？',
          steps: ['相乘的那兩塊是因式', '\\(x\\) 和 \\(x+3\\)'],
          ans: '\\(x\\) 與 \\(x+3\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '除完沒有餘數，就是因式',
        points: [
          '數字：\\(132\\div 12=11\\) 沒有餘數，所以 \\(12\\) 是 \\(132\\) 的因數。',
          '多項式一樣：除完<b>餘式是 \\(0\\)</b>，除的那一個就是<span class="k">因式</span>。',
          '餘式不是 \\(0\\)，就不是——不必看商是什麼。'
        ],
        formula: { label: '用除法判別<span class="pgref">課本 印 119、121 例 1</span>', tex: 'A\\div B\\text{ 的餘式}=0\\;\\Longleftrightarrow\\;B\\text{ 是 }A\\text{ 的因式}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 276', [
            {
              t: '先看純數字：132 除以 12', d: k =>
                BOX(30, 14, 180, 84, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 }) +
                TX(120, 40, '132 ÷ 12 ＝ 11', { anchor: 'middle', fs: 17, c: INK }) +
                TX(120, 66, '餘 0', { anchor: 'middle', fs: 16, c: GRN, op: k }) +
                TX(120, 88, '12 是 132 的因數', { anchor: 'middle', fs: 13, c: BLU, op: k })
            },
            {
              t: '多項式照同一句話判斷', d: k =>
                BOX(230, 14, 190, 84, { r: 12, fill: 'rgba(124,58,237,.08)', stroke: VIO, sw: 2 }) +
                TX(325, 40, '(2x²＋5x−3) ÷ (2x−1)', { anchor: 'middle', fs: 14.5, c: INK, op: k }) +
                TX(325, 66, '餘式 ＝ 0', { anchor: 'middle', fs: 16, c: GRN, op: k }) +
                TX(325, 88, '2x−1 是它的因式', { anchor: 'middle', fs: 13, c: VIO, op: k })
            },
            {
              t: '列直式：只看最後那一格', d: k => {

                let s = TX(220, 116, '長除法直式', { anchor: 'middle', fs: 13, c: GREY, op: k });
                s += TX(270, 142, '商：x ＋ 3', { anchor: 'middle', fs: 16, c: BLU, op: k });
                s += SV.seg(190, 152, 350, 152, INK, 2);
                s += SV.seg(190, 152, 190, 188, INK, 2);
                s += TX(182, 176, '2x − 1', { anchor: 'end', fs: 16, c: INK, op: k });
                s += TX(200, 176, '2x² ＋ 5x − 3', { fs: 16, c: INK, op: k });
                s += BOX(200, 190, 150, 32, { r: 9, fill: '#eef7f2', stroke: GRN, op: k });
                s += TX(275, 212, '餘式 0', { anchor: 'middle', fs: 16, c: GRN, op: k });
                return s;
              }
            },
            {
              t: '餘式不是 0，就不是因式', d: k =>
                BOX(60, 230, 320, 42, { r: 12, fill: '#fdeef2', stroke: RED, op: k }) +
                TX(220, 256, '(2x²＋5x−3) ÷ (x＋2) 餘式不是 0 → 不是倍式', { anchor: 'middle', fs: 15, c: RED, op: k })
            }
          ]);
        },
        caption: '國小的因數倍數換成多項式，判斷的那一句話一模一樣。',
        example: {
          q: '\\(2x-1\\) 是不是 \\(2x^2+5x-3\\) 的因式？',
          steps: ['列直式除除看', '餘式是 \\(0\\)'],
          ans: '是'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '看到乘法算式，因式直接用讀的',
        points: [
          '\\(A=B\\times Q\\)：\\(B\\) 和 \\(Q\\) 都是 \\(A\\) 的<b>因式</b>。',
          '反過來說，\\(A\\) 是 \\(B\\) 的<b>倍式</b>，也是 \\(Q\\) 的倍式。',
          '方向不要顛倒：大的是倍式，小的是因式。'
        ],
        formula: { label: '由乘法算式判別<span class="pgref">課本 印 120</span>', tex: '6x^2-11x-7=(3x-7)(2x+1)' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 268',
            TX(220, 40, '6x² − 11x − 7 ＝ (3x − 7)(2x + 1)', { anchor: 'middle', fs: 18, c: INK }) +
            `<path d="M300,54 Q300,92 150,100" fill="none" stroke="${BLU}" stroke-width="2.2" marker-end="url(#a1)"/>` +
            `<path d="M380,54 Q380,116 150,130" fill="none" stroke="${AMB}" stroke-width="2.2" marker-end="url(#a2)"/>` +
            SV.arrowDefs(BLU, 'a1') + SV.arrowDefs(AMB, 'a2') +
            BOX(24, 84, 260, 36, { r: 10, fill: 'rgba(37,99,235,.07)', stroke: BLU }) +
            TX(154, 108, '3x − 7 是 6x² − 11x − 7 的因式', { anchor: 'middle', fs: 14, c: BLU }) +
            BOX(24, 128, 260, 36, { r: 10, fill: 'rgba(217,119,6,.07)', stroke: AMB }) +
            TX(154, 152, '2x + 1 也是它的因式', { anchor: 'middle', fs: 14, c: AMB }) +
            BOX(60, 182, 320, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
            TX(220, 210, '6x² − 11x − 7 是那兩個的倍式', { anchor: 'middle', fs: 16, c: GRN }) +
            TX(220, 250, '✗ 反過來說「6x² − 11x − 7 是 3x − 7 的因式」就錯了', { anchor: 'middle', fs: 13.5, c: RED }));
        },
        caption: '同一個等式可以讀出四句話，差別只在誰是因式、誰是倍式。',
        example: {
          q: '\\(2x+1\\) 是 \\(6x^2-11x-7\\) 的倍式嗎？',
          steps: ['乘法算式裡 \\(2x+1\\) 是相乘的一塊', '所以它是因式，不是倍式'],
          ans: '不是（它是因式）'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜因式與倍式',
        points: [
          '除法判別：餘式是 \\(0\\) 才算。',
          '乘法算式判別：相乘的每一塊都是因式。',
          '「誰是誰的」不要說反：大的是倍式。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 119</span>', tex: 'A=B\\times Q\\;\\Rightarrow\\;B,\\;Q\\text{ 都是 }A\\text{ 的因式}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 119', BLU, '用除法判別',
              pText('印4 ①', '\\(2x-1\\) 是不是 \\(2x^2+5x-3\\) 的因式？', '是') +
              pText('印4 ②', '\\(2x^2+5x-3\\) 是不是 \\(x+2\\) 的倍式？', '不是')) +
            pCard('習作・基礎練習', '印 37', AMB, '判別因式與倍式',
              pText('基礎1 ①', '\\(x^2-6x+8\\) 是不是 \\(x-2\\) 的倍式？', '是') +
              pText('基礎1 ②', '\\(x-4\\) 是不是 \\(x^2-6x+8\\) 的因式？', '是') +
              pText('基礎2', '由 \\((x+3)(4x-3)=4x^2+9x-9\\) 判斷：四個敘述哪一個錯？', '\\(4x+3\\) 那一個')), '3-1');
        },
        caption: '習作基礎 1 兩小題問的是同一件事的兩個方向；基礎 2 換成由乘法算式判斷。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜由乘法算式判斷',
        points: [
          '先把乘法算式看清楚：相乘的是哪兩塊。',
          '那兩塊就是因式，整個式子是它們的倍式。',
          '選項裡如果出現沒在算式裡的式子，那就不是因式。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 120</span>', tex: '6x^2-11x-7=(3x-7)(2x+1)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 120', BLU, '已知 \\(A=6x^2-11x-7=(3x-7)(2x+1)\\)，打 ○ 或 ✕',
              pText('印5 ①', '\\(3x-7\\) 是 \\(A\\) 的因式。', '○') +
              pText('印5 ②', '\\(A\\) 是 \\(3x-7\\) 的因式。', '✕') +
              pText('印5 ③', '\\(2x+1\\) 是 \\(A\\) 的倍式。', '✕') +
              pText('印5 ④', '\\(A\\) 是 \\(2x+1\\) 的倍式。', '○')), '3-1');
        },
        caption: '四句話只有主詞順序不同——每一句都先問「誰在乘法算式裡」。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '因式分解就是把分配律倒過來用',
        points: [
          '展開是 \\(x(x+3)=x^2+3x\\)；<b>因式分解</b>是把它倒回去。',
          '長方形的面積：整塊看是 \\(x(x+3)\\)，切開看是 \\(x^2+3x\\)。',
          '⚠ \\(x^2+2x+3=x(x+2)+3\\) <b>不是</b>因式分解——最後還有一個 \\(+3\\)。'
        ],
        formula: { label: '因式分解的意義<span class="pgref">課本 印 122、123</span>', tex: 'x^2+3x=x(x+3)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>長方形的長 x ＋ <span class="ival nv">3</span></label>
              <input type="range" class="ns" min="1" max="6" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value;
            h.querySelector('.nv').textContent = n;
            const u = 30, X = 4 * u, N = n * u;
            const x0 = 220 - (X + N) / 2, y0 = 46;
            let s = '';
            s += `<rect x="${x0}" y="${y0}" width="${X}" height="${X}" fill="${BLU}" opacity=".16"/>`;
            s += TX(x0 + X / 2, y0 + X / 2 + 7, 'x²', { anchor: 'middle', fs: 20, c: BLU });
            s += `<rect x="${x0 + X}" y="${y0}" width="${N}" height="${X}" fill="${AMB}" opacity=".18"/>`;
            s += TX(x0 + X + N / 2, y0 + X / 2 + 7, `${n}x`, { anchor: 'middle', fs: 20, c: AMB });
            s += SV.seg(x0 + X, y0, x0 + X, y0 + X, '#9fb3d9', 1.8, '5 4');
            s += `<rect x="${x0}" y="${y0}" width="${X + N}" height="${X}" rx="0" fill="none" stroke="${C}" stroke-width="2.2"/>`;
            s += TX(x0 + X / 2, y0 - 10, 'x', { anchor: 'middle', fs: 15, c: BLU });
            s += TX(x0 + X + N / 2, y0 - 10, `${n}`, { anchor: 'middle', fs: 15, c: AMB });
            s += TX(x0 - 12, y0 + X / 2 + 5, 'x', { anchor: 'end', fs: 15, c: GREY });
            s += TX(220, y0 + X + 36, `整塊看：x × (x ＋ ${n})`, { anchor: 'middle', fs: 17, c: INK });
            s += TX(220, y0 + X + 64, `切開看：x² ＋ ${n}x`, { anchor: 'middle', fs: 17, c: GRN });
            s += BOX(50, y0 + X + 78, 340, 40, { r: 12, fill: '#fdeef2', stroke: RED });
            s += TX(220, y0 + X + 104, 'x² ＋ 2x ＋ 3 ＝ x(x＋2) ＋ 3　不是因式分解', { anchor: 'middle', fs: 14, c: RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 300', s);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '判準只有一句話：<b>最後整個式子是不是「一直在相乘」</b>，有 ＋ 就還沒分解完。',
        example: {
          q: '\\(x^2-4=0\\) 是因式分解嗎？',
          steps: ['因式分解不會出現等號右邊的 \\(0\\)', '那是一個方程式，不是分解'],
          ans: '不是'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜因式分解的意義與公因式',
        points: [
          '已知一個因式時，另一個因式可以用除的求出來。',
          '公因式：<b>每一項都有</b>的那一塊。',
          '選項裡只出現在一項裡的，不是公因式。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 121 例 1</span>', tex: '6x^2-7x-3=(2x-3)(3x+1)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 121', BLU, '已知一個因式，求另一個',
              pText('印6', '\\(10x^2+13x-30=(5x-6)(cx+d)\\)，求 \\(c+d\\)。', '\\(7\\)')) +
            pCard('習作・基礎練習', '印 38', AMB, '因式分解與公因式',
              pText('基礎3', '已知 \\(2x-3\\) 是 \\(6x^2-7x-3\\) 的因式，把它因式分解。', '\\((2x-3)(3x+1)\\)') +
              pText('基礎4', '\\(3x(2x-1)\\) 與 \\(4(2x-1)\\) 的公因式是哪一個？', '\\(2x-1\\)')), '3-1');
        },
        caption: '公因式要「每一項都有」——\\(2x\\) 只出現在第一項裡，就不算。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '提公因式：每一項都有的那一塊，提到前面',
        points: [
          '先<b>圈出每一項都有的部分</b>，數字和字母各圈一次。',
          '提出去之後，括號裡剩下什麼就寫什麼。',
          '⚠ 整項被提光時，括號裡要留 \\(1\\)，不是空的。'
        ],
        formula: { label: '提公因式<span class="pgref">課本 印 123 例 2</span>', tex: '5b^2+10b=5b(b+2)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 272', [
            {
              t: '兩項各自拆開，看有什麼相同', d: k =>
                TX(220, 40, '5b² ＋ 10b', { anchor: 'middle', fs: 22, c: INK }) +
                TX(140, 84, '5 × b × b', { anchor: 'middle', fs: 17, c: BLU, op: k }) +
                TX(300, 84, '5 × b × 2', { anchor: 'middle', fs: 17, c: AMB, op: k })
            },
            {
              t: '圈出兩邊都有的：5 和 b', d: k =>
                `<ellipse cx="104" cy="78" rx="${26 * k}" ry="${16 * k}" fill="none" stroke="${GRN}" stroke-width="2.4"/>` +
                `<ellipse cx="264" cy="78" rx="${26 * k}" ry="${16 * k}" fill="none" stroke="${GRN}" stroke-width="2.4"/>` +
                TX(220, 122, '公因式是 5b', { anchor: 'middle', fs: 16, c: GRN, op: k })
            },
            {
              t: '提到前面，括號裡寫剩下的', d: k =>
                TX(220, 168, '＝ 5b ( b ＋ 2 )', { anchor: 'middle', fs: 24, c: GRN, op: k })
            },
            {
              t: '注意：整項被提光要留 1', d: k =>
                BOX(50, 190, 340, 70, { r: 12, fill: '#fdeef2', stroke: RED, op: k }) +
                TX(220, 216, '5x − 10x² ＝ 5x( 1 − 2x )', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(220, 244, '前面那項提完剩下 1，不能不寫', { anchor: 'middle', fs: 14, c: RED, op: k })
            }
          ]);
        },
        caption: '提完再看一次：括號裡還有沒有共同的東西？',
        example: {
          q: '因式分解 \\(2y^2-7y\\)。',
          steps: ['兩項都有 \\(y\\)', '提出 \\(y\\)，括號裡剩 \\(2y-7\\)'],
          ans: '\\(y(2y-7)\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '一整個括號，也可以當公因式',
        points: [
          '\\((x+3)(x-4)+(x+3)(2x-1)\\)：兩項都有 \\((x+3)\\)。',
          '把<b>整個括號</b>當成一塊提出去，剩下的再合併。',
          '把 \\((x+3)\\) 想成一個代號，就跟提 \\(x\\) 一樣。'
        ],
        formula: { label: '整塊括號當公因式<span class="pgref">課本 印 124 例 3</span>', tex: '(x+3)(x-4)+(x+3)(2x-1)=(x+3)(3x-5)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 268', [
            {
              t: '兩項都看得到同一個括號', d: k =>
                TX(220, 40, '(x＋3)(x−4) ＋ (x＋3)(2x−1)', { anchor: 'middle', fs: 18, c: INK }) +
                `<rect x="${76}" y="24" width="${62 * k}" height="24" rx="6" fill="${GRN}" opacity=".16"/>` +
                `<rect x="${236}" y="24" width="${62 * k}" height="24" rx="6" fill="${GRN}" opacity=".16"/>`
            },
            {
              t: '把它當成一塊，先提出去', d: k =>
                TX(220, 96, '＝ (x＋3) [ (x−4) ＋ (2x−1) ]', { anchor: 'middle', fs: 18, c: BLU, op: k })
            },
            {
              t: '中括號裡合併同類項', d: k =>
                TX(220, 146, 'x − 4 ＋ 2x − 1 ＝ 3x − 5', { anchor: 'middle', fs: 17, c: GREY, op: k }) +
                TX(220, 186, '＝ (x＋3)(3x−5)', { anchor: 'middle', fs: 22, c: GRN, op: k })
            },
            {
              t: '同一招：整塊括號重複出現就提', d: k =>
                BOX(40, 208, 360, 52, { r: 12, fill: '#f6f9ff', stroke: '#d6e0f2', op: k }) +
                TX(220, 240, '(3x＋4)(2x−5) − (2x−5)² ＝ (2x−5)(x＋9)', { anchor: 'middle', fs: 16, c: BLU, op: k })
            }
          ]);
        },
        caption: '括號重複出現就是訊號：不要先展開，直接提。',
        example: {
          q: '因式分解 \\((2x+1)+x(1+2x)\\)。',
          steps: ['\\(1+2x\\) 就是 \\(2x+1\\)', '提出 \\((2x+1)\\)，剩下 \\(1+x\\)'],
          ans: '\\((2x+1)(x+1)\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '差一個負號的括號，補上負號就一樣',
        points: [
          '\\(3-x\\) 和 \\(x-3\\) 只差一個負號：\\(3-x=-(x-3)\\)。',
          '看到符號相反的括號，<b>先補寫 \\(-1\\times\\)</b>，不要心算。',
          '補完之後兩個括號一模一樣，就提得出來了。'
        ],
        formula: { label: '變號<span class="pgref">課本 印 124、125</span>', tex: '3-x=-(x-3)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>看第 <span class="ival sv">1</span> 步</label>
              <input type="range" class="ss" min="1" max="3" step="1" value="1">
            </div></div>`;
          const draw = () => {
            const st = +h.querySelector('.ss').value;
            h.querySelector('.sv').textContent = st;
            let s = TX(220, 38, 'x(x − 3) − 2(3 − x)', { anchor: 'middle', fs: 21, c: INK });
            if (st >= 1) {
              s += `<rect x="130" y="22" width="76" height="24" rx="6" fill="${BLU}" opacity=".16"/>`;
              s += `<rect x="256" y="22" width="76" height="24" rx="6" fill="${RED}" opacity=".14"/>`;
              s += TX(220, 74, '兩個括號的順序相反', { anchor: 'middle', fs: 15, c: RED });
            }
            if (st >= 2) {
              s += TX(220, 120, '3 − x ＝ −1 × (x − 3)', { anchor: 'middle', fs: 19, c: AMB });
              s += TX(220, 150, '先把 −1 寫出來，不要心算', { anchor: 'middle', fs: 14, c: GREY });
              s += TX(220, 190, '＝ x(x − 3) ＋ 2(x − 3)', { anchor: 'middle', fs: 19, c: BLU });
            }
            if (st >= 3) {
              s += BOX(96, 210, 248, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 });
              s += TX(220, 238, '＝ (x − 3)(x ＋ 2)', { anchor: 'middle', fs: 21, c: GRN });
            }
            h.querySelector('.fig').innerHTML = svg('0 0 440 264', s);
          };
          h.querySelector('.ss').oninput = draw;
          draw();
        },
        caption: '最常見的錯是「只變第一項」：\\(-2(3-x)\\) 變成 \\(2(x-3)\\)，兩項都要跟著變。',
        example: {
          q: '因式分解 \\((3x-1)(2x-5)-3x+1\\)。',
          steps: ['\\(-3x+1=-(3x-1)\\)', '提出 \\((3x-1)\\)，剩下 \\(2x-5-1\\)'],
          ans: '\\(2(3x-1)(x-3)\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜提公因式（單項式）',
        points: [
          '數字的公因數也要提：\\(5b^2+10b\\) 提的是 \\(5b\\)。',
          '提完括號裡剩什麼寫什麼，整項提光要留 \\(1\\)。',
          '提完再看一次：還有沒有共同的部分？'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 123 例 2</span>', tex: 'ma+mb=m(a+b)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 123', BLU, '因式分解',
              pItem('印8 ①', '2y^2-7y', '\\(y(2y-7)\\)') +
              pItem('印8 ②', '5b^2+10b', '\\(5b(b+2)\\)') +
              pItem('印8 ③', 'm(1-2m)+m(4m+3)', '\\(2m(m+2)\\)')) +
            pCard('習作・基礎練習', '印 38', AMB, '因式分解',
              pItem('基礎5 ①', 'x-3x^2', '\\(x(1-3x)\\)') +
              pItem('基礎5 ②', 'x(x-3)-3x^2', '\\(-x(2x+3)\\)')), '3-1');
        },
        caption: '習作 ② 提出的是 \\(-x\\)：先把負號一起提走，括號裡會比較好看。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜整塊括號與變號',
        points: [
          '括號重複出現就整塊提，不要先展開。',
          '括號順序相反時，先補寫 \\(-1\\times\\) 再提。',
          '提完把中括號裡的同類項合併。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 124 例 3</span>', tex: 'm(a+b)+m(c+d)=m(a+b+c+d)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 124', BLU, '因式分解',
              pItem('印9 ①', '(2x+1)+x(1+2x)', '\\((2x+1)(x+1)\\)') +
              pItem('印9 ②', '(x+3)(x-4)+(x+3)(2x-1)', '\\((x+3)(3x-5)\\)') +
              pItem('印9 例3續', '(2x-3)(4x-1)-(3x-1)(2x-3)', '\\(x(2x-3)\\)')) +
            pCard('習作・基礎練習', '印 38', AMB, '因式分解',
              pItem('基礎5 ③', 'x(x-3)-2(3-x)', '\\((x-3)(x+2)\\)') +
              pItem('基礎5 ④', '(3x+4)(2x-5)-(2x-5)^2', '\\((2x-5)(x+9)\\)')), '3-1');
        },
        caption: '習作 ③ 是變號題、④ 是整塊括號題——這兩種是這一節的重點。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜先分組，再提公因式（老師帶做）',
        points: [
          '四項的式子先兩項兩項分一組。',
          '每一組各自提完之後，會出現同一個括號。',
          '⚠ 這一型是<b>行有餘力</b>的，老師會帶著做。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 125 例 4</span>', tex: '(4x^2-7x)+(8x-14)=(4x-7)(x+2)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 125', BLU, '因式分解',
              pItem('印10 ①', '(6x-4)+(2-3x)^2', '\\(3x(3x-2)\\)') +
              pItem('印10 ②', '(4x^2+6x)+(10x+15)', '\\((2x+3)(2x+5)\\)')) +
            pCard('習作・基礎練習', '印 39', AMB, '因式分解',
              pItem('基礎5 續一', '(3x-1)(2x-5)-3x+1', '\\(2(3x-1)(x-3)\\)', '基礎5 ⑤') +
              pItem('基礎5 續二', '(4x^2-7x)+(8x-14)', '\\((4x-7)(x+2)\\)', '基礎5 ⑥')), '3-1');
        },
        caption: '⑥ 是分組型：\\(4x^2-7x\\) 提 \\(x\\)、\\(8x-14\\) 提 \\(2\\)，兩邊都出現 \\((4x-7)\\)。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '兩項相減，各自是平方，就用平方差',
        points: [
          '先確認<b>兩項</b>、中間是<b>減</b>、兩項各自都是<b>平方</b>。',
          '\\(4x^2=(2x)^2\\)，不是 \\((4x)^2\\)——平方的對象要抓對。',
          '\\(x^2+9\\) 是<b>加</b>的，不能用平方差分解。'
        ],
        formula: { label: '平方差公式<span class="pgref">課本 印 126、127 例 5</span>', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          const CASE = [[1, 1, 'x^2-1'], [1, 8, 'x^2-64'], [3, 2, '9x^2-4'], [2, 9, '4x^2-81'], [5, 3, '25x^2-9']];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>換一題 <span class="ival cv">1</span> / ${CASE.length}</label>
              <input type="range" class="cs" min="0" max="${CASE.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.cs').value;
            const [m, n] = CASE[i];
            h.querySelector('.cv').textContent = i + 1;
            const A = m === 1 ? 'x' : `${m}x`, A2 = m === 1 ? 'x²' : `${m * m}x²`;
            let s = '';
            s += TX(220, 38, `${A2} − ${n * n}`, { anchor: 'middle', fs: 24, c: INK });
            s += BOX(24, 60, 190, 74, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 });
            s += TX(119, 84, '前面那一項是誰的平方？', { anchor: 'middle', fs: 12.5, c: BLU });
            s += TX(119, 118, `${A2} ＝ (${A})²`, { anchor: 'middle', fs: 18, c: INK });
            s += BOX(226, 60, 190, 74, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 });
            s += TX(321, 84, '後面那一項是誰的平方？', { anchor: 'middle', fs: 12.5, c: AMB });
            s += TX(321, 118, `${n * n} ＝ ${n}²`, { anchor: 'middle', fs: 18, c: INK });
            s += TX(220, 176, `＝ (${A} ＋ ${n})(${A} − ${n})`, { anchor: 'middle', fs: 24, c: GRN });
            s += BOX(50, 198, 340, 44, { r: 12, fill: '#fdeef2', stroke: RED });
            s += TX(220, 226, 'x² ＋ 9 是加的，沒辦法用平方差', { anchor: 'middle', fs: 15, c: RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 250', s);
          };
          h.querySelector('.cs').oninput = draw;
          draw();
        },
        caption: '先回答兩個問題：前面是誰的平方、後面是誰的平方，答案就寫得出來。',
        example: {
          q: '因式分解 \\(5x^2-20\\)。',
          steps: ['每一項都有 \\(5\\)，先提出來：\\(5(x^2-4)\\)', '括號裡用平方差'],
          ans: '\\(5(x+2)(x-2)\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜平方差公式',
        points: [
          '先確認是「兩項相減、各自是平方」。',
          '有共同的數先提出來，再用公式。',
          '填空題只要回答「它是誰的平方」。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 126、127</span>', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 126、127', BLU, '填空與因式分解',
              pText('印11 ①', '\\(x^2-1^2=(x+\\square)(x-\\square)\\)', '\\(1\\)、\\(1\\)') +
              pText('印11 ②', '\\(x^2-8^2=(x+\\square)(x-\\square)\\)', '\\(8\\)、\\(8\\)') +
              pText('印11 ③', '\\((3x)^2-2^2=(\\square+2)(\\square-2)\\)', '\\(3x\\)、\\(3x\\)') +
              pItem('印12 ①', '4x^2-81', '\\((2x+9)(2x-9)\\)') +
              pItem('印12 ②', '5x^2-20', '\\(5(x+2)(x-2)\\)')), '3-1');
        },
        caption: '最後一題要先提 \\(5\\)——沒提出來就看不到平方差。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜平方差的整塊型（老師帶做）',
        points: [
          '把 \\((5x-2)\\) 整個當成 \\(a\\)，\\(1\\) 當成 \\(b\\)。',
          '分解完括號裡要再合併一次。',
          '⚠ 這一型<b>不列評量</b>，由老師帶做。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 128 例 6</span>', tex: '(5x-2)^2-1^2=(5x-1)(5x-3)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 128', BLU, '課本延伸，不列評量',
              pItem('印13 ①', '(5x-2)^2-1', '\\((5x-1)(5x-3)\\)') +
              pItem('印13 ②', '16-(2x-3)^2', '\\(-(2x+1)(2x-7)\\)')) +
            pCard('習作・基礎練習', '印 40', AMB, '因式分解',
              pItem('基礎7 ①', '48x^2-3', '\\(3(4x+1)(4x-1)\\)') +
              pItem('基礎7 ②', '(x-1)^2-25', '\\((x+4)(x-6)\\)')), '3-1');
        },
        caption: '習作 ② 是整份習作裡唯一一題「\\(a\\) 是一次式」的，老師會帶做並在訂正本註明。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '三項的時候：頭尾是平方，中間驗 2ab',
        points: [
          '<b>三項</b>才想和的平方或差的平方。',
          '先看頭尾兩項是不是平方，再算 \\(2\\times a\\times b\\) 對不對得上中間那一項。',
          '中間是 \\(+\\) 就用和的平方，是 \\(-\\) 就用差的平方。'
        ],
        formula: { label: '和的平方、差的平方<span class="pgref">課本 印 129、130 例 7</span>', tex: 'a^2\\pm 2ab+b^2=(a\\pm b)^2' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '先看頭尾：它們是誰的平方？', d: k =>
                TX(220, 38, '4x² ＋ 12x ＋ 9', { anchor: 'middle', fs: 24, c: INK }) +
                TX(120, 78, '4x² ＝ (2x)²', { anchor: 'middle', fs: 17, c: BLU, op: k }) +
                TX(320, 78, '9 ＝ 3²', { anchor: 'middle', fs: 17, c: AMB, op: k })
            },
            {
              t: '算 2ab，看中間那一項對不對', d: k =>
                TX(220, 122, '2 × 2x × 3 ＝ 12x', { anchor: 'middle', fs: 19, c: GRN, op: k }) +
                TX(220, 148, '和中間那一項一樣 ✓', { anchor: 'middle', fs: 14, c: GRN, op: k })
            },
            {
              t: '中間是 ＋，就用和的平方', d: k =>
                TX(220, 194, '＝ (2x ＋ 3)²', { anchor: 'middle', fs: 24, c: GRN, op: k })
            },
            {
              t: '中間是 −，就用差的平方', d: k =>
                BOX(40, 214, 360, 58, { r: 12, fill: '#f6f9ff', stroke: '#d6e0f2', op: k }) +
                TX(220, 240, '9x² − 60x ＋ 100 ＝ (3x − 10)²', { anchor: 'middle', fs: 18, c: BLU, op: k }) +
                TX(220, 264, '頭尾一樣是平方，只有中間換成減號', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            }
          ]);
        },
        caption: '三行格式照課本印 129 抄，不要跳步——中間那一行就是在驗 \\(2ab\\)。',
        example: {
          q: '因式分解 \\(x^2-6x+9\\)。',
          steps: ['頭尾：\\(x^2=(x)^2\\)、\\(9=3^2\\)', '\\(2\\times x\\times 3=6x\\)，中間是減號'],
          ans: '\\((x-3)^2\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜和的平方與差的平方',
        points: [
          '填空題就是在練「頭尾是誰的平方」。',
          '中間那一項要用 \\(2ab\\) 驗過才算數。',
          '中間 \\(+\\) 用和的平方、\\(-\\) 用差的平方。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 129、130</span>', tex: 'a^2\\pm 2ab+b^2=(a\\pm b)^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 129、130', BLU, '填空與因式分解',
              pText('印14 ①', '\\(x^2+2\\cdot x\\cdot 2+2^2=(x+\\square)^2\\)', '\\(2\\)') +
              pText('印14 ②', '\\((4x)^2+2\\cdot(4x)\\cdot 1+1^2=(\\square+1)^2\\)', '\\(4x\\)') +
              pText('印14 續', '差的平方兩格：\\(x^2-2\\cdot x\\cdot 5+5^2\\)、\\((7x)^2-2\\cdot(7x)\\cdot 1+1^2\\)', '\\(5\\)、\\(7x\\)') +
              pItem('印15 ①', 'x^2+4x+4', '\\((x+2)^2\\)') +
              pItem('印15 ②', 'x^2-10x+25', '\\((x-5)^2\\)')), '3-1');
        },
        caption: '填空題不要跳過：它練的正是「平方的對象」這一步。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '二次項係數不是 1 時，先看看能不能提',
        points: [
          '每一項都有共同的數，<b>先提出來</b>再用公式。',
          '\\(18x^2-24x+8=2(9x^2-12x+4)\\)，括號裡才看得到公式。',
          '順序固定：<b>先提 → 再看幾項 → 才挑公式</b>。'
        ],
        formula: { label: '先提再用公式<span class="pgref">課本 印 131 例 8</span>', tex: '18x^2-24x+8=2(3x-2)^2' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '步驟一　每一項都有 2，先提出來', tex: '18x^2-24x+8=2(9x^2-12x+4)', color: BLU, fill: '#f6f9ff', border: BLU, size: 18 },
            { label: '步驟二　括號裡是三項，看頭尾', tex: '9x^2=(3x)^2,\\qquad 4=2^2', color: VIO, border: '#d8ccf5', size: 18 },
            { label: '步驟三　驗中間那一項', tex: '2\\times 3x\\times 2=12x\\;\\checkmark', color: AMB, border: '#f0dba8', size: 18 },
            { label: '答案', tex: '=2(3x-2)^2', color: GRN, border: '#cfe8dd', size: 20, note: '前面提出來的 2 不要忘了寫回去' }
          ], { gap: 9 });
          MJ(h);
        },
        caption: '沒有先提出來的話，\\(18x^2\\) 不是任何東西的平方，整題就卡住了。',
        example: {
          q: '因式分解 \\(9x^2+12x+4\\)。',
          steps: ['沒有共同的數可提', '頭尾 \\((3x)^2\\)、\\(2^2\\)，中間 \\(2\\times3x\\times2=12x\\)'],
          ans: '\\((3x+2)^2\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜先提再用公式',
        points: [
          '第一件事永遠是：每一項有沒有共同的東西。',
          '提完再數剩幾項：兩項想平方差、三項想平方公式。',
          '前面提出來的數，最後要寫回答案裡。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 131 例 8</span>', tex: '18x^2-24x+8=2(3x-2)^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 131', BLU, '因式分解',
              pItem('印16 ①', '9x^2+12x+4', '\\((3x+2)^2\\)') +
              pItem('印16 ②', '18x^2-24x+8', '\\(2(3x-2)^2\\)')) +
            pCard('習作・基礎練習', '印 39', AMB, '填空與因式分解',
              pText('基礎6 ①', '\\(x^2-25=(x+\\square)(x-\\square)\\)', '\\(5\\)、\\(5\\)') +
              pText('基礎6 ②', '\\(4x^2+12x+9=(2x+\\square)^2\\)', '\\(3\\)') +
              pText('基礎6 續', '\\(9x^2-60x+100=(\\square x-10)^2\\)', '\\(3\\)', '基礎6 ③')), '3-1');
        },
        caption: '習作基礎 6 的三格就是三個公式各練一次。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '練習｜三個公式混在一起',
        points: [
          '先提公因式，再看剩下幾項。',
          '兩項 → 平方差；三項 → 和的平方或差的平方。',
          '不確定就乘回去驗算一次。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 126–131</span>', tex: 'a^2-b^2=(a+b)(a-b)\\qquad a^2\\pm 2ab+b^2=(a\\pm b)^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 40', AMB, '因式分解',
              pItem('基礎7 ③', 'x^2-6x+9', '\\((x-3)^2\\)') +
              pItem('基礎7 ④', '25x^2+40x+16', '\\((5x+4)^2\\)')) +
            pCard('習作・行有餘力', '印 40', GRN, '',
              pText('精熟1 ①', '因式分解 \\(6x-30-(x-5)^2\\)。', '\\((x-5)(11-x)\\)') +
              pText('精熟1 ②', '承上，求 \\(6\\times 111-30-(111-5)^2\\)。', '\\(-10600\\)') +
              pText('精熟2', '\\(9x^2-ax+4=(3x+b)^2\\)，\\(a\\) 為正整數，求 \\(a\\)、\\(b\\)。', '\\(a=12,\\;b=-2\\)')), '3-1');
        },
        caption: '精熟 1 ② 是把 \\(x=111\\) 代進分解後的結果——直接硬算會很久。'
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '選招表：照這個順序問三句話',
        points: [
          '① 每一項都有共同的東西嗎？<b>先提出來</b>。',
          '② 提完剩<b>幾項</b>？兩項看平方差、三項看平方公式。',
          '③ 都不像？那就是 3-2 要教的十字交乘。'
        ],
        formula: { label: '選招表<span class="pgref">課本 印 132 重點整理</span>', tex: '\\text{先提}\\;\\to\\;\\text{數項數}\\;\\to\\;\\text{挑公式}' },
        visual: (h) => {
          const row = (y, q, a, col) =>
            BOX(20, y, 400, 56, { r: 12, fill: '#fff', stroke: col, sw: 2 }) +
            TX(40, y + 24, q, { fs: 15, c: INK }) +
            TX(40, y + 45, a, { fs: 13.5, c: col });
          h.innerHTML = svg('0 0 440 254',
            row(6, '① 每一項都有共同的數或字母嗎？', '有 → 先提出來，提完再往下看', BLU) +
            row(72, '② 提完剩兩項，中間是減號嗎？', '是 → 平方差 a² − b² ＝ (a＋b)(a−b)', VIO) +
            row(138, '③ 提完剩三項，頭尾是平方嗎？', '是 → 驗 2ab，再用和／差的平方', AMB) +
            BOX(20, 204, 400, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
            TX(220, 232, '都不像 → 十字交乘，那是 3-2 的事', { anchor: 'middle', fs: 15, c: GRN }));
        },
        caption: '這張表只用來<b>判斷用哪一招</b>，不用算完——課堂上一題只花十秒。',
        example: {
          q: '\\(48x^2-3\\) 要用哪一招？',
          steps: ['每一項都有 \\(3\\)，先提：\\(3(16x^2-1)\\)', '剩兩項、中間是減'],
          ans: '平方差 → \\(3(4x+1)(4x-1)\\)'
        }
      },

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>提完漏 1、平方抓錯對象、變號只變一項</b>。',
          '第一個最常見，乘回去驗算一次就抓得到。',
          '每一題做完都乘回去，這是這一節最有效的檢查。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 132 重點整理</span>', tex: '5x-10x^2=5x(1-2x)' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '提完忘了留 1', bad: '\\(5x-10x^2=5x(-2x)\\)', good: '\\(5x-10x^2=5x(1-2x)\\)　<br>前面那項提光要留 \\(1\\)' },
            { tag: '平方抓錯對象', bad: '\\(4x^2=(4x)^2\\)', good: '\\(4x^2=(2x)^2\\)　<br>係數要開根號，次方才減半' },
            { tag: '變號只變第一項', bad: '\\(-2(3-x)=2(x-3)\\) 之後<br>忘了整項的符號', good: '先寫 \\(3-x=-1\\times(x-3)\\)，<br>兩項一起變' }
          ]);
          MJ(h);
        },
        caption: '第一個特別要防：它會讓答案「看起來已經分解完了」，只有乘回去才發現少了一項。',
        example: {
          q: '下課前一分鐘：\\(x^2-25\\) 怎麼分解？',
          steps: ['兩項、中間是減、各自是平方', '\\(x^2=(x)^2\\)、\\(25=5^2\\)'],
          ans: '\\((x+5)(x-5)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：三項的式子，用<span class="k">十字交乘</span>拆成兩個括號相乘。',
          '<b>長什麼樣</b>：左邊拆二次項、右邊拆常數項，斜著乘再相加。',
          '<b>做什麼</b>：先找兩個數，相乘等於常數、相加等於中間那一項。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 135–147</span>', tex: 'x^2+5x+6=(x+2)(x+3)' },
        visual: (h) => {
          const card = (y, n, q, a, col) =>
            BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
            `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
            TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
            TX(80, y + 28, q, { fs: 15.5, c: INK }) +
            TX(80, y + 52, a, { fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 250',
            card(6, '1', '在找什麼？', '兩個數：相乘等於常數、相加等於中間那一項', VIO) +
            card(88, '2', '十字圖怎麼看？', '左欄拆前面、右欄拆後面，斜著乘再相加', BLU) +
            card(170, '3', '什麼時候用它？', '三項、又套不上乘法公式的時候', GRN));
        },
        caption: '整節的核心只有一句話：<b>先拆積，再對和</b>。',
        example: {
          q: '哪兩個數相乘是 \\(6\\)、相加是 \\(5\\)？',
          steps: ['\\(6=1\\times 6=2\\times 3\\)', '\\(2+3=5\\)'],
          ans: '\\(2\\) 和 \\(3\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '先玩數字：相乘是這個，相加是那個',
        points: [
          '每次都<b>先把積拆開</b>，再一組一組去對和。',
          '從和下手會找到天荒地老，從積下手只有幾組。',
          '有時候<b>真的找不到</b>——那也是一種答案。'
        ],
        formula: { label: '猜數字<span class="pgref">課本 印 135、136</span>', tex: '\\text{相乘}=c,\\qquad \\text{相加}=b' },
        visual: (h) => {
          const Q = [[12, 7], [12, -7], [-20, -1], [21, -10], [-35, 2], [6, 4]];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>第 <span class="ival qv">1</span> 題 / ${Q.length}</label>
              <input type="range" class="qs" min="0" max="${Q.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const [c, b] = Q[+h.querySelector('.qs').value];
            h.querySelector('.qv').textContent = +h.querySelector('.qs').value + 1;

            const pairs = [];
            for (let i = 1; i * i <= Math.abs(c); i++) {
              if (c % i) continue;
              pairs.push([i, c / i]);
              pairs.push([-i, -(c / i)]);
            }
            const hit = pairs.find(p => p[0] + p[1] === b);
            let s = '';
            s += TX(220, 30, `相乘是 ${c < 0 ? '−' + (-c) : c}，相加是 ${b < 0 ? '−' + (-b) : b}`,
              { anchor: 'middle', fs: 18, c: INK });
            pairs.slice(0, 8).forEach((p, i) => {
              const x = 30 + (i % 2) * 200, y = 54 + Math.floor(i / 2) * 42;
              const ok = p[0] + p[1] === b;
              s += BOX(x, y, 180, 34, { r: 9, fill: ok ? 'rgba(5,150,105,.12)' : '#f7f9fc', stroke: ok ? GRN : '#dce3ee', sw: ok ? 2 : 1.4 });
              const f = (v) => (v < 0 ? '−' + (-v) : '' + v);
              s += TX(x + 90, y + 23, `${f(p[0])} × ${f(p[1])}　和 ＝ ${f(p[0] + p[1])}`,
                { anchor: 'middle', fs: 14.5, c: ok ? GRN : GREY });
            });
            const yb = 54 + Math.ceil(Math.min(pairs.length, 8) / 2) * 42 + 8;
            s += BOX(40, yb, 360, 44, { r: 12, fill: hit ? 'rgba(5,150,105,.08)' : '#fdeef2', stroke: hit ? GRN : RED, sw: 2 });
            s += TX(220, yb + 28, hit ? `找到了：${hit[0] < 0 ? '−' + (-hit[0]) : hit[0]} 和 ${hit[1] < 0 ? '−' + (-hit[1]) : hit[1]}` : '這一組找不到——那就是答案',
              { anchor: 'middle', fs: 17, c: hit ? GRN : RED });
            h.querySelector('.fig').innerHTML = svg(`0 0 440 ${yb + 56}`, s);
          };
          h.querySelector('.qs').oninput = draw;
          draw();
        },
        caption: '最後一題（相乘 6、相加 4）故意找不到——以後學配方法、公式解就是為了處理這種。',
        example: {
          q: '相乘是 \\(-20\\)、相加是 \\(-1\\) 的兩個數？',
          steps: ['\\(-20\\) 的拆法：\\(1\\times(-20)\\)、\\(2\\times(-10)\\)、\\(4\\times(-5)\\)…', '\\(4+(-5)=-1\\)'],
          ans: '\\(4\\) 和 \\(-5\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '中間那一項，本來就是斜著乘出來的',
        points: [
          '\\((x+2)(x+3)\\) 展開時，中間的 \\(5x\\) 是 \\(3x\\) 加 \\(2x\\)。',
          '那兩個 \\(x\\) 正是<b>斜著相乘</b>得到的。',
          '十字交乘不是新方法，是把展開的過程<b>倒過來看</b>。'
        ],
        formula: { label: '從乘法直式看過來<span class="pgref">課本 印 137</span>', tex: '(x+2)(x+3)=x^2+(3x+2x)+6' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 292', [
            {
              t: '先把 (x＋2)(x＋3) 展開', d: k =>
                TX(220, 38, '(x ＋ 2)(x ＋ 3)', { anchor: 'middle', fs: 22, c: INK }) +
                TX(220, 76, '＝ x² ＋ 3x ＋ 2x ＋ 6', { anchor: 'middle', fs: 19, c: BLU, op: k })
            },
            {
              t: '中間兩項合起來就是 5x', d: k =>
                TX(220, 112, '＝ x² ＋ 5x ＋ 6', { anchor: 'middle', fs: 20, c: GRN, op: k }) +
                TX(220, 138, '5x 是 3x 和 2x 加起來的', { anchor: 'middle', fs: 14, c: GREY, op: k })
            },
            {
              t: '把同一件事畫成十字', d: k =>
                xcross(140, 150, 1, 2, 1, 3, { k })
            }
          ]);
        },
        caption: '十字圖的兩條斜線，就是展開時「外項相乘、內項相乘」那兩步。',
        example: {
          q: '\\((x+1)(x+5)\\) 的中間項是多少？',
          steps: ['斜著乘：\\(5x\\) 和 \\(x\\)', '加起來是 \\(6x\\)'],
          ans: '\\(6x\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '十字交乘怎麼畫：左邊拆前面，右邊拆後面',
        points: [
          '二次項係數是 \\(1\\) 時，左欄兩格都寫 \\(x\\)。',
          '右欄填常數項的一組拆法，斜著乘再相加。',
          '加起來等於中間那一項，才算對；不對就換一組。'
        ],
        formula: { label: '十字交乘<span class="pgref">課本 印 138 例 1</span>', tex: 'x^2+6x+5=(x+1)(x+5)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 292', [
            {
              t: '先看常數項有哪些拆法', d: k =>
                TX(220, 32, 'x² ＋ 6x ＋ 5', { anchor: 'middle', fs: 24, c: INK }) +
                TX(220, 62, '5 只有一種拆法：1 × 5', { anchor: 'middle', fs: 15, c: GREY, op: k })
            },
            {
              t: '左欄都寫 x，右欄填 1 和 5', d: k =>
                xcross(140, 76, 1, 1, 1, 5, { k, sum: false })
            },
            {
              t: '斜著乘再相加，要等於中間那一項', d: k =>
                TX(220, 204, '5x ＋ x ＝ 6x　✓', { anchor: 'middle', fs: 18, c: GRN, op: k })
            },
            {
              t: '上下橫著讀，就是兩個括號', d: k =>
                BOX(76, 224, 288, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, op: k }) +
                TX(220, 253, '＝ (x ＋ 1)(x ＋ 5)', { anchor: 'middle', fs: 21, c: GRN, op: k })
            }
          ]);
        },
        caption: '上下兩排就是兩個括號：\\((x+1)\\) 和 \\((x+5)\\)。做完一定乘回去驗算。',
        example: {
          q: '因式分解 \\(x^2+6x+5\\)。',
          steps: ['\\(5=1\\times 5\\)', '斜著乘相加：\\(5x+x=6x\\) ✓'],
          ans: '\\((x+1)(x+5)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜常數是正的、中間也是正的',
        points: [
          '先把常數項拆成兩個數相乘。',
          '斜著乘相加，等於中間那一項才算對。',
          '算完一定乘回去驗算一次。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 138、140</span>', tex: 'x^2+bx+c=(x+p)(x+q),\\quad pq=c,\\;p+q=b' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 138、140', BLU, '十字交乘（常數正）',
              pItem('印4 ①', 'x^2+6x+5', '\\((x+1)(x+5)\\)') +
              pItem('印4 ②', 'x^2-6x+5', '\\((x-1)(x-5)\\)') +
              pItem('印6 ①', 'x^2+22x+21', '\\((x+1)(x+21)\\)') +
              pItem('印6 ②', 'x^2-10x+21', '\\((x-3)(x-7)\\)')), '3-2');
        },
        caption: '同一個常數項，中間是正是負決定兩個數<b>都正還是都負</b>。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '常數是正的：兩個數同號',
        points: [
          '常數項是<b>正</b>的 → 兩個數<b>同號</b>（同正或同負）。',
          '中間那一項是正 → 兩個都正；是負 → 兩個都負。',
          '這兩句話寫在黑板上，整節不要擦。'
        ],
        formula: { label: '符號判斷（一）<span class="pgref">課本 印 140 例 2</span>', tex: 'x^2-10x+21=(x-3)(x-7)' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 280',
            BOX(20, 10, 400, 52, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
            TX(220, 42, '常數項是正的 → 兩個數同號', { anchor: 'middle', fs: 18, c: GRN }) +
            BOX(20, 74, 196, 92, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 }) +
            TX(118, 98, '中間是 ＋ → 兩個都正', { anchor: 'middle', fs: 13.5, c: BLU }) +
            TX(118, 130, 'x² ＋ 22x ＋ 21', { anchor: 'middle', fs: 16, c: INK }) +
            TX(118, 154, '(x ＋ 1)(x ＋ 21)', { anchor: 'middle', fs: 16, c: BLU }) +
            BOX(224, 74, 196, 92, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 }) +
            TX(322, 98, '中間是 − → 兩個都負', { anchor: 'middle', fs: 13.5, c: AMB }) +
            TX(322, 130, 'x² − 10x ＋ 21', { anchor: 'middle', fs: 16, c: INK }) +
            TX(322, 154, '(x − 3)(x − 7)', { anchor: 'middle', fs: 16, c: AMB }) +
            TX(220, 196, '兩題的常數項都是 21，拆法也都是 3 × 7 或 1 × 21', { anchor: 'middle', fs: 14, c: GREY }) +
            BOX(60, 214, 320, 52, { r: 12, fill: '#f6f9ff', stroke: '#d6e0f2' }) +
            TX(220, 238, '先決定符號，再去試哪一組', { anchor: 'middle', fs: 16, c: INK }) +
            TX(220, 258, '符號先定下來，要試的組數就少一半', { anchor: 'middle', fs: 13, c: GREY }));
        },
        caption: '先判符號、再試數字——不要一組一組亂試，那會試到下課。',
        example: {
          q: '\\(x^2-12x+11\\) 的兩個數是同號還是異號？',
          steps: ['常數 \\(11\\) 是正的 → 同號', '中間是負 → 兩個都負'],
          ans: '兩個都負：\\(-1\\) 和 \\(-11\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '常數是負的：兩個數一正一負',
        points: [
          '常數項是<b>負</b>的 → 兩個數<b>異號</b>。',
          '中間那一項的符號，跟<b>絕對值比較大</b>的那一個一樣。',
          '所以先看中間是正是負，就知道大的那個該正還是該負。'
        ],
        formula: { label: '符號判斷（二）<span class="pgref">課本 印 141 例 3</span>', tex: 'x^2+2x-35=(x-5)(x+7)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 276', [
            {
              t: '常數是負的，所以一正一負', d: k =>
                TX(220, 34, 'x² ＋ 2x − 35', { anchor: 'middle', fs: 24, c: INK }) +
                TX(220, 66, '−35 ＝ 5 ×（−7）或（−5）× 7', { anchor: 'middle', fs: 15, c: GREY, op: k })
            },
            {
              t: '中間是 ＋，所以大的那個是正的', d: k =>
                BOX(60, 82, 320, 42, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, op: k }) +
                TX(220, 109, '7 比 5 大，7 要取正 → −5 和 ＋7', { anchor: 'middle', fs: 16, c: BLU, op: k })
            },
            {
              t: '填進十字圖，斜著乘驗一次', d: k =>
                xcross(140, 130, 1, -5, 1, 7, { k })
            },
            {
              t: '寫出答案', d: k =>
                TX(220, 268, '＝ (x − 5)(x ＋ 7)', { anchor: 'middle', fs: 21, c: GRN, op: k })
            }
          ]);
        },
        caption: '「異號、大的跟中間同號」這兩句，可以把要試的組數再砍一半。',
        example: {
          q: '因式分解 \\(x^2-34x-35\\)。',
          steps: ['常數負 → 異號；中間負 → 大的取負', '\\(-35=1\\times(-35)\\)'],
          ans: '\\((x+1)(x-35)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜常數是負的（異號）',
        points: [
          '常數負 → 兩個數一正一負。',
          '中間的符號跟絕對值大的那一個一樣。',
          '寫完乘回去驗算，中間那一項要對得上。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 141 例 3</span>', tex: 'x^2+2x-35=(x-5)(x+7)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 141', BLU, '十字交乘（常數負）',
              pItem('印7 ①', 'x^2+2x-35', '\\((x-5)(x+7)\\)') +
              pItem('印7 ②', 'x^2-34x-35', '\\((x+1)(x-35)\\)')) +
            pCard('習作・基礎練習', '印 41', AMB, '填入適當的整數',
              pText('基礎1 ①', '\\(x^2+\\square x+12=[x+\\square](x+3)\\)', '\\(7\\)、\\(4\\)') +
              pText('基礎1 ②', '\\(x^2-12x+11=[x+\\square][x+\\square]\\)', '\\(-1\\)、\\(-11\\)')), '3-2');
        },
        caption: '習作那兩題是填空：先決定符號，剩下的只要試一兩組。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜習作的十字交乘（係數 1）',
        points: [
          '四題都是二次項係數 \\(1\\)，左欄兩格都寫 \\(x\\)。',
          '先判符號（同號還是異號），再拆常數項。',
          '每一題做完都乘回去驗算。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 140、141</span>', tex: 'x^2+bx+c=(x+p)(x+q)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 42', AMB, '因式分解',
              pItem('基礎2 ①', 'x^2-x-20', '\\((x+4)(x-5)\\)') +
              pItem('基礎2 ②', 'x^2-8x-20', '\\((x+2)(x-10)\\)') +
              pItem('基礎2 ③', 'x^2-11x+24', '\\((x-3)(x-8)\\)') +
              pItem('基礎2 ④', 'x^2+12x-45', '\\((x-3)(x+15)\\)')), '3-2');
        },
        caption: '同一個常數項 \\(-20\\) 出現兩次，拆法不同就得到不同的中間項。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '二次項係數不是 1：兩邊都要拆',
        points: [
          '左欄不再都是 \\(x\\)：二次項係數也要拆成兩個數。',
          '⚠ 訣竅：<b>先固定一種左欄拆法</b>，把右欄試完再換左欄。',
          '兩邊亂換會試到眼花——固定一邊，要試的組數少一半。'
        ],
        formula: { label: '係數不是 1<span class="pgref">課本 印 143 例 4</span>', tex: '2x^2+7x-15=(x+5)(2x-3)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 300', [
            {
              t: '兩邊各自先拆開', d: k =>
                TX(220, 32, '2x² ＋ 7x − 15', { anchor: 'middle', fs: 23, c: INK }) +
                TX(120, 64, '2 ＝ 1 × 2', { anchor: 'middle', fs: 16, c: BLU, op: k }) +
                TX(320, 64, '−15 ＝ 5 ×（−3）…', { anchor: 'middle', fs: 16, c: AMB, op: k })
            },
            {
              t: '左欄固定成 1 和 2，先不要動它', d: k =>
                BOX(60, 80, 320, 38, { r: 10, fill: 'rgba(37,99,235,.07)', stroke: BLU, op: k }) +
                TX(220, 105, '左欄固定 x 和 2x，只換右欄', { anchor: 'middle', fs: 15, c: BLU, op: k })
            },
            {
              t: '右欄試一組，斜著乘相加', d: k =>
                xcross(140, 118, 1, 5, 2, -3, { k })
            },
            {
              t: '對得上就寫答案', d: k =>
                BOX(76, 250, 288, 42, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, op: k }) +
                TX(220, 278, '＝ (x ＋ 5)(2x − 3)', { anchor: 'middle', fs: 21, c: GRN, op: k })
            }
          ]);
        },
        caption: '上下兩排橫著讀，就是兩個括號：\\((x+5)\\) 與 \\((2x-3)\\)。',
        example: {
          q: '因式分解 \\(6x^2-11x-10\\)。',
          steps: ['\\(6=2\\times 3\\)，先固定這一種', '右欄試 \\(-5\\) 與 \\(2\\)：\\(4x-15x=-11x\\) ✓'],
          ans: '\\((2x-5)(3x+2)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜二次項係數不是 1',
        points: [
          '左欄先固定一種拆法，右欄試完再換。',
          '斜著乘相加要等於中間那一項。',
          '上下橫著讀，就是兩個括號。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 143 例 4</span>', tex: 'ax^2+bx+c=(px+q)(rx+s)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 143', BLU, '十字交乘（係數不為 1）',
              pItem('印9 ①', '2x^2+7x-15', '\\((x+5)(2x-3)\\)') +
              pItem('印9 ②', '6x^2-11x-10', '\\((2x-5)(3x+2)\\)')) +
            pCard('習作・基礎練習', '印 42', AMB, '因式分解',
              pItem('基礎3 ①', '3x^2+13x+10', '\\((x+1)(3x+10)\\)') +
              pItem('基礎3 ②', '3x^2-13x-10', '\\((x-5)(3x+2)\\)')), '3-2');
        },
        caption: '習作這兩題的二次項係數都是 \\(3\\)，左欄固定 \\(x\\) 和 \\(3x\\) 就好。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜習作的係數不為 1（後兩題）',
        points: [
          '左欄一樣固定 \\(x\\) 和 \\(3x\\)。',
          '右欄依常數項的正負先判同號或異號。',
          '每一題都乘回去驗算中間那一項。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 143 例 4</span>', tex: '3x^2+20x+32=(x+4)(3x+8)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 42', AMB, '因式分解',
              pItem('基礎3 ③', '3x^2+20x+32', '\\((x+4)(3x+8)\\)') +
              pItem('基礎3 ④', '3x^2+8x-35', '\\((x+5)(3x-7)\\)')), '3-2');
        },
        caption: '③ 的常數是正的 → 同號；④ 是負的 → 異號。判完符號再試。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '看到共同的數或負的首項，先提出來',
        points: [
          '每一項都有共同的數 → <b>先提公因數</b>，括號裡再十字交乘。',
          '二次項是<b>負</b>的 → <b>先提負號</b>，變成正的再拆。',
          '最後別忘了把提出來的那個數寫回答案裡。'
        ],
        formula: { label: '先提再拆<span class="pgref">課本 印 144 例 5</span>', tex: '10x^2-35x+30=5(x-2)(2x-3)' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '情形一　每一項都有 5', tex: '10x^2-35x+30=5(2x^2-7x+6)', color: BLU, fill: '#f6f9ff', border: BLU, size: 18 },
            { label: '括號裡才十字交乘', tex: '=5(x-2)(2x-3)', color: GRN, border: '#cfe8dd', size: 19 },
            { label: '情形二　二次項是負的，先提負號', tex: '-6x^2-15x-9=-3(2x^2+5x+3)', color: AMB, border: '#f0dba8', size: 18 },
            { label: '再拆', tex: '=-3(x+1)(2x+3)', color: GRN, border: '#cfe8dd', size: 19, note: '課本只處理二次項係數為正的，所以看到負首項一定先提負號' }
          ], { gap: 9 });
          MJ(h);
        },
        caption: '沒先提出來的話，左欄要拆的數會變大，組數多到試不完。',
        example: {
          q: '因式分解 \\(2x^2-6x-20\\)。',
          steps: ['每一項都有 \\(2\\)：\\(2(x^2-3x-10)\\)', '括號裡：\\(2\\) 和 \\(-5\\)'],
          ans: '\\(2(x+2)(x-5)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜先提公因數或負號',
        points: [
          '第一件事：每一項有沒有共同的數？',
          '第二件事：二次項是不是負的？是就先提負號。',
          '提出來的那個數，答案裡要寫回去。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 144 例 5</span>', tex: '-5x^2+50x-105=-5(x-3)(x-7)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 144', BLU, '先提再十字交乘',
              pItem('印10 ①', '10x^2-35x+30', '\\(5(x-2)(2x-3)\\)') +
              pItem('印10 ②', '-6x^2-15x-9', '\\(-3(x+1)(2x+3)\\)')) +
            pCard('習作・基礎練習', '印 43', AMB, '先提公因數再分解',
              pItem('基礎4 ①', '-x^2+13x-36', '\\(-(x-4)(x-9)\\)') +
              pItem('基礎4 ②', '2x^2-6x-20', '\\(2(x+2)(x-5)\\)') +
              pItem('基礎4 續', '-5x^2+50x-105', '\\(-5(x-3)(x-7)\\)', '基礎4 ③')), '3-2');
        },
        caption: '習作 ③ 兩件事一起做：先提 \\(-5\\)（負號和公因數一起），括號裡再拆。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '完全平方，兩種招都走得通',
        points: [
          '\\(4x^2+12x+9\\) 可以用差／和的平方公式，也可以用十字交乘。',
          '十字交乘時上下兩排會<b>長得一模一樣</b>，那就是完全平方。',
          '兩種都對，挑自己快的那一種。'
        ],
        formula: { label: '兩種解法<span class="pgref">課本 印 145 例 6</span>', tex: '4x^2+12x+9=(2x+3)^2' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 302',
            TX(220, 30, '4x² ＋ 12x ＋ 9', { anchor: 'middle', fs: 23, c: INK }) +
            BOX(16, 46, 200, 132, { r: 12, fill: 'rgba(37,99,235,.06)', stroke: BLU, sw: 2 }) +
            TX(116, 70, '解法一　乘法公式', { anchor: 'middle', fs: 14, c: BLU }) +
            TX(116, 100, '4x² ＝ (2x)²、9 ＝ 3²', { anchor: 'middle', fs: 14, c: INK }) +
            TX(116, 126, '2 × 2x × 3 ＝ 12x ✓', { anchor: 'middle', fs: 14, c: INK }) +
            TX(116, 152, '＝ (2x ＋ 3)²', { anchor: 'middle', fs: 17, c: BLU }) +
            BOX(224, 46, 200, 132, { r: 12, fill: 'rgba(217,119,6,.06)', stroke: AMB, sw: 2 }) +
            TX(324, 70, '解法二　十字交乘', { anchor: 'middle', fs: 14, c: AMB }) +
            xcross(250, 58, 2, 3, 2, 3, { sum: false }) +
            TX(324, 170, '6x ＋ 6x ＝ 12x ✓', { anchor: 'middle', fs: 14, c: AMB }) +
            BOX(60, 196, 320, 46, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
            TX(220, 226, '兩種都得到 (2x ＋ 3)²', { anchor: 'middle', fs: 19, c: GRN }) +
            TX(220, 266, '十字圖上下兩排一樣 → 它是完全平方', { anchor: 'middle', fs: 15, c: INK }) +
            TX(220, 292, '先提公因數的題目（50x² − 40x ＋ 8）也一樣，提完再挑招', { anchor: 'middle', fs: 13, c: GREY }));
        },
        caption: '看到三項先想公式，套不上再用十字交乘——兩種都會，速度差很多。',
        example: {
          q: '因式分解 \\(50x^2-40x+8\\)。',
          steps: ['先提 \\(2\\)：\\(2(25x^2-20x+4)\\)', '括號裡是完全平方'],
          ans: '\\(2(5x-2)^2\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜兩種解法各做一次',
        points: [
          '先提公因數或負號，再看括號裡。',
          '三項且頭尾是平方 → 先試乘法公式。',
          '套不上再用十字交乘，兩種答案應該一樣。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 145 例 6</span>', tex: '-9x^2+12x-4=-(3x-2)^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 145', BLU, '兩種解法各做一次',
              pItem('印11', '-9x^2+12x-4', '\\(-(3x-2)^2\\)')) +
            pCard('習作・基礎練習', '印 43', AMB, '十字交乘或乘法公式',
              pItem('基礎5 ①', '4x^2+12x+9', '\\((2x+3)^2\\)') +
              pItem('基礎5 ②', '50x^2-40x+8', '\\(2(5x-2)^2\\)')), '3-2');
        },
        caption: '課本那一題要先提負號，提完括號裡才是熟悉的樣子。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '選招表：一題只花十秒判斷用哪一招',
        points: [
          '① 每一項都有共同的東西嗎？<b>先提出來</b>。',
          '② 剩<b>兩項</b>相減 → 平方差；剩<b>三項</b>、頭尾是平方 → 平方公式。',
          '③ 三項但套不上公式 → 十字交乘。'
        ],
        formula: { label: '選招表<span class="pgref">課本 印 148 重點整理</span>', tex: '\\text{先提}\\;\\to\\;\\text{數項數}\\;\\to\\;\\text{公式或十字}' },
        visual: (h) => {
          const row = (y, q, a, col) =>
            BOX(20, y, 400, 54, { r: 12, fill: '#fff', stroke: col, sw: 2 }) +
            TX(40, y + 23, q, { fs: 15, c: INK }) +
            TX(40, y + 43, a, { fs: 13.5, c: col });
          h.innerHTML = svg('0 0 440 264',
            row(6, '① 有共同的數或字母嗎？', '有 → 先提；二次項是負的也先提負號', BLU) +
            row(70, '② 剩兩項、中間是減？', '是 → 平方差，別用十字交乘繞遠路', VIO) +
            row(134, '③ 剩三項、頭尾是平方？', '是 → 先驗 2ab，用和／差的平方', AMB) +
            BOX(20, 198, 400, 56, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
            TX(220, 224, '④ 三項但套不上公式 → 十字交乘', { anchor: 'middle', fs: 16, c: GRN }) +
            TX(220, 245, '學會十字交乘之後，也不要什麼題目都用它', { anchor: 'middle', fs: 13, c: GREY }));
        },
        caption: '\\(x^2-36\\) 用平方差三秒鐘，用十字交乘要試好幾組——招要挑對。',
        example: {
          q: '\\(3x^2+4x+1\\) 要用哪一招？',
          steps: ['沒有共同的東西可提', '三項，但 \\(3x^2\\) 不是好開的平方'],
          ans: '十字交乘 → \\((3x+1)(x+1)\\)'
        }
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜拼圖應用與行有餘力',
        points: [
          '拼成長方形 → 先把<b>面積</b>寫成一個多項式，再因式分解。',
          '分解出來的兩個括號，就是長方形的長和寬。',
          '⚠ 這幾題是行有餘力的，做不完不影響過關。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 147 例 7</span>', tex: '21x^2+83x+22=(3x+11)(7x+2)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 147', BLU, '巧拼拼成大長方形（點開看題目）',
              pText('印13', '\\(21\\) 塊大正方形、\\(83\\) 塊長方形、\\(22\\) 塊小正方形，求兩邊長。', '\\(3x+11\\)、\\(7x+2\\)')) +
            pCard('習作・行有餘力', '印 44', GRN, '',
              pText('精熟1', 'A 型 \\(4\\)、B 型 \\(m\\)、C 型 \\(49\\) 塊拼成正方形，求 \\(m\\)。', '\\(m=28\\)')), '3-2');
        },
        caption: '這一型的第一步永遠是「把面積加起來」，加完才看得到要分解的式子。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '練習｜拼長方形（行有餘力）',
        points: [
          '先把每一塊的面積寫出來，再全部加起來。',
          '加完之後因式分解，兩個括號就是長和寬。',
          '⚠ 三小題是連在一起的，做不完不影響過關。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 147 例 7</span>', tex: '3x^2+4x+1=(3x+1)(x+1)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 44', GRN, '甲＝邊 \\(x\\) 正方形、乙＝\\((x+1)\\times x\\)、丙＝\\(x\\times1\\)、丁＝\\((x+1)\\times1\\)',
              pText('精熟2 ①', '\\(2\\) 甲 ＋ \\(1\\) 乙 拼成長方形。', '\\(3x+1\\)、\\(x\\)') +
              pText('精熟2 ②', '\\(2\\) 丙 ＋ \\(1\\) 丁 拼成長方形。', '\\(3x+1\\)、\\(1\\)') +
              pText('精熟2 ③', '六塊一起拼成長方形。', '\\(3x+1\\)、\\(x+1\\)')), '3-2');
        },
        caption: '第三小題把前兩題的面積加起來：\\((3x^2+x)+(3x+1)=3x^2+4x+1\\)。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>從和下手、不判符號、只拆常數項</b>。',
          '第一個最花時間，第二個最容易一路錯到底。',
          '每一題做完都乘回去驗算——不驗算就不算做完。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 148 重點整理</span>', tex: '\\text{先拆積，再對和}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '從「和」下手找', bad: '相加是 \\(7\\)？<br>\\(1+6\\)、\\(2+5\\)、\\(3+4\\)…找不完', good: '先拆<b>積</b>：\\(12=1\\times12=2\\times6=3\\times4\\)，<br>只有三組要試' },
            { tag: '不先判符號', bad: '\\(x^2-x-20\\) 一組一組亂試', good: '常數負 → 異號；中間負 → 大的取負，<br>剩下的組數少一半' },
            { tag: '只拆常數項', bad: '\\(3x^2+13x+10\\)<br>左欄還是寫兩個 \\(x\\)', good: '二次項係數也要拆：<br>\\(3=1\\times3\\)，左欄寫 \\(x\\) 和 \\(3x\\)' }
          ]);
          MJ(h);
        },
        caption: '第三個只在係數不是 \\(1\\) 時出現，但一出現就整題錯——動筆前先看二次項係數。',
        example: {
          q: '下課前一分鐘：\\(x^2-11x+24\\) 的兩個數？',
          steps: ['常數正 → 同號；中間負 → 都負', '\\(24=3\\times 8\\)，\\(-3-8=-11\\)'],
          ans: '\\(-3\\) 和 \\(-8\\)'
        }
      }
    ]
  });
})();
