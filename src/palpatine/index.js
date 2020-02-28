import { useState, useEffect } from 'react';

const createStore = initialState => {
  let state = initialState;
  const listeners = new Set();

  const get = () => state;

  const set = valueOrReducer => {
    state = typeof valueOrReducer === 'function' ? valueOrReducer(state) : valueOrReducer;
    listeners.forEach(listener => listener(state));
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

  return useSharedState;
};

export const createStateHook = initialState => {
  const store = createStore(initialState);
  return createHookByStore(store);
};

export const combineSharedStateHooks = hookMap => {
  const initialState = Object.keys(hookMap).reduce((acc, key) => ({ ...acc, [key]: hookMap[key].get() }), {});
  
  const store = createStore(initialState);

  const useCombinedState = createHookByStore({
    ...store,
    set: valueOrReducer => {
      store.set(valueOrReducer);
      Object.keys(hookMap).forEach(key => hookMap[key].set(store.get()[key]));
    }
  });

  useCombinedState.isCombined = true;

  return useCombinedState;
};

export const createResourceHook = resource => () => resource;
