// Cmd/Ctrl+K command palette.
/* ============================================================
   COMMAND PALETTE
============================================================ */
(function commandPalette(){
  const overlay = $('#cmdkOverlay'); if (!overlay) return;
  const input = $('#cmdkInput'), list = $('#cmdkList');
  const ICON = {
    section: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l7 6-7 6z"/></svg>',
    link:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    action:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'
  };
  const COMMANDS = [
    { label:'About',            tag:'Section', icon:'section', run:() => go('#about') },
    { label:'Experience',       tag:'Section', icon:'section', run:() => go('#experience') },
    { label:'Selected Work',    tag:'Section', icon:'section', run:() => go('#work') },
    { label:'Skills',           tag:'Section', icon:'section', run:() => go('#skills') },
    { label:'Education',        tag:'Section', icon:'section', run:() => go('#education') },
    { label:'Contact',          tag:'Section', icon:'section', run:() => go('#contact') },
    { label:'Mobile Data Consumption Intelligence — GitHub', tag:'Project', icon:'link', run:() => open('https://github.com/JmineSA/telecom-consumption-intelligence') },
    { label:'UbuntuCare Wait-Time System — GitHub',          tag:'Project', icon:'link', run:() => open('https://github.com/JmineSA/UbuntuCare-QueueOptimizer') },
    { label:'Fraud Detection in Banking — GitHub',           tag:'Project', icon:'link', run:() => open('https://github.com/JmineSA/Financial-Fraud-Modeling-for-LOL-Bank') },
    { label:'Download CV (PDF)', tag:'Action', icon:'action', run:() => open('assets/Lesiba_Kganyago_CV.pdf') },
    { label:'Copy email address', tag:'Action', icon:'action', run:() => { $('#copyBtn')?.click(); } },
    { label:'Open GitHub profile', tag:'Action', icon:'action', run:() => open('https://github.com/JmineSA') },
    { label:'Open LinkedIn profile', tag:'Action', icon:'action', run:() => open('https://www.linkedin.com/in/lesiba-kganyago-a39b302b0') },
    { label:'Toggle light / dark theme', tag:'Action', icon:'action', run:() => $('.theme-toggle')?.click() },
  ];
  function go(hash){ close(); const el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  function open(url){ close(); window.open(url, '_blank', 'noopener'); }

  let filtered = COMMANDS.slice(), activeIdx = 0;

  function render(){
    list.innerHTML = '';
    if (!filtered.length){
      list.innerHTML = '<div class="cmdk-empty">No matches — try “work”, “cv”, or “contact”.</div>';
      return;
    }
    filtered.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'cmdk-item' + (i === activeIdx ? ' act' : '');
      row.innerHTML = `<span class="l">${ICON[c.icon]}<b>${c.label}</b></span><span class="tag">${c.tag}</span>`;
      row.addEventListener('mouseenter', () => { activeIdx = i; render(); });
      row.addEventListener('click', () => c.run());
      list.appendChild(row);
    });
  }
  function filter(){
    const q = input.value.trim().toLowerCase();
    filtered = !q ? COMMANDS.slice() : COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q));
    activeIdx = 0;
    render();
  }
  function openPalette(){
    overlay.classList.add('open');
    input.value = ''; filter();
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 30);
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); overlay.classList.contains('open') ? close() : openPalette(); }
    else if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    else if (overlay.classList.contains('open')){
      if (e.key === 'ArrowDown'){ e.preventDefault(); activeIdx = Math.min(filtered.length - 1, activeIdx + 1); render(); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); activeIdx = Math.max(0, activeIdx - 1); render(); }
      else if (e.key === 'Enter'){ e.preventDefault(); filtered[activeIdx]?.run(); }
    }
  });
  input.addEventListener('input', filter);
  overlay.addEventListener('mousedown', e => { if (e.target === overlay) close(); });
  $$('[data-cmdk-open]').forEach(b => b.addEventListener('click', openPalette));
  filter();
})();
