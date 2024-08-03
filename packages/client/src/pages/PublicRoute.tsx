import { Suspense, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import useEffectOnce from '~hooks/useEffectOnce';
import { IAccount } from '~lib/api/auth/types';
import useMyAccountStore from '~store/useMyAccountStore';
import Authentication from './Authentication';

interface Props {
  children: React.ReactNode;
}

function PublicRoute({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setMyAccount = useMyAccountStore(useShallow(({ setMyAccount }) => setMyAccount));

  useEffectOnce(() => {
    const myAccount = localStorage.getItem('myAccount');

    if (myAccount === null) return;

    setMyAccount(JSON.parse(myAccount));
    setIsLoggedIn(true);
  });

  const resetAuthentication = useCallback(() => {
    setIsLoggedIn(false);
    setMyAccount(null);
  }, [setMyAccount]);

  const handleAuthentication = useCallback(
    (myAccount: IAccount) => {
      setMyAccount(myAccount);
    },
    [setMyAccount],
  );

  return (
    <>
      {children}
      {isLoggedIn && (
        <ErrorBoundary
          fallback={({ onResolveError }) => (
            <ErrorFallback resetAuthentication={resetAuthentication} onResolveError={onResolveError} />
          )}
        >
          <Suspense>
            <Authentication onAuthenticated={handleAuthentication} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

// Subcomponents
interface ErrorFallbackProps {
  resetAuthentication(): void;
  onResolveError(): void;
}

const ErrorFallback = ({ resetAuthentication, onResolveError }: ErrorFallbackProps) => {
  useEffectOnce(() => {
    resetAuthentication();
    onResolveError();
  });

  return null;
};

export default PublicRoute;
