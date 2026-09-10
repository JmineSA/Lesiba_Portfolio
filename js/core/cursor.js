// Custom animated cursor: a round dot + ring that glides after the pointer,
// picks up a soft comet trail while moving, gently snaps toward the center of
// magnetic (.mag) buttons, spins a slow dashed HUD ring for a cinematic
// touch, morphs into a labelled pill on flagged elements, and bursts a
// ripple on click. Uses mix-blend-mode so one accent color reads clearly
// against both light and dark backgrounds.
/* ============================================================
   CUSTOM CURSOR — round dot + ring, cinematic edition
============================================================ */
if (FINE && !REDUCED){
  document.documentElement.classList.add('cur');
  const dot = $('#curDot'), ring = $('#curRing'), label = $('#curLabel');
  const trail1 = $('#curTrail1'), trail2 = $('#curTrail2');

  let x = innerWidth / 2, y = innerHeight / 2;   // raw pointer position
  let rx = x, ry = y;                            // ring position (lags + can be pulled magnetically)
  let t1x = x, t1y = y, t2x = x, t2y = y;        // comet trail positions
  let seen = false;
  let magnet = null; // element currently exerting magnetic pull, if any

  function showAll(v){
    dot.style.opacity = ring.style.opacity = trail1.style.opacity = trail2.style.opacity = v;
  }

  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (!seen){ seen = true; rx = x; ry = y; t1x = x; t1y = y; t2x = x; t2y = y; showAll(1); }
  }, { passive:true });

  document.addEventListener('mouseleave', () => {
    showAll(0);
    label.classList.remove('show');
    seen = false;
  });

  document.addEventListener('pointerover', e => {
    const labelSrc = e.target.closest('[data-cursor]');
    const big = e.target.closest('a,button,.chip,canvas,.c-card');
    magnet = e.target.closest('.mag');

    if (labelSrc){
      label.textContent = labelSrc.dataset.cursor;
      label.classList.add('show');
      ring.classList.add('label');
      ring.classList.remove('big');
      dot.style.opacity = 0;
    } else {
      label.classList.remove('show');
      ring.classList.remove('label');
      ring.classList.toggle('big', !!big);
      dot.style.opacity = 1;
    }
  });

  addEventListener('pointerdown', e => {
    ring.classList.add('down');
    const r = document.createElement('span');
    r.className = 'cur-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
  addEventListener('pointerup', () => ring.classList.remove('down'));

  // Dot tracks the real pointer directly (instant); the ring glides toward it
  // with a light, snappy ease. When hovering a `.mag` element, the ring's
  // target gently shifts toward that element's center for a magnetic "snap"
  // feel. A short comet trail chases the ring for a cinematic sense of motion.
  (function loop(){
    let targetX = x, targetY = y;
    if (magnet){
      const r = magnet.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      targetX = x + (cx - x) * .55;
      targetY = y + (cy - y) * .55;
    }

    rx += (targetX - rx) * .28;
    ry += (targetY - ry) * .28;
    t1x += (rx - t1x) * .35;
    t1y += (ry - t1y) * .35;
    t2x += (t1x - t2x) * .35;
    t2y += (t1y - t2y) * .35;

    dot.style.transform    = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    ring.style.transform   = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    trail1.style.transform = `translate(${t1x}px,${t1y}px) translate(-50%,-50%)`;
    trail2.style.transform = `translate(${t2x}px,${t2y}px) translate(-50%,-50%)`;
    label.style.transform  = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${label.classList.contains('show') ? 1 : .6})`;

    requestAnimationFrame(loop);
  })();
}
