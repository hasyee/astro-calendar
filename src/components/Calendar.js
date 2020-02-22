import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-calendar-component';
import { Button } from '@blueprintjs/core';
import moment from 'moment';
import { getDate, useActions } from '../store';
import Location from './Location';
import './Calendar.scss';

export default () => {
  const date = useSelector(getDate);
  const { setDate } = useActions();

  const handleMonthChange = useCallback(date => setDate(date.valueOf()));
  const handleDatePick = useCallback(date => console.log(date));
  const handleSetToday = useCallback(() => setDate(Date.now()));

  return (
    <Calendar
      date={moment(date)}
      onChangeMonth={handleMonthChange}
      onPickDate={handleDatePick}
      renderHeader={({ date, onPrevMonth, onNextMonth }) => (
        <div className="Calendar-header">
          <Location />
          <div className="date-controls">
            <div className="Calendar-header-currentDate">{date.format('MMMM YYYY')}</div>
            <Button onClick={onPrevMonth}>«</Button>
            <Button onClick={handleSetToday}>TODAY</Button>
            <Button onClick={onNextMonth}>»</Button>
          </div>
        </div>
      )}
    />
  );
};
