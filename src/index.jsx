import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './components/App';
import * as state from './state';
import { useDevTools } from 'use.io';
import './index.scss';

useDevTools(state, { log: false, logPrimitivesOnly: false });

createRoot(document.getElementById('root')).render(<App />);

registerSW({ immediate: true });

// window.matchMedia('(display-mode: standalone)').matches

window.addEventListener('beforeinstallprompt', deferredPromptEvent => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  deferredPromptEvent.preventDefault();
  deferredPromptEvent.prompt();
});
