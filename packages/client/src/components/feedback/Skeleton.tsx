import { Theme, css, keyframes } from '@emotion/react';

type Shape = 'none' | 'square' | 'round';

interface Props {
  shape?: Shape;
  flex?: number;
  width?: number | string;
  height?: number | string;
  color?: string;
}

function Skeleton({ shape = 'square', flex, width, height, color }: Props) {
  return <span css={styledContainer({ shape, flex, width, height, color })} />;
}

// Styles
const styledContainer =
  ({
    shape,
    flex,
    width,
    height,
    color,
  }: {
    shape: Shape;
    flex: number | undefined;
    width: number | string | undefined;
    height: number | string | undefined;
    color: string | undefined;
  }) =>
  (theme: Theme) => [
    css`
      display: inline-block;
      flex-grow: ${flex};
      flex-basis: auto;
      width: ${typeof width === 'number' ? `${width}px` : typeof width === 'string' ? width : 'auto'};
      padding-top: ${typeof height === 'number' ? `${height}px` : typeof height === 'string' ? height : '1em'};
      background-color: ${color || theme.netural.main};
      border-radius: ${shape === 'round' ? `${theme.radii.full}` : shape === 'square' ? '0.25em' : 0};
      opacity: 0.2;
      vertical-align: middle;
      animation: ${shining} 1s infinite;
    `,

    typeof width === 'number' && typeof height === 'number' && css``,
  ];

const shining = keyframes({
  '50%': {
    opacity: 0.1,
  },
});

export default Skeleton;
