import { css } from '@emotion/react';

const SPACIES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24] as const;

type Space = (typeof SPACIES)[number] | string;

interface Props {
  x?: Space;
  y?: Space;
}

function Spacer({ x = 1, y = 1 }: Props) {
  return (
    <span
      role="separator"
      css={styledSpacer({ x, y })}
    />
  );
}

// Styles
const styledSpacer = ({ x, y }: { x: Space; y: Space }) => css`
  display: block;
  width: ${typeof x === 'number' ? `${x}em` : x};
  height: ${typeof y === 'number' ? `${y}em` : y};
`;

export default Spacer;
