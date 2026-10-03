import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/app';
import DateProvider from './date/date.provider';
import LocationProvider from './location/location.provider';
import CalendarProvider from './calendar/calendar.provider';
import VersionListener from './version/version.listener';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <>
    <DateProvider>
      <LocationProvider>
        <CalendarProvider>
          <App />
        </CalendarProvider>
      </LocationProvider>
    </DateProvider>
    <VersionListener />
  </>
);

registerSW({ immediate: true });
