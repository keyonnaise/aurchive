import { useCallback, useEffect, useRef, useState } from 'react';
import { Theme, css } from '@emotion/react';
import { formatInTimeZone } from 'date-fns-tz';
import { useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import Chip from '~components/data-display/Chip';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useBaseStructureContext } from '~components/structure/BaseStructure';
import { useDeletePostMutation } from '~hooks/queries/postQueries';
import usePreservedCallback from '~hooks/usePreservedCallback';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import useMyAccountStore from '~store/useMyAccountStore';
import { breakpoints } from '~styles/media';

interface Props {
  id: string;
  author: string;
  publishedAt: number;
  title: string;
  cover: string | null;
  tags: string[];
}

function Cover({ id, author, publishedAt, title, cover, tags }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '0px 0px -100% 0px' });

  const { setHeaderColorScheme } = useBaseStructureContext();

  useEffect(() => {
    setHeaderColorScheme(isInView ? 'dark' : 'netural');

    return () => setHeaderColorScheme('netural');
  }, [isInView, setHeaderColorScheme]);

  const [isPending, setIsPending] = useState(false);

  const myAccount = useMyAccountStore(useShallow(({ myAccount }) => myAccount));
  const isAuthor = myAccount?.id === author;

  return (
    <div ref={containerRef} css={styledContainer({ background: cover })}>
      <div css={styledContent}>
        <Typography variant="h1" weight="extrabold">
          {title}
        </Typography>
        <Spacer y={0.5} />
        <Typography variant="body3" weight="light">
          작성일 {formatInTimeZone(publishedAt, 'Asia/Seoul', 'yyyy-MM-dd')}
        </Typography>
        {isNonEmptyArray(tags) && (
          <div css={styledTagList}>
            {tags.map((tag, i) => (
              <Chip key={i} variant="outline" colorScheme="light">
                {tag}
              </Chip>
            ))}
          </div>
        )}
        {isAuthor && (
          <div css={styledButtonGroup}>
            <UpdatePostButton id={id} isDisabled={isPending} />
            <DeletePostButton id={id} onMutate={() => setIsPending(true)} onSettled={() => setIsPending(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents
interface UpdatePostButtonProps {
  id: string;
  isDisabled: boolean;
}

const UpdatePostButton = ({ id, isDisabled }: UpdatePostButtonProps) => {
  return (
    <Button
      as="anchor"
      to={`/post-editor/${id}`}
      variant="outline"
      colorScheme="light"
      size="sm"
      leftIcon="document/article-fill"
      isDisabled={isDisabled}
    >
      수정하기
    </Button>
  );
};

interface DeletePostButtonProps {
  id: string;
  onMutate(): void;
  onSettled(): void;
}

const DeletePostButton = ({ id, onMutate: _onMutate, onSettled: _onSettled }: DeletePostButtonProps) => {
  const overlay = useOverlay();
  const snackbar = useSnackbar();

  const navigate = useNavigate();

  const onMutate = usePreservedCallback(_onMutate);
  const onSettled = usePreservedCallback(_onSettled);

  const { mutateAsync, isPending } = useDeletePostMutation({ onMutate, onSettled });

  const deletePost = useCallback(() => {
    const mutation = async () => {
      await mutateAsync(id);
      navigate('/posts', { replace: true });
    };

    const handleConfirm = () => {
      snackbar.promise(mutation(), {
        pending: '게시글을 삭제하고 있어요.',
        success: '게시글이 정상적으로 삭제 됐어요.',
        error: '게시글을 삭제하는 도중 오류가 발생했어요.',
      });
    };

    overlay.open((props) => (
      <Confirm
        {...props}
        title="게시글을 정말 삭제하시겠어요?"
        description="삭제된 게시글은 복구할 수 없어요."
        onConfirm={handleConfirm}
      />
    ));
  }, [id, overlay, snackbar, navigate, mutateAsync]);

  return (
    <Button
      as="button"
      colorScheme="danger"
      size="sm"
      leftIcon="system/delete-bin-line"
      onClick={deletePost}
      isLoading={isPending}
    >
      삭제하기
    </Button>
  );
};

// Styles
const styledContainer = ({ background }: { background: string | null }) => [
  (theme: Theme) => css`
    display: flex;
    align-items: end;
    height: 560px;
    color: ${theme.dark.contrast};
    background-color: ${theme.dark.main};
  `,

  background !== null &&
    css`
      background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${background});
      background-position: center center;
      background-size: cover;
    `,
];

const styledContent = css`
  width: min(${breakpoints.lg}px, calc(100% - 24px));
  padding: 80px 0;
  margin: 0 auto;
`;

const styledTagList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const styledButtonGroup = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;

export default Cover;
