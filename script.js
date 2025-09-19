const byId = (id) => document.getElementById(id);
const qs = (sel, el = document) => el.querySelector(sel);

const intro = byId('intro');
const loading = byId('loading');
const errorView = byId('error');
const content = byId('content');
const yesBtn = byId('btn-yes');
const proceedBtn = byId('btn-proceed');
const dontClickBtn = byId('btn-dont-click');
const modal = byId('modal');

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function simulateLoading() {
  hide(intro);
  show(loading);
  typeLoadingThenCountdown(() => {
    hide(loading);
    show(errorView);
    triggerGlitchBurst();
    setBackgroundFor('error');
  });
}

function showContent() {
  glitchFlash(() => {
    hide(errorView);
    show(content);
    // soft reveal
    content.querySelectorAll('.section, .cta-wrapper').forEach((el, i) => {
      el.classList.add('appear');
      el.style.animationDelay = `${i * 60}ms`;
    });
    setBackgroundFor('content');
  });
}

function openModal() {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

yesBtn?.addEventListener('click', simulateLoading);
proceedBtn?.addEventListener('click', showContent);
dontClickBtn?.addEventListener('click', openModal);

modal?.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// Glitch helpers
function triggerGlitchBurst() {
  document.body.classList.add('glitch-on');
  errorView.classList.add('shake');
  const headline = qs('.glitch', errorView);
  headline?.classList.add('glitch--burst');
  setTimeout(() => {
    document.body.classList.remove('glitch-on');
    errorView.classList.remove('shake');
    headline?.classList.remove('glitch--burst');
  }, 1400);
}

function glitchFlash(next) {
  document.body.classList.add('glitch-on');
  const originalFilter = document.body.style.filter;
  document.body.style.filter = 'contrast(1.1) saturate(1.1)';
  setTimeout(() => {
    document.body.style.filter = originalFilter;
    document.body.classList.remove('glitch-on');
    typeof next === 'function' && next();
  }, 280);
}

// Background image per page
const backgroundConfig = {
  intro: null,
  loading: null,
  error: null,
  content: null,
  modal: null,
};

backgroundConfig.intro   = 'assets/image1.png';
backgroundConfig.loading = 'assets/loading.jpg';
backgroundConfig.error   = 'assets/error.jpg';
backgroundConfig.content = 'assets/image1.png';
backgroundConfig.modal   = 'assets/image2.png';

function applyBg(el, url) {
  if (!el) return;
  if (url) {
    el.classList.add('has-bg');
    el.style.setProperty('--view-bg', `url('${url}')`);
  } else {
    el.classList.remove('has-bg');
    el.style.removeProperty('--view-bg');
  }
}

function setBackgroundFor(view) {
  switch (view) {
    case 'intro':
      applyBg(intro, backgroundConfig.intro);
      break;
    case 'loading':
      applyBg(loading, backgroundConfig.loading);
      break;
    case 'error':
      applyBg(errorView, backgroundConfig.error);
      break;
    case 'content':
      applyBg(content, backgroundConfig.content);
      break;
    case 'modal':
      if (backgroundConfig.modal) {
        modal.classList.add('has-bg');
        modal.style.setProperty('--modal-bg', `url('${backgroundConfig.modal}')`);
      } else {
        modal.classList.remove('has-bg');
        modal.style.removeProperty('--modal-bg');
      }
      break;
  }
}

// Initialize backgrounds on load for current view
window.addEventListener('DOMContentLoaded', () => {
  setBackgroundFor('intro');
});

// Apply modal background on open
function openModal() {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setBackgroundFor('modal');
}


// Loading: type text, then show countdown, then continue
function typeLoadingThenCountdown(done) {
  const el = qs('#loading .loading-text');
  if (!el) { setTimeout(done, 800); return; }
  const full = el.getAttribute('data-text') || 'Verifying…';
  el.textContent = '';
  let idx = 0;
  const typeSpeedMs = 50;
  const timer = setInterval(() => {
    el.textContent = full.slice(0, idx++);
    if (idx > full.length) {
      clearInterval(timer);
      startCountdown(el, 3, done);
    }
  }, typeSpeedMs);
}

function startCountdown(el, seconds, done) {
  let remaining = seconds;
  const tick = () => {
    if (remaining <= 0) { done && done(); return; }
    el.textContent = `Starting in ${remaining}…`;
    remaining -= 1;
    setTimeout(tick, 1000);
  };
  // brief pause after typing before countdown starts
  setTimeout(tick, 350);
}


