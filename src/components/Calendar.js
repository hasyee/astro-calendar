import React from 'react';
import useCache from '../hooks/cache';
import CalendarItem from './CalendarItem';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const days = useCache();
  
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
