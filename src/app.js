import './scss/app.scss';
import barba from '@barba/core';
import {TimelineLite} from 'gsap';

import sample from './js/homepage/sample';

let sampleModule = new sample(3);

barba.init({
	transitions: [
		{
			sync: true,
			appear: ({ current }) => {
				// Initial load
				if (current.namespace === 'home') {
					console.log('Landed on Home');
					console.log(sampleModule.getResult());
				}
			},
			enter: ({ next }) => {
				// Can use namespaces to initialize page specific things
				if (next.namespace === 'home') {
					console.log('Entering Home');
				}
			},
			leave: async ({ current, next }) => {
				await pageTransiton(current.container, next.container);
			}
		}
	]
});

function pageTransiton(cur, next) {
	return new Promise(resolve => {

		// Animation handles both current and next pages
		let tl = new TimelineLite();

		tl
		.set(next, {autoAlpha: 0, y: -5}, 0)
		.to(cur, .5, {autoAlpha: 0, y: -5}, 0)
		.to(next, 1, { autoAlpha: 1, y: 0, onComplete: () => { resolve(); }}, 1);
	});
}
