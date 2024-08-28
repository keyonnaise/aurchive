import { useCallback, useEffect } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Divider from '~components/atom/Divider';
import Button from '~components/buttons/Button';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { usePublishPostMutation, useUpdatePostMutation } from '~hooks/queries/postQueries';
import { usePublishPreviewContext } from './PublishPreviewModal';
import SettingStory from './SettingStory';

interface Props {
  onClose(): void;
}

function PublishSettings({ onClose }: Props) {
  const { id, author, fields, isPublished, setIsPending } = usePublishPreviewContext();

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const { mutateAsync: updatePost, isPending: isPendingUpdate } = useUpdatePostMutation();
  const { mutateAsync: publishPost, isPending: isPendingPublish } = usePublishPostMutation();
  const isPending = isPendingUpdate || isPendingPublish;

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  const handleUpdateOrPublishPost = useCallback(() => {
    const transition = isPublished ? updatePost : publishPost;

    const mutation = async () => {
      const result = await transition({
        id,
        author,
        title: fields.title,
        story: fields.story,
        tags: fields.tags.split(',').filter((tag) => tag !== ''),
        cover: fields.cover || null,
        thumbnail: fields.thumbnail || null,
        body: fields.body,
      });

      navigate(`/posts/${result}`, { replace: true });
    };

    snackbar.promise(mutation(), {
      pending: '게시글을 발행하고 있어요.',
      success: '게시글이 정상적으로 발행됐어요.',
      error: '게시글을 발행하는 도중 오류가 발생했어요.',
    });
  }, [id, author, fields, isPublished, snackbar, navigate, updatePost, publishPost]);

  return (
    <div css={styledContainer}>
      <div css={styledContent}>
        <SettingStory />
      </div>
      <Divider offset={2}>모든 항목을 작성하셨나요?</Divider>
      <div css={styledFooter}>
        <Button as="button" variant="outline" size="sm" fullWidth onClick={onClose}>
          취소
        </Button>
        <Button as="button" colorScheme="info" size="sm" fullWidth onClick={handleUpdateOrPublishPost}>
          발행 하기
        </Button>
      </div>
    </div>
  );
}

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const styledContent = css`
  flex-grow: 1;
  flex-basis: 0;
`;

const styledFooter = css`
  flex-grow: 0;
  flex-basis: auto;

  display: flex;
  gap: 8px;
`;

export default PublishSettings;
