window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

  const SECVB = '0 0 440 286';
  const SECBG = `<rect x="0" y="0" width="440" height="286" fill="#fff"/>`;
  const secCards = (cards, showTag, star) => {
    const n = cards.length, top = 52 + (4 - n) * 26;
    return cards.map((c, i) => {
      const y = top + i * 52, on = showTag && i === star;
      return BOX(14, y, 214, 42, { r: 11, fill: on ? 'rgba(5,150,105,.09)' : '#fbfcfe',
        stroke: on ? GRN : '#dce3ee', sw: on ? 2.2 : 1.6 })
        + TX(28, y + 27, c[0], { fs: 16, c: INK })
        + (showTag ? TX(244, y + 27, c[1], { fs: 14.5, c: c[2] || GREY }) : '');
    }).join('');
  };
  const secActTwo = (rows, notes) =>
    rows.map((r, i) => {
      const y = 50 + i * 76;
      return BOX(16, y, 408, 66, { r: 12,
        fill: r[2] === BLU ? 'rgba(37,99,235,.07)' : 'rgba(5,150,105,.07)', stroke: r[2], sw: 2 })
        + TX(220, y + 28, r[0], { anchor: 'middle', fs: 17, c: r[2] })
        + TX(220, y + 54, r[1], { anchor: 'middle', fs: 15, c: INK });
    }).join('')
    + (notes || []).map((t, i) =>
      TX(220, 224 + i * 26, t, { anchor: 'middle', fs: i ? 14 : 15, c: GREY })).join('');

  const P = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
  const CIRC = (cx, cy, r, o = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill || 'none'}" stroke="${o.stroke || BLU}" stroke-width="${o.sw || 2.4}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

  const ARCP = (cx, cy, r, d0, d1) => {
    let sweep = d1 - d0; while (sweep < 0) sweep += 360;
    const a = P(cx, cy, r, d0), b = P(cx, cy, r, d1);
    return `M${a[0].toFixed(1)},${a[1].toFixed(1)} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 0 ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  };
  const ARC2 = (cx, cy, r, d0, d1, col, w) =>
    `<path d="${ARCP(cx, cy, r, d0, d1)}" fill="none" stroke="${col || VIO}" stroke-width="${w || 4}" stroke-linecap="round"/>`;

  const SECT = (cx, cy, r, d0, d1, o = {}) =>
    `<path d="M${cx},${cy} L${P(cx, cy, r, d0).map(v => v.toFixed(1)).join(',')} A${r},${r} 0 ${((d1 - d0 + 360) % 360) > 180 ? 1 : 0} 0 ${P(cx, cy, r, d1).map(v => v.toFixed(1)).join(',')} Z"`
    + ` fill="${o.fill || 'rgba(124,58,237,.14)'}" stroke="${o.stroke || VIO}" stroke-width="${o.sw || 2.2}"/>`;
  const DOT = (p, col, r) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r || 4.4}" fill="#fff" stroke="${col || INK}" stroke-width="2.4"/>`;
  const SEG = (p, q, col, w, dash) => SV.seg(p[0], p[1], q[0], q[1], col || INK, w || 2.4, dash || '');

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

  const BOARD = (x, y, hi) => {
    const row = (i, t1, t2, note, col) => {
      const on = hi === i, yy = y + i * 46;
      return BOX(x, yy, 268, 40, { r: 10, fill: on ? 'rgba(5,150,105,.10)' : '#fbfcfe', stroke: on ? col : '#dce3ee', sw: on ? 2.2 : 1.6 })
        + TX(x + 14, yy + 27, t1, { fs: 16, c: on ? col : GREY })
        + TX(x + 92, yy + 27, t2, { fs: 16, c: on ? INK : GREY })
        + TX(x + 186, yy + 27, note, { fs: 13.5, c: on ? col : '#b3bbc8' });
    };
    return row(0, '圓心角', '＝ 弧', '（一樣大）', VIO) + row(1, '圓周角', '＝ 弧 ÷ 2', '（小一半）', GRN);
  };

  window.DECK.push({
    ch: 2,
    title: '圓形',
    color: C,
    sections: ['2-1 點、直線與圓之間的位置關係', '2-2 圓心角、圓周角與弧的關係'],
    slides: [

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '這一節只有兩件事：套公式，和比距離',
        points: [
          '前半是<b>套公式</b>：弧長和扇形面積，公式長得幾乎一樣。',
          '後半是<b>比距離</b>：把一個距離 \\(d\\) 拿去和半徑 \\(r\\) 比大小。',
          '中間還有一個萬用動作：<b>看到切線，先連圓心到切點</b>。',
          '名詞很多，但每個名詞都只是<b>圖上的一段</b>——先認圖再背名字。'
        ],
        formula: { label: '這一節的主角<span class="pgref">課本 印 88–110</span>', tex: '\\text{弧長}=2\\pi r\\times\\dfrac{x}{360}\\ ;\\quad d\\ \\text{和}\\ r\\ \\text{誰大}' },
        visual: (h) => {
          SV.stepper(h, SECVB, [
            { t: '前半在<b>算大小</b>：一整圈的幾分之幾。',
              d: () => SECBG + TX(220, 32, '前半：套公式', { anchor: 'middle', fs: 16, c: GREY })
                + CIRC(140, 150, 72, { stroke: '#c9d3e2', dash: '5 5' })
                + SECT(140, 150, 72, 90, 210)
                + TX(140, 244, '扇形＝整圓的 120/360', { anchor: 'middle', fs: 15, c: VIO })
                + TX(300, 120, '弧長、扇形面積', { anchor: 'middle', fs: 17, c: INK })
                + TX(300, 152, '兩個公式的', { anchor: 'middle', fs: 15, c: GREY })
                + TX(300, 180, '倍率是同一個', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '後半在<b>比大小</b>：距離 \\(d\\) 和半徑 \\(r\\)，誰比較大。',
              d: () => SECBG + TX(220, 32, '後半：比距離', { anchor: 'middle', fs: 16, c: GREY })
                + CIRC(120, 152, 62, { stroke: BLU })
                + DOT([120, 152], INK, 3.6) + TX(120, 142, 'O', { anchor: 'middle', fs: 13, c: GREY })
                + DOT([206, 120], RED) + TX(214, 116, 'd ＞ r：外面', { fs: 14, c: RED })
                + DOT(P(120, 152, 62, 235), GRN) + TX(60, 214, 'd ＝ r：在圓上', { fs: 14, c: GRN })
                + DOT([104, 176], AMB) + TX(64, 186, 'd ＜ r', { anchor: 'end', fs: 14, c: AMB })
                + TX(300, 214, '點是這樣、直線也是這樣', { anchor: 'middle', fs: 15, c: INK })
                + TX(300, 244, '差別只在 d 從哪裡量起', { anchor: 'middle', fs: 14, c: GREY }) },
            { t: '整節就這兩件事，加一個萬用動作。',
              d: () => SECBG + TX(220, 34, '整節只有兩件事', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 套公式', '弧長、扇形面積——倍率都是 圓心角/360', GRN],
                    ['② 比距離', 'd 和 r 誰大，就決定了位置關係', BLU]
                  ], ['萬用動作：看到切線，先連圓心到切點', '連完就出現直角三角形，畢氏定理就能上場']) }
          ], { acc: false });
        },
        caption: '名詞很多不要緊——<b>先認得圖上是哪一段</b>，名字自然就記住了。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '圓上的五個名字：先認圖，再記名字',
        points: [
          '<b>弦</b>是兩點之間的直線段；<b>弧</b>是同樣兩點之間的那段圓周。',
          '<b>弓形</b>＝弦和弧圍起來的；<b>扇形</b>＝兩條半徑和一段弧圍起來的。',
          '<b>圓心角</b>的頂點一定在<b>圓心</b>上。'
        ],
        formula: { label: '五個名字<span class="pgref">課本 印 90–91</span>', tex: '\\text{弦、弧、弓形、圓心角、扇形}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>現在看 <span class="ival" id="nv">弦</span></label>
            <input type="range" id="ns" min="0" max="4" step="1" value="0"></div></div>`;
          const NAMES = ['弦', '弧', '弓形', '圓心角', '扇形'];
          const draw = () => {
            const i = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = NAMES[i];
            const cx = 220, cy = 140, r = 96, d0 = 200, d1 = 340;
            const A = P(cx, cy, r, d0), B = P(cx, cy, r, d1);
            const dim = '#d3dae6';

            let s = CIRC(cx, cy, r, { stroke: dim, sw: 2.4 });
            if (i === 2) s += `<path d="${ARCP(cx, cy, r, d0, d1)} Z" fill="rgba(217,119,6,.16)" stroke="none"/>`;
            if (i === 4) s += SECT(cx, cy, r, d0, d1, { fill: 'rgba(5,150,105,.14)', stroke: GRN });
            if (i < 3) s += CIRC(cx, cy, r, { stroke: BLU, sw: 2.4 });
            s += SEG(A, B, i === 0 || i === 2 ? VIO : dim, i === 0 || i === 2 ? 5 : 2.4);
            s += ARC2(cx, cy, r, d0, d1, i === 1 || i === 2 ? AMB : (i === 4 ? GRN : dim), i === 1 || i === 2 ? 6 : 3);
            if (i === 3 || i === 4) {
              s += SEG([cx, cy], A, i === 4 ? GRN : dim, 3) + SEG([cx, cy], B, i === 4 ? GRN : dim, 3);
              if (i === 3) s += SV.angle(cx, cy, 34, d0, d1, RED, '圓心角', { fs: 15, lr: 16 });
            }
            s += DOT([cx, cy], INK, 3.8) + TX(cx, cy - 10, 'O', { anchor: 'middle', fs: 13, c: GREY });
            s += DOT(A, INK) + DOT(B, INK);
            s += TX(A[0] - 14, A[1] + 6, 'A', { fs: 15, c: INK }) + TX(B[0] + 6, B[1] + 6, 'B', { fs: 15, c: INK });
            const NOTE = ['弦 AB：兩點之間的<直線段>', '弧 AB：兩點之間的<那段圓周>',
              '弓形：弦和弧圍起來的那一塊', '圓心角：頂點在圓心 O 上', '扇形：兩條半徑 ＋ 一段弧'];
            s += TX(220, 268, NOTE[i].replace('<', '').replace('>', ''), { anchor: 'middle', fs: 17, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 440 282', s);
          };
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '⚠ <b>弦是直的、弧是彎的</b>——同樣兩個端點，兩種走法。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '長得像扇子，不一定是扇形',
        points: [
          '扇形要同時滿足兩件事：<b>兩條邊都是半徑</b>、中間那條邊是<b>圓弧</b>。',
          '少一條就不算——彎月形、弓形都不是扇形。',
          '判斷時<b>先找圓心</b>：兩條邊有沒有從圓心出發。'
        ],
        formula: { label: '扇形的定義<span class="pgref">課本 印 91</span>', tex: '\\text{兩條半徑}+\\text{一段弧}' },
        visual: (h) => {
          const cell = (ox, oy, ok, draw, lab) => {
            const col = ok ? GRN : RED;
            return BOX(ox, oy, 128, 116, { r: 12, fill: ok ? 'rgba(5,150,105,.05)' : 'rgba(225,29,72,.04)', stroke: col, sw: 2 })
              + draw(ox + 64, oy + 54)
              + TX(ox + 64, oy + 104, (ok ? '✓ ' : '✗ ') + lab, { anchor: 'middle', fs: 14, c: col });
          };
          let s = TX(220, 28, '哪一個是扇形？兩條邊都要是半徑', { anchor: 'middle', fs: 16, c: GREY });

          s += cell(14, 44, true, (x, y) => SECT(x, y + 14, 40, 60, 160, { fill: 'rgba(5,150,105,.16)', stroke: GRN }), '扇形');

          s += cell(156, 44, false, (x, y) =>
            `<path d="${ARCP(x, y + 14, 40, 200, 340)} Z" fill="rgba(225,29,72,.10)" stroke="${RED}" stroke-width="2"/>`, '弓形');

          s += cell(298, 44, false, (x, y) =>
            `<path d="${ARCP(x, y + 16, 44, 210, 330)} A56,56 0 0 1 ${P(x, y + 16, 44, 210).map(v => v.toFixed(1)).join(',')} Z" fill="rgba(225,29,72,.10)" stroke="${RED}" stroke-width="2"/>`, '彎月形');
          s += BOX(40, 176, 360, 92, { r: 12, fill: '#fbfcfe', stroke: '#dce3ee', sw: 1.6 });
          s += TX(220, 204, '判斷只問兩句', { anchor: 'middle', fs: 16, c: GREY });
          s += TX(220, 232, '① 兩條直的邊，是不是都從圓心出發？', { anchor: 'middle', fs: 16, c: INK });
          s += TX(220, 258, '② 中間那條，是不是圓弧？', { anchor: 'middle', fs: 16, c: INK });
          h.innerHTML = svg('0 0 440 282', s);
        },
        caption: '⚠ <b>弓形只有一條邊是弦</b>，彎月形<b>兩條邊都是弧</b>——都不是扇形。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '圓周率不是「大圓比較大」，它是一個固定的倍數',
        points: [
          '正方形不管畫多大，<b>周長 ÷ 邊長永遠是 4</b>。',
          '圓也一樣：<b>圓周長 ÷ 直徑</b> 永遠是同一個數，就叫 \\(\\pi\\)。',
          '所以 \\(\\pi\\) <b>跟圓的大小無關</b>，大圓小圓都是 \\(3.14\\ldots\\)。'
        ],
        formula: { label: '圓周率是「除出來」的<span class="pgref">課本 印 90</span>', tex: '\\pi=\\dfrac{\\text{圓周長}}{\\text{直徑長}}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>把圖形放大 <span class="ival" id="kv">1.0</span> 倍</label>
            <input type="range" id="ks" min="6" max="14" step="2" value="10"></div></div>`;
          const draw = () => {
            const k = +h.querySelector('#ks').value / 10;
            h.querySelector('#kv').textContent = k.toFixed(1);
            const a = 46 * k, r = 44 * k;
            let s = '';

            s += BOX(112 - a / 2, 128 - a / 2, a, a, { r: 3, fill: 'rgba(37,99,235,.08)', stroke: BLU, sw: 2.4 });
            s += TX(112, 128 + a / 2 + 20, '邊長 ' + (4 * k).toFixed(1), { anchor: 'middle', fs: 14, c: BLU });
            s += TX(112, 42, '正方形', { anchor: 'middle', fs: 15, c: GREY });

            s += CIRC(320, 128, r, { fill: 'rgba(124,58,237,.08)', stroke: VIO, sw: 2.4 });
            s += SEG([320 - r, 128], [320 + r, 128], VIO, 3);
            s += TX(320, 128 + r + 20, '直徑 ' + (4 * k).toFixed(1), { anchor: 'middle', fs: 14, c: VIO });
            s += TX(320, 42, '圓', { anchor: 'middle', fs: 15, c: GREY });

            s += BOX(14, 200, 200, 70, { r: 12, fill: 'rgba(37,99,235,.06)', stroke: BLU, sw: 2 });
            s += TX(114, 226, '周長 ÷ 邊長', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(114, 256, '＝ 4', { anchor: 'middle', fs: 21, c: BLU });
            s += BOX(226, 200, 200, 70, { r: 12, fill: 'rgba(124,58,237,.06)', stroke: VIO, sw: 2 });
            s += TX(326, 226, '圓周長 ÷ 直徑', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(326, 256, '＝ 3.14…', { anchor: 'middle', fs: 21, c: VIO });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ks').oninput = draw;
          draw();
        },
        caption: '拖滑桿放大縮小——<b>兩個比值一個都沒有變</b>。這就是「固定倍數」的意思。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '弧長：整圈的幾分之幾，就乘幾分之幾',
        points: [
          '一整圈是 \\(360\\degree\\)，圓心角 \\(x\\degree\\) 就是<b>整圈的 \\(x/360\\)</b>。',
          '所以弧長 ＝ <b>整個圓周長</b> \\(2\\pi r\\) <b>乘上那個倍率</b>。',
          '⚠ 分母<b>一律用 360</b>（有些影片寫 180，那是把 2 先約掉，同一件事）。'
        ],
        formula: { label: '弧長公式<span class="pgref">課本 印 92</span>', tex: '\\ell=2\\pi r\\times\\dfrac{x}{360}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>圓心角 <span class="ival" id="av">90</span>°</label>
            <input type="range" id="as" min="0" max="4" step="1" value="1"></div></div>`;
          const DEG = [45, 90, 120, 180, 270];
          const draw = () => {
            const i = +h.querySelector('#as').value, x = DEG[i];
            h.querySelector('#av').textContent = x;
            const cx = 150, cy = 130, r = 88;
            let s = CIRC(cx, cy, r, { stroke: '#d3dae6', dash: '5 5' });
            s += SECT(cx, cy, r, 90, 90 + x, { fill: 'rgba(124,58,237,.10)', stroke: '#cfc0f0', sw: 1.6 });
            s += ARC2(cx, cy, r, 90, 90 + x, AMB, 6);
            s += DOT([cx, cy], INK, 3.6);
            s += SV.angle(cx, cy, 30, 90, 90 + x, RED, x + '°', { fs: 14, lr: 14 });
            s += TX(cx, cy + r + 34, '半徑 r', { anchor: 'middle', fs: 14, c: GREY });
            const g = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
            const G = g(x, 360);
            s += BOX(258, 52, 170, 74, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 });
            s += TX(343, 78, '這一段是整圈的', { anchor: 'middle', fs: 14, c: GREY });
            s += TX(343, 108, (x / G) + ' / ' + (360 / G), { anchor: 'middle', fs: 22, c: AMB });
            s += BOX(258, 140, 170, 74, { r: 12, fill: 'rgba(5,150,105,.07)', stroke: GRN, sw: 2 });
            s += TX(343, 166, '弧長 ＝', { anchor: 'middle', fs: 14, c: GREY });
            s += TX(343, 196, '2πr × ' + x + '/360', { anchor: 'middle', fs: 17, c: GRN });
            s += TX(220, 258, '圓心角變幾倍，弧長就變幾倍', { anchor: 'middle', fs: 16, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 440 274', s);
          };
          h.querySelector('#as').oninput = draw;
          draw();
        },
        caption: '⚠ 先想「<b>這是整圈的幾分之幾</b>」，再乘——不要直接背公式。',
        example: {
          q: '扇形半徑 \\(9\\)、圓心角 \\(120\\degree\\)，求弧長。',
          steps: [
            '\\(120/360=1/3\\)，是整圈的三分之一。',
            '整個圓周長 \\(=2\\pi\\times9=18\\pi\\)，取三分之一。'
          ],
          ans: '弧長 \\(=6\\pi\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '扇形面積：一樣的倍率，換成乘面積',
        points: [
          '倍率<b>跟弧長那一頁一模一樣</b>，還是 \\(x/360\\)。',
          '差別只在<b>被乘的東西</b>：弧長乘周長 \\(2\\pi r\\)，面積乘 \\(\\pi r^2\\)。',
          '所以只要記住<b>一個倍率、兩個「整個圓」</b>。'
        ],
        formula: { label: '扇形面積公式<span class="pgref">課本 印 92</span>', tex: 'A=\\pi r^2\\times\\dfrac{x}{360}' },
        visual: (h) => {
          const row = (y, tag, whole, res, col) =>
            BOX(16, y, 408, 62, { r: 12, fill: col === GRN ? 'rgba(5,150,105,.07)' : 'rgba(217,119,6,.07)', stroke: col, sw: 2 })
            + TX(36, y + 38, tag, { fs: 17, c: col })
            + TX(150, y + 38, '＝', { fs: 17, c: GREY })
            + TX(186, y + 38, whole, { fs: 18, c: INK })
            + TX(300, y + 38, '×', { fs: 17, c: GREY })
            + TX(330, y + 38, res, { fs: 18, c: RED });
          let s = TX(220, 34, '兩個公式，只差中間那一塊', { anchor: 'middle', fs: 16, c: GREY });
          s += row(52, '弧　長', '2πr', 'x/360', AMB);
          s += row(126, '扇形面積', 'πr²', 'x/360', GRN);
          s += BOX(60, 204, 320, 62, { r: 12, fill: 'rgba(225,29,72,.05)', stroke: RED, sw: 2 });
          s += TX(220, 230, '紅色那一塊是同一個倍率', { anchor: 'middle', fs: 16, c: RED });
          s += TX(220, 256, '「整圈的幾分之幾」只算一次', { anchor: 'middle', fs: 15, c: INK });
          h.innerHTML = svg('0 0 440 278', s);
        },
        caption: '⚠ 兩條公式<b>不要分開背</b>：先算倍率，再問「要乘周長還是乘面積」。',
        example: {
          q: '扇形半徑 \\(9\\)、圓心角 \\(120\\degree\\)，求面積。',
          steps: [
            '倍率還是 \\(120/360=1/3\\)。',
            '整個圓面積 \\(=\\pi\\times9^2=81\\pi\\)，取三分之一。'
          ],
          ans: '面積 \\(=27\\pi\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '反過來問圓心角：先把整圈算出來，再除',
        points: [
          '題目給弧長、問圓心角，就是<b>把公式倒過來用</b>。',
          '順序固定：<b>先算整個圓周長</b>，再看「弧長是它的幾分之幾」。',
          '那個分數乘 \\(360\\)，就是圓心角。'
        ],
        formula: { label: '倒過來用<span class="pgref">課本 印 93</span>', tex: '\\dfrac{x}{360}=\\dfrac{\\ell}{2\\pi r}\\ \\Rightarrow\\ x=\\dfrac{\\ell}{2\\pi r}\\times360' },
        visual: (h) => {
          const cx = 130, cy = 120, r = 78;
          SV.stepper(h, '0 0 440 272', [
            { t: '題目：半徑 <b>8</b>，弧長 <b>4π</b>，圓心角是幾度？',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6', dash: '5 5' })
                + ARC2(cx, cy, r, 90, 180, AMB, 6) + DOT([cx, cy], INK, 3.6)
                + TX(cx, cy + r + 22, '半徑 8', { anchor: 'middle', fs: 15, c: GREY })
                + TX(270, 96, '弧長 ＝ 4π', { fs: 18, c: AMB })
                + TX(270, 132, '圓心角 ＝ ?', { fs: 18, c: RED })
                + TX(220, 258, '不要直接套——先算整圈', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '第一步：<b>整個圓周長</b> ＝ \\(2\\pi\\times8=16\\pi\\)。',
              d: () => CIRC(cx, cy, r, { stroke: BLU, sw: 3 }) + DOT([cx, cy], INK, 3.6)
                + BOX(240, 70, 180, 60, { r: 11, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 })
                + TX(330, 96, '整圈周長', { anchor: 'middle', fs: 14, c: GREY })
                + TX(330, 122, '2π × 8 ＝ 16π', { anchor: 'middle', fs: 18, c: BLU })
                + TX(220, 246, '這一步先算完，後面才不會亂', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '第二步：\\(4\\pi\\) 是 \\(16\\pi\\) 的<b>四分之一</b>。',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6', dash: '5 5' })
                + SECT(cx, cy, r, 90, 180, { fill: 'rgba(217,119,6,.14)', stroke: AMB })
                + DOT([cx, cy], INK, 3.6)
                + BOX(240, 70, 180, 60, { r: 11, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 })
                + TX(330, 96, '4π ÷ 16π', { anchor: 'middle', fs: 15, c: GREY })
                + TX(330, 122, '＝ 1/4', { anchor: 'middle', fs: 20, c: AMB })
                + TX(220, 246, 'π 上下消掉，剩下 4 ÷ 16', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '第三步：四分之一圈就是 \\(360\\div4=\\) <b>90°</b>。',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6', dash: '5 5' })
                + SECT(cx, cy, r, 90, 180, { fill: 'rgba(5,150,105,.14)', stroke: GRN })
                + DOT([cx, cy], INK, 3.6)
                + SV.angle(cx, cy, 28, 90, 180, RED, '90°', { fs: 14, lr: 14 })
                + BOX(240, 96, 180, 62, { r: 11, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(330, 122, '1/4 × 360', { anchor: 'middle', fs: 15, c: GREY })
                + TX(330, 148, '＝ 90°', { anchor: 'middle', fs: 21, c: GRN })
                + TX(220, 246, '算不下去的時候，回去把正著算的那題再做一次', { anchor: 'middle', fs: 14, c: GREY }) }
          ], { acc: false });
        },
        caption: '⚠ 卡住不要換題目——<b>回去把「正著算」那一題用公式再做一次</b>，再回來。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '點在圓裡還是圓外：只要量一段距離',
        points: [
          '量<b>點到圓心</b>的距離 \\(d\\)，拿去和半徑 \\(r\\) 比大小。',
          '<b>離圓心越遠 → 越外面</b>：\\(d>r\\) 在外、\\(d=r\\) 在圓上、\\(d<r\\) 在裡面。',
          '⚠ 題目給<b>直徑</b>的時候，要<b>先除以 2</b> 變成半徑再比。'
        ],
        formula: { label: '比一個距離就好<span class="pgref">課本 印 96</span>', tex: 'd\\gt r\\ \\text{外}\\ ;\\quad d=r\\ \\text{上}\\ ;\\quad d\\lt r\\ \\text{內}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>點到圓心的距離 d ＝ <span class="ival" id="dv">7</span></label>
            <input type="range" id="ds" min="2" max="9" step="1" value="7"></div></div>`;
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            h.querySelector('#dv').textContent = d;
            const cx = 180, cy = 142, R = 5, u = 16, r = R * u;
            const px = cx + d * u;
            const state = d > R ? ['在圓的外部', RED, 'd ＞ r'] : d === R ? ['在圓上', GRN, 'd ＝ r'] : ['在圓的內部', AMB, 'd ＜ r'];
            let s = CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.05)', stroke: BLU, sw: 2.4 });
            s += DOT([cx, cy], INK, 3.8) + TX(cx - 4, cy - 12, 'O', { anchor: 'end', fs: 14, c: GREY });
            s += SEG([cx, cy], [px, cy], state[1], 3, '5 4');
            s += DOT([px, cy], state[1], 5.4) + TX(px, cy - 16, 'P', { anchor: 'middle', fs: 15, c: state[1] });
            s += TX((cx + px) / 2, cy + 22, 'd ＝ ' + d, { anchor: 'middle', fs: 15, c: state[1] });
            s += SEG([cx, cy], [cx, cy - r], BLU, 3);
            s += TX(cx - 8, cy - r / 2, 'r ＝ 5', { anchor: 'end', fs: 14, c: BLU });
            s += BOX(90, 228, 260, 48, { r: 12, fill: 'rgba(0,0,0,.02)', stroke: state[1], sw: 2.2 });
            s += TX(220, 259, state[2] + '　→　' + state[0], { anchor: 'middle', fs: 18, c: state[1] });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ds').oninput = draw;
          draw();
        },
        caption: '⚠ 不用記 \\(d>r\\) 還是 \\(d<r\\)——想「<b>離圓心越遠越外面</b>」就不會反。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '直線與圓：量的是垂直距離，不是隨便一段',
        points: [
          '\\(d\\) 是<b>圓心到直線的垂直距離</b>——斜著量的不算。',
          '一樣是<b>離得越遠，交點越少</b>：\\(d<r\\) 兩點、\\(d=r\\) 一點、\\(d>r\\) 不相交。',
          '⚠ 交<b>兩點</b>的叫<b>割線</b>，交<b>一點</b>的才叫<b>切線</b>，那一點叫<b>切點</b>。'
        ],
        formula: { label: '還是比 d 和 r<span class="pgref">課本 印 98–99</span>', tex: 'd\\lt r\\ \\text{兩點}\\ ;\\ d=r\\ \\text{一點（相切）}\\ ;\\ d\\gt r\\ \\text{不相交}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>圓心到直線的距離 d ＝ <span class="ival" id="dv">4</span></label>
            <input type="range" id="ds" min="2" max="8" step="1" value="4"></div></div>`;
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            h.querySelector('#dv').textContent = d;
            const cx = 220, cy = 118, R = 5, u = 17, r = R * u;
            const ly = cy + d * u;
            const st = d > R ? ['不相交', RED, '0 個交點'] : d === R ? ['相切', GRN, '1 個交點（切點）'] : ['相割', AMB, '2 個交點'];
            let s = CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.05)', stroke: BLU, sw: 2.4 });
            s += DOT([cx, cy], INK, 3.8) + TX(cx - 6, cy - 10, 'O', { anchor: 'end', fs: 14, c: GREY });
            s += SV.seg(22, ly, 418, ly, st[1], 3.4);

            s += SEG([cx, cy], [cx, ly], st[1], 2.6, '5 4');
            s += SV.rightAngle(cx, ly, 0, 90, 11, '#7b8699');
            s += TX(cx + 10, (cy + ly) / 2 + 5, 'd ＝ ' + d, { fs: 15, c: st[1] });
            if (d < R) {
              const dx = Math.sqrt(r * r - (d * u) * (d * u));
              s += DOT([cx - dx, ly], AMB, 5) + DOT([cx + dx, ly], AMB, 5);
            } else if (d === R) s += DOT([cx, ly], GRN, 5.6);
            s += TX(400, ly - 12, 'L', { anchor: 'end', fs: 15, c: st[1] });
            s += BOX(80, 228, 280, 48, { r: 12, fill: 'rgba(0,0,0,.02)', stroke: st[1], sw: 2.2 });
            s += TX(220, 259, st[0] + '　' + st[2], { anchor: 'middle', fs: 18, c: st[1] });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ds').oninput = draw;
          draw();
        },
        caption: '⚠ 虛線那一段<b>帶直角記號</b>才是 \\(d\\)——斜著量到圓上任何一點都不算。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '看到切線，先連圓心到切點',
        points: [
          '切線碰到圓的那一點叫<b>切點</b>；<b>圓心連切點，一定垂直切線</b>。',
          '連完就冒出一個<b>直角三角形</b>，畢氏定理馬上能用。',
          '⚠ 三條邊的角色別搞錯：<b>半徑和切線段是兩條股，\\(\\overline{OP}\\) 是斜邊</b>。'
        ],
        formula: { label: '萬用輔助線<span class="pgref">課本 印 100</span>', tex: '\\overline{OA}\\perp\\overleftrightarrow{AP}\\ \\Rightarrow\\ \\overline{OA}^2+\\overline{AP}^2=\\overline{OP}^2' },
        visual: (h) => {

          const cx = 140, cy = 160, r = 58, Pp = [360, 160];
          const D = Pp[0] - cx, th = Math.acos(r / D) * 180 / Math.PI;
          const A = P(cx, cy, r, th);
          const ext = (q, k) => [Pp[0] + (q[0] - Pp[0]) * k, Pp[1] + (q[1] - Pp[1]) * k];
          SV.stepper(h, '0 0 440 272', [
            { t: '一條切線碰到圓，只碰<b>一個點</b>——那一點叫<b>切點</b>。',
              d: () => CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.05)', stroke: BLU })
                + DOT([cx, cy], INK, 3.6) + TX(cx - 6, cy + 4, 'O', { anchor: 'end', fs: 14, c: GREY })
                + SEG(Pp, ext(A, 1.5), VIO, 3.2)
                + DOT(A, VIO, 5.4) + TX(A[0] - 6, A[1] - 10, 'A', { anchor: 'end', fs: 15, c: VIO })
                + DOT(Pp, INK, 4.6) + TX(Pp[0] + 8, Pp[1] + 4, 'P', { fs: 15, c: INK })
                + TX(220, 244, 'A 是切點，P 是圓外一點', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '把<b>圓心 O 連到切點 A</b>——這條線一定<b>垂直</b>切線。',
              d: () => CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.05)', stroke: BLU })
                + DOT([cx, cy], INK, 3.6) + TX(cx - 6, cy + 4, 'O', { anchor: 'end', fs: 14, c: GREY })
                + SEG(Pp, ext(A, 1.5), '#cfc0f0', 3.2)
                + SEG([cx, cy], A, RED, 4)
                + SV.rightAngle(A[0], A[1], SV.angleOf(A[0], A[1], cx, cy), SV.angleOf(A[0], A[1], Pp[0], Pp[1]), 13, '#7b8699')
                + DOT(A, VIO, 5.4) + TX(A[0] - 6, A[1] - 10, 'A', { anchor: 'end', fs: 15, c: VIO })
                + DOT(Pp, INK, 4.6) + TX(Pp[0] + 8, Pp[1] + 4, 'P', { fs: 15, c: INK })
                + TX(220, 244, '這個直角是白送的——不必證明', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '再連 <b>OP</b>，直角三角形就出現了：兩條<b>股</b>、一條<b>斜邊</b>。',
              d: () => CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.04)', stroke: '#c9d3e2' })
                + SV.poly([[cx, cy], A, Pp], 'rgba(5,150,105,.10)', GRN, 2.4)
                + SV.rightAngle(A[0], A[1], SV.angleOf(A[0], A[1], cx, cy), SV.angleOf(A[0], A[1], Pp[0], Pp[1]), 13, '#7b8699')
                + DOT([cx, cy], INK, 3.6) + DOT(A, VIO, 5.4) + DOT(Pp, INK, 4.6)
                + TX(cx - 6, cy + 4, 'O', { anchor: 'end', fs: 14, c: GREY })
                + TX(A[0] - 6, A[1] - 10, 'A', { anchor: 'end', fs: 15, c: VIO })
                + TX(Pp[0] + 8, Pp[1] + 4, 'P', { fs: 15, c: INK })
                + TX(132, 134, '半徑（股）', { anchor: 'end', fs: 13.5, c: RED })
                + TX(276, 116, '切線段（股）', { anchor: 'middle', fs: 13.5, c: VIO })
                + TX(250, 184, '斜邊 OP', { anchor: 'middle', fs: 13.5, c: GRN })
                + BOX(66, 226, 308, 40, { r: 11, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2.2 })
                + TX(220, 253, 'OA² ＋ AP² ＝ OP²', { anchor: 'middle', fs: 18, c: GRN }) }
          ], { acc: false });
        },
        caption: '⚠ <b>別把半徑當斜邊</b>——斜邊永遠是從圓心連到圓外那一點的 \\(\\overline{OP}\\)。',
        example: {
          q: '\\(\\overleftrightarrow{AP}\\) 切圓 \\(O\\) 於 \\(A\\)，\\(\\overline{OP}=10\\)、\\(\\overline{OA}=6\\)，求 \\(\\overline{AP}\\)。',
          steps: [
            '連 \\(\\overline{OA}\\)，得直角三角形，\\(\\overline{OP}\\) 是斜邊。',
            '\\(6^2+\\overline{AP}^2=10^2\\)。'
          ],
          ans: '\\(\\overline{AP}=8\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '從圓外一點畫兩條切線，兩段一樣長',
        points: [
          '圓外一點 \\(P\\) 可以畫出<b>恰好兩條</b>切線。',
          '<b>\\(\\overline{PA}=\\overline{PB}\\)</b>——等長的是<b>切線段</b>，從 \\(P\\) 到切點的那一段。',
          '⚠ 不能說「切線等長」：<b>直線是無限長的，沒辦法比長短</b>。'
        ],
        formula: { label: '兩切線段等長<span class="pgref">課本 印 102</span>', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>把 P 拉遠一點 <span class="ival" id="kv">中</span></label>
            <input type="range" id="ks" min="0" max="2" step="1" value="1"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#ks').value;
            h.querySelector('#kv').textContent = ['近', '中', '遠'][i];
            const cx = 140, cy = 146, r = 58, D = [130, 168, 210][i];
            const Pp = [cx + D, cy];
            const th = Math.acos(r / D) * 180 / Math.PI;
            const A = P(cx, cy, r, th), B = P(cx, cy, r, -th);
            const ext = (q, k) => [Pp[0] + (q[0] - Pp[0]) * k, Pp[1] + (q[1] - Pp[1]) * k];
            let s = CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.05)', stroke: BLU });

            s += SEG(Pp, ext(A, 1.55), '#d9cdf3', 2.4) + SEG(Pp, ext(B, 1.55), '#d9cdf3', 2.4);

            s += SEG(Pp, A, VIO, 5) + SEG(Pp, B, VIO, 5);
            s += SEG([cx, cy], A, '#c9d3e2', 2) + SEG([cx, cy], B, '#c9d3e2', 2);
            s += SV.ticks(Pp[0], Pp[1], A[0], A[1], 2, RED) + SV.ticks(Pp[0], Pp[1], B[0], B[1], 2, RED);
            s += DOT([cx, cy], INK, 3.6) + TX(cx - 6, cy + 4, 'O', { anchor: 'end', fs: 14, c: GREY });
            s += DOT(A, VIO, 5) + DOT(B, VIO, 5) + DOT(Pp, INK, 4.8);
            s += TX(A[0] - 4, A[1] - 10, 'A', { anchor: 'end', fs: 15, c: VIO });
            s += TX(B[0] - 4, B[1] + 20, 'B', { anchor: 'end', fs: 15, c: VIO });
            s += TX(Pp[0] + 10, Pp[1] + 5, 'P', { fs: 15, c: INK });
            s += BOX(96, 232, 248, 44, { r: 12, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 2.2 });
            s += TX(220, 261, 'PA ＝ PB（兩條紅記號）', { anchor: 'middle', fs: 18, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ks').oninput = draw;
          draw();
        },
        caption: '⚠ <b>淡色那兩條是切線（直線），粗色那兩段才是切線段</b>——等長講的是粗的那兩段。',
        example: {
          q: '\\(\\overline{PA}\\)、\\(\\overline{PB}\\) 切圓 \\(O\\) 於 \\(A\\)、\\(B\\)，\\(\\overline{OP}=13\\)、\\(\\overline{AP}=12\\)，求半徑與四邊形 \\(OAPB\\) 的周長。',
          steps: [
            '\\(\\overline{OA}\\perp\\overline{AP}\\)，所以 \\(\\overline{OA}^2+12^2=13^2\\)，半徑 \\(=5\\)。',
            '\\(\\overline{PB}=\\overline{PA}=12\\)、\\(\\overline{OB}=\\overline{OA}=5\\)。'
          ],
          ans: '半徑 \\(5\\)；周長 \\(=5+12+12+5=34\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '弦心距：算出來的是一半，要再乘 2',
        points: [
          '從圓心垂直畫到弦，這一段叫<b>弦心距</b>，它會<b>把弦切成兩半</b>。',
          '<b>半徑、弦心距、半條弦</b>剛好組成直角三角形——<b>半徑是斜邊</b>。',
          '⚠ 畢氏算出來的是<b>半條弦</b>，最後一定要<b>乘 2</b>。'
        ],
        formula: { label: '直接用帶 ×2 的完整式<span class="pgref">課本 印 105</span>', tex: '\\text{弦長}=\\sqrt{r^2-d^2}\\times2' },
        visual: (h) => {
          const cx = 190, cy = 122, r = 84;
          const yM = cy + 50;
          const half = Math.sqrt(r * r - 50 * 50);
          const A = [cx - half, yM], B = [cx + half, yM], M = [cx, yM];
          SV.stepper(h, '0 0 440 276', [
            { t: '圓裡有一條弦 <b>AB</b>，從圓心 O 垂直畫下來，交在 <b>M</b>。',
              d: () => CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.04)', stroke: BLU })
                + SEG(A, B, VIO, 4.4) + SEG([cx, cy], M, AMB, 3.4)
                + SV.rightAngle(M[0], M[1], 0, 90, 12, '#7b8699')
                + DOT([cx, cy], INK, 3.6) + DOT(A, INK) + DOT(B, INK) + DOT(M, AMB, 4.6)
                + TX(cx - 6, cy - 8, 'O', { anchor: 'end', fs: 14, c: GREY })
                + TX(A[0] - 14, A[1] + 6, 'A', { fs: 15, c: INK }) + TX(B[0] + 6, B[1] + 6, 'B', { fs: 15, c: INK })
                + TX(M[0] + 6, M[1] + 20, 'M', { fs: 14, c: AMB })
                + TX(cx + 10, cy + 30, '弦心距', { fs: 14, c: AMB })
                + TX(220, 252, '弦心距一定垂直，而且把弦切成兩半', { anchor: 'middle', fs: 16, c: INK }) },
            { t: '所以 <b>AM ＝ MB</b>——弦被切成一樣長的兩段。',
              d: () => CIRC(cx, cy, r, { fill: 'rgba(37,99,235,.04)', stroke: '#c9d3e2' })
                + SEG(A, M, VIO, 5) + SEG(M, B, GRN, 5) + SEG([cx, cy], M, AMB, 3.4)
                + SV.rightAngle(M[0], M[1], 0, 90, 12, '#7b8699')
                + SV.ticks(A[0], A[1], M[0], M[1], 1, RED) + SV.ticks(M[0], M[1], B[0], B[1], 1, RED)
                + DOT([cx, cy], INK, 3.6) + DOT(M, AMB, 4.6)
                + TX(A[0] - 14, A[1] + 6, 'A', { fs: 15, c: INK }) + TX(B[0] + 6, B[1] + 6, 'B', { fs: 15, c: INK })
                + TX(220, 252, '兩個紅記號：AM 和 MB 一樣長', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '半徑、弦心距、<b>半條弦</b>組成直角三角形——<b>半徑是斜邊</b>。',
              d: () => CIRC(cx, cy, r, { stroke: '#dce3ee' })
                + SV.poly([[cx, cy], M, B], 'rgba(5,150,105,.10)', GRN, 2.4)
                + SV.rightAngle(M[0], M[1], 0, 90, 12, '#7b8699')
                + SEG([cx, cy], B, GRN, 3.4)
                + DOT([cx, cy], INK, 3.6) + DOT(M, AMB, 4.6) + DOT(B, INK)
                + TX(cx + 8, cy + 30, 'd', { fs: 16, c: AMB })
                + TX((M[0] + B[0]) / 2, M[1] + 22, '半條弦', { anchor: 'middle', fs: 14, c: VIO })
                + TX(cx + 52, cy + 20, 'r（斜邊）', { fs: 14, c: GRN })
                + TX(220, 252, '別把半徑當股——它是斜邊', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '畢氏算出來的是<b>半條</b>，最後<b>乘 2</b> 才是整條弦。',
              d: () => BOX(30, 40, 380, 52, { r: 12, fill: '#fff', stroke: GREY, sw: 1.8 })
                + TX(220, 72, 'r² ＝ d² ＋（半條弦）²', { anchor: 'middle', fs: 19, c: INK })
                + TX(220, 118, '先算出半條弦', { anchor: 'middle', fs: 16, c: GREY })
                + BOX(30, 136, 380, 52, { r: 12, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 2 })
                + TX(220, 168, '✗ 算到這裡就當答案', { anchor: 'middle', fs: 18, c: RED })
                + BOX(30, 200, 380, 60, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 228, '✓ 弦長 ＝ 半條弦 × 2', { anchor: 'middle', fs: 18, c: GRN })
                + TX(220, 252, '（直接用：弦長 ＝ √(r²−d²) × 2）', { anchor: 'middle', fs: 14, c: GREY }) }
          ], { acc: false });
        },
        caption: '⚠ 這是本節<b>最常丟分</b>的地方：先在圖上把<b>整條弦</b>描出來，就不會忘了乘 2。',
        example: {
          q: '圓 \\(O\\) 的半徑 \\(5\\)，弦心距 \\(4\\)，求弦長。',
          steps: [
            '半條弦 \\(=\\sqrt{5^2-4^2}=3\\)。',
            '整條弦要再乘 \\(2\\)。'
          ],
          ans: '弦長 \\(=6\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '回頭看：四個主題，兩種動作',
        points: [
          '弧長和扇形面積是<b>同一個倍率</b>，只差要乘周長還是乘面積。',
          '點和直線的位置關係是<b>同一件事</b>，只差 \\(d\\) 從哪裡量起。',
          '切線和弦心距都靠<b>同一條輔助線</b>變出直角三角形。',
          '所以整節只有兩種動作：<b>算倍率</b>和<b>比距離</b>，加一次<b>畢氏定理</b>。'
        ],
        formula: { label: '全部收在這三句<span class="pgref">課本 印 108–109 重點整理</span>', tex: '\\dfrac{x}{360}\\ ;\\quad d\\ \\text{vs}\\ r\\ ;\\quad a^2+b^2=c^2' },
        visual: (h) => {
          const CARD = [
            ['弧長、扇形面積', '同一個倍率 x/360', GRN],
            ['點與圓、直線與圓', '同一句：比 d 和 r', BLU],
            ['切線、切線段', '連圓心到切點', VIO],
            ['弦心距', '連圓心垂直到弦', AMB]
          ];
          SV.stepper(h, SECVB, [
            { t: '這一節有<b>四個主題</b>——它是整個段考範圍最重的一節。',
              d: () => SECBG + TX(14, 34, '四個主題', { fs: 15, c: GREY }) + secCards(CARD, false, -1) },
            { t: '但兩兩成對：前兩個是<b>同一招</b>，後兩個也是。',
              d: () => SECBG + TX(14, 34, '兩兩成對', { fs: 15, c: GREY }) + secCards(CARD, true, -1)
                + TX(220, 278, '後兩個都是「連一條線，變出直角三角形」', { anchor: 'middle', fs: 14.5, c: GREY }) },
            { t: '所以整節只剩<b>兩種動作</b>，加一次畢氏定理。',
              d: () => SECBG + TX(220, 34, '整節只剩兩種動作', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 算倍率', '這是整圈的幾分之幾？再決定乘周長還是乘面積', GRN],
                    ['② 比距離', 'd 和 r 誰大——點和直線都問這一句', BLU]
                  ], ['兩條輔助線：切線連切點、弦心距垂直到弦', '連完都是直角三角形，用畢氏定理收尾']) }
          ], { acc: false });
        },
        caption: '四個主題聽起來很多，但<b>成對看就只有兩招</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '最常錯的三件事',
        points: [
          '弦心距那題算出來的是<b>半條</b>；題目給直徑要<b>先除以 2</b>。',
          '直線與圓的 \\(d\\) 一定是<b>垂直</b>的那一段。'
        ],
        formula: { label: '動筆前先問<span class="pgref">課本 印 108–109 重點整理</span>', tex: '\\text{這是整條還是一半？這是半徑還是直徑？}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '半條弦當整條',
              bad: '\\(r=5\\)、\\(d=4\\)<br>弦長寫成 \\(3\\)',
              good: '\\(3\\) 只是<b>半條</b><br>弦長 \\(=3\\times2=6\\)' },
            { tag: '直徑當半徑',
              bad: '直徑 \\(8\\)，拿 \\(d\\) 去和 \\(8\\) 比',
              good: '先 \\(8\\div2=4\\)<br>再拿 \\(d\\) 和 \\(4\\) 比' },
            { tag: '距離量斜的',
              bad: '量圓心到直線上<b>隨便一點</b>',
              good: '要量<b>垂直</b>的那一段<br>圖上要有直角記號' }
          ]);
          MJ(h);
        },
        caption: '三件事都是同一種毛病：<b>沒問清楚「這是哪一段」</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本隨堂（圓的名詞、弧長與扇形）',
        points: [
          '四題都在第 1～3 節的範圍：認名詞、算弧長、算面積。',
          '印 94 那題是<b>弓形</b>：用<b>扇形減三角形</b>。',
          '印 95 是摩天輪——跟章前那張圖是同一個情境。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 91–95</span>', tex: '\\ell=2\\pi r\\times\\dfrac{x}{360}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本', page: '印 91–93', sub: '名詞與公式', tags: ['課P91', '課P93'] },
            { src: '課本', page: '印 94–95', sub: '弓形與摩天輪', tags: ['課P94', '課P95'], level: '標準' }
          ]);
        },
        caption: '⚠ 弓形只教「<b>扇形減三角形</b>」這個想法，數字難的那種不要求。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本隨堂（點與圓、直線與圓）',
        points: [
          '四題都只做一件事：<b>算出距離，再和半徑比</b>。',
          '印 96 第 2 題是雷達螢幕，印 97 要用<b>兩點距離</b>。',
          '⚠ 看到直徑先除以 2。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 96–99</span>', tex: 'd\\ \\text{和}\\ r\\ \\text{比大小}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本', page: '印 96', sub: '點與圓', tags: ['課P96 第1題', '課P96 第2題'] },
            { src: '課本', page: '印 97–99', sub: '坐標與直線', tags: ['課P97', '課P99'], level: '標準' }
          ]);
        },
        caption: '⚠ 印 97 要算兩點距離——<b>圓心在原點</b>的版本才是底線，其他的算進階。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本隨堂（切線與切線段）',
        points: [
          '三題的第一個動作都一樣：<b>連圓心到切點</b>。',
          '連完找出直角三角形，<b>半徑和切線段是兩條股</b>。',
          '印 103 是三角形的內切圓——三組切線段各自等長。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 100–103</span>', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本', page: '印 100–102', sub: '切線性質與切線段', tags: ['課P100', '課P102'] },
            { src: '課本', page: '印 103', sub: '內切圓', tags: ['課P103'], level: '標準' }
          ]);
        },
        caption: '⚠ 動筆前先畫那條輔助線——<b>沒有直角三角形就算不下去</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本隨堂（弦心距）',
        points: [
          '三題都是「給兩個、求一個」的直角三角形。',
          '⚠ <b>先在圖上把整條弦描出來</b>，再決定要不要乘 2。',
          '印 105 是隧道題，數字是 3-4-5，算得出來。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 105–107</span>', tex: '\\text{弦長}=\\sqrt{r^2-d^2}\\times2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本', page: '印 105–107', sub: '弦心距與弦長', tags: ['課P105', '課P107 第1題', '課P107 第2題'] }
          ]);
        },
        caption: '⚠ 每一題都先描弦——這是官方指定的動作，不是建議。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜習作暖身題',
        points: [
          '四題暖身橫跨三個主題：弧長、扇形面積、切線、弦心距。',
          '先問自己：<b>這一題要套公式，還是比距離</b>？',
          '暖身 3 是弦心距——<b>記得乘 2</b>。'
        ],
        formula: { label: '暖身重點', tex: '\\dfrac{x}{360}\\ ;\\quad \\sqrt{r^2-d^2}\\times2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 28', sub: '暖身題，課堂一起做', tags: ['暖身1 ⑴', '暖身1 ⑵', '暖身2', '暖身3'] }
          ]);
        },
        caption: '暖身題點開有逐行詳解——<b>先自己算，再點開對</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜習作基礎（1～4）',
        points: [
          '四題都是底線題，<b>每個人都要做完</b>。',
          '基礎 1 是節拍器（扇形）、基礎 2 是三條直線、基礎 3、4 是切線。',
          '基礎 3 要用到<b>完全平方展開</b>，卡住就舉手。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 90–103</span>', tex: '\\text{套公式}\\ /\\ \\text{比距離}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 29–30', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '⚠ 基礎 3 需要補<b>完全平方展開</b>——那是八上的東西，忘了就回去翻。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜習作基礎（5～8）',
        points: [
          '基礎 6 是底線（等腰三角形的內切圓）；<b>5、7、8 老師帶著做</b>。',
          '基礎 5 要先看出<b>正三角形</b>，基礎 7 是會考仿題。',
          '基礎 8(2) 是進階，行有餘力再做。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 100–107</span>', tex: '\\overline{PA}=\\overline{PB}\\ ;\\ \\sqrt{r^2-d^2}\\times2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 30', sub: '基礎題，今天寫完', tags: ['基礎6'] },
            { src: '習作', page: '印 30–31', sub: '老師帶著做', tags: ['基礎5', '基礎7', '基礎8'], level: '標準' }
          ]);
        },
        caption: '⚠ 基礎 8 第 (2) 小題要由不等式推出整數，<b>那一小題算進階</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜習作精熟（行有餘力）',
        points: [
          '兩題都是<b>進階</b>，不強迫全班都做。',
          '精熟 1 是坐標平面上的圓心，精熟 2 用到兩切線段等長。',
          '⚠ 這一節的作業抽查看的是<b>暖身和基礎</b>。'
        ],
        formula: { label: '額外收穫<span class="pgref">課本 印 96–103</span>', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 32', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '⚠ 12/14–12/16 作業抽查的範圍是 1-1 ~ 2-2，<b>基礎題一定要收齊</b>。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '對答案｜習作（暖身、基礎、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-1', [
            { label: '暖身 1～3（印 28）', cols: 2, items: [['暖 1 ⑴', '暖身1 ⑴'], ['暖 1 ⑵', '暖身1 ⑵'], ['暖 2', '暖身2'], ['暖 3', '暖身3']] },
            { label: '基礎 1～4（印 29–30）', cols: 2, items: [['1', '基礎1'], ['2', '基礎2'], ['3', '基礎3'], ['4', '基礎4']] },
            { label: '基礎 6（印 30）', cols: 3, items: [['6', '基礎6']] },
            { label: '基礎 5、7、8（印 30–31）', cols: 2, items: [['5', '基礎5'], ['7', '基礎7'], ['8', '基礎8']] },
            { label: '精熟 1、2（印 32）', cols: 3, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '這一節只有兩行字：圓心角＝弧，圓周角＝弧的一半',
        points: [
          '上一節把圓心角當成<b>倍率</b>；這一節說它<b>還是那段弧的度數</b>。',
          '角的頂點<b>在圓心</b>叫圓心角，<b>在圓上</b>叫圓周角。',
          '整節的計算只靠兩行：<b>圓心角＝弧</b>、<b>圓周角＝弧÷2</b>。',
          '真正難的不是計算，是<b>看出這個角對的是哪一段弧</b>。'
        ],
        formula: { label: '這一節的主角<span class="pgref">課本 印 112–126</span>', tex: '\\text{圓心角}=\\overarc{AB}\\ ;\\quad \\text{圓周角}=\\tfrac12\\overarc{AB}' },
        visual: (h) => {
          const cx = 140, cy = 132, r = 74;
          const A = P(cx, cy, r, 200), B = P(cx, cy, r, 320), Q = P(cx, cy, r, 80);
          SV.stepper(h, SECVB, [
            { t: '頂點<b>在圓心</b>的叫<b>圓心角</b>；頂點<b>在圓上</b>的叫<b>圓周角</b>。',
              d: () => SECBG + CIRC(cx, cy, r, { stroke: '#c9d3e2' })
                + ARC2(cx, cy, r, 200, 320, AMB, 5)
                + SEG([cx, cy], A, VIO, 2.8) + SEG([cx, cy], B, VIO, 2.8)
                + SEG(Q, A, GRN, 2.8) + SEG(Q, B, GRN, 2.8)
                + DOT([cx, cy], VIO, 4.6) + DOT(Q, GRN, 4.6) + DOT(A, INK) + DOT(B, INK)
                + TX(cx + 8, cy - 8, 'O', { fs: 13, c: VIO }) + TX(Q[0] + 8, Q[1] - 6, 'C', { fs: 14, c: GRN })
                + TX(A[0] - 14, A[1] + 6, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 6, 'B', { fs: 14, c: INK })
                + TX(258, 86, '紫色：頂點在圓心', { fs: 15, c: VIO })
                + TX(258, 118, '＝ 圓心角', { fs: 16, c: VIO })
                + TX(258, 168, '綠色：頂點在圓上', { fs: 15, c: GRN })
                + TX(258, 200, '＝ 圓周角', { fs: 16, c: GRN })
                + TX(220, 268, '兩個角對的是同一段弧（琥珀色那段）', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '整節的計算只靠這兩行——<b>整節課都不要擦掉</b>。',
              d: () => SECBG + TX(220, 40, '這兩行寫在黑板上，整節不擦', { anchor: 'middle', fs: 16, c: GREY })
                + BOARD(86, 72, -1)
                + TX(220, 206, '圓心角和弧一樣大，圓周角小一半', { anchor: 'middle', fs: 17, c: INK })
                + TX(220, 240, '所有題目都只是在用這兩句', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '難的不是算，是<b>看出角對的是哪一段弧</b>。',
              d: () => SECBG + TX(220, 34, '整節只有兩件事', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 找出這個角對的弧', '沿著角的兩條邊走到圓周，中間不含頂點的那段', GRN],
                    ['② 套那兩行', '圓心角就等於它；圓周角要除以 2', BLU]
                  ], ['第①步才是真正的難關——用紅筆把那段弧描出來']) }
          ], { acc: false });
        },
        caption: '⚠ 上一節的圓心角是「<b>倍率</b>」，這一節是「<b>度數</b>」——同一個角，兩種用法。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '弧的度數，就是它所對圓心角的度數',
        points: [
          '一段弧「幾度」，講的就是<b>它對的圓心角幾度</b>。',
          '整個圓是 \\(360\\degree\\)，半圓就是 \\(180\\degree\\)。',
          '所以<b>圓心角和弧可以直接畫等號</b>，不必換算。'
        ],
        formula: { label: '第一行板書<span class="pgref">課本 印 112</span>', tex: '\\angle AOB=\\overarc{AB}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>圓心角 <span class="ival" id="av">120</span>°</label>
            <input type="range" id="as" min="0" max="4" step="1" value="2"></div></div>`;
          const DEG = [60, 90, 120, 180, 240];
          const draw = () => {
            const i = +h.querySelector('#as').value, x = DEG[i];
            h.querySelector('#av').textContent = x;
            const cx = 148, cy = 128, r = 80;
            const d0 = 90 - x / 2, d1 = 90 + x / 2;
            let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });
            s += SEG([cx, cy], P(cx, cy, r, d0), VIO, 3) + SEG([cx, cy], P(cx, cy, r, d1), VIO, 3);
            s += ARC2(cx, cy, r, d0, d1, AMB, 6);
            s += SV.angle(cx, cy, 30, d0, d1, VIO, x + '°', { fs: 14, lr: 14 });
            s += DOT([cx, cy], INK, 3.6);
            s += BOX(252, 74, 174, 62, { r: 11, fill: 'rgba(124,58,237,.07)', stroke: VIO, sw: 2 });
            s += TX(339, 100, '圓心角', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(339, 126, x + '°', { anchor: 'middle', fs: 22, c: VIO });
            s += BOX(252, 150, 174, 62, { r: 11, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 });
            s += TX(339, 176, '弧 AB 的度數', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(339, 202, x + '°', { anchor: 'middle', fs: 22, c: AMB });
            s += TX(220, 258, '兩個數字永遠一樣——這就是第一行板書', { anchor: 'middle', fs: 16, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 440 272', s);
          };
          h.querySelector('#as').oninput = draw;
          draw();
        },
        caption: '拖滑桿：<b>兩個數字永遠相等</b>。弧的度數不是新東西，是圓心角的別名。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '度數一樣，弧長不一定一樣',
        points: [
          '同心圓上，同一個圓心角切出來的兩段弧，<b>度數完全一樣</b>。',
          '但<b>弧長差很多</b>——大圓那段比較長。',
          '⚠ 「等圓心角對等弧」只在<b>同一個圓或等圓</b>裡才成立。'
        ],
        formula: { label: '度數和長度是兩件事<span class="pgref">課本 印 115</span>', tex: '\\text{度數比}=1:1\\ ,\\quad \\text{弧長比}=5:3' },
        visual: (h) => {
          const cx = 150, cy = 138, R1 = 92, R2 = 55, d0 = 65, d1 = 115;
          let s = CIRC(cx, cy, R1, { stroke: '#d3dae6' }) + CIRC(cx, cy, R2, { stroke: '#d3dae6' });
          s += SEG([cx, cy], P(cx, cy, R1, d0), VIO, 2.6) + SEG([cx, cy], P(cx, cy, R1, d1), VIO, 2.6);
          s += ARC2(cx, cy, R1, d0, d1, AMB, 7) + ARC2(cx, cy, R2, d0, d1, GRN, 7);
          s += SV.angle(cx, cy, 26, d0, d1, VIO, '50°', { fs: 13.5, lr: 12 });
          s += DOT([cx, cy], INK, 3.6);
          s += TX(cx + 96, cy - 78, '大圓 r＝5', { fs: 14, c: AMB });
          s += TX(cx + 62, cy - 48, '小圓 r＝3', { fs: 14, c: GRN });
          s += BOX(252, 60, 174, 66, { r: 11, fill: 'rgba(5,150,105,.07)', stroke: GRN, sw: 2 });
          s += TX(339, 86, '度數比', { anchor: 'middle', fs: 15, c: GREY });
          s += TX(339, 114, '50° : 50° ＝ 1 : 1', { anchor: 'middle', fs: 17, c: GRN });
          s += BOX(252, 140, 174, 66, { r: 11, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 2 });
          s += TX(339, 166, '弧長比', { anchor: 'middle', fs: 15, c: GREY });
          s += TX(339, 194, '5 : 3', { anchor: 'middle', fs: 20, c: RED });
          s += TX(220, 250, '同一個角，兩段弧一樣「幾度」，但不一樣長', { anchor: 'middle', fs: 16, c: INK });
          s += TX(220, 276, '所以比較弧長之前，要先問「是同一個圓嗎」', { anchor: 'middle', fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 290', s);
        },
        caption: '⚠ 這是本節<b>唯一反直覺</b>的地方——兩個比一起算出來，落差自己就跳出來了。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '圓周角是弧的一半，不是跟弧一樣',
        points: [
          '頂點<b>在圓上</b>的角叫圓周角。',
          '它的度數是<b>所對那段弧的一半</b>——不是相等。',
          '跟圓心角對照著記：<b>圓心角一樣大，圓周角小一半</b>。'
        ],
        formula: { label: '第二行板書<span class="pgref">課本 印 117</span>', tex: '\\angle ACB=\\tfrac12\\,\\overarc{AB}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>弧 AB ＝ <span class="ival" id="av">100</span>°</label>
            <input type="range" id="as" min="0" max="4" step="1" value="2"></div></div>`;
          const DEG = [60, 80, 100, 140, 180];
          const draw = () => {
            const i = +h.querySelector('#as').value, x = DEG[i];
            h.querySelector('#av').textContent = x;
            const cx = 132, cy = 148, r = 78;
            const d0 = 270 - x / 2, d1 = 270 + x / 2;
            const A = P(cx, cy, r, d0), B = P(cx, cy, r, d1), Q = P(cx, cy, r, 90);
            let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });
            s += ARC2(cx, cy, r, d0, d1, AMB, 6);
            s += SEG([cx, cy], A, '#cfc0f0', 2.4) + SEG([cx, cy], B, '#cfc0f0', 2.4);
            s += SV.angle(cx, cy, 24, d0, d1, VIO, x + '°', { fs: 13, lr: 11 });
            s += SEG(Q, A, GRN, 3) + SEG(Q, B, GRN, 3);
            s += SV.angle(Q[0], Q[1], 30, SV.angleOf(Q[0], Q[1], B[0], B[1]), SV.angleOf(Q[0], Q[1], A[0], A[1]), GRN, (x / 2) + '°', { fs: 14, lr: 14 });
            s += DOT([cx, cy], INK, 3.4) + DOT(Q, GRN, 4.8) + DOT(A, INK) + DOT(B, INK);
            s += TX(Q[0] + 8, Q[1] - 8, 'C', { fs: 14, c: GRN });
            s += TX(A[0] - 14, A[1] + 8, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 8, 'B', { fs: 14, c: INK });
            s += BOARD(240, 78, 1);
            s += TX(220, 256, '弧 ' + x + '° → 圓周角 ' + (x / 2) + '°', { anchor: 'middle', fs: 18, c: GRN });
            h.querySelector('#fig').innerHTML = svg('0 0 440 272', s);
          };
          h.querySelector('#as').oninput = draw;
          draw();
        },
        caption: '拖滑桿：<b>綠色的角永遠是琥珀色那段弧的一半</b>。',
        example: {
          q: '圓 \\(O\\) 上 \\(A\\)、\\(B\\)、\\(C\\) 三點，\\(\\overarc{AB}=110\\degree\\)，求圓周角 \\(\\angle ACB\\)。',
          steps: ['圓周角 ＝ 弧的一半。', '\\(110\\degree\\div2\\)。'],
          ans: '\\(\\angle ACB=55\\degree\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '這個角對的是哪一段弧？不含頂點的那一段',
        points: [
          '沿著角的<b>兩條邊</b>走到圓周，中間夾住的那段弧才是它對的弧。',
          '⚠ 是<b>不含頂點</b>的那一段——含頂點的那半圈不是。',
          '每一題都做兩個動作：<b>描兩條邊</b>、<b>描那段弧</b>。'
        ],
        formula: { label: '先找弧，再套公式<span class="pgref">課本 印 116</span>', tex: '\\angle ACB\\ \\to\\ \\overarc{AB}\\ (\\text{不含 }C)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>頂點 C 移到 <span class="ival" id="pv">上面</span></label>
            <input type="range" id="ps" min="0" max="2" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#ps').value;
            h.querySelector('#pv').textContent = ['上面', '右上', '左上'][i];
            const cx = 220, cy = 140, r = 88, d0 = 205, d1 = 335;
            const cdeg = [90, 40, 140][i];
            const A = P(cx, cy, r, d0), B = P(cx, cy, r, d1), Q = P(cx, cy, r, cdeg);
            let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });

            s += ARC2(cx, cy, r, d1, d0, '#f6cdd8', 6);
            s += ARC2(cx, cy, r, d0, d1, RED, 7);
            s += SEG(Q, A, RED, 3.4) + SEG(Q, B, RED, 3.4);
            s += SV.angle(Q[0], Q[1], 28, SV.angleOf(Q[0], Q[1], B[0], B[1]), SV.angleOf(Q[0], Q[1], A[0], A[1]), RED, '', { w: 2.4 });
            s += DOT(Q, RED, 5) + DOT(A, INK) + DOT(B, INK);
            s += TX(Q[0] + (cdeg === 140 ? -8 : 8), Q[1] - 8, 'C', { anchor: cdeg === 140 ? 'end' : 'start', fs: 15, c: RED });
            s += TX(A[0] - 14, A[1] + 8, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 8, 'B', { fs: 14, c: INK });
            s += TX(220, 250, '紅色粗的那段＝角對的弧（不含 C）', { anchor: 'middle', fs: 16, c: RED });
            s += TX(220, 278, 'C 怎麼移都一樣——它對的永遠是下面那段', { anchor: 'middle', fs: 14, c: GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 292', s);
          };
          h.querySelector('#ps').oninput = draw;
          draw();
        },
        caption: '⚠ <b>淡紅色那半圈是陷阱</b>：它含著頂點 C，不是這個角對的弧。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '同一段弧的圓周角，全部一樣大',
        points: [
          '只要對的是<b>同一段弧</b>，圓周角<b>都一樣大</b>——頂點在哪裡都沒差。',
          '因為它們都等於那段弧的一半，<b>弧沒變，角就沒變</b>。',
          '⚠ 用之前先確認：這幾個角<b>真的對同一段弧</b>嗎？'
        ],
        formula: { label: '同弧等角<span class="pgref">課本 印 118</span>', tex: '\\angle AC_1B=\\angle AC_2B=\\angle AC_3B=\\tfrac12\\,\\overarc{AB}' },
        visual: (h) => {
          const cx = 220, cy = 146, r = 92, d0 = 210, d1 = 330;
          const A = P(cx, cy, r, d0), B = P(cx, cy, r, d1);
          const COL = [GRN, BLU, VIO];
          let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });
          s += ARC2(cx, cy, r, d0, d1, AMB, 7);
          [60, 95, 135].forEach((dg, i) => {
            const Q = P(cx, cy, r, dg);
            s += SEG(Q, A, COL[i], 2.6) + SEG(Q, B, COL[i], 2.6);
            s += SV.angle(Q[0], Q[1], 24, SV.angleOf(Q[0], Q[1], B[0], B[1]), SV.angleOf(Q[0], Q[1], A[0], A[1]), COL[i], '', { w: 2.2 });
            s += DOT(Q, COL[i], 4.4);
          });
          s += DOT(A, INK) + DOT(B, INK);
          s += TX(A[0] - 14, A[1] + 8, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 8, 'B', { fs: 14, c: INK });
          s += TX(220, 252, '三個角都對琥珀色那段弧 → 三個一樣大', { anchor: 'middle', fs: 17, c: INK });
          s += TX(220, 278, '頂點換位置不影響，因為弧沒有換', { anchor: 'middle', fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 292', s);
        },
        caption: '三個不同顏色的角<b>度數完全一樣</b>——它們對的是同一段弧。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '半圓的圓周角是 90°——因為 180 的一半是 90',
        points: [
          '直徑把圓切成兩個半圓，<b>一個半圓是 \\(180\\degree\\)</b>。',
          '圓周角是弧的一半，所以 \\(180\\div2=90\\degree\\)。',
          '⚠ 這<b>不是新規則</b>，還是那兩行——只是弧剛好 \\(180\\degree\\)。'
        ],
        formula: { label: '還是同一行<span class="pgref">課本 印 121</span>', tex: '\\overline{AB}\\ \\text{是直徑}\\ \\Rightarrow\\ \\angle ACB=\\tfrac{180\\degree}{2}=90\\degree' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>把 C 移一移 <span class="ival" id="pv">1</span></label>
            <input type="range" id="ps" min="0" max="3" step="1" value="1"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#ps').value;
            h.querySelector('#pv').textContent = i + 1;
            const cx = 140, cy = 150, r = 80;
            const A = P(cx, cy, r, 180), B = P(cx, cy, r, 0);
            const Q = P(cx, cy, r, [40, 70, 110, 145][i]);
            let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });
            s += ARC2(cx, cy, r, 180, 360, AMB, 7);
            s += SEG(A, B, VIO, 3.4);
            s += SEG(Q, A, GRN, 3) + SEG(Q, B, GRN, 3);
            s += SV.rightAngle(Q[0], Q[1], SV.angleOf(Q[0], Q[1], B[0], B[1]), SV.angleOf(Q[0], Q[1], A[0], A[1]), 15, '#7b8699');
            s += DOT([cx, cy], INK, 3.4) + DOT(A, INK) + DOT(B, INK) + DOT(Q, GRN, 4.8);
            s += TX(A[0] - 14, A[1] + 6, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 6, 'B', { fs: 14, c: INK });
            s += TX(Q[0] + 6, Q[1] - 8, 'C', { fs: 14, c: GRN });
            s += TX(cx, cy + 22, '直徑', { anchor: 'middle', fs: 14, c: VIO });
            s += TX(cx, cy + r + 26, '下半圈 ＝ 180°', { anchor: 'middle', fs: 14, c: AMB });
            s += BOX(248, 88, 180, 96, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2.2 });
            s += TX(338, 118, '弧 ＝ 180°', { anchor: 'middle', fs: 17, c: AMB });
            s += TX(338, 146, '÷ 2', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(338, 174, '圓周角 ＝ 90°', { anchor: 'middle', fs: 18, c: GRN });
            s += TX(220, 262, 'C 移到哪裡都是 90°——因為弧一直是 180°', { anchor: 'middle', fs: 15, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 440 276', s);
          };
          h.querySelector('#ps').oninput = draw;
          draw();
        },
        caption: '⚠ 不要背「半圓對直角」——背<b>「弧 180，一半就是 90」</b>，才不會套到別的弧上。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '兩條平行弦，夾出來的兩段弧一樣',
        points: [
          '圓裡面畫兩條<b>平行</b>的弦，它們<b>夾住的那兩段弧會一樣</b>。',
          '注意是<b>左右兩側夾住的那兩段</b>，不是上下那兩段。',
          '這一條只要<b>會用</b>就好，不必推導。'
        ],
        formula: { label: '平行就截出等弧<span class="pgref">課本 印 122</span>', tex: '\\overline{AB}\\parallel\\overline{CD}\\ \\Rightarrow\\ \\overarc{AC}=\\overarc{BD}' },
        visual: (h) => {
          const cx = 220, cy = 140, r = 94;
          const a0 = 150, a1 = 30, gap = 46;
          const A = P(cx, cy, r, a0), B = P(cx, cy, r, a1);
          const Cc = P(cx, cy, r, a0 + gap), D = P(cx, cy, r, a1 - gap);
          let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });

          s += SEG(A, B, BLU, 4) + SEG(Cc, D, BLU, 4);
          s += ARC2(cx, cy, r, a0, a0 + gap, GRN, 7);
          s += ARC2(cx, cy, r, a1 - gap, a1, GRN, 7);
          s += DOT(A, INK) + DOT(B, INK) + DOT(Cc, INK) + DOT(D, INK);
          s += TX(A[0] - 14, A[1] + 4, 'A', { fs: 14, c: INK }) + TX(B[0] + 6, B[1] + 4, 'B', { fs: 14, c: INK });
          s += TX(Cc[0] - 16, Cc[1] + 12, 'C', { fs: 14, c: INK }) + TX(D[0] + 6, D[1] + 12, 'D', { fs: 14, c: INK });
          s += SV.ticks(A[0], A[1], Cc[0], Cc[1], 1, RED) + SV.ticks(B[0], B[1], D[0], D[1], 1, RED);
          s += TX(220, 258, '兩段綠色的弧一樣長（紅記號）', { anchor: 'middle', fs: 17, c: GRN });
          s += TX(220, 284, '⚠ 是左右兩側那兩段，不是上下那兩段', { anchor: 'middle', fs: 14, c: RED });
          h.innerHTML = svg('0 0 440 296', s);
        },
        caption: '⚠ 這一條<b>只要會用</b>，習作和講義都考直接套用，不會要你證明。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '圓內接四邊形：對角加起來是 180°',
        points: [
          '四個頂點都在圓上的四邊形，<b>對角加起來一定是 \\(180\\degree\\)</b>。',
          '理由還是那兩行：兩個對角<b>各對一段弧</b>，兩段弧合起來是整圈 \\(360\\degree\\)。',
          '各取一半 → \\(360\\div2=180\\degree\\)。'
        ],
        formula: { label: '對角互補<span class="pgref">課本 印 124</span>', tex: '\\angle A+\\angle C=180\\degree' },
        visual: (h) => {
          const cx = 152, cy = 146, r = 86;
          const deg = [140, 220, 320, 50];
          const V = deg.map(d => P(cx, cy, r, d));
          SV.stepper(h, '0 0 440 282', [
            { t: '四個頂點都在圓上，叫<b>圓內接四邊形</b>。',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6' })
                + SV.poly(V, 'rgba(37,99,235,.06)', BLU, 2.4)
                + V.map((p, i) => DOT(p, INK)).join('')
                + TX(V[0][0] - 14, V[0][1], 'A', { fs: 14, c: INK }) + TX(V[1][0] - 8, V[1][1] + 18, 'B', { fs: 14, c: INK })
                + TX(V[2][0] + 6, V[2][1] + 16, 'C', { fs: 14, c: INK }) + TX(V[3][0] + 6, V[3][1], 'D', { fs: 14, c: INK })
                + TX(220, 262, '四個點都在圓上', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '\\(\\angle A\\) 對的是<b>不含 A</b> 的那段弧（B→C→D）。',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6' })
                + ARC2(cx, cy, r, deg[3], deg[1], AMB, 7)
                + SV.poly(V, 'rgba(37,99,235,.04)', '#c9d3e2', 2)
                + SEG(V[0], V[1], AMB, 3) + SEG(V[0], V[3], AMB, 3)
                + V.map(p => DOT(p, INK)).join('')
                + TX(V[0][0] - 14, V[0][1], 'A', { fs: 14, c: AMB })
                + TX(300, 120, '∠A ＝ 那段弧 ÷ 2', { fs: 16, c: AMB }) },
            { t: '\\(\\angle C\\) 對的是<b>另外那一段</b>（D→A→B）。兩段合起來是整圈。',
              d: () => CIRC(cx, cy, r, { stroke: '#d3dae6' })
                + ARC2(cx, cy, r, deg[3], deg[1], '#f2dcc0', 7)
                + ARC2(cx, cy, r, deg[1], deg[3], GRN, 7)
                + SV.poly(V, 'rgba(37,99,235,.04)', '#c9d3e2', 2)
                + SEG(V[2], V[1], GRN, 3) + SEG(V[2], V[3], GRN, 3)
                + V.map(p => DOT(p, INK)).join('')
                + TX(V[2][0] + 6, V[2][1] + 16, 'C', { fs: 14, c: GRN })
                + TX(292, 120, '∠C ＝ 另一段 ÷ 2', { fs: 16, c: GRN })
                + TX(220, 262, '兩段弧加起來 ＝ 360°', { anchor: 'middle', fs: 16, c: INK }) },
            { t: '各取一半再相加：\\(360\\div2=180\\degree\\)。',
              d: () => BOX(30, 50, 380, 52, { r: 12, fill: '#fff', stroke: GREY, sw: 1.8 })
                + TX(220, 82, '兩段弧加起來 ＝ 360°', { anchor: 'middle', fs: 19, c: INK })
                + TX(220, 126, '各取一半再相加', { anchor: 'middle', fs: 16, c: GREY })
                + BOX(80, 146, 280, 60, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 })
                + TX(220, 184, '∠A ＋ ∠C ＝ 180°', { anchor: 'middle', fs: 21, c: GRN })
                + TX(220, 242, '不是新規則——還是「圓周角＝弧÷2」', { anchor: 'middle', fs: 15, c: GREY }) }
          ], { acc: false });
        },
        caption: '⚠ 別把它當第三條規則背——它是<b>那兩行的直接結果</b>。',
        example: {
          q: '四邊形 \\(ABCD\\) 內接於圓 \\(O\\)，\\(\\angle C=75\\degree\\)，求 \\(\\angle A\\)。',
          steps: ['對角互補。', '\\(\\angle A=180\\degree-75\\degree\\)。'],
          ans: '\\(\\angle A=105\\degree\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '把一邊延長：外角等於它的內對角',
        points: [
          '延長一邊做出的<b>外角</b>，等於<b>斜對面那個內角</b>。',
          '理由很短：外角 ＝ \\(180\\degree-\\) 鄰角，而對角也 ＝ \\(180\\degree-\\) 鄰角。',
          '⚠ 要找<b>斜對面</b>那個，不是旁邊那個。'
        ],
        formula: { label: '外角＝內對角<span class="pgref">課本 印 124</span>', tex: '\\angle 1=\\angle ADC' },
        visual: (h) => {
          const cx = 168, cy = 142, r = 84;
          const deg = [140, 215, 325, 55];
          const V = deg.map(d => P(cx, cy, r, d));
          const [A, B, Cc, D] = V;
          const E = [B[0] + (Cc[0] - B[0]) * 1.42, B[1] + (Cc[1] - B[1]) * 1.42];
          let s = CIRC(cx, cy, r, { stroke: '#d3dae6' });
          s += SV.poly(V, 'rgba(37,99,235,.05)', BLU, 2.4);
          s += SEG(Cc, E, VIO, 3, '6 4');
          s += SV.angle(Cc[0], Cc[1], 26, SV.angleOf(Cc[0], Cc[1], E[0], E[1]), SV.angleOf(Cc[0], Cc[1], D[0], D[1]), RED, '∠1', { fs: 14, lr: 14 });
          s += SV.angle(D[0], D[1], 26, SV.angleOf(D[0], D[1], Cc[0], Cc[1]), SV.angleOf(D[0], D[1], A[0], A[1]), RED, '', { w: 2.4 });
          s += V.map(p => DOT(p, INK)).join('') + DOT(E, VIO, 4);
          s += TX(A[0] - 14, A[1], 'A', { fs: 14, c: INK }) + TX(B[0] - 8, B[1] + 18, 'B', { fs: 14, c: INK });
          s += TX(Cc[0] + 4, Cc[1] + 18, 'C', { fs: 14, c: INK }) + TX(D[0] + 6, D[1] - 2, 'D', { fs: 14, c: INK });
          s += TX(E[0] + 6, E[1] + 4, 'E', { fs: 14, c: VIO });
          s += BOX(60, 232, 320, 44, { r: 12, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 2.2 });
          s += TX(220, 261, '∠1 ＝ ∠ADC（兩個紅色的角）', { anchor: 'middle', fs: 18, c: RED });
          h.innerHTML = svg('0 0 440 288', s);
        },
        caption: '⚠ <b>斜對面</b>那個角才是內對角——找錯就整題錯。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '回頭看：所有題目都在用那兩行',
        points: [
          '半圓的直角、對角互補、外角等於內對角——<b>全都是那兩行推出來的</b>。',
          '它們<b>不是三條新規則</b>，是同一句話的三種情形。',
          '所以卡住的時候回到原點：<b>這個角對的是哪一段弧？</b>'
        ],
        formula: { label: '全部回到這兩行<span class="pgref">課本 印 130–131 重點整理</span>', tex: '\\text{圓心角}=\\overarc{AB}\\ ;\\quad \\text{圓周角}=\\tfrac12\\overarc{AB}' },
        visual: (h) => {
          const CARD = [
            ['圓心角＝弧', '★ 第一行', VIO],
            ['圓周角＝弧÷2', '★ 第二行', GRN],
            ['半圓的圓周角 90°', '弧 180 取一半', AMB],
            ['對角互補、外角', '兩段弧合起來 360', BLU]
          ];
          SV.stepper(h, SECVB, [
            { t: '課本重點整理列了這<b>四件事</b>。',
              d: () => SECBG + TX(14, 34, '課本 印 130–131 重點整理', { fs: 15, c: GREY })
                + secCards(CARD, false, -1) },
            { t: '但只有<b>前兩件</b>是規則，後兩件是它們的<b>特殊情形</b>。',
              d: () => SECBG + TX(14, 34, '只有前兩件是規則', { fs: 15, c: GREY })
                + secCards(CARD, true, 1)
                + TX(220, 278, '後兩件都只是「弧剛好特別」而已', { anchor: 'middle', fs: 14.5, c: GREY }) },
            { t: '所以整節只有<b>兩個動作</b>：先找弧，再除以 2。',
              d: () => SECBG + TX(220, 34, '整節只有兩個動作', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 找出角對的弧', '沿兩條邊走到圓周，不含頂點的那一段', GRN],
                    ['② 套那兩行', '圓心角直接等於；圓周角要除以 2', BLU]
                  ], ['卡住就回到第①步——錯的幾乎都是弧找錯']) }
          ], { acc: false });
        },
        caption: '四件事裡<b>只有兩件是規則</b>，另外兩件是弧剛好特別的情形。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '最常錯的三件事',
        points: [
          '圓周角要<b>除以 2</b>；弧要找<b>不含頂點</b>的那一段。',
          '「度數一樣」和「長度一樣」是<b>兩件事</b>。'
        ],
        formula: { label: '動筆前先問<span class="pgref">課本 印 130–131 重點整理</span>', tex: '\\text{這個角對的是哪一段弧？}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '忘了除以 2',
              bad: '弧 \\(100\\degree\\)<br>圓周角寫成 \\(100\\degree\\)',
              good: '圓周角 ＝ 弧 \\(\\div 2\\)<br>\\(=50\\degree\\)' },
            { tag: '弧找錯邊',
              bad: '找成<b>含頂點</b>的<br>那半圈',
              good: '要找<b>不含頂點</b>的那段<br>沿兩條邊走到圓周' },
            { tag: '度數當長度',
              bad: '兩段弧都 \\(50\\degree\\)<br>就說一樣長',
              good: '度數一樣<b>不等於</b>長度一樣<br>要同一個圓才行' }
          ]);
          MJ(h);
        },
        caption: '三件事裡有兩件都在同一步：<b>弧找對了沒有</b>。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本隨堂（圓心角與弧）',
        points: [
          '三題都在第 1 節的範圍：<b>弧的度數就是圓心角</b>。',
          '印 115 是同心圓那題——<b>度數一樣，弧長不一樣</b>。',
          '印 116 只問「這個角對哪一段弧」，不必算。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 114–116</span>', tex: '\\angle AOB=\\overarc{AB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 114–116', sub: '弧的度數與圓周角的辨識', tags: ['課P114', '課P115', '課P116'] }
          ]);
        },
        caption: '⚠ 印 115 那題是<b>迷思題</b>，不是計算題——重點在兩個比不一樣。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本隨堂（圓周角）',
        points: [
          '四題都靠第二行板書：<b>圓周角 ＝ 弧 ÷ 2</b>。',
          '印 118 第 1 題是<b>等分點</b>，先算出一份是幾度。',
          '⚠ 每一題都先把弧描出來再動筆。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 118–120</span>', tex: '\\angle ACB=\\tfrac12\\,\\overarc{AB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 118', sub: '同弧等角', tags: ['課P118 第1題', '課P118 第2題'] },
            { src: '課本', page: '印 119–120', sub: '圓周角的應用', tags: ['課P119', '課P120'], level: '標準' }
          ]);
        },
        caption: '⚠ 等分點的題目先算「<b>一份是幾度</b>」——360 除以等分數。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本隨堂（半圓與平行弦）',
        points: [
          '印 121 兩題都是<b>直徑</b>——看到直徑就想到 \\(90\\degree\\)。',
          '印 122 是平行弦截等弧，<b>直接套</b>。',
          '⚠ 直徑對的弧是 \\(180\\degree\\)，取一半才是 \\(90\\degree\\)。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 121–122</span>', tex: '\\overline{AB}\\parallel\\overline{CD}\\Rightarrow\\overarc{AC}=\\overarc{BD}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 121–122', sub: '半圓的圓周角與平行弦', tags: ['課P121 第1題', '課P121 第2題', '課P122'] }
          ]);
        },
        caption: '⚠ 看到「直徑」兩個字，先在圖上把那個直角標出來。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本隨堂（圓內接四邊形）',
        points: [
          '印 124 兩題：一題對角互補、一題外角等於內對角。',
          '印 126 是<b>作圖題</b>，老師示範就好，不要求自己畫。',
          '⚠ 內對角要找<b>斜對面</b>那個。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 124–126</span>', tex: '\\angle A+\\angle C=180\\degree' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 124', sub: '對角互補與外角', tags: ['課P124 第1題', '課P124 第2題'] },
            { src: '課本', page: '印 126', sub: '作圖，老師示範', tags: ['課P126'], level: '標準' }
          ]);
        },
        caption: '⚠ 印 126 的<b>尺規作圖只示範</b>——那不是本節的過關條件。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜習作暖身題',
        points: [
          '三題暖身剛好走完三個重點：弧的度數、圓周角、內接四邊形。',
          '每一題先做同一個動作：<b>把角對的那段弧描出來</b>。',
          '再決定要不要除以 2。'
        ],
        formula: { label: '暖身重點', tex: '\\text{圓心角}=\\overarc{AB}\\ ;\\ \\text{圓周角}=\\tfrac12\\overarc{AB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '習作', page: '印 33', sub: '暖身題，課堂一起做', tags: ['暖身1 ⑴', '暖身1 ⑵', '暖身2'] }
          ]);
        },
        caption: '暖身題點開有逐行詳解——<b>先自己算，再點開對</b>。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜習作基礎（1～3）',
        points: [
          '三題都是底線題，<b>每個人都要做完</b>。',
          '基礎 1 是直徑分圓、基礎 2 是內接梯形、基礎 3 是碗的剖面。',
          '基礎 3 用的是<b>平行弦截等弧</b>那一條。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 112–122</span>', tex: '\\text{圓周角}=\\tfrac12\\overarc{AB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '習作', page: '印 34', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '⚠ 基礎 3 的碗剖面題看起來像應用題，<b>其實就是平行弦</b>。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜習作基礎（4～6）與精熟',
        points: [
          '基礎 4 是底線；<b>基礎 5、6 老師帶著做</b>。',
          '基礎 6 看起來是作圖題，<b>其實是畢氏定理</b>。',
          '精熟兩題是進階，行有餘力再做。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 121–126</span>', tex: '\\angle A+\\angle C=180\\degree' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '習作', page: '印 35', sub: '基礎題，今天寫完', tags: ['基礎4'] },
            { src: '習作', page: '印 35', sub: '老師帶著做', tags: ['基礎5', '基礎6'], level: '標準' },
            { src: '習作', page: '印 36', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '⚠ 第 4 節末<b>收齊基礎 1～6</b>——12/14–12/16 作業抽查含這一節。'
      },

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '對答案｜習作（暖身、基礎、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-2', [
            { label: '暖身 1、2（印 33）', cols: 3, items: [['暖 1 ⑴', '暖身1 ⑴'], ['暖 1 ⑵', '暖身1 ⑵'], ['暖 2', '暖身2']] },
            { label: '基礎 1～3（印 34）', cols: 2, items: [['1', '基礎1'], ['2', '基礎2'], ['3', '基礎3']] },
            { label: '基礎 4（印 35）', cols: 3, items: [['4', '基礎4']] },
            { label: '基礎 5、6（印 35）', cols: 3, items: [['5', '基礎5'], ['6', '基礎6']] },
            { label: '精熟 1、2（印 36）', cols: 2, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
    ]
  });
})();
