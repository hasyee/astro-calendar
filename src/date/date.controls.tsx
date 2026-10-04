import { useCallback } from 'react';
import moment from 'moment';
import { Button } from '@mui/material';
import { useDate, useDateSetter } from './date.hooks';
import './date.controls.scss';

export default function DateControls() {
  const date = useDate();
  const setDate = useDateSetter();
  const updateMonth = useCallback(
    (value: number) => setDate(moment(date).add(value, 'months').valueOf()),
    [date, setDate]
  );
  const handlePrevMonth = useCallback(() => updateMonth(-1), [updateMonth]);
  const handleNextMonth = useCallback(() => updateMonth(+1), [updateMonth]);
  const handleThisMonth = useCallback(() => setDate(moment().startOf('day').valueOf()), [setDate]);

  return (
    <div className="DateControls">
      <div className="current-date">{moment(date).format('MMMM YYYY')}</div>
      <Button variant="outlined" color="inherit" onClick={handlePrevMonth}>
        «
      </Button>
      <Button variant="outlined" color="inherit" onClick={handleThisMonth}>
        •
      </Button>
      <Button variant="outlined" color="inherit" onClick={handleNextMonth}>
        »
      </Button>
    </div>
  );
}
