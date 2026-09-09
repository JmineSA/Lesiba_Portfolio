// Canvas data-viz demos: Fig.01 live OLS regression + Fig.04 histogram.
/* ============================================================
   FIG. 01 — LIVE OLS
============================================================ */
(function(){
  const cv = $('#olsCanvas'); if (!cv) return;
  const rB0 = $('#rB0'), rB1 = $('#rB1'), rR2 = $('#rR2'), rEp = $('#rEp');
  const N = 120, PAD = 30, R = 170, PULL = .35, EASE = .12;
  let ACCENT = '#C9F65A';
  let ctx, W, H, pts = [], visible = false, raf = null, epoch = 0, lastEp = 0;
  let mouse = null, lastMove = 0;

  function getThemeColors(){
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      accent: isLight ? '#5C8A00' : '#C9F65A',
      bg: isLight ? '#F3F4EF' : '#07080B',
      text: isLight ? '#101216' : '#F2F4F1',
      grid: isLight ? 'rgba(16,18,22,0.08)' : 'rgba(255,255,255,0.05)',
      point: isLight ? 'rgba(92,138,0,0.9)' : 'rgba(201,246,90,0.95)',
      pointDim: isLight ? 'rgba(16,18,22,0.6)' : 'rgba(242,244,241,0.8)',
      residual: isLight ? 'rgba(16,18,22,0.1)' : 'rgba(255,255,255,0.07)',
    };
  }

  function gauss(){
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function rebuild(){
    const colors = getThemeColors();
    ACCENT = colors.accent;
    ({ ctx, W, H } = fitCanvas(cv));
    pts = [];
    for (let i = 0; i < N; i++){
      const xn = Math.random();
      const yn = .16 + .60 * xn + gauss() * .10;
      pts.push({
        bx: PAD + xn * (W - PAD * 2),
        by: PAD + (1 - Math.min(.96, Math.max(.04, yn))) * (H - PAD * 2),
        x: 0, y: 0
      });
      const p = pts[i]; p.x = p.bx; p.y = p.by;
    }
    if (REDUCED) frame(performance.now(), true);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    lastMove = performance.now();
  });
  cv.addEventListener('pointerleave', () => { mouse = null; });

  function target(t){
    if (mouse && t - lastMove < 2600) return mouse;
    const w = t * .00042;
    return {
      x: W * (.5 + .34 * Math.sin(w) + .12 * Math.sin(w * 2.3 + 1.7)),
      y: H * (.5 + .30 * Math.cos(w * .8 + .6) + .14 * Math.sin(w * 1.7))
    };
  }

  function frame(t, still = false){
    const colors = getThemeColors();
    ACCENT = colors.accent;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++){
      const y = PAD + (H - PAD * 2) * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
    }
    const tg = target(t);
    if (t - lastEp > 500){ lastEp = t; epoch++; rEp.textContent = String(epoch).padStart(4, '0'); }

    for (const p of pts){
      let ox = 0, oy = 0;
      const dx = tg.x - p.x, dy = tg.y - p.y, d = Math.hypot(dx, dy);
      if (d < R && d > .001){
        const f = (1 - d / R) * PULL;
        ox = dx * f; oy = dy * f;
      }
      p.x += ((p.bx + ox) - p.x) * EASE;
      p.y += ((p.by + oy) - p.y) * EASE;
    }

    let sx = 0, sy = 0;
    for (const p of pts){ sx += p.x; sy += p.y; }
    const mx = sx / N, my = sy / N;
    let cov = 0, vx = 0, vy = 0;
    for (const p of pts){ const a = p.x - mx, b = p.y - my; cov += a * b; vx += a * a; vy += b * b; }
    const slope = vx > 1 ? cov / vx : 0, icept = my - slope * mx;
    const r2 = (vx > 1 && vy > 0) ? (cov * cov) / (vx * vy) : 0;

    let nsx = 0, nsy = 0;
    for (const p of pts){ nsx += (p.x - PAD) / (W - PAD * 2); nsy += 1 - (p.y - PAD) / (H - PAD * 2); }
    const nmx = nsx / N, nmy = nsy / N;
    let ncov = 0, nvx = 0, nvy = 0;
    for (const p of pts){
      const a = (p.x - PAD) / (W - PAD * 2) - nmx;
      const b = (1 - (p.y - PAD) / (H - PAD * 2)) - nmy;
      ncov += a * b; nvx += a * a; nvy += b * b;
    }
    const nslope = nvx > 1e-6 ? ncov / nvx : 0;
    const nicept = nmy - nslope * nmx;

    ctx.strokeStyle = colors.residual; ctx.lineWidth = 1;
    for (const p of pts){
      const ly = icept + slope * p.x;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, ly); ctx.stroke();
    }
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 14;
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, icept + slope * PAD);
    ctx.lineTo(W - PAD, icept + slope * (W - PAD));
    ctx.stroke();
    ctx.restore();
    for (const p of pts){
      const near = Math.hypot(tg.x - p.x, tg.y - p.y) < R * .55;
      ctx.fillStyle = near ? colors.point : colors.pointDim;
      ctx.beginPath(); ctx.arc(p.x, p.y, near ? 2.6 : 2.2, 0, 6.2832); ctx.fill();
    }
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
    ctx.strokeStyle = ACCENT + 'BF'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(tg.x, tg.y, 9, 0, 6.2832); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tg.x - 15, tg.y); ctx.lineTo(tg.x - 11, tg.y);
    ctx.moveTo(tg.x + 11, tg.y); ctx.lineTo(tg.x + 15, tg.y);
    ctx.moveTo(tg.x, tg.y - 15); ctx.lineTo(tg.x, tg.y - 11);
    ctx.moveTo(tg.x, tg.y + 11); ctx.lineTo(tg.x, tg.y + 15);
    ctx.stroke();
    ctx.restore();

    rB0.textContent = nicept.toFixed(2);
    rB1.textContent = nslope.toFixed(2);
    rR2.textContent = Math.max(0, Math.min(1, r2)).toFixed(2);

    if (!still && visible) raf = requestAnimationFrame(frame);
    else raf = null;
  }
  function play(){ if (!raf && visible && !REDUCED) raf = requestAnimationFrame(frame); }

  rebuild();
  addEventListener('resize', debounce(rebuild, 160));
  visGate(cv, v => { visible = v; if (v) play(); });
  visible = true; play();

  const themeObserver = new MutationObserver(() => {
    rebuild();
    if (visible && !REDUCED) play();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();

/* ============================================================
   FIG. 04 — HISTOGRAM
============================================================ */
(function(){
  const cv = $('#histCanvas'); if (!cv) return;
  const tip = $('#histTip');
  const MAXW = 1088, MEAN = 348, MAE = 134, NB = 30;
  const rnd = mulberry32(20240514);
  let ACCENT = '#C9F65A';
  let ctx, W, H, bins, maxC, done = false;

  function getThemeColors(){
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      accent: isLight ? '#5C8A00' : '#C9F65A',
      bg: isLight ? '#F3F4EF' : '#07080B',
      text: isLight ? '#101216' : '#F2F4F1',
      grid: isLight ? 'rgba(16,18,22,0.08)' : 'rgba(255,255,255,0.06)',
      band: isLight ? 'rgba(92,138,0,0.07)' : 'rgba(201,246,90,0.07)',
      bandLine: isLight ? 'rgba(92,138,0,0.4)' : 'rgba(201,246,90,0.4)',
      barIn: isLight ? 'rgba(92,138,0,0.8)' : 'rgba(201,246,90,0.8)',
      barOut: isLight ? 'rgba(16,18,22,0.85)' : 'rgba(242,244,241,0.85)',
      label: isLight ? 'rgba(16,18,22,0.5)' : 'rgba(242,244,241,0.5)',
    };
  }

  function gauss(){
    let u = 0, v = 0;
    while (!u) u = rnd();
    while (!v) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function sample(){
    for (let i = 0; i < 40; i++){
      const s = Math.round(Math.exp(5.67 + .6 * gauss()));
      if (s >= 1 && s <= MAXW) return s;
    }
    return MEAN;
  }
  function makeBins(){
    bins = new Array(NB).fill(0);
    for (let i = 0; i < 1000; i++) bins[Math.min(NB - 1, Math.floor(sample() / MAXW * NB))]++;
    maxC = Math.max(...bins);
  }
  const padL = 44, padR = 14, padT = 30, padB = 30;
  const plotW = () => W - padL - padR;
  const plotH = () => H - padT - padB;
  const xOf = w => padL + w / MAXW * plotW();

  function draw(prog){
    const colors = getThemeColors();
    ACCENT = colors.accent;
    ctx.clearRect(0, 0, W, H);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = colors.label;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(f => {
      const y = padT + plotH() * (1 - f);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      ctx.fillText(Math.round(maxC * f / 10) * 10, padL - 8, y);
    });
    ctx.fillText('0', padL - 8, padT + plotH());

    const bx0 = xOf(MEAN - MAE), bx1 = xOf(MEAN + MAE);
    ctx.fillStyle = colors.band;
    ctx.fillRect(bx0, padT, bx1 - bx0, plotH());
    ctx.strokeStyle = colors.bandLine; ctx.setLineDash([3, 4]);
    [bx0, bx1].forEach(x => { ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH()); ctx.stroke(); });
    ctx.setLineDash([]);

    const bw = plotW() / NB;
    for (let i = 0; i < NB; i++){
      const p = Math.max(0, Math.min(1, prog * 1.35 - (i / NB) * .35));
      const h = (bins[i] / maxC) * plotH() * easeOutCubic(p);
      if (h <= 0) continue;
      const center = (i + .5) * MAXW / NB;
      const inBand = Math.abs(center - MEAN) <= MAE;
      ctx.fillStyle = inBand ? colors.barIn : colors.barOut;
      const x = padL + i * bw + 1, y = padT + plotH() - h, w = bw - 2;
      if (ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x, y, w, h, 2); ctx.fill(); }
      else ctx.fillRect(x, y, w, h);
    }

    const mx = xOf(MEAN);
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 10;
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, padT - 4); ctx.lineTo(mx, padT + plotH()); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = ACCENT; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('μ 348', mx + 6, padT - 2);
    ctx.fillStyle = colors.label;
    ctx.textAlign = 'center';
    ctx.fillText('± MAE · 134 min', (bx0 + bx1) / 2, padT + plotH() + 16);

    ctx.textBaseline = 'top';
    [0, 250, 500, 750, 1000].forEach(w => ctx.fillText(w, xOf(w), padT + plotH() + 16));
    ctx.strokeStyle = colors.label; ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.moveTo(padL, padT + plotH()); ctx.lineTo(W - padR, padT + plotH()); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function redraw(){ ({ ctx, W, H } = fitCanvas(cv)); draw(done ? 1 : 0); }

  function animate(){
    const t0 = performance.now(), dur = 1200;
    (function fr(t){
      const p = Math.min(1, (t - t0) / dur);
      draw(p);
      if (p < 1) requestAnimationFrame(fr); else { done = true; draw(1); }
    })(t0);
  }
  cv.addEventListener('mousemove', e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < padL || x > W - padR || y < padT || y > padT + plotH()){ tip.classList.remove('show'); return; }
    const i = Math.min(NB - 1, Math.floor((x - padL) / plotW() * NB));
    const lo = Math.round(i * MAXW / NB), hi = Math.round((i + 1) * MAXW / NB);
    tip.textContent = `${lo}–${hi} min · n = ${bins[i]}`;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    tip.classList.add('show');
  });
  cv.addEventListener('mouseleave', () => tip.classList.remove('show'));

  makeBins();
  redraw();
  addEventListener('resize', debounce(redraw, 160));
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting){ if (!done && !REDUCED) animate(); else { done = true; draw(1); } o.disconnect(); }
  }), { threshold:.35 }).observe(cv);

  const themeObserver = new MutationObserver(() => {
    redraw();
    if (!done && !REDUCED) animate();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
