import $ from 'jquery';
import { TweenMax, TimelineLite, Power3 } from 'gsap';

/**
 * Slider class
 * @param {number} slide optional index of starting slide
 * @constructor
 */
export default class Slider {
  constructor(namespace, slide) {
    this.namespace = namespace;
    this.slide = slide || 0;
    this.index = 1;
    this.scrollLock = false;
    this.maxSlideCount = $(`#${this.namespace}`).find('.slide').length;

    this.selectors = {
      $sliderNav: $(`#${this.namespace}`).find('.slider-nav'),
      $sliderThumbnail: $(`#${this.namespace}`).find('.slider-nav__thumbnail'),
      $mobileNavIndex: $(`#${this.namespace}`).find('[data-slider-nav="current"]'),
      $mobileNavButtons: $(`#${this.namespace}`).find('.slider-nav__button')
    }

    this.scrollNav = this.scrollNav.bind(this);
    this.setDragItem = this.setDragItem.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.setSlideNav = this.setSlideNav.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleThumbnails = this.handleThumbnails.bind(this);
    this.handleButtons = this.handleButtons.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
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
    $(`#${this.namespace}`).find(`[data-slide-index=${this.slide}]`).addClass('active').css('opacity', '1').attr('aria-hidden', false);
    this.resetScroll();
    this.bindEvents();
    this.setSlideNav();
  }
  
  resetScroll() {
    //Called at end of slide animation so users can scroll again
    this.scrollLock = false;
}
 
  bindEvents() {
    $(document).on('wheel', this.scrollNav);
		$(document).on('keydown', this.handleKeypress);
		this.selectors.$mobileNavButtons.on('click', this.handleButtons);
    this.selectors.$sliderThumbnail.on('click', this.handleThumbnails);
  }

  destroy() {
    $(document).off('wheel', this.scrollNav);
    $(document).off('keydown', this.handleKeypress);
    this.selectors.$mobileNavButtons.off('click', this.handleButtons);
    this.selectors.$sliderThumbnail.off('click', this.handleThumbnails);
	}
	
	handleButtons(e) {
    if ($('body').hasClass('is-animating')) {
			return;
		}
		switch(e.target.id) {
			case 'next':
				if (this.index != this.maxSlideCount && this.scrollLock === false) {
					this.slideNavNext();
					this.scrollLock = true;
				}
				break;
			case 'previous':
				if (this.index != 1 && this.scrollLock === false) {
					this.slideNavPrev();
					this.scrollLock = true;
				}
				break;
		}
	}

  handleKeypress(e) {
    if ($('body').hasClass('is-animating')) {
			return;
    }

		switch(e.keyCode) {
			case 39:
				if (this.index != this.maxSlideCount && this.scrollLock === false) {
					this.slideNavNext();
					this.scrollLock = true;
				}
				break;
			case 37: 
				if (this.index != 1 && this.scrollLock === false) {
					this.slideNavPrev();
					this.scrollLock = true;
				}
				break;
		}
  }

  handleThumbnails(e) {
    if ($('body').hasClass('is-animating')) {
			return;
		}
		this.setDragItem(e.target);
  }
  /**
   * [scrollNav description]
   * @param {WheelEvent} e Wheel event passed from event listener in Slider.init()
   * @fires Slider#slideNavNext
   * @fires Slider#slideNavPrev [description]
   */
  scrollNav(e) {
    // Checks to see if user can scroll...
    if (this.scrollLock == false && !$('body').hasClass('is-animating')) {
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
		
		// changing y and x here will simply convert this to horizontal scroll
    tl
      .call(this.setSlideNav, [], 0)
      .set(slideIn, {x: '20%', className: '+=active', attr: {'aria-hidden': false}})
      .set(slideOut, {className: '-=active', autoAlpha: 1, attr: {'aria-hidden': true}})
      .set(inDetails, {autoAlpha: 0})
      .to(outTitle, .2, {top: '0%', ease:Power3.easeInOut}, 0)
      .to(slideOut, .7, {x: '-20%', autoAlpha: 0, ease:Power3.easeInOut}, 0)
      .to(slideIn, .7, {x: '-=20%', autoAlpha: 1, ease:Power3.easeInOut}, 0)
      .to(inDetails, .7, {autoAlpha: 1}, .3)
      .set([outTitle, slideOut, inDetails], {clearProps: 'all'})
      .call(this.resetScroll, [], this, 1);
  }

  goToPrevSlide(slideOut, slideIn) {
    const inTitle = $(slideIn).find('.slide__content');
    const outTitle = $(slideOut).find('.slide__content');
    const inDetails = $(slideIn).find('.slide__copy');

    let tl = new TimelineMax();
    this.index = parseInt(slideIn.attr('data-slide-index')) + 1;

		// changing y and x here will simply convert this to horizontal scroll
		tl
      .call(this.setSlideNav, [], 0)
      .set(slideIn, {x: '-20%', className: '+=active', attr: {'aria-hidden': false}})
      .set(slideOut, {className: '-=active', attr: {'aria-hidden': true}})
      .set(inTitle, {top: '0%'})
      .set(inDetails, {autoAlpha: 0})
      .to(outTitle, .2, {top: '70%'}, 0)
      .to(slideOut, .7, {x: '+=20%', autoAlpha: 0, ease:Power3.easeInOut}, 0)
      .to(slideIn, .7, {x: '+=20%', autoAlpha: 1, ease:Power3.easeInOut}, 0)
      .to(inDetails, .7, {autoAlpha: 1}, .3)
      .set([outTitle, slideOut, inDetails], {clearProps: 'all'})
      .call(this.resetScroll, [], this, 1);
  }

  setSlideNav() {
    this.selectors.$sliderNav.find('.active').removeClass('active');
    this.selectors.$sliderNav.find(`[data-slide-nav=${this.index - 1}]`).addClass("active");
    this.selectors.$mobileNavIndex.text(this.index);
  }
}
