import { forwardRef } from 'react';
import { css, Theme } from '@emotion/react';
import { Link } from 'react-router-dom';
import { match, P } from 'ts-pattern';
import Icon, { IconType } from '~components/atom/Icon';

type AsProps<K extends string, E extends React.ElementType> = {
  as: K;
  isDisabled?: boolean;
} & ComponentProps<E>;

type AnchorProps = AsProps<'anchor', typeof Link>;
type ButtonProps = Omit<AsProps<'button', 'button'>, 'disabled'>;

export type PolymorphicProps<P = object> = (AnchorProps | ButtonProps) & P;

type Shape = 'round' | 'square';
type Variant = 'solid' | 'ghost' | 'outline' | 'text';
type ColorScheme = 'netural' | 'dark' | 'light' | 'info' | 'danger' | 'warning';
type Size = 'sm' | 'md' | 'lg';
type Align = 'left' | 'center' | 'right';

interface BasicButtonProps {
  shape?: Shape;
  variant?: Variant;
  colorScheme?: ColorScheme;
  size?: Size;
  align?: Align;
  leftIcon?: IconType;
  rightIcon?: IconType;
  inline?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
}

interface UnstyledButtonProps {
  variant?: 'none';
}

type Props = PolymorphicProps<BasicButtonProps | UnstyledButtonProps>;

function Button<E extends React.ElementType>(props: Props, ref: ComponentRef<E>) {
  return match(props)
    .with({ variant: P.optional(P.union('solid', 'ghost', 'outline', 'text', undefined)) }, (props) => (
      <BasicButton {...props} ref={ref} />
    ))
    .with({ variant: 'none' }, (props) => <UnstyledButton {...props} ref={ref} />)
    .exhaustive();
}

// Subcomponents
const BasicButton = forwardRef(function StyledButton<E extends React.ElementType>(
  {
    shape = 'square',
    variant,
    colorScheme,
    className: _className,
    size = 'md',
    align = 'center',
    leftIcon,
    rightIcon,
    inline = false,
    fullWidth = false,
    isLoading = false,
    isDisabled: _isDisabled = false,
    children,
    ...rest
  }: PolymorphicProps<BasicButtonProps>,
  ref: ComponentRef<E>,
) {
  const hasLeftIcon = leftIcon !== undefined;
  const hasRightIcon = rightIcon !== undefined;

  const isDisabled = isLoading || _isDisabled;

  return (
    <UnstyledButton
      {...rest}
      ref={ref}
      css={[
        styledButtonBase({ variant, colorScheme, isDisabled }),
        styledBasicButton({ shape, size, align, inline, fullWidth, hasLeftIcon, hasRightIcon }),
      ]}
      isDisabled={isDisabled}
    >
      {hasLeftIcon && (
        <div css={styledBasicButton.side}>
          <Icon icon={leftIcon} size="1.5em" />
        </div>
      )}
      <div css={styledBasicButton.center}>{isLoading ? <Icon icon="system/loader" /> : children}</div>
      {hasRightIcon && (
        <div css={styledBasicButton.side}>
          <Icon icon={rightIcon} size="1.5em" />
        </div>
      )}
    </UnstyledButton>
  );
});

export const UnstyledButton = forwardRef(function UnstyledButton<E extends React.ElementType>(
  props: PolymorphicProps,
  ref: ComponentRef<E>,
) {
  return match(props)
    .with({ as: 'anchor' }, ({ as, isDisabled = false, ...rest }) => (
      <Link {...rest} ref={ref} css={styledReset({ isDisabled })} />
    ))
    .with({ as: 'button' }, ({ as, isDisabled = false, ...rest }) => (
      <button {...rest} ref={ref} css={styledReset({ isDisabled })} disabled={isDisabled} />
    ))
    .exhaustive();
});

// Styles
const styledReset = ({ isDisabled }: { isDisabled: boolean }) => [
  css`
    all: unset;
    display: block;
    overflow: hidden;
    box-sizing: inherit;
    color: inherit;
    font: inherit;
    line-height: 1;
    cursor: pointer;

    &:focus-visible {
      outline: auto;
      outline-offset: 2px;
    }
  `,

  // Status
  isDisabled &&
    css`
      cursor: none;
      pointer-events: none;
    `,
];

