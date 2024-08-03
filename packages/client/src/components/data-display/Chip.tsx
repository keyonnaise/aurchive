import { forwardRef } from 'react';
import { Theme, css } from '@emotion/react';
import { To } from 'react-router-dom';
import { P, match } from 'ts-pattern';
import Icon, { IconType } from '~components/atom/Icon';
import Button from '~components/buttons/Button';

interface BlockProps {
  as?: 'block';
  id?: string;
  className?: string;
  to?: undefined;
  onClick?: undefined;
  children: React.ReactNode;
}

interface AnchorProps {
  as: 'anchor';
  id?: string;
  className?: string;
  to: To;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}

interface ButtonProps {
  as: 'button';
  id?: string;
  className?: string;
  to?: undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

type PolymorphicProps<P = object> = (AnchorProps | ButtonProps | BlockProps) & P;

type Variant = 'solid' | 'outline';
type ColorScheme = 'netural' | 'dark' | 'light' | 'primary' | 'danger' | 'info';

interface Props {
  variant?: Variant;
  colorScheme?: ColorScheme;
  leftIcon?: IconType;
  rightIcon?: IconType;
  isDisabled?: boolean;
}

function Chip<E extends React.ElementType>(
  {
    id,
    variant = 'solid',
    colorScheme = 'netural',
    leftIcon,
    rightIcon,
    isDisabled = false,
    children,
    ...rest
  }: PolymorphicProps<Props>,
  ref: ComponentRef<E>,
) {
  return (
    <Container {...rest} ref={ref} id={id} css={styledContainer({ variant, colorScheme, isDisabled })}>
      {leftIcon !== undefined && (
        <div css={styledContainer.side}>
          <Icon icon={leftIcon} size="13.5px" />
        </div>
      )}
      <div css={styledContainer.center}>
        <span css={styledLabel}>{children}</span>
      </div>
      {rightIcon !== undefined && (
        <div css={styledContainer.side}>
          <Icon icon={rightIcon} size="13.5px" />
        </div>
      )}
    </Container>
  );
}

// Subcomponents
const Container = forwardRef(function Container<E extends React.ElementType>(
  props: PolymorphicProps,
  ref: ComponentRef<E>,
) {
  return match(props)
    .with({ as: P.union('anchor', 'button') }, (props) => <Button {...props} ref={ref} variant="none" />)
    .with({ as: P.optional('block') }, (props) => <div {...props} ref={ref} />)
    .exhaustive();
});

// Styles
const styledContainer = Object.assign(
  ({ variant, colorScheme, isDisabled }: { variant: Variant; colorScheme: ColorScheme; isDisabled: boolean }) =>
    (theme: Theme) => [
      css`
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: max-content;
        height: 24px;
        padding: 0 8px;
        border-radius: ${theme.radii.full};
        line-height: 1;
        vertical-align: middle;
        transition-property: color, background-color, border-color;
        transition-duration: 200ms;
        transition-timing-function: ease;

        &div {
          pointer-events: none;
        }
      `,

      // Variant
      variant === 'solid' && [
        css`
          color: ${theme[colorScheme].contrast};
          background-color: ${theme[colorScheme].main};

          button&:hover,
          a&:hover {
            color: ${theme[colorScheme].main};
            background-color: ${theme[colorScheme].hover};
          }
          button&:active,
          a&:active {
            color: ${theme[colorScheme].main};
            background-color: ${theme[colorScheme].active};
          }
          button&:focus-visible,
          a&:focus-visible {
            color: ${theme[colorScheme].main};
            background-color: ${theme[colorScheme].focus};
          }
        `,

        // Status
        isDisabled &&
          css`
            color: ${theme[colorScheme].disabled};
            background-color: ${theme[colorScheme].disabled};
          `,
      ],
      variant === 'outline' && [
        css`
          color: ${theme[colorScheme].main};
          border: 1px solid currentColor;

          button&:hover,
          a&:hover {
            background-color: ${theme[colorScheme].hover};
          }
          button&:active,
          a&:active {
            background-color: ${theme[colorScheme].active};
          }
          button&:focus-visible,
          a&:focus-visible {
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
    ],
  {
    side: css`
      flex-grow: 0;
      flex-basis: auto;
    `,

    center: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledLabel = (theme: Theme) => css`
  display: block;
  font-size: 12px;
  font-weight: ${theme.weights.bold};
`;

export default forwardRef(Chip);
