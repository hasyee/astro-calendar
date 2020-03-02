export const useDevTools = (hooks, { log = false } = { log: false }) => {
  const sharedStateHooks = getStateHooks(hooks);
  initGlobalObject(sharedStateHooks);
  if (log) initLogger(sharedStateHooks);
};

const getStateHooks = hooks =>
  Object.keys(hooks)
    .filter(hookName => !!hooks[hookName].get)
    .reduce((acc, hookName) => {
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
  const pureStateHooks = getPureHooks(sharedStateHooks);

  const getState = hooks => {
    return Object.keys(hooks).reduce((acc, stateName) => ({ ...acc, [stateName]: hooks[stateName].get() }), {});
  };

  window.palpatine = {
    hooks: sharedStateHooks,
    getState: () => getState(pureStateHooks),
    getStructuredState: () => getState(topLevelHooks),
    getAllState: () => getState(sharedStateHooks)
  };
};

const getPureHooks = sharedStateHooks => {
  return Object.keys(sharedStateHooks)
    .filter(key => !sharedStateHooks[key].hookMap && !sharedStateHooks[key].hookDeps)
    .reduce((acc, key) => ({ ...acc, [key]: sharedStateHooks[key] }), {});
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
  Object.keys(sharedStateHooks).forEach(stateName => {
    if (sharedStateHooks[stateName].hookMap) return;
    sharedStateHooks[stateName].subscribe(state => {
      console.log(stateName, '=', state);
      if (window.palpatine.devtools) {
        window.palpatine.devtools.sendLog(stateName, state);
      }
    });
  });
