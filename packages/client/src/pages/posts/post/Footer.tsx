import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import Avatar from '~components/data-display/Avatar';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { IPost } from '~lib/api/posts/types';
import { breakpoints } from '~styles/media';

type Author = IPost['author'];

interface Props {
  author: Author;
}

function Footer({ author }: Props) {
  const snackbar = useSnackbar();

  const handleCopyURL = useCallback(async () => {
    snackbar.promise(navigator.clipboard.writeText(window.location.href), {
      pending: '주소를 클립보드에 복사하는 중이에요.',
      success: '주소를 성공적으로 복사했어요.',
      error: '주소를 클립보드에 복사하는 도중 오류가 발생했어요.',
    });
  }, [snackbar]);

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <Typography as="h2" variant="h4" weight="bold">
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
      {author !== undefined && (
        <div css={styledContent}>
          <Avatar size="xl" name={author.displayName} photoUrl={author.photoUrl} />
          <Spacer y={2} />
          <Typography as="h2" variant="body1" weight="bold">
            {author.displayName}
          </Typography>
          <Spacer y={0} />
          <Typography variant="body2" color="sub">
            {author.profile.bio}
          </Typography>
          <Spacer y={0.5} />
          <Typography variant="body3" color="third" weight="light">
            <Anchor to={`/@${author.id}`} underline="hover">
              view more →
            </Anchor>
          </Typography>
        </div>
      )}
    </div>
  );
}

const styledContainer = css``;

const styledContent = (theme: Theme) => css`
  width: min(${breakpoints.md}px, calc(100% - 24px));
  padding: 160px 0;
  margin: 0 auto;
  border-top: 1px solid ${theme.border};
  text-align: center;
`;

export default Footer;
