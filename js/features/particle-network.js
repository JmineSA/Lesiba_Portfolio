// Subtle ambient particle network background.
/* ============================================================
   FEATURE: Subtle Particle Network
============================================================ */
(function particleNetwork() {
  const container = document.getElementById('particleContainer');
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 60;
  const connectionDistance = 150;
  
  function resize() {
    width = canvas.width = container.offsetWidth || window.innerWidth;
    height = canvas.height = container.offsetHeight || window.innerHeight;
  }
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 2,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  
  let mouseX = -1000;
  let mouseY = -1000;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const particleColor = isDark ? 'rgba(201,246,90,' : 'rgba(92,138,0,';
    const lineColor = isDark ? 'rgba(201,246,90,' : 'rgba(92,138,0,';
    
    particles.forEach(p => {
      p.x += p.vx + (p.baseX - p.x) * 0.0005;
      p.y += p.vy + (p.baseY - p.y) * 0.0005;
      
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) {
        const force = (200 - dist) / 200 * 0.01;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }
      
      p.x += Math.sin(Date.now() * 0.0005 + p.phase) * 0.02;
      p.y += Math.cos(Date.now() * 0.0007 + p.phase) * 0.02;
      
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.25;
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor + '0.6)';
      ctx.fill();
      
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
      gradient.addColorStop(0, particleColor + '0.15)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  
  resize();
  createParticles();
  animate();
  
  console.log('✨ Particle network ready!');
})();
