window.PRACTICE = (function () {
  const DEF = {
    site: 'textbook', list: 'question', detail: 'segments', zoomFit: 'none', fitFloor: 0.6,
    theme: { ink: '#0b1220', grey: '#475569', grn: '#065f46', accent: '#1e40af',
             border: '#94a3b8', sub: '#334155', back: '#94a3b8', hover: '#f2f6ff' },
    font: { tag: '15px', q: '18px', tex: '13.5px', text: '13px', ans: '12.5px', go: '20px' },
    srcColors: {},
  };
  const USR = (typeof window !== 'undefined' && window.PRACTICE_CONFIG) || {};
  const CFG = Object.assign({}, DEF, USR, {
    theme: Object.assign({}, DEF.theme, USR.theme || {}),
    font: Object.assign({}, DEF.font, USR.font || {}),
    srcColors: Object.assign({}, DEF.srcColors, USR.srcColors || {}),
  });
  const T = CFG.theme, F = CFG.font;
  const INK = T.ink, GREY = T.grey, GRN = T.grn, C = T.accent;
  const SRCCOL = CFG.srcColors;
  const accentOf = (opt) => (opt && opt.accent) || C;

  const CONT = ['', ' 續', ' 續一', ' 續二', ' 續三', ' 續四', ' 續五'];
  const SUBRE = /\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫].*$/;

  const BOILER = /^承上[，,]?[^$]{0,24}。?$/;

  const S = (sec) => (window.SOLUTIONS || {})[sec] || {};

  const figSvg = (d) => (d && d.fig && ((window.FIGURES_LOCAL || {})[d.fig] || (window.FIGURES || {})[d.fig])) || null;

  const tex = (t) => String(t || '').replace(/\$([^$]+)\$/g, (_, m) => '\\(' + m.replace(/</g, '\\lt ') + '\\)');
  const MJx = (h) => { if (window.MJ) window.MJ(h); };

  const isFill = (q) => /完成/.test(String(q || ''));

  const cellHtml = (c) => {
    const segs = String(c == null ? '' : c).replace(/～/g, '～\u0000').replace(/（/g, '\u0000（').split('\u0000').filter(Boolean);
    const ok = segs.every(s => (s.match(/\$/g) || []).length % 2 === 0);
    return (ok ? segs : [String(c == null ? '' : c)]).map(s => `<span style="white-space:nowrap">${tex(s)}</span>`).join('');
  };
  const tblHtml = (rows) => `<table style="border-collapse:collapse;font-size:16px;margin:2px 0;color:${INK}">${
    (rows || []).map((r, i) => `<tr>${r.map((c, j) => `<td style="border:1.5px solid ${T.border};padding:3px 8px;text-align:center;${
      j === 0 ? 'font-weight:800;background:#f3f6fb;' : ''}${i === 0 ? 'font-weight:800;' : ''}">${cellHtml(c)}</td>`).join('')}</tr>`).join('')}</table>`;

  function merged(sec, tag) {
    const all = S(sec);
    if (SUBRE.test(tag) && all[tag]) {
      const d = all[tag];
      return Object.assign({}, d, { steps: (d.steps || []).slice(), ans: d.ans || '',
                                    key: d.key || d.ans || '', fig: d.fig || null });
    }
    const base = all[tag] ? tag : tag.replace(SUBRE, '');
    const d0 = all[base];
    if (!d0) return null;
    const steps = [], ansParts = [], qParts = [], keyParts = [];
    for (const suf of CONT) {
      const d = all[base + suf];
      if (!d) continue;
      const q = String(d.q || '').trim();
      if (q && !qParts.includes(q) && !BOILER.test(q)) qParts.push(q);
      for (const st of d.steps || []) steps.push(st);
      if (d.ans && !ansParts.includes(d.ans)) ansParts.push(d.ans);
      const k = d.key || d.ans;
      if (k && !keyParts.includes(k)) keyParts.push(k);
    }
    return Object.assign({}, d0, { q: qParts.join('\n'), steps,
      ans: ansParts.join('　'), key: keyParts.join('　'), fig: d0.fig || null });
  }

  const CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳';
  const labNum = (s) => { const i = CIRC.indexOf(s); if (i >= 0) return i + 1; const m = /\d+/.exec(s); return m ? +m[0] : 0; };
  function answerLabels(a) {
    const out = [];
    const re = /[①-⑳]|[(（]\d+[)）]/g;
    let inMath = false, from = 0;
    const s = String(a);
    for (let i = 0; i <= s.length; i++) {
      if (i === s.length || s[i] === '$') {
        if (!inMath) {
          const chunk = s.slice(from, i);
          let m; re.lastIndex = 0;
          while ((m = re.exec(chunk))) out.push({ at: from + m.index, len: m[0].length, n: labNum(m[0]) });
        }
        inMath = !inMath; from = i + 1;
      }
    }
    return out;
  }
  const cleanAns = (a) => String(a || '').trim().replace(/^答\s*[：:]\s*/, '');
  const choiceOnly = (a) => { const m = /^選\s*([(（]\s*[A-Ea-e]\s*[)）])/.exec(a); return m ? m[1] : a; };

  function rowAnswer(sec, tag, label) {
    const d = merged(sec, tag);
    if (!d) return '';
    let a = cleanAns(d.key || d.ans);
    if (!a) return '';
    const tm = /[①-⑳]/.exec(tag) || (label ? /[①-⑳]/.exec(label) : null);
    if (tm) {
      const want = labNum(tm[0]);
      const labs = answerLabels(a);
      const hit = labs.findIndex(l => l.n === want);
      if (labs.length >= 2 && hit >= 0) {
        const L = labs[hit], nx = labs[hit + 1];
        a = a.slice(L.at + L.len, nx ? nx.at : a.length).trim().replace(/[；;，,、]+$/, '').trim();
      } else if (labs.length === 1 && hit === 0 && !a.slice(0, labs[0].at).trim()) {
        a = a.slice(labs[0].at + labs[0].len).trim();
      }
    }
    return tex(choiceOnly(a));
  }

  const rowLabel = (tag, d) =>
    /^印\s*\d+/.test(tag) && d.page ? tag.replace(/^印\s*\d+/, d.page.replace(/\s+/g, ' ')) : tag;

  const pDropCont = (t) => t.replace(/\s*續[一二三四五六七八九十]?(?=\s*(?:[①-⑳]\s*)?$)/, '');
  const pLabel = (sec, tag) => {
    if (!/^印\s*\d+/.test(tag)) return pDropCont(tag);
    const all = S(sec);
    const d = all[tag] || all[tag.replace(SUBRE, '')];
    return pDropCont(d && d.page ? tag.replace(/^印\s*\d+/, d.page.replace(/\s+/g, ' ')) : tag);
  };

  const pRelabel = (h, sec) => h.querySelectorAll('.p-row').forEach(r => {
    const el = r.querySelector('.p-tag');
    if (el) el.textContent = r.dataset.label || pLabel(sec, r.dataset.tag);
  });

  const texWide = (p) => p
    .replace(/\$/g, '')
    .replace(/\\(?:frac|dfrac|tfrac|overline|sqrt|times|div|cdot|ne|le|ge|pm|left|right|text|mathrm)\b/g, 'xx')
    .replace(/\\[a-zA-Z]+/g, 'x')
    .replace(/[{}]/g, '')
    .length;

  const short = (s, n) => {
    const one = String(s || '').split('\n')[0];
    const parts = one.split(/(\$[^$]*\$)/).filter(Boolean);
    let out = '', len = 0, gotMath = false;
    for (const p of parts) {
      const math = p.startsWith('$');
      const vis = math ? texWide(p) : p.length;
      if (len + vis > n && !(math && !gotMath)) {
        if (!math) out += p.slice(0, Math.max(0, n - len));
        return tex(out.replace(/\s+$/, '')) + '…';
      }
      out += p; len += vis;
      if (math) gotMath = true;
    }
    return tex(out.replace(/\s+/g, ' ').trim());
  };

  const qHtml = (q) => String(q || '').split('\n').filter(Boolean)
    .map((seg, i) => `<div style="${i ? 'margin-top:7px' : ''}">${tex(seg)}</div>`).join('');

  function qRow(sec, tag) {
    const d = merged(sec, tag);
    if (!d) return '';
    return `<div class="q-row" data-tag="${tag}" style="display:flex;gap:12px;align-items:baseline;padding:9px 0;border-radius:8px;cursor:pointer">
      <span style="flex:0 0 92px;font-size:${F.tag};font-weight:900;color:${GREY};white-space:nowrap">${rowLabel(tag, d)}</span>
      <span style="flex:1;font-size:${F.q};color:${INK};line-height:1.5">${short(d.q, 26)}</span>
      ${d.fig && !figSvg(d) ? `<span title="ocho 沒有這張圖，要看紙本" style="flex:0 0 auto;font-size:12px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:6px;padding:0 6px;white-space:nowrap">無圖</span>` : ''}
      <span style="flex:0 0 14px;text-align:right;font-size:${F.go};font-weight:900;color:${C}">›</span></div>`;
  }

  const qCard = (src, page, sub, rows) => {
    const col = SRCCOL[src] || C;
    return `<div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:7px 15px">
        <span style="font-size:16px;font-weight:900;color:#fff;letter-spacing:.03em">${src}</span>
        <span style="font-size:15px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 10px">${page}</span>
      </div>
      <div style="padding:8px 15px 10px">${sub ? `<div style="font-size:13.5px;color:${T.sub};margin-bottom:4px">${sub}</div>` : ''}${rows}</div></div>`;
  };

  function page(h, sec, groups, opt) {
    if (CFG.list === 'item') {
      const cards = groups.map(g => card(g.src, g.page, SRCCOL[g.src] || accentOf(opt), g.sub,
        g.tags.map(t => { const d = merged(sec, t); return d ? text(t, short(d.q, 40), '', '', opt) : ''; }).join(''))).join('');
      return mount(h, cards, sec, opt);
    }
    const render = () => {
      h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:9px">` +
        groups.map(g => qCard(g.src, g.page, g.sub, g.tags.map(t => qRow(sec, t)).join(''))).join('') +
        `</div>`;
      h.querySelectorAll('.q-row').forEach(r => {
        const tag = r.dataset.tag;
        if (!S(sec)[tag]) { r.style.cursor = ''; r.querySelector('span:last-child').remove(); return; }
        r.onmouseenter = () => { r.style.background = T.hover; };
        r.onmouseleave = () => { r.style.background = ''; };
        r.onclick = () => detail(h, sec, tag, render, opt);
        ldRowButton(r, sec, tag);
        quadRowButton(r, sec, tag);
      });
      MJx(h);
      fit(h);
    };
    render();
  }

  const pRow = (tag, bodyHtml, ans, fs, label, opt) => {
    const auto = ans === undefined || ans === null || ans === '';
    return `<div class="p-row" data-tag="${tag}"${label ? ` data-label="${label}"` : ''} style="display:flex;gap:9px;align-items:baseline;padding:2px 0;border-radius:8px">
       <span class="p-tag" style="flex:0 0 72px;font-size:${F.tag};font-weight:900;color:${GREY};white-space:nowrap">${tag}</span>
       <span style="flex:1;font-size:${fs};color:${INK};line-height:1.55">${bodyHtml}</span>
       <span class="p-ans"${auto ? ' data-auto="1"' : ''} style="flex:0 0 auto;font-size:${F.ans};font-weight:900;color:${GRN};white-space:nowrap;overflow:hidden;max-width:0;opacity:0;transition:opacity .12s">${auto ? '' : ans}</span>
       <span class="p-go" style="flex:0 0 auto;width:12px;text-align:right;font-size:${F.go};font-weight:900;color:${accentOf(opt)};opacity:0">›</span></div>`;
  };
  const item = (tag, t, ans, label, opt) => pRow(tag, `\\(${t}\\)`, ans, F.tex, label, opt);
  const text = (tag, html, ans, label, opt) => pRow(tag, html, ans, F.text, label, opt);
  const card = (src, page, col, sub, rows) =>
    `<div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;overflow:hidden">
       <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:4px 13px">
         <span style="font-size:13px;font-weight:900;color:#fff;letter-spacing:.03em">${src}</span>
         <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${page}</span>
       </div>
       <div style="padding:5px 13px 7px">
         ${sub ? `<div style="font-size:11.5px;color:${T.sub};margin-bottom:1px">${sub}</div>` : ''}
         ${rows}</div></div>`;
  const pWrap = (cards) =>
    `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:8px">${cards}
       <button class="p-sol" style="align-self:center;margin-top:2px;border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:4px 18px;cursor:pointer">顯示解答</button></div>`;

  function mount(h, cards, sec, opt) {
    const render = () => {
      h.innerHTML = pWrap(cards);
      h.querySelectorAll('.p-ans[data-auto]').forEach(e => {
        const r = e.closest('.p-row');
        const a = r ? rowAnswer(sec, r.dataset.tag, r.dataset.label) : '';
        if (a) e.innerHTML = a; else e.remove();
      });
      const btn = h.querySelector('.p-sol');
      const ans = [...h.querySelectorAll('.p-ans')];
      if (btn) btn.onclick = () => {
        const on = !(ans[0] && ans[0].style.opacity === '1');
        ans.forEach(e => {
          e.style.maxWidth = on ? 'none' : '0';
          e.style.opacity = on ? '1' : '0';
        });
        btn.textContent = on ? '收起解答' : '顯示解答';
        pAfter(h);
      };
      const all = sec && window.SOLUTIONS && window.SOLUTIONS[sec];

      if (!all) h.querySelectorAll('.p-go').forEach(e => e.remove());

      else h.querySelectorAll('.p-row').forEach(row => {
        const tag = row.dataset.tag;
        if (!(all[tag] || all[tag.replace(SUBRE, '')])) { row.querySelector('.p-go').remove(); return; }
        row.style.cursor = 'pointer';
        row.querySelector('.p-go').style.opacity = '.55';
        row.onmouseenter = () => { row.style.background = T.hover; };
        row.onmouseleave = () => { row.style.background = ''; };
        row.onclick = () => detail(h, sec, tag, render, opt);
      });
      pRelabel(h, sec);
      if (all) quadButtons(h, sec);
      MJx(h);
      pAfter(h);
    };
    render();
  }

  const QWHY = /^([^$：:]{2,20})[：:]\s*(.+)$/;

  function splitChain(line) {
    const m = /^(.*?)\$([^$]+)\$\s*$/.exec(line);
    if (!m) return [line];
    const pre = m[1], math = m[2], parts = [];
    let depth = 0, cur = '';
    for (const ch of math) {
      if ('({['.includes(ch)) depth++;
      if (')}]'.includes(ch)) depth--;
      if (ch === '=' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    if (parts.length <= 2) return [line];
    const head = parts[0].trim();
    return parts.slice(1).map((q, i) => i === 0 ? `${pre}$${head ? head + ' ' : ''}=${q}$` : `$=${q}$`);
  }
  const plain = (t) => String(t || '').replace(/\$|\s/g, '');
  function quadCell(sec, tag) {
    const all = S(sec);
    if (!SUBRE.test(tag) || !all[tag]) return null;
    const d = merged(sec, tag);
    if (!d || d.fig || d.table || !d.steps.length || d.steps.some(t => QNUM.test(String(t)))) return null;
    const lines = [];
    d.steps.forEach(st => {
      const w = QWHY.exec(String(st));
      (w ? splitChain(w[2]) : splitChain(String(st)))
        .forEach((t, i) => lines.push({ why: w && i === 0 ? w[1] : '', t }));
    });
    const ans = cleanAns(d.key || d.ans);
    if (ans && !plain(lines[lines.length - 1].t).includes(plain(ans))) lines.push({ why: '', t: '答：' + ans });
    if (lines.length > 4 || lines.some(l => texWide(l.t) > 46)) return null;
    return { steps: d.steps, lines: lines.map((l, i) => ({ why: l.why, html: tex(l.t), cont: /^\$=/.test(l.t), fin: i === lines.length - 1 })) };
  }

  const gcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcdN(n, d); return { n: n / g, d: d / g }; };
  const fSub = (a, b) => Fr(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => Fr(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => Fr(a.n * b.d, a.d * b.n);
  function parsePoly(src) {
    const s = src.replace(/\s+/g, '').replace(/\\[dt]?frac\{(\d+)\}\{(\d+)\}/g, '$1/$2');
    const co = {}; let max = 0;
    for (const t of s.match(/[+-]?[^+-]+/g) || []) {
      const m = /^([+-]?)(\d+(?:\/\d+)?)?(x(?:\^\{?(\d+)\}?)?)?$/.exec(t);
      if (!m || (!m[2] && !m[3])) return null;
      const sg = m[1] === '-' ? -1 : 1;
      let c = Fr(sg);
      if (m[2]) { const [p, q] = m[2].split('/').map(Number); c = Fr(sg * p, q || 1); }
      const deg = m[3] ? (m[4] ? +m[4] : 1) : 0;
      co[deg] = c; max = Math.max(max, deg);
    }
    const arr = [];
    for (let k = max; k >= 0; k--) arr.push(co[k] || Fr(0));
    return arr;
  }
  const ldTerm = (c, deg, first) => {
    const a = Fr(Math.abs(c.n), c.d);
    const num = a.d === 1 ? String(a.n) : `\\dfrac{${a.n}}{${a.d}}`;
    const x = deg === 0 ? '' : deg === 1 ? 'x' : `x^{${deg}}`;
    return (c.n < 0 ? '-' : first ? '' : '+\\,') + (deg > 0 && a.n === 1 && a.d === 1 ? x : num + x);
  };
  const ldPoly = (cs, top) => {
    const out = []; cs.forEach((c, i) => { if (c.n) out.push(ldTerm(c, top - i, !out.length)); });
    return out.length ? out.join('') : '0';
  };

  const ldPlain = (t) => String(t || '').replace(/商式|餘式|為|\$|\\\(|\\\)|\\,|\\[dt]?frac|\s/g, '');
  function ldCell(sec, tag) {
    const all = S(sec);
    if (!SUBRE.test(tag) || !all[tag]) return null;
    const d = merged(sec, tag);

    const qAll = String(d && d.q || '');
    if (/[(（]A[)）]/.test(qAll) || !/商式/.test(qAll) || !/餘式/.test(qAll)) return null;
    const q = qAll.split('\n').slice(-1)[0].replace(/\s+/g, '');
    const mm = /\$\(([^$]+)\)\\div\(([^$]+)\)\$/.exec(q);
    if (!mm || (q.match(/\\div/g) || []).length !== 1) return null;
    const N = parsePoly(mm[1]), D = parsePoly(mm[2]);
    if (!N || !D || !D[0].n || N.length < D.length) return null;
    const n = N.length - 1, m = D.length - 1, r = N.slice(), rounds = [], Q = [];
    for (let k = 0; k <= n - m; k++) {
      const qk = fDiv(r[k], D[0]); Q.push(qk);
      const prod = D.map(x => fMul(qk, x));
      prod.forEach((p, j) => { r[k + j] = fSub(r[k + j], p); });
      rounds.push({ k, q: qk, prod, rem: r.slice(k + 1, Math.min(n, k + m + 1) + 1) });
    }
    const Qt = ldPoly(Q, n - m), Rt = ldPoly(r.slice(n - m + 1), m - 1);
    const key = String(d.key || '').split(/[、，,]/);
    if (key.length !== 2 || ldPlain(key[0]) !== ldPlain(Qt) || ldPlain(key[1]) !== ldPlain(Rt)) return null;
    const C = n + 1, M = (t) => `\\(${t}\\)`;
    const td = (cls, html) => `<td${cls ? ` class="${cls}"` : ''}>${html || ''}</td>`;
    const row = (cells, attr, under) => `<tr${attr}>${td()}${td()}${[...Array(C).keys()].map(i => td(under && under.has(i) ? 'uline' : '', cells[i])).join('')}</tr>`;
    const qc = {};
    rounds.forEach((rd, i) => { qc[rd.k] = `<span class="bd-r" data-r="${i + 1}">${M(ldTerm(rd.q, n - m - rd.k, i === 0))}</span>`; });
    let rows = `<tr>${td()}${td()}${[...Array(C).keys()].map(i => td('', qc[i])).join('')}</tr>`;
    rows += `<tr>${td('', M(ldPoly(D, m)))}${td('paren', ')')}${N.map((c, i) => td('vin', M(ldTerm(c, n - i, i === 0)))).join('')}</tr>`;
    rounds.forEach((rd, i) => {
      const pc = {}, under = new Set(), rc = {};
      rd.prod.forEach((p, j) => { pc[rd.k + j] = M(ldTerm(p, n - rd.k - j, j === 0)); });
      for (let j = rd.k; j <= Math.min(n, rd.k + m + 1); j++) under.add(j);
      rows += row(pc, ` class="bd-r" data-r="${i + 1}"`, under);
      let first = true;
      rd.rem.forEach((c, j) => { if (first && !c.n && j < rd.rem.length - 1) return; rc[rd.k + 1 + j] = M(ldTerm(c, n - rd.k - 1 - j, first)); first = false; });
      rows += row(rc, ` class="bd-r" data-r="${i + 1}"`);
    });
    return { qHtml: M(`(${mm[1]})\\div(${mm[2]})`), n: rounds.length + 1,
             html: `<table class="bd-ld">${rows}</table><div class="bd-ld-fin bd-r" data-r="${rounds.length + 1}">商式為 ${M(Qt)}，餘式為 ${M(Rt)}</div>` };
  }

  const ldFix = (c) => Object.assign(c, { html: c.html.replace(/data-r="(\d+)"/g, (_, v) => `data-r="${v - 1}"`) });

  function ldOpen(cells, base) {
    if (!window.BOARD) return;
    const groups = [];
    for (let i = 0; i < cells.length; i += 2) {
      const part = cells.slice(i, i + 2);
      groups.push({ label: base + (cells.length > 1 ? ' ' + part.map(c => c.no).join('') : ''), cells: part });
    }
    window.BOARD.openQuad({ title: '計算紙（直式兩題）', note: '點一格看下一回合', stepWord: '下一回合', cols: 2, rows: 1, groups });
  }
  function ldRowButton(r, sec, tag) {
    if (typeof document === 'undefined') return;
    const all = S(sec), subs = [];
    for (const no of CIRC) { if (all[tag + ' ' + no]) subs.push(no); else break; }
    if (!subs.length) return;
    const cells = subs.map(no => { const c = ldCell(sec, tag + ' ' + no); return c && Object.assign({ no: subs.length > 1 ? no : '' }, ldFix(c)); });
    if (cells.some(x => !x)) return;
    const go = r.querySelector('span:last-child');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'p-quad';
    b.textContent = '直式';
    b.style.cssText = `flex:0 0 auto;align-self:center;border:1.5px solid ${C};background:#fff;color:${C};font-weight:900;font-size:13px;border-radius:999px;padding:1px 10px;cursor:pointer`;
    b.onclick = (e) => { e.stopPropagation(); ldOpen(cells, rowLabel(tag, merged(sec, tag) || {})); };
    r.insertBefore(b, go);
  }

  function quadRowButton(r, sec, tag) {
    if (typeof document === 'undefined' || r.querySelector('.p-quad')) return;
    const all = S(sec), subs = [];
    for (const no of CIRC) { if (all[tag + ' ' + no]) subs.push(no); else break; }
    if (subs.length < 2) return;

    const ansNos = String((merged(sec, tag) || {}).ans || '').replace(/\$[^$]*\$/g, '').match(/[①-⑳]/g) || [];
    if (ansNos.some(no => !subs.includes(no))) return;

    if (/[(（]A[)）]/.test(String((merged(sec, tag) || {}).q || ''))) return;
    const qs = new Set();
    const cells = subs.map(no => {
      const t = tag + ' ' + no, c = quadCell(sec, t), d = merged(sec, t);
      const q0 = String(d && d.q || '');
      if (/承上|[(（]A[)）]/.test(q0) || qs.has(q0)) return null;
      qs.add(q0);

      const q = String(d && d.q || '').split('\n').slice(-1)[0].replace(/[①-⑳]\s*/g, '')
        .replace(/^(計算|化簡)[^$：:]{0,12}[：:]\s*(?=\$)/, '').trim();

      if (!c || !q || texWide(q) > 46 || /\$\s*[：:][^$]*$/.test(q)) return null;
      return { no, qHtml: tex(q), lines: c.lines, steps: c.steps };
    });
    if (cells.some(x => !x)) return;
    const sig = cells.map(x => JSON.stringify(x.steps));
    if (new Set(sig).size < sig.length) return;
    const go = r.querySelector('span:last-child');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'p-quad';
    b.textContent = '四題';
    b.title = '四題一起檢討';
    b.style.cssText = `flex:0 0 auto;align-self:center;border:1.5px solid ${C};background:#fff;color:${C};font-weight:900;font-size:13px;border-radius:999px;padding:1px 10px;cursor:pointer`;
    b.onclick = (e) => {
      e.stopPropagation();
      if (!window.BOARD) return;

      const d0 = merged(sec, tag) || {}, q1 = String((merged(sec, tag + ' ' + subs[0]) || {}).q || '').split('\n');
      const stem = q1.length > 1 ? q1[0].trim() : '';
      const base = rowLabel(tag, d0), tail = /[：:]$/.test(stem) && !/\$/.test(stem) && stem.length <= 24 && !/^(計算|化簡|求下列各式的值)/.test(stem) ? '　' + stem : '', groups = [];
      for (let i = 0; i < cells.length; i += 4) {
        const part = cells.slice(i, i + 4);
        groups.push({ label: base + ' ' + (part.length >= 3 ? part[0].no + '～' + part[part.length - 1].no : part.map(c => c.no).join('')) + tail,
                      cells: part });
      }
      window.BOARD.openQuad({ groups });
    };
    r.insertBefore(b, go);
  }

  function quadButtons(h, sec) {

    if (typeof document === 'undefined') return;
    const cards = new Map();
    h.querySelectorAll('.p-row').forEach(r => {
      const c = r.parentElement && r.parentElement.parentElement;
      if (!c) return;
      if (!cards.has(c)) cards.set(c, []);
      cards.get(c).push(r);
    });
    cards.forEach((rows, c) => {
      if (rows.length < 2 || rows.length > 4) return;
      const head0 = c.firstElementChild, badge0 = head0 && head0.lastElementChild;
      const lds = rows.map(r => ldCell(sec, r.dataset.tag));
      if (head0 && badge0 && lds.every(Boolean)) {
        const labsOf = () => rows.map(r => { const t = r.querySelector('.p-tag'); return t ? t.textContent.trim() : r.dataset.tag; });
        const noOf = (l) => { const m = /[①-⑳]/.exec(l); return m ? m[0] : l; };
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'p-quad';
        b.textContent = '直式兩題一起檢討';
        b.style.cssText = 'margin-left:auto;margin-right:8px;border:1.5px solid #fff;background:rgba(255,255,255,.18);color:#fff;font-weight:900;font-size:12px;border-radius:999px;padding:1px 10px;cursor:pointer';
        b.onclick = (e) => {
          e.stopPropagation();
          if (!window.BOARD) return;
          const labs = labsOf(), groups = [];
          for (let i = 0; i < rows.length; i += 2) {
            const idx = [i, i + 1].filter(j => j < rows.length);
            groups.push({ label: labs[idx[0]].replace(SUBRE, '') + ' ' + idx.map(j => noOf(labs[j])).join(''),
                          cells: idx.map(j => Object.assign({ no: noOf(labs[j]) }, ldFix(Object.assign({}, lds[j])))) });
          }
          window.BOARD.openQuad({ title: '計算紙（直式兩題）', note: '點一格看下一回合', stepWord: '下一回合', cols: 2, rows: 1, groups });
        };
        head0.insertBefore(b, badge0);
        return;
      }
      const cells = rows.map(r => quadCell(sec, r.dataset.tag));
      if (cells.some(x => !x)) return;
      const sig = cells.map(x => JSON.stringify(x.steps));
      if (new Set(sig).size < sig.length) return;
      const head = c.firstElementChild, pageBadge = head && head.lastElementChild;
      if (!head || !pageBadge) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'p-quad';
      b.textContent = '四題一起檢討';
      b.style.cssText = 'margin-left:auto;margin-right:8px;border:1.5px solid #fff;background:rgba(255,255,255,.18);color:#fff;font-weight:900;font-size:12px;border-radius:999px;padding:1px 10px;cursor:pointer';
      b.onclick = (e) => {
        e.stopPropagation();
        if (!window.BOARD) return;
        const labs = rows.map(r => { const t = r.querySelector('.p-tag'); return t ? t.textContent.trim() : r.dataset.tag; });
        const no = (l) => { const m = /[①-⑳]/.exec(l); return m ? m[0] : l; };

        const grp = [];
        labs.forEach(l => { const base = l.replace(SUBRE, ''), g = grp[grp.length - 1];
          if (g && g.base === base) g.nos.push(no(l)); else grp.push({ base, nos: [no(l)] }); });
        const run = (ns) => ns.length >= 3 && ns.every((n, i) => !i || CIRC.indexOf(n) === CIRC.indexOf(ns[i - 1]) + 1)
          ? ns[0] + '～' + ns[ns.length - 1] : ns.join('');
        window.BOARD.openQuad({
          label: grp.map(g => g.base + ' ' + run(g.nos)).join('、'),
          cells: rows.map((r, i) => ({ no: no(labs[i]), q: r.querySelector('.p-tag + span'), lines: cells[i].lines })),
        });
      };
      head.insertBefore(b, pageBadge);
    });
  }

  const detail = (h, sec, tag, back, opt) =>
    CFG.detail === 'single' ? detailSingle(h, sec, tag, back, opt) : detailSegments(h, sec, tag, back, opt);

  const QNUM = /^\s*[①-⑳]/;

  function parts(sec, tag) {
    const d0 = S(sec)[tag];
    if (!d0) return [];
    const raw = [];
    for (const suf of CONT) {
      const d = S(sec)[tag + suf];
      if (!d) continue;
      const q = String(d.q || '').trim();
      raw.push({
        q: (!q || BOILER.test(q)) ? String(d0.q || '') : q,
        steps: d.steps || [], ans: d.ans || '', fig: d.fig || d0.fig || null, table: d.table || null
      });
    }

    const nOf = (p) => p.steps.length + (p.ans ? 1 : 0) + (p.fig ? 3 : 0);
    const out = [];
    for (const p of raw) {
      const last = out[out.length - 1];
      if (last && last.q === p.q && nOf(last) + nOf(p) - (last.fig && p.fig ? 3 : 0) <= 7) {
        last.steps = last.steps.concat(p.steps);
        last.ans = [last.ans, p.ans].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join('　');
        last.fig = last.fig || p.fig;
        last.table = last.table || p.table;
      } else out.push({ q: p.q, steps: p.steps.slice(), ans: p.ans, fig: p.fig, table: p.table });
    }
    return out;
  }

  function detailSegments(h, sec, tag, back) {
    const ps = parts(sec, tag);
    if (!ps.length) return false;
    const d0 = merged(sec, tag);
    const col = SRCCOL[d0.src] || C;
    let idx = 0;

    const render = () => {
      const p = ps[idx];
      const svg = figSvg(p);
      const lines = [...p.steps.map(t => ({ t: tex(t), q: QNUM.test(String(t)) })),
                     ...(p.table && isFill(p.q) ? [{ t: tblHtml(p.table) }] : []),
                     ...(p.ans ? [{ t: '答：' + tex(p.ans), fin: 1 }] : [])];

      const n = lines.length + (svg ? 3 : 0);
      const fs = n <= 7 ? 20 : n <= 10 ? 18 : 16;
      const gap = n <= 7 ? 26 : n <= 10 ? 18 : 11;
      const more = ps.length > 1;

      h.innerHTML = `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">
      <div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:center;background:${col};padding:5px 13px">
          <span style="font-size:13.5px;font-weight:900;color:#fff">${d0.src}　${rowLabel(tag, d0)}</span>
          <span style="display:flex;gap:7px;align-items:center">
            ${more ? `<button class="q-prev-part" ${idx ? '' : 'disabled'} style="border:0;background:rgba(255,255,255,${idx ? '.28' : '.10'});color:#fff;font-weight:900;font-size:13px;border-radius:7px;padding:1px 8px;cursor:${idx ? 'pointer' : 'default'};opacity:${idx ? 1 : .5}">‹</button>
            <span style="font-size:12.5px;font-weight:900;color:#fff;opacity:.92">第 ${idx + 1}／${ps.length} 段</span>
            <button class="q-next-part" ${idx < ps.length - 1 ? '' : 'disabled'} style="border:0;background:rgba(255,255,255,${idx < ps.length - 1 ? '.28' : '.10'});color:#fff;font-weight:900;font-size:13px;border-radius:7px;padding:1px 8px;cursor:${idx < ps.length - 1 ? 'pointer' : 'default'};opacity:${idx < ps.length - 1 ? 1 : .5}">›</button>` : ''}
            <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${d0.page}</span>
          </span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 14px">
          <div class="p-qtext" style="flex:1 1 0;min-width:0;font-size:18px;color:${INK};line-height:1.5">${qHtml(p.q)}
            ${p.table && !isFill(p.q) ? `<div style="margin-top:6px">${tblHtml(p.table)}</div>` : ''}
            ${p.fig && !svg ? `<div style="margin-top:6px;font-size:13px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:8px;padding:4px 10px;display:inline-block">⚠ ocho 沒有這張圖，請看紙本 ${d0.page}</div>` : ''}</div>
          ${svg ? `<div class="q-fig" style="flex:0 0 40%;max-width:40%;height:220px;display:flex;align-items:center;justify-content:center">${svg}</div>` : ''}
        </div>
      </div>
      <div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;padding:13px 18px 22px;display:flex;flex-direction:column;gap:${gap}px;min-height:${Math.max(130, lines.length * 52)}px">
        ${lines.map((l, i) => `<div class="${l.q ? 'q-ask' : 'q-line'}" data-i="${i}" style="${l.q ? '' : 'visibility:hidden;'}font-size:${l.fin ? fs + 2 : fs}px;
          font-weight:${l.fin ? 900 : l.q ? 800 : 700};color:${l.fin ? GRN : INK};line-height:1.45${l.q ? '' : ';padding-left:18px'}">${l.t}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center">
        <button class="q-next" style="border:1.5px solid ${C};background:${C};color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一行</button>
        <button class="q-all" style="border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
        <button class="q-back" style="border:1.5px solid ${T.back};background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
      </div></div>`;

      const els = [...h.querySelectorAll('.q-line')];
      const next = h.querySelector('.q-next');
      const st = steps(h, els, next);
      next.onclick = st.next;
      h.querySelector('.q-all').onclick = st.all;
      h.querySelector('.q-back').onclick = back;
      const go = (i) => { idx = i; render(); };
      const prevB = h.querySelector('.q-prev-part'), nextB = h.querySelector('.q-next-part');
      if (prevB && idx > 0) prevB.onclick = () => go(idx - 1);
      if (nextB && idx < ps.length - 1) nextB.onclick = () => go(idx + 1);
      MJx(h);
      fit(h);
    };

    render();
    return true;
  }

  function detailSingle(h, sec, tag, back, opt) {
    const d = merged(sec, tag);
    if (!d) return false;
    const acc = accentOf(opt);
    const fig = figSvg(d);
    const lines = [...d.steps.map(t => ({ t: tex(t), q: QNUM.test(String(t)) })),
                   ...(d.table && isFill(d.q) ? [{ t: tblHtml(d.table) }] : []),
                   ...(d.ans ? [{ t: '答：' + tex(d.ans), fin: 1 }] : [])];
    h.innerHTML =
      `<div style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:10px">
         <div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;overflow:hidden">
           <div style="display:flex;justify-content:space-between;align-items:center;background:${acc};padding:5px 13px">
             <span style="font-size:13px;font-weight:900;color:#fff">${d.src} ${pLabel(sec, tag)}</span>
             <span style="font-size:13px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);border-radius:8px;padding:1px 9px">${d.page}</span>
           </div>
           <div style="padding:10px 14px">
             <div class="p-qtext" style="font-size:19px;color:${INK};line-height:1.5">${String(d.q || '').split('\n').filter(Boolean).map((seg, i) => `<div style="${i ? 'margin-top:7px' : ''}">${tex(seg)}</div>`).join('')}
               ${d.table && !isFill(d.q) ? `<div style="margin-top:8px">${tblHtml(d.table)}</div>` : ''}
               ${d.fig && !fig ? `<div style="margin-top:6px;font-size:13px;font-weight:900;color:#8a5a00;background:#fff4d6;border:1px solid #f0dba8;border-radius:8px;padding:4px 10px;display:inline-block">⚠ ocho 沒有這張圖，請看紙本 ${d.page}</div>` : ''}</div>
             ${fig ? `<div class="q-fig" style="margin-top:8px;width:100%;height:220px;display:flex;align-items:center;justify-content:center">${fig}</div>` : ''}
           </div>
         </div>
         <div style="background:#fff;border:1.5px solid ${T.border};border-radius:14px;padding:14px 18px 30px;display:flex;flex-direction:column;gap:26px;min-height:${Math.max(150, lines.length * 62)}px">
           ${lines.map((l, i) => `<div class="${l.q ? 'p-ask' : 'p-line'}" data-i="${i}" style="${l.q ? '' : 'visibility:hidden;'}font-size:${l.fin ? 22 : 20}px;font-weight:${l.fin ? 900 : l.q ? 800 : 700};color:${l.fin ? GRN : INK}${l.q ? '' : ';padding-left:20px'}">${l.t}</div>`).join('')}
         </div>
         <div style="display:flex;gap:8px;justify-content:center">
           <button class="p-next" style="border:1.5px solid ${acc};background:${acc};color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:5px 20px;cursor:pointer">下一行</button>
           <button class="p-all" style="border:1.5px solid ${GRN};background:#fff;color:${GRN};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">全部顯示</button>
           <button class="p-back" style="border:1.5px solid ${T.back};background:#fff;color:${GREY};font-weight:900;font-size:13px;border-radius:999px;padding:5px 16px;cursor:pointer">← 回題目列表</button>
         </div>
       </div>`;
    const els = [...h.querySelectorAll('.p-line')];
    const next = h.querySelector('.p-next');
    const st = steps(h, els, next);
    next.onclick = st.next;
    h.querySelector('.p-all').onclick = st.all;
    h.querySelector('.p-back').onclick = back;
    MJx(h);
    pAfter(h);
    return true;
  }

  function steps(h, els, next) {
    let shown = 0;
    const paint = () => {
      els.forEach((e, i) => { e.style.visibility = i < shown ? 'visible' : 'hidden'; });
      const done = shown >= els.length;
      next.disabled = done; next.style.opacity = done ? '.4' : ''; next.style.cursor = done ? 'default' : 'pointer';
    };
    const st = {
      k: () => shown, total: els.length, live: next,
      next: () => { if (shown < els.length) { shown++; paint(); } },
      prev: () => { if (shown > 0) { shown--; paint(); } },
      all: () => { shown = els.length; paint(); },
    };
    h.__steps = st;
    return st;
  }

  function fit(h, floor) {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => {
      const st = h.firstElementChild;
      if (!st || !h.clientHeight) return;
      st.style.zoom = '';
      const cs = window.getComputedStyle(h);
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const need = st.scrollHeight, have = h.clientHeight - pad;
      if (have > 0 && need > have) st.style.zoom = Math.max(floor || CFG.fitFloor, (have / need) * 0.985).toFixed(3);
      if (window.dispatchEvent) window.dispatchEvent(new Event('resize'));
    };
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([h]).then(go).catch(go);
    else setTimeout(go, 60);
  }

  const pFit = (h) => {
    if (typeof window === 'undefined') return;
    const stack = h.firstElementChild;
    if (!stack || !h.clientHeight) return;
    stack.style.zoom = '';

    const cs = window.getComputedStyle(h);
    const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

    if (CFG.zoomFit === 'trial' && h.closest && h.closest('#zoomBody')) {
      const W = h.clientWidth, Hh = h.clientHeight - pad;
      let bw = +h.dataset.zoomBase || 460, bz = 0;
      [bw, Math.round(W * 0.42), Math.round(W * 0.52), Math.round(W * 0.64), Math.round(W * 0.78)]
        .forEach(w => {
          if (w < 280 || w > W) return;
          stack.style.width = w + 'px';
          const z = Math.min(W / w, Hh / (stack.scrollHeight || 1), 2.8);
          if (z > bz) { bz = z; bw = w; }
        });
      stack.style.width = bw + 'px';
      stack.style.margin = '0 auto';

      if (bz < 0.995 || bz > 1.02) stack.style.zoom = Math.max(0.6, bz).toFixed(3);
      return;
    }
    stack.style.width = '';
    stack.style.margin = '';

    const need = stack.scrollHeight, have = h.clientHeight - pad;
    if (have > 0 && need > have) stack.style.zoom = Math.max(CFG.fitFloor, (have / need) * 0.985).toFixed(3);
  };

  const pAfter = (h) => {
    if (typeof window === 'undefined' || typeof setTimeout !== 'function') return;
    const go = () => { pFit(h); if (window.dispatchEvent) window.dispatchEvent(new Event('resize')); };
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([h]).then(go).catch(go);
    } else { setTimeout(go, 60); }
  };

  if (CFG.zoomFit === 'trial' && typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__pFitZoomHook) {
    window.__pFitZoomHook = true;
    const sweep = () => document.querySelectorAll('.visual-host').forEach(el => {
      if (el.firstElementChild && el.querySelector('.p-line, .p-ask')) pFit(el);
    });
    document.addEventListener('click', () => { setTimeout(sweep, 150); setTimeout(sweep, 700); }, true);
  }

  const answerKey = (window.ANSWER_KEY || { create: () => (h) => { h.innerHTML = '<div>對答案（需 answer-key.js）</div>'; } })
    .create({ get: (sec, tag) => merged(sec, tag), math: 'dollar', tex, fit });

  return { config: CFG, page, detail, merged, rowAnswer, answerKey,
           item, text, card, mount, label: pLabel };
})();
