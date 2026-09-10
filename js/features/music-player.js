/* ============================================================
   FEATURE: Background Music Player (single track)
   - Muted-then-fade-in autoplay
   - Web Audio gain for smooth fades + visualizer
   - Remembers play state + volume
   - Respects reduced-motion / saveData / slow networks
============================================================ */
(function musicPlayer() {
  console.log('[music] boot');

  // ---------- Environment checks ----------
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData     = navigator.connection?.saveData === true;
  const slowNetwork  = /(^|-)2g$/.test(navigator.connection?.effectiveType || '');
  if (saveData || slowNetwork) {
    console.info('[music] skipped: saveData / slow network.');
    return;
  }

  // ---------- DOM ----------
  const el = {
    player:     document.getElementById('musicPlayer'),
    toggle:     document.getElementById('musicToggle'),
    volume:     document.getElementById('musicVolume'),
    nowPlaying: document.getElementById('nowPlaying'),
    label:      document.getElementById('musicLabel'),
    audio:      document.getElementById('bgMusicA'),
    viz:        document.getElementById('musicVisualizer'),
  };

  if (!el.audio || !el.toggle) {
    console.warn('[music] player elements not found.');
    return;
  }

  // ---------- State ----------
  let isPlaying = false;
  let savedVolume = Number(localStorage.getItem('music-volume'));
  if (!savedVolume && savedVolume !== 0) savedVolume = 10;
  const shouldAutoStart = localStorage.getItem('music-playing') !== 'false';

  el.audio.volume = savedVolume / 100;
  if (el.volume) el.volume.value = savedVolume;

  // ---------- Web Audio graph ----------
  let ctx, gain, analyser;
  function initAudioGraph() {
    if (ctx || !window.AudioContext) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(el.audio);
      gain = ctx.createGain();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 32;
      analyser.smoothingTimeConstant = 0.75;
      src.connect(gain).connect(analyser).connect(ctx.destination);
      gain.gain.value = savedVolume / 100;
      console.log('[music] Web Audio graph ready');
    } catch (err) {
      console.warn('[music] Web Audio unavailable, using element.volume', err);
      ctx = gain = analyser = null;
    }
  }

  // ---------- Fade helper ----------
  function fadeVolumeTo(target, ms) {
    if (gain && ctx) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
      gain.gain.linearRampToValueAtTime(Math.max(0.0001, target), now + ms / 1000);
      return;
    }
    const start = performance.now();
    const from = el.audio.volume;
    (function step(now) {
      const p = Math.min(1, (now - start) / ms);
      el.audio.volume = from + (target - from) * p;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  // ---------- UI ----------
  function setPlayingUI(playing) {
    isPlaying = playing;
    el.toggle.classList.toggle('playing', playing);
    el.player.classList.toggle('playing', playing);
    el.toggle.setAttribute('aria-pressed', String(playing));
    localStorage.setItem('music-playing', String(playing));
    if (playing) startVisualizer();
    else stopVisualizer();
  }

  // ---------- Visualizer ----------
  const vizBars = el.viz ? Array.from(el.viz.querySelectorAll('span')) : [];
  let vizRAF = null;

  function startVisualizer() {
    if (!analyser || !el.viz || reduceMotion) return;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(bins);
      vizBars.forEach((bar, i) => {
        const v = (bins[i * 2] || 0) / 255;
        bar.style.transform = `scaleY(${(0.15 + v * 0.85).toFixed(3)})`;
      });
      vizRAF = requestAnimationFrame(tick);
    };
    tick();
  }
  function stopVisualizer() {
    if (vizRAF) cancelAnimationFrame(vizRAF);
    vizRAF = null;
    vizBars.forEach(bar => { bar.style.transform = 'scaleY(0.15)'; });
  }

  // ---------- Autoplay ----------
  async function attemptAutoplay() {
    initAudioGraph();
    if (ctx?.state === 'suspended') { try { await ctx.resume(); } catch {} }

    // muted-first trick
    el.audio.muted = true;
    if (gain) gain.gain.value = 0;

    try {
      await el.audio.play();
      console.log('[music] autoplay OK');
      setPlayingUI(true);
      requestAnimationFrame(() => {
        el.audio.muted = false;
        fadeVolumeTo(savedVolume / 100, 1800);
      });
    } catch (err) {
      console.warn('[music] autoplay blocked, waiting for gesture', err);
      const startOnGesture = async () => {
        if (isPlaying) return;
        initAudioGraph();
        if (ctx?.state === 'suspended') { try { await ctx.resume(); } catch {} }
        el.audio.muted = false;
        if (gain) gain.gain.value = 0; else el.audio.volume = 0;
        try {
          await el.audio.play();
          console.log('[music] started on gesture');
          setPlayingUI(true);
          fadeVolumeTo(savedVolume / 100, 1200);
        } catch (e) {
          console.warn('[music] gesture play failed', e);
        }
      };
      ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
        document.addEventListener(evt, startOnGesture, { once: true, passive: true })
      );
    }
  }

  // ---------- Toggle ----------
  async function togglePlay(force) {
    const wantPlay = typeof force === 'boolean' ? force : !isPlaying;
    if (wantPlay) {
      initAudioGraph();
      if (ctx?.state === 'suspended') { try { await ctx.resume(); } catch {} }
      el.audio.muted = false;
      try {
        await el.audio.play();
        setPlayingUI(true);
        if (!gain) el.audio.volume = savedVolume / 100;
      } catch (err) {
        console.warn('[music] play failed', err);
      }
    } else {
      el.audio.pause();
      setPlayingUI(false);
    }
  }

  el.toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  // ---------- Volume ----------
  el.volume?.addEventListener('input', function () {
    savedVolume = Number(this.value);
    localStorage.setItem('music-volume', savedVolume);
    if (gain) gain.gain.value = savedVolume / 100;
    else el.audio.volume = savedVolume / 100;
  });

  // ---------- Visibility ----------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying) el.audio.pause();
    } else if (isPlaying) {
      el.audio.play().catch(() => {});
    }
  });

  // ---------- Duck when video plays ----------
  document.querySelectorAll('video').forEach(v => {
    v.addEventListener('play',  () => { if (isPlaying) fadeVolumeTo(0.03, 400); });
    v.addEventListener('pause', () => { if (isPlaying) fadeVolumeTo(savedVolume / 100, 800); });
    v.addEventListener('ended', () => { if (isPlaying) fadeVolumeTo(savedVolume / 100, 800); });
  });

  // ---------- Boot ----------
  if (shouldAutoStart) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => attemptAutoplay(), { timeout: 3000 });
    } else {
      setTimeout(attemptAutoplay, 800);
    }
  } else {
    console.log('[music] autoplay disabled by user preference');
  }
})();