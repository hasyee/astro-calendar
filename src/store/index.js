import Store, { thunk } from 'repatch';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import initialState from './initialState';
import * as actions from './actions';
import * as geolocation from '../utils/geolocation';
import * as nominatim from '../utils/nominatim';
export { useSelector } from 'react-redux';
export * from './selectors';

const store = new Store(initialState).addMiddleware(thunk.withExtraArgument({ geolocation, nominatim }));

window.store = store;

export default store;

export const useActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return Object.keys(actions).reduce(
      (acc, actionName) => ({ ...acc, [actionName]: bindActionCreators(actions[actionName], dispatch) }),
      {}
    );
  }, [dispatch]);
};
