import { LegacyRef, MutableRefObject, RefCallback } from 'react';

type ReactRef<T> = MutableRefObject<T> | LegacyRef<T> | undefined;

export default function useCombinedRefs<T>(...refs: ReactRef<T>[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null && ref !== undefined) {
        // eslint-disable-next-line no-param-reassign
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
