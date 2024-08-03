import { forwardRef } from 'react';
import { css } from '@emotion/react';
import { Link, LinkProps } from 'react-router-dom';

type Underline = 'none' | 'always' | 'hover';

interface Props {
  underline?: Underline;
  isDisabled?: boolean;
}

function Anchor({ underline = 'none', isDisabled = false, ...rest }: Props & LinkProps, ref: ComponentRef<'a'>) {
  return <Link {...rest} ref={ref} css={styledAnchor({ underline, isDisabled })} aria-disabled={isDisabled} />;
}

// Styles
const styledAnchor = ({ underline, isDisabled }: { underline: Underline; isDisabled: boolean }) => [
  css`
    color: inherit;
    outline: none;
    font: inherit;
    cursor: pointer;

    &:focus-visible {
      outline: auto;
    }
  `,

  // Status
  isDisabled &&
    css`
      pointer-events: none;
      cursor: none;
    `,

  // Others
  underline === 'none' &&
    css`
      text-decoration: none;
    `,
  underline === 'always' &&
    css`
      text-decoration: underline;
      text-underline-offset: 0.2em;
    `,
  underline === 'hover' &&
    css`
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 0.2em;
      }
    `,
];

export default forwardRef(Anchor);
