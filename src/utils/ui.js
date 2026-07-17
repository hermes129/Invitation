import { gsap } from 'gsap';

export function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  const load = (image) => { image.src = image.dataset.src; image.removeAttribute('data-src'); image.addEventListener('load', () => image.classList.add('is-loaded'), { once: true }); };
  const observer = new IntersectionObserver((entries) => entries.forEach(({ isIntersecting, target }) => { if (isIntersecting) { load(target); observer.unobserve(target); } }), { rootMargin: '300px 0px' });
  images.forEach((image) => observer.observe(image));
}

export function initCursor(reduced) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.querySelector('.cursor'); let x = -100; let y = -100;
  const move = (event) => { x = event.clientX; y = event.clientY; gsap.to(cursor, { x, y, duration: .45, ease: 'power3.out' }); };
  window.addEventListener('pointermove', move, { passive: true });
  document.querySelectorAll('a, button, .media-cursor').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
  document.querySelectorAll('.section--dark, .section--oxblood').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-light'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-light'));
  });
}

export function initMagnetic(reduced) {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => { const box = el.getBoundingClientRect(); gsap.to(el, { x: (event.clientX - box.left - box.width / 2) * .16, y: (event.clientY - box.top - box.height / 2) * .16, duration: .35, ease: 'power3.out' }); });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.35)' }));
  });
}

export function initMenu() {
  const button = document.querySelector('.menu-btn'); const nav = document.querySelector('.site-nav');
  button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('is-open', !open); document.body.classList.toggle('menu-open', !open); });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { button.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open'); }));
}
