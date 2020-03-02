import React, { useState, useCallback } from 'react';
import moment from 'moment';
import { Button } from '@blueprintjs/core';
import { useDate, useLocationShortName } from '../hooks';
import Location from './Location';
import './Header.scss';

export default React.memo(function Header() {
  const [date, setDate] = useDate();
  const locationShortName = useLocationShortName();
  const [isOpenLocationDialog, setIsOpenLocationDialog] = useState(false);
  const handleOpenLocationDialog = useCallback(() => setIsOpenLocationDialog(true), []);
  const handleCloseLocationDialog = useCallback(() => setIsOpenLocationDialog(false), []);
  const updateMonth = useCallback(
    value =>
      setDate(
        moment(date)
          .add(value, 'months')
          .valueOf()
      ),
    [date, setDate]
  );
  const handlePrevMonth = useCallback(() => updateMonth(-1), [updateMonth]);
  const handleNextMonth = useCallback(() => updateMonth(+1), [updateMonth]);
  const handleThisMonth = useCallback(
    () =>
      setDate(
        moment()
          .startOf('day')
          .valueOf()
      ),
    [setDate]
  );

  return (
    <div className="Header">
      <div className="action-bar">
        <Button icon="locate" onClick={handleOpenLocationDialog} large>
          {locationShortName ? locationShortName.toUpperCase() : 'LOCATION'}
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
