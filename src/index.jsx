import React from 'react';
import ReactDOM from 'react-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './components/App';
import * as state from './state';
import { useDevTools } from 'use.io';
import './index.scss';

useDevTools(state, { log: false, logPrimitivesOnly: false });

ReactDOM.render(<App />, document.getElementById('root'));

registerSW({ immediate: true });

// window.matchMedia('(display-mode: standalone)').matches

window.addEventListener('beforeinstallprompt', deferredPromptEvent => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  deferredPromptEvent.preventDefault();
  deferredPromptEvent.prompt();
});
