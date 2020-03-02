import { useState, useEffect } from 'react';
export * from './dev';

const createStore = initialState => {
  let state = initialState;
  const listeners = new Set();

  const get = () => state;

  const set = valueOrReducer => {
    state = typeof valueOrReducer === 'function' ? valueOrReducer(state) : valueOrReducer;
    listeners.forEach(listener => listener(state));
    return state;
  };

  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { get, set, subscribe };
};

const createHookByStore = ({ get, set, subscribe }) => {
  const useSharedState = () => {
    const [value, setter] = useState(get());
    useEffect(() => subscribe(setter), [setter]);
    return [value, set];
  };

  useSharedState.set = set;
  useSharedState.get = get;
  useSharedState.subscribe = subscribe;

  return useSharedState;
};

export const createStateHook = initialState => {
  const store = createStore(initialState);
  return createHookByStore(store);
};

export const combineStateHooks = hookMap => {
  let blockListening = false;

  const get = () => Object.keys(hookMap).reduce((acc, key) => ({ ...acc, [key]: hookMap[key].get() }), {});

  const set = valueOrReducer => {
    const nextState = typeof valueOrReducer === 'function' ? valueOrReducer(get()) : valueOrReducer;
    blockListening = true;
    Object.keys(hookMap).forEach((key, i, stateNames) => {
      if (i === stateNames.length - 1) blockListening = false;
      hookMap[key].set(nextState[key]);
    });
    return nextState;
  };

  const subscribe = listener => {
    const unsubscribes = Object.keys(hookMap).map(key =>
      hookMap[key].subscribe(() => !blockListening && listener(get()))
    );
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  };

  const useCombinedState = createHookByStore({ get, set, subscribe });

  useCombinedState.hookMap = hookMap;

  return useCombinedState;
};

export const createResourceHook = resource => () => resource;
