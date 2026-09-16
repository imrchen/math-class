window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

  const EXW = 236, EXH = 140;

  const exWrap = (inner, w) =>
    `<svg viewBox="0 0 ${EXW} ${EXH}" style="width:${w || 62}%;display:block;margin:2px auto 0">${inner}</svg>`;
  const exTX = (x, y, t, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 12}" font-weight="900" fill="${o.c || INK}">${t}</text>`;

  const exTri = (o = {}) => {
    const A = [118, 16], B = [16, 108], Cc = [220, 108];
    const t = o.t || 0.4;
    const P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
    const Q = [A[0] + t * (Cc[0] - A[0]), A[1] + t * (Cc[1] - A[1])];
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let g = '';
    g += `<polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${Cc[0]},${Cc[1]}" fill="rgba(37,99,235,.05)" stroke="${BLU}" stroke-width="1.8"/>`;
    g += `<line x1="${A[0]}" y1="${A[1]}" x2="${P[0]}" y2="${P[1]}" stroke="${BLU}" stroke-width="3.4"/>`;
    g += `<line x1="${A[0]}" y1="${A[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${BLU}" stroke-width="3.4"/>`;
    g += `<line x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${AMB}" stroke-width="3.4"/>`;
    g += `<line x1="${Q[0]}" y1="${Q[1]}" x2="${Cc[0]}" y2="${Cc[1]}" stroke="${AMB}" stroke-width="3.4"/>`;
    g += `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${GRN}" stroke-width="2.6"/>`;
    if (o.tick) {
      g += SV.ticks(A[0], A[1], P[0], P[1], 1, VIO) + SV.ticks(P[0], P[1], B[0], B[1], 1, VIO);
      g += SV.ticks(A[0], A[1], Q[0], Q[1], 1, VIO) + SV.ticks(Q[0], Q[1], Cc[0], Cc[1], 1, VIO);
    }
    g += exTX(A[0], A[1] - 4, 'A', { anchor: 'middle', fs: 12 });
    g += exTX(B[0] - 4, B[1] + 12, 'B', { anchor: 'middle', fs: 12 });
    g += exTX(Cc[0] + 5, Cc[1] + 12, 'C', { anchor: 'middle', fs: 12 });
    const pn = o.names || ['P', 'Q'];
    g += exTX(P[0] - 12, P[1] + 3, pn[0], { anchor: 'middle', fs: 12 });
    g += exTX(Q[0] + 11, Q[1] + 3, pn[1], { anchor: 'middle', fs: 12 });
    const lab = (p, q, txt, dx, dy, col) => {
      const m = mid(p, q);
      return exTX(m[0] + dx, m[1] + dy, txt, { anchor: 'middle', fs: 12, c: col });
    };
    if (o.ap) g += lab(A, P, o.ap, -13, -1, BLU);
    if (o.pb) g += lab(P, B, o.pb, -13, -1, AMB);
    if (o.aq) g += lab(A, Q, o.aq, 13, -1, BLU);
    if (o.qc) g += lab(Q, Cc, o.qc, 13, -1, AMB);
    if (o.pq) g += lab(P, Q, o.pq, 0, -5, GRN);
    if (o.bc) g += lab(B, Cc, o.bc, 0, 14, BLU);
    return exWrap(g, o.w);
  };

  const exSeg = (o = {}) => {
    const x0 = 20, x1 = 216, y = 54;
    const t = o.t || 0.42;
    const px = x0 + t * (x1 - x0);
    let g = '';
    g += `<line x1="${x0}" y1="${y}" x2="${px}" y2="${y}" stroke="${BLU}" stroke-width="6" stroke-linecap="round"/>`;
    g += `<line x1="${px}" y1="${y}" x2="${x1}" y2="${y}" stroke="${AMB}" stroke-width="6" stroke-linecap="round"/>`;
    for (const [x, t2] of [[x0, 'A'], [px, 'P'], [x1, 'B']]) {
      g += `<circle cx="${x}" cy="${y}" r="3.4" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
      g += exTX(x, y - 12, t2, { anchor: 'middle', fs: 12 });
    }
    if (o.ap) g += exTX((x0 + px) / 2, y + 20, o.ap, { anchor: 'middle', fs: 12, c: BLU });
    if (o.pb) g += exTX((px + x1) / 2, y + 20, o.pb, { anchor: 'middle', fs: 12, c: AMB });
    if (o.ab) {
      g += `<path d="M${x0},${y + 30} Q${(x0 + x1) / 2},${y + 46} ${x1},${y + 30}" fill="none" stroke="${GRN}" stroke-width="1.8"/>`;
      g += exTX((x0 + x1) / 2, y + 54, o.ab, { anchor: 'middle', fs: 12, c: GRN });
    }
    return exWrap(g, o.w || 70);
  };

  const exPolyG = (pts, col, fill) =>
    `<polygon points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}" fill="${fill || 'rgba(37,99,235,.06)'}" stroke="${col || BLU}" stroke-width="1.8"/>`;
  const exMid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

  const exAng = (V, P, Q, col) => {
    const u = (A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
    const u1 = u(V, P), u2 = u(V, Q), r = 13;
    const a = [V[0] + u1[0] * r, V[1] + u1[1] * r], b = [V[0] + u2[0] * r, V[1] + u2[1] * r];
    const sweep = (u1[0] * u2[1] - u1[1] * u2[0]) > 0 ? 1 : 0;
    return `<path d="M${a[0]},${a[1]} A${r},${r} 0 0,${sweep} ${b[0]},${b[1]}" fill="none" stroke="${col || VIO}" stroke-width="2.2"/>`;
  };

  const exTriOne = (cx, cy, k, o = {}) => {
    const A = [cx, cy - 30 * k], B = [cx - 33 * k, cy + 23 * k], C = [cx + 33 * k, cy + 23 * k];
    const nm = o.names || ['A', 'B', 'C'];
    let g = exPolyG([A, B, C], o.col || BLU);
    if (o.ang) {
      const V = { [nm[0]]: A, [nm[1]]: B, [nm[2]]: C }[o.ang];
      const rest = [A, B, C].filter(p => p !== V);
      g += exAng(V, rest[0], rest[1], VIO);
    }
    g += exTX(A[0], A[1] - 5, nm[0], { anchor: 'middle' });
    g += exTX(B[0] - 7, B[1] + 12, nm[1], { anchor: 'middle' });
    g += exTX(C[0] + 7, C[1] + 12, nm[2], { anchor: 'middle' });
    const lab = (p, q, t, dx, dy, col) => {
      const m = exMid(p, q); return t ? exTX(m[0] + dx, m[1] + dy, t, { anchor: 'middle', c: col || INK }) : '';
    };
    g += lab(A, B, o.ab, -13, 0, BLU);
    g += lab(A, C, o.ac, 13, 0, BLU);
    g += lab(B, C, o.bc, 0, 13, AMB);
    return g;
  };

  const exTriPair = (o = {}) => {
    let g = exTriOne(58, 66, (o.l || {}).k || 1, o.l || {}) + exTriOne(178, 66, (o.r || {}).k || 1, o.r || {});
    if (o.note) g += exTX(EXW / 2, 132, o.note, { anchor: 'middle', c: GREY, fs: 11 });
    return exWrap(g, o.w);
  };

  const exRectPair = (o = {}) => {
    const u = 24, box = (cx, w, h, tag) => {
      const W = w * u, H = h * u, x = cx - W / 2, y = 78 - H;
      return `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="rgba(37,99,235,.06)" stroke="${BLU}" stroke-width="1.8"/>`
        + exTX(cx, 92, w + ' × ' + h, { anchor: 'middle' })
        + (tag ? exTX(cx, 108, tag, { anchor: 'middle', c: GREY, fs: 11 }) : '');
    };
    return exWrap(box(58, o.l[0], o.l[1], o.lt) + box(178, o.r[0], o.r[1], o.rt), o.w);
  };

  const exRhombPair = (o = {}) => {
    const rh = (cx, deg) => {
      const R = 38, t = deg * Math.PI / 360;
      const dx = R * Math.sin(t), dy = R * Math.cos(t);
      const P = [[cx, 66 - dy], [cx + dx, 66], [cx, 66 + dy], [cx - dx, 66]];
      return exPolyG(P, BLU) + exAng(P[0], P[1], P[3], VIO)
        + exTX(cx + dx / 2 + 12, 66 - dy / 2, o.s || '4', { anchor: 'middle', c: BLU })
        + exTX(cx, 66 + dy + 15, deg + '°', { anchor: 'middle', c: VIO, fs: 11 });
    };
    return exWrap(rh(58, o.a1 || 64) + rh(178, o.a2 || 104), o.w);
  };

  const exQuadPair = (o = {}) => {
    const shape = [[-30, -22], [28, -28], [34, 20], [-26, 16]];
    const draw = (cx, names, flip) => {
      const P = shape.map(([x, y]) => [cx + (flip ? -x : x), 62 + (flip ? -y : y)]);
      let g = exPolyG(P, BLU);

      const off = [[-9, -4], [9, -4], [9, 12], [-9, 12]];
      P.forEach((p, i) => {
        const d = flip ? [-off[i][0], -off[i][1] + 8] : off[i];
        g += exTX(p[0] + d[0], p[1] + d[1], names[i], { anchor: 'middle' });
      });
      return g;
    };
    return exWrap(draw(58, o.l || ['A', 'B', 'C', 'D'], false)
      + draw(178, o.r || ['P', 'Q', 'R', 'S'], true)
      + exTX(EXW / 2, 128, o.note || '第二個是轉過來畫的', { anchor: 'middle', c: GREY, fs: 11 }), o.w);
  };

  const ARC = (p1, p2, off, col, lab, k = 1) => {
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    const c = [mx + nx * off * 2, my + ny * off * 2];
    const lp = [mx + nx * off * 1.5, my + ny * off * 1.5];
    return `<path d="M${p1[0]},${p1[1]} Q${c[0]},${c[1]} ${p2[0]},${p2[1]}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" opacity="${k}"/>`
      + TX(lp[0], lp[1] + 4, lab, { anchor: 'middle', fs: 15, c: col, op: k });
  };

  const VBX = [120, 220, 320], VBW = 84;
  const vbHead = (y) => VBX.map((x, i) =>
    TX(x, y, ['x', 'y', 'z'][i], { anchor: 'middle', fs: 15, c: GREY })).join('');
  const vbRow = (y, cells, o = {}) => {
    let g = '';
    cells.forEach((t, i) => {
      if (t === null) return;
      const on = (o.hi || []).indexOf(i) >= 0;
      g += BOX(VBX[i] - VBW / 2, y, VBW, 38, { r: 10,
        fill: on ? (o.fill || 'rgba(5,150,105,.14)') : '#fbfcfe',
        stroke: on ? (o.col || GRN) : '#dce3ee', sw: on ? 2.2 : 1.6 });
      g += TX(VBX[i], y + 26, t, { anchor: 'middle', fs: o.fs || 19, c: o.tc || INK });
    });
    for (let i = 0; i < 2; i++) {
      if (cells[i] !== null && cells[i + 1] !== null)
        g += TX((VBX[i] + VBX[i + 1]) / 2, y + 26, ':', { anchor: 'middle', fs: 20, c: GREY });
    }
    return g;
  };
  const vbRule = (y) => SV.seg(56, y, 384, y, '#c3cddd', 2);
  const vbTag = (y, t, c) => TX(50, y + 26, t, { anchor: 'end', fs: 14, c: c || GREY });

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

  window.DECK.push({
    ch: 1,
    title: '相似形與三角比',
    color: C,
    sections: ['1-1 連比例', '1-2 比例線段', '1-3 縮放與相似', '1-4 相似三角形的應用'],
    slides: [

      {
        sec: '1-1', secName: '連比例',
        title: '1:2:3 是「配方」，煮多煮少都要照這個比',
        points: [
          '連比講的是<b>份數</b>，不是實際有多少。',
          '份數不變，<b>味道就不變</b>；要煮多少都可以。'
        ],
        formula: { label: '連比的讀法<span class="pgref">課本 印 8–9</span>', tex: 'a:b:c\\quad\\text{讀作 }a\\text{ 比 }b\\text{ 比 }c' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>煮 <span class="ival" id="tv">4</span> 倍</label>
            <input type="range" id="ts" min="1" max="6" step="1" value="4"></div></div>`;
          const draw = () => {
            const r = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = r;
            const P = [1, 2, 3], NAME = ['冰糖', '醬油', '米酒'];
            const SOY = '#78350f';
            const CO = [AMB, SOY, BLU];
            let s = '';
            s += TX(220, 34, '冰糖 : 醬油 : 米酒 ＝ 1 : 2 : 3', { anchor: 'middle', fs: 17, c: INK });

            const u = 42, W = 6 * u, X0 = (440 - W) / 2;
            let x = X0;
            P.forEach((p, i) => {
              for (let j = 0; j < p; j++) {
                s += BOX(x + j * u + 1.5, 56, u - 3, 34, { r: 5, fill: CO[i], stroke: CO[i], sw: 0 });
                s += TX(x + j * u + u / 2, 80, r, { anchor: 'middle', fs: 15, c: '#fff' });
              }
              s += TX(x + p * u / 2, 110, NAME[i], { anchor: 'middle', fs: 13, c: CO[i] });
              s += TX(x + p * u / 2, 132, p + ' 份', { anchor: 'middle', fs: 14, c: CO[i] });
              x += p * u;
            });
            s += TX(220, 166, '一共 1＋2＋3 ＝ 6 份', { anchor: 'middle', fs: 15, c: GREY });
            s += BOX(88, 182, 264, 42, { r: 11, fill: 'rgba(37,99,235,.08)', stroke: BLU, sw: 2 });
            s += TX(220, 210, '煮 ' + r + ' 倍　→　每一份 ＝ ' + r + ' 匙', { anchor: 'middle', fs: 17, c: BLU });
            s += TX(220, 248, NAME[0] + ' ' + r + ' 匙　' + NAME[1] + ' ' + 2 * r + ' 匙　' + NAME[2] + ' ' + 3 * r + ' 匙',
              { anchor: 'middle', fs: 15, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 440 264', s);
          };
          h.querySelector('#ts').oninput = draw;
          draw();
        },
        caption: '拖滑桿煮多一點，<b>比例不變</b>，味道就不變。',
        example: {
          q: '配方 \\(1:2:3\\)，要煮 \\(5\\) 倍。米酒要幾匙？',
          steps: [
            '米酒是 \\(3\\) 份，<b>份數不會變</b>。',
            '煮 \\(5\\) 倍，一份就是 \\(5\\) 匙，所以米酒 \\(=3\\times5\\)。'
          ],
          ans: '米酒 \\(15\\) 匙'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '中間已經一樣大，直接接起來',
        points: [
          '兩個比<b>上下疊起來</b>寫，x、y、z 各佔一欄。',
          '先看<b>中間那一欄</b>：上下都是 4，一樣大。',
          '一樣大就<b>什麼都不用算</b>，直接往下抄。'
        ],
        formula: { label: '最簡單的那一種<span class="pgref">課本 印 10 隨堂</span>', tex: '\\begin{array}{c}x:y=11:4,\\ y:z=4:9\\\\\\Rightarrow\\ x:y:z=11:4:9\\end{array}' },
        visual: (h) => {
          const base = () => vbHead(20)
            + vbRow(28, ['11', '4', null], { hi: [1] })
            + vbRow(70, [null, '4', '9'], { hi: [1] });
          SV.stepper(h, '0 0 440 226', [
            { t: '兩個比<b>上下疊起來</b>寫，x、y、z 各佔一欄——<b>y 要對齊 y</b>。',
              d: () => base()
                + TX(220, 148, '中間這一欄上下都是 4', { anchor: 'middle', fs: 18, c: GRN })
                + TX(220, 182, '一樣大 → 什麼都不用乘', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '一樣大就<b>直接往下抄</b>：11、4、9。',
              d: () => base() + vbRule(116)
                + vbRow(126, ['11', '4', '9'], { hi: [0, 1, 2] })
                + TX(220, 198, 'x : y : z ＝ 11 : 4 : 9', { anchor: 'middle', fs: 17, c: GRN }) }
          ], { acc: false });
        },
        caption: '這一階<b>一個計算都沒有</b>——先把「<b>y 對齊 y</b>」這個動作做熟，後面兩階都靠它。',
        example: {
          q: '\\(x:y=5:2\\)、\\(y:z=2:7\\)，求 \\(x:y:z\\)。',
          steps: [
            '中間的 \\(y\\) 兩邊都是 2，一樣大。',
            '直接接起來就好。'
          ],
          ans: '\\(x:y:z=5:2:7\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '只有一邊要乘，另一邊不用動',
        points: [
          '中間那一欄是 2 和 4：<b>4 剛好是 2 的兩倍</b>。',
          '把有 2 的<b>那一整列</b>乘 2，另一列<b>原封不動</b>抄下來。',
          '乘數寫在<b>括號裡</b>，提醒自己整列每一項都要乘。'
        ],
        formula: { label: '只動一列<span class="pgref">課本 印 10–11</span>', tex: '\\begin{array}{c}x:y=3:2,\\ y:z=4:5\\\\\\Rightarrow\\ x:y:z=6:4:5\\end{array}' },
        visual: (h) => {
          const base = () => vbHead(20)
            + vbRow(28, ['3', '2', null], { hi: [1], fill: 'rgba(217,119,6,.18)', col: AMB })
            + vbRow(70, [null, '4', '5'], { hi: [1], fill: 'rgba(217,119,6,.18)', col: AMB });
          const worked = () => vbRule(116)
            + vbTag(124, '× 2', AMB) + vbRow(124, ['(3×2)', '(2×2)', null], { fs: 15 })
            + vbTag(166, '不動') + vbRow(166, [null, '4', '5'], {});
          SV.stepper(h, '0 0 440 278', [
            { t: '中間那一欄是 2 和 4，<b>不一樣</b>——但先別急著找公倍數。',
              d: () => base()
                + TX(220, 150, '2 和 4：4 剛好是 2 的兩倍', { anchor: 'middle', fs: 18, c: AMB })
                + TX(220, 184, '只要把 2 變成 4 就好', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '<b>只動一列</b>：有 2 的那一列整列乘 2，另一列原封不動抄下來。',
              d: () => base() + worked() },
            { t: '兩列的 y 都是 4 了，接起來：6 : 4 : 5。',
              d: () => base() + worked() + vbRule(212)
                + vbRow(220, ['6', '4', '5'], { hi: [0, 1, 2] }) }
          ], { acc: false });
        },
        caption: '先問一句：<b>大的那個是不是小的倍數？</b>是的話只動一列——橫線下面另一列照抄。',
        example: {
          q: '\\(x:y=1:3\\)、\\(y:z=6:5\\)，求 \\(x:y:z\\)。',
          steps: [
            '中間是 3 和 6，\\(6\\) 是 \\(3\\) 的兩倍。',
            '左邊整列乘 \\(2\\)：\\(1:3\\to2:6\\)，右邊不動。'
          ],
          ans: '\\(x:y:z=2:6:5\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '兩邊都要乘：中間先湊成最小公倍數',
        points: [
          '中間那一欄是 4 和 6，<b>誰也不是誰的倍數</b>。',
          '取<b>最小公倍數 12</b>：兩列都要動，一列乘 3、一列乘 2。',
          '乘數寫在<b>括號裡</b>；<b>橫線下面空一列，就是漏乘了</b>。'
        ],
        formula: { label: '合併的關鍵<span class="pgref">課本 印 10–11</span>', tex: '\\begin{array}{c}x:y=3:4,\\ y:z=6:7\\\\\\Rightarrow\\ x:y:z=9:12:14\\end{array}' },
        visual: (h) => {
          const base = () => vbHead(20)
            + vbRow(28, ['3', '4', null], { hi: [1], fill: 'rgba(217,119,6,.18)', col: AMB })
            + vbRow(70, [null, '6', '7'], { hi: [1], fill: 'rgba(217,119,6,.18)', col: AMB });
          const worked = () => vbRule(116)
            + vbTag(124, '× 3', AMB) + vbRow(124, ['(3×3)', '(4×3)', null], { fs: 15 })
            + vbTag(166, '× 2', AMB) + vbRow(166, [null, '(6×2)', '(7×2)'], { fs: 15 });
          SV.stepper(h, '0 0 440 278', [
            { t: '中間那一欄是 4 和 6，不一樣，而且<b>誰也不是誰的倍數</b>。',
              d: () => base()
                + TX(220, 150, '4 和 6 的最小公倍數是 12', { anchor: 'middle', fs: 18, c: AMB })
                + TX(220, 184, '兩列都要動', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '上面那列整列乘 3、下面那列整列乘 2，<b>乘數寫在括號裡</b>。',
              d: () => base() + worked() },
            { t: '兩列的 y 都變成 12，接起來：9 : 12 : 14。',
              d: () => base() + worked() + vbRule(212)
                + vbRow(220, ['9', '12', '14'], { hi: [0, 1, 2] }) }
          ], { acc: false });
        },
        caption: '<b>巡堂就看這個</b>：沒有用直式兩列對齊的，錯的多半不是計算，是漏乘。',
        example: {
          q: '\\(x:y=2:5\\)、\\(y:z=3:4\\)，求 \\(x:y:z\\)。',
          steps: [
            '中間是 5 和 3，最小公倍數是 \\(15\\)。',
            '左邊整列乘 \\(3\\) 變 \\(6:15\\)，右邊整列乘 \\(5\\) 變 \\(15:20\\)。'
          ],
          ans: '\\(x:y:z=6:15:20\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: 'x ＝ 2y 讀成「一個 x 換得到兩個 y」',

        points: [
          '等號的意思是<b>兩邊一樣多</b>：一個 \\(x\\) 換得到兩個 \\(y\\)。',
          '換得到比較多的那個<b>比較大</b>——所以 \\(x\\) 比 \\(y\\) 大。',
          '不確定就<b>代一個數</b>：\\(y=1\\) 就 \\(x=2\\)。'
        ],

        formula: { label: '等號在說什麼', tex: 'x=2y\\ (x,y>0)\\ \\Rightarrow\\ x>y' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>\\(y\\) ＝ <span class="ival" id="yv">3</span></label>
            <input type="range" id="ys" min="1" max="9" step="1" value="3"></div></div>`;
          const draw = () => {
            const y = +h.querySelector('#ys').value;
            h.querySelector('#yv').textContent = y;
            const u = 17, X0 = 80, HH = 34;
            let s = TX(220, 26, 'x ＝ 2y', { anchor: 'middle', fs: 20, c: INK });

            s += TX(72, 78, 'x', { anchor: 'end', fs: 17, c: BLU });
            s += BOX(X0, 58, 2 * y * u, HH, { r: 8, fill: 'rgba(37,99,235,.16)', stroke: BLU, sw: 2.2 });
            s += TX(X0 + y * u, 81, String(2 * y), { anchor: 'middle', fs: 18, c: BLU });

            s += TX(72, 136, 'y', { anchor: 'end', fs: 17, c: AMB });
            for (let i = 0; i < 2; i++) {
              s += BOX(X0 + i * y * u + (i ? 2 : 0), 116, y * u - (i ? 2 : 2), HH,
                { r: 8, fill: 'rgba(217,119,6,.16)', stroke: AMB, sw: 2.2 });
              s += TX(X0 + i * y * u + y * u / 2, 139, String(y), { anchor: 'middle', fs: 18, c: AMB });
            }
            s += TX(220, 180, '一個 x 的長度 ＝ 兩個 y 接起來', { anchor: 'middle', fs: 15, c: GREY });

            s += TX(220, 260, '（這一頁的 x、y 都是正數）', { anchor: 'middle', fs: 13.5, c: GREY });
            s += BOX(96, 196, 248, 48, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 });
            s += TX(220, 226, 'x ＝ ' + (2 * y) + ' ＞ y ＝ ' + y + '，x 比較大', { anchor: 'middle', fs: 18, c: GRN });
            h.querySelector('#fig').innerHTML = svg('0 0 440 274', s);
          };
          h.querySelector('#ys').oninput = draw;
          draw();
          MJ(h);
        },
        caption: '⚠ 看到 \\(2y\\) 就說「\\(y\\) 比較大」是最常見的錯——那個 <b>2 是個數</b>，不是 \\(y\\) 本身變大。',
        example: {
          q: '\\(x=3y\\)（\\(x\\)、\\(y\\) 都是正數），誰比較大？大幾倍？',
          steps: [
            '一個 \\(x\\) 換得到<b>三個</b> \\(y\\)。',
            '代 \\(y=1\\)：\\(x=3\\)。'
          ],
          ans: '\\(x\\) 比較大，是 \\(y\\) 的 \\(3\\) 倍'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '3x ＝ 4y：切得越多，每一份越小',
        points: [
          '兩邊一樣多：<b>3 個 \\(x\\)</b> 和 <b>4 個 \\(y\\)</b> 一樣長。',
          '同樣長，<b>切得越多每一份越小</b> → \\(x\\) 比 \\(y\\) 大。',
          '取 \\(12\\) 當共同長度：\\(x=4\\)、\\(y=3\\)，所以 \\(x:y=4:3\\)。'
        ],

        formula: { label: '由等式求比<span class="pgref">課本 印 13</span>', tex: '3x=4y\\ \\Rightarrow\\ x:y=4:3' },
        visual: (h) => {
          const X0 = 96, W = 296, HH = 36, YA = 64, YB = 134;
          const bar = (y, n, col, fill, nums) => {
            let g = BOX(X0, y, W, HH, { r: 8, fill: fill, stroke: col, sw: 2.2 });
            for (let i = 1; i < n; i++) g += SV.seg(X0 + i * W / n, y, X0 + i * W / n, y + HH, col, 2);
            if (nums) for (let i = 0; i < n; i++)
              g += TX(X0 + (i + 0.5) * W / n, y + 25, nums, { anchor: 'middle', fs: 18, c: col });
            return g;
          };
          const labels = () => TX(88, YA + 24, '3 個 x', { anchor: 'end', fs: 15, c: BLU })
            + TX(88, YB + 24, '4 個 y', { anchor: 'end', fs: 15, c: AMB });

          const prem = () => TX(220, 262, '（這一頁的 x、y 都是正數）', { anchor: 'middle', fs: 13.5, c: GREY });
          SV.stepper(h, '0 0 440 276', [

            { t: '3x ＝ 4y 的意思是：<b>3 個 x</b> 和 <b>4 個 y</b> 一樣多。兩條畫成一樣長。',
              d: () => TX(220, 30, '3x ＝ 4y', { anchor: 'middle', fs: 20, c: INK }) + labels()
                + bar(YA, 1, BLU, 'rgba(37,99,235,.12)') + bar(YB, 1, AMB, 'rgba(217,119,6,.12)')
                + TX(220, 202, '兩條一樣長', { anchor: 'middle', fs: 17, c: GRN }) + prem() },
            { t: '上面那條切成 <b>3 段</b>，下面那條切成 <b>4 段</b>。',
              d: () => TX(220, 30, '3x ＝ 4y', { anchor: 'middle', fs: 20, c: INK }) + labels()
                + bar(YA, 3, BLU, 'rgba(37,99,235,.12)') + bar(YB, 4, AMB, 'rgba(217,119,6,.12)')
                + TX(220, 202, '一樣長，卻切得比較多 → 每一段比較短', { anchor: 'middle', fs: 16, c: RED })
                + TX(220, 230, '所以 x 比 y 大', { anchor: 'middle', fs: 17, c: INK }) + prem() },
            { t: '兩條都取 <b>12</b>：上面每段 12 ÷ 3 ＝ 4，下面每段 12 ÷ 4 ＝ 3。',
              d: () => TX(220, 30, '兩條都取 12', { anchor: 'middle', fs: 19, c: AMB }) + labels()
                + bar(YA, 3, BLU, 'rgba(37,99,235,.12)', '4') + bar(YB, 4, AMB, 'rgba(217,119,6,.12)', '3')
                + TX(220, 202, 'x ＝ 4，y ＝ 3', { anchor: 'middle', fs: 18, c: INK })
                + TX(220, 230, '（4×3 ＝ 12、3×4 ＝ 12，兩邊都是 12）', { anchor: 'middle', fs: 14, c: GREY }) + prem() },
            { t: '寫成比：x : y ＝ 4 : 3。<b>係數對調</b>了。',
              d: () => BOX(104, 68, 232, 56, { r: 13, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.4 })
                + TX(220, 104, 'x : y ＝ 4 : 3', { anchor: 'middle', fs: 26, c: GRN })
                + TX(220, 158, '不是 3 : 4', { anchor: 'middle', fs: 20, c: RED })
                + TX(220, 200, '3x ＝ 4y 的 3 和 4 是「幾段」，', { anchor: 'middle', fs: 15, c: GREY })
                + TX(220, 226, '段數多的那個，每段反而小', { anchor: 'middle', fs: 15, c: GREY }) + prem() }
          ], { acc: false });
        },
        caption: '口訣是「<b>係數對調</b>」，但一定要先看過切段圖再用——不然很容易反過來寫成 \\(3:4\\)。',
        example: {
          q: '\\(5b=4c\\)，求 \\(b:c\\)。',
          steps: [
            '\\(5\\) 個 \\(b\\) 和 \\(4\\) 個 \\(c\\) 一樣長。',
            '兩條都取 \\(20\\)：\\(b=20\\div5=4\\)、\\(c=20\\div4=5\\)。'
          ],
          ans: '\\(b:c=4:5\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: 'x／4 ＝ y／5：先交叉相乘',
        points: [
          '分數不好比大小，先<b>把分母消掉</b>：這個動作叫<b>交叉相乘</b>。',
          '\\(\\frac{x}{4}=\\frac{y}{5}\\) 交叉相乘得 \\(5x=4y\\)——<b>回到上一頁那種等式</b>。',
          '再用上一頁的<b>係數對調</b>：\\(x:y=4:5\\)。'
        ],
        formula: { label: '分數等式求比<span class="pgref">課本 印 13</span>', tex: '\\tfrac{x}{4}=\\tfrac{y}{5}\\ \\Rightarrow\\ x:y=4:5' },
        visual: (h) => {

          const FR = (cx, num, den, cn, cd) => TX(cx, 52, num, { anchor: 'middle', fs: 24, c: cn || INK })
            + SV.seg(cx - 24, 62, cx + 24, 62, INK, 2)
            + TX(cx, 92, den, { anchor: 'middle', fs: 24, c: cd || INK });
          const eq = () => FR(128, 'x', '4', BLU, AMB) + TX(220, 72, '＝', { anchor: 'middle', fs: 20, c: GREY })
            + FR(312, 'y', '5', GRN, VIO);
          const prem = () => TX(220, 268, '（這一頁的 x、y 都是正數）', { anchor: 'middle', fs: 13.5, c: GREY });
          SV.stepper(h, '0 0 440 282', [
            { t: '兩邊都是分數，分母又不一樣——先想辦法<b>把分母消掉</b>。',
              d: () => eq() + TX(220, 140, '分母 4 和 5 擋在那裡', { anchor: 'middle', fs: 17, c: GREY })
                + TX(220, 170, '先把它們消掉再說', { anchor: 'middle', fs: 17, c: INK }) + prem() },
            { t: '<b>交叉相乘</b>：分子乘對面的分母，兩條線交叉。',
              d: () => eq()

                + SV.seg(139, 46, 301, 82, AMB, 2.6) + SV.seg(139, 82, 301, 46, VIO, 2.6)
                + '<ellipse cx="220" cy="64" rx="19" ry="15" fill="#fafbfd"/>'
                + TX(220, 72, '＝', { anchor: 'middle', fs: 20, c: GREY })
                + TX(220, 158, 'x 乘 5、y 乘 4', { anchor: 'middle', fs: 18, c: INK })

                + TX(220, 190, '和因式分解的「十字交乘」不是同一件事', { anchor: 'middle', fs: 14.5, c: GREY }) + prem() },
            { t: '得到 5x ＝ 4y——<b>這就是上一頁那種等式</b>。',
              d: () => BOX(128, 44, 184, 56, { r: 13, fill: 'rgba(37,99,235,.10)', stroke: BLU, sw: 2.4 })
                + TX(220, 80, '5x ＝ 4y', { anchor: 'middle', fs: 26, c: BLU })
                + TX(220, 140, '上一頁：3x ＝ 4y → 係數對調', { anchor: 'middle', fs: 16, c: GREY })
                + TX(220, 172, '同一招再用一次就好', { anchor: 'middle', fs: 17, c: INK }) + prem() },
            { t: '係數對調：x : y ＝ 4 : 5。<b>剛好就是原來的兩個分母</b>。',
              d: () => BOX(104, 44, 232, 56, { r: 13, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.4 })
                + TX(220, 80, 'x : y ＝ 4 : 5', { anchor: 'middle', fs: 26, c: GRN })
                + TX(220, 134, '5x ＝ 4y 的 5 和 4 對調', { anchor: 'middle', fs: 16, c: GREY })
                + TX(220, 166, '課本寫「分母照抄」，就是這個結果', { anchor: 'middle', fs: 16, c: INK })
                + TX(220, 202, '驗算：x ＝ 4、y ＝ 5 代回 4／4 ＝ 5／5 ✓', { anchor: 'middle', fs: 15, c: GRN })
                + prem() }
          ], { acc: false });
        },
        caption: '課本（印 13）直接寫「<b>分母照抄</b>」；這一頁是說明<b>為什麼</b>——交叉相乘之後，就是上一頁那一招。',
        example: {
          q: '\\(\\frac{a}{3}=\\frac{b}{7}\\)，求 \\(a:b\\)。',
          steps: [
            '交叉相乘：\\(7a=3b\\)。',
            '係數對調：\\(a:b=3:7\\)（就是兩個分母）。'
          ],
          ans: '\\(a:b=3:7\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '三個分數連等：拆成兩句，再用直式接起來',
        points: [
          '\\(\\frac{x}{4}=\\frac{y}{5}=\\frac{z}{7}\\) 太長，先<b>拆成兩句</b>：\\(\\frac{x}{4}=\\frac{y}{5}\\)、\\(\\frac{y}{5}=\\frac{z}{7}\\)。',
          '各自求比（上一頁那一招）：\\(x:y=4:5\\)、\\(y:z=5:7\\)。',
          '中間的 \\(y\\) 上下都是 \\(5\\)，<b>直接接起來</b>：\\(x:y:z=4:5:7\\)。'
        ],
        formula: { label: '拆兩句再接起來<span class="pgref">課本 印 13 同型</span>', tex: 'x:y=4:5,\\ y:z=5:7\\ \\Rightarrow\\ 4:5:7' },
        visual: (h) => {
          const FR = (cx, cy, num, den, cn, cd) => TX(cx, cy, num, { anchor: 'middle', fs: 20, c: cn || INK })
            + SV.seg(cx - 20, cy + 8, cx + 20, cy + 8, INK, 1.8)
            + TX(cx, cy + 34, den, { anchor: 'middle', fs: 20, c: cd || INK });
          const prem = () => TX(220, 268, '（這一頁的 x、y、z 都是正數）', { anchor: 'middle', fs: 13.5, c: GREY });
          SV.stepper(h, '0 0 440 282', [
            { t: '三個分數都相等。<b>先拆成兩句</b>——每一句只管兩個字母。',
              d: () => FR(120, 40, 'x', '4', BLU, AMB) + TX(170, 66, '＝', { anchor: 'middle', fs: 20, c: INK })
                + FR(220, 40, 'y', '5', GRN, VIO) + TX(270, 66, '＝', { anchor: 'middle', fs: 20, c: INK })
                + FR(320, 40, 'z', '7', RED, AMB)
                + TX(140, 150, 'x／4 ＝ y／5', { anchor: 'middle', fs: 19, c: BLU })
                + TX(300, 150, 'y／5 ＝ z／7', { anchor: 'middle', fs: 19, c: GRN })
                + TX(220, 190, '拆成兩句，中間的 y 兩句都有', { anchor: 'middle', fs: 16, c: GREY }) + prem() },
            { t: '每一句各自求比——就是上一頁的<b>交叉相乘、係數對調</b>。',
              d: () => TX(140, 60, 'x／4 ＝ y／5', { anchor: 'middle', fs: 18, c: GREY })
                + TX(300, 60, 'y／5 ＝ z／7', { anchor: 'middle', fs: 18, c: GREY })
                + TX(220, 96, '↓', { anchor: 'middle', fs: 18, c: GREY })
                + BOX(56, 112, 160, 48, { r: 12, fill: 'rgba(37,99,235,.10)', stroke: BLU, sw: 2.2 })
                + TX(136, 143, 'x : y ＝ 4 : 5', { anchor: 'middle', fs: 20, c: BLU })
                + BOX(224, 112, 160, 48, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(304, 143, 'y : z ＝ 5 : 7', { anchor: 'middle', fs: 20, c: GRN })
                + TX(220, 196, '兩個比都拿到了，接下來就是直式', { anchor: 'middle', fs: 16, c: INK }) + prem() },
            { t: '上下疊起來，<b>y 要對齊 y</b>：中間這一欄上下都是 5。',
              d: () => vbHead(24) + vbRow(32, ['4', '5', null], { hi: [1] })
                + vbRow(74, [null, '5', '7'], { hi: [1] })
                + TX(220, 152, '中間這一欄上下都是 5', { anchor: 'middle', fs: 18, c: GRN })
                + TX(220, 184, '一樣大 → 什麼都不用乘（階梯①）', { anchor: 'middle', fs: 16, c: GREY }) + prem() },
            { t: '直接往下抄：x : y : z ＝ 4 : 5 : 7。',
              d: () => vbHead(24) + vbRow(32, ['4', '5', null], { hi: [1] })
                + vbRow(74, [null, '5', '7'], { hi: [1] }) + vbRule(120)
                + vbRow(130, ['4', '5', '7'], { hi: [0, 1, 2] })
                + TX(220, 200, '剛好就是三個分母，抄下來就對了', { anchor: 'middle', fs: 16, c: INK })
                + TX(220, 232, '驗算：4／4 ＝ 5／5 ＝ 7／7 ＝ 1 ✓', { anchor: 'middle', fs: 15, c: GRN }) + prem() }
          ], { acc: false });
        },
        caption: '⚠ 這一頁<b>問的是比</b>。同樣看到分數、但問「x、y、z 各是多少」的，要走後面<b>設 r</b> 那一頁。',
        example: {
          q: '\\(\\frac{x}{2}=\\frac{y}{3}=\\frac{z}{4}\\)，求 \\(x:y:z\\)。',
          steps: [
            '拆兩句：\\(\\frac{x}{2}=\\frac{y}{3}\\)、\\(\\frac{y}{3}=\\frac{z}{4}\\)。',
            '各自求比：\\(x:y=2:3\\)、\\(y:z=3:4\\)；中間都是 \\(3\\)。'
          ],
          ans: '\\(x:y:z=2:3:4\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '比不能每項各加一個數，加了就變成別的比',
        points: [
          '每一項<b>同乘</b>或<b>同除</b>一個數，比不變。',
          '每一項<b>同加</b>或<b>同減</b>，比就<b>變了</b>。'
        ],
        formula: { label: '可以做的只有乘除<span class="pgref">課本 印 19 運算性質</span>', tex: '\\begin{array}{c}a:b:c=2a:2b:2c\\\\a:b:c\\ne(a+1):(b+1):(c+1)\\end{array}' },
        visual: (h) => {
          const bar = (y, vals, co, lab) => {
            const u = 300 / 12; let x = 66, s = TX(56, y + 22, lab, { anchor: 'end', fs: 14, c: GREY });
            vals.forEach((v, i) => {
              s += BOX(x, y, v * u, 30, { r: 6, fill: co[i], stroke: co[i], sw: 0 });
              s += TX(x + v * u / 2, y + 21, v, { anchor: 'middle', fs: 14, c: '#fff' });
              x += v * u + 4;
            });
            return s;
          };
          const CO = [BLU, GRN, AMB];
          SV.stepper(h, '0 0 440 262', [
            { t: '原本的比是 3 : 2 : 1。',
              d: () => bar(56, [3, 2, 1], CO, '原本') +
                       TX(220, 150, '3 : 2 : 1', { anchor: 'middle', fs: 22, c: INK }) },
            { t: '每一項都<b>乘 2</b>：長度都變兩倍，看起來還是同一個比。',
              d: () => bar(56, [3, 2, 1], CO, '原本') + bar(112, [6, 4, 2], CO, '各乘2') +
                       BOX(110, 168, 220, 46, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 }) +
                       TX(220, 198, '6 : 4 : 2 ＝ 3 : 2 : 1 ✓', { anchor: 'middle', fs: 18, c: GRN }) },
            { t: '每一項都<b>加 1</b>：比例整個跑掉了，不再是原來的比。',
              d: () => bar(56, [3, 2, 1], CO, '原本') + bar(112, [4, 3, 2], [RED, RED, RED], '各加1') +
                       BOX(110, 168, 220, 46, { r: 12, fill: 'rgba(225,29,72,.09)', stroke: RED, sw: 2.2 }) +
                       TX(220, 198, '4 : 3 : 2 ≠ 3 : 2 : 1 ✗', { anchor: 'middle', fs: 18, c: RED }) },
            { t: '用份數想就很清楚：原本大的是小的 3 倍，加完只剩 2 倍。',
              d: () => TX(220, 60, '原本：3 份 vs 1 份 → 3 倍', { anchor: 'middle', fs: 18, c: GRN }) +
                       TX(220, 108, '各加 1：4 份 vs 2 份 → 只剩 2 倍', { anchor: 'middle', fs: 18, c: RED }) +
                       TX(220, 168, '倍數變了，就不是同一個比', { anchor: 'middle', fs: 18, c: INK }) }
          ], { acc: false });
        },
        caption: '記一句話：<b>比只能乘除，不能加減</b>。',
        example: {
          q: '\\(a:b=3:2\\)，兩人各多拿 1 個後還是 \\(3:2\\) 嗎？',
          steps: [
            '原本 3 份對 2 份。',
            '各加 1 變成 4 對 3，\\(4:3\\ne3:2\\)。'
          ],
          ans: '不是，比會變'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '分錢分東西：先算一份多少，再乘回去',
        points: [
          '固定三步：<b>加總份數 → 一份多少 → 各乘份數</b>。',
          '算完把三個答案<b>加回去</b>，要等於總量。'
        ],
        formula: { label: '每一份都是 k<span class="pgref">課本 印 16 例 5</span>', tex: 'a=7k,\\ b=3k,\\ c=2k' },
        visual: (h) => {
          const money = (y, t, v, c) => TX(220, y, t + ' ＝ ' + v + ' 元', { anchor: 'middle', fs: 18, c: c });
          SV.stepper(h, '0 0 440 262', [
            { t: '每月收入 72000 元，按 7 : 3 : 2 分成生活費、儲蓄、投資。',
              d: () => TX(220, 56, '收入 72000 元', { anchor: 'middle', fs: 20, c: INK }) +
                       TX(220, 100, '生活費 : 儲蓄 : 投資', { anchor: 'middle', fs: 16, c: GREY }) +
                       TX(220, 134, '7 : 3 : 2', { anchor: 'middle', fs: 24, c: BLU }) },
            { t: '第一步：<b>加總份數</b>。7＋3＋2 ＝ 12 份。',
              d: () => TX(220, 70, '7 ＋ 3 ＋ 2 ＝ 12', { anchor: 'middle', fs: 24, c: AMB }) +
                       TX(220, 118, '整筆錢被分成 12 份', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '第二步：<b>一份多少</b>。72000 ÷ 12 ＝ 6000 元。',
              d: () => TX(220, 70, '72000 ÷ 12 ＝ 6000', { anchor: 'middle', fs: 23, c: AMB }) +
                       BOX(140, 100, 160, 46, { r: 12, fill: 'rgba(217,119,6,.12)', stroke: AMB, sw: 2.2 }) +
                       TX(220, 130, '一份 ＝ 6000 元', { anchor: 'middle', fs: 18, c: AMB }) },
            { t: '第三步：<b>各乘份數</b>，再加回去檢查。',
              d: () => money(58, '生活費 7 份', 42000, BLU) +
                       money(96, '儲蓄 3 份', 18000, GRN) +
                       money(134, '投資 2 份', 12000, VIO) +
                       `<line x1="110" y1="152" x2="330" y2="152" stroke="#c9d3e2" stroke-width="1.6"/>` +
                       TX(220, 182, '42000 ＋ 18000 ＋ 12000 ＝ 72000 ✓', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '最後一定要<b>加回去對總量</b>，這一步可以抓出大部分的計算錯。',
        example: {
          q: '48 顆糖按 \\(3:2:1\\) 分給三人，最多的拿幾顆？',
          steps: [
            '份數共 \\(3+2+1=6\\) 份。',
            '一份 \\(48\\div6=8\\) 顆，最多的是 3 份。'
          ],
          ans: '\\(3\\times8=24\\) 顆'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '「一份」還不知道是多少，就先叫它 r',
        points: [
          '上一頁的<b>一份多少</b>，在還算不出來時，先給它一個名字叫 <b>r</b>。',
          '\\(7:5:4\\) 就寫成 <b>\\(7r\\)、\\(5r\\)、\\(4r\\)</b>：份數不變，每一份都是 \\(r\\)。',
          '把條件代進去解出 \\(r\\)，再<b>乘回去</b>。'
        ],
        formula: { label: '給「一份」取個名字<span class="pgref">課本 印 16</span>', tex: 'a:b:c\\ \\Rightarrow\\ ar,\\ br,\\ cr' },
        visual: (h) => {
          const u = 20, X0 = 60, Y = 74, HH = 30;
          const P = [7, 5, 4], CO = [BLU, GRN, VIO], NM = ['籃球', '爬山', '游泳'];
          const bars = (lab) => {
            let g = '', x = X0;
            P.forEach((p, i) => {
              for (let j = 0; j < p; j++) {
                g += BOX(x + j * u + 1, Y, u - 2, HH, { r: 4, fill: CO[i], stroke: CO[i], sw: 0 });
                if (lab) g += TX(x + j * u + u / 2, Y + 21, lab, { anchor: 'middle', fs: 12, c: '#fff' });
              }
              g += TX(x + p * u / 2, Y - 10, NM[i], { anchor: 'middle', fs: 13, c: CO[i] });
              g += TX(x + p * u / 2, Y + 48, p + ' 份', { anchor: 'middle', fs: 14, c: CO[i] });
              x += p * u;
            });
            return g;
          };
          SV.stepper(h, '0 0 440 272', [
            { t: '全班 32 人，籃球 : 爬山 : 游泳 ＝ 7 : 5 : 4。先把份數畫出來。',
              d: () => TX(220, 30, '全班 32 人　7 : 5 : 4', { anchor: 'middle', fs: 19, c: INK })
                + bars('') + TX(220, 148, '一共 7 ＋ 5 ＋ 4 ＝ 16 份', { anchor: 'middle', fs: 17, c: GREY })
                + TX(220, 182, '但這時候還不知道「一份是幾個人」', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '還不知道就先給它一個名字：<b>每一格都叫 r</b>。',
              d: () => TX(220, 30, '每一格都叫 r', { anchor: 'middle', fs: 19, c: AMB })
                + bars('r')
                + TX(220, 152, '籃球 7r 人　爬山 5r 人　游泳 4r 人', { anchor: 'middle', fs: 18, c: INK })
                + TX(220, 186, '份數沒有變，只是每一份先叫 r', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '把條件代進去：全部加起來是 32 人。',
              d: () => TX(220, 44, '7r ＋ 5r ＋ 4r ＝ 32', { anchor: 'middle', fs: 22, c: INK })
                + TX(220, 88, '16r ＝ 32', { anchor: 'middle', fs: 22, c: AMB })
                + BOX(150, 110, 140, 46, { r: 12, fill: 'rgba(217,119,6,.12)', stroke: AMB, sw: 2.2 })
                + TX(220, 141, 'r ＝ 2', { anchor: 'middle', fs: 22, c: AMB })
                + TX(220, 186, '一份 ＝ 2 個人', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '再<b>乘回去</b>：7r ＝ 14、5r ＝ 10、4r ＝ 8。',
              d: () => TX(220, 44, '籃球 7×2 ＝ 14 人', { anchor: 'middle', fs: 19, c: BLU })
                + TX(220, 80, '爬山 5×2 ＝ 10 人', { anchor: 'middle', fs: 19, c: GRN })
                + TX(220, 116, '游泳 4×2 ＝ 8 人', { anchor: 'middle', fs: 19, c: VIO })
                + SV.seg(120, 136, 320, 136, '#c9d3e2', 1.6)
                + TX(220, 166, '驗算 14 ＋ 10 ＋ 8 ＝ 32 ✓', { anchor: 'middle', fs: 17, c: GRN })
                + TX(220, 206, 'r 就是「一份多少」，只是先取了名字', { anchor: 'middle', fs: 15, c: GREY }) }
          ], { acc: false });
        },
        caption: '份數法算得出來的，設 \\(r\\) 也算得出來——<b>\\(r\\) 真正的好處在下一頁</b>。',
        example: {
          q: '三角形三個內角的比是 \\(3:2:4\\)，求三個角。',
          steps: [
            '設三個角是 \\((3r)^\\circ\\)、\\((2r)^\\circ\\)、\\((4r)^\\circ\\)。',
            '內角和 \\(180^\\circ\\)：\\(9r=180\\)，\\(r=20\\)。'
          ],
          ans: '\\(60^\\circ\\)、\\(40^\\circ\\)、\\(80^\\circ\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '看到分母：x／4 ＝ y／3，分母是幾就幾個 r',
        points: [
          '\\(\\frac{x}{4}=\\frac{y}{3}=\\frac{z}{8}\\)：把它們<b>都設成 \\(r\\)</b>。',
          '\\(\\frac{x}{4}=r\\) 就是 \\(x=4r\\)——<b>分母是幾，就幾個 \\(r\\)</b>。',
          '⚠ 這裡<b>分母不用對調</b>，和 \\(3x=4y\\) 那一頁不一樣。'
        ],
        formula: { label: '分數等式直接設 r<span class="pgref">課本 印 15</span>', tex: '\\tfrac{x}{4}=r\\ \\Rightarrow\\ x=4r' },
        visual: (h) => {
          const col = (x, t, c) => BOX(x - 46, 96, 92, 44, { r: 10, fill: '#fbfcfe', stroke: '#dce3ee', sw: 1.6 })
            + TX(x, 125, t, { anchor: 'middle', fs: 19, c: c });
          SV.stepper(h, '0 0 440 280', [
            { t: '三個分數都相等。<b>把它們都設成 r</b>。',
              d: () => TX(220, 40, 'x／4 ＝ y／3 ＝ z／8', { anchor: 'middle', fs: 22, c: INK })
                + TX(220, 76, '＝ r', { anchor: 'middle', fs: 22, c: AMB })
                + TX(220, 140, '三個都等於同一個 r', { anchor: 'middle', fs: 17, c: GREY }) },
            { t: '一個一個乘回去：<b>分母是幾，就幾個 r</b>。',
              d: () => TX(220, 40, 'x／4 ＝ r　→　x ＝ 4r', { anchor: 'middle', fs: 19, c: BLU })
                + TX(220, 76, 'y／3 ＝ r　→　y ＝ 3r', { anchor: 'middle', fs: 19, c: GRN })
                + TX(220, 112, 'z／8 ＝ r　→　z ＝ 8r', { anchor: 'middle', fs: 19, c: VIO })
                + BOX(64, 134, 312, 44, { r: 12, fill: 'rgba(225,29,72,.07)', stroke: RED, sw: 2 })
                + TX(220, 162, '⚠ 分母不用對調（和 3x ＝ 4y 那頁不同）', { anchor: 'middle', fs: 15.5, c: RED }) },
            { t: '代進題目給的條件 x ＋ 2y ＋ 3z ＝ 68。',
              d: () => TX(220, 44, '4r ＋ 2×3r ＋ 3×8r ＝ 68', { anchor: 'middle', fs: 20, c: INK })
                + TX(220, 86, '4r ＋ 6r ＋ 24r ＝ 34r', { anchor: 'middle', fs: 19, c: GREY })
                + BOX(150, 108, 140, 46, { r: 12, fill: 'rgba(217,119,6,.12)', stroke: AMB, sw: 2.2 })
                + TX(220, 139, '34r ＝ 68', { anchor: 'middle', fs: 20, c: AMB })
                + TX(220, 180, 'r ＝ 2', { anchor: 'middle', fs: 22, c: AMB }) },
            { t: '乘回去就得到三個數。',
              d: () => col(110, 'x ＝ 8', BLU) + col(220, 'y ＝ 6', GRN) + col(330, 'z ＝ 16', VIO)
                + TX(220, 60, 'x ＝ 4×2　y ＝ 3×2　z ＝ 8×2', { anchor: 'middle', fs: 17, c: GREY })
                + TX(220, 186, '驗算 8 ＋ 2×6 ＋ 3×16 ＝ 68 ✓', { anchor: 'middle', fs: 17, c: GRN })
                + TX(220, 224, '⚠ 這種條件不是「總共多少」，份數法做不了', { anchor: 'middle', fs: 15, c: RED }) }
          ], { acc: false });
        },
        caption: '⚠ <b>係數要對調、分母不用對調</b>——這是最容易搞混的一組，兩頁擺在一起講。',
        example: {
          q: '\\(\\frac{x}{2}=\\frac{y}{3}=\\frac{z}{4}\\)，且 \\(2x-y+3z=65\\)，求 \\(x\\)、\\(y\\)、\\(z\\)。',
          steps: [
            '設比值為 \\(r\\)，則 \\(x=2r\\)、\\(y=3r\\)、\\(z=4r\\)。',
            '代入：\\(4r-3r+12r=13r=65\\)，\\(r=5\\)。'
          ],
          ans: '\\(x=10\\)、\\(y=15\\)、\\(z=20\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '同一件事的三種寫法（課本節末）',
        points: [
          '\\(x:y:z=2:3:5\\)、\\(\\frac{x}{2}=\\frac{y}{3}=\\frac{z}{5}\\)、\\(x=2r,\\ y=3r,\\ z=5r\\)：<b>三句話意思一樣</b>。',
          '題目給哪一種，就<b>換成好算的那一種</b>——要「比」用第一種，要「算出數值」用第三種。',
          '⚠ 前提：<b>比的三個數都不是 \\(0\\)</b>，\\(r\\) 也不是 \\(0\\)。'
        ],
        formula: { label: '三種寫法同一件事<span class="pgref">課本 1-1 節末整理</span>', tex: 'x:y:z=2:3:5\\ \\Leftrightarrow\\ \\tfrac{x}{2}=\\tfrac{y}{3}=\\tfrac{z}{5}' },
        visual: (h) => {
          const FR3 = (y) => {
            const F = (cx, num, den, c) => TX(cx, y, num, { anchor: 'middle', fs: 19, c: c })
              + SV.seg(cx - 17, y + 8, cx + 17, y + 8, INK, 1.7)
              + TX(cx, y + 32, den, { anchor: 'middle', fs: 19, c: c });
            return F(150, 'x', '2', BLU) + TX(196, y + 22, '＝', { anchor: 'middle', fs: 17, c: GREY })
              + F(240, 'y', '3', GRN) + TX(286, y + 22, '＝', { anchor: 'middle', fs: 17, c: GREY })
              + F(330, 'z', '5', VIO);
          };
          const tag = (y, n) => TX(44, y, n, { anchor: 'middle', fs: 15, c: AMB });
          const prem = () => TX(220, 266, '（2、3、5 都不是 0，r 也不是 0）', { anchor: 'middle', fs: 13.5, c: GREY });
          SV.stepper(h, '0 0 440 280', [
            { t: '第一種：<b>比</b>。題目最常這樣給。',
              d: () => tag(78, '①') + BOX(76, 52, 300, 46, { r: 12, fill: 'rgba(37,99,235,.10)', stroke: BLU, sw: 2.2 })
                + TX(226, 84, 'x : y : z ＝ 2 : 3 : 5', { anchor: 'middle', fs: 23, c: BLU })
                + TX(220, 150, '「x 佔 2 份、y 佔 3 份、z 佔 5 份」', { anchor: 'middle', fs: 16, c: GREY }) + prem() },
            { t: '第二種：<b>分數</b>。比的三個數，就是三個分母。',
              d: () => tag(78, '①') + TX(226, 84, 'x : y : z ＝ 2 : 3 : 5', { anchor: 'middle', fs: 19, c: GREY })
                + tag(160, '②') + FR3(138)
                + TX(220, 214, '分母 2、3、5 就是比的三個數', { anchor: 'middle', fs: 16, c: INK }) + prem() },
            { t: '第三種：<b>設 r</b>。要算出「各是多少」時最好用。',
              d: () => tag(60, '②') + FR3(38)
                + tag(140, '③') + BOX(76, 116, 300, 46, { r: 12, fill: 'rgba(217,119,6,.12)', stroke: AMB, sw: 2.2 })
                + TX(226, 148, 'x ＝ 2r，y ＝ 3r，z ＝ 5r', { anchor: 'middle', fs: 20, c: AMB })
                + TX(220, 206, '前面那一頁就是在做這件事', { anchor: 'middle', fs: 16, c: GREY }) + prem() },
            { t: '<b>三句話是同一件事</b>——題目給哪一種，就換成好算的那一種。',
              d: () => tag(52, '①') + TX(226, 58, 'x : y : z ＝ 2 : 3 : 5', { anchor: 'middle', fs: 18, c: BLU })
                + tag(104, '②') + TX(226, 110, 'x／2 ＝ y／3 ＝ z／5', { anchor: 'middle', fs: 18, c: GRN })
                + tag(156, '③') + TX(226, 162, 'x ＝ 2r，y ＝ 3r，z ＝ 5r', { anchor: 'middle', fs: 18, c: AMB })
                + BOX(60, 186, 320, 54, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 208, '要「比」→ 用 ①　　要「算出數值」→ 用 ③', { anchor: 'middle', fs: 15, c: INK })
                + TX(220, 232, '題目給分數 ② → 先換成 ① 或 ③', { anchor: 'middle', fs: 15, c: GRN })
                + prem() }
          ], { acc: false });
        },
        caption: '課本節末把三種寫法列在一起。<b>前面三頁各自講過怎麼來的</b>，這一頁只要記得「它們是同一件事」。',
        example: {
          q: '\\(x:y:z=4:5:7\\)，把它改寫成分數與 \\(r\\) 兩種寫法。',
          steps: [
            '分數：比的三個數就是分母 → \\(\\frac{x}{4}=\\frac{y}{5}=\\frac{z}{7}\\)。',
            '設 \\(r\\)：\\(x=4r\\)、\\(y=5r\\)、\\(z=7r\\)。'
          ],
          ans: '\\(\\frac{x}{4}=\\frac{y}{5}=\\frac{z}{7}\\)；\\(x=4r,\\ y=5r,\\ z=7r\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '最常錯的四件事',
        points: [
          '把份數當實際數量，是這一節最常見的錯。',

          '合併寫錯有<b>兩種</b>：\\(3:4:7\\) 是沒湊就拼，\\(9:12:7\\) 是<b>只乘一列</b>。',
          '不確定就<b>先算一份多少</b>，再往下做。'
        ],
        formula: { label: '先問這一句<span class="pgref">課本 印 19 重點回顧</span>', tex: '\\text{一份是多少？}' },
        visual: (h) => {
          h.innerHTML = xoRows([

            { tag: '份數當數量',
              bad: '24 顆糖分成 \\(a:b:c=5:3:4\\)<br>所以 \\(a=5\\) 顆',
              good: '一份 ＝ \\(24\\div12=2\\) 顆<br>\\(a=5\\times2=10\\) 顆<br>驗算 \\(10+6+8=24\\) ✓' },
            { tag: '直接拼起來',
              bad: '\\(x:y=3:4\\)、\\(y:z=6:7\\)<br>拼成 \\(3:4:7\\)',
              good: '中間要先湊成一樣<br>答案是 \\(9:12:14\\)' },

            { tag: '只乘一列',
              bad: '同一題：左邊乘 3 得 \\(9:12\\)<br>右邊<b>忘了乘</b>，寫成 \\(9:12:7\\)',
              good: '兩列都要乘 → \\(12:14\\)<br>直式上<b>空一列＝漏乘</b>' },
            { tag: '兩個比相加',

              bad: '兩堆都 20 顆：\\(5:3:2\\) 與 \\(2:2:1\\)<br>相加寫成 \\(7:5:3\\)',
              good: '換成數量：\\(10,6,4\\)、\\(8,8,4\\)<br>相加 \\(18:14:8=9:7:4\\)' }
          ]);
          MJ(h);
        },
        caption: '每一列都先問「錯的那個少了什麼」，再講正確寫法。',
        example: {
          q: '\\(x:y=3:4\\)、\\(y:z=6:7\\)，可以直接寫成 \\(3:4:7\\) 嗎？',
          steps: [
            '中間的 \\(y\\) 一邊是 4、一邊是 6，不一樣。',
            '要先湊成 12 才能接。'
          ],
          ans: '不行，應是 \\(9:12:14\\)'
        }
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜課本隨堂（連比的意義與合併）',
        points: [
          '先看<b>共同項有沒有一樣</b>，一樣就直接接起來。',
          '不一樣就用<b>最小公倍數</b>把共同項湊成一樣再接。',
          '每一題都<b>抄到本子上</b>再算，不要只用看的。'
        ],
        formula: { label: '這一節在練', tex: 'x:y:z' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・隨堂練習', page: '印 9–11', sub: '化最簡整數比、共同項一樣就直接接', tags: ['課P9', '課P10', '課P11 第1題', '課P11 第2題'] }
          ]);
        },
        caption: '點任一題看詳解。'
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜課本隨堂（分數比與由等式求連比）',
        points: [
          '比裡出現<b>分數或小數</b>，先化成最簡整數比再合併。',
          '看到 <b>\\(x-2y=0\\)</b> 這種等式，先移項變成「誰比誰」。',
          '點任一題可以看逐行詳解。'
        ],
        formula: { label: '這一節在練', tex: 'x-2y=0\\Rightarrow x:y=2:1' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・隨堂練習', page: '印 12–13', sub: '分數比、小數比、由等式求連比', tags: ['課P12 第1題', '課P12 第2題', '課P13 第1題', '課P13 第2題'] }
          ]);
        },
        caption: '點任一題看詳解。'
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜課本隨堂（連比例式與應用）',
        points: [
          '連比例式先寫成<b>份數</b>，再算一份是多少。',
          '應用題把「誰比誰」先抄下來，不要邊讀邊算。',
          '五題都要寫過程。'
        ],
        formula: { label: '這一節在練', tex: 'a:b:c=d:e:f' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・隨堂練習', page: '印 14–18', sub: '連比例式、分配與應用', tags: ['課P14', '課P15', '課P16', '課P17', '課P18'] }
          ]);
        },
        caption: '點任一題看詳解。'
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜習作暖身題',
        points: [
          '這四題是<b>二選一</b>，先熱身，不用寫過程。',
          '每題上方有<b>概念提示</b>方塊，先看方塊再選。',
          '兩件事要站穩：<b>怎麼接兩個比</b>、<b>連比就是分數相等</b>。'
        ],
        formula: { label: '暖身重點', tex: 'x:y:z=a:b:c\\iff\\frac{x}{a}=\\frac{y}{b}=\\frac{z}{c}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・暖身題', page: '印 3', sub: '先看概念提示方塊，再選答案', tags: ['暖身1 ⑴', '暖身1 ⑵', '暖身2 ⑴', '暖身2 ⑵'] }
          ]);
        },
        caption: '四題都是二選一，答對了再往下寫基礎題。'
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜習作基礎（1～4）',
        points: [
          '<b>基礎題今天當堂寫完</b>，這一頁先寫前四題。',
          '寫之前先看題目要的是<b>連比</b>還是<b>實際量</b>。',
          '卡住就點開詳解，一步一步跟著抄。'
        ],
        formula: { label: '這一節在練', tex: 'x:y:z' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作', page: '印 4–5', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '這一頁四題，寫完接下一頁。'
      },

      {
        sec: '1-1', secName: '連比例',
        title: '練習｜習作基礎（5～6）與精熟',
        points: [
          '基礎最後兩題寫完，<b>今天的習作就結束了</b>。',
          '\\(5x=6y=7z\\) 這型先各自化成兩兩的比，再接起來。',
          '精熟兩題<b>行有餘力</b>再做，不強迫。'
        ],
        formula: { label: '這一節在練', tex: '5x=6y=7z' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作', page: '印 6', sub: '基礎題，今天寫完', tags: ['基礎5', '基礎6'] },
            { src: '習作', page: '印 7', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '基礎六題到這裡寫完；精熟行有餘力再做。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '高一樣的時候，底邊幾比幾，面積就是幾比幾',
        points: [
          '兩個三角形<b>頂點同一個</b>、底邊在<b>同一條線</b>上，高就一樣。',
          '高一樣，就只剩底邊在決定面積。底邊 2:3，面積就 2:3。'
        ],
        formula: { label: '同一個頂點、底邊在同一條線上<span class="pgref">課本 印 23</span>', tex: '\\triangle ABD:\\triangle ADC=\\overline{BD}:\\overline{DC}' },
        visual: (h) => {
          const R = [[1, 1], [1, 2], [2, 3], [1, 3], [3, 2]];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>BD : DC ＝ <span class="ival" id="rv">2 : 3</span></label>
            <input type="range" id="rs" min="0" max="4" step="1" value="2"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#rs').value, a = R[i][0], b = R[i][1];
            h.querySelector('#rv').textContent = a + ' : ' + b;
            const A = [220, 32], B = [48, 186], Cc = [392, 186];
            const t = a / (a + b);
            const D = [B[0] + t * (Cc[0] - B[0]), B[1]];
            const H = [A[0], B[1]];
            let s = '';
            s += SV.poly([A, B, D], 'rgba(37,99,235,.16)', BLU, 2.2);
            s += SV.poly([A, D, Cc], 'rgba(217,119,6,.16)', AMB, 2.2);
            s += SV.seg(A[0], A[1], H[0], H[1], GREY, 2, '5 4');

            s += TX(8, 22, '虛線是兩邊共用的高', { fs: 13, c: GREY });
            s += SV.vlabel(A[0] - 6, A[1] - 10, 'A') + SV.vlabel(B[0] - 18, B[1] + 22, 'B')
               + SV.vlabel(D[0] - 6, D[1] + 22, 'D') + SV.vlabel(Cc[0] + 6, Cc[1] + 22, 'C');
            s += TX((B[0] + D[0]) / 2, B[1] - 8, a, { anchor: 'middle', fs: 17, c: BLU });
            s += TX((D[0] + Cc[0]) / 2, B[1] - 8, b, { anchor: 'middle', fs: 17, c: AMB });
            s += BOX(64, 210, 312, 78, { r: 13, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2.2 });
            s += TX(220, 238, 'BD : DC ＝ ' + a + ' : ' + b, { anchor: 'middle', fs: 19, c: INK });
            s += TX(220, 272, '△ABD : △ADC ＝ ' + a + ' : ' + b, { anchor: 'middle', fs: 19, c: GRN });
            h.querySelector('#fig').innerHTML = svg('0 0 440 298', s);
          };
          h.querySelector('#rs').oninput = draw;
          draw();
        },
        caption: '拖滑桿時<b>盯住兩個比值</b>——它們永遠一樣。',
        example: {
          q: '\\(D\\) 在 \\(\\overline{BC}\\) 上，\\(\\overline{BD}:\\overline{DC}=2:3\\)，\\(\\triangle ABD\\) 的面積是 \\(10\\)，求 \\(\\triangle ADC\\) 的面積。',
          steps: [
            '兩個三角形共用同一條高，所以面積比＝底邊比＝\\(2:3\\)。',
            '\\(10:\\triangle ADC=2:3\\)。'
          ],
          ans: '\\(\\triangle ADC=15\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '左邊上段比下段，右邊也上段比下段',
        points: [
          '有<b>平行</b>，兩邊才會被切成一樣的比。',
          '兩邊都<b>從上往下讀</b>，不要一邊由上、一邊由下。'
        ],
        formula: { label: '第一層，只記這一式<span class="pgref">課本 印 27 性質（一）①</span>', tex: '\\overline{AP}:\\overline{PB}=\\overline{AQ}:\\overline{QC}' },
        visual: (h) => {
          const R = [[1, 2], [2, 3], [1, 1], [3, 2], [2, 1]];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>上段 : 下段 ＝ <span class="ival" id="rv">1 : 2</span></label>
            <input type="range" id="rs" min="0" max="4" step="1" value="1"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#rs').value, a = R[i][0], b = R[i][1];
            h.querySelector('#rv').textContent = a + ' : ' + b;
            const t = a / (a + b);
            const A = [220, 34], B = [64, 206], Cc = [376, 206];
            const P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
            const Q = [A[0] + t * (Cc[0] - A[0]), A[1] + t * (Cc[1] - A[1])];
            let s = '';
            s += SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2);

            s += `<line x1="${A[0]}" y1="${A[1]}" x2="${P[0]}" y2="${P[1]}" stroke="${BLU}" stroke-width="5"/>`;
            s += `<line x1="${A[0]}" y1="${A[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${BLU}" stroke-width="5"/>`;
            s += `<line x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${AMB}" stroke-width="5"/>`;
            s += `<line x1="${Q[0]}" y1="${Q[1]}" x2="${Cc[0]}" y2="${Cc[1]}" stroke="${AMB}" stroke-width="5"/>`;
            s += `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${GRN}" stroke-width="3"/>`;
            s += SV.vlabel(A[0] - 6, A[1] - 8, 'A') + SV.vlabel(B[0] - 18, B[1] + 8, 'B') + SV.vlabel(Cc[0] + 8, Cc[1] + 8, 'C');
            s += SV.vlabel(P[0] - 20, P[1] + 4, 'P') + SV.vlabel(Q[0] + 10, Q[1] + 4, 'Q');
            s += TX((P[0] + Q[0]) / 2, P[1] - 10, 'PQ ∥ BC', { anchor: 'middle', fs: 13, c: GRN });
            s += TX(120, 240, 'AP : PB ＝ ' + a + ' : ' + b, { anchor: 'middle', fs: 17, c: INK });
            s += TX(320, 240, 'AQ : QC ＝ ' + a + ' : ' + b, { anchor: 'middle', fs: 17, c: INK });
            s += TX(220, 264, '兩邊被切成一樣的比', { anchor: 'middle', fs: 14, c: GRN });
            h.querySelector('#fig').innerHTML = svg('0 0 440 276', s);
          };
          h.querySelector('#rs').oninput = draw;
          draw();
        },
        caption: '<b>藍色是上段、琥珀色是下段</b>；兩邊顏色對顏色，就不會讀反。',
        example: {
          q: '\\(PQ\\parallel BC\\)，\\(\\overline{AP}=4\\)、\\(\\overline{PB}=6\\)、\\(\\overline{AQ}=6\\)，求 \\(\\overline{QC}\\)。'
            + exTri({ t: 0.4, ap: '4', pb: '6', aq: '6', qc: '?' }),
          steps: [
            '上段比下段：\\(4:6=6:\\overline{QC}\\)。',
            '\\(4:6\\) 約成 \\(2:3\\)，所以 \\(6:\\overline{QC}=2:3\\)。'
          ],
          ans: '\\(\\overline{QC}=9\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '比例式畫一個叉：兩條線各自相乘，答案一樣大',
        points: [
          '\\(a:b=c:d\\) 就是<b>對角相乘</b>：\\(a\\times d=b\\times c\\)。<b>不是同一側相乘</b>。',
          '算出 \\(6x=36\\) <b>還沒完</b>——要<b>再除回去</b>才是答案。',
          '未知數<b>在哪一格都一樣</b>畫叉，只是最後除的那個數不同。'
        ],
        formula: { label: '由比例式求未知數<span class="pgref">課本 印 28 例 2</span>', tex: 'a:b=c:d\\ \\Rightarrow\\ a\\times d=b\\times c' },
        visual: (h) => {

          const XL = 150, XR = 290, YA = 92, YB = 160, CA = 83, CB = 151;
          const T = (x, y, t, c, fs) => TX(x, y, t, { anchor: 'middle', fs: fs || 26, c: c || INK });
          const orig = (a, b, c, d) => T(220, 40, a + '：' + b + ' ＝ ' + c + '：' + d, GREY, 18);
          const grid = (a, b, c, d, ca, cb, cc, cd) =>
            T(XL, YA, a, ca) + T(220, YA, '：', GREY, 20) + T(XR, YA, b, cb)
            + T(XL, YB, c, cc) + T(220, YB, '：', GREY, 20) + T(XR, YB, d, cd);
          const cross = () => SV.seg(XL + 13, CA, XR - 13, CB, AMB, 2.6)
            + SV.seg(XR - 13, CA, XL + 13, CB, VIO, 2.6);
          const cut = () => TX(220, 266, '和因式分解的「十字交乘」不是同一件事', { anchor: 'middle', fs: 14.5, c: GREY });
          SV.stepper(h, '0 0 440 280', [
            { t: '前兩頁那種式子，列出來就長這樣：<b>6：4 ＝ 9：QC</b>（課本例 2）。先看這四個數字就好。',
              d: () => T(220, 80, '6：4 ＝ 9：QC', INK, 28)
                + TX(220, 140, '四個位置，只有一個不知道', { anchor: 'middle', fs: 17, c: INK })
                + TX(220, 176, '這一頁只解這種式子，先不看圖', { anchor: 'middle', fs: 15, c: GREY })
                + cut() },
            { t: '換成<b>上下兩排</b>寫，就看得到那個叉：左上連右下、右上連左下。<b>兩條線要交叉</b>。',
              d: () => orig('6', '4', '9', 'QC') + grid('6', '4', '9', 'QC', BLU, AMB, GRN, VIO) + cross()
                + TX(220, 206, '琥珀線：6 和 QC　　紫線：4 和 9', { anchor: 'middle', fs: 16, c: INK })
                + TX(220, 236, '✗ 不是 6 × 9（那兩個在同一邊，沒有交叉）', { anchor: 'middle', fs: 16, c: RED })
                + cut() },
            { t: '兩條線<b>各自相乘</b>，答案一樣大。右邊那條兩個都是數字，先算出來。',
              d: () => orig('6', '4', '9', 'QC') + grid('6', '4', '9', 'QC', BLU, AMB, GRN, VIO) + cross()
                + TX(220, 206, '6 × QC ＝ 4 × 9', { anchor: 'middle', fs: 21, c: INK })
                + TX(220, 240, '4 × 9 ＝ 36，所以 6 × QC ＝ 36', { anchor: 'middle', fs: 18, c: VIO })
                + cut() },
            { t: '到這裡<b>還沒完</b>：6 乘幾等於 36？把 6 <b>除回去</b>。',
              d: () => TX(220, 44, '6 × QC ＝ 36', { anchor: 'middle', fs: 22, c: INK })
                + TX(220, 84, '✗ 答成 QC ＝ 36 × 6', { anchor: 'middle', fs: 16, c: RED })
                + BOX(120, 104, 200, 54, { r: 13, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.4 })
                + TX(220, 140, 'QC ＝ 36 ÷ 6 ＝ 6', { anchor: 'middle', fs: 24, c: GRN })
                + TX(220, 190, '驗算：6：4 ＝ 9：6 ✓（都是 1.5 倍）', { anchor: 'middle', fs: 15, c: GRN })
                + TX(220, 224, '六題裡有四題都要多除這一次', { anchor: 'middle', fs: 15, c: GREY })
                + cut() },
            { t: '同一組數字，未知數<b>換到第 2 格</b>——叉的畫法<b>完全沒變</b>。',
              d: () => orig('6', 'x', '9', '6') + grid('6', 'x', '9', '6', BLU, VIO, GRN, AMB) + cross()
                + TX(220, 206, '6 × 6 ＝ x × 9　→　x ＝ 36 ÷ 9 ＝ 4', { anchor: 'middle', fs: 19, c: GRN })
                + TX(220, 240, '對角是看位置，不是看未知數在哪', { anchor: 'middle', fs: 16, c: INK })
                + cut() }
          ], { acc: false });
        },
        caption: '1-1 用過的<b>交叉相乘</b>，這裡拿來<b>求長度</b>——同一招，換一個方向用。',
        example: {
          q: '\\(3:x=6:8\\)，求 \\(x\\)。',
          steps: [
            '對角相乘：\\(3\\times8\\) 和 \\(x\\times6\\)。',
            '\\(3\\times8=24\\)，所以 \\(6x=24\\)。',
            '兩邊除以 \\(6\\)。'
          ],
          ans: '\\(x=4\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '上段 2 份、下段 5 份，整條就是 7 份',
        points: [
          '要比<b>整條</b>的時候，先把上下段的份數<b>加起來</b>。',
          '\\(AP:PB=2:5\\) 就是 \\(AP:AB=2:7\\)。',

          '<b>下段</b>也可以比整條：\\(PB:AB=5:7\\)。'
        ],
        formula: { label: '部分比全體<span class="pgref">課本 印 27 性質（一）②</span>', tex: '\\overline{AP}:\\overline{AB}=\\overline{AQ}:\\overline{AC}' },

        visual: (h) => {

          const u = 50, X0 = 46, Y = 96, HH = 30;
          const A = [X0, Y], P = [X0 + 2 * u, Y], B = [X0 + 7 * u, Y];
          const cell = (i, co) => BOX(X0 + i * u + 1.5, Y - HH / 2, u - 3, HH, { r: 4, fill: co, stroke: co, sw: 0 });
          const dot = (pt, lab) =>
            `<circle cx="${pt[0]}" cy="${pt[1]}" r="4.8" fill="#fff" stroke="${INK}" stroke-width="2"/>`
            + TX(pt[0], Y + 34, lab, { anchor: 'middle', fs: 16 });

          const up = (pt) => [pt[0], pt[1] - HH / 2 - 2];
          const dn = (pt) => [pt[0], pt[1] + HH / 2 + 2];
          const bar = [0, 1].map(i => cell(i, BLU)).join('')
            + [2, 3, 4, 5, 6].map(i => cell(i, AMB)).join('')
            + dot(A, 'A') + dot(P, 'P') + dot(B, 'B');
          SV.stepper(h, '0 0 440 282', [
            { t: '這是三角形的左邊 <b>AB</b>，拉直來看。P 把它切成上段 2 格、下段 5 格。',
              d: () => bar
                + ARC(up(A), up(P), -20, BLU, '上段 2 格', 1)
                + ARC(up(P), up(B), -20, AMB, '下段 5 格', 1) },
            { t: '那<b>整條 AB</b> 是幾格？上段加下段：2 ＋ 5 ＝ <b>7 格</b>。',
              d: k => ARC(dn(A), dn(B), 34, GRN, '整條 AB ＝ 7 格', k) },
            { t: '同一張圖，<b>三個比都讀得出來</b>——題目問哪兩段，就讀那一個。',
              d: k => BOX(92, 194, 256, 82, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2, op: k })
                + TX(220, 218, 'AP : PB ＝ 2 : 5', { anchor: 'middle', fs: 17, c: INK, op: k })
                + TX(220, 246, 'AP : AB ＝ 2 : 7', { anchor: 'middle', fs: 17, c: GRN, op: k })
                + TX(220, 270, 'PB : AB ＝ 5 : 7', { anchor: 'middle', fs: 17, c: AMB, op: k }) }
          ]);
        },
        caption: '「小 ＋ 小 ＝ 整」——<b>三段先圈出來</b>，再決定分母要放誰。',
        example: {
          q: '\\(\\overline{AP}:\\overline{PB}=3:4\\)，求 \\(\\overline{AP}:\\overline{AB}\\)。'
            + exSeg({ t: 0.43, ap: '3', pb: '4', ab: 'AB ＝ ?' }),
          steps: [
            '整條是 \\(3+4=7\\) 份。',
            '上段是 3 份。'
          ],
          ans: '\\(\\overline{AP}:\\overline{AB}=3:7\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '要比 PQ 和 BC，分母一定是整條 AB',
        points: [
          '\\(PQ:BC\\) 要配的是 <b>\\(AP:AB\\)</b>，不是 \\(AP:PB\\)。',
          '把 \\(P\\) 放在<b>正中間</b>試一次，馬上看得出哪個對。'
        ],
        formula: { label: '這一式要單獨記<span class="pgref">課本 印 29</span>', tex: '\\overline{AP}:\\overline{AB}=\\overline{PQ}:\\overline{BC}' },

        visual: (h) => {
          const A = [220, 30], B = [70, 176], Cc = [370, 176];
          const P = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], Q = [(A[0] + Cc[0]) / 2, (A[1] + Cc[1]) / 2];
          const base = SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2)
            + `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${GRN}" stroke-width="4"/>`
            + SV.vlabel(A[0] - 6, A[1] - 8, 'A') + SV.vlabel(B[0] - 18, B[1] + 8, 'B') + SV.vlabel(Cc[0] + 8, Cc[1] + 8, 'C')
            + SV.vlabel(P[0] - 20, P[1] + 4, 'P') + SV.vlabel(Q[0] + 10, Q[1] + 4, 'Q')
            + TX(220, 116, 'P、Q 都取中點', { anchor: 'middle', fs: 14, c: GREY });
          SV.stepper(h, '0 0 440 286', [
            { t: 'P、Q 都取中點，連起來就是 PQ。', d: () => base },
            { t: '把<b>兩條可能的分母</b>圈出來：上段 AP，和整條 AB。',
              d: k => ARC(A, P, 30, BLU, 'AP', k) + ARC(A, B, 64, GRN, '整條 AB', k) },
            { t: '比一下：\(AP:PB=1:1\)，但 \(PQ:BC=1:2\)——不一樣。',
              d: k => TX(220, 202, 'AP : PB ＝ 1 : 1　但 PQ : BC ＝ 1 : 2', { anchor: 'middle', fs: 16, c: INK, op: k }) },
            { t: '所以分母要放<b>整條 AB</b>：\(AP:AB=1:2\)，正好等於 \(PQ:BC\)。',
              d: k => BOX(24, 220, 190, 54, { r: 11, fill: 'rgba(225,29,72,.08)', stroke: RED, sw: 2 })
                + TX(119, 242, '✗ AP : PB ＝ PQ : BC', { anchor: 'middle', fs: 14.5, c: RED, op: k })
                + TX(119, 264, '1 : 1 ≠ 1 : 2', { anchor: 'middle', fs: 14.5, c: RED, op: k })
                + BOX(226, 220, 190, 54, { r: 11, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2 })
                + TX(321, 242, '✓ AP : AB ＝ PQ : BC', { anchor: 'middle', fs: 14.5, c: GRN, op: k })
                + TX(321, 264, '1 : 2 ＝ 1 : 2', { anchor: 'middle', fs: 14.5, c: GRN, op: k }) }
          ]);
        },
        caption: 'P 取中點時 \\(AP:PB=1:1\\)，但小線段 \\(PQ\\) 顯然不等於 \\(BC\\)——一試就破。',
        example: {
          q: '\\(\\overline{AP}:\\overline{PB}=2:3\\)、\\(\\overline{BC}=15\\)，求 \\(\\overline{PQ}\\)。'
            + exTri({ t: 0.4, ap: '2', pb: '3', pq: '?', bc: '15' }),
          steps: [
            '先換成部分比全體：\\(\\overline{AP}:\\overline{AB}=2:5\\)。',
            '所以 \\(\\overline{PQ}:15=2:5\\)。'
          ],
          ans: '\\(\\overline{PQ}=6\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '看到兩個中點，就寫兩句話：平行、一半',
        points: [
          '兩邊<b>中點</b>連起來，一定<b>平行</b>第三邊。',
          '長度一定是第三邊的<b>一半</b>。兩句話少一句都不算完整。'
        ],
        formula: { label: '兩句話一起寫<span class="pgref">課本 印 37</span>', tex: '\\overline{PQ}\\parallel\\overline{BC}\\ ,\\quad \\overline{PQ}=\\tfrac12\\overline{BC}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>底邊 BC ＝ <span class="ival" id="bv">12</span></label>
            <input type="range" id="bs" min="6" max="20" step="2" value="12"></div></div>`;
          const draw = () => {
            const bc = +h.querySelector('#bs').value;
            h.querySelector('#bv').textContent = bc;
            const A = [220, 32], B = [78, 184], Cc = [362, 184];
            const P = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], Q = [(A[0] + Cc[0]) / 2, (A[1] + Cc[1]) / 2];
            let s = '';
            s += SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2);
            s += `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${GRN}" stroke-width="4.5"/>`;
            s += SV.ticks(A[0], A[1], P[0], P[1], 1, VIO) + SV.ticks(P[0], P[1], B[0], B[1], 1, VIO);
            s += SV.ticks(A[0], A[1], Q[0], Q[1], 1, VIO) + SV.ticks(Q[0], Q[1], Cc[0], Cc[1], 1, VIO);
            s += SV.vlabel(A[0] - 6, A[1] - 8, 'A') + SV.vlabel(B[0] - 18, B[1] + 8, 'B') + SV.vlabel(Cc[0] + 8, Cc[1] + 8, 'C');
            s += SV.vlabel(P[0] - 20, P[1] + 4, 'P') + SV.vlabel(Q[0] + 10, Q[1] + 4, 'Q');
            s += TX(220, (P[1] - 12), 'PQ ＝ ' + (bc / 2), { anchor: 'middle', fs: 16, c: GRN });
            s += TX(220, 204, 'BC ＝ ' + bc, { anchor: 'middle', fs: 16, c: BLU });
            s += BOX(60, 218, 320, 44, { r: 12, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2 });
            s += TX(220, 246, 'PQ ∥ BC　且　PQ ＝ ' + bc + ' ÷ 2 ＝ ' + (bc / 2), { anchor: 'middle', fs: 17, c: GRN });
            h.querySelector('#fig').innerHTML = svg('0 0 440 272', s);
          };
          h.querySelector('#bs').oninput = draw;
          draw();
        },
        caption: '反過來也要會：中點連線是 7，底邊就是 14。',
        example: {
          q: '\\(P\\)、\\(Q\\) 分別是 \\(\\overline{AB}\\)、\\(\\overline{AC}\\) 的中點，\\(\\overline{PQ}=7\\)，求 \\(\\overline{BC}\\)。'
            + exTri({ t: 0.5, tick: 1, pq: '7', bc: '?' }),
          steps: [
            '中點連線是第三邊的一半。',
            '所以 \\(\\overline{BC}=7\\times2\\)。'
          ],
          ans: '\\(\\overline{BC}=14\\)'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '要分成 2:3，先在旁邊借一條線分好',
        points: [
          '直接量 \\(\\overline{AB}\\) 很難剛好分成 5 等份——<b>借一條斜線</b>來分。',
          '斜線上用圓規截 <b>2＋3＝5</b> 個等長的點，那裡分 2:3 很容易。',
          '再用<b>平行線</b>把這個比<b>搬回</b> \\(\\overline{AB}\\) 上。'
        ],
        formula: { label: '把比搬回來<span class="pgref">課本 印 32</span>', tex: '\\overline{AC}:\\overline{CB}=2:3' },
        visual: (h) => {
          const A = [56, 196], B = [380, 196];
          const DX = 36, DY = -25.2;
          const P = [1, 2, 3, 4, 5].map(k => [A[0] + DX * k, A[1] + DY * k]);
          const C = [A[0] + (B[0] - A[0]) * 2 / 5, A[1]];
          const seg = (p, q, c, w, dash) => SV.seg(p[0], p[1], q[0], q[1], c, w, dash || '');
          const dot = (p, c) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.6" fill="#fff" stroke="${c}" stroke-width="2.4"/>`;
          const base = () => seg(A, B, BLU, 3.4)
            + dot(A, BLU) + dot(B, BLU)
            + SV.vlabel(A[0] - 16, A[1] + 22, 'A') + SV.vlabel(B[0] + 4, B[1] + 22, 'B');
          const ray = (k) => {
            let g = seg(A, [A[0] + DX * 5.6, A[1] + DY * 5.6], GREY, 2, '6 5');
            for (let i = 0; i < 5; i++) {
              if (i >= k) break;
              g += SV.ticks(i ? P[i - 1][0] : A[0], i ? P[i - 1][1] : A[1], P[i][0], P[i][1], 1, AMB);
              g += dot(P[i], AMB) + TX(P[i][0] - 16, P[i][1] - 6, 'P' + (i + 1), { fs: 13, c: AMB });
            }
            return g;
          };
          SV.stepper(h, '0 0 440 266', [
            { t: '要在 AB 上找一點 C，使 AC : CB ＝ 2 : 3。<b>直接量很難剛好分成 5 等份。</b>',
              d: () => base()
                + TX(C[0], 178, '?', { anchor: 'middle', fs: 24, c: RED })
                + TX(220, 46, '要 AC : CB ＝ 2 : 3', { anchor: 'middle', fs: 19, c: INK })
                + TX(220, 240, 'AB 的長度不一定剛好是 5 的倍數', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '過 A 畫一條<b>斜的</b>射線，用圓規截出 <b>5 個等長</b>的點（2 ＋ 3 ＝ 5）。',
              d: () => base() + ray(5)
                + TX(220, 46, '圓規開同一個寬度，連續截 5 段', { anchor: 'middle', fs: 17, c: AMB })
                + TX(220, 240, '在斜線上分 2 : 3 很容易——每段一樣長', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '連 <b>P₅B</b>，再過 <b>P₂</b> 作 P₅B 的<b>平行線</b>，交 AB 於 C。',
              d: () => base() + ray(5)
                + seg(P[4], B, VIO, 2.6) + seg(P[1], C, GRN, 2.8)
                + dot(C, GRN) + SV.vlabel(C[0] - 6, C[1] + 22, 'C')
                + TX(300, 116, 'P₅B', { fs: 14, c: VIO })
                + TX(140, 186, '平行', { fs: 14, c: GRN })
                + TX(220, 240, '過 P₂——因為前面那段是 2 份', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '為什麼對：P₂ 把 AP₅ 分成 2 : 3，<b>平行線把這個比原封不動搬到 AB 上</b>。',
              d: () => base() + ray(5)
                + seg(P[4], B, VIO, 2.6) + seg(P[1], C, GRN, 2.8) + dot(C, GRN)
                + SV.vlabel(C[0] - 6, C[1] + 22, 'C')
                + BOX(60, 28, 320, 46, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 58, 'AC : CB ＝ AP₂ : P₂P₅ ＝ 2 : 3', { anchor: 'middle', fs: 18, c: GRN })
                + TX(220, 240, '用的就是這一節的「上段比下段」', { anchor: 'middle', fs: 15, c: GREY }) }
          ], { acc: false });
        },
        caption: '⚠ 要幾份就截幾個點：\\(2:3\\) 截 <b>5</b> 個、\\(3:2\\) 也截 5 個，差別只在<b>過第幾個點</b>作平行線。',
        example: {
          q: '要讓 \\(\\overline{AC}:\\overline{CB}=3:2\\)，該過哪一個點作平行線？',
          steps: [
            '\\(3+2=5\\)，一樣截 5 個點。',
            '前面那段要 3 份，所以過 \\(P_3\\)。'
          ],
          ans: '過 \\(P_3\\) 作 \\(\\overline{P_5B}\\) 的平行線'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '比對了，兩條線就平行——但只能用這三種比法',
        points: [
          '前面是<b>有平行 → 得到比</b>；這一頁反過來，<b>有比 → 得到平行</b>。',
          '只有<b>切在同兩邊上</b>的比才算數。'
        ],
        formula: { label: '由比反推平行<span class="pgref">課本 印 39 重點回顧 3</span>', tex: '\\overline{AP}:\\overline{PB}=\\overline{AQ}:\\overline{QC}\\ \\Rightarrow\\ \\overline{PQ}\\parallel\\overline{BC}' },
        visual: (h) => {

          const mini = (ox, form, mode) => {
            const A = [ox + 68, 38], B = [ox + 18, 110], Cc = [ox + 118, 110];
            const t = 0.42;
            const P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
            const Q = [A[0] + t * (Cc[0] - A[0]), A[1] + t * (Cc[1] - A[1])];
            const ln = (p, q, col, w, op) =>
              `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${col}" stroke-width="${w}"${op ? ` opacity="${op}"` : ''} stroke-linecap="round"/>`;
            let s = BOX(ox, 30, 136, 142, { r: 12, fill: '#fbfcfe', stroke: '#e3e9f3', sw: 1.6 });
            s += SV.poly([A, B, Cc], 'rgba(37,99,235,.04)', '#c9d3e2', 1.6);
            if (mode !== 'ratio') {
              s += ln(A, B, GRN, 6.5, 0.32) + ln(A, Cc, GRN, 6.5, 0.32);
            }
            if (mode === 'ratio' || mode === 'upper') { s += ln(A, P, BLU, 3.4) + ln(A, Q, BLU, 3.4); }
            if (mode === 'ratio' || mode === 'lower') { s += ln(P, B, AMB, 3.4) + ln(Q, Cc, AMB, 3.4); }
            s += ln(P, Q, GRN, 2.6);
            s += TX(ox + 68, 152, form, { anchor: 'middle', fs: 12.5, c: INK });
            s += TX(ox + 68, 168, '✓ 平行', { anchor: 'middle', fs: 12.5, c: GRN });
            return s;
          };
          let s = TX(220, 20, '這三種比法都成立 → PQ ∥ BC', { anchor: 'middle', fs: 16, c: INK });
          s += mini(6, 'AP : PB ＝ AQ : QC', 'ratio');
          s += mini(152, 'AP : AB ＝ AQ : AC', 'upper');
          s += mini(298, 'PB : AB ＝ QC : AC', 'lower');

          const A = [86, 196], B = [46, 300], Cc = [132, 300];
          const vB = [B[0] - A[0], B[1] - A[1]], vC = [Cc[0] - A[0], Cc[1] - A[1]];
          const t = 0.62;
          const dot2 = vB[0] * vC[0] + vB[1] * vC[1], nC2 = vC[0] * vC[0] + vC[1] * vC[1];
          const s2 = t * (2 * dot2 / nC2 - 1);
          const at = (v, k) => [A[0] + k * v[0], A[1] + k * v[1]];
          const P = at(vB, t), Q = at(vC, t), Rr = at(vC, s2);
          s += BOX(6, 182, 428, 126, { r: 12, fill: 'rgba(225,29,72,.05)', stroke: '#f3c4d0', sw: 1.6 });
          s += SV.poly([A, B, Cc], 'rgba(37,99,235,.04)', '#c9d3e2', 1.6);
          s += SV.seg(P[0], P[1], Q[0], Q[1], GRN, 3, '');
          s += SV.seg(P[0], P[1], Rr[0], Rr[1], RED, 3, '');
          s += SV.ticks(P[0], P[1], Q[0], Q[1], 1, GRN);
          s += SV.ticks(P[0], P[1], Rr[0], Rr[1], 1, RED);
          s += SV.vlabel(A[0] - 4, A[1] - 8, 'A', INK, 13) + SV.vlabel(B[0] - 14, B[1] + 14, 'B', INK, 13)
             + SV.vlabel(Cc[0] + 4, Cc[1] + 14, 'C', INK, 13) + SV.vlabel(P[0] - 16, P[1] + 4, 'P', INK, 13)
             + SV.vlabel(Q[0] + 6, Q[1] + 5, 'Q', GRN, 13) + SV.vlabel(Rr[0] + 6, Rr[1] + 2, 'R', RED, 13);
          s += TX(168, 208, '✗ 這一種不算', { fs: 16, c: RED });
          s += TX(168, 234, 'PR 和 PQ 一樣長（記號同）', { fs: 14, c: INK });
          s += TX(168, 258, '所以 AP : AB ＝ PR : BC 也成立', { fs: 14, c: INK });
          s += TX(168, 284, '但 PR 不平行 BC', { fs: 16, c: RED });
          h.innerHTML = svg('0 0 440 316', s);
        },
        caption: '口白：<b>長度湊對了，方向不一定對</b>——\\(\\overline{PR}\\) 是一條線段的長度，不是被切出來的比。',
        example: {
          q: '\\(\\overline{AP}:\\overline{PB}=3:2\\)、\\(\\overline{AQ}:\\overline{QC}=3:2\\)，\\(\\overline{PQ}\\) 和 \\(\\overline{BC}\\) 平行嗎？'
            + exTri({ t: 0.6, ap: '3', pb: '2', aq: '3', qc: '2' }),
          steps: [
            '兩邊被切出來的比一樣。',

            '符合第一種比法（上段比下段）。'
          ],
          ans: '平行'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '最常錯的三件事',
        points: [
          '先確認<b>有沒有平行</b>，沒平行就不能用這些比例式。',
          '列式前先問一句：<b>我比的是哪兩段？</b>'
        ],
        formula: { label: '先問這一句<span class="pgref">課本 印 39 重點回顧</span>', tex: '\\text{我比的是哪兩段？}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '分母放錯',
              bad: '\\(\\overline{AP}:\\overline{PB}=\\overline{PQ}:\\overline{BC}\\)',
              good: '要用整條：<br>\\(\\overline{AP}:\\overline{AB}=\\overline{PQ}:\\overline{BC}\\)' },
            { tag: '方向讀反',
              bad: '左邊由上往下<br>右邊由下往上',
              good: '<b>兩邊都由上往下</b><br>顏色對顏色' },
            { tag: '只寫一半',
              bad: '中點連線只寫「等於一半」',
              good: '要寫<b>兩句</b>：<br>平行、而且是一半' }
          ]);
          MJ(h);
        },
        caption: '中點連線固定兩行輸出，少一行就當概念沒完整。',
        example: {
          q: '兩邊中點連線，只寫「\\(\\overline{PQ}=\\frac12\\overline{BC}\\)」夠不夠？'
            + exTri({ t: 0.5, tick: 1, pq: 'PQ', bc: 'BC' }),
          steps: [
            '長度寫對了，但少了位置關係。',
            '還要寫 \\(\\overline{PQ}\\parallel\\overline{BC}\\)。'
          ],
          ans: '不夠，要兩句'
        }
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜習作暖身題',
        points: [
          '這三題是<b>選擇題</b>，先熱身，不用寫過程。',
          '前兩題上方有<b>概念提示</b>方塊，先看方塊再選。',
          '站穩兩件事：<b>上段比下段</b>、<b>比 PQ 和 BC 要用整條</b>。'
        ],
        formula: { label: '暖身重點', tex: '\\overline{AP}:\\overline{PB}=\\overline{AQ}:\\overline{QC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・暖身題', page: '印 8', sub: '先看概念提示方塊，再選答案', tags: ['暖身1', '暖身2 ⑴', '暖身2 ⑵'] }
          ]);
        },
        caption: '三題都是選擇，答對了再往下寫基礎題。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜課本隨堂（上段比下段、部分比全體）',
        points: [
          '看到平行線先問：<b>哪兩段對哪兩段</b>，寫下來再算。',
          '比例式的分母要用<b>整條邊</b>還是<b>一段</b>，先圈清楚。',
          '點任一題，圖會跟著步驟一起出現。'
        ],
        formula: { label: '這一節在練', tex: '\\overline{AP}:\\overline{PB}=\\overline{AQ}:\\overline{QC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・隨堂練習', page: '印 23–28', sub: '比例線段的兩層', tags: ['課P23', '課P24', '課P28 第1題', '課P28 第2題'] }
          ]);
        },
        caption: '四題都抄到本子上再算。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜課本隨堂（中點連線與等分線段）',
        points: [
          '中點連線一定寫<b>兩句話</b>：平行、而且是一半。',
          '等分線段先數<b>被分成幾等份</b>，再決定比。',
          '點任一題看逐行詳解。'
        ],
        formula: { label: '這一節在練', tex: '\\overline{PQ}\\parallel\\overline{BC}\\ ,\\ \\overline{PQ}=\\tfrac12\\overline{BC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・隨堂練習', page: '印 30–32', sub: '中點連線、等分線段', tags: ['課P30 第1題', '課P30 第2題', '課P31', '課P32'] }
          ]);
        },
        caption: '中點連線的題目，兩句話都要寫。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜課本隨堂（應用）',
        points: [
          '應用題先把<b>每一段的長度標在圖上</b>，再列比例式。',
          '題幹長，<b>先讀完再動筆</b>，不要看到數字就算。',
          '三題都是圖形題，詳解會把圖和步驟一起推進。'
        ],
        formula: { label: '這一節在練', tex: '\\overline{AP}:\\overline{AB}=\\overline{PQ}:\\overline{BC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・隨堂練習', page: '印 35–38', sub: '應用', tags: ['課P35', '課P37', '課P38'] }
          ]);
        },
        caption: '這三題題幹長，一題一題來。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜習作基礎（1～3）',
        points: [
          '<b>今天當堂寫完</b>，寫完自己對一次詳解。',
          '圖形題先把已知標到圖上，再列式。',
          '基礎六題分兩頁，這是前三題。'
        ],
        formula: { label: '這一節在練', tex: '\\overline{AP}:\\overline{PB}=\\overline{AQ}:\\overline{QC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作', page: '印 8–9', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '基礎前三題，當堂寫完。'
      },

      {
        sec: '1-2', secName: '比例線段',
        title: '練習｜習作基礎（4～6）與精熟',
        points: [
          '<b>基礎後三題今天一起寫完</b>；精熟兩題行有餘力再做。',
          '跳箱、尺規作圖那兩題，先看清楚<b>圖在問哪一段</b>。',
          '精熟題點開會標「進階」，不強迫全班都做。'
        ],
        formula: { label: '這一節在練', tex: '\\overline{PQ}\\parallel\\overline{BC}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作', page: '印 10–11', sub: '基礎題，今天寫完', tags: ['基礎4', '基礎5', '基礎6'] },
            { src: '習作', page: '印 11', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '基礎六題到這裡寫完；精熟行有餘力再做。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '放大縮小時，邊長會變，角度不會變',
        points: [
          '像影印機一樣：<b>150% 就是每邊乘 1.5</b>。',
          '角度<b>完全不動</b>——把角的兩邊拉長，角還是那麼開。'
        ],
        formula: { label: '縮放做的事<span class="pgref">課本 印 45–47</span>', tex: '\\text{邊長}\\times k\\ ,\\quad \\text{角度不變}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>影印倍率 <span class="ival" id="kv">150</span>%</label>
            <input type="range" id="ks" min="100" max="200" step="25" value="150"></div></div>`;
          const draw = () => {
            const pct = +h.querySelector('#ks').value, k = pct / 100;
            h.querySelector('#kv').textContent = pct;
            const base = 46, w0 = base * 1.6, h0 = base;
            let s = '';

            const x1 = 56, y1 = 150;
            s += SV.poly([[x1, y1], [x1 + w0, y1], [x1 + w0 * 0.55, y1 - h0]], 'rgba(37,99,235,.10)', BLU, 2.4);
            s += TX(x1 + w0 / 2, y1 + 22, '4', { anchor: 'middle', fs: 15, c: BLU });
            s += TX(x1 + w0 / 2, 34, '原圖 100%', { anchor: 'middle', fs: 14, c: GREY });
            s += TX(x1 + w0 * 0.55, y1 - h0 - 10, '60°', { anchor: 'middle', fs: 14, c: RED });

            const x2 = 236, y2 = 150;
            s += SV.poly([[x2, y2], [x2 + w0 * k, y2], [x2 + w0 * k * 0.55, y2 - h0 * k]], 'rgba(5,150,105,.10)', GRN, 2.4);
            s += TX(x2 + w0 * k / 2, y2 + 22, (4 * k).toFixed(k === 1 ? 0 : 1), { anchor: 'middle', fs: 15, c: GRN });
            s += TX(x2 + w0 * k / 2, 34, pct + '%', { anchor: 'middle', fs: 14, c: GREY });
            s += TX(x2 + w0 * k * 0.55, y2 - h0 * k - 10, '60°', { anchor: 'middle', fs: 14, c: RED });
            s += TX(220, 200, '邊長 4 → ' + (4 * k).toFixed(k === 1 ? 0 : 1) + '（乘 ' + k + '）', { anchor: 'middle', fs: 17, c: GRN });
            s += TX(220, 230, '角度 60° → 60°（沒變）', { anchor: 'middle', fs: 17, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 246', s);
          };
          h.querySelector('#ks').oninput = draw;
          draw();
        },
        caption: '倍率只作用在<b>長度</b>上。這是相似最重要的一句話。',
        example: {
          q: '一個三角形邊長 3、4、5，放大成 2 倍後三邊各是多少？'
            + exTriPair({ l: { k: 0.62, ab: '3', bc: '4', ac: '5' },
                          r: { k: 1.24, ab: '?', bc: '?', ac: '?', names: ['A′', 'B′', 'C′'] },
                          note: '角度不變，只有邊長變' }),
          steps: [
            '每一邊都乘 2。',
            '角度不用動。'
          ],
          ans: '\\(6\\)、\\(8\\)、\\(10\\)'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '縮放要從一個「中心」量出去',
        points: [
          '縮放有一個<b>中心</b> \\(O\\)：從 \\(O\\) 量到每一個點的距離，都乘同一個倍率。',
          '縮 \\(\\tfrac12\\) 倍就是把 \\(\\overline{OA}\\)、\\(\\overline{OB}\\) 都<b>取一半</b>。',
          '連起來的 \\(\\overline{A\'B\'}\\) 會<b>平行</b>原來的，長度也是一半。'
        ],
        formula: { label: '從中心量出去<span class="pgref">課本 印 44</span>', tex: '\\overline{OA\'}=k\\,\\overline{OA},\\ \\overline{OB\'}=k\\,\\overline{OB}' },
        visual: (h) => {
          const O = [70, 64], A = [356, 140], B = [250, 246];
          const mid = (p) => [(O[0] + p[0]) / 2, (O[1] + p[1]) / 2];
          const A2 = mid(A), B2 = mid(B);
          const dot = (p, c, r) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r || 4.8}" fill="#fff" stroke="${c}" stroke-width="2.6"/>`;
          const seg = (p, q, c, w, dash) => SV.seg(p[0], p[1], q[0], q[1], c, w, dash || '');
          const base = () => seg(A, B, BLU, 3.4) + dot(A, BLU) + dot(B, BLU) + dot(O, RED, 5.4)
            + SV.vlabel(O[0] - 22, O[1] + 6, 'O') + SV.vlabel(A[0] + 8, A[1] + 4, 'A') + SV.vlabel(B[0] + 8, B[1] + 8, 'B');
          SV.stepper(h, '0 0 440 272', [
            { t: '有一個<b>中心</b> O，和要縮放的線段 AB。',
              d: () => base() + TX(220, 26, '中心 O　＋　線段 AB', { anchor: 'middle', fs: 18, c: INK }) },
            { t: '從 O 連到 A、連到 B——<b>縮放量的是這兩條</b>，不是 AB。',
              d: () => base() + seg(O, A, GREY, 2, '6 5') + seg(O, B, GREY, 2, '6 5')
                + TX(220, 26, '量 OA 和 OB', { anchor: 'middle', fs: 18, c: GREY }) },
            { t: '縮 <b>1/2</b> 倍：兩條都取<b>一半</b>，得到 A′、B′。',
              d: () => base() + seg(O, A, GREY, 2, '6 5') + seg(O, B, GREY, 2, '6 5')
                + dot(A2, AMB) + dot(B2, AMB)
                + SV.vlabel(A2[0] + 6, A2[1] - 8, 'A′') + SV.vlabel(B2[0] - 26, B2[1] + 4, 'B′')
                + TX(220, 26, 'OA′ ＝ OA 的一半　OB′ ＝ OB 的一半', { anchor: 'middle', fs: 16, c: AMB }) },
            { t: '連起來：<b>A′B′ 平行 AB，長度也是一半</b>。',
              d: () => base() + seg(O, A, GREY, 2, '6 5') + seg(O, B, GREY, 2, '6 5')
                + seg(A2, B2, AMB, 3.4) + dot(A2, AMB) + dot(B2, AMB)
                + SV.vlabel(A2[0] + 6, A2[1] - 8, 'A′') + SV.vlabel(B2[0] - 26, B2[1] + 4, 'B′')
                + BOX(96, 14, 248, 42, { r: 11, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 42, 'A′B′ ∥ AB，長度一半', { anchor: 'middle', fs: 18, c: GRN }) }
          ], { acc: false });
        },
        caption: '⚠ 中心 <b>O 也可以在線段上</b>（課本印 44 第 2 題就是）：一樣從 O 量出去，\\(A\'\\)、\\(B\'\\) 與原來<b>在同一側</b>。',
        example: {
          q: '\\(O\\) 在 \\(\\overline{AB}\\) 上，\\(\\overline{OA}=1\\) 格、\\(\\overline{OB}=3\\) 格，放大 \\(3\\) 倍後呢？',
          steps: [
            '兩條都乘 \\(3\\)：\\(\\overline{OA\'}=3\\) 格、\\(\\overline{OB\'}=9\\) 格。',
            '方向不變，\\(A\'\\)、\\(B\'\\) 和原來在 \\(O\\) 的同一側。'
          ],
          ans: '\\(\\overline{A\'B\'}\\) 在同一直線上，長 \\(12\\) 格'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '要相似，角相等和邊成比例兩道門都要過',
        points: [
          '只過一道門<b>不算</b>相似——兩個都要成立。',
          '拖滑桿看<b>五組</b>圖形，哪一組卡在哪一道門。'
        ],
        formula: { label: '兩道門<span class="pgref">課本 印 48–49</span>', tex: '\\text{對應角相等}\\ \\text{且}\\ \\text{對應邊成比例}' },

        visual: (h) => {
          const P2 = (pts, col, fill) => SV.poly(pts, fill, col, 2.2);
          const BL = 'rgba(37,99,235,.10)', GR = 'rgba(5,150,105,.10)';
          const sq = (cx, cy, s, col, fill) => P2([[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2],
            [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2]], col, fill);
          const rect = (cx, cy, w, hh, col, fill) => P2([[cx - w / 2, cy - hh / 2], [cx + w / 2, cy - hh / 2],
            [cx + w / 2, cy + hh / 2], [cx - w / 2, cy + hh / 2]], col, fill);
          const rh = (cx, cy, R, deg, col, fill) => {
            const t = deg * Math.PI / 360, dx = R * Math.sin(t), dy = R * Math.cos(t);
            return P2([[cx, cy - dy], [cx + dx, cy], [cx, cy + dy], [cx - dx, cy]], col, fill);
          };
          const eq = (cx, cy, s, col, fill) => {
            const hh = s * Math.sqrt(3) / 2;
            return P2([[cx, cy - hh / 2], [cx + s / 2, cy + hh / 2], [cx - s / 2, cy + hh / 2]], col, fill);
          };
          const hx = (cx, cy, sides, u, col, fill) => {
            let x = 0, y = 0, ang = -Math.PI / 3; const Q = [];
            sides.forEach(s => { Q.push([x, y]); x += Math.cos(ang) * s * u; y += Math.sin(ang) * s * u; ang += Math.PI / 3; });
            const xs = Q.map(p => p[0]), ys = Q.map(p => p[1]);
            const ox = cx - (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
            const oy = cy - (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
            return P2(Q.map(p => [p[0] + ox, p[1] + oy]), col, fill);
          };
          const D = [
            { n: '兩個正方形', ang: true, side: true, d1: '邊 2、角 90°', d2: '邊 5、角 90°',
              sh: () => sq(120, 80, 34, BLU, BL) + sq(320, 80, 56, GRN, GR) },
            { n: '兩個長方形', ang: true, side: false, d1: '1 × 2', d2: '2 × 3',
              sh: () => rect(120, 80, 26, 52, BLU, BL) + rect(320, 80, 40, 60, GRN, GR) },
            { n: '兩個菱形', ang: false, side: true, d1: '邊 4、角 60°', d2: '邊 4、角 100°',
              sh: () => rh(120, 80, 36, 60, BLU, BL) + rh(320, 80, 36, 100, GRN, GR) },
            { n: '兩個正三角形', ang: true, side: true, d1: '邊 3', d2: '邊 7',
              sh: () => eq(120, 80, 34, BLU, BL) + eq(320, 80, 58, GRN, GR) },
            { n: '兩個六邊形', ang: true, side: false,
              d1: '六個角都 120°、六邊等長', d2: '六個角都 120°、邊長 2,1,2,1,2,1',
              sh: () => hx(120, 80, [1.5, 1.5, 1.5, 1.5, 1.5, 1.5], 21, BLU, BL)
                      + hx(320, 80, [2, 1, 2, 1, 2, 1], 17, GRN, GR) }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label><span class="ival" id="nv">兩個正方形</span></label>
            <input type="range" id="ns" min="0" max="4" step="1" value="0"></div></div>`;
          const draw = () => {
            const d = D[+h.querySelector('#ns').value];
            h.querySelector('#nv').textContent = d.n;
            const ok = d.ang && d.side;
            let s = '';
            s += TX(220, 24, d.n, { anchor: 'middle', fs: 19, c: INK });
            s += d.sh();
            s += TX(120, 126, d.d1, { anchor: 'middle', fs: 13, c: GREY });
            s += TX(320, 126, d.d2, { anchor: 'middle', fs: 13, c: GREY });
            const gate = (x, lab, pass) =>
              BOX(x, 138, 176, 58, { r: 12, fill: pass ? 'rgba(5,150,105,.10)' : 'rgba(225,29,72,.09)', stroke: pass ? GRN : RED, sw: 2.2 }) +
              TX(x + 88, 160, lab, { anchor: 'middle', fs: 15, c: GREY }) +
              TX(x + 88, 186, pass ? '✓ 過' : '✗ 沒過', { anchor: 'middle', fs: 18, c: pass ? GRN : RED });
            s += gate(28, '第一道：角相等', d.ang);
            s += gate(236, '第二道：邊成比例', d.side);
            s += BOX(96, 208, 248, 48, { r: 13, fill: ok ? 'rgba(5,150,105,.12)' : 'rgba(225,29,72,.10)', stroke: ok ? GRN : RED, sw: 2.4 });
            s += TX(220, 239, ok ? '相似 ✓' : '不相似 ✗', { anchor: 'middle', fs: 22, c: ok ? GRN : RED });
            s += TX(220, 280, ok ? '兩道門都過了' : (d.ang ? '角一樣，但邊的比不一樣' : '邊一樣長，但角不一樣'),
              { anchor: 'middle', fs: 15, c: GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 294', s);
          };
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '「同名字的圖形」不保證相似——<b>長方形、菱形、六邊形都是反例</b>。',
        example: {
          q: '\\(1\\times2\\) 和 \\(2\\times3\\) 的長方形相似嗎？'
            + exRectPair({ l: [1, 2], r: [2, 3], lt: '角都 90°', rt: '角也都 90°' }),
          steps: [
            '角都是 \\(90^\\circ\\)，第一道門過。',
            '邊比 \\(1:2\\) 與 \\(2:3\\) 不相等，第二道門沒過。'
          ],
          ans: '不相似'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '對應關係看名字的順序，不看圖上誰在左邊',
        points: [
          '把兩個名字<b>上下排成兩行</b>，同一直行就是一組對應。',
          '圖轉過來翻過去都沒關係，<b>名字順序不會騙人</b>。'
        ],
        formula: { label: '先念一遍再列式<span class="pgref">課本 印 51 例 4</span>', tex: 'ABCD\\sim PQRS' },
        visual: (h) => {
          const X = [110, 190, 270, 350];
          const L1 = ['A', 'B', 'C', 'D'], L2 = ['P', 'Q', 'R', 'S'];
          let s = '';
          s += TX(220, 40, '四邊形 ABCD ∼ 四邊形 PQRS', { anchor: 'middle', fs: 18, c: INK });
          X.forEach((x, i) => {
            s += BOX(x - 32, 66, 64, 96, { r: 11, fill: 'rgba(37,99,235,.06)', stroke: '#cfdcf5', sw: 1.8 });
            s += TX(x, 100, L1[i], { anchor: 'middle', fs: 24, c: BLU });
            s += TX(x, 122, '↓', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(x, 150, L2[i], { anchor: 'middle', fs: 24, c: VIO });
          });
          s += TX(60, 100, '第一個', { anchor: 'end', fs: 13, c: GREY });
          s += TX(60, 150, '第二個', { anchor: 'end', fs: 13, c: GREY });
          s += TX(220, 194, '同一直行就是一組：A 對 P、B 對 Q、C 對 R、D 對 S', { anchor: 'middle', fs: 15, c: GREY });
          s += BOX(70, 210, 300, 46, { r: 12, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2 });
          s += TX(220, 240, '邊也照著配：AB 對 PQ、BC 對 QR', { anchor: 'middle', fs: 16, c: GRN });
          h.innerHTML = svg('0 0 440 270', s);
        },
        caption: '求邊長時<b>只從同一直行連到下一直行</b>，不要憑圖上位置猜。',
        example: {
          q: '\\(ABCD\\sim PQRS\\)，\\(\\overline{AB}\\) 對到哪一邊？'
            + exQuadPair({ note: '第二個是轉過來畫的——照名字順序配對' }),
          steps: [
            '兩行對齊：A 在 P 上面、B 在 Q 上面。',
            '所以 \\(\\overline{AB}\\) 配 \\(\\overline{PQ}\\)。'
          ],
          ans: '\\(\\overline{PQ}\\)'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '最常錯的三件事',
        points: [
          '「看起來像」不能當判斷依據，要<b>兩道門都檢查</b>。',
          '大小不同<b>不代表</b>不相似，那正是相似的重點。'
        ],
        formula: { label: '兩件事分清楚<span class="pgref">課本 印 59 重點回顧</span>', tex: '\\text{全等是倍率 }1\\text{ 的相似}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '大小不同就不相似',
              bad: '一大一小的正方形<br>「不一樣大，不相似」',
              good: '角都 \\(90^\\circ\\)、邊都成比例<br><b>是相似</b>' },
            { tag: '同名就相似',
              bad: '「都是長方形，一定相似」',
              good: '要看邊比<br>\\(1\\times2\\) 和 \\(2\\times3\\) <b>不相似</b>' },
            { tag: '倍率乘到角度',
              bad: '放大 2 倍，\\(60^\\circ\\) 變 \\(120^\\circ\\)',
              good: '倍率<b>只改長度</b><br>角度永遠不變' }
          ]);
          MJ(h);
        },
        caption: '任意兩個正 \\(n\\) 邊形一定相似，但「同名圖形」不一定。',
        example: {
          q: '兩個菱形邊長都是 4，一定相似嗎？'
            + exRhombPair({ s: '4', a1: 64, a2: 104 }),
          steps: [
            '邊都相等，第二道門過。',
            '但角度可能一個 \\(60^\\circ\\)、一個 \\(100^\\circ\\)。'
          ],
          ans: '不一定'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: 'SSS：三邊都放大同樣的倍數，就是相似',
        points: [
          '前面學的<b>縮放</b>就是這件事：三條邊一起變成同樣的倍數。',
          '檢查時把兩組邊各自<b>由小到大排</b>，再一欄一欄比。',
          '不要在圖上追哪一邊對哪一邊，<b>排序比看圖可靠</b>。'
        ],
        formula: { label: 'SSS 相似<span class="pgref">課本 印 57</span>', tex: '\\text{三組對應邊的比都相等}' },
        visual: (h) => {
          const cell = (x, y, t, co, on) =>
            BOX(x, y, 78, 42, { r: 9, fill: on ? 'rgba(5,150,105,.12)' : '#fbfcfe', stroke: on ? GRN : '#dce3ee', sw: on ? 2.2 : 1.6 }) +
            TX(x + 39, y + 28, t, { anchor: 'middle', fs: 19, c: co || INK });
          const X = [110, 208, 306];
          SV.stepper(h, '0 0 440 258', [
            { t: '把一個三角形整個放大 2 倍，三條邊都會變成 2 倍。',
              d: () => TX(220, 52, '整個放大 2 倍', { anchor: 'middle', fs: 19, c: GRN }) +
                       TX(220, 100, '3 → 6　　4 → 8　　5 → 10', { anchor: 'middle', fs: 20, c: INK }) +
                       TX(220, 156, '三條邊用同一個倍數，形狀才不會變', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '但題目給的邊長順序通常是亂的：5、3、4 和 8、10、6。',
              d: () => TX(220, 44, '第一個：5、3、4', { anchor: 'middle', fs: 19, c: BLU }) +
                       TX(220, 88, '第二個：8、10、6', { anchor: 'middle', fs: 19, c: VIO }) +
                       TX(220, 150, '順序亂的時候，別急著配對', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '各自<b>由小到大</b>排好。',
              d: () => TX(56, 76, '第一個', { anchor: 'end', fs: 14, c: GREY }) +
                       cell(X[0], 56, '3', BLU) + cell(X[1], 56, '4', BLU) + cell(X[2], 56, '5', BLU) +
                       TX(56, 140, '第二個', { anchor: 'end', fs: 14, c: GREY }) +
                       cell(X[0], 120, '6', VIO) + cell(X[1], 120, '8', VIO) + cell(X[2], 120, '10', VIO) +
                       TX(220, 200, '最短配最短，最長配最長', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '一欄一欄比：每一欄都是 1 比 2。三組都一樣，SSS 成立。',
              d: () => cell(X[0], 56, '3', BLU, true) + cell(X[1], 56, '4', BLU, true) + cell(X[2], 56, '5', BLU, true) +
                       cell(X[0], 120, '6', VIO, true) + cell(X[1], 120, '8', VIO, true) + cell(X[2], 120, '10', VIO, true) +
                       X.map(x => TX(x + 39, 112, '↓', { anchor: 'middle', fs: 14, c: GRN })).join('') +
                       X.map((x, i) => TX(x + 39, 182, '1 : 2', { anchor: 'middle', fs: 15, c: GRN })).join('') +
                       BOX(140, 200, 160, 44, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 }) +
                       TX(220, 229, '相似 ✓', { anchor: 'middle', fs: 20, c: GRN }) }
          ], { acc: false });
        },
        caption: '這是三個判別法裡<b>最直接的一個</b>——它就是縮放的定義。一次只比兩個三角形。',
        example: {
          q: '邊長 \\(2,3,4\\) 與 \\(6,8,4\\) 的兩個三角形相似嗎？'
            + exTriPair({ l: { k: 0.8, ab: '2', bc: '3', ac: '4' },
                          r: { k: 0.8, ab: '6', bc: '8', ac: '4', names: ['D', 'E', 'F'] },
                          note: '兩個都畫成示意圖——用數字判斷，不要看圖猜' }),
          steps: [
            '排序後是 \\(2,3,4\\) 與 \\(4,6,8\\)。',
            '各欄比：\\(2:4\\)、\\(3:6\\)、\\(4:8\\)，都是 \\(1:2\\)。'
          ],
          ans: '相似（SSS）'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: 'SAS：那個角一定要夾在兩條邊中間',
        points: [
          '三組邊都量太累。<b>兩組邊成比例</b>，再加一個角就夠了。',
          '但那個角必須剛好<b>夾在這兩條邊中間</b>。',
          '角跑到別的地方，就<b>不能</b>用 SAS。'
        ],
        formula: { label: 'SAS 相似<span class="pgref">課本 印 55</span>', tex: '\\overline{AB}:\\overline{DE}=\\overline{AC}:\\overline{DF}\\ ,\\ \\angle A=\\angle D' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label><span class="ival" id="mv">角在兩邊中間</span></label>
            <input type="range" id="ms" min="0" max="1" step="1" value="0"></div></div>`;
          const draw = () => {
            const ok = +h.querySelector('#ms').value === 0;
            h.querySelector('#mv').textContent = ok ? '角在兩邊中間' : '角不在中間';
            const tri = (ox, sc, co) => {
              const P = [ox, 176], Q = [ox + 96 * sc, 176], Rr = [ox + 26 * sc, 176 - 92 * sc];
              let t = SV.poly([P, Q, Rr], 'rgba(37,99,235,.05)', co, 2.2);

              t += `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${AMB}" stroke-width="5"/>`;
              t += `<line x1="${P[0]}" y1="${P[1]}" x2="${Rr[0]}" y2="${Rr[1]}" stroke="${VIO}" stroke-width="5"/>`;
              return { svg: t, P: P, Q: Q, R: Rr };
            };
            const t1 = tri(40, 1, BLU), t2 = tri(236, 1.5, GRN);
            let s = t1.svg + t2.svg;

            const mark = (t, at) => {
              const c = at === 'P' ? t.P : t.Q;
              return `<circle cx="${c[0] + (at === 'P' ? 14 : -14)}" cy="${c[1] - 10}" r="12" fill="none" stroke="${ok ? GRN : RED}" stroke-width="3"/>`;
            };
            s += mark(t1, ok ? 'P' : 'Q') + mark(t2, ok ? 'P' : 'Q');
            s += TX(88, 200, '兩邊 1 倍', { anchor: 'middle', fs: 13, c: GREY });
            s += TX(308, 200, '兩邊 1.5 倍', { anchor: 'middle', fs: 13, c: GREY });
            s += TX(220, 32, '橘色邊與紫色邊成比例', { anchor: 'middle', fs: 15, c: GREY });
            s += BOX(70, 214, 300, 46, { r: 12, fill: ok ? 'rgba(5,150,105,.10)' : 'rgba(225,29,72,.09)', stroke: ok ? GRN : RED, sw: 2.2 });
            s += TX(220, 244, ok ? '角在兩色邊交會處 → SAS 可以用 ✓' : '角不在兩色邊中間 → 不能用 SAS ✗',
              { anchor: 'middle', fs: 16, c: ok ? GRN : RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', s);
          };
          h.querySelector('#ms').oninput = draw;
          draw();
        },
        caption: '比 SSS 少檢查一條邊，代價是<b>那個角的位置不能錯</b>。塗成兩個顏色就看得出來。',
        example: {
          q: '\\(\\overline{AB}:\\overline{DE}=\\overline{AC}:\\overline{DF}=1:2\\)，且 \\(\\angle A=\\angle D\\)，相似嗎？'
            + exTriPair({ l: { k: 0.8, ab: 'a', ac: 'b', ang: 'A' },
                          r: { k: 0.8, ab: '2a', ac: '2b', ang: 'D', names: ['D', 'E', 'F'] },
                          note: '紫色那個角，正好夾在兩條比例邊中間' }),
          steps: [
            '\\(\\angle A\\) 夾在 \\(\\overline{AB}\\) 和 \\(\\overline{AC}\\) 中間。',
            '\\(\\angle D\\) 也夾在 \\(\\overline{DE}\\) 和 \\(\\overline{DF}\\) 中間。'
          ],
          ans: '相似（SAS）'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: 'AA：只看兩個角，邊完全不用檢查',
        points: [
          '三個判別法裡<b>條件最少</b>的：兩個角相等就成立。',
          '邊為什麼不用查？因為兩個角已經把形狀<b>鎖死了</b>。',
          '有<b>平行線</b>的圖最好用：同位角相等，再加公用的角。'
        ],
        formula: { label: 'AA 相似<span class="pgref">課本 印 52–53</span>', tex: '\\begin{array}{c}\\angle A=\\angle A\\ ,\\ \\angle ADE=\\angle B\\\\\\Rightarrow\\ \\triangle ADE\\sim\\triangle ABC\\end{array}' },
        visual: (h) => {
          const A = [220, 30], B = [76, 190], Cc = [364, 190];
          const D = [A[0] + 0.5 * (B[0] - A[0]), A[1] + 0.5 * (B[1] - A[1])];
          const E = [A[0] + 0.5 * (Cc[0] - A[0]), A[1] + 0.5 * (Cc[1] - A[1])];
          SV.stepper(h, '0 0 440 258', [
            { t: '已知 DE 平行 BC。要證 △ADE 和 △ABC 相似。',
              d: () => SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2) +
                       `<line x1="${D[0]}" y1="${D[1]}" x2="${E[0]}" y2="${E[1]}" stroke="${GRN}" stroke-width="3.5"/>` +
                       SV.vlabel(A[0] - 6, A[1] - 8, 'A') + SV.vlabel(B[0] - 18, B[1] + 8, 'B') + SV.vlabel(Cc[0] + 8, Cc[1] + 8, 'C') +
                       SV.vlabel(D[0] - 20, D[1] + 4, 'D') + SV.vlabel(E[0] + 10, E[1] + 4, 'E') +
                       TX(220, D[1] - 10, 'DE ∥ BC', { anchor: 'middle', fs: 14, c: GRN }) },
            { t: '第一個角：<b>A 是兩個三角形共用的</b>，當然相等。',
              d: () => SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2) +
                       `<line x1="${D[0]}" y1="${D[1]}" x2="${E[0]}" y2="${E[1]}" stroke="${GRN}" stroke-width="3.5"/>` +
                       SV.vlabel(A[0] - 6, A[1] - 8, 'A') +
                       `<circle cx="${A[0]}" cy="${A[1] + 16}" r="15" fill="none" stroke="${RED}" stroke-width="2.5"/>` +
                       TX(220, 226, '∠A 是公用角，兩邊都有', { anchor: 'middle', fs: 18, c: RED }) },
            { t: '第二個角：DE 平行 BC，所以 ∠ADE 和 ∠B 是<b>同位角</b>，相等。',
              d: () => SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2) +
                       `<line x1="${D[0]}" y1="${D[1]}" x2="${E[0]}" y2="${E[1]}" stroke="${GRN}" stroke-width="3.5"/>` +
                       `<circle cx="${D[0] + 8}" cy="${D[1] + 10}" r="13" fill="none" stroke="${AMB}" stroke-width="2.5"/>` +
                       `<circle cx="${B[0] + 12}" cy="${B[1] - 12}" r="13" fill="none" stroke="${AMB}" stroke-width="2.5"/>` +
                       TX(220, 226, '∠ADE ＝ ∠B（同位角）', { anchor: 'middle', fs: 18, c: AMB }) },
            { t: '兩個角都相等，AA 成立。注意<b>名字順序</b>：A 對 A、D 對 B、E 對 C。',
              d: () => BOX(60, 60, 320, 60, { r: 13, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.4 }) +
                       TX(220, 98, '△ADE ∼ △ABC', { anchor: 'middle', fs: 24, c: GRN }) +
                       TX(220, 156, 'A→A　D→B　E→C', { anchor: 'middle', fs: 18, c: INK }) +
                       TX(220, 196, '兩個角一樣就夠了，不用檢查邊', { anchor: 'middle', fs: 15, c: GREY }) }
          ], { acc: false });
        },
        caption: '三個判別法到這裡收齊：<b>SSS 三條邊、SAS 兩邊夾一角、AA 兩個角</b>，條件一個比一個少。',
        example: {
          q: '\\(DE\\parallel BC\\)，還需要檢查邊長才能說相似嗎？'
            + exTri({ t: 0.45, names: ['D', 'E'], pq: 'DE', bc: 'BC' }),
          steps: [
            '公用角 \\(\\angle A\\) 相等。',
            '同位角 \\(\\angle ADE=\\angle B\\)。兩個角就夠了。'
          ],
          ans: '不用，AA 就成立'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '不平行的那種圖，要先把小三角形翻過來再對',
        points: [
          '\\(DE\\) <b>平行</b> \\(BC\\) 時，\\(\\triangle ADE\\sim\\triangle ABC\\)，名字照順序抄就對。',
          '\\(DE\\) <b>不平行</b>、但 \\(\\angle ADE=\\angle C\\) 時，是 \\(\\triangle ADE\\sim\\triangle ACB\\)——<b>B 和 C 要換位</b>。',
          '判斷不出來就<b>翻卡片</b>：把小三角形翻轉再疊上去。'
        ],
        formula: { label: '不平行的那一種<span class="pgref">課本 印 54</span>', tex: '\\angle ADE=\\angle C\\ \\Rightarrow\\ \\triangle ADE\\sim\\triangle ACB' },
        visual: (h) => {
          const A = [148, 36], B = [58, 202], Cc = [405, 202];
          const vB = [B[0] - A[0], B[1] - A[1]], vC = [Cc[0] - A[0], Cc[1] - A[1]];
          const LB = Math.hypot(vB[0], vB[1]), LC = Math.hypot(vC[0], vC[1]);
          const at = (v, k) => [A[0] + k * v[0], A[1] + k * v[1]];
          const t = 0.45;
          const D = at(vB, t), E = at(vC, t);
          const fD = at(vB, t * LC / LB);
          const fE = at(vC, t * LB / LC);
          const big = () => SV.poly([A, B, Cc], 'rgba(37,99,235,.05)', BLU, 2.2)
            + SV.vlabel(A[0] - 6, A[1] - 10, 'A') + SV.vlabel(B[0] - 18, B[1] + 20, 'B') + SV.vlabel(Cc[0] + 6, Cc[1] + 20, 'C');
          const ring = (p, dx, dy, col) => `<circle cx="${p[0] + dx}" cy="${p[1] + dy}" r="13" fill="none" stroke="${col}" stroke-width="2.5"/>`;
          SV.stepper(h, '0 0 440 300', [
            { t: '先看<b>平行</b>的那一種：DE ∥ BC，△ADE ∼ △ABC，名字照順序。',
              d: () => big()
                + SV.poly([A, D, E], 'rgba(5,150,105,.12)', GRN, 2.4)
                + SV.vlabel(D[0] - 18, D[1] + 4, 'D') + SV.vlabel(E[0] + 6, E[1] + 4, 'E')
                + TX((D[0] + E[0]) / 2, D[1] - 10, 'DE ∥ BC', { anchor: 'middle', fs: 14, c: GRN })
                + TX(220, 248, '△ADE ∼ △ABC', { anchor: 'middle', fs: 22, c: GRN })
                + TX(220, 278, 'A→A　D→B　E→C', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '把小三角形<b>複製成一張圖卡</b> △A′D′E′，和 △ADE 全等。',
              d: () => big()
                + SV.poly([A, D, E], 'rgba(5,150,105,.12)', GRN, 2.4)
                + SV.vlabel(D[0] - 18, D[1] + 4, 'D') + SV.vlabel(E[0] + 6, E[1] + 4, 'E')

                + SV.poly([[A[0] + 60, A[1] + 176], [D[0] + 60, D[1] + 176], [E[0] + 60, E[1] + 176]],
                  'rgba(124,58,237,.14)', VIO, 2.4)
                + SV.vlabel(A[0] + 38, A[1] + 184, 'A′', VIO) + SV.vlabel(D[0] + 40, D[1] + 180, 'D′', VIO)
                + SV.vlabel(E[0] + 66, E[1] + 180, 'E′', VIO)
                + TX(20, 250, '全等的圖卡', { fs: 14, c: VIO }) },
            { t: '圖卡<b>翻面</b>，A′ 疊回 A：原本貼著 AB 的那一邊改貼 AC。',
              d: () => big()
                + SV.poly([A, fD, fE], 'rgba(124,58,237,.14)', VIO, 2.4)
                + SV.vlabel(fD[0] - 18, fD[1] + 4, 'D', VIO) + SV.vlabel(fE[0] + 6, fE[1] + 2, 'E', VIO)
                + ring(fD, 12, -4, RED) + ring(Cc, -14, -10, RED)
                + TX(220, 248, '∠ADE ＝ ∠C', { anchor: 'middle', fs: 20, c: RED })
                + TX(220, 278, '這就是「不平行」的那一種圖', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '圖卡和 △ADE 全等、又和 △ABC 相似，所以<b>對應要跟著翻</b>。',
              d: () => BOX(56, 46, 328, 62, { r: 13, fill: 'rgba(124,58,237,.10)', stroke: VIO, sw: 2.4 })
                + TX(220, 86, '△ADE ∼ △ACB', { anchor: 'middle', fs: 26, c: VIO })
                + TX(220, 140, 'A→A　D→C　E→B', { anchor: 'middle', fs: 20, c: INK })
                + TX(220, 186, '不是 △ABC——B 和 C 換了位置', { anchor: 'middle', fs: 17, c: RED })
                + TX(220, 236, '列比例式前先念一遍：', { anchor: 'middle', fs: 15, c: GREY })
                + TX(220, 266, '「A 對 A、D 對 C、E 對 B」', { anchor: 'middle', fs: 18, c: GREY }) }
          ], { acc: false });
        },
        caption: '同一個小三角形，<b>換個擺法，對應的邊就換了</b>。不確定就翻一張紙卡試試。',
        example: {
          q: '\\(\\angle ADE=\\angle C\\)，\\(\\overline{AD}=2\\)、\\(\\overline{AC}=6\\)、\\(\\overline{AB}=8\\)，求 \\(\\overline{AE}\\)。',
          steps: [
            '\\(\\angle A\\) 公用、\\(\\angle ADE=\\angle C\\)，所以 \\(\\triangle ADE\\sim\\triangle ACB\\)。',
            '照對應：\\(\\overline{AD}:\\overline{AC}=\\overline{AE}:\\overline{AB}\\)，即 \\(2:6=\\overline{AE}:8\\)。'
          ],
          ans: '\\(\\overline{AE}=\\dfrac83\\)'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '最常錯的三件事',
        points: [
          '三個判別法條件由多到少：<b>SSS → SAS → AA</b>，先看題目給了什麼再選。',
          '寫相似式時，<b>名字順序</b>要跟對應關係一致。'
        ],
        formula: { label: '三個判別法（條件由多到少）<span class="pgref">課本 印 59 重點回顧</span>', tex: '\\text{SSS}\\ /\\ \\text{SAS}\\ /\\ \\text{AA}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: 'SSS 對應顛倒',
              bad: '照圖上位置配對',
              good: '兩組數<b>各自排序</b><br>最短對最短' },
            { tag: 'SAS 忘記夾角',
              bad: '兩組邊成比例<br>＋隨便一個角相等',
              good: '那個角必須<b>夾在</b><br>兩條比例邊中間' },
            { tag: '名字順序寫反',
              bad: '\\(\\triangle ADE\\sim\\triangle ABC\\) 卻<br>把 D 對到 C',
              good: '照相似式的順序：<br>A→A、D→B、E→C' }
          ]);
          MJ(h);
        },
        caption: '相似式一旦寫定，對應關係就固定了，之後列比例式都照它走。',
        example: {
          q: '兩組邊成比例，相等的角不在兩邊中間，可以用 SAS 嗎？'
            + exTriPair({ l: { k: 0.8, ab: 'a', ac: 'b', ang: 'A' },
                          r: { k: 0.8, ab: '2a', ac: '2b', ang: 'E', names: ['D', 'E', 'F'] },
                          note: '右邊那個角長在 E，沒有夾在兩條比例邊中間' }),
          steps: [
            'SAS 要求角是兩條比例邊的<b>夾角</b>。',
            '角不在中間就不符合條件。'
          ],
          ans: '不可以'
        }
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜習作暖身題',
        points: [
          '這三題是<b>選擇題</b>，先熱身，不用寫過程。',
          '前兩題上方有<b>概念提示</b>方塊，先看方塊再選。',
          '站穩兩件事：<b>相似要兩道門都過</b>、<b>判別法先看題目給什麼</b>。'
        ],
        formula: { label: '暖身重點', tex: '\\text{SSS}\\ /\\ \\text{SAS}\\ /\\ \\text{AA}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・暖身題', page: '印 13', sub: '先看概念提示方塊，再選答案', tags: ['暖身1', '暖身2 ⑴', '暖身2 ⑵'] }
          ]);
        },
        caption: '三題都是選擇，答對了再往下寫基礎題。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜課本隨堂（縮放）',
        points: [
          '縮放題先找<b>縮放中心</b>，再量倍數。',
          '前兩題的答案<b>本身是一張圖</b>，詳解會一步一步畫出來。',
          '倍率只改長度，角度不要跟著改。'
        ],
        formula: { label: '這一節在練', tex: '\\text{邊長}\\times k\\ ,\\quad \\text{角度不變}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 44–47', sub: '縮放與縮放中心', tags: ['課P44 第1題', '課P44 第2題', '課P47'] }
          ]);
        },
        caption: '前兩題是作圖，詳解會逐步畫出來。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜課本隨堂（相似多邊形）',
        points: [
          '判斷相似：<b>先看邊，再看角</b>，兩道門都要過。',
          '寫相似式時，<b>名字順序要跟對應關係一致</b>。',
          '點任一題看逐行詳解。'
        ],
        formula: { label: '這一節在練', tex: 'ABCD\\sim PQRS' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 49–51', sub: '相似多邊形與對應關係', tags: ['課P49', '課P50', '課P51'] }
          ]);
        },
        caption: '對應關係看名字順序，不看圖上誰在左邊。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜課本隨堂（相似判別）',
        points: [
          '判別法條件由多到少：<b>SSS → SAS → AA</b>，先看題目給了什麼。',
          'SAS 的那個角一定要<b>夾在兩條比例邊中間</b>。',
          '四題都抄下來，寫出用哪一個判別法。'
        ],
        formula: { label: '這一節在練', tex: '\\text{SSS}\\ /\\ \\text{SAS}\\ /\\ \\text{AA}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 53–58', sub: '相似判別', tags: ['課P53', '課P54', '課P56', '課P58'] }
          ]);
        },
        caption: '每一題先說「這題用哪一個判別法」。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜習作基礎（1～3）',
        points: [
          '<b>今天當堂寫完</b>，寫完自己對一次詳解。',
          '圖形題先把已知標到圖上，再判斷。',
          '基礎五題分兩頁，這是前三題。'
        ],
        formula: { label: '這一節在練', tex: '\\triangle ABC\\sim\\triangle DEF' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作', page: '印 12–13', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '基礎前三題，當堂寫完。'
      },

      {
        sec: '1-3', secName: '縮放與相似',
        title: '練習｜習作基礎（4～5）與精熟',
        points: [
          '<b>基礎後兩題今天一起寫完</b>；精熟兩題行有餘力再做。',
          '相似式寫完再回頭檢查<b>名字順序</b>對不對。',
          '精熟題點開會標「進階」，不強迫全班都做。'
        ],
        formula: { label: '這一節在練', tex: '\\triangle ABC\\sim\\triangle DEF' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作', page: '印 14–15', sub: '基礎題，今天寫完', tags: ['基礎4', '基礎5'] },
            { src: '習作', page: '印 15', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '習作基礎五題到這裡寫完。'
      }
    ]
  });
})();
