import { useEffect, useRef } from 'react';
import { Theme, css } from '@emotion/react';
import { useInView } from 'framer-motion';
import Typography from '~components/atom/Typography';
import { useBaseStructureContext } from '~components/structure/BaseStructure';
import { breakpoints } from '~styles/media';

function Cover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '0px 0px -100% 0px' });

  const { setHeaderColorScheme } = useBaseStructureContext();

  useEffect(() => {
    setHeaderColorScheme(isInView ? 'dark' : 'netural');

    return () => setHeaderColorScheme('netural');
  }, [isInView, setHeaderColorScheme]);

  return (
    <div ref={containerRef} css={styledContainer}>
      <div css={styledContent}>
        <Typography variant="h2" weight="extrabold">
          📄 임시 글
        </Typography>
      </div>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  display: flex;
  align-items: center;
  padding: 128px 0 64px 0;
  color: ${theme.dark.contrast};
  background-color: ${theme.dark.main};
`;

const styledContent = css`
  width: min(${breakpoints.xl}px, calc(100% - 48px));
  margin: 0 auto;
`;

export default Cover;
