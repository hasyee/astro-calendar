import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/app';
import * as dateState from './date/date.state';
import * as locationState from './location/location.state';
import * as calendarState from './calendar/calendar.state';
import { useDevTools } from 'use.io';
import './index.scss';

useDevTools({ ...dateState, ...locationState, ...calendarState }, { log: false, logPrimitivesOnly: false });

createRoot(document.getElementById('root')!).render(<App />);

registerSW({ immediate: true });

// window.matchMedia('(display-mode: standalone)').matches

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

window.addEventListener('beforeinstallprompt', event => {
  const deferredPromptEvent = event as BeforeInstallPromptEvent;
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  deferredPromptEvent.preventDefault();
  deferredPromptEvent.prompt();
});
