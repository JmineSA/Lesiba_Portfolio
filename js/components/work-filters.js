// "Selected Work" tag filters.
/* ============================================================
   WORK FILTERS
============================================================ */
(function workFilters(){
  const bar = $('#workFilterBar'); const cases = [...$$('.case[data-tags]')];
  if (!bar || !cases.length) return;
  const tagSet = new Set();
  cases.forEach(c => c.dataset.tags.split(',').forEach(t => tagSet.add(t.trim())));
  const tags = ['All', ...[...tagSet].sort()];
  bar.innerHTML = tags.map((t, i) => `<button class="fchip${i === 0 ? ' act' : ''}" data-tag="${t}">${t}</button>`).join('');
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.fchip'); if (!btn) return;
    bar.querySelectorAll('.fchip').forEach(b => b.classList.remove('act'));
    btn.classList.add('act');
    const tag = btn.dataset.tag;
    cases.forEach(c => {
      const show = tag === 'All' || c.dataset.tags.split(',').map(s => s.trim()).includes(tag);
      c.classList.toggle('hide', !show);
    });
  });
})();
