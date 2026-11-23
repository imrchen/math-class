window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';

  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6', LINE = '#dce3ee', XO_BAD = '#f3c4d0', XO_GOOD = '#bfe0d1';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}"${o.op !== undefined ? ` opacity="${o.op}"` : ''}>${s}</text>`;

  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || LINE}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

  const SQFRAME = (x, y, w, h, col, sw) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0" fill="none" stroke="${col}" stroke-width="${sw || 2.2}"/>`;

  function xoRows(rows) {
    return `<div class="xo-wrap" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">` +
      rows.map(r => `<div class="xo-row" style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-cell" style="flex:1;background:#fdeef2;border:1.5px solid ${XO_BAD};border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:4px">✗ ${r.tag || '常見錯誤'}</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.bad}</div></div>
        <div class="xo-cell" style="flex:1;background:#eef7f2;border:1.5px solid ${XO_GOOD};border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:4px">✓ 正確</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.good}</div></div>
      </div>`).join('') + `</div>`;
  }

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

  const SECVB = '0 0 440 286';
  const SECBG = `<rect x="0" y="0" width="440" height="286" fill="#fff"/>`;

  const secKey = (y, col, name, k, arc) =>
    (arc
      ? `<path d="M316,${y + 13} Q327,${y - 4} 338,${y + 13}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" opacity="${k}"/>`
      : BOX(316, y, 22, 12, { r: 3, fill: col, stroke: col, sw: 1, op: k }))
    + TX(346, y + 12, name, { fs: 16, c: INK });

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

  const secActOne = (lines, k, col) => {
    const c = col || GRN, hh = 16 + lines.length * 34, y = 274 - hh;
    return BOX(16, y, 408, hh, { r: 12, fill: 'rgba(5,150,105,.07)', stroke: c, sw: 2, op: k })
      + lines.map((t, i) => TX(220, y + 30 + i * 34, t, { anchor: 'middle', fs: 16, c: INK })).join('');
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

  const EXW = 236, EXH = 140;
  const exWrap = (inner, w) =>
    `<svg viewBox="0 0 ${EXW} ${EXH}" style="width:${w || 62}%;display:block;margin:2px auto 0">${inner}</svg>`;
  const exTX = (x, y, t, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 12}" font-weight="900" fill="${o.c || INK}">${t}</text>`;

  const xoBar = (x, y, w, t, col) =>
    BOX(x, y, w, 44, { r: 11, fill: col === RED ? 'rgba(225,29,72,.07)' : 'rgba(5,150,105,.09)', stroke: col, sw: 2 })
    + TX(x + w / 2, y + 29, t, { anchor: 'middle', fs: 18, c: col });

  const CPA = AMB, CPL = BLU;
  const LERP = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
  const DIST = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const ANG = (c, p) => SV.angleOf(c[0], c[1], p[0], p[1]);

  const CARC = (c, r, d0, d1, k, col, w) => {
    const kk = k === undefined ? 1 : k;
    if (kk <= 0.001) return '';
    const e = d1 < d0 ? d1 + 360 : d1;
    return `<polyline points="${SV.arcPoints(c[0], c[1], r, d0, d0 + (e - d0) * kk, 72)}" fill="none" stroke="${col || CPA}" stroke-width="${w || 2.2}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  const CARCAT = (c, p, sp, k, col) => { const a = ANG(c, p); return CARC(c, DIST(c, p), a - sp, a + sp, k, col); };

  const RL = (p, q, k, col, w, dash) => {
    const kk = k === undefined ? 1 : k;
    return kk <= 0.001 ? '' : SEG(p, LERP(p, q, kk), col || CPL, w || 2.4, dash);
  };

  const EXT = (p, q, a, b) => [LERP(p, q, -a), LERP(p, q, 1 + b)];

  const XM = (p, col) => {
    const s = 5.5, c = col || CPA;
    return SV.seg(p[0] - s, p[1] - s, p[0] + s, p[1] + s, c, 2.4) + SV.seg(p[0] - s, p[1] + s, p[0] + s, p[1] - s, c, 2.4);
  };

  const PN = (p, name, dx, dy, col) => DOT(p, col || INK, 3.8) + TX(p[0] + dx, p[1] + dy, name, { fs: 16, c: col || INK });

  const CCI = (c1, r1, c2, r2) => {
    const d = DIST(c1, c2), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    const m = LERP(c1, c2, a / d), ux = (c2[0] - c1[0]) / d, uy = (c2[1] - c1[1]) / d;
    const p1 = [m[0] - hh * uy, m[1] + hh * ux], p2 = [m[0] + hh * uy, m[1] - hh * ux];
    return p1[1] <= p2[1] ? [p1, p2] : [p2, p1];
  };

  const RULER = `<span style="color:${CPL}">【直尺】</span>`, COMPASS = `<span style="color:${CPA}">【圓規】</span>`;

  window.DECK.push({
    ch: 2,
    title: '圓形',
    color: C,
    sections: ['2-1 點、直線與圓之間的位置關係', '2-2 圓心角、圓周角與弧的關係', '作圖 尺規作圖', '段考 第二次（1-4～2-2）'],
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
        title: '回顧｜畢氏定理：兩股平方相加，再開根號',
        points: [
          '<b>斜邊</b>是直角對面的那一邊，也是最長的邊。',
          '兩股各自平方、加起來，就等於斜邊的平方：\\(a^2+b^2=c^2\\)。',
          '算到 \\(c^2=25\\) 還沒完，要<b>再開根號</b>：\\(c=5\\)。開不盡的就留根號，下一頁化簡。'
        ],
        formula: { label: '畢氏定理（八上學過）', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          const SETS = [[3, 4, '5', '25'], [6, 8, '10', '100'], [5, 12, '13', '169'], [2, 4, null, '20']];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>換一組兩股：第 <span class="ival" id="pv">1</span> 組</label>
            <input type="range" id="ps" min="1" max="4" step="1" value="1"></div></div>`;
          const draw = () => {
            const i = Math.min(4, Math.max(1, +h.querySelector('#ps').value || 1));
            h.querySelector('#pv').textContent = i;
            const [a, b, c, c2] = SETS[i - 1];
            const sc = Math.min(150 / b, 230 / a, 30);
            const C = [60, 190], B = [60 + a * sc, 190], A = [60, 190 - b * sc];
            let s = SV.poly([A, B, C], 'rgba(37,99,235,.06)', INK, 2.2);
            s += SV.rightAngle(C[0], C[1], 0, 90, 12, GREY);
            s += SV.seg(A[0], A[1], B[0], B[1], AMB, 4);
            s += TX((C[0] + B[0]) / 2, 214, '股 ' + a, { anchor: 'middle', fs: 16, c: BLU });
            s += TX(C[0] - 8, (A[1] + C[1]) / 2 + 5, '股 ' + b, { anchor: 'end', fs: 16, c: BLU });
            s += TX((A[0] + B[0]) / 2 + 10, (A[1] + B[1]) / 2 - 8, '斜邊 c', { fs: 16, c: AMB });
            const x = 300;
            s += TX(x, 70, a + '² ＋ ' + b + '² ＝ c²', { fs: 18, c: INK });
            s += TX(x, 104, (a * a) + ' ＋ ' + (b * b) + ' ＝ c²', { fs: 18, c: INK });
            s += TX(x, 138, 'c² ＝ ' + c2, { fs: 18, c: INK });
            s += c ? TX(x, 176, 'c ＝ ' + RT(c2) + ' ＝ ' + c, { fs: 20, c: GRN })
                   : TX(x, 176, 'c ＝ ' + RT(c2), { fs: 20, c: AMB });
            s += TX(x, 206, c ? '開得盡，答案是整數' : '開不盡：下一頁化簡', { fs: 14, c: GREY });
            s += TX(220, 252, '平方加起來之後，一定要再開一次根號', { anchor: 'middle', fs: 16, c: INK });
            h.querySelector('#fig').innerHTML = svg('0 0 460 270', s);
            radBars(h);
          };
          h.querySelector('#ps').oninput = draw;
          draw();
        },
        caption: '⚠ 最常漏的一步：寫到 \\(c^2=100\\) 就停。<b>等號左邊有平方，答案就要再開根號</b>。',
        example: {
          q: '直角三角形的斜邊是 \\(13\\)，一股是 \\(5\\)，求另一股。'
            + exWrap(
                `<polygon points="70,104 130,104 70,18" fill="rgba(37,99,235,.05)" stroke="${BLU}" stroke-width="1.8"/>`
                + `<polyline points="70,94 80,94 80,104" fill="none" stroke="${GREY}" stroke-width="1.4"/>`
                + `<line x1="70" y1="18" x2="130" y2="104" stroke="${AMB}" stroke-width="3.2"/>`
                + exTX(100, 118, '5', { anchor: 'middle', fs: 12, c: BLU })
                + exTX(58, 64, '?', { anchor: 'middle', fs: 13, c: BLU })
                + exTX(112, 56, '13', { anchor: 'middle', fs: 12, c: AMB })),
          steps: [
            '斜邊是 \\(13\\)，所以 \\(5^2+b^2=13^2\\)。',
            '\\(b^2=169-25=144\\)。'
          ],
          ans: '\\(b=\\sqrt{144}=12\\)'
        }
      },
      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '回顧｜根式化簡：最大的平方數搬到根號外',
        points: [
          '根號裡拆成「<b>平方數 × 剩下的</b>」，平方數開出來，搬到外面。',
          '要找<b>最大的</b>平方數：4、9、16、25、36……一次搬完。',
          '答案留根號就是答案。想知道大約多大，用 \\(\\sqrt3\\approx1.7\\)、\\(\\sqrt2\\approx1.4\\) 去乘。'
        ],
        formula: { label: '平方數開出來搬到外面', tex: '\\sqrt{27}=\\sqrt{9\\times3}=3\\sqrt3' },
        visual: (h) => {

          const SETS = [[20, 4, 2, 5, '2 × 2.2 ＝ 4.4'], [27, 9, 3, 3, '3 × 1.7 ＝ 5.1'], [12, 4, 2, 3, '2 × 1.7 ＝ 3.4'],
                        [32, 16, 4, 2, '4 × 1.4 ＝ 5.6'], [75, 25, 5, 3, '5 × 1.7 ＝ 8.5']];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>換一題：第 <span class="ival" id="rv">1</span> 題</label>
            <input type="range" id="rs" min="1" max="5" step="1" value="1"></div></div>`;
          const draw = () => {
            const i = Math.min(5, Math.max(1, +h.querySelector('#rs').value || 1));
            h.querySelector('#rv').textContent = i;
            const [n, sq, k, m, est] = SETS[i - 1];
            let s = TX(230, 44, '根號裡有哪個平方數？', { anchor: 'middle', fs: 16, c: GREY });
            s += TX(230, 90, RT(n) + ' ＝ ' + RT(sq + ' × ' + m), { anchor: 'middle', fs: 24, c: INK });
            s += TX(230, 140, '＝ ' + k + RT(m), { anchor: 'middle', fs: 28, c: GRN });
            s += TX(230, 172, sq + ' 開出來是 ' + k + '，搬到外面；' + m + ' 留在裡面', { anchor: 'middle', fs: 15, c: BLU });
            s += BOX(80, 196, 300, 44, { r: 10, fill: 'rgba(217,119,6,.08)', stroke: AMB, sw: 2 });
            s += TX(230, 224, '大約多大：' + est, { anchor: 'middle', fs: 16, c: AMB });
            s += xoBar(28, 254, 190, '✗ ' + RT(n) + ' ＝ ' + RT(m), RED);
            s += xoBar(242, 254, 190, '✓ ' + RT(n) + ' ＝ ' + k + RT(m), GRN);
            h.querySelector('#fig').innerHTML = svg('0 0 460 300', s);
            radBars(h);
          };
          h.querySelector('#rs').oninput = draw;
          draw();
        },
        caption: '⚠ 平方數不能直接丟掉：\\(\\sqrt{12}\\) 不是 \\(\\sqrt3\\)，是 \\(2\\sqrt3\\)。<b>寫出「平方數 × 剩下的」那一步</b>。',
        example: {
          q: '30-60-90 的直角三角形，短股是 \\(4\\)，斜邊是 \\(8\\)，用畢氏定理求長股，並化成最簡根式。',
          steps: [
            '\\(4^2+b^2=8^2\\)，\\(b^2=64-16=48\\)。',
            '\\(b=\\sqrt{48}=\\sqrt{16\\times3}\\)。'
          ],
          ans: '\\(b=4\\sqrt3\\)（和 \\(1:\\sqrt3:2\\) 算出來的一樣）'
        }
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
          '<b>離圓心越遠 → 越外面</b>：\\(d>r\\) 在外、\\(d=r\\) 在圓上、\\(d\\lt r\\) 在裡面。',
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
        caption: '⚠ 不用記 \\(d>r\\) 還是 \\(d\\lt r\\)——想「<b>離圓心越遠越外面</b>」就不會反。'
      },

      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '直線與圓：量的是垂直距離，不是隨便一段',
        points: [
          '\\(d\\) 是<b>圓心到直線的垂直距離</b>——斜著量的不算。',
          '一樣是<b>離得越遠，交點越少</b>：\\(d\\lt r\\) 兩點、\\(d=r\\) 一點、\\(d>r\\) 不相交。',
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
        caption: '印 97 要算兩點距離——先把<b>圓心在原點</b>的做熟，其他的行有餘力。'
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
        caption: '⚠ 每一題都先<b>描弦</b>——不是建議，是每題必做的第一步。'
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
          '四題<b>每個人都要做完</b>。',
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
          '基礎 6 每個人都要做完（等腰三角形的內切圓）；<b>5、7、8 一起做</b>。',
          '基礎 5 要先看出<b>正三角形</b>，基礎 7 是會考仿題。',
          '基礎 8(2) 是進階，行有餘力再做。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 100–107</span>', tex: '\\overline{PA}=\\overline{PB}\\ ;\\ \\sqrt{r^2-d^2}\\times2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 30', sub: '基礎題，今天寫完', tags: ['基礎6'] },
            { src: '習作', page: '印 30–31', sub: '一起做', tags: ['基礎5', '基礎7', '基礎8'], level: '額外的' }
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
          '<b>暖身和基礎</b>一定要寫完。'
        ],
        formula: { label: '額外收穫<span class="pgref">課本 印 96–103</span>', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '習作', page: '印 32', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '<b>基礎題一定要寫完</b>，精熟行有餘力。'
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
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本自我評量（1～3）',
        points: [
          '課本節末的<b>自我評量</b>，寫完自己對一次詳解。',
          '第 1 題弓形：<b>扇形面積減掉三角形</b>。第 2 題先用<b>畢氏定理</b>求 \\(\\overline{CO}\\)，再比距離和半徑。',
          '第 3 題只比一件事：<b>圓心到直線的距離</b>和半徑 5 誰大。'
        ],
        formula: { label: '點、直線和圓：比距離和半徑', tex: 'd\\lt r,\\;d=r,\\;d\\gt r' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本・自我評量', page: '印 110', sub: '課本節末自我評量', tags: ['自評1', '自評2', '自評3'] }
          ]);
        },
        caption: '自我評量前三題，寫完自己對詳解。'
      },
      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '練習｜課本自我評量（4～6）',
        points: [
          '第 4 題<b>看到切線，先連圓心到切點</b>，就有直角三角形。',
          '第 5 題用<b>兩條切線段一樣長</b>；第 6 題<b>弦心距平分弦</b>，算出來的是一半，要再乘 2。',
          '答案有根號，<b>留著就是答案</b>。'
        ],
        formula: { label: '切線段等長', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-1', [
            { src: '課本・自我評量', page: '印 111', sub: '課本節末自我評量', tags: ['自評4', '自評5', '自評6'] }
          ]);
        },
        caption: '自我評量到這裡寫完。'
      },
      {
        sec: '2-1', secName: '點、直線與圓之間的位置關係',
        title: '對答案｜課本自我評量',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的自我評量頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-1', [
            { label: '自評 1～3（印 110）', cols: 2, items: [['1', '自評1'], ['2', '自評2'], ['3', '自評3']] },
            { label: '自評 4～6（印 111）', cols: 2, items: [['4', '自評4'], ['5', '自評5'], ['6', '自評6']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的自我評量頁點題號看詳解</b>。'
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
        formula: { label: '第一句<span class="pgref">課本 印 112</span>', tex: '\\angle AOB=\\overarc{AB}' },
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
            s += TX(220, 258, '兩個數字永遠一樣——這就是第一句', { anchor: 'middle', fs: 16, c: INK });
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
        formula: { label: '第二句<span class="pgref">課本 印 117</span>', tex: '\\angle ACB=\\tfrac12\\,\\overarc{AB}' },
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
          '三題都只用第一句：<b>弧的度數就是圓心角</b>。',
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
          '四題都靠第二句：<b>圓周角 ＝ 弧 ÷ 2</b>。',
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
          '印 126 是<b>作圖題</b>，後面「尺規作圖」那一節一步一步畫。',
          '⚠ 內對角要找<b>斜對面</b>那個。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 124–126</span>', tex: '\\angle A+\\angle C=180\\degree' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 124', sub: '對角互補與外角', tags: ['課P124 第1題', '課P124 第2題'] },
            { src: '課本', page: '印 126', sub: '過圓外一點的切線', tags: ['課P126'] }
          ]);
        },

        caption: '印 126 的作圖，在「尺規作圖」那一節<b>一步一步畫</b>。'
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
          '三題<b>每個人都要做完</b>。',
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
          '基礎 4 每個人都要做完；<b>基礎 5、6 一起做</b>。',
          '基礎 6 看起來是作圖題，<b>其實是畢氏定理</b>。',
          '精熟兩題是進階，行有餘力再做。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 121–126</span>', tex: '\\angle A+\\angle C=180\\degree' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '習作', page: '印 35', sub: '基礎題，今天寫完', tags: ['基礎4'] },
            { src: '習作', page: '印 35', sub: '一起做', tags: ['基礎5', '基礎6'], level: '額外的' },
            { src: '習作', page: '印 36', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '<b>基礎 1～6 寫完交給老師</b>。'
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

      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本自我評量（1～3）',
        points: [
          '課本節末的<b>自我評量</b>，寫完自己對一次詳解。',
          '第 1、2 題：<b>圓心角的度數＝它對的弧的度數</b>。',
          '第 3 題：<b>圓周角是同弧圓心角的一半</b>，同一段弧的圓周角都一樣大。'
        ],
        formula: { label: '圓周角是圓心角的一半', tex: '\\angle APB=\\tfrac12\\angle AOB' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本・自我評量', page: '印 128', sub: '課本節末自我評量', tags: ['自評1', '自評2', '自評3'] }
          ]);
        },
        caption: '自我評量前三題，寫完自己對詳解。'
      },
      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '練習｜課本自我評量（4～6）',
        points: [
          '第 4、6 題：先找<b>同一段弧</b>的圓周角，再用三角形內角和。',
          '第 5 題是<b>作圖</b>：直角的圓周角，對的一定是<b>直徑</b>。',
          '第 6 題用到<b>平行弦截出的弧相等</b>。'
        ],
        formula: { label: '半圓的圓周角是直角', tex: '\\angle ACB=90^\\circ' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本・自我評量', page: '印 129', sub: '課本節末自我評量', tags: ['自評4', '自評5', '自評6'] }
          ]);
        },
        caption: '自我評量到這裡寫完。第 5 題是作圖，看詳解對做法。'
      },
      {
        sec: '2-2', secName: '圓心角、圓周角與弧的關係',
        title: '對答案｜課本自我評量',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的自我評量頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-2', [
            { label: '自評 1～3（印 128）', cols: 2, items: [['1', '自評1'], ['2', '自評2'], ['3', '自評3']] },
            { label: '自評 4、6（印 129；第 5 題是作圖，點題號看詳解）', cols: 2, items: [['4', '自評4'], ['6', '自評6']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的自我評量頁點題號看詳解</b>。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '尺規作圖：只用直尺和圓規',
        points: [
          '<b>直尺</b>只用來連線、延長，不看刻度。',
          '<b>圓規</b>用來畫弧、畫圓，也可以量一段長度、搬到別的地方。',
          '畫出來的弧和交叉記號「×」都要<b>留在紙上</b>，那是用尺規畫的證據。',
          '先練兩個基本功，再畫五種圖。'
        ],
        formula: { label: '兩樣工具<span class="pgref">課本 印 121–131</span>', tex: '\\text{直尺：連線}\\quad;\\quad\\text{圓規：畫弧、量長度}' },
        visual: (h) => {
          const NEED = [95, 236], PEN = [185, 236], HINGE = [140, 122];
          const rows = [
            ['基本功', '找中點、過線上一點畫垂線', GREY],
            ['切線', '過圓上一點、過圓外一點', BLU],
            ['直角三角形', '給一弦，畫出直角三角形', GRN],
            ['正三角形', '圓內接正三角形（兩種畫法）', VIO],
            ['找圓心', '給一段弧，把圓心找回來', AMB]
          ];
          SV.stepper(h, SECVB, [
            { t: '兩樣工具：直尺只連線，圓規畫弧、量長度。',
              d: () => SECBG
                + BOX(40, 30, 360, 40, { r: 6, fill: '#f8fafc', stroke: INK, sw: 2 })
                + TX(220, 56, '直尺：只連線、延長，不看刻度', { anchor: 'middle', fs: 16, c: CPL })
                + SV.seg(HINGE[0], HINGE[1], NEED[0], NEED[1], INK, 3.4) + SV.seg(HINGE[0], HINGE[1], PEN[0], PEN[1], INK, 3.4)
                + `<circle cx="${HINGE[0]}" cy="${HINGE[1]}" r="7" fill="${INK}"/>`
                + CARC(NEED, 90, -14, 34, 1, CPA, 3)
                + TX(NEED[0] - 6, NEED[1] + 22, '針尖', { anchor: 'middle', fs: 13, c: GREY })
                + TX(PEN[0] + 6, PEN[1] + 22, '筆尖', { anchor: 'middle', fs: 13, c: GREY })
                + TX(250, 150, '圓規：畫弧、畫圓', { fs: 16, c: CPA })
                + TX(250, 178, '也可以量一段長度，', { fs: 15, c: GREY })
                + TX(250, 202, '搬到別的地方', { fs: 15, c: GREY }) },
            { t: '這一節要畫的圖：先練基本功，再畫五種。',
              d: () => SECBG + rows.map((r, i) => {
                const y = 22 + i * 52;
                return BOX(16, y, 408, 42, { r: 11, fill: '#fbfcfe', stroke: '#dce3ee', sw: 1.6 })
                  + TX(30, y + 28, r[0], { fs: 16, c: r[2] })
                  + TX(140, y + 28, r[1], { fs: 15, c: INK });
              }).join('') }
          ], { acc: false });
        },
        caption: '⚠ 畫錯的地方可以重畫，但<b>弧和「×」不要擦掉</b>。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '基本功｜找中點：畫中垂線',
        points: [
          '找線段的<b>中點</b>，不能用尺量了再除以 2。',
          '兩次畫弧，圓規<b>張開的大小要一樣</b>，而且要超過線段的一半。',
          '兩個交點 C、D 連起來就是<b>中垂線</b>：和線段垂直，又剛好穿過中點。',
          'C、D 到 A、B 都一樣遠，所以都在中垂線上。'
        ],
        formula: { label: '八年級學過', tex: '\\overline{AM}=\\overline{MB}' },
        visual: (h) => {
          const A = [100, 150], B = [340, 150], r = 150;
          const [X1, X2] = CCI(A, r, B, r), M = LERP(A, B, 0.5), [L1, L2] = EXT(X1, X2, 0.1, 0.1);
          SV.stepper(h, SECVB, [
            { t: '題目給一條線段 AB，要找它的中點。',
              d: () => SECBG + SEG(A, B, INK, 2.8) + PN(A, 'A', -22, 6) + PN(B, 'B', 10, 6) },
            { t: COMPASS + '以 A 為圓心，張開<b>超過 AB 的一半</b>，在上方、下方各畫一段弧。',
              d: (k) => CARCAT(A, X1, 16, k) + CARCAT(A, X2, 16, k) },
            { t: COMPASS + '<b>張開的大小不變</b>，改以 B 為圓心，上下各畫一段弧，交出兩點 C、D。',
              d: (k) => CARCAT(B, X1, 16, k) + CARCAT(B, X2, 16, k)
                + (k > 0.95 ? XM(X1) + XM(X2) + TX(X1[0] + 10, X1[1] - 6, 'C', { fs: 16, c: CPA }) + TX(X2[0] + 10, X2[1] + 16, 'D', { fs: 16, c: CPA }) : '') },
            { t: RULER + '連接 C、D 畫成直線：這是 AB 的<b>中垂線</b>，和 AB 交在中點 M。',
              d: (k) => RL(L1, L2, k) + (k > 0.9
                ? SV.rightAngle(M[0], M[1], 0, 90, 12, GRN) + SV.ticks(A[0], A[1], M[0], M[1], 1, GRN) + SV.ticks(M[0], M[1], B[0], B[1], 1, GRN)
                  + PN(M, 'M', 8, 22, GRN) : '') }
          ]);
        },
        caption: '⚠ 弧要畫得<b>夠長</b>才交得到；交不到就把弧再畫長一點。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '基本功｜過直線上一點 P，畫垂線',
        points: [
          '先在 P 的左右各截一點 M、N，讓 \\(\\overline{PM}=\\overline{PN}\\)。',
          '再以 M、N 為圓心、<b>同樣大小</b>（比 PM 大）畫弧，交點 Q 和 P 連起來。',
          '直線在 P 是 \\(180\\degree\\) 的平角，\\(\\overleftrightarrow{PQ}\\) 把它分成兩個 \\(90\\degree\\)。',
          '不能用三角板的直角或量角器來畫。'
        ],
        formula: { label: '八年級學過', tex: '\\overleftrightarrow{PQ}\\perp\\text{直線}' },
        visual: (h) => {
          const Pp = [220, 205], M = [140, 205], N = [300, 205], r2 = 130;
          const [Q] = CCI(M, r2, N, r2);
          SV.stepper(h, SECVB, [
            { t: '題目給一條直線和線上一點 P，要過 P 畫一條和直線垂直的線。',
              d: () => SECBG + SEG([30, 205], [410, 205], INK, 2.6) + PN(Pp, 'P', -5, 26) },
            { t: COMPASS + '以 P 為圓心、隨便張開，在 P 的左、右各畫一小段弧，交直線於 M、N。',
              d: (k) => CARC(Pp, 80, 165, 195, k) + CARC(Pp, 80, -15, 15, k)
                + (k > 0.95 ? PN(M, 'M', -6, 26, CPA) + PN(N, 'N', -6, 26, CPA) : '') },
            { t: COMPASS + '張開<b>比 PM 大</b>，以 M 為圓心，在直線上方畫一段弧。',
              d: (k) => CARCAT(M, Q, 14, k) },
            { t: COMPASS + '<b>大小不變</b>，改以 N 為圓心畫弧，兩段弧交出「×」，叫它 Q。',
              d: (k) => CARCAT(N, Q, 14, k) + (k > 0.95 ? XM(Q) + TX(Q[0] + 10, Q[1] - 8, 'Q', { fs: 16, c: CPA }) : '') },
            { t: RULER + '連接 P、Q，畫成直線，就是過 P 的垂線。',
              d: (k) => RL([220, 250], [220, 34], k, GRN, 3) + (k > 0.9 ? SV.rightAngle(220, 205, 0, 90, 14, GRN) : '') }
          ]);
        },
        caption: '⚠ 第 3、4 步圓規張開<b>要一樣大</b>，交點才會落在垂線上。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '過圓上一點 P，畫切線',
        points: [
          '切線和「圓心到切點」的半徑<b>垂直</b>（2-1 學過）。',
          '所以只要過 P 畫一條和 \\(\\overline{OP}\\) 垂直的線，就是上一頁的基本功。',
          '射線 OP 要<b>畫過頭</b>，P 的外側才交得到 N。'
        ],
        formula: { label: '切線垂直半徑<span class="pgref">課本 印 126</span>', tex: '\\overleftrightarrow{PQ}\\perp\\overline{OP}' },
        visual: (h) => {
          const O = [150, 165], R = 95, th = 25;
          const u = [Math.cos(th * Math.PI / 180), -Math.sin(th * Math.PI / 180)];
          const v = [-Math.sin(th * Math.PI / 180), -Math.cos(th * Math.PI / 180)];
          const at = (p, d, s) => [p[0] + d[0] * s, p[1] + d[1] * s];
          const Pp = at(O, u, R), END = at(O, u, R * 1.85), M = at(Pp, u, -48), N = at(Pp, u, 48);
          const [Q] = CCI(M, 75, N, 75), T1 = at(Pp, v, 112), T2 = at(Pp, v, -100);
          SV.stepper(h, SECVB, [
            { t: '題目：P 在圓 O 上，要畫通過 P 的切線。',
              d: () => SECBG + CIRC(O[0], O[1], R) + PN(O, 'O', -20, 6) + PN(Pp, 'P', 12, 18) },
            { t: RULER + '從 O 經過 P 畫射線，<b>畫過頭</b>，超出 P 一段。',
              d: (k) => RL(O, END, k, INK, 2.2) },
            { t: COMPASS + '以 P 為圓心、隨便張開，在射線上 P 的兩側各畫一小段弧，交出 M、N。',
              d: (k) => CARCAT(Pp, M, 14, k) + CARCAT(Pp, N, 14, k)
                + (k > 0.95 ? PN(M, 'M', -8, 24, CPA) + PN(N, 'N', 2, 24, CPA) : '') },
            { t: COMPASS + '張開<b>比 PM 大</b>，分別以 M、N 為圓心畫弧，交出「×」Q。',
              d: (k) => CARCAT(M, Q, 13, Math.min(1, k * 2)) + CARCAT(N, Q, 13, Math.max(0, k * 2 - 1))
                + (k > 0.95 ? XM(Q) + TX(Q[0] - 32, Q[1] + 8, 'Q', { fs: 16, c: CPA }) : '') },
            { t: RULER + '連接 P、Q 畫成直線，就是過 P 的切線。',
              d: (k) => RL(T2, T1, k, GRN, 3.2) + (k > 0.9 ? SV.rightAngle(Pp[0], Pp[1], th + 90, th + 180, 12, GRN) : '') }
          ]);
        },
        caption: '⚠ 只畫到 P 就停，外側就沒有 N 可以用。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '過圓外一點 P，畫兩條切線',
        points: [
          '第 2～5 步是<b>找中點</b>的基本功：找出 \\(\\overline{OP}\\) 的中點 O′。',
          '以 \\(\\overline{OP}\\) 為直徑畫圓，和圓 O 的兩個交點就是切點 A、B。',
          '答案有<b>兩條</b>：\\(\\overleftrightarrow{PA}\\) 和 \\(\\overleftrightarrow{PB}\\)，都要畫成直線。'
        ],
        formula: { label: '例 8<span class="pgref">課本 印 126</span>', tex: '\\overline{OP}\\ \\text{是圓 O′ 的直徑}' },
        visual: (h) => {
          const O = [110, 150], R = 64, Pp = [350, 150], O2 = [230, 150], R2 = 120;
          const [A, B] = CCI(O, R, O2, R2), [X1, X2] = CCI(O, 150, Pp, 150), [L1, L2] = EXT(X1, X2, 0.06, 0.06);
          SV.stepper(h, SECVB, [
            { t: '題目：P 在圓 O 外，要畫通過 P、和圓 O 相切的直線。',
              d: () => SECBG + CIRC(O[0], O[1], R) + PN(O, 'O', -22, 6) + PN(Pp, 'P', 10, 6) },
            { t: RULER + '連接 O、P。',
              d: (k) => RL(O, Pp, k, INK, 2.2) },
            { t: COMPASS + '以 O 為圓心，張開<b>超過 OP 的一半</b>，上下各畫一段弧。',
              d: (k) => CARCAT(O, X1, 15, k) + CARCAT(O, X2, 15, k) },
            { t: COMPASS + '<b>大小不變</b>，以 P 為圓心，上下各畫一段弧，交出兩個「×」。',
              d: (k) => CARCAT(Pp, X1, 15, k) + CARCAT(Pp, X2, 15, k) + (k > 0.95 ? XM(X1) + XM(X2) : '') },
            { t: RULER + '連接兩個「×」，和 OP 交於 O′：O′ 是 OP 的中點。',
              d: (k) => RL(L1, L2, k, GREY, 1.8, '5 4') + (k > 0.9 ? PN(O2, 'O′', 6, 22, VIO) : '') },
            { t: COMPASS + '以 O′ 為圓心、O′P 為半徑畫一個圓，和圓 O 交於 A、B。',
              d: (k) => CARC(O2, R2, 0, 360, k) + (k > 0.95 ? PN(A, 'A', -4, -12) + PN(B, 'B', -4, 26) : '') },
            { t: RULER + '從 P 經過 A、經過 B，各畫一條直線：這兩條就是切線。',
              d: (k) => RL(Pp, LERP(Pp, A, 1.35), k, GRN, 3.2) + RL(Pp, LERP(Pp, B, 1.35), k, GRN, 3.2) }
          ]);
        },
        caption: '⚠ A、B 一定是<b>兩個圓的交點</b>，不能用眼睛看「好像碰到了」就畫。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '為什麼 PA 是切線：直徑對的圓周角是直角',
        points: [
          '\\(\\overline{OP}\\) 是圓 O′ 的直徑，A 在圓 O′ 上。',
          '直徑所對的圓周角是 \\(90\\degree\\)，所以 \\(\\overline{OA}\\perp\\overleftrightarrow{PA}\\)。',
          '過圓上的點、又和半徑垂直，就是切線（2-1 學過）。',
          '畫完常接著算 \\(\\overline{PA}\\)：直角三角形 OAP 用畢氏定理。'
        ],
        formula: { label: '算切線段長', tex: '\\overline{PA}^2=\\overline{OP}^2-\\overline{OA}^2' },
        visual: (h) => {
          const O = [110, 150], R = 64, Pp = [350, 150], O2 = [230, 150], R2 = 120;
          const [A, B] = CCI(O, R, O2, R2);
          SV.stepper(h, SECVB, [
            { t: 'OP 是圓 O′ 的直徑，A 在圓 O′ 上。',
              d: () => SECBG + CIRC(O[0], O[1], R) + CIRC(O2[0], O2[1], R2, { stroke: CPA, sw: 1.8 })
                + SEG(O, Pp, VIO, 3.4) + PN(O, 'O', -22, 6) + PN(Pp, 'P', 10, 6) + PN(O2, 'O′', 6, 22, VIO)
                + PN(A, 'A', -4, -12) + TX(230, 140, '直徑', { anchor: 'middle', fs: 14, c: VIO }) },
            { t: '直徑所對的圓周角是 90°，所以 ∠OAP＝90°。',
              d: () => SV.poly([O, A, Pp], 'rgba(225,29,72,.07)', RED, 2.4)
                + SV.rightAngle(A[0], A[1], ANG(A, O), ANG(A, Pp), 12, RED) },
            { t: 'PA 通過圓 O 上的 A，又和半徑 OA 垂直，所以是切線；PB 也一樣。',
              d: () => CIRC(O[0], O[1], R, { stroke: BLU, sw: 3 })
                + RL(Pp, LERP(Pp, A, 1.35), 1, GRN, 3.2) + RL(Pp, LERP(Pp, B, 1.35), 1, GRN, 3.2)
                + SEG(O, B, GREY, 1.8, '5 4') + SV.rightAngle(B[0], B[1], ANG(B, O), ANG(B, Pp), 12, GRN) + PN(B, 'B', -4, 26) }
          ]);
        },
        caption: '⚠ 畫完圖，題目常接著問切線段長；<b>直角就在切點 A</b>。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '給一弦 AB，畫直角三角形（直角在 B）',
        points: [
          '斜邊是直徑時，對面的角就是直角（直徑對的圓周角）。',
          '直角要在 B，所以直徑要從 <b>A</b> 出發、穿過圓心 O。',
          '這一題<b>只用直尺</b>：圓心 O 題目已經給了。',
          '⚠ 從 B 畫直徑，直角會跑到 A。'
        ],
        formula: { label: '自我評量 5<span class="pgref">課本 印 129</span>', tex: '\\overline{AC}\\ \\text{是直徑}\\Rightarrow\\angle ABC=90\\degree' },
        visual: (h) => {
          const O = [150, 150], R = 100;
          const A = P(150, 150, R, 200), B = P(150, 150, R, 115), Cc = P(150, 150, R, 20);
          SV.stepper(h, SECVB, [
            { t: '題目：AB 是圓 O 的一弦，要畫 △ABC，C 在圓上，而且 ∠ABC 是直角。',
              d: () => SECBG + CIRC(O[0], O[1], R) + PN(O, 'O', -6, 24) + SEG(A, B, INK, 2.8)
                + PN(A, 'A', -22, 10) + PN(B, 'B', -8, -12) },
            { t: RULER + '從 A 經過圓心 O，一直畫到圓上，交點叫 C：AC 是直徑。',
              d: (k) => RL(A, Cc, k) + (k > 0.95 ? PN(Cc, 'C', 10, 6, CPL) : '') },
            { t: RULER + '連接 B、C，△ABC 就畫好了，直角在 B。',
              d: (k) => RL(B, Cc, k, GRN, 3) + (k > 0.9
                ? SV.poly([A, B, Cc], 'rgba(5,150,105,.08)', 'none', 0) + SV.rightAngle(B[0], B[1], ANG(B, A), ANG(B, Cc), 12, GRN)
                  + BOX(286, 108, 140, 78, { r: 12, fill: 'rgba(5,150,105,.07)', stroke: GRN, sw: 2 })
                  + TX(356, 140, 'AC 是直徑', { anchor: 'middle', fs: 16, c: INK })
                  + TX(356, 170, '∠B ＝ 90°', { anchor: 'middle', fs: 17, c: GRN }) : '') }
          ]);
        },
        caption: '⚠ 先看清楚<b>直角要在哪個頂點</b>，再決定直徑從哪裡出發。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '六個等分點：以 AB 為一邊的直角三角形有幾個？',
        points: [
          '六等分點裡，<b>隔三格</b>的兩點連起來就是直徑。',
          '直角三角形的斜邊要是直徑；\\(\\overline{AB}\\) 不是直徑，所以直徑從 A 或 B 出發。',
          '答案有兩個：\\(\\triangle ABD\\)（直角在 B）、\\(\\triangle ABE\\)（直角在 A）。'
        ],
        formula: { label: '隨堂練習 2<span class="pgref">課本 印 121</span>', tex: '\\angle ABD=\\angle BAE=90\\degree' },
        visual: (h) => {
          const O = [150, 148], R = 100, NM = ['A', 'B', 'C', 'D', 'E', 'F'];
          const deg = [150, 90, 30, 330, 270, 210], V = deg.map(d => P(150, 148, R, d));
          const [A, B, , D, E] = V;
          const base = () => SECBG + CIRC(O[0], O[1], R) + DOT(O, INK, 3)
            + V.map((p, i) => { const q = P(150, 148, R + 18, deg[i]); return DOT(p, INK, 3.8) + TX(q[0], q[1] + 6, NM[i], { anchor: 'middle', fs: 16 }); }).join('')
            + SEG(A, B, INK, 3);
          const t1 = () => SV.poly([A, B, D], 'rgba(5,150,105,.10)', GRN, 2.4) + SEG(A, D, GRN, 3.4)
            + SV.rightAngle(B[0], B[1], ANG(B, A), ANG(B, D), 12, GRN);
          const t2 = () => SV.poly([A, B, E], 'rgba(37,99,235,.08)', BLU, 2.4) + SEG(B, E, BLU, 3.4)
            + SV.rightAngle(A[0], A[1], ANG(A, B), ANG(A, E), 12, BLU);
          const note = (rows) => rows.map((r, i) => TX(290, 104 + i * 30, r[0], { fs: 16, c: r[1] })).join('');
          SV.stepper(h, SECVB, [
            { t: '六個點把圓周分成 6 等分；AB 是其中一段，不是直徑。', d: () => base() },
            { t: '從 A 隔三格是 D，AD 是直徑。連 AD、BD：△ABD 的直角在 B。',
              d: () => base() + t1() + note([['△ABD', GRN], ['直角在 B', INK]]) },
            { t: '從 B 隔三格是 E，BE 是直徑。連 AE、BE：△ABE 的直角在 A。',
              d: () => base() + t2() + note([['△ABE', BLU], ['直角在 A', INK]]) },
            { t: '斜邊一定是直徑，直徑只能從 A 或 B 出發，所以只有兩個。',
              d: () => base() + t1() + t2() + note([['△ABD', GRN], ['△ABE', BLU], ['只有這兩個', INK]]) }
          ], { acc: false });
        },
        caption: '題目說「所有」，<b>兩個都要畫出來</b>。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '圓內接正三角形：傑克的畫法',
        points: [
          '∠A＝60°，所以 \\(\\overarc{BC}=120\\degree\\)（圓周角是弧的一半）。',
          '\\(\\overline{AD}=\\overline{AE}=\\overline{BC}\\)，等弦對等弧：\\(\\overarc{AD}=\\overarc{AE}=120\\degree\\)。',
          '剩下的 \\(\\overarc{DE}\\) 也是 \\(120\\degree\\)，三段一樣長，所以是正三角形。',
          'BC 的長要用<b>圓規量</b>，不能用尺讀刻度。'
        ],
        formula: { label: '精熟 1<span class="pgref">習作 印 36</span>', tex: '\\overarc{AD}=\\overarc{AE}=\\overarc{DE}=120\\degree' },
        visual: (h) => {
          const O = [150, 150], R = 100;
          const A = P(150, 150, R, 180), B = P(150, 150, R, 120), Cc = P(150, 150, R, 0), D = P(150, 150, R, 60), E = P(150, 150, R, 300);
          SV.stepper(h, SECVB, [
            { t: '題目：A、B、C 在圓 O 上，∠A＝60°、∠C＝30°，要畫圓內接正三角形 ADE。',
              d: () => SECBG + CIRC(O[0], O[1], R) + PN(O, 'O', -6, 22)
                + SV.poly([A, B, Cc], 'rgba(124,58,237,.05)', INK, 2.2)
                + SV.angle(A[0], A[1], 26, 0, ANG(A, B), VIO, '', {}) + TX(A[0] + 50, A[1] - 7, '60°', { anchor: 'middle', fs: 13, c: VIO })
                + SV.angle(Cc[0], Cc[1], 15, ANG(Cc, B), 180, VIO, '', {}) + TX(Cc[0] - 30, Cc[1] - 6, '30°', { anchor: 'middle', fs: 12.5, c: VIO })
                + PN(A, 'A', -22, 6) + PN(B, 'B', -10, -12) + PN(Cc, 'C', 10, 6) },
            { t: COMPASS + '針尖放 B、筆尖放 C：圓規張開的大小就是 BC。',
              d: (k) => SEG(B, Cc, CPA, 3.6) + CARCAT(B, Cc, 7, k) },
            { t: COMPASS + '<b>大小不變</b>，針尖移到 A 畫弧，交圓 O 於 D、E。',
              d: (k) => CARC(A, DIST(B, Cc), -42, 42, k) + (k > 0.95 ? PN(D, 'D', 8, -8, GRN) + PN(E, 'E', 8, 20, GRN) : '') },
            { t: RULER + '連接 AD、DE、EA，△ADE 就是正三角形。',
              d: (k) => RL(A, D, k, GRN, 3) + RL(D, E, k, GRN, 3) + RL(E, A, k, GRN, 3) }
          ]);
        },
        caption: '⚠ 圓心是 <b>A</b>、半徑是 <b>BC</b>，不要和下一頁安琪的畫法混在一起。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '圓內接正三角形：安琪的畫法',
        points: [
          '∠C＝30°，所以 \\(\\overarc{AB}=60\\degree\\)。\\(\\overline{CD}=\\overline{CE}=\\overline{AB}\\)，所以 \\(\\overarc{CD}=\\overarc{CE}=60\\degree\\)。',
          '∠B＝180°－60°－30°＝90°，所以 \\(\\overline{AC}\\) 是直徑，半圓是 \\(180\\degree\\)。',
          '\\(\\overarc{AD}=\\overarc{AE}=180\\degree-60\\degree=120\\degree\\)，三段都是 \\(120\\degree\\)。',
          '兩人畫出的是<b>同一個</b>正三角形，所以兩種畫法都對。'
        ],
        formula: { label: '精熟 1<span class="pgref">習作 印 36</span>', tex: '\\overarc{AD}=180\\degree-60\\degree=120\\degree' },
        visual: (h) => {
          const O = [150, 150], R = 100;
          const A = P(150, 150, R, 180), B = P(150, 150, R, 120), Cc = P(150, 150, R, 0), D = P(150, 150, R, 60), E = P(150, 150, R, 300);
          SV.stepper(h, SECVB, [
            { t: '同一題：A、B、C 在圓 O 上，∠A＝60°、∠C＝30°。',
              d: () => SECBG + CIRC(O[0], O[1], R) + PN(O, 'O', -6, 22)
                + SV.poly([A, B, Cc], 'rgba(124,58,237,.05)', INK, 2.2)
                + SV.angle(A[0], A[1], 26, 0, ANG(A, B), VIO, '', {}) + TX(A[0] + 50, A[1] - 7, '60°', { anchor: 'middle', fs: 13, c: VIO })
                + SV.angle(Cc[0], Cc[1], 15, ANG(Cc, B), 180, VIO, '', {}) + TX(Cc[0] - 30, Cc[1] - 6, '30°', { anchor: 'middle', fs: 12.5, c: VIO })
                + PN(A, 'A', -22, 6) + PN(B, 'B', -10, -12) + PN(Cc, 'C', 10, 6) },
            { t: COMPASS + '針尖放 A、筆尖放 B：圓規張開的大小就是 AB。',
              d: (k) => SEG(A, B, CPA, 3.6) + CARCAT(A, B, 9, k) },
            { t: COMPASS + '<b>大小不變</b>，針尖移到 C 畫弧，交圓 O 於 D、E。',
              d: (k) => CARC(Cc, DIST(A, B), 105, 255, k) + (k > 0.95 ? PN(D, 'D', 8, -8, GRN) + PN(E, 'E', 8, 20, GRN) : '') },
            { t: RULER + '連接 AD、DE、EA：和傑克畫出來的是同一個正三角形。',
              d: (k) => RL(A, D, k, GRN, 3) + RL(D, E, k, GRN, 3) + RL(E, A, k, GRN, 3) }
          ]);
        },
        caption: '⚠ 安琪的圓心是 <b>C</b>、半徑是 <b>AB</b>；題目問「誰對」時，兩個都要檢查。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '給一段弧，找回圓心：畫兩條弦的中垂線',
        points: [
          '弦的中垂線一定<b>通過圓心</b>（2-1 學過）。',
          '一條中垂線只知道圓心在這條線上；畫<b>兩條</b>，交點就是圓心 O。',
          '找到 O 以後，以 O 為圓心、\\(\\overline{OC}\\) 為半徑，就能把整個圓畫回來。'
        ],
        formula: { label: '一題多解<span class="pgref">課本 印 131</span>', tex: '\\text{兩條弦的中垂線交點}=O' },
        visual: (h) => {
          const O = [220, 232], R = 170;
          const Cc = P(220, 232, R, 148), D = P(220, 232, R, 90), E = P(220, 232, R, 32);
          const r1 = DIST(Cc, D) * 0.64;
          const [X1, X2] = CCI(Cc, r1, D, r1), [Y1, Y2] = CCI(D, r1, E, r1);
          const arcs = (p, q, Xa, Xb, k) => CARCAT(p, Xa, 13, k) + CARCAT(p, Xb, 13, k) + CARCAT(q, Xa, 13, k) + CARCAT(q, Xb, 13, k)
            + (k > 0.95 ? XM(Xa) + XM(Xb) : '');
          SV.stepper(h, SECVB, [
            { t: '題目只給一段圓弧，上面有 C、D、E 三點，要找出圓心。',
              d: () => SECBG + CARC(O, R, 18, 162, 1, INK, 2.8)
                + PN(Cc, 'C', -22, 4) + PN(D, 'D', -5, -12) + PN(E, 'E', 10, 4) },
            { t: RULER + '連接 C、D，得到弦 CD。',
              d: (k) => RL(Cc, D, k, INK, 2.2) },
            { t: COMPASS + '分別以 C、D 為圓心、<b>同樣大小</b>（超過 CD 的一半）畫弧，交出兩個「×」。',
              d: (k) => arcs(Cc, D, X1, X2, k) },
            { t: RULER + '連接兩個「×」畫成直線：這是 CD 的中垂線，圓心就在這條線上。',
              d: (k) => RL(X1, LERP(X1, X2, 1.85), k) },
            { t: '換一條弦 DE，照第 2～4 步再畫一次。',
              d: (k) => RL(D, E, k, INK, 2.2) + arcs(D, E, Y1, Y2, k) + RL(Y1, LERP(Y1, Y2, 1.85), Math.max(0, k * 2 - 1)) },
            { t: '兩條中垂線交在一點，那就是圓心 O。',
              d: () => SEG(O, Cc, GREY, 1.6, '5 4') + SEG(O, D, GREY, 1.6, '5 4') + SEG(O, E, GREY, 1.6, '5 4')
                + DOT(O, GRN, 5) + TX(O[0] + 12, O[1] + 20, 'O', { fs: 17, c: GRN }) }
          ]);
        },
        caption: '⚠ 兩條弦要<b>不一樣</b>：CD 和 DE，不要同一條畫兩次。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '找回圓心的三種線：任選兩條「不一樣」的',
        points: [
          '課本的圖上，三條切線切圓弧於 C、D、E，兩兩交於 A、B。',
          '三種線都會<b>通過圓心</b>，任選兩條，交點就是 O。',
          '安琪：切點上畫切線的<b>垂線</b>。艾美：切線夾角的<b>角平分線</b>。傑克：弦的<b>中垂線</b>。',
          '⚠ ∠CAD 的角平分線和 \\(\\overline{CD}\\) 的中垂線是<b>同一條線</b>，不能一起用。'
        ],
        formula: { label: '一題多解<span class="pgref">課本 印 131</span>', tex: '\\text{任選兩條相異的線，交點}=O' },
        visual: (h) => {
          const O = [220, 232], R = 170;
          const Cc = P(220, 232, R, 148), D = P(220, 232, R, 90), E = P(220, 232, R, 32);
          const ta = R / Math.cos(29 * Math.PI / 180), A = P(220, 232, ta, 119), B = P(220, 232, ta, 61);
          const base = () => SECBG
            + SEG(LERP(A, Cc, 1.45), LERP(A, Cc, -0.35), GREY, 1.6) + SEG(LERP(B, A, 1.3), LERP(A, B, 1.3), GREY, 1.6)
            + SEG(LERP(B, E, 1.45), LERP(B, E, -0.35), GREY, 1.6)
            + CARC(O, R, 18, 162, 1, INK, 2.8)
            + PN(Cc, 'C', -22, 4) + PN(D, 'D', 8, 22) + PN(E, 'E', 10, 4)
            + TX(A[0] - 6, A[1] - 10, 'A', { fs: 15, c: GREY }) + TX(B[0] - 4, B[1] - 10, 'B', { fs: 15, c: GREY });
          const tag = (t, col) => TX(16, 24, t, { fs: 16, c: col });
          const OD = () => DOT(O, GRN, 5) + TX(O[0] + 12, O[1] + 20, 'O', { fs: 17, c: GRN });
          const thru = (p, col, w, dash) => SEG(p, LERP(p, O, 1.12), col, w || 2.6, dash);
          SV.stepper(h, SECVB, [
            { t: '安琪：切線垂直半徑。過切點 C、D 各畫切線的垂線，交點是 O。',
              d: () => base() + tag('安琪：切點上的垂線', VIO) + thru(Cc, VIO) + thru(D, VIO)
                + SV.rightAngle(Cc[0], Cc[1], ANG(Cc, A), ANG(Cc, O), 11, VIO) + SV.rightAngle(D[0], D[1], 0, 270, 11, VIO) + OD() },
            { t: '艾美：兩條切線夾角的角平分線過圓心。∠CAD、∠DBE 的角平分線交於 O。',
              d: () => base() + tag('艾美：切線夾角的角平分線', CPA) + thru(A, CPA) + thru(B, CPA) + OD() },
            { t: '傑克：弦的中垂線過圓心。CD、DE 的中垂線交於 O。',
              d: () => base() + tag('傑克：弦的中垂線', BLU) + SEG(Cc, D, INK, 2) + SEG(D, E, INK, 2)
                + thru(LERP(Cc, D, 0.5), BLU) + thru(LERP(D, E, 0.5), BLU)
                + SV.ticks(Cc[0], Cc[1], LERP(Cc, D, 0.5)[0], LERP(Cc, D, 0.5)[1], 1, BLU) + SV.ticks(LERP(Cc, D, 0.5)[0], LERP(Cc, D, 0.5)[1], D[0], D[1], 1, BLU) + OD() },
            { t: '⚠ ∠CAD 的角平分線和 CD 的中垂線是<b>同一條線</b>，兩條一起用交不出點。',
              d: () => base() + tag('艾美和傑克：同一條線', RED) + SEG(Cc, D, INK, 2)
                + thru(A, CPA, 5) + thru(LERP(Cc, D, 0.5), BLU, 2.2, '6 5')
                + TX(A[0] + 62, A[1] + 82, '同一條！', { fs: 16, c: RED }) + OD() }
          ], { acc: false });
        },
        caption: '⚠ 選一種畫熟就好；<b>上一頁的中垂線</b>最常用。'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '作圖最常錯的四件事：痕跡要留著',
        points: [
          '尺規作圖只能用<b>直尺連線</b>、<b>圓規畫弧和量長度</b>。',
          '讀刻度、三角板的直角、量角器、用眼睛對齊，都不算。',
          '畫過的弧和「×」<b>不要擦</b>，那是用尺規畫的證據。',
          '作出來的點，要標上題目給的名字。'
        ],
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '找中點', bad: '用尺量 \\(\\overline{OP}\\)，再除以 2', good: '畫兩組弧，連「×」找中垂線' },
            { tag: '畫垂線', bad: '拿三角板的直角對齊', good: '左右截出 M、N，再畫弧交出 Q' },
            { tag: '畫切線', bad: '從 P 畫一條「看起來碰到圓」的線', good: 'A、B 是<b>兩個圓的交點</b>' },
            { tag: '擦乾淨', bad: '畫完把弧和「×」擦掉', good: '弧、「×」、輔助線<b>全部留著</b>' }
          ]);
        },
        caption: '⚠ 交出去之前檢查一次：<b>每個交點旁邊都看得到弧</b>嗎？'
      },

      {
        sec: '作圖', secName: '尺規作圖',
        title: '練習｜自己畫一次：這一節的四題',
        points: [
          '四題都在前面畫過，現在拿圓規和直尺，在課本、習作上自己畫一次。',
          '點題號可以看詳解。',
          '畫完檢查：弧和「×」都還在嗎？'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 121–129、習作 印 36</span>', tex: '\\text{直尺：連線}\\quad;\\quad\\text{圓規：畫弧、量長度}' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return; }
          PRACTICE.page(h, '2-2', [
            { src: '課本', page: '印 121–126', sub: '六等分點的直角三角形、過圓外一點的切線', tags: ['課P121 第2題', '課P126'] },
            { src: '課本・自我評量', page: '印 129', sub: '給一弦，畫直角三角形', tags: ['自評5'] },
            { src: '習作', page: '印 36', sub: '圓內接正三角形', tags: ['精熟1'] }
          ]);
        },
        caption: '⚠ 印 126 那題畫完圖，還要用畢氏定理算 \\(\\overline{PA}\\)。'
      },

      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '第二次段考的範圍：1-4～2-2',
        points: [
          '日期：<b>12/1（二）–12/2（三）</b>。',
          '範圍：<b>1-4～2-2</b>。',
          '後面是<b>核心概念學習單</b>：先對答案，再逐題看詳解。'
        ],
        visual: (h) => {

          h.innerHTML = `<div style="width:100%;max-width:440px;margin:0 auto;display:flex;flex-direction:column;gap:12px">`
            + `<div style="font-size:15px;font-weight:800;color:${GREY}">第二次段考考這幾節</div>`
            + ['1-4 相似三角形的應用', '2-1 點、直線與圓', '2-2 圓心角與圓周角'].map(t => `<div style="border:1.6px solid #dce3ee;background:#fbfcfe;border-radius:11px;padding:10px 14px;font-size:17px;font-weight:800;color:${INK}">${t}</div>`).join('')
            + `</div>`;
        },
        caption: '範圍以學校公告為準。'
      },

      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '對答案｜核心概念學習單 ①（1-4）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，往後翻到詳解頁，<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '1-4', [
            { label: '1-4（印 5）', cols: 2, items: [['概10-1', '核1-4概10-1'], ['概11-1', '核1-4概11-1'], ['概11-2', '核1-4概11-2'], ['概12-1', '核1-4概12-1'], ['概12-2', '核1-4概12-2'], ['概12-3', '核1-4概12-3']] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，往後翻到詳解頁再看。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '對答案｜核心概念學習單 ②（2-1）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，往後翻到詳解頁，<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-1', [
            { label: '2-1（印 6、7）', cols: 3, items: [['概1、2-1', '核2-1概1、2-1'], ['概1、2-2', '核2-1概1、2-2'], ['概1、2-3', '核2-1概1、2-3'], ['概1、2-4', '核2-1概1、2-4'], ['概1、2-5', '核2-1概1、2-5'], ['概3-1', '核2-1概3-1'], ['概3-2', '核2-1概3-2'], ['概3-3', '核2-1概3-3'], ['概4-1', '核2-1概4-1'], ['概4-2', '核2-1概4-2'], ['概4-3', '核2-1概4-3'], ['概5-1', '核2-1概5-1'], ['概5-2', '核2-1概5-2'], ['概5-3', '核2-1概5-3'], ['概5-4', '核2-1概5-4']] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，往後翻到詳解頁再看。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '對答案｜核心概念學習單 ③（2-2）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，往後翻到詳解頁，<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '2-2', [
            { label: '2-2（印 8）', cols: 2, items: [['概6-1', '核2-2概6-1'], ['概6-2', '核2-2概6-2'], ['概6-3', '核2-2概6-3'], ['概7-1', '核2-2概7-1'], ['概7-2', '核2-2概7-2'], ['概8-1', '核2-2概8-1'], ['概8-2', '核2-2概8-2']] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，往後翻到詳解頁再看。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ①（1-4 概念 10、11）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-4', [
            { src: '試卷・核心概念學習單', page: '印 5', sub: '1-4 概念 10', tags: ['核1-4概10-1'] },
            { src: '試卷・核心概念學習單', page: '印 5', sub: '1-4 概念 11', tags: ['核1-4概11-1', '核1-4概11-2'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ②（1-4 概念 12）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-4', [
            { src: '試卷・核心概念學習單', page: '印 5', sub: '1-4 概念 12', tags: ['核1-4概12-1'] },
            { src: '試卷・核心概念學習單', page: '印 5', sub: '1-4 概念 12', tags: ['核1-4概12-2', '核1-4概12-3'], level: '額外的' }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ③（2-1 概念 1、2 第 1～3 題）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・核心概念學習單', page: '印 6', sub: '2-1 概念 1、2', tags: ['核2-1概1、2-1', '核2-1概1、2-2', '核2-1概1、2-3'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ④（2-1 概念 1、2 第 4、5 題）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・核心概念學習單', page: '印 6', sub: '2-1 概念 1、2', tags: ['核2-1概1、2-4', '核2-1概1、2-5'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ⑤（2-1 概念 3）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・核心概念學習單', page: '印 6', sub: '2-1 概念 3', tags: ['核2-1概3-1', '核2-1概3-2', '核2-1概3-3'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ⑥（2-1 概念 4）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・核心概念學習單', page: '印 7', sub: '2-1 概念 4', tags: ['核2-1概4-1', '核2-1概4-2', '核2-1概4-3'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ⑦（2-1 概念 5）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・核心概念學習單', page: '印 7', sub: '2-1 概念 5', tags: ['核2-1概5-1', '核2-1概5-2', '核2-1概5-3', '核2-1概5-4'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ⑧（2-2 概念 6）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・核心概念學習單', page: '印 8', sub: '2-2 概念 6', tags: ['核2-2概6-1', '核2-2概6-2', '核2-2概6-3'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      },
      {
        sec: '段考', secName: '第二次（1-4～2-2）',
        title: '檢討｜核心概念學習單 ⑨（2-2 概念 7、8）',
        points: [
          '一個概念一個概念，把<b>每一格補成完整算式</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・核心概念學習單', page: '印 8', sub: '2-2 概念 7', tags: ['核2-2概7-1', '核2-2概7-2'] },
            { src: '試卷・核心概念學習單', page: '印 8', sub: '2-2 概念 8', tags: ['核2-2概8-1', '核2-2概8-2'] }
          ]);
        },
        caption: '一頁最多四題，改完卷子照題號挑。'
      }

    ]
  });
})();
