import React, { useCallback } from 'react';
import { useSelector, getDateObjects } from '../store';
import CalendarHeader from './CalendarHeader';
import CalendarItem from './CalendarItem';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const dateObjects = useSelector(getDateObjects);
  const renderDay = useCallback(props => <CalendarItem {...props} />, []);

  return (
    <div className="Calendar">
      <CalendarHeader />
      <div className="grid">{dateObjects.map(renderDay)}</div>
    </div>
  );
});
