import { keyframes } from '@emotion/react';

export const fadeIn = keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export const fadeOut = keyframes({
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

export const slideIn = (from: 'top' | 'right' | 'bottom' | 'left') =>
  keyframes({
    '0%': {
      opacity: 0,
      transform: (() => {
        switch (from) {
          case 'top': {
            return 'translate(0, -16px)';
          }
          case 'right': {
            return 'translate(16px, 0)';
          }
          case 'bottom': {
            return 'translate(0, 16px)';
          }
          case 'left': {
            return 'translate(-16px, 0)';
          }

          // no default
        }
      })(),
    },
    '100%': {
      opacity: 1,
      transform: 'translate(0)',
    },
  });

export const slideOut = (to: 'top' | 'right' | 'bottom' | 'left') =>
  keyframes({
    '0%': {
      opacity: 1,
      transform: 'translate(0)',
    },
    '1000%': {
      opacity: 0,
      transform: (() => {
        switch (to) {
          case 'top': {
            return 'translate(0, -16px)';
          }
          case 'right': {
            return 'translate(16px, 0)';
          }
          case 'bottom': {
            return 'translate(0, 16px)';
          }
          case 'left': {
            return 'translate(-16px, 0)';
          }

          // no default
        }
      })(),
    },
  });

export const blink = keyframes({
  '50%': {
    opacity: 0,
  },
});
