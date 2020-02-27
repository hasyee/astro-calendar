import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import { createSharedStateHook, createSharedSubStateHook, createSharedResourceHook } from './palpatine';
import Worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax

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

export const useDays = createSharedStateHook([]);

export const useCoords = createSharedSubStateHook(
  () => useLocation()[0].coords,
  coordsOrReducer =>
    useLocation.set(location => ({
      coords: typeof coordsOrReducer === 'function' ? coordsOrReducer(location.coords) : coordsOrReducer,
      name: ''
    }))
);

export const useLocationName = createSharedSubStateHook(
  () => useLocation()[0].name,
  name => useLocation.set(location => ({ ...location, name }))
);

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

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useRef(Worker());
  const [date] = useDate();
  const [coords] = useCoords();

  useEffect(() => {
    worker.current.addEventListener('message', message => {
      if (!message.data.days || message.data.jobId !== jobId.current) return;
      useDays.set(message.data.days);
    });
  }, []);

  useEffect(() => {
    worker.current.calc(++jobId.current, date, 1, coords);
    //useDays.set([]);
  }, [date, coords]);
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
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      const coords = await geolocation.fetch();
      useCoords.set(coords);
      onFinish();
    } catch (error) {
      setLocationFetchingError(error.message);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, geolocation, onFinish]);

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

  return [value, trigger];
};
