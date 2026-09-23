window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GREY = '#8a94a6';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}"${o.op !== undefined ? ` opacity="${o.op}"` : ''}>${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

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

  const SQ = [];
  for (let i = 1; i <= 20; i++) SQ.push(i * i);

  window.DECK.push({
    ch: 2,
    title: '平方根與畢氏定理',
    color: C,
    sections: ['2-1 平方根與近似值', '2-2 根式的運算', '2-3 畢氏定理'],
    slides: [

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '這段長度畫得出來，卻寫不出來',
        points: [
          '兩個 1 平方公分的正方形，剪拼成一個<b>面積 2</b> 的正方形。',
          '量它的邊長大約 1.4，但 \\(1.4\\times1.4=1.96\\)，<b>不是 2</b>。',
          '寫不出來的那段長度，就給它一個新符號：\\(\\sqrt{2}\\)。'
        ],
        formula: { label: '新符號<span class="pgref">課本 印 61 探索活動</span>', tex: '(\\sqrt{2})^2=2' },
        visual: (h) => {
          const u = 62;
          SV.stepper(h, '0 0 440 288', [
            {
              t: '先看兩個面積 1 的正方形', d: k =>
                `<rect x="96" y="70" width="${u}" height="${u}" fill="${BLU}" opacity="${.2 + .3 * k}" stroke="${BLU}" stroke-width="2"/>
                 <rect x="188" y="70" width="${u}" height="${u}" fill="${BLU}" opacity="${.2 + .3 * k}" stroke="${BLU}" stroke-width="2"/>` +
                TX(127, 108, '1', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(219, 108, '1', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(220, 46, '面積各是 1', { anchor: 'middle', fs: 14, c: GREY })
            },
            {
              t: '剪開重拼成一個正方形，面積還是 2', d: k =>
                `<rect x="0" y="0" width="440" height="288" fill="#fff"/>` +
                TX(220, 40, '拼成一個正方形', { anchor: 'middle', fs: 14, c: GREY }) +
                `<rect x="${220 - 44 * k}" y="${64}" width="${88 * k}" height="${88 * k}" fill="${VIO}" opacity=".28" stroke="${VIO}" stroke-width="2.2"/>` +
                TX(220, 116, '面積 2', { anchor: 'middle', fs: 17, c: VIO, op: k })
            },
            {
              t: '拿尺量邊長：大約 1.4 公分', d: k =>
                TX(220, 176, '量出來 ≈ 1.4', { anchor: 'middle', fs: 17, c: AMB, op: k })
            },
            {
              t: '驗算 1.4 × 1.4，卻不等於 2', d: k =>
                TX(220, 212, '1.4 × 1.4 ＝ 1.96', { anchor: 'middle', fs: 17, c: RED, op: k }) +
                TX(220, 238, '不是 2', { anchor: 'middle', fs: 15, c: RED, op: k }) +
                BOX(128, 252, 184, 30, { r: 10, fill: '#f3eeff', stroke: VIO, op: k > .5 ? (k - .5) * 2 : 0 }) +
                TX(220, 273, `就把這段長度叫 ${RT(2)}`, { anchor: 'middle', fs: 15, c: VIO, op: k > .5 ? (k - .5) * 2 : 0 })
            }
          ]);

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '這段長度是量得到的，只是沒辦法用整數、小數或分數寫完。',
        example: {
          q: '\\((\\sqrt{7})^2\\) 等於多少？',
          steps: ['\\(\\sqrt{7}\\) 是面積 7 的正方形邊長', '邊長乘邊長就是面積'],
          ans: '\\((\\sqrt{7})^2=7\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號 a 就是面積 a 的正方形，它的邊長',
        points: [
          '看到 \\(\\sqrt{a}\\)，就想「面積 \\(a\\) 的正方形，一邊多長」。',
          '邊長乘邊長就回到面積，所以 \\((\\sqrt{a})^2=a\\)。',
          '沒有面積是 \\(-9\\) 的正方形，所以<b>負數不能開根號</b>。'
        ],
        formula: { label: '意義<span class="pgref">課本 印 61–62</span>', tex: '(\\sqrt{a})^2=a\\quad(a\\ge 0)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>正方形的面積 <span class="ival av">9</span></label>
              <input type="range" class="as" min="1" max="25" step="1" value="9">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value;
            h.querySelector('.av').textContent = a;
            const side = Math.sqrt(a) * 33, x0 = 220 - side / 2, y0 = 44;
            const exact = Number.isInteger(Math.sqrt(a));
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', `
              <rect x="${x0}" y="${y0}" width="${side}" height="${side}" fill="${VIO}" opacity=".24" stroke="${VIO}" stroke-width="2.2"/>
              ${TX(220, y0 + side / 2 + 6, `面積 ${a}`, { anchor: 'middle', fs: 16, c: INK })}
              ${TX(x0 - 10, y0 + side / 2 + 6, '邊長', { anchor: 'end', fs: 13, c: GREY })}
              ${TX(220, y0 + side + 30, `邊長 ＝ ${RT(a)}`, { anchor: 'middle', fs: 19, c: VIO })}
              ${TX(220, 250, exact ? `${RT(a)} ＝ ${Math.sqrt(a)}（剛好是整數）` : `${RT(a)} 寫不成整數，但長度就在那裡`, { anchor: 'middle', fs: 14.5, c: exact ? GRN : GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          draw();
        },
        caption: '面積是 0 的正方形邊長也是 0，所以 \\(\\sqrt{0}=0\\)。',
        example: {
          q: '\\(\\sqrt{-9}\\) 等於多少？',
          steps: ['要找面積 \\(-9\\) 的正方形', '面積不可能是負的'],
          ans: '沒有這個數（國中階段）'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜根號的意義與比大小',
        points: [
          '看到 \\(\\sqrt{a}\\) 先想「面積 \\(a\\) 的正方形，邊長多長」。',
          '比大小只看<b>根號裡面</b>；裡面大，整個就大。',
          '\\((\\sqrt{a})^2\\) 一定等於 \\(a\\)，不用算出小數。'
        ],
        formula: { label: '這一組在練', tex: '(\\sqrt{a})^2=a\\qquad a\\gt b\\gt 0\\Rightarrow\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 62', BLU, '認識根號與比較大小',
              pText('印5 ①', '用根號表示面積為 \\(5\\) 的正方形邊長；\\((\\sqrt{12})^2=?\\)', '\\(\\sqrt{5}\\)；\\(12\\)') +
              pItem('印5 例1', '\\sqrt{51}\\;\\square\\;\\sqrt{49}', '\\(\\gt\\)') +
              pItem('印5 例1續', '\\sqrt{\\tfrac{7}{6}}\\;\\square\\;\\sqrt{\\tfrac{5}{4}}', '\\(\\lt\\)')), '2-1');
        },
        caption: '課本印 5：比大小只看根號裡面。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '面積比較大，邊長就比較長',
        points: [
          '\\(5\\) 比 \\(8\\) 小，所以 \\(\\sqrt{5}\\) 比 \\(\\sqrt{8}\\) 短。',
          '根號裡的數怎麼排，根號整個就怎麼排。',
          '沒有計算機時，也可以<b>兩邊同時平方</b>再比（限正數）。'
        ],
        formula: { label: '比大小<span class="pgref">課本 印 62 例 1</span>', tex: 'a\\gt b\\gt 0\\;\\Rightarrow\\;\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>左邊面積 <span class="ival av">5</span>　　右邊面積 <span class="ival bv">8</span></label>
              <input type="range" class="as" min="1" max="20" step="1" value="5">
              <input type="range" class="bs" min="1" max="20" step="1" value="8">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a;
            h.querySelector('.bv').textContent = b;
            const sa = Math.sqrt(a) * 26, sb = Math.sqrt(b) * 26, base = 206;
            const sign = a === b ? '＝' : (a > b ? '＞' : '＜');
            h.querySelector('.fig').innerHTML = svg('0 0 440 268', `
              <rect x="${112 - sa / 2}" y="${base - sa}" width="${sa}" height="${sa}" fill="${BLU}" opacity=".26" stroke="${BLU}" stroke-width="2"/>
              <rect x="${328 - sb / 2}" y="${base - sb}" width="${sb}" height="${sb}" fill="${GRN}" opacity=".26" stroke="${GRN}" stroke-width="2"/>
              ${SV.seg(28, base, 412, base, '#c3cddd', 2)}
              ${TX(112, base + 24, `面積 ${a}`, { anchor: 'middle', fs: 14, c: GREY })}
              ${TX(328, base + 24, `面積 ${b}`, { anchor: 'middle', fs: 14, c: GREY })}
              ${TX(112, base + 50, RT(a), { anchor: 'middle', fs: 20, c: BLU })}
              ${TX(220, base + 50, sign, { anchor: 'middle', fs: 20, c: INK })}
              ${TX(328, base + 50, RT(b), { anchor: 'middle', fs: 20, c: GRN })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '拖滑桿把面積換掉，兩個正方形誰高誰矮一眼就看得出來。',
        example: {
          q: '\\(\\sqrt{12}\\) 和 \\(\\sqrt{10}\\) 誰比較大？',
          steps: ['比根號裡面：\\(12\\gt10\\)'],
          ans: '\\(\\sqrt{12}\\gt\\sqrt{10}\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號裡剛好是平方數，就開得出來',
        points: [
          '\\(12\\times12=144\\)，所以 \\(\\sqrt{144}=12\\)。',
          '\\(1\\) 到 \\(20\\) 的平方數做成一張桌角卡，整章都用得到。',
          '<b>負的平方也一樣</b>：\\((-12)^2\\) 同樣是 \\(144\\)——這件事等一下會再用到。'
        ],
        formula: { label: '完全平方數<span class="pgref">課本 印 63</span>', tex: '\\sqrt{144}=12\\;\\Longleftrightarrow\\;12^2=144' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>選一個數 <span class="ival nv">12</span></label>
              <input type="range" class="ns" min="1" max="20" step="1" value="12">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value;
            h.querySelector('.nv').textContent = n;
            let cells = '';
            for (let i = 1; i <= 20; i++) {
              const col = (i - 1) % 5, row = Math.floor((i - 1) / 5);
              const x = 18 + col * 82, y = 30 + row * 40, on = i === n;
              cells += BOX(x, y, 76, 33, { r: 8, fill: on ? '#f3eeff' : '#fff', stroke: on ? VIO : '#e3e8f2', sw: on ? 2.2 : 1.2 });
              cells += TX(x + 38, y + 22, `${i}² ＝ ${i * i}`, { anchor: 'middle', fs: 12.5, c: on ? VIO : GREY, fw: on ? 900 : 700 });
            }
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', cells +
              BOX(74, 212, 292, 52, { r: 12, fill: '#fff', stroke: VIO }) +
              TX(220, 238, `${RT(n * n)} ＝ ${n}`, { anchor: 'middle', fs: 21, c: VIO }) +
              TX(220, 258, `${n}×${n} ＝ ${n * n}，(－${n})×(－${n}) 也 ＝ ${n * n}`, { anchor: 'middle', fs: 12.5, c: GREY }));
            radBars(h);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '這張表待會求整數部分還要再用一次，先讓它待在手邊。',
        example: {
          q: '\\(\\sqrt{169}\\) 等於多少？',
          steps: ['在表上找 \\(169\\)', '\\(13^2=169\\)'],
          ans: '\\(\\sqrt{169}=13\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '分數也開得出來：分子分母各自開',
        points: [
          '\\(\\sqrt{\\frac{25}{9}}\\)：上面開上面、下面開下面，\\(\\frac{5}{3}\\)。',
          '小數先<b>換成分數</b>再開：\\(1.96=\\frac{196}{100}\\)，開出來 \\(1.4\\)。',
          '判斷能不能開，看<b>分子分母是不是都是平方數</b>。'
        ],
        formula: { label: '分數的平方根<span class="pgref">課本 印 63 例 2</span>', tex: '\\sqrt{\\tfrac{25}{9}}=\\tfrac{5}{3}\\quad\\sqrt{1.96}=1.4' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>分子 <span class="ival av">25</span>　　分母 <span class="ival bv">9</span></label>
              <input type="range" class="as" min="1" max="12" step="1" value="5">
              <input type="range" class="bs" min="1" max="12" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a * a;
            h.querySelector('.bv').textContent = b * b;

            h.querySelector('.fig').innerHTML =
              `<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:14px">
                 <div style="font-size:13px;color:${GREY}">開一個分數</div>
                 <div style="font-size:34px;color:${INK}">\\(\\sqrt{\\dfrac{${a * a}}{${b * b}}}=\\dfrac{${a}}{${b}}\\)</div>
                 <div style="width:82%;background:#f6f9ff;border:1.5px solid ${BLU};border-radius:12px;padding:8px 14px;text-align:center;font-size:15px;font-weight:900;color:${BLU}">
                   因為 ${a}×${a}＝${a * a}，${b}×${b}＝${b * b}</div>
                 <div style="font-size:14px;color:${GREY}">上面開上面、下面開下面，各開各的</div>
               </div>`;
            MJ(h);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '小數不要直接開，<b>先換成分數</b>：\\(1.96=\\frac{196}{100}\\)，再各開各的。',
        example: {
          q: '求 \\(\\sqrt{\\frac{36}{49}}\\) 與 \\(\\sqrt{1.96}\\)。',
          steps: ['\\(36=6^2\\)、\\(49=7^2\\)', '\\(1.96=\\frac{196}{100}\\)，\\(196=14^2\\)、\\(100=10^2\\)'],
          ans: '\\(\\frac{6}{7}\\) 與 \\(1.4\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜用平方數求值（課本隨堂）',
        points: [
          '整數看平方數表；<b>分數上下各開</b>；小數先換成分數。',
          '\\(\\sqrt{5^2}\\) 這種直接消掉，答案就是裡面那個數。',
          '標準分解式把指數<b>除以 2</b>：\\(\\sqrt{2^6}=2^3\\)。'
        ],
        formula: { label: '這一組在練', tex: '\\sqrt{a^2}=a\\;(a\\ge 0)' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 63、64', BLU, '',
              pItem('印6 ①', '\\sqrt{121}') +
              pItem('印6 ②', '\\sqrt{\\tfrac{36}{49}}') +
              pItem('印6 續', '\\sqrt{1.96}') +
              pItem('印7 ①', '\\sqrt{2^6\\times 3^2}') +
              pItem('印7 ②', '\\sqrt{2025}')), '2-1');
        },
        caption: '課本印 6、7：根號裡是平方數就開得出來。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '開不出來的，就夾在兩個平方數中間',
        points: [
          '\\(30\\) 夾在 \\(25\\) 和 \\(36\\) 中間。',
          '\\(25=5^2\\)、\\(36=6^2\\)，所以 \\(\\sqrt{30}\\) 夾在 \\(5\\) 和 \\(6\\) 中間。',
          '整數部分就是<b>左邊那個數</b>：\\(\\sqrt{30}\\) 的整數部分是 \\(5\\)。'
        ],
        formula: { label: '夾擠<span class="pgref">課本 印 65</span>', tex: '25\\lt 30\\lt 36\\;\\Rightarrow\\;5\\lt\\sqrt{30}\\lt 6' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>根號裡的數 <span class="ival av">30</span></label>
              <input type="range" class="as" min="2" max="120" step="1" value="30">
            </div></div>`;
          const draw = () => {
            const a = +h.querySelector('.as').value;
            h.querySelector('.av').textContent = a;
            const k = Math.floor(Math.sqrt(a)), lo = k * k, hi = (k + 1) * (k + 1);
            const exact = lo === a;
            const X = v => 56 + (v - lo) / (hi - lo) * 328;
            h.querySelector('.fig').innerHTML = svg('0 0 440 264', `
              ${SV.seg(40, 120, 412, 120, '#c3cddd', 2.4)}
              ${SV.seg(X(lo), 108, X(lo), 132, BLU, 2.4)}
              ${SV.seg(X(hi), 108, X(hi), 132, BLU, 2.4)}
              ${TX(X(lo), 100, `${lo}`, { anchor: 'middle', fs: 15, c: BLU })}
              ${TX(X(hi), 100, `${hi}`, { anchor: 'middle', fs: 15, c: BLU })}
              ${TX(X(lo), 152, `${k}²`, { anchor: 'middle', fs: 13, c: GREY })}
              ${TX(X(hi), 152, `${k + 1}²`, { anchor: 'middle', fs: 13, c: GREY })}
              ${SV.dot(X(a), 120, AMB, 6)}
              ${TX(X(a), 56, `${a}`, { anchor: 'middle', fs: 18, c: AMB })}
              ${SV.seg(X(a), 66, X(a), 112, AMB, 2, '4 4')}
              ${BOX(70, 186, 300, 46, { r: 12, fill: '#f3eeff', stroke: VIO })}
              ${TX(220, 216, exact ? `${RT(a)} ＝ ${k}` : `${k} ＜ ${RT(a)} ＜ ${k + 1}`, { anchor: 'middle', fs: 20, c: VIO })}
              ${TX(220, 252, exact ? '剛好是平方數，直接開得出來' : `整數部分是 ${k}`, { anchor: 'middle', fs: 14, c: GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          draw();
        },
        caption: '找的方法就是翻上一頁的平方數表：哪兩個平方數把它夾住。',
        example: {
          q: '\\(\\sqrt{50}\\) 在哪兩個整數之間？',
          steps: ['\\(49\\lt50\\lt64\\)', '\\(49=7^2\\)、\\(64=8^2\\)'],
          ans: '\\(7\\lt\\sqrt{50}\\lt 8\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '老師給數字，你只要判斷夾在哪兩個',
        points: [
          '要算到小數點後一位，老師會<b>直接把平方值給你</b>。',
          '你要做的只有一件事：看目標被<b>哪兩個夾住</b>。',
          '不要用「哪個平方最接近」去猜，那會猜對但想錯。'
        ],
        formula: { label: '夾 根號 3<span class="pgref">課本 印 67 例 5</span>', tex: '1.7^2=2.89\\;\\lt\\;3\\;\\lt\\;3.24=1.8^2' },
        visual: (h) => {
          const row = (i, s, col, k) => TX(64, 104 + i * 36, s, { fs: 17, c: col, op: k });
          SV.stepper(h, '0 0 440 282', [
            {
              t: '先夾整數：根號 3 在 1 和 2 之間', d: k =>
                TX(220, 52, `${RT(3)} 大約是多少？`, { anchor: 'middle', fs: 19, c: C }) +
                row(0, '1² ＝ 1，2² ＝ 4 → 夾在 1 和 2 之間', BLU, k)
            },
            {
              t: '老師給你這四個平方值', d: k =>
                row(1, '1.6² ＝ 2.56　　1.7² ＝ 2.89', GREY, k) +
                row(2, '1.8² ＝ 3.24　　1.9² ＝ 3.61', GREY, k)
            },
            {
              t: '找哪兩個把 3 夾住', d: k =>
                row(3, '2.89 ＜ 3 ＜ 3.24', AMB, k) +
                BOX(92, 232, 256, 42, { r: 12, fill: '#f3eeff', stroke: VIO, op: k }) +
                TX(220, 260, `1.7 ＜ ${RT(3)} ＜ 1.8`, { anchor: 'middle', fs: 20, c: VIO, op: k })
            }
          ]);

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '本節到「夾在哪兩個」就結束，不再往下取捨到哪一位。',
        example: {
          q: '已知 \\(2.2^2=4.84\\)、\\(2.3^2=5.29\\)，\\(\\sqrt{5}\\) 夾在哪兩個數之間？',
          steps: ['看 \\(5\\) 落在哪裡', '\\(4.84\\lt5\\lt5.29\\)'],
          ans: '\\(2.2\\lt\\sqrt{5}\\lt 2.3\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '計算機按出來的，是近似值不是實際值',
        points: [
          '按法是 <b>13 → SHIFT → x²</b>（黃色 √ 在 x² 上面），跑出一長串。',
          '那一長串<b>乘自己也不會剛好是 13</b>，它只是很接近。',
          '螢幕會停在某一位，是因為螢幕只有那麼寬。'
        ],
        formula: { label: '近似值<span class="pgref">課本 印 68</span>', tex: '\\sqrt{13}\\approx 3.6' },

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
          const lcd = (txt, k) =>
            TX(BX + BW - 18, BY + 52, txt, { anchor: 'end', fs: 21, c: '#2b3320', op: k });
          const RX = 272;

          const NOTE = [
            ['① 1　② 3', INK, 16],
            ['③ SHIFT', AMB, 16],
            ['④ x²（上面那個黃色 √）', AMB, 14.5],
            ['3.605551275', GRN, 16]
          ];
          const notes = (n) => NOTE.slice(0, n)
            .map(([t, c, fs], i) => TX(RX, 66 + i * 34, t, { fs, c })).join('');
          SV.stepper(h, '0 0 440 300', [
            {
              t: '先按<b>數字</b>：1、3。螢幕上是 13。',
              d: () => body() + keys(['1', '3']) + lcd('13', 1) + notes(1)
            },
            {
              t: '再按 <b>SHIFT</b>（左上角那顆）。',
              d: () => body() + keys(['SHIFT']) + lcd('13', 1) + notes(2)
            },
            {
              t: '<b>沒有「√ 鍵」</b>：√ 是黃字、印在 x² 上面——按 <b>x²</b> 就開根號，<b>不用按 ＝</b>。',
              d: () => body() + keys(['x²']) + lcd('3.605551275', 1) + notes(4)
            },
            {
              t: '題目只要小數點後第一位 → <b>3.6</b>；但那一長串<b>乘自己不會剛好是 13</b>。',
              d: () => body() + keys([]) + lcd('3.605551275', 1) + notes(4) +
                BOX(RX - 8, 214, 152, 38, { r: 10, fill: '#f3eeff', stroke: VIO, sw: 2 }) +
                TX(RX + 68, 239, RT(13) + ' ≈ 3.6', { anchor: 'middle', fs: 18, c: VIO }) +
                TX(RX, 272, '乘自己 ＝ 12.99999999…', { fs: 12.5, c: AMB }) +
                TX(RX, 292, '很接近 13，但不是 13', { fs: 13.5, c: RED })
            }
          ], { acc: false });

          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '鍵位照南一線上計算機重畫（三角函數與括號那兩排本節用不到，省略）。「小明按出 3.16227766 就說那是 \\(\\sqrt{10}\\)」——不對，那只是近似值。',
        example: {
          q: '用計算機求 \\(\\sqrt{13}\\)，四捨五入到小數點後第一位。',
          steps: ['螢幕顯示 \\(3.605\\ldots\\)', '看第二位是 \\(0\\)，捨去'],
          ans: '\\(\\sqrt{13}\\approx 3.6\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜近似值與計算機（課本隨堂）',
        points: [
          '十分逼近法只要<b>判斷夾在哪兩個</b>，平方值老師會給。',
          '求整數部分就翻平方數表，找<b>哪兩個平方數夾住它</b>。',

          '課本這幾題只要求到<b>小數第一位</b>；要不要進位，用<b>中點</b>比一次就知道。'
        ],
        formula: { label: '這一組在練', tex: '169\\lt 180\\lt 196\\Rightarrow 13\\lt\\sqrt{180}\\lt 14' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 66–68', BLU, '夾擠、整數部分、計算機',
              pText('印9 例4', '已知 \\(2.6^2=6.76\\)、\\(2.7^2=7.29\\)⋯⋯，求 \\(\\sqrt{7}\\) 介於哪兩個相鄰的一位小數之間？', '\\(2.6\\) 與 \\(2.7\\)') +
              pText('印10 例5', '\\(\\sqrt{12}\\) 介於哪兩個連續整數之間？', '\\(3\\) 與 \\(4\\)') +

              pText('印10 例5續', '承上，\\(3.4^2=11.56\\)、\\(3.5^2=12.25\\)、\\(3.45^2=11.9025\\)，求 \\(\\sqrt{12}\\) 到小數第一位。') +
              pText('印11 例6', '面積 \\(1\\) 分的正方形土地（\\(1\\) 分約 \\(293.4\\) 坪、\\(1\\) 坪約 \\(3.3\\) 平方公尺），求邊長約幾公尺？')), '2-1');
        },
        caption: '課本印 9～11：夾擠、整數部分、計算機。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '根號 9 只有一個答案，9 的平方根有兩個',
        points: [
          '問「\\(\\sqrt{9}\\) 是多少」→ 只答 <b>3</b>。',
          '問「\\(9\\) 的平方根是多少」→ 要答 <b>3 和 −3</b>。',
          '因為 \\(3\\times3=9\\)，\\((-3)\\times(-3)\\) 也等於 \\(9\\)。'
        ],
        formula: { label: '兩種問法<span class="pgref">課本 印 69–70</span>', tex: '\\sqrt{9}=3\\qquad 9\\text{ 的平方根}=\\pm 3' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>換一個數 <span class="ival nv">3</span></label>
              <input type="range" class="ns" min="1" max="12" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const n = +h.querySelector('.ns').value, s = n * n;
            h.querySelector('.nv').textContent = n;
            h.querySelector('.fig').innerHTML = svg('0 0 440 266', `
              ${BOX(30, 40, 380, 84, { r: 14, fill: '#eef4ff', stroke: BLU })}
              ${TX(220, 70, `問：${RT(s)} 是多少？`, { anchor: 'middle', fs: 16, c: GREY })}
              ${TX(220, 104, `${n}`, { anchor: 'middle', fs: 26, c: BLU })}
              ${TX(392, 70, '一個答案', { anchor: 'end', fs: 12.5, c: BLU })}
              ${BOX(30, 140, 380, 84, { r: 14, fill: '#f3eeff', stroke: VIO })}
              ${TX(220, 170, `問：${s} 的平方根是多少？`, { anchor: 'middle', fs: 16, c: GREY })}
              ${TX(220, 204, `${n} 和 －${n}`, { anchor: 'middle', fs: 26, c: VIO })}
              ${TX(392, 170, '兩個答案', { anchor: 'end', fs: 12.5, c: VIO })}
              ${TX(220, 252, `因為 ${n}×${n} ＝ ${s}，(－${n})×(－${n}) 也 ＝ ${s}`, { anchor: 'middle', fs: 14, c: GREY })}
            `);
            radBars(h);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '唸一次差別就好：<b>根號只給正的那一個</b>，「平方根」才要給兩個。',
        example: {
          q: '\\(\\sqrt{16}\\) 是多少？\\(16\\) 的平方根是多少？',
          steps: ['根號只取正的', '平方根要兩個都寫'],
          ans: '\\(\\sqrt{16}=4\\)；\\(16\\) 的平方根是 \\(4\\) 和 \\(-4\\)'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜求平方根（課本隨堂）',
        points: [
          '問「某數的平方根」→ <b>兩個答案</b>，一正一負。',
          '開不出整數就留著根號：\\(13\\) 的平方根是 \\(\\pm\\sqrt{13}\\)。'
        ],
        formula: { label: '這一組在練', tex: 'x^2=a\\Rightarrow x=\\pm\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 69、70', BLU, '判斷與求平方根',
              pText('印12', '兩句敘述判斷對錯：誰是誰的平方根，主詞不要顛倒。') +
              pItem('印13 ②', '13')), '2-1');
        },
        caption: '課本印 12、13：問「平方根」就要寫 ±。'
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>拆根號、看問法、猜近似值</b>。',
          '第一個最常見，用計算機當場按一次就看得出來。',
          '第三個最可怕：<b>取小數第一位時它常常會猜對</b>，但問整數部分就露餡。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 72 重點整理</span>', tex: '\\sqrt{9+16}\\ne\\sqrt{9}+\\sqrt{16}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '把根號拆到加法上', bad: '\\(\\sqrt{9+16}=3+4=7\\)', good: '\\(\\sqrt{9+16}=\\sqrt{25}=5\\)　先算裡面' },
            { tag: '看錯問法', bad: '\\(\\sqrt{9}=\\pm 3\\)', good: '\\(\\sqrt{9}=3\\)；\\(9\\) 的<b>平方根</b>才是 \\(\\pm 3\\)' },
            { tag: '挑平方最接近的來猜', bad: '\\(15\\) 離 \\(16\\) 比較近，<br>就答整數部分是 \\(4\\)', good: '要看<b>夾在哪兩個</b>：<br>\\(9<15<16\\Rightarrow 3<\\sqrt{15}<4\\)，整數部分是 \\(3\\)' }
          ]);
          MJ(h);
        },
        caption: '第三個特別要防：小數第一位常常猜得對，所以更難發現——問整數部分才看得出概念沒進去。',
        example: {
          q: '下課前一分鐘：\\(\\sqrt{50}\\) 在哪兩個整數之間？',
          steps: ['翻平方數表找夾住 \\(50\\) 的兩個', '\\(49\\) 和 \\(64\\)'],
          ans: '\\(7\\) 和 \\(8\\) 之間'
        }
      },

      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（基礎 1）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '比大小只看<b>根號裡面</b>；裡面大，整個就大。',
          '\\((\\sqrt{a})^2\\) 一定等於 \\(a\\)，不用算出小數。'
        ],
        formula: { label: '這一組在練', tex: '(\\sqrt{a})^2=a\\qquad a\\gt b\\gt 0\\Rightarrow\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 19', AMB, '填入適當的數、比較大小',
              pText('基礎1 ①', '面積 \\(8\\) 的正方形，邊長為？') +
              pText('基礎1 ②', '面積 \\(15\\) 的正方形，邊長為？') +
              pItem('基礎1 ③', '(\\sqrt{10})^2') +
              pItem('基礎1 ④', '(\\sqrt{\\tfrac{15}{4}})^2')), '2-1');
        },
        caption: '習作印 19：<b>自己寫完</b>再對答案。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（基礎 2、3）',
        points: [
          '看到 \\(\\sqrt{a}\\) 先想「面積 \\(a\\) 的正方形，邊長多長」。',
          '比大小只看<b>根號裡面</b>；裡面大，整個就大。',
          '\\((\\sqrt{a})^2\\) 一定等於 \\(a\\)，不用算出小數。'
        ],
        formula: { label: '這一組在練', tex: '(\\sqrt{a})^2=a\\qquad a\\gt b\\gt 0\\Rightarrow\\sqrt{a}\\gt\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 19', AMB, '填入適當的數、比較大小',
              pItem('基礎2 ①', '\\sqrt{9}\\;\\square\\;\\sqrt{8}', '\\(\\gt\\)') +
              pItem('基礎2 ②', '\\sqrt{\\tfrac{13}{3}}\\;\\square\\;3', '\\(\\lt\\)')) +
            pCard('習作・基礎練習 3', '印 20', AMB, '六小題，求值',
              pItem('基礎3 ①', '\\sqrt{5^2}') +
              pItem('基礎3 ②', '\\sqrt{(\\tfrac{7}{19})^2}') +
              pItem('基礎3 ③', '\\sqrt{169}')), '2-1');
        },
        caption: '習作印 19、印 20：<b>自己寫完</b>再對答案。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（基礎 3）',
        points: [
          '整數看平方數表；<b>分數上下各開</b>；小數先換成分數。',
          '\\(\\sqrt{5^2}\\) 這種直接消掉，答案就是裡面那個數。',
          '標準分解式把指數<b>除以 2</b>：\\(\\sqrt{2^6}=2^3\\)。'
        ],
        formula: { label: '這一組在練', tex: '\\sqrt{a^2}=a\\;(a\\ge 0)' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習 3', '印 20', AMB, '六小題，求值',
              pItem('基礎3 ④', '\\sqrt{1.69}') +
              pItem('基礎3 續一', '\\sqrt{\\tfrac{81}{25}}', '', '基礎3 ⑤') +
              pItem('基礎3 續二', '\\sqrt{2^2\\times 3^4}', '', '基礎3 ⑥')), '2-1');
        },
        caption: '習作印 20：<b>自己寫完</b>再對答案。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（基礎 4、5）',
        points: [
          '基礎 4 要用<b>計算機</b>：按法是 <b>11 → SHIFT → x²</b>（√ 在 x² 上面）。',
          '基礎 5 ① 是整數部分：找<b>哪兩個平方數夾住它</b>。',
          '基礎 5 ② 偏難（求最小的 \\(n\\)），做不出來先跳過。'
        ],
        formula: { label: '這一組在練', tex: '169\\lt 180\\lt 196\\Rightarrow 13\\lt\\sqrt{180}\\lt 14' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 20、21', AMB, '十分逼近、計算機、整數部分',
              pText('基礎4', '用十分逼近法求 \\(\\sqrt{11}\\) 的近似值（四捨五入到小數點後第一位）。', '3.3') +
              pText('基礎4 續', '用計算機求 \\(\\sqrt{11}\\)（原題要第三位；<b>今天先做第一位</b>）。', '3.3（第三位 3.317）') +
              pText('基礎5 ①', '\\(m\\) 為正整數，\\(m\\lt\\sqrt{180}\\lt m+1\\)，求 \\(m\\)。') +
              pText('基礎5 ②', '\\(n\\) 為正整數，使 \\(\\sqrt{180+n}\\) 為正整數，求最小的 \\(n\\)。')), '2-1');
        },
        caption: '習作印 20、21：<b>自己寫完</b>再對答案。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（基礎 6、7）',
        points: [
          '問「某數的平方根」→ <b>兩個答案</b>，一正一負。',
          '開不出整數就留著根號：\\(13\\) 的平方根是 \\(\\pm\\sqrt{13}\\)。',
          '最後兩題是<b>反過來求未知數</b>，做不完不要緊。'
        ],
        formula: { label: '這一組在練', tex: 'x^2=a\\Rightarrow x=\\pm\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 21、22', AMB, '求平方根；最後一題是反推',
              pItem('基礎6 ①', '64') +
              pItem('基礎6 ②', '0.64')) +
            pCard('習作・基礎練習', '印 21、22', AMB, '求平方根；最後一題是反推',
              pItem('基礎6 ③', '1\\tfrac{21}{100}') +
              pItem('基礎6 ④', '47') +
              pText('基礎7', '已知 \\(3x+4\\) 的平方根為 \\(\\pm 4\\)，求 \\(x\\)。')), '2-1');
        },
        caption: '問「平方根」就要寫 ±；基礎 7 是反過來求未知數。'
      },
      {
        sec: '2-1', secName: '平方根與近似值',
        title: '練習｜習作（精熟）',
        points: [
          '問「某數的平方根」→ <b>兩個答案</b>，一正一負。',
          '開不出整數就留著根號：\\(13\\) 的平方根是 \\(\\pm\\sqrt{13}\\)。',
          '最後兩題是<b>反過來求未知數</b>，做不完不要緊。'
        ],
        formula: { label: '這一組在練', tex: 'x^2=a\\Rightarrow x=\\pm\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 22', GRN, '',
              pText('精熟1', '已知 \\(\\sqrt{3x+4}\\) 的平方根為 \\(\\pm 4\\)，求 \\(x\\)。') +
              pText('精熟2', 'BMI \\(=\\frac{W}{H^2}\\) 的應用題（見習作印 4）。')), '2-1');
        },
        caption: '習作印 22：<b>自己寫完</b>再對答案。'
      },
      {

        sec: '2-1', secName: '平方根與近似值',
        title: '對答案｜習作 ①（基礎 1～3）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '2-1', [
            { label: '基礎 1（印 19）', cols: 3, items: [['1 ①②', '基礎1 ①'], ['1 ③④', '基礎1 ③']] },
            { label: '基礎 2、3（印 19–20）', cols: 3, items: [['2 ①', '基礎2 ①'], ['2 ②', '基礎2 ②'], ['3 ①②', '基礎3 ①'], ['3 ③④', '基礎3 ③']] },
            { label: '基礎 3（印 20）', cols: 3, items: [['3 ⑤', '基礎3 續一'], ['3 ⑥', '基礎3 續二']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {

        sec: '2-1', secName: '平方根與近似值',
        title: '對答案｜習作 ②（基礎 4～7、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '2-1', [
            { label: '基礎 4、5（印 20–21）', cols: 3, items: [['4', '基礎4'], ['5 ①', '基礎5 ①'], ['5 ②', '基礎5 ②']] },
            { label: '基礎 6、7（印 21–22）', cols: 3, items: [['6 ①②', '基礎6 ①'], ['6 ③④', '基礎6 ③'], ['7', '基礎7']] },
            { label: '精熟（印 22）', cols: 3, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：帶著根號的算式，叫<span class="k">根式</span>。',
          '<b>長什麼樣</b>：\\(3\\sqrt{2}\\) 的 \\(3\\) 是<b>係數</b>，\\(2\\) 在<b>根號裡</b>。',
          '<b>做什麼</b>：乘、除、化簡，最後才談<b>能不能相加</b>。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 75–91</span>', tex: '3\\sqrt{2}=\\sqrt{2}+\\sqrt{2}+\\sqrt{2}' },
        visual: (h) => {
          const card = (y, n, q, a, col) =>
            BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
            `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
            TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
            TX(80, y + 28, q, { fs: 15.5, c: INK }) +
            TX(80, y + 52, a, { fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 250',
            card(6, '1', '什麼是根式？', '把根號寫進算式裡，它就是一個數', VIO) +
            card(88, '2', '那些名詞長什麼樣？', '係數、根號裡的數、最簡根式、同類方根', BLU) +
            card(170, '3', '我要對它做什麼？', '乘、除、化簡，最後才問能不能相加', GRN));
        },
        caption: '整節的順序就是這三問：先認得它，再認得名詞，最後才動手算。',
        example: {
          q: '\\(5\\sqrt{3}\\) 是幾個 \\(\\sqrt{3}\\)？係數是多少？',
          steps: ['\\(5\\sqrt{3}\\) 就是 \\(5\\) 個 \\(\\sqrt{3}\\)', '前面那個 \\(5\\) 叫係數'],
          ans: '\\(5\\) 個 \\(\\sqrt{3}\\)，係數是 \\(5\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '乘可以合進同一個根號，加不行',
        points: [
          '\\(\\sqrt{a}\\times\\sqrt{b}\\) 可以合起來寫成 \\(\\sqrt{ab}\\)，<b>永遠成立</b>。',
          '\\(\\sqrt{a}+\\sqrt{b}\\) <b>不等於</b> \\(\\sqrt{a+b}\\)，拖滑桿看小數就知道。',
          '本節兩條規則的分界線，就在這一頁。'
        ],
        formula: { label: '溫故啟思<span class="pgref">課本 印 75、85</span>', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\qquad \\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>左邊 a <span class="ival av">4</span>　　右邊 b <span class="ival bv">9</span></label>
              <input type="range" class="as" min="2" max="16" step="1" value="4">
              <input type="range" class="bs" min="2" max="16" step="1" value="9">
            </div></div>`;
          const d2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
          const draw = () => {
            const a = +h.querySelector('.as').value, b = +h.querySelector('.bs').value;
            h.querySelector('.av').textContent = a;
            h.querySelector('.bv').textContent = b;
            const mul = Math.sqrt(a) * Math.sqrt(b), add = Math.sqrt(a) + Math.sqrt(b);
            let s = '';
            s += BOX(8, 8, 208, 110, { r: 14, fill: 'rgba(5,150,105,.07)', stroke: GRN, sw: 2 });
            s += TX(112, 32, '乘法', { anchor: 'middle', fs: 14, c: GRN });
            s += TX(112, 62, `${RT(a)} × ${RT(b)} ＝ ${RT(a * b)}`, { anchor: 'middle', fs: 18, c: INK });
            s += TX(112, 88, `${d2(mul)} ＝ ${d2(Math.sqrt(a * b))}`, { anchor: 'middle', fs: 15, c: GRN });
            s += TX(112, 112, '✓ 兩邊一樣', { anchor: 'middle', fs: 14, c: GRN });
            s += BOX(224, 8, 208, 110, { r: 14, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 2 });
            s += TX(328, 32, '加法', { anchor: 'middle', fs: 14, c: RED });
            s += TX(328, 62, `${RT(a)} ＋ ${RT(b)} 和 ${RT(a + b)}`, { anchor: 'middle', fs: 18, c: INK });
            s += TX(328, 88, `${d2(add)} 和 ${d2(Math.sqrt(a + b))}`, { anchor: 'middle', fs: 15, c: RED });
            s += TX(328, 112, add.toFixed(3) === Math.sqrt(a + b).toFixed(3) ? '？再看清楚' : '✗ 兩邊不一樣',
              { anchor: 'middle', fs: 14, c: RED });

            const u = 24, wA = Math.sqrt(a) * u, wB = Math.sqrt(b) * u;

            const x0 = 220 - wB / 2, y0 = 152;
            s += `<rect x="${x0}" y="${y0}" width="${wB}" height="${wA}" fill="${VIO}" opacity=".18" stroke="${VIO}" stroke-width="2"/>`;
            s += TX(x0 + wB / 2, y0 + wA / 2 + 6, `面積 ${a * b}`, { anchor: 'middle', fs: 15, c: INK });
            s += TX(x0 + wB / 2, y0 - 10, `${RT(b)}`, { anchor: 'middle', fs: 14, c: VIO });
            s += TX(x0 - 10, y0 + wA / 2 + 5, `${RT(a)}`, { anchor: 'end', fs: 14, c: VIO });
            s += TX(220, 268, '長方形的兩邊相乘＝面積，所以乘法合得起來', { anchor: 'middle', fs: 13.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 276', s);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          h.querySelector('.bs').oninput = draw;
          draw();
        },
        caption: '課本印 85 的探索活動就是用計算機按這兩行：乘法對得上，加法對不上。',
        example: {
          q: '\\(\\sqrt{2}+\\sqrt{3}\\) 等於 \\(\\sqrt{5}\\) 嗎？',
          steps: ['\\(\\sqrt{2}\\doteq1.414\\)、\\(\\sqrt{3}\\doteq1.732\\)，加起來約 \\(3.146\\)', '\\(\\sqrt{5}\\doteq2.236\\)'],
          ans: '不相等'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '數和根式相乘，只動前面那個數',
        points: [
          '\\(a\\times\\sqrt{b}\\) 省略乘號寫成 \\(a\\sqrt{b}\\)；\\(\\sqrt{b}\\div a\\) 寫成 \\(\\dfrac{\\sqrt{b}}{a}\\)。',
          '\\(3\\sqrt{2}\\) 是 <b>3 個</b> \\(\\sqrt{2}\\)，<b>不是</b> \\(\\sqrt{6}\\)。',
          '前面的數相乘，<b>根號裡完全不動</b>。'
        ],
        formula: { label: '簡記與係數<span class="pgref">課本 印 76、77 例 1</span>', tex: 'a\\times\\sqrt{b}=a\\sqrt{b}\\qquad (-12)\\times 5\\sqrt{3}=-60\\sqrt{3}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '先把 3 根 2 畫出來：3 個一樣長的段', d: k => {
                let s = TX(220, 26, '3 個 根號 2 接起來', { anchor: 'middle', fs: 15, c: GREY });
                for (let i = 0; i < 3; i++) {
                  s += `<rect x="${70 + i * 100}" y="46" width="${92 * k}" height="30" fill="${VIO}" opacity=".22" stroke="${VIO}" stroke-width="2"/>`;
                  s += TX(116 + i * 100, 68, `${RT(2)}`, { anchor: 'middle', fs: 16, c: VIO, op: k });
                }
                return s;
              }
            },
            {
              t: '接起來就記作 3 根 2，3 是係數', d: k =>
                TX(220, 112, `${RT(2)} ＋ ${RT(2)} ＋ ${RT(2)} ＝ 3${RT(2)}`, { anchor: 'middle', fs: 20, c: INK, op: k })
            },
            {
              t: '注意：3 根 2 不是根號 6', d: k =>
                BOX(96, 132, 248, 40, { r: 12, fill: '#fdeef2', stroke: RED, op: k }) +
                TX(220, 158, `3${RT(2)} ≠ ${RT(6)}`, { anchor: 'middle', fs: 19, c: RED, op: k })
            },
            {
              t: '相乘時只動前面的數，根號裡不變', d: k =>
                TX(220, 204, `(−12) × 5${RT(3)}`, { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(220, 234, `＝ (−12 × 5) × ${RT(3)}`, { anchor: 'middle', fs: 18, c: BLU, op: k }) +
                TX(220, 264, `＝ −60${RT(3)}`, { anchor: 'middle', fs: 20, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '南一備課用書印 76 的眉批就提醒：要舉錯的例子，例如 \\(2\\times 3\\sqrt{5}\\) 不是 \\(23\\sqrt{5}\\)。',
        example: {
          q: '計算 \\((-12)\\times 5\\sqrt{3}\\)。',
          steps: ['先算前面的數 \\((-12)\\times 5=-60\\)', '根號裡的 \\(3\\) 不動'],
          ans: '\\(-60\\sqrt{3}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜把乘號省略寫成根式',
        points: [
          '\\(a\\times\\sqrt{b}\\) 直接寫成 \\(a\\sqrt{b}\\)，中間不用乘號。',
          '係數是 \\(-1\\) 時<b>只寫負號</b>：\\((-1)\\times\\sqrt{15}=-\\sqrt{15}\\)。',
          '除以一個數就寫成<b>分母</b>：\\(\\sqrt{5}\\div 3=\\dfrac{\\sqrt{5}}{3}\\)。'
        ],
        formula: { label: '這一組在練', tex: 'a\\times\\sqrt{b}=a\\sqrt{b}\\qquad \\sqrt{b}\\div a=\\frac{\\sqrt{b}}{a}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 76', BLU, '簡記下列各式',
              pItem('印2 ①', '3\\times\\sqrt{11}') +
              pItem('印2 ②', '\\left(-\\tfrac{7}{2}\\right)\\times\\sqrt{6}') +
              pItem('印2 ③', '(-1)\\times\\sqrt{15}') +
              pItem('印2 ④', '\\sqrt{5}\\div 3')), '2-2');
        },
        caption: '課本印 76 的隨堂：四題都只是換一種寫法，不用算出答案。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜數與根式的乘積',
        points: [
          '只把<b>前面的數</b>相乘（或相除），根號裡的數完全不動。',
          '負號照一般乘法的規則：負負得正。',
          '除以 \\(3\\) 就是乘 \\(\\dfrac{1}{3}\\)，根號一樣不動。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 77 例 1</span>', tex: '(a\\sqrt{b})\\times c=(ac)\\sqrt{b}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 77', BLU, '數與根式的乘積',
              pItem('印3 ①', '2\\sqrt{2}\\times(-8)') +
              pItem('印3 ②', '(-2\\sqrt{6})\\times\\left(-\\tfrac{3}{2}\\right)') +
              pItem('印3 例1續', '-24\\sqrt{15}\\div 3')), '2-2');
        },
        caption: '第三題是除法，做法一樣：只動前面的數。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '根式乘根式：係數歸係數，根號歸根號',
        points: [
          '分成兩欄算：<b>前面的數相乘</b>、<b>根號裡的數相乘</b>。',
          '\\(-3\\sqrt{10}\\times(-5\\sqrt{3})\\)：先 \\((-3)(-5)=15\\)，再 \\(10\\times3=30\\)。',
          '\\(\\sqrt{5}\\times\\sqrt{5}=5\\)，兩個一樣的根號相乘就開出來了。'
        ],
        formula: { label: '乘法規則<span class="pgref">課本 印 79 例 2</span>', tex: 'a\\sqrt{b}\\times c\\sqrt{d}=(ac)\\sqrt{bd}\\quad(b\\ge 0,\\;d\\ge 0)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>根號裡 b <span class="ival bv">10</span>　　根號裡 d <span class="ival dv">3</span></label>
              <input type="range" class="bs" min="2" max="12" step="1" value="10">
              <input type="range" class="ds" min="2" max="12" step="1" value="3">
            </div></div>`;
          const draw = () => {
            const b = +h.querySelector('.bs').value, d = +h.querySelector('.ds').value;
            h.querySelector('.bv').textContent = b;
            h.querySelector('.dv').textContent = d;
            let s = '';
            s += BOX(14, 10, 196, 92, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 });
            s += TX(112, 34, '前面的數', { anchor: 'middle', fs: 14, c: BLU });
            s += TX(112, 68, '(−3) × (−5) ＝ 15', { anchor: 'middle', fs: 17, c: INK });
            s += BOX(230, 10, 196, 92, { r: 12, fill: 'rgba(124,58,237,.08)', stroke: VIO, sw: 2 });
            s += TX(328, 34, '根號裡的數', { anchor: 'middle', fs: 14, c: VIO });
            s += TX(328, 68, `${b} × ${d} ＝ ${b * d}`, { anchor: 'middle', fs: 17, c: INK });
            s += TX(220, 140, `−3${RT(b)} × (−5${RT(d)})`, { anchor: 'middle', fs: 19, c: INK });
            s += TX(220, 178, `＝ 15${RT(b * d)}`, { anchor: 'middle', fs: 22, c: GRN });
            s += BOX(66, 200, 308, 46, { r: 12, fill: '#f6f9ff', stroke: '#d6e0f2' });
            s += TX(220, 230, `兩個一樣的：${RT(5)} × ${RT(5)} ＝ ${RT(25)} ＝ 5`, { anchor: 'middle', fs: 16, c: BLU });
            h.querySelector('.fig').innerHTML = svg('0 0 440 258', s);
            radBars(h);
          };
          h.querySelector('.bs').oninput = draw;
          h.querySelector('.ds').oninput = draw;
          draw();
        },
        caption: '兩欄各算一次再合起來，就不會把係數和根號裡的數混在一起。',
        example: {
          q: '計算 \\(\\sqrt{2}\\times\\sqrt{8}\\)。',
          steps: ['根號裡相乘：\\(2\\times 8=16\\)', '\\(\\sqrt{16}\\) 開得出來'],
          ans: '\\(4\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜根式的乘法',
        points: [
          '前面的數相乘一次，根號裡的數相乘一次。',
          '沒有寫係數就是 \\(1\\)：\\(\\sqrt{2}\\times\\sqrt{11}=\\sqrt{22}\\)。',
          '算完先看一眼：根號裡是不是平方數，開得出來就開。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 79 例 2</span>', tex: 'a\\sqrt{b}\\times c\\sqrt{d}=(ac)\\sqrt{bd}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 79', BLU, '根式的乘法',
              pItem('印5 ①', '\\sqrt{2}\\times\\sqrt{11}') +
              pItem('印5 ②', '-3\\sqrt{10}\\times(-5\\sqrt{3})') +
              pItem('印5 例2續', '\\tfrac{\\sqrt{5}}{3}\\times 6\\sqrt{5}')), '2-2');
        },
        caption: '第三題算完根號會整個消失——\\(\\sqrt{5}\\times\\sqrt{5}=5\\)。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '根式除根式：根號裡相除',
        points: [
          '\\(\\sqrt{a}\\div\\sqrt{b}=\\sqrt{a\\div b}\\)，<b>分母不可以是 0</b>。',
          '除以一個根式，就是<b>乘上它的倒數</b>。',
          '\\(\\sqrt{85}\\div\\sqrt{5}=\\sqrt{17}\\)：先把裡面除好，再看能不能開。'
        ],
        formula: { label: '除法規則<span class="pgref">課本 印 80–81 例 3</span>', tex: '\\frac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\frac{a}{b}}\\quad(a\\ge 0,\\;b\\gt 0)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 272', [
            {
              t: '先把兩個根號併成一個', d: k =>
                TX(220, 40, `${RT(85)} ÷ ${RT(5)}`, { anchor: 'middle', fs: 20, c: INK }) +
                TX(220, 82, `＝ ${RT('85 ÷ 5')}`, { anchor: 'middle', fs: 20, c: BLU, op: k })
            },
            {
              t: '把根號裡面的除法算完', d: k =>
                TX(220, 124, `＝ ${RT(17)}`, { anchor: 'middle', fs: 22, c: GRN, op: k })
            },
            {
              t: '除以一個分數，改成乘倒數', d: k =>
                TX(220, 172, `${RT(14)} ÷ ${RT('2/7')}`, { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(220, 208, `＝ ${RT('14 × 7/2')} ＝ ${RT(49)} ＝ 7`, { anchor: 'middle', fs: 18, c: GRN, op: k }) +
                BOX(60, 226, 320, 36, { r: 10, fill: '#fff7ed', stroke: '#f0dba8', op: k }) +
                TX(220, 250, '分母是 0 的時候整條規則都不成立', { anchor: 'middle', fs: 14, c: '#8a5a00', op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '寫除法公式時把 \\(b\\gt 0\\) 一起寫上去，那不是裝飾。',
        example: {
          q: '計算 \\(\\sqrt{18}\\div\\sqrt{2}\\)。',
          steps: ['併成一個根號：\\(\\sqrt{18\\div 2}\\)', '\\(\\sqrt{9}\\) 開得出來'],
          ans: '\\(3\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜根式的除法',
        points: [
          '先把兩個根號併成一個，再算裡面的除法。',
          '除以分數就乘倒數，這一步和國小一樣。',
          '算完再看一次：根號裡開得出來就開。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 81 例 3</span>', tex: '\\frac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\frac{a}{b}}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 81', BLU, '根式的除法',
              pItem('印7 ①', '\\sqrt{85}\\div\\sqrt{5}') +
              pItem('印7 ②', '\\sqrt{39}\\div\\tfrac{\\sqrt{13}}{\\sqrt{3}}') +
              pItem('印7 例3續', '\\sqrt{\\tfrac{5}{3}}\\div\\left(-\\tfrac{1}{\\sqrt{33}}\\right)')), '2-2');
        },
        caption: '第二、三題都要先改成乘倒數，再把根號併起來。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '根號裡的平方因數，要搬到外面',
        points: [
          '先把根號裡的數拆成<b>平方數 × 剩下的</b>。',
          '平方數開出來站到前面，剩下的留在根號裡。',
          '\\(\\sqrt{12}=\\sqrt{4\\times 3}=2\\sqrt{3}\\)，這樣才叫<span class="k">最簡根式</span>。'
        ],
        formula: { label: '化成最簡根式<span class="pgref">課本 印 82 例 4</span>', tex: '\\sqrt{k^2m}=k\\sqrt{m}\\quad(k\\gt 0,\\;m\\gt 0)' },
        visual: (h) => {
          const LIST = [8, 12, 18, 20, 27, 32, 45, 48, 50, 72, 75, 98, 108, 125, 128, 147, 162, 200, 300];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>根號裡的數 <span class="ival nv">12</span></label>
              <input type="range" class="ns" min="0" max="${LIST.length - 1}" step="1" value="1">
            </div></div>`;
          const draw = () => {
            const n = LIST[+h.querySelector('.ns').value];
            h.querySelector('.nv').textContent = n;

            let k = 1;
            for (let i = 2; i * i <= n; i++) if (n % (i * i) === 0) k = i;
            const m = n / (k * k);
            let s = '';
            s += TX(220, 34, `${RT(n)}`, { anchor: 'middle', fs: 26, c: INK });
            s += TX(220, 72, `＝ ${RT(`${k * k} × ${m}`)}`, { anchor: 'middle', fs: 20, c: BLU });
            s += BOX(40, 92, 170, 62, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, sw: 2 });
            s += TX(125, 116, '平方數，開得出來', { anchor: 'middle', fs: 13, c: GRN });
            s += TX(125, 143, `${RT(k * k)} ＝ ${k}`, { anchor: 'middle', fs: 18, c: GRN });
            s += BOX(230, 92, 170, 62, { r: 12, fill: 'rgba(124,58,237,.08)', stroke: VIO, sw: 2 });
            s += TX(315, 116, '剩下的，留在裡面', { anchor: 'middle', fs: 13, c: VIO });
            s += TX(315, 143, `${RT(m)}`, { anchor: 'middle', fs: 18, c: VIO });
            s += TX(220, 196, `${RT(n)} ＝ ${k === 1 ? '' : k}${RT(m)}`, { anchor: 'middle', fs: 24, c: GRN });
            s += TX(220, 228, k === 1 ? '它本來就已經是最簡根式' : '根號裡沒有平方因數了，這就是最簡根式',
              { anchor: 'middle', fs: 14, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 244', s);
            radBars(h);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '南一備課用書印 82 的眉批：先讓學生<b>判斷哪些需要化簡</b>，再動手化。',
        example: {
          q: '化成最簡根式：\\(\\sqrt{125}\\)。',
          steps: ['\\(125=25\\times 5\\)，\\(25\\) 是平方數', '\\(\\sqrt{25}=5\\) 搬到前面'],
          ans: '\\(5\\sqrt{5}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜化成最簡根式',
        points: [
          '先找<b>最大的平方因數</b>，一次搬完，不要分兩次。',
          '乘法題先把兩個根號併起來，再化簡。',
          '判斷題只要看兩件事：根號裡有沒有平方因數、分母有沒有根號。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 82 例 4</span>', tex: '\\sqrt{k^2m}=k\\sqrt{m}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 82', BLU, '化為最簡根式',
              pItem('印8 ①', '\\sqrt{8}') +
              pItem('印8 ②', '\\sqrt{300}') +
              pItem('印8 ③', '\\sqrt{27}\\times\\sqrt{6}')), '2-2');
        },
        caption: '課本印 8：先找最大的平方因數，一次搬完。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '分母有根號，就要把它換掉',
        points: [
          '分母不可以留根號——分子分母<b>同乘同一個根號</b>。',
          '\\(\\dfrac{10}{\\sqrt{5}}=\\dfrac{10\\sqrt{5}}{5}=2\\sqrt{5}\\)，分母變成整數了。',
          '<b>分子也要乘</b>，只乘分母是最常見的錯。'
        ],
        formula: { label: '有理化分母<span class="pgref">課本 印 83 例 5</span>', tex: '\\frac{a}{\\sqrt{b}}=\\frac{a\\sqrt{b}}{b}\\quad(b\\gt 0)' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 276', [
            {
              t: '分母有根號，除不下去', d: k =>
                TX(220, 42, '10', { anchor: 'middle', fs: 22, c: INK }) +
                SV.seg(186, 52, 254, 52, INK, 2.4) +
                TX(220, 78, `${RT(5)}`, { anchor: 'middle', fs: 22, c: RED }) +
                TX(220, 104, '除以一個開不完的數，很難算', { anchor: 'middle', fs: 13.5, c: GREY, op: k })
            },
            {
              t: '分子分母同乘 根號 5', d: k =>
                TX(140, 152, '10 ×', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(196, 152, `${RT(5)}`, { anchor: 'middle', fs: 18, c: GRN, op: k }) +
                SV.seg(104, 162, 252, 162, INK, 2.4) +
                TX(140, 188, '×', { anchor: 'middle', fs: 18, c: INK, op: k }) +
                TX(112, 188, `${RT(5)}`, { anchor: 'middle', fs: 18, c: RED, op: k }) +
                TX(196, 188, `${RT(5)}`, { anchor: 'middle', fs: 18, c: GRN, op: k }) +
                TX(330, 170, '上下都要乘', { anchor: 'middle', fs: 14, c: GRN, op: k })
            },
            {
              t: '分母變成整數，再約分', d: k =>
                TX(180, 234, `10${RT(5)}`, { anchor: 'middle', fs: 20, c: INK, op: k }) +
                SV.seg(146, 244, 214, 244, INK, 2.4) +
                TX(180, 268, '5', { anchor: 'middle', fs: 20, c: INK, op: k }) +
                TX(290, 252, `＝ 2${RT(5)}`, { anchor: 'middle', fs: 22, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '南一備課用書印 91 的眉批講了理由：分母變成整數才除得下去，\\(\\tfrac{1}{\\sqrt{2}}\\) 很難求值，\\(\\tfrac{\\sqrt{2}}{2}\\) 就好算了。',
        example: {
          q: '化簡 \\(\\sqrt{\\dfrac{1}{2}}\\)。',
          steps: ['先寫成 \\(\\dfrac{1}{\\sqrt{2}}\\)', '分子分母同乘 \\(\\sqrt{2}\\)'],
          ans: '\\(\\dfrac{\\sqrt{2}}{2}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜有理化分母',
        points: [
          '分母有根號就同乘那個根號，<b>分子也要乘</b>。',
          '根號裡是分數時，先寫成分數再有理化。',
          '驗收兩句話：分母沒有根號、分子是最簡根式。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 83 例 5</span>', tex: '\\frac{a}{\\sqrt{b}}=\\frac{a\\sqrt{b}}{b}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 83', BLU, '計算並化簡',
              pItem('印9 ①', '\\tfrac{10}{\\sqrt{5}}') +
              pItem('印9 ②', '\\sqrt{\\tfrac{1}{2}}')), '2-2');
        },
        caption: '課本印 9：分母有根號，分子分母同乘那個根號。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '先化最簡，近似值才準',
        points: [
          '\\(\\sqrt{250}\\) 查不到，但 \\(\\sqrt{250}=5\\sqrt{10}\\) 就查得到。',
          '化成最簡之後，只要拿<b>已知的那一個近似值</b>去乘。',
          '這就是要化簡的理由：先化簡再取近似值，<b>誤差比較小</b>。'
        ],
        formula: { label: '化簡再取近似值<span class="pgref">課本 印 85 例 6</span>', tex: '\\sqrt{700}=10\\sqrt{7}\\doteq 10\\times 2.646=26.46' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '已知', tex: '\\sqrt{7}\\doteq 2.646', color: VIO, fill: '#f3eeff', border: VIO, size: 22 },
            { label: '步驟一　先化成最簡', tex: '\\sqrt{700}=\\sqrt{100\\times 7}=10\\sqrt{7}', color: BLU, border: '#d6e0f2', size: 19 },
            { label: '步驟二　把已知的值代進去', tex: '10\\times 2.646=26.46', color: GRN, border: '#cfe8dd', size: 19, note: '整個過程沒有再按一次計算機' },
            { label: '另一題', tex: '\\sqrt{28}=2\\sqrt{7}\\doteq 5.292', color: AMB, border: '#f0dba8', size: 18 }
          ]);
          MJ(h);
        },
        caption: '南一備課用書印 84 的眉批：比較計算機的近似值，就知道<b>化到最簡再取近似值誤差比較小</b>。',
        example: {
          q: '已知 \\(\\sqrt{10}\\doteq 3.162\\)，求 \\(\\sqrt{250}\\)。',
          steps: ['\\(250=25\\times 10\\)', '\\(\\sqrt{250}=5\\sqrt{10}\\doteq 5\\times 3.162\\)'],
          ans: '\\(15.81\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜由已知的近似值求值',
        points: [
          '第一步永遠是<b>化成最簡</b>，不要先按計算機。',
          '化簡後前面那個整數，就是要乘上去的倍數。',
          '最後照題目要求四捨五入，不要多寫位數。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 85 例 6</span>', tex: '\\sqrt{k^2m}=k\\sqrt{m}\\doteq k\\times(\\text{已知值})' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 85', BLU, '已知 \\(\\sqrt{7}\\doteq 2.646\\)',
              pItem('印11 ①', '\\sqrt{700}') +
              pItem('印11 ②', '\\sqrt{28}')), '2-2');
        },
        caption: '課本印 11：先化成最簡，再代近似值。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '化到最簡之後根號裡一樣，才是同類方根',
        points: [
          '\\(\\sqrt{8}\\) 和 \\(\\sqrt{2}\\) 看起來不一樣，化簡後都是 \\(\\sqrt{2}\\) 家族。',
          '判斷同類方根：<b>先各自化最簡</b>，再比根號裡的數。',
          '同類方根才能合併，合併時<b>只加減係數</b>，根號不動。'
        ],
        formula: { label: '同類方根<span class="pgref">課本 印 86 例 7</span>', tex: 'm\\sqrt{a}\\pm n\\sqrt{a}=(m\\pm n)\\sqrt{a}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '四個根式，先不要急著分類', d: k => {
                const xs = [70, 180, 290, 396];
                const lb = [8, 18, 27, 50];
                let s = TX(220, 26, '哪些是同類方根？', { anchor: 'middle', fs: 15, c: GREY });
                lb.forEach((v, i) => {
                  s += BOX(xs[i] - 44, 40, 88, 44, { r: 10, fill: '#f6f9ff', stroke: '#d6e0f2', op: k });
                  s += TX(xs[i], 70, `${RT(v)}`, { anchor: 'middle', fs: 19, c: INK, op: k });
                });
                return s;
              }
            },
            {
              t: '各自化成最簡根式', d: k => {
                const xs = [70, 180, 290, 396];
                const out = [['2', 2], ['3', 2], ['3', 3], ['5', 2]];
                let s = '';
                out.forEach((v, i) => {
                  s += TX(xs[i], 116, `${v[0]}${RT(v[1])}`, { anchor: 'middle', fs: 19, c: v[1] === 2 ? GRN : AMB, op: k });
                });
                return s;
              }
            },
            {
              t: '根號裡一樣的排成一列', d: k =>
                BOX(20, 140, 400, 52, { r: 12, fill: 'rgba(5,150,105,.07)', stroke: GRN, op: k }) +
                TX(220, 172, `2${RT(2)}　3${RT(2)}　5${RT(2)}　都是 ${RT(2)} 家族`, { anchor: 'middle', fs: 17, c: GRN, op: k }) +
                BOX(20, 200, 400, 46, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, op: k }) +
                TX(220, 230, `3${RT(3)} 自己一個，不能跟它們合併`, { anchor: 'middle', fs: 16, c: AMB, op: k })
            },
            {
              t: '合併時只加減前面的數', d: k =>
                TX(220, 270, `2${RT(2)} ＋ 3${RT(2)} ＝ 5${RT(2)}`, { anchor: 'middle', fs: 19, c: INK, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '南一備課用書印 86 的眉批：多舉幾個例子讓學生分辨<b>什麼是、什麼不是</b>同類方根。',
        example: {
          q: '\\(6\\sqrt{11}-3\\sqrt{11}\\) 等於多少？',
          steps: ['根號裡都是 \\(11\\)，是同類方根', '只算 \\(6-3\\)'],
          ans: '\\(3\\sqrt{11}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜判斷同類方根',
        points: [
          '看外表不算數，<b>一律先化成最簡</b>再比。',
          '\\(\\sqrt{0.2}\\) 也要化：\\(\\sqrt{0.2}=\\dfrac{\\sqrt{5}}{5}\\)，它是 \\(\\sqrt{5}\\) 家族。',
          '加減題只有同類方根才能合併，別的原封不動。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 86</span>', tex: '\\sqrt{8}=2\\sqrt{2},\\;\\sqrt{18}=3\\sqrt{2},\\;\\sqrt{50}=5\\sqrt{2}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 86', BLU, '判斷同類方根',
              pText('印12 ①', '\\(\\sqrt{8}\\)、\\(\\sqrt{18}\\)、\\(\\sqrt{27}\\)、\\(\\sqrt{50}\\) 中哪些是同類方根？', '\\(\\sqrt{8},\\sqrt{18},\\sqrt{50}\\)')), '2-2');
        },
        caption: '課本印 12：一律先化成最簡再比。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '先化簡，才知道能不能合併',
        points: [
          '固定三步：<b>化最簡 → 看根號裡是否相同 → 合併係數</b>。',
          '一行只做一件事，三步擠在同一行就會漏步。',
          '不同類的留著不動，答案可以有兩項。'
        ],
        formula: { label: '先化簡再合併<span class="pgref">課本 印 87 例 8</span>', tex: '\\sqrt{27}+5\\sqrt{12}=3\\sqrt{3}+10\\sqrt{3}=13\\sqrt{3}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 272', [
            {
              t: '原式：看起來根號裡不一樣', d: k =>
                TX(220, 40, `${RT(27)} ＋ 5${RT(12)}`, { anchor: 'middle', fs: 22, c: INK })
            },
            {
              t: '第一步：各自化成最簡根式', d: k =>
                TX(220, 92, `${RT(27)} ＝ 3${RT(3)}`, { anchor: 'middle', fs: 18, c: BLU, op: k }) +
                TX(220, 124, `5${RT(12)} ＝ 5 × 2${RT(3)} ＝ 10${RT(3)}`, { anchor: 'middle', fs: 18, c: BLU, op: k })
            },
            {
              t: '第二步：根號裡都是 3，可以合併', d: k =>
                BOX(96, 146, 248, 40, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, op: k }) +
                TX(220, 172, `3${RT(3)} ＋ 10${RT(3)}`, { anchor: 'middle', fs: 19, c: GRN, op: k })
            },
            {
              t: '第三步：只把係數加起來', d: k =>
                TX(220, 224, '3 ＋ 10 ＝ 13', { anchor: 'middle', fs: 17, c: GREY, op: k }) +
                TX(220, 258, `＝ 13${RT(3)}`, { anchor: 'middle', fs: 24, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '南一備課用書印 87 的眉批說得直接：例 8 乍看沒有同類方根，化簡之後就有了。',
        example: {
          q: '計算 \\(\\sqrt{8}+\\sqrt{18}\\)。',
          steps: ['\\(\\sqrt{8}=2\\sqrt{2}\\)、\\(\\sqrt{18}=3\\sqrt{2}\\)', '係數相加 \\(2+3\\)'],
          ans: '\\(5\\sqrt{2}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜同類方根的加減',
        points: [
          '同類方根合併，<b>只加減係數</b>，根號裡的數不動。',
          '不同類的分開整理，答案有兩項是正常的。',
          '看到 \\(\\sqrt{75}\\)、\\(\\sqrt{72}\\) 先化簡，別急著判斷。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 86、87</span>', tex: 'm\\sqrt{a}\\pm n\\sqrt{a}=(m\\pm n)\\sqrt{a}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 86、87', BLU, '計算並化最簡根式',
              pItem('印12 ②', '5\\sqrt{13}-2\\sqrt{13}', '\\(3\\sqrt{13}\\)') +
              pItem('印13 ①', '3\\sqrt{2}-2\\sqrt{75}+\\sqrt{72}-5\\sqrt{3}') +
              pItem('印13 ②', '\\sqrt{\\tfrac{4}{7}}-\\sqrt{28}')), '2-2');
        },
        caption: '第二題有兩個家族：\\(\\sqrt{2}\\) 一邊、\\(\\sqrt{3}\\) 一邊，各自合併。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '有括號就先分配，一項一項乘進去',
        points: [
          '\\(2\\sqrt{7}(3\\sqrt{7}-\\sqrt{14})\\)：括號外的要乘進去<b>每一項</b>。',
          '乘完再各自化最簡，最後才合併同類方根。',
          '除法先改成分數，再一項一項除。'
        ],
        formula: { label: '四則混合<span class="pgref">課本 印 88–89 例 9、例 10</span>', tex: '2\\sqrt{7}\\,(3\\sqrt{7}-\\sqrt{14})=42-14\\sqrt{2}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 272', [
            {
              t: '先畫兩支箭頭，確認要乘幾次', d: k =>
                TX(220, 40, `2${RT(7)} ( 3${RT(7)} − ${RT(14)} )`, { anchor: 'middle', fs: 20, c: INK }) +
                `<path d="M160,52 Q210,86 258,58" fill="none" stroke="${BLU}" stroke-width="2" opacity="${k}"/>` +
                `<path d="M160,52 Q250,104 336,58" fill="none" stroke="${AMB}" stroke-width="2" opacity="${k}"/>`
            },
            {
              t: '第一項：係數乘係數、根號乘根號', d: k =>
                TX(220, 128, `2${RT(7)} × 3${RT(7)} ＝ 6 × 7 ＝ 42`, { anchor: 'middle', fs: 17, c: BLU, op: k })
            },
            {
              t: '第二項：乘完先化最簡', d: k =>
                TX(220, 166, `2${RT(7)} × ${RT(14)} ＝ 2${RT(98)} ＝ 2 × 7${RT(2)}`, { anchor: 'middle', fs: 17, c: AMB, op: k })
            },
            {
              t: '合起來寫出答案', d: k =>
                BOX(96, 196, 248, 44, { r: 12, fill: 'rgba(5,150,105,.08)', stroke: GRN, op: k }) +
                TX(220, 226, `＝ 42 − 14${RT(2)}`, { anchor: 'middle', fs: 22, c: GRN, op: k }) +
                TX(220, 262, '42 和 14 根 2 不同類，不能再合併', { anchor: 'middle', fs: 14, c: GREY, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '整數項和根式項不是同類，留成兩項就是最後答案。',
        example: {
          q: '計算 \\((2\\sqrt{6}-3)\\div\\sqrt{3}\\)。',
          steps: ['寫成兩個分數：\\(\\dfrac{2\\sqrt{6}}{\\sqrt{3}}-\\dfrac{3}{\\sqrt{3}}\\)', '各自算完並有理化'],
          ans: '\\(2\\sqrt{2}-\\sqrt{3}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜四則混合',
        points: [
          '先圈出運算順序：括號、乘除、加減。',
          '乘完的每一項都要化到最簡，才看得出誰跟誰同類。',
          '連乘連除可以全部併進同一個根號再算。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 88、89</span>', tex: '(\\sqrt{3}-\\sqrt{5})(1+\\sqrt{15})=2\\sqrt{5}-4\\sqrt{3}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 88、89', BLU, '計算並化最簡根式',
              pItem('印14 ①', '2\\sqrt{7}\\,(3\\sqrt{7}-\\sqrt{14})') +
              pItem('印14 ②', '(\\sqrt{3}-\\sqrt{5})(1+\\sqrt{15})') +
              pItem('印15 ①', '\\sqrt{\\tfrac{3}{5}}\\div\\sqrt{1\\tfrac{1}{4}}\\times\\sqrt{\\tfrac{1}{6}}') +
              pItem('印15 ②', '(2\\sqrt{6}-3)\\div\\sqrt{3}')), '2-2');
        },
        caption: '印 15 ① 全部是乘除，可以一口氣併進同一個根號。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '課本最後兩頁：公式和兩項的分母',
        points: [
          '\\((\\sqrt{5}+\\sqrt{3})^2\\) 用和的平方，\\((2\\sqrt{3}+\\sqrt{7})(2\\sqrt{3}-\\sqrt{7})\\) 用平方差。',
          '分母是兩項時，同乘<b>只改中間符號</b>的那一式，分母就變整數。',
          '⚠ 這兩頁是<b>課本的延伸，不是這一節的過關條件</b>；習作要寫完，老師會帶。'
        ],
        formula: { label: '課本延伸<span class="pgref">課本 印 90–91 例 11、例 12</span>', tex: '(\\sqrt{a}+\\sqrt{b})(\\sqrt{a}-\\sqrt{b})=a-b' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '平方差：中間那兩項剛好抵消', tex: '(2\\sqrt{3}+\\sqrt{7})(2\\sqrt{3}-\\sqrt{7})=12-7=5', color: BLU, fill: '#f6f9ff', border: BLU, size: 18 },
            { label: '和的平方：中間多一項 2ab', tex: '(\\sqrt{5}+\\sqrt{3})^2=5+2\\sqrt{15}+3=8+2\\sqrt{15}', color: VIO, border: '#d8ccf5', size: 18 },
            { label: '分母兩項：同乘只改中間符號的那一式', tex: '\\frac{3}{\\sqrt{7}-1}=\\frac{3(\\sqrt{7}+1)}{7-1}=\\frac{\\sqrt{7}+1}{2}', color: GRN, border: '#cfe8dd', size: 17, note: '分母變成 7 − 1 = 6，根號消失了' }
          ], { gap: 10 });
          MJ(h);
        },
        caption: '這一頁是為了跟上同一本課本與習作；過關只看前面那四件事。',
        example: {
          q: '\\(\\dfrac{\\sqrt{2}}{2\\sqrt{3}+2}\\) 要同乘什麼？',
          steps: ['分母是兩項，同乘 \\(2\\sqrt{3}-2\\)', '分母變成 \\(12-4=8\\)'],
          ans: '\\(\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜乘法公式與兩項分母（老師帶做）',
        points: [
          '平方差：\\((\\,)^2-(\\,)^2\\)，中間兩項抵消。',
          '和的平方：別漏掉中間的 \\(2ab\\)。',
          '分母兩項時同乘<b>只改中間符號</b>的那一式。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 90、91</span>', tex: '\\frac{1}{\\sqrt{a}-\\sqrt{b}}=\\frac{\\sqrt{a}+\\sqrt{b}}{a-b}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 90、91', BLU, '課本延伸，不列過關條件',
              pItem('印16 ①', '(2\\sqrt{3}+\\sqrt{7})(2\\sqrt{3}-\\sqrt{7})') +
              pItem('印16 ②', '(\\sqrt{5}+\\sqrt{3})^2') +
              pItem('印17 ①', '\\tfrac{3}{\\sqrt{7}-1}') +
              pItem('印17 ②', '\\tfrac{\\sqrt{2}}{2\\sqrt{3}+2}')), '2-2');
        },
        caption: '四題都由老師帶做；做不完不影響這一節的過關。'
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>把根號拆到加法上、沒化簡就判斷、有理化只乘分母</b>。',
          '第一個最常見，算一次小數就露餡。',
          '第二個最可惜：規則其實會，只是沒先化簡。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 92 重點整理</span>', tex: '\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '把根號拆到加法上', bad: '\\(\\sqrt{2}+\\sqrt{3}=\\sqrt{5}\\)', good: '\\(\\sqrt{2}+\\sqrt{3}\\doteq 3.146\\)，<br>\\(\\sqrt{5}\\doteq 2.236\\)，<b>不相等</b>' },
            { tag: '沒化簡就說不能合併', bad: '\\(\\sqrt{18}+\\sqrt{2}\\) 不同類，<br>不能合併', good: '\\(\\sqrt{18}=3\\sqrt{2}\\)，<br>\\(3\\sqrt{2}+\\sqrt{2}=4\\sqrt{2}\\)' },
            { tag: '有理化只乘分母', bad: '\\(\\dfrac{\\sqrt{5}}{\\sqrt{3}}=\\dfrac{\\sqrt{5}}{3}\\)', good: '分子也要乘：<br>\\(\\dfrac{\\sqrt{5}\\times\\sqrt{3}}{3}=\\dfrac{\\sqrt{15}}{3}\\)' }
          ]);
          MJ(h);
        },
        caption: '第二個特別要防：學生會說「它們不同類」，其實只是還沒化簡——先化簡再判斷。',
        example: {
          q: '下課前一分鐘：\\(3\\sqrt{7}+2\\sqrt{7}\\) 等於多少？',
          steps: ['根號裡都是 \\(7\\)，是同類方根', '只把 \\(3+2\\) 加起來'],
          ans: '\\(5\\sqrt{7}\\)'
        }
      },

      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜習作（基礎 1、2）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '乘法題先把兩個根號併起來，再化簡。',
          '判斷題只要看兩件事：根號裡有沒有平方因數、分母有沒有根號。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 82 例 4</span>', tex: '\\sqrt{k^2m}=k\\sqrt{m}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 23', AMB, '判斷哪一個是最簡根式',
              pText('基礎1', '四個選項：\\(\\tfrac{1}{\\sqrt{6}}\\)、\\(\\sqrt{6}\\)、\\(\\sqrt{12}\\)、\\(\\sqrt{0.5}\\)。', '\\(\\sqrt{6}\\)')) +
            pCard('習作・基礎練習', '印 23', AMB, '化為最簡根式',
              pItem('基礎2 ①', '3\\sqrt{5}\\times 4\\sqrt{2}') +
              pItem('基礎2 ②', '10\\sqrt{30}\\div 2\\sqrt{5}') +
              pItem('基礎2 ③', '\\sqrt{32}')), '2-2');
        },
        caption: '基礎 1 把兩個判準都考了：分母有根號、根號裡有平方因數。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜習作（基礎 2）',
        points: [
          '乘法：前面的數相乘、根號裡的數相乘。',
          '除法：把兩個根號併成一個，再算裡面。',
          '算出整數就不用再寫根號了：\\(\\sqrt{1600}=40\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 79–82</span>', tex: 'a\\sqrt{b}\\times c\\sqrt{d}=(ac)\\sqrt{bd}\\qquad \\frac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\frac{a}{b}}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 23、24', AMB, '化為最簡根式',
              pItem('基礎2 ④', '\\sqrt{120}') +
              pItem('基礎2 ⑤', '\\sqrt{200}\\times\\sqrt{8}') +
              pItem('基礎2 ⑥', '\\sqrt{69}\\div\\sqrt{3}')) +
            pCard('習作・基礎練習', '印 24', AMB, '化為最簡根式',
              pItem('基礎2 ⑦', '\\sqrt{27}\\times 5\\sqrt{6}') +
              pItem('基礎2 ⑧', '\\sqrt{72}\\div\\sqrt{20}')), '2-2');
        },
        caption: '基礎 2 ⑧ 算到 \\(\\sqrt{\\tfrac{18}{5}}\\) 還沒完——分母有根號，要再有理化一次。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜習作（基礎 3～5）',
        points: [
          '第一步永遠是<b>化成最簡</b>，不要先按計算機。',
          '化簡後前面那個整數，就是要乘上去的倍數。',
          '最後照題目要求四捨五入，不要多寫位數。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 85 例 6</span>', tex: '\\sqrt{k^2m}=k\\sqrt{m}\\doteq k\\times(\\text{已知值})' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 24', AMB, '已知 \\(\\sqrt{10}\\doteq 3.162\\)，四捨五入到小數第二位',
              pItem('基礎3 ①', '\\sqrt{250}') +
              pItem('基礎3 ②', '\\sqrt{0.009}')) +
            pCard('習作・基礎練習', '印 24、25', AMB, '判斷敘述與同類方根',
              pText('基礎4', '四個加減式中哪一個正確？（點開看選項）', '\\(\\sqrt{18}+\\sqrt{2}=4\\sqrt{2}\\)') +
              pText('基礎5', '哪一組是同類方根？（點開看四組）', '\\(\\sqrt{20}\\)、\\(\\sqrt{0.2}\\)')), '2-2');
        },
        caption: '基礎 3 ② 要先把 \\(0.009\\) 寫成 \\(\\tfrac{9}{1000}\\)，化簡後才看得到 \\(\\sqrt{10}\\)。 基礎 5 的第三組要化兩次才看得出來，正是「先化簡再分類」的代表題。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜習作（基礎 6）',
        points: [
          '先化最簡，再看根號裡是不是同一個數。',
          '三項以上就分家族整理，一家一行。',
          '根號裡是分數的，先有理化再通分。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 87 例 8</span>', tex: '\\sqrt{50}+\\sqrt{98}-\\sqrt{162}=5\\sqrt{2}+7\\sqrt{2}-9\\sqrt{2}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 25', AMB, '計算並化簡',
              pItem('基礎6 ①', '7\\sqrt{3}-5\\sqrt{3}') +
              pItem('基礎6 ②', '\\sqrt{52}+5\\sqrt{13}') +
              pItem('基礎6 ③', '\\sqrt{50}+\\sqrt{98}-\\sqrt{162}') +
              pItem('基礎6 續一', '\\sqrt{\\tfrac{2}{5}}-\\sqrt{\\tfrac{5}{2}}', '', '基礎6 ④')), '2-2');
        },
        caption: '習作印 25：<b>自己寫完</b>再對答案。'
      },
      {
        sec: '2-2', secName: '根式的運算',
        title: '練習｜習作（基礎 7 與精熟）',
        points: [
          '連乘連除先併進同一個根號，再算裡面。',
          '分母兩項的題目，兩項要<b>各自</b>有理化。',
          '最後一題先有理化再夾在兩個整數之間，行有餘力再做。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 88–91</span>', tex: '\\frac{1}{2-\\sqrt{3}}=2+\\sqrt{3}' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 26', AMB, '計算並化簡',
              pItem('基礎7 ①', '\\sqrt{\\tfrac{9}{7}}\\times\\sqrt{\\tfrac{1}{2}}\\div\\sqrt{\\tfrac{3}{14}}+\\sqrt{3}') +
              pItem('基礎7 ②', '\\tfrac{1}{\\sqrt{5}+2}+\\tfrac{1}{\\sqrt{5}-2}') +
              pItem('基礎7 ③', '(\\sqrt{3}+\\sqrt{5})^2(\\sqrt{3}-\\sqrt{5})^2') +
              pItem('基礎7 ④', '\\sqrt{5}\\times\\sqrt{3}-\\sqrt{3}\\div(\\sqrt{5}+2)')) +
            pCard('習作・行有餘力', '印 26', GRN, '',
              pText('精熟1', '\\(m\\) 為正整數，\\(m\\lt\\dfrac{1}{2-\\sqrt{3}}\\lt m+1\\)，求 \\(m\\)。')), '2-2');
        },
        caption: '習作印 26：<b>自己寫完</b>再對答案。'
      },
      {

        sec: '2-2', secName: '根式的運算',
        title: '對答案｜習作 ①（基礎 1～5）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '2-2', [
            { label: '基礎 1、2（印 23）', cols: 3, items: [['1', '基礎1'], ['2 ①②', '基礎2 ①'], ['2 ③④', '基礎2 ③']] },
            { label: '基礎 2（印 24）', cols: 3, items: [['2 ⑤⑥', '基礎2 ⑤'], ['2 ⑦⑧', '基礎2 ⑦']] },
            { label: '基礎 3～5（印 24–25）', cols: 3, items: [['3 ①', '基礎3 ①'], ['3 ②', '基礎3 ②'], ['4', '基礎4'], ['5', '基礎5']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {

        sec: '2-2', secName: '根式的運算',
        title: '對答案｜習作 ②（基礎 6～7、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '2-2', [
            { label: '基礎 6（印 25）', cols: 3, items: [['6 ①②', '基礎6 ①'], ['6 ③', '基礎6 ③'], ['6 ④', '基礎6 續一']] },
            { label: '基礎 7 與精熟（印 26）', cols: 3, items: [['7 ①', '基礎7 ①'], ['7 ②', '基礎7 ②'], ['7 ③', '基礎7 ③'], ['7 ④', '基礎7 ④'], ['精 1', '精熟1']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '這一節在做三件事',
        points: [
          '<b>是什麼</b>：只有<b>直角</b>三角形，三邊長才有這個關係。',
          '<b>長什麼樣</b>：直角旁邊兩條叫<span class="k">股</span>，對面那條叫<span class="k">斜邊</span>。',
          '<b>做什麼</b>：求第三邊、判斷是不是直角、算兩點距離。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 95–108</span>', tex: 'a^2+b^2=c^2\\quad(c\\text{ 是斜邊})' },
        visual: (h) => {
          const card = (y, n, q, a, col) =>
            BOX(20, y, 400, 68, { r: 14, fill: '#fff', stroke: col, sw: 2 }) +
            `<circle cx="52" cy="${y + 34}" r="16" fill="${col}" opacity=".14"/>` +
            TX(52, y + 40, n, { anchor: 'middle', fs: 18, c: col }) +
            TX(80, y + 28, q, { fs: 15.5, c: INK }) +
            TX(80, y + 52, a, { fs: 14, c: GREY });
          h.innerHTML = svg('0 0 440 250',
            card(6, '1', '什麼時候可以用？', '三角形裡有直角，才可以用', VIO) +
            card(88, '2', '哪一條是斜邊？', '不碰到直角的那一條，也是最長的', BLU) +
            card(170, '3', '學會之後能做什麼？', '求缺邊、判斷直角、量坐標上的距離', GRN));
        },
        caption: '每一題都先做同樣三件事：圈直角、標斜邊、寫完整的平方關係。',
        example: {
          q: '一個直角三角形，直角在 \\(B\\)。哪一條是斜邊？',
          steps: ['斜邊是直角的<b>對邊</b>', '\\(B\\) 的對邊是 \\(\\overline{AC}\\)'],
          ans: '\\(\\overline{AC}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '兩個小正方形，剛好拼成大正方形',
        points: [
          '在直角三角形的三邊各畫一個正方形。',
          '兩個<b>小</b>正方形的面積加起來，等於<b>大</b>正方形的面積。',
          '面積就是邊長的平方，所以 \\(a^2+b^2=c^2\\)。'
        ],
        formula: { label: '溫故啟思<span class="pgref">課本 印 95、96</span>', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          const PAIR = [[3, 4], [6, 8], [5, 12], [9, 12], [8, 15], [20, 21]];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>兩股 <span class="ival pv">3、4</span></label>
              <input type="range" class="ps" min="0" max="${PAIR.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const [a, b] = PAIR[+h.querySelector('.ps').value];
            const c = Math.sqrt(a * a + b * b);
            h.querySelector('.pv').textContent = `${a}、${b}`;
            const u = 92 / Math.max(a, b, c);
            const A = u * a, B = u * b;

            const px = 150, py = 148;
            const q = [px + B, py], r = [px, py - A];
            let s = '';
            s += SV.poly([[px, py], q, r], 'rgba(124,58,237,.10)', VIO, 2.4);
            s += SV.rightAngle(px, py, 0, 90, 13, GREY);

            s += `<rect x="${px}" y="${py}" width="${B}" height="${B}" fill="${BLU}" opacity=".16" stroke="${BLU}" stroke-width="1.8"/>`;
            s += TX(px + B / 2, py + B / 2 + 5, `${b * b}`, { anchor: 'middle', fs: 14, c: BLU });
            s += `<rect x="${px - A}" y="${py - A}" width="${A}" height="${A}" fill="${AMB}" opacity=".18" stroke="${AMB}" stroke-width="1.8"/>`;
            s += TX(px - A / 2, py - A / 2 + 5, `${a * a}`, { anchor: 'middle', fs: 14, c: AMB });

            const dx = q[0] - r[0], dy = q[1] - r[1], L = Math.sqrt(dx * dx + dy * dy);

            const nx = dy / L, ny = -dx / L;
            const p3 = [q[0] + nx * L, q[1] + ny * L], p4 = [r[0] + nx * L, r[1] + ny * L];
            s += SV.poly([r, q, p3, p4], 'rgba(5,150,105,.14)', GRN, 1.8);
            s += TX((r[0] + p3[0]) / 2, (r[1] + p3[1]) / 2 + 5, `${a * a + b * b}`, { anchor: 'middle', fs: 14, c: GRN });

            s += TX(px + B / 2, py - 8, `${b}`, { anchor: 'middle', fs: 13, c: BLU });
            s += TX(px + 8, py - A / 2, `${a}`, { fs: 13, c: AMB });
            s += TX(220, 252, `${a * a} ＋ ${b * b} ＝ ${a * a + b * b}`, { anchor: 'middle', fs: 20, c: INK });
            s += TX(220, 278, Number.isInteger(c) ? `斜邊長 ${c}` : `斜邊長是 ${RT(a * a + b * b)}`,
              { anchor: 'middle', fs: 15, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 288', s);
            radBars(h);
          };
          h.querySelector('.ps').oninput = draw;
          draw();
        },
        caption: '拖滑桿換一組股長，藍色加琥珀色永遠等於綠色。',
        example: {
          q: '兩股 \\(3\\)、\\(4\\)，三個正方形的面積各是多少？',
          steps: ['兩個小的是 \\(9\\) 和 \\(16\\)', '\\(9+16=25\\)'],
          ans: '\\(9\\)、\\(16\\)、\\(25\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '斜邊是直角的對邊，圖轉了也一樣',
        points: [
          '先<b>圈直角</b>，斜邊就是它<b>對面</b>那一條。',
          '斜邊一定是<b>最長</b>的邊，但不是「看起來最斜」的那一條。',
          '圖一旋轉就指錯，是這一節最常見的錯。'
        ],
        formula: { label: '先認邊，再算<span class="pgref">課本 印 96</span>', tex: '\\text{斜邊}=\\text{直角的對邊}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>把圖轉一轉 <span class="ival dv">0</span>°</label>
              <input type="range" class="ds" min="0" max="330" step="30" value="0">
            </div></div>`;
          const draw = () => {
            const deg = +h.querySelector('.ds').value;
            h.querySelector('.dv').textContent = deg;
            const rad = deg * Math.PI / 180;
            const cx = 220, cy = 140;

            const base = [[-56, 48], [64, 48], [-56, -42]];
            const rot = (p) => [cx + p[0] * Math.cos(rad) - p[1] * Math.sin(rad),
                                cy + p[0] * Math.sin(rad) + p[1] * Math.cos(rad)];
            const B = rot(base[0]), Cp = rot(base[1]), A = rot(base[2]);
            let s = SV.poly([B, Cp, A], 'rgba(124,58,237,.08)', VIO, 2.6);

            const d1 = SV.angleOf(B[0], B[1], Cp[0], Cp[1]);
            const d2 = SV.angleOf(B[0], B[1], A[0], A[1]);
            s += SV.rightAngle(B[0], B[1], d1, d2, 15, RED);
            s += `<circle cx="${B[0].toFixed(1)}" cy="${B[1].toFixed(1)}" r="24" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="4 4"/>`;
            s += SV.seg(A[0], A[1], Cp[0], Cp[1], GRN, 5);
            s += SV.vlabel(B[0] - 20, B[1] + 22, 'B', RED);
            s += SV.vlabel(Cp[0] + 8, Cp[1] + 16, 'C', INK);
            s += SV.vlabel(A[0] - 20, A[1] - 6, 'A', INK);
            s += TX(220, 250, '紅圈是直角，綠色那一條就是斜邊', { anchor: 'middle', fs: 15, c: GRN });
            s += TX(220, 276, '兩股 6、8，斜邊 10——不管圖怎麼轉都一樣', { anchor: 'middle', fs: 13.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 288', s);
          };
          h.querySelector('.ds').oninput = draw;
          draw();
        },
        caption: '每一題都先做這一步：圈直角、把斜邊描粗，再開始算。',
        example: {
          q: '三邊 \\(5\\)、\\(12\\)、\\(13\\) 的直角三角形，斜邊是哪一條？',
          steps: ['斜邊一定是最長的', '\\(13\\) 最長'],
          ans: '長 \\(13\\) 的那一條'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '斜邊未知就用加的',
        points: [
          '先寫完整的 \\(a^2+b^2=c^2\\)，再把數字代進去。',
          '兩股都知道 → 平方相加，再開根號。',
          '最後一行一定是<b>長度</b>：負的不合，根號要化到最簡。'
        ],
        formula: { label: '畢氏定理<span class="pgref">課本 印 99 例 1</span>', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '先畫圖、圈直角、標出已知', d: k => {
                let s = SV.poly([[120, 178], [300, 178], [120, 78]], 'rgba(124,58,237,.08)', VIO, 2.6);
                s += SV.rightAngle(120, 178, 0, 90, 14, RED);
                s += TX(210, 198, '8', { anchor: 'middle', fs: 16, c: BLU });
                s += TX(106, 132, '6', { anchor: 'end', fs: 16, c: AMB });
                s += TX(228, 118, 'c ＝ ?', { anchor: 'middle', fs: 16, c: GRN, op: k });
                return s;
              }
            },
            {
              t: '寫下完整的式子，再代數字', d: k =>
                TX(220, 222, '6² ＋ 8² ＝ c²', { anchor: 'middle', fs: 20, c: INK, op: k })
            },
            {
              t: '算出 c²，再開根號', d: k =>
                TX(220, 250, '36 ＋ 64 ＝ 100', { anchor: 'middle', fs: 18, c: BLU, op: k }) +
                TX(220, 276, `c ＝ ${RT(100)} ＝ 10（長度取正）`, { anchor: 'middle', fs: 18, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '不要背「斜邊加、股就減」。每次都寫完整的式子，才不會代錯位置。',
        example: {
          q: '兩股 \\(9\\)、\\(12\\)，求斜邊。',
          steps: ['\\(9^2+12^2=81+144=225\\)', '\\(\\sqrt{225}=15\\)'],
          ans: '\\(15\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '股未知，就從斜邊的平方減回去',
        points: [
          '一樣先寫 \\(a^2+b^2=c^2\\)，只是這次未知數在<b>左邊</b>。',
          '移項得到 \\(b^2=c^2-a^2\\)，再開根號。',
          '算出來開不出整數就<b>留著根號</b>，並化到最簡。'
        ],
        formula: { label: '求另一股<span class="pgref">課本 印 99 例 1</span>', tex: 'b^2=c^2-a^2' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '已知一股 5、斜邊 13', tex: '5^2+b^2=13^2', color: VIO, fill: '#f3eeff', border: VIO, size: 20 },
            { label: '移項：未知的留左邊', tex: 'b^2=169-25=144', color: BLU, border: '#d6e0f2', size: 19 },
            { label: '開根號，負的不合', tex: 'b=\\sqrt{144}=12', color: GRN, border: '#cfe8dd', size: 19 },
            { label: '開不出整數就留根號', tex: '6^2+b^2=7^2\\Rightarrow b=\\sqrt{13}', color: AMB, border: '#f0dba8', size: 18, note: '習作基礎 1 ② 就是這一型' }
          ]);
          MJ(h);
        },
        caption: '常見的錯是看到斜邊還是用加的，算出來越加越大——先寫完整式子就不會。',
        example: {
          q: '一股 \\(6\\)、斜邊 \\(7\\)，求另一股。',
          steps: ['\\(6^2+b^2=7^2\\)', '\\(b^2=49-36=13\\)'],
          ans: '\\(\\sqrt{13}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜求第三邊',
        points: [
          '每一題先圈直角、標出斜邊，再列式。',
          '斜邊未知用加、股未知用減，但式子都寫成 \\(a^2+b^2=c^2\\)。',
          '正方形的對角線會把它切成兩個直角三角形。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 99 例 1</span>', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 99', BLU, '直角三角形與正方形',
              pText('印5 ①', '直角三角形 \\(DEF\\) 中 \\(\\overline{DE}=5\\)、\\(\\overline{EF}=13\\)，求另一股 \\(\\overline{DF}\\)。', '\\(12\\)') +
              pText('印5 ②', '正方形 \\(ABCD\\) 邊長 \\(1\\)，求對角線 \\(\\overline{BD}\\)。', '\\(\\sqrt{2}\\)')), '2-3');
        },
        caption: '點開任何一題都看得到圖：先看圖上的直角在哪裡。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '反過來用：三邊平方對得上，就是直角三角形',
        points: [
          '先找出<b>最大邊</b>，它才有資格當斜邊。',
          '算「另外兩邊平方和」和「最大邊平方」，相等就是直角三角形。',
          '不要背 \\(3,4,5\\) 就套：要寫出 \\(3^2+4^2=5^2\\) 才算通過。'
        ],
        formula: { label: '畢氏定理的逆敘述<span class="pgref">課本 印 98</span>', tex: 'a^2+b^2=c^2\\;\\Rightarrow\\;\\text{是直角三角形}' },
        visual: (h) => {
          const TRI = [[6, 8, 10], [6, 8, 11], [5, 12, 13], [8, 15, 17], [4, 5, 6], [9, 12, 15]];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>三邊長 <span class="ival tv">6、8、10</span></label>
              <input type="range" class="ts" min="0" max="${TRI.length - 1}" step="1" value="0">
            </div></div>`;
          const draw = () => {
            const [a, b, c] = TRI[+h.querySelector('.ts').value];
            h.querySelector('.tv').textContent = `${a}、${b}、${c}`;
            const ok = a * a + b * b === c * c;
            let s = '';
            s += TX(220, 30, `最大邊是 ${c}，先把它當斜邊試試看`, { anchor: 'middle', fs: 15, c: GREY });
            s += BOX(30, 46, 180, 74, { r: 12, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 2 });
            s += TX(120, 72, '另外兩邊平方和', { anchor: 'middle', fs: 13, c: BLU });
            s += TX(120, 102, `${a}² ＋ ${b}² ＝ ${a * a + b * b}`, { anchor: 'middle', fs: 17, c: INK });
            s += BOX(230, 46, 180, 74, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 });
            s += TX(320, 72, '最大邊平方', { anchor: 'middle', fs: 13, c: AMB });
            s += TX(320, 102, `${c}² ＝ ${c * c}`, { anchor: 'middle', fs: 17, c: INK });
            s += BOX(60, 142, 320, 56, { r: 14, fill: ok ? 'rgba(5,150,105,.09)' : 'rgba(225,29,72,.07)', stroke: ok ? GRN : RED, sw: 2 });
            s += TX(220, 166, ok ? `${a * a + b * b} ＝ ${c * c}` : `${a * a + b * b} ≠ ${c * c}`,
              { anchor: 'middle', fs: 19, c: ok ? GRN : RED });
            s += TX(220, 189, ok ? '✓ 是直角三角形' : '✗ 不是直角三角形',
              { anchor: 'middle', fs: 16, c: ok ? GRN : RED });
            s += TX(220, 226, '相差一點點也不算——6、8、11 就差在這裡', { anchor: 'middle', fs: 13.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 238', s);
          };
          h.querySelector('.ts').oninput = draw;
          draw();
        },
        caption: '拖滑桿比較 6、8、10 與 6、8、11：只差 1，結論完全不同。',
        example: {
          q: '\\(8\\)、\\(15\\)、\\(17\\) 能不能構成直角三角形？',
          steps: ['最大邊是 \\(17\\)', '\\(8^2+15^2=64+225=289=17^2\\)'],
          ans: '可以'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '生活題：先把文字畫成一個直角三角形',
        points: [
          '固定三步：<b>畫直角三角形 → 填已知與未知 → 列平方關係</b>。',
          '梯子靠牆：牆是一股、地面是一股、梯子是斜邊。',
          '算完要回頭看題目問的是哪一段，不要答錯對象。'
        ],
        formula: { label: '生活應用<span class="pgref">課本 印 105 例 6</span>', tex: '\\text{牆高}^2+\\text{離牆}^2=\\text{梯長}^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>梯腳離牆 <span class="ival xv">1.0</span> 公尺（梯長固定 2.6）</label>
              <input type="range" class="xs" min="0.6" max="2.4" step="0.2" value="1">
            </div></div>`;
          const draw = () => {
            const x = +h.querySelector('.xs').value;
            h.querySelector('.xv').textContent = x.toFixed(1);
            const y = Math.sqrt(2.6 * 2.6 - x * x);
            const u = 72;
            const gx = 90, gy = 226;
            let s = '';
            s += SV.seg(gx, gy, 410, gy, '#9aa6bb', 3);
            s += SV.seg(gx, gy, gx, 34, '#9aa6bb', 3);
            s += SV.poly([[gx, gy], [gx + x * u, gy], [gx, gy - y * u]], 'rgba(124,58,237,.08)', VIO, 2.2);
            s += SV.seg(gx + x * u, gy, gx, gy - y * u, AMB, 5);
            s += SV.rightAngle(gx, gy, 0, 90, 14, RED);
            s += TX(gx + x * u / 2, gy + 22, `${x.toFixed(1)}`, { anchor: 'middle', fs: 15, c: BLU });
            s += TX(gx - 10, gy - y * u / 2, `${y.toFixed(2)}`, { anchor: 'end', fs: 15, c: GRN });
            s += TX(gx + x * u / 2 + 34, gy - y * u / 2 - 6, '2.6', { anchor: 'middle', fs: 15, c: AMB });
            s += TX(300, 60, `${x.toFixed(1)}² ＋ 高² ＝ 2.6²`, { anchor: 'middle', fs: 16, c: INK });
            s += TX(300, 88, `高 ＝ ${y.toFixed(2)} 公尺`, { anchor: 'middle', fs: 17, c: GRN });
            s += TX(300, 118, '梯腳往外拉，頂端就往下掉', { anchor: 'middle', fs: 13.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 254', s);
          };
          h.querySelector('.xs').oninput = draw;
          draw();
        },
        caption: '課本印 105 的竹竿題就是拖這個滑桿：從離牆 1 公尺拉到 2.4 公尺，頂端下滑 1.4 公尺。',
        example: {
          q: '長 \\(2.6\\) 公尺的竹竿，底部離牆 \\(1\\) 公尺，頂端離地多高？',
          steps: ['\\(1^2+h^2=2.6^2\\)', '\\(h^2=6.76-1=5.76\\)'],
          ans: '\\(2.4\\) 公尺'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜生活應用',
        points: [
          '先畫圖：把題目的長度標在<b>直角三角形</b>的三個位置上。',
          '長方形的對角線，就是它裡面最長的一段。',
          '螢幕幾吋指的是<b>對角線</b>，長寬比要先設成 \\(4t\\)、\\(3t\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 104、105</span>', tex: '(4t)^2+(3t)^2=20^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 104、105', BLU, '生活中的直角三角形',
              pText('印10', '長寬比 \\(4:3\\) 的 \\(20\\) 吋電視，螢幕寬幾吋？', '\\(12\\) 吋') +
              pText('印11', '\\(2.6\\) 公尺的竹竿由離牆 \\(1\\) 滑到 \\(2.4\\)，頂端下滑幾公尺？', '\\(1.4\\) 公尺')), '2-3');
        },
        caption: '課本印 10、11：先把文字畫成直角三角形。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '正三角形作高，底邊就被平分',
        points: [
          '正三角形是<b>線對稱</b>圖形，高會落在底邊<b>中點</b>。',
          '邊長 \\(10\\) 的正三角形：底邊分成 \\(5\\)、\\(5\\)。',
          '再用畢氏定理：\\(10^2-5^2=75\\)，高是 \\(5\\sqrt{3}\\)。'
        ],
        formula: { label: '先作高再用畢氏<span class="pgref">課本 印 100 隨堂</span>', tex: 'h=\\sqrt{10^2-5^2}=\\sqrt{75}=5\\sqrt{3}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 280', [
            {
              t: '邊長都是 10 的正三角形', d: k => {
                let s = SV.poly([[120, 220], [320, 220], [220, 47]], 'rgba(124,58,237,.08)', VIO, 2.6);
                s += SV.ticks(120, 220, 320, 220, 1, VIO, 7) + SV.ticks(120, 220, 220, 47, 1, VIO, 7) + SV.ticks(320, 220, 220, 47, 1, VIO, 7);
                s += TX(220, 242, '10', { anchor: 'middle', fs: 15, c: INK });
                s += TX(150, 132, '10', { anchor: 'end', fs: 15, c: INK });
                s += TX(296, 132, '10', { fs: 15, c: INK });
                return s;
              }
            },
            {
              t: '作高，它會落在底邊中點', d: k =>
                SV.seg(220, 47, 220, 220, GRN, 2.6, '5 4') +
                SV.rightAngle(220, 220, 0, 90, 12, GRN) +
                TX(170, 242, '5', { anchor: 'middle', fs: 15, c: GRN, op: k }) +
                TX(270, 242, '5', { anchor: 'middle', fs: 15, c: GRN, op: k })
            },
            {
              t: '左半邊是直角三角形，用畢氏定理', d: k =>
                TX(220, 268, `h ＝ ${RT('10² − 5²')} ＝ ${RT(75)} ＝ 5${RT(3)}`, { anchor: 'middle', fs: 19, c: GRN, op: k })
            }
          ]);
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '被問「底邊為什麼變成 5」時要答得出來：因為正三角形對稱，高一定落在中點。',
        example: {
          q: '邊長 \\(10\\) 的正三角形，面積是多少？',
          steps: ['高是 \\(5\\sqrt{3}\\)', '面積 \\(=\\tfrac{1}{2}\\times 10\\times 5\\sqrt{3}\\)'],
          ans: '\\(25\\sqrt{3}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '把 10 換成 a，就得到公式',
        points: [
          '一樣三個動作：<b>作高 → 底邊平分 → 畢氏定理</b>，只是數字換成 \\(a\\)。',
          '高 \\(=\\dfrac{\\sqrt{3}}{2}a\\)，面積 \\(=\\dfrac{\\sqrt{3}}{4}a^2\\)。',
          '記法：<b>高的係數大、面積的係數小</b>，兩個不要互換。'
        ],
        formula: { label: '正三角形公式<span class="pgref">課本 印 100 課文</span>', tex: 'h=\\frac{\\sqrt{3}}{2}a\\qquad A=\\frac{\\sqrt{3}}{4}a^2' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl">
              <label>邊長 a <span class="ival av">10</span></label>
              <input type="range" class="as" min="1" max="12" step="1" value="10">
            </div></div>`;
          const fmt = (v) => (Math.round(v * 100) / 100).toFixed(2);
          const draw = () => {
            const a = +h.querySelector('.as').value;
            h.querySelector('.av').textContent = a;
            const u = 150 / 12, w = a * u, hh = w * Math.SQRT2 * 0.6124;
            const x0 = 220 - w / 2, y0 = 186;
            let s = '';
            s += SV.poly([[x0, y0], [x0 + w, y0], [220, y0 - hh]], 'rgba(124,58,237,.10)', VIO, 2.4);
            s += SV.seg(220, y0 - hh, 220, y0, GRN, 2.2, '5 4');
            s += SV.rightAngle(220, y0, 0, 90, 10, GRN);
            s += TX(220, y0 + 18, `a ＝ ${a}`, { anchor: 'middle', fs: 14, c: INK });
            s += TX(x0 + w / 4 - 8, y0 + 4, '', { fs: 12 });
            s += TX(232, y0 - hh / 2, `h`, { fs: 14, c: GRN });
            s += BOX(18, 214, 196, 58, { r: 12, fill: 'rgba(5,150,105,.07)', stroke: GRN, sw: 2 });
            s += TX(116, 236, '高', { anchor: 'middle', fs: 13, c: GRN });
            s += TX(116, 262, `${fmt(Math.sqrt(3) / 2 * a)}`, { anchor: 'middle', fs: 18, c: INK });
            s += BOX(226, 214, 196, 58, { r: 12, fill: 'rgba(217,119,6,.07)', stroke: AMB, sw: 2 });
            s += TX(324, 236, '面積', { anchor: 'middle', fs: 13, c: AMB });
            s += TX(324, 262, `${fmt(Math.sqrt(3) / 4 * a * a)}`, { anchor: 'middle', fs: 18, c: INK });
            s += TX(220, 26, `邊長 ${a}：高 ＝ ${RT(3)}／2 × ${a}`, { anchor: 'middle', fs: 15, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 282', s);
            radBars(h);
          };
          h.querySelector('.as').oninput = draw;
          draw();
        },
        caption: '拖到 \\(a=1\\) 就是習作基礎 2 那一題：高 \\(\\tfrac{\\sqrt{3}}{2}\\)、面積 \\(\\tfrac{\\sqrt{3}}{4}\\)。',
        example: {
          q: '邊長 \\(1\\) 的正三角形，高與面積各是多少？',
          steps: ['高 \\(=\\tfrac{\\sqrt{3}}{2}\\times 1\\)', '面積 \\(=\\tfrac{\\sqrt{3}}{4}\\times 1^2\\)'],
          ans: '高 \\(\\tfrac{\\sqrt{3}}{2}\\)、面積 \\(\\tfrac{\\sqrt{3}}{4}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜正三角形的高與面積',
        points: [
          '先作高、把底邊平分，再用畢氏定理。',
          '會用公式也要看得懂它是怎麼來的。',
          '面積別忘了乘 \\(\\tfrac{1}{2}\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 100</span>', tex: 'h=\\frac{\\sqrt{3}}{2}a\\qquad A=\\frac{\\sqrt{3}}{4}a^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 100', BLU, '邊長 10 的正三角形',
              pText('印6 ①', '求它的高。', '\\(5\\sqrt{3}\\)') +
              pText('印6 ②', '求它的面積。')), '2-3');
        },
        caption: '課本用邊長 10 做一次，節末的習作基礎 2 用邊長 1 再做一次，公式就記得住了。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '斜邊上的高：同一個面積算兩次',
        points: [
          '直角三角形用兩股當底和高，面積最好算。',
          '換成用斜邊當底，高就是要求的那一段。',
          '兩個算法算的是<b>同一個面積</b>，所以可以畫等號。'
        ],
        formula: { label: '面積算兩次<span class="pgref">課本 印 101 例 3</span>', tex: '\\tfrac{1}{2}\\times 12\\times 16=\\tfrac{1}{2}\\times 20\\times \\overline{AD}' },
        visual: (h) => {
          SV.stepper(h, '0 0 440 290', [
            {
              t: '先求斜邊：12 和 16 的平方和', d: k => {
                let s = SV.poly([[100, 208], [340, 208], [100, 88]], 'rgba(124,58,237,.08)', VIO, 2.6);
                s += SV.rightAngle(100, 208, 0, 90, 14, RED);
                s += TX(220, 230, '16', { anchor: 'middle', fs: 15, c: BLU });
                s += TX(88, 150, '12', { anchor: 'end', fs: 15, c: AMB });
                s += TX(244, 136, '20', { anchor: 'middle', fs: 15, c: GRN, op: k });
                return s;
              }
            },
            {
              t: '用兩股算面積', d: k =>
                TX(220, 252, '面積 ＝ ½ × 12 × 16 ＝ 96', { anchor: 'middle', fs: 17, c: BLU, op: k })
            },
            {
              t: '再用斜邊當底算一次，兩個相等', d: k =>
                SV.seg(100, 208, 190, 148, GRN, 2.4, '5 4') +
                SV.rightAngle(190, 148, 216, 306, 10, GRN) +
                TX(152, 164, 'AD', { fs: 13, c: GRN, op: k }) +
                TX(220, 276, '½ × 20 × AD ＝ 96　→　AD ＝ 48／5', { anchor: 'middle', fs: 17, c: GRN, op: k })
            }
          ]);
        },
        caption: '這一型是課本延伸，老師會分步帶做；先會前面那幾種再來挑戰。',
        example: {
          q: '兩股 \\(2\\)、\\(3\\) 的直角三角形，斜邊上的高是多少？',
          steps: ['斜邊 \\(=\\sqrt{4+9}=\\sqrt{13}\\)', '\\(\\tfrac{1}{2}\\times2\\times3=\\tfrac{1}{2}\\times\\sqrt{13}\\times h\\)'],
          ans: '\\(\\dfrac{6\\sqrt{13}}{13}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜斜邊上的高（老師帶做）',
        points: [
          '先算斜邊，再用「面積算兩次」列等式。',
          '答案分母有根號時要有理化。',
          '⚠ 這一型不是這一節的過關條件，做不完不要緊。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 101 例 3</span>', tex: '\\tfrac{1}{2}ab=\\tfrac{1}{2}ch' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 101', BLU, '兩股 12、16',
              pText('印7', '求斜邊上的高 \\(\\overline{AD}\\)。', '\\(\\tfrac{48}{5}\\)')), '2-3');
        },
        caption: '先求斜邊，再讓兩個面積算式相等。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '同一條線上的兩點，距離用減的',
        points: [
          '兩點<b>y 坐標相同</b>（同一條水平線）→ 距離就是 x 坐標相減的絕對值。',
          '兩點<b>x 坐標相同</b>（同一條鉛垂線）→ 距離就是 y 坐標相減的絕對值。',
          '減的時候要看清楚負號：\\(7-(-1)=8\\)。'
        ],
        formula: { label: '同軸兩點<span class="pgref">課本 印 106、107 例 7</span>', tex: '\\overline{AB}=|x_1-x_2|\\quad\\text{或}\\quad|y_1-y_2|' },
        visual: (h) => {
          const P = SV.plane({ x0: 46, y0: 18, w: 300, h: 240, xmin: -5, xmax: 5, ymin: -4, ymax: 8, step: 1 });
          h.innerHTML = svg('0 0 440 282', P.defs + P.svg +
            SV.seg(P.X(-3), P.Y(2), P.X(4), P.Y(2), BLU, 4) +
            SV.dot(P.X(-3), P.Y(2), BLU) + SV.dot(P.X(4), P.Y(2), BLU) +
            SV.vlabel(P.X(-3) - 30, P.Y(2) - 8, 'A(−3,2)', BLU, 13) +
            SV.vlabel(P.X(4) + 4, P.Y(2) - 8, 'B(4,2)', BLU, 13) +
            TX((P.X(-3) + P.X(4)) / 2, P.Y(2) - 10, '7', { anchor: 'middle', fs: 15, c: BLU }) +
            SV.seg(P.X(-3), P.Y(2), P.X(-3), P.Y(7), AMB, 4) +
            SV.dot(P.X(-3), P.Y(7), AMB) +
            SV.vlabel(P.X(-3) - 30, P.Y(7) - 6, 'C(−3,7)', AMB, 13) +
            TX(P.X(-3) - 8, (P.Y(2) + P.Y(7)) / 2, '5', { anchor: 'end', fs: 15, c: AMB }) +
            TX(392, 96, '同一條', { anchor: 'middle', fs: 14, c: GREY }) +
            TX(392, 116, '水平線', { anchor: 'middle', fs: 14, c: BLU }) +
            TX(392, 152, '同一條', { anchor: 'middle', fs: 14, c: GREY }) +
            TX(392, 172, '鉛垂線', { anchor: 'middle', fs: 14, c: AMB }) +
            TX(220, 276, '|4 − (−3)| ＝ 7　　|7 − 2| ＝ 5', { anchor: 'middle', fs: 16, c: INK }));
        },
        caption: '同軸的題目不用套距離公式，數格子或相減都可以。',
        example: {
          q: '\\(C(1,-3)\\)、\\(D(1,5)\\) 的距離是多少？',
          steps: ['x 坐標一樣，在同一條鉛垂線上', '\\(|5-(-3)|\\)'],
          ans: '\\(8\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '不同軸，就自己造一個直角三角形',
        points: [
          '橫著走幾格、直著走幾格，兩段就是<b>兩股</b>。',
          '兩點的連線就是<b>斜邊</b>，用畢氏定理求它。',
          '不是把兩段相加：走 \\(3\\) 格再走 \\(4\\) 格，直線距離是 \\(5\\) 不是 \\(7\\)。'
        ],
        formula: { label: '兩點距離<span class="pgref">課本 印 108 例 8</span>', tex: '\\overline{AB}=\\sqrt{(x_1-x_2)^2+(y_1-y_2)^2}' },
        visual: (h) => {
          const P = SV.plane({ x0: 52, y0: 16, w: 276, h: 216, xmin: -1, xmax: 6, ymin: -1, ymax: 6, step: 1 });
          SV.stepper(h, '0 0 440 292', [
            {
              t: '標出兩個點', d: k =>
                P.defs + P.svg +
                SV.dot(P.X(1), P.Y(1), VIO) + SV.dot(P.X(4), P.Y(5), VIO) +
                SV.vlabel(P.X(1) - 6, P.Y(1) + 22, 'A(1,1)', VIO, 13) +
                SV.vlabel(P.X(4) - 4, P.Y(5) - 8, 'B(4,5)', VIO, 13)
            },
            {
              t: '橫著走 3 格、直著走 4 格', d: k =>
                SV.seg(P.X(1), P.Y(1), P.X(4), P.Y(1), BLU, 4) +
                SV.seg(P.X(4), P.Y(1), P.X(4), P.Y(5), AMB, 4) +
                SV.rightAngle(P.X(4), P.Y(1), 90, 180, 12, GREY) +
                TX((P.X(1) + P.X(4)) / 2, P.Y(1) + 20, '3', { anchor: 'middle', fs: 15, c: BLU, op: k }) +
                TX(P.X(4) + 10, (P.Y(1) + P.Y(5)) / 2, '4', { fs: 15, c: AMB, op: k })
            },
            {
              t: '兩點的連線就是斜邊', d: k =>
                SV.seg(P.X(1), P.Y(1), P.X(4), P.Y(5), GRN, 4) +
                TX(360, 120, '3² ＋ 4²', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(360, 148, '＝ 25', { anchor: 'middle', fs: 17, c: INK, op: k }) +
                TX(360, 182, 'AB ＝ 5', { anchor: 'middle', fs: 19, c: GRN, op: k }) +
                TX(220, 274, '走 3 格再走 4 格是 7；直線距離是 5', { anchor: 'middle', fs: 15, c: RED, op: k })
            }
          ]);
        },
        caption: '公式只是把「橫向差、縱向差、畢氏定理」縮成一行，先看得到三角形再用它。',
        example: {
          q: '\\(A(-1,3)\\)、\\(B(1,-1)\\) 的距離是多少？',
          steps: ['橫向差 \\(2\\)、縱向差 \\(4\\)', '\\(\\sqrt{2^2+4^2}=\\sqrt{20}\\)'],
          ans: '\\(2\\sqrt{5}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜坐標平面上的距離',
        points: [
          '同一條線上用<b>相減取絕對值</b>，不必套公式。',
          '不同軸就先數出橫向差與縱向差，再用畢氏定理。',
          '算周長要三邊都算，別漏掉最短的那一條。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 107、108</span>', tex: '\\overline{AB}=\\sqrt{(x_1-x_2)^2+(y_1-y_2)^2}' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 107、108', BLU, '兩點距離',
              pText('印13 ①', '\\(A(\\tfrac{1}{2},-3)\\)、\\(B(-2,-3)\\) 的距離。') +
              pText('印13 ②', '\\(C(1,-3)\\)、\\(D(1,5)\\) 的距離。') +
              pText('印14', '\\(A(-1,3)\\)、\\(B(1,-1)\\)、\\(C(4,3)\\)，求 \\(\\triangle ABC\\) 的周長。', '\\(10+2\\sqrt{5}\\)')), '2-3');
        },
        caption: '前兩題是同軸、第三題要算三次距離——先各自算完再相加。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '數線上也找得到根號（課本延伸）',
        points: [
          '用邊長 \\(3\\) 的直角三角形一個接一個，斜邊會依序是 \\(3\\sqrt{2}\\)、\\(3\\sqrt{3}\\)、\\(6\\)。',
          '把斜邊的長度量到數線上，就標得出那些開不盡的數。',
          '⚠ 這是<b>課本的延伸</b>，不是這一節的過關條件。'
        ],
        formula: { label: '課本延伸<span class="pgref">課本 印 103 例 4</span>', tex: '\\overline{OB}=\\sqrt{3^2+3^2}=3\\sqrt{2}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '第一個直角三角形', tex: '\\overline{OB}=\\sqrt{3^2+3^2}=\\sqrt{18}=3\\sqrt{2}', color: BLU, fill: '#f6f9ff', border: BLU, size: 18 },
            { label: '把 OB 當一股，再接一個', tex: '\\overline{OC}=\\sqrt{(3\\sqrt{2})^2+3^2}=\\sqrt{27}=3\\sqrt{3}', color: VIO, border: '#d8ccf5', size: 18 },
            { label: '再接一個就回到整數', tex: '\\overline{OD}=\\sqrt{(3\\sqrt{3})^2+3^2}=\\sqrt{36}=6', color: GRN, border: '#cfe8dd', size: 18, note: '南一備課用書印 103 的眉批：這題的目的是讓學生知道「數線上找得出根號的位置」' }
          ], { gap: 11 });
          MJ(h);
        },
        caption: '每接一個三角形，前一個的斜邊就變成新的一股——這樣一直做下去。',
        example: {
          q: '\\(\\overline{OA}=\\overline{AB}=3\\)，求 \\(\\overline{OB}\\)。',
          steps: ['\\(3^2+3^2=18\\)', '\\(\\sqrt{18}=3\\sqrt{2}\\)'],
          ans: '\\(3\\sqrt{2}\\)'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜課本延伸（數線上的根號）',
        points: [
          '數線題：算完一段就把它當成下一個三角形的股。',
          '正方形的對角線會把它切成兩個<b>等腰</b>直角三角形。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 103</span>', tex: 'x^2+x^2=(2\\sqrt{2})^2' },
        visual: (h) => {
          pMount(h,
            pCard('課本・隨堂練習', '印 103', BLU, '數線上的直角三角形（課本延伸）',
              pText('印9 ①', '四段都是 \\(3\\)，求 \\(\\overline{OB}\\)、\\(\\overline{OC}\\)、\\(\\overline{OD}\\)。', '\\(3\\sqrt{2},3\\sqrt{3},6\\)') +
              pText('印9 ②', '\\(\\overline{OE}=\\overline{OD}\\)、\\(E\\) 在原點右方，求 \\(E\\)。', '\\(6\\)')), '2-3');
        },
        caption: '課本印 9：算完一段，就把它當成下一個三角形的股。'
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>認錯斜邊、求股還用加的、坐標距離用相加</b>。',
          '第一個不是算錯，是<b>圖看錯</b>——要練的東西不一樣。',
          '第三個最直覺：走過的路長不等於直線距離。'
        ],
        formula: { label: '記住這一條<span class="pgref">課本 印 109 重點整理</span>', tex: 'a^2+b^2=c^2\\quad(c\\text{ 一定是斜邊})' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '把底邊當斜邊', bad: '圖一轉就指最下面那條', good: '先<b>圈直角</b>，斜邊是它的<b>對邊</b>，<br>也一定是最長的' },
            { tag: '已知斜邊求股還用加的', bad: '\\(13^2+5^2=b^2\\)，<br>越算越大', good: '先寫 \\(a^2+b^2=c^2\\)：<br>\\(5^2+b^2=13^2\\Rightarrow b^2=144\\)' },
            { tag: '坐標距離兩段相加', bad: '橫向 \\(3\\)、縱向 \\(4\\)，<br>答 \\(7\\)', good: '那兩段是<b>兩股</b>：<br>\\(\\sqrt{3^2+4^2}=5\\)' }
          ]);
          MJ(h);
        },
        caption: '第一個特別要防：它算得再熟也救不回來，因為一開始就代錯位置。',
        example: {
          q: '下課前一分鐘：三邊 \\(6\\)、\\(8\\)、\\(11\\)，是直角三角形嗎？',
          steps: ['最大邊是 \\(11\\)', '\\(6^2+8^2=100\\)，\\(11^2=121\\)'],
          ans: '不是'
        }
      },

      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜習作（基礎 1～3）',
        points: [
          '從這裡開始是<b>習作</b>，一路做到本節結束。',
          '斜邊未知用加、股未知用減，但式子都寫成 \\(a^2+b^2=c^2\\)。',
          '正方形的對角線會把它切成兩個直角三角形。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 99 例 1</span>', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 27', AMB, '求缺邊',
              pText('基礎1 ①', '兩股 \\(9\\)、\\(12\\)，求斜邊。') +
              pText('基礎1 ②', '一股 \\(6\\)、斜邊 \\(7\\)，求另一股。')) +
            pCard('習作・基礎練習', '印 27', AMB, '邊長 1 的正三角形',
              pText('基礎2 ①', '求 \\(\\overline{AH}\\)（\\(\\overline{BC}\\) 上的高）。') +
              pText('基礎2 ②', '求 \\(\\triangle ABC\\) 的面積。')) +
            pCard('習作・基礎練習', '印 28', AMB, '兩股 3、2',
              pText('基礎3', '求斜邊上的高 \\(\\overline{BD}\\)。', '\\(\\tfrac{6\\sqrt{13}}{13}\\)')), '2-3');
        },
        caption: '基礎 2 用邊長 1 把課本那一組動作再做一次。 基礎 3 跟課本印 7 做法一樣：先求斜邊，再讓兩個面積算式相等。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜習作（基礎 4、5）',
        points: [
          '先畫圖：把題目的長度標在<b>直角三角形</b>的三個位置上。',
          '長方形的對角線，就是它裡面最長的一段。',
          '螢幕幾吋指的是<b>對角線</b>，長寬比要先設成 \\(4t\\)、\\(3t\\)。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 104、105</span>', tex: '(4t)^2+(3t)^2=20^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・基礎練習', '印 28', AMB, '長方形坑洞（長 36、寬 27）',
              pText('基礎4 ①', '求對角線長。') +
              pText('基礎4 ②', '要用圓形鐵片蓋住它，直徑至少多少？')) +
            pCard('習作・基礎練習', '印 29', AMB, '\\(A(2,2)\\)、\\(B(-3,0)\\)、\\(C(1,-4)\\)',
              pText('基礎5', '求 \\(\\overline{BC}\\)、高 \\(\\overline{AD}\\) 與 \\(\\triangle ABC\\) 的面積。（\\(D(-\\tfrac{3}{2},-\\tfrac{3}{2})\\)）', '\\(4\\sqrt{2}\\)、\\(\\tfrac{7}{2}\\sqrt{2}\\)、\\(14\\)')), '2-3');
        },
        caption: '基礎 4 兩小題連在一起：先算出對角線，第二小題才答得出來。'
      },
      {
        sec: '2-3', secName: '畢氏定理',
        title: '練習｜習作（精熟）',
        points: [
          '數線題：算完一段就把它當成下一個三角形的股。',
          '正方形的對角線會把它切成兩個<b>等腰</b>直角三角形。',
          '圓題先找直徑：通過圓心的那一條弦就是直徑。'
        ],
        formula: { label: '這一組在練<span class="pgref">課本 印 103</span>', tex: 'x^2+x^2=(2\\sqrt{2})^2' },
        visual: (h) => {
          pMount(h,
            pCard('習作・行有餘力', '印 30', GRN, '',
              pText('精熟1', '正方形對角線 \\(\\overline{AC}=2\\sqrt{2}\\)，求邊長。') +
              pText('精熟2 ①', '圓交 \\(x\\) 軸於 \\(A(-12,0)\\)、\\(B(2,0)\\)，求圓心 \\(C\\)。') +
              pText('精熟2 ②', '求 \\(P(4,6)\\) 到 \\(C\\) 的距離。')), '2-3');
        },
        caption: '精熟兩題行有餘力再做；圓的題目先找直徑，只求圓心與距離，不做圓的面積。'
      },
      {

        sec: '2-3', secName: '畢氏定理',
        title: '對答案｜習作（基礎、精熟練習）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          pAnswerKey(h, '2-3', [
            { label: '基礎 1～3（印 27–28）', cols: 3, items: [['1 ①②', '基礎1 ①'], ['2 ①', '基礎2 ①'], ['2 ②', '基礎2 ②'], ['3', '基礎3']] },
            { label: '基礎 4、5（印 28–29）', cols: 2, items: [['4 ①', '基礎4 ①'], ['4 ②', '基礎4 ②'], ['5', '基礎5']] },
            { label: '精熟（印 30）', cols: 3, items: [['精 1', '精熟1'], ['精 2 ①', '精熟2 ①'], ['精 2 ②', '精熟2 ②']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
    ]
  });
})();
