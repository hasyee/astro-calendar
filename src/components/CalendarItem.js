import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Moon from './Moon';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames, onPickDate }) {
  return (
    <div
      key={day.format()}
      className={classnames('CalendarItem', day.isSame(moment(), 'day') && 'current', classNames)}
      onClick={e => onPickDate(day)}
    >
      <header>
        <div className="day-number">{day.format('D')}</div>
        <div className="moon-container">
          <Moon phase={0.15} />
        </div>
      </header>
      <main></main>
    </div>
  );
});
