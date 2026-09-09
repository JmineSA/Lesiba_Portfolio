// Animated "whoami" terminal typewriter in the hero panel.
/* ============================================================
   TERMINAL
============================================================ */
const TERM = [
  { p:'whoami' },
  { o:'lesiba_james_kganyago — data scientist' },
  { p:'cat education.txt' },
  { o:'BSc Informatics · UNISA · 2024' },
  { o:'IBM Data Science Professional Certificate' },
  { p:'git log --oneline -2' },
  { c:'f4a9e12 feat: telecom consumption intelligence' },
  { c:'9f8e7d6 perf: wait-time MAE → 134 min' },
  { p:'echo $STATUS' },
  { ok:'open_to_work = True' },
];
function typeInto(el, text, speed, cb){
  let j = 0;
  (function st(){
    el.textContent = text.slice(0, ++j);
    if (j < text.length) setTimeout(st, speed + Math.random() * speed);
    else cb && cb();
  })();
}
function initTerminal(){
  const body = $('#termBody');
  if (!body || body.dataset.done) return;
  body.dataset.done = 1;
  const cur = document.createElement('span'); cur.className = 'cursor';
  if (REDUCED){
    TERM.forEach(L => {
      const p = document.createElement('p');
      if (L.p) p.innerHTML = '<span class="t-p">$</span> ' + L.p;
      else { const s = document.createElement('span'); s.className = L.o ? 't-o' : L.c ? 't-cm' : 't-ok'; s.textContent = L.o || L.c || L.ok; p.appendChild(s); }
      body.appendChild(p);
    });
    const p = document.createElement('p'); p.innerHTML = '<span class="t-p">$</span> '; p.appendChild(cur); body.appendChild(p);
    return;
  }
  let i = 0;
  (function nextLine(){
    if (i >= TERM.length){
      const p = document.createElement('p'); p.innerHTML = '<span class="t-p">$</span> '; p.appendChild(cur); body.appendChild(p);
      return;
    }
    const L = TERM[i++], p = document.createElement('p');
    body.appendChild(p);
    if (L.p){
      p.innerHTML = '<span class="t-p">$</span> <span class="t-o"></span>';
      const tgt = p.querySelector('.t-o');
      typeInto(tgt, L.p, 26, () => { p.appendChild(cur); setTimeout(nextLine, 160); });
    } else {
      const cls = L.o ? 't-o' : L.c ? 't-cm' : 't-ok';
      const s = document.createElement('span'); s.className = cls; p.appendChild(s);
      typeInto(s, L.o || L.c || L.ok, 9, () => setTimeout(nextLine, 90));
    }
  })();
}
