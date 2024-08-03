import { Suspense, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import Icon from '~components/atom/Icon';
import Spacer from '~components/atom/Spacer';
import Grid from '~components/layout/Grid';
import Modal from '~components/modals/Modal';
import { OverlayElementProps } from '~components/overlay/Overlay';
import useEffectOnce from '~hooks/useEffectOnce';
import usePreservedCallback from '~hooks/usePreservedCallback';
import { assert } from '~lib/assert';
import { FieldKey, Fields } from './PostEditor';
import PostPreviewCard from './PostPreviewCard';
import PublishSettings from './PublishSettings';

interface Props extends OverlayElementProps {
  id: string;
  author: string;
  fields: Fields;
  isPublished: boolean;
  onOpen(): void;
  onCancel(): void;
}

function PublishPreviewModal({
  id,
  author,
  fields,
  isPublished,
  isOpen,
  close,
  onOpen: _onOpen,
  onCancel: _onCancel,
}: Props) {
  const onOpen = usePreservedCallback(_onOpen);
  const onCancel = usePreservedCallback(_onCancel);

  useEffectOnce(() => {
    onOpen();
  });

  const handleClose = useCallback(() => {
    close();
    onCancel();
  }, [close, onCancel]);

  return (
    <Modal size="md" isOpen={isOpen}>
      <PublishPreviewProvider id={id} author={author} fields={fields} isPublished={isPublished}>
        <div css={styledContainer}>
          <Grid container gap={32}>
            <Grid item xs={12} md="auto">
              <PostPreviewCard />
            </Grid>
            <Grid item xs={12} md>
              <Suspense fallback={<SuspenseFallback />}>
                <PublishSettings onClose={handleClose} />
              </Suspense>
            </Grid>
          </Grid>
        </div>
      </PublishPreviewProvider>
    </Modal>
  );
}

// Context API
interface ContextState {
  id: string;
  author: string;
  fields: Fields;
  isPublished: boolean;
  isPending: boolean;
}

interface ContextActions {
  setField(key: FieldKey, value: string): void;
  setFields(fields: Fields): void;
  setIsPending(isPending: boolean): void;
}

export type ContextType = ContextState & ContextActions;

const PublishPreviewContext = createContext<ContextType | null>(null);

export function usePublishPreviewContext() {
  const ctx = useContext(PublishPreviewContext);

  assert(ctx !== null, `usePublishPreviewContext 함수는 PublishPreviewProvider 컴포넌트 내에서만 사용할 수 있습니다.`);

  return ctx;
}

interface ProviderProps {
  id: string;
  author: string;
  fields: Fields;
  isPublished: boolean;
  children: React.ReactNode;
}

function PublishPreviewProvider({ id, author, fields, isPublished, children }: ProviderProps) {
  const [state, setState] = useState<ContextState>({ id, author, fields, isPublished, isPending: false });

  const actions = useMemo<ContextActions>(
    () => ({
      setField(key, value) {
        setState((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
      },

      setFields(fields) {
        setState((prev) => ({ ...prev, fields }));
      },

      setIsPending(isPending) {
        setState((prev) => ({ ...prev, isPending }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  return <PublishPreviewContext.Provider value={value}>{children}</PublishPreviewContext.Provider>;
}

// Subcomponent
const SuspenseFallback = () => {
  return (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Icon icon="system/loader" inline />
        <Spacer />
        <p>설정 데이터를 불러오는 중이에요</p>
      </div>
    </div>
  );
};

// Styles
const styledContainer = css`
  width: 100%;
  padding: 16px;
`;

const styledFallbackContainer = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const styledFallbackContent = css`
  padding: 0 16px;
  margin: 0 auto;
  text-align: center;
`;

export default PublishPreviewModal;
