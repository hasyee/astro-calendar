import React, { useState } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { PopoverNext } from '@blueprintjs/core';
import Moon from './Moon';
import Bands from './Bands';
import Info from './Info';
import type { CalendarDay } from '../types';
import './CalendarItem.scss';

export default React.memo(function CalendarItem({ day, classNames, moonPhase, info, bands }: CalendarDay) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverNext
      isOpen={isOpen}
      onInteraction={setIsOpen}
      content={<Info {...info} />}
      hasBackdrop
      lazy
      renderTarget={({ isOpen: _isOpen, ref, ...targetProps }) => (
        <div
          {...targetProps}
          ref={ref}
          className={classnames(
            'CalendarItem',
            moment(day).isSame(moment(), 'day') && 'current',
            classNames,
            isOpen && 'selected'
          )}
        >
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
            <Bands {...bands} />
          </main>
        </div>
      )}
    />
  );
});
