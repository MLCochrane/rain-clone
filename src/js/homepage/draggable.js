import $ from 'jquery';
import { Draggable } from '@shopify/draggable';
import { TweenMax, TimelineLite, Power3 } from 'gsap';

export default function Drag(cb) {
  const draggable = new Draggable(document.querySelectorAll('.slider-nav'), {
    draggable: '.draggeable-standin'
  });

  let initialMousePosition,
      containerRect,
      dragRect,
      offset;

  let transitioning = false;

  let zones = [];

  draggable.on('drag:start', evt => {
    initialMousePosition = {
      x: evt.sensorEvent.clientX,
      y: evt.sensorEvent.clientY,
    };

    const dot = $('.slider-nav__single');
    const dragBar = $('.drag-bar');
    const tl = new TimelineLite;
    transitioning = true;

    tl
    .to(dot, 0.5, {width: '50px'}, 0)
    .set(dragBar, {display: 'inherit'}, 0)
    .to(dragBar, 0.5, {opacity: '1'}, 0.25)
    .call(initVars, [evt, dot]);
  });

  draggable.on('drag:move', evt => {
    if (transitioning) return

    const posY = (evt.sensorEvent.clientY - initialMousePosition.y);
    const el = document.getElementsByClassName('drag-bar')[0];
    const threshold = (containerRect.height / 2);

    if (posY <= threshold && posY >= (threshold * -1)) {
      el.style.transform = `translate3d(0, ${posY}px, 0)`;
    }
  });

  draggable.on('drag:stop', () => {
    const dot = $('.slider-nav__single');
    const dragBar = $('.drag-bar');
    const tl = new TimelineLite;
    transitioning = true;

    currentOver(dragBar[0].getBoundingClientRect());

    tl
    .to(dot, 0.5, {width: '5px'}, 0)
    .to(dragBar, 0.2, {y: '0'}, 0)
    .to(dragBar, 0.5, {opacity: '0'}, 0.25)
    .set([dot, dragBar], {clearProps: 'all'}, 0.5)
    .call(endTransition);

    zones = [];
  });

  function initVars(evt, dot) {
    containerRect = evt.sourceContainer.getBoundingClientRect();
    dragRect = evt.source.getBoundingClientRect();
    offset = calcOffset(dragRect.y - initialMousePosition.y);

    $(dot).each((index, el) => {
      let zone = el.getBoundingClientRect();
      let block = {
        el: el,
        rect: zone
      }
      zones.push(block);
    });

    endTransition();
  }

  function endTransition() {
    transitioning = false;
  }

  function calcOffset(offset) {
    return offset * 2 * 0.5;
  }

  function currentOver(rect) {
    const result = zones.filter(zone => zone.rect.top < rect.top && zone.rect.bottom > rect.bottom);
    cb(result[0].el);
  }
}
