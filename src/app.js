import './scss/app.scss';
import barba from '@barba/core';
import {TweenMax, TimelineLite, Power2} from 'gsap';


/*
* TEMPLATES
*/
import Slider from './js/homepage/home-slider.js';


let slider;

barba.init({
	transitions: [
		{
			appear: data => {
				// Initial load
				let tl = new TimelineLite();
				let body = document.getElementsByTagName('body');
				tl
				.to(body, 1, {autoAlpha: 1}, 0);

				if (data.current.namespace === 'contact') {
					return;
				}
				slider = new Slider();
			},
			enter: data => {
				console.log(data);
				if (data.current.namespace === 'contact') {
					return;
				}
				let tl = new TimelineLite();
				let curContainer = data.current.container;
				let nextContianer = data.next.container;

				tl
				.to(curContainer, 1, {autoAlpha: 0, y: 100}, 0)
				.from(nextContianer, 1, {autoAlpha: 0, y: 100}, 0);

				slider = new Slider();
			},
			leave: data => {
				slider.destroy();
			}
		}
	]
});
