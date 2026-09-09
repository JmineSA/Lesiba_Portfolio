// Expand/collapse behaviour for project case-study details.
/* ============================================================
   FEATURE: Case Study Details Enhancement
============================================================ */
(function caseStudies() {
  document.querySelectorAll('.case-study-details').forEach(details => {
    details.addEventListener('toggle', function() {
      if (this.open) {
        this.style.transition = 'border-color 0.3s';
        this.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          this.style.borderColor = '';
        }, 600);
      }
    });
  });
})();

console.log('🚀 Portfolio upgraded with ULTIMATE features!');
console.log('📦 New Features:');
console.log('  🌍 Multi-Language Support (EN, AF, ZU)');
console.log('  📊 Live GitHub Activity Feed');
console.log('  📈 Analytics Dashboard');
console.log('  🤖 Enhanced AI Chatbot with Suggestions');
console.log('  💬 Chat Notification & Pulse Ring');
console.log('  🏆 Achievement Knowledge Base');
console.log('  🎵 Background Music with 3 Songs');
console.log('  🎮 Interactive Data Game - Guess the Prediction');
console.log('  ✨ Subtle Particle Network');
console.log('  🎨 Complete Light/Dark Mode Support');
console.log('  📱 Mobile Responsive');
