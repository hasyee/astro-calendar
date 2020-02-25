import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

window.addEventListener('beforeinstallprompt', deferredPromptEvent => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  deferredPromptEvent.preventDefault();
  deferredPromptEvent.prompt();
});
