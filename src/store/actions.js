export const setDate = date => state => ({ ...state, date });

export const setLocation = location => state => ({ ...state, location, cache: {} });

export const addToCache = (date, days) => state => ({ ...state, cache: { ...state.cache, [date]: days } });
