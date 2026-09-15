window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
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

  const pLabel = (sec, tag) => {
    if (!/^印\s*\d+/.test(tag)) return tag;
    const S = (window.SOLUTIONS || {})[sec] || {};
    const d = S[tag] || S[tag.replace(/\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫].*$/, '')];
    return d && d.page ? tag.replace(/^印\s*\d+/, d.page.replace(/\s+/g, ' ')) : tag;
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

  const RT = (n) => `<tspan class="radsign">√</tspan><tspan class="rad">${n}</tspan>`;
  const radBars = (h) => {
    if (typeof document === 'undefined') return;
    h.querySelectorAll('svg').forEach(sv => {
      sv.querySelectorAll('.radmark').forEach(l => l.remove());
      sv.querySelectorAll('tspan.rad').forEach(t => {
        const sign = t.previousElementSibling;
        if (!sign || !sign.classList.contains('radsign') || !t.getBBox) return;
        let b, sb;
        try { b = t.getBBox(); sb = sign.getBBox(); } catch (e) { return; }
        if (!b || !b.width || !sb || !sb.width) return;
        const cs = getComputedStyle(t.parentNode);
        const fill = cs.fill || INK;
        const fs = parseFloat(cs.fontSize) || 16;
        const baseY = parseFloat(t.parentNode.getAttribute('y')) || (b.y + b.height * 0.8);
        sign.setAttribute('fill', 'transparent');
        const top = baseY - fs * 0.80;
        const x0 = sb.x + sb.width * 0.10;
        const x1 = sb.x + sb.width * 0.42;
        const x2 = sb.x + sb.width * 0.86;
        const x3 = b.x + b.width + fs * 0.06;
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        p.setAttribute('class', 'radmark');
        p.setAttribute('points',
          `${x0},${baseY - fs * 0.40} ${x1},${baseY - fs * 0.03} ${x2},${top} ${x3},${top}`);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', fill);
        p.setAttribute('stroke-width', Math.max(1.6, fs * 0.085));
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        t.parentNode.parentNode.appendChild(p);
      });
    });
  };

  const SQ = [];
  for (let i = 1; i <= 20; i++) SQ.push(i * i);

  window.DECK.push({
    ch: 2,
    title: '平方根與畢氏定理',
    color: C,
    sections: ['2-1 平方根與近似值', '2-2 根式的運算', '2-3 畢氏定理'],
    slides: [

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '這段長度畫得出來，卻寫不出來',
        points: [
          '兩個 1 平方公分的正方形，剪拼成一個<b>面積 2</b> 的正方形。',
          '量它的邊長大約 1.4，但 \\(1.4\\times1.4=1.96\\)，<b>不是 2</b>。',
          '寫不出來的那段長度，就給它一個新符號：\\(\\sqrt{2}\\)。'
        ],
        formula: { label: '新符號<span class="pgref">課本 印 61 探索活動</span>', tex: '(\\sqrt{2})^2=2' },
        visual: (h) => {
          const u = 62;
          SV.stepper(h, '0 0 440 288', [
            {
              t: '先看兩個面積 1 的正方形', d: k =>
                `<rect x="96" y="70" width="${u}" height="${u}" fill="${BLU}" opacity="${.2 + .3 * k}" stroke="${BLU}" stroke-width="2"/>
                 <rect x="188" y="70" width="${u}" height="${u}" fill="${BLU}" opacity="${.2 + .3 * k}" stroke="${BLU}" stroke-width="2"/>` +
                TX(127, 108, '1', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(219, 108, '1', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 46, '面積各是 1', { anchor: 'middle', fs: 14, c: GREY })
            },
            {
              t: '剪開重拼成一個正方形，面積還是 2', d: k =>
                `<rect x="0" y="0" width="440" height="288" fill="#fff"/>` +
                TX(220, 40, '拼成一個正方形', { anchor: 'middle', fs: 14, c: GREY }) +
                `<rect x="${220 - 44 * k}" y="${64}" width="${88 * k}" height="${88 * k}" fill="${VIO}" opacity=".28" stroke="${VIO}" stroke-width="2.2"/>` +
                TX(220, 116, '面積 2', { anchor: 'middle', fs: 17, c: VIO, op: k })
            },
            {
              t: '拿尺量邊長：大約 1.4 公分', d: k =>
                TX(220, 176, '量出來 ≈ 1.4', { anchor: 'middle', fs: 17, c: AMB, op: k })
            },
            {
              t: '驗算 1.4 × 1.4，卻不等於 2', d: k =>
                TX(220, 212, '1.4 × 1.4 ＝ 1.96', { anchor: 'middle', fs: 17, c: RED, op: k }) +
                TX(220, 238, '不是 2', { anchor: 'middle', fs: 15, c: RED, op: k }) +
                BOX(128, 252, 184, 30, { r: 10, fill: '#f3eeff', stroke: VIO, op: k > .5 ? (k - .5) * 2 : 0 }) +
                TX(220, 273, `就把這段長度叫 ${RT(2)}`, { anchor: 'middle', fs: 15, c: VIO, op: k > .5 ? (k - .5) * 2 : 0 })
            }
          ]);

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '這段長度是量得到的，只是沒辦法用整數、小數或分數寫完。',
        example: {
          q: '\\((\\sqrt{7})^2\\) 等於多少？',
          steps: ['\\(\\sqrt{7}\\) 是面積 7 的正方形邊長', '邊長乘邊長就是面積'],
          ans: '\\((\\sqrt{7})^2=7\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號 a 就是面積 a 的正方形，它的邊長',
        points: [
          '看到 \\(\\sqrt{a}\\)，就想「面積 \\(a\\) 的正方形，一邊多長」。',
          '邊長乘邊長就回到面積，所以 \\((\\sqrt{a})^2=a\\)。',
          '沒有面積是 \\(-9\\) 的正方形，所以<b>負數不能開根號</b>。'
        ],
        formula: { label: '意義<span class="pgref">課本 印 61–62</span>', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>正方形的面積 <span class="ival av">9</span></label>
              <input type="range" class="as" min="1" max="25" step="1" value="9">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value;
            h.querySelector('.av').textContent = a;
            const side = Math.sqrt(a) * 33, x0 = 220 - side / 2, y0 = 44;
            const exact = Number.isInteger(Math.sqrt(a));
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', `
              <rect x="${x0}" y="${y0}" width="${side}" height="${side}" fill="${VIO}" opacity=".24" stroke="${VIO}" stroke-width="2.2"/>
              ${TX(220, y0 + side / 2 + 6, `面積 ${a}`, { anchor: 'middle', fs: 16, c: INK })}
              ${TX(x0 - 10, y0 + side / 2 + 6, '邊長', { anchor: 'end', fs: 13, c: GREY })}
              ${TX(220, y0 + side + 30, `邊長 ＝ ${RT(a)}`, { anchor: 'middle', fs: 19, c: VIO })}
              ${TX(220, 250, exact ? `${RT(a)} ＝ ${Math.sqrt(a)}（剛好是整數）` : `${RT(a)} 寫不成整數，但長度就在那裡`, { anchor: 'middle', fs: 14.5, c: exact ? GRN : GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          draw();
        },
        caption: '面積是 0 的正方形邊長也是 0，所以 \\(\\sqrt{0}=0\\)。',
        example: {
          q: '\\(\\sqrt{-9}\\) 等於多少？',
          steps: ['要找面積 \\(-9\\) 的正方形', '面積不可能是負的'],
          ans: '沒有這個數（國中階段）'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜根號的意義與比大小',
        points: [
          '看到 \\(\\sqrt{a}\\) 先想「面積 \\(a\\) 的正方形，邊長多長」。',
          '比大小只看<b>根號裡面</b>；裡面大，整個就大。',
          '\\((\\sqrt{a})^2\\) 一定等於 \\(a\\)，不用算出小數。'
        ],
        formula: { label: '這一組在練', tex: '(\\sqrt{a})^2=a\\qquad a\\gt b\\gt 0\\Rightarrow\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 62', BLU, '認識根號與比較大小',
              pText('印5 ①', '用根號表示面積為 \\(5\\) 的正方形邊長；\\((\\sqrt{12})^2=?\\)', '\\(\\sqrt{5}\\)；\\(12\\)') +
              pItem('印5 例1', '\\sqrt{51}\\;\\square\\;\\sqrt{49}', '\\(\\gt\\)') +
              pItem('印5 例1續', '\\sqrt{\\tfrac{7}{6}}\\;\\square\\;\\sqrt{\\tfrac{5}{4}}', '\\(\\lt\\)')) +
            pCard('習作・基礎練習', '印 19', AMB, '填入適當的數、比較大小',
              pItem('基礎2 ①', '\\sqrt{9}\\;\\square\\;\\sqrt{8}', '\\(\\gt\\)') +
              pItem('基礎2 ②', '\\sqrt{\\tfrac{13}{3}}\\;\\square\\;3', '\\(\\lt\\)')), '2-1');
        },
        caption: '課本印 5 與習作基礎 2：比大小只看根號裡面。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜填入適當的數',
        points: [
          '看到 \\(\\sqrt{a}\\) 先想「面積 \\(a\\) 的正方形，邊長多長」。',
          '比大小只看<b>根號裡面</b>；裡面大，整個就大。',
          '\\((\\sqrt{a})^2\\) 一定等於 \\(a\\)，不用算出小數。'
        ],
        formula: { label: '這一組在練', tex: '(\\sqrt{a})^2=a\\qquad a\\gt b\\gt 0\\Rightarrow\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 19', AMB, '填入適當的數、比較大小',
              pText('基礎1 ①', '面積 \\(8\\) 的正方形，邊長為？', '\\(\\sqrt{8}\\)') +
              pText('基礎1 ②', '面積 \\(15\\) 的正方形，邊長為？', '\\(\\sqrt{15}\\)') +
              pItem('基礎1 ③', '(\\sqrt{10})^2', '10') +
              pItem('基礎1 ④', '(\\sqrt{\\tfrac{15}{4}})^2', '\\(\\tfrac{15}{4}\\)')), '2-1');
        },
        caption: '習作印 19 的基礎 1：面積與邊長互換。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '面積比較大，邊長就比較長',
        points: [
          '\\(5\\) 比 \\(8\\) 小，所以 \\(\\sqrt{5}\\) 比 \\(\\sqrt{8}\\) 短。',
          '根號裡的數怎麼排，根號整個就怎麼排。',
          '沒有計算機時，也可以<b>兩邊同時平方</b>再比（限正數）。'
        ],
        formula: { label: '比大小<span class="pgref">課本 印 62 例 1</span>', tex: 'a\\gt b\\gt 0\\;\\Rightarrow\\;\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>左邊面積 <span class="ival av">5</span>　　右邊面積 <span class="ival bv">8</span></label>
              <input type="range" class="as" min="1" max="20" step="1" value="5">
              <input type="range" class="bs" min="1" max="20" step="1" value="8">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a;
            h.querySelector('.bv').textContent = b;
            const sa = Math.sqrt(a) * 26, sb = Math.sqrt(b) * 26, base = 206;
            const sign = a === b ? '＝' : (a > b ? '＞' : '＜');
            h.querySelector('.fig').innerHTML = svg('0 0 440 268', `
              <rect x="${112 - sa / 2}" y="${base - sa}" width="${sa}" height="${sa}" fill="${BLU}" opacity=".26" stroke="${BLU}" stroke-width="2"/>
              <rect x="${328 - sb / 2}" y="${base - sb}" width="${sb}" height="${sb}" fill="${GRN}" opacity=".26" stroke="${GRN}" stroke-width="2"/>
              ${SV.seg(28, base, 412, base, '#c3cddd', 2)}
              ${TX(112, base + 24, `面積 ${a}`, { anchor: 'middle', fs: 14, c: GREY })}
              ${TX(328, base + 24, `面積 ${b}`, { anchor: 'middle', fs: 14, c: GREY })}
              ${TX(112, base + 50, RT(a), { anchor: 'middle', fs: 20, c: BLU })}
              ${TX(220, base + 50, sign, { anchor: 'middle', fs: 20, c: INK })}
              ${TX(328, base + 50, RT(b), { anchor: 'middle', fs: 20, c: GRN })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '拖滑桿把面積換掉，兩個正方形誰高誰矮一眼就看得出來。',
        example: {
          q: '\\(\\sqrt{12}\\) 和 \\(\\sqrt{10}\\) 誰比較大？',
          steps: ['比根號裡面：\\(12\\gt10\\)'],
          ans: '\\(\\sqrt{12}\\gt\\sqrt{10}\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號裡剛好是平方數，就開得出來',
        points: [
          '\\(12\\times12=144\\)，所以 \\(\\sqrt{144}=12\\)。',
          '\\(1\\) 到 \\(20\\) 的平方數做成一張桌角卡，整章都用得到。',
          '<b>負的平方也一樣</b>：\\((-12)^2\\) 同樣是 \\(144\\)——這件事等一下會再用到。'
        ],
        formula: { label: '完全平方數<span class="pgref">課本 印 63</span>', tex: '\\sqrt{144}=12\\;\\Longleftrightarrow\\;12^2=144' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>選一個數 <span class="ival nv">12</span></label>
              <input type="range" class="ns" min="1" max="20" step="1" value="12">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value;
            h.querySelector('.nv').textContent = n;
            let cells = '';
            for (let i = 1; i <= 20; i++) {
              const col = (i - 1) % 5, row = Math.floor((i - 1) / 5);
              const x = 18 + col * 82, y = 30 + row * 40, on = i === n;
              cells += BOX(x, y, 76, 33, { r: 8, fill: on ? '#f3eeff' : '#fff', stroke: on ? VIO : '#e3e8f2', sw: on ? 2.2 : 1.2 });
              cells += TX(x + 38, y + 22, `${i}² ＝ ${i * i}`, { anchor: 'middle', fs: 12.5, c: on ? VIO : GREY, fw: on ? 900 : 700 });
            }
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', cells +
              BOX(74, 212, 292, 52, { r: 12, fill: '#fff', stroke: VIO }) +
              TX(220, 238, `${RT(n * n)} ＝ ${n}`, { anchor: 'middle', fs: 21, c: VIO }) +
              TX(220, 258, `${n}×${n} ＝ ${n * n}，(－${n})×(－${n}) 也 ＝ ${n * n}`, { anchor: 'middle', fs: 12.5, c: GREY }));
            radBars(h);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '這張表待會求整數部分還要再用一次，先讓它待在手邊。',
        example: {
          q: '\\(\\sqrt{169}\\) 等於多少？',
          steps: ['在表上找 \\(169\\)', '\\(13^2=169\\)'],
          ans: '\\(\\sqrt{169}=13\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '分數也開得出來：分子分母各自開',
        points: [
          '\\(\\sqrt{\\frac{25}{9}}\\)：上面開上面、下面開下面，\\(\\frac{5}{3}\\)。',
          '小數先<b>換成分數</b>再開：\\(1.96=\\frac{196}{100}\\)，開出來 \\(1.4\\)。',
          '判斷能不能開，看<b>分子分母是不是都是平方數</b>。'
        ],
        formula: { label: '分數的平方根<span class="pgref">課本 印 63 例 2</span>', tex: '\\sqrt{\\tfrac{25}{9}}=\\tfrac{5}{3}\\quad\\sqrt{1.96}=1.4' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>分子 <span class="ival av">25</span>　　分母 <span class="ival bv">9</span></label>
              <input type="range" class="as" min="1" max="12" step="1" value="5">
              <input type="range" class="bs" min="1" max="12" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a * a;
            h.querySelector('.bv').textContent = b * b;

            h.querySelector('.fig').innerHTML =
              `<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:14px">
                 <div style="font-size:13px;color:${GREY}">開一個分數</div>
                 <div style="font-size:34px;color:${INK}">\\(\\sqrt{\\dfrac{${a * a}}{${b * b}}}=\\dfrac{${a}}{${b}}\\)</div>
                 <div style="width:82%;background:#f6f9ff;border:1.5px solid ${BLU};border-radius:12px;padding:8px 14px;text-align:center;font-size:15px;font-weight:900;color:${BLU}">
                   因為 ${a}×${a}＝${a * a}，${b}×${b}＝${b * b}</div>
                 <div style="font-size:14px;color:${GREY}">上面開上面、下面開下面，各開各的</div>
               </div>`;
            MJ(h);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '小數不要直接開，<b>先換成分數</b>：\\(1.96=\\frac{196}{100}\\)，再各開各的。',
        example: {
          q: '求 \\(\\sqrt{\\frac{36}{49}}\\) 與 \\(\\sqrt{1.96}\\)。',
          steps: ['\\(36=6^2\\)、\\(49=7^2\\)', '\\(1.96=\\frac{196}{100}\\)，\\(196=14^2\\)、\\(100=10^2\\)'],
          ans: '\\(\\frac{6}{7}\\) 與 \\(1.4\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜用平方數求值（課本隨堂）',
        points: [
          '整數看平方數表；<b>分數上下各開</b>；小數先換成分數。',
          '\\(\\sqrt{5^2}\\) 這種直接消掉，答案就是裡面那個數。',
          '標準分解式把指數<b>除以 2</b>：\\(\\sqrt{2^6}=2^3\\)。'
        ],
        formula: { label: '這一組在練', tex: '\\sqrt{a^2}=a\\;(a\\ge 0)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 63、64', BLU, '',
              pItem('印6 ①', '\\sqrt{121}', '11') +
              pItem('印6 ②', '\\sqrt{\\tfrac{36}{49}}', '\\(\\tfrac{6}{7}\\)') +
              pItem('印6 續', '\\sqrt{1.96}', '1.4') +
              pItem('印7 ①', '\\sqrt{2^6\\times 3^2}', '24') +
              pItem('印7 ②', '\\sqrt{2025}', '45')), '2-1');
        },
        caption: '課本印 6、7：根號裡是平方數就開得出來。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜用平方數求值（習作前三題）',
        points: [
          '整數看平方數表；<b>分數上下各開</b>；小數先換成分數。',
          '\\(\\sqrt{5^2}\\) 這種直接消掉，答案就是裡面那個數。',
          '標準分解式把指數<b>除以 2</b>：\\(\\sqrt{2^6}=2^3\\)。'
        ],
        formula: { label: '這一組在練', tex: '\\sqrt{a^2}=a\\;(a\\ge 0)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習 3', '印 20', AMB, '六小題，求值',
              pItem('基礎3 ①', '\\sqrt{5^2}', '5') +
              pItem('基礎3 ②', '\\sqrt{(\\tfrac{7}{19})^2}', '\\(\\tfrac{7}{19}\\)') +
              pItem('基礎3 ③', '\\sqrt{169}', '13')), '2-1');
        },
        caption: '習作印 20 基礎 3 的 ①②③。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜用平方數求值（習作後三題）',
        points: [
          '整數看平方數表；<b>分數上下各開</b>；小數先換成分數。',
          '\\(\\sqrt{5^2}\\) 這種直接消掉，答案就是裡面那個數。',
          '標準分解式把指數<b>除以 2</b>：\\(\\sqrt{2^6}=2^3\\)。'
        ],
        formula: { label: '這一組在練', tex: '\\sqrt{a^2}=a\\;(a\\ge 0)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習 3', '印 20', AMB, '六小題，求值',
              pItem('基礎3 ④', '\\sqrt{1.69}', '1.3') +
              pItem('基礎3 ⑤', '\\sqrt{\\tfrac{81}{25}}', '\\(\\tfrac{9}{5}\\)') +
              pItem('基礎3 ⑥', '\\sqrt{2^2\\times 3^4}', '18')), '2-1');
        },
        caption: '習作印 20 基礎 3 的 ④⑤⑥；分數就分子分母各自開。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '開不出來的，就夾在兩個平方數中間',
        points: [
          '\\(30\\) 夾在 \\(25\\) 和 \\(36\\) 中間。',
          '\\(25=5^2\\)、\\(36=6^2\\)，所以 \\(\\sqrt{30}\\) 夾在 \\(5\\) 和 \\(6\\) 中間。',
          '整數部分就是<b>左邊那個數</b>：\\(\\sqrt{30}\\) 的整數部分是 \\(5\\)。'
        ],
        formula: { label: '夾擠<span class="pgref">課本 印 65</span>', tex: '25\\lt 30\\lt 36\\;\\Rightarrow\\;5\\lt\\sqrt{30}\\lt 6' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>根號裡的數 <span class="ival av">30</span></label>
              <input type="range" class="as" min="2" max="120" step="1" value="30">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value;
            h.querySelector('.av').textContent = a;
            const k = Math.floor(Math.sqrt(a)), lo = k * k, hi = (k + 1) * (k + 1);
            const exact = lo === a;
            const X = v => 56 + (v - lo) / (hi - lo) * 328;
            h.querySelector('.fig').innerHTML = svg('0 0 440 264', `
              ${SV.seg(40, 120, 412, 120, '#c3cddd', 2.4)}
              ${SV.seg(X(lo), 108, X(lo), 132, BLU, 2.4)}
              ${SV.seg(X(hi), 108, X(hi), 132, BLU, 2.4)}
              ${TX(X(lo), 100, `${lo}`, { anchor: 'middle', fs: 15, c: BLU })}
              ${TX(X(hi), 100, `${hi}`, { anchor: 'middle', fs: 15, c: BLU })}
              ${TX(X(lo), 152, `${k}²`, { anchor: 'middle', fs: 13, c: GREY })}
              ${TX(X(hi), 152, `${k + 1}²`, { anchor: 'middle', fs: 13, c: GREY })}
              ${SV.dot(X(a), 120, AMB, 6)}
              ${TX(X(a), 56, `${a}`, { anchor: 'middle', fs: 18, c: AMB })}
              ${SV.seg(X(a), 66, X(a), 112, AMB, 2, '4 4')}
              ${BOX(70, 186, 300, 46, { r: 12, fill: '#f3eeff', stroke: VIO })}
              ${TX(220, 216, exact ? `${RT(a)} ＝ ${k}` : `${k} ＜ ${RT(a)} ＜ ${k + 1}`, { anchor: 'middle', fs: 20, c: VIO })}
              ${TX(220, 252, exact ? '剛好是平方數，直接開得出來' : `整數部分是 ${k}`, { anchor: 'middle', fs: 14, c: GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          draw();
        },
        caption: '找的方法就是翻上一頁的平方數表：哪兩個平方數把它夾住。',
        example: {
          q: '\\(\\sqrt{50}\\) 在哪兩個整數之間？',
          steps: ['\\(49\\lt50\\lt64\\)', '\\(49=7^2\\)、\\(64=8^2\\)'],
          ans: '\\(7\\lt\\sqrt{50}\\lt 8\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '老師給數字，你只要判斷夾在哪兩個',
        points: [
          '要算到小數點後一位，老師會<b>直接把平方值給你</b>。',
          '你要做的只有一件事：看目標被<b>哪兩個夾住</b>。',
          '不要用「哪個平方最接近」去猜，那會猜對但想錯。'
        ],
        formula: { label: '夾 根號 3<span class="pgref">課本 印 67 例 5</span>', tex: '1.7^2=2.89\\;\\lt\\;3\\;\\lt\\;3.24=1.8^2' },
        visual: (h) => {
          const row = (i, s, col, k) => TX(64, 104 + i * 36, s, { fs: 17, c: col, op: k });
          SV.stepper(h, '0 0 440 282', [
            {
              t: '先夾整數：根號 3 在 1 和 2 之間', d: k =>
                TX(220, 52, `${RT(3)} 大約是多少？`, { anchor: 'middle', fs: 19, c: C }) +
                row(0, '1² ＝ 1，2² ＝ 4 → 夾在 1 和 2 之間', BLU, k)
            },
            {
              t: '老師給你這四個平方值', d: k =>
                row(1, '1.6² ＝ 2.56　　1.7² ＝ 2.89', GREY, k) +
                row(2, '1.8² ＝ 3.24　　1.9² ＝ 3.61', GREY, k)
            },
            {
              t: '找哪兩個把 3 夾住', d: k =>
                row(3, '2.89 ＜ 3 ＜ 3.24', AMB, k) +
                BOX(92, 232, 256, 42, { r: 12, fill: '#f3eeff', stroke: VIO, op: k }) +
                TX(220, 260, `1.7 ＜ ${RT(3)} ＜ 1.8`, { anchor: 'middle', fs: 20, c: VIO, op: k })
            }
          ]);

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '本節到「夾在哪兩個」就結束，不再往下取捨到哪一位。',
        example: {
          q: '已知 \\(2.2^2=4.84\\)、\\(2.3^2=5.29\\)，\\(\\sqrt{5}\\) 夾在哪兩個數之間？',
          steps: ['看 \\(5\\) 落在哪裡', '\\(4.84\\lt5\\lt5.29\\)'],
          ans: '\\(2.2\\lt\\sqrt{5}\\lt 2.3\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '計算機按出來的，是近似值不是實際值',
        points: [
          '按法是 <b>13 → SHIFT → x²</b>（黃色 √ 在 x² 上面），跑出一長串。',
          '那一長串<b>乘自己也不會剛好是 13</b>，它只是很接近。',
          '螢幕會停在某一位，是因為螢幕只有那麼寬。'
        ],
        formula: { label: '近似值<span class="pgref">課本 印 68</span>', tex: '\\sqrt{13}\\approx 3.6' },

        visual: (h) => {
          const BX = 14, BY = 24, BW = 244, BH = 258;
          const KX = BX + 12, KY = BY + 82, KW = 42, KH = 32, GX = 4, GY = 3;
          const KEYS = [
            ['SHIFT', 'x²', 'log', 'ln', 'ON'],
            ['7', '8', '9', 'C', 'AC'],
            ['4', '5', '6', '×', '÷'],
            ['1', '2', '3', '＋', '－'],
            ['0', '・', 'EXP', '＝', 'M+']
          ];
          const ORANGE = '#e8922a', TEAL = '#1596ad', DARK = '#3f4b57';
          const keyPos = (lab) => {
            for (let r = 0; r < KEYS.length; r++) {
              const c = KEYS[r].indexOf(lab);
              if (c >= 0) return [KX + c * (KW + GX), KY + r * (KH + GY)];
            }
            return null;
          };
          const body = () =>
            BOX(BX, BY, BW, BH, { r: 12, fill: '#aeb7c1', stroke: '#7b8794', sw: 2 }) +
            BOX(BX + 10, BY + 10, BW - 20, 52, { r: 6, fill: '#e7efb4', stroke: '#93a06a', sw: 1.6 }) +
            TX(BX + BW - 18, BY + 26, 'DEG', { anchor: 'end', fs: 9, c: '#5d6b3f' });
          const keys = (hot) => {
            let g = '';
            KEYS.forEach((row, r) => row.forEach((lab, c) => {
              const x = KX + c * (KW + GX), y = KY + r * (KH + GY);
              const on = hot.indexOf(lab) >= 0;
              const num = /^[0-9・]$/.test(lab);
              const col = ['＋', '－', '×', '÷', '＝', 'M+', 'EXP'].indexOf(lab) >= 0 ? ORANGE
                : ['C', 'AC'].indexOf(lab) >= 0 ? TEAL
                  : num ? '#8f9aa6' : DARK;
              g += BOX(x, y, KW, KH, { r: 6, fill: on ? '#fde68a' : col, stroke: on ? AMB : '#6b7682', sw: on ? 2.4 : 1 });
              g += TX(x + KW / 2, y + KH / 2 + 4.5, lab,
                { anchor: 'middle', fs: lab === 'SHIFT' ? 9 : num ? 15 : 12, c: on ? INK : '#fff' });
            }));

            const p2 = keyPos('x²');
            g += TX(p2[0] + KW / 2, p2[1] - 4, '√', { anchor: 'middle', fs: 12, c: '#f5d76e' });
            return g;
          };
          const lcd = (txt, k) =>
            TX(BX + BW - 18, BY + 52, txt, { anchor: 'end', fs: 21, c: '#2b3320', op: k });
          const RX = 272;

          const NOTE = [
            ['① 1　② 3', INK, 16],
            ['③ SHIFT', AMB, 16],
            ['④ x²（上面那個黃色 √）', AMB, 14.5],
            ['3.605551275', GRN, 16]
          ];
          const notes = (n) => NOTE.slice(0, n)
            .map(([t, c, fs], i) => TX(RX, 66 + i * 34, t, { fs, c })).join('');
          SV.stepper(h, '0 0 440 300', [
            {
              t: '先按<b>數字</b>：1、3。螢幕上是 13。',
              d: () => body() + keys(['1', '3']) + lcd('13', 1) + notes(1)
            },
            {
              t: '再按 <b>SHIFT</b>（左上角那顆）。',
              d: () => body() + keys(['SHIFT']) + lcd('13', 1) + notes(2)
            },
            {
              t: '<b>沒有「√ 鍵」</b>：√ 是黃字、印在 x² 上面——按 <b>x²</b> 就開根號，<b>不用按 ＝</b>。',
              d: () => body() + keys(['x²']) + lcd('3.605551275', 1) + notes(4)
            },
            {
              t: '題目只要小數點後第一位 → <b>3.6</b>；但那一長串<b>乘自己不會剛好是 13</b>。',
              d: () => body() + keys([]) + lcd('3.605551275', 1) + notes(4) +
                BOX(RX - 8, 214, 152, 38, { r: 10, fill: '#f3eeff', stroke: VIO, sw: 2 }) +
                TX(RX + 68, 239, RT(13) + ' ≈ 3.6', { anchor: 'middle', fs: 18, c: VIO }) +
                TX(RX, 272, '乘自己 ＝ 12.99999999…', { fs: 12.5, c: AMB }) +
                TX(RX, 292, '很接近 13，但不是 13', { fs: 13.5, c: RED })
            }
          ], { acc: false });

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '鍵位照南一線上計算機重畫（三角函數與括號那兩排本節用不到，省略）。「小明按出 3.16227766 就說那是 \\(\\sqrt{10}\\)」——不對，那只是近似值。',
        example: {
          q: '用計算機求 \\(\\sqrt{13}\\)，四捨五入到小數點後第一位。',
          steps: ['螢幕顯示 \\(3.605\\ldots\\)', '看第二位是 \\(0\\)，捨去'],
          ans: '\\(\\sqrt{13}\\approx 3.6\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜近似值與計算機（課本隨堂）',
        points: [
          '十分逼近法只要<b>判斷夾在哪兩個</b>，平方值老師會給。',
          '求整數部分就翻平方數表，找<b>哪兩個平方數夾住它</b>。',
          '課本這三題只要求到<b>小數第一位</b>。'
        ],
        formula: { label: '這一組在練', tex: '169\\lt 180\\lt 196\\Rightarrow 13\\lt\\sqrt{180}\\lt 14' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 66–68', BLU, '夾擠、整數部分、計算機',
              pText('印9 例4', '已知 \\(2.6^2=6.76\\)、\\(2.7^2=7.29\\)⋯⋯，求 \\(\\sqrt{7}\\) 介於哪兩個相鄰的一位小數之間？', '\\(2.6\\) 與 \\(2.7\\)') +
              pText('印10 例5', '\\(\\sqrt{12}\\) 介於哪兩個連續整數之間？', '\\(3\\) 與 \\(4\\)') +
              pText('印11 例6', '面積 \\(1\\) 分的正方形土地（\\(1\\) 分約 \\(293.4\\) 坪、\\(1\\) 坪約 \\(3.3\\) 平方公尺），求邊長約幾公尺？', '約 31.1 公尺')), '2-1');
        },
        caption: '課本印 9～11：夾擠、整數部分、計算機。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜近似值與計算機（習作）',
        points: [
          '基礎 4 要用<b>計算機</b>：按法是 <b>11 → SHIFT → x²</b>（√ 在 x² 上面）。',
          '基礎 5 ① 是整數部分：找<b>哪兩個平方數夾住它</b>。',
          '基礎 5 ② 偏難（求最小的 \\(n\\)），做不出來先跳過。'
        ],
        formula: { label: '這一組在練', tex: '169\\lt 180\\lt 196\\Rightarrow 13\\lt\\sqrt{180}\\lt 14' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 20、21', AMB, '十分逼近、計算機、整數部分',
              pText('基礎4', '用十分逼近法求 \\(\\sqrt{11}\\) 的近似值（四捨五入到小數點後第一位）。', '3.3') +
              pText('基礎4 續', '用計算機求 \\(\\sqrt{11}\\)（原題要第三位；<b>今天先做第一位</b>）。', '3.3（第三位 3.317）') +
              pText('基礎5 ①', '\\(m\\) 為正整數，\\(m\\lt\\sqrt{180}\\lt m+1\\)，求 \\(m\\)。', '\\(m=13\\)') +
              pText('基礎5 ②', '\\(n\\) 為正整數，使 \\(\\sqrt{180+n}\\) 為正整數，求最小的 \\(n\\)。', '\\(n=16\\)')), '2-1');
        },
        caption: '習作印 20、21：計算機按法是 11 → SHIFT → x²。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號 9 只有一個答案，9 的平方根有兩個',
        points: [
          '問「\\(\\sqrt{9}\\) 是多少」→ 只答 <b>3</b>。',
          '問「\\(9\\) 的平方根是多少」→ 要答 <b>3 和 −3</b>。',
          '因為 \\(3\\times3=9\\)，\\((-3)\\times(-3)\\) 也等於 \\(9\\)。'
        ],
        formula: { label: '兩種問法<span class="pgref">課本 印 69–70</span>', tex: '\\sqrt{9}=3\\qquad 9\\text{ 的平方根}=\\pm 3' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>換一個數 <span class="ival nv">3</span></label>
              <input type="range" class="ns" min="1" max="12" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value, s = n * n;
            h.querySelector('.nv').textContent = n;
            h.querySelector('.fig').innerHTML = svg('0 0 440 266', `
              ${BOX(30, 40, 380, 84, { r: 14, fill: '#eef4ff', stroke: BLU })}
              ${TX(220, 70, `問：${RT(s)} 是多少？`, { anchor: 'middle', fs: 16, c: GREY })}
              ${TX(220, 104, `${n}`, { anchor: 'middle', fs: 26, c: BLU })}
              ${TX(392, 70, '一個答案', { anchor: 'end', fs: 12.5, c: BLU })}
              ${BOX(30, 140, 380, 84, { r: 14, fill: '#f3eeff', stroke: VIO })}
              ${TX(220, 170, `問：${s} 的平方根是多少？`, { anchor: 'middle', fs: 16, c: GREY })}
              ${TX(220, 204, `${n} 和 －${n}`, { anchor: 'middle', fs: 26, c: VIO })}
              ${TX(392, 170, '兩個答案', { anchor: 'end', fs: 12.5, c: VIO })}
              ${TX(220, 252, `因為 ${n}×${n} ＝ ${s}，(－${n})×(－${n}) 也 ＝ ${s}`, { anchor: 'middle', fs: 14, c: GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '唸一次差別就好：<b>根號只給正的那一個</b>，「平方根」才要給兩個。',
        example: {
          q: '\\(\\sqrt{16}\\) 是多少？\\(16\\) 的平方根是多少？',
          steps: ['根號只取正的', '平方根要兩個都寫'],
          ans: '\\(\\sqrt{16}=4\\)；\\(16\\) 的平方根是 \\(4\\) 和 \\(-4\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜求平方根（課本隨堂）',
        points: [
          '問「某數的平方根」→ <b>兩個答案</b>，一正一負。',
          '開不出整數就留著根號：\\(13\\) 的平方根是 \\(\\pm\\sqrt{13}\\)。',
          '最後兩題是<b>反過來求未知數</b>，做不完不要緊。'
        ],
        formula: { label: '這一組在練', tex: 'x^2=a\\Rightarrow x=\\pm\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 69、70', BLU, '判斷與求平方根',
              pText('印12', '兩句敘述判斷對錯：誰是誰的平方根，主詞不要顛倒。', '① ○　② ×') +
              pItem('印13 ②', '13', '\\(\\pm\\sqrt{13}\\)')) +
            pCard('習作・基礎練習', '印 21、22', AMB, '求平方根；最後一題是反推',
              pItem('基礎6 ①', '64', '\\(\\pm 8\\)') +
              pItem('基礎6 ②', '0.64', '\\(\\pm 0.8\\)')), '2-1');
        },
        caption: '課本印 12、13 與習作前兩小題：問「平方根」就要寫 ±。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜求平方根（習作）與進階',
        points: [
          '問「某數的平方根」→ <b>兩個答案</b>，一正一負。',
          '開不出整數就留著根號：\\(13\\) 的平方根是 \\(\\pm\\sqrt{13}\\)。',
          '最後兩題是<b>反過來求未知數</b>，做不完不要緊。'
        ],
        formula: { label: '這一組在練', tex: 'x^2=a\\Rightarrow x=\\pm\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 21、22', AMB, '求平方根；最後一題是反推',
              pItem('基礎6 ③', '1\\tfrac{21}{100}', '\\(\\pm\\tfrac{11}{10}\\)') +
              pItem('基礎6 ④', '47', '\\(\\pm\\sqrt{47}\\)') +
              pText('基礎7', '已知 \\(3x+4\\) 的平方根為 \\(\\pm 4\\)，求 \\(x\\)。', '\\(x=4\\)')) +
            pCard('習作・行有餘力', '印 22', GRN, '',
              pText('精熟1', '已知 \\(\\sqrt{3x+4}\\) 的平方根為 \\(\\pm 4\\)，求 \\(x\\)。', '\\(x=84\\)') +
              pText('精熟2', 'BMI \\(=\\frac{W}{H^2}\\) 的應用題（見習作印 4）。', '見習作')), '2-1');
        },
        caption: '習作基礎 6 ③④與基礎 7（反推）；精熟兩題行有餘力。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>拆根號、看問法、猜近似值</b>。',
          '第一個最常見，用計算機當場按一次就看得出來。',
          '第三個最可怕：<b>取小數第一位時它常常會猜對</b>，但問整數部分就露餡。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 72 重點整理</span>', tex: '\\sqrt{9+16}\\ne\\sqrt{9}+\\sqrt{16}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '把根號拆到加法上', bad: '\\(\\sqrt{9+16}=3+4=7\\)', good: '\\(\\sqrt{9+16}=\\sqrt{25}=5\\)　先算裡面' },
            { tag: '看錯問法', bad: '\\(\\sqrt{9}=\\pm 3\\)', good: '\\(\\sqrt{9}=3\\)；\\(9\\) 的<b>平方根</b>才是 \\(\\pm 3\\)' },
            { tag: '挑平方最接近的來猜', bad: '\\(15\\) 離 \\(16\\) 比較近，<br>就答整數部分是 \\(4\\)', good: '要看<b>夾在哪兩個</b>：<br>\\(9<15<16\\Rightarrow 3<\\sqrt{15}<4\\)，整數部分是 \\(3\\)' }
          ]);
          MJ(h);
        },
        caption: '第三個特別要防：小數第一位常常猜得對，所以更難發現——問整數部分才看得出概念沒進去。',
        example: {
          q: '下課前一分鐘：\\(\\sqrt{50}\\) 在哪兩個整數之間？',
          steps: ['翻平方數表找夾住 \\(50\\) 的兩個', '\\(49\\) 和 \\(64\\)'],
          ans: '\\(7\\) 和 \\(8\\) 之間'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '請填：這一頁的單一重點（一句話，看得懂就記得住）',
        points: [
          '重點一（≤45 字，可用 <b>粗體</b>、<span class="k">關鍵詞</span>、行內數學 \\(a+b\\)）。',
          '重點二。',
          '重點三。'
        ],
        formula: { label: '公式標籤', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 280', TX(220, 140, '請畫圖', { fs: 18, c: C, anchor: 'middle' }));
        },
        caption: '圖下方一行說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '請填：這一頁的單一重點（一句話，看得懂就記得住）',
        points: [
          '重點一（≤45 字，可用 <b>粗體</b>、<span class="k">關鍵詞</span>、行內數學 \\(a+b\\)）。',
          '重點二。',
          '重點三。'
        ],
        formula: { label: '公式標籤', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 280', TX(220, 140, '請畫圖', { fs: 18, c: C, anchor: 'middle' }));
        },
        caption: '圖下方一行說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      }
    ]
  });
})();
