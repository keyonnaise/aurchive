import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Theme, css } from '@emotion/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import Icon from '~components/atom/Icon';
import Input from '~components/atom/Input';
import useCombinedRefs from '~hooks/useCombinedRefs';
import useUpdateEffect from '~hooks/useUpdateEffect';
import InputBase, { ColorScheme, Variant } from './InputBase';

interface Props {
  id?: string;
  name?: string;
  variant?: Variant;
  colorScheme?: ColorScheme;
  width?: string;
  label?: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  onChange?: React.ChangeEventHandler;
  children?: React.ReactNode;
}

function Select(
  {
    id,
    name,
    variant,
    colorScheme,
    width,
    label,
    message,
    placeholder = '-- Choose an option --',
    defaultValue: _defaultValue,
    value: _value,
    isRequired = false,
    isDisabled = false,
    isError = false,
    onFocus,
    onBlur,
    onChange,
    children,
  }: Props,
  ref: ComponentRef<'input'>,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    const input = inputRef.current!;
    const initialValue = input.value || _value || input.defaultValue || _defaultValue;

    setValue(initialValue);
  }, [_value, _defaultValue]);

  useUpdateEffect(() => {
    if (isOpen) return;

    const { prototype } = window.HTMLInputElement;
    const origin = Object.getOwnPropertyDescriptor(prototype, 'value')!;

    const input = inputRef.current!;
    const event = new Event('change', { bubbles: true });

    origin.set?.call(input, value || '');

    if (initialized.current) {
      input.dispatchEvent(event);
      input.focus();
    }

    return () => {
      initialized.current = true;
    };
  }, [value, isOpen]);

  const handlers = useMemo(
    () => ({
      onFocus(e: React.FocusEvent) {
        setIsFocused(true);
        onFocus?.(e);
      },

      onBlur(e: React.FocusEvent) {
        if (isOpen) return;

        setIsFocused(false);
        onBlur?.(e);
      },

      onKeyPress(e: React.KeyboardEvent) {
        if (['Enter', 'NumpadEnter'].includes(e.code)) e.preventDefault();
      },

      onChange(e: React.ChangeEvent) {
        onChange?.(e);
      },
    }),
    [isOpen, onFocus, onBlur, onChange],
  );

  return (
    <SelectPrimitive.Root
      value={value}
      open={isOpen}
      disabled={isDisabled}
      onValueChange={setValue}
      onOpenChange={setIsOpen}
    >
      <SelectPrimitive.Trigger asChild>
        <InputBase
          variant={variant}
          colorScheme={colorScheme}
          width={width}
          label={label}
          message={message}
          addonAfter={{
            type: 'ICON',
            icon: 'arrows/arrow-down-s-line',
          }}
          isFocused={isOpen || isFocused}
          isRequired={isRequired}
          isDisabled={isDisabled}
          isError={isError}
        >
          <div css={styledValue({ hasValue: value !== undefined })}>
            <SelectPrimitive.Value placeholder={placeholder} />
          </div>
          <Input
            {...handlers}
            ref={useCombinedRefs(inputRef, ref)}
            id={id}
            name={name}
            css={styledInput}
            readOnly
            disabled={isDisabled}
          />
        </InputBase>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content css={styledContent} position="popper" sideOffset={4} alignOffset={-4}>
          <SelectPrimitive.ScrollUpButton css={styledContent.side}>
            <Icon icon="arrows/arrow-up-s-line" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton css={styledContent.side}>
            <Icon icon="arrows/arrow-down-s-line" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

// Subcomponents
const Group = ({ children }: { children: React.ReactNode }) => {
  return <SelectPrimitive.Group>{children}</SelectPrimitive.Group>;
};

const Option = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return (
    <SelectPrimitive.Item css={styledOption} value={value}>
      <SelectPrimitive.ItemText asChild>
        <div css={styledOption.text}>{children}</div>
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator asChild>
        <div css={styledOption.indicator}>
          <Icon icon="system/check" size="16px" />
        </div>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

// Styles
const styledInput = css`
  z-index: 1;
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
    cursor: none;
  }
`;

const styledValue =
  ({ hasValue }: { hasValue: boolean }) =>
  (theme: Theme) => css`
    overflow: hidden;
    width: 100%;
    height: 1lh;
    opacity: ${!hasValue && 0.6};
    font-size: 14px;
    font-weight: ${theme.weights.bold};
  `;

const styledContent = Object.assign(
  (theme: Theme) => css`
    overflow: hidden;
    width: var(--radix-popper-anchor-width);
    min-width: 160px;
    max-height: 240px;
    padding: 4px;
    color: ${theme.text.main};
    background-color: ${theme.background.elevated};
    border: 1px solid ${theme.border};
    border-radius: ${theme.radii.xs};
    box-shadow: ${theme.shadows.xs};
  `,
  {
    side: (theme: Theme) => css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      color: ${theme.text.third};
      cursor: default;
    `,
  },
);

const styledOption = Object.assign(
  (theme: Theme) => css`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    padding-left: 8px;
    color: ${theme.netural.main};
    border-radius: ${theme.radii.xs};
    outline: none;
    font-size: 12px;
    font-weight: 600;
    text-align: left;

    &:hover,
    &[data-highlighted] {
      background: ${theme.netural.alpha(0.1)};
    }

    &[data-disabled] {
      color: ${theme.netural.disabled};
      background-color: ${theme.netural.disabled};
    }
  `,
  {
    text: css`
      // Ellipsis
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,

    indicator: css`
      flex-grow: 0;
      flex-basis: auto;
      padding: 0 8px;
    `,
  },
);

export default Object.assign(forwardRef(Select), {
  Group,
  Option,
});
