import { useState, useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import { useSharedState } from './palpatine';
import createDays from './calculator';

export const useDate = useSharedState(
  moment()
    .startOf('month')
    .valueOf()
);

export const useLocation = useSharedState(
  localStorage.getItem('location')
    ? JSON.parse(localStorage.getItem('location'))
    : {
        coords: [19, 47],
        name: ''
      }
);

export const useCoords = () => {
  const [location, setLocation] = useLocation();
  return [
    location.coords,
    coords =>
      setLocation(location => ({
        coords,
        name: ''
      }))
  ];
};

export const useLocationName = () => {
  const [location, setLocation] = useLocation();
  return [
    location.name,
    name =>
      setLocation(location => ({
        ...location,
        name
      }))
  ];
};

export const useLocationShortName = () => {
  const [{ name, coords }] = useLocation();
  return name
    ? name
        .split(',')
        .map(term => term.trim())
        .filter(_ => _)[0] || ''
    : `${coords[0].toFixed(2)} ${coords[1].toFixed(2)}`;
};

export const useDays = () => {
  const [date] = useDate();
  const [coords] = useCoords();
  return createDays(date, 1, coords);
};

export const useGeolocation = () => {
  return {
    fetch: () =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          response => resolve([Number(response.coords.longitude), Number(response.coords.latitude)]),
          error => reject(error),
          { timeout: 10000 }
        )
      )
  };
};

export const useNominatim = () => {
  return {
    search: query =>
      fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
        .then(resp => resp.json())
        .catch(error => [])
  };
};

export const useLocalStorage = () => {
  const [location] = useLocation();

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);
};

export const useDebounce = (callback, initValue = '', timeout = 500) => {
  const timer = useRef(null);

  const [value, setValue] = useState(initValue);

  const trigger = useCallback(
    nextValue => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(nextValue);
      }, timeout);
    },
    [timer, timeout, callback]
  );

  const abort = useCallback(() => timer && clearTimeout(timer.current), [timer]);

  return [value, setValue, trigger, abort];
};
