import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Moon from './Moon';
import Night from './Night';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames, moonPhase, ...bands }) {
  return (
    <div className={classnames('CalendarItem', moment(day).isSame(moment(), 'day') && 'current', classNames)}>
      <header>
        <div className="day">
          <div className="day-number">{moment(day).format('D')}</div>
          <div className="day-name">{moment(day).format('ddd')}</div>
        </div>
        <div className="moon-container">
          <Moon phase={moonPhase} />
        </div>
      </header>

      <main>
        <Night {...bands} />
      </main>
    </div>
  );
});
