import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { breakpoints } from '~styles/media';

function Footer() {
  const snackbar = useSnackbar();

  const handleCopyURL = useCallback(async () => {
    snackbar.promise(navigator.clipboard.writeText(window.location.href), {
      pending: '주소를 클립보드에 복사하는 중 이에요.',
      success: '주소를 성공적으로 복사 했어요.',
      error: '주소를 클립보드에 복사하는 도중 오류가 발생했어요.',
    });
  }, [snackbar]);

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <Typography variant="h2" weight="extrabold">
          글이 마음에 드셨나요?
        </Typography>
        <Typography variant="body1" color="sub">
          콘텐츠를 다른 사람과 공유해주세요!
        </Typography>
        <Spacer y={2} />
        <Button as="button" colorScheme="info" leftIcon="system/external-link-line" inline onClick={handleCopyURL}>
          공유하기
        </Button>
      </div>
    </div>
  );
}

const styledContainer = css`
  display: flex;
`;

const styledContent = (theme: Theme) => css`
  width: min(${breakpoints.lg}px, calc(100% - 24px));
  padding: 160px 0;
  margin: 0 auto;
  border-top: 1px solid ${theme.border};
  text-align: center;
`;

export default Footer;
