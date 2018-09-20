import './scss/app.scss';
import $ from 'jquery';
import Barba from 'barba.js';
import {TweenMax, TimelineLite, Power2} from 'gsap';
// import 'jquery-ui/ui/widget';
// import 'jquery-ui/ui/widgets/draggable';

/*
* TEMPLATES
*/
import Player from './js/player.js';
import Animate from './js/anime.js';
import Slider from './js/homepage/home-slider.js';


$(document).ready(function() {
  let slider;
  const HomeView = Barba.BaseView.extend({
    namespace: 'home',
    onEnter() {
      console.log('HomeView onEnter');
    },
    onEnterCompleted() {
      console.log('HomeView onEnterCompleted');
      slider = new Slider();
    },
    onLeave() {
      console.log('onLeave');
      slider.destroy();
    // The Container has just been removed from the DOM.
    }
  });

  const PlayerView = Barba.BaseView.extend({
    namespace: 'player',
    onEnter() {
      console.log('PlayerView onEnter');
    },
    onEnterCompleted() {
      console.log('PlayerView onEnterCompleted');
      const video = new Player('https://youtu.be/nYFEf7Y1Gco');
    }
  });
  const ProjectView = Barba.BaseView.extend({
    namespace: 'anime',
    onEnter() {
      console.log('Anime onEnter');
    },
    onEnterCompleted() {
      const animations = new Animate();
    }
  });

  // Init views
  HomeView.init();
  PlayerView.init();
  ProjectView.init();

  // Transition
  var HideShowTransition = Barba.BaseTransition.extend({
    start() {
      Promise
        .all([this.newContainerLoading, this.animating()])
        .then(this.finish.bind(this));
    },

    animating() {
      var deferred = Barba.Utils.deferred();
      var tl = new TimelineLite();
      let el = $(this.oldContainer).find('.page-main');
      let copy = $(el).find('.title');

      tl
      .set(el, {autoAlpha: 1}, 0)
      .to(copy, 0.5, {left: '-200px'}, 0)
      .to(el, 1, {autoAlpha: 0, onComplete: () => {
          deferred.resolve();
        }}, 0);

      return deferred.promise;
    },

    finish() {
      $(this.oldContainer).hide();
      $(this.newContainer).css(
        {
          opacity: 0,
          visibility: 'visible'
        }
      );
      $(this.newContainer).animate({ opacity: 1 }, 400, () => {
        this.done();
      })
    }
  });

  Barba.Pjax.getTransition = function() {
    return HideShowTransition;
  };

  // Barba.Prefetch.init();
  Barba.Pjax.start();
});


//////////////////////////////////
// JQUERY UI /////////////////////
//////////////////////////////////
// let count = 0;
// let currentPos = 0;
//
// let dragEvent = (e) => {
//   currentPos = $('.drag-item').position();
//   count++;
//   currentPos.left = -5 + currentPos.left/10;
//   $('.artists-page__title').css('transform', `skewX(-9deg) rotate(${currentPos.left}deg)`);
// }
//
// const options = {
//   axis: 'x',
//   containment: '.drag-parent',
//   drag: dragEvent,
// };

// setInterval(function() {
//   window.document.title = count;
//   count++;
// }, 1000);

// $('.drag-item').draggable(options);
