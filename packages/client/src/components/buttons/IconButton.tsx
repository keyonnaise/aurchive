import { forwardRef } from 'react';
import { Theme, css } from '@emotion/react';
import Icon, { IconType } from '~components/atom/Icon';
import { PolymorphicProps, UnstyledButton, styledButtonBase } from './Button';

type Shape = 'round' | 'square';
type Variant = 'solid' | 'ghost' | 'outline' | 'text';
type ColorScheme = 'netural' | 'dark' | 'light' | 'info' | 'danger' | 'warning';
type Size = 'sm' | 'md' | 'lg';

type Props = PolymorphicProps<{
  icon: IconType;
  shape?: Shape;
  variant?: Variant;
  colorScheme?: ColorScheme;
  size?: Size;
  inline?: boolean;
  isLoading?: boolean;
}>;

function IconButton<E extends React.ElementType>(
  {
    icon,
    shape = 'square',
    variant,
    colorScheme,
    className: _className,
    size = 'md',
    inline = false,
    isLoading = false,
    isDisabled: _isDisabled = false,
    ...rest
  }: Props,
  ref: ComponentRef<E>,
) {
  const isDisabled = isLoading || _isDisabled;

  return (
    <UnstyledButton
      {...rest}
      ref={ref}
      css={[styledButtonBase({ variant, colorScheme, isDisabled }), styledContainer({ shape, size, inline })]}
      isDisabled={isDisabled}
    >
      {isLoading ? <Icon icon="system/loader" size="1.5em" /> : <Icon icon={icon} size="1.5em" />}
    </UnstyledButton>
  );
}

// Styles
const styledContainer =
  ({ shape, size, inline }: { shape: Shape; size: Size; inline: boolean }) =>
  (theme: Theme) => [
    css`
      display: ${inline ? 'inline-flex' : 'flex'};
      justify-content: center;
      align-items: center;
      border-radius: ${shape === 'round' ? theme.radii.full : theme.radii.xs};
    `,

    // Size
    size === 'sm' &&
      css`
        width: 32px;
        height: 32px;
        font-size: 12px;
      `,
    size === 'md' &&
      css`
        width: 40px;
        height: 40px;
        font-size: 14px;
      `,
    size === 'lg' &&
      css`
        width: 48px;
        height: 48px;
        font-size: 16px;
      `,
  ];

export default forwardRef(IconButton);
