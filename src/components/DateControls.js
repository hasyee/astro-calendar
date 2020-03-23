import React, { useCallback } from 'react';
import moment from 'moment';
import { Button } from '@blueprintjs/core';
import { useDate } from '../hooks';
import './DateControl.scss';

export default React.memo(function DateControls() {
  const date = useDate();
  const updateMonth = useCallback(
    value =>
      date.set(
        moment(date.current)
          .add(value, 'months')
          .valueOf()
      ),
    [date]
  );
  const handlePrevMonth = useCallback(() => updateMonth(-1), [updateMonth]);
  const handleNextMonth = useCallback(() => updateMonth(+1), [updateMonth]);
  const handleThisMonth = useCallback(
    () =>
      date.set(
        moment()
          .startOf('day')
          .valueOf()
      ),
    [date]
  );

  return (
    <div className="DateControls">
      <div className="current-date">{moment(date.current).format('MMMM YYYY')}</div>
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
  );
});
