// Shared DOM helpers, feature-detection flags, and small utilities used across every module.
/* ============================================================
   HELPERS & ENVIRONMENT
============================================================ */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE    = matchMedia('(pointer: fine)').matches;
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }
function easeOutCubic(p){ return 1 - Math.pow(1 - p, 3); }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function fitCanvas(cv){
  const dpr = Math.min(2, devicePixelRatio || 1);
  const r = cv.getBoundingClientRect();
  cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: r.width, H: r.height };
}
function visGate(el, onChange){
  new IntersectionObserver(es => es.forEach(e => onChange(e.isIntersecting)), { threshold:0 }).observe(el);
}
