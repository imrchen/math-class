window.DECK = window.DECK || [];
(function () {
  const C = '#92400e';

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

  window.FIGURES_LOCAL = window.FIGURES_LOCAL || {};
  window.FIGURES_LOCAL['hexagon-two-rects-two-triangles'] = (() => {
    const T = (x, y, t, fs) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="#17212B">${t}</text>`;
    let g = `<path d="M42,176.35 L6,140.35 L140.35,6 L212.35,6 L346.7,140.35 L310.7,176.35 Z" fill="#FFFFFF" stroke="#17212B" stroke-width="2.6" stroke-linejoin="round"/>`
      + `<path d="M140.35,6 L310.7,176.35 M212.35,6 L42,176.35 M42,176.35 L310.7,176.35" fill="none" stroke="#17212B" stroke-width="2.2"/>`;
    g += T(91, 102, '甲', 30) + T(261, 102, '乙', 30) + T(176.35, 146, '丙', 30) + T(176.35, 34, '丁', 24);
    return `<svg viewBox="-8 -8 368.7 198.35" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%" font-family="'Noto Sans TC','PingFang TC',sans-serif">${g}</svg>`;
  })();

  window.DECK.push({
    ch: 4,
    title: '一元二次方程式',
    color: C,
    sections: ['4-1 因式分解法解一元二次方程式', '4-2 配方法與一元二次方程式的公式解', '4-3 一元二次方程式的應用', '會考練習 試卷（4-1～4-3）'],
    slides: [

      {
        sec: '4-1', secName: '因式分解法解一元二次方程式',
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
        sec: '4-1', secName: '因式分解法解一元二次方程式',
        title: '請填：這一頁的單一重點（互動頁）',
        points: [
          '重點一。',
          '重點二。',
          '拖滑桿看○○怎麼變。'
        ],
        formula: { label: '公式標籤', tex: 'y=ax' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>參數 a ＝ <span class="ival" id="av">2</span></label>
            <input type="range" id="as" min="1" max="6" step="1" value="2"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            let s = TX(220, 40, `目前 a = ${a}`, { fs: 18, c: C, anchor: 'middle' });
            s += BOX(80, 70, 40 * a, 90, { fill: 'rgba(37,99,235,.12)', stroke: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '互動頁的圖下方說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      },

      {
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
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
        sec: '4-2', secName: '配方法與一元二次方程式的公式解',
        title: '請填：這一頁的單一重點（互動頁）',
        points: [
          '重點一。',
          '重點二。',
          '拖滑桿看○○怎麼變。'
        ],
        formula: { label: '公式標籤', tex: 'y=ax' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>參數 a ＝ <span class="ival" id="av">2</span></label>
            <input type="range" id="as" min="1" max="6" step="1" value="2"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            let s = TX(220, 40, `目前 a = ${a}`, { fs: 18, c: C, anchor: 'middle' });
            s += BOX(80, 70, 40 * a, 90, { fill: 'rgba(37,99,235,.12)', stroke: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '互動頁的圖下方說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      },

      {
        sec: '4-3', secName: '一元二次方程式的應用',
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
        sec: '4-3', secName: '一元二次方程式的應用',
        title: '請填：這一頁的單一重點（互動頁）',
        points: [
          '重點一。',
          '重點二。',
          '拖滑桿看○○怎麼變。'
        ],
        formula: { label: '公式標籤', tex: 'y=ax' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>參數 a ＝ <span class="ival" id="av">2</span></label>
            <input type="range" id="as" min="1" max="6" step="1" value="2"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            let s = TX(220, 40, `目前 a = ${a}`, { fs: 18, c: C, anchor: 'middle' });
            s += BOX(80, 70, 40 * a, 90, { fill: 'rgba(37,99,235,.12)', stroke: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '互動頁的圖下方說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      },

      {
        sec: '會考練習', secName: '試卷（4-1～4-3）',
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
          PRACTICE.answerKey(h, '第4章', [
            { label: '4-1 第 1～3 題（印 1）', cols: 3, items: [
              ['1', '會1'], ['2', '會2'], ['3', '會3']
            ] },
            { label: '4-2 第 4～7 題（印 2–3）', cols: 4, items: [
              ['4', '會4'], ['5', '會5'], ['6', '會6'], ['7', '會7']
            ] },
            { label: '4-3 第 8～9 題（印 4–5）', cols: 2, items: [
              ['8', '會8'], ['9', '會9']
            ] }
          ]);
        },
        caption: '只到「答」這一層——為什麼錯，留到後面的詳解頁再講。'
      },
      {
        sec: '會考練習', secName: '試卷（4-1～4-3）',
        title: '檢討｜會考試題練習卷 ①（第 1～3 題）',
        points: [
          '這是<b>第 4 章的會考試題練習卷</b>：9 題都是歷屆會考的選擇題，題首標著哪一年。',
          '題號跟卷子一樣，老師唸題號、學生看卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第4章', [
            { src: '試卷・會考試題練習卷', page: '印 1', sub: '4-1 第 1～3 題', tags: ['會1', '會2', '會3'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '會考練習', secName: '試卷（4-1～4-3）',
        title: '檢討｜會考試題練習卷 ②（第 4～7 題）',
        points: [
          '這是<b>第 4 章的會考試題練習卷</b>：9 題都是歷屆會考的選擇題，題首標著哪一年。',
          '題號跟卷子一樣，老師唸題號、學生看卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第4章', [
            { src: '試卷・會考試題練習卷', page: '印 2–3', sub: '4-2 第 4～7 題', tags: ['會4', '會5', '會6', '會7'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
      {
        sec: '會考練習', secName: '試卷（4-1～4-3）',
        title: '檢討｜會考試題練習卷 ③（第 8～9 題）',
        points: [
          '這是<b>第 4 章的會考試題練習卷</b>：9 題都是歷屆會考的選擇題，題首標著哪一年。',
          '題號跟卷子一樣，老師唸題號、學生看卷子；<b>錯的人多的先講</b>。',
          '點題號看<b>逐行詳解</b>，行間留白可以直接用畫筆補寫。'
        ],
        visual: (h) => {
          if (typeof PRACTICE === 'undefined') {
            h.innerHTML = '<div>檢討題目列表（需 practice.js）</div>'; return;
          }
          PRACTICE.page(h, '第4章', [
            { src: '試卷・會考試題練習卷', page: '印 4–5', sub: '4-3 第 8～9 題', tags: ['會8', '會9'] }
          ]);
        },
        caption: '一頁最多四題；為什麼錯，點題號一行一行看。'
      },
    ]
  });
})();
