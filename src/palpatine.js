import { useState, useEffect, useMemo } from 'react';

export const createSharedStateHook = initialState => {
  let state = initialState;
  const listeners = new Set();

  const update = nextStateOrReducer => {
    state = typeof nextStateOrReducer === 'function' ? nextStateOrReducer(state) : nextStateOrReducer;
    listeners.forEach(listener => listener(state));
  };

  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useSharedState = () => {
    const [value, set] = useState(state);
    useEffect(() => subscribe(set), [set]);

    return [value, update];
  };

  useSharedState.set = update;

  return useSharedState;
};

export const createSharedSubStateHook = (valueHook, set) => {
  const subStateHook = set
    ? (...args) => {
        const value = valueHook();
        return [value, set];
      }
    : valueHook;
  subStateHook.set = set;
  return subStateHook;
};

export const createSharedResourceHook = resource => () => useMemo(() => resource, []);
