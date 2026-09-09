// Extra scroll-triggered animation helpers.
/* ============================================================
   FEATURE: Enhanced Scroll Animations
============================================================ */
(function enhancedScroll() {
  const stats = document.querySelectorAll('.stat');
  if (stats.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    stats.forEach(stat => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(20px)';
      stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      io.observe(stat);
    });
  }
})();
