import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import { useUserContext } from '~pages/user';
import Section01 from './Section01';
import Section02 from './Section02';

function Index() {
  const { id, displayName } = useUserContext();

  return (
    <>
      <SEO title={`${displayName}님의 프로필 | ${MAIN_SLOGAN}`} canonical={`@${id}`} />
      <Section01 />
      <Section02 />
    </>
  );
}

export default Index;
