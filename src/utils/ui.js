import { gsap } from 'gsap';

export function initCursor(reduced) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  window.addEventListener('pointermove', (event) => {
    gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: .45, ease: 'power3.out' });
  }, { passive: true });

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
  document.querySelectorAll('.section--dark, .section--oxblood, .dress, .timeline, .ending').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-light'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-light'));
  });
}

export function initMagnetic(reduced) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const box = el.getBoundingClientRect();
      gsap.to(el, {
        x: (event.clientX - box.left - box.width / 2) * .16,
        y: (event.clientY - box.top - box.height / 2) * .16,
        duration: .35, ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.35)' }));
  });
}
