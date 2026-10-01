import { date, lng, lat, coords, locationName, location, locationShortName, days } from '../state';

export const useDate = date.hook();

export const useLng = lng.hook();

export const useLat = lat.hook();

export const useCoords = coords.hook();

export const useLocationName = locationName.hook();

export const useLocation = location.hook();

export const useLocationShortName = locationShortName.hook();

export const useDays = days.hook();
