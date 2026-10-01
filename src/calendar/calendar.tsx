import CalendarItem from './calendar.item';
import { useDays } from './calendar.hooks';
import './calendar.scss';

export default function Calendar() {
  const days = useDays();

  return (
    <div className="Calendar">
      <div className="grid">
        {days.map(props => (
          <div key={props.day} className="cell">
            <CalendarItem {...props} />
          </div>
        ))}
      </div>
    </div>
  );
}
