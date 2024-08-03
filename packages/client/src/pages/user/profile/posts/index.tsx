import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import { useUserContext } from '~pages/user';
import Section01 from './Section01';

function Index() {
  const { id, displayName } = useUserContext();

  return (
    <>
      <SEO title={`${displayName}님의 작성글 | ${MAIN_SLOGAN}`} canonical={`@${id}/posts`} />
      <Section01 />
    </>
  );
}

export default Index;
