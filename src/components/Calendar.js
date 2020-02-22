import React from 'react';
import { Calendar } from 'react-calendar-component';
import { Button } from '@blueprintjs/core';
import moment from 'moment';
import { useDate } from '../store';
import Location from './Location';
import './Calendar.scss';

export default React.memo(() => {
  const [date, setDate] = useDate();

  return (
    <Calendar
      date={moment(date)}
      onChangeMonth={date => setDate(date.valueOf())}
      onPickDate={date => console.log(date)}
      renderHeader={({ date, onPrevMonth, onNextMonth }) => (
        <div className="Calendar-header">
          <Location />
          <div className="date-controls">
            <div className="Calendar-header-currentDate">{date.format('MMMM YYYY')}</div>
            <Button onClick={onPrevMonth}>«</Button>
            <Button onClick={() => setDate(Date.now())}>TODAY</Button>
            <Button onClick={onNextMonth}>»</Button>
          </div>
        </div>
      )}
    />
  );
});
