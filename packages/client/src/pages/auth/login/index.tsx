import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import LoginForm from './LoginForm';

function Index() {
  return (
    <>
      <SEO title={`로그인 | ${MAIN_SLOGAN}`} canonical="auth/login" />
      <div css={styledContainer}>
        <div css={styledContent}>
          <Typography as="h2" variant="h5" weight="extrabold">
            로그인
          </Typography>
          <Spacer y={2} />
          <LoginForm />
          <Spacer y={2} />
          <Anchor css={styledAnchor} to="/" underline="hover">
            홈으로
          </Anchor>
        </div>
      </div>
    </>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${theme.background.main};
`;

const styledContent = css`
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;

  max-width: 320px;
  margin: 0 24px;
  text-align: center;
`;

const styledAnchor = (theme: Theme) => css`
  color: ${theme.info.main};
`;

export default Index;
