import './scss/app.scss';
import barba from '@barba/core';
import {TweenMax, TimelineLite, Power2} from 'gsap';


/*
* TEMPLATES
*/
import Player from './js/player.js';
import Slider from './js/homepage/home-slider.js';


let slider;

barba.init({
	transitions: [
		{
			appear: data => {
				if (data.current.namespace === 'contact') {
					return;
				}
				slider = new Slider();
				console.log('Appear is called');
			},
			enter: data => {
				console.log('huh?');
				if (data.current.namespace === 'contact') {
					return;
				}
				slider = new Slider();
			},
			leave: data => {
				console.log('Leave is called');
				slider.destroy();
			}
		}
	],
	views: [{
		namespace: 'home',
		beforeAppear(data) {
		  // do something before leaving the current `index` namespace
		},
		afterLeave() {
			// slider.destroy();
		}
	  }, {
		namespace: 'people',
		beforeAppear(data) {
			// console.log(data);
		  // do something before entering the `contact` namespace
		}
	  }]
});
