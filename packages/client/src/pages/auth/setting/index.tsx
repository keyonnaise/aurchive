import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import Cover from './Cover';
import ProfileEditor from './ProfileEditor';

function Index() {
  return (
    <>
      <SEO title={`프로필 설정 | ${MAIN_SLOGAN}`} canonical="auth/setting" />
      <Cover />
      <ProfileEditor />
    </>
  );
}

export default Index;
