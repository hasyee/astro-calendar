export const useDevTools = (hooks, { log = false } = { log: false }) => {
  const sharedStateHooks = getSharedStateHooks(hooks);
  initGlobalObject(sharedStateHooks);
  if (log) initLogger(sharedStateHooks);
};

const getSharedStateHooks = hooks =>
  Object.keys(hooks)
    .filter(hookName => !!hooks[hookName].get && !!hooks[hookName].set)
    .reduce((acc, hookName, i, hookNames) => {
      const hook = hooks[hookName];
      const stateName = getStateName(hookName);
      return { ...acc, [stateName]: hook };
    }, {});

const getStateName = hookName => {
  const withoutUse = hookName.replace(/^use/, '');
  return withoutUse.replace(/^./, withoutUse[0].toLowerCase());
};

const initGlobalObject = sharedStateHooks => {
  const topLevelHooks = filterSubHooks(sharedStateHooks);
  window.palpatine = {
    sharedStateHooks,
    getState: () => {
      return Object.keys(topLevelHooks).reduce(
        (acc, stateName) => ({ ...acc, [stateName]: topLevelHooks[stateName].get() }),
        {}
      );
    }
  };
};

const filterSubHooks = sharedStateHooks => {
  return Object.keys(sharedStateHooks).reduce((acc, stateName, i, hookNames) => {
    const hook = sharedStateHooks[stateName];
    if (
      hookNames
        .filter(hookName => !!sharedStateHooks[hookName].hookMap)
        .some(
          hookName =>
            !!Object.keys(sharedStateHooks[hookName].hookMap).find(
              subHookName => sharedStateHooks[hookName].hookMap[subHookName] === hook
            )
        )
    )
      return acc;
    return { ...acc, [stateName]: hook };
  }, {});
};

const initLogger = sharedStateHooks =>
  Object.keys(sharedStateHooks).forEach(stateName =>
    sharedStateHooks[stateName].subscribe(state => console.log(stateName, 'set', state))
  );
