import { forwardRef } from 'react';
import { Theme, css } from '@emotion/react';
import { P, match } from 'ts-pattern';
import contains from '~lib/contains';
import isNil from '~lib/isNil';
import media from '~styles/media';
import palette from '~styles/palette';

const SEVERITY_KEYS = ['info', 'success', 'warning', 'danger'] as const;
const PRIORITY_KEYS = ['main', 'sub', 'third'] as const;

const VARIANT_TO_TAG_MAP = {
  h1: 'h2',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  body3: 'p',
} as const;

type Severity = (typeof SEVERITY_KEYS)[number];
type Priority = (typeof PRIORITY_KEYS)[number];

type As = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
type Variant = keyof typeof VARIANT_TO_TAG_MAP;
type Color = ((p: typeof palette) => string) | Severity | Priority;
type Weight = keyof Theme['weights'];
type Align = 'left' | 'center' | 'right';

interface StyledProps {
  as?: As;
  variant: Variant;
  className?: undefined;
  color?: Color;
  weight?: Weight;
  align?: Align;
  children: React.ReactNode;
}

interface UnstyledProps {
  as: As;
  variant?: 'none';
  className?: string;
  color?: undefined;
  weight?: undefined;
  align?: undefined;
  children: React.ReactNode;
}

type Props = StyledProps | UnstyledProps;

function Typography<E extends React.ElementType>(props: Props, ref: ComponentRef<E>) {
  if (isNil(props.children)) return null;

  return match(props)
    .with(
      { variant: P.union('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'body3') },
      ({ as, variant, color, weight, align, children }) => {
        const Tag = as || VARIANT_TO_TAG_MAP[variant];

        return (
          <Tag ref={ref} css={styledTypography({ variant, color, weight, align })} data-is-typography>
            {children}
          </Tag>
        );
      },
    )
    .with({ variant: P.optional('none') }, ({ as, className, children }) => {
      const Tag = as;

      return (
        <Tag ref={ref} className={className}>
          {children}
        </Tag>
      );
    })
    .exhaustive();
}

// Styles
const styledTypography = ({
  variant,
  color,
  weight,
  align,
}: {
  variant: Variant;
  color: Color | undefined;
  weight: Weight | undefined;
  align: Align | undefined;
}) => [
  getTextColor(color),

  (theme: Theme) => css`
    font-weight: ${weight !== undefined && theme.weights[weight]};
    text-align: ${align !== undefined && align};

    & + [data-is-typography='true'] {
      margin-top: 1lh;
    }
  `,

  // Variant
  contains(['h1', 'h2', 'h3'] as const, variant) &&
    css`
      line-height: 1.4;
    `,
  contains(['h4', 'h5', 'h6'] as const, variant) &&
    css`
      line-height: 1.6;
    `,
  contains(['body1', 'body2', 'body3'] as const, variant) &&
    css`
      line-height: 1.8;
    `,
  variant === 'h1' &&
    css`
      ${media.xs} {
        font-size: 40px;
      }

      ${media.md} {
        font-size: 48px;
      }

      ${media.lg} {
        font-size: 56px;
      }
    `,
  variant === 'h2' &&
    css`
      ${media.xs} {
        font-size: 32px;
      }

      ${media.md} {
        font-size: 40px;
      }

      ${media.lg} {
        font-size: 48px;
      }
    `,
  variant === 'h3' &&
    css`
      ${media.xs} {
        font-size: 28px;
      }

      ${media.md} {
        font-size: 32px;
      }

      ${media.lg} {
        font-size: 36px;
      }
    `,
  variant === 'h4' &&
    css`
      ${media.xs} {
        font-size: 24px;
      }

      ${media.md} {
        font-size: 28px;
      }

      ${media.lg} {
        font-size: 32px;
      }
    `,
  variant === 'h5' &&
    css`
      ${media.xs} {
        font-size: 22px;
      }

      ${media.md} {
        font-size: 24px;
      }

      ${media.lg} {
        font-size: 26px;
      }
    `,
  variant === 'h6' &&
    css`
      ${media.xs} {
        font-size: 20px;
      }

      ${media.md} {
        font-size: 22px;
      }

      ${media.lg} {
        font-size: 24px;
      }
    `,

  variant === 'body1' &&
    css`
      ${media.xs} {
        font-size: 16px;
      }

      ${media.md} {
        font-size: 18px;
      }
    `,
  variant === 'body2' &&
    css`
      ${media.xs} {
        font-size: 14px;
      }

      ${media.md} {
        font-size: 16px;
      }
    `,
  variant === 'body3' &&
    css`
      ${media.xs} {
        font-size: 12px;
      }

      ${media.md} {
        font-size: 14px;
      }
    `,
];

const getTextColor = (color: Color | undefined) => (theme: Theme) => {
  if (typeof color === 'function') {
    return css`
      color: ${color(palette)};
    `;
  }

  if (contains(SEVERITY_KEYS, color)) {
    return css`
      color: ${theme[color].main};
    `;
  }

  if (contains(PRIORITY_KEYS, color)) {
    return css`
      color: ${theme.text[color]};
    `;
  }

  return;
};

// const getBottomMargin = (mb: Space | undefined) => {
//   if (mb !== undefined) {
//     return css`
//       margin-bottom: ${typeof mb === 'number' ? `${mb}lh` : mb};
//     `;
//   }

//   return css`
//     &:has(+ *[data-is-typography='true']) {
//       margin-bottom: 1lh;
//     }
//   `;
// };

export default forwardRef(Typography);
