import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Button } from '@blueprintjs/core';
import { useSelector, useActions, getDate } from '../store';
import Location from './Location';
import './CalendarHeader.scss';

export default React.memo(function CalendarHeader() {
  const date = useSelector(getDate);
  const { setDate } = useActions();
  const [isOpenLocationDialog, setIsOpenLocationDialog] = useState(false);
  const handleOpenLocationDialog = useCallback(() => setIsOpenLocationDialog(true), []);
  const handleCloseLocationDialog = useCallback(() => setIsOpenLocationDialog(false), []);
  const handlePrevMonth = useCallback(() => setDate(changeMonth(date, -1)), [setDate, date]);
  const handleNextMonth = useCallback(() => setDate(changeMonth(date, +1)), [setDate, date]);
  const handleThisMonth = useCallback(() => setDate(Date.now()), [setDate]);

  return (
    <div className="CalendarHeader">
      <div className="action-bar">
        <Button icon="locate" onClick={handleOpenLocationDialog} large>
          Location
        </Button>
        <Location isOpen={isOpenLocationDialog} onClose={handleCloseLocationDialog} />
        <div className="date-controls">
          <div className="current-date">{moment(date).format('MMMM YYYY')}</div>
          <Button onClick={handlePrevMonth} large>
            «
          </Button>
          <Button onClick={handleThisMonth} large>
            •
          </Button>
          <Button onClick={handleNextMonth} large>
            »
          </Button>
        </div>
      </div>
    </div>
  );
});

const changeMonth = (date, value) =>
  moment(date)
    .add(value, 'months')
    .valueOf();
