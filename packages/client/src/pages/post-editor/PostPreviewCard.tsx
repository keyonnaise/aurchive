import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Dropzone from '~components/form/Dropzone';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useUploadImageToCloudStorage } from '~hooks/queries/fileQueries';
import stripTags from '~lib/stripTags';
import ellipsis from '~styles/ellipsis';
import { usePublishPreviewContext } from './PublishPreviewModal';

function PostPreviewCard() {
  const { id, fields, setField, setIsPending } = usePublishPreviewContext();
  const { title, tags, body, thumbnail } = fields;

  const snackbar = useSnackbar();

  const { mutateAsync, isPending } = useUploadImageToCloudStorage({
    onMutate: () => setIsPending(true),
    onSettled: () => setIsPending(false),
  });

  const handleFileSelect = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append('image', file, file.name);

      const mutation = async () => {
        const data = await mutateAsync({ formData, usedIn: 'post', directoryName: id });
        setField('thumbnail', data);
      };

      snackbar.promise(mutation(), {
        pending: '이미지를 업로드 하고 있어요.',
        success: '이미지가 정상적으로 업로드됐어요.',
        error: '이미지를 업로드하는 도중 오류가 발생했어요.',
      });
    },
    [id, snackbar, mutateAsync, setField],
  );

  return (
    <div css={styledContainer}>
      <Dropzone
        width={480}
        height={300}
        title="클릭해서 썸네일을 업로드 해주세요."
        description="GIF, JPG or PNG. (320×200px)"
        placeholder={thumbnail || undefined}
        accept={['image/gif', 'image/jpeg', 'image/png']}
        maxFileSize={1024 * 1024}
        isDisabled={isPending}
        isPending={isPending}
        onSelect={handleFileSelect}
      />
      <div css={styledContent}>
        <p css={styledInfo}>
          <span css={styledInfo.label}>발행일</span>
          <time css={styledInfo.date}>0000.00.00</time>
        </p>
        <h2 css={styledTitle}>{title}</h2>
        <p css={styledBody}>{stripTags(body)}</p>
      </div>
      <div css={styledFooter}>
        <p css={styledTags}>
          {tags
            .split(',')
            .filter((tag) => tag !== '')
            .map((tag, i) => (
              <span key={i}>#{tag}&nbsp;</span>
            ))}
        </p>
      </div>
    </div>
  );
}

// Styles
const styledContainer = (theme: Theme) => css`
  width: 320px;
  max-width: 100%;
  padding: 4px;
  color: ${theme.text.main};
  background-color: ${theme.background.sub};
  border-radius: ${theme.radii.md};
`;

const styledContent = css`
  height: 137.2px; // 137.2px
  padding: 16px 16px;
`;

const styledFooter = css`
  display: flex;
  align-items: center;
  height: 24px;
`;

const styledInfo = Object.assign(
  (theme: Theme) => css`
    display: flex;
    align-items: center;
    margin-bottom: 1lh;
    color: ${theme.text.third};
    font-size: 12px;
  `,
  {
    label: css`
      flex-grow: 0;
      flex-basis: auto;

      padding-right: 1ex;
      margin-right: 1ex;
      border-right: 1px solid currentColor;
    `,

    date: css`
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    `,
  },
);

const styledTitle = (theme: Theme) => [
  ellipsis.multiline(),

  css`
    margin-bottom: 0.5lh;
    font-size: 16px;
    font-weight: ${theme.weights.bold};
    line-height: 1.4;
  `,
];

const styledBody = (theme: Theme) => [
  ellipsis,

  css`
    color: ${theme.text.sub};
    font-size: 14px;
    line-height: 1.8;
  `,
];

const styledTags = (theme: Theme) => [
  ellipsis,

  css`
    color: ${theme.info.main};
    font-size: 12px;
  `,
];

export default PostPreviewCard;
