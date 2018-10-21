import $ from 'jquery';
import { TweenMax, TimelineLite, Power3 } from 'gsap';
import anime from 'animejs';

import Drag from './draggable.js';


/**
 * @typedef {object} WheelEvent
 */

/**
 * Slider class
 * @param {number} slide optional index of starting slide
 * @constructor
 */
export default class Slider {
  constructor(slide) {
    this.slide = slide || 0;
    this.index = 1;
    this.scrollLock = false;
    this.maxSlideCount = $('.slide').length;
    this.wrapper = $('.slider-wrapper');

    this.scrollNav = this.scrollNav.bind(this);
    this.setDragItem = this.setDragItem.bind(this);
    // this.calcDims = this.calcDims.bind(this);

    this.init();
    Drag(this.setDragItem);
  }

  setDragItem(result) {
    const el = result;
    const inIndex = $(el).attr('data-slide-nav');
    const slideIn = $(`[data-slide-index=${inIndex}]`);
    const slideOut = $('.slide.active');
    const outIndex = $('.slide.active').attr('data-slide-index');


    if (!(slideOut[0] == slideIn[0])) {
      if (inIndex > outIndex) {
        this.goToNextSlide(slideOut, slideIn);
      } else {
        this.goToPrevSlide(slideOut, slideIn);
      }
    }
  }

  init() {
    $(document).on('wheel', this.scrollNav);
    $(`[data-slide-index=${this.slide}]`).addClass('active').css('opacity', '1');
    this.resetScroll();
    this.setSlideNav();
  }

  destroy() {
    $(document).off('wheel', this.scrollNav);
  }

  resetScroll() {
      //Called at end of slide animation so users can scroll again
      this.scrollLock = false;
  }
  /**
   * [scrollNav description]
   * @param {WheelEvent} e Wheel event passed from event listener in Slider.init()
   * @fires Slider#slideNavNext
   * @fires Slider#slideNavPrev [description]
   */
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
      console.log(delta);
      console.log(this.index);
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
    let slideOut = $('.slide.active'),
        slideIn = $(slideOut).next();

    this.goToNextSlide(slideOut, slideIn);
  }

  slideNavPrev() {
    let slideOut = $('.slide.active'),
        slideIn = $(slideOut).prev();

    this.goToPrevSlide(slideOut, slideIn);
  }

  goToNextSlide(slideOut, slideIn) {
    const outTitle = $(slideOut).find('.slide__content');
    const inDetails = $(slideIn).find('.slide__copy');

    let tl = new TimelineMax();
    this.index = parseInt(slideIn.attr('data-slide-index')) + 1;
      // timeline
      // changing y and x here will simply convert this to horizontal scroll
    tl
      .call(this.setSlideNav, [], 0)
      .set(slideIn, {y: '100%', className: '+=active'})
      .set(slideOut, {className: '-=active', autoAlpha: 1})
      .to(outTitle, 1.2, {top: '0%', ease:Power3.easeInOut}, 0)
      .to(slideOut, 1.2, {y: '-100%', autoAlpha: 0, ease:Power3.easeInOut}, 0)
      .to(slideIn, 1.5, {y: '-=100%', autoAlpha: 1, ease:Power3.easeInOut}, 0)
      .to(inDetails, 1, {autoAlpha: 1}, 1)
      .set([outTitle, slideOut], {clearProps: 'all'})
      .call(this.resetScroll, [], this, 2);

    // Checks to see if on last slide
    // if (this.index === this.maxSlideCount) {
    //   TweenMax.to(slideNavNext, 0.3, {autoAlpha: 0.2});
    // }
  }

  goToPrevSlide(slideOut, slideIn) {
    const inTitle = $(slideIn).find('.slide__content');
    const outTitle = $(slideOut).find('.slide__content');

    let tl = new TimelineMax();
    this.index = parseInt(slideIn.attr('data-slide-index')) + 1;

      // timeline
      // changing y and x here will simply convert this to horizontal scroll
      tl
      .call(this.setSlideNav, [], 0)
      .set(slideIn, {y: '-100%', className: '+=active'})
      .set(slideOut, {className: '-=active'})
      .set(inTitle, {top: '0%'})
      .to(inTitle, 1.2, {top: "50%"}, 0)
      .to(outTitle, 1.2, {top: '70%'}, 0)
      .to(slideOut, 1.2, {y: '+=100%', autoAlpha: 0, ease:Power3.easeInOut}, 0)
      .to(slideIn, 1.5, {y: '+=100%', autoAlpha: 1, ease:Power3.easeInOut}, 0)
      .set([outTitle, slideOut], {clearProps: 'all'})
      .call(this.resetScroll, [], this, 2);

    // Checks to see if on last slide
    // if (this.index === 1) {
    //   TweenMax.to(slideNavPrev, 0.3, {autoAlpha: 0.2});
    //   TweenMax.to(slideNavNext, 0.3, {autoAlpha: 1});
    // }
  }

  setSlideNav() {
    $('.slider-nav__single').removeClass('active');
    const currentActive = $('.slide.active').attr('data-slide-index');
    $(`[data-slide-nav=${currentActive}]`).addClass('active');
  }
}
