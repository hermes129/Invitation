import { gsap } from 'gsap';

export function initOpener(reduced) {
  return new Promise((resolve) => {
    const opener = document.querySelector('.opener');
    if (!opener) {
      document.body.classList.remove('intro-active');
      resolve();
      return;
    }

    const button = opener.querySelector('.opener__trigger');
    const leftPanel = opener.querySelector('.opener__panel--left');
    const rightPanel = opener.querySelector('.opener__panel--right');
    const copy = opener.querySelector('.opener__copy');
    const site = document.querySelector('main');
    const skipLink = document.querySelector('.skip-link');
    const heroTitle = document.querySelector('#hero-title');
    const invitationTitle = document.querySelector('#invitation-title');
    let opened = false;

    const enter = ({ skip = false } = {}) => {
      if (opened) return;
      opened = true;
      button.disabled = true;
      opener.classList.add('is-opening');

      const finish = () => {
        opener.remove();
        document.body.classList.remove('intro-active');
        const focusTarget = skip ? invitationTitle : heroTitle;
        focusTarget?.focus({ preventScroll: !skip });
        resolve();
      };

      if (reduced || skip) { finish(); return; }

      gsap.timeline({ onComplete: finish })
        .to(copy, { autoAlpha: 0, scale: .985, duration: .28, ease: 'power2.out' })
        .fromTo(site, { scale: 1.025 }, { scale: 1, duration: 1.6, ease: 'power3.out', clearProps: 'transform' }, .08)
        .to(leftPanel, { xPercent: -105, duration: 1.6, ease: 'expo.inOut' }, .1)
        .to(rightPanel, { xPercent: 105, duration: 1.6, ease: 'expo.inOut' }, .1);
    };

    button.addEventListener('click', () => enter());
    skipLink?.addEventListener('click', (event) => {
      event.preventDefault();
      enter({ skip: true });
    });
    opener.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') enter();
    });

    if (!reduced) {
      gsap.fromTo(copy, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .7, delay: .15, ease: 'power3.out' });
    }
  });
}
