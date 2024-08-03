import { forwardRef, useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import useCombinedRefs from '~hooks/useCombinedRefs';
import useEffectOnce from '~hooks/useEffectOnce';

function Textarea({ rows = 5, onKeyUp, ...rest }: ComponentProps<'textarea'>, ref: ComponentRef<'textarea'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffectOnce(() => {
    const textarea = textareaRef.current!;

    textarea.rows = 1;
    textarea.style.height = `1lh`;
  });

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current!;

      textarea.style.height = '1lh';
      textarea.style.height = `${textarea.scrollHeight}px`;

      onKeyUp?.(e);
    },
    [onKeyUp],
  );

  return (
    <textarea
      {...rest}
      ref={useCombinedRefs(textareaRef, ref)}
      css={styledTextarea({ rows })}
      onKeyUp={handleKeyUp}
    />
  );
}

// Styles
const styledTextarea = ({ rows }: { rows: number }) => css`
  padding: 0px;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  font: inherit;
  resize: none;

  height: auto;
  max-height: ${rows}lh;

  &::placeholder {
    color: currentColor;
    opacity: 0.6;
  }
`;

export default forwardRef(Textarea);
