import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '~components/buttons/Button';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import contains from '~lib/contains';
import { breakpoints } from '~styles/media';
import { usePostEditorContext } from './PostEditor';
import PublishPreviewModal from './PublishPreviewModal';
import usePersistPost from './hooks/usePersistPost';

function PostEditorFooter() {
  const { id, author, fields, isPublished, setId, enableAutoSave, disableAutoSave } = usePostEditorContext();

  const snackbar = useSnackbar();
  const overlay = useOverlay();

  const persistPost = usePersistPost();

  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    overlay.open((props) => (
      <Confirm
        {...props}
        title="페이지에서 벗어나시겠어요?"
        description="변경 사항이 저장되지 않을 수도 있어요."
        onConfirm={() => navigate(-1)}
      />
    ));
  }, [overlay, navigate]);

  const openPreviewModal = useCallback(() => {
    if (contains([fields.title, fields.body], '')) {
      snackbar({
        icon: 'system/error-warning-line',
        title: '아직 작성하지 않은 항목이 있어요!',
        description: '제목 그리고 본문은 필수로 작성해야 돼요.',
      });

      return;
    }

    const mutation = async () => {
      const currentId = await persistPost({ id, author, fields });
      setId(currentId);

      overlay.open((props) => (
        <PublishPreviewModal
          {...props}
          id={currentId}
          author={author}
          fields={fields}
          isPublished={isPublished}
          onOpen={disableAutoSave}
          onCancel={enableAutoSave}
        />
      ));
    };

    snackbar.promise(mutation(), {
      pending: '포스트를 임시저장 하고 있어요.',
      success: '포스트를 임시저장했어요.',
      error: '포스트를 임시저장하는 도중 오류가 발생했어요',
    });
  }, [id, author, fields, isPublished, setId, enableAutoSave, disableAutoSave, snackbar, overlay, persistPost]);

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <div css={styledContent.side}>
          <Button as="button" variant="outline" size="sm" leftIcon="arrows/arrow-left-s-line" onClick={handleGoBack}>
            뒤로가기
          </Button>
        </div>
        <div css={styledContent.center} />
        <div css={styledContent.side}>
          <Button as="button" size="sm" rightIcon="arrows/arrow-right-s-line" onClick={openPreviewModal}>
            미리보기
          </Button>
        </div>
      </div>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  flex-grow: 0;
  flex-basis: auto;

  display: flex;
  align-items: center;
  margin-top: 32px;
  border-top: 1px solid ${theme.border};
`;

const styledContent = Object.assign(
  css`
    flex-grow: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    width: min(${breakpoints.md}px, calc(100% - 24px));
    height: 64px;
    margin: 0 auto;
  `,
  {
    side: css`
      flex-grow: 0;
      flex-basis: auto;
    `,

    center: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

export default PostEditorFooter;
