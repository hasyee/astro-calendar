import { useEffect } from 'react';
import { useSelector, getLocation } from '../store';

export const useLocalStorage = () => {
  const location = useSelector(getLocation);

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location), [location]);
  });
};
