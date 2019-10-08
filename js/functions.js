import { smoothScroll, scrollFunction, topFunction, toggle } from './utils.js';

const mainNav = document.querySelector('.main-nav');
const navBarToggle = document.querySelector('.navbar-toggle');
const toTopButton = document.querySelector('.button--top');

function toggleContent(headings, paras, length) {
  for (let i = 0; i < length; i++) {
    headings[i].addEventListener('click', () => toggle(paras[i]));
  }
}

function scrollToPosition() {
  const about = document.querySelector('.nav--about');
  const service = document.querySelector('.nav--service');
  const contact = document.querySelector('.nav--contact');
  const navHeight = document.querySelector('.navbar').scrollHeight;
  console.log(navHeight);
  about.addEventListener('click', () => {
    smoothScroll('#about-us', 1000, navHeight);
  });
  service.addEventListener('click', () => {
    smoothScroll('.service', 1000, navHeight);
  });
  contact.addEventListener('click', () => {
    smoothScroll('.contact', 1000, navHeight);
  });
}

const toggleNav = () => {
  navBarToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
  });
};

const scrollToTop = () => {
  window.onscroll = function() {
    scrollFunction(toTopButton);
  };

  if (toTopButton) {
    toTopButton.addEventListener('click', () =>
      smoothScroll('.navbar', 1000, 0)
    );
  }
};

export { toggleContent, scrollToPosition, toggleNav, scrollToTop };
