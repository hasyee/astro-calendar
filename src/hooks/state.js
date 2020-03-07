import moment from 'moment';
import io, { deepMergeUpdater } from 'use.io';

export const useDate = io(
  moment()
    .startOf('month')
    .valueOf()
);

export const useLng = io(19);

export const useLat = io(47);

export const useCoords = io.compose({ lng: useLng, lat: useLat });

export const useLocationName = io('');

export const useLocation = io.compose({ coords: useCoords, name: useLocationName }, deepMergeUpdater);

export const useLocationShortName = io.select(
  ({ coords: { lng, lat }, name }) =>
    name
      ? name
          .split(',')
          .map(term => term.trim())
          .filter(_ => _)[0] || `${lng.toFixed(2)} ${lat.toFixed(2)}`
      : `${lng.toFixed(2)} ${lat.toFixed(2)}`,
  [useLocation]
);

export const useDays = io([]);
