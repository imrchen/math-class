window.DECK = window.DECK || [];
(function () {
  const C = '#065f46';
  const RED = '#be123c', GRN = '#065f46', BLU = '#1e40af', VIO = '#6d28d9', AMB = '#92400e';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || '#0b1220'}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#94a3b8'}" stroke-width="${o.sw || 1.8}"/>`;

  window.DECK.push({
    ch: 3,
    title: '因式分解',
    color: C,
    sections: ['3-1 提公因式法與乘法公式因式分解', '3-2 利用十字交乘法因式分解', '附錄本 精熟、素養題型'],
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
    ]
  });
})();
