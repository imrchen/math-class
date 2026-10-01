window.DECK = window.DECK || [];
(function () {
  const C = '#d97706';

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

  const N = (v) => (v < 0 ? '−' + (-v) : '' + v);

  const FR = (cx, y, num, den, o = {}) => {
    const fs = o.fs || 18, c = o.c || INK, op = o.op === undefined ? 1 : o.op;
    const w = o.w || Math.max(String(num).length, String(den).length) * fs * 0.62;
    return TX(cx, y - 6, num, { anchor: 'middle', fs, c, op }) +
      `<line x1="${cx - w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y}" stroke="${c}" stroke-width="1.8" opacity="${op}"/>` +
      TX(cx, y + fs + 1, den, { anchor: 'middle', fs, c, op });
  };

  const mapCards = (rows) => svg('0 0 440 250', rows.map(([n, q, a, col], i) => {
    const y = 6 + i * 82;
    return BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
      `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
      TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
      TX(80, y + 28, q, { fs: 15.5, c: INK }) +
      TX(80, y + 52, a, { fs: 14, c: GREY });
  }).join(''));

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

  const abcView = (h, list, o = {}) => {
    h.innerHTML = `<div style="width:100%"><div class="fig"></div>
      <div class="ictrl">
        <label>第 <span class="ival av">1</span> 題 / ${list.length}</label>
        <input type="range" class="as" min="0" max="${list.length - 1}" step="1" value="0">
      </div></div>`;
    const draw = () => {
      const i = +h.querySelector('.as').value, it = list[i];
      h.querySelector('.av').textContent = i + 1;
      let s = TX(220, 38, it.e, { anchor: 'middle', fs: 21, c: INK });
      s += TX(220, 66, it.z ? '先移項整理，右邊只留 0 ↓' : '右邊已經是 0 ✓', { anchor: 'middle', fs: 13, c: it.z ? AMB : GRN });
      s += TX(220, 98, it.z || it.e, { anchor: 'middle', fs: 21, c: BLU });
      const cells = [['a', it.a, VIO], ['b', it.b, BLU], ['c', it.c, AMB]];
      if (o.negB) cells.push(['−b', -it.b, GRN]);
      const w = o.negB ? 92 : 112, gap = o.negB ? 12 : 17;
      const x0 = 220 - (cells.length * w + (cells.length - 1) * gap) / 2;
      cells.forEach(([nm, v, col], j) => {
        const x = x0 + j * (w + gap);
        s += BOX(x, 124, w, 80, { r: 12, fill: '#fff', stroke: col, sw: 2 });
        s += TX(x + w / 2, 148, `${nm} ＝`, { anchor: 'middle', fs: 15, c: GREY });
        s += TX(x + w / 2, 188, N(v), { anchor: 'middle', fs: 28, c: col });
      });
      s += TX(220, 238, o.note || '少了哪一項，那一個就是 0；負號要跟著抄', { anchor: 'middle', fs: 14, c: GREY });
      h.querySelector('.fig').innerHTML = svg('0 0 440 252', s);
    };
    h.querySelector('.as').oninput = draw;
    draw();
  };

  window.DECK.push({
    ch: 4,
    title: '一元二次方程式',
    color: C,
    sections: ['4-1 因式分解法解一元二次方程式', '4-2 配方法與一元二次方程式的公式解', '4-3 一元二次方程式的應用'],
    slides: [

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：只有一個未知數 \\(x\\)、最高是 \\(x^2\\) 的<span class="k">方程式</span>。',
          '<b>解是什麼</b>：代進去能讓等號成立的數，叫做<span class="k">解</span>（也叫根）。',
          '<b>怎麼解</b>：拆成兩個括號相乘等於 \\(0\\)，再讓其中一個括號等於 \\(0\\)。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 156–167</span>', tex: 'x^2+5x-14=0\\;\\Rightarrow\\;(x-2)(x+7)=0' },
        visual: (h) => {
          h.innerHTML = mapCards([
            ['1', '什麼是一元二次方程式？', '一個未知數、最高次數是 2、有等號', VIO],
            ['2', '什麼叫做解？', '代進去，等號兩邊一樣大', BLU],
            ['3', '怎麼解？', '拆成兩個括號相乘＝0，一個一個讓它等於 0', GRN]
          ]);
        },
        caption: '第 3 章把式子拆成兩個括號就結束了；這一章<b>拆完還要再走一步</b>。',
        example: {
          q: '課本溫故啟思：\\(x+5=0\\)，\\(x=\\)？',
          steps: ['兩邊同減 \\(5\\)'],
          ans: '\\(x=-5\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '解：代進去，等號兩邊一樣大',
        points: [
          '一次方程式 \\(3x+1=7\\)：\\(x=2\\) 代進去，左邊算出 \\(7\\)，和右邊一樣。',
          '所以 \\(x=2\\) 是<span class="k">解</span>——解就是「代進去會成立的數」。',
          '二次方程式也是同一句話，只是解常常<b>不只一個</b>。'
        ],
        formula: { label: '解的意思<span class="pgref">課本 印 156、157</span>', tex: '\\text{代入後　左邊}=\\text{右邊}\\;\\Rightarrow\\;\\text{是解}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>代入 x ＝ <span class="ival xv">0</span></label>
              <input type="range" class="xs" min="0" max="4" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.xs').value, v = 3 * k + 1, ok = v === 7;
            h.querySelector('.xv').textContent = k;
            let s = TX(220, 38, '3x ＋ 1 ＝ 7', { anchor: 'middle', fs: 24, c: INK });
            s += BOX(30, 62, 170, 104, { r: 14, fill: '#fff', stroke: BLU, sw: 2 });
            s += TX(115, 88, '左邊', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(115, 120, `3 × ${k} ＋ 1`, { anchor: 'middle', fs: 19, c: INK });
            s += TX(115, 152, `＝ ${v}`, { anchor: 'middle', fs: 22, c: BLU });
            s += BOX(240, 62, 170, 104, { r: 14, fill: '#fff', stroke: AMB, sw: 2 });
            s += TX(325, 88, '右邊', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(325, 136, '7', { anchor: 'middle', fs: 26, c: AMB });
            s += TX(220, 124, ok ? '＝' : '≠', { anchor: 'middle', fs: 30, c: ok ? GRN : RED });
            s += BOX(60, 184, 320, 44, { r: 12, fill: ok ? 'rgba(5,150,105,.10)' : '#fdeef2', stroke: ok ? GRN : RED, sw: 2 });
            s += TX(220, 212, ok ? `成立：x ＝ ${k} 是解` : `不成立：x ＝ ${k} 不是解`, { anchor: 'middle', fs: 17, c: ok ? GRN : RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 240', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '左邊、右邊<b>分開算</b>，最後才比——這個習慣檢驗二次方程式的解時還要用。',
        example: {
          q: '\\(x=3\\) 是 \\(2x-1=5\\) 的解嗎？',
          steps: ['左邊：\\(2\\times3-1=5\\)', '右邊：\\(5\\)，一樣大'],
          ans: '是'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '一元、二次、方程式：三格都打勾才算',
        points: [
          '<b>一元</b>：只有一種未知數；<b>二次</b>：整理後最高是 \\(x^2\\)；<b>方程式</b>：有等號。',
          '能整理成 \\(ax^2+bx+c=0\\)、而且 \\(a\\neq0\\)，就是<span class="k">一元二次方程式</span>。',
          '⚠ 先<b>乘開、移項</b>再判斷：\\(x^2\\) 可能抵消，括號裡也可能藏著 \\(x^2\\)。'
        ],
        formula: { label: '一元二次方程式<span class="pgref">課本 印 156</span>', tex: 'ax^2+bx+c=0\\;(a\\neq0)' },
        visual: (h) => {

          const L = [
            { e: '−3x² ＋ 4 ＝ 2x', z: '整理：−3x² − 2x ＋ 4 ＝ 0', ok: [1, 1, 1], why: ['只有 x', '最高是 x²', '有等號'] },
            { e: 'x² ＝ 6', z: '整理：x² − 6 ＝ 0', ok: [1, 1, 1], why: ['只有 x', '最高是 x²', '有等號'] },
            { e: '3x − 4 ＝ 0', z: '', ok: [1, 0, 1], why: ['只有 x', '最高只有 x', '有等號'] },
            { e: '2x ＋ y² ＝ 3', z: '', ok: [0, null, 1], why: ['有 x 和 y', '—', '有等號'] },
            { e: 'x² ＋ 3x ＋ 2', z: '', ok: [1, 1, 0], why: ['只有 x', '最高是 x²', '沒有等號'] },
            { e: '(x ＋ 1)(x ＋ 2) ＝ 0', z: '乘開：x² ＋ 3x ＋ 2 ＝ 0', ok: [1, 1, 1], why: ['只有 x', '乘開才看到 x²', '有等號'] },
            { e: 'x² ＋ 2x ＝ x² − 5', z: '移項：2x ＋ 5 ＝ 0（x² 抵消了）', ok: [1, 0, 1], why: ['只有 x', 'x² 消掉了', '有等號'] }
          ];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>第 <span class="ival ev">1</span> 個 / ${L.length}</label>
              <input type="range" class="es" min="0" max="${L.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.es').value, it = L[i];
            h.querySelector('.ev').textContent = i + 1;
            let s = TX(220, 40, it.e, { anchor: 'middle', fs: 22, c: INK });
            if (it.z) s += TX(220, 70, it.z, { anchor: 'middle', fs: 14.5, c: BLU });
            ['一元', '二次', '方程式'].forEach((nm, j) => {
              const x = 24 + j * 140, v = it.ok[j];
              const col = v === 1 ? GRN : v === 0 ? RED : GREY;
              s += BOX(x, 88, 112, 76, { r: 12, fill: '#fff', stroke: col, sw: 2 });
              s += TX(x + 56, 112, nm, { anchor: 'middle', fs: 15, c: INK });
              s += TX(x + 56, 150, v === 1 ? '✓' : v === 0 ? '✗' : '－', { anchor: 'middle', fs: 28, c: col });
              s += TX(x + 56, 184, it.why[j], { anchor: 'middle', fs: 12.5, c: GREY });
            });
            const yes = it.ok.every(v => v === 1);
            s += BOX(60, 200, 320, 42, { r: 12, fill: yes ? 'rgba(5,150,105,.10)' : '#fdeef2', stroke: yes ? GRN : RED, sw: 2 });
            s += TX(220, 227, yes ? '三格都過：是一元二次方程式' : '少一格：不是一元二次方程式', { anchor: 'middle', fs: 16, c: yes ? GRN : RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 252', s);
          };
          h.querySelector('.es').oninput = draw;
          draw();
        },
        caption: '最後一個最容易看走眼：兩邊的 \\(x^2\\) 一移項就抵消，只剩一次。',
        example: {
          q: '\\(x(x+6)=55\\) 是一元二次方程式嗎？',
          steps: ['乘開：\\(x^2+6x=55\\)', '移項：\\(x^2+6x-55=0\\)，最高是 \\(x^2\\)'],
          ans: '是'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '先整理成「＝0」，再讀 a、b、c',
        points: [
          '把所有項搬到左邊，右邊只留 \\(0\\)，照 \\(x^2\\)、\\(x\\)、數字排好。',
          '\\(x^2\\) 前面的數是 \\(a\\)、\\(x\\) 前面的是 \\(b\\)、單獨的數是 \\(c\\)——<b>連負號一起抄</b>。',
          '少了哪一項，那一個就是 \\(0\\)：\\(2x^2-10x=0\\) 的 \\(c=0\\)。'
        ],
        formula: { label: 'a、b、c 是誰<span class="pgref">課本 印 156</span>', tex: 'x^2+6x-55=0' },
        visual: (h) => abcView(h, [
          { e: 'x² ＋ 6x ＝ 55', z: 'x² ＋ 6x − 55 ＝ 0', a: 1, b: 6, c: -55 },
          { e: '−3x² ＋ 4 ＝ 2x', z: '−3x² − 2x ＋ 4 ＝ 0', a: -3, b: -2, c: 4 },
          { e: 'x² ＝ 6', z: 'x² − 6 ＝ 0', a: 1, b: 0, c: -6 },
          { e: '2x² − 10x ＝ 0', z: null, a: 2, b: -10, c: 0 },
          { e: '5x² ＝ 7 − x', z: '5x² ＋ x − 7 ＝ 0', a: 5, b: 1, c: -7 }
        ]),
        caption: '4-2 的公式解，第一步就是抄 \\(a\\)、\\(b\\)、\\(c\\)——現在先練熟。',
        example: {
          q: '\\(3x^2=5x\\) 的 \\(a\\)、\\(b\\)、\\(c\\)？',
          steps: ['移項：\\(3x^2-5x=0\\)', '沒有常數項'],
          ans: '\\(a=3,\\ b=-5,\\ c=0\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜是不是一元二次方程式',
        points: [
          '先乘開、移項，再看三格。',
          '\\(3^2\\) 是數字 \\(9\\)，不是 \\(x^2\\)。',
          '兩邊都有 \\(x^2\\) 時，移過去看看會不會抵消。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 156</span>', tex: 'ax^2+bx+c=0\\;(a\\neq0)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 156', BLU, '是一元二次方程式打 ○，不是打 ✕',
              pItem('印3 ①', 'x-3^2=0') +
              pItem('印3 ②', 'x+5y=10') +
              pItem('印3 ③', 'x^2-3x=-2x-x^2') +
              pItem('印3 ④', '2x^2+3x-4=0')), '4-1');
        },
        caption: '第 ③ 題兩邊都有 \\(x^2\\)，但移過去是<b>相加</b>，不會抵消。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '從情境列式：課本開頭的巴比倫田地',
        points: [
          '長方形田地面積 \\(55\\)，長邊比短邊多 \\(6\\)。',
          '設短邊 \\(x\\)，長邊就是 \\(x+6\\)；面積＝長×寬：\\(x(x+6)=55\\)。',
          '列出來就是一元二次方程式；<b>怎麼解，後面再學</b>。'
        ],
        formula: { label: '從情境列方程式<span class="pgref">課本 印 156</span>', tex: 'x(x+6)=55' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>短邊 x ＝ <span class="ival xv">3</span></label>
              <input type="range" class="xs" min="1" max="8" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.xs').value, u = 22, A = k * (k + 6), ok = A === 55;
            h.querySelector('.xv').textContent = k;
            const w = (k + 6) * u, hh = k * u, x0 = 220 - w / 2, y0 = 34;
            let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="${ok ? GRN : AMB}" opacity=".16" stroke="${ok ? GRN : AMB}" stroke-width="2.2"/>`;
            s += TX(220, y0 - 8, `長邊 x ＋ 6 ＝ ${k + 6}`, { anchor: 'middle', fs: 14, c: AMB });
            s += TX(x0 - 8, y0 + hh / 2 + 5, `x ＝ ${k}`, { anchor: 'end', fs: 14, c: BLU });
            s += TX(220, 236, `面積 ＝ x(x ＋ 6) ＝ ${k} × ${k + 6} ＝ ${A}`, { anchor: 'middle', fs: 18, c: INK });
            s += TX(220, 266, ok ? '剛好 55！' : A < 55 ? '比 55 小' : '比 55 大', { anchor: 'middle', fs: 17, c: ok ? GRN : GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '拉到 \\(x=5\\) 時面積剛好 \\(55\\)。用試的找得到，但這一節要學<b>不靠猜</b>的方法。',
        example: {
          q: '兩個連續整數相乘是 \\(20\\)，設小的是 \\(x\\)，列出方程式。',
          steps: ['大的是 \\(x+1\\)', '相乘：\\(x(x+1)=20\\)'],
          ans: '\\(x(x+1)=20\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '代入時先平方，再乘前面的數',
        points: [
          '\\(3x^2\\) 的意思是 \\(3\\times x\\times x\\)，平方只管 \\(x\\)。',
          '\\(x=2\\)：\\(3x^2=3\\times2\\times2=12\\)，<b>不是</b> \\((3\\times2)^2=36\\)。',
          '負數代進去要加括號：\\(x=-1\\) 時 \\(x^2=(-1)^2=1\\)。'
        ],
        formula: { label: '代入求值<span class="pgref">課本 印 157</span>', tex: '3x^2=3\\times x\\times x' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '先乘再平方', bad: '\\(x=2\\)：\\(3x^2=(3\\times2)^2=36\\)', good: '\\(3x^2=3\\times2\\times2=12\\)' },
            { tag: '負號被平方吃掉', bad: '\\(x=3\\)：\\(-x^2=(-3)^2=9\\)', good: '\\(-x^2=-(3\\times3)=-9\\)' },
            { tag: '負數沒加括號', bad: '\\(x=-1\\)：\\(x^2-5x\\)<br>算成 \\(-1-5=-6\\)', good: '\\((-1)^2-5\\times(-1)\\)<br>\\(=1+5=6\\)' }
          ]);
          MJ(h);
        },
        caption: '官方特別點名第一種錯：\\(36\\) 和 \\(12\\) 差很多，代錯了，是不是解就整個判反。',
        example: {
          q: '\\(x=-2\\) 時，\\(2x^2\\) 是多少？',
          steps: ['\\(2\\times(-2)\\times(-2)\\)'],
          ans: '\\(8\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '檢驗解：左邊、右邊分開算',
        points: [
          '把數代進去，<b>左邊算一欄、右邊算一欄</b>，最後才畫等號或打叉。',
          '\\(x^2-5x+4=0\\)：\\(x=1\\) 和 \\(x=4\\) 都讓左邊變 \\(0\\)，兩個都是解。',
          '一個一個代雖然找得到，但<b>太慢</b>，還可能漏掉。'
        ],
        formula: { label: '檢驗解<span class="pgref">課本 印 157</span>', tex: 'x^2-5x+4=0' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>代入 x ＝ <span class="ival xv">0</span></label>
              <input type="range" class="xs" min="0" max="5" step="1" value="0">
            </div></div>`;
          const f = (t) => t * t - 5 * t + 4;
          const draw = () => {
            const k = +h.querySelector('.xs').value, v = f(k), ok = v === 0;
            h.querySelector('.xv').textContent = k;
            let s = TX(220, 34, 'x² − 5x ＋ 4 ＝ 0', { anchor: 'middle', fs: 22, c: INK });
            s += BOX(24, 52, 210, 104, { r: 14, fill: '#fff', stroke: BLU, sw: 2 });
            s += TX(129, 76, '左邊', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(129, 108, `${k}² − 5 × ${k} ＋ 4`, { anchor: 'middle', fs: 17, c: INK });
            s += TX(129, 140, `＝ ${N(v)}`, { anchor: 'middle', fs: 21, c: BLU });
            s += BOX(272, 52, 144, 104, { r: 14, fill: '#fff', stroke: AMB, sw: 2 });
            s += TX(344, 76, '右邊', { anchor: 'middle', fs: 15, c: GREY });
            s += TX(344, 124, '0', { anchor: 'middle', fs: 26, c: AMB });
            s += TX(253, 114, ok ? '＝' : '≠', { anchor: 'middle', fs: 28, c: ok ? GRN : RED });
            s += TX(220, 186, ok ? `成立：x ＝ ${k} 是解` : `不成立：x ＝ ${k} 不是解`, { anchor: 'middle', fs: 17, c: ok ? GRN : RED });
            s += TX(24, 232, '試過的：', { fs: 14, c: GREY });
            for (let t = 0; t <= k; t++) {
              const good = f(t) === 0, cx = 110 + t * 56;
              s += `<circle cx="${cx}" cy="227" r="15" fill="${good ? GRN : '#eef1f6'}" opacity="${good ? .9 : 1}"/>`;
              s += TX(cx, 233, `${t}`, { anchor: 'middle', fs: 15, c: good ? '#fff' : GREY });
            }
            h.querySelector('.fig').innerHTML = svg('0 0 440 256', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '課本的隨堂還藏了一個 \\(x=\\frac12\\)——用整數一個一個試，永遠試不到它。',
        example: {
          q: '\\(x=2\\) 是 \\(x^2-5x+6=0\\) 的解嗎？',
          steps: ['左邊：\\(4-10+6=0\\)', '右邊：\\(0\\)，一樣'],
          ans: '是'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜哪些是解',
        points: [
          '左右兩欄分開算。',
          '\\(2x^2\\) 是 \\(2\\times x\\times x\\)：先平方，再乘 \\(2\\)。',
          '分數也照樣代：\\(\\left(\\frac12\\right)^2=\\frac14\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 157</span>', tex: '2x^2-5x+2=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 157', BLU, '下列各數，哪些是 \\(2x^2-5x+2=0\\) 的解？',
              pText('印4', '\\(x=0\\)、\\(x=1\\)、\\(x=2\\)、\\(x=\\frac12\\)，逐一代入檢驗。', '\\(x=2\\)、\\(x=\\frac12\\)')), '4-1');
        },
        caption: '\\(x=\\frac12\\) 那一格最容易算錯：\\(2\\times\\frac14=\\frac12\\)，再減 \\(\\frac52\\)、加 \\(2\\)。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '相乘等於 0：至少有一個是 0',
        points: [
          '兩個數相乘是 \\(0\\)，<b>至少有一個是 \\(0\\)</b>。',
          '\\((x-1)(x-2)=0\\)：不是 \\(x-1=0\\)，就是 \\(x-2=0\\)。',
          '所以 \\(x=1\\) 或 \\(x=2\\)——拆成<b>兩個一次方程式</b>就解完了。'
        ],
        formula: { label: '相乘是 0<span class="pgref">課本 印 158</span>', tex: 'A\\times B=0\\;\\Rightarrow\\;A=0\\;\\text{或}\\;B=0' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>x ＝ <span class="ival xv">−1</span></label>
              <input type="range" class="xs" min="-1" max="4" step="1" value="-1">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.xs').value, A = k - 1, B = k - 2, P = A * B;
            h.querySelector('.xv').textContent = N(k);
            let s = TX(220, 34, '(x − 1)(x − 2) ＝ 0', { anchor: 'middle', fs: 22, c: INK });
            const cell = (x, nm, v, hi) =>
              BOX(x, 56, 110, 76, { r: 12, fill: hi ? 'rgba(5,150,105,.12)' : '#fff', stroke: hi ? GRN : LINE, sw: 2 }) +
              TX(x + 55, 78, nm, { anchor: 'middle', fs: 14, c: GREY }) +
              TX(x + 55, 116, N(v), { anchor: 'middle', fs: 24, c: hi ? GRN : INK });
            s += cell(24, 'x − 1', A, A === 0) + TX(150, 102, '×', { anchor: 'middle', fs: 24, c: GREY });
            s += cell(166, 'x − 2', B, B === 0) + TX(292, 102, '＝', { anchor: 'middle', fs: 24, c: GREY });
            s += cell(306, '相乘', P, P === 0);
            s += TX(220, 168, P === 0 ? `相乘是 0，因為 ${A === 0 ? 'x − 1' : 'x − 2'} 是 0` : '兩個都不是 0，相乘就不是 0',
              { anchor: 'middle', fs: 16, c: P === 0 ? GRN : RED });
            s += TX(24, 222, '試過的：', { fs: 14, c: GREY });
            for (let t = -1; t <= k; t++) {
              const good = (t - 1) * (t - 2) === 0, cx = 120 + (t + 1) * 52;
              s += `<circle cx="${cx}" cy="217" r="15" fill="${good ? GRN : '#eef1f6'}"/>`;
              s += TX(cx, 223, N(t), { anchor: 'middle', fs: 14, c: good ? '#fff' : GREY });
            }
            h.querySelector('.fig').innerHTML = svg('0 0 440 246', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '\\(3\\times0\\)、\\(0\\times5\\)、\\(0\\times0\\) 都是 \\(0\\)；兩個都不是 \\(0\\)，乘出來就不會是 \\(0\\)。',
        example: {
          q: '\\((x-3)(x+6)=0\\)',
          steps: ['\\(x-3=0\\) 或 \\(x+6=0\\)'],
          ans: '\\(x=3\\) 或 \\(x=-6\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜相乘等於 0',
        points: [
          '每一個括號各自等於 \\(0\\)。',
          '單獨一個 \\(x\\) 也是一塊：\\(x=0\\) 也是解。',
          '寫完代回去檢查一次。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 158</span>', tex: 'A\\times B=0\\;\\Rightarrow\\;A=0\\;\\text{或}\\;B=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 158', BLU, '解下列各一元二次方程式',
              pItem('印5 ①', 'x(x-3)=0') +
              pItem('印5 ②', '(x+5)(x-4)=0')), '4-1');
        },
        caption: '第 ① 題最常漏掉 \\(x=0\\)——前面那個 \\(x\\) 自己就是一塊。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '相乘是 6，不能說各自是 6',
        points: [
          '只有「相乘是 \\(0\\)」才能拆成兩句；\\(2\\times3\\)、\\(1\\times6\\)、\\((-2)\\times(-3)\\) 都是 \\(6\\)。',
          '右邊不是 \\(0\\)：先<b>乘開、移項</b>，讓右邊變成 \\(0\\)，再分解。',
          '不確定時就<b>代回去</b>：\\(x=7\\) 代入 \\((x-1)(x-2)\\) 得 \\(30\\)，不是 \\(6\\)。'
        ],
        formula: { label: '先讓右邊變成 0<span class="pgref">課本 印 163 例 5</span>', tex: '(x-1)(x-2)=6\\;\\Rightarrow\\;x^2-3x-4=0' },
        visual: (h) => {

          SV.stepper(h, '0 0 440 250', [
            {
              t: '✗ 錯的想法：兩個括號各自等於 6', d: k =>
                TX(116, 28, '✗ 各自等於 6？', { anchor: 'middle', fs: 16, c: RED }) +
                TX(116, 64, 'x − 1 ＝ 6 → x ＝ 7', { anchor: 'middle', fs: 15.5, c: RED, op: k }) +
                TX(116, 94, 'x − 2 ＝ 6 → x ＝ 8', { anchor: 'middle', fs: 15.5, c: RED, op: k })
            },
            {
              t: '代回去檢查：兩個都不成立', d: k =>
                TX(116, 140, 'x ＝ 7：6 × 5 ＝ 30', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(116, 164, '≠ 6　✗', { anchor: 'middle', fs: 15, c: RED, op: k }) +
                TX(116, 202, 'x ＝ 8：7 × 6 ＝ 42', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(116, 226, '≠ 6　✗', { anchor: 'middle', fs: 15, c: RED, op: k })
            },
            {
              t: '✓ 先乘開、移項，讓右邊變成 0', d: k =>
                SV.seg(222, 12, 222, 238, LINE, 1.6) +
                TX(330, 28, '✓ 先讓右邊變 0', { anchor: 'middle', fs: 16, c: GRN }) +
                TX(330, 64, 'x² − 3x ＋ 2 ＝ 6', { anchor: 'middle', fs: 15.5, c: INK, op: k }) +
                TX(330, 94, 'x² − 3x − 4 ＝ 0', { anchor: 'middle', fs: 15.5, c: INK, op: k }) +
                TX(330, 124, '(x − 4)(x ＋ 1) ＝ 0', { anchor: 'middle', fs: 15.5, c: BLU, op: k })
            },
            {
              t: '再用「相乘是 0」，代回去驗證', d: k =>
                TX(330, 164, 'x ＝ 4 或 x ＝ −1', { anchor: 'middle', fs: 17, c: GRN, op: k }) +
                TX(330, 202, 'x ＝ 4：3 × 2 ＝ 6 ✓', { anchor: 'middle', fs: 14.5, c: INK, op: k }) +
                TX(330, 226, 'x ＝ −1：(−2) × (−3) ＝ 6 ✓', { anchor: 'middle', fs: 14.5, c: INK, op: k })
            }
          ]);
        },
        caption: '這是官方特別點名的錯法：看起來很像，但 \\(6\\) 有很多種拆法，只有 \\(0\\) 才有「至少一個是 0」這件事。',
        example: {
          q: '\\(x(x-3)=10\\)，可以寫 \\(x=10\\) 或 \\(x-3=10\\) 嗎？',
          steps: ['不行，右邊不是 \\(0\\)', '\\(x^2-3x-10=0\\Rightarrow(x-5)(x+2)=0\\)'],
          ans: '\\(x=5\\) 或 \\(x=-2\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '提公因式：先提，再讓每一塊等於 0',
        points: [
          '每一項都有 \\(x\\)，先提出來：\\(x^2-7x=x(x-7)\\)。',
          '\\(x=0\\) <b>也是解</b>——前面那個 \\(x\\) 自己就是一塊。',
          '整個括號也能提：\\(x(x+3)-5(x+3)=(x+3)(x-5)\\)。'
        ],
        formula: { label: '利用提公因式法<span class="pgref">課本 印 159 例 1</span>', tex: 'x^2-7x=0\\;\\Rightarrow\\;x(x-7)=0' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 246', [
            {
              t: '① 每一項都有 x：提出來', d: k =>
                TX(110, 32, '① x² − 7x ＝ 0', { anchor: 'middle', fs: 17, c: INK }) +
                TX(110, 68, 'x(x − 7) ＝ 0', { anchor: 'middle', fs: 17, c: BLU, op: k })
            },
            {
              t: '每一塊各自等於 0', d: k =>
                TX(110, 104, 'x ＝ 0 或 x − 7 ＝ 0', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(110, 140, 'x ＝ 0 或 x ＝ 7', { anchor: 'middle', fs: 17, c: GRN, op: k })
            },
            {
              t: '② 整個括號 (x ＋ 3) 是公因式', d: k =>
                SV.seg(220, 12, 220, 156, LINE, 1.6) +
                TX(330, 32, '② x(x ＋ 3) − 5(x ＋ 3) ＝ 0', { anchor: 'middle', fs: 14, c: INK }) +
                TX(330, 68, '(x ＋ 3)(x − 5) ＝ 0', { anchor: 'middle', fs: 17, c: BLU, op: k })
            },
            {
              t: '每一塊各自等於 0', d: k =>
                TX(330, 104, 'x ＋ 3 ＝ 0 或 x − 5 ＝ 0', { anchor: 'middle', fs: 14, c: INK, op: k }) +
                TX(330, 140, 'x ＝ −3 或 x ＝ 5', { anchor: 'middle', fs: 17, c: GRN, op: k })
            },
            {
              t: '最常漏掉的那一個', d: k =>
                BOX(40, 176, 360, 50, { r: 12, fill: 'rgba(217,119,6,.10)', stroke: AMB, sw: 2, op: k }) +
                TX(220, 207, '⚠ x ＝ 0 也是解：前面那個 x 自己就是一塊', { anchor: 'middle', fs: 15.5, c: AMB, op: k })
            }
          ]);
        },
        caption: '答案兩個都要寫：課本寫成「方程式的解為 0 和 7」。',
        example: {
          q: '\\(x^2+4x=0\\)',
          steps: ['\\(x(x+4)=0\\)', '\\(x=0\\) 或 \\(x+4=0\\)'],
          ans: '\\(x=0\\) 或 \\(x=-4\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '兩邊有一樣的括號，不能約掉',
        points: [
          '\\(x(x+3)=5(x+3)\\) 兩邊同除以 \\((x+3)\\)，只剩 \\(x=5\\)——<b>少了一個解</b>。',
          '因為 \\(x+3\\) 可能是 \\(0\\)，而<b>不能除以 0</b>。',
          '正確做法：<b>移項、提公因式</b>，兩個解都留得住。'
        ],
        formula: { label: '迷思診療<span class="pgref">課本 印 159</span>', tex: 'x(x+3)-5(x+3)=0\\;\\Rightarrow\\;(x+3)(x-5)=0' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '兩邊同除括號', bad: '\\(x(x+3)=5(x+3)\\)<br>同除 \\((x+3)\\)：\\(x=5\\)', good: '移項：\\((x+3)(x-5)=0\\)<br>\\(x=-3\\) 或 \\(x=5\\)' },
            { tag: '兩邊同除 x', bad: '\\(x^2=3x\\)<br>同除 \\(x\\)：\\(x=3\\)', good: '\\(x^2-3x=0\\Rightarrow x(x-3)=0\\)<br>\\(x=0\\) 或 \\(x=3\\)' }
          ]);
          MJ(h);
        },
        caption: '檢查：\\(x=-3\\) 代回 \\(x(x+3)\\) 和 \\(5(x+3)\\)，兩邊都是 \\(0\\)，真的是解。',
        example: {
          q: '\\(x^2=6x\\)，可以兩邊同除 \\(x\\) 嗎？',
          steps: ['不行，\\(x\\) 可能是 \\(0\\)', '\\(x^2-6x=0\\Rightarrow x(x-6)=0\\)'],
          ans: '\\(x=0\\) 或 \\(x=6\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜提公因式法',
        points: [
          '先找每一項都有的那一塊。',
          '數字也要提：\\(2x^2+6x=2x(x+3)\\)。',
          '整個括號 \\((2x-5)\\) 可以當成一塊提出來。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 159 例 1</span>', tex: 'x^2-7x=0\\;\\Rightarrow\\;x(x-7)=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 159', BLU, '解下列各一元二次方程式',
              pItem('印6 ①', '2x^2+6x=0') +
              pItem('印6 ②', '(2x-5)x+8(2x-5)=0')), '4-1');
        },
        caption: '第 ① 題提出 \\(2x\\) 之後，\\(2x=0\\) 一樣得到 \\(x=0\\)。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '平方差：兩個括號一加一減',
        points: [
          '\\(x^2-25=x^2-5^2=(x+5)(x-5)\\)，再讓每一塊等於 \\(0\\)。',
          '答案一正一負：\\(x=-5\\) 或 \\(x=5\\)，可以合寫成 \\(x=\\pm5\\)。',
          '前面有公因數先提：\\(8x^2-50=2(4x^2-25)\\)。'
        ],
        formula: { label: '利用平方差公式<span class="pgref">課本 印 160 例 2</span>', tex: 'x^2-25=0\\;\\Rightarrow\\;(x+5)(x-5)=0' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>x² − <span class="ival nv">25</span> ＝ 0</label>
              <input type="range" class="ns" min="1" max="9" step="1" value="5">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value;
            h.querySelector('.nv').textContent = n * n;
            let s = TX(220, 36, `x² − ${n * n} ＝ 0`, { anchor: 'middle', fs: 23, c: INK });
            s += TX(220, 68, `x² − ${n}² ＝ 0`, { anchor: 'middle', fs: 16, c: GREY });
            s += TX(220, 102, `(x ＋ ${n})(x − ${n}) ＝ 0`, { anchor: 'middle', fs: 21, c: BLU });
            s += TX(220, 136, `x ＝ −${n} 或 x ＝ ${n}`, { anchor: 'middle', fs: 21, c: GRN });
            const X = (t) => 220 + t * 18, Y = 196;
            s += SV.seg(40, Y, 400, Y, INK, 2);
            for (let t = -10; t <= 10; t++) {
              s += SV.seg(X(t), Y - (t % 5 ? 4 : 7), X(t), Y + (t % 5 ? 4 : 7), INK, 1.4);
              if (t % 5 === 0) s += TX(X(t), Y + 24, N(t), { anchor: 'middle', fs: 12.5, c: GREY });
            }
            s += `<path d="M${X(-n)},${Y - 14} Q${X(-n / 2)},${Y - 40} ${X(0)},${Y - 14}" fill="none" stroke="${AMB}" stroke-width="1.8"/>`;
            s += `<path d="M${X(0)},${Y - 14} Q${X(n / 2)},${Y - 40} ${X(n)},${Y - 14}" fill="none" stroke="${AMB}" stroke-width="1.8"/>`;
            s += TX(220, Y - 44, '一樣遠', { anchor: 'middle', fs: 13, c: AMB });
            s += `<circle cx="${X(-n)}" cy="${Y}" r="7" fill="${GRN}"/><circle cx="${X(n)}" cy="${Y}" r="7" fill="${GRN}"/>`;
            h.querySelector('.fig').innerHTML = svg('0 0 440 236', s);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '兩個答案在數線上對稱——離 \\(0\\) 一樣遠，一個在左、一個在右。',
        example: {
          q: '\\(8x^2-50=0\\)',
          steps: ['\\(2(4x^2-25)=0\\)', '\\((2x+5)(2x-5)=0\\)'],
          ans: '\\(x=-\\frac52\\) 或 \\(x=\\frac52\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜平方差',
        points: [
          '看到兩項相減、各自是平方，就用平方差。',
          '\\(9x^2=(3x)^2\\)，\\(16=4^2\\)。',
          '答案有分數也沒關係。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 160 例 2</span>', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 160', BLU, '解下列各一元二次方程式',
              pItem('印7 ①', 'x^2-9=0') +
              pItem('印7 ②', '9x^2-16=0')), '4-1');
        },
        caption: '第 ② 題：\\(3x+4=0\\) 解出來是 \\(x=-\\frac43\\)，不是 \\(-\\frac34\\)。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '完全平方：兩個括號一樣，答案寫一個',
        points: [
          '\\(x^2+8x+16=(x+4)^2\\)，兩個括號都是 \\(x+4\\)。',
          '\\(x+4=0\\) 兩次，答案都是 \\(x=-4\\)——<b>寫一個就好</b>。',
          '課本把它記成 \\(x=-4\\)（重根），意思就是兩個解一樣。'
        ],
        formula: { label: '利用平方公式<span class="pgref">課本 印 161 例 3</span>', tex: 'x^2+8x+16=0\\;\\Rightarrow\\;(x+4)^2=0' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 246', [
            {
              t: '頭尾都是平方', d: k =>
                TX(220, 40, 'x² ＋ 8x ＋ 16 ＝ 0', { anchor: 'middle', fs: 22, c: INK }) +
                TX(220, 72, 'x² 是 x 的平方，16 是 4 的平方', { anchor: 'middle', fs: 14.5, c: GREY, op: k })
            },
            {
              t: '中間驗 2ab', d: k =>
                TX(220, 108, '2 × x × 4 ＝ 8x　✓', { anchor: 'middle', fs: 17, c: BLU, op: k })
            },
            {
              t: '寫成平方', d: k =>
                TX(220, 148, '(x ＋ 4)² ＝ 0　→　(x ＋ 4)(x ＋ 4) ＝ 0', { anchor: 'middle', fs: 17, c: INK, op: k })
            },
            {
              t: '兩個括號一樣：答案寫一個', d: k =>
                BOX(70, 170, 300, 62, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2, op: k }) +
                TX(220, 198, 'x ＋ 4 ＝ 0　→　x ＝ −4', { anchor: 'middle', fs: 19, c: GRN, op: k }) +
                TX(220, 222, '兩個解一樣（課本寫「重根」）', { anchor: 'middle', fs: 13, c: GREY, op: k })
            }
          ]);
        },
        caption: '\\((x+4)^2=0\\) 寫成「無解」是錯的：\\(x=-4\\) 代回去，左邊真的是 \\(0\\)。',
        example: {
          q: '\\(4x^2-20x+25=0\\)',
          steps: ['\\((2x)^2-2\\cdot2x\\cdot5+5^2=0\\)', '\\((2x-5)^2=0\\)'],
          ans: '\\(x=\\frac52\\)（重根）'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜完全平方',
        points: [
          '頭尾是平方，中間驗 \\(2ab\\)。',
          '\\(49=7^2\\)、\\(14x=2\\times x\\times7\\)。',
          '兩個括號一樣，答案寫一個。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 161 例 3</span>', tex: '(a\\pm b)^2=a^2\\pm2ab+b^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 161', BLU, '解下列各一元二次方程式',
              pItem('印8 ①', 'x^2-14x+49=0') +
              pItem('印8 ②', '9x^2+48x+64=0')), '4-1');
        },
        caption: '第 ② 題：\\(9x^2=(3x)^2\\)、\\(64=8^2\\)、\\(2\\times3x\\times8=48x\\)。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '十字交乘：先把右邊變 0，再拆',
        points: [
          '\\(x^2-2x-15=0\\)：找相乘 \\(-15\\)、相加 \\(-2\\) 的兩個數 → \\(3\\) 和 \\(-5\\)。',
          '\\((x+3)(x-5)=0\\)，所以 \\(x=-3\\) 或 \\(x=5\\)。',
          '⚠ \\(5x^2+7x=6\\) 右邊不是 \\(0\\)：<b>先移項</b>成 \\(5x^2+7x-6=0\\)。'
        ],
        formula: { label: '利用十字交乘法<span class="pgref">課本 印 162 例 4</span>', tex: 'x^2-2x-15=0\\;\\Rightarrow\\;(x+3)(x-5)=0' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '右邊已經是 0，可以拆', d: k =>
                TX(220, 34, 'x² − 2x − 15 ＝ 0', { anchor: 'middle', fs: 22, c: INK })
            },
            {
              t: '十字交乘：斜著乘再相加，要等於 −2x', d: k => xcross(128, 42, 1, 3, 1, -5, { k })
            },
            {
              t: '橫著讀，就是兩個括號', d: k =>
                TX(220, 212, '(x ＋ 3)(x − 5) ＝ 0', { anchor: 'middle', fs: 20, c: BLU, op: k })
            },
            {
              t: '每一塊等於 0', d: k =>
                TX(220, 252, 'x ＝ −3 或 x ＝ 5', { anchor: 'middle', fs: 20, c: GRN, op: k })
            }
          ]);
        },
        caption: '分解的部分跟 3-2 一模一樣；多出來的只有最後一步：<b>每個括號等於 0</b>。',
        example: {
          q: '\\(5x^2+7x=6\\)',
          steps: ['移項：\\(5x^2+7x-6=0\\)', '\\((5x-3)(x+2)=0\\)'],
          ans: '\\(x=\\frac35\\) 或 \\(x=-2\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜十字交乘法',
        points: [
          '兩題右邊都不是 \\(0\\)，第一步都是移項。',
          '移項要變號：\\(-4x\\) 搬到左邊變 \\(+4x\\)。',
          '第 ② 題的二次項係數是 \\(4\\)，左欄也要拆。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 162 例 4</span>', tex: 'x^2-2x-15=0\\;\\Rightarrow\\;(x+3)(x-5)=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 162', BLU, '解下列各一元二次方程式',
              pItem('印9 ①', 'x^2=-4x+12') +
              pItem('印9 ②', '4x^2+3=8x')), '4-1');
        },
        caption: '第 ② 題移項後是 \\(4x^2-8x+3=0\\)：\\(4=2\\times2\\)、\\(3=1\\times3\\)，試試看。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '選招：右邊是 0 嗎？再挑工具',
        points: [
          '① 右邊是 \\(0\\) 嗎？不是就先乘開、移項。',
          '② 每一項都有共同的東西 → 提公因式；兩項相減、都是平方 → 平方差。',
          '③ 三項、頭尾是平方 → 平方公式；都不是 → 十字交乘。'
        ],
        formula: { label: '選法流程<span class="pgref">課本 印 167 重點整理</span>', tex: '\\text{右邊}=0\\;\\to\\;\\text{提}\\;\\to\\;\\text{公式}\\;\\to\\;\\text{十字}' },
        visual: (h) => {
          const L = [
            { e: 'x² − 3x ＝ 0', r: '每一項都有 x', b: [0, 1, 0, 0], s: 'x(x − 3) ＝ 0 → x ＝ 0 或 3' },
            { e: 'x² − 25 ＝ 0', r: '兩項相減，都是平方', b: [0, 0, 1, 0], s: '(x ＋ 5)(x − 5) ＝ 0 → x ＝ ±5' },
            { e: 'x² ＋ 6x ＋ 9 ＝ 0', r: '頭尾是平方，中間 2 × x × 3 ＝ 6x', b: [0, 0, 1, 0], s: '(x ＋ 3)² ＝ 0 → x ＝ −3' },
            { e: 'x² − 5x ＋ 6 ＝ 0', r: '三項，套不上公式', b: [0, 0, 0, 1], s: '(x − 2)(x − 3) ＝ 0 → x ＝ 2 或 3' },
            { e: '2x² ＋ 7x ＋ 3 ＝ 0', r: '三項，二次項係數 2：左欄也要拆', b: [0, 0, 0, 1], s: '(2x ＋ 1)(x ＋ 3) ＝ 0' },
            { e: 'x² ＝ 3x', r: '右邊不是 0：先移項成 x² − 3x ＝ 0', b: [1, 1, 0, 0], s: 'x(x − 3) ＝ 0 → x ＝ 0 或 3' }
          ];
          const NAME = ['先移項', '提公因式', '乘法公式', '十字交乘'], COL = [AMB, BLU, VIO, GRN];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>第 <span class="ival cv">1</span> 張 / ${L.length}</label>
              <input type="range" class="cs" min="0" max="${L.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.cs').value, it = L[i];
            h.querySelector('.cv').textContent = i + 1;
            let s = TX(220, 42, it.e, { anchor: 'middle', fs: 24, c: INK });
            s += TX(220, 76, it.r, { anchor: 'middle', fs: 14.5, c: GREY });
            NAME.forEach((nm, j) => {
              const x = 12 + j * 106, on = it.b[j];
              s += BOX(x, 96, 96, 58, { r: 12, fill: on ? COL[j] : '#fff', stroke: on ? COL[j] : LINE, sw: 2, op: on ? .9 : 1 });
              s += TX(x + 48, 131, nm, { anchor: 'middle', fs: 15.5, c: on ? '#fff' : GREY });
            });
            s += BOX(30, 176, 380, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 });
            s += TX(220, 204, it.s, { anchor: 'middle', fs: 16, c: GRN });
            h.querySelector('.fig').innerHTML = svg('0 0 440 232', s);
          };
          h.querySelector('.cs').oninput = draw;
          draw();
        },
        caption: '只選招、先不算，一題十秒。選對了，剩下的都是 3-1、3-2 學過的。',
        example: {
          q: '\\(x^2-16=0\\) 用哪一招？',
          steps: ['兩項相減，都是平方'],
          ans: '平方差：\\(x=\\pm4\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '先乘開、移項，再分解',
        points: [
          '有括號就先<b>乘開</b>，兩邊都有項就<b>移項</b>，讓右邊變成 \\(0\\)。',
          '課本開頭的田地 \\(x(x+6)=55\\)：乘開、移項 → \\(x^2+6x-55=0\\)。',
          '分解得 \\((x+11)(x-5)=0\\)，\\(x=-11\\) 或 \\(x=5\\)。'
        ],
        formula: { label: '乘開並化簡再求解<span class="pgref">課本 印 163 例 5</span>', tex: 'x(x+6)=55\\;\\Rightarrow\\;x^2+6x-55=0' },
        visual: (h) => {
          const row = (y, eq, tag, col, k) =>
            TX(190, y, eq, { anchor: 'middle', fs: 19, c: col, op: k }) +
            (tag ? TX(350, y - 2, tag, { fs: 13, c: GREY, op: k }) : '');
          SV.stepper(h, '0 0 440 250', [
            { t: '原式', d: k => row(36, 'x(x ＋ 6) ＝ 55', '', INK, 1) },
            { t: '乘開', d: k => row(76, 'x² ＋ 6x ＝ 55', '← 乘開', INK, k) },
            { t: '移項：右邊變 0', d: k => row(116, 'x² ＋ 6x − 55 ＝ 0', '← 移項', BLU, k) },
            { t: '因式分解（十字交乘）', d: k => row(156, '(x ＋ 11)(x − 5) ＝ 0', '← 分解', INK, k) },
            {
              t: '每一塊等於 0', d: k =>
                row(196, 'x ＝ −11 或 x ＝ 5', '← 各自為 0', GRN, k) +
                TX(220, 236, '當田地的邊長，−11 不合理 → 短邊是 5（4-3 會再處理）', { anchor: 'middle', fs: 13.5, c: AMB, op: k })
            }
          ]);
        },
        caption: '\\(-11\\) 解方程式是對的，但當成田地的邊長不合理——這件事 4-3 會專門處理。',
        example: {
          q: '\\(4(2+x)=x(x-3)\\)',
          steps: ['展開：\\(8+4x=x^2-3x\\)', '移項：\\(0=x^2-7x-8=(x+1)(x-8)\\)'],
          ans: '\\(x=-1\\) 或 \\(x=8\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜先乘開再解',
        points: [
          '第 ① 題就是「右邊是 6」那一型：先乘開。',
          '第 ② 題兩邊都有括號，兩邊都乘開。',
          '移項之後再選招。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 163 例 5</span>', tex: 'x(x+6)=55\\;\\Rightarrow\\;x^2+6x-55=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 163', BLU, '解下列各一元二次方程式',
              pItem('印10 ①', '(x-1)(x-6)=6') +
              pItem('印10 ②', 'x(x+3)=2(3-x)')), '4-1');
        },
        caption: '第 ① 題乘開是 \\(x^2-7x+6=6\\)，移項後常數項剛好消掉，剩下提公因式。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '係數是分數：先同乘，變成整數',
        points: [
          '每一項<b>都乘同一個數</b>（分母的公倍數），分數就不見了。',
          '\\(\\frac14x^2-\\frac54x-6=0\\) 同乘 \\(4\\)：\\(x^2-5x-24=0\\)。',
          '⚠ 常數項也要乘：\\(-6\\times4=-24\\)，最常漏的就是它。'
        ],
        formula: { label: '係數化為整數<span class="pgref">課本 印 164 例 6</span>', tex: '\\tfrac14x^2-\\tfrac54x-6=0\\;\\Rightarrow\\;x^2-5x-24=0' },
        visual: (h) => {

          const dx = 66, fs = 20;
          const top = (k) =>
            FR(dx + 14, 70, '1', '4', { fs: 16 }) + TX(dx + 28, 76, 'x²', { fs }) +
            TX(dx + 66, 76, '−', { anchor: 'middle', fs }) +
            FR(dx + 94, 70, '5', '4', { fs: 16 }) + TX(dx + 108, 76, 'x', { fs }) +
            TX(dx + 140, 76, '−', { anchor: 'middle', fs }) + TX(dx + 162, 76, '6', { anchor: 'middle', fs }) +
            TX(dx + 196, 76, '＝', { anchor: 'middle', fs }) + TX(dx + 226, 76, '0', { anchor: 'middle', fs });
          const mark = (x, k) => TX(x, 34, '×4', { anchor: 'middle', fs: 13.5, c: AMB, op: k });
          SV.stepper(h, '0 0 440 250', [
            { t: '係數是分數', d: k => top(k) },
            { t: '每一項上面都標 ×4（常數和右邊的 0 也要）', d: k => mark(dx + 22, k) + mark(dx + 98, k) + mark(dx + 162, k) + mark(dx + 226, k) },
            {
              t: '乘完變整數', d: k =>
                TX(220, 132, 'x² − 5x − 24 ＝ 0', { anchor: 'middle', fs: 21, c: BLU, op: k }) +
                TX(220, 158, '−6 × 4 ＝ −24（最常漏的就是它）', { anchor: 'middle', fs: 13, c: GREY, op: k })
            },
            { t: '分解', d: k => TX(220, 196, '(x ＋ 3)(x − 8) ＝ 0', { anchor: 'middle', fs: 19, c: INK, op: k }) },
            { t: '每一塊等於 0', d: k => TX(220, 234, 'x ＝ −3 或 x ＝ 8', { anchor: 'middle', fs: 20, c: GRN, op: k }) }
          ]);
        },
        caption: '官方說分數係數<b>不必多練</b>：會同乘、變整數，後面就跟前面一樣。',
        example: {
          q: '\\(\\frac{x^2-4}{2}=\\frac{x(x+2)}{3}\\)',
          steps: ['同乘 \\(6\\)：\\(3(x^2-4)=2x(x+2)\\)', '整理：\\(x^2-4x-12=0\\)'],
          ans: '\\(x=6\\) 或 \\(x=-2\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜分數係數（課本隨堂・行有餘力）',
        points: [
          '同乘分母的最小公倍數，每一項都要乘。',
          '第 ① 題同乘 \\(6\\)，第 ② 題同乘 \\(4\\)。',
          '⚠ 這一頁是<b>行有餘力</b>的，做不完不要緊。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 164 例 6</span>', tex: '\\tfrac14x^2-\\tfrac54x-6=0\\;\\Rightarrow\\;x^2-5x-24=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・行有餘力', '印 164', GRN, '係數化為整數再求解',
              pItem('印11 ①', '\\tfrac13x^2+\\tfrac12x-\\tfrac32=0') +
              pItem('印11 續', '\\frac{x^2+16}{4}=\\frac{5x-4}{2}', '', '印11 ②')), '4-1');
        },
        caption: '官方建議分數係數示範就好；這兩題做不完不影響過關。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '已知一個解，反推係數（行有餘力）',
        points: [
          '解就是「代進去會成立的數」，所以可以<b>把解代進去</b>，求出不知道的係數。',
          '\\(ax^2+x-10=0\\) 有一解 \\(2\\)：\\(4a+2-10=0\\)，\\(a=2\\)。',
          '方程式變成 \\(2x^2+x-10=0\\)，再分解找另一個解。'
        ],
        formula: { label: '已知一解，求另一解<span class="pgref">課本 印 165 例 7</span>', tex: '2x^2+x-10=0\\;\\Rightarrow\\;(2x+5)(x-2)=0' },
        visual: (h) => {

          SV.stepper(h, '0 0 440 250', [
            {
              t: '已知 x ＝ 2 是解', d: k =>
                TX(220, 36, 'ax² ＋ x − 10 ＝ 0，x ＝ 2 是解', { anchor: 'middle', fs: 18, c: INK })
            },
            {
              t: '把解代進去，求 a', d: k =>
                TX(220, 78, 'a × 2 × 2 ＋ 2 − 10 ＝ 0', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 108, '4a ＝ 8　→　a ＝ 2', { anchor: 'middle', fs: 18, c: BLU, op: k })
            },
            {
              t: '方程式完整了，分解它', d: k =>
                TX(220, 150, '2x² ＋ x − 10 ＝ 0', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(220, 180, '(2x ＋ 5)(x − 2) ＝ 0', { anchor: 'middle', fs: 18, c: INK, op: k })
            },
            {
              t: '另一個解', d: k =>
                TX(232, 228, '另一個解：x ＝ −', { anchor: 'end', fs: 18, c: GRN, op: k }) +
                FR(246, 222, '5', '2', { fs: 16, c: GRN, op: k })
            }
          ]);
        },
        caption: '例 8 是兩個解都給：各代一次，得到兩條式子，再解聯立。這一頁和下一頁都是行有餘力的。',
        example: {
          q: '例 8：\\(x^2+bx+c=0\\) 的解是 \\(3\\) 和 \\(-5\\)，求 \\(b\\)、\\(c\\)。',
          steps: ['代 \\(3\\)：\\(9+3b+c=0\\)；代 \\(-5\\)：\\(25-5b+c=0\\)', '相減：\\(-16+8b=0\\)，\\(b=2\\)，\\(c=-15\\)'],
          ans: '\\(b=2,\\ c=-15\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜由解反推（課本隨堂・行有餘力）',
        points: [
          '第一步都是<b>把解代進去</b>。',
          '印 165 代一次求 \\(m\\)；印 166 代兩次求 \\(b\\)、\\(c\\)。',
          '⚠ 這一頁是<b>行有餘力</b>的。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 165 例 7、印 166 例 8</span>', tex: 'x=-3\\;\\Rightarrow\\;9-3m-12=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・行有餘力', '印 165、166', GRN, '',
              pText('印12', '\\(x^2+mx-12=0\\) 有一解 \\(-3\\)，求另一個解。') +
              pText('印13', '\\(x^2+bx+c=0\\) 的解是 \\(3\\) 和 \\(2\\)，求 \\(b\\)、\\(c\\)。')), '4-1');
        },
        caption: '求出係數之後別忘了題目問的是什麼：印 165 問的是<b>另一個解</b>，不是 \\(m\\)。'
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>右邊不是 0、兩邊同除、代入的順序</b>。',
          '第一個最常見，第二個最難發現。',
          '做完把答案代回去——代得進去才算對。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 167 重點整理</span>', tex: '\\text{先讓右邊}=0\\text{，再分解}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '右邊不是 0 就拆', bad: '\\((x-1)(x-2)=6\\)<br>\\(x-1=6\\) 或 \\(x-2=6\\)', good: '乘開移項：\\(x^2-3x-4=0\\)<br>\\(x=4\\) 或 \\(x=-1\\)' },
            { tag: '兩邊同除掉 x', bad: '\\(x^2=3x\\)<br>同除 \\(x\\)：\\(x=3\\)', good: '\\(x(x-3)=0\\)<br>\\(x=0\\) 或 \\(x=3\\)' },
            { tag: '代入先乘再平方', bad: '\\(x=2\\)：\\(3x^2=36\\)', good: '\\(3x^2=3\\times2\\times2=12\\)' }
          ]);
          MJ(h);
        },
        caption: '第二個錯課本的迷思診療出現過：同除之前要確定除的不是 0，不確定就移項、提公因式。',
        example: {
          q: '下課前一分鐘：\\(x^2=5x\\)',
          steps: ['移項：\\(x^2-5x=0\\)', '\\(x(x-5)=0\\)'],
          ans: '\\(x=0\\) 或 \\(x=5\\)'
        }
      },

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜習作（基礎 1、2）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '基礎 1：四個選項各代一次，左右兩欄分開算。',
          '基礎 2：把 \\(-3\\) 代進去，求 \\(k\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 157</span>', tex: '\\text{代入後　左邊}=\\text{右邊}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 49', AMB, '',
              pText('基礎1', '\\(x=2\\) <b>不是</b>下列哪一個方程式的解？（選擇）') +
              pText('基礎2', '\\(-3\\) 是 \\(x^2+kx-6=0\\) 的一根，求 \\(k\\)。')), '4-1');
        },
        caption: '基礎 2 只要記得「解就是代進去會成立的數」：\\(9-3k-6=0\\)。'
      },
      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜習作（基礎 3 ①～③）',
        points: [
          '① 已經拆好了，直接讓每一塊等於 \\(0\\)。',
          '② 先提公因式 \\(5x\\)。',
          '③ 平方差。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 158–160</span>', tex: 'A\\times B=0\\;\\Rightarrow\\;A=0\\;\\text{或}\\;B=0' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 50', AMB, '解下列各一元二次方程式',
              pItem('基礎3 ①', '(x-2)(3x+1)=0') +
              pItem('基礎3 ②', '5x^2-10x=0') +
              pItem('基礎3 ③', 'x^2-16=0')), '4-1');
        },
        caption: '三題各用一種工具：相乘是 0、提公因式、平方差。'
      },
      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜習作（基礎 3 ④～⑥）',
        points: [
          '④ 頭尾是平方：\\((3x+4)^2\\)。',
          '⑤ 十字交乘：相乘 \\(12\\)、相加 \\(-7\\)。',
          '⑥ 二次項係數 \\(3\\)，左欄也要拆。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 161、162</span>', tex: '(a\\pm b)^2=a^2\\pm2ab+b^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 50', AMB, '解下列各一元二次方程式',
              pItem('基礎3 ④', '9x^2+24x+16=0') +
              pItem('基礎3 ⑤', 'x^2-7x+12=0') +
              pItem('基礎3 ⑥', '3x^2+10x-8=0')), '4-1');
        },
        caption: '④ 的兩個括號一樣，答案寫一個。'
      },
      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜習作（基礎 4～6）',
        points: [
          '基礎 5 ①：兩邊都有 \\((x+3)\\)，<b>不能約掉</b>，移項提公因式。',
          '基礎 5 ②：\\((2-x)=-(x-2)\\)，補上負號就有公因式。',
          '基礎 6：右邊不是 \\(0\\)、或有分數——先整理。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 159、163、164</span>', tex: '(x+3)^2-4(x+3)=0' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 51', AMB, '',
              pText('基礎4', '\\(x^2+6x-55=0\\) 的兩根 \\(a>b\\)，求 \\(a\\)、\\(b\\)。') +
              pItem('基礎5 ①', '(x+3)^2=4(x+3)') +
              pItem('基礎5 ②', '(x-2)(2x+5)-(2-x)(5x+2)=0') +
              pItem('基礎6 ①', '(x-3)(x-4)=2') +
              pItem('基礎6 ②', '\\tfrac14x^2+1=\\tfrac{13}{12}x')), '4-1');
        },
        caption: '基礎 5 ① 同除 \\((x+3)\\) 會漏掉 \\(x=-3\\)——跟課本迷思診療同一個陷阱。'
      },
      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '練習｜習作（精熟）',
        points: [
          '精熟 1：兩邊都有 \\((x-2)\\)，<b>不能約</b>——移項提公因式。',
          '精熟 2：兩個解各代一次，列兩條式子。',
          '⚠ 這兩題是行有餘力的，做不完不影響過關。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 159、166 例 8</span>', tex: '(x-2)(4x-3)-(x-2)(x-5)=0' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 52', GRN, '',
              pText('精熟1', '\\((x-2)(4x-3)=(x-2)(x-5)\\) 的敘述，何者正確？（選擇）', '(C)') +
              pText('精熟2', '\\(2x^2+bx+c=0\\) 的解為 \\(-5\\) 和 \\(2\\)，求 \\(b\\)、\\(c\\)。')), '4-1');
        },
        caption: '精熟 1 如果約掉 \\((x-2)\\)，會以為只有一根——選項 (A)、(D) 就是為這個錯設計的。'
      },
      {

        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '對答案｜習作 ①（基礎 1～3）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '4-1', [
            { label: '基礎 1、2（印 49）', cols: 3, items: [['1', '基礎1'], ['2', '基礎2']] },
            { label: '基礎 3（印 50）', cols: 3, items: [['3 ①', '基礎3 ①'], ['3 ②', '基礎3 ②'], ['3 ③', '基礎3 ③'], ['3 ④', '基礎3 ④'], ['3 ⑤', '基礎3 ⑤'], ['3 ⑥', '基礎3 ⑥']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '對答案｜習作 ②（基礎 4～6、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '4-1', [
            { label: '基礎 4～6（印 51）', cols: 3, items: [['4', '基礎4'], ['5 ①', '基礎5 ①'], ['5 ②', '基礎5 ②'], ['6 ①', '基礎6 ①'], ['6 ②', '基礎6 ②']] },
            { label: '精熟（印 52）', cols: 3, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '這一節在做三件事',
        points: [
          '<b>為什麼</b>：\\(x^2+2x-5=0\\) 拆不成兩個整數括號，前一節的方法用不上。',
          '<b>長什麼樣</b>：答案可能帶根號，例如 \\(x=3\\pm\\sqrt5\\)。',
          '<b>做什麼</b>：平方開回去；或把 \\(a\\)、\\(b\\)、\\(c\\) 代進<span class="k">公式</span>。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 170–183</span>', tex: 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}' },
        visual: (h) => {
          h.innerHTML = mapCards([
            ['1', '平方開回去', 'x² ＝ 25 → x ＝ 5 或 x ＝ −5', VIO],
            ['2', '配方（老師示範）', '補上一塊，拼成完全平方——公式就是這樣來的', BLU],
            ['3', '公式解', '抄 a、b、c，代進公式；公式考試會給', GRN]
          ]);
        },
        caption: '官方說得很清楚：<b>公式會給你</b>，力氣花在「怎麼代」，不是「怎麼背」。',
        example: {
          q: '課本溫故啟思：\\(x^2=25\\) 的解？',
          steps: ['\\(5^2=25\\)，\\((-5)^2=25\\) 也是'],
          ans: '\\(x=5\\) 和 \\(x=-5\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '平方開回去，一定有兩個',
        points: [
          '\\(x^2=25\\)：\\(5\\) 和 \\(-5\\) 平方都是 \\(25\\)，寫成 \\(x=\\pm5\\)。',
          '\\(x^2=7\\)：答案是 \\(\\pm\\sqrt7\\)——<b>不是整數也是答案</b>。',
          '\\(x^2=0\\) 只有 \\(x=0\\)；\\(x^2=-4\\) <b>無解</b>（平方不會是負的）。'
        ],
        formula: { label: '平方根概念<span class="pgref">課本 印 170</span>', tex: 'x^2=a\\;(a\\ge0)\\;\\Rightarrow\\;x=\\pm\\sqrt a' },
        visual: (h) => {
          const L = [9, 25, 7, 2, 0, -4];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>x² ＝ <span class="ival kv">9</span></label>
              <input type="range" class="ks" min="0" max="${L.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const k = L[+h.querySelector('.ks').value], r = Math.sqrt(Math.max(k, 0)), sq = Number.isInteger(r);
            h.querySelector('.kv').textContent = N(k);
            let s = TX(220, 42, `x² ＝ ${N(k)}`, { anchor: 'middle', fs: 26, c: INK });
            let ans, why, col = GRN;
            if (k < 0) { ans = '無解'; why = '正數、負數的平方都是正的，0² ＝ 0'; col = RED; }
            else if (k === 0) { ans = 'x ＝ 0（只有一個）'; why = '只有 0 的平方是 0'; }
            else if (sq) { ans = `x ＝ ${r} 或 x ＝ −${r}`; why = `${r}² ＝ ${k}，(−${r})² ＝ ${k}`; }
            else { ans = `x ＝ ${RT(k)} 或 x ＝ −${RT(k)}`; why = '開不盡，就留著根號'; }
            s += TX(220, 90, ans, { anchor: 'middle', fs: 22, c: col });
            s += TX(220, 122, why, { anchor: 'middle', fs: 14.5, c: GREY });
            const X = (t) => 220 + t * 30, Y = 186;
            s += SV.seg(34, Y, 406, Y, INK, 2);
            for (let t = -6; t <= 6; t++) {
              s += SV.seg(X(t), Y - 5, X(t), Y + 5, INK, 1.4);
              s += TX(X(t), Y + 24, N(t), { anchor: 'middle', fs: 12, c: GREY });
            }
            if (k >= 0) {
              s += `<circle cx="${X(r)}" cy="${Y}" r="7" fill="${GRN}"/>`;
              if (k > 0) s += `<circle cx="${X(-r)}" cy="${Y}" r="7" fill="${GRN}"/>`;
            } else s += TX(220, Y - 16, '數線上找不到', { anchor: 'middle', fs: 14, c: RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 226', s);
            radBars(h);
          };
          h.querySelector('.ks').oninput = draw;
          draw();
        },
        caption: '口訣：<b>開回去有兩個</b>、\\(0\\) 只有一個、負的沒有。',
        example: {
          q: '\\(x^2=36\\)',
          steps: ['\\(6^2=36\\)、\\((-6)^2=36\\)'],
          ans: '\\(x=\\pm6\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '括號的平方：先開回去，再移項',
        points: [
          '\\((x+2)^2=9\\)：把 \\(x+2\\) 看成一塊，\\(x+2=\\pm3\\)。',
          '再移項：\\(x=-2\\pm3\\)，也就是 \\(x=1\\) 或 \\(x=-5\\)。',
          '⚠ 移項只動常數：\\(x+2=\\pm\\sqrt5\\) 變成 \\(x=-2\\pm\\sqrt5\\)，不是 \\(2\\pm\\sqrt5\\)。'
        ],
        formula: { label: '利用平方根概念<span class="pgref">課本 印 171 例 1</span>', tex: '(x+2)^2=9\\;\\Rightarrow\\;x+2=\\pm3' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 262', [
            {
              t: '把 x ＋ 2 看成一塊', d: k =>
                TX(220, 40, '(x ＋ 2)² ＝ 9', { anchor: 'middle', fs: 23, c: INK }) +
                TX(220, 66, '這一塊的平方是 9', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            },
            { t: '開回去，記得 ±', d: k => TX(220, 102, 'x ＋ 2 ＝ ±3', { anchor: 'middle', fs: 21, c: BLU, op: k }) },
            { t: '移項：＋2 搬過去變 −2', d: k => TX(220, 138, 'x ＝ −2 ± 3', { anchor: 'middle', fs: 21, c: INK, op: k }) },
            {
              t: '拆成兩個答案', d: k =>
                TX(220, 176, 'x ＝ −2 ＋ 3 ＝ 1　或　x ＝ −2 − 3 ＝ −5', { anchor: 'middle', fs: 17, c: GRN, op: k })
            },
            {
              t: '開不盡也一樣：(x − 3)² ＝ 5', d: k =>
                BOX(30, 196, 380, 54, { r: 12, fill: 'rgba(124,58,237,.07)', stroke: VIO, sw: 2 }) +
                TX(220, 230, `(x − 3)² ＝ 5 → x − 3 ＝ ±${RT(5)} → x ＝ 3 ± ${RT(5)}`, { anchor: 'middle', fs: 15.5, c: VIO })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '\\(3\\pm\\sqrt5\\) 讀作「3 加減根號 5」，是兩個答案合起來寫。',
        example: {
          q: '\\((x-1)^2=9\\)',
          steps: ['\\(x-1=\\pm3\\)', '\\(x=1\\pm3\\)'],
          ans: '\\(x=4\\) 或 \\(x=-2\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜平方根概念解方程式',
        points: [
          '括號整塊開回去，記得 \\(\\pm\\)。',
          '移項時只有常數換邊、換號。',
          '開不盡就留根號：\\(\\pm\\sqrt2\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 171 例 1</span>', tex: '(x+2)^2=9\\;\\Rightarrow\\;x+2=\\pm3' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 171', BLU, '解下列各一元二次方程式',
              pItem('印2 ①', '(x-2)^2=25') +
              pItem('印2 ②', '(x+4)^2=2')), '4-2');
        },
        caption: '第 ② 題答案是 \\(x=-4\\pm\\sqrt2\\)，兩個答案合寫成一個。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '前面有係數：先除掉，只留一個括號的平方',
        points: [
          '\\(5(x+1)^2=60\\)：兩邊先除以 \\(5\\)，得 \\((x+1)^2=12\\)。',
          '左邊<b>只剩一個括號的平方</b>，才開回去。',
          '\\(x+1=\\pm\\sqrt{12}\\)，\\(x=-1\\pm2\\sqrt3\\)。'
        ],
        formula: { label: '解型如 k(ax＋b)²＝c<span class="pgref">課本 印 172 例 2</span>', tex: '5(x+1)^2=60\\;\\Rightarrow\\;(x+1)^2=12' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 244', [
            { t: '前面有係數 5', d: k => TX(220, 40, '5(x ＋ 1)² ＝ 60', { anchor: 'middle', fs: 23, c: INK }) },
            {
              t: '兩邊同除以 5', d: k =>
                TX(220, 72, '兩邊同 ÷ 5', { anchor: 'middle', fs: 14, c: GREY, op: k }) +
                TX(220, 104, '(x ＋ 1)² ＝ 12', { anchor: 'middle', fs: 21, c: BLU, op: k })
            },
            {
              t: '開回去', d: k =>
                TX(220, 146, `x ＋ 1 ＝ ±${RT(12)}`, { anchor: 'middle', fs: 20, c: INK }) +
                TX(220, 174, `${RT(12)} ＝ ${RT('4 × 3')} ＝ 2${RT(3)}`, { anchor: 'middle', fs: 14, c: GREY })
            },
            { t: '移項', d: k => TX(220, 218, `x ＝ −1 ± 2${RT(3)}`, { anchor: 'middle', fs: 21, c: GRN }) }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '口訣：<b>左邊只能留一個括號的平方</b>，前面的數、後面的數都先處理掉。',
        example: {
          q: '\\(3(x+2)^2=27\\)',
          steps: ['同除 \\(3\\)：\\((x+2)^2=9\\)', '\\(x+2=\\pm3\\)'],
          ans: '\\(x=1\\) 或 \\(x=-5\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜先除掉係數再開',
        points: [
          '第 ① 題先除以 \\(2\\)。',
          '第 ② 題先把 \\(+30\\) 移過去，再除以 \\(-2\\)。',
          '右邊變成 \\(0\\)：括號只能是 \\(0\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 172 例 2</span>', tex: '5(x+1)^2=60\\;\\Rightarrow\\;(x+1)^2=12' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 172', BLU, '解下列各一元二次方程式',
              pItem('印3 ①', '2(x-3)^2=10') +
              pItem('印3 ②', '-2(7x-1)^2+30=30')), '4-2');
        },
        caption: '第 ② 題整理完是 \\((7x-1)^2=0\\)，答案只有一個 \\(x=\\frac17\\)。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '配方：補上一塊，拼成正方形（老師示範）',
        points: [
          '\\(x^2+6x\\)：把 \\(6x\\) 分成兩條 \\(3x\\)，貼在正方形的右邊和下面。',
          '右下角缺一塊 \\(3\\times3=9\\)，補上就是 \\((x+3)^2\\)。',
          '規則：補上「\\(x\\) 的係數的一半」的平方——這叫<span class="k">配方</span>。'
        ],
        formula: { label: '配方<span class="pgref">課本 印 173、174 例 3</span>', tex: 'x^2+6x+3^2=(x+3)^2' },
        visual: (h) => {

          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>x² ＋ <span class="ival mv">6</span>x</label>
              <input type="range" class="ms" min="1" max="5" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const hf = +h.querySelector('.ms').value, X = 116, u = 16, d = hf * u, x0 = 50, y0 = 40;
            h.querySelector('.mv').textContent = 2 * hf;
            let s = `<rect x="${x0}" y="${y0}" width="${X}" height="${X}" fill="${BLU}" opacity=".16" stroke="${BLU}" stroke-width="2"/>`;
            s += TX(x0 + X / 2, y0 + X / 2 + 7, 'x²', { anchor: 'middle', fs: 20, c: BLU });
            s += `<rect x="${x0 + X}" y="${y0}" width="${d}" height="${X}" fill="${AMB}" opacity=".2" stroke="${AMB}" stroke-width="2"/>`;
            s += `<rect x="${x0}" y="${y0 + X}" width="${X}" height="${d}" fill="${AMB}" opacity=".2" stroke="${AMB}" stroke-width="2"/>`;
            s += TX(x0 + X + d / 2, y0 + X / 2 + 6, `${hf}x`, { anchor: 'middle', fs: 14, c: AMB });
            s += TX(x0 + X / 2, y0 + X + d / 2 + 5, `${hf}x`, { anchor: 'middle', fs: 14, c: AMB });
            s += `<rect x="${x0 + X}" y="${y0 + X}" width="${d}" height="${d}" fill="${GRN}" opacity=".3" stroke="${GRN}" stroke-width="2" stroke-dasharray="5 4"/>`;
            s += TX(x0 + X / 2, y0 - 8, 'x', { anchor: 'middle', fs: 14, c: GREY });
            s += TX(x0 + X + d / 2, y0 - 8, `${hf}`, { anchor: 'middle', fs: 14, c: GREY });
            s += TX(x0 + X + d + 10, y0 + X + d / 2 + 5, `補 ${hf * hf}`, { fs: 14, c: GRN });
            s += TX(330, 84, `x² ＋ ${2 * hf}x`, { anchor: 'middle', fs: 20, c: INK });
            s += TX(330, 122, `＋ ${hf}² （補上 ${hf * hf}）`, { anchor: 'middle', fs: 17, c: GRN });
            s += TX(330, 162, `＝ (x ＋ ${hf})²`, { anchor: 'middle', fs: 21, c: BLU });
            s += TX(220, 262, `${2 * hf}x 的一半是 ${hf}x：補上 ${hf}²，就拼成邊長 x ＋ ${hf} 的正方形`, { anchor: 'middle', fs: 14, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 276', s);
          };
          h.querySelector('.ms').oninput = draw;
          draw();
        },
        caption: '官方說<b>不要求學生用配方法解題</b>；這一頁是老師示範，看懂公式從哪裡來就好。',
        example: {
          q: '\\(x^2+8x+\\square=(x+\\square)^2\\)',
          steps: ['\\(8\\) 的一半是 \\(4\\)', '補 \\(4^2=16\\)'],
          ans: '\\(16\\)、\\(4\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜配成完全平方（老師帶做）',
        points: [
          '\\(x\\) 的係數取一半，再平方，就是要補的那一塊。',
          '括號裡填的是「一半」，不是「一半的平方」。',
          '⚠ 配方是<b>老師帶做</b>的，看懂就好。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 173、174 例 3</span>', tex: 'x^2+mx+\\left(\\tfrac m2\\right)^2=\\left(x+\\tfrac m2\\right)^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・老師帶做', '印 173、174', VIO, '在空格中填入適當的數',
              pText('印4 ①', '\\(x^2+2\\cdot x\\cdot1+\\square=(x+\\square)^2\\)') +
              pText('印4 ②', '\\(x^2+2\\cdot x\\cdot4+\\square=(x+\\square)^2\\)') +
              pText('印5 ①', '\\(x^2-12x+\\square=(x-\\square)^2\\)') +
              pText('印5 ②', '\\(x^2+\\frac13x+\\square=(x+\\square)^2\\)')), '4-2');
        },
        caption: '印 174 ② 的係數是分數：\\(\\frac13\\) 的一半是 \\(\\frac16\\)，補 \\(\\frac1{36}\\)。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '配方法解方程式（老師示範）',
        points: [
          '\\(x^2-6x-391=0\\)：常數 \\(391\\) 太大，拆不出來。',
          '先把常數移走，兩邊<b>同加</b> \\(3^2\\)：\\((x-3)^2=400\\)。',
          '開回去：\\(x-3=\\pm20\\)，\\(x=23\\) 或 \\(-17\\)。'
        ],
        formula: { label: '配方法解一元二次方程式<span class="pgref">課本 印 175 例 4</span>', tex: 'x^2-6x+9=391+9' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 244', [
            {
              t: '常數移到右邊', d: k =>
                TX(220, 36, 'x² − 6x − 391 ＝ 0', { anchor: 'middle', fs: 21, c: INK }) +
                TX(220, 70, 'x² − 6x ＝ 391', { anchor: 'middle', fs: 20, c: INK, op: k })
            },
            {
              t: '兩邊同加 3²（−6 的一半是 −3）', d: k =>
                TX(220, 110, 'x² − 6x ＋ 9 ＝ 391 ＋ 9', { anchor: 'middle', fs: 20, c: BLU, op: k }) +
                TX(220, 136, '左邊加了 9，右邊也要加 9', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            },
            {
              t: '左邊是完全平方，開回去', d: k =>
                TX(220, 174, '(x − 3)² ＝ 400　→　x − 3 ＝ ±20', { anchor: 'middle', fs: 19, c: INK, op: k })
            },
            { t: '移項', d: k => TX(220, 218, 'x ＝ 23 或 x ＝ −17', { anchor: 'middle', fs: 21, c: GRN, op: k }) }
          ]);
        },
        caption: '<b>兩邊都要加</b>——只加左邊，等號就不成立了。這一型是老師示範，學生不必練熟。',
        example: {
          q: '\\(x^2+8x-5=0\\)',
          steps: ['\\(x^2+8x=5\\)，同加 \\(16\\)', '\\((x+4)^2=21\\)'],
          ans: '\\(x=-4\\pm\\sqrt{21}\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜配方法解（老師帶做）',
        points: [
          '先把常數移走，再兩邊同加「一半的平方」。',
          '二次項係數不是 \\(1\\)：先整個除掉（印 176）。',
          '⚠ 這幾題是<b>老師帶做</b>的；學了公式解之後，也可以用公式解。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 175 例 4、印 176 例 5</span>', tex: 'x^2-6x+9=391+9' },
        visual: (h) => {
          pMount(h,
            pCard('課本・老師帶做', '印 175、176', VIO, '解下列各一元二次方程式',
              pItem('印6 ①', 'x^2+2x-1599=0') +
              pItem('印6 ②', 'x^2-10x+8=0') +
              pItem('印7 ①', '2x^2-8x+4=0') +
              pItem('印7 ②', '-x^2-3x+5=0')), '4-2');
        },
        caption: '官方說解題方法不限制：這四題用公式解一樣算得出來。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜配方法的變化題（課本隨堂・行有餘力）',
        points: [
          '印 177：已知解，反推常數 \\(k\\)。',
          '印 178：配完右邊是 \\(0\\) 就只有一個解；是負的就<b>無解</b>。',
          '⚠ 這一頁是<b>行有餘力</b>的。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 177 例 6、印 178 例 7</span>', tex: '(x+2)^2=-3\\;\\Rightarrow\\;\\text{無解}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・行有餘力', '印 177、178', GRN, '',
              pText('印8', '以配方法解 \\(x^2-4x+k=0\\)，得 \\(x=2\\pm\\sqrt3\\)，求 \\(k\\)。') +
              pItem('印9 ①', '2x^2+16x=-32') +
              pItem('印9 ②', 'x^2+4x+7=0')), '4-2');
        },
        caption: '印 178 ② 配完是 \\((x+2)^2=-3\\)：平方不會是負的——跟「\\(x^2=-4\\) 無解」同一句話。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '公式解：把 a、b、c 代進去',
        points: [
          '方程式整理成 \\(ax^2+bx+c=0\\)，先<b>抄三格</b>：\\(a\\)、\\(b\\)、\\(c\\)。',
          '再算兩個數：\\(-b\\) 和 \\(b^2-4ac\\)。',
          '代進公式，\\(\\pm\\) 拆成兩個答案。<b>公式考試會給</b>，不必背。'
        ],
        formula: { label: '一元二次方程式的公式解<span class="pgref">課本 印 180</span>', tex: 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 268', [
            {
              t: '抄 a、b、c', d: k => {
                let s = TX(220, 30, 'x² ＋ 5x ＋ 6 ＝ 0', { anchor: 'middle', fs: 20, c: INK });
                [['a', '1', VIO], ['b', '5', BLU], ['c', '6', AMB]].forEach(([nm, v, col], j) => {
                  const x = 46 + j * 124;
                  s += BOX(x, 46, 100, 50, { r: 12, fill: '#fff', stroke: col, sw: 2, op: k });
                  s += TX(x + 50, 79, `${nm} ＝ ${v}`, { anchor: 'middle', fs: 19, c: col, op: k });
                });
                return s;
              }
            },
            {
              t: '算 −b 和 b² − 4ac', d: k =>
                TX(110, 132, '−b ＝ −5', { anchor: 'middle', fs: 17, c: GRN, op: k }) +
                TX(300, 132, 'b² − 4ac ＝ 25 − 24 ＝ 1', { anchor: 'middle', fs: 16, c: INK, op: k })
            },
            {
              t: '代進公式', d: k =>
                TX(178, 186, 'x ＝', { anchor: 'end', fs: 20, c: INK }) +
                FR(236, 180, `−5 ± ${RT(1)}`, '2', { fs: 20, w: 104 })
            },
            {
              t: '± 拆成兩個答案', d: k =>
                TX(220, 248, 'x ＝ (−5 ＋ 1) ÷ 2 ＝ −2　或　x ＝ (−5 − 1) ÷ 2 ＝ −3', { anchor: 'middle', fs: 14.5, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '\\(\\sqrt1=1\\)，所以兩個答案都是整數；不是每一題都這麼好算。',
        example: {
          q: '\\(x^2+3x+2=0\\) 用公式解',
          steps: ['\\(a=1,\\ b=3,\\ c=2\\)', '\\(b^2-4ac=9-8=1\\)，\\(x=\\frac{-3\\pm1}{2}\\)'],
          ans: '\\(x=-1\\) 或 \\(x=-2\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '兩條路，同一個答案',
        points: [
          '\\(x^2+6x+5=0\\) 用 4-1 的十字交乘：\\((x+1)(x+5)=0\\)。',
          '用公式解：\\(a=1,\\ b=6,\\ c=5\\)，\\(b^2-4ac=16\\)，\\(x=\\frac{-6\\pm4}{2}\\)。',
          '兩邊都得到 \\(x=-1\\) 或 \\(-5\\)——公式算出來的跟舊方法<b>對得上</b>。'
        ],
        formula: { label: '公式解<span class="pgref">課本 印 179–181</span>', tex: 'x^2+6x+5=0' },
        visual: (h) => {

          SV.stepper(h, '0 0 440 292', [
            {
              t: '4-1 的方法：十字交乘', d: k =>
                TX(108, 24, '十字交乘', { anchor: 'middle', fs: 16, c: VIO }) +
                xcross(16, 30, 1, 1, 1, 5, { k }) +
                TX(108, 196, '(x ＋ 1)(x ＋ 5) ＝ 0', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(108, 226, 'x ＝ −1 或 −5', { anchor: 'middle', fs: 17, c: GRN, op: k })
            },
            {
              t: '這一節的方法：公式解', d: k =>
                SV.seg(220, 10, 220, 236, LINE, 1.6) +
                TX(332, 24, '公式解', { anchor: 'middle', fs: 16, c: BLU }) +
                TX(332, 62, 'a ＝ 1　b ＝ 6　c ＝ 5', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(332, 94, 'b² − 4ac ＝ 36 − 20 ＝ 16', { anchor: 'middle', fs: 14.5, c: INK, op: k }) +
                TX(290, 146, 'x ＝', { anchor: 'end', fs: 17, c: INK, op: k }) +
                FR(348, 140, `−6 ± ${RT(16)}`, '2', { fs: 17, w: 96, op: k }) +
                TX(332, 196, '＝ (−6 ± 4) ÷ 2', { anchor: 'middle', fs: 15, c: INK, op: k }) +
                TX(332, 226, 'x ＝ −1 或 −5', { anchor: 'middle', fs: 17, c: GRN, op: k })
            },
            {
              t: '答案一樣', d: k =>
                BOX(70, 246, 300, 38, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2, op: k }) +
                TX(220, 271, '兩條路，同一個答案', { anchor: 'middle', fs: 17, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '拆得開的題目兩種都可以用；拆不開的，就只剩公式解。',
        example: {
          q: '\\(x^2-6x+5=0\\) 兩種方法都試',
          steps: ['分解：\\((x-1)(x-5)=0\\)', '公式：\\(x=\\frac{6\\pm4}{2}\\)'],
          ans: '\\(x=1\\) 或 \\(x=5\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '先問右邊是 0 嗎，再抄 a、b、c',
        points: [
          '\\(x^2+3x=-2\\) 直接抄會以為 \\(c=0\\)——<b>先移項</b>：\\(x^2+3x+2=0\\)，\\(c=2\\)。',
          '負號跟著抄：\\(x^2-5x-4=0\\) 的 \\(b=-5\\)，所以 \\(-b=5\\)。',
          '少一項就是 \\(0\\)：\\(3x^2-4=0\\) 的 \\(b=0\\)。'
        ],
        formula: { label: '整理成標準式<span class="pgref">課本 印 181 例 8</span>', tex: 'x^2+3x=-2\\;\\Rightarrow\\;x^2+3x+2=0' },
        visual: (h) => abcView(h, [
          { e: 'x² ＋ 3x ＝ −2', z: 'x² ＋ 3x ＋ 2 ＝ 0', a: 1, b: 3, c: 2 },
          { e: '2x² − 5x ＝ 0', z: null, a: 2, b: -5, c: 0 },
          { e: '3x² − 4 ＝ 0', z: null, a: 3, b: 0, c: -4 },
          { e: 'x² − 5x − 4 ＝ 0', z: null, a: 1, b: -5, c: -4 },
          { e: 'x² ＋ 3 ＝ −2x', z: 'x² ＋ 2x ＋ 3 ＝ 0', a: 1, b: 2, c: 3 }
        ], { negB: true, note: '−b 那一格一定要寫：多寫一行，少錯一半' }),
        caption: '抄錯 \\(a\\)、\\(b\\)、\\(c\\)，後面算得再好都是錯的——跟 4-1 同一條規矩：先問右邊是不是 \\(0\\)。',
        example: {
          q: '\\(2x^2=7x-3\\) 的 \\(a\\)、\\(b\\)、\\(c\\)？',
          steps: ['移項：\\(2x^2-7x+3=0\\)'],
          ans: '\\(a=2,\\ b=-7,\\ c=3\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '公式解四格：答案可以帶根號',
        points: [
          '照順序填四格：① 右邊是 \\(0\\) 嗎 ② 抄 \\(a\\)、\\(b\\)、\\(c\\) ③ 算 \\(b^2-4ac\\) ④ 代公式。',
          '\\(x^2-5x-4=0\\)：\\(b^2-4ac=25+16=41\\)，\\(\\sqrt{41}\\) 開不盡就留著。',
          '答案 \\(x=\\frac{5\\pm\\sqrt{41}}{2}\\) <b>就是答案</b>，不是算錯。'
        ],
        formula: { label: '公式解<span class="pgref">課本 印 181 例 8</span>', tex: 'x=\\dfrac{5\\pm\\sqrt{41}}{2}' },
        visual: (h) => {
          const card = (y, hh, n, col, k) =>
            BOX(20, y, 400, hh, { r: 12, fill: '#fff', stroke: col, sw: 2, op: k }) +
            `<circle cx="46" cy="${y + 25}" r="14" fill="${col}" opacity="${.15 * k}"/>` +
            TX(46, y + 31, n, { anchor: 'middle', fs: 16, c: col, op: k });
          SV.stepper(h, '0 0 440 280', [
            {
              t: '① 右邊是 0 嗎？', d: k =>
                card(8, 50, '1', AMB, k) + TX(72, 39, 'x² − 5x − 4 ＝ 0　右邊是 0 ✓', { fs: 16, c: INK, op: k })
            },
            {
              t: '② 抄 a、b、c（負號跟著抄）', d: k =>
                card(66, 50, '2', VIO, k) + TX(72, 97, 'a ＝ 1　b ＝ −5　c ＝ −4', { fs: 16, c: INK, op: k })
            },
            {
              t: '③ 算 b² − 4ac：是正的，往下走', d: k =>
                card(124, 50, '3', BLU, k) + TX(72, 155, 'b² − 4ac ＝ (−5)² − 4 × 1 × (−4) ＝ 41', { fs: 14.5, c: INK, op: k })
            },
            {
              t: '④ 代公式：開不盡就留著根號', d: k =>
                card(182, 88, '4', GRN, k) + TX(72, 232, '代公式：', { fs: 16, c: INK, op: k }) +
                TX(190, 232, 'x ＝', { anchor: 'end', fs: 20, c: GRN }) +
                FR(250, 226, `5 ± ${RT(41)}`, '2', { fs: 20, c: GRN, w: 112 }) +
                TX(330, 232, '← 就是答案', { fs: 13.5, c: GREY, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '第 ③ 格每題都要寫：它是正的才往下走，是負的就停（下一頁）。',
        example: {
          q: '\\(x^2-4x+1=0\\)',
          steps: ['\\(b^2-4ac=16-4=12\\)', '\\(x=\\frac{4\\pm\\sqrt{12}}{2}=\\frac{4\\pm2\\sqrt3}{2}\\)'],
          ans: '\\(x=2\\pm\\sqrt3\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '根號裡是負的：停，寫無解',
        points: [
          '\\(x^2+2x+3=0\\)：\\(b^2-4ac=4-12=-8\\)。',
          '根號裡面是負的 → 沒有數的平方是負的 → <b>無解</b>，不用再往下算。',
          '是 \\(0\\) 的話：\\(\\pm0\\) 一樣，只有一個答案（課本寫重根）。'
        ],
        formula: { label: '負的就停<span class="pgref">課本 印 180、181 例 8</span>', tex: 'b^2-4ac\\lt 0\\;\\Rightarrow\\;\\text{無解}' },
        visual: (h) => {
          const ANS = { '-3': 'x ＝ 1 或 x ＝ −3', '-2': `x ＝ −1 ± ${RT(3)}`, '-1': `x ＝ −1 ± ${RT(2)}`, '0': 'x ＝ 0 或 x ＝ −2', '1': 'x ＝ −1（只有一個）' };
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>常數項 c ＝ <span class="ival cv">−3</span></label>
              <input type="range" class="cs" min="-3" max="3" step="1" value="-3">
            </div></div>`;
          const draw = () => {
            const c = +h.querySelector('.cs').value, D = 4 - 4 * c;
            h.querySelector('.cv').textContent = N(c);
            const eq = c === 0 ? 'x² ＋ 2x ＝ 0' : `x² ＋ 2x ${c > 0 ? '＋' : '−'} ${Math.abs(c)} ＝ 0`;
            let s = TX(220, 38, eq, { anchor: 'middle', fs: 22, c: INK });
            s += TX(220, 74, `b² − 4ac ＝ 2² − 4 × 1 × ${c < 0 ? '(' + N(c) + ')' : c} ＝ ${N(D)}`, { anchor: 'middle', fs: 16, c: BLU });
            const X = (t) => 220 + t * 11;
            s += `<rect x="${X(-8)}" y="100" width="${X(0) - X(-8)}" height="22" fill="${RED}" opacity=".18"/>`;
            s += `<rect x="${X(0)}" y="100" width="${X(16) - X(0)}" height="22" fill="${GRN}" opacity=".18"/>`;
            s += SV.seg(X(0), 94, X(0), 128, INK, 2);
            s += TX(X(0), 144, '0', { anchor: 'middle', fs: 13, c: INK });
            s += TX(X(-4), 116, '負的', { anchor: 'middle', fs: 12.5, c: RED });
            s += TX(X(10), 116, '正的', { anchor: 'middle', fs: 12.5, c: GRN });
            s += `<polygon points="${X(D) - 8},90 ${X(D) + 8},90 ${X(D)},100" fill="${D < 0 ? RED : D === 0 ? AMB : GRN}"/>`;
            const col = D < 0 ? RED : D === 0 ? AMB : GRN;
            s += BOX(30, 160, 380, 64, { r: 12, fill: D < 0 ? '#fdeef2' : 'rgba(5,150,105,.08)', stroke: col, sw: 2 });
            s += TX(220, 186, D < 0 ? '根號裡是負的 → 停，寫「無解」' : D === 0 ? '根號裡是 0 → 只有一個答案' : '根號裡是正的 → 兩個答案',
              { anchor: 'middle', fs: 16, c: col });
            s += TX(220, 212, D < 0 ? '沒有數的平方是負的' : ANS[c], { anchor: 'middle', fs: 16, c: D < 0 ? GREY : INK });
            h.querySelector('.fig').innerHTML = svg('0 0 440 236', s);
            radBars(h);
          };
          h.querySelector('.cs').oninput = draw;
          draw();
        },
        caption: '這一頁就是課本「判別式」要你會的部分：<b>負的就停</b>。哪一種情形叫什麼名字，不必背。',
        example: {
          q: '\\(x^2+3=-2x\\)（課本例 8 ③）',
          steps: ['移項：\\(x^2+2x+3=0\\)', '\\(b^2-4ac=4-12=-8\\lt 0\\)'],
          ans: '無解'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜公式解',
        points: [
          '四格照順序：右邊是 \\(0\\) 嗎 → 抄 \\(a,b,c\\) → 算 \\(b^2-4ac\\) → 代公式。',
          '第 ② 題右邊不是 \\(0\\)，先移項。',
          '第 ③ 題算完 \\(b^2-4ac\\) 就知道要不要往下。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 181 例 8</span>', tex: 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 181', BLU, '利用公式解求下列各方程式的解',
              pItem('印12 ①', 'x^2+x-4=0') +
              pItem('印12 ②', 'x^2+25=-10x') +
              pItem('印12 續', 'x^2-3x+4=0', '', '印12 ③')), '4-2');
        },
        caption: '公式考試會給——這一頁把力氣花在<b>抄對 \\(a\\)、\\(b\\)、\\(c\\)</b>。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: 'b² − 4ac 的三種情形（行有餘力）',
        points: [
          '\\(b^2-4ac>0\\)：開得出來，\\(\\pm\\) 給兩個<b>不一樣</b>的解。',
          '\\(b^2-4ac=0\\)：\\(\\pm0\\) 一樣，兩個解相同（重根）。',
          '\\(b^2-4ac\\lt 0\\)：無解。題目說「有重根」，就是在說 \\(b^2-4ac=0\\)。'
        ],
        formula: { label: '判別式<span class="pgref">課本 印 180、182 例 9</span>', tex: 'b^2-4ac=0\\;\\Leftrightarrow\\;\\text{重根}' },
        visual: (h) => {

          const row = (y, sym, t, ex, col) =>
            BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
            BOX(30, y + 10, 80, 48, { r: 10, fill: col, stroke: col, op: .14 }) +
            TX(70, y + 42, sym, { anchor: 'middle', fs: 20, c: col }) +
            TX(126, y + 28, t, { fs: 16, c: INK }) +
            TX(126, y + 52, ex, { fs: 13, c: GREY });
          h.innerHTML = svg('0 0 440 250',
            row(6, '＞ 0', '兩個不一樣的解', '例：x² − 5x − 4 ＝ 0，b² − 4ac ＝ 41', GRN) +
            row(88, '＝ 0', '兩個解一樣（重根）', '例：4x² ＋ 12x ＋ 9 ＝ 0，b² − 4ac ＝ 0', AMB) +
            row(170, '＜ 0', '無解', '例：x² ＋ 2x ＋ 3 ＝ 0，b² − 4ac ＝ −8', RED));
        },
        caption: '這一頁是<b>行有餘力</b>的：習作有「有重根求 \\(m\\)」「兩相異根求範圍」兩題用得到。',
        example: {
          q: '\\(x^2+6x+k=0\\) 有重根，求 \\(k\\)。',
          steps: ['重根：\\(b^2-4ac=0\\)', '\\(36-4k=0\\)'],
          ans: '\\(k=9\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜有重根求係數（課本隨堂・行有餘力）',
        points: [
          '「有重根」就是 \\(b^2-4ac=0\\)。',
          '抄 \\(a=2\\)、\\(b=5\\)、\\(c=k\\)，列出 \\(25-8k=0\\)。',
          '⚠ 這一題是<b>行有餘力</b>的。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 182 例 9</span>', tex: 'b^2-4ac=0' },
        visual: (h) => {
          pMount(h,
            pCard('課本・行有餘力', '印 182', GRN, '',
              pText('印13', '\\(2x^2+5x+k=0\\) 有重根，求 \\(k\\)。')), '4-2');
        },
        caption: '答案是分數 \\(\\frac{25}{8}\\)，不是算錯。'
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>漏了 ±、沒整理就抄、\\(-b\\) 的符號</b>。',
          '第二個在 4-1 就見過：先問右邊是不是 \\(0\\)。',
          '公式會給，所以錯幾乎都錯在「抄」和「代」。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 183 重點整理</span>', tex: '\\text{右邊}=0\\;\\to\\;a,b,c\\;\\to\\;b^2-4ac\\;\\to\\;\\text{公式}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '漏了 ±', bad: '\\((x-1)^2=9\\)<br>\\(x-1=3\\)，\\(x=4\\)', good: '\\(x-1=\\pm3\\)<br>\\(x=4\\) 或 \\(x=-2\\)' },
            { tag: '沒整理就抄 c', bad: '\\(x^2+3x=-2\\)<br>\\(c=0\\)', good: '先移項：\\(x^2+3x+2=0\\)<br>\\(c=2\\)' },
            { tag: '−b 的符號', bad: '\\(b=-5\\)<br>\\(-b=-5\\)', good: '\\(-b=-(-5)=5\\)' }
          ]);
          MJ(h);
        },
        caption: '\\(-b\\) 那一格建議一定要寫出來：多寫一行，少錯一半。',
        example: {
          q: '下課前一分鐘：\\(x^2-3x-4=0\\) 的 \\(-b\\)？',
          steps: ['\\(b=-3\\)'],
          ans: '\\(-b=3\\)'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜習作（基礎 1、2）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '基礎 1：先把括號的平方單獨留在左邊，再開回去。',
          '基礎 2 是配方，<b>老師帶做</b>。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 171–174</span>', tex: '(x+3)^2=7\\;\\Rightarrow\\;x+3=\\pm\\sqrt7' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 53', AMB, '解下列各一元二次方程式',
              pItem('基礎1 ①', '(x+3)^2=7') +
              pItem('基礎1 ②', '-2(5x-2)^2+18=0')) +
            pCard('習作・老師帶做', '印 53', VIO, '填入適當的數',
              pText('基礎2 ①', '\\(x^2+16x+(\\square)^2=(x+\\square)^2\\)') +
              pText('基礎2 ②', '\\(x^2-9x+(\\square)^2=(x-\\square)^2\\)') +
              pText('基礎2 ③', '\\(x^2+\\frac25x+(\\square)^2=(x+\\square)^2\\)')), '4-2');
        },
        caption: '基礎 1 ② 先移 \\(18\\)、再除以 \\(-2\\)：\\((5x-2)^2=9\\)。'
      },
      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜習作（基礎 3：配方法，老師帶做）',
        points: [
          '常數先移走，再兩邊同加「一半的平方」。',
          '③ 二次項係數是 \\(2\\)、④ 是 \\(5\\)：先整個除掉。',
          '⚠ 配方法是<b>老師帶做</b>；用公式解算一樣得到答案。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 175、176</span>', tex: 'x^2+10x+25=875+25' },
        visual: (h) => {
          pMount(h,
            pCard('習作・老師帶做', '印 54', VIO, '利用配方法解',
              pItem('基礎3 ①', 'x^2+10x-875=0') +
              pItem('基礎3 ②', 'x^2-6x=6') +
              pItem('基礎3 ③', '2x^2-12x-8=0') +
              pItem('基礎3 ④', '5x^2+4x+\\tfrac45=0')), '4-2');
        },
        caption: '① 的常數 \\(875\\) 很大：同加 \\(25\\) 之後是 \\((x+5)^2=900\\)，\\(\\sqrt{900}=30\\)。'
      },
      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜習作（基礎 4、5）',
        points: [
          '基礎 5 是<b>本節的底線</b>：公式解四格照順序填。',
          '② 的 \\(b^2-4ac=0\\)，③ 的是負的——算完那一格就知道答案長什麼樣。',
          '基礎 4 是行有餘力：已知解，反推 \\(a\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 181 例 8</span>', tex: 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 55', GRN, '',
              pText('基礎4', '以配方法解 \\(x^2-14x+a=0\\)，得 \\(x=7\\pm\\sqrt{11}\\)，求 \\(a\\)。')) +
            pCard('習作・基礎練習', '印 55、56', AMB, '利用公式解',
              pItem('基礎5 ①', 'x^2+4x-3=0') +
              pItem('基礎5 ②', '36x^2-12x+1=0') +
              pItem('基礎5 ③', '2x^2-x+1=0')), '4-2');
        },
        caption: '公式考試會給，先抄 \\(a\\)、\\(b\\)、\\(c\\)、再算 \\(b^2-4ac\\)，最後才代公式。'
      },
      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '練習｜習作（基礎 6、精熟）',
        points: [
          '基礎 6：「有重根」就是 \\(b^2-4ac=0\\)。',
          '精熟 1：完全平方式——\\(225=15^2\\)，中間項有正、負兩種。',
          '⚠ 這三題是行有餘力的，做不完不影響過關。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 180、182</span>', tex: 'b^2-4ac=0\\;\\Leftrightarrow\\;\\text{重根}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 56', GRN, '',
              pText('基礎6', '\\(6x^2+3x+m=0\\) 有重根，求 \\(m\\)。') +
              pText('精熟1', '\\(x^2+mx+225\\) 是完全平方式，求 \\(m\\)。') +
              pText('精熟2', '\\(x^2-6x+(m+5)=0\\) 有兩相異根，求 \\(m\\) 的範圍。')), '4-2');
        },
        caption: '精熟 2「兩相異根」是 \\(b^2-4ac>0\\)，答案是一個範圍，不是一個數。'
      },
      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '對答案｜習作 ①（基礎 1～3）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '4-2', [
            { label: '基礎 1、2（印 53）', cols: 3, items: [['1 ①', '基礎1 ①'], ['1 ②', '基礎1 ②'], ['2 ①', '基礎2 ①'], ['2 ②', '基礎2 ②'], ['2 ③', '基礎2 ③']] },
            { label: '基礎 3（印 54）', cols: 3, items: [['3 ①', '基礎3 ①'], ['3 ②', '基礎3 ②'], ['3 ③', '基礎3 ③'], ['3 ④', '基礎3 ④']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '對答案｜習作 ②（基礎 4～6、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '4-2', [
            { label: '基礎 4、5（印 55、56）', cols: 3, items: [['4', '基礎4'], ['5 ①', '基礎5 ①'], ['5 ②', '基礎5 ②'], ['5 ③', '基礎5 ③']] },
            { label: '基礎 6、精熟（印 56）', cols: 3, items: [['6', '基礎6'], ['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：題目是一段話，要自己<b>列成方程式</b>再解。',
          '<b>怎麼做</b>：設 \\(x\\) → 列式 → 解 → <b>挑掉不合理的答案</b>。',
          '<b>最難的一步</b>：設了 \\(x\\) 之後，別的量怎麼用 \\(x\\) 寫出來。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 186–190</span>', tex: '\\text{設}\\;\\to\\;\\text{列}\\;\\to\\;\\text{解}\\;\\to\\;\\text{選}' },
        visual: (h) => {
          h.innerHTML = mapCards([
            ['1', '設未知數', '題目問什麼，就先設什麼是 x', VIO],
            ['2', '列方程式', '用 x 寫出其他的量；相等的兩邊常是面積或畢氏定理', BLU],
            ['3', '解、再挑答案', '解出來的數放回題目裡，合理嗎？', GRN]
          ]);
        },
        caption: '解方程式的方法前兩節都學過了，<b>用哪一種都可以</b>——這一節的重點在列式和挑答案。',
        example: {
          q: '長方形的寬算出來是 \\(-4\\) 公尺，可以嗎？',
          steps: ['寬是長度，不能是負的'],
          ans: '不合理，要捨去'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '答案合不合理：先學會挑',
        points: [
          '解方程式常得到兩個數，<b>不一定兩個都能用</b>。',
          '長度、人數、價錢不能是負的；人數、班級數要是<b>整數</b>。',
          '還要看題目的條件：例如「每人限購 \\(40\\) 張」。'
        ],
        formula: { label: '選擇適合答案<span class="pgref">課本 印 186</span>', tex: '\\text{放回題目裡，合理嗎？}' },
        visual: (h) => {

          const L = [
            ['長方形的寬', '−4 公尺', 0, '長度不能是負的'],
            ['班級數', '7.5 班', 0, '班級數要是整數'],
            ['每班人數', '25 人', 1, '正整數，說得通'],
            ['每張餐券的價錢', '0 元', 0, '價錢是 0 元，那就不用買了'],
            ['買的餐券張數', '50 張', 0, '題目說每人限購 40 張'],
            ['正方形的邊長', '2 公分', 1, '正的長度，說得通']
          ];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>第 <span class="ival sv">1</span> 個 / ${L.length}</label>
              <input type="range" class="ss" min="0" max="${L.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const i = +h.querySelector('.ss').value, [nm, v, ok, why] = L[i];
            h.querySelector('.sv').textContent = i + 1;
            let s = BOX(40, 14, 360, 136, { r: 16, fill: '#fff', stroke: LINE, sw: 2 });
            s += TX(220, 52, `算出來：${nm}`, { anchor: 'middle', fs: 16, c: GREY });
            s += TX(220, 112, v, { anchor: 'middle', fs: 38, c: INK });
            s += BOX(80, 170, 280, 46, { r: 12, fill: ok ? 'rgba(5,150,105,.10)' : '#fdeef2', stroke: ok ? GRN : RED, sw: 2 });
            s += TX(220, 200, ok ? '✓ 合理' : '✗ 不合理，捨去', { anchor: 'middle', fs: 19, c: ok ? GRN : RED });
            s += TX(220, 244, why, { anchor: 'middle', fs: 16, c: INK });
            h.querySelector('.fig').innerHTML = svg('0 0 440 258', s);
          };
          h.querySelector('.ss').oninput = draw;
          draw();
        },
        caption: '這一步不用計算，但每一題都要做：課本四步驟的最後一步就是它。',
        example: {
          q: '算出「有 \\(-3\\) 個人」，要怎麼寫？',
          steps: ['人數不能是負的'],
          ans: '\\(-3\\) 不合，捨去'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '四步驟，拆成五格來寫',
        points: [
          '課本例 1：\\(225\\) 位新生編班，每班人數是班級數的 \\(3\\) 倍少 \\(2\\)。',
          '設班級數 \\(x\\)，<b>先用 \\(x\\) 寫出每班人數</b> \\(3x-2\\)，再列 \\(x(3x-2)=225\\)。',
          '解出 \\(x=9\\) 或 \\(-\\frac{25}{3}\\)，班級數不能是分數、也不能是負的 → \\(9\\) 班。'
        ],
        formula: { label: '數字關係<span class="pgref">課本 印 186 例 1</span>', tex: 'x(3x-2)=225' },
        visual: (h) => {
          const row = (i, lab, txt, col, k, fs) => {
            const y = 10 + i * 52;
            return BOX(10, y, 92, 44, { r: 10, fill: col, stroke: col, op: .14 * (k === undefined ? 1 : k) }) +
              TX(56, y + 28, lab, { anchor: 'middle', fs: 14.5, c: col, op: k }) +
              BOX(110, y, 320, 44, { r: 10, fill: '#fff', stroke: col, sw: 1.8, op: k }) +
              TX(122, y + 28, txt, { fs: fs || 15, c: INK, op: k });
          };
          SV.stepper(h, '0 0 440 272', [
            { t: '① 設未知數：題目問什麼、哪個最好設', d: k => row(0, '設 x', '班級數 ＝ x 班', VIO, k) },
            { t: '② 用 x 寫出其他的量（真正的門檻）', d: k => row(1, '用 x 表示', '每班人數 ＝ (3x − 2) 人', BLU, k) },
            { t: '③ 找出相等的兩邊', d: k => row(2, '等量關係', '班級數 × 每班人數 ＝ 225 → x(3x − 2) ＝ 225', AMB, k, 13.5) },
            { t: '④ 解方程式（用哪一種方法都可以）', d: k => row(3, '解', '(3x ＋ 25)(x − 9) ＝ 0 → x ＝ 9 或 −25/3', GRN, k, 14) },
            { t: '⑤ 放回題目裡檢查，寫答案句', d: k => row(4, '檢查', '−25/3 不合 → 9 班，每班 3 × 9 − 2 ＝ 25 人', RED, k, 14) }
          ]);
        },
        caption: '題目問的是<b>每班人數</b>，解出來的 \\(x\\) 是班級數——最後要再算一次，不要答非所問。',
        example: {
          q: '承上，答案句怎麼寫？',
          steps: ['\\(x=9\\) 是班級數', '每班 \\(3\\times9-2=25\\)'],
          ans: '每班 \\(25\\) 人'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜數字關係',
        points: [
          '設甲數 \\(x\\)，乙數就是 \\(2x+3\\)。',
          '相乘是 \\(44\\)：\\(x(2x+3)=44\\)。',
          '題目說兩數是<b>整數</b>，分數的答案要捨去。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 186 例 1</span>', tex: 'x(2x+3)=44' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 186', BLU, '照五格寫：設 x、用 x 表示、等量、解、檢查',
              pText('印1', '甲、乙兩數是整數，乙是甲的 \\(2\\) 倍多 \\(3\\)，兩數相乘是 \\(44\\)，求甲、乙。')), '4-3');
        },
        caption: '課本這一題有填空格，照著五格填就好。'
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '用 x 表示另一個量',
        points: [
          '兩數和是 \\(10\\)，一個是 \\(x\\)，另一個就是 \\(10-x\\)。',
          '長比寬多 \\(6\\)，寬是 \\(x\\)，長就是 \\(x+6\\)。',
          '\\(30\\) 公尺柵欄圍三邊（一邊靠牆）：兩條邊各 \\(x\\)，第三條是 \\(30-2x\\)。'
        ],
        formula: { label: '用 x 表示其他的量<span class="pgref">課本 印 187 例 2</span>', tex: '\\text{另一邊}=30-2x' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 250', [
            {
              t: '和是 10：一個是 x，另一個是 10 − x', d: k => {
                const x0 = 70, u = 30, a = 4;
                return TX(220, 34, '兩數的和是 10', { anchor: 'middle', fs: 18, c: INK }) +
                  `<rect x="${x0}" y="70" width="${a * u}" height="40" fill="${BLU}" opacity=".2" stroke="${BLU}" stroke-width="2"/>` +
                  `<rect x="${x0 + a * u}" y="70" width="${(10 - a) * u}" height="40" fill="${AMB}" opacity=".2" stroke="${AMB}" stroke-width="2"/>` +
                  TX(x0 + a * u / 2, 96, 'x', { anchor: 'middle', fs: 18, c: BLU }) +
                  TX(x0 + a * u + (10 - a) * u / 2, 96, '10 − x', { anchor: 'middle', fs: 18, c: AMB }) +
                  SV.seg(x0, 60, x0 + 300, 60, GREY, 1.6) + TX(220, 54, '10', { anchor: 'middle', fs: 14, c: GREY }) +
                  TX(220, 170, '一個是 x，另一個就是 10 − x', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                  TX(220, 202, '（一個是 4，另一個就是 6）', { anchor: 'middle', fs: 14, c: GREY, op: k });
              }
            },
            {
              t: '長比寬多 6：寬是 x，長是 x ＋ 6', d: k =>
                TX(220, 34, '長比寬多 6', { anchor: 'middle', fs: 18, c: INK }) +
                `<rect x="110" y="62" width="220" height="96" fill="${GRN}" opacity=".14" stroke="${GRN}" stroke-width="2"/>` +
                TX(98, 116, 'x', { anchor: 'end', fs: 18, c: BLU }) +
                TX(220, 54, 'x ＋ 6', { anchor: 'middle', fs: 18, c: AMB }) +
                TX(220, 196, '寬是 x，長就是 x ＋ 6', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(220, 226, '面積 ＝ x(x ＋ 6)', { anchor: 'middle', fs: 15, c: GREY, op: k })
            },
            {
              t: '柵欄圍三邊：第三條是 30 − 2x', d: k =>
                TX(220, 30, '餐廳（這一邊不用圍）', { anchor: 'middle', fs: 14, c: GREY }) +
                SV.seg(80, 44, 360, 44, INK, 5) +
                SV.seg(120, 44, 120, 144, GRN, 3.2) + SV.seg(320, 44, 320, 144, GRN, 3.2) + SV.seg(120, 144, 320, 144, GRN, 3.2) +
                TX(108, 100, 'x', { anchor: 'end', fs: 18, c: BLU }) +
                TX(332, 100, 'x', { fs: 18, c: BLU }) +
                TX(220, 168, '30 − 2x', { anchor: 'middle', fs: 18, c: AMB }) +
                TX(220, 206, '柵欄 30 ＝ x ＋ x ＋（第三條）', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 234, '兩條 x 先扣掉，剩下的才是第三條', { anchor: 'middle', fs: 14, c: GREY, op: k })
            }
          ], { acc: false });
        },
        caption: '這一步是整節真正的門檻：<b>寫得出「另一個量」，方程式就列出一半了</b>。',
        example: {
          q: '兩數和是 \\(12\\)，一個是 \\(x\\)，兩數相乘是 \\(35\\)，列式。',
          steps: ['另一個是 \\(12-x\\)', '相乘：\\(x(12-x)=35\\)'],
          ans: '\\(x(12-x)=35\\)'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '面積關係：畫圖，把 x 標上去',
        points: [
          '餐廳外的用餐區，靠餐廳那一邊不用圍；柵欄 \\(30\\) 公尺、面積要 \\(100\\)。',
          '垂直的邊 \\(x\\)，另一邊 \\(30-2x\\)：\\(x(30-2x)=100\\)。',
          '解得 \\(x=10\\) 或 \\(x=5\\)，另一邊是 \\(10\\) 或 \\(20\\)——<b>兩個都合理</b>。'
        ],
        formula: { label: '面積關係<span class="pgref">課本 印 187 例 2</span>', tex: 'x(30-2x)=100' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>垂直的邊 x ＝ <span class="ival xv">3</span> 公尺</label>
              <input type="range" class="xs" min="1" max="14" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.xs').value, s2 = 11, wv = 30 - 2 * k, A = k * wv, ok = A === 100;
            h.querySelector('.xv').textContent = k;
            const w = wv * s2, hh = k * s2, x0 = 220 - w / 2, y0 = 44;
            let s = TX(220, 26, '餐廳', { anchor: 'middle', fs: 14, c: GREY }) + SV.seg(40, 40, 400, 40, INK, 5);
            s += `<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="${ok ? GRN : AMB}" opacity=".16"/>`;
            s += SV.seg(x0, y0, x0, y0 + hh, ok ? GRN : AMB, 3) + SV.seg(x0 + w, y0, x0 + w, y0 + hh, ok ? GRN : AMB, 3) + SV.seg(x0, y0 + hh, x0 + w, y0 + hh, ok ? GRN : AMB, 3);
            s += TX(x0 - 8, y0 + hh / 2 + 5, `${k}`, { anchor: 'end', fs: 14, c: BLU });
            s += TX(220, y0 + hh + 20, `30 − 2 × ${k} ＝ ${wv}`, { anchor: 'middle', fs: 14, c: AMB });
            s += TX(220, 236, `面積 ＝ ${k} × ${wv} ＝ ${A}`, { anchor: 'middle', fs: 19, c: INK });
            s += TX(220, 266, ok ? '剛好 100 平方公尺！' : A < 100 ? '比 100 小' : '比 100 大', { anchor: 'middle', fs: 17, c: ok ? GRN : GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '不是每一題都要捨掉一個答案——這一題兩個都合題意，課本兩個都寫。',
        example: {
          q: '承上，\\(x=5\\) 時用餐區長什麼樣子？',
          steps: ['另一邊 \\(30-2\\times5=20\\)'],
          ans: '\\(5\\) 公尺 × \\(20\\) 公尺'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜面積關係',
        points: [
          '這就是本章開頭的巴比倫田地。',
          '設短邊 \\(x\\)，長邊 \\(x+6\\)。',
          '解出 \\(-11\\) 要捨去：邊長不能是負的。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 187 例 2</span>', tex: 'x(x+6)=55' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 187', BLU, '照五格寫',
              pText('印2', '長方形田地面積 \\(55\\) 平方公尺，長邊比短邊長 \\(6\\) 公尺，短邊幾公尺？')), '4-3');
        },
        caption: '4-1 已經把它解過一次了（\\(x=5\\) 或 \\(-11\\)），這次多一步：挑答案。'
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '加一圈外框：每一邊多兩段 x',
        points: [
          '邊長 \\(10\\) 公尺的正方形花圃外，鋪一圈等寬 \\(x\\) 的步道。',
          '新的邊長是 \\(10+2x\\)——<b>左右各一段</b>，不是 \\(10+x\\)。',
          '總面積 \\(196\\)：\\((10+2x)^2=196\\)，\\(10+2x=\\pm14\\)，\\(x=2\\)（\\(-12\\) 不合）。'
        ],
        formula: { label: '寬度問題<span class="pgref">課本 印 188 例 3 同型</span>', tex: '(10+2x)^2=196' },
        visual: (h) => {

          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>步道寬 x ＝ <span class="ival xv">1</span> 公尺</label>
              <input type="range" class="xs" min="0" max="4" step="0.5" value="1">
            </div></div>`;
          const draw = () => {
            const k = +h.querySelector('.xs').value, u = 12, S = 10 + 2 * k, A = S * S, ok = A === 196;
            h.querySelector('.xv').textContent = k;
            const cx = 220, cy = 128, O = S * u, I = 10 * u;
            let s = `<rect x="${cx - O / 2}" y="${cy - O / 2}" width="${O}" height="${O}" fill="${ok ? GRN : BLU}" opacity=".14" stroke="${ok ? GRN : BLU}" stroke-width="2"/>`;
            s += `<rect x="${cx - I / 2}" y="${cy - I / 2}" width="${I}" height="${I}" fill="${AMB}" opacity=".22" stroke="${AMB}" stroke-width="2"/>`;
            s += TX(cx, cy + 6, '花圃 10', { anchor: 'middle', fs: 15, c: AMB });
            if (k > 0) {
              s += SV.seg(cx - O / 2, cy + I / 2 + 10, cx - I / 2, cy + I / 2 + 10, RED, 3);
              s += SV.seg(cx + I / 2, cy + I / 2 + 10, cx + O / 2, cy + I / 2 + 10, RED, 3);
              s += TX(cx - (O + I) / 4, cy + I / 2 + 28, 'x', { anchor: 'middle', fs: 15, c: RED });
              s += TX(cx + (O + I) / 4, cy + I / 2 + 28, 'x', { anchor: 'middle', fs: 15, c: RED });
            }
            s += TX(cx, cy - O / 2 - 8, `10 ＋ 2x ＝ ${S}`, { anchor: 'middle', fs: 15, c: BLU });
            s += TX(220, 264, `總面積 ＝ (10 ＋ 2x)² ＝ ${S}² ＝ ${A}`, { anchor: 'middle', fs: 17, c: INK });
            s += TX(220, 288, ok ? '剛好 196！步道寬 2 公尺' : A < 196 ? '比 196 小' : '比 196 大', { anchor: 'middle', fs: 16, c: ok ? GRN : GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 300', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '加上或扣掉的，<b>一邊都是兩段</b>，畫圖標出來。圖裡有直角三角形時，等量關係就是<b>畢氏定理</b>（2-3，習作基礎 3 用得到）。',
        example: {
          q: '照片長 \\(14\\)、寬 \\(12\\)，四周貼等寬 \\(x\\) 的膠帶，中間剩下多長、多寬？',
          steps: ['每一邊扣兩段 \\(x\\)'],
          ans: '\\(14-2x\\) 和 \\(12-2x\\)'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜寬度問題（課本隨堂・行有餘力）',
        points: [
          '把兩條條紋<b>推到邊上</b>，藍色會拼成一個長方形。',
          '藍色的長、寬各少一段 \\(x\\)：\\((40-x)(30-x)\\)。',
          '藍＝黃，所以藍色是整張的一半：\\((40-x)(30-x)=600\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 188 例 3</span>', tex: '(40-x)(30-x)=600' },
        visual: (h) => {
          pMount(h,
            pCard('課本・行有餘力', '印 188', GRN, '點開題目看圖',
              pText('印3', '畫布長 \\(40\\)、寬 \\(30\\)，兩條互相垂直的等寬黃色條紋；藍色面積＝黃色面積，求條紋寬。')), '4-3');
        },
        caption: '解出 \\(10\\) 或 \\(60\\)：條紋比畫布還寬不可能，\\(60\\) 要捨去。'
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '買賣問題：先填三欄表',
        points: [
          '餐券基本 \\(10\\) 張、每張 \\(700\\) 元；每多買 \\(1\\) 張，每張便宜 \\(10\\) 元。',
          '多買 \\(x\\) 張：張數 \\(10+x\\)、單價 \\(700-10x\\)，總價＝單價×張數。',
          '花 \\(15000\\) 元：\\(x=20\\) 或 \\(40\\)；\\(50\\) 張超過限購 \\(40\\) 張 → 買 \\(30\\) 張。'
        ],
        formula: { label: '買賣問題<span class="pgref">課本 印 189 例 4</span>', tex: '(10+x)(700-10x)=15000' },
        visual: (h) => {
          const COLS = [[20, 90], [110, 100], [210, 80], [290, 140]];
          const cell = (r, c, t, o = {}) => {
            const [x, w] = COLS[c], y = 14 + r * 40;
            return BOX(x, y, w, 40, { r: 0, fill: o.fill || '#fff', stroke: LINE, sw: 1.5, op: o.op }) +
              TX(x + w / 2, y + 26, t, { anchor: 'middle', fs: o.fs || 15, c: o.c || INK, op: o.op });
          };
          SV.stepper(h, '0 0 440 290', [
            {
              t: '表頭和「原本」那一列', d: k =>
                cell(0, 0, '', { fill: '#f3f6fb' }) + cell(0, 1, '單價（元）', { fill: '#f3f6fb', fs: 14 }) +
                cell(0, 2, '張數', { fill: '#f3f6fb', fs: 14 }) + cell(0, 3, '總價（元）', { fill: '#f3f6fb', fs: 14 }) +
                cell(1, 0, '原本', { fs: 14 }) + cell(1, 1, '700', { op: k }) + cell(1, 2, '10', { op: k }) + cell(1, 3, '7000', { op: k })
            },
            {
              t: '多買 x 張：每一格都用 x 寫', d: k =>
                cell(2, 0, '多買 x 張', { fs: 13.5 }) + cell(2, 1, '700 − 10x', { c: BLU, op: k }) +
                cell(2, 2, '10 ＋ x', { c: BLU, op: k }) + cell(2, 3, '(700 − 10x)(10 ＋ x)', { c: BLU, fs: 13, op: k })
            },
            {
              t: '總價 ＝ 15000：列出方程式', d: k =>
                TX(220, 160, '(700 − 10x)(10 ＋ x) ＝ 15000', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 186, '整理：x² − 60x ＋ 800 ＝ 0', { anchor: 'middle', fs: 14.5, c: GREY, op: k })
            },
            { t: '解', d: k => TX(220, 222, '(x − 20)(x − 40) ＝ 0 → x ＝ 20 或 40', { anchor: 'middle', fs: 16, c: BLU, op: k }) },
            {
              t: '檢查題目的條件：限購 40 張', d: k =>
                BOX(20, 238, 400, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2, op: k }) +
                TX(220, 266, '10 ＋ 40 ＝ 50 張 ✗ 超過限購　10 ＋ 20 ＝ 30 張 ✓', { anchor: 'middle', fs: 15, c: GRN, op: k })
            }
          ]);
        },
        caption: '表格填對，方程式就出來了；最後別忘了題目的條件「限購 \\(40\\) 張」。',
        example: {
          q: '承上，花 \\(20000\\) 元呢？',
          steps: ['\\(x^2-60x+1300=0\\)', '\\(b^2-4ac=3600-5200\\lt 0\\)'],
          ans: '無解，計算有誤'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜買賣問題',
        points: [
          '三欄表照抄，只把總價換成 \\(16000\\)。',
          '解出 \\(x\\)，再算張數 \\(10+x\\)。',
          '再對一次限購 \\(40\\) 張。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 189 例 4</span>', tex: '(10+x)(700-10x)=16000' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 189', BLU, '先填三欄表',
              pText('印4', '承例 4，校友會花 \\(16000\\) 元買餐券，買了幾張？')), '4-3');
        },
        caption: '這一題只解出一個 \\(x\\)，張數剛好等於限購——<b>等於</b>是可以的。'
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>沒挑答案、答非所問、外框少算一段</b>。',
          '前兩個在最後一步，第三個在列式。',
          '每一題寫完，都用一句話回答題目問的那件事。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 190 重點整理</span>', tex: '\\text{設}\\;\\to\\;\\text{列}\\;\\to\\;\\text{解}\\;\\to\\;\\text{選}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '沒有挑答案', bad: '邊長 \\(x=2\\) 或 \\(-12\\)<br>兩個都寫', good: '邊長不能是負的：<br>\\(-12\\) 不合，答 \\(2\\)' },
            { tag: '答非所問', bad: '問每班幾人<br>答：\\(x=9\\)', good: '\\(x\\) 是班級數：<br>每班 \\(3\\times9-2=25\\) 人' },
            { tag: '外框只算一段', bad: '四周加寬 \\(x\\)<br>邊長 \\(10+x\\)', good: '左右各一段：<br>邊長 \\(10+2x\\)' }
          ]);
          MJ(h);
        },
        caption: '應用題先求<b>列得出來</b>；解不出來，列式也有分。',
        example: {
          q: '下課前一分鐘：兩數和 \\(12\\)、積 \\(35\\)，求兩數。',
          steps: ['\\(x(12-x)=35\\Rightarrow x^2-12x+35=0\\)', '\\((x-5)(x-7)=0\\)'],
          ans: '\\(5\\) 和 \\(7\\)'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜習作（基礎 1、2）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '基礎 1：設甲數 \\(x\\)，乙數是 \\(x^2\\)。',
          '基礎 2：設今年 \\(x\\) 歲，\\(5\\) 年前 \\(x-5\\)、\\(5\\) 年後 \\(x+5\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 186 例 1</span>', tex: '(x-5)(x+5)=1200' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 57', AMB, '照五格寫',
              pText('基礎1', '甲數是正數，乙數是甲數的平方，兩數和為 \\(90\\)，甲數為何？') +
              pText('基礎2', '「我 \\(5\\) 年前與 \\(5\\) 年後的年齡相乘是 \\(1200\\)。」老師今年幾歲？')), '4-3');
        },
        caption: '基礎 2 乘開剛好是平方差：\\((x-5)(x+5)=x^2-25\\)。'
      },
      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜習作（基礎 3、4）',
        points: [
          '兩題都有圖：<b>點開題目</b>看圖再列式。',
          '基礎 3：圖裡有直角三角形，用<b>畢氏定理</b>（2-3 學過）列式。',
          '基礎 4：外框每一邊多兩段 \\(x\\)：\\((30+2x)(20+2x)=704\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 188 例 3</span>', tex: '(30+2x)(20+2x)=704' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 58', AMB, '點開題目看圖',
              pText('基礎3', '溜滑梯側面是等腰三角形，下方有半徑 \\(x\\) 公尺的半圓洞，求 \\(x\\)。') +
              pText('基礎4', '\\(30\\times20\\) 的照片外圍等寬木框，總面積 \\(704\\)，木框寬幾公分？')), '4-3');
        },
        caption: '答案放回圖裡檢查：半徑、寬度都不能是負的。基礎 4 跟「加一圈外框」那一頁同型。'
      },
      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '練習｜習作（基礎 5、精熟）',
        points: [
          '基礎 5：三欄表——人數 \\(20+x\\)、每人 \\(10000-100x\\) 元。',
          '算出兩個 \\(x\\)，對一次「最多比 \\(20\\) 人多 \\(16\\) 人」。',
          '精熟 1 是行有餘力的：兩個答案<b>都合理</b>。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 189 例 4</span>', tex: '(20+x)(10000-100x)=270000' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 59', AMB, '先填三欄表',
              pText('基礎5', '每人 \\(10000\\) 元，超過 \\(20\\) 人時每多一人每人少 \\(100\\) 元（最多多 \\(16\\) 人）；總旅費 \\(270000\\)，幾人參加？')) +
            pCard('習作・行有餘力', '印 59', GRN, '點開題目看圖',
              pText('精熟1 ①', '竹籬總長 \\(82\\) 公尺圍長方形牧場，\\(AD=EF=BC=x\\)，用 \\(x\\) 表示 \\(AB\\)。') +
              pText('精熟1 ②', '承上，牧場總面積 \\(288\\) 平方公尺，求 \\(EF\\)。')), '4-3');
        },
        caption: '精熟 1 打破「應用題一定要捨一個」：\\(EF=12\\) 或 \\(16\\) 都圍得出來。'
      },
      {
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '對答案｜習作（基礎 1～5、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '4-3', [
            { label: '基礎 1～5（印 57～59）', cols: 3, items: [['1', '基礎1'], ['2', '基礎2'], ['3', '基礎3'], ['4', '基礎4'], ['5', '基礎5']] },
            { label: '精熟（印 59）', cols: 3, items: [['精 1 ①', '精熟1 ①'], ['精 1 ②', '精熟1 ②']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      }
    ]
  });
})();
