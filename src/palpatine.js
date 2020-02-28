import { useState, useEffect } from 'react';

const getOrReduceValue = (valueOrReducer, state) =>
  typeof valueOrReducer === 'function' ? valueOrReducer(state) : valueOrReducer;

const createStore = initialState => {
  let state = initialState;
  const listeners = new Set();

  const get = () => state;

  const set = valueOrReducer => {
    state = getOrReduceValue(valueOrReducer, state);
    listeners.forEach(listener => listener(state));
  };

  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { get, set, subscribe };
};

const createHookByStore = store => {
  const useSharedState = () => {
    const [value, setter] = useState(store.get());
    useEffect(() => store.subscribe(setter), [setter]);
    return [value, store.set];
  };

  useSharedState.set = store.set;
  useSharedState.get = store.get;

  return useSharedState;
};

export const createStateHook = initialState => {
  const store = createStore(initialState);
  return createHookByStore(store);
};

export const combineSharedStateHooks = hookMap => {
  const store = createStore(Object.keys(hookMap).reduce((acc, key) => ({ ...acc, [key]: hookMap[key].get() }), {}));
  return createHookByStore({
    ...store,
    set: valueOrReducer => {
      store.set(valueOrReducer);
      Object.keys(hookMap).forEach(key => hookMap[key].set(store.get()[key]));
    }
  });
};

export const createResourceHook = resource => () => resource;
