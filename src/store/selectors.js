import { createSelector } from 'reselect';
import createDays from '../utils/createDays';

export const getDate = state => state.date;

export const getLocation = state => state.location;

export const getCoords = createSelector(getLocation, location => location.coords);

export const getLocationName = createSelector(getLocation, location => location.name);

export const getLocationShortName = createSelector(getLocationName, name =>
  name
    ? name
        .split(',')
        .map(term => term.trim())
        .filter(_ => _)[0] || ''
    : ''
);

export const getDays = createSelector([getDate, getCoords], (date, coords) => createDays(date, 1, coords));
