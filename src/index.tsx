import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { registerSW } from 'virtual:pwa-register';
import App from './app/app';
import DateProvider from './date/date.provider';
import LocationProvider from './location/location.provider';
import CalendarProvider from './calendar/calendar.provider';
import theme from './theme/theme';
import VersionListener from './version/version.listener';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  // MUI styles come first, so the stylesheets of the app override them at the same specificity
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <DateProvider>
        <LocationProvider>
          <CalendarProvider>
            <App />
          </CalendarProvider>
        </LocationProvider>
      </DateProvider>
      <VersionListener />
    </ThemeProvider>
  </StyledEngineProvider>
);

registerSW({ immediate: true });
