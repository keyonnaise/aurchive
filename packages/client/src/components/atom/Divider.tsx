import { Theme, css } from '@emotion/react';

const SPACIES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24] as const;

type Orientation = 'horizontal' | 'vertical';
type Space = (typeof SPACIES)[number] | string;

interface Props {
  orientation?: Orientation;
  color?: string;
  size?: string;
  offset?: Space;
  thickness?: string;
  children?: React.ReactNode;
}

function Divider({ orientation = 'horizontal', color, size = '100%', offset = 0, thickness = '1px', children }: Props) {
  return (
    <div
      role="separator"
      css={styledContainer({ orientation, color, size, offset, thickness })}
    >
      {children !== undefined && <div>{children}</div>}
    </div>
  );
}

// Styles
const styledContainer =
  ({
    orientation,
    color,
    size,
    offset,
    thickness,
  }: {
    orientation: Orientation;
    color: string | undefined;
    size: string;
    offset: Space;
    thickness: string;
  }) =>
  (theme: Theme) => [
    css`
      display: flex;
      align-items: center;
      color: ${theme.text.main};
      text-align: center;

      &::before,
      &::after {
        content: '';
        flex-grow: 1;
        flex-basis: 0;
      }

      > div {
        flex-grow: 0;
        flex-basis: auto;
        font-size: 12px;
        font-weight: 600;
      }
    `,

    // Orientation
    orientation === 'horizontal' &&
      css`
        flex-direction: row;
        width: ${size};
        margin: ${typeof offset === 'number' ? `${offset}em` : offset} auto;

        &::before,
        &::after {
          border-top: ${thickness} solid ${theme.border};
        }

        > div {
          padding: 0 16px;
        }
      `,
    orientation === 'vertical' &&
      css`
        flex-direction: column;
        height: ${size};
        margin: auto ${typeof offset === 'number' ? `${offset}em` : offset};

        &::before,
        &::after {
          min-height: 0;
          border-left: ${thickness} solid ${theme.border};
        }

        > div {
          padding: 16px 0;
        }
      `,

    // Color
    color !== undefined &&
      css`
        color: ${color};

        &::before,
        &::after {
          border-color: currentColor;
        }
      `,
  ];

export default Divider;
