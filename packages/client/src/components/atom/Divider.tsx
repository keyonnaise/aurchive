import { css, Theme } from '@emotion/react';
import _ from 'lodash';

const SPACIES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20] as const;

type Space = (typeof SPACIES)[number] | string;

type Orientation = 'horizontal' | 'vertical';
type Color = 'netural' | 'dark' | 'light';

interface Props {
  orientation?: Orientation;
  size?: string;
  space?: Space;
  color?: Color;
  children?: React.ReactNode;
}

function Divider({ orientation = 'horizontal', size = '100%', space = 0, color = 'netural', children }: Props) {
  return (
    <div role="separator" css={styledContainer({ orientation, size, space, color })}>
      {!_.isNil(children) && (
        <div css={styledContent}>
          <span css={styledLabel}>{children}</span>
        </div>
      )}
    </div>
  );
}

// Styles
const styledContainer =
  ({ orientation, size, space, color }: { orientation: Orientation; size: string; space: Space; color: Color }) =>
  (theme: Theme) => [
    css`
      display: flex;
      align-items: center;
      align-self: stretch;

      &::before,
      &::after {
        content: '';
        flex-grow: 1;
        flex-basis: 0;
        width: 100%;
        height: 100%;
        background-color: ${theme.border[color]};
      }
    `,

    // Orientation
    orientation === 'horizontal' &&
      css`
        flex-direction: row;
        width: ${size};
        height: 1px;
        margin-block: ${typeof space === 'number' ? `${space * 16}px` : space};
        margin-inline: auto;

        &::before,
        &::after {
          min-width: 0;
        }
      `,
    orientation === 'vertical' &&
      css`
        flex-direction: column;
        width: 1px;
        height: ${size};
        margin-block: auto;
        margin-inline: ${typeof space === 'number' ? `${space * 16}px` : space};

        &::before,
        &::after {
          min-height: 0;
        }
      `,
  ];

const styledContent = css`
  flex-grow: 0;
  flex-basis: auto;
  margin-inline: 8px;
`;

const styledLabel = (theme: Theme) => css`
  color: ${theme.text.main};
  font-size: 16px;
`;

export default Divider;
