import {
  smoothScroll,
  scrollFunction,
  topFunction,
  toggle,
  getHeight
} from './utils.js';

const mainNav = document.querySelector('.main-nav');
const navBarToggle = document.querySelector('.navbar-toggle');
const toTopButton = document.querySelector('.button--top');

function toggleContent(headings, paras, length) {
  for (let i = 0; i < length; i++) {
    headings[i].addEventListener('click', () => toggle(paras[i]));
  }
}

function scrollToPosition() {
  const about = document.querySelector('.button-about');
  const service = document.querySelector('.button-service');
  const contact = document.querySelector('.button-contact');
  const navHeight = document.querySelector('.navbar').scrollHeight;

  about.addEventListener('click', () => {
    about.style.color = 'red';
    about.disabled = true;
    service.disabled = false;
    contact.disabled = false;
    // smoothScroll('#about-us', 1000, navHeight);
  });

  contact.addEventListener('click', () => {
    contact.style.color = 'red';
    contact.disabled = true;
    service.disabled = false;
    about.disabled = false;
    // smoothScroll('.contact', 1000, navHeight);
  });

  service.addEventListener('click', () => {
    service.style.color = 'red';
    service.disabled = true;
    service.disabled = false;
    contact.disabled = false;
    // smoothScroll('#service', 1000, navHeight);
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

export {
  toggleContent,
  scrollToPosition,
  toggleNav,
  scrollToTop,
  hideOnScroll,
  setVisible
};
