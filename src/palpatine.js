import { useState, useEffect } from 'react';

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

  useSharedState.setter = () => update;

  return useSharedState;
};

export const createSharedSubStateHook = (valueHook, set) => {
  const subStateHook = set ? () => [valueHook(), set] : valueHook;
  subStateHook.setter = () => set;
  return subStateHook;
};

export const createSharedResourceHook = resource => () => resource;

export const getValue = (valueOrReducer, prevValue) =>
  typeof valueOrReducer === 'function' ? valueOrReducer(prevValue) : valueOrReducer;
