window.DECK = window.DECK || [];
(function () {
  const C = '#065f46';

  const RED = '#be123c', GRN = '#065f46', BLU = '#1e40af', VIO = '#6d28d9', AMB = '#92400e';
  const INK = '#0b1220', GREY = '#475569', LINE = '#94a3b8', XO_BAD = '#e0849b', XO_GOOD = '#5fb28e';

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

  function quizGrid(qs, keys) {
    const half = Math.ceil(qs.length / 2);
    const cell = (q, i) => `<div style="display:flex;gap:12px;align-items:baseline;padding:7px 4px;border-bottom:1px dashed #cbd5e1">
        <span style="flex:0 0 2.4em;text-align:right;font-size:20px;font-weight:900;color:${C}">(${i + 1})</span>
        <span style="flex:1;min-width:0;font-size:22px;color:${INK}">\\(${q}\\)${keys ? `<span style="color:${GRN};font-weight:800">\\(\\;=${keys[i]}\\)</span>` : ''}</span></div>`;
    const col = (from, to) => `<div style="flex:1;min-width:0">${qs.slice(from, to).map((q, j) => cell(q, from + j)).join('')}</div>`;
    return `<div style="width:99.5%;margin:0 auto;padding-top:38px">
      <div style="border:1.5px solid ${LINE};border-radius:12px;background:#fff;padding:10px 16px;display:flex;gap:22px">
        ${col(0, half)}${col(half, qs.length)}</div></div>`;
  }

  const Q32 = ['x^2+7x+12', 'x^2-12x+11', 'x^2+12x-45', 'x^2-8x-20', 'x^2-11x+24', 'x^2-x-6', 'x^2-16x+28',
    'x^2+11x+28', 'x^2+13x-14', 'x^2+2x-35', 'x^2-34x-35', 'x^2-15x+56', 'x^2-46x-96', 'x^2+9x-36'];
  const K32 = ['(x+3)(x+4)', '(x-1)(x-11)', '(x+15)(x-3)', '(x-10)(x+2)', '(x-3)(x-8)', '(x-3)(x+2)', '(x-2)(x-14)',
    '(x+4)(x+7)', '(x+14)(x-1)', '(x+7)(x-5)', '(x-35)(x+1)', '(x-7)(x-8)', '(x-48)(x+2)', '(x+12)(x-3)'];

  window.DECK.push({
    ch: 3,
    title: '因式分解',
    color: C,
    sections: ['3-1 提公因式法與乘法公式因式分解', '3-2 利用十字交乘法因式分解', '段考 第二次（2-2～3-2）', '總習題 習作（3-1～3-2）', '附錄本 精熟、素養題型', '會考練習 試卷（3-1～3-2）'],
    slides: [

      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課本隨堂 ①（因式與倍式的判別、因式與倍式的敘述判斷等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '課本・隨堂練習', page: '印 119–123', sub: '因式與倍式的判別、因式與倍式的敘述判斷等', tags: ['印4', '印5', '印6', '印8'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課本隨堂 ②（提一次式因式分解、變號與提兩次公因式等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '課本・隨堂練習', page: '印 124–127', sub: '提一次式因式分解、變號與提兩次公因式等', tags: ['印9', '印10', '印11', '印12'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課本隨堂 ③（平方差公式的應用、和的平方公式填空等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '課本・隨堂練習', page: '印 128–131', sub: '平方差公式的應用、和的平方公式填空等', tags: ['印13', '印14', '印15', '印16'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '對答案｜習作（基礎、精熟練習）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的本子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-1', [
            { label: '基礎練習（印 37–40）', cols: 2, items: [
              ['基 1', '基礎1'], ['基 2', '基礎2'], ['基 3', '基礎3'], ['基 4', '基礎4'], ['基 5', '基礎5'], ['基 6', '基礎6'], ['基 7', '基礎7']
            ] },
            { label: '精熟練習（印 40）', cols: 2, items: [
              ['精 1', '精熟1'], ['精 2', '精熟2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '習作・基礎練習', page: '印 37–38', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '習作・基礎練習', page: '印 38–40', sub: '基礎練習', tags: ['基礎5', '基礎6', '基礎7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '習作・基礎練習', page: '印 40', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '課本・自我評量', page: '印 133', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '課本・自我評量', page: '印 134', sub: '自我評量與錯誤診療', tags: ['自評4', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '對答案｜課堂評量 ①（選擇 1～10）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-1', [
            { label: '選擇 1～10（印 22–23）', cols: 4, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'], ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '對答案｜課堂評量 ②（填充、計算）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-1', [
            { label: '填充（印 23）', cols: 1, items: [
              ['填 1', '評填1'], ['填 2', '評填2']
            ] },
            { label: '計算（印 24）', cols: 2, items: [
              ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '試卷・課堂評量', page: '印 22', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課堂評量 ②（選擇 5～7）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '試卷・課堂評量', page: '印 22', sub: '選擇 5～7', tags: ['評選5', '評選6', '評選7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課堂評量 ③（選擇 8～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '試卷・課堂評量', page: '印 23', sub: '選擇 8～10', tags: ['評選8', '評選9', '評選10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課堂評量 ④（填充 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '試卷・課堂評量', page: '印 23', sub: '填充 1、2', tags: ['評填1', '評填2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜課堂評量 ⑤（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '試卷・課堂評量', page: '印 24', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '對答案｜習作附錄本（選擇、填充）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-1', [
            { label: '選擇（印 7）', cols: 4, items: [
              ['選 1', '附選1'], ['選 2', '附選2'], ['選 3', '附選3'], ['選 4', '附選4'], ['選 5', '附選5'], ['選 6', '附選6']
            ] },
            { label: '填充（印 7）', cols: 1, items: [
              ['填 1', '附填1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '習作・附錄本', page: '印 7', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
      {
        sec: '3-1', secName: '利用提公因式與乘法公式做因式分解',
        title: '檢討｜習作附錄本 ②（選擇 4～6、填充 1）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-1', [
            { src: '習作・附錄本', page: '印 7', sub: '選擇 4～6、填充 1', tags: ['附選4', '附選5', '附選6', '附填1'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課本隨堂 ①（常數項為質數、常數項為正數等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '課本・隨堂練習', page: '印 138–143', sub: '常數項為質數、常數項為正數等', tags: ['印4', '印6', '印7', '印9'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課本隨堂 ②（先提公因數、十字交乘法與乘法公式等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '課本・隨堂練習', page: '印 144–147', sub: '先提公因數、十字交乘法與乘法公式等', tags: ['印10', '印11', '印13'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜習作（基礎、精熟練習）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的本子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-2', [
            { label: '基礎練習（印 41–43）', cols: 1, items: [
              ['基 1', '基礎1'], ['基 2', '基礎2'], ['基 3', '基礎3'], ['基 4', '基礎4'], ['基 5', '基礎5']
            ] },
            { label: '精熟練習（印 44）', cols: 2, items: [
              ['精 1', '精熟1'], ['精 2', '精熟2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '習作・基礎練習', page: '印 41–42', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '習作・基礎練習', page: '印 43', sub: '基礎練習', tags: ['基礎4', '基礎5'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '習作・基礎練習', page: '印 44', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '課本・自我評量', page: '印 149', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3', '自評4'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '課本・自我評量', page: '印 150', sub: '自我評量與錯誤診療', tags: ['自評5', '自評6', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜課堂評量 ①（選擇 1～10）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-2', [
            { label: '選擇 1～10（印 25–26）', cols: 4, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'], ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜課堂評量 ②（填充、計算）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-2', [
            { label: '填充（印 26）', cols: 1, items: [
              ['填 1', '評填1'], ['填 2', '評填2']
            ] },
            { label: '計算（印 27）', cols: 2, items: [
              ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '試卷・課堂評量', page: '印 25', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課堂評量 ②（選擇 5～7）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '試卷・課堂評量', page: '印 25–26', sub: '選擇 5～7', tags: ['評選5', '評選6', '評選7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課堂評量 ③（選擇 8～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '試卷・課堂評量', page: '印 26', sub: '選擇 8～10', tags: ['評選8', '評選9', '評選10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課堂評量 ④（填充 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '試卷・課堂評量', page: '印 26', sub: '填充 1、2', tags: ['評填1', '評填2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜課堂評量 ⑤（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '試卷・課堂評量', page: '印 27', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '小考｜十字交乘法因式分解',
        points: [
          '因式分解下列各式，寫在紙上。',
          '按右上角 <b>🔍 放大</b> 投成整頁。'
        ],
        visual: (h) => { h.innerHTML = quizGrid(Q32); },
        caption: '共 14 題。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜小考（十字交乘法）',
        points: [
          '交換改：老師唸題號，學生照著改同學的紙。',
          '乘開回去，要和原式一樣。'
        ],
        visual: (h) => { h.innerHTML = quizGrid(Q32, K32); },
        caption: '兩個括號前後對調也對。'
      },

      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜補充題（因式分解十題）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），唸題號，照著改同學的講義。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '補充3', [
            { label: '第 1～10 題', cols: 2, items: [
              ['1', '補1'], ['2', '補2'], ['3', '補3'], ['4', '補4'], ['5', '補5'],
              ['6', '補6'], ['7', '補7'], ['8', '補8'], ['9', '補9'], ['10', '補10']
            ] }
          ]);
        },
        caption: '兩個括號前後對調也對。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜補充題 ①（第 1～4 題）',
        points: [
          '這是<b>因式分解十題</b>：對完答案就用這裡逐題檢討。',
          '題號跟講義一樣，唸題號、翻講義。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '補充3', [
            { src: '試卷・補充題', page: '老師補充', sub: '第 1～4 題', tags: ['補1', '補2', '補3', '補4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜補充題 ②（第 5～7 題）',
        points: [
          '這是<b>因式分解十題</b>：對完答案就用這裡逐題檢討。',
          '題號跟講義一樣，唸題號、翻講義。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '補充3', [
            { src: '試卷・補充題', page: '老師補充', sub: '第 5～7 題', tags: ['補5', '補6', '補7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜補充題 ③（第 8～10 題）',
        points: [
          '這是<b>因式分解十題</b>：對完答案就用這裡逐題檢討。',
          '題號跟講義一樣，唸題號、翻講義。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '補充3', [
            { src: '試卷・補充題', page: '老師補充', sub: '第 8～10 題', tags: ['補8', '補9', '補10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完照題號挑。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '對答案｜習作附錄本（選擇、填充）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '3-2', [
            { label: '選擇（印 8）', cols: 4, items: [
              ['選 1', '附選1'], ['選 2', '附選2'], ['選 3', '附選3'], ['選 4', '附選4'], ['選 5', '附選5'], ['選 6', '附選6']
            ] },
            { label: '填充（印 8）', cols: 1, items: [
              ['填 1', '附填1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '習作・附錄本', page: '印 8', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
      {
        sec: '3-2', secName: '利用十字交乘法做因式分解',
        title: '檢討｜習作附錄本 ②（選擇 4～6、填充 1）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '3-2', [
            { src: '習作・附錄本', page: '印 8', sub: '選擇 4～6、填充 1', tags: ['附選4', '附選5', '附選6', '附填1'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜課習基礎卷 ①（選擇 1～10）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '選擇 1～10（印 1）', cols: 3, items: [
              ['1', '基選1'], ['2', '基選2'], ['3', '基選3'], ['4', '基選4'], ['5', '基選5'], ['6', '基選6'], ['7', '基選7'], ['8', '基選8'], ['9', '基選9'], ['10', '基選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜課習基礎卷 ②（填充、計算）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '填充 1～2（印 1）', cols: 3, items: [
              ['填 1(1)', '基填1'], ['填 1(2)', '基填1(2)'], ['填 1(3)', '基填1(3)'], ['填 2', '基填2']
            ] },
            { label: '填充 3～4（印 2）', cols: 3, items: [
              ['填 3(1)', '基填3'], ['填 3(2)', '基填3(2)'], ['填 3(3)', '基填3(3)'], ['填 4', '基填4']
            ] },
            { label: '計算（印 2）', cols: 2, items: [
              ['計 1', '基計1'], ['計 2', '基計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ①（選擇 1～4）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 1', sub: '選擇 1～4', tags: ['基選1', '基選2', '基選3', '基選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ②（選擇 5～7）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 1', sub: '選擇 5～7', tags: ['基選5', '基選6', '基選7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ③（選擇 8～10）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 1', sub: '選擇 8～10', tags: ['基選8', '基選9', '基選10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ④（填充 1、2）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 1', sub: '填充 1、2', tags: ['基填1', '基填1(2)', '基填1(3)', '基填2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ⑤（填充 3、4）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 2', sub: '填充 3、4', tags: ['基填3', '基填3(2)', '基填3(3)', '基填4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習基礎卷 ⑥（計算 1、2）',
        points: [
          '這是<b>第二次段考的課習基礎卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習基礎卷', page: '印 2', sub: '計算 1、2', tags: ['基計1', '基計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜課習類題卷 ①（選擇 1～12）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '選擇 1～12（印 1）', cols: 3, items: [
              ['1', '類選1'], ['2', '類選2'], ['3', '類選3'], ['4', '類選4'], ['5', '類選5'], ['6', '類選6'], ['7', '類選7'], ['8', '類選8'], ['9', '類選9'], ['10', '類選10'], ['11', '類選11'], ['12', '類選12']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜課習類題卷 ②（填充、計算）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '填充 1～2（印 1）', cols: 3, items: [
              ['填 1(1)', '類填1'], ['填 1(2)', '類填1(2)'], ['填 2', '類填2']
            ] },
            { label: '填充 3～7（印 2）', cols: 2, items: [
              ['填 3(1)(2)', '類填3'], ['填 3(3)(4)', '類填3(3)(4)'], ['填 4', '類填4'], ['填 5', '類填5'], ['填 6', '類填6'], ['填 7', '類填7']
            ] },
            { label: '計算（印 2）', cols: 3, items: [
              ['計 1(1)', '類計1'], ['計 1(2)', '類計1(2)'], ['計 2', '類計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ①（選擇 1～4）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 1', sub: '選擇 1～4', tags: ['類選1', '類選2', '類選3', '類選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ②（選擇 5～8）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 1', sub: '選擇 5～8', tags: ['類選5', '類選6', '類選7', '類選8'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ③（選擇 9～12）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 1', sub: '選擇 9～12', tags: ['類選9', '類選10', '類選11', '類選12'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ④（填充 1、2）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 1', sub: '填充 1、2', tags: ['類填1', '類填1(2)', '類填2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ⑤（填充 3、4）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 2', sub: '填充 3、4', tags: ['類填3', '類填3(3)(4)', '類填4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ⑥（填充 5～7）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 2', sub: '填充 5～7', tags: ['類填5', '類填6', '類填7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜課習類題卷 ⑦（計算 1、2）',
        points: [
          '這是<b>第二次段考的課習類題卷</b>（範圍 2-2～3-2）：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・段考課習類題卷', page: '印 2', sub: '計算 1、2', tags: ['類計1', '類計1(2)', '類計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜核心概念重點卷 ①（2-2）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '2-2（印 1）', cols: 3, items: [
              ['概1-1', '核2-2概1-1'], ['概2-1', '核2-2概2-1'], ['概2-2', '核2-2概2-2'], ['概3-1', '核2-2概3-1'], ['概3-2', '核2-2概3-2'], ['概4-1', '核2-2概4-1'], ['概4-2', '核2-2概4-2'], ['概4-3', '核2-2概4-3'], ['概4-4', '核2-2概4-4']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜核心概念重點卷 ②（2-3）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '2-3（印 1）', cols: 3, items: [
              ['概1-1', '核2-3概1-1'], ['概2-1', '核2-3概2-1'], ['概3-1', '核2-3概3-1'], ['概4-1', '核2-3概4-1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜核心概念重點卷 ③（3-1）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '3-1（印 2）', cols: 3, items: [
              ['概1-1', '核3-1概1-1'], ['概2-1', '核3-1概2-1'], ['概3-1', '核3-1概3-1'], ['概4-1', '核3-1概4-1'], ['概5-1', '核3-1概5-1'], ['概6-1', '核3-1概6-1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '對答案｜核心概念重點卷 ④（3-2）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '段2', [
            { label: '3-2（印 2）', cols: 3, items: [
              ['概1-1', '核3-2概1-1'], ['概2-1', '核3-2概2-1'], ['概2-2', '核3-2概2-2'], ['概3-1', '核3-2概3-1'], ['概3-2', '核3-2概3-2'], ['概4-1', '核3-2概4-1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ①（2-2 概念 1、2）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 1', sub: '2-2 概念 1、2', tags: ['核2-2概1-1', '核2-2概2-1', '核2-2概2-2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ②（2-2 概念 3）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 1', sub: '2-2 概念 3', tags: ['核2-2概3-1', '核2-2概3-2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ③（2-2 概念 4）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 1', sub: '2-2 概念 4', tags: ['核2-2概4-1', '核2-2概4-2', '核2-2概4-3', '核2-2概4-4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ④（2-3 概念 1、2、3、4）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 1', sub: '2-3 概念 1、2、3、4', tags: ['核2-3概1-1', '核2-3概2-1', '核2-3概3-1', '核2-3概4-1'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '補充題｜颱風暴風圈（2-3 概念 1、2、3、4）',
        points: [
          '先在坐標平面上找出<b>颱風中心到墾丁的距離</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '補充4', [
            { src: '試卷・補充題', page: '老師補充', sub: '颱風暴風圈', tags: ['補1'] }
          ]);
        },
        caption: '先自己算，再點題號對詳解。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ⑤（3-1 概念 1、2、3、4）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 2', sub: '3-1 概念 1、2、3、4', tags: ['核3-1概1-1', '核3-1概2-1', '核3-1概3-1', '核3-1概4-1'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ⑥（3-1 概念 5、6）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 2', sub: '3-1 概念 5、6', tags: ['核3-1概5-1', '核3-1概6-1'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ⑦（3-2 概念 1、2）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 2', sub: '3-2 概念 1、2', tags: ['核3-2概1-1', '核3-2概2-1', '核3-2概2-2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '段考', secName: '第二次（2-2～3-2）',
        title: '檢討｜核心概念重點卷 ⑧（3-2 概念 3、4）',
        points: [
          '這是<b>第二次段考的核心概念重點卷</b>：一節一節、一個概念一個概念，把填空的每一格補成完整算式。',
          '題號跟紙本一樣，老師唸題號、學生翻卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '段2', [
            { src: '試卷・核心概念重點卷', page: '印 2', sub: '3-2 概念 3、4', tags: ['核3-2概3-1', '核3-2概3-2', '核3-2概4-1'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '總習題', secName: '習作（3-1～3-2）',
        title: '對答案｜習作總習題',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的本子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '第3章', [
            { label: '選擇 1～4（印 45）', cols: 3, items: [
              ['選 1', '總選1'], ['選 2', '總選2'], ['選 3', '總選3'], ['選 4', '總選4']
            ] },
            { label: '填充 1～2（印 46）', cols: 3, items: [
              ['填 1 ①', '總填1 ①'], ['填 1 ②', '總填1 續'], ['填 2 ①', '總填2 ①'], ['填 2 ②', '總填2 ②'], ['填 2 ③', '總填2 續'], ['填 2 ④', '總填2 續一']
            ] },
            { label: '計算 1（印 47）、素養選讀（印 48）', cols: 3, items: [
              ['計 1 ①', '總計1 ①'], ['計 1 ②', '總計1 續'], ['計 1 ③', '總計1 續一'], ['素 1 ①', '總素1 ①'], ['素 1 ②', '總素1 續'], ['素 2', '總素2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '總習題', secName: '習作（3-1～3-2）',
        title: '檢討｜習作總習題 ①（選擇 1～4）',
        points: [
          '這是<b>第 3 章的習作總習題</b>（範圍 3-1～3-2）：改完作業就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻習作；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・總習題', page: '印 45', sub: '選擇 1～4', tags: ['總選1', '總選2', '總選3', '總選4'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '總習題', secName: '習作（3-1～3-2）',
        title: '檢討｜習作總習題 ②（填充 1～2）',
        points: [
          '這是<b>第 3 章的習作總習題</b>（範圍 3-1～3-2）：改完作業就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻習作；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・總習題', page: '印 46', sub: '填充 1～2', tags: ['總填1', '總填2'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '總習題', secName: '習作（3-1～3-2）',
        title: '檢討｜習作總習題 ③（計算 1）',
        points: [
          '這是<b>第 3 章的習作總習題</b>（範圍 3-1～3-2）：改完作業就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻習作；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・總習題', page: '印 47', sub: '計算 1', tags: ['總計1'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '總習題', secName: '習作（3-1～3-2）',
        title: '檢討｜習作總習題 ④（素養選讀）',
        points: [
          '這是<b>第 3 章的習作總習題</b>（範圍 3-1～3-2）：改完作業就用這裡逐題檢討。',
          '題號跟紙本一樣，老師唸題號、學生翻習作；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・總習題', page: '印 48', sub: '素養選讀 1～2', tags: ['總素1', '總素2'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },

      {
        sec: '附錄本', secName: '精熟、素養題型',
        title: '檢討｜習作附錄本（精熟題型）',
        points: [
          '這是<b>習作附錄本的精熟題型</b>，一章一份，兩題依序對應 3-1、3-2。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・附錄本（精熟題型）', page: '印 16', sub: '精熟題型 1～2', tags: ['附精1', '附精2'] }
          ]);
        },
        caption: '一頁最多四題；這一類是整章的綜合題，沒有對答案頁。'
      },

      {
        sec: '附錄本', secName: '精熟、素養題型',
        title: '檢討｜習作附錄本（素養題型）',
        points: [
          '這是<b>習作附錄本的素養題型</b>，一章一份，跨整章。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '習作・附錄本（素養題型）', page: '印 22', sub: '素養題型 1', tags: ['附素1(1)', '附素1(2)', '附素1(3)'] }
          ]);
        },
        caption: '一頁最多四題；這一類是整章的綜合題，沒有對答案頁。'
      },

      {
        sec: '會考練習', secName: '試卷（3-1～3-2）',
        title: '對答案｜會考試題練習卷',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁，老師唸題號，學生照著改同學的卷子。',
          '改完再往後翻——後面每一頁是<b>逐題詳解</b>，點題號就展開。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '第3章', [
            { label: '3-1 第 1～3 題（印 1）', cols: 3, items: [
              ['1', '會1'], ['2', '會2'], ['3', '會3']
            ] },
            { label: '3-2 第 4～7 題（印 2）', cols: 4, items: [
              ['4', '會4'], ['5', '會5'], ['6', '會6'], ['7', '會7']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '會考練習', secName: '試卷（3-1～3-2）',
        title: '檢討｜會考試題練習卷 ①（第 1～3 題）',
        points: [
          '這是<b>第 3 章的會考試題練習卷</b>：7 題都是歷屆會考的選擇題，題首標著哪一年。',
          '題號跟卷子一樣，老師唸題號、學生看卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '試卷・會考試題練習卷', page: '印 1', sub: '3-1 第 1～3 題', tags: ['會1', '會2', '會3'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '會考練習', secName: '試卷（3-1～3-2）',
        title: '檢討｜會考試題練習卷 ②（第 4～7 題）',
        points: [
          '這是<b>第 3 章的會考試題練習卷</b>：7 題都是歷屆會考的選擇題，題首標著哪一年。',
          '題號跟卷子一樣，老師唸題號、學生看卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第3章', [
            { src: '試卷・會考試題練習卷', page: '印 2', sub: '3-2 第 4～7 題', tags: ['會4', '會5', '會6', '會7'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
    ]
  });
})();
