window.DECK = window.DECK || [];
(function () {
  const C = '#92400e';
  const RED = '#be123c', GRN = '#065f46', BLU = '#1e40af', VIO = '#6d28d9', AMB = '#92400e';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || '#0b1220'}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#94a3b8'}" stroke-width="${o.sw || 1.8}"/>`;

  window.DECK.push({
    ch: 4,
    title: '一元二次方程式',
    color: C,
    sections: ['4-1 因式分解法解一元二次方程式', '4-2 配方法與一元二次方程式的公式解', '4-3 一元二次方程式的應用'],
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
      }
    ]
  });
})();
