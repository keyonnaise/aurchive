import { useState } from 'react';
import _ from 'lodash';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export default function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useIsomorphicLayoutEffect(() => {
    const updateSize = _.throttle(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);

    updateSize();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
}
