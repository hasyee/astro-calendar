import React, { useState, useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import moment from 'moment';
import { useSelector, useActions, getDate, getDateObjects } from '../store';
import Location from './Location';
import CalendarItem from './CalendarItem';
import './Calendar.scss';

export default React.memo(function Calendar() {
  const date = useSelector(getDate);
  const { setDate } = useActions();
  const dateObjects = useSelector(getDateObjects);
  const [isOpenLocationDialog, setIsOpenLocationDialog] = useState(false);
  const handleOpenLocationDialog = useCallback(() => setIsOpenLocationDialog(true), []);
  const handleCloseLocationDialog = useCallback(() => setIsOpenLocationDialog(false), []);
  const handlePrevMonth = useCallback(() => setDate(changeMonth(date, -1)), [setDate, date]);
  const handleNextMonth = useCallback(() => setDate(changeMonth(date, +1)), [setDate, date]);
  const handleThisMonth = useCallback(() => setDate(Date.now()), [setDate]);
  const renderDay = useCallback(props => <CalendarItem {...props} />, []);

  return (
    <div className="Calendar">
      <header>
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
      </header>
      <main>{dateObjects.map(renderDay)}</main>
    </div>
  );
});

const changeMonth = (date, value) =>
  moment(date)
    .add(value, 'months')
    .valueOf();
