import { forwardRef } from 'react';
import { Theme, css } from '@emotion/react';
import media, { breakpoints } from '~styles/media';

type Overflow = 'visible' | 'hidden';
type Align = 'left' | 'center' | 'right';

interface Props {
  id?: string;
  overflow?: Overflow;
  color?: string;
  background?: string;
  align?: Align;
  children: React.ReactNode;
}

function Section({ id, overflow, color, background, align, children }: Props, ref: ComponentRef<'section'>) {
  return (
    <section
      ref={ref}
      id={id}
      css={styledContainer({ overflow, color, background, align })}
    >
      <div css={styledContent}>{children}</div>
    </section>
  );
}

// Styles
const styledContainer =
  ({
    overflow,
    color,
    background,
    align,
  }: {
    overflow: Overflow | undefined;
    color: string | undefined;
    background: string | undefined;
    align: Align | undefined;
  }) =>
  (theme: Theme) => css`
    overflow: ${overflow};
    padding: 10em 0;
    display: flex;
    color: ${color};
    text-align: ${align};

    &:nth-of-type(odd) {
      background: ${background || theme.background.main};
    }
    &:nth-of-type(even) {
      background: ${background || theme.background.sub};
    }
  `;

const styledContent = css`
  flex-grow: 0;
  flex-basis: auto;

  margin: 0 auto;

  ${(Object.entries(media) as Entries<typeof media>).map(
    ([key, value]) => css`
      ${value} {
        width: min(${breakpoints[key] || 360}px, calc(100% - 48px));
      }
    `,
  )}
`;

export default forwardRef(Section);
