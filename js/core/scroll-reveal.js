// Scroll progress bar, on-scroll reveal animations, text scramble effect, and active-section observer.
/* ============================================================
   SCROLL
============================================================ */
const progress = $('#progress'), navEl = $('#nav'), heroIn = $('#heroIn');
const tl = $('#timeline'), tlFill = $('#tlFill');
let scrollQueued = false;
function onScroll(){
  scrollQueued = false;
  const sy = scrollY, h = document.documentElement;
  progress.style.transform = `scaleX(${sy / Math.max(1, h.scrollHeight - h.clientHeight)})`;
  navEl.classList.toggle('sc', sy > 12);
  if (!REDUCED){
    if (sy < 820){
      heroIn.style.transform = `translateY(${sy * .16}px)`;
      heroIn.style.opacity = Math.max(0, 1 - sy / 720);
    }
    if (tl){
      const r = tl.getBoundingClientRect();
      const passed = Math.min(r.height - 16, Math.max(0, innerHeight * .6 - r.top));
      tlFill.style.height = passed + 'px';
    }
  }
}
addEventListener('scroll', () => { if (!scrollQueued){ scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive:true });
onScroll();

/* ============================================================
   REVEALS + SCRAMBLE
============================================================ */
let revealsStarted = false;
function initReveals(){
  if (revealsStarted) return; revealsStarted = true;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold:.12 });
  $$('.reveal').forEach(el => io.observe(el));
  initScramble();
  initCharts();
  initCounts();
  initTerminal();
}
const GLYPHS = '01<>/\\_+*#@$%&?!—';
function scrambleEl(el){
  const txt = el.dataset.text;
  if (el.dataset.done || REDUCED){ el.dataset.done = 1; el.textContent = txt; return; }
  el.dataset.done = 1;
  const w = el.getBoundingClientRect().width;
  el.style.display = 'inline-block';
  if (w > 0) el.style.width = w + 'px';
  const total = Math.max(14, txt.length * 1.15);
  let frame = 0;
  (function step(){
    frame++;
    const p = frame / total;
    let out = '';
    for (let i = 0; i < txt.length; i++){
      const ch = txt[i];
      if (ch === ' '){ out += ' '; continue; }
      out += (p >= (i / txt.length) * .6 + .25) ? ch : GLYPHS[Math.random() * GLYPHS.length | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else { el.textContent = txt; el.style.width = ''; }
  })();
}
function initScramble(){
  const els = [...$$('[data-text]')];
  const io = new IntersectionObserver(es => es.forEach((e) => {
    if (e.isIntersecting){
      const idx = els.indexOf(e.target);
      setTimeout(() => scrambleEl(e.target), Math.min(600, Math.max(0, idx) * 80));
      io.unobserve(e.target);
    }
  }), { threshold:.4 });
  els.forEach(el => io.observe(el));
}

function initCharts(){
  const chartIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); chartIO.unobserve(e.target); }
  }), { threshold:.35 });
  ['#teleErrChart', '#teleMoneyChart', '#cbChart', '#fraudChart'].forEach(s => { const el = $(s); if (el) chartIO.observe(el); });
}
function runCount(el){
  const target = parseFloat(el.dataset.count);
  const dec = +(el.dataset.decimals || 0);
  const dur = +(el.dataset.dur || 1200);
  const t0 = performance.now();
  (function frame(t){
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = (target * easeOutCubic(p)).toFixed(dec);
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}
function initCounts(){
  const countIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ runCount(e.target); countIO.unobserve(e.target); }
  }), { threshold:.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));
}

/* ============================================================
   SECTION OBSERVER
============================================================ */
const navMap = {}, dotMap = {};
 $$('.nav-links a').forEach(a => navMap[a.getAttribute('href').slice(1)] = a);
 $$('#dots a').forEach(a => dotMap[a.getAttribute('href').slice(1)] = a);
const hud = $('#hud'), dotsEl = $('#dots');
function setSection(id){
  Object.values(navMap).forEach(a => a.classList.remove('act'));
  Object.values(dotMap).forEach(a => a.classList.remove('act'));
  if (navMap[id]) navMap[id].classList.add('act');
  if (dotMap[id]) dotMap[id].classList.add('act');
  const atContact = id === 'contact';
  document.body.classList.toggle('at-contact', atContact);
  dotsEl.classList.toggle('on-accent', atContact);
  hud.classList.toggle('off', atContact);
}
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) setSection(e.target.id);
}), { rootMargin:'-30% 0px -60% 0px' });
['about','experience','work','skills','education','contact'].forEach(id => {
  const s = document.getElementById(id); if (s) secIO.observe(s);
});
