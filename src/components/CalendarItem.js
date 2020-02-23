import React, { useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Moon from './Moon';
import { useSelector, getLocation } from '../store';
import { getNightInfo } from '../utils/getNightInfo';
import Night from './Night';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames }) {
  const location = useSelector(getLocation);
  const { night, moonNight, astroNight, moonlessNight, moonPhase } = useMemo(
    () => getNightInfo(day, location[1], location[0], -18),
    [day, location]
  );

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
        <Night night={night} moonNight={moonNight} astroNight={astroNight} moonlessNight={moonlessNight} />
      </main>
    </div>
  );
});
