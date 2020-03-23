import moment from 'moment';
import io from 'use.io';

export const date = io.state(
  moment()
    .startOf('month')
    .valueOf()
);

export const lng = io.state(19);

export const lat = io.state(47);

export const coords = io.compose({ lng: lng, lat: lat });

export const locationName = io.state('');

export const location = io.compose({ coords: coords, name: locationName }, { update: io.deepMergeUpdater });

export const locationShortName = io.memo(
  ({ coords: { lng, lat }, name }) =>
    name
      ? name
          .split(',')
          .map(term => term.trim())
          .filter(_ => _)[0] || `${lng.toFixed(2)} ${lat.toFixed(2)}`
      : `${lng.toFixed(2)} ${lat.toFixed(2)}`,
  [location]
);

export const days = io.state([]);
