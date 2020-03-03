import { useState, useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import { createStateHook, createResourceHook, combineStateHooks, createSelectorHook } from './palpatine';
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

export const useLocation = combineStateHooks({ coords: useCoords, name: useLocationName }, diff => state => ({
  ...state,
  ...diff,
  coords: diff.coords
    ? {
        ...state.coords,
        ...diff.coords
      }
    : state.coords
}));

export const useLocationShortName = createSelectorHook(
  (lng, lat, name) =>
    name
      ? name
          .split(',')
          .map(term => term.trim())
          .filter(_ => _)[0] || ''
      : `${lng.toFixed(2)} ${lat.toFixed(2)}`,
  [useLng, useLat, useLocationName]
);

export const useDays = createStateHook([]);

export const useDebounce = (initialValue, callback, timeout = 500) => {
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
      setLocationFetchingError(null);
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

export const useSearch = () => {
  const [locationName] = useLocationName();
  const nominatim = useNominatim();

  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [query, setQuery] = useDebounce(
    locationName,
    useCallback(
      async query => {
        if (!query) return setItems([]);
        const results = await nominatim.search(query);
        setIsSearching(false);
        setItems(results);
      },
      [nominatim, setIsSearching, setItems]
    )
  );

  const handleQueryChange = useCallback(
    query => {
      setIsSearching(true);
      setQuery(query);
    },
    [setIsSearching, setQuery]
  );

  return { query, handleQueryChange, items, isSearching };
};
