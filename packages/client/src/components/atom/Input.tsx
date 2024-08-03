import { forwardRef } from 'react';
import { css } from '@emotion/react';

function Input(props: ComponentProps<'input'>, ref: ComponentRef<'input'>) {
  return (
    <input
      {...props}
      ref={ref}
      onInvalid={(e) => e.preventDefault()}
      css={styledReset}
    />
  );
}

// Styles
export const styledReset = css`
  padding: 0px;
  margin: 0px;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  font: inherit;

  &::placeholder {
    color: currentColor;
    opacity: 0.6;
  }
`;

export default forwardRef(Input);
