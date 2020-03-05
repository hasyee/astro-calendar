import moment from 'moment';
import { createStateHook, combineStateHooks, createSelectorHook, deepMergeUpdater } from '../palpatine';

export const useDate = createStateHook(
  moment()
    .startOf('month')
    .valueOf()
);

export const useLng = createStateHook(19);

export const useLat = createStateHook(47);

export const useCoords = combineStateHooks({ lng: useLng, lat: useLat });

export const useLocationName = createStateHook('');

export const useLocation = combineStateHooks({ coords: useCoords, name: useLocationName }, deepMergeUpdater);

export const useLocationShortName = createSelectorHook(
  ({ coords: { lng, lat }, name }) =>
    name
      ? name
          .split(',')
          .map(term => term.trim())
          .filter(_ => _)[0] || `${lng.toFixed(2)} ${lat.toFixed(2)}`
      : `${lng.toFixed(2)} ${lat.toFixed(2)}`,
  [useLocation]
);

export const useDays = createStateHook([]);
