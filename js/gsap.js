import { TweenMax, TimelineMax } from 'gsap/all';

const tl = new TimelineMax();

//tl.staggerFromTo('.hero-title', { opacity: 0 }, { opacity: 1, stagger: 0.2 });

tl.add(
  TweenMax.fromTo('.logo', 1, { opacity: 0, y: -100 }, { opacity: 1, y: 0 })
)
  .staggerFromTo(
    '.nav-links',
    1,
    { opacity: 0 },
    { opacity: 1, stagger: 0.2 },
    '+=0.5'
  )
  .staggerFromTo('.hero-title', 1, { opacity: 0 }, { opacity: 1, stagger: 0.2 })
  .add(
    TweenMax.fromTo(
      '.jumbotron--wrapper',
      1,
      { opacity: 0, y: 5, x: 100 },
      { opacity: 1, y: 0, x: 0 },
      '-=2'
    )
  );
