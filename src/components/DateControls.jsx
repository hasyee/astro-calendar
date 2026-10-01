import React, { useCallback } from 'react';
import moment from 'moment';
import { Button } from '@blueprintjs/core';
import { useDate } from '../hooks';
import './DateControls.scss';

export default React.memo(function DateControls() {
  const [{ set: setDate }, date] = useDate();
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
    <div className="DateControls">
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
  );
});
