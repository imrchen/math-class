(function () {
  const DECK = window.DECK || [];

  const flat = [];
  DECK.forEach((chap, ci) => {
    flat.push({ type: 'divider', ch: chap.ch, color: chap.color, title: chap.title, sections: chap.sections });
    chap.slides.forEach(s => flat.push(Object.assign({ type: 'slide', ch: chap.ch, color: chap.color }, s)));
  });

  let idx = 0;

  function typeset(el, tries = 0) {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([el]).catch(() => {});
    } else if (tries < 60) {
      setTimeout(() => typeset(el, tries + 1), 200);
    }
  }

  function fitEl(box, content) {
    if (!box || !content) return;
    content.style.transform = 'none';
    const avail = box.clientHeight;
    const need = content.scrollHeight;

    if (avail > 0 && need > avail + 1) {
      content.style.transform = 'scale(' + Math.max(0.5, (avail - 6) / need) + ')';
    }
  }
  function fitSlide() {
    if (!slideEl || slideEl.classList.contains('divider')) return;
    const info = slideEl.querySelector('.slide-info');
    if (info) fitEl(info, info.querySelector('.col-fit'));
    const vis = slideEl.querySelector('.slide-visual');
    if (vis) {
      const host = vis.querySelector('.visual-host');

      if (host) fitEl(host, host);
    }
  }

  function typesetAndFit(el, tries = 0) {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([el]).then(fitSlide).catch(fitSlide);
    } else if (tries < 60) {
      setTimeout(() => typesetAndFit(el, tries + 1), 200);
    } else { fitSlide(); }
  }

  let zoomHost = null, zoomHostParent = null;
  function ensureZoom() {
    if (document.getElementById('zoomModal')) return;
    const m = document.createElement('div');
    m.id = 'zoomModal'; m.className = 'zoom-modal hidden';
    m.innerHTML = `<div class="zoom-body" id="zoomBody"></div>`;
    document.body.appendChild(m);
    const bar = document.createElement('div');
    bar.id = 'zoomBar'; bar.className = 'zoom-bar hidden';
    bar.innerHTML = `<div class="zoom-badge" id="zoomBadge"></div>
      <button class="zoom-btn" id="zoomSol">顯示解答</button>
      <button class="zoom-btn zoom-x" id="zoomClose">✕ 關閉</button>`;
    document.body.appendChild(bar);
    bar.querySelector('#zoomClose').onclick = closeZoom;
    bar.querySelector('#zoomSol').onclick = () => {
      const box = document.getElementById('zoomSolBox'); if (!box) return;
      box.classList.toggle('show');
      bar.querySelector('#zoomSol').textContent = box.classList.contains('show') ? '收起解答' : '顯示解答';
      typeset(box);
    };
  }
  function showZoom(s, badgeTail) {
    ensureZoom();
    document.getElementById('zoomBadge').innerHTML = `第 ${s.ch} 章 · ${s.sec} ${s.secName || ''}　${badgeTail}`;
    document.getElementById('zoomModal').style.setProperty('--ct', s.color);
    document.getElementById('zoomBar').style.setProperty('--ct', s.color);
    document.getElementById('zoomModal').classList.remove('hidden');
    document.getElementById('zoomBar').classList.remove('hidden');
  }
  function openExampleModal(s) {
    ensureZoom();
    document.getElementById('zoomSol').style.display = '';
    document.getElementById('zoomSol').textContent = '顯示解答';
    document.getElementById('zoomBody').innerHTML =
      `<div class="zoom-q">${s.example.q}</div>
       <div class="zoom-sol" id="zoomSolBox">
         ${s.example.steps ? `<ol>${s.example.steps.map(t => `<li>${t}</li>`).join('')}</ol>` : ''}
         ${s.example.ans ? `<div class="zoom-ans">答：${s.example.ans}</div>` : ''}
       </div>`;
    showZoom(s, '範例');
    typeset(document.getElementById('zoomBody'));
  }

  function fitZoomHost() {
    const host = zoomHost;
    if (!host) return;
    const body = document.getElementById('zoomBody');
    if (!body) return;
    const isDrawing = !!host.querySelector('svg:not(mjx-container svg)');
    if (isDrawing) { host.style.width = ''; host.style.transform = 'none'; return; }

    const baseW = +host.dataset.zoomBase || 460;
    host.style.width = baseW + 'px';
    host.style.margin = '0 auto';
    host.style.transformOrigin = 'top center';
    host.style.transform = 'none';

    host.style.flex = 'none';
    host.style.height = 'auto';
    const needH = host.scrollHeight;
    if (!needH) return;
    const k = Math.max(1, Math.min(body.clientWidth / baseW, body.clientHeight / needH, 3.4));
    host.style.transform = 'scale(' + k.toFixed(4) + ')';
  }
  function openVisualModal(s, host) {
    ensureZoom();
    document.getElementById('zoomSol').style.display = 'none';
    const body = document.getElementById('zoomBody');
    body.innerHTML = '';
    zoomHost = host; zoomHostParent = host.parentNode;
    host.dataset.zoomBase = Math.round(host.getBoundingClientRect().width) || 460;
    host.style.transform = 'none';
    body.appendChild(host);
    showZoom(s, '圖解');

    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([body]).then(fitZoomHost).catch(fitZoomHost);
    } else { typeset(body); setTimeout(fitZoomHost, 300); }
  }
  function closeZoom() {
    const m = document.getElementById('zoomModal');
    if (!m || m.classList.contains('hidden')) return;
    if (zoomHost && zoomHostParent) {

      zoomHost.style.width = ''; zoomHost.style.margin = '';
      zoomHost.style.flex = ''; zoomHost.style.height = '';
      zoomHost.style.transform = ''; zoomHost.style.transformOrigin = '';
      delete zoomHost.dataset.zoomBase;
      zoomHostParent.insertBefore(zoomHost, zoomHostParent.firstChild);
      zoomHost = null; zoomHostParent = null;
    }
    document.getElementById('zoomBody').innerHTML = '';
    m.classList.add('hidden');
    document.getElementById('zoomBar').classList.add('hidden');
    if (typeof clearPen === 'function') clearPen();
    fitSlide();
  }

  const $ = id => document.getElementById(id);
  const slideEl = $('slide');
  const crumbEl = $('crumb');
  const tocEl = $('toc');
  const progFill = $('progressFill');
  const progText = $('progressText');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');

  (function buildCover() {
    const host = $('coverChapters');
    DECK.forEach(c => {
      const card = document.createElement('div');
      card.className = 'cover-card';
      card.style.setProperty('--ct', c.color);
      card.innerHTML = `<div class="cc-num">第 ${c.ch} 章</div>
        <div class="cc-title">${c.title}</div>
        <div class="cc-list">${c.sections.join('　')}</div>`;
      host.appendChild(card);
    });
  })();

  function buildTOC() {
    tocEl.innerHTML = '';
    DECK.forEach(chap => {
      const wrap = document.createElement('div');
      wrap.className = 'toc-chapter open';
      wrap.style.setProperty('--ct', chap.color);
      const head = document.createElement('div');
      head.className = 'toc-chead';
      head.innerHTML = `<span class="toc-dot"></span>第 ${chap.ch} 章　${chap.title}`;
      head.onclick = () => wrap.classList.toggle('open');
      wrap.appendChild(head);
      const items = document.createElement('div');
      items.className = 'toc-items';
      flat.forEach((s, i) => {
        if (s.type !== 'slide' || s.ch !== chap.ch) return;
        const b = document.createElement('button');
        b.className = 'toc-item';
        b.dataset.i = i;
        b.innerHTML = `<span class="ti-sec">${s.sec}</span>${s.title}`;
        b.onclick = () => { go(i); if (window.innerWidth <= 1080) tocEl.classList.remove('open'); };
        items.appendChild(b);
      });
      wrap.appendChild(items);
      tocEl.appendChild(wrap);
    });
  }

  function markTOC() {
    tocEl.querySelectorAll('.toc-item').forEach(b => {
      b.classList.toggle('active', +b.dataset.i === idx);
    });
  }

  function render() {
    const s = flat[idx];
    slideEl.style.setProperty('--ct', s.color);

    if (s.type === 'divider') {
      slideEl.className = 'slide divider';
      slideEl.innerHTML = `
        <div>
          <div class="dv-num">第 ${s.ch} 章</div>
          <div class="dv-title">${s.title}</div>
          <div class="dv-list">${s.sections.map(x => `<span class="dv-chip">${x}</span>`).join('')}</div>
        </div>`;
      crumbEl.innerHTML = `第 ${s.ch} 章　<b>${s.title}</b>`;
    } else {
      slideEl.className = 'slide';

      const info = document.createElement('div');
      info.className = 'slide-info';
      let html = `<div class="badge">第 ${s.ch} 章 · ${s.sec} ${s.secName || ''}</div>
        <h2 class="slide-title">${s.title}</h2>`;
      if (s.formula) {
        html += `<div class="formula">${s.formula.label ? `<div class="formula-label">${s.formula.label}</div>` : ''}$$${s.formula.tex}$$</div>`;
      }
      if (s.points && s.points.length) {
        html += `<ul class="points">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>`;
      }
      if (s.example) {
        html += `<div class="example">
          <div class="ex-head">範例<button class="ex-zoom" title="放大成整頁，方便用畫筆講解">🔍 放大</button></div>
          <div class="ex-q">${s.example.q}</div>
          <button class="ex-toggle">顯示解答</button>
          <div class="ex-sol">
            ${s.example.steps ? `<ol>${s.example.steps.map(t => `<li>${t}</li>`).join('')}</ol>` : ''}
            ${s.example.ans ? `<div class="ex-ans">答：${s.example.ans}</div>` : ''}
          </div>
        </div>`;
      }
      info.innerHTML = '<div class="col-fit">' + html + '</div>';

      const vis = document.createElement('div');
      vis.className = 'slide-visual';
      const host = document.createElement('div');
      host.className = 'visual-host';
      vis.appendChild(host);
      if (s.caption) {
        const cap = document.createElement('div');
        cap.className = 'visual-caption';
        cap.innerHTML = s.caption;
        vis.appendChild(cap);
      }

      const visZoom = document.createElement('button');
      visZoom.className = 'vis-zoom';
      visZoom.title = '放大成整頁，方便用畫筆講解';
      visZoom.textContent = '🔍 放大';
      visZoom.onclick = () => openVisualModal(s, host);
      vis.appendChild(visZoom);

      slideEl.innerHTML = '';
      slideEl.appendChild(info);
      slideEl.appendChild(vis);

      if (typeof s.visual === 'function') {
        try { s.visual(host); } catch (e) { host.innerHTML = '<p style="color:#e11d48">視覺載入失敗</p>'; console.error(e); }
      } else {
        host.innerHTML = s.visual || '';
      }

      const tog = info.querySelector('.ex-toggle');
      if (tog) {
        const sol = info.querySelector('.ex-sol');
        tog.onclick = () => {
          sol.classList.toggle('show');
          tog.textContent = sol.classList.contains('show') ? '收起解答' : '顯示解答';

          if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([sol]).then(fitSlide).catch(fitSlide);
          else fitSlide();
        };
      }

      const exZoom = info.querySelector('.ex-zoom');
      if (exZoom) exZoom.onclick = () => openExampleModal(s);

      crumbEl.innerHTML = `第 ${s.ch} 章 · ${s.sec} <b>${s.title}</b>`;
    }

    progFill.style.width = ((idx + 1) / flat.length * 100) + '%';
    progText.textContent = `${idx + 1} / ${flat.length}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === flat.length - 1;
    markTOC();

    typesetAndFit(slideEl);
    slideEl.scrollTop = 0;
    if (typeof clearPen === 'function') clearPen();
  }

  function go(i) {
    closeZoom();
    idx = Math.max(0, Math.min(flat.length - 1, i));
    render();
  }
  function next() { if (idx < flat.length - 1) go(idx + 1); }
  function prev() { if (idx > 0) go(idx - 1); }

  const app = $('app');
  function toggleSidebar() {
    if (window.innerWidth > 1080) app.classList.toggle('toc-collapsed');
    else tocEl.classList.toggle('open');

    requestAnimationFrame(fitSlide);
  }
  prevBtn.onclick = prev;
  nextBtn.onclick = next;
  $('tocToggle').onclick = toggleSidebar;
  $('homeBtn').onclick = () => { app.classList.add('hidden'); $('cover').classList.remove('hidden'); };
  $('startBtn').onclick = () => { $('cover').classList.add('hidden'); app.classList.remove('hidden'); fitPen(); render(); };

  const canvas = $('penCanvas'), penCtx = canvas.getContext('2d');
  const laserDot = $('laserDot');
  let laserOn = false, penOn = false, drawing = false, erasing = false, penColor = '#e11d48', lastPt = null;

  const laserCanvas = document.createElement('canvas');
  laserCanvas.className = 'laser-canvas';
  document.body.appendChild(laserCanvas);
  const lctx = laserCanvas.getContext('2d');
  let laserPts = [];
  let laserRAF = null;
  const LASER_LIFE = 1600;
  function drawLaserTrail() {
    syncLaserCanvas();
    const now = performance.now();
    laserPts = laserPts.filter(p => now - p.t < LASER_LIFE);
    lctx.clearRect(0, 0, laserCanvas.width, laserCanvas.height);
    for (let i = 1; i < laserPts.length; i++) {
      const a = laserPts[i - 1], b = laserPts[i];
      const alpha = Math.max(0, 1 - (now - b.t) / LASER_LIFE);
      lctx.strokeStyle = 'rgba(255,42,42,' + (0.6 * alpha).toFixed(3) + ')';
      lctx.lineWidth = 3 + 5 * alpha;
      lctx.beginPath(); lctx.moveTo(a.x, a.y); lctx.lineTo(b.x, b.y); lctx.stroke();
    }
    if (laserOn || laserPts.length > 1) laserRAF = requestAnimationFrame(drawLaserTrail);
    else { lctx.clearRect(0, 0, laserCanvas.width, laserCanvas.height); laserRAF = null; }
  }

  function fitPen() {
    const w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
    if (canvas._w === w && canvas._h === h) return;
    canvas._w = w; canvas._h = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    penCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    penCtx.lineCap = 'round'; penCtx.lineJoin = 'round';
  }

  function syncLaserCanvas() {
    const w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
    const cw = Math.round(w * dpr), ch = Math.round(h * dpr);
    if (laserCanvas.width === cw && laserCanvas.height === ch) return;
    laserCanvas.width = cw; laserCanvas.height = ch;
    laserCanvas.style.width = w + 'px'; laserCanvas.style.height = h + 'px';
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.lineCap = 'round'; lctx.lineJoin = 'round';
  }
  function clearPen() { if (penCtx) penCtx.clearRect(0, 0, canvas.width, canvas.height); }

  function setLaser(on) {
    laserOn = on;
    if (on) setPen(false);
    app.classList.toggle('laser-on', on);
    laserDot.classList.toggle('hidden', !on);
    $('dkLaser').classList.toggle('active', on);
    if (on) { syncLaserCanvas(); if (!laserRAF) laserRAF = requestAnimationFrame(drawLaserTrail); }

  }
  function setPen(on) {
    penOn = on;
    if (on) setLaser(false);
    app.classList.toggle('pen-on', on);
    canvas.style.pointerEvents = on ? 'auto' : 'none';
    $('dkPen').classList.toggle('active', on);
    $('dkColors').classList.toggle('hidden', !on);
  }

  document.addEventListener('mousemove', e => {
    if (laserOn) {
      laserDot.style.left = e.clientX + 'px'; laserDot.style.top = e.clientY + 'px';
      laserPts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (laserPts.length > 600) laserPts.shift();
    }
  });

  const ptOf = e => { const t = e.touches ? e.touches[0] : e; return { x: t.clientX, y: t.clientY }; };
  function penStart(e) { if (!penOn) return; drawing = true; lastPt = ptOf(e); e.preventDefault(); }
  function penMove(e) {
    if (!penOn || !drawing) return;
    const p = ptOf(e);
    penCtx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    penCtx.strokeStyle = penColor;
    penCtx.lineWidth = erasing ? 26 : 3.6;
    penCtx.beginPath(); penCtx.moveTo(lastPt.x, lastPt.y); penCtx.lineTo(p.x, p.y); penCtx.stroke();
    lastPt = p; e.preventDefault();
  }
  function penEnd() { drawing = false; }
  canvas.addEventListener('mousedown', penStart);
  canvas.addEventListener('mousemove', penMove);
  window.addEventListener('mouseup', penEnd);
  canvas.addEventListener('touchstart', penStart, { passive: false });
  canvas.addEventListener('touchmove', penMove, { passive: false });
  window.addEventListener('touchend', penEnd);

  $('dkSidebar').onclick = toggleSidebar;
  $('dkPrev').onclick = prev;
  $('dkNext').onclick = next;
  $('dkLaser').onclick = () => setLaser(!laserOn);
  $('dkPen').onclick = () => setPen(!penOn);
  $('dkClear').onclick = clearPen;
  $('dkErase').onclick = () => {
    erasing = !erasing;
    $('dkErase').classList.toggle('active', erasing);
    if (erasing && !penOn) setPen(true);
  };
  document.querySelectorAll('.dcolor').forEach(b => {
    b.onclick = () => {
      penColor = b.dataset.c; erasing = false;
      $('dkErase').classList.remove('active');
      document.querySelectorAll('.dcolor').forEach(x => x.classList.toggle('active', x === b));
      if (!penOn) setPen(true);
    };
  });
  $('dkFull').onclick = () => {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen && document.documentElement.requestFullscreen());
    else document.exitFullscreen();
  };
  window.addEventListener('resize', () => { fitPen(); fitSlide(); fitZoomHost(); });

  let _refitRAF = null;
  slideEl.addEventListener('input', () => {
    if (_refitRAF) return;
    _refitRAF = requestAnimationFrame(() => { _refitRAF = null; fitSlide(); });
  });
  fitPen();

  document.addEventListener('keydown', e => {
    if ($('app').classList.contains('hidden')) {
      if (e.key === 'Enter' || e.key === ' ') { $('startBtn').click(); }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(flat.length - 1);
    else if (e.key === 'Escape') { closeZoom(); setLaser(false); setPen(false); }
    else if (e.key === 'l' || e.key === 'L') setLaser(!laserOn);
    else if (e.key === 'p' || e.key === 'P') setPen(!penOn);
    else if (e.key === 'c' || e.key === 'C') clearPen();
  });

  buildTOC();

  (function bootFromHash() {
    const hash = location.hash || '';
    const m = hash.match(/#p=(\d+)/);
    if (hash === '#present' || m) {
      $('cover').classList.add('hidden');
      $('app').classList.remove('hidden');
      fitPen();
      go(m ? +m[1] : 0);
    }
  })();

})();
