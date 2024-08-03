import { EffectCallback, useEffect, useRef } from 'react';

export default function useEffectOnce(callback: EffectCallback) {
  const preserveCallback = useRef(callback).current;

  useEffect(preserveCallback, [preserveCallback]);
}
