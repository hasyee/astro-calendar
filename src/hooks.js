import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import { createSharedStateHook, createSharedResourceHook } from './palpatine';
import createDays from './calculator';

export const useDate = createSharedStateHook(
  moment()
    .startOf('month')
    .valueOf()
);

export const useLocation = createSharedStateHook(
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
    useCallback(
      coordsOrReducer =>
        setLocation(location => ({
          coords: typeof coordsOrReducer === 'function' ? coordsOrReducer(location.coords) : coordsOrReducer,
          name: ''
        })),
      [setLocation]
    )
  ];
};

export const useLocationName = () => {
  const [location, setLocation] = useLocation();
  return [location.name, name => setLocation(location => ({ ...location, name }))];
};

export const useLocationShortName = () => {
  const [{ name, coords }] = useLocation();
  return useMemo(
    () =>
      name
        ? name
            .split(',')
            .map(term => term.trim())
            .filter(_ => _)[0] || ''
        : `${coords[0].toFixed(2)} ${coords[1].toFixed(2)}`,
    [name, coords]
  );
};

export const useDays = () => {
  const [date] = useDate();
  const [coords] = useCoords();
  return useMemo(() => createDays(date, 1, coords), [date, coords]);
};

export const useGeolocation = createSharedResourceHook({
  fetch: () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        response => resolve([Number(response.coords.longitude), Number(response.coords.latitude)]),
        error => reject(error),
        { timeout: 10000 }
      )
    )
});

export const useNominatim = createSharedResourceHook({
  search: query =>
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
      .then(resp => resp.json())
      .catch(error => [])
});

export const useLocalStorage = () => {
  const [location] = useLocation();

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);
};

export const useMyLocation = onFinish => {
  const geolocation = useGeolocation();
  const [, setCoords] = useCoords(); // TODO - use setter only
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      const coords = await geolocation.fetch();
      setCoords(coords);
      onFinish();
    } catch (error) {
      setLocationFetchingError(error.message);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, geolocation, setCoords, onFinish]);

  return { isFetchingLocation, locationFetchingError, fetchLocation };
};

export const useDebounce = (callback, initValue = '', timeout = 500) => {
  const timer = useRef(null);

  const [value, setValue] = useState(initValue);

  const trigger = useCallback(
    (nextValue, triggered = true) => {
      setValue(nextValue);
      if (!triggered) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(nextValue);
      }, timeout);
    },
    [timer, timeout, callback]
  );

  useEffect(() => () => timer && clearTimeout(timer.current), [timer]);

  // TODO add updater effect by initialValue

  return [value, trigger];
};
