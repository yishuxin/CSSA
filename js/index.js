import ScrollOut from 'scroll-out';
import './gsap';
import {
  toggleContent,
  scrollToPosition,
  toggleNav,
  scrollToTop
} from './functions';

const headings = document.querySelectorAll('.content--sub-heading');
const paras = document.querySelectorAll('.content--paragraph');

// ScrollOut({
//   onShown: () => {
//     // use the web animation API

//     Array.prototype.forEach.call(h1, el =>
//       el.animate([{ opacity: 0 }, { opacity: 1 }], 1000)
//     );
//   },
//   onHidden: () => {
//     // hide the element initially
//     Array.prototype.forEach.call(h1, el => (el.style.opacity = 0));
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  scrollToPosition();
  toggleNav();
  scrollToTop();

  toggleContent(headings, paras, headings.length);
});
