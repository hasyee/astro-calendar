import { useEffect } from 'react';
import { useSelector, useActions, getDate } from '../store';

export default days => {
  const date = useSelector(getDate);
  const { addToCache } = useActions();
  useEffect(() => {
    addToCache(date, days);
  }, [addToCache, date, days]);
};
