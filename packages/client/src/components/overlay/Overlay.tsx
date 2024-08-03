import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export interface OverlayElementProps {
  isOpen: boolean;
  close(): void;
}

export interface OverlayControlRef {
  close(): void;
}

export type CreateOverlayElement = (props: OverlayElementProps) => JSX.Element;

interface Props {
  overlayElement: CreateOverlayElement;
}

function Overlay({ overlayElement: OverlayElement }: Props, ref: React.ForwardedRef<OverlayControlRef>) {
  const [isOpen, setIsOpen] = useState(true);

  const close = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(ref, () => ({ close }), [close]);

  return (
    <OverlayElement
      isOpen={isOpen}
      close={close}
    />
  );
}

export default forwardRef(Overlay);
