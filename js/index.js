import animate from './gsap';
import { toggleNav, scrollToTop } from './functions';

document.addEventListener('DOMContentLoaded', () => {
  toggleNav();
  animate();
  scrollToTop();
});
