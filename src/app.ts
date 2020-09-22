import './scss/app.scss';
import barba, { ISchemaPage } from '@barba/core';
import { gsap, CSSPlugin } from 'gsap';

gsap.registerPlugin(CSSPlugin);

interface Page {
  destroy?: Function;
}

let activePage: Page | null = null;

const sketches = SKETCH_PATHS;

barba.init({
  transitions: [
    {
      sync: true,
      once: ({ next }) => {
        // Initial load
        runPage(next);
      },
      enter: ({next}) => {
        if (next.namespace === 'homepage') {
          activePage = null; // REMOVE ONCE HOMEPAGE LOGIC DONE
        }
        runPage(next);
      },
      leave: async ({ current, next }) => {
        /*
        * Responsibility of each sketch to determine if
        * they have bindings or other that should be removed
        */
        if (activePage && activePage.destroy) activePage.destroy();

        await pageTransiton(current.container, next.container);
      }
    }
  ]
});

async function runPage(route: ISchemaPage) {
  const curSketch = sketches.find(el => el === route.namespace);
  if (!curSketch) return;
  return await import(`./js/${curSketch}/index.ts`).then(result => {

    // assigns class instance to variable so we can call destroy method on leave lifecycle hook
    activePage = new result.default();
  });
}

function pageTransiton(cur: HTMLElement, next: HTMLElement) {
  return new Promise(resolve => {
    // Animation handles both current and next pages
    let tl = gsap.timeline();
    tl
    .set(next, {immediateRender: true, autoAlpha: 0, y: -5}, 0)
    .to(cur, .5, {autoAlpha: 0, y: -5}, 0)
    .to(next, 1, { autoAlpha: 1, y: 0, onComplete: () => { resolve(); }}, 1);
  });
}