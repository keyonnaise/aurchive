import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Divider from '~components/atom/Divider';
import Button from '~components/buttons/Button';
import Grid from '~components/layout/Grid';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { breakpoints } from '~styles/media';

const LOGO = 'OUR_ARCHIVE';
const EMAIL = 'su.smisc14@gmail.com';

function BaseStructureFooter() {
  const snackbar = useSnackbar();

  const handleCopyEmail = useCallback(async () => {
    snackbar.promise(navigator.clipboard.writeText(EMAIL), {
      pending: '이메일을 클립보드에 복사하는 중 이에요.',
      success: '이메일을 성공적으로 복사 했어요.',
      error: '이메일을 클립보드에 복사하는 도중 오류가 발생했어요.',
    });
  }, [snackbar]);

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <Grid container alignItems="center">
          <Grid item xs="auto">
            <Anchor css={styledLogo} to="/">
              {LOGO}
            </Anchor>
          </Grid>
          <Grid item xs>
            <div css={styledButtonGroup}>
              <Button as="button" shape="round" size="sm" leftIcon="business/mail-line" onClick={handleCopyEmail}>
                메일 주소 복사
              </Button>
            </div>
          </Grid>
        </Grid>
        <Divider space={1.5} />
        <p css={styledCopyright}>© 2024 Keyonnaise. All Rights Reserved.</p>
      </div>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  display: flex;
  color: ${theme.text.main};
  background-color: ${theme.netural.contrast};
  border-top: 1px solid ${theme.border.netural};
`;

const styledContent = css`
  flex-grow: 0;
  flex-basis: auto;

  width: min(${breakpoints.xl}px, calc(100% - 24px));
  padding: 24px 0;
  margin: 0 auto;
`;

const styledLogo = css`
  font-family: 'Ubuntu Sans Mono', monospace;
  font-size: 14px;
  font-weight: bold;
`;

const styledButtonGroup = css`
  display: flex;
  justify-content: end;
  gap: 4px;
`;

const styledCopyright = (theme: Theme) => css`
  color: ${theme.text.third};
  font-size: 12px;
  font-weight: ${theme.weights.light};
`;

export default BaseStructureFooter;
