// Custom animated cursor: an arrow-glyph image that follows the pointer with a
// light, smooth glide, morphs into a labelled pill on flagged interactive
// elements, and bursts a ripple on click.
/* ============================================================
   CUSTOM CURSOR — arrow glyph
============================================================ */
if (FINE && !REDUCED){
  document.documentElement.classList.add('cur');
  const arrow = $('#cursorArrow'), label = $('#curLabel');
  let x = innerWidth / 2, y = innerHeight / 2, ax = x, ay = y, seen = false;

  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (!seen){ seen = true; ax = x; ay = y; arrow.style.opacity = 1; }
  }, { passive:true });

  document.addEventListener('mouseleave', () => { arrow.style.opacity = 0; label.classList.remove('show'); seen = false; });

  document.addEventListener('pointerover', e => {
    const labelSrc = e.target.closest('[data-cursor]');
    const big = e.target.closest('a,button,.chip,canvas,.c-card');
    if (labelSrc){
      label.textContent = labelSrc.dataset.cursor;
      label.classList.add('show');
      arrow.classList.remove('big');
    } else {
      label.classList.remove('show');
      arrow.classList.toggle('big', !!big);
    }
  });

  addEventListener('pointerdown', e => {
    arrow.classList.add('down');
    const r = document.createElement('span');
    r.className = 'cur-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
  addEventListener('pointerup', () => arrow.classList.remove('down'));

  // Light, snappy glide toward the real pointer position — no rotation or
  // scale jitter, just a soft trailing ease so it feels quick, not heavy.
  (function loop(){
    ax += (x - ax) * .45;
    ay += (y - ay) * .45;

    arrow.style.transform = `translate(${ax}px,${ay}px)`;
    label.style.transform = `translate(${ax + 20}px,${ay + 18}px)`;

    requestAnimationFrame(loop);
  })();
}
