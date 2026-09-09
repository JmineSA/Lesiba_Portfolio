// Reading progress indicator.
/* ============================================================
   FEATURE: Reading Progress Bar
============================================================ */
(function readingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (sy / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();
