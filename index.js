const headings = document.querySelectorAll('.content-heading');
const paras = document.querySelectorAll('.content-paragraph');

let mainNav = document.getElementById('js-menu');
let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function() {
  mainNav.classList.toggle('active');
});

function toggleContent(headings, paras, length) {
  for (let i = 0; i < length; i++) {
    headings[i].addEventListener('click', () => toggle(paras[i]));
  }
}

toggleContent(headings, paras, headings.length);

// Show an element
const show = function(elem) {
  // Get the natural height of the element
  const getHeight = function() {
    elem.style.display = 'block'; // Make it visible
    const height = elem.scrollHeight + 'px'; // Get it's height
    elem.style.display = ''; //  Hide it again
    return height;
  };

  const height = getHeight(); // Get the natural height
  elem.classList.add('is-visible'); // Make the element visible
  elem.style.height = height; // Update the max-height

  // Once the transition is complete, remove the inline max-height so the content can scale responsively
  window.setTimeout(function() {
    elem.style.height = '';
  }, 350);
};

// Hide an element
const hide = function(elem) {
  // Give the element a height to change from
  elem.style.height = elem.scrollHeight + 'px';

  // Set the height back to 0
  window.setTimeout(function() {
    elem.style.height = '0';
  }, 1);

  // When the transition is complete, hide it
  window.setTimeout(function() {
    elem.classList.remove('is-visible');
  }, 350);
};

// Toggle element visibility
const toggle = function(elem, timing) {
  // If the element is visible, hide it
  if (elem.classList.contains('is-visible')) {
    hide(elem);
    return;
  }

  // Otherwise, show it
  show(elem);
};
