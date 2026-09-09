// Ambient canvas backgrounds: starfield + neural-network constellation.
/* ============================================================
   STARFIELD
============================================================ */
(function(){
  const cv = $('#stars');
  let ctx, W, H, stars = [], shoots = [], nextShoot = 0;

  function build(){
    ({ ctx, W, H } = fitCanvas(cv));
    const count = Math.min(240, Math.round(W * H / 8500));
    const COLS = ['255,255,255','255,255,255','255,255,255','201,246,90','110,231,255'];
    stars = [];
    for (let i = 0; i < count; i++){
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        z: .15 + Math.random() * .85,
        r: .4 + Math.random() * 1.3,
        a: .25 + Math.random() * .6,
        sp: .4 + Math.random() * 1.6,
        ph: Math.random() * 6.28,
        c: COLS[Math.random() * COLS.length | 0]
      });
    }
  }
  function frame(t){
    ctx.clearRect(0, 0, W, H);
    const sy = scrollY;
    for (const s of stars){
      const y = (((s.y - sy * (.05 + s.z * .3)) % H) + H) % H;
      const a = s.a * (.6 + .4 * Math.sin(t * .001 * s.sp + s.ph));
      ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.2832); ctx.fill();
    }
    if (t > nextShoot && shoots.length < 2){
      nextShoot = t + 2800 + Math.random() * 4500;
      shoots.push({ x: W * (.15 + Math.random() * .7), y: H * Math.random() * .35, vx: 6 + Math.random() * 5, vy: 2.2 + Math.random() * 2, life: 1 });
    }
    for (let i = shoots.length - 1; i >= 0; i--){
      const sh = shoots[i];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= .018;
      if (sh.life <= 0){ shoots.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 13, sh.y - sh.vy * 13);
      g.addColorStop(0, `rgba(210,255,160,${(sh.life * .9).toFixed(3)})`);
      g.addColorStop(1, 'rgba(210,255,160,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 13, sh.y - sh.vy * 13);
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  build();
  addEventListener('resize', debounce(build, 200));
  if (REDUCED){
    for (const s of stars){
      ctx.fillStyle = `rgba(${s.c},${s.a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  } else requestAnimationFrame(frame);
})();

/* ============================================================
   NEURAL CONSTELLATION
============================================================ */
(function(){
  const hero = document.querySelector('.hero');
  const cv = $('#net'); if (!cv) return;
  const ACCENT = '#C9F65A', TEAL = '#6EE7FF';
  const D = 140, D2 = D * D;
  let ctx, W, H, nodes = [], pulses = [], edges = [], visible = false, raf = null;
  let mx = -9999, my = -9999;

  function build(){
    ({ ctx, W, H } = fitCanvas(cv));
    const count = Math.max(26, Math.min(70, Math.round(W * H / 24000)));
    nodes = [];
    for (let i = 0; i < count; i++){
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: 1.2 + Math.random() * 1.5,
        hub: Math.random() < .14
      });
    }
    pulses = [];
    if (REDUCED) frame(performance.now(), true);
  }
  hero.addEventListener('pointermove', e => {
    if (!FINE) return;
    const r = cv.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mx = my = -9999; });

  function frame(t, still = false){
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes){
      const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
      if (d < 150 && d > .01){
        const f = (1 - d / 150) * .55;
        n.vx += dx / d * f; n.vy += dy / d * f;
      }
      n.vx *= .96; n.vy *= .96;
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W){ n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
      if (n.y < 0 || n.y > H){ n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
    }
    edges.length = 0;
    for (let i = 0; i < nodes.length; i++){
      for (let j = i + 1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < D2){
          edges.push([i, j]);
          const alpha = (1 - Math.sqrt(d2) / D) * .16;
          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (!still && edges.length && pulses.length < 6 && Math.random() < .05){
      const [ai, bi] = edges[Math.random() * edges.length | 0];
      pulses.push({ a: ai, b: bi, t: 0, sp: .014 + Math.random() * .014 });
    }
    for (let i = pulses.length - 1; i >= 0; i--){
      const p = pulses[i];
      p.t += p.sp;
      if (p.t >= 1){ pulses.splice(i, 1); continue; }
      const a = nodes[p.a], b = nodes[p.b];
      const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      ctx.save();
      ctx.shadowColor = TEAL; ctx.shadowBlur = 8;
      ctx.fillStyle = TEAL;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832); ctx.fill();
      ctx.restore();
    }
    for (const n of nodes){
      if (n.hub){
        ctx.save();
        ctx.shadowColor = ACCENT; ctx.shadowBlur = 9;
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + .7, 0, 6.2832); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(242,244,241,.7)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
    }
    if (!still && visible) raf = requestAnimationFrame(frame);
    else raf = null;
  }
  function play(){ if (!raf && visible && !REDUCED) raf = requestAnimationFrame(frame); }

  build();
  addEventListener('resize', debounce(build, 200));
  visGate(hero, v => { visible = v; if (v) play(); });
  visible = true; play();
})();
