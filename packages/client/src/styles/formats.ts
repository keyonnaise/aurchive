import { Theme, css } from '@emotion/react';
import media from './media';

export const styledPostFormat = (theme: Theme) => css`
  h2,
  h3,
  h4,
  p,
  pre {
    & + :where(h2, h3, h4, p, pre) {
      margin-top: 1lh;
    }
  }

  h2,
  h3,
  h4 {
    font-weight: ${theme.weights.bold};
  }

  h2,
  h3 {
    line-height: 1.4;
  }

  h4 {
    line-height: 1.6;
  }

  p,
  pre {
    font-weight: ${theme.weights.normal};
    line-height: 1.8;
  }

  p {
    code {
      padding: 0.25em;
      border-radius: ${theme.radii.xs};
    }
  }

  pre {
    &:has(+ p) {
      margin-bottom: 2lh;
    }

    code {
      display: block;
      overflow-x: auto;
      padding: 1em;
      border-radius: ${theme.radii.md};
      font-size: 0.875em;
      font-weight: ${theme.weights.light};
      line-height: 1.4;
    }
  }

  strong {
    font-weight: bolder;
  }

  em {
    font-style: italic;
  }

  mark {
    color: ${theme.info.main};
    background: ${theme.info.alpha(0.1)};
  }

  a {
    color: ${theme.info.main};
    text-decoration: underline;
    text-underline-offset: 0.1em;
  }

  img {
    width: 100%;
  }

  ${media.xs} {
    h2 {
      font-size: 32px;
    }

    h3 {
      font-size: 28px;
    }

    h4 {
      font-size: 24px;
    }

    p,
    pre {
      font-size: 14px;
    }
  }

  ${media.md} {
    h2 {
      font-size: 40px;
    }

    h3 {
      font-size: 32px;
    }

    h4 {
      font-size: 28px;
    }

    p,
    pre {
      font-size: 16px;
    }
  }

  ${media.xl} {
    h2 {
      font-size: 48px;
    }

    h3 {
      font-size: 36px;
    }

    h4 {
      font-size: 32px;
    }
  }
`;

export const styledBioFormat = (theme: Theme) => css`
  h2,
  h3,
  h4,
  p,
  pre {
    margin-bottom: 1lh;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h2,
  h3,
  h4 {
    font-weight: ${theme.weights.bold};

    &:has(+ h2, + h3, + h4) {
      margin-bottom: 0.5lh;
    }
  }

  h2,
  h3 {
    line-height: 1.4;
  }

  h4 {
    line-height: 1.6;
  }

  p,
  pre {
    font-weight: ${theme.weights.normal};
    line-height: 1.8;

    &:has(+ h2, + h3, + h4) {
      margin-bottom: 4lh;
    }
  }

  strong {
    font-weight: bolder;
  }

  em {
    font-style: italic;
  }

  mark {
    color: ${theme.info.main};
    background-color: ${theme.info.alpha(0.1)};
  }

  a {
    color: ${theme.info.main};
    text-decoration: underline;
    text-underline-offset: 0.1em;
  }

  ${media.xs} {
    h2 {
      font-size: 22px;
    }

    h3 {
      font-size: 20px;
    }

    h4 {
      font-size: 16px;
    }

    p,
    pre {
      font-size: 14px;
    }
  }

  ${media.md} {
    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 22px;
    }

    h4 {
      font-size: 18px;
    }

    p,
    pre {
      font-size: 16px;
    }
  }

  ${media.xl} {
    h2 {
      font-size: 26px;
    }

    h3 {
      font-size: 24px;
    }
  }
`;
