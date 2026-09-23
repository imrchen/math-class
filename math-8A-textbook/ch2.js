window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || '#172033'}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"/>`;
  const INK = '#172033', GREY = '#8a94a6';

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
    ch: 2,
    title: '平方根與畢氏定理',
    color: C,
    sections: ['2-1 平方根與近似值', '2-2 根式的運算', '2-3 畢氏定理'],
    slides: [

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課本隨堂 ①（根號的意義、比大小）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '課本・隨堂練習', page: '印 62–64', sub: '根號的意義、比大小', tags: ['印5', '印6', '印7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課本隨堂 ②（完全平方數、分數與小數）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '課本・隨堂練習', page: '印 66–68', sub: '完全平方數、分數與小數', tags: ['印9', '印10', '印11'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課本隨堂 ③（十分逼近法、平方根）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '課本・隨堂練習', page: '印 69–71', sub: '十分逼近法、平方根', tags: ['印12', '印13', '印14'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
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
          PRACTICE.answerKey(h, '2-1', [
            { label: '基礎練習（印 19–22）', cols: 4, items: [
              ['基 1', '基礎1'], ['2 ①', '基礎2 ①'], ['2 ②', '基礎2 ②'], ['基 3', '基礎3'],
              ['4 ①', '基礎4 ①'], ['4 ②', '基礎4 ②'], ['5 ①', '基礎5 ①'], ['5 ②', '基礎5 ②'],
              ['基 6', '基礎6'], ['基 7', '基礎7']
            ] },
            { label: '精熟練習（印 22）', cols: 2, items: [
              ['精 1', '精熟1'], ['精 2', '精熟2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・基礎練習', page: '印 19–22', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・基礎練習', page: '印 19–22', sub: '基礎練習', tags: ['基礎5', '基礎6', '基礎7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・基礎練習', page: '印 22', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '課本・自我評量', page: '印 73–74', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3', '自評4'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '課本・自我評量', page: '印 73–74', sub: '自我評量與錯誤診療', tags: ['自評5', '自評6', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
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
          PRACTICE.answerKey(h, '2-1', [
            { label: '選擇 1～10（印 11）', cols: 4, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'],
              ['5', '評選5'], ['6', '評選6'], ['7', '評選7'], ['8', '評選8'],
              ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
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
          PRACTICE.answerKey(h, '2-1', [
            { label: '填充（印 12）', cols: 1, items: [
              ['填 1', '評填1'],
              ['填 2', '評填2'],
              ['填 3', '評填3'],
              ['填 4', '評填4']
            ] },
            { label: '計算（印 12）', cols: 3, items: [
              ['評計1 ①', '評計1 ①'], ['評計1 ②', '評計1 ②'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・課堂評量', page: '印 11–12', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課堂評量 ②（選擇 5～8）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・課堂評量', page: '印 11–12', sub: '選擇 5～8', tags: ['評選5', '評選6', '評選7', '評選8'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課堂評量 ③（選擇 9～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・課堂評量', page: '印 11–12', sub: '選擇 9～10', tags: ['評選9', '評選10'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課堂評量 ④（填充 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・課堂評量', page: '印 11–12', sub: '填充 1～4', tags: ['評填1', '評填2', '評填3', '評填4'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜課堂評量 ⑤（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '試卷・課堂評量', page: '印 11–12', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
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
          PRACTICE.answerKey(h, '2-1', [
            { label: '選擇（印 4）', cols: 4, items: [
              ['選 1', '附選1'], ['選 2', '附選2'], ['選 3', '附選3'], ['選 4', '附選4'],
              ['選 5', '附選5'], ['選 6', '附選6']
            ] },
            { label: '填充（印 4）', cols: 4, items: [
              ['填 1', '附填1'], ['填 2', '附填2'], ['填 3', '附填3'], ['填 4', '附填4']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・附錄本', page: '印 4', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作附錄本 ②（選擇 4～6）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・附錄本', page: '印 4', sub: '選擇 4～6', tags: ['附選4', '附選5', '附選6'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '檢討｜習作附錄本 ③（填充 1～4）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-1', [
            { src: '習作・附錄本', page: '印 4', sub: '填充 1～4', tags: ['附填1', '附填2', '附填3', '附填4'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號 9 是一個數，「9 的平方根」是兩個數',
        points: [
          '符號 <b>√</b> 只取<b>正</b>的那一個；名詞<span class="k">平方根</span>是<b>正負兩個</b>。',
          '兩種問法只差一個負號，但答案的<b>個數</b>不一樣，考題最愛在這裡分勝負。',
          '拖滑桿換數字，把兩欄的答案<b>並排看</b>。'
        ],
        formula: { label: '同一個數，兩種問法<span class="pgref">課本 印 69–70</span>', tex: '\\sqrt{9}=3\\quad\\text{但}\\quad 9\\text{ 的平方根}=\\pm3' },
        visual: (h) => {
          const D = [
            { n: '9', r: '3' }, { n: '16', r: '4' }, { n: '25', r: '5' },
            { n: '49', r: '7' }, { n: '144', r: '12' }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>數字 <span class="ival" id="nv">9</span></label>
            <input type="range" id="ns" min="0" max="4" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#ns').value, d = D[i];
            h.querySelector('#nv').textContent = d.n;
            let s = '';
            s += BOX(28, 34, 180, 150, { r: 14, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2.2 });
            s += TX(118, 62, '符號問法', { anchor: 'middle', fs: 14, c: BLU });
            s += TX(118, 104, RT(d.n), { anchor: 'middle', fs: 30, c: INK });
            s += TX(118, 150, '＝ ' + d.r, { anchor: 'middle', fs: 26, c: BLU });
            s += TX(118, 174, '一個數', { anchor: 'middle', fs: 13, c: GREY });
            s += BOX(232, 34, 180, 150, { r: 14, fill: 'rgba(225,29,72,.07)', stroke: RED, sw: 2.2 });
            s += TX(322, 62, '名詞問法', { anchor: 'middle', fs: 14, c: RED });
            s += TX(322, 104, d.n + ' 的平方根', { anchor: 'middle', fs: 19, c: INK });
            s += TX(322, 150, '＝ ±' + d.r, { anchor: 'middle', fs: 26, c: RED });
            s += TX(322, 174, '兩個數', { anchor: 'middle', fs: 13, c: GREY });
            s += TX(220, 216, '差的不只是符號，是「有幾個答案」', { anchor: 'middle', fs: 16, c: AMB });
            s += TX(220, 244, '(' + d.r + ')² ＝ ' + d.n + '，(−' + d.r + ')² 也 ＝ ' + d.n, { anchor: 'middle', fs: 15, c: GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 262', s);
            radBars(h);
          };
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '看到「求…的平方根」就要寫 <b>±</b>；看到 <b>√</b> 就只寫正的。',
        example: {
          q: '「\\(16\\) 的平方根」與 \\(\\sqrt{16}\\) 分別是多少？',
          steps: [
            '平方根問的是「平方後等於 16 的數」，正負都算。',
            '\\(\\sqrt{\\;}\\) 只取正的那一個。'
          ],
          ans: '\\(\\pm4\\) 與 \\(4\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號裡不能是負數，根號 0 就是 0',
        points: [
          '\\(\\sqrt{a}\\) 要有意義，<b>\\(a\\) 必須 ≥ 0</b>；\\(\\sqrt{0}=0\\)。',
          '負數<b>在國中階段</b>沒有平方根——這五個字要記著，高中會補回來。',
          '考題常反過來問：「\\(\\sqrt{x-3}\\) 有意義，\\(x\\) 是多少？」拖滑桿看邊界在哪。'
        ],
        formula: { label: '有意義的條件<span class="pgref">課本 印 61–62</span>', tex: '\\sqrt{a}\\ \\text{有意義}\\iff a\\ge 0' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>a ＝ <span class="ival" id="av">9</span></label>
            <input type="range" id="as" min="-6" max="16" step="1" value="9"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            const ok = a >= 0;
            const X0 = 40, W = 360, mid = X0 + W * (6 / 22);
            let s = '';

            s += `<line x1="${X0}" y1="72" x2="${X0 + W}" y2="72" stroke="#c9d3e2" stroke-width="2.4"/>`;
            s += `<rect x="${X0}" y="64" width="${mid - X0}" height="16" fill="rgba(225,29,72,.16)"/>`;
            s += `<rect x="${mid}" y="64" width="${X0 + W - mid}" height="16" fill="rgba(5,150,105,.16)"/>`;
            s += TX(mid, 52, '0', { anchor: 'middle', fs: 14, c: INK });
            s += TX((X0 + mid) / 2, 104, '負數：沒有意義', { anchor: 'middle', fs: 13.5, c: RED });
            s += TX((mid + X0 + W) / 2, 104, 'a ≥ 0：可以開根號', { anchor: 'middle', fs: 13.5, c: GRN });
            const px = X0 + W * ((a + 6) / 22);
            s += `<circle cx="${px}" cy="72" r="7" fill="${ok ? GRN : RED}"/>`;

            s += BOX(96, 128, 248, 74, { r: 14, fill: ok ? 'rgba(5,150,105,.08)' : 'rgba(225,29,72,.08)', stroke: ok ? GRN : RED, sw: 2.2 });
            if (ok) {
              const r = Math.sqrt(a);
              const exact = Number.isInteger(r);
              s += TX(220, 162, RT(a) + (exact ? ' ＝ ' + r : ' ≒ ' + r.toFixed(2)), { anchor: 'middle', fs: 24, c: GRN });
              s += TX(220, 188, exact ? '完全平方數，開得乾淨' : '開不盡，只能寫近似值', { anchor: 'middle', fs: 13, c: GREY });
            } else {
              s += TX(220, 160, RT(a), { anchor: 'middle', fs: 24, c: RED });
              s += TX(220, 188, '在國中階段沒有意義', { anchor: 'middle', fs: 14, c: RED });
            }
            s += TX(220, 236, a === 0 ? '注意：' + RT(0) + ' ＝ 0，0 是可以的' : '把滑桿拖到 0 看看', { anchor: 'middle', fs: 14.5, c: a === 0 ? GRN : GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 258', s);
            radBars(h);
          };
          h.querySelector('#as').oninput = draw;
          draw();
        },
        caption: '「<b>於國中階段</b>」這五個字要唸出來——高中把數系擴大後就不是這樣了。',
        example: {
          q: '若 \\(\\sqrt{x-3}\\) 有意義，求 \\(x\\) 的範圍。',
          steps: [
            '根號內要 ≥ 0，所以 \\(x-3\\ge 0\\)。',
            '解得 \\(x\\ge 3\\)。'
          ],
          ans: '\\(x\\ge 3\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '帶分數不能拆開開根號，先化成假分數',
        points: [
          '\\(4\\frac{1}{9}\\) 的平方根<b>不是</b> \\(\\pm2\\frac{1}{3}\\)——整數和分數不能各開各的。',
          '固定流程：<b>先化假分數</b>，再分子分母各自開。',
          '不確定就<b>平方回去驗算</b>，對不起來就是錯的。'
        ],
        formula: { label: '固定流程<span class="pgref">課本 印 63 例 2</span>', tex: '\\text{帶分數}\\rightarrow\\text{假分數}\\rightarrow\\text{分子分母各開}' },
        visual: (h) => {
          const row = (y, t, fs, c) => TX(220, y, t, { anchor: 'middle', fs: fs || 20, c: c || INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '求 4又1/9 的平方根。很多人直接拆成「整數 4、分數 1/9」各開各的。',
              d: () => row(72, '求 4 又 1/9 的平方根', 20) },
            { t: '錯誤示範：拆開後得 ±2又1/3。<b>驗算就會發現不對</b>。',
              d: () => row(64, '求 4 又 1/9 的平方根', 18, GREY) +
                       BOX(46, 92, 348, 84, { r: 12, fill: 'rgba(225,29,72,.08)', stroke: RED, sw: 2 }) +
                       TX(66, 116, '✗ 拆開各開各的', { fs: 13, c: RED }) +
                       row(146, '± 2 又 1/3', 22, RED) +
                       row(206, '驗算：(2又1/3)² ＝ (7/3)² ＝ 49/9', 15, RED) +
                       row(232, '但 4又1/9 ＝ 37/9，49/9 ≠ 37/9', 15, RED) },
            { t: '正確第一步：<b>先化成假分數</b>。4×9＋1 ＝ 37，所以是 37/9。',
              d: () => row(72, '4 又 1/9 ＝ 37/9', 22, GRN) +
                       row(120, '4 × 9 ＋ 1 ＝ 37', 16, GREY) +
                       BOX(96, 150, 248, 60, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 }) +
                       row(190, '分子 37、分母 9', 18, GRN) },
            { t: '再分子分母各自開：分母 9 開得盡是 3，分子 37 開不盡就留根號。',
              d: () => row(72, '37/9 的平方根', 20, GREY) +
                       BOX(96, 106, 248, 74, { r: 14, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 }) +
                       row(156, '± ' + RT(37) + ' / 3', 26, GRN) +
                       row(216, '分母開得盡，分子開不盡就留著', 15, GREY) }
          ], { acc: false });
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '同一個流程也用在小數：先化分數，不要憑感覺移小數點。',
        example: {
          q: '求 \\(2\\frac{1}{4}\\) 的平方根。',
          steps: [
            '先化假分數：\\(2\\frac14=\\frac94\\)。',
            '分子分母各開：\\(\\sqrt9=3\\)、\\(\\sqrt4=2\\)，平方根要正負兩個。'
          ],
          ans: '\\(\\pm\\dfrac32\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '用兩個完全平方數把它夾住，整數部分就出來了',
        points: [
          '找<b>剛好夾住</b>它的兩個完全平方數，答案就在那兩個整數之間。',
          '這是<span class="k">會考常客</span>，而且是基本題——只吃平方數背不背得熟。',
          '拖滑桿換數字，看夾住它的是哪一組。'
        ],
        formula: { label: '夾擠的依據<span class="pgref">課本 印 65</span>', tex: 'a>b>0\\ \\Longrightarrow\\ \\sqrt{a}>\\sqrt{b}' },
        visual: (h) => {
          const D = [13, 29.5, 55, 90, 220, 2022];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>求 根號 <span class="ival" id="nv">13</span> 的整數部分</label>
            <input type="range" id="ns" min="0" max="5" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#ns').value, a = D[i];
            h.querySelector('#nv').textContent = a;
            const lo = Math.floor(Math.sqrt(a)), hi = lo + 1;
            let s = '';
            s += TX(220, 46, RT(a) + ' 介於哪兩個整數之間？', { anchor: 'middle', fs: 17, c: INK });

            const bw = 118, y = 74;
            s += BOX(26, y, bw, 66, { r: 12, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2 });
            s += TX(85, y + 28, lo + '² ＝ ' + lo * lo, { anchor: 'middle', fs: 17, c: GRN });
            s += TX(85, y + 52, '比它小', { anchor: 'middle', fs: 12.5, c: GREY });
            s += BOX(161, y, bw, 66, { r: 12, fill: 'rgba(124,58,237,.10)', stroke: VIO, sw: 2.2 });
            s += TX(220, y + 34, a, { anchor: 'middle', fs: 21, c: VIO });
            s += BOX(296, y, bw, 66, { r: 12, fill: 'rgba(225,29,72,.08)', stroke: RED, sw: 2 });
            s += TX(355, y + 28, hi + '² ＝ ' + hi * hi, { anchor: 'middle', fs: 17, c: RED });
            s += TX(355, y + 52, '比它大', { anchor: 'middle', fs: 12.5, c: GREY });
            s += TX(220, 166, lo * lo + ' ＜ ' + a + ' ＜ ' + hi * hi, { anchor: 'middle', fs: 18, c: INK });
            s += BOX(110, 182, 220, 50, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 });
            s += TX(220, 214, lo + ' ＜ ' + RT(a) + ' ＜ ' + hi, { anchor: 'middle', fs: 20, c: GRN });
            s += TX(220, 252, '所以整數部分是 ' + lo + (a === 2022 ? '（111 會考，通過率 75%）' : (a === 29.5 ? '（109 會考）' : '')),
              { anchor: 'middle', fs: 14, c: GREY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 266', s);
            radBars(h);
          };
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '會考考過兩次同型題，都只吃這一招。<b>平方數 11²～22² 要背熟</b>。',
        example: {
          q: '\\(\\sqrt{2022}\\) 介於哪兩個連續整數之間？',
          steps: [
            '找夾住 2022 的完全平方數：\\(44^2=1936\\)、\\(45^2=2025\\)。',
            '\\(1936<2022<2025\\)，所以 \\(44<\\sqrt{2022}<45\\)。'
          ],
          ans: '\\(44\\) 與 \\(45\\) 之間'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '十分逼近法是看表判讀，不是硬算',
        points: [
          '數據由老師提供，你的工作是<b>判斷落在哪一格</b>，不是徒手算小數平方。',
          '只逼到<b>小數第一位</b>；比的是「離誰比較近」，不是比大小。',
          '根號內是<b>非整數</b>的不用這招，那要用計算機。'
        ],
        formula: { label: '逼近的依據<span class="pgref">課本 印 66</span>', tex: '0\\lt a\\lt b\\ \\Longrightarrow\\ \\sqrt{a}\\lt\\sqrt{b}' },
        visual: (h) => {
          const cell = (x, y, w, t, o = {}) =>
            BOX(x, y, w, 40, { r: 9, fill: o.fill || '#fbfcfe', stroke: o.stroke || '#dce3ee', sw: o.sw || 1.6 }) +
            TX(x + w / 2, y + 26, t, { anchor: 'middle', fs: o.fs || 15, c: o.c || INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '要估 根號 5。先用整數夾：2²＝4 太小、3²＝9 太大。',
              d: () => TX(220, 44, RT(5) + ' 大約是多少？', { anchor: 'middle', fs: 18 }) +
                       cell(60, 70, 150, '2² ＝ 4 ＜ 5', { c: GRN }) +
                       cell(230, 70, 150, '3² ＝ 9 ＞ 5', { c: RED }) +
                       TX(220, 152, '2 ＜ ' + RT(5) + ' ＜ 3', { anchor: 'middle', fs: 20, c: INK }) +
                       TX(220, 190, '整數部分是 2，接著抓小數第一位', { anchor: 'middle', fs: 14, c: GREY }) },
            { t: '老師給表：2.1 到 2.3 的平方。你只要看 5 掉進哪一格。',
              d: () => TX(220, 40, '老師提供的數據', { anchor: 'middle', fs: 15, c: GREY }) +
                       cell(28, 58, 124, '2.1² ＝ 4.41') +
                       cell(158, 58, 124, '2.2² ＝ 4.84', { fill: 'rgba(5,150,105,.10)', stroke: GRN, c: GRN }) +
                       cell(288, 58, 124, '2.3² ＝ 5.29', { fill: 'rgba(225,29,72,.08)', stroke: RED, c: RED }) +
                       TX(220, 140, '4.84 ＜ 5 ＜ 5.29', { anchor: 'middle', fs: 19 }) +
                       TX(220, 178, '所以 2.2 ＜ ' + RT(5) + ' ＜ 2.3', { anchor: 'middle', fs: 19, c: VIO }) },
            { t: '取哪一端？比的是<b>離 5 比較近</b>，不是比大小。',
              d: () => TX(220, 44, '5 離誰比較近？', { anchor: 'middle', fs: 18 }) +
                       cell(46, 70, 160, '5 − 4.84 ＝ 0.16', { fill: 'rgba(5,150,105,.10)', stroke: GRN, c: GRN }) +
                       cell(234, 70, 160, '5.29 − 5 ＝ 0.29', { c: GREY }) +
                       TX(220, 152, '0.16 ＜ 0.29，離 2.2 比較近', { anchor: 'middle', fs: 17, c: GRN }) +
                       BOX(140, 176, 160, 50, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 }) +
                       TX(220, 208, RT(5) + ' ≒ 2.2', { anchor: 'middle', fs: 22, c: GRN }) },
            { t: '注意寫法：這是<b>近似值</b>，用 ≒ 不是 ＝。到小數第一位就停。',
              d: () => BOX(96, 74, 248, 62, { r: 14, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 }) +
                       TX(220, 114, RT(5) + ' ≒ 2.2', { anchor: 'middle', fs: 26, c: GRN }) +
                       TX(220, 172, '小數平方最常漏位：1.4² ＝ 1.96，不是 19.6', { anchor: 'middle', fs: 14.5, c: RED }) +
                       TX(220, 206, '根號內不是整數就別用這招，改用計算機', { anchor: 'middle', fs: 14.5, c: AMB }) }
          ], { acc: false });
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '官方設計就是「老師提供數據、學生判別」——考的是概念，不是計算力。',
        example: {
          q: '已知 \\(2.2^2=4.84\\)、\\(2.3^2=5.29\\)，求 \\(\\sqrt5\\) 到小數第一位。',
          steps: [
            '\\(4.84<5<5.29\\)，所以 \\(2.2<\\sqrt5<2.3\\)。',
            '\\(5-4.84=0.16\\)、\\(5.29-5=0.29\\)，離 \\(2.2\\) 較近。'
          ],
          ans: '\\(\\sqrt5\\fallingdotseq2.2\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '計算機的按法：11 → SHIFT → x²',
        points: [
          '<b>沒有「√ 鍵」</b>：\\(\\sqrt{\\ }\\) 是黃字，印在 <b>x²</b> 上面。',
          '先輸入 <b>11</b>，再按 <b>SHIFT</b>、<b>x²</b>——<b>不用按 ＝</b>。',
          '螢幕給的是<b>近似值</b>：那一長串乘自己不會剛好是 11。'
        ],
        formula: { label: '近似值<span class="pgref">課本 印 68</span>', tex: '\\sqrt{11}\\fallingdotseq3.317' },
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
          const lcd = (txt) => TX(BX + BW - 18, BY + 52, txt, { anchor: 'end', fs: 21, c: '#2b3320' });
          const RX = 272;
          const NOTE = [
            ['① 1　② 1', INK, 16],
            ['③ SHIFT', AMB, 16],
            ['④ x²（上面那個黃色 √）', AMB, 14.5],
            ['3.31662479', GRN, 16]
          ];
          const notes = (n) => NOTE.slice(0, n)
            .map(([t, c, fs], i) => TX(RX, 66 + i * 34, t, { fs, c })).join('');
          SV.stepper(h, '0 0 440 300', [
            {
              t: '先輸入<b>被開方數</b>：1、1。螢幕上是 11。',
              d: () => body() + keys(['1']) + lcd('11') + notes(1)
            },
            {
              t: '再按 <b>SHIFT</b>（左上角那顆）。',
              d: () => body() + keys(['SHIFT']) + lcd('11') + notes(2)
            },
            {
              t: '按 <b>x²</b>——黃色的 √ 就印在它上面，<b>不用按 ＝</b>。',
              d: () => body() + keys(['x²']) + lcd('3.31662479') + notes(4)
            },
            {
              t: '習作要四捨五入到<b>小數第三位</b> → 3.317；但它<b>乘自己不會剛好是 11</b>。',
              d: () => body() + keys([]) + lcd('3.31662479') + notes(4) +
                BOX(RX - 8, 214, 152, 38, { r: 10, fill: '#eef7f2', stroke: GRN, sw: 2 }) +
                TX(RX + 68, 239, RT(11) + ' ≒ 3.317', { anchor: 'middle', fs: 18, c: GRN }) +
                TX(RX, 272, '乘自己 ＝ 10.99999…', { fs: 12.5, c: AMB }) +
                TX(RX, 292, '很接近 11，但不是 11', { fs: 13.5, c: RED })
            }
          ], { acc: false });
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '鍵位照南一線上計算機重畫（三角函數與括號那兩排本節用不到，省略）。習作基礎 4 就是這一題。',
        example: {
          q: '自我評量錯誤診療：小明按出 \\(3.16227766\\)，就說 \\(\\sqrt{10}=3.16227766\\)。對嗎？',
          steps: [
            '把它乘自己：\\(3.16227766^2=9.99999999\\ldots\\)，不是 \\(10\\)。',
            '螢幕只有那麼寬，顯示的是<b>近似值</b>。'
          ],
          ans: '不對，只能寫 \\(\\sqrt{10}\\fallingdotseq3.16\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '說 b 是 a 的平方根，就把 b 平方回去看看',
        points: [
          '平方根的定義就是「平方後會等於它」，所以<b>驗算方向是平方回去</b>。',
          '這一招可以自己抓出小數位數錯、帶分數拆錯、正負漏寫。',
          '開不盡的數就留根號，<b>不要硬湊成好看的小數</b>。'
        ],
        formula: { label: '驗算法<span class="pgref">課本 印 69–70</span>', tex: 'b\\text{ 是 }a\\text{ 的平方根}\\iff b^2=a' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '常見說法', tex: '0.3\\text{ 是 }0.9\\text{ 的平方根}',
              color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 17,
              note: '平方回去：0.3² ＝ 0.09，不是 0.9 ✗' },
            { label: '對的', tex: '0.3\\text{ 是 }0.09\\text{ 的平方根}',
              color: GRN, fill: '#eef7f2', border: GRN, size: 17,
              note: '小數平方，位數會變兩倍' },
            { label: '開得盡就寫乾淨', tex: '\\sqrt{1225}=35',
              color: BLU, border: '#cfdcf5', size: 17,
              note: '1225 ＝ 5²×7² ＝ 35²' },
            { label: '開不盡就留著', tex: '\\sqrt{37}',
              color: AMB, border: '#f0dcbb', size: 17,
              note: '別硬寫成 6.1，那是近似值不是答案' }
          ], { gap: 9 });
          MJ(h);
        },
        caption: '養成<b>平方回去</b>的習慣，這一節大半的錯自己就抓得出來。',
        example: {
          q: '判斷「\\(0.3\\) 是 \\(0.9\\) 的平方根」對不對。',
          steps: [
            '平方回去驗算：\\(0.3^2=0.09\\)。',
            '\\(0.09\\ne0.9\\)，所以錯。'
          ],
          ans: '錯，\\(0.3\\) 是 \\(0.09\\) 的平方根'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '最常錯的三件事：漏 ±、帶分數拆開、逼近取錯邊',
        points: [
          '這三類幾乎涵蓋本節所有失分，考前只複習這一頁也值得。',
          '通用檢查法：<b>平方回去</b>，對不起來就是錯了。',
          '看到「平方根」先想有幾個答案，看到 <b>√</b> 先確認根號內非負。'
        ],
        formula: { label: '三個關卡<span class="pgref">課本 印 72 重點整理</span>', tex: '\\begin{aligned}&\\text{平方根要 }\\pm\\\\&\\text{帶分數先化假分數}\\end{aligned}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '漏掉 ±',
              bad: '\\(9\\) 的平方根是 \\(3\\)',
              good: '是 \\(\\pm3\\)<br>只有 \\(\\sqrt9\\) 才單寫 \\(3\\)' },
            { tag: '帶分數拆開',
              bad: '\\(4\\frac19\\) 的平方根 \\(=\\pm2\\frac13\\)',
              good: '先化 \\(\\frac{37}{9}\\)<br>得 \\(\\pm\\frac{\\sqrt{37}}{3}\\)' },
            { tag: '逼近取錯邊',
              bad: '\\(2.2<\\sqrt5<2.3\\) 就取 \\(2.3\\)',
              good: '比<b>離誰近</b>：\\(0.16<0.29\\)<br>所以取 \\(2.2\\)' }
          ]);
          MJ(h);
        },
        caption: '每一列都先問「錯的那個少了什麼」，再講正確寫法。',
        example: {
          q: '判斷「\\(-4\\) 的平方根是 \\(-2\\)」對不對。',
          steps: [
            '平方回去：\\((-2)^2=4\\)，不是 \\(-4\\)。',
            '在國中階段，負數沒有平方根。'
          ],
          ans: '錯'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課本隨堂 ①（根式的簡記、數與根式的乘積等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・隨堂練習', page: '印 76–81', sub: '根式的簡記、數與根式的乘積等', tags: ['印2', '印3', '印5', '印7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課本隨堂 ②（根式的化簡、有理化分母等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・隨堂練習', page: '印 82–85', sub: '根式的化簡、有理化分母等', tags: ['印8', '印9', '印11'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課本隨堂 ③（同類方根的判斷、同類方根的加減等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・隨堂練習', page: '印 86–88', sub: '同類方根的判斷、同類方根的加減等', tags: ['印12', '印13', '印14'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課本隨堂 ④（計算並簡化根式 II、用乘法公式化簡等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・隨堂練習', page: '印 89–91', sub: '計算並簡化根式 II、用乘法公式化簡等', tags: ['印15', '印16', '印17'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
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
          PRACTICE.answerKey(h, '2-2', [
            { label: '基礎練習（印 23–26）', cols: 2, items: [
              ['基 1', '基礎1'], ['基 2', '基礎2'], ['基 3', '基礎3'], ['基 4', '基礎4'], ['基 5', '基礎5'], ['基 6', '基礎6'], ['基 7', '基礎7']
            ] },
            { label: '精熟練習（印 26）', cols: 4, items: [
              ['精 1', '精熟1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・基礎練習', page: '印 23–24', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・基礎練習', page: '印 25–26', sub: '基礎練習', tags: ['基礎5', '基礎6', '基礎7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・基礎練習', page: '印 26', sub: '精熟練習', tags: ['精熟1'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・自我評量', page: '印 93', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '課本・自我評量', page: '印 93–94', sub: '自我評量與錯誤診療', tags: ['自評4', '自評5', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '2-2', secName: '根式的運算',
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
          PRACTICE.answerKey(h, '2-2', [
            { label: '選擇 1～10（印 16–17）', cols: 4, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'], ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-2', secName: '根式的運算',
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
          PRACTICE.answerKey(h, '2-2', [
            { label: '填充（印 17）', cols: 2, items: [
              ['填 1', '評填1'], ['填 2', '評填2'], ['填 3', '評填3']
            ] },
            { label: '計算（印 18）', cols: 4, items: [
              ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・課堂評量', page: '印 16', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課堂評量 ②（選擇 5～7）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・課堂評量', page: '印 16', sub: '選擇 5～7', tags: ['評選5', '評選6', '評選7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課堂評量 ③（選擇 8～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・課堂評量', page: '印 17', sub: '選擇 8～10', tags: ['評選8', '評選9', '評選10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課堂評量 ④（填充 1～3）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・課堂評量', page: '印 17', sub: '填充 1～3', tags: ['評填1', '評填2', '評填3'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜課堂評量 ⑤（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '試卷・課堂評量', page: '印 18', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-2', secName: '根式的運算',
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
          PRACTICE.answerKey(h, '2-2', [
            { label: '選擇（印 5）', cols: 4, items: [
              ['選 1', '附選1'], ['選 2', '附選2'], ['選 3', '附選3'], ['選 4', '附選4'], ['選 5', '附選5'], ['選 6', '附選6']
            ] },
            { label: '填充（印 5）', cols: 4, items: [
              ['填 1', '附填1'], ['填 2', '附填2'], ['填 3', '附填3'], ['填 4', '附填4']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・附錄本', page: '印 5', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作附錄本 ②（選擇 4～6）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・附錄本', page: '印 5', sub: '選擇 4～6', tags: ['附選4', '附選5', '附選6'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '檢討｜習作附錄本 ③（填充 1～4）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\quad(a,b\\ge 0)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-2', [
            { src: '習作・附錄本', page: '印 5', sub: '填充 1～4', tags: ['附填1', '附填2', '附填3', '附填4'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課本隨堂 ①（用畢氏定理求長度、正三角形的高與面積等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '課本・隨堂練習', page: '印 99–103', sub: '用畢氏定理求長度、正三角形的高與面積等', tags: ['印5', '印6', '印7', '印9'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課本隨堂 ②（畢氏定理的應用、水平、鉛垂線的距離等）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '課本・隨堂練習', page: '印 104–108', sub: '畢氏定理的應用、水平、鉛垂線的距離等', tags: ['印10', '印11', '印13', '印14'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
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
          PRACTICE.answerKey(h, '2-3', [
            { label: '基礎練習（印 27–29）', cols: 3, items: [
              ['基 1', '基礎1'], ['基 2', '基礎2'], ['基 3', '基礎3'], ['基 4', '基礎4'], ['基 5', '基礎5']
            ] },
            { label: '精熟練習（印 30）', cols: 3, items: [
              ['精 1', '精熟1'], ['精 2', '精熟2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '習作・基礎練習', page: '印 27–28', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '習作・基礎練習', page: '印 28–29', sub: '基礎練習', tags: ['基礎4', '基礎5'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '習作・基礎練習', page: '印 30', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '課本・自我評量', page: '印 110', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '課本・自我評量', page: '印 111–112', sub: '自我評量與錯誤診療', tags: ['自評4', '自評5', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
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
          PRACTICE.answerKey(h, '2-3', [
            { label: '選擇 1～10（印 19–20）', cols: 4, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'], ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
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
          PRACTICE.answerKey(h, '2-3', [
            { label: '填充（印 20–21）', cols: 2, items: [
              ['填 1', '評填1'], ['填 2', '評填2'], ['填 3', '評填3'], ['填 4', '評填4'], ['填 5', '評填5']
            ] },
            { label: '計算（印 21）', cols: 2, items: [
              ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 19', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ②（選擇 5～7）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 19–20', sub: '選擇 5～7', tags: ['評選5', '評選6', '評選7'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ③（選擇 8～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 20', sub: '選擇 8～10', tags: ['評選8', '評選9', '評選10'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ④（填充 1～3）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 20–21', sub: '填充 1～3', tags: ['評填1', '評填2', '評填3'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ⑤（填充 4、5）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 21', sub: '填充 4、5', tags: ['評填4', '評填5'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜課堂評量 ⑥（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '試卷・課堂評量', page: '印 21', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁最多四題，投影出去看得清楚；改完卷子照題號挑。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
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
          PRACTICE.answerKey(h, '2-3', [
            { label: '選擇（印 6）', cols: 4, items: [
              ['選 1', '附選1'], ['選 2', '附選2'], ['選 3', '附選3'], ['選 4', '附選4'], ['選 5', '附選5'], ['選 6', '附選6']
            ] },
            { label: '填充（印 6）', cols: 2, items: [
              ['填 1', '附填1']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '習作・附錄本', page: '印 6', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '檢討｜習作附錄本 ②（選擇 4～6、填充 1）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '2-3', [
            { src: '習作・附錄本', page: '印 6', sub: '選擇 4～6、填充 1', tags: ['附選4', '附選5', '附選6', '附填1'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },
    ]
  });
})();
