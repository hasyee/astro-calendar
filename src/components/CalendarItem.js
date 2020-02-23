import React, { useState, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Popover, Classes } from '@blueprintjs/core';
import Moon from './Moon';
import Night from './Night';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames, moonPhase, info, bands }) {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const handleCellClick = useCallback(() => setIsOpenInfo(!isOpenInfo));
  const popoverContent = useMemo(() => <div>...</div>, [info]);

  return (
    <div className="cell" onClick={handleCellClick}>
      <Popover
        isOpen={isOpenInfo}
        targetTagName="div"
        content={popoverContent}
        hasBackdrop
        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      >
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
            <div className="band-container">
              <Night {...bands} />
            </div>
          </main>
        </div>
      </Popover>
    </div>
  );
});
