import { Theme, Global, css } from '@emotion/react';

function GlobalStyles() {
  return <Global styles={[styleReset, stylePreset, styledCodeBlock]} />;
}

// Styles
const styleReset = (theme: Theme) => css`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Sans+Mono:wght@400..700&display=swap');

  *,
  *::before,
  *::after {
    flex-shrink: 0;
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  :root {
    -moz-tab-size: 4;
    tab-size: 4;

    -moz-text-size-adjust: none;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;

    -webkit-tap-highlight-color: transparent;

    line-height: 1;
    overflow-wrap: break-word;
    cursor: default;
  }

  html {
    position: relative;
  }

  body {
    overflow-x: hidden;
    color: ${theme.text.main};
    background-color: ${theme.background.main};
    font-family: 'Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Apple SD Gothic Neo',
      'Malgun Gothic', '맑은 고딕', arial, '돋움', 'Dotum', Tahoma, 'Geneva', sans-serif;
    font-weight: ${theme.weights.normal};
  }

  #root {
    min-height: 100vh;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  ol,
  ul {
    list-style: none;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }
`;

const stylePreset = (theme: Theme) => css`
  .font-mono {
    font-family: 'Ubuntu Sans Mono', monospace;
  }

  .sr-only {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }

  [data-radix-popper-content-wrapper] {
    z-index: ${theme.elevation.modal} !important;
  }
`;

const styledCodeBlock = css`
  code {
    color: #c9d1d9;
    background: #0d1117;
    font-family: 'Ubuntu Sans Mono', monospace;
  }
  .hljs-doctag,
  .hljs-keyword,
  .hljs-meta .hljs-keyword,
  .hljs-template-tag,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable.language_ {
    color: #ff7b72;
  }
  .hljs-title,
  .hljs-title.class_,
  .hljs-title.class_.inherited__,
  .hljs-title.function_ {
    color: #d2a8ff;
  }
  .hljs-attr,
  .hljs-attribute,
  .hljs-literal,
  .hljs-meta,
  .hljs-number,
  .hljs-operator,
  .hljs-selector-attr,
  .hljs-selector-class,
  .hljs-selector-id,
  .hljs-variable {
    color: #79c0ff;
  }
  .hljs-meta .hljs-string,
  .hljs-regexp,
  .hljs-string {
    color: #a5d6ff;
  }
  .hljs-built_in,
  .hljs-symbol {
    color: #ffa657;
  }
  .hljs-code,
  .hljs-comment,
  .hljs-formula {
    color: #8b949e;
  }
  .hljs-name,
  .hljs-quote,
  .hljs-selector-pseudo,
  .hljs-selector-tag {
    color: #7ee787;
  }
  .hljs-subst {
    color: #c9d1d9;
  }
  .hljs-section {
    color: #1f6feb;
    font-weight: 700;
  }
  .hljs-bullet {
    color: #f2cc60;
  }
  .hljs-emphasis {
    color: #c9d1d9;
    font-style: italic;
  }
  .hljs-strong {
    color: #c9d1d9;
    font-weight: 700;
  }
  .hljs-addition {
    color: #aff5b4;
    background-color: #033a16;
  }
  .hljs-deletion {
    color: #ffdcd7;
    background-color: #67060c;
  }
`;

export default GlobalStyles;
