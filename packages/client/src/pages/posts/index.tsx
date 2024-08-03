import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import Cover from './Cover';
import Section01 from './Section01';

// const CATEGORY_MAP = {
//   design: '🎨 디자인',
//   development: '🖥️ 개발',
//   others: '🪄 미분류',
// } as const;

function Index() {
  return (
    <>
      <SEO title={`📂 모든 글 | ${MAIN_SLOGAN}`} canonical="posts" />
      <Cover title="📂 모든 글" />
      <Section01 />
    </>
  );
}

export default Index;
