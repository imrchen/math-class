window.DECK = window.DECK || [];
(function () {
  const C = '#e11d48';

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

  const PR = () => (typeof window !== 'undefined' && window.PRACTICE) || null;
  const PO = { accent: C };
  const pItem = (tag, tex, ans, label) => PR() ? PR().item(tag, tex, ans, label, PO)
    : `<div class="p-row" data-tag="${tag}">\\(${tex}\\) ${ans || ''}</div>`;
  const pText = (tag, html, ans, label) => PR() ? PR().text(tag, html, ans, label, PO)
    : `<div class="p-row" data-tag="${tag}">${html} ${ans || ''}</div>`;
  const pCard = (src, page, col, sub, rows) => PR() ? PR().card(src, page, col, sub, rows)
    : `<div>${src} ${page} ${sub || ''}${rows}</div>`;
  const pMount = (h, cards, sec) => { if (PR()) PR().mount(h, cards, sec, PO); else h.innerHTML = cards; };
  const pAnswerKey = (h, sec, groups) => {
    if (PR()) PR().answerKey(h, sec, groups);
    else h.innerHTML = '<div>對答案（需 practice.js）</div>';
  };

  const mapCards = (rows) => svg('0 0 440 250', rows.map(([n, q, a, col], i) => {
    const y = 6 + i * 82;
    return BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
      `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
      TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
      TX(80, y + 28, q, { fs: 15.5, c: INK }) +
      TX(80, y + 52, a, { fs: 14, c: GREY });
  }).join(''));

  const TBL = (rows, o) => {
    const { x = 10, y = 10, lw = 90, cw = 55, rh = 34, fs = 14 } = o;
    const txt = (cx, cy, t, st) => String(t).includes('\n')
      ? String(t).split('\n').map((p, i) => TX(cx, cy - 4 + i * 14, p, Object.assign({}, st, { fs: (st.fs || fs) - 1.5 }))).join('')
      : TX(cx, cy + 5, t, st);
    let s = '';
    rows.forEach(([lab, cells, ro = {}], r) => {
      const yy = y + r * rh, head = r === 0;
      s += BOX(x, yy, lw, rh, { r: 0, fill: '#f3f6fb', stroke: LINE, sw: 1.4 });
      s += txt(x + lw / 2, yy + rh / 2, lab, { anchor: 'middle', fs: ro.lfs || fs - 1.5, c: INK });
      cells.forEach((t, j) => {
        const xx = x + lw + j * cw, hl = ro.hl && ro.hl.includes(j);
        s += BOX(xx, yy, cw, rh, { r: 0, fill: head ? '#f3f6fb' : hl ? (ro.hc || 'rgba(225,29,72,.13)') : '#fff', stroke: LINE, sw: 1.4 });
        if (t !== '' && t !== null && t !== undefined)
          s += txt(xx + cw / 2, yy + rh / 2, t, { anchor: 'middle', fs: ro.fs || fs, c: ro.c || INK, op: ro.op });
      });
    });
    return s;
  };

  const PLOT = (o) => {
    const X = (v) => o.px0 + (v - o.xmin) / (o.xmax - o.xmin) * (o.px1 - o.px0);
    const Y = (v) => o.py0 - (v - o.ymin) / (o.ymax - o.ymin) * (o.py0 - o.py1);
    let s = '';
    for (let v = o.ymin; v <= o.ymax + 1e-9; v += o.ys) {
      s += SV.seg(o.px0, Y(v), o.px1, Y(v), '#eef1f6', 1);
      s += TX(o.px0 - 7, Y(v) + 4, (o.yf || String)(v), { anchor: 'end', fs: 11.5, c: GREY, fw: 700 });
    }
    for (let v = o.xmin; v <= o.xmax + 1e-9; v += o.xs) {
      s += SV.seg(X(v), o.py0, X(v), o.py0 + 5, INK, 1.2);
      s += TX(X(v), o.py0 + 18, String(v), { anchor: 'middle', fs: 11.5, c: GREY, fw: 700 });
    }
    s += SV.seg(o.px0, o.py0, o.px1 + 10, o.py0, INK, 1.8) + SV.seg(o.px0, o.py0, o.px0, o.py1 - 10, INK, 1.8);
    if (o.xl) s += TX(o.px1 + 10, o.py0 + 34, o.xl, { anchor: 'end', fs: 12, c: GREY });
    if (o.yl) s += TX(o.px0, o.py1 - 16, o.yl, { anchor: 'middle', fs: 12, c: GREY });
    return { s, X, Y };
  };
  const dot = (x, y, col, r) => `<circle cx="${x}" cy="${y}" r="${r || 5}" fill="${col}"/>`;
  const line = (pts, col, w) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w || 2.4}" stroke-linejoin="round"/>`;

  const S400 = {
    lo: [40, 50, 60, 70, 80, 90], f: [52, 76, 132, 100, 28, 12],
    rel: [13, 19, 33, 25, 7, 3], cum: [52, 128, 260, 360, 388, 400], crel: [13, 32, 65, 90, 97, 100]
  };
  const JUMP = {
    lo: [100, 120, 140, 160, 180, 200, 220], f: [3, 10, 6, 5, 10, 4, 2],
    cum: [3, 13, 19, 24, 34, 38, 40], rel: [7.5, 25, 15, 12.5, 25, 10, 5], crel: [7.5, 32.5, 47.5, 60, 85, 95, 100]
  };
  const g400 = S400.lo.map(a => `${a}～${a + 10}`);

  const cumPage = (h, o) => {
    h.innerHTML = `<div style="width:100%"><div class="fig"></div>
      <div class="ictrl">
        <label>到第 <span class="ival iv">1</span> 組為止</label>
        <input type="range" class="is" min="1" max="6" step="1" value="1">
      </div></div>`;
    const draw = () => {
      const i = +h.querySelector('.is').value, hi = S400.lo[i - 1] + 10, u = o.unit;
      h.querySelector('.iv').textContent = i;
      const upto = [...Array(i).keys()];
      let s = TBL([
        ['成績（分）', g400],
        [o.row1, o.v1.map(v => v + u), { hl: upto, hc: 'rgba(37,99,235,.13)' }],
        [o.row2, o.v2.map((v, j) => (j < i ? v + u : '')), { hl: [i - 1], c: o.col, fs: 15 }]
      ], { x: 8, y: 14, lw: 92, cw: 56, rh: 38, fs: 14 });
      const prev = i > 1 ? o.v2[i - 2] : 0;
      s += BOX(30, 150, 380, 74, { r: 12, fill: '#fff', stroke: o.col, sw: 2 });
      s += TX(220, 180, `到 ${hi} 分為止（未滿 ${hi} 分）：${o.v2[i - 1]}${u}`, { anchor: 'middle', fs: 17, c: o.col });
      s += TX(220, 208, i > 1 ? `＝ 前一格的 ${prev}${u} ＋ 這一組的 ${o.v1[i - 1]}${u}` : '第一組：累積就是它自己', { anchor: 'middle', fs: 14.5, c: GREY });
      s += TX(220, 252, i === 6 ? o.last : '藍色那幾格加起來，就是紅框那一格', { anchor: 'middle', fs: 14.5, c: i === 6 ? GRN : GREY });
      h.querySelector('.fig').innerHTML = svg('0 0 440 266', s);
    };
    h.querySelector('.is').oninput = draw;
    draw();
  };

  window.DECK.push({
    ch: 5,
    title: '統計資料處理與圖表',
    color: C,
    sections: ['5-1 相對與累積次數分配圖表'],
    slides: [

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '這一節只有四個名字',
        points: [
          '<b>是什麼</b>：把一堆數字分組、數一數，整理成<span class="k">次數分配表</span>。',
          '<b>四個名字</b>：差在「這一格」還是「到這一格為止」、算「人」還是算「%」。',
          '<b>做什麼</b>：畫成折線圖，回答「未滿幾分」「幾分以上」「占幾 %」。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 198–210</span>', tex: '\\text{相對次數}=\\dfrac{\\text{各組次數}}{\\text{總次數}}\\times100\\%' },
        visual: (h) => {
          const cell = (x, y, t, col) =>
            BOX(x, y, 128, 66, { r: 12, fill: col, stroke: col, op: .13 }) +
            BOX(x, y, 128, 66, { r: 12, fill: 'none', stroke: col, sw: 2 }) +
            TX(x + 64, y + 40, t, { anchor: 'middle', fs: 17, c: col });
          h.innerHTML = svg('0 0 440 252',
            TX(222, 36, '算人數', { anchor: 'middle', fs: 15, c: GREY }) +
            TX(358, 36, '算 %', { anchor: 'middle', fs: 15, c: GREY }) +
            BOX(10, 52, 136, 66, { r: 12, fill: '#f3f6fb', stroke: LINE }) +
            TX(78, 91, '這一格', { anchor: 'middle', fs: 16, c: INK }) +
            BOX(10, 130, 136, 66, { r: 12, fill: '#f3f6fb', stroke: LINE }) +
            TX(78, 169, '到這一格為止', { anchor: 'middle', fs: 15, c: INK }) +
            cell(158, 52, '次數', BLU) + cell(294, 52, '相對次數', VIO) +
            cell(158, 130, '累積次數', AMB) + cell(294, 130, '累積相對次數', RED) +
            TX(220, 230, '加「累積」＝到這一格為止；加「相對」＝換成 %', { anchor: 'middle', fs: 14.5, c: GREY }));
        },
        caption: '貫串整節的一句話：<b>次數是這一格，累積是到這一格為止；加上「相對」就換成 %</b>。',
        example: {
          q: '課本溫故啟思：全班 \\(30\\) 人，\\(60\\)～\\(70\\) 分有 \\(6\\) 人，占全班幾 %？',
          steps: ['\\(\\frac{6}{30}\\times100\\%\\)'],
          ans: '\\(20\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '分組：看到等於，往右送',
        points: [
          '\\(60\\)～\\(70\\) 分的意思是 <b>\\(60\\) 分以上、未滿 \\(70\\) 分</b>。',
          '剛好 \\(70\\) 分要放到下一組 \\(70\\)～\\(80\\)：<b>看到等於，往右送</b>。',
          '只有最後一組 \\(90\\)～\\(100\\) 包含 \\(100\\) 分。'
        ],
        formula: { label: '含下界、不含上界<span class="pgref">課本 印 198、199</span>', tex: '60\\text{～}70：\\;60\\le x\\lt 70' },
        visual: (h) => {
          const L = [42, 55, 60, 64, 70, 78, 80, 92, 100];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>成績 <span class="ival sv">42</span> 分</label>
              <input type="range" class="ss" min="0" max="${L.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const sc = L[+h.querySelector('.ss').value], g = Math.min(5, Math.floor((sc - 40) / 10)), lo = 40 + g * 10;
            h.querySelector('.sv').textContent = sc;
            let s = TX(220, 42, `${sc} 分`, { anchor: 'middle', fs: 30, c: INK });
            for (let j = 0; j < 6; j++) {
              const x = 14 + j * 70, on = j === g;
              s += BOX(x, 70, 64, 50, { r: 10, fill: on ? C : '#fff', stroke: on ? C : LINE, sw: 2, op: on ? .9 : 1 });
              s += TX(x + 32, 101, g400[j], { anchor: 'middle', fs: 13.5, c: on ? '#fff' : GREY });
            }
            const X = (v) => 26 + (v - 40) * 6.4;
            s += SV.seg(X(40), 158, X(100), 158, INK, 1.8);
            for (let v = 40; v <= 100; v += 10) { s += SV.seg(X(v), 152, X(v), 164, INK, 1.4); s += TX(X(v), 182, `${v}`, { anchor: 'middle', fs: 12, c: GREY }); }
            s += `<circle cx="${X(sc)}" cy="158" r="7" fill="${C}"/>`;
            const edge = sc % 10 === 0 && sc > 40;
            const msg = sc === 100 ? '100 分：最後一組包含 100' :
              edge ? `剛好 ${sc} 分：往右送，放在 ${lo}～${lo + 10}` : `${lo} ≤ ${sc} ＜ ${lo + 10}：放在 ${lo}～${lo + 10}`;
            s += BOX(40, 202, 360, 42, { r: 12, fill: edge ? 'rgba(217,119,6,.10)' : '#fff', stroke: edge ? AMB : LINE, sw: 2 });
            s += TX(220, 229, msg, { anchor: 'middle', fs: 16, c: edge ? AMB : INK });
            h.querySelector('.fig').innerHTML = svg('0 0 440 256', s);
          };
          h.querySelector('.ss').oninput = draw;
          draw();
        },
        caption: '最常錯的就是邊界：\\(70\\) 分被放進 \\(60\\)～\\(70\\)。每一筆只能算一次。',
        example: {
          q: '課本溫故啟思的 \\(30\\) 個成績裡，\\(60\\)～\\(70\\) 分的是哪幾個？',
          steps: ['\\(60,\\ 60,\\ 64,\\ 64,\\ 66,\\ 68\\)'],
          ans: '\\(6\\) 人'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '相對次數：這一組占全部幾 %',
        points: [
          '甲班 \\(12\\) 人、乙班 \\(10\\) 人考 \\(90\\) 分以上，好像甲班比較多？',
          '甲班全班 \\(50\\) 人、乙班 \\(25\\) 人：\\(\\frac{12}{50}=24\\%\\)，\\(\\frac{10}{25}=40\\%\\)。',
          '總數不一樣時，比的是<span class="k">相對次數</span>：這一組占全部幾 %。'
        ],
        formula: { label: '相對次數的計算<span class="pgref">課本 印 198</span>', tex: '\\text{相對次數}=\\dfrac{\\text{各組次數}}{\\text{總次數}}\\times100\\%' },
        visual: (h) => {

          const W = 300, x0 = 100;
          SV.stepper(h, '0 0 440 250', [
            {
              t: '只看人數：12 比 10 多？', d: k =>
                TX(56, 76, '甲班', { anchor: 'middle', fs: 16, c: INK }) + TX(56, 156, '乙班', { anchor: 'middle', fs: 16, c: INK }) +
                `<rect x="${x0}" y="56" width="${12 * 6}" height="32" fill="${BLU}" opacity=".8"/>` +
                `<rect x="${x0}" y="136" width="${10 * 6}" height="32" fill="${AMB}" opacity=".8"/>` +
                TX(x0 + 12 * 6 + 8, 78, '12 人', { fs: 15, c: BLU }) + TX(x0 + 10 * 6 + 8, 158, '10 人', { fs: 15, c: AMB })
            },
            {
              t: '可是兩班的總人數不一樣', d: k =>
                `<rect x="${x0}" y="56" width="${W}" height="32" fill="none" stroke="${GREY}" stroke-width="1.6" stroke-dasharray="5 4" opacity="${k}"/>` +
                `<rect x="${x0}" y="136" width="${W}" height="32" fill="none" stroke="${GREY}" stroke-width="1.6" stroke-dasharray="5 4" opacity="${k}"/>` +
                TX(x0 + W, 108, '全班 50 人', { anchor: 'end', fs: 13.5, c: GREY, op: k }) +
                TX(x0 + W, 188, '全班 25 人', { anchor: 'end', fs: 13.5, c: GREY, op: k })
            },
            {
              t: '各自除以總數：乙班的比例比較高', d: k =>
                `<rect x="${x0}" y="56" width="${W * 0.24}" height="32" fill="${BLU}" opacity="${.25 * k}"/>` +
                `<rect x="${x0}" y="136" width="${W * 0.40}" height="32" fill="${AMB}" opacity="${.25 * k}"/>` +
                TX(x0 + W * 0.24 + 54, 78, '12 ÷ 50 ＝ 24%', { fs: 15, c: BLU, op: k }) +
                TX(x0 + W * 0.40 + 54, 158, '10 ÷ 25 ＝ 40%', { fs: 15, c: AMB, op: k }) +
                TX(220, 230, '人數多不等於比例高', { anchor: 'middle', fs: 17, c: C, op: k })
            }
          ], { acc: true });
        },
        caption: '人數多不代表比例高——要先除以<b>各自的總數</b>。',
        example: {
          q: '\\(400\\) 人裡 \\(60\\)～\\(70\\) 分有 \\(132\\) 人，相對次數？',
          steps: ['\\(\\frac{132}{400}\\times100\\%\\)'],
          ans: '\\(33\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '相對次數分配表：一格一格除，加起來是 100%',
        points: [
          '每一組都除以總數 \\(400\\)，再乘 \\(100\\%\\)。',
          '整張表加起來是 \\(100\\%\\)；四捨五入過的，可能差一點點（\\(99.9\\%\\)）。',
          '考 \\(75\\) 分的人看 \\(70\\)～\\(80\\) 那一格：同一組的占全體 \\(25\\%\\)。'
        ],
        formula: { label: '相對次數分配表<span class="pgref">課本 印 199</span>', tex: '\\dfrac{52}{400}\\times100\\%=13\\%' },
        visual: (h) => {
          const R = (n) => S400.rel.map((v, j) => (j < n ? v : ''));
          const tb = (n, hl) => TBL([
            ['成績（分）', g400], ['次數（人）', S400.f], ['相對次數（%）', R(n), { c: VIO, fs: 15, hl }]
          ], { x: 8, y: 14, lw: 92, cw: 56, rh: 38, fs: 14 });
          SV.stepper(h, '0 0 440 250', [
            { t: '先有次數分配表（400 人）', d: k => tb(0) },
            {
              t: '前三組：次數 ÷ 400 × 100%', d: k => tb(3, [0, 1, 2]) +
                TX(220, 158, '52 ÷ 400 ＝ 13%　76 ÷ 400 ＝ 19%　132 ÷ 400 ＝ 33%', { anchor: 'middle', fs: 13.5, c: VIO, op: k })
            },
            {
              t: '後三組也一樣', d: k => tb(6, [3, 4, 5]) +
                TX(220, 184, '100 ÷ 400 ＝ 25%　28 ÷ 400 ＝ 7%　12 ÷ 400 ＝ 3%', { anchor: 'middle', fs: 13.5, c: VIO, op: k })
            },
            {
              t: '自己檢查：加起來是 100%', d: k =>
                BOX(40, 202, 360, 40, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2, op: k }) +
                TX(220, 228, '13 ＋ 19 ＋ 33 ＋ 25 ＋ 7 ＋ 3 ＝ 100 ✓', { anchor: 'middle', fs: 16, c: GRN, op: k })
            }
          ], { acc: false });
        },
        caption: '課本隨堂那一題（\\(30\\) 人）四捨五入到小數一位，加起來是 \\(99.9\\%\\)——不是算錯。',
        example: {
          q: '\\(400\\) 人裡 \\(90\\)～\\(100\\) 分有 \\(12\\) 人，相對次數？',
          steps: ['\\(\\frac{12}{400}\\times100\\%\\)'],
          ans: '\\(3\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜相對次數分配表',
        points: [
          '相對次數 ＝ 次數 ÷ \\(30\\) × \\(100\\%\\)。',
          '缺的次數用總數倒扣：\\(30-(1+4+6+7+3)\\)。',
          '加起來不是剛好 \\(100\\%\\) 的原因，要寫出來。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 199</span>', tex: '\\dfrac{6}{30}\\times100\\%=20\\%' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 199', BLU, '八年甲班 \\(30\\) 人的隨堂測驗（點開看表）',
              pText('印4', '完成相對次數分配表；哪一組最多？加起來是不是 \\(100\\%\\)？', '70～80 分；不是')), '5-1');
        },
        caption: '點開題目看詳解：完成的表排在最後，先自己算再揭曉。'
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '相對次數折線圖：點畫在組中點',
        points: [
          '<span class="k">組中點</span>：一組的正中間，\\(40\\)～\\(50\\) 的組中點是 \\(\\frac{40+50}{2}=45\\)。',
          '橫坐標取組中點、縱坐標取相對次數，描點再連線。',
          '縱軸的單位是 <b>%</b>，不是人數。'
        ],
        formula: { label: '相對次數分配折線圖<span class="pgref">課本 印 200</span>', tex: '\\text{組中點}=\\dfrac{\\text{下限}+\\text{上限}}{2}' },
        visual: (h) => {
          const ST = ['直方圖', '找組中點', '連成折線圖'];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label><span class="ival tv">直方圖</span></label>
              <input type="range" class="ts" min="0" max="2" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const t = +h.querySelector('.ts').value;
            h.querySelector('.tv').textContent = ST[t];
            const P = PLOT({ px0: 64, px1: 404, py0: 236, py1: 40, xmin: 40, xmax: 100, xs: 10, ymin: 0, ymax: 40, ys: 10, xl: '成績（分）', yl: '相對次數（%）' });
            let s = P.s;
            const pts = S400.lo.map((a, j) => [P.X(a + 5), P.Y(S400.rel[j])]);
            S400.lo.forEach((a, j) => {
              s += `<rect x="${P.X(a)}" y="${P.Y(S400.rel[j])}" width="${P.X(a + 10) - P.X(a)}" height="${P.Y(0) - P.Y(S400.rel[j])}" fill="${VIO}" opacity="${t === 2 ? .08 : .22}" stroke="${VIO}" stroke-width="1.2" stroke-opacity="${t === 2 ? .2 : .7}"/>`;
            });
            if (t >= 1) pts.forEach(([x, y], j) => { s += dot(x, y, C) + TX(x, y - 10, `${S400.rel[j]}`, { anchor: 'middle', fs: 12.5, c: C }); });
            if (t === 1) s += TX(P.X(45), P.Y(0) - 8, '45', { anchor: 'middle', fs: 12, c: C });
            if (t === 2) s += line(pts, C);
            h.querySelector('.fig').innerHTML = svg('0 0 440 284', s);
          };
          h.querySelector('.ts').oninput = draw;
          draw();
        },
        caption: '直方圖每一格頂端的中點連起來，就是折線圖。',
        example: {
          q: '課本例 1：京兆國中 \\(300\\) 人，\\(10\\)～\\(12\\) 小時占 \\(11\\%\\)、\\(0\\)～\\(2\\) 小時占 \\(14\\%\\)，相差幾人？',
          steps: ['\\(300\\times(14-11)\\%\\)', '\\(=300\\times3\\%\\)'],
          ans: '\\(9\\) 人'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜相對次數折線圖',
        points: [
          '先描點：橫坐標是組中點 \\(1,\\ 3,\\ 5,\\ \\dots\\)。',
          '「少於 \\(6\\) 小時」要把好幾組加起來。',
          '要人數，再乘總人數 \\(200\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 202</span>', tex: '\\text{組中點}=\\dfrac{\\text{下限}+\\text{上限}}{2}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 202', BLU, '萬謙國中每週閱讀時間（點開看表與圖）',
              pText('印7 ①', '根據相對次數分配表，畫出相對次數分配折線圖。', '畫圖') +
              pText('印7 續 ①', '閱讀時間 \\(2\\)～\\(4\\) 小時的占多少百分比？', '', '印7 ②') +
              pText('印7 續 ②', '八年級 \\(200\\) 人，閱讀少於 \\(6\\) 小時的有多少人？', '', '印7 ③')), '5-1');
        },
        caption: '「少於 \\(6\\) 小時」要把前面好幾組加起來——下一段的「累積」就是在做這件事。'
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '累積次數：到這一格為止有幾人',
        points: [
          '問「未滿 \\(60\\) 分有幾人」，要把前兩組加起來：\\(52+76=128\\)。',
          '一組一組往右加，寫成一列，就是<span class="k">累積次數</span>。',
          '\\(60\\)～\\(70\\) 那一格的累積 \\(260\\)：<b>未滿 \\(70\\) 分有 \\(260\\) 人</b>，不是這一組 \\(260\\) 人。'
        ],
        formula: { label: '累積次數分配表<span class="pgref">課本 印 203</span>', tex: '\\text{這一格的累積}=\\text{前一格的累積}+\\text{這一組的次數}' },
        visual: (h) => cumPage(h, {
          row1: '次數（人）', v1: S400.f, row2: '累積次數（人）', v2: S400.cum, unit: '', col: AMB,
          last: '最後一格 ＝ 總人數 400 ✓（可以拿來檢查）'
        }),
        caption: '<b>次數是這一格，累積次數是到這一格為止。</b>最後一格一定等於總人數，可以拿來檢查。',
        example: {
          q: '承上，未滿 \\(80\\) 分有幾人？',
          steps: ['讀 \\(70\\)～\\(80\\) 那一格的累積'],
          ans: '\\(360\\) 人'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '累積相對次數：到這一格為止占幾 %',
        points: [
          '把相對次數一格一格往右加：\\(13,\\ 32,\\ 65,\\ 90,\\ 97,\\ 100\\)。',
          '\\(50\\)～\\(60\\) 的 \\(32\\%\\)：<b>未滿 \\(60\\) 分的占全體 \\(32\\%\\)</b>。',
          '也可以用累積次數除以總數：\\(\\frac{260}{400}\\times100\\%=65\\%\\)；最後一格一定是 \\(100\\%\\)。'
        ],
        formula: { label: '累積相對次數分配表<span class="pgref">課本 印 203</span>', tex: '\\dfrac{260}{400}\\times100\\%=65\\%' },
        visual: (h) => cumPage(h, {
          row1: '相對次數（%）', v1: S400.rel, row2: '累積相對（%）', v2: S400.crel, unit: '%', col: RED,
          last: '最後一格 ＝ 100% ✓'
        }),
        caption: '課本的浩南考 \\(80\\) 分：未滿 \\(80\\) 分的占 \\(90\\%\\)，所以他排在全體的前 \\(10\\%\\)。',
        example: {
          q: '未滿 \\(70\\) 分的占幾 %？',
          steps: ['讀 \\(60\\)～\\(70\\) 那一格的累積相對次數'],
          ans: '\\(65\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '四種數，放在同一張表',
        points: [
          '\\(40\\) 位學生的立定跳遠：一張表、四列，每一列都從<b>次數</b>算出來。',
          '累積：往右加；相對：除以 \\(40\\)；累積相對：相對往右加（或累積 ÷ \\(40\\)）。',
          '三個自檢：累積最後＝\\(40\\)、相對加起來＝\\(100\\%\\)、累積相對最後＝\\(100\\%\\)。'
        ],
        formula: { label: '累積與累積相對次數分配表<span class="pgref">課本 印 205 例 2</span>', tex: '\\dfrac{19}{40}\\times100\\%=47.5\\%' },
        visual: (h) => {
          const head = JUMP.lo.map(a => `${a}～\n${a + 20}`);
          const rows = (n) => {
            const r = [['距離（公分）', head], ['次數（人）', JUMP.f]];
            if (n >= 1) r.push(['累積次數', JUMP.cum, { c: AMB }]);
            if (n >= 2) r.push(['相對次數(%)', JUMP.rel, { c: VIO, fs: 12.5 }]);
            if (n >= 3) r.push(['累積相對(%)', JUMP.crel, { c: RED, fs: 12.5 }]);
            return TBL(r, { x: 6, y: 10, lw: 88, cw: 48.5, rh: 34, fs: 13.5 });
          };
          const note = (t, col, k) => TX(220, 214, t, { anchor: 'middle', fs: 15, c: col, op: k });
          SV.stepper(h, '0 0 440 236', [
            { t: '先有次數', d: k => rows(0) + note('次數加起來 ＝ 40 人', INK, k) },
            { t: '累積次數：往右加', d: k => rows(1) + note('累積的最後一格 ＝ 40 ✓', AMB, k) },
            { t: '相對次數：除以 40', d: k => rows(2) + note('相對次數加起來 ＝ 100% ✓', VIO, k) },
            { t: '累積相對次數：相對往右加', d: k => rows(3) + note('累積相對的最後一格 ＝ 100% ✓', RED, k) }
          ], { acc: false });
        },
        caption: '四列都從第一列的次數算出來；用同一組數字，才看得出四個名字差在哪。',
        example: {
          q: '課本例 2 ③：立定跳遠未滿 \\(160\\) 公分的有幾人？占幾 %？',
          steps: ['讀 \\(140\\)～\\(160\\) 那一格的累積：\\(19\\)', '累積相對：\\(47.5\\%\\)'],
          ans: '\\(19\\) 人，\\(47.5\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '未滿、以上、區間：三種問法',
        points: [
          '<b>未滿 \\(X\\)</b>：直接讀到 \\(X\\) 為止的累積。',
          '<b>\\(X\\) 以上</b>：總數 − 未滿 \\(X\\)（% 就用 \\(100\\%\\) 去減）。',
          '<b>\\(A\\) 以上、未滿 \\(B\\)</b>：\\(B\\) 的累積 − \\(A\\) 的累積。'
        ],
        formula: { label: '由累積反求<span class="pgref">課本 印 205、206 例 3</span>', tex: '\\text{以上}=\\text{總數}-\\text{未滿}' },
        visual: (h) => {

          const B = [100, 120, 140, 160, 180, 200, 220, 240], CUM = [0, ...JUMP.cum];
          const Q = [
            { q: '未滿 140 公分有幾人？', g: [140], a: [], f: '讀到 140 為止的累積：13 人' },
            { q: '未滿 200 公分有幾人？', g: [200], a: [], f: '讀到 200 為止的累積：34 人' },
            { q: '220 公分以上有幾人？', g: [240], a: [220], f: '總數 − 未滿 220：40 − 38 ＝ 2 人' },
            { q: '160 以上、未滿 220 有幾人？', g: [220], a: [160], f: '38 − 19 ＝ 19 人（課本例 3）' },
            { q: '120 以上、未滿 160 有幾人？', g: [160], a: [120], f: '19 − 3 ＝ 16 人' }
          ];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>第 <span class="ival qv">1</span> 問 / ${Q.length}</label>
              <input type="range" class="qs" min="0" max="${Q.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.qs').value, it = Q[i];
            h.querySelector('.qv').textContent = i + 1;
            let s = TX(220, 36, it.q, { anchor: 'middle', fs: 20, c: INK });
            s += BOX(4, 62, 62, 36, { r: 0, fill: '#f3f6fb', stroke: LINE, sw: 1.4 }) + TX(35, 85, '未滿', { anchor: 'middle', fs: 13, c: INK });
            s += BOX(4, 98, 62, 36, { r: 0, fill: '#f3f6fb', stroke: LINE, sw: 1.4 }) + TX(35, 121, '累積', { anchor: 'middle', fs: 13, c: INK });
            B.forEach((b, j) => {
              const x = 66 + j * 46.5, g = it.g.includes(b), a = it.a.includes(b);
              const fill = g ? 'rgba(5,150,105,.18)' : a ? 'rgba(217,119,6,.20)' : '#fff';
              s += BOX(x, 62, 46.5, 36, { r: 0, fill, stroke: LINE, sw: 1.4 }) + TX(x + 23, 85, `${b}`, { anchor: 'middle', fs: 13, c: INK });
              s += BOX(x, 98, 46.5, 36, { r: 0, fill, stroke: LINE, sw: 1.4 }) + TX(x + 23, 122, `${CUM[j]}`, { anchor: 'middle', fs: 15, c: g ? GRN : a ? AMB : INK });
            });
            s += TX(220, 158, '累積那一列：每一格都是「到這個數為止」的人數', { anchor: 'middle', fs: 12.5, c: GREY });
            s += BOX(30, 176, 380, 48, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 });
            s += TX(220, 206, it.f, { anchor: 'middle', fs: 17, c: GRN });
            h.querySelector('.fig').innerHTML = svg('0 0 440 236', s);
          };
          h.querySelector('.qs').oninput = draw;
          draw();
        },
        caption: '先指出是哪一個點，說一句「這個點是什麼」，最後才寫算式。',
        example: {
          q: '未滿 \\(160\\) 公分的占幾 %？\\(160\\) 公分以上呢？',
          steps: ['未滿 \\(160\\)：\\(47.5\\%\\)', '以上：\\(100\\%-47.5\\%\\)'],
          ans: '\\(47.5\\%\\)；\\(52.5\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜累積次數與累積相對次數',
        points: [
          '「未滿 \\(180\\)」直接讀累積。',
          '「\\(200\\) 以上」用總數去減。',
          '人數、百分比各寫一次。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 205</span>', tex: '\\text{以上}=\\text{總數}-\\text{未滿}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 205', BLU, '承例 2 的立定跳遠（點開看表）',
              pText('印10', '① 未滿 \\(180\\) 公分幾人、占幾 %？② \\(200\\) 公分以上幾人、占幾 %？', '24 人、60%；6 人、15%')), '5-1');
        },
        caption: '② 有兩種算法：\\(40-34\\)，或把最後兩組 \\(4+2\\) 加起來——兩種都對，可以互相驗算。'
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '累積折線圖：點畫在上限，從 0 出發',
        points: [
          '累積是「到這一組<b>結束</b>為止」，所以點畫在每一組的<b>上限</b>（右端點）。',
          '起點：第一組的下限、縱坐標 \\(0\\)——\\((100,\\ 0)\\)，還沒開始累積。',
          '依序連到 \\((240,\\ 40)\\)；累積只會往上或持平，<b>不會往下</b>。'
        ],
        formula: { label: '累積次數分配折線圖<span class="pgref">課本 印 204、206 例 3</span>', tex: '(100,0)\\to(120,3)\\to\\cdots\\to(240,40)' },
        visual: (h) => {
          const B = [100, 120, 140, 160, 180, 200, 220, 240], CUM = [0, ...JUMP.cum];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>畫到第 <span class="ival kv">1</span> 個點</label>
              <input type="range" class="ks" min="0" max="7" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.ks').value;
            h.querySelector('.kv').textContent = k + 1;
            const P = PLOT({ px0: 64, px1: 404, py0: 236, py1: 40, xmin: 100, xmax: 240, xs: 20, ymin: 0, ymax: 40, ys: 10, xl: '距離（公分）', yl: '累積次數（人）' });
            let s = P.s;
            const pts = B.slice(0, k + 1).map((b, j) => [P.X(b), P.Y(CUM[j])]);
            if (pts.length > 1) s += line(pts, AMB);
            pts.forEach(([x, y], j) => { s += dot(x, y, j === k ? C : AMB, j === k ? 6.5 : 5); });
            const [x, y] = pts[k];
            const lab = k === 0 ? '(100, 0) 起點：還沒開始累積' : `(${B[k]}, ${CUM[k]})：未滿 ${B[k]} 有 ${CUM[k]} 人`;
            s += TX(Math.min(x + 10, 250), Math.max(y - 12, 56), lab, { fs: 13.5, c: C });
            if (k === 7) s += TX(234, 76, '最後一點 ＝ 總人數 40 ✓', { anchor: 'end', fs: 13.5, c: GRN });
            h.querySelector('.fig').innerHTML = svg('0 0 440 284', s);
          };
          h.querySelector('.ks').oninput = draw;
          draw();
        },
        caption: '跟相對次數折線圖比一比：那邊點在<b>組中點</b>，這邊點在<b>上限</b>，還多一個起點。',
        example: {
          q: '課本例 3 ②：\\(160\\)～\\(220\\) 公分有幾人？',
          steps: ['\\(220\\) 的累積 − \\(160\\) 的累積', '\\(38-19\\)'],
          ans: '\\(19\\) 人'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '縱軸換成 %：累積相對次數折線圖',
        points: [
          '點的位置一樣在上限，只是縱坐標換成<b>累積相對次數（%）</b>。',
          '起點 \\((100,\\ 0\\%)\\)，終點一定是 \\(100\\%\\)。',
          '\\((160,\\ 47.5\\%)\\) 讀作：未滿 \\(160\\) 公分的占 \\(47.5\\%\\)。'
        ],
        formula: { label: '累積相對次數分配折線圖<span class="pgref">課本 印 204、206</span>', tex: '(160,\\;47.5\\%)' },
        visual: (h) => {
          const B = [100, 120, 140, 160, 180, 200, 220, 240], CUM = [0, ...JUMP.cum], CR = [0, ...JUMP.crel];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>縱軸：<span class="ival uv">人數</span></label>
              <input type="range" class="us" min="0" max="1" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const pc = +h.querySelector('.us').value === 1;
            h.querySelector('.uv').textContent = pc ? '%' : '人數';
            const P = PLOT({ px0: 64, px1: 404, py0: 236, py1: 40, xmin: 100, xmax: 240, xs: 20, ymin: 0, ymax: 40, ys: 10,
              xl: '距離（公分）', yl: pc ? '累積相對次數（%）' : '累積次數（人）', yf: pc ? (v) => `${v * 2.5}` : String });
            let s = P.s;
            const pts = B.map((b, j) => [P.X(b), P.Y(CUM[j])]);
            s += line(pts, pc ? RED : AMB);
            pts.forEach(([x, y], j) => {
              s += dot(x, y, pc ? RED : AMB);
              if (j > 0) s += TX(x - 4, y - 10, pc ? `${CR[j]}` : `${CUM[j]}`, { anchor: 'end', fs: 12, c: pc ? RED : AMB });
            });
            s += TX(220, 292, pc ? '40 人 ＝ 100%：形狀一模一樣，只換刻度' : '拖到右邊，把縱軸換成 %', { anchor: 'middle', fs: 13.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 298', s);
          };
          h.querySelector('.us').oninput = draw;
          draw();
        },
        caption: '人數和 % 只差一個比例（\\(40\\) 人＝\\(100\\%\\)），所以兩張圖形狀一樣，只換縱軸的刻度。',
        example: {
          q: '\\((200,\\ 85\\%)\\) 是什麼意思？',
          steps: ['點在 \\(200\\)：到 \\(180\\)～\\(200\\) 這一組結束為止'],
          ans: '未滿 \\(200\\) 公分的占 \\(85\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜累積相對次數折線圖',
        points: [
          '點畫在上限、起點 \\((100,\\ 0)\\)。',
          '區間：\\(180\\) 的累積 − \\(140\\) 的累積。',
          '人數和 % 各算一次。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 206 例 3</span>', tex: '(100,0)\\to(120,7.5\\%)\\to\\cdots' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 206', BLU, '承例 3 的立定跳遠（點開看圖）',
              pText('印11', '完成累積相對次數折線圖；\\(140\\) 以上、未滿 \\(180\\) 公分有幾人、占幾 %？', '11 人、27.5%')), '5-1');
        },
        caption: '區間要用<b>兩個</b>累積相減：\\(24-13\\)，不是只讀一格。'
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '讀折點，也讀線段的陡',
        points: [
          '<b>折點</b>：\\((70,\\ 65\\%)\\) ＝ 未滿 \\(70\\) 分的占 \\(65\\%\\)。',
          '兩個相鄰折點相減，就是<b>那一組</b>：\\(65\\%-32\\%=33\\%\\)。',
          '線段<b>越陡</b>，那一組的人越多；平平的，那一組人很少。'
        ],
        formula: { label: '折點與線段<span class="pgref">課本 印 204、208 例 5</span>', tex: '65\\%-32\\%=33\\%' },
        visual: (h) => {
          const B = [40, 50, 60, 70, 80, 90, 100], CR = [0, ...S400.crel];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>看第 <span class="ival iv">1</span> 段</label>
              <input type="range" class="is" min="1" max="6" step="1" value="1">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.is').value || 1;
            h.querySelector('.iv').textContent = i;
            const P = PLOT({ px0: 64, px1: 404, py0: 206, py1: 30, xmin: 40, xmax: 100, xs: 10, ymin: 0, ymax: 100, ys: 20, xl: '成績（分）', yl: '累積相對次數（%）' });
            let s = P.s;
            const pts = B.map((b, j) => [P.X(b), P.Y(CR[j])]);
            s += line(pts, '#c9d2e0');
            s += line([pts[i - 1], pts[i]], C, 4.5);
            pts.forEach(([x, y], j) => { s += dot(x, y, j === i || j === i - 1 ? C : GREY, 4.5); });
            s += SV.seg(pts[i][0], pts[i - 1][1], pts[i][0], pts[i][1], AMB, 2, '4 3');
            const d = CR[i] - CR[i - 1];
            s += TX(220, 266, `${B[i - 1]}～${B[i]} 分：${CR[i]}% − ${CR[i - 1]}% ＝ ${d}%`, { anchor: 'middle', fs: 16, c: INK });
            s += TX(220, 290, d === 33 ? '最陡的一段 → 這一組的人最多' : d <= 7 ? '很平 → 這一組的人很少' : '往上爬多少，這一組就占多少', { anchor: 'middle', fs: 14.5, c: d === 33 ? C : GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 300', s);
          };
          h.querySelector('.is').oninput = draw;
          draw();
        },
        caption: '「線段陡」說的是<b>那一段</b>增加得多；累積最多的永遠是最後一點。',
        example: {
          q: '\\((80,\\ 90\\%)\\) 表示什麼？\\(80\\) 分以上占幾 %？',
          steps: ['未滿 \\(80\\) 分占 \\(90\\%\\)', '\\(100\\%-90\\%\\)'],
          ans: '\\(10\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜折線圖的判讀',
        points: [
          '先看縱軸：是<b>人數</b>還是 <b>%</b>。',
          '印 207 的圖是人數，可以直接比。',
          '印 208 的圖是 %：要比人數，得乘上各校的總人數。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 207 例 4、印 208 例 5</span>', tex: '\\text{人數}=\\text{總數}\\times\\text{百分比}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 207、208', BLU, '點開題目看圖',
              pText('印12', 'BMI 累積次數折線圖（男、女各 \\(40\\) 人）：未滿 \\(18\\) 哪邊多？未滿 \\(21\\) 相差幾人？', '女生；15 人') +
              pText('印13', '兩校唸書時數累積相對次數折線圖：\\(6\\)～\\(12\\) 小時各占幾 %？\\(14\\) 小時以上哪一校人多？', '都是 60%；一樣多')), '5-1');
        },
        caption: '印 208 甲校 \\(600\\) 人、乙校 \\(1200\\) 人：只看 % 會判錯——下一頁就是這個陷阱。'
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '% 的圖，看不出人數',
        points: [
          '課本迷思：男生的累積相對次數折線都在女生上面，所以男生人數比較多？',
          '<b>不一定</b>：% 只說「占自己的全體幾成」，不知道各自有幾人。',
          '要比人數，得知道總數：\\(600\\times10\\%=60\\)、\\(1200\\times5\\%=60\\)。'
        ],
        formula: { label: '迷思診療<span class="pgref">課本 印 209</span>', tex: '600\\times10\\%=1200\\times5\\%=60' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 240', [
            {
              t: '只看 %：甲校 10%、乙校 5%', d: k =>
                TX(50, 82, '甲校', { anchor: 'middle', fs: 16, c: INK }) + TX(50, 162, '乙校', { anchor: 'middle', fs: 16, c: INK }) +
                TX(110, 82, '10%', { fs: 26, c: BLU }) + TX(110, 162, '5%', { fs: 26, c: AMB }) +
                TX(220, 30, '甲校的人比較多？', { anchor: 'middle', fs: 17, c: RED, op: k })
            },
            {
              t: '可是兩校的總人數不一樣', d: k =>
                `<rect x="190" y="56" width="120" height="36" fill="none" stroke="${BLU}" stroke-width="2" opacity="${k}"/>` +
                `<rect x="190" y="136" width="240" height="36" fill="none" stroke="${AMB}" stroke-width="2" opacity="${k}"/>` +
                TX(302, 79, '全校 600 人', { anchor: 'end', fs: 13, c: GREY, op: k }) +
                TX(422, 159, '全校 1200 人', { anchor: 'end', fs: 13, c: GREY, op: k })
            },
            {
              t: '換回人數：一樣多', d: k =>
                `<rect x="190" y="56" width="12" height="36" fill="${BLU}" opacity="${.85 * k}"/>` +
                `<rect x="190" y="136" width="12" height="36" fill="${AMB}" opacity="${.85 * k}"/>` +
                TX(190, 114, '600 × 10% ＝ 60 人', { fs: 14.5, c: BLU, op: k }) +
                TX(190, 194, '1200 × 5% ＝ 60 人', { fs: 14.5, c: AMB, op: k }) +
                TX(220, 228, '% 不一樣，人數卻一樣', { anchor: 'middle', fs: 17, c: C, op: k })
            }
          ]);
        },
        caption: '看到 % 的圖，先問自己：<b>總數一樣嗎？</b>不一樣就不能直接比人數。',
        example: {
          q: '小新說：「男生的累積相對次數折線在上面，男生人數比較多。」對嗎？',
          steps: ['累積相對次數只有 %，看不出各自有幾人'],
          ans: '不一定'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>把累積當這一組、以上的方向、點畫錯位置</b>。',
          '第一個最常見：先說「到這一格為止」，再讀數字。',
          '每張表、每張圖做完都對一次：最後一格＝總數或 \\(100\\%\\)。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 210 重點整理</span>', tex: '\\text{次數是這一格，累積是到這一格為止}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '把累積當成這一組', bad: '\\(50\\)～\\(60\\) 的累積 \\(11\\)<br>「這一組有 \\(11\\) 人」', good: '「未滿 \\(60\\) 分共 \\(11\\) 人」<br>這一組 ＝ \\(11-\\)前一格' },
            { tag: '「以上」直接讀', bad: '全班 \\(30\\) 人<br>\\(60\\) 分以上：\\(11\\) 人', good: '總數 − 未滿 \\(60\\)：<br>\\(30-11=19\\) 人' },
            { tag: '累積圖點在組中點', bad: '累積折線畫在 \\(45,\\ 55,\\ \\dots\\)', good: '畫在上限 \\(50,\\ 60,\\ \\dots\\)，<br>從 \\((40,\\ 0)\\) 出發' }
          ]);
          MJ(h);
        },
        caption: '四種折線圖的點：<b>次數、相對次數 → 組中點；累積、累積相對 → 上限</b>，再加一個起點。',
        example: {
          q: '下課前一分鐘：全班 \\(40\\) 人，未滿 \\(60\\) 分 \\(10\\) 人，\\(60\\) 分以上占幾 %？',
          steps: ['以上 ＝ \\(40-10=30\\) 人', '\\(\\frac{30}{40}\\times100\\%\\)'],
          ans: '\\(75\\%\\)'
        }
      },

      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜習作（基礎 1、2）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '基礎 1：相對次數 ＝ 次數 ÷ \\(80\\) × \\(100\\%\\)；缺的次數用總數倒扣。',
          '基礎 2：先畫相對次數折線圖（點在組中點），再回答。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 199–202</span>', tex: '\\dfrac{14}{80}\\times100\\%=17.5\\%' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 65、66', AMB, '點開題目看表',
              pText('基礎1', '\\(80\\) 位顧客年齡的相對次數分配表：完成表格，哪一組最多？', '40～50 歲') +
              pText('基礎2', '運動時間的相對次數表：畫折線圖；\\(8\\)～\\(10\\) 小時占幾 %？\\(300\\) 人中少於 \\(6\\) 小時幾人？', '18%；114 人')), '5-1');
        },
        caption: '基礎 2 的人數：先把「少於 \\(6\\) 小時」那幾組的 % 加起來，再乘 \\(300\\)。'
      },
      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜習作（基礎 3、4）',
        points: [
          '基礎 3 是<b>四種數合一</b>的表：次數、累積、相對、累積相對一起完成。',
          '基礎 4：讀累積次數折線圖——未滿直接讀、以上用 \\(100\\) 去減。',
          '區間：兩個累積相減。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 205、206</span>', tex: '\\text{區間}=B\\text{ 的累積}-A\\text{ 的累積}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 66、67', AMB, '點開題目看表與圖',
              pText('基礎3', '\\(50\\) 人英文聽力：完成次數、累積次數、相對次數、累積相對次數四列表。', '填表') +
              pText('基礎4', '薪資累積次數折線圖（\\(100\\) 人）：低於 \\(3\\) 萬、\\(5\\) 萬以上、\\(4\\)～\\(5\\) 萬各幾人？', '16、28、31 人')), '5-1');
        },
        caption: '基礎 3 是整節的樞紐題，一題就練到四種數——做完用三個自檢對一次。'
      },
      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '練習｜習作（基礎 5、6、精熟）',
        points: [
          '基礎 5：累積次數折線圖，「不到一分鐘」就是未滿 \\(60\\) 秒。',
          '基礎 6：累積相對次數折線圖，答案是 %。',
          '精熟 1 是兩班的圖疊在一起，行有餘力再做。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 206–208</span>', tex: '\\text{以上}=100\\%-\\text{未滿}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 68', AMB, '點開題目看圖',
              pText('基礎5', '閉氣秒數累積次數折線圖（\\(40\\) 人）：不到一分鐘、\\(80\\) 秒以上、\\(50\\)～\\(70\\) 秒各幾人？', '12、7、19 人') +
              pText('基礎6', '跳遠累積相對次數折線圖：未滿 \\(140\\)、\\(180\\) 以上各占幾 %？哪一組最多？', '11%、17%；160～170')) +
            pCard('習作・行有餘力', '印 69', GRN, '點開題目看圖',
              pText('精熟1', '甲、乙兩班到校時間的累積次數折線圖：比較兩班到校的早晚。', '甲、乙、甲')), '5-1');
        },
        caption: '基礎 6「哪一組最多」：找<b>最陡</b>的那一段，兩個折點相減。'
      },
      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '對答案｜習作 ①（基礎 1～4）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '表格題（基礎 1、2、3 的表）回前面練習頁<b>點題號</b>，詳解最後有完成的表。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '5-1', [
            { label: '基礎 1、2（印 65、66）', cols: 3, items: [['1', '基礎1 ②'], ['2 ②', '基礎2 ②'], ['2 ③', '基礎2 ③']] },
            { label: '基礎 4（印 67）', cols: 3, items: [['4 ①', '基礎4 ①'], ['4 ②', '基礎4 ②'], ['4 ③', '基礎4 ③']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {
        sec: '5-1', secName: '相對與累積次數分配圖表',
        title: '對答案｜習作 ②（基礎 5、6、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '表格題（基礎 1、2、3 的表）回前面練習頁<b>點題號</b>，詳解最後有完成的表。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '5-1', [
            { label: '基礎 5、6（印 68）', cols: 3, items: [['5 ①', '基礎5 ①'], ['5 ②', '基礎5 ②'], ['5 ③', '基礎5 ③'], ['6 ①', '基礎6 ①'], ['6 ②', '基礎6 ②']] },
            { label: '精熟（印 69）', cols: 3, items: [['精 ①', '精熟1 ①'], ['精 ②', '精熟1 ②'], ['精 ③', '精熟1 ③']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      }
    ]
  });
})();
