import Store from 'repatch';
import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import * as actions from './actions';
export { useSelector } from 'react-redux';
export * from './selectors';

const store = new Store({
  date: Date.now(),
  location: [19, 47],
  cache: {}
});

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
