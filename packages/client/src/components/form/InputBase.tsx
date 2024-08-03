import React, { forwardRef } from 'react';
import { Theme, css } from '@emotion/react';
import { match } from 'ts-pattern';
import Icon, { IconType } from '~components/atom/Icon';
import Button from '~components/buttons/Button';
import ellipsis from '~styles/ellipsis';

export type Variant = 'outline' | 'text';
export type ColorScheme = 'netural' | 'dark' | 'light';

export type AddonType = {
  type: 'ICON';
  icon: IconType;
  onClick?(): void;
};

interface Props {
  variant?: Variant;
  colorScheme?: ColorScheme;
  width?: string;
  label?: string;
  message?: string;
  addonBefore?: AddonType;
  addonAfter?: AddonType;
  isRequired?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isError?: boolean;
  children: React.ReactNode;
}

function InputBase(
  {
    variant = 'outline',
    colorScheme = 'netural',
    width = '100%',
    label,
    message,
    addonBefore,
    addonAfter,
    isRequired = false,
    isDisabled = false,
    isFocused = false,
    isError = false,
    children,
    ...rest
  }: Props & ComponentProps<'div'>,
  ref: ComponentRef<'div'>,
) {
  return (
    <div css={styledContainer({ width })}>
      <div {...rest} ref={ref} css={styledInner({ variant, colorScheme, isDisabled, isFocused, isError })}>
        {label !== undefined && <div css={styledHeader({ isRequired })}>{label}</div>}
        <div css={styledContent}>
          {addonBefore !== undefined && (
            <div css={styledContent.side}>
              <Addon {...addonBefore} />
            </div>
          )}
          <div css={styledContent.center}>{children}</div>
          {addonAfter !== undefined && (
            <div css={styledContent.side}>
              <Addon {...addonAfter} />
            </div>
          )}
        </div>
      </div>
      {message !== undefined && (
        <div css={styledMessage({ isError })}>
          {isError && (
            <div css={styledMessage.left}>
              <Icon icon="system/error-warning-line" />
            </div>
          )}
          <div css={styledMessage.right}>{message}</div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
const Addon = (props: AddonType) => {
  return match(props)
    .with({ type: 'ICON' }, ({ icon, onClick }) => {
      const Container = onClick !== undefined ? UnstyledButton : 'div';

      return (
        <Container css={styledAddon({ type: 'ICON' })} onClick={onClick}>
          <Icon icon={icon} />
        </Container>
      );
    })
    .exhaustive();
};

const UnstyledButton = (props: ComponentProps<'button'>) => {
  return <Button {...props} as="button" type="button" variant="none" />;
};

// Styles
const styledContainer = ({ width }: { width: string }) => css`
  width: ${width};
  text-align: left;
`;

const styledInner =
  ({
    variant,
    colorScheme,
    isDisabled,
    isFocused,
    isError,
  }: {
    variant: Variant;
    colorScheme: ColorScheme;
    isDisabled: boolean;
    isFocused: boolean;
    isError: boolean;
  }) =>
  (theme: Theme) => [
    css`
      position: relative;
      width: 100%;
      text-align: left;
    `,

    // Variant
    variant === 'outline' &&
      css`
        padding: 8px;
        color: ${theme[colorScheme].main};
        border: 1px solid currentColor;
        border-radius: ${theme.radii.xs};
      `,
    variant === 'text' &&
      css`
        padding: 4px 0;
        color: ${theme[colorScheme].main};
        border-bottom: 1px solid currentColor;
      `,

    // Actions
    isFocused &&
      css`
        color: ${theme.info.main};
        /* outline: auto;
        outline-offset: 2px; */
      `,

    // Status
    isError &&
      css`
        color: ${theme.danger.main};
      `,
    isDisabled &&
      css`
        color: ${theme[colorScheme].disabled};
      `,
  ];

const styledHeader =
  ({ isRequired }: { isRequired: boolean }) =>
  (theme: Theme) => [
    ellipsis,

    css`
      font-size: 10px;
      font-weight: ${theme.weights.bold};
      line-height: 1.6;

      &::after {
        content: ${isRequired ? "'*'" : 'unset'};
        margin-left: 2px;
        color: ${theme.danger.main};
      }
    `,
  ];

const styledContent = Object.assign(
  css`
    display: flex;
    align-items: center;
    height: 32px;
    gap: 8px;
  `,
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

const styledAddon = ({ type }: { type: 'ICON' }) => [
  type === 'ICON' &&
    css`
      font-size: 20px;
    `,
];

const styledMessage = Object.assign(
  ({ isError }: { isError: boolean }) =>
    (theme: Theme) => [
      css`
        display: flex;
        margin-top: 4px;
      `,

      // Status
      isError &&
        css`
          color: ${isError && theme.danger.main};
        `,
    ],
  {
    left: css`
      flex-grow: 0;
      flex-basis: auto;

      align-self: flex-start;
      margin-right: 4px;
    `,

    right: (theme: Theme) => css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;

      font-size: 10px;
      font-weight: ${theme.weights.bold};
      line-height: 1.6;
    `,
  },
);

export default forwardRef(InputBase);
