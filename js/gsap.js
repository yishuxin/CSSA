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

// tl1
//   .add(
//     TweenMax.fromTo('.logo', 1, { opacity: 0, y: -100 }, { opacity: 1, y: 0 })
//   )
//   .staggerFromTo(
//     '.nav-links',
//     1,
//     { opacity: 0 },
//     { opacity: 1, stagger: 0.2 },
//     '+=0.5'
//   )
//   .staggerFromTo(
//     '.hero-title',
//     1,
//     { opacity: 0 },
//     { opacity: 1, stagger: 0.2 }
//   );

tlHistory
  .add(
    TweenMax.fromTo('.history', 1, { opacity: 0, y: 100 }, { opacity: 1, y: 0 })
  )
  .add(TweenMax.to('.history-pic', 3, { opacity: 1 }), '+=5');

const sceneHistory = new ScrollMagic.Scene({
  triggerElement: '.jumbotron',
  triggerHook: 0,
  duration: 100,
  reverse: true
})
  .setClassToggle('.history', 'visible')
  .setClassToggle('.history-pic', 'visible')
  .setTween(tlHistory)
  .addTo(controller);

//team
tlTeam
  .add(
    TweenMax.fromTo('.team', 1, { opacity: 0, y: 100 }, { opacity: 1, y: 0 })
  )
  .add(TweenMax.fromTo('.team-pic', 3, { opacity: 0 }, { opacity: 1 }), '+=5');
const sceneTeam = new ScrollMagic.Scene({
  triggerElement: '.history',
  triggerHook: 0,
  duration: 100,
  reverse: true,
  offset: 100
})
  .setClassToggle('.team', 'visible')
  .setClassToggle('.team-pic', 'visible')
  .setTween(tlTeam)
  .addTo(controller);

//mission
tlMission
  .add(
    TweenMax.fromTo('.mission', 2, { opacity: 0, y: 100 }, { opacity: 1, y: 0 })
  )
  .add(
    TweenMax.fromTo('.mission-pic', 2, { opacity: 0 }, { opacity: 1 }),
    '+=5'
  );
const sceneMission = new ScrollMagic.Scene({
  triggerElement: '.team',
  triggerHook: 0, // show, when scrolled 10% into view
  duration: '30%' // hide 10% before exiting view (80% + 10% from bottom)
  // offset: 10 // move trigger to center of element
})
  .setTween(tlMission)
  .addIndicators()
  .addTo(controller);
