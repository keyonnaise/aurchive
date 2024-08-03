import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import Cover from './Cover';
import Section01 from './Section01';

function Index() {
  return (
    <>
      <SEO title={`멤버 소개 | ${MAIN_SLOGAN}`} canonical="members" />
      <Cover />
      <Section01 />
    </>
  );
}

export default Index;
