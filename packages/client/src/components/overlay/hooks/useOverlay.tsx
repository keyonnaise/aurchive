import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import uniqueId from '~lib/uniqueId';
import useOverlayGroupStore from '~store/useOverlayGroupStore';
import Overlay, { CreateOverlayElement, OverlayControlRef } from '../Overlay';

export default function useOverlay() {
  const { mount, unmount } = useOverlayGroupStore(useShallow(({ mount, unmount }) => ({ mount, unmount })));

  const overlayRef = useRef<OverlayControlRef>(null);
  const id = useRef(uniqueId()).current;

  useEffect(() => {
    return () => unmount(id);
  }, [id, unmount]);

  return useMemo(
    () => ({
      open(overlayElement: CreateOverlayElement) {
        mount(
          id,
          <Overlay
            key={Date.now()}
            ref={overlayRef}
            overlayElement={overlayElement}
          />,
        );
      },

      close() {
        overlayRef.current?.close();
      },
    }),
    [id, mount],
  );
}
