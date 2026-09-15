window.FIG = (function () {
  const INK = '#17212B', ANS = '#C2185B', AUX = '#9aa4b4', GRID = '#dfe5ef';

  const FRAC = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾' };
  function tx(s) {
    if (s == null) return '';
    let t = String(s).replace(/\$/g, '');
    t = t.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
      (m, a, b) => FRAC[a + '/' + b] || (a + '/' + b));
    t = t.replace(/\\degree/g, '°').replace(/\\cdot/g, '·')
         .replace(/\\times/g, '×').replace(/\\sim/g, '∼').replace(/\\angle/g, '∠')
         .replace(/\\triangle/g, '△').replace(/\\parallel/g, '∥').replace(/\\perp/g, '⊥');
    t = t.replace(/\\pi/g, 'π').replace(/\\Leftrightarrow/g, '⇔');

    t = t.replace(/\\sqrt\{([^{}]+)\}/g, (m, a) => '√' + (/^[0-9A-Za-z]+$/.test(a) ? a : '(' + a + ')'));

    const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
    const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    t = t.replace(/_\{?(\d)\}?/g, (m, d) => SUB[d] || m)
         .replace(/\^\{?(\d)\}?/g, (m, d) => SUP[d] || m);

    t = t.replace(/\\(overline|overrightarrow|overleftrightarrow|overleftarrow)\{([^{}]+)\}/g, '$2');

    return t.replace(/\\([a-zA-Z]+)/g, (m, c) => '⟨' + c + '?⟩').replace(/[{}]/g, '');
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const T = (x, y, s, o = {}) =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${o.anchor || 'middle'}"
      font-size="${o.fs || 14}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${esc(s)}</text>`;
  const L = (x1, y1, x2, y2, o = {}) =>
    `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="${o.c || INK}" stroke-width="${o.w || 2}"${o.dash ? ' stroke-dasharray="6 5"' : ''}
      stroke-linecap="round"/>`;
  const wrap = (w, h, inner) =>
    `<div style="width:100%;text-align:center"><svg viewBox="0 0 ${Math.ceil(w)} ${Math.ceil(h)}"
      style="max-width:100%;max-height:100%">${inner}</svg></div>`;

  const accentEls = (o) => (o.points || []).filter(p => p.accent)
                    .concat((o.segments || []).filter(g => g.accent))
                    .concat((o.sides || []).filter(g => g.accent));

  function accentCount(fig) {
    if (!fig || typeof fig === 'string') return 0;

    if (fig.type === 'ratio-table') return Math.max(0, (fig.rulesAfter || []).length);
    const els = accentEls(fig).concat(...(fig.shapes || []).map(accentEls));
    const steps = els.map(e => e.step).filter(v => typeof v === 'number');
    return steps.length ? Math.max(...steps) : els.length;
  }

  function gateOf(o, opt) {
    const lim = opt.accentStep;
    const pts = (o.points || []).map((p, i) => p.accent ? i : -1).filter(i => i >= 0);
    const segs = (o.segments || []).map((g, i) => g.accent ? i : -1).filter(i => i >= 0);
    const sds = (o.sides || []).map((g, i) => g.accent ? i : -1).filter(i => i >= 0);
    const ok = (el, fallbackOrder) => {
      if (lim === undefined) return true;
      return typeof el.step === 'number' ? el.step <= lim : fallbackOrder < lim;
    };
    return {
      pt: (i) => ok((o.points || [])[i] || {}, pts.indexOf(i)),
      seg: (i) => ok((o.segments || [])[i] || {}, pts.length + segs.indexOf(i)),
      side: (i) => ok((o.sides || [])[i] || {}, pts.length + segs.length + sds.indexOf(i)),
    };
  }

  const bisect = (o, a, b) => {
    const u = (p) => { const dx = p[0] - o[0], dy = p[1] - o[1], n = Math.hypot(dx, dy) || 1; return [dx / n, dy / n]; };
    const [ax, ay] = u(a), [bx, by] = u(b);
    let vx = ax + bx, vy = ay + by, n = Math.hypot(vx, vy);
    if (n < 1e-6) { vx = -ay; vy = ax; n = 1; }
    return [vx / n, vy / n];
  };
  function angleArcs(o, a, b, count, r0) {
    const A = Math.atan2(a[1] - o[1], a[0] - o[0]), B = Math.atan2(b[1] - o[1], b[0] - o[0]);
    let d = B - A;
    while (d <= -Math.PI) d += 2 * Math.PI;
    while (d > Math.PI) d -= 2 * Math.PI;
    let g = '';
    for (let k = 0; k < Math.min(3, Math.max(1, count)); k++) {
      const r = r0 + k * 5;
      const P1 = [o[0] + r * Math.cos(A), o[1] + r * Math.sin(A)];
      const P2 = [o[0] + r * Math.cos(A + d), o[1] + r * Math.sin(A + d)];
      g += `<path d="M ${P1[0].toFixed(1)} ${P1[1].toFixed(1)} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${P2[0].toFixed(1)} ${P2[1].toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
    }
    return g;
  }
  function tickMarks(a, b, count) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n, px = -uy, py = ux, L = 5.5;
    let g = '';
    const c = Math.min(3, Math.max(1, count));
    for (let k = 0; k < c; k++) {
      const off = (k - (c - 1) / 2) * 4.5;
      const cx2 = mx + ux * off, cy2 = my + uy * off;
      g += L2(cx2 - px * L, cy2 - py * L, cx2 + px * L, cy2 + py * L);
    }
    return g;
  }
  const L2 = (x1, y1, x2, y2) => L(x1, y1, x2, y2, { w: 1.8 });
  function rightAngleMark(o, a, b, sz) {
    const u = (p) => { const dx = p[0] - o[0], dy = p[1] - o[1], n = Math.hypot(dx, dy) || 1; return [dx / n * sz, dy / n * sz]; };
    const u1 = u(a), u2 = u(b);
    const p1 = [o[0] + u1[0], o[1] + u1[1]], p2 = [o[0] + u2[0], o[1] + u2[1]];
    const p3 = [p1[0] + u2[0], p1[1] + u2[1]];
    return `<polyline points="${[p1, p3, p2].map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  }

  function awayDir(q, incident, base) {
    const dirs = [];
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; dirs.push([Math.cos(a), Math.sin(a)]); }
    let best = base, bestScore = -Infinity;
    dirs.forEach(d => {

      let perp = 1;
      incident.forEach(u => { perp = Math.min(perp, Math.abs(d[0] * u[1] - d[1] * u[0])); });
      const out = base ? d[0] * base[0] + d[1] * base[1] : 0;
      const score = perp + 0.35 * out;
      if (score > bestScore) { bestScore = score; best = d; }
    });
    return best;
  }

  function placeLabels(labels) {
    const placed = [];
    const boxOf = (l, d) => {
      const fs = l.fs || 14;
      const w = Math.max(l.text.length, 1) * fs * 0.62, h = fs;
      const cx = l.x + l.ux * d, cy = l.y + l.uy * d;
      return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
    };
    const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    let out = '';
    labels.forEach(l => {
      const d0 = l.d0 || 15;
      let box = null;
      for (const d of [d0, d0 + 8, d0 + 16, d0 + 24]) {
        box = boxOf(l, d);
        if (!placed.some(q => hit(q, box))) break;
      }
      placed.push(box);
      out += T(box.cx, box.cy + (l.fs || 14) * 0.36, l.text, { fs: l.fs || 14, c: l.c, fw: l.fw });
    });

    placeLabels.bounds = placed.length ? {
      x0: Math.min(...placed.map(b => b.x)), y0: Math.min(...placed.map(b => b.y)),
      x1: Math.max(...placed.map(b => b.x + b.w)), y1: Math.max(...placed.map(b => b.y + b.h)),
    } : null;
    return out;
  }

  function growToLabels(W, H, body) {
    const b = placeLabels.bounds;
    if (!b) return wrap(W, H, body);
    const dx = Math.max(0, 3 - b.x0), dy = Math.max(0, 3 - b.y0);
    const W2 = Math.max(W, b.x1 + 3) + dx, H2 = Math.max(H, b.y1 + 3) + dy;
    return wrap(W2, H2, (dx || dy) ? `<g transform="translate(${dx.toFixed(1)},${dy.toFixed(1)})">${body}</g>` : body);
  }

  function polygonGroup(f, opt) {
    const unit = f.unit || 30, gap = f.gap || 90, PAD = 34;
    const shapes = (f.shapes || []).map(sh => {
      const pts = sh.points || [];
      const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      return { sh, pts, minX, maxX, minY, maxY,
        w: (maxX - minX) * unit, h: (maxY - minY) * unit };
    });

    const hasSides = f.shapes.some(s => (s.sides || []).length);
    const capDrop = 24 + (hasSides ? 16 : 0);
    const H = Math.max(...shapes.map(s => s.h)) + PAD * 2 + (f.shapes.some(s => s.caption) ? capDrop + 2 : 0);
    let x0 = PAD, body = '', labels = [];
    shapes.forEach(S => {
      const { sh, pts } = S;

      const P = pts.map(p => [x0 + (p.x - S.minX) * unit, PAD + (S.maxY - p.y) * unit]);
      const cx = P.reduce((a, p) => a + p[0], 0) / P.length;
      const cy = P.reduce((a, p) => a + p[1], 0) / P.length;

      const rings = sh.outlines || (sh.outline ? [sh.outline] : [pts.map((_, i) => i)]);
      rings.forEach(r => {
        if (!r || r.length < 3) return;
        const d = r.map(i => P[i].join(',')).join(' ');
        body += `<polygon points="${d}" fill="${sh.fill || 'none'}" stroke="${INK}" stroke-width="2.2"/>`;
      });
      const gate = gateOf(sh, opt);
      (sh.segments || []).forEach((g, gi) => {
        if (g.accent && !gate.seg(gi)) return;
        const a = P[g.from], b = P[g.to];
        body += L(a[0], a[1], b[0], b[1], { dash: g.dashed, c: g.accent ? ANS : INK, w: g.dashed ? 1.6 : 2 });
      });

      const sideShown = (() => {
        const best = {};
        (sh.sides || []).forEach((g, gi) => {
          if (g.accent && !gate.side(gi)) return;
          const key = [g.from, g.to].sort((x, y) => x - y).join('-');
          const rank = typeof g.step === 'number' ? g.step : (g.accent ? 0.5 : 0);
          if (!(key in best) || rank >= best[key].rank) best[key] = { gi, rank };
        });
        return new Set(Object.values(best).map(v => v.gi));
      })();

      (sh.sides || []).forEach((g, gi) => {
        if (!sideShown.has(gi)) return;
        const a = P[g.from], b = P[g.to];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const dx = mx - cx, dy = my - cy, n = Math.hypot(dx, dy) || 1;
        if (g.ticks) body += tickMarks(a, b, g.ticks);
        if (g.text) labels.push({ x: mx, y: my, ux: dx / n, uy: dy / n, text: tx(g.text), fs: 13.5,
                      c: g.accent ? ANS : '#3b4a5e', fw: g.accent ? 900 : undefined, d0: 17 });
      });

      const ring0 = rings[0] || pts.map((_, i) => i);

      (sh.angles || []).forEach(g => {
        const o = P[g.at];
        let arms;
        if (Array.isArray(g.toward) && g.toward.length === 2) arms = g.toward.map(j => P[j]);
        else {
          const k = ring0.indexOf(g.at);
          arms = (k >= 0 && ring0.length > 2)
            ? [P[ring0[(k + 1) % ring0.length]], P[ring0[(k - 1 + ring0.length) % ring0.length]]]
            : null;
        }
        let dir, reach;
        if (arms && arms[0] && arms[1]) {
          dir = bisect(o, arms[0], arms[1]);
          reach = Math.min(...arms.map(q => Math.hypot(q[0] - o[0], q[1] - o[1])));
          if (g.mark) body += angleArcs(o, arms[0], arms[1], g.mark, Math.max(13, reach * 0.2));
        } else {
          const dx = cx - o[0], dy = cy - o[1], n = Math.hypot(dx, dy) || 1;
          dir = [dx / n, dy / n]; reach = 60;
        }
        if (!g.text) return;
        const d0 = Math.max(14, reach * 0.38) + (g.mark ? 6 : 0);
        labels.push({ x: o[0], y: o[1], ux: dir[0], uy: dir[1], text: tx(g.text), fs: 13, c: '#3b4a5e', d0 });
      });
      (sh.rightAngles || []).forEach(g => {
        const o = P[g.at], a = P[(g.toward || [])[0]], b = P[(g.toward || [])[1]];
        if (o && a && b) body += rightAngleMark(o, a, b, g.size ? g.size * unit : 14);
      });
      pts.forEach((p, i) => {
        if (!p.label) return;
        const dx = P[i][0] - cx, dy = P[i][1] - cy, n = Math.hypot(dx, dy) || 1;

        labels.push({ x: P[i][0], y: P[i][1], ux: dx / n, uy: dy / n, text: tx(p.label) });
      });
      if (sh.caption) body += T(x0 + S.w / 2, PAD + Math.max(...shapes.map(s => s.h)) + capDrop, tx(sh.caption), { fs: 14, c: '#3b4a5e' });
      x0 += S.w + gap;
    });
    body += placeLabels(labels);
    return growToLabels(x0 - gap + PAD, H, body);
  }

  function gridFigure(f, opt) {
    const u = f.unit || 40, PAD = 30;
    const W = f.cols * u, H = f.rows * u;
    let g = '';
    for (let i = 0; i <= f.cols; i++) g += L(PAD + i * u, PAD, PAD + i * u, PAD + H, { c: GRID, w: 1 });
    for (let j = 0; j <= f.rows; j++) g += L(PAD, PAD + j * u, PAD + W, PAD + j * u, { c: GRID, w: 1 });
    const P = (f.points || []).map(p => [PAD + p.x * u, PAD + (f.rows - p.y) * u]);
    const gate = gateOf(f, opt);
    (f.segments || []).forEach((s, si) => {
      if (s.accent && !gate.seg(si)) return;
      g += L(P[s.from][0], P[s.from][1], P[s.to][0], P[s.to][1],
        { c: s.accent ? ANS : INK, dash: s.dashed, w: s.dashed ? 1.6 : 2.6 });
    });
    (f.points || []).forEach((p, i) => {
      if (p.accent && !gate.pt(i)) return;
      const c = p.accent ? ANS : INK;
      g += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="4" fill="${c}"/>`;
      if (p.label) g += T(P[i][0] + 13, P[i][1] - 10, tx(p.label), { fs: 15, c });
    });
    return wrap(W + PAD * 2, H + PAD * 2, g);
  }

  function segmentLine(f) {
    const u = f.unit || 34, PAD = 40, W = f.span * u;
    const y = 60;
    let g = L(PAD, y, PAD + W, y, { w: 2.6 });
    (f.points || []).forEach(p => {
      const x = PAD + p.at * u;
      g += L(x, y - 9, x, y + 9, { w: 2.6 }) + T(x, y - 17, tx(p.label), { fs: 15 });
    });
    (f.below || []).forEach(b => {
      const a = PAD + b.from * u, c = PAD + b.to * u;
      g += L(a, y + 26, c, y + 26, { c: AUX, w: 1.8 })
        + L(a, y + 21, a, y + 31, { c: AUX, w: 1.8 })
        + L(c, y + 21, c, y + 31, { c: AUX, w: 1.8 })
        + T((a + c) / 2, y + 47, tx(b.text), { fs: 14, c: '#3b4a5e' });
    });
    let h = y + 62;
    if (f.caption) { g += T(PAD + W / 2, h + 8, tx(f.caption), { fs: 14, c: '#3b4a5e' }); h += 20; }
    return wrap(W + PAD * 2, h, g);
  }

  function divisionConstruction(f) {
    const [m, n] = f.ratio || [1, 1], k = m + n, PAD = 40;
    const W = 300, step = 34, ang = -0.55;
    const A = [PAD, 120], B = [PAD + W, 120];
    let g = L(A[0], A[1], B[0], B[1], { w: 2.6 })
      + T(A[0] - 14, A[1] + 6, 'A', { fs: 15 }) + T(B[0] + 14, B[1] + 6, 'B', { fs: 15 });
    const marks = [];
    for (let i = 0; i <= k; i++) {
      const x = A[0] + Math.cos(ang) * step * i, y = A[1] + Math.sin(ang) * step * i;
      marks.push([x, y]);
    }
    g += L(A[0], A[1], marks[k][0], marks[k][1], { c: AUX, w: 1.8 });
    marks.forEach(([x, y], i) => { if (i) g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${AUX}"/>`; });

    g += L(marks[k][0], marks[k][1], B[0], B[1], { c: AUX, w: 1.8 });
    const dx = B[0] - marks[k][0], dy = B[1] - marks[k][1];
    for (let i = 1; i < k; i++) g += L(marks[i][0], marks[i][1], marks[i][0] + dx, marks[i][1] + dy, { c: AUX, w: 1.4, dash: true });

    const px = A[0] + (B[0] - A[0]) * m / k;
    g += `<circle cx="${px.toFixed(1)}" cy="${A[1]}" r="4.6" fill="${ANS}"/>`
      + T(px, A[1] + 24, `${m}：${n}`, { fs: 14, c: ANS });
    return wrap(W + PAD * 2, 180, g);
  }

  function ratioTable(f, opt) {
    const head = f.header || [], rows = f.rows || [];
    const box = f.box, rules = f.rulesAfter || [];

    const lim = opt && opt.accentStep;
    const blockOf = (i) => rules.filter(r => r < i).length;
    const hidden = (i) => lim !== undefined && blockOf(i) > lim;
    const cell = (v, r, c) => {
      const inBox = box && c === box.col && r >= box.from && r <= box.to;
      return `<td style="padding:5px 16px;text-align:center;font-size:16px;color:${INK};
        ${inBox ? `background:#fdeef2;` : ''}
        ${inBox && r === box.from ? `border-top:2px solid ${ANS};` : ''}
        ${inBox && r === box.to ? `border-bottom:2px solid ${ANS};` : ''}
        ${inBox ? `border-left:2px solid ${ANS};border-right:2px solid ${ANS};` : ''}">${v == null ? '' : esc(tx(v))}</td>`;
    };
    let html = `<table style="margin:0 auto;border-collapse:collapse">
      <tr>${head.map(h => `<th style="padding:4px 16px;font-size:14px;color:#3b4a5e">${esc(tx(h))}</th>`).join('<th></th>')}</tr>`;
    rows.forEach((r, i) => {
      const tds = [];
      r.forEach((v, c) => {
        tds.push(cell(v, i, c));
        if (c < r.length - 1) {

          const both = v != null && r[c + 1] != null;
          tds.push(`<td style="padding:0 2px;font-size:16px;color:${INK}">${both ? '：' : ''}</td>`);
        }
      });
      html += `<tr style="${rules.includes(i) ? `border-bottom:2px solid ${INK};` : ''}${hidden(i) ? 'visibility:hidden;' : ''}">${tds.join('')}</tr>`;
    });
    return `<div style="width:100%;display:flex;justify-content:center">${html}</table></div>`;
  }

  function circleFigure(f, opt) {
    const unit = f.unit || 40, PAD = 34;
    const circles = f.circles || [];

    const pts = (f.points || []).map(p => {
      if (typeof p.on !== 'number') return p;
      const c = circles[p.on] || { x: 0, y: 0, r: 1 };
      const a = (p.at || 0) * Math.PI / 180;
      return Object.assign({}, p, { x: c.x + c.r * Math.cos(a), y: c.y + c.r * Math.sin(a), _on: p.on });
    });

    const arcOnly = circles.map((c, i) =>
      c.outline === false
      && !(f.sectors || []).some(s => s.circle === i)
      && !(f.arcSegments || []).some(s => s.circle === i)
      && (f.arcs || []).some(a => a.circle === i));
    const arcExtent = (c, i) => {
      const pts2 = [];
      (f.arcs || []).filter(a => a.circle === i).forEach(a => {
        const sweep = ((a.to - a.from) % 360 + 360) % 360;
        const angs = [a.from, a.to];
        for (let k = 0; k < 4; k++) {
          const q = k * 90;
          if (((q - a.from) % 360 + 360) % 360 <= sweep) angs.push(q);
        }
        angs.forEach(t => pts2.push([c.x + c.r * Math.cos(t * Math.PI / 180),
                                     c.y + c.r * Math.sin(t * Math.PI / 180)]));
      });
      return pts2;
    };
    const xs = [], ys = [];
    circles.forEach((c, i) => {
      if (arcOnly[i]) { arcExtent(c, i).forEach(q => { xs.push(q[0]); ys.push(q[1]); }); return; }
      xs.push(c.x - c.r, c.x + c.r); ys.push(c.y - c.r, c.y + c.r);
    });
    pts.forEach(p => { xs.push(p.x); ys.push(p.y); });
    if (f.axes) { const sp = f.axes.span || 1; xs.push(-sp, sp); ys.push(-sp, sp); }
    if (!xs.length) return null;
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const hasCaption = circles.some(c => /^[（(]/.test(String(c.label || '')));
    const W = (maxX - minX) * unit + PAD * 2;
    const H = (maxY - minY) * unit + PAD * 2 + (hasCaption ? 22 : 0);
    const sx = (x) => PAD + (x - minX) * unit;
    const sy = (y) => PAD + (maxY - y) * unit;
    const P = pts.map(p => [sx(p.x), sy(p.y)]);
    const onArc = (c, deg) => [sx(c.x + c.r * Math.cos(deg * Math.PI / 180)),
                              sy(c.y + c.r * Math.sin(deg * Math.PI / 180))];
    const norm = (a, b) => ((b - a) % 360 + 360) % 360;
    const arcPath = (c, from, to) => {
      const A = onArc(c, from), B = onArc(c, to), r = c.r * unit;
      return `M ${A[0].toFixed(1)} ${A[1].toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${norm(from, to) > 180 ? 1 : 0} 0 ${B[0].toFixed(1)} ${B[1].toFixed(1)}`;
    };
    const cxy = [P.reduce((a, q) => a + q[0], 0) / (P.length || 1),
                 P.reduce((a, q) => a + q[1], 0) / (P.length || 1)];
    const gate = gateOf({ points: pts, segments: f.segments, sides: f.sides }, opt);

    let g = '';

    circles.forEach(c => {
      if (!c.fill) return;
      g += `<circle cx="${sx(c.x).toFixed(1)}" cy="${sy(c.y).toFixed(1)}" r="${(c.r * unit).toFixed(1)}" fill="${c.fill}" stroke="none"/>`;
    });

    (f.sectors || []).forEach(s => {
      const c = circles[s.circle]; if (!c) return;
      const O = [sx(c.x), sy(c.y)];
      g += `<path d="M ${O[0].toFixed(1)} ${O[1].toFixed(1)} L ${arcPath(c, s.from, s.to).slice(2)} Z" fill="${s.fill || '#eef4fb'}" stroke="${INK}" stroke-width="2"/>`;
    });
    (f.arcSegments || []).forEach(s => {
      const c = circles[s.circle]; if (!c) return;
      g += `<path d="${arcPath(c, s.from, s.to)} Z" fill="${s.fill || '#eef4fb'}" stroke="${INK}" stroke-width="2"/>`;
    });
    (f.polygons || []).forEach(g2 => {
      const d = (g2.points || []).map(i => P[i]).filter(Boolean);
      if (d.length < 3) return;
      g += `<polygon points="${d.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${g2.fill || 'none'}" stroke="${INK}" stroke-width="2"/>`;
    });

    circles.forEach(c => {
      if (c.outline === false) return;
      g += `<circle cx="${sx(c.x).toFixed(1)}" cy="${sy(c.y).toFixed(1)}" r="${(c.r * unit).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    });

    if (f.axes) {
      const x0 = sx(minX), x1 = sx(maxX), y0 = sy(minY), y1 = sy(maxY), ox = sx(0), oy = sy(0);
      g += L(x0, oy, x1, oy, { c: AUX, w: 1.6 }) + L(ox, y0, ox, y1, { c: AUX, w: 1.6 });
      if (f.axes.xLabel) g += T(x1 - 4, oy - 8, tx(f.axes.xLabel), { fs: 13, c: AUX, anchor: 'end' });
      if (f.axes.yLabel) g += T(ox + 12, y1 + 14, tx(f.axes.yLabel), { fs: 13, c: AUX, anchor: 'start' });
    }

    (f.lines || []).forEach(ln => {
      const a = pts[ln.from], b = pts[ln.to]; if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1, e = (ln.extend || 1);
      g += L(sx(a.x - dx / n * e), sy(a.y - dy / n * e), sx(b.x + dx / n * e), sy(b.y + dy / n * e), { w: 2 });
    });

    (f.segments || []).forEach((sg, i) => {
      if (sg.accent && !gate.seg(i)) return;
      const a = P[sg.from], b = P[sg.to]; if (!a || !b) return;
      g += L(a[0], a[1], b[0], b[1], { dash: sg.dashed, c: sg.accent ? ANS : INK, w: sg.dashed ? 1.6 : 2 });
    });

    (f.arcs || []).forEach(a => {
      const c = circles[a.circle]; if (!c) return;
      g += `<path d="${arcPath(c, a.from, a.to)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
    });

    (f.rightAngles || []).forEach(ra => {
      const o = P[ra.at], a = P[(ra.toward || [])[0]], b = P[(ra.toward || [])[1]];
      if (o && a && b) g += rightAngleMark(o, a, b, ra.size ? ra.size * unit : 14);
    });
    const labels = [];

    (f.angles || []).forEach(an => {
      const o = P[an.at], a = P[(an.toward || [])[0]], b = P[(an.toward || [])[1]];
      if (!o || !a || !b) return;
      const reach = Math.min(Math.hypot(a[0] - o[0], a[1] - o[1]), Math.hypot(b[0] - o[0], b[1] - o[1]));
      if (an.mark) g += angleArcs(o, a, b, an.mark, Math.max(13, reach * 0.2));
      if (an.text) {
        const dir = bisect(o, a, b);
        labels.push({ x: o[0], y: o[1], ux: dir[0], uy: dir[1], text: tx(an.text),
                      fs: 13, c: '#3b4a5e', d0: Math.max(14, reach * 0.38) + (an.mark ? 6 : 0) });
      }
    });

    const tickDone = new Set();
    (f.sides || []).forEach(sd => {
      if (!sd.ticks) return;
      const key = [sd.from, sd.to].sort((x, y) => x - y).join('-');
      if (tickDone.has(key)) return;
      tickDone.add(key);
      const a = P[sd.from], b = P[sd.to];
      if (a && b) g += tickMarks(a, b, sd.ticks);
    });

    const sideShown = (() => {
      const best = {};
      (f.sides || []).forEach((sd, i) => {
        if (sd.accent && !gate.side(i)) return;
        const key = [sd.from, sd.to].sort((x, y) => x - y).join('-');
        const rank = typeof sd.step === 'number' ? sd.step : (sd.accent ? 0.5 : 0);
        if (!(key in best) || rank >= best[key].rank) best[key] = { i, rank };
      });
      return new Set(Object.values(best).map(v => v.i));
    })();
    (f.sides || []).forEach((sd, i) => {
      if (!sideShown.has(i)) return;
      const a = P[sd.from], b = P[sd.to]; if (!a || !b) return;

      const pa = pts[sd.from], pb = pts[sd.to];
      const joined = (f.segments || []).some(g =>
        (g.from === sd.from && g.to === sd.to) || (g.from === sd.to && g.to === sd.from));
      const onSame = (!joined && pa && pb) ? circles.findIndex(c => {
        const da = Math.hypot(pa.x - c.x, pa.y - c.y), db = Math.hypot(pb.x - c.x, pb.y - c.y);
        return Math.abs(da - c.r) < c.r * 0.02 && Math.abs(db - c.r) < c.r * 0.02;
      }) : -1;
      if (onSame >= 0) {
        const c = circles[onSame];
        const ang = (p) => Math.atan2(p.y - c.y, p.x - c.x) * 180 / Math.PI;
        const a1 = ang(pa), a2 = ang(pb);
        const mid = a1 + (((a2 - a1) % 360 + 540) % 360 - 180) / 2;
        const rad = mid * Math.PI / 180;
        const q = [sx(c.x + c.r * Math.cos(rad)), sy(c.y + c.r * Math.sin(rad))];
        labels.push({ x: q[0], y: q[1], ux: Math.cos(rad), uy: -Math.sin(rad), text: tx(sd.text),
                      fs: 13.5, c: sd.accent ? ANS : '#3b4a5e', fw: sd.accent ? 900 : undefined, d0: 17 });
        return;
      }
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let dx = mx - cxy[0], dy = my - cxy[1], n = Math.hypot(dx, dy);
      if (n < 1) { dx = -(b[1] - a[1]); dy = b[0] - a[0]; n = Math.hypot(dx, dy) || 1; }

      const sl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const d = awayDir([mx, my], [[(b[0] - a[0]) / sl, (b[1] - a[1]) / sl]], [dx / n, dy / n]);
      labels.push({ x: mx, y: my, ux: d[0], uy: d[1], text: tx(sd.text),
                    fs: 13.5, c: sd.accent ? ANS : '#3b4a5e', fw: sd.accent ? 900 : undefined, d0: 15 });
    });

    const incidentOf = (i) => {
      const out = [];
      const add = (a, b) => {
        if (a !== i && b !== i) return;
        const j = a === i ? b : a, u = P[j]; if (!u) return;
        const dx = u[0] - P[i][0], dy = u[1] - P[i][1], n = Math.hypot(dx, dy) || 1;
        out.push([dx / n, dy / n]);
      };
      (f.segments || []).forEach(sg => add(sg.from, sg.to));
      (f.lines || []).forEach(ln => add(ln.from, ln.to));
      (f.polygons || []).forEach(pg => {
        const ps = pg.points || [];
        ps.forEach((a, k) => add(a, ps[(k + 1) % ps.length]));
      });
      return out;
    };
    pts.forEach((p, i) => {
      if (p.accent && !gate.pt(i)) return;
      const q = P[i];
      g += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.2" fill="${p.accent ? ANS : INK}"/>`;
      if (!p.label) return;
      let dx, dy;
      if (typeof p._on === 'number') { const c = circles[p._on]; dx = q[0] - sx(c.x); dy = q[1] - sy(c.y); }
      else { dx = q[0] - cxy[0]; dy = q[1] - cxy[1]; }
      let n = Math.hypot(dx, dy);
      if (n < 4) { dx = -1; dy = 1; n = Math.SQRT2; }
      const d = awayDir(q, incidentOf(i), [dx / n, dy / n]);
      labels.push({ x: q[0], y: q[1], ux: d[0], uy: d[1], text: tx(p.label),
                    fs: 14, c: p.accent ? ANS : INK, d0: 16 });
    });

    const isCaption = (t) => /^[（(]/.test(String(t));
    const capY = H - PAD * 0.45;
    circles.forEach(c => {
      if (!c.label) return;
      const q = [sx(c.x), sy(c.y)];
      if (isCaption(c.label)) {
        g += T(q[0], capY, tx(c.label), { fs: 14, c: '#3b4a5e' });
        return;
      }
      g += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.2" fill="${INK}"/>`;
      let dx = q[0] - cxy[0], dy = q[1] - cxy[1], n = Math.hypot(dx, dy);
      if (n < 1) { dx = -1; dy = 1; n = Math.SQRT2; }
      labels.push({ x: q[0], y: q[1], ux: dx / n, uy: dy / n, text: tx(c.label), fs: 14, c: INK, d0: 16 });
    });
    g += placeLabels(labels);
    return growToLabels(W, H, g);
  }

  const TYPES = {
    'polygon-group': polygonGroup,
    'grid-figure': gridFigure,
    'segment-line': segmentLine,
    'division-construction': divisionConstruction,
    'ratio-table': ratioTable,
    'circle-figure': circleFigure,
  };

  function render(fig, opt) {
    opt = opt || {};
    if (!fig || typeof fig === 'string') return null;
    const fn = TYPES[fig.type];
    if (!fn) return null;

    const step = opt.accentStep !== undefined ? opt.accentStep
               : (opt.showAccent === false ? 0 : undefined);
    try { return fn(fig, { accentStep: step }); }
    catch (e) { return null; }
  }
  return { render, accentCount, tx, types: Object.keys(TYPES) };
})();
