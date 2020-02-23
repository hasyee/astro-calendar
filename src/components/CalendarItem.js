import React, { useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Moon from './Moon';
import { useSelector, getLocation } from '../store';
import { getNightInfo } from '../utils/getNightInfo';
import Night from './Night';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames, onPickDate }) {
  const location = useSelector(getLocation);
  const { night, moonNight, astroNight, moonlessNight, moonPhase } = useMemo(
    () => getNightInfo(day.valueOf(), location[1], location[0], -18),
    [day, location]
  );

  return (
    <div
      key={day.format()}
      className={classnames('CalendarItem', day.isSame(moment(), 'day') && 'current', classNames)}
      onClick={e => onPickDate(day)}
    >
      <header>
        <div className="day">
          <div className="day-number">{day.format('D')}</div>
          <div className="day-name">{day.format('ddd')}</div>
        </div>
        <div className="moon-container">
          <Moon phase={moonPhase} />
        </div>
      </header>

      <main>
        <Night night={night} moonNight={moonNight} astroNight={astroNight} moonlessNight={moonlessNight} />
      </main>
    </div>
  );
});
