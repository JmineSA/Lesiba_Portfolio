// Light/dark theme toggle.
/* ============================================================
   THEME TOGGLE
============================================================ */
(function themeInit(){
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem('lk-theme'); } catch { return null; } })();
  const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || 'dark';
  if (initial === 'light') root.setAttribute('data-theme', 'light');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  function paintMeta(){ if (metaTheme) metaTheme.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#F3F4EF' : '#07080B'); }
  paintMeta();
  function toggle(){
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('lk-theme', isLight ? 'dark' : 'light'); } catch {}
    paintMeta();
    setTimeout(() => {
      const event = new Event('themechange');
      document.dispatchEvent(event);
    }, 50);
  }
  $$('.theme-toggle').forEach(b => b.addEventListener('click', toggle));
})();
