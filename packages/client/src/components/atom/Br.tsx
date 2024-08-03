import { css } from '@emotion/react';
import media from '~styles/media';

const SIZE_TO_DEVICE_MAP = {
  xs: 'mobile',
  sm: 'mobile',
  md: 'tablet',
  lg: 'laptop',
  xl: 'desktop',
} as const;

type Device = (typeof SIZE_TO_DEVICE_MAP)[keyof typeof SIZE_TO_DEVICE_MAP];

interface Props {
  only?: Device[] | 'all';
  blank?: boolean;
}

function Br({ only = 'all', blank = false }: Props) {
  if (only === 'all') return <br />;

  return <br css={styledLineBreak({ only, blank })} />;
}

// Styles
const styledLineBreak = ({ only, blank }: { only: Device[]; blank: boolean }) => css`
  display: inline-block;
  width: ${blank ? '0.5ch' : '0'};

  ${(Object.entries(media) as Entries<typeof media>).map(
    ([key, value]) => css`
      ${value} {
        content: ${only.includes(SIZE_TO_DEVICE_MAP[key]) ? 'unset' : "''"};
      }
    `,
  )}
`;

export default Br;
