import { useState, useEffect } from 'react';
export * from './updaters';
export * from './dev';

const createStore = initialState => {
  let state = initialState;
  const listeners = new Set();

  const get = () => state;

  const set = valueOrReducer => {
    const nextState = typeof valueOrReducer === 'function' ? valueOrReducer(state) : valueOrReducer;
    if (state !== nextState) {
      state = nextState;
      listeners.forEach(listener => listener(state));
    }
    return state;
  };

  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { get, set, subscribe };
};

const createHookByStore = ({ get, set, subscribe, updater }) => {
  const update = set && updater ? (...args) => set(updater(...args)) : set;

  const useSharedState = () => {
    const [value, setter] = useState(get());
    useEffect(() => subscribe(setter), [setter]);
    return update ? [value, update] : value;
  };

  if (set) useSharedState.origSet = set;
  if (update) useSharedState.set = update;
  useSharedState.get = get;
  useSharedState.subscribe = subscribe;

  return useSharedState;
};

export const createStateHook = (initialState, updater) => {
  const store = createStore(initialState);
  return createHookByStore({ ...store, updater });
};

export const combineStateHooks = (hookMap, updater) => {
  let blockListening = false;

  const get = () => Object.keys(hookMap).reduce((acc, key) => ({ ...acc, [key]: hookMap[key].get() }), {});

  const set = valueOrReducer => {
    const nextState = typeof valueOrReducer === 'function' ? valueOrReducer(get()) : valueOrReducer;
    const lastModifiedHookIndex = Object.keys(hookMap).reduce(
      (lastIndex, key, index) => (hookMap[key].get() !== nextState[key] ? index : lastIndex),
      -1
    );
    if (lastModifiedHookIndex === -1) return nextState;
    blockListening = true;
    Object.keys(hookMap).forEach((key, i) => {
      if (i === lastModifiedHookIndex) blockListening = false;
      hookMap[key].origSet(nextState[key]);
    });
    return nextState;
  };

  const subscribe = listener => {
    const unsubscribes = Object.keys(hookMap).map(key =>
      hookMap[key].subscribe(() => !blockListening && listener(get()))
    );
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  };

  const useCombinedState = createHookByStore({ get, set, subscribe, updater });

  useCombinedState.hookMap = hookMap;

  return useCombinedState;
};

export const createSelectorHook = (selector, hookDeps) => {
  let prevValues;

  const get = () => {
    const values = hookDeps.map(hook => hook.get());
    const value = selector(...values);
    prevValues = values;
    return value;
  };

  const subscribe = listener => {
    const unsubscribes = hookDeps.map(hook =>
      hook.subscribe((nextValue, i) => {
        if (nextValue !== prevValues[i]) listener(get());
      })
    );
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  };

  const useSelector = createHookByStore({ get, subscribe });

  useSelector.hookDeps = hookDeps;

  return useSelector;
};

export const createResourceHook = resource => () => resource;
