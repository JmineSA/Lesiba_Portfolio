/* ============================================================
   CUSTOM CURSOR — Elegant Ring System
============================================================ */
if (FINE && !REDUCED) {
  document.documentElement.classList.add('cur');
  
  // Create cursor elements
  const ring = document.createElement('div');
  ring.id = 'cursorRing';
  
  const dot = document.createElement('div');
  dot.id = 'cursorDot';
  
  const ringOuter = document.createElement('div');
  ringOuter.id = 'cursorRingOuter';
  
  const label = document.createElement('div');
  label.id = 'cursorLabel';
  
  document.body.appendChild(ringOuter);
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.body.appendChild(label);
  
  // State management
  let x = innerWidth / 2, y = innerHeight / 2;
  let dx = x, dy = y; // dot position (instant)
  let rx = x, ry = y; // ring position (medium delay)
  let ox = x, oy = y; // outer ring position (slow delay)
  let seen = false;
  let isDown = false;
  
  // Velocity tracking for dynamic effects
  let lastX = x, lastY = y;
  let velocity = 0;
  
  addEventListener('pointermove', e => {
    x = e.clientX;
    y = e.clientY;
    
    if (!seen) {
      seen = true;
      dx = x; dy = y;
      rx = x; ry = y;
      ox = x; oy = y;
      ring.style.opacity = 1;
      dot.style.opacity = 1;
      ringOuter.style.opacity = 1;
    }
    
    // Calculate velocity
    const movement = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
    velocity = movement * 0.1;
    lastX = x;
    lastY = y;
    
    // Dynamic ring scaling based on velocity
    if (!isDown && !ring.classList.contains('hover') && !ring.classList.contains('text')) {
      const speedScale = Math.min(velocity, 10);
      const dynamicSize = 40 + speedScale * 2;
      ring.style.width = dynamicSize + 'px';
      ring.style.height = dynamicSize + 'px';
      ring.style.margin = `-${dynamicSize / 2}px 0 0 -${dynamicSize / 2}px`;
    }
  }, { passive: true });
  
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = 0;
    dot.style.opacity = 0;
    ringOuter.style.opacity = 0;
    label.classList.remove('show');
    seen = false;
  });
  
  // Hover detection with specific states
  document.addEventListener('pointerover', e => {
    const target = e.target;
    const textInput = target.closest('input[type="text"], textarea, [contenteditable="true"], input[type="search"], input[type="email"], input[type="password"]');
    const draggable = target.closest('[draggable="true"], .draggable, .drag-handle');
    const interactive = target.closest('a, button, [role="button"], .clickable, select');
    const labelElement = target.closest('[data-cursor]');
    
    // Reset all states
    ring.classList.remove('hover', 'text', 'drag');
    dot.classList.remove('hover', 'text');
    ringOuter.classList.remove('hover');
    
    if (labelElement) {
      label.textContent = labelElement.dataset.cursor;
      label.classList.add('show');
      return;
    }
    
    label.classList.remove('show');
    
    if (textInput) {
      ring.classList.add('text');
      dot.classList.add('text');
    } else if (draggable) {
      ring.classList.add('drag');
    } else if (interactive) {
      ring.classList.add('hover');
      dot.classList.add('hover');
      ringOuter.classList.add('hover');
    }
  });
  
  // Click handling with ripple
  addEventListener('pointerdown', e => {
    isDown = true;
    ring.classList.add('click');
    dot.classList.add('click');
    ringOuter.classList.add('click');
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ring-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
  
  addEventListener('pointerup', () => {
    isDown = false;
    ring.classList.remove('click');
    dot.classList.remove('click');
    ringOuter.classList.remove('click');
  });
  
  // Smooth animation with different delays for each ring
  (function animate() {
    // Dot follows instantly (with minimal smoothing)
    dx += (x - dx) * 0.85;
    dy += (y - dy) * 0.85;
    
    // Main ring follows with medium delay
    rx += (x - rx) * 0.25;
    ry += (y - ry) * 0.25;
    
    // Outer ring follows slowly (creates depth)
    ox += (x - ox) * 0.1;
    oy += (y - oy) * 0.1;
    
    // Apply transforms
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Apply rotation for drag state
    if (ring.classList.contains('drag')) {
      const angle = performance.now() * 0.05;
      ring.style.transform = `translate(${rx}px, ${ry}px) rotate(${angle}deg)`;
    } else {
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
    }
    
    ringOuter.style.transform = `translate(${ox}px, ${oy}px)`;
    
    // Position label with offset
    label.style.transform = `translate(${x + 24}px, ${y + 24}px)`;
    
    requestAnimationFrame(animate);
  })();
  
  // Reset velocity-based sizing when idle
  setInterval(() => {
    velocity *= 0.5;
  }, 100);
}