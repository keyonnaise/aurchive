import { useCallback, useRef } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export default function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => callbackRef.current(...args), []) as Callback;
}
