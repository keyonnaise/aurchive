import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { OverlayElementProps } from '~components/overlay/Overlay';
import { fadeIn, fadeOut, slideIn, slideOut } from '~styles/keyframes';

type Placement = 'top' | 'right' | 'bottom' | 'left';

interface Props extends OverlayElementProps {
  placement?: Placement;
  children: React.ReactNode;
}

function Drawer({ placement = 'right', isOpen, children, close }: Props) {
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      if (e.currentTarget !== e.target) return;
      close();
    },
    [close],
  );

  return (
    <DialogPrimitives.Root open={isOpen}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay css={styledOverlay({ isOpen })} onClick={handleClose}>
          <DialogPrimitives.Content css={styledContent({ placement, isOpen })}>{children}</DialogPrimitives.Content>
        </DialogPrimitives.Overlay>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

// Styles
const styledOverlay =
  ({ isOpen }: { isOpen: boolean }) =>
  (theme: Theme) => css`
    z-index: ${theme.elevation.drawer};
    position: fixed;
    inset: 0;
    background-color: ${theme.dim.basic};
    backdrop-filter: blur(4px);

    animation-name: ${isOpen ? fadeIn : fadeOut};
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-fill-mode: both;
  `;

const styledContent =
  ({ placement, isOpen }: { placement: Placement; isOpen: boolean }) =>
  (theme: Theme) => [
    css`
      width: min(360px, calc(100% - 24px));
      height: 100%;
      color: ${theme.text.main};
      background-color: ${theme.background.elevated};
      outline: none;

      animation-name: ${isOpen ? slideIn(placement) : slideOut(placement)};
      animation-duration: 200ms;
      animation-timing-function: ease;
      animation-fill-mode: both;
    `,

    // Others
    placement === 'top' &&
      css`
        margin-bottom: auto;
      `,
    placement === 'right' &&
      css`
        margin-left: auto;
      `,
    placement === 'bottom' &&
      css`
        margin-top: auto;
      `,
    placement === 'left' &&
      css`
        margin-right: auto;
      `,
  ];

export default Drawer;
