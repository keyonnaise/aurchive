import React, { useCallback } from 'react';
import { css, Theme } from '@emotion/react';
import Spacer from '~components/atom/Spacer';
import Textarea from '~components/atom/Textarea';
import Button from '~components/buttons/Button';
import Chip from '~components/data-display/Chip';
import TextField from '~components/form/TextField';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import media, { breakpoints } from '~styles/media';
import { FieldKey, usePostEditorContext } from './PostEditor';
import useUploadImageForPost from './hooks/useUploadImageForPost';
import useFileSelector from '../../hooks/useFileSelector';

type ChangeEvent<T> = T extends HTMLInputElement
  ? React.ChangeEvent<T>
  : T extends HTMLTextAreaElement
    ? React.ChangeEvent<T>
    : never;

function PostEditorHeader() {
  const context = usePostEditorContext();
  const { fields, isCoverExpended, setField } = context;

  const getFieldAttributes = useCallback(
    (key: FieldKey) => ({
      name: key,
      value: fields[key],

      onChange<T>(e: ChangeEvent<T>) {
        let value = e.target.value;

        switch (key) {
          case 'title': {
            value = value.replace(/^\s*|\n/gm, '');

            break;
          }

          case 'tags': {
            value = value.replace(/^(?:\s|,)*|(\s|,)+/g, '$1');

            if (value.at(-1) === ',') {
              const words = value.split(',');
              const uniqueWords = new Set(words);

              value = [...uniqueWords].join(',');
            }

            break;
          }

          default: {
            break;
          }
        }

        setField(key, value);
      },
    }),
    [fields, setField],
  );

  return (
    <div
      css={styledContainer({
        background: fields.cover || '',
        isVisible: isCoverExpended,
      })}
    >
      <div css={styledContent}>
        <Textarea
          {...getFieldAttributes('title')}
          css={styledTitleField}
          placeholder="제목을 입력해주세요."
          rows={2}
          maxLength={100}
        />
        <Spacer y={1} />
        <TextField
          {...getFieldAttributes('tags')}
          variant="text"
          colorScheme="light"
          addonBefore={{
            type: 'ICON',
            icon: 'editor/hashtag',
          }}
          message="태그는 쉼표로 구분됩니다."
          placeholder="태그를 입력해주세요."
        />
        <TagList />
        <Spacer y={1} />
        <div css={styledButtonGroup}>
          <UploadCoverImageButton />
        </div>
      </div>
      <div css={styledFooter}>
        <ExpandCoverButton />
      </div>
    </div>
  );
}

// Subcomponents
const TagList = () => {
  const { fields, setField } = usePostEditorContext();
  const tagsToArray = fields.tags.split(',').filter((tag) => tag !== '');

  const handleTagClick = useCallback(
    (tag: string) => () => {
      const pattern = new RegExp(`${tag},*`);
      const result = fields.tags.replace(pattern, '');

      setField('tags', result);
    },
    [fields, setField],
  );

  if (!isNonEmptyArray(tagsToArray)) return null;

  return (
    <div css={styledTagList}>
      {tagsToArray.map((tag, i) => (
        <Chip
          key={i}
          as="button"
          variant="outline"
          colorScheme="light"
          rightIcon="system/close-circle-line"
          onClick={handleTagClick(tag)}
        >
          {tag}
        </Chip>
      ))}
    </div>
  );
};

const UploadCoverImageButton = () => {
  const context = usePostEditorContext();
  const { setField } = context;

  const snackbar = useSnackbar();
  const selectFile = useFileSelector();

  const { mutateAsync, isPending } = useUploadImageForPost(context);

  const handleClick = useCallback(async () => {
    const accept = ['image/gif', 'image/jpeg', 'image/png'];
    const maxFileSize = 1024 * 1024;
    const file = await selectFile({ accept, maxFileSize });

    const mutation = async () => setField('cover', await mutateAsync(file));

    snackbar.promise(mutation(), {
      pending: '이미지를 업로드 하고 있어요.',
      success: '이미지가 정상적으로 업로드됐어요.',
      error: '이미지를 업로드하는 도중 오류가 발생했어요.',
    });
  }, [snackbar, setField, selectFile, mutateAsync]);

  return (
    <Button
      as="button"
      variant="outline"
      colorScheme="light"
      size="sm"
      leftIcon="document/file-image-line"
      isLoading={isPending}
      onClick={handleClick}
    >
      커버 이미지 업로드
    </Button>
  );
};

const ExpandCoverButton = () => {
  const { isCoverExpended, expandCover } = usePostEditorContext();

  if (isCoverExpended) return null;

  return (
    <Button as="button" shape="round" colorScheme="light" rightIcon="arrows/arrow-down-s-line" onClick={expandCover}>
      커버 보기
    </Button>
  );
};

// Styles
const styledContainer =
  ({ background, isVisible }: { background: string; isVisible: boolean }) =>
  (theme: Theme) => [
    css`
      flex-grow: 0;
      flex-basis: ${isVisible ? '560px' : '80px'};

      position: relative;
      display: flex;
      align-items: end;
      overflow: hidden;
      color: ${theme.dark.contrast};
      background: ${theme.dark.main};
      border-bottom: 1px solid ${theme.border};
      transition: flex-basis 400ms ease;
    `,

    background !== '' &&
      css`
        background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${background});
        background-position: center center;
        background-size: cover;
      `,
  ];

const styledContent = css`
  flex-grow: 0;
  flex-basis: auto;

  width: min(${breakpoints.md}px, calc(100% - 24px));
  padding: 80px 0;
  margin: 0 auto;
`;

const styledFooter = css`
  position: absolute;
  inset: auto auto 0 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  height: 80px;
  margin: 0 auto;
`;

const styledTitleField = (theme: Theme) => css`
  width: 100%;
  font-weight: ${theme.weights.extrabold};
  line-height: 1.4;

  &:focus {
    color: ${theme.info.main};
  }

  ${media.xs} {
    font-size: 32px;
  }

  ${media.md} {
    font-size: 40px;
  }

  ${media.lg} {
    font-size: 48px;
  }
`;

const styledTagList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const styledButtonGroup = css`
  display: flex;
  justify-content: end;
`;

export default PostEditorHeader;
