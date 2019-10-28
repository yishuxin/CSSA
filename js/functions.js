import {
  smoothScroll,
  scrollFunction,
  topFunction,
  toggle,
  getHeight
} from './utils.js';

const mainNav = document.querySelector('.main-nav');
const toTopButton = document.querySelector('.button--top');
const navBarToggle = document.querySelector('.navbar-toggle');

const toggleNav = () => {
  navBarToggle.addEventListener('click', e => {
    e.stopPropagation();
    mainNav.classList.toggle('active');
  });
  window.onclick = function(event) {
    mainNav.classList.remove('active');
  };
};

const scrollToTop = () => {
  window.onscroll = () => {
    scrollFunction(toTopButton);
  };

  if (toTopButton) {
    toTopButton.addEventListener('click', () =>
      smoothScroll('.navbar', 1000, 0)
    );
  }
};

//hide nav on scroll

const hideOnScroll = el => {
  let prevScrollpos = window.pageYOffset;
  const height = getHeight(el);
  window.onscroll = () => {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.querySelector(el).style.top = '0';
    } else {
      document.querySelector(el).style.top = `-${height}`;
    }
    prevScrollpos = currentScrollPos;
  };
};

const setVisible = (selector, visible) => {
  document.querySelector(selector).style.display = visible ? 'block' : 'none';
};

export { toggleNav, scrollToTop, hideOnScroll, setVisible };
