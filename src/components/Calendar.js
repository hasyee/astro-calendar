import React from 'react';
import { useSelector, getDays } from '../store';
import useCache from '../hooks/cache';
import CalendarItem from './CalendarItem';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const days = useSelector(getDays);
  useCache(days, [days]);

  return (
    <div className="Calendar">
      <div className="grid">
        {days.map(props => (
          <CalendarItem key={props.day} {...props} />
        ))}
      </div>
    </div>
  );
});
