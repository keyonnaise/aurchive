import '@emotion/react';

declare module '@emotion/react' {
  export interface ColorTokens {
    main: string;
    accent: string;
    contrast: string;

    hover: string;
    active: string;
    focus: string;
    disabled: string;
  }

  export interface Theme {
    // 1. Primary
    primary: ColorTokens;

    // 2. Brand

    // 3. Mono
    netural: ColorTokens;
    dark: ColorTokens;
    light: ColorTokens;

    // 4. Severity
    info: ColorTokens;
    danger: ColorTokens;
    success: ColorTokens;
    warning: ColorTokens;

    // 5. Sementic
    text: {
      main: string;
      sub: string;
      third: string;
    };
    background: {
      main: string;
      sub: string;
      elevated: string;
    };
    border: {
      netural: string;
      dark: string;
      light: string;
    };
    scrollbar: {
      track: string;
      thumb: string;
    };

    // 6. Others
    elevation: {
      fab: number; // Floating Action Button - by MUI
      appBar: number;
      drawer: number;
      modal: number;
      snackbar: number;
      tooltip: number;
    };

    dim: {
      thin: string;
      basic: string;
      thick: string;
    };

    radii: {
      none: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };

    shadows: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };

    weights: {
      light: number;
      normal: number;
      bold: number;
      extrabold: number;
    };
  }
}
