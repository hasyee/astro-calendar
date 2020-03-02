import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import moment from 'moment';
import { createStateHook, createResourceHook, combineStateHooks } from './palpatine';
import Worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax

export const useDate = createStateHook(
  moment()
    .startOf('month')
    .valueOf()
);

export const useLng = createStateHook(19);

export const useLat = createStateHook(47);

export const useCoords = combineStateHooks({ lng: useLng, lat: useLat });

export const useLocationName = createStateHook('');

export const useLocation = combineStateHooks({ coords: useCoords, name: useLocationName });

export const useLocationShortName = () => {
  const [{ name, coords }] = useLocation();
  return useMemo(
    () =>
      name
        ? name
            .split(',')
            .map(term => term.trim())
            .filter(_ => _)[0] || ''
        : `${coords.lng.toFixed(2)} ${coords.lat.toFixed(2)}`,
    [name, coords]
  );
};

export const useDays = createStateHook([]);

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useRef(Worker());
  const [date] = useDate();
  const [coords] = useCoords();
  const setDays = useDays.set;

  useEffect(() => {
    worker.current.addEventListener('message', message => {
      if (!message.data.days || message.data.jobId !== jobId.current) return;
      setDays(message.data.days);
    });
  }, [setDays]);

  useEffect(() => {
    worker.current.calc(++jobId.current, date, 1, coords);
  }, [date, coords]);
};

export const useGeolocation = createResourceHook({
  fetch: () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        response => resolve({ lng: Number(response.coords.longitude), lat: Number(response.coords.latitude) }),
        error => reject(error),
        { timeout: 10000 }
      )
    )
});

export const useNominatim = createResourceHook({
  search: query =>
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
      .then(resp => resp.json())
      .catch(error => [])
});

export const useLocalStorage = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('location')) return;
    setLocation(JSON.parse(localStorage.getItem('location')));
  }, [setLocation]);

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);
};

export const useMyLocation = onFinish => {
  const geolocation = useGeolocation();
  const setLocation = useLocation.set;
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      const coords = await geolocation.fetch();
      setLocation({ coords, name: '' });
      onFinish();
    } catch (error) {
      setLocationFetchingError(error.message);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, geolocation, setLocation, onFinish]);

  return { isFetchingLocation, locationFetchingError, fetchLocation };
};

export const useDebounce = (callback, initialValue = '', timeout = 500) => {
  const timer = useRef(null);

  const [value, setValue] = useState(initialValue);

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

  useEffect(
    useCallback(() => {
      if (value !== initialValue) setValue(initialValue);
    }, [value, initialValue]),
    [initialValue]
  );

  return [value, trigger];
};
