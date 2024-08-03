import { Theme, css } from '@emotion/react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { fadeIn, fadeOut, slideIn, slideOut } from '~styles/keyframes';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  size?: Size;
  isOpen: boolean;
  children: React.ReactNode;
}

function Modal({ size = 'md', isOpen, children }: Props) {
  return (
    <DialogPrimitives.Root open={isOpen}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay css={styledOverlay({ isOpen })}>
          <DialogPrimitives.Content css={styledContent({ size, isOpen })}>{children}</DialogPrimitives.Content>
        </DialogPrimitives.Overlay>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

// Styles
const styledOverlay =
  ({ isOpen }: { isOpen: boolean }) =>
  (theme: Theme) => css`
    z-index: ${theme.elevation.modal};
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    background-color: ${theme.dim.basic};
    backdrop-filter: blur(4px);

    animation-name: ${isOpen ? fadeIn : fadeOut};
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-fill-mode: both;
  `;

const styledContent =
  ({ size, isOpen }: { size: Size; isOpen: boolean }) =>
  (theme: Theme) => [
    css`
      display: flex;
      max-width: calc(100% - 24px);
      max-height: calc(100% - 24px);
      margin: 0 auto;
      color: ${theme.text.main};
      background: ${theme.background.elevated};
      border-radius: ${theme.radii.md};

      animation-name: ${isOpen ? slideIn('bottom') : slideOut('bottom')};
      animation-duration: 200ms;
      animation-timing-function: ease;
      animation-fill-mode: both;
    `,

    // Size
    size === 'sm' &&
      css`
        width: 320px;
      `,
    size === 'md' &&
      css`
        width: 720px;
      `,
    size === 'lg' &&
      css`
        width: 992px;
      `,
  ];

export default Modal;
