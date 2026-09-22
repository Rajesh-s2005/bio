/**
 * Main Application Logic for Banu S — Marriage Bio-Data & Portfolio
 * Features:
 * - Interactive Particle & Sparkle Canvas
 * - Web Audio API Ambient Harp/Chime Synthesizer
 * - Wishes & Blessing Board (LocalStorage)
 * - Print / Save as PDF handler
 * - Theme Switcher (Emerald vs Pearl)
 * - Smooth Navigation & Contact Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page Preloader & Welcome Screen
  initPagePreloader();

  // Initialize Reusable Gallery Component
  const gallery = new ReusableGallery({
    containerId: 'gallery-grid',
    lightboxId: 'lightbox-modal'
  });

  // Initialize Canvas Sparkles
  initSparkleCanvas();

  // Initialize Ambient Audio
  initAmbientAudio();

  // Initialize Wishes Board
  initWishesBoard();

  // Initialize Theme Switcher
  initThemeSwitcher();

  // Navbar Scroll Shadow
  initNavbarScroll();

  // Print PDF Trigger
  initPrintHandler();
});

/* ==========================================================================
   PARTICLE SPARKLE CANVAS
   Subtle floating gold and emerald celestial dust
   ========================================================================== */
function initSparkleCanvas() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.15;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.decay = Math.random() * 0.005 + 0.002;
      this.color = Math.random() > 0.35 ? '#d4af37' : '#10b981';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;

      if (this.alpha <= 0 || this.y < 0) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   AMBIENT BACKGROUND HARP & CHIME SYNTHESIZER (WEB AUDIO API)
   Pure procedural sound - Zero file dependencies, works offline & on file:///
   Always on automatically with browser autoplay unlock
   ========================================================================== */
let globalAudioCtx = null;
let isAudioPlaying = false;
let audioIntervalId = null;

function startAmbientSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;

    if (!globalAudioCtx) {
      globalAudioCtx = new AudioCtxClass();
    }

    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }

    if (isAudioPlaying) return;
    isAudioPlaying = true;

    // Harmonic pentatonic scale (D4, E4, F#4, A4, B4, D5, E5, F#5, A5)
    const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];

    function playTone(freq, duration = 3.0, delay = 0) {
      if (!globalAudioCtx) return;

      const now = globalAudioCtx.currentTime + delay;

      // Primary sine oscillator (fundamental tone)
      const osc = globalAudioCtx.createOscillator();
      const gain = globalAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Natural acoustic bell/harp envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(globalAudioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);

      // Subtle warm octave overtone
      const osc2 = globalAudioCtx.createOscillator();
      const gain2 = globalAudioCtx.createGain();

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc2.connect(gain2);
      gain2.connect(globalAudioCtx.destination);

      osc2.start(now);
      osc2.stop(now + duration * 0.7 + 0.1);
    }

    function playHarmonicChord() {
      if (!globalAudioCtx) return;
      if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
      }
      const baseIdx = Math.floor(Math.random() * (notes.length - 3));
      playTone(notes[baseIdx], 3.2, 0);
      playTone(notes[baseIdx + 2], 3.5, 0.25);
      if (Math.random() > 0.35) {
        playTone(notes[baseIdx + 3], 4.0, 0.5);
      }
    }

    // Play initial chord immediately
    playHarmonicChord();

    // Loop serene chord progressions every 3.8 seconds
    if (!audioIntervalId) {
      audioIntervalId = setInterval(playHarmonicChord, 3800);
    }
  } catch (err) {
    console.warn('Audio start error:', err);
  }
}

function initAmbientAudio() {
  // 1. Try starting immediately
  startAmbientSound();

  // 2. Browser Autoplay policy unlock: start on first user interaction anywhere
  const unlockEvents = ['click', 'pointerdown', 'touchstart', 'scroll', 'keydown'];
  const handleInteraction = () => {
    startAmbientSound();
    if (globalAudioCtx && globalAudioCtx.state === 'running') {
      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, handleInteraction);
        document.removeEventListener(evt, handleInteraction);
      });
    }
  };

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleInteraction, { passive: true });
    document.addEventListener(evt, handleInteraction, { passive: true });
  });

  // 3. Connect to preloader click
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    preloader.addEventListener('click', handleInteraction);
  }
}

/* ==========================================================================
   WISHES & BLESSINGS BOARD
   ========================================================================== */
