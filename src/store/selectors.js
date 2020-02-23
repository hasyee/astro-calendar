import { createSelector } from 'reselect';
import createDays from '../utils/createDays';

export const getDate = state => state.date;

export const getLocation = state => state.location;

export const getDays = createSelector([getDate, getLocation], (date, location) => createDays(date, 1, location));
