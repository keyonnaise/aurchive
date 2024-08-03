import React from 'react';
import { Theme, css } from '@emotion/react';

type Shape = 'round' | 'square';
type Variant = 'solid' | 'ghost' | 'outline';
type ColorScheme = 'netural' | 'dark' | 'light' | 'info';

export interface Options {
  shape?: Shape;
  variant?: Variant;
  colorScheme?: ColorScheme;
  isBold?: boolean;
}

interface Props {
  children: React.ReactNode;
}

function Mark({
  shape = 'square',
  variant = 'ghost',
  colorScheme = 'info',
  isBold = false,
  children,
}: Props & Options) {
  return <mark css={styledContainer({ shape, variant, colorScheme, isBold })}>{children}</mark>;
}

// Styles
const styledContainer =
  ({
    shape,
    variant,
    colorScheme,
    isBold,
  }: {
    shape: Shape;
    variant: Variant;
    colorScheme: ColorScheme;
    isBold: boolean;
  }) =>
  (theme: Theme) => [
    css`
      margin: 0 0.1em;
      background: transparent;
      font-weight: ${isBold && 'bolder'};
    `,

    // Shape
    shape === 'square' &&
      css`
        padding: 0.2em;
        border-radius: 0.25em;
      `,
    shape === 'round' &&
      css`
        padding: 0.2em 0.4em;
        border-radius: 9999px;
      `,

    // Variant
    variant === 'solid' &&
      css`
        color: ${theme[colorScheme].contrast};
        background-color: ${theme[colorScheme].main};
      `,
    variant === 'ghost' &&
      css`
        color: ${theme[colorScheme].accent};
        background-color: ${theme[colorScheme].alpha(0.1)};
      `,
    variant === 'outline' &&
      css`
        color: ${theme[colorScheme].accent};
        border: 0.1em solid currentColor;
      `,
  ];

export default Mark;
