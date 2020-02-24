import { useState, useCallback, useRef } from 'react';

export const useDebounce = (callback, initValue = '', timeout = 500) => {
  const timer = useRef(null);
  const [value, setChange] = useState(initValue);
  const handleChange = useCallback(
    nextValue => {
      setChange(nextValue);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(nextValue);
      }, timeout);
    },
    [timer, timeout, callback]
  );
  return [value, setChange, handleChange];
};
