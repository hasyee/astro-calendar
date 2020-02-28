export const devTools = hooks => {
  const sharedStateHooks = Object.keys(hooks)
    .filter(hookName => !!hooks[hookName].get && !!hooks[hookName].set && !hooks[hookName].isCombined)
    .reduce((acc, hookName) => {
      const stateName = getStateName(hookName);
      return { ...acc, [stateName]: hooks[hookName] };
    }, {});
};

const getStateName = hookName => {
  const withoutUse = hookName.replace(/^use/, '');
  return withoutUse.replace(/^./, withoutUse[0].toLowerCase());
};
