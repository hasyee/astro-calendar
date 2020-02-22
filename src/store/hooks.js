import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from './selectors';
import * as actions from './actions';

export const useActions = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return Object.keys(actions).reduce(
      (acc, actionName) => ({ ...acc, [actionName]: bindActionCreators(actions[actionName], dispatch) }),
      {}
    );
  }, [dispatch]);
};

export const useLocation = () => {
  const location = useSelector(selectors.getLocation);
  const { setLocation } = useActions();
  return [location, setLocation];
};

export const useDate = () => {
  const date = useSelector(selectors.getDate);
  const { setDate } = useActions();
  return [date, setDate];
};
