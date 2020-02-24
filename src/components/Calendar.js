import React from 'react';
import CalendarItem from './CalendarItem';
import { useSelector, getDays } from '../store';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const days = useSelector(getDays);

  return (
    <div className="Calendar">
      <div className="grid">
        {days.map(props => (
          <div className="cell">
            <CalendarItem key={props.day} {...props} />
          </div>
        ))}
      </div>
    </div>
  );
});
