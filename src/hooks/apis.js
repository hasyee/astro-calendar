import { useState, useCallback, useRef, useEffect } from 'react';
import io from 'use.io';
import Worker from 'workerize-loader!../worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { useDate, useCoords, useDays, useLocation, useLocationName } from './state';
import { useDebounce } from './helpers';

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useRef(Worker());
  const [date] = useDate();
  const [coords] = useCoords();
  const [, setDays] = useDays(false);

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

export const useGeolocation = io.constant({
  fetch: () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        response => resolve({ lng: Number(response.coords.longitude), lat: Number(response.coords.latitude) }),
        error => reject(error),
        { timeout: 10000 }
      )
    )
});

export const useNominatim = io.constant({
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
  const [, setLocation] = useLocation(false);
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