function initWishesBoard() {
  const form = document.getElementById('wishes-form');
  const wishesList = document.getElementById('wishes-list');
  if (!form || !wishesList) return;

  const defaultWishes = [
    {
      author: 'Family & Well-Wishers',
      text: 'May God guide every step of this sacred journey with peace, boundless joy, and divine grace.',
      time: 'Featured Blessing'
    },
    {
      author: 'Congregation Friends',
      text: 'Warmest wishes to Banu for a blessed and purposeful life ahead filled with happiness and spiritual strength.',
      time: 'Earlier'
    }
  ];

  function loadWishes() {
    try {
      const saved = localStorage.getItem('banu_wishes');
      let items = defaultWishes;
      if (saved) {
        items = [...defaultWishes, ...JSON.parse(saved)];
      }
      renderWishes(items);
    } catch (e) {
      renderWishes(defaultWishes);
    }
  }

  function renderWishes(items) {
    wishesList.innerHTML = items.map(w => `
      <div class="wish-item">
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(w.author)}</span>
          <span class="wish-time">${escapeHtml(w.time)}</span>
        </div>
        <p class="wish-text">${escapeHtml(w.text)}</p>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name');
    const msgInput = document.getElementById('wish-message');

    if (!nameInput || !msgInput) return;
    const author = nameInput.value.trim();
    const text = msgInput.value.trim();

    if (!author || !text) return;

    const newWish = {
      author,
      text,
      time: 'Just now'
    };

    try {
      const saved = localStorage.getItem('banu_wishes');
      const list = saved ? JSON.parse(saved) : [];
      list.push(newWish);
      localStorage.setItem('banu_wishes', JSON.stringify(list));
      loadWishes();
      nameInput.value = '';
      msgInput.value = '';
    } catch (err) {
      console.warn(err);
    }
  });

  loadWishes();
}

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  let currentTheme = localStorage.getItem('banu_theme') || 'emerald';
  if (currentTheme === 'pearl') {
    document.documentElement.setAttribute('data-theme', 'pearl');
  }

  themeBtn.addEventListener('click', () => {
    const isPearl = document.documentElement.getAttribute('data-theme') === 'pearl';
    if (isPearl) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('banu_theme', 'emerald');
    } else {
      document.documentElement.setAttribute('data-theme', 'pearl');
      localStorage.setItem('banu_theme', 'pearl');
    }
  });
}

/* ==========================================================================
   NAVBAR SCROLL
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   PRINT / PDF BIO-DATA HANDLER
   ========================================================================== */
function initPrintHandler() {
  const printBtns = document.querySelectorAll('.trigger-print-bio');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

/* ==========================================================================
   PAGE PRELOADER & WELCOME INTRO CONTROLLER
   Smooth royal emerald & gold intro with animated progress & graceful exit
   ========================================================================== */
function initPagePreloader() {
  const preloader = document.getElementById('page-preloader');
  if (!preloader) return;

  const fill = document.getElementById('preloader-progress-fill');
  const pctText = document.getElementById('preloader-pct');
  const statusLabel = document.getElementById('preloader-status-label');

  let currentPct = 0;
  let isWindowLoaded = document.readyState === 'complete';

  const statusMilestones = [
    { threshold: 10, text: 'Harmonizing sacred blessings...' },
    { threshold: 38, text: 'Curating portfolio & credentials...' },
    { threshold: 68, text: 'Polishing authentic gallery...' },
    { threshold: 92, text: 'Welcome to Banu\'s Profile...' }
  ];

  function updateStatus(pct) {
    if (fill) fill.style.width = `${pct}%`;
    if (pctText) pctText.textContent = `${pct}%`;
    if (statusLabel) {
      for (let i = statusMilestones.length - 1; i >= 0; i--) {
        if (pct >= statusMilestones[i].threshold) {
          statusLabel.textContent = statusMilestones[i].text;
          break;
        }
      }
    }
  }

  window.addEventListener('load', () => {
    isWindowLoaded = true;
  });

  const ticker = setInterval(() => {
    // Smooth, natural pacing
    const increment = isWindowLoaded ? Math.random() * 8 + 6 : Math.random() * 4 + 2;
    currentPct = Math.min(currentPct + increment, isWindowLoaded ? 100 : 94);

    const rounded = Math.floor(currentPct);
    updateStatus(rounded);

    if (currentPct >= 100) {
      clearInterval(ticker);
      if (statusLabel) statusLabel.textContent = "Welcome to Banu's Profile";
      
      const enterAction = document.getElementById('preloader-enter-action');
      const enterBtn = document.getElementById('preloader-enter-btn');
      
      if (enterAction && enterBtn) {
        enterAction.style.display = 'block';
        enterBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startAmbientSound();
          dismissPreloader();
        });
      }

      // Auto dismiss after 2 seconds if not clicked
      setTimeout(dismissPreloader, 2200);
    }
  }, 45);

  function dismissPreloader() {
    if (!preloader || preloader.classList.contains('loaded')) return;
    preloader.classList.add('loaded');
    startAmbientSound();

    // Accessibility: remove from screen after animation
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 900);
  }

  // Click on preloader to immediately enter and start sound
  preloader.addEventListener('click', () => {
    startAmbientSound();
    dismissPreloader();
  });

  // Safety fallback in case of slow resources
  setTimeout(() => {
    isWindowLoaded = true;
    currentPct = 100;
    updateStatus(100);
    dismissPreloader();
  }, 3500);
}
