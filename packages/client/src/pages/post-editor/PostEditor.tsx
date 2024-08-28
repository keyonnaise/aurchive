import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { MEDIA_STORAGE } from '~constants';
import usePreservedCallback from '~hooks/usePreservedCallback';
import useUpdateEffect from '~hooks/useUpdateEffect';
import { IPost } from '~lib/api/posts/types';
import { assert } from '~lib/assert';
import PostEditorContent from './PostEditorContent';
import PostEditorFooter from './PostEditorFooter';
import PostEditorHeader from './PostEditorHeader';
import usePersistPost from './hooks/usePersistPost';

interface Props {
  author: string;
  post: IPost | undefined;
}

function PostEditor({ author, post }: Props) {
  return (
    <PostEditorProvider author={author} post={post}>
      <div css={styledContainer}>
        <PostEditorHeader />
        <PostEditorContent />
        <PostEditorFooter />
      </div>
      <AutoSave />
    </PostEditorProvider>
  );
}

// Context API
const fieldKeys = ['title', 'story', 'tags', 'cover', 'thumbnail', 'body'] as const;

export type FieldKey = (typeof fieldKeys)[number];
export type Fields = Record<FieldKey, string>;

interface ContextState {
  id: string | undefined;
  author: string;
  fields: Fields;
  isPublished: boolean;
  isCoverExpended: boolean;
  isAutoSaveEnable: boolean;
}

interface ContextActions {
  setId(id: string): void;
  setField(key: FieldKey, value: string): void;
  setFields(fields: Fields): void;
  expandCover(): void;
  collapseCover(): void;
  enableAutoSave(): void;
  disableAutoSave(): void;
}

export type ContextType = ContextState & ContextActions;

const PostEditorContext = createContext<ContextType | null>(null);

export function usePostEditorContext() {
  const ctx = useContext(PostEditorContext);

  assert(ctx !== null, 'usePostContext 함수는 PostEditorProvier 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface ProviderProps {
  author: string;
  post: IPost | undefined;
  children: React.ReactNode;
}

function PostEditorProvider({ author, post, children }: ProviderProps) {
  const [state, setState] = useState<ContextState>({
    author,
    id: undefined,
    fields: {
      title: '',
      tags: '',
      story: '',
      cover: '',
      thumbnail: `${MEDIA_STORAGE}%2Fstatic%2Fpost_default-thumbnail.png?alt=media`,
      body: '',
    },
    isPublished: false,
    isCoverExpended: true,
    isAutoSaveEnable: false,
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setId(id) {
        setState((prev) => ({ ...prev, id }));
      },

      setField(key, value) {
        setState((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
      },

      setFields(fields) {
        setState((prev) => ({ ...prev, fields }));
      },

      expandCover() {
        setState((prev) => ({ ...prev, isCoverExpended: true }));
      },

      collapseCover() {
        setState((prev) => ({ ...prev, isCoverExpended: false }));
      },

      enableAutoSave() {
        setState((prev) => ({ ...prev, isAutoSaveEnable: true }));
      },

      disableAutoSave() {
        setState((prev) => ({ ...prev, isAutoSaveEnable: false }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  useEffect(() => {
    if (post === undefined) return;

    setState((prev) => ({
      ...prev,
      id: post.id,
      fields: {
        title: post.title,
        tags: post.tags.join(','),
        story: post.story || '',
        cover: post.cover || '',
        thumbnail: post.thumbnail || '',
        body: post.body,
      },
      isPublished: post.isPublished,
    }));
  }, [post]);

  return <PostEditorContext.Provider value={value}>{children}</PostEditorContext.Provider>;
}

// Subcomponents
const AutoSave = () => {
  const { id, author, fields, isAutoSaveEnable, setId, enableAutoSave, disableAutoSave } = usePostEditorContext();

  const persistPost = usePersistPost();
  const snackbar = useSnackbar();

  const handlePersistPost = usePreservedCallback(() => {
    if (!isAutoSaveEnable) return;

    const mutation = async () => {
      const currentId = await persistPost({ id, author, fields });
      setId(currentId);
      disableAutoSave();
      console.log('임시저장');
    };

    snackbar.promise(mutation(), {
      pending: '포스트를 임시저장 하고 있어요.',
      success: '포스트를 임시저장했어요.',
      error: '포스트를 임시저장하는 도중 오류가 발생했어요',
    });
  });

  useUpdateEffect(() => {
    enableAutoSave();

    const timer = setTimeout(handlePersistPost, 30 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [fields]);
  return null;
};

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

export default PostEditor;
