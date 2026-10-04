import { type MouseEvent, useState } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Popover } from '@mui/material';
import Moon from '../moon/moon';
import Bands from './calendar.bands';
import Info from './calendar.info';
import type { CalendarDay } from '../calculator/calculator.types';
import './calendar.item.scss';

export default function CalendarItem({ day, classNames, moonPhase, info, bands }: CalendarDay) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <div
        className={classnames(
          'CalendarItem',
          moment(day).isSame(moment(), 'day') && 'current',
          classNames,
          anchorEl && 'selected'
        )}
        onClick={handleOpen}
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

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Info {...info} />
      </Popover>
    </>
  );
}
