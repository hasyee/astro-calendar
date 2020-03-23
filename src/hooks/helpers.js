import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';

export const useDebounce = (initialValue, callback, timeout = 500) => {
  const timer = useRef(null);

  const [value, setValue] = useState(initialValue);

  const trigger = useCallback(
    (nextValue, triggered = true) => {
      setValue(nextValue);
      if (!triggered) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(nextValue);
      }, timeout);
    },
    [timer, timeout, callback]
  );

  useEffect(() => () => timer && clearTimeout(timer.current), [timer]);

  useLayoutEffect(
    useCallback(() => {
      if (value !== initialValue) setValue(initialValue);
    }, [value, initialValue]),
    [initialValue]
  );

  return [value, trigger];
};
