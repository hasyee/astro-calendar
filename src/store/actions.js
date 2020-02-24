export const setDate = date => state => ({ ...state, date });

export const setLocation = (coords, name = '') => state => ({
  ...state,
  location: { coords, name }
});

export const fetchLocation = () => state => async (dispatch, getState, { geolocation }) => geolocation.fetch();

export const searchPlaces = query => state => (dispatch, getState, { nominatim }) => nominatim.search(query);
