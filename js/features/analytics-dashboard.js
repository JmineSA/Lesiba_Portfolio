// Lightweight on-page analytics dashboard.
/* ============================================================
   UPGRADE: Analytics Dashboard
============================================================ */
(function analytics() {
  let analyticsData = JSON.parse(localStorage.getItem('portfolio-analytics') || 'null');
  if (!analyticsData) {
    analyticsData = {
      pageViews: 0,
      clicks: 0,
      projectsViewed: 0,
      socialClicks: 0,
      startTime: Date.now()
    };
  }

  if (!sessionStorage.getItem('analytics-viewed')) {
    analyticsData.pageViews += 1;
    sessionStorage.setItem('analytics-viewed', 'true');
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .case, .tile, .stat, .chip, .lang-btn, .theme-toggle');
    if (target) {
      analyticsData.clicks += 1;

      if (target.closest('.case')) {
        analyticsData.projectsViewed += 1;
      }

      if (target.closest('.socials a, .c-card a')) {
        analyticsData.socialClicks += 1;
      }

      localStorage.setItem('portfolio-analytics', JSON.stringify(analyticsData));
      updateDisplay();
    }
  });

  function updateDisplay() {
    const pageViews = document.getElementById('pageViews');
    const clicks = document.getElementById('clicks');
    const projectsViewed = document.getElementById('projectsViewed');
    const socialClicks = document.getElementById('socialClicks');
    const timeOnPage = document.getElementById('timeOnPage');

    if (pageViews) pageViews.textContent = analyticsData.pageViews;
    if (clicks) clicks.textContent = analyticsData.clicks;
    if (projectsViewed) projectsViewed.textContent = analyticsData.projectsViewed;
    if (socialClicks) socialClicks.textContent = analyticsData.socialClicks;

    if (timeOnPage) {
      const elapsed = Math.floor((Date.now() - analyticsData.startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      timeOnPage.textContent = `${mins}m ${secs}s`;
    }

    setTimeout(updateDisplay, 10000);
  }

  updateDisplay();

  fetch('https://api.github.com/users/JmineSA/repos')
    .then(res => res.json())
    .then(repos => {
      const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      const repoStars = document.getElementById('repoStars');
      if (repoStars) repoStars.textContent = totalStars;
    })
    .catch(() => {});
})();
