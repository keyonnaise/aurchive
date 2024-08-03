import { useCallback, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Icon from '~components/atom/Icon';
import Spacer from '~components/atom/Spacer';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SSRSafeSuspense from '~components/utils/SSRSafeSuspense';
import useEffectOnce from '~hooks/useEffectOnce';
import { IAccount } from '~lib/api/auth/types';
import useMyAccountStore from '~store/useMyAccountStore';
import Authentication from './Authentication';

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setMyAccount = useMyAccountStore(useShallow(({ setMyAccount }) => setMyAccount));

  const handleAuthentication = useCallback(
    (myAccount: IAccount) => {
      setMyAccount(myAccount);
      setIsAuthenticated(true);
    },
    [setMyAccount],
  );

  return (
    <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
      <SSRSafeSuspense fallback={<SuspenseFallback />}>
        {isAuthenticated && children}
        <Authentication onAuthenticated={handleAuthentication} />
      </SSRSafeSuspense>
    </ErrorBoundary>
  );
}

// Subcomponents
const SuspenseFallback = () => {
  return (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Icon icon="system/loader" inline />
        <Spacer y={1} />
        <p>사용자 인증을 진행중이예요.</p>
      </div>
    </div>
  );
};

interface ErrorFallbackProps {
  onResolveError(): void;
}

const ErrorFallback = ({ onResolveError }: ErrorFallbackProps) => {
  const setMyAccount = useMyAccountStore(useShallow(({ setMyAccount }) => setMyAccount));

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  useEffectOnce(() => {
    snackbar({
      severity: 'danger',
      title: '사용자 인증 실패',
      description: '사용자 인증 도중 오류가 발생했어요. 다시 로그인 해주세요.',
    });
    setMyAccount(null);
    navigate('/auth/login', { replace: true });
    onResolveError();
  });

  return null;
};

// Styles
const styledFallbackContainer = css`
  z-index: 9999;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
`;

const styledFallbackContent = css`
  padding: 24px;
  margin: 0 auto;
  text-align: center;
`;

export default PrivateRoute;
