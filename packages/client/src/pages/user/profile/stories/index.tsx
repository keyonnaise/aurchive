import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import { useUserContext } from '~pages/user';
import Section01 from './Section01';

function Index() {
  const { id, displayName } = useUserContext();

  return (
    <>
      <SEO title={`${displayName}님의 스토리 | ${MAIN_SLOGAN}`} canonical={`@${id}/stories`} />
      <Section01 />
    </>
  );
}

export default Index;
