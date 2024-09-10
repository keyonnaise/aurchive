import { Theme } from '@emotion/react';
import { match, P } from 'ts-pattern';
import palette from './palette';

export type Mode = 'dark' | 'light';

const BRIGHTNESS_THRESHOLD = 128;

const common = {
  elevation: {
    fab: 50,
    appBar: 100,
    drawer: 200,
    modal: 300,
    snackbar: 400,
    tooltip: 500,
  },
  dim: {
    thin: setAlphaToHex(palette.black, 0.4),
    basic: setAlphaToHex(palette.black, 0.6),
    thick: setAlphaToHex(palette.black, 0.8),
  },
  radii: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '32px',
    xl: '64px',
    full: '9999px',
  },
  shadows: {
    xs: [
      `0 2px 2px 0 ${setAlphaToHex(palette.black, 0.1)}`,
      `0 4px 8px 2px ${setAlphaToHex(palette.black, 0.05)}`,
    ].join(', '),
    sm: [
      `0 4px 4px -2px ${setAlphaToHex(palette.black, 0.1)}`,
      `0 8px 16px 4px ${setAlphaToHex(palette.black, 0.05)}`,
    ].join(', '),
    md: [
      `0 6px 6px -3px ${setAlphaToHex(palette.black, 0.1)}`,
      `0 12px 24px 6px ${setAlphaToHex(palette.black, 0.05)}`,
    ].join(', '),
    lg: [
      `0 8px 8px -4px ${setAlphaToHex(palette.black, 0.1)}`,
      `0 16px 32px 8px ${setAlphaToHex(palette.black, 0.05)}`,
    ].join(', '),
    xl: [
      `0 10px 10px -5px ${setAlphaToHex(palette.black, 0.1)}`,
      `0 20px 40px 10px ${setAlphaToHex(palette.black, 0.05)}`,
    ].join(', '),
  },
  weights: {
    light: 400,
    normal: 500,
    bold: 700,
    extrabold: 800,
  },
};

const themes: Record<Mode, Theme> = {
  dark: {
    ...common,
    primary: generateColorTokens('dark', palette.primary),
    netural: generateColorTokens('dark', palette.gray[100]),
    dark: generateColorTokens('dark', palette.black),
    light: generateColorTokens('dark', palette.white),
    info: generateColorTokens('dark', palette.indigo[600]),
    danger: generateColorTokens('dark', palette.red[600]),
    success: generateColorTokens('dark', palette.green[500]),
    warning: generateColorTokens('dark', palette.yellow[500]),

    text: {
      main: palette.gray[100],
      sub: palette.gray[200],
      third: palette.gray[300],
    },
    background: {
      main: palette.gray[900],
      sub: palette.gray[800],
      elevated: palette.gray[700],
    },
    border: {
      netural: setAlphaToHex(palette.gray[100], 0.3),
      dark: setAlphaToHex(palette.gray[900], 0.3),
      light: setAlphaToHex(palette.gray[100], 0.3),
    },
    scrollbar: {
      track: setAlphaToHex(palette.white, 0.15),
      thumb: setAlphaToHex(palette.white, 0.3),
    },
  },
  light: {
    ...common,
    primary: generateColorTokens('light', palette.primary),
    netural: generateColorTokens('light', palette.gray[900]),
    dark: generateColorTokens('light', palette.black),
    light: generateColorTokens('light', palette.white),
    info: generateColorTokens('light', palette.indigo[600]),
    danger: generateColorTokens('light', palette.red[600]),
    success: generateColorTokens('light', palette.green[500]),
    warning: generateColorTokens('light', palette.yellow[500]),

    text: {
      main: palette.gray[900],
      sub: palette.gray[800],
      third: palette.gray[700],
    },
    background: {
      main: palette.gray[100],
      sub: palette.gray[200],
      elevated: palette.white,
    },
    border: {
      netural: setAlphaToHex(palette.gray[900], 0.3),
      dark: setAlphaToHex(palette.gray[900], 0.3),
      light: setAlphaToHex(palette.gray[100], 0.3),
    },
    scrollbar: {
      track: setAlphaToHex(palette.white, 0.15),
      thumb: setAlphaToHex(palette.white, 0.3),
    },
  },
};

// Utils
type RGB = [number, number, number];
type RGBA = [number, number, number, number];
type Hex = string;

function generateColorTokens(mode: Mode, hex: string) {
  const monochrome = getMonochromeColor(mode, hex);

  return {
    main: hex,
    accent: getAccentColor(hex),
    contrast: getContrastColor(hex),
    hover: setAlphaToHex(hex, 0.05),
    focus: setAlphaToHex(hex, 0.1),
    active: setAlphaToHex(hex, 0.15),
    disabled: setAlphaToHex(monochrome, 0.25),
  };
}

function getAccentColor(hex: string): Hex {
  const offset = 0.15;

  const [r, g, b] = convertHexToRGBA(hex);
  const isLight = getBrightness([r, g, b]) >= BRIGHTNESS_THRESHOLD;

  return [r, g, b].reduce((acc, current) => {
    const channel = isLight ? Math.pow(current, 2 - offset) / 255 : 255 - Math.pow(255 - current, 2 - offset) / 255;

    return `${acc}${channel.toString(16).padStart(2, '0')}`;
  }, '#');
}

function getContrastColor(hex: string): Hex {
  const [r, g, b] = convertHexToRGBA(hex);
  const isLight = getBrightness([r, g, b]) >= BRIGHTNESS_THRESHOLD;

  return isLight ? palette.black : palette.white;
}

function getMonochromeColor(mode: Mode, hex: string) {
  return match([mode, hex])
    .with([P.any, palette.black], ([_, hex]) => hex)
    .with([P.any, palette.white], ([_, hex]) => hex)
    .with(['dark', P.any], () => palette.white)
    .with(['light', P.any], () => palette.black)
    .exhaustive();
}

function getBrightness([r, g, b]: RGB) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

export function setAlphaToHex(hex: string, a: number = 1) {
  return `rgba(${convertHexToRGBA(hex, a).join(', ')})`;
}

export function convertHexToRGBA(hex: string, a: number = 1): RGBA {
  if (!/^#([0-9a-f]{3}){1,2}$/i.test(hex)) {
    throw new Error('유효하지 않은 16진수 코드입니다. 3자리 또는 6자리의 16진수 값만 입력해주세요.');
  }

  if (a < 0 || a > 1) {
    throw new Error('유효하지 않은 투명도입니다. 투명도는 0 부터 1 사이의 값으로 입력해야 합니다.');
  }

  let r, g, b;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  return [r, g, b, a];
}

export default themes;
