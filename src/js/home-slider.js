import $ from 'jquery';
import {TweenMax, TimelineLite, Power3} from 'gsap';

export default class Slider {
  constructor(slide) {
    this.slide = slide || 0;
    this.index = 1;
    this.scrollLock = false;
    this.maxSlideCount = $('.slide').length;

    this.scrollNav = this.scrollNav.bind(this);

    this.init();
  }

  init() {
    $(document).on('wheel', this.scrollNav);
    $(`[data-slide-index=${this.slide}]`).addClass('active');
    this.resetScroll();
  }

  destroy() {
    $(document).off('wheel', this.scrollNav);
  }

  resetScroll() {
      //Called at end of slide animation so users can scroll again
      this.scrollLock = false;
  }

  scrollNav(e) {
    // Checks to see if user can scroll...
    if (this.scrollLock == false) {
      let delta;
      e = e.originalEvent;
      // Gets a positive or negative value from the wheel event to determine if the user scrolled up or down
      if (e.wheelDelta){
          delta = e.wheelDelta;
      } else {
          delta = -1 *e.deltaY;
      };
      // Checking to see if at either end of slideshow here once scroll direction determined
      if (delta < 0 && this.index != this.maxSlideCount){
          this.slideNavNext();
          this.scrollLock = true; //setting scrollLock=true inside elimates having to check with another method
      } else if (delta > 0 && this.index != 1) {
          this.slideNavPrev();
          this.scrollLock = true;
      };
    }
  }

  slideNavNext() {
    var slideOut = $('.slide.active'),
        slideIn = $(slideOut).next();

    this.goToNextSlide(slideOut, slideIn);
  }

  slideNavPrev() {
    var slideOut = $('.slide.active'),
        slideIn = $(slideOut).prev();

    this.goToPrevSlide(slideOut, slideIn);
  }

  goToNextSlide(slideOut, slideIn) {
    if (this.index != this.maxSlideCount) {
      const outTitle = $(slideOut).find('.slide__content');

      let tl = new TimelineMax();
      this.index++;

        // timeline
        // changing y and x here will simply convert this to horizontal scroll
      tl
        .set(slideIn, {autoAlpha: 1, className: '+=active'})
        .set(slideOut, {className: '-=active'})
        .to(outTitle, 0.7, {top: '0%', ease:Power3.easeInOut}, 0)
        .to(slideOut, 0.7, {y: '-100%', ease:Power3.easeInOut}, 0)
        .to(slideIn, 0.9, {y: '-=100%', ease:Power3.easeInOut}, 0)
        .set(outTitle, {clearProps: 'all'})
        .call(this.resetScroll, [], this);

      // Checks to see if on last slide
      // if (this.index === this.maxSlideCount) {
      //   TweenMax.to(slideNavNext, 0.3, {autoAlpha: 0.2});
      // }
    }
  }

  goToPrevSlide(slideOut, slideIn) {
    if(this.index != 1) {
      const inTitle = $(slideIn).find('.slide__content');
      const outTitle = $(slideOut).find('.slide__content');

      let tl = new TimelineMax();
      this.index--;

        // timeline
        // changing y and x here will simply convert this to horizontal scroll
        tl
        .set(slideIn, {autoAlpha: 1, className: '+=active'})
        .set(slideOut, {className: '-=active'})
        .set(inTitle, {top: '0%'})
        .to(inTitle, 0.7, {top: "50%"}, 0)
        .to(outTitle, 0.9, {top: '90%'}, 0)
        .to(slideOut, 0.7, {y: '0%', ease:Power3.easeInOut}, 0)
        .to(slideIn, 0.9, {y: '+=100%', ease:Power3.easeInOut}, 0)
        .set(outTitle, {clearProps: 'all'})
        .call(this.resetScroll, [], this);

      // Checks to see if on last slide
      // if (this.index === 1) {
      //   TweenMax.to(slideNavPrev, 0.3, {autoAlpha: 0.2});
      //   TweenMax.to(slideNavNext, 0.3, {autoAlpha: 1});
      // }
    }
  }
}
