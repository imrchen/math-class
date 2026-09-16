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
  const RECT = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 0}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#c9d3e2'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

  const CELL = (x, y, w, h, label, o = {}) =>
    RECT(x, y, w, h, { fill: o.fill || '#fff', stroke: o.stroke || '#c9d3e2', sw: o.sw || 1.8 }) +
    (label && w > 26 && h > 20
      ? TX(x + w / 2, y + h / 2 + 5, label, { anchor: 'middle', fs: o.fs || 15, c: o.c || INK })
      : '');

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

  function gradeRows(rows) {
    return `<div class="xo-wrap" style="width:99.5%;margin:0 auto;display:flex;flex-direction:column;gap:5px">` +
      rows.map(r => `<div class="xo-row" style="border:1.5px solid #dde4ef;border-radius:12px;background:#fff;padding:4px 10px">
        <div class="xo-tag" style="font-size:12px;font-weight:900;color:${C};margin-bottom:2px">${r.tag}</div>
        <div class="xo-body" style="display:flex;gap:8px;align-items:baseline;font-size:12.5px;line-height:1.4;color:${INK}">
          <span style="flex:0 0 auto;font-weight:900;color:${RED}">✗</span><span style="flex:1;min-width:0">${r.bad}</span></div>
        <div class="xo-body" style="display:flex;gap:8px;align-items:baseline;font-size:12.5px;line-height:1.4;color:${INK}">
          <span style="flex:0 0 auto;font-weight:900;color:${GRN}">✓</span><span style="flex:1;min-width:0">${r.good}</span></div>
      </div>`).join('') + `</div>`;
  }

  function qaRows(rows) {
    return `<div class="xo-wrap" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">` +
      rows.map(r => `<div class="xo-row" style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-cell" style="flex:1;background:#eef4ff;border:1.5px solid #cfdcf5;border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${BLU};margin-bottom:4px">問 ${r.tag || ''}</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.q}</div></div>
        <div class="xo-cell" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:9px 12px">
          <div class="xo-tag" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:4px">答</div>
          <div class="xo-body" style="font-size:13.5px;color:${INK};line-height:1.7;overflow-wrap:anywhere">${r.a}</div></div>
      </div>`).join('') + `</div>`;
  }

  window.DECK.push({
    ch: 1,
    title: '乘法公式與多項式',
    color: C,
    sections: ['1-1 乘法公式', '1-2 多項式的加法與減法', '1-3 多項式的乘法與除法'],
    slides: [

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課本隨堂 ①（分配律、和的平方、差的平方）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・隨堂練習', page: '印 8–12', sub: '分配律、和的平方、差的平方', tags: ['印5', '印7', '印8', '印9'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課本隨堂 ②（平方差、公式的選擇與速算）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・隨堂練習', page: '印 13–16', sub: '平方差、公式的選擇與速算', tags: ['印10', '印11', '印12', '印13'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '對答案｜習作（基礎、精熟練習）',
        points: [
          '<b>先對答案，再檢討。</b>這一頁只給答案，不給過程。',
          '交換改：按右上角 <b>🔍 放大</b> 投成整頁（那一層字最大），老師唸題號，學生照著改同學的本子。',
          '⚠ 這一節有好幾題<b>答案對、過程沒寫</b>也不算完成——標準在後面那一頁總結。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>對答案（需 practice.js）</div>'; return;
          }
          PRACTICE.answerKey(h, '1-1', [
            { label: '基礎 1（印 2）、基礎 2（印 3）', cols: 4, items: [
              ['1 ①', '基礎1 ①'], ['1 ②', '基礎1 ②'], ['1 ③', '基礎1 ③'], ['1 ④', '基礎1 ④'],
              ['2 ①', '基礎2 ①'], ['2 ②', '基礎2 ②'], ['2 ③', '基礎2 ③'], ['2 ④', '基礎2 ④']
            ] },
            { label: '基礎 3　判斷 ○／×（印 3）', cols: 6, items: [
              ['①', '基礎3 ①'], ['②', '基礎3 ②'], ['③', '基礎3 ③'],
              ['④', '基礎3 ④'], ['⑤', '基礎3 ⑤'], ['⑥', '基礎3 ⑥']
            ] },
            { label: '基礎 4～6（印 4）、精熟 1～2（印 5）', cols: 3, items: [
              ['基 4', '基礎4'], ['基 5', '基礎5'], ['基 6', '基礎6'],
              ['精 1', '精熟1'], ['精 2', '精熟2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯、過程該寫什麼，留給後面的檢討頁與總結頁。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・基礎練習', page: '印 2–4', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・基礎練習', page: '印 2–4', sub: '基礎練習', tags: ['基礎5', '基礎6'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・基礎練習', page: '印 5', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '習作總結：題目要的是過程，不是只有答案',
        points: [
          '這五筆是<b>這次改習作真的看到的</b>，不是一般性的提醒。',
          '四筆同一個病：<b>中間那一步沒寫</b>，看不出公式用在哪裡；第 4 題則是<b>漏了單位</b>。',
          '寫下來的那一步，就是<b>給分的地方</b>，也是自己檢查的地方。'
        ],
        formula: { label: '這幾題的題目都寫著這一句<span class="pgref">習作 印 2–5</span>', tex: '\\text{「利用分配律」「利用乘法公式」}' },
        visual: (h) => {
          h.innerHTML = gradeRows([
            { tag: '基礎 1 ①　跳過分配律那一步',
              bad: '化成假分數硬乘 \\(\\frac{22}{3}\\times\\frac{22}{7}\\)，答案對但<b>分配律沒出現</b>',
              good: '\\((7+\\frac{1}{3})(3+\\frac{1}{7})=21+1+1+\\frac{1}{21}=23\\frac{1}{21}\\)' },
            { tag: '基礎 4　算出數字就交卷，沒寫單位',
              bad: '只寫 \\(37600\\)，面積題<b>沒有單位</b>',
              good: '\\(\\frac{1}{2}(288+88)(288-88)=37600\\)　→　單位是<b>平方公尺</b>' },
            { tag: '基礎 5　沒有計算過程',
              bad: '卷面只有一個 (D)，<b>看不出是算的還是猜的</b>',
              good: '\\((100+2)^2+(100-2)^2=(100^2+2^2)\\times2\\)　→　選 (D)' },
            { tag: '基礎 6　a、b 沒算出來就有答案了',
              bad: '直接寫 \\(b>a\\)，紙上<b>沒有 \\(a\\)、\\(b\\) 的值</b>',
              good: '\\(a=(65+15)(65-15)=4000\\)，\\(b\\) 同法得 \\(4300\\)　→　\\(b>a\\)' },
            { tag: '精熟 2　沒算出數值就答「最接近」',
              bad: '只寫 \\(131\\)，<b>沒把 \\(\\frac{133^2}{135}\\) 算成一個數</b>',
              good: '\\(\\frac{(135-2)^2}{135}=131\\frac{4}{135}\\)　→　最接近 \\(131\\)' }
          ]);
          MJ(h);
        },
        caption: '左邊是這次本子上真的出現的寫法；右邊多的那一行，抄下來就是分數。',
        example: {
          q: '\\(38\\times13+38\\times7+42\\times13+42\\times7\\)（基礎 2 ①）要怎麼把分配律寫出來？',
          steps: [
            '前兩項提 \\(38\\)、後兩項提 \\(42\\)：\\(38(13+7)+42(13+7)\\)。',
            '再把 \\((13+7)\\) 提出來：\\((38+42)(13+7)=80\\times20\\)。'
          ],
          ans: '\\(1600\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・自我評量', page: '印 18–20', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3', '自評4'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '課本・自我評量', page: '印 18–20', sub: '自我評量與錯誤診療', tags: ['自評5', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-1', secName: '乘法公式',
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
          PRACTICE.answerKey(h, '1-1', [
            { label: '選擇（印 2–3）', cols: 2, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'],
              ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '1-1', secName: '乘法公式',
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
          PRACTICE.answerKey(h, '1-1', [
            { label: '填充 1（印 3）', cols: 2, items: [
              ['①', '評填1(1)'], ['②', '評填1(2)'], ['③', '評填1(3)'], ['④', '評填1(4)'],
              ['⑤', '評填1(5)'], ['⑥', '評填1(6)'], ['⑦', '評填1(7)'], ['⑧', '評填1(8)']
            ] },
            { label: '填充 2～3、計算 1～2（印 3–4）', cols: 1, items: [
              ['填 2', '評填2'], ['填 3', '評填3'], ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ②（選擇 5～8）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '選擇 5～8', tags: ['評選5', '評選6', '評選7', '評選8'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ③（選擇 9～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '選擇 9～10', tags: ['評選9', '評選10'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ④（填充 1 的 ①～④）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '填充 1 的 ①～④', tags: ['評填1(1)', '評填1(2)', '評填1(3)', '評填1(4)'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ⑤（填充 1 的 ⑤～⑧）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '填充 1 的 ⑤～⑧', tags: ['評填1(5)', '評填1(6)', '評填1(7)', '評填1(8)'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ⑥（填充 2、3）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '填充 2、3', tags: ['評填2', '評填3'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜課堂評量 ⑦（計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '試卷・課堂評量', page: '印 2–4', sub: '計算 1、2', tags: ['評計1', '評計2'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・附錄本', page: '印 1', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作附錄本 ②（選擇 4～6）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・附錄本', page: '印 1', sub: '選擇 4～6', tags: ['附選4', '附選5', '附選6'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '檢討｜習作附錄本 ③（填充 1 的 ①～④）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(a\\pm b)^2\\;\\;(a+b)(a-b)\\;\\;(a+b)(c+d)' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-1', [
            { src: '習作・附錄本', page: '印 1', sub: '填充 1 的 ①～④', tags: ['附填1(1)', '附填1(2)', '附填1(3)', '附填1(4)'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '左邊每一項，都要乘到右邊每一項',
        points: [
          '兩個括號相乘，是把大長方形<b>切成四塊</b>，四塊面積加起來。',
          '所以答案一定有 <b>四項</b>：\\(ac\\)、\\(ad\\)、\\(bc\\)、\\(bd\\)，少一項就是漏乘。',
          '拖<span class="k">步驟滑桿</span>，看四塊分別是誰乘誰。'
        ],
        formula: { label: '分配律的四項展開<span class="pgref">課本 印 7–8</span>', tex: '(a+b)(c+d)=ac+ad+bc+bd' },
        visual: (h) => {
          const X0 = 92, Y0 = 44, AW = 176, BW = 96, CH = 108, DH = 72;
          const W = AW + BW, H = CH + DH;
          const dim = (x, y, t, c) => TX(x, y, t, { anchor: 'middle', fs: 15, c: c || GREY });

          const frame = () =>
            dim(X0 + AW / 2, Y0 - 16, 'a', BLU) + dim(X0 + AW + BW / 2, Y0 - 16, 'b', BLU) +
            TX(X0 - 16, Y0 + CH / 2 + 5, 'c', { anchor: 'middle', fs: 15, c: VIO }) +
            TX(X0 - 16, Y0 + CH + DH / 2 + 5, 'd', { anchor: 'middle', fs: 15, c: VIO });
          const cells = (on) => {
            const g = (k, x, y, w, hh, lb, col, fill) =>
              CELL(x, y, w, hh, on.indexOf(k) >= 0 ? lb : '', { fill: on.indexOf(k) >= 0 ? fill : '#fbfcfe', c: col });
            return g('ac', X0, Y0, AW, CH, 'ac', BLU, 'rgba(37,99,235,.13)') +
                   g('ad', X0, Y0 + CH, AW, DH, 'ad', VIO, 'rgba(124,58,237,.13)') +
                   g('bc', X0 + AW, Y0, BW, CH, 'bc', GRN, 'rgba(5,150,105,.13)') +
                   g('bd', X0 + AW, Y0 + CH, BW, DH, 'bd', AMB, 'rgba(217,119,6,.15)');
          };
          const total = (t) => TX(220, 246, t, { anchor: 'middle', fs: 16, c: INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '一個長 <b>a＋b</b>、寬 <b>c＋d</b> 的長方形。整塊的面積就是 <b>(a+b)(c+d)</b>。',
              d: () => RECT(X0, Y0, W, H, { fill: 'rgba(37,99,235,.05)', stroke: BLU, sw: 2.4 }) + frame() +
                       total('整塊面積 ＝ (a＋b)(c＋d)') },
            { t: '橫豎各切一刀，切成 <b>四塊</b>。切法就是把 a、b 和 c、d 分開。',
              d: () => cells([]) + frame() +
                       total('切成四塊，面積總和不變') },
            { t: '四塊面積分別是 <b>ac、ad、bc、bd</b>——左邊兩項各配右邊兩項。',
              d: () => cells(['ac', 'ad', 'bc', 'bd']) + frame() +
                       total('ac ＋ ad ＋ bc ＋ bd') },
            { t: '數字也一樣：32×45 ＝ (30＋2)(40＋5) ＝ 1200＋150＋80＋10＝<b>1440</b>。',
              d: () => cells(['ac', 'ad', 'bc', 'bd']) + frame() +
                       TX(220, 246, '30×40 ＋ 30×5 ＋ 2×40 ＋ 2×5 ＝ 1440', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '四格圖是<b>共同語言</b>：先看得到四塊，之後才撤掉圖只留箭頭。',
        example: {
          q: '展開 \\((2x+3)(x+5)\\)。',
          steps: [
            '四塊分別是 \\(2x\\cdot x=2x^2\\)、\\(2x\\cdot 5=10x\\)、\\(3\\cdot x=3x\\)、\\(3\\cdot 5=15\\)。',
            '合併中間兩項：\\(10x+3x=13x\\)。'
          ],
          ans: '\\(2x^2+13x+15\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '和的平方，中間是兩塊 ab，不是一塊',
        points: [
          '把上一頁的 \\(c\\) 換成 \\(a\\)、\\(d\\) 換成 \\(b\\)，四塊就變成 \\(a^2、ab、ab、b^2\\)。',
          '兩塊 \\(ab\\) <b>一樣大</b>，合起來就是 \\(2ab\\)——這是最常被漏掉的一項。',
          '拖 a、b 兩個滑桿，看左邊算式和右邊算式<b>永遠相等</b>。'
        ],
        formula: { label: '和的平方<span class="pgref">課本 印 9–10</span>', tex: '(a+b)^2=a^2+2ab+b^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl">
              <label>a ＝ <span class="ival" id="av">5</span></label>
              <input type="range" id="as" min="2" max="8" step="1" value="5">
              <label>b ＝ <span class="ival" id="bv">3</span></label>
              <input type="range" id="bs" min="2" max="8" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value, b = +h.querySelector('#bs').value;
            h.querySelector('#av').textContent = a;
            h.querySelector('#bv').textContent = b;
            const S = 186, X0 = 40, Y0 = 26, u = S / (a + b);
            const ap = u * a, bp = u * b;
            let s = '';
            s += CELL(X0, Y0, ap, ap, 'a²', { fill: 'rgba(37,99,235,.15)', c: BLU, fs: 16 });
            s += CELL(X0 + ap, Y0, bp, ap, 'ab', { fill: 'rgba(217,119,6,.16)', c: AMB, fs: 15 });
            s += CELL(X0, Y0 + ap, ap, bp, 'ab', { fill: 'rgba(217,119,6,.16)', c: AMB, fs: 15 });
            s += CELL(X0 + ap, Y0 + ap, bp, bp, 'b²', { fill: 'rgba(5,150,105,.15)', c: GRN, fs: 15 });
            s += RECT(X0, Y0, S, S, { fill: 'none', stroke: BLU, sw: 2.6 });
            s += TX(X0 + S / 2, Y0 - 9, `邊長 ${a}＋${b} ＝ ${a + b}`, { anchor: 'middle', fs: 14, c: GREY });

            const RX = 250;
            s += TX(RX, 56, `(a＋b)² ＝ ${a + b}² ＝ ${(a + b) * (a + b)}`, { fs: 16, c: BLU });
            s += TX(RX, 92, `a² ＝ ${a * a}`, { fs: 15, c: BLU });
            s += TX(RX, 120, `2ab ＝ 2×${a}×${b} ＝ ${2 * a * b}`, { fs: 15, c: AMB });
            s += TX(RX, 148, `b² ＝ ${b * b}`, { fs: 15, c: GRN });
            s += `<line x1="${RX}" y1="162" x2="428" y2="162" stroke="#c9d3e2" stroke-width="1.6"/>`;
            s += TX(RX, 188, `合計 ＝ ${a * a + 2 * a * b + b * b}`, { fs: 16, c: GRN });
            s += TX(220, 250, `少算一塊 ab 就會變成 ${a * a + a * b + b * b}，差了 ${a * b}`, { anchor: 'middle', fs: 14.5, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 266', s);
          };
          h.querySelector('#as').oninput = draw;
          h.querySelector('#bs').oninput = draw;
          draw();
        },
        caption: '不管 a、b 拖到多少，<b>左右兩個數字永遠一樣</b>——公式不是規定，是算出來的。',
        example: {
          q: '不用直式，算出 \\(101^2\\)。',
          steps: [
            '\\(101=100+1\\)，所以 \\(101^2=(100+1)^2\\)。',
            '\\(=100^2+2\\times100\\times1+1^2=10000+200+1\\)。'
          ],
          ans: '\\(101^2=10201\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '101² 不是 100²＋1²，差了中間那 200',
        points: [
          '邊長從 100 加到 101，多出來的不只是右下角那個 \\(1\\times1\\)。',
          '還有<b>兩條</b> \\(100\\times1\\) 的長條，這兩條就是 \\(2ab=200\\)。',
          '把 \\((a+b)^2\\) 寫成 \\(a^2+b^2\\)，等於把兩條長條整個丟掉。'
        ],
        formula: { label: '看數字就知道差在哪<span class="pgref">課本 印 10–11</span>', tex: '101^2=10000+200+1=10201' },
        visual: (h) => {
          const X0 = 66, Y0 = 34, S = 196, bp = 26, ap = S - bp;
          let s = '';
          s += CELL(X0, Y0, ap, ap, '100×100', { fill: 'rgba(37,99,235,.13)', c: BLU, fs: 15 });
          s += CELL(X0 + ap, Y0, bp, ap, '', { fill: 'rgba(217,119,6,.18)', c: AMB });
          s += CELL(X0, Y0 + ap, ap, bp, '', { fill: 'rgba(217,119,6,.18)', c: AMB });
          s += CELL(X0 + ap, Y0 + ap, bp, bp, '', { fill: 'rgba(5,150,105,.18)', c: GRN });
          s += RECT(X0, Y0, S, S, { fill: 'none', stroke: BLU, sw: 2.6 });
          s += TX(X0 + S / 2, Y0 - 10, '邊長 101', { anchor: 'middle', fs: 14, c: GREY });

          s += `<line x1="${X0 + ap + bp / 2}" y1="${Y0 + ap / 2}" x2="290" y2="96" stroke="${AMB}" stroke-width="1.6"/>`;
          s += TX(296, 84, '100×1', { fs: 14.5, c: AMB });
          s += TX(296, 104, '兩條，共 200', { fs: 14.5, c: AMB });
          s += `<line x1="${X0 + ap + bp / 2}" y1="${Y0 + ap + bp / 2}" x2="290" y2="176" stroke="${GRN}" stroke-width="1.6"/>`;
          s += TX(296, 172, '1×1 ＝ 1', { fs: 14.5, c: GRN });
          s += TX(220, 262, '10000 ＋ 200 ＋ 1 ＝ 10201', { anchor: 'middle', fs: 17, c: INK });
          s += TX(220, 286, '寫成 10000＋1＝10001 就少了整整 200', { anchor: 'middle', fs: 14.5, c: RED });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '先讓學生<b>猜</b>多出多少，再把兩條長條補出來，印象最深。',
        example: {
          q: '心算 \\(52^2\\)。',
          steps: [
            '\\(52=50+2\\)，\\(52^2=50^2+2\\times50\\times2+2^2\\)。',
            '\\(=2500+200+4\\)。'
          ],
          ans: '\\(52^2=2704\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '差的平方：扣兩條，角落被扣了兩次要補回來',
        points: [
          '要得到 \\((a-b)^2\\)，從 \\(a^2\\) 扣掉<b>兩條</b> \\(a\\times b\\)。',
          '右下角那塊 \\(b^2\\) 被<b>扣了兩次</b>，所以最後要 <b>＋\\(b^2\\)</b> 補回來。',
          '拖滑桿改變 b，看綠色正方形怎麼縮，算式怎麼跟著變。'
        ],
        formula: { label: '差的平方<span class="pgref">課本 印 12</span>', tex: '(a-b)^2=a^2-2ab+b^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl">
              <label>a ＝ 10，扣掉 b ＝ <span class="ival" id="bv">3</span></label>
              <input type="range" id="bs" min="1" max="8" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = 10, b = +h.querySelector('#bs').value;
            h.querySelector('#bv').textContent = b;
            const S = 186, X0 = 40, Y0 = 26, u = S / a;
            const bp = u * b, cp = S - bp;
            let s = '';
            s += CELL(X0, Y0, cp, cp, `(${a - b})²`, { fill: 'rgba(5,150,105,.16)', c: GRN, fs: 16 });
            s += CELL(X0 + cp, Y0, bp, cp, '', { fill: 'rgba(225,29,72,.13)', c: RED });
            s += CELL(X0, Y0 + cp, cp, bp, '', { fill: 'rgba(225,29,72,.13)', c: RED });
            s += CELL(X0 + cp, Y0 + cp, bp, bp, '', { fill: 'rgba(225,29,72,.34)', c: RED });
            s += RECT(X0, Y0, S, S, { fill: 'none', stroke: BLU, sw: 2.6 });
            s += TX(X0 + S / 2, Y0 - 9, '邊長 a ＝ 10', { anchor: 'middle', fs: 14, c: GREY });
            const RX = 238;
            s += TX(RX, 54, `a² ＝ 100`, { fs: 15, c: BLU });
            s += TX(RX, 82, `－2ab ＝ －2×10×${b} ＝ －${2 * a * b}`, { fs: 14, c: RED });
            s += TX(RX, 110, `＋b² ＝ ＋${b * b}（角落補回）`, { fs: 14, c: AMB });
            s += `<line x1="${RX}" y1="124" x2="430" y2="124" stroke="#c9d3e2" stroke-width="1.6"/>`;
            s += TX(RX, 150, `(10－${b})² ＝ ${(a - b) * (a - b)}`, { fs: 17, c: GRN });
            s += TX(RX, 182, `直接算：${a - b}² ＝ ${(a - b) * (a - b)} ✓`, { fs: 14.5, c: GREY });
            s += TX(220, 250, `若寫成 100－${b * b} ＝ ${100 - b * b}，就錯了 ${(100 - b * b) - (a - b) * (a - b)}`, { anchor: 'middle', fs: 14.5, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 266', s);
          };
          h.querySelector('#bs').oninput = draw;
          draw();
        },
        caption: '深紅色的角落是關鍵：它<b>被扣了兩次</b>，所以公式最後是 ＋\\(b^2\\)。',
        example: {
          q: '算 \\((10-0.5)^2\\)。',
          steps: [
            '\\(=10^2-2\\times10\\times0.5+0.5^2\\)。',
            '\\(=100-10+0.25\\)。'
          ],
          ans: '\\(9.5^2=90.25\\)（不是 \\(99.75\\)）'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '一個和、一個差，中間兩項剛好抵消',
        points: [
          '\\((a+b)(a-b)\\) 照樣展開成四項，不必背新規則。',
          '中間的 \\(-ab\\) 和 \\(+ab\\) <b>互為相反數</b>，加起來是 0，所以沒有中間項。',
          '關鍵是先看<b>括號結構</b>：一個是和、一個是差，才用 \\(a^2-b^2\\)。'
        ],
        formula: { label: '平方差<span class="pgref">課本 印 14</span>', tex: '(a+b)(a-b)=a^2-b^2' },
        visual: (h) => {
          const X0 = 96, Y0 = 52, AW = 150, BW = 110, R1 = 76, R2 = 76;
          const grid = (hi) => {
            const g = (x, y, w, hh, lb, col, key) =>
              CELL(x, y, w, hh, lb, {
                fill: hi.indexOf(key) >= 0 ? 'rgba(217,119,6,.20)' : '#fbfcfe',
                c: col, fs: 16
              });
            return g(X0, Y0, AW, R1, 'a·a ＝ a²', BLU, 'aa') +
                   g(X0 + AW, Y0, BW, R1, 'a·(−b)', AMB, 'mid1') +
                   g(X0, Y0 + R1, AW, R2, 'b·a', AMB, 'mid2') +
                   g(X0 + AW, Y0 + R1, BW, R2, 'b·(−b)', GRN, 'bb');
          };
          const head = TX(X0 + (AW + BW) / 2, Y0 - 16, '（ a ＋ b ）×（ a － b ）', { anchor: 'middle', fs: 15, c: GREY });
          SV.stepper(h, '0 0 440 268', [
            { t: '照四格展開，一樣是四項。右邊那個括號的第二項是 <b>−b</b>。',
              d: () => grid([]) + head },
            { t: '中間兩項是 <b>−ab</b> 和 <b>＋ab</b>，大小一樣、符號相反。',
              d: () => grid(['mid1', 'mid2']) + head +
                       TX(220, 236, '−ab ＋ ab ＝ 0', { anchor: 'middle', fs: 17, c: AMB }) },
            { t: '中間抵消，只剩<b>頭尾兩項</b>：a² 和 －b²。',
              d: () => grid([]) + head +
                       TX(220, 236, 'a² ＋ 0 －b² ＝ a² － b²', { anchor: 'middle', fs: 17, c: GRN }) },
            { t: '數字驗證：103×97 ＝ (100＋3)(100－3) ＝ 10000－9。',
              d: () => grid([]) + head +
                       TX(220, 236, '103 × 97 ＝ 10000 － 9 ＝ 9991', { anchor: 'middle', fs: 17, c: GRN }) }
          ], { acc: false });
        },
        caption: '兩個括號<b>都是差</b>的話就不是平方差，那是上一頁的 \\((a-b)^2\\)。',
        example: {
          q: '計算 \\(103\\times97\\)。',
          steps: [
            '看結構：\\(103=100+3\\)、\\(97=100-3\\)，同一組數的和與差。',
            '\\((100+3)(100-3)=100^2-3^2=10000-9\\)。'
          ],
          ans: '\\(103\\times97=9991\\)'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '公式是拿來把難算的數，拆成好算的數',
        points: [
          '不是背四個等式，是<b>先看結構</b>：這兩個數靠近哪個整十、整百？',
          '靠同一個數的<b>一多一少</b> → 平方差；只差一點的<b>平方</b> → 和／差的平方。',
          '結構不合就<b>老實展開</b>，速算不是唯一正解。'
        ],
        formula: { label: '先問這一句<span class="pgref">課本 印 15 例 4</span>', tex: '\\text{這兩個括號的關係是什麼？}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '和的平方', tex: '203^2=(200+3)^2=41209',
              color: BLU, fill: '#eef4ff', border: BLU, size: 17 },
            { label: '差的平方', tex: '98^2=(100-2)^2=9604',
              color: VIO, border: '#d9cdf5', size: 17 },
            { label: '平方差', tex: '203\\times197=(200+3)(200-3)=39991',
              color: GRN, border: '#cfe8dd', size: 17 },
            { label: '結構不合就展開', tex: '199\\times203=(200-1)\\times203=40397',
              color: AMB, border: '#f0dcbb', size: 16,
              note: '199 與 203 不是同一個數的一多一少，硬套平方差會錯' }
          ], { gap: 11 });
        },
        caption: '最後一列是刻意放的<b>反例</b>：看到「差不多」就套公式，正是常見失分點。',
        example: {
          q: '牆面長 \\(203\\)、寬 \\(199\\)，一桶漆可塗 \\(40000\\) 平方單位，一桶夠嗎？',
          steps: [
            '\\(199\\times203=(200-1)\\times203=200\\times203-203\\)。',
            '\\(=40600-203=40397\\)。'
          ],
          ans: '\\(40397>40000\\)，一桶不夠'
        }
      },

      {
        sec: '1-1', secName: '乘法公式',
        title: '最常錯的三件事：漏中間項、符號、選錯公式',
        points: [
          '這三類幾乎涵蓋本節所有失分，考前只複習這一頁也值得。',
          '檢查法：<b>代一組小數字進去</b>算一次，錯的一定對不起來。',
          '不確定時就<b>老實展開四項</b>，速度慢但不會錯。'
        ],
        formula: { label: '三個公式一起看<span class="pgref">課本 印 18 重點整理</span>', tex: '\\begin{aligned}(a\\pm b)^2&=a^2\\pm2ab+b^2\\\\(a+b)(a-b)&=a^2-b^2\\end{aligned}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '漏掉中間項',
              bad: '\\((a+b)^2=a^2+b^2\\)<br>代 \\(a=3,b=4\\)：\\(49\\ne25\\)',
              good: '\\((a+b)^2=a^2+2ab+b^2\\)<br>中間還有<b>兩塊</b> \\(ab\\)' },
            { tag: '符號漏掉',
              bad: '\\((10-0.5)^2\\)<br>\\(=10^2-0.5^2=99.75\\)',
              good: '\\((10-0.5)^2\\)<br>\\(=100-10+0.25=90.25\\)' },
            { tag: '選錯公式',
              bad: '看到「平方差」就寫 \\((a-b)^2\\)',
              good: '<b>一和一差</b> → \\(a^2-b^2\\)<br><b>兩個都是差</b> → \\((a-b)^2\\)' }
          ]);
          MJ(h);
        },
        caption: '每一列都先問「錯的那個少了什麼」，再講正確寫法。',
        example: {
          q: '判斷 \\((x-7)^2=x^2-49\\) 對不對。',
          steps: [
            '代 \\(x=10\\)：左邊 \\(3^2=9\\)，右邊 \\(100-49=51\\)。',
            '兩邊不相等，所以是錯的。'
          ],
          ans: '錯。正確是 \\(x^2-14x+49\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課本隨堂 ①（多項式的長相、次數與係數、加法）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・隨堂練習', page: '印 23–26', sub: '多項式的長相、次數與係數、加法', tags: ['印3', '印4', '印5', '印6'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課本隨堂 ②（減法與加減混合）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・隨堂練習', page: '印 27–29', sub: '減法與加減混合', tags: ['印7', '印8', '印9'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・基礎練習', page: '印 6–8', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・基礎練習', page: '印 6–8', sub: '基礎練習', tags: ['基礎5'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・基礎練習', page: '印 9', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・自我評量', page: '印 31–32', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3', '自評4'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '課本・自我評量', page: '印 31–32', sub: '自我評量與錯誤診療', tags: ['自評5', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
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
          PRACTICE.answerKey(h, '1-2', [
            { label: '選擇（印 5–6）', cols: 2, items: [
              ['1', '評選1'], ['2', '評選2'], ['3', '評選3'], ['4', '評選4'], ['5', '評選5'],
              ['6', '評選6'], ['7', '評選7'], ['8', '評選8'], ['9', '評選9'], ['10', '評選10']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
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
          PRACTICE.answerKey(h, '1-2', [
            { label: '填充 1（印 6）', cols: 2, items: [
              ['①', '評填1(1)'], ['②', '評填1(2)'], ['③', '評填1(3)'], ['④', '評填1(4)'],
              ['⑤', '評填1(5)'], ['⑥', '評填1(6)'], ['⑦', '評填1(7)'], ['⑧', '評填1(8)']
            ] },
            { label: '填充 2、計算 1～2（印 6–7）', cols: 1, items: [
              ['填 2', '評填2'], ['計 1', '評計1'], ['計 2', '評計2']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ②（選擇 5～8）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '選擇 5～8', tags: ['評選5', '評選6', '評選7', '評選8'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ③（選擇 9～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '選擇 9～10', tags: ['評選9', '評選10'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ④（填充 1 的 ①～④）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '填充 1 的 ①～④', tags: ['評填1(1)', '評填1(2)', '評填1(3)', '評填1(4)'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ⑤（填充 1 的 ⑤～⑧）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '填充 1 的 ⑤～⑧', tags: ['評填1(5)', '評填1(6)', '評填1(7)', '評填1(8)'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜課堂評量 ⑥（填充 2、計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '試卷・課堂評量', page: '印 5–7', sub: '填充 2、計算 1、2', tags: ['評填2', '評計1', '評計2'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・附錄本', page: '印 2', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作附錄本 ②（選擇 4～6）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・附錄本', page: '印 2', sub: '選擇 4～6', tags: ['附選4', '附選5', '附選6'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-2', secName: '多項式與其加減運算',
        title: '檢討｜習作附錄本 ③（填充 1 的 ①～④）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: '(5x^2-6x-7)+(4x^2-2)=9x^2-6x-9' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-2', [
            { src: '習作・附錄本', page: '印 2', sub: '填充 1 的 ①～④', tags: ['附填1(1)', '附填1(2)', '附填1(3)', '附填1(4)'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: 'x 只能乘、只能整數次方，不能躲在分母或絕對值裡',
        points: [
          '多項式是「幾個<span class="k">項</span>用加減串起來」，每一項都是<b>數字 × x 的整數次方</b>。',
          '\\(x\\) 在<b>分母</b>裡、或包在<b>絕對值</b>裡，就不是多項式。',
          '先認得<b>不是</b>的長相，才不會把任何式子都當多項式。'
        ],
        formula: { label: '一般的樣子<span class="pgref">課本 印 21–22</span>', tex: 'a_nx^n+\\cdots+a_1x+a_0' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '是多項式', tex: '3x^2-5x+1', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 19 },
            { label: '是多項式（只有常數也算）', tex: '7', color: GRN, border: '#cfe8dd', size: 18,
              note: '常數多項式；0 也是，只是不談它幾次' },
            { label: '不是', tex: '\\dfrac{2}{x}+1', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 19,
              note: 'x 在分母' },
            { label: '不是', tex: '|x|+3', color: RED, border: '#f3c4d0', size: 18, note: 'x 包在絕對值裡' }
          ], { gap: 10 });
          MJ(h);
        },
        caption: '把<b>反例</b>先擺出來，比背定義有效——學生是靠對照認長相的。',
        example: {
          q: '\\(\\dfrac{3}{x}+2x\\) 是不是多項式？',
          steps: [
            '看每一項：\\(2x\\) 沒問題，\\(\\dfrac{3}{x}\\) 的 \\(x\\) 在分母。',
            '只要有一項不合格，整個式子就不是。'
          ],
          ans: '不是多項式'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '係數要連前面的正負號一起算，缺的那項係數是 0',
        points: [
          '「一次項係數」問的是 \\(-3\\) 不是 \\(3\\)——<b>符號要帶著</b>。',
          '式子裡沒出現的那一項，不是不存在，是<b>係數為 0</b>。',
          '拖步驟滑桿，把同一個式子拆成項、係數、次數三件事。'
        ],
        formula: { label: '看清楚每一項<span class="pgref">課本 印 23</span>', tex: '5x^3-2x^2+7=5x^3+(-2)x^2+0\\cdot x+7' },
        visual: (h) => {
          const XS = [112, 192, 272, 352], Y0 = 96;
          const head = (t, x) => TX(x, 60, t, { anchor: 'middle', fs: 14, c: GREY });
          const col = (i, term, coef, deg, hi) =>
            RECT(XS[i] - 36, Y0 - 26, 72, 132, { r: 10, fill: hi ? 'rgba(37,99,235,.10)' : '#fbfcfe', stroke: hi ? BLU : '#dce3ee' }) +
            TX(XS[i], Y0, term, { anchor: 'middle', fs: 16, c: INK }) +
            TX(XS[i], Y0 + 38, coef, { anchor: 'middle', fs: 17, c: hi ? RED : GREY }) +
            TX(XS[i], Y0 + 76, deg, { anchor: 'middle', fs: 15, c: hi ? BLU : GREY });

          const labels = () =>
            TX(64, Y0 + 5, '項', { anchor: 'end', fs: 13, c: GREY }) +
            TX(64, Y0 + 43, '係數', { anchor: 'end', fs: 13, c: GREY }) +
            TX(64, Y0 + 81, '次數', { anchor: 'end', fs: 13, c: GREY });
          const T = ['5x³', '−2x²', '0x', '7'], Cf = ['5', '−2', '0', '7'], Dg = ['3', '2', '1', '0'];
          const board = (on) => T.map((t, i) => col(i, t, Cf[i], Dg[i], on.indexOf(i) >= 0)).join('') + labels() +
            TX(220, 40, '5x³ − 2x² + 7', { anchor: 'middle', fs: 18, c: INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '先把式子拆成一項一項。這個式子看起來只有三項。',
              d: () => board([0, 1, 3]) + TX(220, 246, '5x³、−2x²、7', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '係數要<b>連符號一起</b>：二次項係數是 −2，不是 2。',
              d: () => board([1]) + TX(220, 246, '二次項係數 ＝ −2（不是 2）', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '一次項<b>沒有出現</b>，不是不存在——它的係數是 0。',
              d: () => board([2]) + TX(220, 246, '一次項係數 ＝ 0', { anchor: 'middle', fs: 16, c: AMB }) },
            { t: '最高次是 3，所以這是<b>三次多項式</b>；常數項是 7。',
              d: () => board([0]) + TX(220, 246, '三次多項式，常數項 7', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '考題問「一次項係數是多少」，答 0 或答 −3 才對——<b>符號與缺項都算</b>。',
        example: {
          q: '\\(4x^3-x+6\\) 的二次項係數與一次項係數各是多少？',
          steps: [
            '二次項沒出現，所以係數是 \\(0\\)。',
            '一次項是 \\(-x\\)，係數連符號是 \\(-1\\)。'
          ],
          ans: '二次項 \\(0\\)，一次項 \\(-1\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '降冪是看次數由大到小，不是看係數由大到小',
        points: [
          '<b>降冪</b>＝次數 3、2、1、0 往下走；<b>升冪</b>＝反過來。',
          '課本例子的係數剛好也是遞減，所以兩種規則看起來都對——這是陷阱。',
          '拖滑桿換式子，專找<b>係數遞增、但仍是降冪</b>的那一個。'
        ],
        formula: { label: '判斷依據<span class="pgref">課本 印 23</span>', tex: '\\text{只看 }x\\text{ 的次數，不看係數大小}' },
        visual: (h) => {
          const DATA = [
            { s: '9x² + x − 3', deg: '2、1、0', coef: '9、1、−3', ans: '降冪', both: true },
            { s: 'x³ + 7x² + 20x + 100', deg: '3、2、1、0', coef: '1、7、20、100', ans: '降冪', both: false },
            { s: '−3 + x + 9x²', deg: '0、1、2', coef: '−3、1、9', ans: '升冪', both: true },
            { s: '100 + 20x + 7x² + x³', deg: '0、1、2、3', coef: '100、20、7、1', ans: '升冪', both: false }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>第 <span class="ival" id="iv">1</span> / 4 個式子</label>
            <input type="range" id="is" min="0" max="3" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('#is').value, d = DATA[i];
            h.querySelector('#iv').textContent = i + 1;
            let s = '';
            s += RECT(46, 30, 348, 52, { r: 12, fill: '#eef4ff', stroke: BLU, sw: 2 });
            s += TX(220, 63, d.s, { anchor: 'middle', fs: 21, c: INK });
            s += TX(70, 112, '次數依序', { fs: 14, c: GREY });
            s += TX(190, 112, d.deg, { fs: 16, c: BLU });
            s += TX(70, 146, '係數依序', { fs: 14, c: GREY });
            s += TX(190, 146, d.coef, { fs: 16, c: d.both ? GREY : AMB });
            s += RECT(46, 168, 348, 44, { r: 12, fill: d.ans === '降冪' ? 'rgba(5,150,105,.10)' : 'rgba(217,119,6,.12)', stroke: d.ans === '降冪' ? GRN : AMB, sw: 2 });
            s += TX(220, 197, '這是 ' + d.ans + '（看次數）', { anchor: 'middle', fs: 18, c: d.ans === '降冪' ? GRN : AMB });
            s += TX(220, 240, d.both ? '這一個：係數大小剛好也同向，看錯規則也會對' : '這一個：係數大小是反的，只有看次數才判斷得出來',
              { anchor: 'middle', fs: 13.5, c: d.both ? GREY : RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 262', s);
          };
          h.querySelector('#is').oninput = draw;
          draw();
        },
        caption: '第 2、4 個式子是關鍵：<b>係數遞增卻是降冪</b>，只有看次數才判得出來。',
        example: {
          q: '把 \\(5-2x^3+x\\) 依降冪排列。',
          steps: [
            '各項次數：\\(5\\) 是 0 次、\\(-2x^3\\) 是 3 次、\\(x\\) 是 1 次。',
            '由大到小排：3 次 → 1 次 → 0 次。'
          ],
          ans: '\\(-2x^3+x+5\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '只有次方一樣才能合併，而且次方不會跟著相加',
        points: [
          '合併同類項＝<b>係數相加減</b>，\\(x\\) 的次方<b>原封不動</b>。',
          '\\(5+3x^2\\) 不同類，<b>不能</b>合併，這是最頑固的錯。',
          '\\(x\\) 前面沒寫數字時係數是 <b>1</b>，不是 0 也不是沒有。'
        ],
        formula: { label: '合併同類項<span class="pgref">課本 印 24</span>', tex: 'ax^n+bx^n=(a+b)x^n' },
        visual: (h) => {
          const Q = [
            { q: '8x² − x² = 7x²', ok: true, why: '同是二次項，係數 8−1＝7' },
            { q: '5 + 3x² = 8x²', ok: false, why: '常數項與二次項不同類，不能合併' },
            { q: '7x − x = 7', ok: false, why: 'x 的係數是 1，7−1＝6，應為 6x' },
            { q: '4x + 2x = 6x²', ok: false, why: '係數相加就好，次方不要一起加' }
          ];
          const card = (i, reveal) => {
            const d = Q[i], y = 40 + i * 54;
            const col = !reveal ? '#dce3ee' : (d.ok ? GRN : RED);
            const fill = !reveal ? '#fbfcfe' : (d.ok ? 'rgba(5,150,105,.08)' : 'rgba(225,29,72,.07)');
            return RECT(34, y, 372, 46, { r: 11, fill: fill, stroke: col, sw: 1.8 }) +
              TX(52, y + 29, d.q, { fs: 17, c: INK }) +
              (reveal ? TX(392, y + 29, d.ok ? '✓' : '✗', { anchor: 'end', fs: 20, c: col }) : '');
          };
          const board = (n) => Q.map((_, i) => card(i, i < n)).join('');
          SV.stepper(h, '0 0 440 268', [
            { t: '四個式子，先自己判斷哪些是對的。',
              d: () => board(0) },
            { t: '第一個<b>對</b>：同是二次項，係數 8−1＝7，次方不變。',
              d: () => board(1) },
            { t: '第二個<b>錯</b>：常數項和二次項不同類，根本不能合併。',
              d: () => board(2) + TX(220, 258, Q[1].why, { anchor: 'middle', fs: 13.5, c: RED }) },
            { t: '第三個<b>錯</b>：x 的係數是 1，7−1＝6，答案是 6x。',
              d: () => board(3) + TX(220, 258, Q[2].why, { anchor: 'middle', fs: 13.5, c: RED }) },
            { t: '第四個<b>錯</b>：係數相加就好，次方不要跟著加。',
              d: () => board(4) + TX(220, 258, Q[3].why, { anchor: 'middle', fs: 13.5, c: RED }) }
          ], { acc: false });
        },
        caption: '這四個小題就是完整的錯誤類型清單，值得當場即問即答。',
        example: {
          q: '化簡 \\(3x^2+5x-3x^2+1\\)，並說出它是幾次式。',
          steps: [
            '二次項：\\(3x^2-3x^2=0\\)，整個消掉。',
            '剩下 \\(5x+1\\)，最高次是 1。'
          ],
          ans: '\\(5x+1\\)，是<b>一次式</b>（不是二次式）'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '減一個括號，括號裡每一項都要變號',
        points: [
          '括號前面是減號，等於把裡面<b>每一項</b>乘上 \\(-1\\)。',
          '最常見的錯是<b>只變第一項</b>，後面的照抄——這一步就整題錯。',
          '穩的作法：先把減號分配進去，<b>再</b>合併同類項。'
        ],
        formula: { label: '去括號<span class="pgref">課本 印 28</span>', tex: 'A-(B+C)=A-B-C' },
        visual: (h) => {
          const row = (y, txt, fs, c) => TX(220, y, txt, { anchor: 'middle', fs: fs || 17, c: c || INK });
          SV.stepper(h, '0 0 440 268', [
            { t: '題目：\\(3x^2-5x+7\\) 減去 \\(x^2-4x\\)。先原樣抄下來。',
              d: () => row(70, '(3x² − 5x + 7) − (x² − 4x)', 19) },
            { t: '錯誤示範：只把第一項變號，−4x 照抄。<b>這是最常見的失分點</b>。',
              d: () => row(70, '(3x² − 5x + 7) − (x² − 4x)', 19) +
                       RECT(40, 100, 360, 52, { r: 11, fill: 'rgba(225,29,72,.08)', stroke: RED, sw: 2 }) +
                       TX(60, 122, '✗ 只變第一項', { fs: 13, c: RED }) +
                       row(142, '3x² − 5x + 7 − x² − 4x', 18, RED) },
            { t: '正確：括號裡<b>兩項都</b>變號，−4x 要變成 ＋4x。',
              d: () => row(70, '(3x² − 5x + 7) − (x² − 4x)', 19) +
                       RECT(40, 100, 360, 52, { r: 11, fill: 'rgba(5,150,105,.09)', stroke: GRN, sw: 2 }) +
                       TX(60, 122, '✓ 每一項都變號', { fs: 13, c: GRN }) +
                       row(142, '3x² − 5x + 7 − x² + 4x', 18, GRN) },
            { t: '最後才合併同類項：二次項、一次項、常數項各自算。',
              d: () => row(60, '3x² − 5x + 7 − x² + 4x', 18, GREY) +
                       TX(220, 100, '3x² − x² ＝ 2x²', { anchor: 'middle', fs: 16, c: BLU }) +
                       TX(220, 132, '−5x + 4x ＝ −x', { anchor: 'middle', fs: 16, c: AMB }) +
                       TX(220, 164, '常數 ＋7', { anchor: 'middle', fs: 16, c: GREY }) +
                       RECT(110, 190, 220, 44, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2 }) +
                       row(219, '2x² − x + 7', 20, GRN) }
          ], { acc: false });
        },
        caption: '把錯誤版本先寫在黑板上讓全班找錯，比直接講「要變號」記得牢。',
        example: {
          q: '計算 \\((4x^2+x-2)-(x^2-3x+5)\\)。',
          steps: [
            '去括號，三項都變號：\\(4x^2+x-2-x^2+3x-5\\)。',
            '合併：\\(4x^2-x^2=3x^2\\)、\\(x+3x=4x\\)、\\(-2-5=-7\\)。'
          ],
          ans: '\\(3x^2+4x-7\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '直式要先降冪對齊，缺的那一項補 0',
        points: [
          '跟整數直式一樣：<b>同一位要對到同一直行</b>，這裡的「位」是次數。',
          '缺項不補 0，位次就會錯開，整題跟著錯。',
          '橫式、直式都可以，<b>算得對就好</b>；直式的好處是不容易漏項。'
        ],
        formula: { label: '直式三步<span class="pgref">課本 印 25–26</span>', tex: '\\text{降冪}\\rightarrow\\text{補 }0\\rightarrow\\text{逐行相加}' },
        visual: (h) => {
          const CX = [176, 250, 322];
          const line = (y, cells, c, fs) => cells.map((t, i) => t ? TX(CX[i], y, t, { anchor: 'middle', fs: fs || 18, c: c || INK }) : '').join('');
          const head = () => TX(220, 40, '(4x + 3x² + 9) ＋ (2x² + 5)', { anchor: 'middle', fs: 17, c: GREY });
          const cols = (on) => on ? CX.map(x => RECT(x - 30, 62, 60, 118, { r: 8, fill: 'rgba(37,99,235,.07)', stroke: '#cfdcf5', sw: 1.4 })).join('') +
            TX(CX[0], 78, 'x²', { anchor: 'middle', fs: 13, c: BLU }) + TX(CX[1], 78, 'x', { anchor: 'middle', fs: 13, c: BLU }) + TX(CX[2], 78, '常數', { anchor: 'middle', fs: 13, c: BLU }) : '';
          const bar = (y) => `<line x1="120" y1="${y}" x2="352" y2="${y}" stroke="${INK}" stroke-width="2"/>`;
          SV.stepper(h, '0 0 440 268', [
            { t: '第一步：兩個式子都先<b>降冪排列</b>。4x＋3x²＋9 要先排成 3x²＋4x＋9。',
              d: () => head() +
                       TX(220, 110, '3x² + 4x + 9', { anchor: 'middle', fs: 19, c: GRN }) +
                       TX(220, 150, '2x²      + 5', { anchor: 'middle', fs: 19, c: INK }) +
                       TX(220, 210, '第二個式子沒有一次項', { anchor: 'middle', fs: 14, c: AMB }) },
            { t: '第二步：缺的一次項<b>補 0</b>，位次才對得上。',
              d: () => head() + cols(true) +
                       line(112, ['3x²', '+ 4x', '+ 9']) +
                       line(152, ['2x²', '+ 0x', '+ 5'], AMB) +
                       TX(220, 210, '補 0x，三行就對齊了', { anchor: 'middle', fs: 14, c: AMB }) },
            { t: '第三步：<b>逐行相加</b>，係數各自加，次方不動。',
              d: () => head() + cols(true) +
                       line(112, ['3x²', '+ 4x', '+ 9']) +
                       line(152, ['2x²', '+ 0x', '+ 5'], GREY) + bar(168) +
                       line(198, ['5x²', '+ 4x', '+ 14'], GRN, 19) }
          ], { acc: false });
        },
        caption: '「補 0」不是多此一舉，是<b>官方明列</b>的作法——就是為了避免對錯位。',
        example: {
          q: '用直式算 \\((x^2+7)+(3x^2-2x+1)\\)。',
          steps: [
            '第一式缺一次項，補成 \\(x^2+0x+7\\)。',
            '逐行相加：\\(1+3=4\\)、\\(0+(-2)=-2\\)、\\(7+1=8\\)。'
          ],
          ans: '\\(4x^2-2x+8\\)'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '次數不同一定不變，次數相同就可能被消掉',
        points: [
          '三次 ＋ 二次 <b>一定</b>是三次：二次式根本沒有三次項可以抵消它。',
          '二次 ＋ 二次 <b>不一定</b>是二次：最高次項可能剛好互相消掉。',
          '判斷次數前，一定要<b>先合併同類項</b>再看最高次。'
        ],
        formula: { label: '關鍵在最高次項會不會變 0<span class="pgref">課本 印 27</span>', tex: '(x^2+3x+5)+(-x^2+2x)=5x+5' },
        visual: (h) => {
          h.innerHTML = qaRows([
            { tag: '三次 ＋ 二次',
              q: '和一定還是三次式嗎？',
              a: '<b>一定是</b><br>二次式沒有三次項，抵消不掉' },
            { tag: '二次 ＋ 二次',
              q: '和一定還是二次式嗎？',
              a: '<b>不一定</b><br>\\((x^2+3x+5)+(-x^2+2x)=5x+5\\)' },
            { tag: '先化簡再判斷',
              q: '\\(3x^2+5x-3x^2+1\\) 是幾次式？',
              a: '<b>一次式</b><br>先合併得 \\(5x+1\\)，不是看到 \\(x^2\\) 就答二次' }
          ]);
          MJ(h);
        },
        caption: '這是本節少數能拉到<b>推理</b>層次的地方，值得花完整時間問「為什麼」。',
        example: {
          q: '兩個三次式相加，一定還是三次式嗎？',
          steps: [
            '不一定。看三次項的係數加起來會不會變 0。',
            '例如 \\((x^3+1)+(-x^3+x)=x+1\\)。'
          ],
          ans: '不一定，可能降次'
        }
      },

      {
        sec: '1-2', secName: '多項式的加法與減法',
        title: '最常錯的三件事：亂合併、漏變號、沒補 0',
        points: [
          '這三類幾乎涵蓋本節所有失分，考前只複習這一頁也值得。',
          '檢查法：代一個數字（例如 \\(x=1\\)）進原式與答案，對不起來就是錯了。',
          '不確定就<b>寫慢一點</b>，去括號和合併分兩行寫，不要跳步。'
        ],
        formula: { label: '三個關卡<span class="pgref">課本 印 30 重點整理</span>', tex: '\\begin{aligned}&\\text{同類項才能合併}\\\\&\\text{減號要分配到每一項}\\end{aligned}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '亂合併',
              bad: '\\(5+3x^2=8x^2\\)<br>\\(4x+2x=6x^2\\)',
              good: '\\(5+3x^2\\) 不能合併<br>\\(4x+2x=6x\\)（次方不加）' },
            { tag: '漏變號',
              bad: '\\(-(x^2-4x)=-x^2-4x\\)',
              good: '\\(-(x^2-4x)=-x^2+4x\\)<br><b>每一項</b>都要變' },
            { tag: '沒補 0',
              bad: '直式直接對齊，缺項空著',
              good: '缺項補 \\(0x\\) 再對齊，位次才不會錯開' }
          ]);
          MJ(h);
        },
        caption: '每一列都先問「錯的那個少了什麼」，再講正確寫法。',
        example: {
          q: '判斷 \\(7x-x=7\\) 對不對。',
          steps: [
            '\\(x\\) 前面沒寫數字，係數是 \\(1\\) 不是 \\(0\\)。',
            '\\(7-1=6\\)，所以是 \\(6x\\)。'
          ],
          ans: '錯，正確是 \\(6x\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課本隨堂 ①（單項式乘法、多項式乘多項式）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 33–36', sub: '單項式乘法、多項式乘多項式', tags: ['印1', '印2', '印3', '印4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課本隨堂 ②（缺項、用乘法公式、應用）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 37–39', sub: '缺項、用乘法公式、應用', tags: ['印5', '印6', '印7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課本隨堂 ③（除以單項式、除以一次式、缺項）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 41–46', sub: '除以單項式、除以一次式、缺項', tags: ['印9', '印10', '印12', '印13'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課本隨堂 ④（除以單項式、除以一次式、缺項）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 41–46', sub: '除以單項式、除以一次式、缺項', tags: ['印14'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課本隨堂 ⑤（商式係數為分數、四者關係、綜合）',
        points: [
          '點題號看<b>逐行詳解</b>，一行一行出現，可以邊講邊圈。',
          '行與行之間留了空白，<b>直接用畫筆補寫</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・隨堂練習', page: '印 47–50', sub: '商式係數為分數、四者關係、綜合', tags: ['印15', '印16', '印17', '印18'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜習作 ①（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・基礎練習', page: '印 10–13', sub: '基礎練習', tags: ['基礎1', '基礎2', '基礎3', '基礎4'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜習作 ②（基礎練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・基礎練習', page: '印 10–13', sub: '基礎練習', tags: ['基礎5', '基礎6', '基礎7'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜習作 ③（精熟練習）',
        points: [
          '點題號看<b>逐行詳解</b>；帶圖的題圖就在題目卡裡。',
          '一頁只放四題，<b>看清楚再挑</b>。',
          '哪一題錯的人多，就從那一題開始。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・基礎練習', page: '印 14', sub: '精熟練習', tags: ['精熟1', '精熟2'] }
          ]);
        },
        caption: '點任一題號 → 逐行詳解；「回題目列表」可以再挑下一題。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜自我評量 ①（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・自我評量', page: '印 52–54', sub: '自我評量與錯誤診療', tags: ['自評1', '自評2', '自評3', '自評4'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜自我評量 ②（自我評量與錯誤診療）',
        points: [
          '自我評量是<b>段考前最像考題</b>的一份，整份走一遍。',
          '長題會<b>分段顯示</b>，用標頭的 ‹ › 翻段。',
          '最後的<b>錯誤診療</b>是課本自己列的迷思，別跳過。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '課本・自我評量', page: '印 52–54', sub: '自我評量與錯誤診療', tags: ['自評5', '自評6', '錯誤診療'] }
          ]);
        },
        caption: '整份走一遍；錯誤診療那一列是課本點名的常見錯。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ①（選擇 1～4）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '選擇 1～4', tags: ['評選1', '評選2', '評選3', '評選4'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ②（選擇 5～8）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '選擇 5～8', tags: ['評選5', '評選6', '評選7', '評選8'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ③（選擇 9～10）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '選擇 9～10', tags: ['評選9', '評選10'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ④（填充 1 的 ①～④）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '填充 1 的 ①～④', tags: ['評填1(1)', '評填1(2)', '評填1(3)', '評填1(4)'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ⑤（填充 1 的 ⑤、填充 2、3）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '填充 1 的 ⑤、填充 2、3', tags: ['評填1(5)', '評填2', '評填3'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜課堂評量 ⑥（填充 4、5、計算 1、2）',
        points: [
          '這是<b>課堂評量卷</b>：改完卷子就用這裡逐題檢討。',
          '題號跟紙本一樣（選 / 填 / 計），老師唸題號、學生翻卷子。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '試卷・課堂評量', page: '印 8–10', sub: '填充 4、5、計算 1、2', tags: ['評填4', '評填5', '評計1', '評計2'] }
          ]);
        },
        caption: '一頁四題，投影出去看得清楚；改完卷子照題號挑。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜習作附錄本 ①（選擇 1～3）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・附錄本', page: '印 3', sub: '選擇 1～3', tags: ['附選1', '附選2', '附選3'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-3', secName: '多項式的乘除運算',
        title: '檢討｜習作附錄本 ②（選擇 4～6、填充 1）',
        points: [
          '這是<b>習作附錄本（基礎題型篇）</b>，一節一頁的選填題。',
          '題號跟紙本一樣，<b>錯的人多的先講</b>。',
          '點題號看逐行詳解，一行一行出現。'
        ],
        formula: { label: '這一節在檢討', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '1-3', [
            { src: '習作・附錄本', page: '印 3', sub: '選擇 4～6、填充 1', tags: ['附選4', '附選5', '附選6', '附填1'] }
          ]);
        },
        caption: '一頁最多四題；附錄本的題型與課堂評量互補。'
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '多項式相乘，就是 1-1 的四格圖再用一次',
        points: [
          '這不是新規則，就是<b>分配律</b>：左邊每一項乘右邊每一項。',
          '算完<b>先別停</b>，中間會有同類項要合併。',
          '拖步驟滑桿，看四塊面積怎麼變成展開式的四項。'
        ],
        formula: { label: '乘法就是逐項相乘<span class="pgref">課本 印 35</span>', tex: '(x+2)(x+3)=x^2+3x+2x+6' },
        visual: (h) => {
          const X0 = 92, Y0 = 46, AW = 168, BW = 92, CH = 104, DH = 66;
          const cells = (on) => {
            const g = (k, x, y, w, hh, lb, col, fill) =>
              CELL(x, y, w, hh, on.indexOf(k) >= 0 ? lb : '', { fill: on.indexOf(k) >= 0 ? fill : '#fbfcfe', c: col, fs: 15 });
            return g('a', X0, Y0, AW, CH, 'x·x', BLU, 'rgba(37,99,235,.13)') +
                   g('b', X0 + AW, Y0, BW, CH, 'x·3', AMB, 'rgba(217,119,6,.15)') +
                   g('c', X0, Y0 + CH, AW, DH, '2·x', AMB, 'rgba(217,119,6,.15)') +
                   g('d', X0 + AW, Y0 + CH, BW, DH, '2·3', GRN, 'rgba(5,150,105,.13)');
          };
          const frame = () =>
            TX(X0 + AW / 2, Y0 - 14, 'x', { anchor: 'middle', fs: 15, c: BLU }) +
            TX(X0 + AW + BW / 2, Y0 - 14, '3', { anchor: 'middle', fs: 15, c: BLU }) +
            TX(X0 - 16, Y0 + CH / 2 + 5, 'x', { anchor: 'middle', fs: 15, c: VIO }) +
            TX(X0 - 16, Y0 + CH + DH / 2 + 5, '2', { anchor: 'middle', fs: 15, c: VIO });
          SV.stepper(h, '0 0 440 268', [
            { t: '要算 (x＋2)(x＋3)。畫成長 x＋3、寬 x＋2 的長方形。',
              d: () => RECT(X0, Y0, AW + BW, CH + DH, { fill: 'rgba(37,99,235,.05)', stroke: BLU, sw: 2.4 }) + frame() +
                       TX(220, 244, '整塊面積 ＝ (x＋2)(x＋3)', { anchor: 'middle', fs: 16, c: INK }) },
            { t: '橫豎各切一刀，四塊分別是 x·x、x·3、2·x、2·3。',
              d: () => cells(['a', 'b', 'c', 'd']) + frame() +
                       TX(220, 244, 'x² ＋ 3x ＋ 2x ＋ 6', { anchor: 'middle', fs: 17, c: INK }) },
            { t: '中間的 3x 和 2x 是<b>同類項</b>，要合併成 5x。這一步最常被漏掉。',
              d: () => cells(['b', 'c']) + frame() +
                       TX(220, 244, '3x ＋ 2x ＝ 5x', { anchor: 'middle', fs: 18, c: AMB }) },
            { t: '合併後才是最後答案：x² ＋ 5x ＋ 6。',
              d: () => cells([]) + frame() +
                       TX(220, 244, 'x² ＋ 5x ＋ 6', { anchor: 'middle', fs: 19, c: GRN }) }
          ], { acc: false });
        },
        caption: '和 1-1 完全同一張圖——差別只在格子裡放的是 x 不是字母 a、b。',
        example: {
          q: '展開 \\((2x+1)(x+4)\\)。',
          steps: [
            '四塊：\\(2x\\cdot x=2x^2\\)、\\(2x\\cdot4=8x\\)、\\(1\\cdot x=x\\)、\\(1\\cdot4=4\\)。',
            '合併中間：\\(8x+x=9x\\)。'
          ],
          ans: '\\(2x^2+9x+4\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '相乘的次數要相加，不是取比較大的那個',
        points: [
          '加法：三次 ＋ 二次 ＝ 三次（取大的）。<b>乘法不一樣</b>。',
          '乘法：三次 × 二次 ＝ <b>五次</b>，因為最高次項相乘是 \\(x^3\\cdot x^2\\)。',
          '拖兩個滑桿改次數，看乘出來的次數怎麼跑。'
        ],
        formula: { label: '次數相加<span class="pgref">課本 印 33–34</span>', tex: '\\deg(f\\cdot g)=\\deg f+\\deg g' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl">
              <label>第一式 <span class="ival" id="mv">2</span> 次</label>
              <input type="range" id="ms" min="1" max="3" step="1" value="2">
              <label>第二式 <span class="ival" id="nv">1</span> 次</label>
              <input type="range" id="ns" min="1" max="3" step="1" value="1">
            </div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value, n = +h.querySelector('#ns').value;
            h.querySelector('#mv').textContent = m;
            h.querySelector('#nv').textContent = n;
            const CN = ['', '一', '二', '三', '四', '五', '六'];
            let s = '';
            s += RECT(30, 30, 168, 58, { r: 12, fill: 'rgba(37,99,235,.08)', stroke: BLU, sw: 2 });
            s += TX(114, 66, CN[m] + '次式', { anchor: 'middle', fs: 20, c: BLU });
            s += TX(220, 66, '×', { anchor: 'middle', fs: 22, c: GREY });
            s += RECT(242, 30, 168, 58, { r: 12, fill: 'rgba(124,58,237,.08)', stroke: VIO, sw: 2 });
            s += TX(326, 66, CN[n] + '次式', { anchor: 'middle', fs: 20, c: VIO });

            const SUP = ['', '', '²', '³'];
            s += TX(220, 118, '最高次項相乘：x' + SUP[m] + ' · x' + SUP[n], { anchor: 'middle', fs: 16, c: GREY });
            s += RECT(126, 138, 188, 56, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2 });
            s += TX(220, 174, '＝ ' + CN[m + n] + '次式', { anchor: 'middle', fs: 21, c: GRN });
            s += TX(220, 220, m + ' ＋ ' + n + ' ＝ ' + (m + n) + '（次數相加）', { anchor: 'middle', fs: 16, c: INK });
            s += TX(220, 248, '若當成加法取大的，會答成 ' + CN[Math.max(m, n)] + '次式 ✗', { anchor: 'middle', fs: 13.5, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 262', s);
          };
          h.querySelector('#ms').oninput = draw;
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '課本裡阿華的迷思就是這個：把<b>加法的次數規則</b>錯用到乘法上。',
        example: {
          q: '二次式乘以一次式，一定是幾次式？',
          steps: [
            '設二次式最高次項 \\(ax^2\\)（\\(a\\ne0\\)）、一次式最高次項 \\(mx\\)（\\(m\\ne0\\)）。',
            '相乘得 \\(amx^3\\)，而 \\(am\\ne0\\)，三次項不會消失。'
          ],
          ans: '一定是三次式'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '橫式、直式、乘法公式，算得對就好',
        points: [
          '課綱明講<b>不限制</b>用橫式或直式，能算出答案就可以。',
          '看到 1-1 學過的結構（和的平方、平方差），用<b>公式</b>最快。',
          '項數多、容易漏乘的時候，用<b>直式</b>比較不會掉項。'
        ],
        formula: { label: '先看結構，再決定工具<span class="pgref">課本 印 36–37</span>', tex: '\\text{結構符合就用公式，否則老實展開}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '用乘法公式（最快）', tex: '(x+5)(x-5)=x^2-25',
              color: GRN, fill: '#eef7f2', border: GRN, size: 18, note: '一和一差 → 平方差' },
            { label: '用乘法公式', tex: '(x+4)^2=x^2+8x+16',
              color: GRN, border: '#cfe8dd', size: 18, note: '和的平方，中間別漏 2ab' },
            { label: '結構不合就橫式展開', tex: '(2x+1)(x+4)=2x^2+9x+4',
              color: BLU, border: '#cfdcf5', size: 18 },
            { label: '項數多就用直式', tex: '(x^2+2x+3)(x+1)',
              color: AMB, border: '#f0dcbb', size: 17, note: '逐行乘、對齊、再相加，不容易漏項' }
          ], { gap: 10 });
          MJ(h);
        },
        caption: '不必逼全班統一用哪一種——<b>算得對比較重要</b>，這是課綱的原話。',
        example: {
          q: '計算 \\((x+7)(x-7)\\)。',
          steps: [
            '看結構：同一個 \\(x\\) 和 \\(7\\) 的和與差。',
            '套平方差：\\(x^2-7^2\\)。'
          ],
          ans: '\\(x^2-49\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '長除法跟整數除法一步都不差，只是換成 x',
        points: [
          '每一輪都是同三個動作：<b>除 → 乘回去 → 相減</b>，然後把下一項帶下來。',
          '除的時候只看<b>最高次項</b>：\\(x^2\\div x=x\\)。',
          '一直做到<b>餘式的次數比除式低</b>為止。'
        ],
        formula: { label: '一輪三動作<span class="pgref">課本 印 44–45</span>', tex: '\\text{除}\\rightarrow\\text{乘回}\\rightarrow\\text{相減}' },
        visual: (h) => {
          const L = 150, R = 396;
          const bar = () => `<path d="M${L} 66 L${L} 116 L${R} 116" fill="none" stroke="${INK}" stroke-width="2"/>` +
            `<line x1="${L}" y1="66" x2="${R}" y2="66" stroke="${INK}" stroke-width="2"/>`;
          const dividend = () => TX(166, 106, 'x² + 5x + 6', { fs: 19 }) + TX(60, 106, 'x + 2', { fs: 19 });
          const q = (t, c) => TX(190, 56, t, { fs: 19, c: c || GRN });
          const sub = (y, t, c) => TX(178, y, t, { fs: 18, c: c || RED });
          SV.stepper(h, '0 0 440 268', [
            { t: '被除式 x²＋5x＋6，除式 x＋2。先看最高次：x² ÷ x ＝ x。',
              d: () => bar() + dividend() + q('x') },
            { t: '把商的 x <b>乘回</b>除式：x(x＋2) ＝ x²＋2x，寫在下面。',
              d: () => bar() + dividend() + q('x') + sub(140, 'x² + 2x', BLU) },
            { t: '<b>相減</b>：(x²＋5x)−(x²＋2x) ＝ 3x，再把 ＋6 帶下來。',
              d: () => bar() + dividend() + q('x') + sub(140, '− ) x² + 2x', BLU) +
                       `<line x1="166" y1="152" x2="330" y2="152" stroke="${INK}" stroke-width="1.6"/>` +
                       sub(176, '3x + 6', RED) },
            { t: '再來一輪：3x ÷ x ＝ 3，商補上 ＋3；3(x＋2) ＝ 3x＋6。',
              d: () => bar() + dividend() + q('x + 3') + sub(140, '− ) x² + 2x', GREY) +
                       `<line x1="166" y1="152" x2="330" y2="152" stroke="${INK}" stroke-width="1.6"/>` +
                       sub(176, '3x + 6', INK) + sub(206, '− ) 3x + 6', BLU) },
            { t: '相減得 0，餘式是 0。商 ＝ x＋3，整除。',
              d: () => bar() + dividend() + q('x + 3') + sub(140, '− ) x² + 2x', GREY) +
                       `<line x1="166" y1="152" x2="330" y2="152" stroke="${INK}" stroke-width="1.6"/>` +
                       sub(176, '3x + 6', GREY) + sub(206, '− ) 3x + 6', GREY) +
                       `<line x1="166" y1="216" x2="330" y2="216" stroke="${INK}" stroke-width="1.6"/>` +
                       TX(300, 242, '餘式 0', { anchor: 'middle', fs: 18, c: GRN }) }
          ], { acc: false });
        },
        caption: '停止條件：<b>餘式的次數比除式低</b>就不能再除了。',
        example: {
          q: '計算 \\((x^2+7x+12)\\div(x+3)\\)。',
          steps: [
            '\\(x^2\\div x=x\\)；\\(x(x+3)=x^2+3x\\)；相減得 \\(4x\\)，帶下 \\(+12\\)。',
            '\\(4x\\div x=4\\)；\\(4(x+3)=4x+12\\)；相減得 \\(0\\)。'
          ],
          ans: '商 \\(x+4\\)，餘式 \\(0\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '長除法相減時，整列每一項都要變號',
        points: [
          '相減是<b>減掉一整列</b>，不是只減第一項——這是本節最大的失分點。',
          '漏了變號，會把還沒除完的式子誤判成餘式，整題就停在半路。',
          '穩的作法：把要減的那列<b>先變號寫成加法</b>，再逐行相加。'
        ],
        formula: { label: '相減＝整列變號再相加<span class="pgref">課本 印 45</span>', tex: '(2x^2+6x)-(2x^2-6x)=12x' },
        visual: (h) => {
          const bar = () => `<path d="M150 62 L150 112 L400 112" fill="none" stroke="${INK}" stroke-width="2"/>` +
            `<line x1="150" y1="62" x2="400" y2="62" stroke="${INK}" stroke-width="2"/>`;
          const head = () => TX(64, 102, 'x − 3', { fs: 18 }) + TX(166, 102, '2x² + 6x + 7', { fs: 18 });
          SV.stepper(h, '0 0 440 268', [
            { t: '題目 (2x²＋6x＋7) ÷ (x−3)。第一輪商是 2x，乘回得 2x²−6x。',
              d: () => bar() + head() + TX(190, 52, '2x', { fs: 18, c: GRN }) + TX(178, 136, '2x² − 6x', { fs: 17, c: BLU }) },
            { t: '仕軒的錯誤：只把第一項相減，−6x 那一項忘了變號，直接抄成 7。',
              d: () => bar() + head() + TX(190, 52, '2x', { fs: 18, c: RED }) + TX(178, 136, '2x² − 6x', { fs: 17, c: RED }) +
                       `<line x1="166" y1="148" x2="360" y2="148" stroke="${RED}" stroke-width="1.6"/>` +
                       TX(320, 172, '7', { fs: 18, c: RED }) +
                       TX(220, 218, '✗ 誤以為只剩常數，除法就結束了', { anchor: 'middle', fs: 15, c: RED }) },
            { t: '正確：整列變號 → 6x −(−6x) ＝ 6x＋6x ＝ 12x，不是 0。',
              d: () => bar() + head() + TX(190, 52, '2x', { fs: 18, c: GRN }) + TX(166, 136, '− ) 2x² − 6x', { fs: 17, c: GRN }) +
                       `<line x1="166" y1="148" x2="360" y2="148" stroke="${INK}" stroke-width="1.6"/>` +
                       TX(230, 172, '12x + 7', { fs: 18, c: GRN }) +
                       TX(220, 218, '6x −(−6x) ＝ 12x，還要再除一輪', { anchor: 'middle', fs: 15, c: GRN }) },
            { t: '再一輪：12x ÷ x ＝ 12，12(x−3) ＝ 12x−36，相減得 43。',
              d: () => bar() + head() + TX(196, 52, '2x + 12', { fs: 18, c: GRN }) + TX(166, 136, '− ) 2x² − 6x', { fs: 17, c: GREY }) +
                       `<line x1="166" y1="148" x2="360" y2="148" stroke="${INK}" stroke-width="1.6"/>` +
                       TX(230, 172, '12x + 7', { fs: 17, c: INK }) + TX(218, 200, '− ) 12x − 36', { fs: 17, c: BLU }) +
                       `<line x1="212" y1="212" x2="360" y2="212" stroke="${INK}" stroke-width="1.6"/>` +
                       TX(330, 238, '43', { fs: 19, c: GRN }) }
          ], { acc: false });
        },
        caption: '把仕軒的錯誤版本先抄在黑板上讓全班找錯，比抽象講「要變號」有效。',
        example: {
          q: '計算 \\((x^2+2x-8)\\div(x-2)\\)。',
          steps: [
            '\\(x^2\\div x=x\\)；\\(x(x-2)=x^2-2x\\)；相減 \\(2x-(-2x)=4x\\)，帶下 \\(-8\\)。',
            '\\(4x\\div x=4\\)；\\(4(x-2)=4x-8\\)；相減得 \\(0\\)。'
          ],
          ans: '商 \\(x+4\\)，餘式 \\(0\\)'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '把除法記成 A = B×Q + R，不要記成 A÷B = Q…R',
        points: [
          '\\(A\\div B=Q\\cdots R\\) 裡的等號<b>不代表兩邊相等</b>，不能同加同減同乘。',
          '寫成 \\(A=B\\times Q+R\\) 才是真的等式，可以拿來<b>驗算</b>與解題。',
          '算完把商和餘式代回去乘開，對得起來才是真的算對。'
        ],
        formula: { label: '除法原理<span class="pgref">課本 印 48</span>', tex: 'A=B\\times Q+R' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '只是一種記法，不是等式', tex: '(2x^2+6x+7)\\div(x-3)=2x+12\\cdots43',
              color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 16,
              note: '這個等號兩邊並不相等，不能同加同減' },
            { label: '這才是等式，可以操作', tex: '2x^2+6x+7=(x-3)(2x+12)+43',
              color: GRN, fill: '#eef7f2', border: GRN, size: 16 },
            { label: '拿它驗算', tex: '(x-3)(2x+12)=2x^2+6x-36',
              color: BLU, border: '#cfdcf5', size: 16,
              note: '再加 43 得 2x²+6x+7，與被除式相同 ✓' }
          ], { gap: 10 });
          MJ(h);
        },
        caption: '被除式 ＝ 除式 × 商式 ＋ 餘式——四個名詞的位置要能<b>指得出來</b>。',
        example: {
          q: '\\((x^2+2x-8)\\div(x-2)\\) 的商是 \\(x+4\\)、餘式 \\(0\\)，寫成除法原理並驗算。',
          steps: [
            '寫成 \\(x^2+2x-8=(x-2)(x+4)+0\\)。',
            '驗算：\\((x-2)(x+4)=x^2+4x-2x-8=x^2+2x-8\\)。'
          ],
          ans: '兩邊相同，算對了'
        }
      },

      {
        sec: '1-3', secName: '多項式的乘法與除法',
        title: '最常錯的三件事：漏乘、次數取大、相減漏變號',
        points: [
          '乘法漏項與除法漏變號，是本節兩大失分來源。',
          '檢查法：乘法用<b>四格圖</b>數格數，除法用 \\(A=B\\times Q+R\\) 代回去驗算。',
          '除法沒把整列變號，會提早停手——這種錯自己很難發現。'
        ],
        formula: { label: '兩個驗算工具<span class="pgref">課本 印 51 重點整理</span>', tex: '\\begin{aligned}&\\text{乘法：四格圖數格數}\\\\&\\text{除法：}A=B\\times Q+R\\end{aligned}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '乘法漏項',
              bad: '\\((x+2)(x+3)=x^2+6\\)',
              good: '四塊都要：\\(x^2+3x+2x+6\\)<br>合併得 \\(x^2+5x+6\\)' },
            { tag: '次數取大的',
              bad: '二次 × 一次 ＝ 二次',
              good: '乘法的次數<b>相加</b><br>二次 × 一次 ＝ <b>三次</b>' },
            { tag: '相減漏變號',
              bad: '\\((2x^2+6x)-(2x^2-6x)=0\\)',
              good: '整列變號：\\(6x+6x=12x\\)<br>還沒除完，不能停' }
          ]);
          MJ(h);
        },
        caption: '除法算完一定要代回 \\(A=B\\times Q+R\\) 驗一次，這是最省時的自我檢查。',
        example: {
          q: '判斷 \\((x+2)(x+3)=x^2+6\\) 對不對。',
          steps: [
            '代 \\(x=1\\)：左邊 \\(3\\times4=12\\)，右邊 \\(1+6=7\\)。',
            '兩邊不相等，所以是錯的（漏了中間的 \\(5x\\)）。'
          ],
          ans: '錯，正確是 \\(x^2+5x+6\\)'
        }
      }

    ]
  });
})();
