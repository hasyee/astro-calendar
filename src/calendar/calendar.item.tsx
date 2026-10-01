import { useState } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { PopoverNext } from '@blueprintjs/core';
import Moon from '../moon/moon';
import Bands from './calendar.bands';
import Info from './calendar.info';
import type { CalendarDay } from '../calculator/calculator.types';
import './calendar.item.scss';

export default function CalendarItem({ day, classNames, moonPhase, info, bands }: CalendarDay) {
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
}
