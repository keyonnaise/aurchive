import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorScreenTemplate from '~components/template/ErrorScreenTemplate';
import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';

function Index() {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate('/', { replace: true }), [navigate]);

  return (
    <>
      <SEO title={`404 Not Found | ${MAIN_SLOGAN}`} canonical="not-found" />
      <ErrorScreenTemplate
        title="페이지를 찾을 수 없어요."
        description="요청하신 페이지가 사라졌거나, 잘못된 경로를 입력하셨어요."
        action={{
          label: '홈 바로가기',
          onClick: handleClick,
        }}
      />
    </>
  );
}

export default Index;
