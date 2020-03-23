import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Worker from 'workerize-loader!../worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { useDate, useCoords, useDays, useLocation, useLocationName } from './state';
import { useDebounce } from './helpers';

const constant = r => () => r;

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useMemo(() => Worker(), []);
  const { current: date } = useDate();
  const { current: coords } = useCoords();
  const days = useDays();

  useEffect(() => {
    worker.calc(++jobId.current, date, 1, coords).then(result => {
      if (!result.days || result.jobId !== jobId.current) return;
      days.set(result.days);
    });
  }, [worker, date, coords, days]);
};

export const useGeolocation = constant({
  fetch: () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        response => resolve({ lng: Number(response.coords.longitude), lat: Number(response.coords.latitude) }),
        error => reject(error),
        { timeout: 10000 }
      )
    )
});

export const useNominatim = constant({
  search: query =>
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
      .then(resp => resp.json())
      .catch(error => [])
});

export const useLocalStorage = () => {
  const { current: location, set: setLocation } = useLocation();

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
  const location = useLocation();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      setLocationFetchingError(null);
      const coords = await geolocation.fetch();
      location.set({ coords, name: '' });
      setIsFetchingLocation(false);
      onFinish();
    } catch (error) {
      setLocationFetchingError(error.message);
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, geolocation, location, onFinish]);

  return { isFetchingLocation, locationFetchingError, fetchLocation };
};

export const useSearch = () => {
  const locationName = useLocationName();
  const nominatim = useNominatim();

  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [query, setQuery] = useDebounce(
    locationName.current,
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
