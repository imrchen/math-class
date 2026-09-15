window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}"${o.op !== undefined ? ` opacity="${o.op}"` : ''}>${s}</text>`;

  const SQFRAME = (x, y, w, h, col, sw) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0" fill="none" stroke="${col}" stroke-width="${sw || 2.2}"/>`;

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
    if (el) el.textContent = pLabel(sec, r.dataset.tag);
  });

  const pRow = (tag, bodyHtml, ans, fs) =>
    `<div class="p-row" data-tag="${tag}" style="display:flex;gap:9px;align-items:baseline;padding:2px 0;border-radius:8px">
       <span class="p-tag" style="flex:0 0 72px;font-size:11px;font-weight:900;color:${GREY};white-space:nowrap">${tag}</span>
       <span style="flex:1;font-size:${fs};color:${INK};line-height:1.55">${bodyHtml}</span>
       ${ans ? `<span class="p-ans" style="flex:0 0 auto;font-size:12.5px;font-weight:900;color:${GRN};white-space:nowrap;overflow:hidden;max-width:0;opacity:0;transition:opacity .12s">${ans}</span>` : ''}
       <span class="p-go" style="flex:0 0 auto;width:12px;text-align:right;font-size:16px;font-weight:900;color:${C};opacity:0">›</span></div>`;
  const pItem = (tag, tex, ans) => pRow(tag, `\\(${tex}\\)`, ans, '13.5px');
  const pText = (tag, html, ans) => pRow(tag, html, ans, '13px');
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

  window.DECK.push({
    ch: 1,
    title: '乘法公式與多項式',
    color: C,
    sections: ['1-1 乘法公式', '1-2 多項式與其加減運算', '1-3 多項式的乘除運算'],
    slides: [

      {
        sec: '1-1', secName: '乘法公式',
        title: '長方形切一刀，面積就分成兩項',
        points: [
          '長 \\(6\\)、寬 \\(c+d\\) 的長方形，面積是 <b>6(c+d)</b>。',
          '寬切成 \\(c\\)、\\(d\\) 兩段，就變<b>兩塊</b>：\\(6c\\) 和 \\(6d\\)。',
          '<b>切幾刀就有幾塊，有幾塊就有幾項。</b>'
        ],
        formula: { label: '溫故啟思<span class="pgref">課本 印 6</span>', tex: '6(c+d)=6c+6d' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>寬　c <span class="ival cv">4</span>　＋　d <span class="ival dv">3</span></label>
              <input type="range" class="cs" min="2" max="6" step="1" value="4">
              <input type="range" class="ds" min="2" max="6" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const c = +h.querySelector('.cs').value, d = +h.querySelector('.ds').value;
            h.querySelector('.cv').textContent = c;
            h.querySelector('.dv').textContent = d;

            const u = 22, H = 6 * u, W = (c + d) * u;
            const x0 = 78, y0 = 54, xm = x0 + c * u;
            let s = '';

            s += `<rect x="${x0}" y="${y0}" width="${c * u}" height="${H}" fill="${BLU}" opacity=".16"/>`;
            s += `<rect x="${xm}" y="${y0}" width="${d * u}" height="${H}" fill="${AMB}" opacity=".18"/>`;
            s += TX(x0 + c * u / 2, y0 + H / 2 + 7, '6c', { anchor: 'middle', fs: 20, c: BLU });
            s += TX(xm + d * u / 2, y0 + H / 2 + 7, '6d', { anchor: 'middle', fs: 20, c: AMB });
            s += SV.seg(xm, y0, xm, y0 + H, '#9fb3d9', 1.8, '5 4');
            s += SQFRAME(x0, y0, W, H, C);

            s += TX(x0 + c * u / 2, y0 - 12, 'c', { anchor: 'middle', fs: 16, c: BLU });
            s += TX(xm + d * u / 2, y0 - 12, 'd', { anchor: 'middle', fs: 16, c: AMB });
            s += TX(x0 - 12, y0 + H / 2 + 5, '6', { anchor: 'end', fs: 16, c: GREY });

            s += TX(220, y0 + H + 34, '整塊看：6 × (' + c + '＋' + d + ') ＝ ' + 6 * (c + d),
              { anchor: 'middle', fs: 16, c: INK });
            s += TX(220, y0 + H + 60, '切開看：' + 6 * c + ' ＋ ' + 6 * d + ' ＝ ' + 6 * (c + d),
              { anchor: 'middle', fs: 16, c: GRN });
            h.querySelector('.fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('.cs').oninput = draw;
          h.querySelector('.ds').oninput = draw;
          draw();
        },
        caption: '拖滑桿改 c、d，<b>兩塊加起來永遠等於整塊</b>。',
        example: {
          q: '長 \\(a\\)、寬 \\(c+d\\) 的長方形，面積怎麼寫？',
          steps: ['整塊看：\\(a(c+d)\\)。', '切開看：\\(ac\\) 和 \\(ad\\)。'],
          ans: '\\(a(c+d)=ac+ad\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '兩位數乘法拆開，就是四項展開',
        points: [
          '上一頁切一刀兩塊，這一頁<b>兩刀四塊</b>。',
          '<span class="k">32×45</span> 拆成 <b>(30+2)×(40+5)</b>。',
          '這是用你<b>早就會的乘法</b>，走出四項展開的形狀。'
        ],
        formula: { label: '官方示範（110 年版 p132）<span class="pgref">課本 印 8 例 1 同型</span>', tex: '32\\times45=30\\times40+2\\times40+30\\times5+2\\times5' },
        visual: (h) => {

          const u = 4.6;
          const x0 = 52, y0 = 36;
          const xB = x0 + 32 * u, yB = y0 + 45 * u;
          const xM = x0 + 30 * u, yM = y0 + 40 * u;
          const frame = `${SV.seg(xM, y0, xM, yB, '#9fb3d9', 1.6, '5 4')}${SV.seg(x0, yM, xB, yM, '#9fb3d9', 1.6, '5 4')}
            ${SQFRAME(x0, y0, xB - x0, yB - y0, C)}
            ${TX((x0 + xM) / 2, y0 - 10, '30', { anchor: 'middle', fs: 15, c: GREY })}
            ${TX((xM + xB) / 2, y0 - 10, '2', { anchor: 'middle', fs: 15, c: GREY })}
            ${TX(x0 - 10, (y0 + yM) / 2 + 5, '40', { anchor: 'end', fs: 15, c: GREY })}
            ${TX(x0 - 10, (yM + yB) / 2 + 5, '5', { anchor: 'end', fs: 15, c: GREY })}`;

          const cell = (x, y, w, ht, col, k) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${ht}" fill="${col}" opacity="${0.16 + 0.3 * k}"/>`;

          const row = (i, col, txt, k) =>
            `<rect x="228" y="${64 + i * 38}" width="13" height="13" rx="3" fill="${col}" opacity="${k}"/>` +
            TX(250, 76 + i * 38, txt, { fs: 17, c: col, op: k });
          SV.stepper(h, '0 0 440 286', [
            { t: '左上大塊：30 × 40 ＝ 1200', d: k => frame + cell(x0, y0, xM - x0, yM - y0, BLU, k) + row(0, BLU, '30 × 40 ＝ 1200', k) },
            { t: '右上那條：2 × 40 ＝ 80', d: k => cell(xM, y0, xB - xM, yM - y0, GRN, k) + row(1, GRN, '2 × 40 ＝ 80', k) },
            { t: '左下那條：30 × 5 ＝ 150', d: k => cell(x0, yM, xM - x0, yB - yM, AMB, k) + row(2, AMB, '30 × 5 ＝ 150', k) },
            {
              t: '右下小塊：2 × 5 ＝ 10，四塊加起來就是答案',
              d: k => cell(xM, yM, xB - xM, yB - yM, VIO, k) + row(3, VIO, '2 × 5 ＝ 10', k) +
                TX(220, 272, '1200 ＋ 80 ＋ 150 ＋ 10 ＝ 1440', { anchor: 'middle', fs: 16, c: INK, op: k })
            }
          ]);
        },
        caption: '照實際比例畫：<b>個位數那兩塊真的很小</b>，但少了就不是 1440。',
        example: {
          q: '用拆開的方法算 \\(32\\times45\\)。',
          steps: ['\\(30\\times40=1200\\)、\\(2\\times40=80\\)', '\\(30\\times5=150\\)、\\(2\\times5=10\\)'],
          ans: '\\(1200+80+150+10=1440\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '算不出答案，也知道兩邊一定一樣',
        points: [
          '長 \\(a\\)、寬 \\(c+d\\) 的長方形，面積是 <b>a(c+d)</b>。',
          '寬切一刀變兩塊：\\(ac\\) 和 \\(ad\\)。',
          '<b>算不出數字也敢寫下等號</b>，就跨過這一關了。'
        ],
        formula: { label: '分配律<span class="pgref">課本 印 7</span>', tex: 'a(c+d)=ac+ad' },
        visual: (h) => {
          const x0 = 112, y0 = 56, W = 216, H = 118;
          const xB = x0 + W, yB = y0 + H, xm = x0 + Math.round(W * 0.56);

          const base = SV.seg(xm, y0, xm, yB, '#9fb3d9', 1.8, '5 4') + SQFRAME(x0, y0, W, H, C) +
            TX(x0 - 12, y0 + H / 2 + 5, 'a', { anchor: 'end', fs: 17, c: GREY }) +
            TX((x0 + xm) / 2, y0 - 10, 'c', { anchor: 'middle', fs: 16, c: BLU }) +
            TX((xm + xB) / 2, y0 - 10, 'd', { anchor: 'middle', fs: 16, c: AMB });
          const fill = (xa, w, col, label, k) =>
            `<rect x="${xa}" y="${y0}" width="${w}" height="${H}" fill="${col}" opacity="${0.16 + 0.3 * k}"/>` +
            TX(xa + w / 2, y0 + H / 2 + 7, label, { anchor: 'middle', fs: 21, c: col, op: k });
          SV.stepper(h, '0 0 440 224', [
            { t: '整塊看：長 a、寬 (c＋d)，面積是 a(c＋d)', d: k => base + TX(220, 30, '面積 ＝ a ( c ＋ d )', { anchor: 'middle', fs: 18, c: INK, op: k }) },
            { t: '左邊那塊：a × c ＝ ac', d: k => fill(x0, xm - x0, BLU, 'ac', k) },
            { t: '右邊那塊：a × d ＝ ad', d: k => fill(xm, xB - xm, AMB, 'ad', k) },
            {
              t: '兩塊加起來就是整塊——a、c、d 是多少都不必知道',
              d: k => TX(220, 204, 'a ( c ＋ d ) ＝ ac ＋ ad', { anchor: 'middle', fs: 20, c: GRN, op: k })
            }
          ]);
        },
        caption: 'a、c、d 都不知道是多少，<b>這個等號還是成立</b>。',
        example: {
          q: '一小罐 \\(a\\) 顆糖，再放 \\(b\\) 顆變大罐。買 \\(7\\) 大罐，一共幾顆？',
          steps: ['整罐算：\\((a+b)\\times7\\)', '分開算：\\(a\\times7+b\\times7\\)'],
          ans: '\\((a+b)\\times7=a\\times7+b\\times7\\)，兩種寫法都對'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '2×2 一定是四項，算完數一下',
        points: [
          '長切成 \\(a\\)、\\(b\\)，寬切成 \\(c\\)、\\(d\\)，長方形變<b>四塊</b>。',
          '四塊是 \\(ac\\)、\\(ad\\)、\\(bc\\)、\\(bd\\)——<b>四塊就是四項</b>。',
          '最常見的錯是<b>只算兩項</b>，漏掉交叉的那兩塊。'
        ],
        formula: { label: '公式 1<span class="pgref">課本 印 7–8</span>', tex: '(a+b)(c+d)=ac+ad+bc+bd' },
        visual: (h) => {
          const x0 = 120, x1 = 372, y0 = 48, y1 = 186;
          const xm = x0 + (x1 - x0) * 0.6, ym = y0 + (y1 - y0) * 0.6;
          const frame = `${SQFRAME(x0, y0, x1 - x0, y1 - y0, C)}
            ${SV.seg(xm, y0, xm, y1, '#9fb3d9', 1.6, '5 4')}${SV.seg(x0, ym, x1, ym, '#9fb3d9', 1.6, '5 4')}
            ${TX((x0 + xm) / 2, y0 - 12, 'a', { anchor: 'middle', fs: 16, c: GREY })}
            ${TX((xm + x1) / 2, y0 - 12, 'b', { anchor: 'middle', fs: 16, c: GREY })}
            ${TX(x0 - 12, (y0 + ym) / 2 + 5, 'c', { anchor: 'end', fs: 16, c: GREY })}
            ${TX(x0 - 12, (ym + y1) / 2 + 5, 'd', { anchor: 'end', fs: 16, c: GREY })}`;
          const cell = (x, y, w, ht, col, label, k) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${ht}" fill="${col}" opacity="${0.12 + 0.24 * k}"/>` +
            TX(x + w / 2, y + ht / 2 + 7, label, { anchor: 'middle', fs: 19, c: col, op: k });
          SV.stepper(h, '0 0 440 234', [
            { t: '左上那塊：a × c ＝ ac', d: k => frame + cell(x0, y0, xm - x0, ym - y0, BLU, 'ac', k) },
            { t: '左下那塊：a × d ＝ ad', d: k => cell(x0, ym, xm - x0, y1 - ym, GRN, 'ad', k) },
            { t: '右上那塊：b × c ＝ bc', d: k => cell(xm, y0, x1 - xm, ym - y0, AMB, 'bc', k) },
            {
              t: '右下那塊：b × d ＝ bd，四塊剛好四項', d: k => cell(xm, ym, x1 - xm, y1 - ym, VIO, 'bd', k) +
                TX(220, 216, 'ac ＋ ad ＋ bc ＋ bd', { anchor: 'middle', fs: 18, c: INK, op: k })
            }
          ]);
        },
        caption: '算完先數項數：<b>四項才對</b>，兩項一定漏了。',
        example: {
          q: '展開 \\((a+b)(c+d)\\)，用分配律做一次。',
          steps: [
            '先把 \\((c+d)\\) 當成一個數：\\(a(c+d)+b(c+d)\\)。',
            '再各自展開：\\(ac+ad\\) 和 \\(bc+bd\\)。'
          ],
          ans: '\\(ac+ad+bc+bd\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '四條線畫完，才算展開完',
        points: [
          '左邊兩項、右邊兩項，<b>每一項都要乘到對面兩項</b>。',
          '\\((a+3)(b+5)\\) 展開是 \\(ab+5a+3b+15\\)，正好四項。',
          '<b>畫完四條線再數項數</b>，漏掉的通常是交叉那兩條。'
        ],
        formula: { label: '檢查動作<span class="pgref">課本 印 8</span>', tex: '2\\times2\\ \\Rightarrow\\ 4\\ \\text{項}' },
        visual: (h) => {
          const P = { a: 112, t3: 176, b: 264, t5: 328 };
          const glyph = (x, t, col) => TX(x, 62, t, { anchor: 'middle', fs: 22, c: col || INK });
          const head = glyph(84, '(') + glyph(P.a, 'a', BLU) + glyph(144, '＋') + glyph(P.t3, '3', AMB) + glyph(206, ')') +
            glyph(236, '(') + glyph(P.b, 'b', BLU) + glyph(296, '＋') + glyph(P.t5, '5', AMB) + glyph(358, ')');
          const arc = (x1, x2, col, k, up) => {
            const y0 = up ? 44 : 78, cy = up ? 6 : 122;
            const xe = x1 + (x2 - x1) * k;
            return `<path d="M${x1},${y0} Q${(x1 + x2) / 2},${cy} ${xe},${y0}" fill="none" stroke="${col}" stroke-width="2.4" opacity=".85"/>`;
          };
          const item = (i, txt, col, k) => TX(120, 152 + i * 30, txt, { fs: 17, c: col, op: k });
          SV.stepper(h, '0 0 440 290', [
            { t: 'a 乘 b（第一條）', d: k => head + arc(P.a, P.b, BLU, k, true) + item(0, 'a × b ＝ ab', BLU, k) },
            { t: 'a 乘 5（交叉的第一條）', d: k => arc(P.a, P.t5, GRN, k, false) + item(1, 'a × 5 ＝ 5a', GRN, k) },
            { t: '3 乘 b（交叉的第二條）', d: k => arc(P.t3, P.b, AMB, k, false) + item(2, '3 × b ＝ 3b', AMB, k) },
            {
              t: '3 乘 5，四條線畫完剛好四項', d: k => arc(P.t3, P.t5, VIO, k, true) + item(3, '3 × 5 ＝ 15', VIO, k) +
                TX(120, 272, '合起來：ab ＋ 5a ＋ 3b ＋ 15', { fs: 17, c: INK, op: k })
            }
          ]);
        },
        caption: '箭頭是<b>檢查用</b>的；為什麼一定是四項，看上一頁的四塊。',
        example: {
          q: '展開 \\((x+2)(y+3)\\)。',
          steps: ['\\(x\\) 乘 \\(y\\)、\\(x\\) 乘 \\(3\\)', '\\(2\\) 乘 \\(y\\)、\\(2\\) 乘 \\(3\\)'],
          ans: '\\(xy+3x+2y+6\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜分配律與四項展開',
        points: [
          '課本那題<b>先把括號拆開</b>，四個乘積一個都不能少。',
          '習作兩題都是<b>湊整十整百</b>：一題拆成整數加分數，一題找共同的因數。',
          '兩題都抄到本子上，<b>習作這兩題今天寫完</b>。'
        ],
        formula: { label: '這一組在練', tex: '(a+b)(c+d)=ac+ad+bc+bd' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 8', BLU, '填入適當的數再計算',
              pItem('印5 ①', '97\\times104=(100-3)(100+4)', '10088')) +
            pCard('習作・基礎練習', '印 2、3', AMB, '用分配律求值，寫完整過程',
              pItem('基礎1 ①', '7\\tfrac{1}{3}\\times3\\tfrac{1}{7}', '\\(23\\tfrac{1}{21}\\)') +
              pItem('基礎2 ①', '38\\times13+38\\times7+42\\times13+42\\times7', '1600')), '1-1');
        },
        caption: '課本印 5、習作印 1 與 2。<b>習作這兩題今天當堂寫完</b>。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '(a+b)² 中間還有兩塊 ab',
        points: [
          '<span class="k">和的平方</span>：先把 a、b <b>加起來</b>，再<b>平方</b>。',
          '正方形切成四塊：\\(a^2\\)、\\(ab\\)、\\(ab\\)、\\(b^2\\)。',
          '中間<b>躺著一塊、站著一塊</b>，一樣大，所以是 \\(2ab\\)。'
        ],
        formula: { label: '公式 2<span class="pgref">課本 印 9–10</span>', tex: '(a+b)^2=a^2+2ab+b^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>a <span class="ival av">5</span>　　b <span class="ival bv">3</span></label>
              <input type="range" class="as" min="1" max="8" step="1" value="5">
              <input type="range" class="bs" min="1" max="8" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a;
            h.querySelector('.bv').textContent = b;
            const u = 168 / (a + b), x0 = 128, y0 = 34, A = a * u, B = b * u;
            h.querySelector('.fig').innerHTML = svg('0 0 440 262', `
              <rect x="${x0}" y="${y0}" width="${A}" height="${A}" fill="${BLU}" opacity=".62"/>
              <rect x="${x0 + A}" y="${y0}" width="${B}" height="${A}" fill="${AMB}" opacity=".62"/>
              <rect x="${x0}" y="${y0 + A}" width="${A}" height="${B}" fill="${AMB}" opacity=".62"/>
              <rect x="${x0 + A}" y="${y0 + A}" width="${B}" height="${B}" fill="${GRN}" opacity=".62"/>
              ${SQFRAME(x0, y0, A + B, A + B, INK, 2)}
              ${TX(x0 + A / 2, y0 + A / 2 + 5, `${a * a}`, { anchor: 'middle', fs: 15, c: '#fff' })}
              ${TX(x0 + A + B / 2, y0 + A / 2 + 5, `${a * b}`, { anchor: 'middle', fs: 13, c: '#fff' })}
              ${TX(x0 + A / 2, y0 + A + B / 2 + 5, `${a * b}`, { anchor: 'middle', fs: 13, c: '#fff' })}
              ${TX(x0 + A + B / 2, y0 + A + B / 2 + 5, `${b * b}`, { anchor: 'middle', fs: 13, c: '#fff' })}
              ${TX(x0 - 10, y0 + A / 2 + 5, 'a', { anchor: 'end', fs: 14, c: GREY })}
              ${TX(x0 - 10, y0 + A + B / 2 + 5, 'b', { anchor: 'end', fs: 14, c: GREY })}
              ${TX(220, 244, `(${a}＋${b})² ＝ ${a * a} ＋ ${a * b} ＋ ${a * b} ＋ ${b * b} ＝ ${(a + b) * (a + b)}`, { anchor: 'middle', fs: 15, c: INK })}
            `);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '拖滑桿改 a、b，中間那兩塊永遠一樣大。',
        example: {
          q: '算 \\(103^2\\)。',
          steps: ['\\(103=100+3\\)', '\\(100^2+2\\times100\\times3+3^2\\)'],
          ans: '\\(10000+600+9=10609\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '(a−b)² 是扣掉兩條，角落要補回來',
        points: [
          '<span class="k">差的平方</span>：先把 a、b <b>相減</b>，再<b>平方</b>。',
          '從 \\(a^2\\) 扣掉<b>兩條</b> \\(ab\\)，角落那塊 \\(b^2\\) <b>被扣了兩次</b>。',
          '所以最後要 <b>＋\\(b^2\\)</b>，把角落補回來。'
        ],
        formula: { label: '公式 3<span class="pgref">課本 印 12</span>', tex: '(a-b)^2=a^2-2ab+b^2' },
        visual: (h) => {
          const a = 10, b = 3, S = 176, x0 = 26, y0 = 34;
          const u = S / a, bp = u * b, cp = S - bp;
          const RX = 232;
          const strip = (x, y, w, ht, k) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${ht}" fill="${RED}" opacity="${0.22 * k}"/>`;
          const base = SQFRAME(x0, y0, S, S, BLU, 2.4) +
            TX(x0 + S / 2, y0 - 12, 'a ＝ 10', { anchor: 'middle', fs: 14, c: GREY }) +
            TX(x0 - 8, y0 + S / 2 + 5, 'a', { anchor: 'end', fs: 14, c: GREY });
          SV.stepper(h, '0 0 440 238', [
            {
              t: '先看整塊 \\(a^2\\)：邊長 a ＝ 10，面積 100。',
              d: k => base + TX(RX, 56, 'a² ＝ 100', { fs: 16, c: BLU, op: k })
            },
            {
              t: '扣掉<b>右邊一條</b> \\(ab\\)：寬 b ＝ 3、長 a ＝ 10。',
              d: k => strip(x0 + cp, y0, bp, S, k) +
                TX(RX, 86, '－ab ＝ －30', { fs: 15, c: RED, op: k })
            },
            {
              t: '再扣掉<b>下面一條</b> \\(ab\\)，也是 3×10。',
              d: k => strip(x0, y0 + cp, S, bp, k) +
                TX(RX, 114, '－ab ＝ －30', { fs: 15, c: RED, op: k })
            },
            {
              t: '右下角那塊 \\(b^2\\) <b>被扣了兩次</b>，要 ＋\\(b^2\\) 補回來。',
              d: k => `<rect x="${x0 + cp}" y="${y0 + cp}" width="${bp}" height="${bp}" fill="${AMB}" opacity="${0.55 * k}"/>` +
                SQFRAME(x0 + cp, y0 + cp, bp, bp, AMB, 2) +
                TX(x0 + cp + bp / 2, y0 + cp + bp / 2 + 5, 'b²', { anchor: 'middle', fs: 14, c: '#fff', op: k }) +
                TX(RX, 142, '＋b² ＝ ＋9（角落補回）', { fs: 15, c: AMB, op: k })
            },
            {
              t: '剩下的綠色正方形就是 \\((a-b)^2\\)：邊長 10－3 ＝ 7。',
              d: k => `<rect x="${x0}" y="${y0}" width="${cp}" height="${cp}" fill="${GRN}" opacity="${0.3 * k}"/>` +
                SQFRAME(x0, y0, cp, cp, GRN, 2.4) +
                TX(x0 + cp / 2, y0 + cp / 2 + 6, '(a－b)²', { anchor: 'middle', fs: 17, c: GRN, op: k }) +
                `<line x1="${RX}" y1="160" x2="424" y2="160" stroke="#c9d3e2" stroke-width="1.6" opacity="${k}"/>` +
                TX(RX, 188, '100－30－30＋9 ＝ 49', { fs: 16, c: GRN, op: k }) +
                TX(RX, 214, '直接算：7² ＝ 49 ✓', { fs: 14.5, c: GREY, op: k })
            }
          ]);
        },
        caption: '角落那塊是關鍵：<b>被扣兩次</b>，所以公式最後是 ＋\\(b^2\\)，不是 －\\(b^2\\)。',
        example: {
          q: '算 \\(98^2\\)。',
          steps: ['\\(98=100-2\\)', '\\(100^2-2\\times100\\times2+2^2\\)'],
          ans: '\\(10000-400+4=9604\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '兩個平方相減，剪一刀就變長方形',
        points: [
          '<span class="k">平方差</span>：\\(a^2-b^2\\) 是<b>兩個平方相減</b>。',
          '大正方形挖掉小正方形，剩下的 <b>L 形剪一刀</b>可以拼成長方形。',
          '長方形是 <b>(a＋b)</b> 乘 <b>(a－b)</b>，所以 \\((a+b)(a-b)=a^2-b^2\\)。'
        ],
        formula: { label: '公式 4<span class="pgref">課本 印 14</span>', tex: '(a+b)(a-b)=a^2-b^2' },
        visual: (h) => {
          const a = 10, b = 4, S = 170, x0 = 56, y0 = 40;
          const u = S / a, bp = u * b, cp = S - bp;
          const lbl = (x, y, t, col, k, fs) => TX(x, y, t, { anchor: 'middle', fs: fs || 15, c: col, op: k });
          SV.stepper(h, '0 0 440 250', [
            {
              t: '邊長 a ＝ 10 的正方形，挖掉邊長 b ＝ 4 的小正方形。',
              d: k => SQFRAME(x0, y0, S, S, BLU, 2.4) +
                `<rect x="${x0 + cp}" y="${y0 + cp}" width="${bp}" height="${bp}" fill="#fff" stroke="${RED}" stroke-width="2" opacity="${k}"/>` +
                lbl(x0 + cp + bp / 2, y0 + cp + bp / 2 + 5, 'b²', RED, k) +
                lbl(x0 + S / 2, y0 - 14, 'a ＝ 10', GREY, k, 14) +
                TX(220, 244, '挖掉的是 b² ＝ 16', { anchor: 'middle', fs: 15, c: RED, op: k })
            },
            {
              t: '剩下的 L 形分成兩塊：上面<b>甲</b>、下面<b>乙</b>。',
              d: k => `<rect x="${x0}" y="${y0}" width="${S}" height="${cp}" fill="${BLU}" opacity="${0.26 * k}"/>
                <rect x="${x0}" y="${y0 + cp}" width="${cp}" height="${bp}" fill="${GRN}" opacity="${0.3 * k}"/>` +
                lbl(x0 + S / 2, y0 + cp / 2 + 5, '甲', BLU, k, 18) +
                lbl(x0 + cp / 2, y0 + cp + bp / 2 + 5, '乙', GRN, k, 18)
            },
            {

              t: '把<b>乙</b>搬到甲的右邊，面積沒變。',
              d: k => `<rect x="${x0 - 4}" y="${y0 + cp - 2}" width="${S + 8}" height="${bp + 8}" fill="#fff" opacity="${k}"/>` +
                `<rect x="${x0}" y="${y0}" width="${S}" height="${cp}" fill="${BLU}" opacity=".26"/>` +
                `<rect x="${x0 + S + 16}" y="${y0}" width="${bp}" height="${cp}" fill="${GRN}" opacity="${0.3 * k}"/>` +
                SV.seg(x0, y0 + cp, x0 + S, y0 + cp, BLU, 2) +
                lbl(x0 + S / 2, y0 + cp / 2 + 5, '甲', BLU, 1, 18) +
                lbl(x0 + S + 16 + bp / 2, y0 + cp / 2 + 5, '乙', GRN, k, 16)
            },
            {
              t: '拼成長方形：長是 a＋b ＝ 14，寬是 a－b ＝ 6。',
              d: k => {
                const W = S + bp;
                return `<rect x="${x0 + S}" y="${y0}" width="${bp + 20}" height="${cp}" fill="#fff" opacity="${k}"/>` +
                  `<rect x="${x0 + S}" y="${y0}" width="${bp}" height="${cp}" fill="${GRN}" opacity="${0.3 * k}"/>` +
                  `<rect x="${x0 - 12}" y="${y0 - 30}" width="${W + 40}" height="24" fill="#fff" opacity="${k}"/>` +
                  SQFRAME(x0, y0, W, cp, INK, 2.4) +
                  lbl(x0 + S + bp / 2, y0 + cp / 2 + 5, '乙', GRN, k, 16) +
                  lbl(x0 + W / 2, y0 - 12, 'a ＋ b ＝ 14', INK, k, 15) +
                  TX(x0 - 8, y0 + cp / 2 + 5, 'a－b', { anchor: 'end', fs: 14, c: INK, op: k }) +
                  TX(220, y0 + cp + 46, '(a＋b)(a－b) ＝ a² － b²', { anchor: 'middle', fs: 19, c: GRN, op: k }) +
                  TX(220, y0 + cp + 76, '14 × 6 ＝ 84 ＝ 100 － 16 ✓', { anchor: 'middle', fs: 16, c: GREY, op: k });
              }
            }
          ]);
        },
        caption: '中間沒有 \\(2ab\\)：一個和、一個差，中間兩項剛好抵消。',
        example: {
          q: '計算 \\(103\\times97\\)。',
          steps: ['\\(103=100+3\\)、\\(97=100-3\\)，同一組數的和與差', '\\((100+3)(100-3)=100^2-3^2\\)'],
          ans: '\\(10000-9=9991\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '「差的平方」和「平方差」，差在字的順序',
        points: [
          '<b>差的平方</b>：先相減，<u>再平方</u> → \\((a-b)^2\\)，有中間項。',
          '<b>平方差</b>：先各自平方，<u>再相減</u> → \\(a^2-b^2\\)，沒有中間項。',
          '<b>唸名字時把最後兩個字唸重一點</b>，最後那個字就是最後那個動作。'
        ],
        formula: { label: '分辨<span class="pgref">課本 印 12、14</span>', tex: '\\begin{array}{c}(a-b)^2=a^2-2ab+b^2\\\\(a+b)(a-b)=a^2-b^2\\end{array}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>a <span class="ival av">7</span>　　b <span class="ival bv">3</span></label>
              <input type="range" class="as" min="4" max="12" step="1" value="7">
              <input type="range" class="bs" min="1" max="3" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a;
            h.querySelector('.bv').textContent = b;
            const v1 = (a - b) * (a - b), v2 = (a + b) * (a - b);
            h.querySelector('.fig').innerHTML = svg('0 0 440 256', `
              ${BOX(24, 30, 188, 92, { fill: '#fdeef2', stroke: RED })}
              ${TX(118, 56, '差的平方', { anchor: 'middle', fs: 14, c: RED })}
              ${TX(118, 84, `(${a}－${b})²`, { anchor: 'middle', fs: 17, c: INK })}
              ${TX(118, 110, `＝ ${v1}`, { anchor: 'middle', fs: 19, c: RED })}
              ${BOX(228, 30, 188, 92, { fill: '#eef4ff', stroke: BLU })}
              ${TX(322, 56, '平方差', { anchor: 'middle', fs: 14, c: BLU })}
              ${TX(322, 84, `${a}² － ${b}²`, { anchor: 'middle', fs: 17, c: INK })}
              ${TX(322, 110, `＝ ${v2}`, { anchor: 'middle', fs: 19, c: BLU })}
              ${TX(220, 158, '兩個答案不一樣，才算真的懂', { anchor: 'middle', fs: 16, c: INK })}
              ${TX(220, 190, `(${a}－${b})² ＝ ${a - b}² ＝ ${v1}`, { anchor: 'middle', fs: 15, c: RED })}
              ${TX(220, 220, `${a}² － ${b}² ＝ ${a * a} － ${b * b} ＝ ${v2}`, { anchor: 'middle', fs: 15, c: BLU })}
            `);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '「平方裡面相減」對「兩平方相減」，是完全不同的兩件事。',
        example: {
          q: '判斷：\\(101^2-100^2=(101-100)^2\\) 對不對？',
          steps: ['左邊是兩平方相減，要用平方差', '\\((101+100)(101-100)=201\\)'],
          ans: '錯。右邊算出來只有 \\(1\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜和的平方與差的平方（課本隨堂）',
        points: [
          '判斷對錯的題目：<b>錯的要說出錯在哪</b>，再寫正確的。',
          '\\((a+b)^2\\) 中間還有 <b>\\(2ab\\)</b>；\\((a-b)^2\\) 是<b>扣兩條、角落補回</b>。',
          '每一題都<b>抄到本子上再算</b>，不要只用眼睛看。'
        ],
        formula: { label: '這一組在練', tex: '(a\\pm b)^2=a^2\\pm 2ab+b^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 10、12', BLU, '判斷對錯，錯的請更正',
              pItem('印7 ①', '(4+3)^2=4^2+3^2', '✗') +
              pItem('印7 ②', '(5+1)^2=5^2+2\\times 5\\times 1+1^2', '✓') +
              pItem('印9 ①', '(11-1)^2=11^2-1^2', '✗') +
              pItem('印9 ③', '(20-8)^2=20^2-20\\times 8+8^2', '✗')), '1-1');
        },
        caption: '課本印 7、9：判斷對錯，錯的要說出錯在哪再更正。'
      },
      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜和的平方與差的平方（習作）',
        points: [
          '把公式<b>反過來用</b>：看到三項就想「湊得回去嗎」。',
          '\\(108^2\\)、\\(97^2\\) 先拆成 \\(100\\pm\\) 幾，再套公式。',
          '<b>這四題今天當堂寫完</b>，寫完自己對一次詳解。'
        ],
        formula: { label: '這一組在練', tex: '(a\\pm b)^2=a^2\\pm 2ab+b^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 2、3', AMB, '用公式求值，寫完整過程',
              pItem('基礎1 ②', '108^2', '11664') +
              pItem('基礎1 ③', '97^2', '9409') +
              pItem('基礎2 ②', '59^2+2\\times 59\\times 1+1^2', '3600') +
              pItem('基礎2 ③', '89^2-2\\times 89\\times 39+39^2', '2500')), '1-1');
        },
        caption: '習作印 1、2 這四題<b>今天當堂寫完</b>，不留到回家。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜平方差（課本隨堂）',
        points: [
          '四題判斷：<b>看中間是不是減號</b>，是「兩平方相減」才算。',
          '兩個括號<b>一個和、一個差</b>，才是平方差。',
          '錯的那一題要寫出正確的式子，不是只打叉。'
        ],
        formula: { label: '這一組在練', tex: '(a+b)(a-b)=a^2-b^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 14', BLU, '判斷對錯，錯的請更正',
              pItem('印11 ①', '(15+5)(15-5)=15^2-5^2', '✓') +
              pItem('印11 ②', '(7+3)(7-3)=7^2+3^2', '✗') +
              pItem('印11 ③', '23^2-3^2=(23+3)(23-3)', '✓') +
              pItem('印11 ④', '101^2-100^2=(101-100)^2', '✗')), '1-1');
        },
        caption: '課本印 11：四題判斷，看中間是不是減號。'
      },
      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜平方差（習作）',
        points: [
          '前兩題<b>湊整十整百</b>：\\(96\\times104=(100-4)(100+4)\\)。',
          '後兩題是<b>把平方差當工具用</b>，先找出「哪兩個數的和與差」。',
          '基礎 4 先把兩個正方形的面積相減，再除以 2。'
        ],
        formula: { label: '這一組在練', tex: '(a+b)(a-b)=a^2-b^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 2–4', AMB, '用平方差求值與應用',
              pItem('基礎1 ④', '96\\times104', '9984') +
              pItem('基礎2 ④', '125^2-25^2', '15000') +
              pText('基礎4', '等腰直角三角形農地切出小三角形停車場，其餘是草莓園。\\(\\overline{AB}=288\\)、\\(\\overline{CD}=88\\) 公尺，求草莓園面積。', '37600 平方公尺') +
              pText('基礎6', '\\(a=65^2-15^2\\)、\\(b=68^2-18^2\\)，比較 \\(a\\) 與 \\(b\\) 的大小。', '\\(b\\gt a\\)')), '1-1');
        },
        caption: '習作印 1～4：前兩題湊整十整百，後兩題把平方差當工具用。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '拆成整十整百，比用直式快',
        points: [
          '看到<b>一個比整百多、一個比整百少</b>，先想平方差。',
          '兩個都比整百多，就老實展開四項。',
          '拆的目標永遠是<b>湊出整十整百</b>，不是背公式。'
        ],
        formula: { label: '速算<span class="pgref">課本 印 15 例 4</span>', tex: '103\\times97=100^2-3^2=9991' },
        visual: (h) => {
          const line = (i, s, col, k) => TX(58, 74 + i * 42, s, { fs: 18, c: col, op: k });
          const head = (s) => TX(220, 40, s, { anchor: 'middle', fs: 19, c: C });
          SV.stepper(h, '0 0 440 284', [
            {
              t: '103 × 97：一個多 3、一個少 3 → 平方差', d: k =>
                head('103 × 97') + line(0, '＝ (100 ＋ 3)(100 － 3)', BLU, k) +
                line(1, '＝ 100² － 3²', BLU, k > .5 ? (k - .5) * 2 : 0) +
                line(2, '＝ 10000 － 9 ＝ 9991', GRN, k > .8 ? (k - .8) * 5 : 0)
            },
            {
              t: '102 × 108：兩個都比 100 多 → 展開四項', d: k =>
                head('102 × 108') + line(0, '＝ (100 ＋ 2)(100 ＋ 8)', BLU, k) +
                line(1, '＝ 10000 ＋ 800 ＋ 200 ＋ 16', BLU, k > .5 ? (k - .5) * 2 : 0) +
                line(2, '＝ 11016', GRN, k > .8 ? (k - .8) * 5 : 0)
            },
            {
              t: '54 × 102：拆成 100 ＋ 2 就好', d: k =>
                head('54 × 102') + line(0, '＝ 54 × (100 ＋ 2)', BLU, k) +
                line(1, '＝ 5400 ＋ 108', BLU, k > .5 ? (k - .5) * 2 : 0) +
                line(2, '＝ 5508', GRN, k > .8 ? (k - .8) * 5 : 0)
            }
          ], { acc: false });
        },
        caption: '算出來比同學用直式快，這就是這一節最直接的用處。',
        example: {
          q: '算 \\(89\\times199\\)。',
          steps: ['\\(199=200-1\\)', '\\(89\\times200-89\\times1\\)'],
          ans: '\\(17800-89=17711\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '最常錯的三件事',
        points: [
          '這三個錯，每一個都有固定的檢查動作可以擋。',
          '<b>數項數、唸名字、看中間項</b>，三個動作而已。',
          '錯了不要重背公式，回去做那個檢查動作。'
        ],
        formula: { label: '最常見的一個<span class="pgref">課本 印 18 重點整理</span>', tex: '(a+b)^2\\ne a^2+b^2' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '漏掉中間兩塊', bad: '\\((a+b)^2=a^2+b^2\\)', good: '\\((a+b)^2=a^2+2ab+b^2\\)　中間還有兩塊 \\(ab\\)' },
            { tag: '兩個公式混用', bad: '\\(a^2-b^2=(a-b)^2\\)', good: '\\(a^2-b^2=(a+b)(a-b)\\)　兩平方相減' },
            { tag: '展開只算兩項', bad: '\\((a+3)(b+5)=ab+15\\)', good: '\\(ab+5a+3b+15\\)　2×2 一定四項' }
          ]);
          MJ(h);
        },
        caption: '三個錯分別對應三個檢查動作：數項數、唸名字、看中間項。',
        example: {
          q: '30 秒自我檢查：\\((7+3)(7-3)\\) 和 \\((7-3)^2\\) 各是多少？',
          steps: ['直接算括號：\\(10\\times4\\)', '直接算括號：\\(4^2\\)'],
          ans: '\\(40\\) 和 \\(16\\)，答案不一樣才算懂'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜三個公式一起判斷（前三小題）',
        points: [
          '這六題<b>三個公式混在一起</b>，先看是平方還是相乘，再決定套哪一條。',
          '有字母的題目一樣做，\\(a\\)、\\(x\\) 和數字的角色完全一樣。',
          '下面三題是<b>行有餘力才做</b>，今天做不完不要緊。'
        ],
        formula: { label: '三條一起用', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習 3', '印 3', AMB, '判斷對錯，錯的請更正',
              pItem('基礎3 ①', '(10+0.3)^2=10^2+0.3^2', '✗') +
              pItem('基礎3 ②', '(5-\\tfrac{1}{4})(5+\\tfrac{1}{4})=5^2-(\\tfrac{1}{4})^2', '✓') +
              pItem('基礎3 ③', '9.8\\times10.2=10^2-0.2^2', '✓')), '1-1');
        },
        caption: '習作基礎 3 的 ①②③：先說用哪一條公式，再判斷對錯。'
      },
      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜三個公式一起判斷（後三小題）',
        points: [
          '這六題<b>三個公式混在一起</b>，先看是平方還是相乘，再決定套哪一條。',
          '有字母的題目一樣做，\\(a\\)、\\(x\\) 和數字的角色完全一樣。',
          '下面三題是<b>行有餘力才做</b>，今天做不完不要緊。'
        ],
        formula: { label: '三條一起用', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習 3', '印 3', AMB, '判斷對錯，錯的請更正',
              pItem('基礎3 ④', '(a+10)^2=a^2+10a+10^2', '✗') +
              pItem('基礎3 ⑤', '(x-y)^2=x^2-xy+y^2', '✗') +
              pItem('基礎3 ⑥', 'm^2-n^2=(m+n)(m-n)', '✓')), '1-1');
        },
        caption: '習作基礎 3 的 ④⑤⑥：同樣先說公式，再判斷。'
      },
      {
        sec: '1-1', secName: '乘法公式',
        title: '練習｜基礎 5 與精熟（行有餘力）',
        points: [
          '這六題<b>三個公式混在一起</b>，先看是平方還是相乘，再決定套哪一條。',
          '有字母的題目一樣做，\\(a\\)、\\(x\\) 和數字的角色完全一樣。',
          '下面三題是<b>行有餘力才做</b>，今天做不完不要緊。'
        ],
        formula: { label: '三條一起用', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 4、5', GRN, '基礎 5 與精熟練習，做不完不追',
              pText('基礎5', '選擇：哪個與 \\(102^2+98^2\\) 相同？（四個選項見習作）', '(D)') +
              pText('精熟1', '大正方形分割成小正方形與四個直角三角形（兩股 \\(9\\)、\\(40\\)），求大正方形面積。', '1681') +
              pText('精熟2', '\\(\\frac{133^2}{135}\\) 最接近哪個正整數？', '131')), '1-1');
        },
        caption: '做不完不追；精熟兩題標「進階」。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '把 10 換成 x，就變成多項式',
        points: [
          '\\(3825\\) 是 3 個千、8 個百、2 個十、5 個一。',
          '同一張表，把 <b>10 換成 x</b>，寫出來就是多項式。',
          '多項式不是新東西，是<b>換個底</b>的位值表。'
        ],
        formula: { label: '教育部教材的例子<span class="pgref">課本 印 21–22</span>', tex: '15x^3+7x^2+18x+(-9)' },
        visual: (h) => {
          const x0 = 44, w = 88, y0 = 58, hh = 44;
          const table = (heads, vals, col, k) => {
            let s = '';
            for (let i = 0; i < 4; i++) {
              s += BOX(x0 + i * w, y0, w - 6, hh, { r: 8, fill: '#f6f9ff', stroke: '#d6e0f2', op: k });
              s += TX(x0 + i * w + (w - 6) / 2, y0 + 28, heads[i], { anchor: 'middle', fs: 16, c: col, op: k });
              s += BOX(x0 + i * w, y0 + hh + 8, w - 6, hh, { r: 8, fill: '#fff', stroke: '#d6e0f2', op: k });
              s += TX(x0 + i * w + (w - 6) / 2, y0 + hh + 36, vals[i], { anchor: 'middle', fs: 17, c: INK, op: k });
            }
            return s;
          };
          SV.stepper(h, '0 0 440 292', [
            {
              t: '3825 拆成位值：3 個千、8 個百、2 個十、5 個一', d: k =>
                TX(220, 34, '3825', { anchor: 'middle', fs: 20, c: INK }) +
                table(['10³', '10²', '10¹', '10⁰'], ['3', '8', '2', '5'], BLU, k)
            },
            {
              t: '格子裡可以放超過 9：7 個 10³、48 個 10²…', d: k =>
                `<rect x="0" y="0" width="440" height="292" fill="#fff"/>` +
                TX(220, 34, '同一張表，數字可以超過 9', { anchor: 'middle', fs: 17, c: GREY }) +
                table(['10³', '10²', '10¹', '10⁰'], ['7', '48', '52', '3'], BLU, k) +
                TX(220, 226, '7×10³ ＋ 48×10² ＋ 52×10¹ ＋ 3×10⁰', { anchor: 'middle', fs: 15, c: INK, op: k })
            },
            {
              t: '把 10 換成 x，就是 x 的多項式', d: k =>
                `<rect x="0" y="0" width="440" height="292" fill="#fff"/>` +
                TX(220, 34, '把 10 換成 x', { anchor: 'middle', fs: 17, c: GRN }) +
                table(['x³', 'x²', 'x¹', 'x⁰'], ['15', '7', '18', '－9'], GRN, 1) +
                TX(220, 226, '15x³ ＋ 7x² ＋ 18x ＋ (－9)', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 258, '簡記成 15x³ ＋ 7x² ＋ 18x － 9', { anchor: 'middle', fs: 15, c: GRN, op: k })
            }
          ], { acc: false });
        },
        caption: '「幾個百、幾個十」換成「幾個 x²、幾個 x」，其他都一樣。',
        example: {
          q: '把「2 個 \\(x^2\\)、0 個 \\(x\\)、7 個常數」寫成多項式。',
          steps: ['先照表寫 \\(2\\times x^2+0\\times x+7\\)', '\\(0\\times x\\) 可以不寫'],
          ans: '\\(2x^2+7\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: 'x 跑到分母或絕對值裡，就不是多項式',
        points: [
          '每一項都是<b>數字乘 x 的次方</b>，才算多項式。',
          '<b>x 在分母</b>、<b>x 在絕對值裡</b>，就不是多項式。',
          '只有一個數字、沒有 x 的（例如 \\(5\\)）也是多項式，叫<b>常數多項式</b>。'
        ],
        formula: { label: '判斷的標準<span class="pgref">課本 印 21–22</span>', tex: '\\text{每一項都是 }a\\,x^n\\ (n\\text{ 是 }0,1,2,\\dots)' },
        visual: (h) => {
          const tile = (x, y, body, verdict, why, ok) => {
            const col = ok ? GRN : RED;
            return BOX(x, y, 124, 84, { r: 12, fill: ok ? 'rgba(5,150,105,.07)' : 'rgba(225,29,72,.06)', stroke: col, sw: 2 })
              + body(x + 62, y)
              + TX(x + 62, y + 62, (ok ? '✓ ' : '✗ ') + verdict, { anchor: 'middle', fs: 13.5, c: col })
              + TX(x + 62, y + 78, why, { anchor: 'middle', fs: 12, c: GREY });
          };
          const plain = (t, fs) => (cx, y) => TX(cx, y + 36, t, { anchor: 'middle', fs: fs || 20, c: INK });

          const frac = (cx, y) =>
            TX(cx, y + 20, '2', { anchor: 'middle', fs: 18, c: INK })
            + SV.seg(cx - 13, y + 27, cx + 13, y + 27, INK, 2)
            + TX(cx, y + 44, 'x', { anchor: 'middle', fs: 18, c: RED });
          let s = TX(220, 22, '哪些是多項式？', { anchor: 'middle', fs: 17, c: INK });
          s += tile(12, 36, plain('5'), '是', '常數多項式', true);
          s += tile(158, 36, plain('x ＋ 1'), '是', '一次多項式', true);
          s += tile(304, 36, plain('－3x² ＋ 2x － 1', 15), '是', '二次多項式', true);
          s += tile(86, 158, frac, '不是', 'x 在分母', false);
          s += tile(232, 158, plain('| x |'), '不是', 'x 在絕對值裡', false);
          s += TX(220, 286, '每一項都要是「數字 × x 的次方」，才過關', { anchor: 'middle', fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 296', s);
        },
        caption: '先問「每一項長得對不對」，再談次數、係數那些名詞。',
        example: {
          q: '\\(5\\)、\\(x+1\\)、\\(\\dfrac{2}{x}\\)，哪些是多項式？',
          steps: [
            '\\(5\\) 只有常數，是<b>常數多項式</b>。',
            '\\(x+1\\) 是一次多項式；\\(\\dfrac{2}{x}\\) 的 \\(x\\) 在分母，不是。'
          ],
          ans: '\\(5\\) 和 \\(x+1\\) 是，\\(\\dfrac{2}{x}\\) 不是'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '排的是次方，不是係數',
        points: [
          '\\(2x-1-3x^2\\) 降冪排好是 \\(-3x^2+2x-1\\)。',
          '排序前先把<b>每一項的次方圈起來</b>，只看圈起來的。',
          '係數的負號要一起帶走：二次項係數是 \\(-3\\)。'
        ],
        formula: { label: '降冪排列<span class="pgref">課本 印 23</span>', tex: '2x-1-3x^2=-3x^2+2x-1' },
        visual: (h) => {
          const terms = [{ s: '2x', d: 1, x: 96 }, { s: '－1', d: 0, x: 196 }, { s: '－3x²', d: 2, x: 292 }];
          const row = (y, arr, k) => arr.map(t =>
            BOX(t.x - 42, y, 84, 44, { r: 10, fill: '#f6f9ff', stroke: '#d6e0f2', op: k }) +
            TX(t.x, y + 29, t.s, { anchor: 'middle', fs: 18, c: INK, op: k })).join('');
          SV.stepper(h, '0 0 440 286', [
            {
              t: '先把三項分開，圈出每一項的次方', d: k =>
                TX(220, 36, '2x － 1 － 3x²', { anchor: 'middle', fs: 20, c: INK }) +
                row(62, terms, 1) +
                terms.map(t => `<circle cx="${t.x}" cy="${130}" r="${17 * k}" fill="none" stroke="${AMB}" stroke-width="2.4"/>` +
                  TX(t.x, 136, `${t.d}`, { anchor: 'middle', fs: 16, c: AMB, op: k })).join('') +
                TX(220, 172, '次方：1、0、2', { anchor: 'middle', fs: 15, c: AMB })
            },
            {
              t: '照次方由大到小排：2、1、0', d: k =>
                TX(220, 214, '2 → 1 → 0', { anchor: 'middle', fs: 17, c: GRN, op: k }) +
                row(216, [{ s: '－3x²', x: 96 }, { s: '＋2x', x: 196 }, { s: '－1', x: 292 }], k)
            },
            {
              t: '讀出係數：－3、2、－1', d: k =>
                TX(220, 278, '二次項係數 －3　一次項係數 2　常數項 －1', { anchor: 'middle', fs: 14, c: BLU, op: k })
            }
          ]);
        },
        caption: '−3 排最前面不是因為它最大，是因為它次方最高。',
        example: {
          q: '\\(2x-1-3x^2\\) 的常數項與一次項係數各是多少？',
          steps: ['常數項是沒有 \\(x\\) 的那一項', '一次項是 \\(2x\\)'],
          ans: '常數項 \\(-1\\)、一次項係數 \\(2\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '由大到小是降冪，由小到大是升冪',
        points: [
          '次方也叫<b>冪</b>；排的就是每一項的冪。',
          '<b>降冪</b>＝次方由大排到小，<b>升冪</b>＝由小排到大。',
          '題目會指定要哪一種，<b>看清楚再寫</b>。'
        ],

        formula: { label: '兩種排法<span class="pgref">課本 印 23</span>', tex: '\\text{降冪 }2x^2+3x-5\\quad\\text{升冪 }-5+3x+2x^2' },
        visual: (h) => {
          const T = { hi: { s: '2x²', d: 2, c: VIO }, mid: { s: '＋3x', d: 1, c: BLU }, lo: { s: '－5', d: 0, c: AMB } };
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>排法：<span class="ival" id="mv">降冪</span></label>
            <input type="range" id="ms" min="0" max="1" step="1" value="0"></div></div>`;
          const draw = () => {
            const up = +h.querySelector('#ms').value === 1;
            h.querySelector('#mv').textContent = up ? '升冪' : '降冪';
            const order = up ? [T.lo, T.mid, T.hi] : [T.hi, T.mid, T.lo];
            const X = [108, 220, 332];
            let s = TX(220, 26, '原式　3x － 5 ＋ 2x²', { anchor: 'middle', fs: 17, c: GREY });
            s += TX(220, 56, up ? '次方由小到大：0 → 1 → 2' : '次方由大到小：2 → 1 → 0',
              { anchor: 'middle', fs: 16, c: up ? AMB : VIO });
            order.forEach((t, i) => {
              s += `<circle cx="${X[i]}" cy="88" r="15" fill="none" stroke="${t.c}" stroke-width="2.4"/>`;
              s += TX(X[i], 94, String(t.d), { anchor: 'middle', fs: 15, c: t.c });
              s += BOX(X[i] - 50, 112, 100, 48, { r: 11, fill: '#f6f9ff', stroke: t.c, sw: 2 });
              s += TX(X[i], 143, t.s, { anchor: 'middle', fs: 20, c: INK });
              if (i < 2) s += TX((X[i] + X[i + 1]) / 2, 143, '→', { anchor: 'middle', fs: 16, c: GREY });
            });
            s += BOX(64, 180, 312, 48, { r: 12, fill: up ? 'rgba(217,119,6,.10)' : 'rgba(124,58,237,.10)', stroke: up ? AMB : VIO, sw: 2.2 });
            s += TX(220, 211, (up ? '升冪　－5 ＋ 3x ＋ 2x²' : '降冪　2x² ＋ 3x － 5'), { anchor: 'middle', fs: 19, c: INK });
            s += TX(220, 252, '三項完全一樣，只是順序反過來', { anchor: 'middle', fs: 14, c: GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 264', s);
          };
          h.querySelector('#ms').oninput = draw;
          draw();
        },
        caption: '兩個答案的<b>項完全一樣</b>，只有順序相反——照題目要求的那一種寫。',
        example: {
          q: '把 \\(x^3-2+5x\\) 分別用降冪、升冪排列。',
          steps: [
            '每一項的次方：\\(x^3\\) 是 3、\\(-2\\) 是 0、\\(5x\\) 是 1。',
            '降冪由大到小，升冪反過來。'
          ],
          ans: '降冪 \\(x^3+5x-2\\)；升冪 \\(-2+5x+x^3\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '次方一樣才是同類項，才能合併',
        points: [
          '<b>次方一樣</b>的項叫<b>同類項</b>，例如 \\(3x^2\\) 和 \\(-x^2\\)。',
          '合併同類項＝<b>係數相加，次方不變</b>。',
          '\\(x^2\\) 和 \\(x\\) <b>不是</b>同類項，不能合併。'
        ],
        formula: { label: '合併同類項<span class="pgref">課本 印 24</span>', tex: '3x^2+5x-x^2+2=2x^2+5x+2' },
        visual: (h) => {
          const term = (x, y, t, c, on) =>
            BOX(x - 44, y, 88, 42, { r: 10, fill: on ? 'rgba(37,99,235,.10)' : '#f6f9ff', stroke: on ? c : '#d6e0f2', sw: on ? 2.2 : 1.6 })
            + TX(x, y + 28, t, { anchor: 'middle', fs: 18, c: c });
          const X = [66, 162, 258, 354];
          const raw = k => TX(220, 30, '3x² ＋ 5x － x² ＋ 2', { anchor: 'middle', fs: 20, c: INK, op: k });
          SV.stepper(h, '0 0 440 288', [
            { t: '先把四項拆開，看每一項的<b>次方</b>。',
              d: () => raw(1)
                + term(X[0], 56, '3x²', VIO) + term(X[1], 56, '＋5x', BLU)
                + term(X[2], 56, '－x²', VIO) + term(X[3], 56, '＋2', AMB)
                + [2, 1, 2, 0].map((d, i) => TX(X[i], 118, '次方 ' + d, { anchor: 'middle', fs: 13, c: GREY })).join('') },
            { t: '<b>次方一樣</b>的圈在一起：3x² 和 －x² 都是 2 次，它們是同類項。',
              d: () => raw(1)
                + term(X[0], 56, '3x²', VIO, true) + term(X[1], 56, '＋5x', BLU)
                + term(X[2], 56, '－x²', VIO, true) + term(X[3], 56, '＋2', AMB)

                + TX(220, 146, '3x² 和 －x²：同類項', { anchor: 'middle', fs: 17, c: VIO })
                + TX(220, 172, '5x 只有一項、2 只有一項，各自單獨留著', { anchor: 'middle', fs: 14, c: GREY }) },
            { t: '合併：<b>係數相加</b>（3 ＋ (－1) ＝ 2），<b>次方不變</b>還是 x²。',
              d: () => TX(220, 196, '3x² － x² ＝ (3 － 1)x² ＝ 2x²', { anchor: 'middle', fs: 18, c: VIO })
                + BOX(88, 216, 264, 46, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 246, '2x² ＋ 5x ＋ 2', { anchor: 'middle', fs: 20, c: GRN })
                + TX(220, 280, '⚠ x² 和 x 次方不同，不能併成一項', { anchor: 'middle', fs: 14, c: RED }) }
          ]);
        },
        caption: '合併只動<b>係數</b>；次方一旦被改動，就是做錯了。',
        example: {
          q: '合併 \\(2x^2+7x-5x+4\\) 的同類項。',
          steps: [
            '\\(x^2\\) 只有一項，不動。',
            '\\(7x\\) 和 \\(-5x\\) 是同類項：\\(7-5=2\\)。'
          ],
          ans: '\\(2x^2+2x+4\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜次數、係數與排列（課本隨堂）',
        points: [
          '問「幾次多項式」看<b>最高次方</b>；問係數要<b>連負號一起講</b>。',
          '某一次方沒出現，那一項的係數就是 <b>0</b>，不是沒有。',

          '排列看題目要<b>降冪</b>還是<b>升冪</b>：由大到小，或由小到大。'
        ],
        formula: { label: '這一組在練', tex: '2x-1-3x^2\\;\\Rightarrow\\;-3x^2+2x-1' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 23', BLU, '判斷次數與係數、排列、合併',

              pItem('印3 ①', '-4.9x^2+5x+60', '二次') +
              pItem('印3 ②', 'x^3+\\tfrac{1}{2}x^2-3', '三次') +
              pText('印3 續', '\\(10x^2+4x^3-4-6x\\) 的<b>降冪</b>與<b>升冪</b>排列。',
                '降冪 \\(4x^3+10x^2-6x-4\\)<br>升冪 \\(-4-6x+10x^2+4x^3\\)') +
              pText('印4', '合併 \\(3x^2+5-4x+6x+7x^2-9\\) 的同類項。', '\\(10x^2+2x-4\\)')), '1-2');
        },
        caption: '課本印 3：判斷次數與係數、排列、合併。'
      },
      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜次數、係數與排列（習作）',
        points: [
          '問係數要<b>連負號一起講</b>；缺項的係數是 <b>0</b>。',
          '合併同類項先<b>照次方分欄</b>，再一欄一欄加。',
          '<b>這五題今天當堂寫完</b>，寫完自己對一次詳解。'
        ],
        formula: { label: '這一組在練', tex: '2x-1-3x^2\\;\\Rightarrow\\;-3x^2+2x-1' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 6、7', AMB, '',
              pItem('基礎1 ①', '2x^2+x-7', '二次') +
              pItem('基礎1 ②', '-5x^3+\\tfrac{4}{3}x', '三次') +
              pText('基礎2', '合併 \\(7x-x^2+4x-6+2x^2+4\\) 的同類項。', '\\(x^2+11x-2\\)') +
              pItem('基礎3 ①', '3x^2-4x+5-2x+7x^2-9', '\\(10x^2-6x-4\\)') +
              pItem('基礎3 ②', '9x^3+8x^2-7x+6-5x^3+4x^2+3', '\\(4x^3+12x^2-7x+9\\)')), '1-2');
        },
        caption: '習作印 6、7 五題，寫完自己對一次詳解。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '缺項補 0，直式才對得齊',
        points: [
          '\\(4x^2-2\\) 沒有一次項，直式要寫成 \\(4x^2+0x-2\\)。',

          '一行寫完的叫<b>橫式</b>，排成上下對齊的叫<b>直式</b>；補了 0，直式才對得齊。',
          '補 0 是<b>動作</b>，不用想通也做得到，先變成習慣。'
        ],
        formula: { label: '例<span class="pgref">課本 印 26 例 2</span>', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          const cx = [140, 232, 322];
          const rowT = (y, cells, col, k) => cells.map((s, i) =>
            TX(cx[i], y, s, { anchor: 'middle', fs: 18, c: col, op: k })).join('');
          const heads = k => cx.map((x, i) => TX(x, 44, ['x² 欄', 'x 欄', '常數欄'][i], { anchor: 'middle', fs: 13, c: GREY, op: k })).join('');
          SV.stepper(h, '0 0 440 280', [
            {
              t: '第一式照降冪寫進三個欄位', d: k =>
                heads(k) + rowT(84, ['5x²', '－6x', '－7'], INK, k)
            },
            {
              t: '第二式缺一次項 → 補上 0x，位置就對了', d: k =>
                rowT(128, ['4x²', '＋0x', '－2'], BLU, k) +
                `<circle cx="${cx[1]}" cy="122" r="${24 * k}" fill="none" stroke="${AMB}" stroke-width="2.4"/>` +
                SV.seg(96, 150, 366, 150, '#c3cddd', 2)
            },
            {
              t: '一欄一欄相加', d: k =>
                rowT(190, ['9x²', '－6x', '－9'], GRN, k) +
                TX(220, 238, '(5x² － 6x － 7) ＋ (4x² － 2) ＝ 9x² － 6x － 9', { anchor: 'middle', fs: 15, c: INK, op: k })
            }
          ]);
        },
        caption: '沒補 0 的話，一次項會跑去跟常數項相加，整排位移。',
        example: {
          q: '計算 \\((7x-5)+(9x^2-1)\\)。',
          steps: ['第一式補成 \\(0x^2+7x-5\\)', '一欄一欄相加'],
          ans: '\\(9x^2+7x-6\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜多項式的加法',
        points: [
          '把同次方的<b>圈在一起</b>再相加，缺的那一欄記得補 \\(0\\)。',
          '印6 那兩題的項是<b>打散的</b>，先降冪排好再算。',
          '習作只有一題，但要<b>把分欄的過程寫出來</b>，不要只寫答案。'
        ],
        formula: { label: '這一組在練', tex: '\\begin{array}{c}(x^2+3x-5)+(7x^2-7x-7)\\\\=8x^2-4x-12\\end{array}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 25、26', BLU, '計算下列各式',
              pItem('印5 ①', '(x^2+3x-5)+(7x^2-7x-7)', '\\(8x^2-4x-12\\)') +
              pItem('印5 ②', '(4+3x^2+x)+(3x^2-2x-4)', '\\(6x^2-x\\)') +
              pItem('印6 ①', '(-x^2+3x)+(6x^2-4+2x)', '\\(5x^2+5x-4\\)') +
              pItem('印6 ②', '(x^3-6-3x)+(-4x^2+5x-1)', '\\(x^3-4x^2+2x-7\\)')) +
            pCard('習作・基礎練習', '印 7', AMB, '寫出分欄過程',
              pItem('基礎4 ①', '(3x^2+x-6)+(2x^2-5x+3)', '\\(5x^2-4x-3\\)')), '1-2');
        },
        caption: '課本印 5、6 與習作印 6。<b>習作基礎 4 的第 ① 小題今天寫完</b>。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '減號要發給括號裡每一項',
        points: [
          '減一個多項式，等於<b>加上它的相反</b>：每一項都變號。',
          '<b>只變第一項</b>是本節最常見的錯，答案會整個不同。',
          '先在每一項上面<b>畫變號記號</b>，畫完再算。'
        ],
        formula: { label: '一招<span class="pgref">課本 印 28</span>', tex: '\\begin{array}{c}P-(ax^2+bx+c)\\\\=P+(-a)x^2+(-b)x+(-c)\\end{array}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>變號變到第 <span class="ival nv">2</span> 項</label>
              <input type="range" class="ns" min="1" max="2" step="1" value="2">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value;
            h.querySelector('.nv').textContent = n;
            const ok = n === 2;
            const sec = ok ? '－x² ＋ 4x' : '－x² － 4x';
            const res = ok ? '2x² － x ＋ 7' : '2x² － 9x ＋ 7';
            h.querySelector('.fig').innerHTML = svg('0 0 440 262', `
              ${TX(220, 40, '(3x² － 5x ＋ 7) － (x² － 4x)', { anchor: 'middle', fs: 19, c: INK })}
              ${TX(220, 86, '減式變號後：', { anchor: 'middle', fs: 14, c: GREY })}
              ${BOX(112, 100, 216, 46, { r: 12, fill: ok ? '#eef7f2' : '#fdeef2', stroke: ok ? GRN : RED })}
              ${TX(220, 130, sec, { anchor: 'middle', fs: 19, c: ok ? GRN : RED })}
              ${TX(220, 178, '合併後：', { anchor: 'middle', fs: 14, c: GREY })}
              ${BOX(96, 192, 248, 48, { r: 12, fill: '#fff', stroke: ok ? GRN : RED })}
              ${TX(220, 224, res, { anchor: 'middle', fs: 20, c: ok ? GRN : RED })}
              ${TX(220, 258, ok ? '✓ 兩項都變號了' : '✗ 只變了第一項', { anchor: 'middle', fs: 14, c: ok ? GRN : RED })}
            `);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '同一題，變號變不變得完整，中間那一項就差很多。',
        example: {
          q: '計算 \\((3x^2-5x+7)-(x^2-4x)\\)。',
          steps: ['減式每一項變號：\\(-x^2+4x\\)', '再合併同類項'],
          ans: '\\(2x^2-x+7\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜多項式的減法',
        points: [
          '動筆前先在<b>減式每一項上面畫變號記號</b>，畫完再算。',
          '習作基礎 5 是<b>反過來用</b>：要補的那一式＝答案減去已知的那一式。',
          '這一頁是本節最容易錯的地方，<b>每一題都要寫過程</b>。'
        ],
        formula: { label: '這一組在練', tex: '\\begin{array}{c}P-(ax^2+bx+c)\\\\=P+(-a)x^2+(-b)x+(-c)\\end{array}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 28', BLU, '計算下列各式（點任一題看詳解）',
              pItem('印8 ①', '(x^3-7+x-x^2)-(x^3+2x^2-x+3)', '\\(-3x^2+2x-10\\)') +
              pItem('印8 ②', '(4x^3+x-7)-(3x^2-1+5x)', '\\(4x^3-3x^2-4x-6\\)')) +
            pCard('習作・基礎練習', '印 7、8', AMB, '減法與反推',
              pItem('基礎4 ②', '(7x^2-x-3)-(5x^2-x-4)', '\\(2x^2+1\\)') +
              pItem('基礎4 ③', '(5x^3-x^2+8x+9)-(9-2x^2+4x^3)', '\\(x^3+x^2+8x\\)')), '1-2');
        },
        caption: '課本印 8 與習作印 7：減法先變號，再合併。'
      },
      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜減法反推',
        points: [
          '動筆前先在<b>減式每一項上面畫變號記號</b>，畫完再算。',
          '習作基礎 5 是<b>反過來用</b>：要補的那一式＝答案減去已知的那一式。',
          '這一頁是本節最容易錯的地方，<b>每一題都要寫過程</b>。'
        ],
        formula: { label: '這一組在練', tex: '\\begin{array}{c}P-(ax^2+bx+c)\\\\=P+(-a)x^2+(-b)x+(-c)\\end{array}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 7、8', AMB, '減法與反推',
              pItem('基礎5 ①', '(4+5x-x^2)+(\\quad)=2x^2-x+6', '\\(3x^2-6x+2\\)') +
              pItem('基礎5 ②', '(\\quad)-(x^2+5x-7)=2x^3-8x^2+3x', '\\(2x^3-7x^2+8x-7\\)')), '1-2');
        },
        caption: '習作基礎 5 兩題是反推：先想「誰減誰」。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '相加後是 0，表示每一個係數都是 0',
        points: [
          '先相加、<b>同次方合併</b>：得到 \\((a+3)x^2+(-4+b)x+(1+c)\\)。',
          '「是 \\(0\\)」表示 <b>\\(x\\) 代什麼都等於 \\(0\\)</b>——只有每一項係數都是 \\(0\\) 才辦得到。',
          '所以<b>一個次方列一個式子</b>：\\(a+3=0\\)、\\(-4+b=0\\)、\\(1+c=0\\)。'
        ],
        formula: { label: '係數各自為零<span class="pgref">課本 印 27</span>', tex: '\\text{和}=0\\ \\Rightarrow\\ \\text{每項係數}=0' },
        visual: (h) => {
          const cx = [128, 232, 336];
          const head = () => cx.map((x, i) => TX(x, 48, ['x² 項', 'x 項', '常數項'][i], { anchor: 'middle', fs: 14, c: GREY })).join('');
          const row = (y, cells, col, fs) => cells.map((t, i) =>
            TX(cx[i], y, t, { anchor: 'middle', fs: fs || 18, c: col })).join('');
          SV.stepper(h, '0 0 440 262', [
            { t: '先把兩個多項式<b>同次方對齊</b>相加。',
              d: () => TX(220, 26, '(ax² － 4x ＋ 1) ＋ (3x² ＋ bx ＋ c)', { anchor: 'middle', fs: 17, c: INK })
                + head() + row(82, ['ax²', '－4x', '＋1'], BLU) + row(116, ['＋3x²', '＋bx', '＋c'], VIO)
                + SV.seg(90, 132, 374, 132, '#c3cddd', 1.8)
                + row(164, ['(a＋3)x²', '(－4＋b)x', '(1＋c)'], INK, 16) },
            { t: '題目說<b>結果是 0</b>：不管 x 代什麼都要是 0。',
              d: () => head() + row(82, ['(a＋3)x²', '(－4＋b)x', '(1＋c)'], INK, 16)
                + TX(220, 128, '＝ 0', { anchor: 'middle', fs: 22, c: RED })
                + BOX(52, 152, 336, 50, { r: 12, fill: 'rgba(225,29,72,.08)', stroke: RED, sw: 2.2 })
                + TX(220, 174, '只有「每一項係數都是 0」', { anchor: 'middle', fs: 17, c: RED })
                + TX(220, 196, '才可能不管 x 是多少都等於 0', { anchor: 'middle', fs: 15, c: RED }) },
            { t: '<b>一個次方列一個式子</b>，三個各自解。',
              d: () => head()
                + row(74, ['a ＋ 3 ＝ 0', '－4 ＋ b ＝ 0', '1 ＋ c ＝ 0'], INK, 15)
                + cx.map(x => TX(x, 108, '↓', { anchor: 'middle', fs: 16, c: GREY })).join('')
                + BOX(52, 124, 336, 52, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + row(158, ['a ＝ －3', 'b ＝ 4', 'c ＝ －1'], GRN, 18)
                + TX(220, 214, '驗算：(－3x²－4x＋1)＋(3x²＋4x－1) ＝ 0 ✓', { anchor: 'middle', fs: 14, c: GREY }) }
          ], { acc: false });
        },
        caption: '同一招也用在「填入適當的多項式」：<b>比對同次方的係數</b>，一個次方一個式子。',
        example: {
          q: '\\(2x^2+px-5\\) 與 \\(qx^2-3x+r\\) 相加後為 \\(0\\)，求 \\(p\\)、\\(q\\)、\\(r\\)。',
          steps: [
            '合併：\\((2+q)x^2+(p-3)x+(-5+r)\\)。',
            '各項係數為 \\(0\\)：\\(2+q=0\\)、\\(p-3=0\\)、\\(-5+r=0\\)。'
          ],
          ans: '\\(p=3\\)、\\(q=-2\\)、\\(r=5\\)'
        }
      },
      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>排序、變號、合併</b>。',
          '每一個都有一個筆尖上的動作可以擋。',
          '圈次方、畫變號記號、看次方再合併。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 30 重點整理</span>', tex: 'x^2+x\\ne 2x^2' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '照係數大小排', bad: '\\(2x-1-3x^2\\) 排成 \\(2x-1-3x^2\\)', good: '看次方排：\\(-3x^2+2x-1\\)' },
            { tag: '減號只發給第一項', bad: '\\(-(x^2-4x)=-x^2-4x\\)', good: '\\(-(x^2-4x)=-x^2+4x\\)' },
            { tag: '不同次方硬合併', bad: '\\(x^2+x=2x^2\\)', good: '次方不同不能合併，維持 \\(x^2+x\\)' }
          ]);
          MJ(h);
        },
        caption: '常數項也是同類項（零次），\\(5\\) 和 \\(1\\) 要合併成 \\(6\\)，別漏。',
        example: {
          q: '計算 \\((x^3-7+x-x^2)-(x^3+2x^2-x+3)\\)。',
          steps: ['先把兩式都降冪排好', '減式四項全部變號再合併'],
          ans: '\\(-3x^2+2x-10\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜加減混合',
        points: [
          '加減混合<b>從左邊做到右邊</b>，每遇到一個減號就先變號。',
          '基礎 4 的 ④ 有<b>兩層括號</b>，先把裡面那層算完再減。',
          '下面三題<b>行有餘力才做</b>，今天做不完不要緊。'
        ],
        formula: { label: '兩層括號先算裡面', tex: 'A-[B+C]=A-(B+C)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 7', AMB, '',
              pItem('基礎4 ④', '(2-4x-3x^2)-[(2x^2-5x+7)+(x^2+x-3)]', '\\(-6x^2-2\\)')) +
            pCard('課本・隨堂練習', '印 27、29', BLU, '',
              pText('印7 例3', '\\(ax^2-4x+1\\) 與 \\(3x^2+bx+c\\) 相加為 \\(0\\)，求係數。', '\\(a=-3,b=4,c=-1\\)') +
              pItem('印9 ①', '(6x^3+2x)+(x^2+4x+5)+(3x^2+7)', '\\(6x^3+4x^2+6x+12\\)') +
              pItem('印9 ②', '(2x^2+5x-1)-(3x^2-5x)+(4x^2-x+1)', '\\(3x^2+9x\\)')), '1-2');
        },
        caption: '習作基礎 4 ④與課本印 7、9：混合題先把括號處理完再合併。'
      },
      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '練習｜精熟（行有餘力）',
        points: [
          '加減混合<b>從左邊做到右邊</b>，每遇到一個減號就先變號。',
          '基礎 4 的 ④ 有<b>兩層括號</b>，先把裡面那層算完再減。',
          '下面三題<b>行有餘力才做</b>，今天做不完不要緊。'
        ],
        formula: { label: '兩層括號先算裡面', tex: 'A-[B+C]=A-(B+C)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 9', GRN, '精熟練習，做不完不追',
              pText('精熟1', '\\(A\\) 為單項式，\\(A-B\\) 的二次項係數為 \\(7\\)，求 \\(A\\)。', '\\(A=5x^2\\)') +
              pText('精熟2', '\\(A+B-C\\) 為常數多項式，求 \\(A\\)（三式見習作）。', '\\(A=5x^2-x-6\\)')), '1-2');
        },
        caption: '兩題標「進階」，做不完不追。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '係數乘係數，字母乘字母',
        points: [
          '\\(2x^2\\cdot 5x\\)：先算 \\(2\\times5\\)，再算 \\(x^2\\cdot x\\)。',
          '把 \\(x^2\\) 寫開成 \\(x\\cdot x\\)，<b>數因數比背指數律穩</b>。',
          '\\((5x)^2\\) 裡面有<b>兩個 \\(5x\\)</b>，不是只把 5 平方。'
        ],
        formula: { label: '例<span class="pgref">課本 印 34</span>', tex: '2x^2\\cdot 5x=10x^3\\qquad (5x)^2=25x^2' },
        visual: (h) => {
          const L = (i, s, col, k) => TX(58, 78 + i * 40, s, { fs: 18, c: col, op: k });
          SV.stepper(h, '0 0 440 282', [
            {
              t: '把係數和字母分開算', d: k =>
                TX(220, 40, '2x² · 5x', { anchor: 'middle', fs: 21, c: C }) +
                L(0, '係數：2 × 5 ＝ 10', BLU, k)
            },
            {
              t: '字母寫開來數因數', d: k =>
                L(1, '字母：x² · x ＝ x · x · x', AMB, k) +
                L(2, '三個 x 相乘 ＝ x³', AMB, k > .5 ? (k - .5) * 2 : 0)
            },
            {
              t: '合起來就是答案', d: k =>
                L(3, '2x² · 5x ＝ 10x³', GRN, k)
            },
            {
              t: '小心：(5x)² 裡面有兩個 5x', d: k =>
                `<rect x="0" y="0" width="440" height="282" fill="#fff"/>` +
                TX(220, 44, '(5x)²', { anchor: 'middle', fs: 22, c: C }) +
                TX(220, 92, '＝ 5x · 5x', { anchor: 'middle', fs: 19, c: INK, op: k }) +
                TX(220, 136, '＝ 25x²', { anchor: 'middle', fs: 22, c: GRN, op: k }) +
                BOX(88, 170, 264, 52, { r: 12, fill: '#fdeef2', stroke: RED, op: k }) +
                TX(220, 202, '✗ 寫成 25x 就是只平方了係數', { anchor: 'middle', fs: 15, c: RED, op: k })
            }
          ]);
        },
        caption: '只要肯把 \\(x^2\\) 寫成 \\(x\\cdot x\\)，這一頁的錯就不會發生。',
        example: {
          q: '計算 \\(3x\\cdot(2x+6)\\)。',
          steps: ['\\(3x\\) 乘第一項：\\(6x^2\\)', '\\(3x\\) 乘第二項：\\(18x\\)'],
          ans: '\\(6x^2+18x\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜單項式的乘法（課本隨堂）',
        points: [
          '先算<b>係數乘係數</b>，再算<b>字母乘字母</b>，兩步分開做。',
          '負號自己算一次：兩個負號相乘會變正的。',
          '括號前是單項式時，<b>括號裡每一項都要乘到</b>。'
        ],
        formula: { label: '這一組在練', tex: '2x^2\\cdot 5x=10x^3' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 33、34', BLU, '計算下列各式',
              pItem('印1 ①', '4(5x^2-6x+7)', '\\(20x^2-24x+28\\)') +
              pItem('印2 ①', '(-x)\\cdot 7x^2', '\\(-7x^3\\)') +
              pItem('印2 ②', '(-6x^2)(-5x)', '\\(30x^3\\)') +
              pItem('印2 ③', '(-4x)^2', '\\(16x^2\\)')), '1-3');
        },
        caption: '課本印 1、2：先算係數、再算字母，兩步分開做。'
      },
      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜單項式的乘法（習作）',
        points: [
          '先算<b>係數乘係數</b>，再算<b>字母乘字母</b>，兩步分開做。',
          '負號自己算一次：兩個負號相乘會變正的。',
          '括號前是單項式時，<b>括號裡每一項都要乘到</b>。'
        ],
        formula: { label: '這一組在練', tex: '2x^2\\cdot 5x=10x^3' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 33、34', BLU, '計算下列各式',
              pItem('印2 例1', '5x(3x^2-x+1)', '\\(15x^3-5x^2+5x\\)')) +
            pCard('習作・基礎練習', '印 10', AMB, '寫出係數與字母兩步',
              pItem('基礎1 ①', '3x^2\\cdot(-\\tfrac{1}{2}x)', '\\(-\\tfrac{3}{2}x^3\\)') +
              pItem('基礎1 ②', '2x(5x-3)', '\\(10x^2-6x\\)')), '1-3');
        },
        caption: '課本印 2 例 1 與習作印 10：括號前是單項式時，括號裡每一項都要乘到。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '四格填滿，就沒有漏乘',
        points: [
          '左邊兩項、上面兩項，交出<b>四個乘積</b>。',
          '填完看<b>還有哪一格空著</b>，這就是檢查漏乘的方法。',
          '最後把同類項 \\(3x\\) 和 \\(2x\\) 合併成 \\(5x\\)。'
        ],
        formula: { label: '例<span class="pgref">課本 印 35</span>', tex: '(x+3)(x+2)=x^2+5x+6' },
        visual: (h) => {
          const x0 = 128, y0 = 62, w = 108, hh = 66;
          const grid = `${SQFRAME(x0, y0, w * 2, hh * 2, C)}
            ${SV.seg(x0 + w, y0, x0 + w, y0 + hh * 2, '#9fb3d9', 1.6)}
            ${SV.seg(x0, y0 + hh, x0 + w * 2, y0 + hh, '#9fb3d9', 1.6)}
            ${TX(x0 + w / 2, y0 - 14, 'x', { anchor: 'middle', fs: 16, c: GREY })}
            ${TX(x0 + w * 1.5, y0 - 14, '＋2', { anchor: 'middle', fs: 16, c: GREY })}
            ${TX(x0 - 14, y0 + hh / 2 + 6, 'x', { anchor: 'end', fs: 16, c: GREY })}
            ${TX(x0 - 14, y0 + hh * 1.5 + 6, '＋3', { anchor: 'end', fs: 16, c: GREY })}`;
          const cell = (cx, cy, col, s, k) =>
            `<rect x="${cx}" y="${cy}" width="${w}" height="${hh}" fill="${col}" opacity="${0.12 + 0.22 * k}"/>` +
            TX(cx + w / 2, cy + hh / 2 + 7, s, { anchor: 'middle', fs: 19, c: col, op: k });
          SV.stepper(h, '0 0 440 288', [
            { t: 'x 乘 x', d: k => grid + cell(x0, y0, BLU, 'x²', k) },
            { t: 'x 乘 2', d: k => cell(x0 + w, y0, GRN, '2x', k) },
            { t: '3 乘 x', d: k => cell(x0, y0 + hh, AMB, '3x', k) },
            {
              t: '3 乘 2，四格填滿後合併同類項', d: k => cell(x0 + w, y0 + hh, VIO, '6', k) +
                TX(220, 246, 'x² ＋ 2x ＋ 3x ＋ 6', { anchor: 'middle', fs: 16, c: INK, op: k }) +
                TX(220, 274, '＝ x² ＋ 5x ＋ 6', { anchor: 'middle', fs: 18, c: GRN, op: k > .5 ? (k - .5) * 2 : 0 })
            }
          ]);
        },
        caption: '四格法的用處不是算得快，是<b>看得出哪一格還空著</b>。',
        example: {
          q: '用四格算 \\((x+4)(x+1)\\)。',
          steps: ['四格分別是 \\(x^2\\)、\\(x\\)、\\(4x\\)、\\(4\\)', '合併中間兩格'],
          ans: '\\(x^2+5x+4\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜多項式乘多項式（課本隨堂）',
        points: [
          '每一項都要乘到對面，<b>算完數項數</b>再合併同類項。',
          '習作 ⑦⑧ 可以直接套 1-1 的乘法公式，比硬乘快。',
          '六題都<b>抄到本子上</b>，過程要看得出四個乘積。'
        ],
        formula: { label: '這一組在練', tex: '(x+3)(x+2)=x^2+5x+6' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 35', BLU, '計算下列各式',
              pItem('印3 ①', '(2x+1)(3x-1)', '\\(6x^2+x-1\\)') +
              pItem('印3 ②', '(3x-4)(3x-2)', '\\(9x^2-18x+8\\)')) +
            pCard('習作・基礎練習', '印 10', AMB, '六題，合併同類項後作答',
              pItem('基礎1 ③', '(2x+7)(3x-1)', '\\(6x^2+19x-7\\)') +
              pItem('基礎1 ④', '(5-2x)(4x+3)', '\\(-8x^2+14x+15\\)')), '1-3');
        },
        caption: '課本印 3 與習作前兩題：四塊都要，算完數項數。'
      },
      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜多項式乘多項式（習作後四題）',
        points: [
          '每一項都要乘到對面，<b>算完數項數</b>再合併同類項。',
          '習作 ⑦⑧ 可以直接套 1-1 的乘法公式，比硬乘快。',
          '六題都<b>抄到本子上</b>，過程要看得出四個乘積。'
        ],
        formula: { label: '這一組在練', tex: '(x+3)(x+2)=x^2+5x+6' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 10', AMB, '六題，合併同類項後作答',
              pItem('基礎1 ⑤', '(2x^2+5x-3)(x+2)', '\\(2x^3+9x^2+7x-6\\)') +
              pItem('基礎1 ⑥', '(x^2-7)(3x+4)', '\\(3x^3+4x^2-21x-28\\)') +
              pItem('基礎1 ⑦', '(3x-7)^2', '\\(9x^2-42x+49\\)') +
              pItem('基礎1 ⑧', '(3x^2+2)(3x^2-2)', '\\(9x^4-4\\)')), '1-3');
        },
        caption: '習作印 10 的 ⑤～⑧：合併同類項後再作答。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '直式的用處是對齊，不是另一套乘法',
        points: [
          '直式只做三件事：<b>降冪、缺項留位、同類項對齊</b>。',
          '橫式還會漏乘的時候，不要同時練兩種版面。',
          '排直式前先確認<b>每一項的位置</b>，缺的寫 \\(0x\\)。'
        ],
        formula: { label: '例<span class="pgref">課本 印 36–37</span>', tex: '(x+3)(2x-1)=2x^2+5x-3' },
        visual: (h) => {
          const cx = [150, 244, 336];
          const rowT = (y, cells, col, k) => cells.map((s, i) =>
            s ? TX(cx[i], y, s, { anchor: 'middle', fs: 18, c: col, op: k }) : '').join('');
          SV.stepper(h, '0 0 440 280', [
            {
              t: '先用橫式乘出四項', d: k =>
                TX(220, 40, '(x ＋ 3)(2x － 1)', { anchor: 'middle', fs: 20, c: C }) +
                TX(220, 76, '2x² － x ＋ 6x － 3', { anchor: 'middle', fs: 18, c: INK, op: k })
            },
            {
              t: '把同次方的排進同一欄', d: k =>
                cx.map((x, i) => TX(x, 112, ['x² 欄', 'x 欄', '常數欄'][i], { anchor: 'middle', fs: 13, c: GREY, op: k })).join('') +
                rowT(150, ['2x²', '－x', ''], BLU, k) +
                rowT(186, ['', '＋6x', '－3'], BLU, k) +
                SV.seg(104, 200, 382, 200, '#c3cddd', 2)
            },
            {
              t: '一欄一欄合併', d: k =>
                rowT(234, ['2x²', '＋5x', '－3'], GRN, k) +
                TX(220, 268, '空著的欄位代表那一項是 0，不是忘了寫', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            }
          ]);
        },
        caption: '直式沒有新的乘法規則，它只是把同類項排在同一欄。',
        example: {
          q: '計算 \\((x+3)(2x-1)\\)。',
          steps: ['四項是 \\(2x^2\\)、\\(-x\\)、\\(6x\\)、\\(-3\\)', '合併中間兩項'],
          ans: '\\(2x^2+5x-3\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '缺的邊自己補出來：先看成一個長方形',
        points: [
          '圖上<b>沒標的邊</b>要自己組合：左右兩側的高 \\(=x+(2x-1)=3x-1\\)。',
          '<b>周長</b>：凸出去的兩段推到外框，就等於<b>外框長方形</b>的周長。',
          '<b>面積</b>：先當成整個長方形，再<b>扣掉</b>上面兩個缺口。'
        ],
        formula: { label: '先補成長方形<span class="pgref">課本 印 39</span>', tex: '(3x+2)(3x-1)-2x^2' },
        visual: (h) => {
          const X0 = 118, Y0 = 44, W = 208, H = 150, nW = 56, nH = 58;
          const shape = [[X0 + nW, Y0], [X0 + W - nW, Y0], [X0 + W - nW, Y0 + nH], [X0 + W, Y0 + nH],
                         [X0 + W, Y0 + H], [X0, Y0 + H], [X0, Y0 + nH], [X0 + nW, Y0 + nH]];
          const body = (fill) => SV.poly(shape, fill || 'rgba(5,150,105,.14)', GRN, 2.4);
          const frame = (dash) => BOX(X0, Y0, W, H, { r: 0, fill: 'none', stroke: AMB, sw: 2.2, dash: dash || '7 5' });
          const lab = () => TX(X0 + nW / 2, Y0 + 34, 'x', { anchor: 'middle', fs: 15, c: INK })
            + TX(X0 + W - nW / 2, Y0 + 34, 'x', { anchor: 'middle', fs: 15, c: INK })
            + TX(X0 - 16, Y0 + nH + 16, 'x', { anchor: 'middle', fs: 15, c: INK })
            + TX(X0 + W + 16, Y0 + nH + 16, 'x', { anchor: 'middle', fs: 15, c: INK })
            + TX(X0 + W + 30, Y0 + nH + 62, '2x－1', { anchor: 'middle', fs: 15, c: INK })
            + TX(X0 + W / 2, Y0 + H + 22, '3x＋2', { anchor: 'middle', fs: 16, c: INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '圖上標了四個 x、下段 2x－1、整個寬 3x＋2。<b>左右兩側的高沒有標</b>。',
              d: () => body() + lab()
                + TX(60, Y0 + 84, '?', { anchor: 'middle', fs: 26, c: RED })
                + TX(220, 244, '要算周長，得先知道左右兩側有多高', { anchor: 'middle', fs: 15, c: RED }) },
            { t: '補出來：左右兩側的高 ＝ x ＋ (2x－1) ＝ <b>3x－1</b>。',
              d: () => body() + lab()
                + SV.seg(X0 - 34, Y0, X0 - 34, Y0 + H, RED, 2.4)
                + TX(50, Y0 + 80, '3x－1', { anchor: 'middle', fs: 16, c: RED })
                + TX(220, 244, 'x ＋ (2x－1) ＝ 3x－1', { anchor: 'middle', fs: 17, c: RED }) },
            { t: '<b>周長</b>：把凸出去的兩段推到外框——周長就等於<b>外框長方形</b>的周長。',
              d: () => body('rgba(5,150,105,.08)') + frame() + lab()
                + TX(220, 232, '周長 ＝ (3x＋2)×2 ＋ (3x－1)×2', { anchor: 'middle', fs: 17, c: AMB })
                + TX(220, 258, '＝ 12x ＋ 2', { anchor: 'middle', fs: 19, c: GRN }) },
            { t: '<b>面積</b>：先當成整個長方形，再扣掉上面<b>兩個 x·x 的缺口</b>。',
              d: () => frame('') + body('rgba(5,150,105,.14)')
                + BOX(X0, Y0, nW, nH, { r: 0, fill: 'rgba(225,29,72,.14)', stroke: RED, sw: 2 })
                + BOX(X0 + W - nW, Y0, nW, nH, { r: 0, fill: 'rgba(225,29,72,.14)', stroke: RED, sw: 2 })
                + TX(220, 226, '(3x＋2)(3x－1) － 2·x·x', { anchor: 'middle', fs: 17, c: INK })
                + TX(220, 254, '＝ 9x² ＋ 3x － 2 － 2x² ＝ 7x² ＋ 3x － 2', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '⚠ 兩個缺口是 <b>x 乘 x</b>，不是 \\(2x\\)——它們是<b>兩塊面積</b>，要各扣一次。',
        example: {
          q: '同一個圖，若上面兩個缺口各是 \\(x\\) 寬 \\(x\\) 高，整個寬 \\(2x+3\\)、下段高 \\(3x-1\\)，求周長。',
          steps: [
            '左右兩側的高 \\(=x+(3x-1)=4x-1\\)。',
            '周長 ＝ 外框：\\((2x+3)\\times2+(4x-1)\\times2\\)。'
          ],
          ans: '\\(12x+4\\)'
        }
      },
      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜用多項式表示周長與面積',
        points: [
          '圖形題的作法固定：<b>先把每一段邊長用 x 寫出來</b>，再套公式。',
          '缺角的圖形用<b>大長方形減掉缺口</b>，不要硬拆成很多塊。',
          '答案是多項式，<b>要合併同類項再作答</b>。'
        ],
        formula: { label: '這一組在練', tex: '\\text{面積}=(3x+2)(3x-1)-2x^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 39', BLU, '看課本的圖作答',
              pText('印7 例5', '求凸形圖案的周長與面積（以 \\(x\\) 的多項式表示）。', '見課本')) +
            pCard('習作・基礎練習', '印 11', AMB, '看習作的圖作答',
              pText('基礎2', '求凸字形圖案的<b>周長</b>。（以 \\(x\\) 的多項式表示）', '\\(12x+2\\)') +
              pText('基礎2 續', '承上，求該凸字形圖案的<b>面積</b>。', '\\(7x^2+3x-2\\)') +
              pText('基礎3', '國旗手稿如圖，求塗上<b>紅色部分</b>的面積。（以 \\(x\\) 的多項式表示）', '\\(54x^2-39x+3\\)')), '1-3');
        },
        caption: '課本印 7 與習作印 10。<b>習作這三小題今天當堂寫完</b>，圖要看習作上的。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '先把括號裡的乘算完，再減',
        points: [
          '看到<b>先乘後減</b>：括號裡的乘法先做完，展開後才動減號。',
          '減號一樣要<b>發給括號裡每一項</b>，這點和 1-2 完全一樣。'
        ],
        formula: { label: '把 1-2 和 1-3 接起來', tex: '(x+2)(x+3)-(x^2+1)=5x+5' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            { t: '先看結構：<b>前面是乘、後面是減</b>，順序不能對調。',
              d: () => TX(220, 44, '(x ＋ 2)(x ＋ 3) － (x² ＋ 1)', { anchor: 'middle', fs: 20, c: INK })
                + BOX(34, 66, 196, 40, { r: 10, fill: 'rgba(124,58,237,.10)', stroke: VIO, sw: 2 })
                + TX(132, 93, '① 先算這個乘法', { anchor: 'middle', fs: 15, c: VIO })
                + BOX(246, 66, 160, 40, { r: 10, fill: 'rgba(225,29,72,.07)', stroke: RED, sw: 2 })
                + TX(326, 93, '② 再處理減號', { anchor: 'middle', fs: 15, c: RED }) },
            { t: '先乘：四格填滿 → \\(x^2+5x+6\\)。',
              d: () => TX(220, 142, '(x ＋ 2)(x ＋ 3) ＝ x² ＋ 3x ＋ 2x ＋ 6', { anchor: 'middle', fs: 17, c: VIO })
                + TX(220, 172, '＝ x² ＋ 5x ＋ 6', { anchor: 'middle', fs: 19, c: VIO }) },
            { t: '再減：減號<b>發給括號裡每一項</b>，然後合併同類項。',
              d: () => TX(220, 208, 'x² ＋ 5x ＋ 6 － x² － 1', { anchor: 'middle', fs: 18, c: INK })
                + BOX(120, 224, 200, 44, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 253, '＝ 5x ＋ 5', { anchor: 'middle', fs: 20, c: GRN }) }
          ]);
        },
        caption: '這一題把 1-2 的<b>減號變號</b>和 1-3 的<b>乘法</b>接在一起，兩邊都要對。',
        example: {
          q: '計算 \\((x+1)(x+4)-(x^2+2)\\)。',
          steps: [
            '先乘：\\((x+1)(x+4)=x^2+5x+4\\)。',
            '再減：\\(x^2+5x+4-x^2-2\\)。'
          ],
          ans: '\\(5x+2\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '除法就是問「乘上什麼會變成它」',
        points: [
          '\\(3\\times\\square=12\\) 和 \\(12\\div3\\) 是同一件事。',
          '\\(20x^2\\div 4x\\)：想「\\(4x\\) 乘上什麼會得到 \\(20x^2\\)」。',
          '單項式除法還要用猜的，長除法只會更亂。'
        ],
        formula: { label: '乘除互逆<span class="pgref">課本 印 41</span>', tex: '20x^2\\div 4x=5x\\;\\Longleftrightarrow\\;4x\\cdot 5x=20x^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>被除式係數 <span class="ival kv">20</span></label>
              <input type="range" class="ks" min="2" max="9" step="1" value="5">
            </div></div>`;
          const draw = () => {
            const q = +h.querySelector('.ks').value, n = 4 * q;
            h.querySelector('.kv').textContent = n;
            h.querySelector('.fig').innerHTML = svg('0 0 440 264', `
              ${TX(220, 44, `${n}x² ÷ 4x ＝ ?`, { anchor: 'middle', fs: 21, c: C })}
              ${TX(220, 90, '換個問法：', { anchor: 'middle', fs: 14, c: GREY })}
              ${BOX(84, 106, 272, 54, { r: 12, fill: '#f6f9ff', stroke: BLU })}
              ${TX(220, 140, `4x × ? ＝ ${n}x²`, { anchor: 'middle', fs: 20, c: BLU })}
              ${TX(220, 188, `係數：4 × ${q} ＝ ${n}　　字母：x · x ＝ x²`, { anchor: 'middle', fs: 15, c: AMB })}
              ${BOX(120, 206, 200, 46, { r: 12, fill: '#eef7f2', stroke: GRN })}
              ${TX(220, 236, `答案是 ${q}x`, { anchor: 'middle', fs: 19, c: GRN })}
            `);
          };
          h.querySelector('.ks').oninput = draw;
          draw();
        },
        caption: '把除法翻譯成「缺哪個乘數」，長除法的每一步都用得到這句話。',
        example: {
          q: '計算 \\((15x^2-6x)\\div 3x\\)。',
          steps: ['\\(3x\\) 乘什麼得 \\(15x^2\\)？得 \\(5x\\)', '\\(3x\\) 乘什麼得 \\(-6x\\)？得 \\(-2\\)'],
          ans: '\\(5x-2\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '一回合四個動作：試商、乘回、相減、判斷',
        points: [
          '<b>試商</b>只看兩邊最高次項：\\(x\\) 乘什麼會得到 \\(2x^2\\)？',
          '<b>乘回</b>要乘完整個除式，<b>相減</b>要整列變號。',
          '<b>判斷</b>：最高項還消得掉就繼續，消不掉就停。'
        ],
        formula: { label: '第一題<span class="pgref">課本 印 42–43</span>', tex: '(2x^2+6x)\\div(x+3)=2x' },
        visual: (h) => {
          const bx = 150, by = 96;
          const frame = `${SV.seg(bx - 12, by - 26, bx + 190, by - 26, INK, 2)}
            ${SV.seg(bx - 12, by - 26, bx - 12, by + 96, INK, 2)}
            ${TX(bx - 24, by + 4, 'x ＋ 3', { anchor: 'end', fs: 17, c: INK })}
            ${TX(bx + 84, by + 4, '2x² ＋ 6x', { anchor: 'middle', fs: 17, c: INK })}`;
          SV.stepper(h, '0 0 440 288', [
            {
              t: '試商：x 乘什麼會得到 2x²？答 2x', d: k =>
                frame + TX(bx + 84, by - 40, '2x', { anchor: 'middle', fs: 19, c: BLU, op: k })
            },
            {
              t: '乘回：2x 要乘完整個 (x＋3)', d: k =>
                TX(bx + 84, by + 40, '2x² ＋ 6x', { anchor: 'middle', fs: 17, c: AMB, op: k }) +
                SV.seg(bx + 2, by + 52, bx + 166, by + 52, '#c3cddd', 1.8)
            },
            {
              t: '整列相減：整列都要變號', d: k =>
                TX(bx + 84, by + 84, '0', { anchor: 'middle', fs: 19, c: GRN, op: k }) +
                TX(bx - 24, by + 44, '－)', { anchor: 'end', fs: 16, c: RED, op: k })
            },
            {
              t: '判斷：沒有東西可以再消，結束', d: k =>
                BOX(84, 216, 272, 56, { r: 12, fill: '#eef7f2', stroke: GRN, op: k }) +
                TX(220, 240, '商 ＝ 2x　餘 ＝ 0', { anchor: 'middle', fs: 18, c: GRN, op: k }) +
                TX(220, 262, '乘回檢查：(x ＋ 3)(2x) ＝ 2x² ＋ 6x ✓', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            }
          ]);
        },
        caption: '第一題刻意選整除、沒有缺項的，讓你走完一次就成功。',
        example: {
          q: '計算 \\((2x^2+6x)\\div(x+3)\\)。',
          steps: ['試商 \\(2x\\)，乘回得 \\(2x^2+6x\\)', '整列相減得 \\(0\\)'],
          ans: '商 \\(2x\\)、餘 \\(0\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜單項式的除法',
        points: [
          '單項式除單項式：<b>係數除係數、字母除字母</b>，兩步分開做。',
          '字母相除是<b>次方相減</b>；減完是 0 次就變常數 1。',
          '這三題做穩了，下一頁的長除法才會順。'
        ],
        formula: { label: '這一組在練', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 41、42', BLU, '先把單項式除法做穩',
              pItem('印9 ①', '30x^2\\div 6x', '\\(5x\\)') +
              pItem('印9 ③', 'x^2\\div 2x', '\\(\\tfrac{x}{2}\\)') +
              pText('印10', '求 \\((15x^2-6x)\\div 3x\\) 的商式與餘式；\\(3x\\) 會不會整除它？', '商 \\(5x-2\\)、餘 \\(0\\)，會')), '1-3');
        },
        caption: '課本印 9、10：先把單項式除法做穩，再進長除法。'
      },
      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜長除法（習作）',
        points: [
          '每一回合都問同一句：<b>除式最高項乘什麼，才消得掉現在的最高項</b>。',
          '被除式<b>先降冪、缺項補 0</b>，習作 ③ 就是在考這件事。',
          '習作 ④ 的商會出現分數，做得出來很好，卡住先跳過。'
        ],
        formula: { label: '這一組在練', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 12', AMB, '求商式與餘式',
              pItem('基礎4 ①', '(2x^2-3x-14)\\div(x+2)', '商 \\(2x-7\\)、餘 \\(0\\)') +
              pItem('基礎4 ②', '(6x^2-5+7x)\\div(3x-1)', '商 \\(2x+3\\)、餘 \\(-2\\)') +
              pItem('基礎4 ③', '(8x^2-1)\\div(2x+3)', '商 \\(4x-6\\)、餘 \\(17\\)') +
              pItem('基礎4 ④', '(4x^2-7x+2)\\div(2x-5)', '商 \\(2x+\\tfrac{3}{2}\\)、餘 \\(\\tfrac{19}{2}\\)')), '1-3');
        },
        caption: '習作印 12 四題：整列相減記得變號，餘式次數要比除式低。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '被除式＝除式×商式＋餘式',
        points: [
          '算完把<b>除式×商式＋餘式</b>乘回去，對得上才算完。',
          '這條式子同時告訴你<b>什麼時候停</b>：餘式次數要比除式低。',
          '不要寫成 \\(A\\div B=Q\\cdots R\\)，那不是等式。'
        ],
        formula: { label: '四者關係<span class="pgref">課本 印 48</span>', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          const L = (i, s, col, k) => TX(46, 92 + i * 40, s, { fs: 17, c: col, op: k });
          SV.stepper(h, '0 0 440 284', [
            {
              t: '沒有餘式的情況：乘回去剛好回到被除式', d: k =>
                TX(220, 44, '(2x² ＋ 6x) ÷ (x ＋ 3) ＝ 2x', { anchor: 'middle', fs: 18, c: C }) +
                L(0, '(x ＋ 3) × 2x ＋ 0', BLU, k) +
                L(1, '＝ 2x² ＋ 6x　✓ 回到被除式', GRN, k > .5 ? (k - .5) * 2 : 0)
            },
            {
              t: '有餘式的情況：別忘了把餘式加回去', d: k =>
                `<rect x="0" y="0" width="440" height="284" fill="#fff"/>` +
                TX(220, 44, '(2x² ＋ 7x ＋ 4) ÷ (x ＋ 3)', { anchor: 'middle', fs: 18, c: C }) +
                L(0, '商 ＝ 2x ＋ 1　餘 ＝ 1', AMB, k) +
                L(1, '(x ＋ 3)(2x ＋ 1) ＝ 2x² ＋ 7x ＋ 3', BLU, k > .4 ? (k - .4) / .6 : 0) +
                L(2, '再 ＋ 1 ＝ 2x² ＋ 7x ＋ 4　✓', GRN, k > .75 ? (k - .75) * 4 : 0)
            },
            {
              t: '什麼時候停：餘式次數比除式低就停', d: k =>
                `<rect x="0" y="0" width="440" height="284" fill="#fff"/>` +
                BOX(56, 68, 328, 64, { r: 12, fill: '#eef4ff', stroke: BLU, op: k }) +
                TX(220, 96, '餘式 1 是零次，除式 x＋3 是一次', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(220, 120, '零次 ＜ 一次 → 停', { anchor: 'middle', fs: 16, c: BLU, op: k }) +
                BOX(56, 152, 328, 64, { r: 12, fill: '#fdeef2', stroke: RED, op: k }) +
                TX(220, 180, '如果餘式還是一次或更高', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(220, 204, '代表最高項還消得掉，要繼續除', { anchor: 'middle', fs: 16, c: RED, op: k }) +
                TX(220, 252, '停不停，看的是次數，不是算了幾步', { anchor: 'middle', fs: 14, c: GREY, op: k })
            }
          ], { acc: false });
        },
        caption: '乘回驗算一次，等於同時檢查了乘法、加法與餘式。',
        example: {
          q: '\\((2x^2+7x+4)\\div(x+3)\\) 得商 \\(2x+1\\)、餘 \\(1\\)，驗算看看。',
          steps: ['\\((x+3)(2x+1)=2x^2+7x+3\\)', '再加上餘式 \\(1\\)'],
          ans: '\\(2x^2+7x+4\\)，和被除式一樣'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>平方、相減、停止</b>。',
          '每一個都可以用一句話問回去。',
          '「裡面有幾個？」「你減掉的是哪一整列？」「還消得掉嗎？」'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 51 重點整理</span>', tex: '(5x)^2=25x^2\\ne 25x' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '只平方了係數', bad: '\\((5x)^2=25x\\)', good: '\\((5x)^2=5x\\cdot 5x=25x^2\\)' },
            { tag: '整列相減漏變號', bad: '\\(8x-(-x)=7x\\)', good: '\\(8x-(-x)=8x+x=9x\\)' },
            { tag: '餘式還沒降次就停', bad: '\\((x^2+2x-8)\\div(x-2)\\)<br>減一次就停：商 \\(x\\)、餘 \\(4x-8\\)', good: '餘 \\(4x-8\\) 還是<b>一次</b>，沒有比除式低<br>再減一次：商 \\(x+4\\)、餘 \\(0\\)' }
          ]);
          MJ(h);
        },
        caption: '長除法錯得最多的不是試商，是<b>整列相減時的負號</b>。',
        example: {
          q: '計算 \\((15x^2-6x)\\div 3x\\)，並乘回驗算。',
          steps: ['商是 \\(5x-2\\)', '\\(3x(5x-2)=15x^2-6x\\)'],
          ans: '商 \\(5x-2\\)、餘 \\(0\\)，驗算相符'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '練習｜用四者關係反求',
        points: [
          '這幾題都不是叫你除，是叫你<b>把關係式反過來寫</b>。',
          '被除式 ＝ 除式 × 商式 ＋ 餘式——缺哪個就求哪個。',
          '下面兩題<b>行有餘力才做</b>，要看習作上的圖。'
        ],
        formula: { label: '反求就靠這一條', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 13', AMB, '三題都用四者關係',
              pText('基礎5', '\\(A\\div(4x+1)\\) 得商式 \\(4x-1\\)、餘式 \\(-10\\)，求 \\(A\\)。', '\\(A=16x^2-11\\)') +
              pText('基礎6', '\\((20x^2+2x-5)\\div B\\) 得商式 \\(4x+2\\)、餘式 \\(-1\\)，求 \\(B\\)。', '\\(B=5x-2\\)') +
              pText('基礎7', '\\((5x^2-7x+a)\\div(x-3)\\) 得餘式 \\(16\\)，求 \\(a\\)。', '\\(a=-8\\)')) +
            pCard('習作・行有餘力', '印 14', GRN, '精熟練習，要看圖，做不完不追',
              pText('精熟1', '\\(\\triangle ABC\\) 面積為 \\(6x^2+13x+6\\)，\\(\\overline{AB}=6x+4\\)，求 \\(\\overline{AB}\\) 對應的高。', '\\(2x+3\\)') +
              pText('精熟2', '木門寬 \\(3x-2\\)、高 \\(7x+11\\)，內有六塊寬 \\(x-1\\)、高 \\(x+1\\) 的玻璃，求要油漆的面積。', '\\(15x^2+19x-16\\)')), '1-3');
        },
        caption: '習作印 12、13。<b>基礎 5、6、7 今天當堂寫完</b>；精熟兩題行有餘力再做。'
      }

    ]
  });
})();
