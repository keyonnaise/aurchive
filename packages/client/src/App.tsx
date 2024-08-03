import { Suspense, useCallback, useEffect } from 'react';
import { Theme, ThemeProvider, css } from '@emotion/react';
import { HydrationBoundary } from '@tanstack/react-query';
import ReactGA from 'react-ga4';
import { useLocation, useRoutes } from 'react-router-dom';
import Br from '~components/atom/Br';
import Icon from '~components/atom/Icon';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import OverlayGroup from '~components/overlay/OverlayGroup';
import SnackbarGroup from '~components/snckbar/SnackbarGroup';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import GlobalStyles from '~components/utils/GlobalStyles';
import useEffectOnce from '~hooks/useEffectOnce';
import routes from '~pages/routes';
import useSystemStore from '~store/useSystemStore';
import themes from '~styles/themes';

const dehydratedState = typeof window !== 'undefined' ? window.__REACT_QUERY_STATE__ : {};

function App() {
  const themeMode = useSystemStore(({ config: system }) => system.themeMode);

  const element = useRoutes(routes);
  const location = useLocation();

  useEffectOnce(() => {
    ReactGA.initialize('G-NZBP9SENWB');
  });

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname,
    });
  }, [location]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ThemeProvider theme={themes[themeMode]}>
        <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
          <Suspense fallback={<SuspenseFallback />}>{element}</Suspense>
          <SnackbarGroup />
          <OverlayGroup />
          <GlobalStyles />
        </ErrorBoundary>
      </ThemeProvider>
    </HydrationBoundary>
  );
}

// Subcomponents
const SuspenseFallback = () => {
  return (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Icon icon="system/loader" inline />
        <Spacer y={1} />
        <p>페이지를 불러오고 있어요</p>
      </div>
    </div>
  );
};

interface ErrorFallbackProps {
  onResolveError(): void;
}

const ErrorFallback = ({ onResolveError }: ErrorFallbackProps) => {
  const handleResolveError = useCallback(() => {
    window.location.reload();
    onResolveError();
  }, [onResolveError]);

  return (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h2" weight="extrabold">
          Opps! ヽ(°〇°)ﾉ
        </Typography>
        <Typography variant="body1" color="sub">
          페이지에서 알 수 없는 오류가 발생했어요!
          <Br />
          페이지를 새로고침 해주세요!
        </Typography>
        <Button as="button" shape="round" inline onClick={handleResolveError}>
          새로고침
        </Button>
      </div>
    </div>
  );
};

// Styles
const styledFallbackContainer = (theme: Theme) => css`
  z-index: 9999;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  color: ${theme.text.main};
  background-color: ${theme.background.main};
`;

const styledFallbackContent = css`
  padding: 24px;
  margin: 0 auto;
  text-align: center;
`;

export default App;
