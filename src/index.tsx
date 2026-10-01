import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/app';
import DateProvider from './date/date.provider';
import LocationProvider from './location/location.provider';
import CalendarProvider from './calendar/calendar.provider';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <DateProvider>
    <LocationProvider>
      <CalendarProvider>
        <App />
      </CalendarProvider>
    </LocationProvider>
  </DateProvider>
);

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
