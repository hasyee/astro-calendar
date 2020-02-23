import React, { useCallback } from 'react';
import { Calendar as CalendarComponent } from 'react-calendar-component';
import { Button } from '@blueprintjs/core';
import moment from 'moment';
import { useSelector, useActions, getDate } from '../store';
import Location from './Location';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const date = useSelector(getDate);
  const { setDate } = useActions();

  const handleMonthChange = useCallback(date => setDate(date.valueOf()), [setDate]);
  const handleDatePick = useCallback(date => console.log(date), []);
  const handleSetToday = useCallback(() => setDate(Date.now()), [setDate]);

  return (
    <CalendarComponent
      date={moment(date)}
      onChangeMonth={handleMonthChange}
      onPickDate={handleDatePick}
      renderHeader={({ date, onPrevMonth, onNextMonth }) => (
        <div className="Calendar-header">
          <Location />
          <div className="date-controls">
            <div className="Calendar-header-currentDate">{date.format('MMMM YYYY')}</div>
            <Button onClick={onPrevMonth}>«</Button>
            <Button onClick={handleSetToday}>•</Button>
            <Button onClick={onNextMonth}>»</Button>
          </div>
        </div>
      )}
    />
  );
});
