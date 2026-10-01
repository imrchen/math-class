window.DECK = window.DECK || [];
(function () {
  const C = '#059669';

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

  const V = {
    add: (p, q) => [p[0] + q[0], p[1] + q[1]],
    sub: (p, q) => [p[0] - q[0], p[1] - q[1]],
    mul: (p, k) => [p[0] * k, p[1] * k],
    len: (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]),
    mid: (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2],
    lerp: (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t],
    unit: (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; }
  };

  const circum = (A, B, Cc) => {
    const d = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1]));
    const a2 = A[0] ** 2 + A[1] ** 2, b2 = B[0] ** 2 + B[1] ** 2, c2 = Cc[0] ** 2 + Cc[1] ** 2;
    return [(a2 * (B[1] - Cc[1]) + b2 * (Cc[1] - A[1]) + c2 * (A[1] - B[1])) / d,
            (a2 * (Cc[0] - B[0]) + b2 * (A[0] - Cc[0]) + c2 * (B[0] - A[0])) / d];
  };

  const incen = (A, B, Cc) => {
    const a = V.len(B, Cc), b = V.len(A, Cc), c = V.len(A, B), s = a + b + c;
    const area = Math.abs((B[0] - A[0]) * (Cc[1] - A[1]) - (Cc[0] - A[0]) * (B[1] - A[1])) / 2;
    return { I: [(a * A[0] + b * B[0] + c * Cc[0]) / s, (a * A[1] + b * B[1] + c * Cc[1]) / s], r: 2 * area / s };
  };
  const cen = (A, B, Cc) => [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];

  const foot = (P, A, B) => {
    const d = V.sub(B, A), t = ((P[0] - A[0]) * d[0] + (P[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
    return V.lerp(A, B, t);
  };

  const xline = (P1, P2, P3, P4) => {
    const d = (P1[0] - P2[0]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] - P4[0]);
    const a = P1[0] * P2[1] - P1[1] * P2[0], b = P3[0] * P4[1] - P3[1] * P4[0];
    return [(a * (P3[0] - P4[0]) - (P1[0] - P2[0]) * b) / d, (a * (P3[1] - P4[1]) - (P1[1] - P2[1]) * b) / d];
  };

  const bisFoot = (Vx, P, Q) => { const u = V.unit(Vx, P), v = V.unit(Vx, Q); return xline(Vx, V.add(Vx, V.add(u, v)), P, Q); };
  const f1 = (v) => (+v).toFixed(1);
  const L = (p, q, col, w, dash) => SV.seg(+f1(p[0]), +f1(p[1]), +f1(q[0]), +f1(q[1]), col || INK, w || 2.4, dash || '');
  const PG = (pts, o = {}) => `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="${o.fill || 'none'}" stroke="${o.stroke || INK}" stroke-width="${o.sw || 2.4}"${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;
  const NM = (p, t, dx, dy, col, fs) => TX(f1(p[0] + (dx || 0)), f1(p[1] + (dy || 0)), t, { anchor: 'middle', fs: fs || 16, c: col || INK });
  const PT = (p, col, r) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r || 4.2}" fill="${col || INK}"/>`;
  const CI = (c, r, o = {}) => `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${o.fill || 'none'}" stroke="${o.stroke || BLU}" stroke-width="${o.sw || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${o.op}"` : ''}/>`;

  const RA = (Vx, P, Q, s, col) => {
    const u = V.unit(Vx, P), v = V.unit(Vx, Q), k = s || 10;
    const a = V.add(Vx, V.mul(u, k)), b = V.add(a, V.mul(v, k)), c = V.add(Vx, V.mul(v, k));
    return `<polyline points="${f1(a[0])},${f1(a[1])} ${f1(b[0])},${f1(b[1])} ${f1(c[0])},${f1(c[1])}" fill="none" stroke="${col || GREY}" stroke-width="1.7"/>`;
  };

  const AN = (Vx, P, Q, r, col, lab, o = {}) => {
    const u = V.unit(Vx, P), v = V.unit(Vx, Q);
    const a = V.add(Vx, V.mul(u, r)), b = V.add(Vx, V.mul(v, r)), cr = u[0] * v[1] - u[1] * v[0];
    let s = `<path d="M${f1(a[0])},${f1(a[1])} A${r},${r} 0 0 ${cr > 0 ? 1 : 0} ${f1(b[0])},${f1(b[1])}" fill="none" stroke="${col}" stroke-width="${o.w || 2.2}"/>`;
    if (lab) {
      const m = V.unit([0, 0], V.add(u, v)), p = V.add(Vx, V.mul(m, r + (o.lr || 12)));
      s += TX(f1(p[0]), f1(p[1] + 5), lab, { anchor: 'middle', fs: o.fs || 13.5, c: col });
    }
    return s;
  };
  const TK = (p, q, n, col) => SV.ticks(+f1(p[0]), +f1(p[1]), +f1(q[0]), +f1(q[1]), n || 1, col || RED);

  const PB = (p, q, h) => { const m = V.mid(p, q), u = V.unit(p, q), n = [-u[1], u[0]]; return [V.add(m, V.mul(n, -h)), V.add(m, V.mul(n, h))]; };

  const EXF = (inner, w, h) => `<svg viewBox="0 0 240 ${h || 150}" style="width:${w || 56}%;display:block;margin:2px auto 0">${inner}</svg>`;
  const exT = (p, t, dx, dy, col) => `<text x="${f1(p[0] + (dx || 0))}" y="${f1(p[1] + (dy || 0))}" text-anchor="middle" font-size="13" font-weight="900" fill="${col || INK}">${t}</text>`;

  const CG = '<tspan font-family="Cambria Math, STIX Two Math, Times New Roman, serif" font-size="1.5em">≅</tspan>';
  const PRAC = (h) => { if (typeof PRACTICE === 'undefined') { h.innerHTML = '<div>練習題目列表（需 practice.js）</div>'; return false; } return true; };

  window.DECK.push({
    ch: 3,
    title: '推理證明與三角形的心',
    color: C,
    sections: ['3-1 推理證明', '3-2 三角形的外心、內心與重心'],
    slides: [

      {
        sec: '3-1', secName: '推理證明',
        title: '這一節只學一件事：每一步都要有收據',
        points: [
          '<b>是什麼</b>：證明是把「題目給的」一步一步接到「要說明的」。',
          '<b>長什麼樣</b>：分成<span class="k">已知</span>、<span class="k">求證</span>、<span class="k">證明</span>三格。',
          '<b>做什麼</b>：每寫一步，括號裡寫<b>理由</b>——沒有理由的結論不能用。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 138–152</span>', tex: '\\text{已知}\\;\\to\\;\\text{證明}\\;\\to\\;\\text{求證}' },
        visual: (h) => {
          const card = (y, t1, t2, col) =>
            BOX(30, y, 380, 58, { r: 12, fill: '#fff', stroke: col, sw: 2 }) +
            TX(54, y + 37, t1, { fs: 19, c: col }) + TX(150, y + 37, t2, { fs: 15.5, c: INK });
          SV.stepper(h, SECVB, [
            { t: '<b>已知</b>是線索、<b>求證</b>是終點、<b>證明</b>是中間的路。',
              d: () => SECBG + card(28, '已知', '題目給的條件（線索）', BLU) + card(100, '求證', '要說明的結論（終點）', RED)
                + card(172, '證明', '從線索一步一步走到終點', GRN)
                + TX(220, 266, '先分三格，再動筆', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '證明的每一句，都要附一張<b>收據</b>：括號裡的理由。',
              d: () => SECBG + TX(220, 40, '一行一句，括號裡是收據', { anchor: 'middle', fs: 16, c: GREY })
                + TX(60, 92, '∵ AB ＝ AC', { fs: 19, c: INK }) + TX(250, 92, '（已知）', { fs: 17, c: GRN })
                + TX(60, 136, '　 AD ＝ AD', { fs: 19, c: INK }) + TX(250, 136, '（公用邊）', { fs: 17, c: GRN })
                + TX(60, 180, '∴ △ABD ' + CG + ' △ACD', { fs: 19, c: INK }) + TX(250, 180, '（RHS 全等）', { fs: 17, c: GRN })
                + BOX(240, 66, 160, 128, { r: 12, fill: 'none', stroke: GRN, sw: 2, dash: '6 4' })
                + TX(220, 236, '沒有收據的結論，不能帶走', { anchor: 'middle', fs: 16, c: RED }) },
            { t: '整節只有兩個動作。',
              d: k => SECBG + TX(220, 40, '整節只做兩件事', { anchor: 'middle', fs: 16, c: GREY })
                + TX(220, 112, '已知 → → → 求證', { anchor: 'middle', fs: 26, c: INK })
                + secActOne(['① 先圈出已知、求證', '② 每一步配一個理由'], k) }
          ], { acc: false });
        },
        caption: '八年級學過的全等、平行、相似，這一節拿來<b>寫成完整的證明</b>。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '已知、求證、證明：先分三格',
        points: [
          '把<b>題目給的條件</b>寫進已知，把<b>要說明的</b>寫進求證。',
          '求證是終點：<b>證明寫完之前，不能拿它來用</b>。',
          '證明一行一句，句尾括號寫理由；最後一句就是求證。'
        ],
        formula: { label: '已知、求證、證明<span class="pgref">課本 印 138、139</span>', tex: '\\text{已知：}AB=AC,\\ BD=CE\\;\\;\\text{求證：}AD=AE' },
        visual: (h) => {
          const A = [110, 34], B = [20, 186], Cc = [200, 186], D = [72, 186], E = [148, 186];
          const fig = (k) => PG([A, B, Cc], { stroke: INK }) + L(A, D, BLU, 2.4) + L(A, E, BLU, 2.4)
            + TK(A, B, 1) + TK(A, Cc, 1) + TK(B, D, 2, AMB) + TK(E, Cc, 2, AMB)
            + NM(A, 'A', 0, -8) + NM(B, 'B', -8, 18) + NM(Cc, 'C', 8, 18) + NM(D, 'D', 0, 20) + NM(E, 'E', 0, 20);
          const box = (y, hh, title, lines, col) => BOX(222, y, 208, hh, { r: 12, fill: '#fff', stroke: col, sw: 2 })
            + TX(236, y + 26, title, { fs: 16, c: col })
            + lines.map((t, i) => TX(300, y + 26 + i * 26, t, { fs: 16, c: INK })).join('');
          const proof = (n) => {
            const Lh = [['∵ AB ＝ AC（已知）', 14, 222], ['　 ∠B ＝ ∠C（等腰底角相等）', 14, 246], ['　 BD ＝ CE（已知）', 14, 270],
                        ['∴ △ABD ' + CG + ' △ACE（SAS）', 236, 234], ['故 AD ＝ AE（對應邊相等）', 236, 262]];
            return Lh.slice(0, n).map(([t, x, y], i) => TX(x, y, t, { fs: 13.5, c: i === 4 ? GRN : INK })).join('');
          };
          const scene = (n) => SECBG + fig() + (n >= 1 ? box(16, 64, '已知', ['AB ＝ AC', 'BD ＝ CE'], BLU) : '')
            + (n >= 2 ? box(92, 40, '求證', ['AD ＝ AE'], RED) : '') + (n >= 3 ? proof(n === 3 ? 3 : 5) : '');
          SV.stepper(h, SECVB, [
            { t: '<b>已知</b>：題目給的兩個條件。', d: () => scene(1) },
            { t: '<b>求證</b>：要說明的那一句——先框起來，最後才能寫。', d: () => scene(2) },
            { t: '<b>證明</b>：先湊三個條件，每一個都附理由。', d: () => scene(3) },
            { t: '三個條件湊齊 → 全等 → 寫到求證那一句就停。', d: () => scene(4) }
          ], { acc: false });
        },
        caption: '證明的最後一句一定是<b>求證</b>那一句——寫到它就停。',
        example: {
          q: '「在 \\(\\triangle ABC\\) 中，\\(AB=AC\\)，\\(AD\\perp BC\\)，證明 \\(\\angle B=\\angle C\\)。」已知和求證各是什麼？' +
            EXF(PG([[120, 14], [40, 130], [200, 130]]) + L([120, 14], [120, 130], BLU, 2) + RA([120, 130], [200, 130], [120, 14], 9)
              + exT([120, 14], 'A', 0, -2) + exT([40, 130], 'B', -8, 12) + exT([200, 130], 'C', 8, 12) + exT([120, 130], 'D', 0, 15), 48, 152),
          steps: ['已知：\\(AB=AC\\)、\\(AD\\perp BC\\)'],
          ans: '求證：\\(\\angle B=\\angle C\\)'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '想的時候倒著想：從求證往回找',
        points: [
          '從<b>求證倒著想</b>：要 \\(AD=AE\\)，可以先證 \\(\\triangle ABD\\cong\\triangle ACE\\)。',
          '從<b>已知往前推</b>：手上有哪三個條件，能證那兩個三角形全等？',
          '兩條路接上了，再<b>從已知那一端</b>寫成正式證明。'
        ],
        formula: { label: '思路分析<span class="pgref">課本 印 139</span>', tex: '\\text{要 }AD=AE\\text{，先證 }\\triangle ABD\\cong\\triangle ACE' },
        visual: (h) => {
          const row = (y, t, col, k) => BOX(80, y, 280, 46, { r: 12, fill: '#fff', stroke: col, sw: 2.2, op: k }) + TX(220, y + 30, t, { anchor: 'middle', fs: 16, c: col, op: k });
          const arrowD = (x, y1, y2, col, k) => SV.seg(x, y1, x, y2 - 8, col, 2.4) + `<polygon points="${x - 6},${y2 - 10} ${x + 6},${y2 - 10} ${x},${y2}" fill="${col}" opacity="${k}"/>`;
          const arrowU = (x, y1, y2, col, k) => SV.seg(x, y1, x, y2 + 8, col, 2.4) + `<polygon points="${x - 6},${y2 + 10} ${x + 6},${y2 + 10} ${x},${y2}" fill="${col}" opacity="${k}"/>`;
          SV.stepper(h, SECVB, [
            { t: '終點是求證：AD ＝ AE。', d: k => row(14, '求證：AD ＝ AE', RED, 1) },
            { t: '<b>倒著想</b>：要邊相等，先找兩個全等三角形。', d: k => arrowD(394, 40, 98, RED, k) + TX(404, 74, '倒', { fs: 14, c: RED, op: k })
                + row(80, '△ABD ' + CG + ' △ACE（SAS？）', RED, k) },
            { t: '<b>從已知往前</b>：題目給的條件寫在最下面。', d: k => row(210, '已知：AB ＝ AC，BD ＝ CE', BLU, k)
                + arrowU(46, 208, 160, BLU, k) + TX(26, 190, '推', { fs: 14, c: BLU, op: k }) },
            { t: '兩條路在中間接上：三個條件湊齊了。', d: k => BOX(80, 146, 280, 46, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2.2, op: k })
                + TX(220, 176, 'AB＝AC、∠B＝∠C、BD＝CE', { anchor: 'middle', fs: 15.5, c: GRN, op: k })
                + arrowD(394, 128, 146, RED, k) + TX(220, 280, '接上了，再從已知那一端往上寫成證明', { anchor: 'middle', fs: 14.5, c: GREY, op: k }) }
          ]);
        },
        caption: '想的時候從求證往回走，寫的時候從已知往前走——<b>方向剛好相反</b>。',
        example: {
          q: '要證明 \\(\\angle 1=\\angle 2\\)，第一個念頭是什麼？',
          steps: ['找出分別含 \\(\\angle 1\\)、\\(\\angle 2\\) 的兩個三角形'],
          ans: '證明那兩個三角形全等'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '收據有五種：已知、公用邊、對頂角、平行線、全等之後',
        points: [
          '理由不是寫「看起來一樣」，要指出<b>從哪裡來</b>。',
          '最常用的五種：已知、公用邊、對頂角、平行線的角、全等後的對應邊角。',
          '「平行」要說清楚：<b>哪兩條平行、推出哪兩個角相等</b>。'
        ],
        formula: { label: '理由（收據）<span class="pgref">課本 印 139–144</span>', tex: '\\because\\;\\cdots\\;(\\text{理由})\\qquad\\therefore\\;\\cdots' },
        visual: (h) => {
          const FIG = [
            () => { const A = [140, 30], B = [60, 170], Cc = [220, 170]; return PG([A, B, Cc]) + TK(A, B, 1) + TK(A, Cc, 1) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 6) + NM(Cc, 'C', 10, 6); },
            () => { const A = [140, 26], B = [50, 170], Cc = [230, 170], D = [140, 170]; return PG([A, B, D], { fill: 'rgba(37,99,235,.10)', stroke: BLU }) + PG([A, D, Cc], { fill: 'rgba(217,119,6,.10)', stroke: AMB }) + L(A, D, GRN, 4) + NM(A, 'A', 0, -8) + NM(D, 'D', 0, 20) + NM(B, 'B', -10, 6) + NM(Cc, 'C', 10, 6); },
            () => { const O = [140, 100]; return L([40, 40], [240, 160], INK) + L([40, 160], [240, 40], INK) + AN(O, [40, 40], [40, 160], 26, BLU, '1') + AN(O, [240, 160], [240, 40], 26, BLU, '2') + NM(O, 'O', 0, -14, GREY, 13); },
            () => { const A = [80, 40], D = [250, 40], B = [40, 170], Cc = [210, 170]; return L(A, D, BLU, 2.6) + L(B, Cc, BLU, 2.6) + L(A, Cc, AMB, 2.6) + AN(A, D, Cc, 28, AMB, '1') + AN(Cc, B, A, 28, AMB, '2') + NM(A, 'A', -6, -8) + NM(D, 'D', 8, -8) + NM(B, 'B', -8, 8) + NM(Cc, 'C', 10, 8) + TX(250, 108, 'AD ∥ BC', { anchor: 'middle', fs: 14, c: BLU }); },
            () => { const T1 = [[30, 160], [100, 40], [130, 160]], T2 = [[150, 160], [220, 40], [250, 160]]; return PG(T1, { fill: 'rgba(37,99,235,.10)', stroke: BLU }) + PG(T2, { fill: 'rgba(37,99,235,.10)', stroke: BLU }) + TX(140, 110, '' + CG + '', { anchor: 'middle', fs: 26, c: GRN }) + L(T1[0], T1[1], RED, 4) + L(T2[0], T2[1], RED, 4); }
          ];
          const ROW = [
            ['AB ＝ AC', '（已知）', '題目直接給的，或圖上有記號'],
            ['AD ＝ AD', '（公用邊）', '兩個三角形共用的那一條'],
            ['∠1 ＝ ∠2', '（對頂角相等）', '兩條直線交叉，對面的兩個角'],
            ['∠1 ＝ ∠2', '（內錯角相等）', '因為 AD ∥ BC——要寫出哪兩條平行'],
            ['紅邊 ＝ 紅邊', '（全等的對應邊）', '先證完全等，才能拿對應的邊、角']
          ];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl"><label>第 <span class="ival rv">1</span> 種 / 5</label>
              <input type="range" class="rs" min="0" max="4" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('.rs').value;
            h.querySelector('.rv').textContent = i + 1;
            const [st, re, why] = ROW[i];
            let s = `<g transform="translate(70,0)">${FIG[i]()}</g>`;
            s += TX(110, 222, st, { fs: 20, c: INK }) + TX(250, 222, re, { fs: 18, c: GRN });
            s += TX(220, 252, why, { anchor: 'middle', fs: 14.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 266', s);
          };
          h.querySelector('.rs').oninput = draw;
          draw();
        },
        caption: '看起來一樣長、一樣大，<b>不是理由</b>——題目沒給、圖上沒記號，就不能用。',
        example: {
          q: '\\(AB\\) 和 \\(CD\\) 交於 \\(O\\)，\\(\\angle AOC=\\angle BOD\\) 的理由是什麼？' +
            EXF(L([30, 30], [210, 120]) + L([30, 120], [210, 30]) + exT([30, 30], 'A', -8, 0) + exT([210, 120], 'B', 8, 6) + exT([30, 120], 'C', -8, 6) + exT([210, 30], 'D', 8, 0) + exT([120, 75], 'O', 0, -8), 46),
          steps: ['兩條直線相交，相對的兩個角'],
          ans: '對頂角相等'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '例 1：要證的角在哪兩個三角形裡，就證那兩個全等',
        points: [
          '已知 \\(AB=AC\\)、\\(AD\\perp BC\\)；求證 \\(\\angle B=\\angle C\\)。',
          '含 \\(\\angle B\\)、\\(\\angle C\\) 的兩個三角形：\\(\\triangle ABD\\)、\\(\\triangle ACD\\)。',
          '斜邊 \\(AB=AC\\)、股 \\(AD\\) 公用、直角 → RHS 全等 → 對應角相等。'
        ],
        formula: { label: '等腰三角形的兩底角相等<span class="pgref">課本 印 140 例 1</span>', tex: '\\triangle ABD\\cong\\triangle ACD\\;(RHS)' },
        visual: (h) => {
          const A = [110, 30], B = [20, 196], Cc = [200, 196], D = [110, 196];
          const base = (sh) => (sh ? PG([A, B, D], { fill: 'rgba(37,99,235,.12)', stroke: 'none' }) + PG([A, D, Cc], { fill: 'rgba(217,119,6,.12)', stroke: 'none' }) : '')
            + PG([A, B, Cc]) + L(A, D, INK, 2.2) + RA(D, Cc, A, 11) + TK(A, B, 1) + TK(A, Cc, 1)
            + NM(A, 'A', 0, -8) + NM(B, 'B', -8, 18) + NM(Cc, 'C', 8, 18) + NM(D, 'D', 0, 22);
          const lines = (n) => [['在 △ABD 與 △ACD 中，', INK], ['∵ AB ＝ AC（已知）', INK], ['　 AD ＝ AD（公用邊）', INK], ['　 ∠ADB ＝ ∠ADC ＝ 90°', INK], ['∴ △ABD ' + CG + ' △ACD（RHS）', BLU], ['故 ∠B ＝ ∠C（對應角相等）', GRN]]
            .slice(0, n).map(([t, c], i) => TX(222, 44 + i * 36, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '先看圖：已知 AB ＝ AC（記號）、AD 垂直 BC（直角）。', d: () => SECBG + base(false) },
            { t: '∠B、∠C 分別在 △ABD、△ACD 裡——就證這兩個全等。', d: () => SECBG + base(true) + lines(1) },
            { t: '湊三個條件，每一個附理由。', d: () => SECBG + base(true) + lines(4) },
            { t: '直角三角形、斜邊與一股 → RHS；最後寫求證。', d: () => SECBG + base(true) + lines(6) }
          ], { acc: false });
        },
        caption: '找三角形的方法：<b>要證的東西在哪兩個三角形裡</b>，就證那兩個全等。',
        example: {
          q: '\\(AB=AC\\)，\\(D\\) 是 \\(BC\\) 中點，要證 \\(\\angle BAD=\\angle CAD\\)，用哪一個全等性質？' +
            EXF(PG([[120, 14], [40, 130], [200, 130]]) + L([120, 14], [120, 130], BLU, 2) + TK([40, 130], [120, 130], 2, AMB) + TK([120, 130], [200, 130], 2, AMB)
              + exT([120, 14], 'A', 0, -2) + exT([40, 130], 'B', -8, 12) + exT([200, 130], 'C', 8, 12) + exT([120, 130], 'D', 0, 15), 46, 152),
          steps: ['\\(AB=AC\\)（已知）、\\(BD=CD\\)（中點）、\\(AD=AD\\)（公用邊）'],
          ans: 'SSS'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '全等證明的最短鏈：兩個三角形、三個條件、一個結論',
        points: [
          '要證 \\(AE=CG\\)：找出以 \\(AE\\)、\\(CG\\) 為邊的兩個三角形。',
          '\\(AD=CD\\)、\\(DE=DG\\)（正方形四邊等長），夾角都是 \\(90^\\circ\\)。',
          'SAS 全等 → 故 \\(AE=CG\\)（對應邊相等）。'
        ],
        formula: { label: '全等三角形的應用<span class="pgref">課本 印 141 例 2</span>', tex: '\\triangle ADE\\cong\\triangle CDG\\;(SAS)' },
        visual: (h) => {
          const A = [60, 40], D = [160, 40], Cc = [160, 140], B = [60, 140], G = [310, 40], F = [310, 190], E = [160, 190];
          const sq = PG([A, D, Cc, B], { stroke: GREY, sw: 2 }) + PG([D, G, F, E], { stroke: GREY, sw: 2 })
            + NM(A, 'A', -8, -6) + NM(D, 'D', 0, -10) + NM(Cc, 'C', 12, 4) + NM(B, 'B', -10, 8) + NM(G, 'G', 10, -6) + NM(F, 'F', 10, 12) + NM(E, 'E', -10, 14);
          const tri = PG([A, D, E], { fill: 'rgba(37,99,235,.13)', stroke: BLU, sw: 2.2 }) + PG([Cc, D, G], { fill: 'rgba(217,119,6,.13)', stroke: AMB, sw: 2.2 });
          const marks = TK(A, D, 1) + TK(D, Cc, 1) + TK(D, E, 2, VIO) + TK(D, G, 2, VIO) + RA(D, A, E, 12, BLU) + RA(D, G, Cc, 18, AMB);
          SV.stepper(h, SECVB, [
            { t: '兩個正方形共用頂點 D。', d: () => SECBG + sq },
            { t: '要證的兩條線：AE 和 CG。', d: () => SECBG + sq + L(A, E, RED, 3.4) + L(Cc, G, RED, 3.4) },
            { t: '以它們為邊的兩個三角形：△ADE、△CDG。', d: () => SECBG + tri + sq + L(A, E, RED, 3.4) + L(Cc, G, RED, 3.4) },
            { t: '三個條件：AD＝CD、DE＝DG、夾角都是 90°。', d: () => SECBG + tri + sq + marks + L(A, E, RED, 3.4) + L(Cc, G, RED, 3.4) },
            { t: 'SAS 全等 → 對應邊 AE ＝ CG。', d: () => SECBG + tri + sq + marks + L(A, E, RED, 3.4) + L(Cc, G, RED, 3.4)
                + BOX(40, 226, 360, 44, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2 })
                + TX(220, 254, '△ADE ' + CG + ' △CDG（SAS）　故 AE ＝ CG', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '鏈條只有四環：<b>兩個三角形 → 三個條件 → 全等性質 → 對應結論</b>。',
        example: {
          q: '要證 \\(\\triangle ADE\\cong\\triangle CDG\\)（SAS），三個條件是哪三個？',
          steps: ['兩組邊：\\(AD=CD\\)、\\(DE=DG\\)', '夾角：\\(\\angle ADE=\\angle CDG=90^\\circ\\)'],
          ans: '邊、角、邊（角要夾在兩邊中間）'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '兩段式：先證一組全等，再拿它的結論當條件',
        points: [
          '① 先用 SSS 證 \\(\\triangle ABC\\cong\\triangle ABD\\)，得 \\(\\angle ABC=\\angle ABD\\)。',
          '② 再用 ① 的結果當條件：SAS 證 \\(\\triangle EBC\\cong\\triangle EBD\\)。',
          '第二段的理由可以寫「<b>由 ① 可知</b>」——前面證過的就是收據。'
        ],
        formula: { label: '全等證明<span class="pgref">課本 印 142 例 3</span>', tex: '\\text{①}\\,SSS\\;\\Rightarrow\\;\\angle ABC=\\angle ABD\\;\\Rightarrow\\;\\text{②}\\,SAS' },
        visual: (h) => {
          const A = [30, 136], B = [290, 136], Cc = [190, 46], D = [190, 226], E = [110, 136];
          const base = PG([A, Cc, B, D], { stroke: INK }) + L(A, B, INK, 2.2)
            + TK(A, Cc, 1) + TK(A, D, 1) + TK(B, Cc, 2, AMB) + TK(B, D, 2, AMB)
            + NM(A, 'A', -12, 6) + NM(B, 'B', 12, 6) + NM(Cc, 'C', 0, -8) + NM(D, 'D', 0, 20) + PT(E) + NM(E, 'E', -4, 20);
          const note = (lines) => lines.map(([t, c], i) => TX(306, 60 + i * 30, t, { fs: 14, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '已知：AC ＝ AD、BC ＝ BD，E 在 AB 上。', d: () => SECBG + base },
            { t: '① 先證 △ABC ≅ △ABD（SSS）。', d: () => SECBG + PG([A, B, Cc], { fill: 'rgba(37,99,235,.12)', stroke: 'none' }) + PG([A, B, D], { fill: 'rgba(37,99,235,.12)', stroke: 'none' }) + base
                + note([['① SSS', BLU], ['AC＝AD', INK], ['BC＝BD', INK], ['AB 公用', INK], ['→ ∠ABC＝∠ABD', BLU]]) + AN(B, A, Cc, 30, BLU) + AN(B, D, A, 30, BLU) },
            { t: '② 拿 ① 的角當條件，證 △EBC ≅ △EBD（SAS）。', d: () => SECBG + PG([E, B, Cc], { fill: 'rgba(217,119,6,.14)', stroke: 'none' }) + PG([E, B, D], { fill: 'rgba(217,119,6,.14)', stroke: 'none' }) + base
                + L(E, Cc, AMB, 2.6) + L(E, D, AMB, 2.6) + AN(B, A, Cc, 30, BLU) + AN(B, D, A, 30, BLU)
                + note([['② SAS', AMB], ['BC＝BD', INK], ['∠ABC＝∠ABD', INK], ['（由 ① 可知）', BLU], ['EB 公用', INK], ['→ EC＝ED', GRN]]) }
          ], { acc: false });
        },
        caption: '習作基礎 2 就是這種兩段式：<b>第一段全班一起，第二段兩人一組</b>。',
        example: {
          q: '第②段為什麼可以用 \\(\\angle ABC=\\angle ABD\\)？',
          steps: ['它在第①段已經證過了'],
          ans: '理由寫「由 ① 可知」'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '平行四邊形：平行線給你一組相等的角',
        points: [
          '\\(AD\\parallel BC\\)，所以 \\(\\angle 2=\\angle 3\\)（內錯角相等）。',
          '\\(BE\\) 平分 \\(\\angle ABC\\)，所以 \\(\\angle 1=\\angle 2\\)。',
          '\\(\\angle 1=\\angle 3\\)：\\(\\triangle ABE\\) 兩底角相等 → \\(AB=AE\\)。'
        ],
        formula: { label: '平行四邊形的應用<span class="pgref">課本 印 144 例 4</span>', tex: '\\angle1=\\angle2=\\angle3\\;\\Rightarrow\\;AB=AE' },
        visual: (h) => {
          const A = [130, 50], D = [400, 50], B = [50, 210], Cc = [320, 210];
          const E = V.add(A, V.mul(V.unit(A, D), V.len(A, B)));
          const base = PG([A, D, Cc, B]) + L(B, E, INK, 2.4) + NM(A, 'A', -6, -10) + NM(D, 'D', 8, -10) + NM(B, 'B', -10, 12) + NM(Cc, 'C', 10, 12) + NM(E, 'E', 0, -10);
          const par = L(A, D, BLU, 3.4) + L(B, Cc, BLU, 3.4);
          const a23 = AN(B, Cc, E, 34, AMB, '2') + AN(E, B, A, 26, AMB, '3');
          const a1 = AN(B, E, A, 26, VIO, '1');
          SV.stepper(h, SECVB, [
            { t: '平行四邊形 ABCD，BE 平分 ∠ABC。', d: () => SECBG + base },
            { t: 'AD ∥ BC：∠2 和 ∠3 是內錯角，相等。', d: () => SECBG + par + base + a23 + TX(220, 250, '∠2 ＝ ∠3（內錯角相等）', { anchor: 'middle', fs: 16, c: AMB }) },
            { t: 'BE 平分 ∠ABC：∠1 ＝ ∠2。', d: () => SECBG + par + base + a23 + a1 + TX(220, 250, '∠1 ＝ ∠2（BE 平分 ∠ABC）', { anchor: 'middle', fs: 16, c: VIO }) },
            { t: '∠1 ＝ ∠3：△ABE 兩底角相等 → AB ＝ AE。', d: () => SECBG + PG([A, B, E], { fill: 'rgba(5,150,105,.12)', stroke: 'none' }) + par + base + a23 + a1
                + L(A, B, GRN, 3.4) + L(A, E, GRN, 3.4) + TX(220, 250, '∠1 ＝ ∠3　故 AB ＝ AE', { anchor: 'middle', fs: 16, c: GRN }) }
          ], { acc: false });
        },
        caption: '看到平行四邊形，先在圖上找出<b>那個 Z 字</b>——內錯角就在 Z 的兩個轉角。',
        example: {
          q: '\\(AD\\parallel BC\\)，\\(\\angle EBC=35^\\circ\\)，\\(\\angle AEB=\\)？' +
            EXF(L([60, 24], [220, 24], BLU, 2.4) + L([20, 128], [180, 128], BLU, 2.4) + L([20, 128], [150, 24]) + exT([60, 24], 'A', -6, -4) + exT([220, 24], 'D', 6, -4)
              + exT([20, 128], 'B', -6, 14) + exT([180, 128], 'C', 6, 14) + exT([150, 24], 'E', 0, -4) + AN([20, 128], [180, 128], [150, 24], 26, AMB, '35°', { lr: 18, fs: 12 }), 50, 146),
          steps: ['\\(\\angle AEB\\) 和 \\(\\angle EBC\\) 是內錯角'],
          ans: '\\(35^\\circ\\)'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '相似也要證：找兩組相等的角（行有餘力）',
        points: [
          '正三角形給你一組：\\(\\angle A=\\angle B=60^\\circ\\)。',
          '另一組靠「三角形內角和」與「平角」都是 \\(180^\\circ\\)：\\(\\angle 1=\\angle 2\\)。',
          '兩組角相等 → AA 相似。這一頁是<b>行有餘力</b>的。'
        ],
        formula: { label: '相似形的應用<span class="pgref">課本 印 145 例 5</span>', tex: '\\triangle ADE\\sim\\triangle BCD\\;(AA)' },
        visual: (h) => {
          const A = [26, 240], B = [246, 240], Cc = [136, 240 - 220 * Math.sqrt(3) / 2], D = [176, 240];

          const rot = (v, deg) => { const t = deg * Math.PI / 180; return [v[0] * Math.cos(t) - v[1] * Math.sin(t), v[0] * Math.sin(t) + v[1] * Math.cos(t)]; };
          const dc = V.sub(Cc, D);
          let E = xline(D, V.add(D, rot(dc, -60)), A, Cc);
          if (E[0] < A[0] || E[0] > Cc[0]) E = xline(D, V.add(D, rot(dc, 60)), A, Cc);
          const base = PG([A, B, Cc]) + L(D, Cc, INK, 2.2) + L(D, E, INK, 2.2)
            + NM(A, 'A', -10, 10) + NM(B, 'B', 10, 10) + NM(Cc, 'C', 0, -8) + NM(D, 'D', 0, 20) + NM(E, 'E', -12, 0);
          const t = (lines) => lines.map(([s, c], i) => TX(266, 60 + i * 30, s, { fs: 14, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '正三角形：∠A ＝ ∠B ＝ 60°，又 ∠CDE ＝ 60°。', d: () => SECBG + base + AN(A, B, Cc, 24, BLU, '60°', { lr: 16, fs: 12 }) + AN(B, Cc, A, 24, BLU, '60°', { lr: 16, fs: 12 })
                + AN(D, E, Cc, 22, AMB, '60°', { lr: 14, fs: 12 }) + t([['∠A ＝ ∠B ＝ 60°', BLU]]) },
            { t: 'D 點上三個角排成一直線（平角 180°）。', d: () => SECBG + base + AN(A, B, Cc, 24, BLU) + AN(B, Cc, A, 24, BLU) + AN(D, A, E, 30, VIO, '1') + AN(D, Cc, B, 30, GRN, '3') + AN(D, E, Cc, 22, AMB)
                + t([['∠A ＝ ∠B ＝ 60°', BLU], ['∠1 ＋ 60° ＋ ∠3', INK], ['　＝ 180°', INK], ['→ ∠1 ＋ ∠3 ＝ 120°', VIO]]) },
            { t: '△BCD 內角和：∠2 ＋ ∠3 ＝ 120°，所以 ∠1 ＝ ∠2。', d: () => SECBG + base + AN(D, A, E, 30, VIO, '1') + AN(D, Cc, B, 30, GRN, '3') + AN(Cc, D, B, 30, VIO, '2')
                + t([['∠1 ＋ ∠3 ＝ 120°', VIO], ['∠2 ＋ ∠3 ＝ 120°', VIO], ['→ ∠1 ＝ ∠2', VIO], ['', INK], ['兩組角相等', GRN], ['△ADE ∼ △BCD', GRN], ['（AA 相似）', GRN]]) }
          ], { acc: false });
        },
        caption: '例 5 和課本隨堂印 145 都是 AA 相似，<b>難在找第二組角</b>——這兩題行有餘力。',
        example: {
          q: 'AA 相似要找幾組角相等？',
          steps: ['兩組就夠，第三組會自動相等（內角和 \\(180^\\circ\\)）'],
          ans: '兩組'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '輔助線：畫它，是為了造出兩個三角形',
        points: [
          '等腰三角形對摺，摺痕 \\(AD\\) 把它分成兩個全等三角形——\\(AD\\) 就是<span class="k">輔助線</span>。',
          '輔助線用<b>虛線</b>畫，是題目沒有、自己加的線。',
          '畫之前先問：<b>它會造出哪兩個三角形、哪一條公用邊？</b>'
        ],
        formula: { label: '輔助線<span class="pgref">課本 印 146、147 例 6</span>', tex: '\\text{連接 }CE\\;\\Rightarrow\\;\\triangle CDE\\cong\\triangle CBE\\;(SSS)' },
        visual: (h) => {
          const A = [108, 40], B = [18, 210], Cc = [198, 210], D = [108, 210];
          const iso = PG([A, B, Cc]) + TK(A, B, 1) + TK(A, Cc, 1) + NM(A, 'A', 0, -8) + NM(B, 'B', -8, 18) + NM(Cc, 'C', 8, 18);
          const Dq = [250, 46], Cq = [420, 46], Aq = [250, 216], Bq = [420, 216], E = V.lerp(Aq, Cq, 0.55);
          const sq = PG([Dq, Cq, Bq, Aq]) + L(Dq, E, INK, 2.2) + L(Bq, E, INK, 2.2) + TK(Dq, E, 2, VIO) + TK(Bq, E, 2, VIO)
            + NM(Dq, 'D', -10, -4) + NM(Cq, 'C', 10, -4) + NM(Aq, 'A', -10, 14) + NM(Bq, 'B', 10, 14) + NM(E, 'E', -12, 4)
            + AN(Dq, Cq, E, 26, BLU, '1') + AN(Bq, E, Cq, 26, BLU, '2');
          SV.stepper(h, SECVB, [
            { t: '等腰三角形 ABC：怎麼證兩底角相等？', d: () => SECBG + iso },
            { t: '對摺讓 B、C 疊在一起：摺痕 AD 就是輔助線（虛線）。', d: () => SECBG + PG([A, B, D], { fill: 'rgba(37,99,235,.12)', stroke: 'none' }) + PG([A, D, Cc], { fill: 'rgba(37,99,235,.12)', stroke: 'none' }) + iso
                + L(A, D, RED, 2.6, '7 5') + NM(D, 'D', 0, 22) + TX(108, 266, '它造出兩個全等三角形', { anchor: 'middle', fs: 14, c: RED }) },
            { t: '例 6：正方形裡 DE ＝ BE，要證 ∠1 ＝ ∠2。', d: () => SECBG + iso + L(A, D, RED, 2.6, '7 5') + NM(D, 'D', 0, 22) + sq },
            { t: '連 CE（虛線）：DC＝BC、DE＝BE、CE 公用 → SSS。', d: () => SECBG + iso + L(A, D, RED, 2.6, '7 5') + NM(D, 'D', 0, 22)
                + PG([Dq, Cq, E], { fill: 'rgba(217,119,6,.14)', stroke: 'none' }) + PG([Bq, Cq, E], { fill: 'rgba(217,119,6,.14)', stroke: 'none' }) + sq + L(Cq, E, RED, 2.6, '7 5')
                + TX(335, 266, '△CDE ' + CG + ' △CBE → ∠1 ＝ ∠2', { anchor: 'middle', fs: 14, c: GRN }) }
          ], { acc: false });
        },
        caption: '例 6 的隨堂換一條輔助線（連 \\(BD\\)）也證得出來：<b>輔助線不只一種</b>。',
        example: {
          q: '等腰三角形 \\(AB=AC\\)，要證 \\(\\angle B=\\angle C\\)，輔助線畫哪一條？' +
            EXF(PG([[120, 14], [40, 130], [200, 130]]) + exT([120, 14], 'A', 0, -2) + exT([40, 130], 'B', -8, 12) + exT([200, 130], 'C', 8, 12), 44, 150),
          steps: ['從 \\(A\\) 畫到 \\(BC\\) 的高（對稱軸）'],
          ans: '\\(BC\\) 上的高 \\(AD\\)'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '舉例不等於證明；一個反例就能推翻',
        points: [
          '\\(1^2,\\ 3^2,\\ 5^2\\) 都是奇數，只能<b>猜</b>「奇數的平方是奇數」，還不算證明。',
          '奇數有無限多個，舉再多例子也舉不完。',
          '反過來：「所有質數都是奇數」——找到一個 \\(2\\)，就推翻了。'
        ],
        formula: { label: '舉例與證明<span class="pgref">課本 印 148</span>', tex: '\\text{很多例子}\\ne\\text{證明}\\qquad\\text{一個反例}\\Rightarrow\\text{推翻}' },
        visual: (h) => {
          SV.stepper(h, SECVB, [
            { t: '舉三個例子：都對。', d: () => SECBG + TX(220, 40, '奇數的平方是奇數？', { anchor: 'middle', fs: 18, c: INK })
                + ['1² ＝ 1', '3² ＝ 9', '5² ＝ 25'].map((t, i) => BOX(40 + i * 128, 70, 112, 56, { r: 12, fill: '#fff', stroke: BLU, sw: 2 }) + TX(96 + i * 128, 105, t, { anchor: 'middle', fs: 19, c: BLU })).join('')
                + TX(220, 170, '三個都是奇數 → 只能說「猜對了」', { anchor: 'middle', fs: 16, c: GREY }) },
            { t: '可是奇數有無限多個——舉不完。', d: () => SECBG + TX(220, 40, '舉例只能「支持猜測」', { anchor: 'middle', fs: 18, c: INK })
                + TX(220, 110, '1, 3, 5, 7, 9, 11, …, 2025, …', { anchor: 'middle', fs: 20, c: BLU })
                + TX(220, 160, '永遠舉不完，所以要用一般的式子證明', { anchor: 'middle', fs: 16, c: GREY })
                + TX(220, 200, '（下一頁：奇數寫成 2k ＋ 1）', { anchor: 'middle', fs: 14, c: GREY }) },
            { t: '反例一個就夠：推翻「所有……」。', d: () => SECBG + TX(220, 40, '所有質數都是奇數？', { anchor: 'middle', fs: 18, c: INK })
                + BOX(150, 70, 140, 80, { r: 14, fill: '#fdeef2', stroke: RED, sw: 2.4 }) + TX(220, 125, '2', { anchor: 'middle', fs: 44, c: RED })
                + TX(220, 190, '2 是質數，但不是奇數', { anchor: 'middle', fs: 17, c: RED })
                + TX(220, 222, '一個反例 → 這句話就錯了', { anchor: 'middle', fs: 16, c: INK }) }
          ], { acc: false });
        },
        caption: '課本漫畫裡傑克舉了 \\(2+3\\)、\\(4+17\\) 兩個例子——<b>兩個例子不算證明</b>，要寫成一般的式子。',
        example: {
          q: '「兩個奇數相加是奇數」對嗎？',
          steps: ['試一個：\\(1+3=4\\)'],
          ans: '不對，\\(1+3=4\\) 就是反例'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '偶數寫成 2k，奇數寫成 2k＋1',
        points: [
          '偶數是 \\(2\\) 的倍數：\\(22=2\\times11\\)，寫成 \\(2k\\)。',
          '奇數除以 \\(2\\) 餘 \\(1\\)：\\(19=2\\times9+1\\)，寫成 \\(2k+1\\)。',
          '⚠ 一定要寫「\\(k\\) <b>是整數</b>」——少了這半句，證明就不完整。'
        ],
        formula: { label: '偶數與奇數的表示<span class="pgref">課本 印 148、149</span>', tex: '\\text{偶數}=2k,\\quad\\text{奇數}=2k+1\\quad(k\\text{ 是整數})' },
        visual: (h) => {
          const L0 = [6, 7, 12, 13, 22, 19, -6, -7];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl"><label>這個數：<span class="ival nv">6</span></label>
              <input type="range" class="ns" min="0" max="${L0.length - 1}" step="1" value="0"></div></div>`;
          const draw = () => {
            const n = L0[+h.querySelector('.ns').value], odd = Math.abs(n % 2) === 1, k = Math.floor(n / 2);
            h.querySelector('.nv').textContent = n < 0 ? '−' + (-n) : n;
            const nn = (v) => (v < 0 ? '(−' + (-v) + ')' : '' + v);
            let s = TX(220, 40, `${n < 0 ? '−' + (-n) : n} ＝ 2 × ${nn(k)}${odd ? ' ＋ 1' : ''}`, { anchor: 'middle', fs: 26, c: odd ? AMB : BLU });
            if (n > 0) {
              const pairs = Math.floor(n / 2);
              for (let i = 0; i < pairs; i++) {
                const x = 220 - pairs * 15 + i * 30;
                s += `<circle cx="${x + 15}" cy="96" r="9" fill="${BLU}" opacity=".75"/><circle cx="${x + 15}" cy="122" r="9" fill="${BLU}" opacity=".75"/>`;
              }
              if (odd) s += `<circle cx="${220 + pairs * 15 + 18}" cy="96" r="9" fill="${RED}"/>` + TX(220 + pairs * 15 + 18, 150, '剩 1', { anchor: 'middle', fs: 13, c: RED });
              s += TX(220, 180, '兩個兩個一組，' + (odd ? '剩一個' : '剛好分完'), { anchor: 'middle', fs: 15, c: GREY });
            } else s += TX(220, 120, '負數也一樣：' + (odd ? `2 × (−${-k}) ＋ 1` : `2 × (−${-k})`), { anchor: 'middle', fs: 17, c: GREY });
            s += BOX(90, 200, 260, 48, { r: 12, fill: odd ? 'rgba(217,119,6,.10)' : 'rgba(37,99,235,.08)', stroke: odd ? AMB : BLU, sw: 2 });
            s += TX(220, 231, odd ? `奇數：2k ＋ 1，k ＝ ${k < 0 ? '−' + (-k) : k}` : `偶數：2k，k ＝ ${k < 0 ? '−' + (-k) : k}`, { anchor: 'middle', fs: 17, c: odd ? AMB : BLU });
            h.querySelector('.fig').innerHTML = svg('0 0 440 262', s);
          };
          h.querySelector('.ns').oninput = draw;
          draw();
        },
        caption: '「兩個兩個一組，剩不剩一個」——剩一個就是奇數。',
        example: {
          q: '\\(m\\) 是整數，\\(2m+8\\) 是奇數還是偶數？',
          steps: ['\\(2m+8=2(m+4)\\)', '\\(m+4\\) 是整數'],
          ans: '偶數'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '代數證明：整理成「2 ×（整數）＋1」',
        points: [
          '先設：\\(a=2n+1\\)，\\(n\\) 是整數。',
          '\\(a^2=(2n+1)^2=4n^2+4n+1=2(2n^2+2n)+1\\)。',
          '\\(2n^2+2n\\) 是整數，所以 \\(a^2\\) 是奇數——<b>最後一句要回扣</b>。'
        ],
        formula: { label: '奇偶數的判別<span class="pgref">課本 印 150 例 7</span>', tex: 'a^2=2(2n^2+2n)+1' },
        visual: (h) => {
          const ln = (y, t, c, k, fs) => TX(60, y, t, { fs: fs || 18, c, op: k });
          SV.stepper(h, '0 0 440 280', [
            { t: '已知、求證先寫好。', d: k => ln(34, '已知：a 是奇數　　求證：a² 是奇數', INK, 1, 16) },
            { t: '第一步：設 a ＝ 2n ＋ 1，而且寫出 n 是整數。', d: k => ln(76, '設 a ＝ 2n ＋ 1，n 是整數', BLU, k) },
            { t: '平方、展開（不要漏中間那一項）。', d: k => ln(116, 'a² ＝ (2n ＋ 1)²', INK, k) + ln(150, '　 ＝ 4n² ＋ 4n ＋ 1', INK, k) },
            { t: '整理成 2 ×（ ）＋ 1 的樣子。', d: k => BOX(80, 162, 250, 34, { r: 10, fill: 'rgba(217,119,6,.10)', stroke: AMB, sw: 2, op: k }) + ln(186, '　 ＝ 2(2n² ＋ 2n) ＋ 1', AMB, k) },
            { t: '回扣：括號裡是整數 → a² 是奇數。', d: k => ln(232, '∵ 2n² ＋ 2n 是整數　∴ a² 是奇數', GRN, k, 17) }
          ]);
        },
        caption: '三個常錯：設 \\(2a+1\\) 沒說 \\(a\\) 是整數、展開漏項、最後沒寫「所以是奇數」。',
        example: {
          q: '證明：偶數＋奇數＝奇數。第一步怎麼設？',
          steps: ['偶數 \\(2m\\)、奇數 \\(2n+1\\)，\\(m\\)、\\(n\\) 是整數', '相加 \\(=2(m+n)+1\\)'],
          ans: '是奇數（\\(m+n\\) 是整數）'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '比大小、因倍數：把相減改成相乘（行有餘力）',
        points: [
          '比大小：\\(a^2-b^2=(a+b)(a-b)\\)，看兩個括號的正負。',
          '\\(a,b\\) 都是正數、\\(a>b\\)：兩個括號都正 → \\(a^2>b^2\\)。',
          '因倍數：整理成「\\((c+b)\\times(c-b)\\)」或「\\(100\\times\\)整數」，倍數就看得出來。'
        ],
        formula: { label: '判別大小、因數的判別<span class="pgref">課本 印 151 例 8、印 152 例 9</span>', tex: 'a^2-b^2=(a+b)(a-b)' },
        visual: (h) => {
          const ln = (y, t, c, k, fs) => TX(40, y, t, { fs: fs || 17, c, op: k });
          SV.stepper(h, '0 0 440 280', [
            { t: '例 8：a、b 是正數，a ＞ b，證 a² ＞ b²。', d: k => ln(34, '例 8　a、b 是正數，a ＞ b', INK, 1) },
            { t: '平方差：相減改成相乘，看正負。', d: k => ln(72, 'a² − b² ＝ (a ＋ b)(a − b)', BLU, k) + ln(104, '　　　　　　正　 ×　 正　＝ 正', GRN, k, 15) + ln(134, '所以 a² − b² ＞ 0，即 a² ＞ b²', GRN, k, 16) },
            { t: '例 9：直角三角形 a² ＋ b² ＝ c²，證 (c ＋ b) 是 a² 的因數。', d: k => ln(184, '例 9　a² ＝ c² − b² ＝ (c ＋ b)(c − b)', INK, k) },
            { t: '寫成兩個整數相乘：(c ＋ b) 就是 a² 的因數。', d: k => ln(222, '(c ＋ b)、(c − b) 都是正整數', INK, k, 16) + ln(256, '∴ (c ＋ b) 是 a² 的因數', GRN, k, 16) }
          ]);
        },
        caption: '兩題的關鍵都是<b>平方差公式</b>（八上 1-1）。這一頁和課本隨堂印 151、152 是行有餘力的。',
        example: {
          q: '\\(a=5,\\ b=3\\)，驗算 \\(a^2-b^2=(a+b)(a-b)\\)。',
          steps: ['左：\\(25-9=16\\)', '右：\\(8\\times2=16\\)'],
          ans: '兩邊相等'
        }
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '回頭看：四種證明，兩個動作',
        points: [
          '幾何證明、兩段式、輔助線、代數證明——<b>格式都一樣</b>：已知、求證、證明。',
          '它們<b>不是四套方法</b>，是同一件事：從已知一步一步走到求證。',
          '卡住的時候回到原點：<b>這一步的收據是什麼？</b>'
        ],
        formula: { label: '全部回到這兩件事<span class="pgref">課本 印 153 重點回顧</span>', tex: '\\text{已知}\\;\\to\\;\\text{證明}\\;\\to\\;\\text{求證}' },
        visual: (h) => {
          const CARD = [
            ['全等證明', '兩個三角形、三個條件', BLU],
            ['兩段式證明', '前一段的結論當收據', VIO],
            ['輔助線', '造出兩個三角形', AMB],
            ['代數證明', '整理成 2k 或 2k＋1', GRN]
          ];
          SV.stepper(h, SECVB, [
            { t: '課本重點回顧列了這<b>四種</b>。', d: () => SECBG + TX(14, 34, '課本 印 153 重點回顧', { fs: 15, c: GREY }) + secCards(CARD, false, -1) },
            { t: '每一種要做的事，其實都一樣。', d: () => SECBG + TX(14, 34, '四種證明，同一個格式', { fs: 15, c: GREY }) + secCards(CARD, true, 0) },
            { t: '所以整節只有<b>兩個動作</b>。', d: () => SECBG + TX(220, 34, '整節只有兩個動作', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 先圈出已知、求證', '求證是終點，寫到它才停', GRN],
                    ['② 每一步配一個理由', '沒有收據的結論不能用', BLU]
                  ], ['卡住就問：這一步的收據是什麼？']) }
          ], { acc: false });
        },
        caption: '四種證明<b>只是長相不同</b>，要做的都是同一件事。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>理由、求證、舉例</b>。',
          '第二個最嚴重：拿要證的東西當條件，等於什麼都沒證。',
          '每寫一行都問自己：<b>這一行的收據是什麼？</b>'
        ],
        formula: { label: '動筆前先問<span class="pgref">課本 印 153 重點回顧</span>', tex: '\\text{這一步的理由是什麼？}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '看起來像就當理由', bad: '兩條線畫得差不多長<br>就寫 \\(AB=CD\\)', good: '題目有給？圖上有記號？<br>還是由哪個性質推出？' },
            { tag: '把求證當已知', bad: '要證 \\(AD=AE\\)<br>第一行就寫 \\(AD=AE\\)', good: '求證是終點<br>寫到最後一行才出現' },
            { tag: '舉例當證明', bad: '\\(1^2,3^2,5^2\\) 都是奇數<br>所以奇數平方是奇數', good: '設 \\(a=2n+1\\)（\\(n\\) 是整數）<br>整理成 \\(2(\\cdots)+1\\)' }
          ]);
          MJ(h);
        },
        caption: '寫完回頭檢查：<b>每一行括號裡都有東西</b>，才算寫完。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜課本隨堂（幾何證明）',
        points: [
          '三題都是全等證明：先圈已知、求證，再找兩個三角形。',
          '印 140 是例 1 反過來：已知角相等，證邊相等。',
          '印 143 分兩段：① 證全等，② 再用 ① 的結果。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 140–143</span>', tex: '\\triangle ABD\\cong\\triangle ACD' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '課本', page: '印 140–143', sub: '填空式證明：每一行先猜理由', tags: ['課P140', '課P141', '課P143'] }
          ]);
        },
        caption: '點開題目，證明是<b>一行一行出現</b>的——每一行先猜理由，再按下一行。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜課本隨堂（平行四邊形、輔助線、相似）',
        points: [
          '印 144 用平行線的內錯角，跟例 4 同一招。',
          '印 147 換一條輔助線（連 \\(BD\\)），一樣造出兩個全等三角形。',
          '印 145 是 AA 相似，行有餘力。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 144–147</span>', tex: '\\angle1=\\angle2=\\angle3' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '課本', page: '印 144、147', sub: '平行線的角、輔助線', tags: ['課P144', '課P147'] },
            { src: '課本', page: '印 145', sub: 'AA 相似，行有餘力', tags: ['課P145'], level: '進階' }
          ]);
        },
        caption: '印 147 的輔助線：畫完先說出「它造出了哪兩個三角形」。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜課本隨堂（代數證明）',
        points: [
          '先把每個數寫成 \\(2\\times(\\ )\\) 或 \\(2\\times(\\ )+1\\)。',
          '印 150：設奇數 \\(2m+1\\)、偶數 \\(2n\\)，\\(m,n\\) 是整數。',
          '印 151、152 用平方差，行有餘力。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 149–152</span>', tex: '\\text{偶數}=2k,\\quad\\text{奇數}=2k+1' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '課本', page: '印 149、150', sub: '奇數、偶數', tags: ['課P149 第1題', '課P149 第2題', '課P150'] },
            { src: '課本', page: '印 151、152', sub: '比大小、因倍數，行有餘力', tags: ['課P151', '課P152'], level: '進階' }
          ]);
        },
        caption: '最後一句一定要回扣：「所以是奇數／偶數」。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜習作暖身題',
        points: [
          '暖身 1：找出兩個三角形全等的理由。',
          '暖身 2：把式子寫成 \\(2\\times(\\ )\\) 或 \\(2\\times(\\ )+1\\)。',
          '兩題都只要選，不必寫整段證明。'
        ],
        formula: { label: '暖身重點', tex: '\\text{偶數}=2k,\\quad\\text{奇數}=2k+1' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '習作', page: '印 42', sub: '暖身題，課堂一起做', tags: ['暖身1', '暖身2 ⑴', '暖身2 ⑵'] }
          ]);
        },
        caption: '暖身題點開有逐行詳解——<b>先自己選，再點開對</b>。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜習作基礎（1～3）',
        points: [
          '基礎 1：角平分線＋平行線，推出等腰三角形。',
          '基礎 2 是<b>兩段式</b>：第一段全班一起，第二段兩人一組。',
          '基礎 3：理由從詞庫挑（已知、對頂角、平行四邊形對角線互相平分）。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 140–144</span>', tex: '\\text{兩個三角形}\\to\\text{三個條件}\\to\\text{全等}' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '習作', page: '印 43、44', sub: '基礎題，今天寫完', tags: ['基礎1', '基礎2', '基礎3'] }
          ]);
        },
        caption: '基礎 1 的答案是周長 \\(12\\)：關鍵是先看出 \\(BD=DE\\)。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜習作基礎（4～7）',
        points: [
          '基礎 4、5 <b>老師帶著做</b>：相似鏈、輔助線加角度整理。',
          '基礎 6 是最適合自己完成的代數證明：\\(A=2a+1\\)。',
          '基礎 7 老師給骨架，你補「\\(b-a\\lt 0\\)、\\(ab>0\\)」和結論。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 145–150</span>', tex: 'A=(a+1)^2-a^2=2a+1' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '習作', page: '印 44、45', sub: '老師帶著做', tags: ['基礎4', '基礎5'], level: '標準' },
            { src: '習作', page: '印 45', sub: '代數證明，自己寫', tags: ['基礎6'] },
            { src: '習作', page: '印 45', sub: '老師給骨架，補空格', tags: ['基礎7'], level: '標準' }
          ]);
        },
        caption: '基礎 5 只要先做一件事：<b>連 \\(AC\\)</b>，把四邊形切成兩個三角形。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '練習｜習作精熟（行有餘力）',
        points: [
          '精熟 1：兩個全等，ASA。',
          '精熟 2：要先畫輔助線 \\(AM\\)，用面積拆開。',
          '兩題都是行有餘力，做不完不影響過關。'
        ],
        formula: { label: '精熟重點', tex: '\\triangle ABF\\cong\\triangle ADE\\;(ASA)' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-1', [
            { src: '習作', page: '印 46', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '精熟 2 的輔助線是「連接 \\(AM\\)」——畫完先說它切出哪兩個三角形。'
      },

      {
        sec: '3-1', secName: '推理證明',
        title: '對答案｜習作 ①（暖身、基礎 1～3）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '證明題對的是<b>最後一句</b>；過程回前面的練習頁點題號看。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.answerKey(h, '3-1', [
            { label: '暖身（印 42）', cols: 3, items: [['暖 1', '暖身1'], ['暖 2 ⑴', '暖身2 ⑴'], ['暖 2 ⑵', '暖身2 ⑵']] },
            { label: '基礎 1～3（印 43、44）', cols: 2, items: [['1', '基礎1'], ['2', '基礎2'], ['3', '基礎3']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {
        sec: '3-1', secName: '推理證明',
        title: '對答案｜習作 ②（基礎 4～7、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '證明題對的是<b>最後一句</b>；過程回前面的練習頁點題號看。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.answerKey(h, '3-1', [
            { label: '基礎 4～7（印 44、45）', cols: 2, items: [['4', '基礎4'], ['5', '基礎5'], ['6', '基礎6'], ['7', '基礎7']] },
            { label: '精熟（印 46）', cols: 2, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '這一節只問一句話：你想跟誰一樣遠？',
        points: [
          '<b>是什麼</b>：三角形裡三條特別的線會交在同一點——那一點叫做「心」。',
          '<b>長什麼樣</b>：<span class="k">外心</span>、<span class="k">內心</span>、<span class="k">重心</span>，各是一種線的交點。',
          '<b>做什麼</b>：先認出是哪一種心，再用它的性質算長度、角度、面積。'
        ],
        formula: { label: '這一節的地圖<span class="pgref">課本 印 156–182</span>', tex: '\\text{外心}\\;\\cdot\\;\\text{內心}\\;\\cdot\\;\\text{重心}' },
        visual: (h) => {
          const row = (y, q, a, col) => BOX(20, y, 400, 58, { r: 12, fill: '#fff', stroke: col, sw: 2 })
            + TX(40, y + 36, q, { fs: 16, c: INK }) + TX(400, y + 37, a, { anchor: 'end', fs: 20, c: col });
          SV.stepper(h, SECVB, [
            { t: '三個心，問的是同一件事：<b>你想跟誰一樣遠？</b>',
              d: () => SECBG + row(24, '跟三個地點（頂點）一樣遠', '外心', BLU) + row(96, '跟三條路（邊）一樣遠', '內心', AMB)
                + row(168, '讓三角形紙板平衡', '重心', GRN) + TX(220, 262, '煙火施放點・噴水池・紙板平衡（課本三個情境）', { anchor: 'middle', fs: 14, c: GREY }) },
            { t: '每個心都是<b>三條線</b>的交點——先分清楚是哪三條線。',
              d: () => SECBG + row(24, '外心　＝　三邊的中垂線', '頂點', BLU) + row(96, '內心　＝　三個角的角平分線', '邊', AMB)
                + row(168, '重心　＝　三條中線', '平衡', GRN) + TX(220, 262, '口訣：外頂內邊', { anchor: 'middle', fs: 16, c: INK }) },
            { t: '整節只有兩件事。', d: k => SECBG + TX(220, 40, '整節只做兩件事', { anchor: 'middle', fs: 16, c: GREY })
                + TX(220, 120, '哪三條線？　跟誰等距？　在哪裡？', { anchor: 'middle', fs: 19, c: INK })
                + secActOne(['① 先分清楚三種線', '② 再用它的性質算'], k) }
          ], { acc: false });
        },
        caption: '課本的三個情境剛好排成一條：<b>日月潭煙火、公園噴水池、厚紙板平衡</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '先分清楚三種線：中垂線、角平分線、中線',
        points: [
          '<span class="k">中垂線</span>：通過一邊的中點，而且<b>垂直</b>那一邊——不一定經過頂點。',
          '<span class="k">角平分線</span>：從頂點出發，把角<b>分成一樣大的兩半</b>。',
          '<span class="k">中線</span>：從頂點連到<b>對邊中點</b>——不一定垂直。'
        ],
        formula: { label: '三種線<span class="pgref">課本 印 157、165、174</span>', tex: '\\text{中垂線}\\ne\\text{中線}' },
        visual: (h) => {
          const A = [150, 28], B = [36, 196], Cc = [330, 196], M = V.mid(B, Cc);
          const NAME = ['中垂線', '角平分線', '中線'];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl"><label><span class="ival lv">中垂線</span></label>
              <input type="range" class="ls" min="0" max="2" step="1" value="0"></div></div>`;
          const draw = () => {
            const i = +h.querySelector('.ls').value;
            h.querySelector('.lv').textContent = NAME[i];
            let s = PG([A, B, Cc]) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 8) + NM(Cc, 'C', 10, 8);
            let chk;
            if (i === 0) {
              s += L([M[0], 20], [M[0], 214], BLU, 2.8) + RA(M, Cc, [M[0], 20], 11, BLU) + TK(B, M, 1, BLU) + TK(M, Cc, 1, BLU) + PT(M, BLU) + NM(M, 'M', 12, 18, BLU, 13);
              chk = ['經過 BC 中點 ✓　垂直 BC ✓', '經過頂點 A？不一定（這張圖就沒有）'];
            } else if (i === 1) {
              const P = bisFoot(A, B, Cc);
              s += L(A, P, AMB, 2.8) + AN(A, B, P, 30, AMB) + AN(A, P, Cc, 36, AMB);
              chk = ['從頂點 A 出發 ✓', '∠A 分成一樣大的兩半 ✓'];
            } else {
              s += L(A, M, GRN, 2.8) + TK(B, M, 1, GRN) + TK(M, Cc, 1, GRN) + PT(M, GRN) + NM(M, 'M', 12, 18, GRN, 13);
              chk = ['從頂點 A 到對邊中點 M ✓', '垂直 BC？不一定（這張圖就沒有）'];
            }
            s += TX(220, 236, chk[0], { anchor: 'middle', fs: 15.5, c: [BLU, AMB, GRN][i] }) + TX(220, 262, chk[1], { anchor: 'middle', fs: 14.5, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', s);
          };
          h.querySelector('.ls').oninput = draw;
          draw();
        },
        caption: '中線和中垂線只差一個字，<b>差在「垂直」和「經過頂點」</b>——用這兩件事來分。',
        example: {
          q: '從頂點連到對邊中點的線叫什麼？它一定垂直對邊嗎？',
          steps: ['頂點 → 對邊中點：中線'],
          ans: '中線；不一定垂直'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '外心：三邊中垂線的交點，到三個頂點一樣遠',
        points: [
          '三邊的<span class="k">中垂線</span>交在同一點，叫做<span class="k">外心</span> \\(O\\)。',
          '外心到<b>三個頂點</b>一樣遠：\\(OA=OB=OC\\)。',
          '以 \\(O\\) 為圓心、\\(OA\\) 為半徑畫圓，會通過三個頂點——<span class="k">外接圓</span>。'
        ],
        formula: { label: '三角形的外心<span class="pgref">課本 印 157–159</span>', tex: 'OA=OB=OC' },
        visual: (h) => {
          const A = [140, 54], B = [36, 214], Cc = [270, 214], O = circum(A, B, Cc), R = V.len(O, A);
          const pbo = (p, q) => { const M = V.mid(p, q), d = V.unit(M, O); return L(V.add(M, V.mul(d, -26)), V.add(O, V.mul(d, 46)), BLU, 2.2, '7 5') + RA(M, q, V.add(M, d), 10, BLU) + TK(p, M, 1, BLU) + TK(M, q, 1, BLU); };
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -10) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10);
          const note = (lines) => lines.map(([t, c], i) => TX(300, 70 + i * 28, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: 'BC 的中垂線：線上每一點到 B、C 一樣遠。', d: () => SECBG + base + pbo(B, Cc) + note([['BC 的中垂線', BLU], ['到 B、C 等距', INK]]) },
            { t: 'AC 的中垂線：線上每一點到 A、C 一樣遠。', d: () => SECBG + base + pbo(B, Cc) + pbo(A, Cc) + note([['AC 的中垂線', BLU], ['到 A、C 等距', INK]]) },
            { t: '兩條交在 O：OA ＝ OB ＝ OC。', d: () => SECBG + base + pbo(B, Cc) + pbo(A, Cc) + L(O, A, RED, 2.4) + L(O, B, RED, 2.4) + L(O, Cc, RED, 2.4) + PT(O, RED) + NM(O, 'O', 12, -6, RED)
                + note([['交點 O ＝ 外心', RED], ['OA ＝ OB ＝ OC', RED], ['（第三條也會', GREY], ['　通過 O）', GREY]]) },
            { t: '以 O 為圓心畫圓：通過三個頂點——外接圓。', d: () => SECBG + CI(O, R, { stroke: GRN, sw: 2.2 }) + base + L(O, A, RED, 2.4) + L(O, B, RED, 2.4) + L(O, Cc, RED, 2.4) + PT(O, RED) + NM(O, 'O', 12, -6, RED)
                + note([['外接圓', GRN], ['圓心 O', INK], ['半徑 OA', INK]]) }
          ], { acc: false });
        },
        caption: '日月潭的煙火要讓三個碼頭一樣遠——<b>施放點就是外心</b>。只要畫兩條中垂線就找得到。',
        example: {
          q: '\\(O\\) 是 \\(\\triangle ABC\\) 的外心，\\(OB=6\\)，\\(OA=\\)？' +
            EXF(PG([[110, 16], [24, 136], [216, 136]]) + PT([118, 84], RED, 3.4) + exT([110, 16], 'A', 0, -2) + exT([24, 136], 'B', -8, 12) + exT([216, 136], 'C', 8, 12) + exT([118, 84], 'O', 10, -4, RED), 46, 152),
          steps: ['外心到三個頂點一樣遠'],
          ans: '\\(6\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '外心會跑：銳角在裡面、直角在斜邊中點、鈍角在外面',
        points: [
          '<b>銳角</b>三角形：外心在三角形<b>裡面</b>。',
          '<b>直角</b>三角形：外心在<b>斜邊的中點</b>。',
          '<b>鈍角</b>三角形：外心跑到三角形<b>外面</b>。'
        ],
        formula: { label: '外心的位置<span class="pgref">課本 印 158</span>', tex: '\\text{銳角在內}\\;\\cdot\\;\\text{直角在斜邊中點}\\;\\cdot\\;\\text{鈍角在外}' },
        visual: (h) => {
          const PAN = [
            { T: [[70, 66], [16, 172], [126, 172]], name: '銳角三角形', where: '外心在裡面' },
            { T: [[43.5, 124.4], [16, 172], [126, 172]], name: '直角三角形', where: '外心在斜邊中點' },
            { T: [[50, 120], [16, 152], [126, 152]], name: '鈍角三角形', where: '外心在外面' }
          ];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl"><label><span class="ival pv">銳角三角形</span></label>
              <input type="range" class="ps" min="0" max="2" step="1" value="0"></div></div>`;
          const draw = () => {
            const sel = +h.querySelector('.ps').value;
            h.querySelector('.pv').textContent = PAN[sel].name;
            let s = '';
            PAN.forEach((p, i) => {
              const [A, B, Cc] = p.T, O = circum(A, B, Cc), on = i === sel;
              let g = CI(O, V.len(O, A), { stroke: GRN, sw: 1.8, op: on ? 1 : .35 }) + PG([A, B, Cc], { stroke: on ? INK : GREY, sw: on ? 2.4 : 1.6 }) + PT(O, on ? RED : GREY, on ? 4.6 : 3.4);
              if (on) g += L(O, A, RED, 1.6, '4 3') + L(O, B, RED, 1.6, '4 3') + L(O, Cc, RED, 1.6, '4 3');
              s += `<g transform="translate(${4 + i * 145},0)" opacity="${on ? 1 : .55}">${g}</g>`;
              s += TX(75 + i * 145, 262, p.name, { anchor: 'middle', fs: 13.5, c: on ? INK : GREY });
            });
            s += TX(220, 22, PAN[sel].where, { anchor: 'middle', fs: 18, c: RED });
            h.querySelector('.fig').innerHTML = svg('0 0 440 272', s);
          };
          h.querySelector('.ps').oninput = draw;
          draw();
        },
        caption: '「心」不一定在中央——只有外心會跑，<b>內心、重心永遠在裡面</b>。',
        example: {
          q: '直角三角形的外心在哪裡？',
          steps: ['外心在斜邊的中點'],
          ans: '斜邊中點'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '直角三角形：外接圓半徑是斜邊的一半',
        points: [
          '直角三角形的外心在<b>斜邊中點</b>，所以 \\(OA=OB=OC=\\) 斜邊的一半。',
          '例 1：兩股 \\(6\\)、\\(8\\)，斜邊 \\(\\sqrt{6^2+8^2}=10\\)。',
          '外接圓半徑 \\(=10\\div2=5\\)。'
        ],
        formula: { label: '直角三角形的外接圓半徑<span class="pgref">課本 印 160 例 1</span>', tex: 'R=\\dfrac{\\text{斜邊}}{2}' },
        visual: (h) => {
          const A = [60, 230], B = [60, 110], Cc = [220, 230], O = V.mid(B, Cc);
          const base = PG([A, B, Cc]) + RA(A, B, Cc, 12) + NM(A, 'A', -10, 12) + NM(B, 'B', -10, -4) + NM(Cc, 'C', 10, 12)
            + TX(46, 176, '6', { anchor: 'end', fs: 16, c: BLU }) + TX(140, 254, '8', { anchor: 'middle', fs: 16, c: BLU });
          const note = (lines) => lines.map(([t, c], i) => TX(250, 70 + i * 32, t, { fs: 15.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 1：∠A ＝ 90°，AB ＝ 6，AC ＝ 8。', d: () => SECBG + base },
            { t: '先算斜邊 BC。', d: () => SECBG + base + L(B, Cc, AMB, 3.4) + note([[`BC ＝ ${RT('6² ＋ 8²')}`, AMB], ['　 ＝ 10', AMB]]) },
            { t: '外心 O 在斜邊中點。', d: () => SECBG + base + L(B, Cc, AMB, 3.4) + PT(O, RED) + NM(O, 'O', 12, -8, RED) + TK(B, O, 1, RED) + TK(O, Cc, 1, RED)
                + note([[`BC ＝ ${RT('6² ＋ 8²')} ＝ 10`, AMB], ['O 是 BC 的中點', RED]]) },
            { t: '半徑 ＝ 斜邊一半 ＝ 5。', d: () => SECBG + CI(O, V.len(O, A), { stroke: GRN }) + base + L(B, Cc, AMB, 3.4) + PT(O, RED) + NM(O, 'O', 12, -8, RED) + L(O, A, RED, 2.2, '5 4')
                + note([[`BC ＝ ${RT('6² ＋ 8²')} ＝ 10`, AMB], ['O 是 BC 的中點', RED], ['半徑 ＝ 10 ÷ 2 ＝ 5', GRN]]) }
          ], { acc: false });
          radBars(h);
          { const sl = h.querySelector('.steps-r'); if (sl) sl.addEventListener('input', () => radBars(h)); }
        },
        caption: '直角三角形的題目，先問兩句：<b>外心在哪？</b>（斜邊中點）<b>半徑多少？</b>（斜邊一半）',
        example: {
          q: '直角三角形的斜邊是 \\(26\\)，外接圓半徑是多少？',
          steps: ['半徑 ＝ 斜邊的一半'],
          ans: '\\(13\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '等腰三角形的外接圓半徑：設 x，列畢氏（行有餘力）',
        points: [
          '等腰 \\(AB=AC=10\\)、\\(BC=12\\)：高 \\(AD\\) 平分底邊，\\(BD=6\\)、\\(AD=8\\)。',
          '外心 \\(O\\) 在 \\(AD\\) 上：設 \\(OA=OB=x\\)，則 \\(OD=8-x\\)。',
          '直角 \\(\\triangle OBD\\)：\\(x^2=(8-x)^2+6^2\\)，\\(x=\\frac{25}{4}\\)。這一頁<b>行有餘力</b>。'
        ],
        formula: { label: '等腰三角形的外接圓半徑<span class="pgref">課本 印 161 例 2</span>', tex: 'x^2=(8-x)^2+6^2' },
        visual: (h) => {
          const k = 17, B = [40, 236], Cc = [40 + 12 * k, 236], D = [40 + 6 * k, 236], A = [D[0], 236 - 8 * k], O = [D[0], A[1] + 25 / 4 * k];
          const base = PG([A, B, Cc]) + L(A, D, INK, 2) + RA(D, Cc, A, 10) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 8) + NM(Cc, 'C', 10, 8) + NM(D, 'D', 0, 20);
          const note = (lines) => lines.map(([t, c], i) => TX(268, 60 + i * 30, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '等腰三角形：高 AD 平分底邊。', d: () => SECBG + base + note([['AB ＝ AC ＝ 10', INK], ['BD ＝ 12 ÷ 2 ＝ 6', BLU], ['AD ＝ 8（畢氏）', BLU]]) },
            { t: '外心在 AD 上：設 OA ＝ OB ＝ x。', d: () => SECBG + base + PT(O, RED) + NM(O, 'O', 12, 4, RED) + L(O, B, RED, 2.4)
                + note([['BD ＝ 6，AD ＝ 8', BLU], ['OA ＝ OB ＝ x', RED], ['OD ＝ 8 − x', RED]]) },
            { t: '直角 △OBD 列畢氏，解出 x。', d: () => SECBG + PG([O, B, D], { fill: 'rgba(225,29,72,.10)', stroke: 'none' }) + base + PT(O, RED) + NM(O, 'O', 12, 4, RED) + L(O, B, RED, 2.4)
                + note([['OB² ＝ OD² ＋ BD²', INK], ['x² ＝ (8 − x)² ＋ 6²', RED], ['16x ＝ 100', INK], ['x ＝ 25/4', GRN]]) }
          ], { acc: false });
        },
        caption: '習作基礎 2 就是這一型——<b>老師帶著列式</b>，不當自己過關的題。',
        example: {
          q: '承上，為什麼外心一定在高 \\(AD\\) 上？',
          steps: ['\\(AD\\) 平分底邊又垂直底邊，就是 \\(BC\\) 的中垂線'],
          ans: '外心在三條中垂線上，\\(AD\\) 是其中一條'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '外心與角度：圓心角是圓周角的 2 倍',
        points: [
          '外心 \\(O\\) 是外接圓的圓心：\\(\\angle A\\) 是<b>圓周角</b>、\\(\\angle BOC\\) 是<b>圓心角</b>。',
          '兩個角對同一段弧 \\(BC\\)：圓心角 ＝ 圓周角的 \\(2\\) 倍。',
          '\\(\\angle A=67^\\circ\\Rightarrow\\angle BOC=134^\\circ\\)。⚠ 鈍角三角形不能直接乘 \\(2\\)。'
        ],
        formula: { label: '外心與角度<span class="pgref">課本 印 162 例 3</span>', tex: '\\angle BOC=2\\angle A' },
        visual: (h) => {
          const O = [140, 146], r = 104, P = (d) => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
          const A = P(96), B = P(203), Cc = P(337);
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -10) + NM(B, 'B', -12, 10) + NM(Cc, 'C', 12, 10) + PT(O, RED) + NM(O, 'O', 0, -10, RED);
          const note = (lines) => lines.map(([t, c], i) => TX(276, 70 + i * 30, t, { fs: 15, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 3：O 是外心，∠A ＝ 67°。', d: () => SECBG + base + AN(A, B, Cc, 30, BLU, '67°', { lr: 16 }) },
            { t: '以 O 為圓心畫出外接圓。', d: () => SECBG + CI(O, r, { stroke: GRN }) + base + AN(A, B, Cc, 30, BLU, '67°', { lr: 16 }) },
            { t: '∠A 是圓周角、∠BOC 是圓心角，對同一段弧 BC。', d: () => SECBG + CI(O, r, { stroke: GRN }) + `<path d="M${f1(B[0])},${f1(B[1])} A${r},${r} 0 0 0 ${f1(Cc[0])},${f1(Cc[1])}" fill="none" stroke="${AMB}" stroke-width="5"/>`
                + base + L(O, B, RED, 2.2) + L(O, Cc, RED, 2.2) + AN(A, B, Cc, 30, BLU, '67°', { lr: 16 }) + AN(O, B, Cc, 22, RED, '?', { lr: 14 })
                + note([['圓周角 ∠A', BLU], ['圓心角 ∠BOC', RED], ['同一段弧 BC', AMB]]) },
            { t: '圓心角 ＝ 2 × 圓周角 ＝ 134°。', d: () => SECBG + CI(O, r, { stroke: GRN }) + `<path d="M${f1(B[0])},${f1(B[1])} A${r},${r} 0 0 0 ${f1(Cc[0])},${f1(Cc[1])}" fill="none" stroke="${AMB}" stroke-width="5"/>`
                + base + L(O, B, RED, 2.2) + L(O, Cc, RED, 2.2) + AN(A, B, Cc, 30, BLU, '67°', { lr: 16 }) + AN(O, B, Cc, 22, RED, '134°', { lr: 16 })
                + note([['∠BOC ＝ 2∠A', RED], ['　＝ 2 × 67°', INK], ['　＝ 134°', GRN]]) }
          ], { acc: false });
        },
        caption: '用的是上一章那兩行板書：<b>圓心角＝弧、圓周角＝弧÷2</b>。⚠ 鈍角三角形要另算，課本隨堂印 162 第 2 題就是。',
        example: {
          q: '\\(O\\) 是銳角 \\(\\triangle ABC\\) 的外心，\\(\\angle A=50^\\circ\\)，\\(\\angle BOC=\\)？',
          steps: ['\\(\\angle BOC=2\\angle A\\)'],
          ans: '\\(100^\\circ\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '外心的應用：把外接圓畫出來（行有餘力）',
        points: [
          '\\(O\\) 同時是 \\(\\triangle ABC\\) 和 \\(\\triangle BCD\\) 的外心：\\(A\\)、\\(B\\)、\\(C\\)、\\(D\\) 在<b>同一個圓</b>上。',
          '圓內接四邊形對角互補：\\(\\angle A=180^\\circ-130^\\circ=50^\\circ\\)。',
          '\\(OC=OA\\)（半徑）：\\(\\angle COA=180^\\circ-50^\\circ\\times2=80^\\circ\\)。這一頁<b>行有餘力</b>。'
        ],
        formula: { label: '外心的應用<span class="pgref">課本 印 163 例 4</span>', tex: '\\angle A+\\angle D=180^\\circ' },
        visual: (h) => {
          const O = [150, 168], r = 112, P = (d) => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
          const A = P(180), B = P(0), Cc = P(100), D = P(45);
          const base = L(A, B, INK, 2.2) + PG([A, Cc, D, B], { stroke: INK }) + L(B, Cc, GREY, 1.6) + PT(O, RED)
            + NM(A, 'A', -12, 6) + NM(B, 'B', 12, 6) + NM(Cc, 'C', -6, -10) + NM(D, 'D', 10, -8) + NM(O, 'O', 0, 20, RED);
          const note = (lines) => lines.map(([t, c], i) => TX(284, 60 + i * 30, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 4：O 在 AB 上，是 △ABC 與 △BCD 的外心，∠D ＝ 130°。', d: () => SECBG + base + AN(D, Cc, B, 22, BLU, '130°', { lr: 18, fs: 12 }) },
            { t: '畫出外接圓：A、B、C、D 都在圓上。', d: () => SECBG + CI(O, r, { stroke: GRN }) + base + AN(D, Cc, B, 22, BLU, '130°', { lr: 18, fs: 12 }) + note([['四個點都在', GRN], ['圓 O 上', GRN]]) },
            { t: '圓內接四邊形 ACDB：對角互補。', d: () => SECBG + CI(O, r, { stroke: GRN }) + base + AN(D, Cc, B, 22, BLU, '130°', { lr: 18, fs: 12 }) + AN(A, B, Cc, 28, AMB, '50°', { lr: 14, fs: 12 })
                + note([['∠A ＋ ∠D ＝ 180°', AMB], ['∠A ＝ 50°', AMB]]) },
            { t: 'OC ＝ OA（半徑）：等腰三角形求 ∠COA。', d: () => SECBG + CI(O, r, { stroke: GRN }) + PG([O, A, Cc], { fill: 'rgba(225,29,72,.10)', stroke: 'none' }) + base + L(O, Cc, RED, 2.2)
                + AN(A, B, Cc, 28, AMB, '50°', { lr: 14, fs: 12 }) + AN(O, Cc, A, 22, RED, '80°', { lr: 14, fs: 12 })
                + note([['∠A ＝ 50°', AMB], ['OC ＝ OA', RED], ['∠COA', RED], ['＝ 180° − 50° × 2', INK], ['＝ 80°', GRN]]) }
          ], { acc: false });
        },
        caption: '外心的題目卡住時，<b>把外接圓畫出來</b>——上一章的圓周角、內接四邊形就都能用了。',
        example: {
          q: '圓內接四邊形 \\(ABCD\\)，\\(\\angle B=70^\\circ\\)，\\(\\angle D=\\)？',
          steps: ['對角互補：\\(180^\\circ-70^\\circ\\)'],
          ans: '\\(110^\\circ\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '內心：三個角平分線的交點，到三個邊一樣遠',
        points: [
          '三個內角的<span class="k">角平分線</span>交在同一點，叫做<span class="k">內心</span> \\(I\\)。',
          '內心到<b>三個邊</b>一樣遠：\\(ID=IE=IF\\)（都要<b>垂直</b>量）。',
          '以 \\(I\\) 為圓心、\\(ID\\) 為半徑畫圓，和三邊都相切——<span class="k">內切圓</span>。'
        ],
        formula: { label: '三角形的內心<span class="pgref">課本 印 165–167</span>', tex: 'ID=IE=IF' },
        visual: (h) => {
          const A = [120, 34], B = [24, 222], Cc = [290, 222], { I, r } = incen(A, B, Cc);
          const fB = bisFoot(B, A, Cc), fC = bisFoot(Cc, A, B);
          const D = foot(I, B, Cc), E = foot(I, A, Cc), F = foot(I, A, B);
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10);
          const bB = L(B, fB, AMB, 2.2, '7 5') + AN(B, Cc, I, 34, AMB) + AN(B, I, A, 40, AMB);
          const bC = L(Cc, fC, AMB, 2.2, '7 5') + AN(Cc, I, B, 34, AMB) + AN(Cc, A, I, 40, AMB);
          const perp = L(I, D, RED, 2.4) + L(I, E, RED, 2.4) + L(I, F, RED, 2.4) + RA(D, Cc, I, 8, RED) + RA(E, A, I, 8, RED) + RA(F, B, I, 8, RED)
            + NM(D, 'D', 0, 18, RED, 13) + NM(E, 'E', 12, 0, RED, 13) + NM(F, 'F', -12, 0, RED, 13);
          const note = (lines) => lines.map(([t, c], i) => TX(306, 70 + i * 28, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '∠B 的角平分線。', d: () => SECBG + base + bB + note([['∠B 的', AMB], ['角平分線', AMB]]) },
            { t: '∠C 的角平分線：兩條交在 I。', d: () => SECBG + base + bB + bC + PT(I, RED) + NM(I, 'I', 0, -10, RED) + note([['交點 I ＝ 內心', RED]]) },
            { t: '從 I 往三邊畫<b>垂線</b>：ID ＝ IE ＝ IF。', d: () => SECBG + base + bB + bC + perp + PT(I, RED) + NM(I, 'I', 0, -10, RED) + note([['ID ＝ IE ＝ IF', RED], ['都是垂直量的', GREY]]) },
            { t: '以 I 為圓心、ID 為半徑：內切圓。', d: () => SECBG + CI(I, r, { stroke: GRN, sw: 2.2 }) + base + perp + PT(I, RED) + NM(I, 'I', 0, -10, RED) + note([['內切圓', GRN], ['和三邊都相切', INK]]) }
          ], { acc: false });
        },
        caption: '公園噴水池要跟三條路一樣遠——<b>位置就是內心</b>。內心一定在三角形裡面。',
        example: {
          q: '內心到三角形的什麼一樣遠？',
          steps: ['外心到頂點、內心到邊'],
          ans: '三個邊（垂直距離）'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '內切圓的半徑是到邊的垂距，不是 IA',
        points: [
          '內切圓的半徑是 \\(I\\) 到<b>邊</b>的距離，要畫<b>垂直</b>的那一段。',
          '\\(IA\\)、\\(IB\\)、\\(IC\\) 是到頂點的距離——<b>不是半徑</b>，也不一定一樣長。',
          '口訣：<b>外頂內邊</b>——外心跟頂點等距、內心跟邊等距。'
        ],
        formula: { label: '內切圓的半徑<span class="pgref">課本 印 166</span>', tex: 'r=ID\\quad(ID\\perp BC)' },
        visual: (h) => {
          const fig = (dx, good) => {
            const A = [dx + 90, 50], B = [dx + 14, 200], Cc = [dx + 196, 200], { I, r } = incen(A, B, Cc), D = foot(I, B, Cc);
            let s = CI(I, r, { stroke: GRN, sw: 1.8 }) + PG([A, B, Cc]) + PT(I, INK) + NM(A, 'A', 0, -8) + NM(B, 'B', -8, 10) + NM(Cc, 'C', 8, 10) + NM(I, 'I', 12, -4);
            s += good ? L(I, D, GRN, 3.2) + RA(D, Cc, I, 9, GRN) + NM(D, 'D', 0, 18, GRN, 13)
              : L(I, A, RED, 3.2) + L(I, B, RED, 2, '5 4') + L(I, Cc, RED, 2, '5 4');
            return s;
          };
          h.innerHTML = svg('0 0 440 280',
            fig(4, false) + fig(224, true)
            + BOX(14, 222, 196, 48, { r: 12, fill: '#fdeef2', stroke: RED, sw: 2 }) + TX(112, 252, '✗ IA 是到頂點', { anchor: 'middle', fs: 16, c: RED })
            + BOX(234, 222, 196, 48, { r: 12, fill: 'rgba(5,150,105,.10)', stroke: GRN, sw: 2 }) + TX(332, 252, '✓ ID ⊥ BC 才是半徑', { anchor: 'middle', fs: 16, c: GRN }));
        },
        caption: '畫內切圓半徑之前，<b>先補一個直角記號</b>——沒有直角就不是半徑。',
        example: {
          q: '\\(I\\) 是內心，\\(IA=5\\)，內切圓半徑是 \\(5\\) 嗎？',
          steps: ['\\(IA\\) 是到頂點的距離，不是到邊'],
          ans: '不一定；半徑要量到邊的垂直距離'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '內心與角度：兩個角各除以 2，再用內角和',
        points: [
          '\\(BI\\) 平分 \\(\\angle B\\)：\\(\\angle 1=70^\\circ\\div2=35^\\circ\\)。',
          '\\(CI\\) 平分 \\(\\angle C\\)：\\(\\angle 2=40^\\circ\\div2=20^\\circ\\)。',
          '\\(\\triangle IBC\\) 內角和：\\(\\angle BIC=180^\\circ-(35^\\circ+20^\\circ)=125^\\circ\\)。'
        ],
        formula: { label: '內心與角度<span class="pgref">課本 印 168 例 5</span>', tex: '\\angle BIC=180^\\circ-(\\angle1+\\angle2)' },
        visual: (h) => {
          const B = [26, 220], Cc = [286, 220], rad = (d) => d * Math.PI / 180;
          const A = xline(B, [B[0] + Math.cos(rad(70)), B[1] - Math.sin(rad(70))], Cc, [Cc[0] - Math.cos(rad(40)), Cc[1] - Math.sin(rad(40))]);
          const { I } = incen(A, B, Cc);
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10);
          const note = (lines) => lines.map(([t, c], i) => TX(306, 60 + i * 30, t, { fs: 15, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 5：∠ABC ＝ 70°，∠ACB ＝ 40°，I 是內心。', d: () => SECBG + base + AN(B, Cc, A, 30, BLU, '70°', { lr: 16 }) + AN(Cc, A, B, 34, BLU, '40°', { lr: 18 }) },
            { t: 'BI、CI 是角平分線：∠1 ＝ 35°、∠2 ＝ 20°。', d: () => SECBG + base + L(B, I, AMB, 2.6) + L(Cc, I, AMB, 2.6) + PT(I, RED) + NM(I, 'I', 0, -12, RED)
                + AN(B, Cc, I, 44, AMB, '1', { lr: 12 }) + AN(Cc, I, B, 52, AMB, '2', { lr: 12 }) + note([['∠1 ＝ 70° ÷ 2', AMB], ['　＝ 35°', AMB], ['∠2 ＝ 40° ÷ 2', AMB], ['　＝ 20°', AMB]]) },
            { t: '△IBC 內角和 180°：∠BIC ＝ 125°。', d: () => SECBG + PG([B, Cc, I], { fill: 'rgba(5,150,105,.10)', stroke: 'none' }) + base + L(B, I, AMB, 2.6) + L(Cc, I, AMB, 2.6) + PT(I, RED) + NM(I, 'I', 0, -12, RED)
                + AN(I, B, Cc, 18, GRN, '?', { lr: 12 }) + note([['∠BIC', GRN], ['＝ 180°', INK], ['　− (35° ＋ 20°)', INK], ['＝ 125°', GRN]]) }
          ], { acc: false });
        },
        caption: '先把兩個角<b>各除以 2</b>，再用三角形內角和——不必背公式。',
        example: {
          q: '\\(I\\) 是內心，\\(\\angle B=60^\\circ\\)，\\(\\angle C=80^\\circ\\)，\\(\\angle BIC=\\)？',
          steps: ['\\(30^\\circ+40^\\circ=70^\\circ\\)', '\\(180^\\circ-70^\\circ\\)'],
          ans: '\\(110^\\circ\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '內心把三角形切三塊：面積比 ＝ 三邊的比',
        points: [
          '連 \\(IA\\)、\\(IB\\)、\\(IC\\)，把三角形切成三塊。',
          '三塊的<b>高都是 \\(r\\)</b>（內心到三邊一樣遠），底是三個邊。',
          '所以三塊的面積比 ＝ 三邊的比：\\(AB:BC:CA\\)。'
        ],
        formula: { label: '三角形的內心與面積<span class="pgref">課本 印 169</span>', tex: '\\triangle AIB:\\triangle BIC:\\triangle CIA=AB:BC:CA' },
        visual: (h) => {
          const A = [130, 30], B = [24, 226], Cc = [300, 226], { I } = incen(A, B, Cc);
          const D = foot(I, B, Cc), E = foot(I, A, Cc), F = foot(I, A, B);
          const pieces = PG([A, I, B], { fill: 'rgba(37,99,235,.16)', stroke: 'none' }) + PG([B, I, Cc], { fill: 'rgba(217,119,6,.18)', stroke: 'none' }) + PG([Cc, I, A], { fill: 'rgba(5,150,105,.16)', stroke: 'none' });
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10);
          const cut = L(I, A, INK, 1.8) + L(I, B, INK, 1.8) + L(I, Cc, INK, 1.8) + PT(I, RED) + NM(I, 'I', 10, -8, RED);
          const hts = L(I, D, RED, 2.2, '4 3') + L(I, E, RED, 2.2, '4 3') + L(I, F, RED, 2.2, '4 3') + RA(D, Cc, I, 7, RED) + RA(E, A, I, 7, RED) + RA(F, B, I, 7, RED)
            + NM(V.mid(I, D), 'r', 9, 4, RED, 13) + NM(V.mid(I, E), 'r', 8, -4, RED, 13) + NM(V.mid(I, F), 'r', -9, -2, RED, 13);
          const note = (lines) => lines.map(([t, c], i) => TX(312, 70 + i * 30, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '連 IA、IB、IC：切成三塊。', d: () => SECBG + pieces + base + cut },
            { t: '三塊的高都是 r，底是 AB、BC、CA。', d: () => SECBG + pieces + base + cut + hts + note([['高都是 r', RED]]) },
            { t: '面積 ＝ ½ × 底 × r：r 一樣，就只比底。', d: () => SECBG + pieces + base + cut + hts + note([['½ × AB × r', BLU], ['½ × BC × r', AMB], ['½ × CA × r', GRN], ['→ 面積比', INK], ['＝ AB：BC：CA', INK]]) }
          ], { acc: false });
        },
        caption: '高一樣，面積就只看底——下一頁的公式也是從這張圖來的。',
        example: {
          q: '三邊 \\(6\\)、\\(8\\)、\\(10\\)，被內心切成的三塊面積比？',
          steps: ['面積比 ＝ 三邊的比'],
          ans: '\\(6:8:10=3:4:5\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '面積 ＝ ½ × 內切圓半徑 × 周長',
        points: [
          '三塊加起來：\\(\\tfrac12\\times r\\times\\)（三邊和）。三邊和就是<b>周長</b>。',
          '先用 \\(6\\)、\\(8\\)、\\(10\\)：面積 \\(24\\)、周長 \\(24\\) → \\(24=\\tfrac12\\times r\\times24\\)，\\(r=2\\)。',
          '反過來求半徑：\\(r=2\\times\\) 面積 \\(\\div\\) 周長。'
        ],
        formula: { label: '三角形面積與內切圓半徑<span class="pgref">課本 印 170、171 例 6</span>', tex: '\\text{面積}=\\tfrac12\\times r\\times\\text{周長}' },
        visual: (h) => {
          const A = [40, 104], B = [40, 224], Cc = [200, 224], { I, r } = incen(A, B, Cc);
          const base = PG([A, B, Cc]) + RA(B, Cc, A, 11) + NM(A, 'A', -10, 0) + NM(B, 'B', -10, 12) + NM(Cc, 'C', 10, 12)
            + TX(28, 170, '6', { anchor: 'end', fs: 15, c: BLU }) + TX(120, 246, '8', { anchor: 'middle', fs: 15, c: BLU }) + TX(132, 156, '10', { anchor: 'middle', fs: 15, c: BLU });
          const inc = CI(I, r, { stroke: GRN }) + PT(I, RED) + L(I, foot(I, B, Cc), RED, 2.2) + NM(I, 'I', 8, -8, RED, 13);
          const note = (lines) => lines.map(([t, c], i) => TX(232, 52 + i * 31, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '直角三角形 6、8、10，內切圓半徑 r。', d: () => SECBG + inc + base },
            { t: '三塊加起來：½ × r × (6 ＋ 8 ＋ 10)。', d: () => SECBG + inc + base + note([['½ × 6 × r', INK], ['＋ ½ × 8 × r', INK], ['＋ ½ × 10 × r', INK], ['＝ ½ × r × 24', BLU]]) },
            { t: '面積也等於 ½ × 6 × 8 ＝ 24：解出 r ＝ 2。', d: () => SECBG + inc + base + note([['面積 ＝ ½ × 6 × 8 ＝ 24', INK], ['24 ＝ ½ × r × 24', BLU], ['r ＝ 2', GRN]]) },
            { t: '一般：面積 ＝ ½ × r × 周長 → r ＝ 2 × 面積 ÷ 周長。', d: () => SECBG + inc + base + note([['面積 ＝ ½ × r × 周長', GRN], ['r ＝ 2 × 面積 ÷ 周長', GRN], ['', INK], ['驗算：2 × 24 ÷ 24 ＝ 2', GREY]]) }
          ], { acc: false });
        },
        caption: '課本把周長寫成 \\(S\\)：\\(\\tfrac12 rS\\) 的 \\(S\\) 是<b>周長</b>，不是面積。',
        example: {
          q: '例 6：面積 \\(360\\)，三邊 \\(25\\)、\\(29\\)、\\(36\\)，內切圓半徑？',
          steps: ['周長 \\(25+29+36=90\\)', '\\(360=\\tfrac12\\times r\\times90\\)'],
          ans: '\\(r=8\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '直角三角形的內切圓：r ＝（兩股和 − 斜邊）÷ 2',
        points: [
          '直角那個角落，兩條半徑和兩股圍成<b>正方形</b>，邊長是 \\(r\\)。',
          '圓外一點的兩條切線段一樣長：兩股和 ＝ 斜邊 ＋ \\(2r\\)。',
          '例 7：\\(r=(5+12-13)\\div2=2\\)。'
        ],
        formula: { label: '直角三角形的內切圓半徑<span class="pgref">課本 印 172、173 例 7</span>', tex: 'r=\\dfrac{\\text{兩股和}-\\text{斜邊}}{2}' },
        visual: (h) => {
          const k = 15, A = [40, 222], B = [40, 222 - 5 * k], Cc = [40 + 12 * k, 222], { I, r } = incen(A, B, Cc);
          const E = foot(I, A, Cc), F = foot(I, A, B), D = foot(I, B, Cc);
          const base = PG([A, B, Cc]) + RA(A, Cc, B, 10) + NM(A, 'A', -10, 12) + NM(B, 'B', -10, -2) + NM(Cc, 'C', 10, 12)
            + TX(26, 186, '5', { anchor: 'end', fs: 15, c: BLU }) + TX(130, 244, '12', { anchor: 'middle', fs: 15, c: BLU }) + TX(124, 154, '13', { anchor: 'middle', fs: 15, c: BLU });
          const inc = CI(I, r, { stroke: GRN }) + PT(I, RED) + NM(I, 'I', 10, -6, RED, 13);
          const sqr = PG([A, F, I, E], { fill: 'rgba(225,29,72,.14)', stroke: RED, sw: 2 });
          const note = (lines) => lines.map(([t, c], i) => TX(238, 56 + i * 31, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 7：∠A ＝ 90°，AB ＝ 5，AC ＝ 12，斜邊 13。', d: () => SECBG + inc + base },
            { t: '直角的角落：兩條半徑＋兩股，圍成邊長 r 的正方形。', d: () => SECBG + inc + sqr + base + note([['角落是正方形', RED], ['邊長 ＝ r', RED]]) },
            { t: '切線段：兩股和 ＝ 斜邊 ＋ 2r。', d: () => SECBG + inc + sqr + base + L(I, D, GRN, 2) + RA(D, Cc, I, 7, GRN) + note([['兩股和 ＝ 斜邊 ＋ 2r', INK], ['5 ＋ 12 ＝ 13 ＋ 2r', BLU]]) },
            { t: 'r ＝ (5 ＋ 12 − 13) ÷ 2 ＝ 2。', d: () => SECBG + inc + sqr + base + note([['兩股和 ＝ 斜邊 ＋ 2r', INK], ['5 ＋ 12 ＝ 13 ＋ 2r', BLU], ['r ＝ (17 − 13) ÷ 2', INK], ['r ＝ 2', GRN]]) }
          ], { acc: false });
        },
        caption: '用之前<b>先圈出斜邊</b>——三邊亂減會算錯。算完可以用上一頁的面積公式再驗一次。',
        example: {
          q: '直角三角形兩股 \\(6\\)、\\(8\\)，內切圓半徑？',
          steps: ['斜邊 \\(10\\)', '\\((6+8-10)\\div2\\)'],
          ans: '\\(2\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '重心：三條中線的交點，是三角形的平衡點',
        points: [
          '頂點連到對邊中點的線段叫<span class="k">中線</span>，三角形有三條。',
          '三條中線交在同一點，叫做<span class="k">重心</span> \\(G\\)，一定在三角形裡面。',
          '均勻的三角形紙板，用指尖頂在重心就能<b>平衡</b>。'
        ],
        formula: { label: '三角形的重心<span class="pgref">課本 印 174–176</span>', tex: '\\text{三條中線交於重心 }G' },
        visual: (h) => {
          const A = [140, 30], B = [40, 220], Cc = [300, 220], D = V.mid(B, Cc), E = V.mid(A, Cc), F = V.mid(A, B), G = cen(A, B, Cc);
          const base = PG([A, B, Cc], { fill: 'rgba(5,150,105,.06)' }) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10);
          const mids = PT(D, GREY, 3.4) + PT(E, GREY, 3.4) + PT(F, GREY, 3.4) + NM(D, 'D', 0, 20, GREY, 13) + NM(E, 'E', 12, -2, GREY, 13) + NM(F, 'F', -12, -2, GREY, 13);
          const note = (lines) => lines.map(([t, c], i) => TX(318, 70 + i * 28, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '先找三邊的中點 D、E、F。', d: () => SECBG + base + mids + TK(B, D, 1, GREY) + TK(D, Cc, 1, GREY) },
            { t: '頂點連對邊中點：中線 AD。', d: () => SECBG + base + mids + L(A, D, GRN, 2.8) + note([['中線 AD', GRN], ['A → BC 中點', INK]]) },
            { t: '另外兩條中線 BE、CF：三條交在 G。', d: () => SECBG + base + mids + L(A, D, GRN, 2.8) + L(B, E, GRN, 2.8) + L(Cc, F, GRN, 2.8) + PT(G, RED, 5) + NM(G, 'G', 14, -4, RED)
                + note([['交點 G ＝ 重心', RED]]) },
            { t: '頂在 G 就能平衡；⚠ 中線不必垂直對邊。', d: () => SECBG + base + mids + L(A, D, GRN, 2.8) + L(B, E, GRN, 2.8) + L(Cc, F, GRN, 2.8) + PT(G, RED, 5) + NM(G, 'G', 14, -4, RED)
                + `<polygon points="${f1(G[0] - 9)},${f1(G[1] + 26)} ${f1(G[0] + 9)},${f1(G[1] + 26)} ${f1(G[0])},${f1(G[1] + 6)}" fill="${AMB}"/>`
                + note([['G 是平衡點', AMB], ['中線不一定', GREY], ['垂直對邊', GREY]]) }
          ], { acc: false });
        },
        caption: '中線<b>不必垂直</b>對邊——看到垂直記號，那是中垂線或高，不是中線。',
        example: {
          q: '重心是哪三條線的交點？',
          steps: ['頂點到對邊中點的線段'],
          ans: '三條中線'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '重心把中線分成 2：1，頂點那一段比較長',
        points: [
          '重心把每一條中線分成 \\(2:1\\)，<b>靠頂點那一段比較長</b>。',
          '把中線切成 \\(3\\) 份：\\(AG\\) 佔 \\(2\\) 份、\\(GD\\) 佔 \\(1\\) 份。',
          '\\(AG=\\tfrac23 AD\\)，\\(GD=\\tfrac13 AD\\)。'
        ],
        formula: { label: '三角形的重心性質<span class="pgref">課本 印 176</span>', tex: 'AG:GD=2:1' },
        visual: (h) => {
          const LS = [12, 9, 15, 18, 6];
          h.innerHTML = `<div style="width:100%"><div class="fig"></div>
            <div class="ictrl"><label>中線 AD ＝ <span class="ival lv">12</span></label>
              <input type="range" class="ls" min="0" max="${LS.length - 1}" step="1" value="0"></div></div>`;
          const draw = () => {
            const Ln = LS[+h.querySelector('.ls').value], u = Ln / 3;
            h.querySelector('.lv').textContent = Ln;
            const A = [220, 20], B = [90, 150], Cc = [350, 150], D = V.mid(B, Cc), G = cen(A, B, Cc);
            let s = PG([A, B, Cc]) + L(A, D, GRN, 2.6) + L(B, V.mid(A, Cc), GREY, 1.6) + L(Cc, V.mid(A, B), GREY, 1.6) + PT(G, RED) + NM(A, 'A', 0, -6) + NM(D, 'D', 0, 18) + NM(G, 'G', 14, 2, RED, 14);
            const x0 = 60, w = 320, y = 190;
            for (let i = 0; i < 3; i++) s += BOX(x0 + i * w / 3, y, w / 3, 36, { r: 0, fill: i < 2 ? 'rgba(5,150,105,.18)' : 'rgba(217,119,6,.20)', stroke: '#fff', sw: 2 });
            s += TX(x0, y - 8, 'A', { anchor: 'middle', fs: 15 }) + TX(x0 + w * 2 / 3, y - 8, 'G', { anchor: 'middle', fs: 15, c: RED }) + TX(x0 + w, y - 8, 'D', { anchor: 'middle', fs: 15 });
            s += TX(x0 + w / 3, y + 24, `AG ＝ ${2 * u}（2 份）`, { anchor: 'middle', fs: 16, c: GRN }) + TX(x0 + w * 5 / 6, y + 24, `GD ＝ ${u}`, { anchor: 'middle', fs: 15, c: AMB });
            s += TX(220, 258, `${Ln} ÷ 3 ＝ ${u}（一份）`, { anchor: 'middle', fs: 15, c: GREY });
            h.querySelector('.fig').innerHTML = svg('0 0 440 270', s);
          };
          h.querySelector('.ls').oninput = draw;
          draw();
        },
        caption: '不要只背「2 比 1」，要記「<b>頂點那端長、佔 2 份</b>」——方向反了整題錯。',
        example: {
          q: '例 8：中線 \\(AD=12\\)、\\(BE=18\\)、\\(CF=15\\)，\\(AG\\)、\\(BG\\)、\\(CG\\) 各多長？',
          steps: ['各取中線的 \\(\\tfrac23\\)'],
          ans: '\\(8\\)、\\(12\\)、\\(10\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '重心與面積：三大塊一樣大、六小塊也一樣大',
        points: [
          '一條中線把三角形分成<b>兩塊一樣大</b>（等底同高）。',
          '三條中線一起，切出<b>六塊一樣大</b>的小三角形，各佔 \\(\\tfrac16\\)。',
          '以重心為頂點的三大塊 \\(\\triangle AGB\\)、\\(\\triangle BGC\\)、\\(\\triangle CGA\\)，各佔 \\(\\tfrac13\\)。'
        ],
        formula: { label: '三角形重心與面積<span class="pgref">課本 印 178 例 9</span>', tex: '\\triangle AGB=\\triangle BGC=\\triangle CGA=\\tfrac13\\triangle ABC' },
        visual: (h) => {
          const A = [150, 26], B = [30, 226], Cc = [330, 226], D = V.mid(B, Cc), E = V.mid(A, Cc), F = V.mid(A, B), G = cen(A, B, Cc);
          const six = [[A, F, G], [F, B, G], [B, D, G], [D, Cc, G], [Cc, E, G], [E, A, G]];
          const base = PG([A, B, Cc]) + NM(A, 'A', 0, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10) + NM(G, 'G', 0, -10, RED, 14);
          const meds = L(A, D, INK, 1.8) + L(B, E, INK, 1.8) + L(Cc, F, INK, 1.8);
          SV.stepper(h, SECVB, [
            { t: '一條中線 AD：左右兩塊一樣大（底一樣、高一樣）。', d: () => SECBG + PG([A, B, D], { fill: 'rgba(37,99,235,.14)', stroke: 'none' }) + PG([A, D, Cc], { fill: 'rgba(217,119,6,.14)', stroke: 'none' }) + base + L(A, D, INK, 2.2)
                + TX(220, 262, '一條中線 → 兩塊一樣大', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '三條中線：切成六小塊，每塊都是 1/6。', d: () => SECBG + six.map((t, i) => PG(t, { fill: i % 2 ? 'rgba(5,150,105,.20)' : 'rgba(5,150,105,.08)', stroke: 'none' })).join('') + base + meds
                + six.map(t => { const c = cen(t[0], t[1], t[2]); return TX(f1(c[0]), f1(c[1] + 5), '1/6', { anchor: 'middle', fs: 12.5, c: GRN }); }).join('')
                + TX(220, 262, '三條一起 → 六塊一樣大', { anchor: 'middle', fs: 15, c: GREY }) },
            { t: '兩小塊合成一大塊：△AGB、△BGC、△CGA 各 1/3。', d: () => SECBG + PG([A, G, B], { fill: 'rgba(37,99,235,.16)', stroke: 'none' }) + PG([B, G, Cc], { fill: 'rgba(217,119,6,.18)', stroke: 'none' }) + PG([Cc, G, A], { fill: 'rgba(5,150,105,.16)', stroke: 'none' }) + base
                + L(G, A, INK, 2) + L(G, B, INK, 2) + L(G, Cc, INK, 2)
                + [[A, G, B, BLU], [B, G, Cc, AMB], [Cc, G, A, GRN]].map(([p, q, w, c]) => { const m = cen(p, q, w); return TX(f1(m[0]), f1(m[1] + 5), '1/3', { anchor: 'middle', fs: 14, c }); }).join('')
                + TX(220, 262, '以 G 為頂點的三大塊 → 各佔 1/3', { anchor: 'middle', fs: 15, c: GREY }) }
          ], { acc: false });
        },
        caption: '單獨一條中線只分成兩半；<b>六等分要三條中線一起</b>。',
        example: {
          q: '\\(\\triangle ABC\\) 面積 \\(30\\)，\\(G\\) 是重心，\\(\\triangle BGC\\) 面積？',
          steps: ['三大塊各佔 \\(\\tfrac13\\)'],
          ans: '\\(10\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '直角三角形的重心：外心和重心在同一條中線上（行有餘力）',
        points: [
          '斜邊中點 \\(O\\) 是外心，所以中線 \\(BO=\\) 斜邊的一半 \\(=5\\)。',
          '\\(G\\) 是重心：\\(GO=\\tfrac13 BO=\\tfrac53\\)。',
          '\\(\\triangle ABG=\\tfrac13\\triangle ABC=\\tfrac13\\times24=8\\)。這一頁<b>行有餘力</b>。'
        ],
        formula: { label: '直角三角形的重心<span class="pgref">課本 印 179 例 10</span>', tex: 'GO=\\tfrac13 BO' },
        visual: (h) => {
          const k = 22, B = [60, 222], A = [60, 222 - 6 * k], Cc = [60 + 8 * k, 222], O = V.mid(A, Cc), D = V.mid(B, Cc), G = cen(A, B, Cc);
          const base = PG([A, B, Cc]) + RA(B, Cc, A, 11) + NM(A, 'A', -10, 0) + NM(B, 'B', -10, 12) + NM(Cc, 'C', 10, 12) + NM(D, 'D', 0, 20) + NM(O, 'O', 12, -6, RED)
            + TX(46, 160, '6', { anchor: 'end', fs: 15, c: BLU }) + TX(104, 244, '8', { anchor: 'middle', fs: 15, c: BLU });
          const meds = L(A, D, GRN, 2.4) + L(B, O, GRN, 2.4) + PT(G, RED) + NM(G, 'G', -12, -6, RED, 14);
          const note = (lines) => lines.map(([t, c], i) => TX(258, 60 + i * 31, t, { fs: 14.5, c })).join('');
          SV.stepper(h, SECVB, [
            { t: '例 10：∠B ＝ 90°，AB ＝ 6，BC ＝ 8，中線 AD、BO 交於 G。', d: () => SECBG + base + meds },
            { t: 'O 是斜邊中點 → 外心：BO ＝ AO ＝ 5。', d: () => SECBG + base + meds + note([['AC ＝ 10', INK], ['O 是外心', RED], ['BO ＝ 10 ÷ 2 ＝ 5', RED]]) },
            { t: 'G 是重心：GO 佔 BO 的 1/3。', d: () => SECBG + base + meds + note([['BO ＝ 5', RED], ['GO ＝ ⅓ × 5 ＝ 5/3', GRN]]) },
            { t: '面積：△ABG 是三大塊之一，1/3 × 24 ＝ 8。', d: () => SECBG + PG([A, B, G], { fill: 'rgba(5,150,105,.16)', stroke: 'none' }) + base + meds + note([['GO ＝ 5/3', GRN], ['△ABC ＝ 24', INK], ['△ABG ＝ ⅓ × 24 ＝ 8', GRN]]) }
          ], { acc: false });
        },
        caption: '同一個直角三角形，<b>外心在斜邊中點、重心在那條中線上</b>，但兩點不是同一點。',
        example: {
          q: '直角三角形斜邊 \\(12\\)，斜邊上的中線長多少？',
          steps: ['斜邊中點是外心，中線 ＝ 外接圓半徑'],
          ans: '\\(6\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '平行四邊形裡的兩個重心：對角線被切成三等分（行有餘力）',
        points: [
          '平行四邊形對角線互相平分：\\(O\\) 是 \\(AC\\)、\\(BD\\) 的中點。',
          '在 \\(\\triangle ABC\\) 裡，\\(AH\\)、\\(BO\\) 是中線 → \\(G\\) 是重心；\\(\\triangle ACD\\) 裡 \\(F\\) 也是。',
          '\\(BG=\\tfrac23BO\\)、\\(FD=\\tfrac23OD\\) → \\(BG=GF=FD\\)。這一頁<b>行有餘力</b>。'
        ],
        formula: { label: '重心的應用<span class="pgref">課本 印 180 例 11</span>', tex: 'BG=GF=FD' },
        visual: (h) => {
          const A = [110, 40], D = [390, 40], B = [30, 210], Cc = [310, 210], O = V.mid(A, Cc), H = V.mid(B, Cc), E = V.mid(Cc, D);
          const G = xline(A, H, B, D), F = xline(A, E, B, D);
          const base = PG([A, D, Cc, B]) + L(B, D, INK, 2) + L(A, Cc, GREY, 1.6)
            + NM(A, 'A', -8, -8) + NM(D, 'D', 8, -8) + NM(B, 'B', -10, 10) + NM(Cc, 'C', 10, 10) + NM(O, 'O', 4, 18, GREY, 13) + NM(H, 'H', 0, 20, GREY, 13) + NM(E, 'E', 12, 0, GREY, 13);
          SV.stepper(h, SECVB, [
            { t: '例 11：E、H 是中點，AE、AH 交 BD 於 F、G。', d: () => SECBG + base + L(A, H, AMB, 2.2) + L(A, E, AMB, 2.2) + PT(G, RED) + PT(F, RED) + NM(G, 'G', -2, -12, RED, 14) + NM(F, 'F', 4, -12, RED, 14) },
            { t: '△ABC 中：BO、AH 都是中線 → G 是重心；同理 F 是 △ACD 的重心。', d: () => SECBG + PG([A, B, Cc], { fill: 'rgba(37,99,235,.10)', stroke: 'none' }) + PG([A, Cc, D], { fill: 'rgba(217,119,6,.10)', stroke: 'none' }) + base + L(A, H, AMB, 2.2) + L(A, E, AMB, 2.2) + PT(G, RED) + PT(F, RED) + NM(G, 'G', -2, -12, RED, 14) + NM(F, 'F', 4, -12, RED, 14) },
            { t: 'BG ＝ GF ＝ FD：對角線被切成三等分。', d: () => SECBG + base + L(A, H, AMB, 2.2) + L(A, E, AMB, 2.2) + PT(G, RED) + PT(F, RED) + NM(G, 'G', -2, -12, RED, 14) + NM(F, 'F', 4, -12, RED, 14)
                + TK(B, G, 1, RED) + TK(G, F, 1, RED) + TK(F, D, 1, RED) + TX(220, 262, 'BG ＝ GF ＝ FD', { anchor: 'middle', fs: 17, c: GRN }) }
          ], { acc: false });
        },
        caption: '課本隨堂印 180 是長方形的同一招：<b>先認出哪個三角形、哪個點是重心</b>，再用 2：1。',
        example: {
          q: '承上，\\(BD=18\\)，\\(GF=\\)？',
          steps: ['三等分：\\(18\\div3\\)'],
          ans: '\\(6\\)'
        }
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '回頭看：三個心，一張表',
        points: [
          '<b>外心</b>：中垂線、到頂點等距、會跑（銳內、直在斜邊中點、鈍外）。',
          '<b>內心</b>：角平分線、到邊等距、一定在裡面；<b>重心</b>：中線、2：1、平衡點。',
          '卡住的時候回到原點：<b>這是哪三條線的交點？</b>'
        ],
        formula: { label: '三心比較<span class="pgref">課本 印 181–182 重點回顧</span>', tex: '\\text{外頂內邊，重心 }2:1' },
        visual: (h) => {
          const CARD = [
            ['外心', '中垂線，到頂點等距', BLU],
            ['內心', '角平分線，到邊等距', AMB],
            ['重心', '中線，切成 2：1', GRN],
            ['位置', '只有外心會跑出去', RED]
          ];
          SV.stepper(h, SECVB, [
            { t: '課本重點回顧：三個心。', d: () => SECBG + TX(14, 34, '課本 印 181–182 重點回顧', { fs: 15, c: GREY }) + secCards(CARD, false, -1) },
            { t: '每個心各是一種線的交點，各有一個等距或比例。', d: () => SECBG + TX(14, 34, '三個心，一張表', { fs: 15, c: GREY }) + secCards(CARD, true, 3) },
            { t: '所以整節只有<b>兩個動作</b>。', d: () => SECBG + TX(220, 34, '整節只有兩個動作', { anchor: 'middle', fs: 16, c: GREY })
                + secActTwo([
                    ['① 先看是哪三條線', '中垂線、角平分線、還是中線', GRN],
                    ['② 再用它的性質', '外頂內邊、重心 2：1、面積公式', BLU]
                  ], ['外接圓、內切圓搞混時，回到「外頂內邊」']) }
          ], { acc: false });
        },
        caption: '三心混在一起時，<b>只答名稱不算會</b>——要說得出「畫哪三條線」。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '最常錯的三件事',
        points: [
          '三個錯分別出在<b>等距的對象、半徑畫錯、2：1 的方向</b>。',
          '第一個用口訣擋：外頂內邊。',
          '第二個用直角記號擋，第三個用三格條擋。'
        ],
        formula: { label: '動筆前先問<span class="pgref">課本 印 181–182 重點回顧</span>', tex: '\\text{這是哪三條線的交點？}' },
        visual: (h) => {
          h.innerHTML = xoRows([
            { tag: '等距的對象互換', bad: '內心到三個<b>頂點</b>一樣遠', good: '外心到<b>頂點</b>、內心到<b>邊</b><br>（外頂內邊）' },
            { tag: '半徑畫成 IA', bad: '內切圓半徑 \\(=IA\\)', good: '半徑是 \\(I\\) 到邊的<b>垂直</b>距離 \\(ID\\)' },
            { tag: '2：1 方向顛倒', bad: '中線 \\(AD=12\\)<br>\\(AG=4\\)、\\(GD=8\\)', good: '頂點那段長：<br>\\(AG=8\\)、\\(GD=4\\)' }
          ]);
          MJ(h);
        },
        caption: '每一題動筆前先說一句：<b>這是外心、內心，還是重心？</b>'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜課本隨堂（外心）',
        points: [
          '印 159 是作圖：畫兩條中垂線，交點就是外心。',
          '印 160：直角三角形，外心在斜邊中點。',
          '⚠ 作圖題只要畫得出交點，不要求全套作圖痕跡。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 159、160</span>', tex: 'R=\\dfrac{\\text{斜邊}}{2}' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '課本', page: '印 159', sub: '作圖，老師示範', tags: ['課P159 第1題', '課P159 第2題'], level: '標準' },
            { src: '課本', page: '印 160', sub: '直角三角形的外心', tags: ['課P160 第1題', '課P160 第2題'] }
          ]);
        },
        caption: '印 160 兩題都是直角三角形：<b>先找斜邊、再取一半</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜課本隨堂（外心與角度）',
        points: [
          '印 162 第 1 題：銳角三角形，圓心角 ＝ 2 × 圓周角。',
          '印 162 第 2 題是<b>鈍角</b>三角形，不能直接乘 2——行有餘力。',
          '印 161、163 要列方程式或畫外接圓，行有餘力。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 161–163</span>', tex: '\\angle BOC=2\\angle A' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '課本', page: '印 162', sub: '外心與角度', tags: ['課P162 第1題'] },
            { src: '課本', page: '印 161–163', sub: '行有餘力', tags: ['課P161', '課P162 第2題', '課P163'], level: '進階' }
          ]);
        },
        caption: '鈍角那題點開看：外心跑到外面，<b>對的弧換成另一段</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜課本隨堂（內心與角度、面積比）',
        points: [
          '印 167 是作圖：畫兩條角平分線，交點就是內心。',
          '印 168 兩題：角平分線把角除以 2，再用內角和。',
          '印 169 兩題：面積比 ＝ 三邊的比。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 167–169</span>', tex: '\\triangle AIB:\\triangle BIC:\\triangle CIA=AB:BC:CA' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '課本', page: '印 167', sub: '作圖，老師示範', tags: ['課P167'], level: '標準' },
            { src: '課本', page: '印 168、169', sub: '內心與角度、面積比', tags: ['課P168 第1題', '課P168 第2題', '課P169 第1題', '課P169 第2題'] }
          ]);
        },
        caption: '印 168 第 2 題反過來：已知 \\(\\angle QIR\\)，先算 \\(\\angle Q+\\angle R\\) 的一半。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜課本隨堂（內切圓半徑）',
        points: [
          '印 170、171：面積 ＝ ½ × r × 周長。',
          '印 173：直角三角形，r ＝（兩股和 − 斜邊）÷ 2。',
          '算完用另一個公式驗一次。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 170–173</span>', tex: '\\text{面積}=\\tfrac12\\times r\\times\\text{周長}' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '課本', page: '印 170–173', sub: '內切圓半徑', tags: ['課P170', '課P171', '課P173'] }
          ]);
        },
        caption: '印 171 的 \\(ID\\) 就是半徑——它是<b>垂直</b>量到 \\(AB\\) 的。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜課本隨堂（重心）',
        points: [
          '印 177 兩題：重心把中線分成 2：1。',
          '印 178 是證明：用「等底同高」證六等分。',
          '印 179、180 混入直角外心或長方形，行有餘力。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 177–180</span>', tex: 'AG:GD=2:1' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '課本', page: '印 177、178', sub: '重心 2：1 與面積', tags: ['課P177 第1題', '課P177 第2題', '課P178'] },
            { src: '課本', page: '印 179、180', sub: '行有餘力', tags: ['課P179', '課P180'], level: '進階' }
          ]);
        },
        caption: '印 177 第 1 題給的是 \\(GM+GN\\)（短的那兩段）：短段 1 份，整條是 3 份。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜習作暖身題',
        points: [
          '三題剛好一心一題：外心、內心、重心。',
          '先說是哪一個心、跟誰等距或分成幾比幾。',
          '再選答案。'
        ],
        formula: { label: '暖身重點', tex: '\\text{外頂內邊，重心 }2:1' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '習作', page: '印 47', sub: '暖身題，課堂一起做', tags: ['暖身1', '暖身2', '暖身3'] }
          ]);
        },
        caption: '暖身題點開有逐行詳解——<b>先自己選，再點開對</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜習作基礎（1～3，外心）',
        points: [
          '基礎 1：直角三角形，外接圓半徑 ＝ 斜邊一半。',
          '基礎 2 是等腰三角形列方程式，<b>老師帶著做</b>。',
          '基礎 3：銳角三角形，∠BOC ＝ 2∠A。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 160–162</span>', tex: 'R=\\dfrac{\\text{斜邊}}{2}' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '習作', page: '印 48', sub: '外心', tags: ['基礎1'] },
            { src: '習作', page: '印 48', sub: '老師帶著做', tags: ['基礎2'], level: '標準' },
            { src: '習作', page: '印 48', sub: '外心與角度', tags: ['基礎3'] }
          ]);
        },
        caption: '基礎 1 問的是外接圓<b>面積</b>：半徑算出來之後還要再算一步。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜習作基礎（4～6，內心）',
        points: [
          '基礎 4：已知 \\(\\angle EIF\\)，倒推 \\(\\angle D\\)。',
          '基礎 5 是會考仿題，<b>老師帶著做</b>。',
          '基礎 6：直角三角形的內切圓半徑——這一題要自己會。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 168–173</span>', tex: 'r=\\dfrac{\\text{兩股和}-\\text{斜邊}}{2}' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '習作', page: '印 49', sub: '內心與角度', tags: ['基礎4'] },
            { src: '習作', page: '印 49', sub: '老師帶著做', tags: ['基礎5'], level: '標準' },
            { src: '習作', page: '印 50', sub: '直角三角形的內切圓', tags: ['基礎6'] }
          ]);
        },
        caption: '基礎 6 先用畢氏算出 \\(AB=8\\)，再用 \\(r=(8+15-17)\\div2\\)。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜習作基礎（7～9，重心）',
        points: [
          '基礎 7：先圈出「\\(D\\)、\\(E\\) 是中點」，認出重心，再用 2：3。',
          '基礎 8 混了外心、重心、面積，<b>老師帶著做</b>。',
          '基礎 9：重心面積三分——這一題要自己會。'
        ],
        formula: { label: '這一節在練<span class="pgref">課本 印 176–179</span>', tex: '\\triangle AGB=\\tfrac13\\triangle ABC' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '習作', page: '印 50', sub: '重心與比例', tags: ['基礎7'] },
            { src: '習作', page: '印 51', sub: '老師帶著做', tags: ['基礎8'], level: '標準' },
            { src: '習作', page: '印 51', sub: '重心與面積', tags: ['基礎9'] }
          ]);
        },
        caption: '第 9 節收齊基礎 1～9；<b>2、5、8 三題向老師口頭說出一個關鍵步驟</b>就算過。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '練習｜習作精熟（行有餘力）',
        points: [
          '精熟 1：等腰三角形的外接圓，連 \\(BO\\) 列畢氏。',
          '精熟 2：平行四邊形裡的重心，先連對角線 \\(BD\\)。',
          '兩題都是行有餘力，做不完不影響過關。'
        ],
        formula: { label: '精熟重點', tex: 'BG=GF=FD' },
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.page(h, '3-2', [
            { src: '習作', page: '印 52', sub: '精熟題，行有餘力', tags: ['精熟1', '精熟2'], level: '進階' }
          ]);
        },
        caption: '精熟 2 跟課本例 11 同一招：<b>平行四邊形的對角線被兩個重心切成三等分</b>。'
      },

      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '對答案｜習作 ①（暖身、基礎 1～5）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.answerKey(h, '3-2', [
            { label: '暖身（印 47）', cols: 3, items: [['暖 1', '暖身1'], ['暖 2', '暖身2'], ['暖 3', '暖身3']] },
            { label: '基礎 1～3 外心（印 48）', cols: 3, items: [['1', '基礎1'], ['2', '基礎2'], ['3', '基礎3']] },
            { label: '基礎 4、5 內心（印 49）', cols: 3, items: [['4', '基礎4'], ['5', '基礎5']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      },
      {
        sec: '3-2', secName: '三角形的外心、內心與重心',
        title: '對答案｜習作 ②（基礎 6～9、精熟）',
        points: [
          '先<b>交換改</b>：只對答案，不看過程。',
          '答案錯的那幾題，回前面的練習頁<b>點題號看逐行詳解</b>。',
          '按 🔍 <b>放大</b>投成整頁，後排看得比較清楚。'
        ],
        visual: (h) => {
          if (!PRAC(h)) return;
          PRACTICE.answerKey(h, '3-2', [
            { label: '基礎 6 內心（印 50）', cols: 3, items: [['6', '基礎6']] },
            { label: '基礎 7～9 重心（印 50、51）', cols: 3, items: [['7', '基礎7'], ['8', '基礎8'], ['9', '基礎9']] },
            { label: '精熟（印 52）', cols: 2, items: [['精 1', '精熟1'], ['精 2', '精熟2']] }
          ]);
        },
        caption: '只到「答」這一層——<b>為什麼錯，回前面的練習頁點題號看詳解</b>。'
      }
    ]
  });
})();
