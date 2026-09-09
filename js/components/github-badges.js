// Live GitHub repo stat badges on project cards.
/* ============================================================
   GITHUB BADGES
============================================================ */
(function ghBadges(){
  const links = [...$$('.repo-link[data-repo]')];
  if (!links.length) return;
  const fmtDate = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  };
  links.forEach(async (a) => {
    const repo = a.dataset.repo;
    const holder = document.createElement('div');
    holder.className = 'repo-badges';
    a.closest('h3')?.insertAdjacentElement('afterend', holder);
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (!res.ok) throw new Error('gh api error');
      const data = await res.json();
      const stars = data.stargazers_count ?? 0;
      const lang = data.language;
      const updated = data.pushed_at ? fmtDate(data.pushed_at) : null;
      let html = `<span class="gh-badge stars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>${stars} star${stars === 1 ? '' : 's'}</span>`;
      if (lang) html += `<span class="gh-badge lang">${lang}</span>`;
      if (updated) html += `<span class="gh-badge updated"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Updated ${updated}</span>`;
      holder.innerHTML = html;
    } catch {
      holder.remove();
    }
  });
})();
