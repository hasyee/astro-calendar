import Header from '../header/header';
import Calendar from '../calendar/calendar';
import { useWorker } from '../calendar/calendar.hooks';
import { useLocalStorage } from '../location/location.hooks';
import './app.scss';

export default function App() {
  useLocalStorage();
  useWorker();

  return (
    <div className="App">
      <Header />
      <Calendar />
    </div>
  );
}
