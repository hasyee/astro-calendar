import Location from '../location/location';
import DateControls from '../date/date.controls';
import './header.scss';

export default function Header() {
  return (
    <div className="Header">
      <div className="left-side">
        <Location />
      </div>

      <DateControls />
    </div>
  );
}
