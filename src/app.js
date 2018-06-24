import './scss/app.scss';
import $ from 'jquery';
// import 'jquery-ui/ui/widget';
// import 'jquery-ui/ui/widgets/draggable';


class Player {
  constructor(url) {
    this.url = url;
    this.init();
  }

  init() {
    this.getScrollAmt();
    this.bindEvents();
  }

  getScrollAmt() {
    this.maxHeight = window.innerWidth / (16/9);
    if (window.innerWidth <= 755) {
      this.origHeight = 321;
    } else {
      this.origHeight = 525;
    }
  }

  bindEvents() {
    $('.start').on('click', e => {
      // Load video and hide button
      this.loadVideo();
      $(e.currentTarget).toggle();
      $('.loading').toggle();
    });

    // Custom controls for video
    $('.play').on('click', () => {
      this.player.playVideo();
    });
    $('.pause').on('click', () => {
      this.player.pauseVideo();
    });

    // Mouse move event for displaying buttons
    // let moving;
    $('.slider-container').on('mousemove', () => {
      console.log('container')
      // clearTimeout(moving);
      // moving = setTimeout(() => {
      //   console.log('count');
      // }, 100);
    });

    $('.video-placeholder').on('mousemove', () => {
      console.log('iframe');
    });

    // Reset height variables on resize
    let resizeWindow;
    $(window).on('resize', () => {
      clearTimeout(resizeWindow);
      resizeWindow = setTimeout(() => {
        this.getScrollAmt();
      }, 100);
    });
  }

  loadVideo() {
    this.addScript().then(e => {
      const vidID = this.getId();
      setTimeout(() => {
        this.initYoutube(vidID);
      }, 100);
    }).catch(e => {
      console.log(e);
    })
  }

  addScript() {
    return new Promise((resolve, reject) => {
      let tag = document.createElement('script');
      tag.type = 'text/javascript';
      tag.src = "https://www.youtube.com/iframe_api";
      $(tag).on('load', () => resolve(tag));
      $(tag).on('error', () => reject(tag));
      document.body.appendChild(tag);
    });
  }

  // Get ID from share link
  getId() {
    let id = (this.url).split('/');
    id = id[id.length - 1];
    return id;
  }

  // Init the youtube player with ID
  initYoutube(id) {
    this.player = new YT.Player('video-placeholder', {
      videoId: id,
      playerVars: {
        autoplay: 1,
        controls: 0,
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onStateChange.bind(this),
      }
    });
  }

  onPlayerReady() {
    // When video player is ready, animate the player view
    this.transitionPlayer('open', this.maxHeight);
    $('.loading').toggle();
  }

  onStateChange(e) {
    if (e.data === 1) {
      // console.log('Playing');
      $('.play').css('display', 'none');
      $('.pause').css('display', 'inherit');
    } else if (e.data === 2) {
      // console.log('Paused');
      $('.play').css('display', 'inherit');
      $('.pause').css('display', 'none');
    } else if (e.data === 0) {
      // Close open view and destroy the player
      this.transitionPlayer('close', this.origHeight);
      $('button').toggle();
      this.player.destroy();
    }
  }

  // Animations for opening and closing the player
  transitionPlayer(status, height) {
    const el = $('.slider-container');
    $(el).animate({
      height: height,
    }, {
      duration: 500,
      complete: () => {
        if (status === 'open') {
          $(el).css('height', 'auto');
        } else {
          $(el).removeAttr('style');
        }
      }
    });
  }
}

const video = new Player('https://youtu.be/nYFEf7Y1Gco');


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
