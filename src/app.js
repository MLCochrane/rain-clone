if (module.hot) {
  module.hot.accept();
}

import './scss/app.scss';

const button = document.createElement('button');
button.textContent = 'Open chat';
document.body.appendChild(button);

button.onclick = () => {
  import(/* webpackChunkName: "chat" */ "./js/chat").then(chat => {
    chat.init();
  });
}
