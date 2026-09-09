// Live Pretoria (SAST) clock in the header.
/* ============================================================
   PRETORIA CLOCK
============================================================ */
const clocks = $$('.js-clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone:'Africa/Johannesburg', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
function tickClock(){ const t = fmt.format(new Date()); clocks.forEach(c => c.textContent = t); }
tickClock(); setInterval(tickClock, 1000);
