import { createSelector } from 'reselect';
import createDays from '../utils/createDays';

export const getDate = state => state.date;

export const getLocation = state => state.location;

export const getCache = state => state.cache;

export const getDays = createSelector([getDate, getLocation, getCache], (date, location, cache) => {
  if (cache[date]) return cache[date];
  return createDays(date, 1, location);
});
