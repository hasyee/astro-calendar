import React from 'react';
import CalendarItem from './CalendarItem';
import { useDays } from '../hooks';
import './Calendar.scss';

export default React.memo(function Calendar() {
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
});
