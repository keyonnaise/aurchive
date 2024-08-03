import { css } from '@emotion/react';

const ellipsis = Object.assign(
  css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  `,
  {
    multiline: (lineClamp: number = 2) => css`
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${lineClamp};
      max-height: ${lineClamp}lh;
    `,
  },
);

export default ellipsis;
