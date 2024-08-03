import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { toHtml } from 'hast-util-to-html';
import lowlight from '~lib/lowlight';
import { styledPostFormat } from '~styles/formats';
import { breakpoints } from '~styles/media';

// lowlight.registerAlias({ bash: ['sh', 'zsh'] });

interface Props {
  body: string;
}

function Content({ body }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current!;

    [...content.querySelectorAll('pre code')].forEach((element) => {
      const tree = lowlight.highlightAuto(element.textContent || '');
      const html = toHtml(tree);

      element.innerHTML = html;
    });
  }, []);

  return (
    <div css={styledContainer}>
      <div ref={contentRef} css={[styledContent, styledPostFormat]} dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}

// Styles
const styledContainer = css`
  display: flex;
`;

const styledContent = css`
  width: min(${breakpoints.lg}px, calc(100% - 24px));
  padding: 80px 0;
  margin: 0 auto;
`;

export default Content;