export const styledButtonBase =
  ({
    variant = 'solid',
    colorScheme = 'netural',
    isDisabled = false,
  }: {
    variant?: Variant;
    colorScheme?: ColorScheme;
    isDisabled?: boolean;
  } = {}) =>
  (theme: Theme) => [
    css`
      transition-property: color, background-color, border-color;
      transition-duration: 200ms;
      transition-timing-function: ease;
    `,

    // Variant
    variant === 'solid' && [
      css`
        color: ${theme[colorScheme].contrast};
        background-color: ${theme[colorScheme].main};

        &:hover {
          color: ${theme[colorScheme].main};
          background-color: ${theme[colorScheme].hover};
        }
        &:active {
          color: ${theme[colorScheme].main};
          background-color: ${theme[colorScheme].active};
        }
        &:focus-visible {
          color: ${theme[colorScheme].main};
          background-color: ${theme[colorScheme].focus};
        }
      `,

      // Status
      isDisabled &&
        css`
          color: ${theme[colorScheme].disabled};
          background-color: currentColor;
        `,
    ],
    variant === 'ghost' && [
      css`
        color: ${theme[colorScheme].main};
        background-color: ${theme[colorScheme].alpha(0.15)};

        &:hover {
          background-color: ${theme[colorScheme].hover};
        }
        &:active {
          background-color: ${theme[colorScheme].active};
        }
        &:focus-visible {
          background-color: ${theme[colorScheme].focus};
        }
      `,

      // Status
      isDisabled &&
        css`
          color: ${theme[colorScheme].disabled};
          background-color: currentColor;
        `,
    ],
    variant === 'outline' && [
      css`
        color: ${theme[colorScheme].main};
        border: 1px solid currentColor;

        &:hover {
          background-color: ${theme[colorScheme].hover};
        }
        &:active {
          background-color: ${theme[colorScheme].active};
        }
        &:focus-visible {
          background-color: ${theme[colorScheme].focus};
        }
      `,

      // Status
      isDisabled &&
        css`
          color: ${theme[colorScheme].disabled};
          border-color: currentColor;
        `,
    ],
    variant === 'text' && [
      css`
        color: ${theme[colorScheme].main};
        background-color: transparent;

        &:hover {
          background-color: ${theme[colorScheme].hover};
        }
        &:active {
          background-color: ${theme[colorScheme].active};
        }
        &:focus-visible {
          background-color: ${theme[colorScheme].focus};
        }
      `,

      // Status
      isDisabled &&
        css`
          color: ${theme[colorScheme].disabled};
        `,
    ],
  ];

const styledBasicButton = Object.assign(
  ({
    shape,
    size,
    align,
    inline,
    fullWidth,
    hasLeftIcon,
    hasRightIcon,
  }: {
    shape: Shape;
    size: Size;
    align: Align;
    inline: boolean;
    fullWidth: boolean;
    hasLeftIcon: boolean;
    hasRightIcon: boolean;
  }) =>
    (theme: Theme) => [
      css`
        display: ${inline ? 'inline-flex' : 'flex'};
        align-items: center;
        width: ${fullWidth ? '100%' : 'auto'};
        padding-left: ${hasLeftIcon ? '0.5em' : '1.5em'};
        padding-right: ${hasRightIcon ? '0.5em' : '1.5em'};
        border-radius: ${shape === 'round' ? theme.radii.full : theme.radii.xs};
        text-align: ${align};
      `,

      // Size
      size === 'sm' &&
        css`
          height: 32px;
          font-size: 12px;
          font-weight: ${theme.weights.bold};
        `,
      size === 'md' &&
        css`
          height: 40px;
          font-size: 14px;
          font-weight: ${theme.weights.bold};
        `,
      size === 'lg' &&
        css`
          height: 48px;
          font-size: 16px;
          font-weight: ${theme.weights.extrabold};
        `,
    ],
  {
    side: css`
      flex-grow: 0;
      flex-basis: auto;

      padding: 0 0.5em;
    `,

    center: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;

      svg {
        margin: 0 auto;
      }
    `,
  },
);

export default forwardRef(Button);
