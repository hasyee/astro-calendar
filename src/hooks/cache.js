import { useEffect } from 'react';
import { useSelector, useActions, getDate, getDays } from '../store';

export default () => {
  const date = useSelector(getDate);
  const days = useSelector(getDays);
  const { addToCache } = useActions();
  useEffect(() => {
    addToCache(date, days);
  }, [addToCache, date, days]);
  return days;
};
