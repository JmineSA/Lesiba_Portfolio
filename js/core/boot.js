// Preloader boot sequence.
/* ============================================================
   BOOT
============================================================ */
(function boot(){
  const loader = $('#loader'), fill = $('#loadFill'), pct = $('#loadPct');
  let finished = false;
  function done(){
    if (finished) return; finished = true;
    fill.style.width = '100%'; pct.textContent = '100%';
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 1150);
    $$('.h-rev').forEach((el, i) => setTimeout(() => el.classList.add('in'), REDUCED ? 0 : 90 * i + 100));
    initReveals();
  }
  if (REDUCED){ done(); return; }
  let p = 0;
  (function step(){
    p = Math.min(100, p + 3 + Math.random() * 9);
    fill.style.width = p + '%';
    pct.textContent = String(Math.floor(p)).padStart(3, '0') + '%';
    if (p < 100) setTimeout(step, 36 + Math.random() * 66);
    else setTimeout(done, 260);
  })();
  setTimeout(done, 5000);
})();
