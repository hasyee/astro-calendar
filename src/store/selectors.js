import { createSelector } from 'reselect';
import createDateObjects from '../utils/createDateObjects';

export const getDate = state => state.date;

export const getDateObjects = createSelector(getDate, date => createDateObjects(date, 1));

export const getLocation = state => state.location;
