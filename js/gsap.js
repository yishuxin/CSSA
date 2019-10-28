import { TweenMax, TimelineMax } from 'gsap/all';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

const controller = new ScrollMagic.Controller();
const tl1 = new TimelineMax();
const tlHistory = new TimelineMax();
const tlTeam = new TimelineMax();
const tlMission = new TimelineMax({
  ease: SlowMo.ease.config(0.7, 0.7, false)
});
// //Scene1

tl1
  .add(
    TweenMax.fromTo('.logo', 1, { opacity: 0, y: -100 }, { opacity: 1, y: 0 })
  )
  .staggerFromTo(
    '.nav-links',
    1,
    { opacity: 0 },
    { opacity: 1, stagger: 0.2 },
    '+=0.5'
  )
  .staggerFromTo(
    '.hero-title',
    1,
    { opacity: 0 },
    { opacity: 1, stagger: 0.2 }
  );

tlHistory
  .add(TweenMax.to('.history', 1, { opacity: 1 }))
  .add(TweenMax.to('.history-pic', 2, { opacity: 1 }), '+=2');

const sceneHistory = new ScrollMagic.Scene({
  triggerElement: '.jumbotron',
  triggerHook: 0,
  duration: 100,
  offset: 10
})
  .setClassToggle('.history', 'visible')
  .setClassToggle('.history-pic', 'visible')
  .setTween(tlHistory)
  .addTo(controller);

//team
tlTeam
  .add(TweenMax.to('.team-pic', 1, { opacity: 1 }))
  .add(TweenMax.to('.team', 2, { opacity: 1 }), '+=2');
const sceneTeam = new ScrollMagic.Scene({
  triggerElement: '.history',
  triggerHook: 0,
  duration: 100,

  offset: 10
})
  .setClassToggle('.team', 'visible')
  .setClassToggle('.team-pic', 'visible')
  .setTween(tlTeam)
  .addTo(controller);

//mission
tlMission
  .add(TweenMax.to('.mission', 1, { opacity: 1 }))
  .add(TweenMax.to('.mission-pic', 2, { opacity: 1 }), '+=2');
const sceneMission = new ScrollMagic.Scene({
  triggerElement: '.team',
  triggerHook: 0,
  duration: 100,
  offset: 10
})
  .setClassToggle('.mission', 'visible')
  .setClassToggle('.mission-pic', 'visible')
  .setTween(tlMission)
  .addTo(controller);

const toggleContent = (headingsClass, parasClass) => {
  const headings = document.querySelectorAll(headingsClass);
  const paras = document.querySelectorAll(parasClass);
  for (let i = 0; i < headings.length; i++) {
    headings[i].addEventListener('click', function() {
      if (!paras[i].classList.contains('active')) {
        TweenMax.fromTo(
          paras[i],
          1,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0 }
        );
        paras[i].classList.add('active');
      } else {
        TweenMax.fromTo(
          paras[i],
          1,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -10 }
        );
        paras[i].classList.remove('active');
      }
    });
  }
};

toggleContent('.content--sub-heading', '.content--paragraph');
