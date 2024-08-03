import { forwardRef, useMemo, useState } from 'react';
import { css, Theme } from '@emotion/react';
import Input from '~components/atom/Input';
import InputBase, { AddonType, ColorScheme, Variant } from './InputBase';

interface Props {
  id?: string;
  name?: string;
  type?: 'text' | 'number' | 'url' | 'tel' | 'email' | 'password';
  variant?: Variant;
  colorScheme?: ColorScheme;
  width?: string;
  label?: string;
  addonBefore?: AddonType;
  addonAfter?: AddonType;
  message?: string;
  min?: number | string;
  max?: number | string;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabed?: boolean;
  isError?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

function TextField(
  {
    id,
    name,
    type,
    variant,
    colorScheme,
    width,
    label,
    addonBefore,
    addonAfter,
    message,
    min,
    max,
    maxLength,
    placeholder,
    defaultValue,
    value,
    isRequired,
    isReadOnly,
    isDisabed,
    isError,
    onFocus,
    onBlur,
    onChange,
    onKeyDown,
  }: Props,
  ref: ComponentRef<'input'>,
) {
  const [isFocused, setIsFocused] = useState(false);

  const handlers = useMemo(
    () => ({
      onFocus(e: React.FocusEvent<HTMLInputElement>) {
        onFocus?.(e);
        setIsFocused(true);
      },

      onBlur(e: React.FocusEvent<HTMLInputElement>) {
        onBlur?.(e);
        setIsFocused(false);
      },

      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange?.(e);
      },

      onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        onKeyDown?.(e);
      },
    }),
    [onFocus, onBlur, onChange, onKeyDown],
  );

  return (
    <InputBase
      variant={variant}
      colorScheme={colorScheme}
      width={width}
      label={label}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      message={message}
      isFocused={isFocused}
      isRequired={isRequired}
      isDisabled={isDisabed}
      isError={isError}
    >
      <div css={styledContent}>
        <div css={styledContent.left}>
          <Input
            {...handlers}
            ref={ref}
            id={id}
            css={styledInput}
            name={name}
            type={type}
            min={min}
            max={max}
            maxLength={maxLength}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            required={isRequired}
            readOnly={isReadOnly}
            disabled={isDisabed}
          />
        </div>
        {maxLength !== undefined && (
          <div css={styledContent.right}>
            <span css={styledCount}>
              {value?.length} / {maxLength}
            </span>
          </div>
        )}
      </div>
    </InputBase>
  );
}

// Styles
const styledContent = Object.assign(
  css`
    display: flex;
    align-items: end;
  `,
  {
    left: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;

      margin-right: 16px;
    `,

    right: css`
      flex-grow: 0;
      flex-basis: auto;
    `,
  },
);

const styledInput = (theme: Theme) => css`
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: ${theme.weights.bold};

  &::placeholder {
    opacity: 0.6;
  }
`;

const styledCount = (theme: Theme) => css`
  color: ${theme.text.third};
  font-size: 10px;
`;

export default forwardRef(TextField);
