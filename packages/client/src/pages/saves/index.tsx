import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import Cover from './Cover';
import Section01 from './Section01';

function Index() {
  return (
    <>
      <SEO title={`임시 글 목록 | ${MAIN_SLOGAN}`} canonical="saves" />
      <Cover />
      <Section01 />
    </>
  );
}

export default Index;
