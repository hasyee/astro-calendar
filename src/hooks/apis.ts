import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import CalcWorker from '../worker?worker';
import { useDate, useCoords, useDays, useLocation } from './state';
import type { Coords, NominatimPlace } from '../types';
import { useDebounce } from './helpers';

const constant = <T>(r: T) => () => r;

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useMemo(() => new CalcWorker(), []);
  const [, date] = useDate();
  const [, coords] = useCoords();
  const [days] = useDays();

  useEffect(() => {
    worker.onmessage = ({ data: result }) => {
      if (!result.days || result.jobId !== jobId.current) return;
      days.set(result.days);
    };
  }, [worker, days]);

  useEffect(() => {
    worker.postMessage({ jobId: ++jobId.current, date, weekOffset: 1, location: coords });
  }, [worker, date, coords]);

  useEffect(() => () => worker.terminate(), [worker]);
};

export const useGeolocation = constant({
  fetch: () =>
    new Promise<Coords>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        response => resolve({ lng: Number(response.coords.longitude), lat: Number(response.coords.latitude) }),
        error => reject(error),
        { timeout: 10000 }
      )
    )
});

export const useNominatim = constant({
  search: (query: string): Promise<NominatimPlace[]> =>
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
      .then(resp => resp.json() as Promise<NominatimPlace[]>)
      .catch(() => [])
});

export const useLocalStorage = () => {
  const [{ set: setLocation }, location] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('location');
    if (!stored) return;
    try {
      setLocation(JSON.parse(stored));
    } catch (error) {
      console.error(error);
    }
  }, [setLocation]);

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);
};

export const useMyLocation = (onFinish: () => void) => {
  const geolocation = useGeolocation();
  const [location] = useLocation();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      setLocationFetchingError(null);
      const coords = await geolocation.fetch();
      location.set({ coords, name: '' });
      setIsFetchingLocation(false);
      onFinish();
    } catch (error) {
      setLocationFetchingError((error as { message: string }).message);
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, geolocation, location, onFinish]);

  return { isFetchingLocation, locationFetchingError, fetchLocation };
};

export const useSearch = () => {
  const nominatim = useNominatim();

  const [items, setItems] = useState<NominatimPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [query, setQuery] = useDebounce<string>(
    '',
    useCallback(
      async (query: string) => {
        if (!query) return setItems([]);
        const results = await nominatim.search(query);
        setIsSearching(false);
        setItems(results);
      },
      [nominatim, setIsSearching, setItems]
    )
  );

  const handleQueryChange = useCallback(
    (query: string) => {
      setIsSearching(true);
      setQuery(query);
    },
    [setIsSearching, setQuery]
  );

  return { query, handleQueryChange, items, isSearching };
};
