// Live GitHub activity feed (cached).
/* ============================================================
   UPGRADE: Live GitHub Activity Feed (Cached)
============================================================ */
(function githubFeed() {
  const feed = document.getElementById('githubFeed');
  const stats = document.getElementById('githubStats');
  if (!feed) return;

  const username = 'JmineSA';
  
  const cached = localStorage.getItem('github-cache');
  let cacheData = null;
  
  if (cached) {
    try {
      cacheData = JSON.parse(cached);
      if (cacheData && (Date.now() - cacheData.timestamp < 300000)) {
        renderData(cacheData.data);
        return;
      }
    } catch (e) {}
  }

  async function fetchGitHub() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const [reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=10`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        })
      ]);
      
      clearTimeout(timeoutId);
      
      if (!reposRes.ok || !eventsRes.ok) throw new Error('GitHub API error');

      const repos = await reposRes.json();
      const events = await eventsRes.json();
      
      const data = { repos, events };
      
      localStorage.setItem('github-cache', JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
      
      renderData(data);
      
    } catch (error) {
      console.warn('GitHub feed: Using cached data (if available)');
      
      if (cacheData) {
        renderData(cacheData.data);
      } else {
        feed.innerHTML = `
          <div class="event">
            <span class="event-content" style="color:var(--muted);">
              ⚡ GitHub data temporarily unavailable.
            </span>
          </div>
        `;
        stats.innerHTML = '';
      }
    }
  }

  function renderData(data) {
    const { repos, events } = data;
    
    let html = '';
    const relevantEvents = events.filter(e => 
      ['PushEvent', 'CreateEvent', 'WatchEvent', 'ForkEvent'].includes(e.type)
    ).slice(0, 5);

    if (relevantEvents.length) {
      relevantEvents.forEach(event => {
        const icons = {
          'PushEvent': '📦',
          'CreateEvent': '✨',
          'WatchEvent': '⭐',
          'ForkEvent': '🔀'
        };
        const icon = icons[event.type] || '📌';
        const repoName = event.repo?.name?.split('/')[1] || 'unknown';
        const action = event.type === 'PushEvent' ? `pushed to` :
                      event.type === 'CreateEvent' ? `created` :
                      event.type === 'WatchEvent' ? `starred` :
                      event.type === 'ForkEvent' ? `forked` : 'updated';
        const timeAgo = timeSince(new Date(event.created_at));

        html += `
          <div class="event">
            <span class="event-icon">${icon}</span>
            <div class="event-content">
              <span class="action">${action} <span class="repo">${repoName}</span></span>
              <span class="time">${timeAgo}</span>
            </div>
          </div>
        `;
      });
    } else {
      html = '<div class="event"><span class="event-content" style="color:var(--muted);">No recent activity</span></div>';
    }

    feed.innerHTML = html;

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const totalRepos = repos.length;

    stats.innerHTML = `
      <div class="github-stat">
        <div class="number">${totalRepos}</div>
        <span class="label">Repositories</span>
      </div>
      <div class="github-stat">
        <div class="number">${totalStars}</div>
        <span class="label">Stars</span>
      </div>
      <div class="github-stat">
        <div class="number">${totalForks}</div>
        <span class="label">Forks</span>
      </div>
      <div class="github-stat">
        <div class="number">${repos[0]?.stargazers_count || 0}</div>
        <span class="label">Top Starred</span>
      </div>
    `;
  }

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  setTimeout(fetchGitHub, 1000);
  setInterval(fetchGitHub, 300000);
})();
