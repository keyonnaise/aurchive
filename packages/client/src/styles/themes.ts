import { ColorTokens, Theme } from '@emotion/react';
import _ from 'lodash';
import { P, match } from 'ts-pattern';
import palette from './palette';

// TODO: 다크모드 구현
export type Mode = 'dark' | 'light';

const themes: Record<Mode, Theme> = {
  dark: {
    // 1. Primary
    primary: getDarkThemeColorToken(palette.primary),

    // 2. Brand

    // 3. Mono
    netural: getDarkThemeColorToken(palette.gray[100]),
    dark: getDarkThemeColorToken(palette.black),
    light: getDarkThemeColorToken(palette.white),

    // 4. Severity
    info: getDarkThemeColorToken(palette.indigo[700]),
    danger: getDarkThemeColorToken(palette.red[700]),
    success: getDarkThemeColorToken(palette.green[700]),
    warning: getDarkThemeColorToken(palette.yellow[700]),

    // 5. Sementic
    text: {
      main: palette.gray[100],
      sub: palette.gray[200],
      third: palette.gray[300],
    },
    background: {
      main: palette.gray[950],
      sub: palette.gray[900],
      elevated: palette.gray[800],
    },
    border: toRGBAString(hexToRGBA(palette.white, 0.1)),

    // 6. Others
    elevation: {
      fab: 50,
      appBar: 100,
      drawer: 200,
      modal: 300,
      snackbar: 400,
      tooltip: 500,
    },

    dim: {
      thin: toRGBAString(hexToRGBA(palette.black, 0.4)),
      basic: toRGBAString(hexToRGBA(palette.black, 0.6)),
      thick: toRGBAString(hexToRGBA(palette.black, 0.8)),
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
        `0 2px 2px 0 ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 4px 8px 2px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      sm: [
        `0 4px 4px -2px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 8px 16px 4px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      md: [
        `0 6px 6px -3px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 12px 24px 6px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      lg: [
        `0 8px 8px -4px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 16px 32px 8px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      xl: [
        `0 10px 10px -5px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 20px 40px 10px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
    },

    weights: {
      light: 400,
      normal: 500,
      bold: 700,
      extrabold: 800,
    },
  },

  light: {
    // 1. Primary
    primary: getLightThemeColorToken(palette.primary),

    // 2. Brand

    // 3. Mono
    netural: getLightThemeColorToken(palette.gray[900]),
    dark: getLightThemeColorToken(palette.black),
    light: getLightThemeColorToken(palette.white),

    // 4. Severity
    info: getLightThemeColorToken(palette.indigo[700]),
    danger: getLightThemeColorToken(palette.red[700]),
    success: getLightThemeColorToken(palette.green[700]),
    warning: getLightThemeColorToken(palette.yellow[700]),

    // 5. Sementic
    text: {
      main: palette.gray[900],
      sub: palette.gray[800],
      third: palette.gray[700],
    },
    background: {
      main: palette.gray[50],
      sub: palette.gray[100],
      elevated: palette.white,
    },
    border: toRGBAString(hexToRGBA(palette.black, 0.1)),

    // 6. Others
    elevation: {
      fab: 50,
      appBar: 100,
      drawer: 200,
      modal: 300,
      snackbar: 400,
      tooltip: 500,
    },

    dim: {
      thin: toRGBAString(hexToRGBA(palette.black, 0.4)),
      basic: toRGBAString(hexToRGBA(palette.black, 0.6)),
      thick: toRGBAString(hexToRGBA(palette.black, 0.8)),
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
        `0 2px 2px 0 ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 4px 8px 2px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      sm: [
        `0 4px 4px -2px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 8px 16px 4px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      md: [
        `0 6px 6px -3px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 12px 24px 6px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      lg: [
        `0 8px 8px -4px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 16px 32px 8px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
      xl: [
        `0 10px 10px -5px ${toRGBAString(hexToRGBA(palette.black, 0.1))}`,
        `0 20px 40px 10px ${toRGBAString(hexToRGBA(palette.black, 0.05))}`,
      ].join(', '),
    },

    weights: {
      light: 400,
      normal: 500,
      bold: 700,
      extrabold: 800,
    },
  },
};

function getDarkThemeColorToken(hex: string): ColorTokens {
  return getColorTokens('dark', hex);
}

function getLightThemeColorToken(hex: string): ColorTokens {
  return getColorTokens('light', hex);
}

function getColorTokens(mode: Mode, hex: string): ColorTokens {
  const monochrome = match([mode, hex])
    .with([P.any, palette.black], ([_, hex]) => hex)
    .with([P.any, palette.white], ([_, hex]) => hex)
    .with(['dark', P.any], () => palette.white)
    .with(['light', P.any], () => palette.black)
    .exhaustive();

  return {
    main: hex,
    accent: getAccentColor(hex),
    contrast: getAcessibleMonochrome(hex),

    hover: toRGBAString(hexToRGBA(hex, 0.05)),
    active: toRGBAString(hexToRGBA(hex, 0.1)),
    focus: toRGBAString(hexToRGBA(hex, 0.15)),
    disabled: toRGBAString(hexToRGBA(monochrome, 0.2)),

    alpha: (a: number) => toRGBAString(hexToRGBA(hex, a)),
  };
}

function getAccentColor(hex: string) {
  const [r1, g1, b1] = hexToRGBA(hex).map((value) => value / 255);
  const [r2, g2, b2] = hexToRGBA(hex).map((value) => value / 255);

  const brightness = Math.max((r1 + g1 + b1) / 3, (r2 + g2 + b2) / 3);

  const r = Math.round((brightness * (2 * r1 - 1) + (1 - brightness) * r2) * 255);
  const g = Math.round((brightness * (2 * g1 - 1) + (1 - brightness) * g2) * 255);
  const b = Math.round((brightness * (2 * b1 - 1) + (1 - brightness) * b2) * 255);

  return `rgba(${r}, ${g}, ${b}, 1)`;
}

function getAcessibleMonochrome(hex: string) {
  const [r, g, b] = hexToRGBA(hex);
  const brightness = getBrightness(r, g, b);

  return brightness > 155 ? '#000000' : '#ffffff';
}

function getBrightness(r: number, g: number, b: number) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

type RGBA = [number, number, number, number];

function toRGBAString(rgba: RGBA) {
  return `rgba(${rgba.join()})`;
}

function hexToRGBA(hex: string, a: number = 1): RGBA {
  if (!/^#([0-9a-f]{3}){1,2}$/i.test(hex)) {
    throw new TypeError('Invalid hex code. Please provide a 3 or 6 digit hex code.');
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

  a = _.clamp(a, 0, 1);

  return [r, g, b, a];
}

export default themes;
