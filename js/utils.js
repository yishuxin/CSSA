//smooth scroll
const smoothScroll = (target, duration, navHeight) => {
  var target = document.querySelector(target);
  var targetPosition = target.getBoundingClientRect().top;
  var startPosition = window.pageYOffset;
  var distance = targetPosition - startPosition - navHeight;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    var timeElapsed = currentTime - startTime;
    var run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
};

//back to top
const scrollFunction = el => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
};

const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

//toggle content

const show = function(el) {
  const getHeight = function() {
    el.style.display = 'block';
    const height = el.scrollHeight + 'px';
    el.style.display = '';
    return height;
  };

  const height = getHeight();
  el.classList.add('is-visible');
  el.style.height = height;

  //   window.setTimeout(function() {
  //     el.style.height = '';
  //   }, 350);
};

const hide = function(el) {
  el.style.height = el.scrollHeight + 'px';

  //   window.setTimeout(function() {
  el.style.height = '0';
  //   }, 1);

  //   window.setTimeout(function() {
  el.classList.remove('is-visible');
  //   }, 350);
};

const toggle = function(el, timing) {
  if (el.classList.contains('is-visible')) {
    hide(el);
    return;
  }

  show(el);
};

export { smoothScroll, scrollFunction, topFunction, toggle };
