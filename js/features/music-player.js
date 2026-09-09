// Background ambient music player.
// Single looping track ("Deep Healing" ambient pad), auto-starts at low volume
// when the browser allows it, and always falls back to starting on the
// visitor's first interaction if the browser's autoplay policy blocks it.
/* ============================================================
   FEATURE: Ambient Background Music
============================================================ */
(function musicPlayer() {
  const DEFAULT_VOLUME = 10; // percent

  let isPlaying = false;
  let savedVolume = Number(localStorage.getItem('music-volume'));
  if (!savedVolume && savedVolume !== 0) savedVolume = DEFAULT_VOLUME;

  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  const volume = document.getElementById('musicVolume');

  if (!audio || !toggle) {
    console.warn('Music elements not found.');
    return;
  }

  audio.volume = savedVolume / 100;
  if (volume) volume.value = savedVolume;

  function setPlayingUI(playing) {
    isPlaying = playing;
    toggle.classList.toggle('playing', playing);
  }

  // Fade the volume in gently over `ms` milliseconds up to `target` (0..1),
  // instead of jumping straight to it — nicer on the ears on page load.
  function fadeVolumeTo(target, ms) {
    const start = performance.now();
    const from = audio.volume;
    (function step(now) {
      const p = Math.min(1, (now - start) / ms);
      audio.volume = from + (target - from) * p;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function attemptAutoplay() {
    audio.volume = 0;
    audio.play().then(() => {
      setPlayingUI(true);
      fadeVolumeTo(savedVolume / 100, 1800);
    }).catch(() => {
      // Autoplay blocked by the browser — start on the visitor's first
      // interaction instead (click, keypress, or scroll all count).
      const startOnInteraction = () => {
        if (isPlaying) return;
        audio.volume = 0;
        audio.play().then(() => {
          setPlayingUI(true);
          fadeVolumeTo(savedVolume / 100, 1200);
        }).catch(() => {});
      };
      ['pointerdown', 'keydown', 'scroll'].forEach(evt =>
        document.addEventListener(evt, startOnInteraction, { once: true, passive: true })
      );
    });
  }

  attemptAutoplay();

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isPlaying) {
      audio.pause();
      setPlayingUI(false);
    } else {
      audio.play().then(() => setPlayingUI(true)).catch(() => {});
    }
  });

  if (volume) {
    volume.addEventListener('input', function () {
      const val = this.value / 100;
      audio.volume = val;
      savedVolume = Number(this.value);
      localStorage.setItem('music-volume', this.value);
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isPlaying) {
      audio.pause();
    } else if (!document.hidden && isPlaying) {
      audio.play().catch(() => {});
    }
  });
})();
