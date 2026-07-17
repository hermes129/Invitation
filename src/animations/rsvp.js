import { gsap } from 'gsap';

const CONFETTI_COLORS = ['#86233d', '#bd8a3e', '#0a5960', '#e6b74c', '#d76b79', '#f5e4bc'];

function celebrate(container, reduced) {
  if (reduced || !container) return;

  container.replaceChildren();

  for (let index = 0; index < 56; index += 1) {
    const piece = document.createElement('i');
    const angle = Math.random() * Math.PI * 2;
    const distance = 170 + Math.random() * 390;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + 190 + Math.random() * 120;

    piece.className = 'confetti-piece';
    piece.style.setProperty('--confetti-color', CONFETTI_COLORS[index % CONFETTI_COLORS.length]);
    piece.style.setProperty('--confetti-x', `${x.toFixed(0)}px`);
    piece.style.setProperty('--confetti-y', `${y.toFixed(0)}px`);
    piece.style.setProperty('--confetti-rotate', `${Math.round(Math.random() * 900 - 450)}deg`);
    piece.style.setProperty('--confetti-delay', `${(Math.random() * 0.16).toFixed(2)}s`);
    container.append(piece);
  }

  window.setTimeout(() => container.replaceChildren(), 1600);
}

export function initRsvp(reduced) {
  const envelope = document.querySelector('.envelope');
  const openButton = document.querySelector('.rsvp__link');
  const modal = document.querySelector('.rsvp-modal');
  const confetti = modal?.querySelector('.rsvp-modal__confetti');
  const closeButton = modal?.querySelector('.rsvp-modal__close');
  const closeTargets = modal?.querySelectorAll('[data-rsvp-close]') ?? [];
  let hideTimer;

  envelope?.addEventListener('click', () => {
    const open = envelope.getAttribute('aria-expanded') === 'true';
    envelope.setAttribute('aria-expanded', String(!open));
    envelope.classList.toggle('is-open', !open);
  });

  const openModal = () => {
    if (!modal) return;
    window.clearTimeout(hideTimer);
    modal.hidden = false;
    document.body.classList.add('rsvp-modal-open');
    requestAnimationFrame(() => modal.classList.add('is-visible'));
    celebrate(confetti, reduced);
    closeButton?.focus();
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-visible');
    document.body.classList.remove('rsvp-modal-open');
    hideTimer = window.setTimeout(() => {
      modal.hidden = true;
      openButton?.focus();
    }, reduced ? 0 : 350);
  };

  openButton?.addEventListener('click', openModal);
  closeTargets.forEach((target) => target.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  if (!reduced) {
    gsap.from('.rsvp__head', {
      y: 50,
      autoAlpha: 0,
      duration: 1,
      scrollTrigger: { trigger: '.rsvp', start: 'top 70%' },
    });
  }
}
