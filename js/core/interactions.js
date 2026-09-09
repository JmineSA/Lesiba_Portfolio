// Mobile menu, hero role cycler, spotlight hover glow, magnetic buttons, and 3D tilt cards.
/* ============================================================
   MOBILE MENU + ROLE CYCLER + SPOTLIGHT + MAGNETIC + TILT
============================================================ */
const burger = $('#burger'), mnav = $('#mnav');
function setMenu(open){
  burger.classList.toggle('open', open);
  mnav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

(function cycleRole(){
  const words = ['Data Scientist', 'ML Engineer', 'Analytics Consultant'];
  const el = $('#cycleWord'); let i = 0;
  if (REDUCED) return;
  setInterval(() => {
    el.classList.add('cycle-out');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('cycle-out');
      el.classList.add('cycle-in');
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('cycle-in')));
    }, 290);
  }, 2600);
})();

 $$('.spot').forEach(tile => tile.addEventListener('mousemove', e => {
  const r = tile.getBoundingClientRect();
  tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

if (FINE && !REDUCED){
  $$('.mag').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * .18}px, ${dy * .24}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
 $$('.tilt').forEach(el => {
  el.addEventListener('pointermove', e => {
    if (!FINE || REDUCED) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - .5) * 6.5).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((.5 - py) * 6.5).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (px * 100) + '%');
    el.style.setProperty('--gy', (py * 100) + '%');
  });
  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
  });
});

const logoTxt = $('#logoTxt');
logoTxt.parentElement.addEventListener('mouseenter', () => {
  if (!logoTxt.dataset.text) logoTxt.dataset.text = logoTxt.textContent;
  logoTxt.dataset.done = ''; scrambleEl(logoTxt);
});
