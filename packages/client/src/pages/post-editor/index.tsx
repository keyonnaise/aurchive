import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SEO from '~components/utils/SEO';
import { useGetPostQuery } from '~hooks/queries/postQueries';
import useEffectOnce from '~hooks/useEffectOnce';
import { IPost } from '~lib/api/posts/types';
import { assert } from '~lib/assert';
import useMyAccountStore from '~store/useMyAccountStore';
import PostEditor from './PostEditor';

function Index() {
  const [post, setPost] = useState<IPost>();

  const { id: userId } = useMyAccountStore(({ myAccount }) => myAccount!);
  const { id: postId } = useParams();

  const handleLoad = useCallback((post: IPost) => setPost(post), []);

  return (
    <>
      <SEO title="작성 중인 게시글" canonical="post-editor" />
      <ErrorBoundary fallback="에디터 준비 도중 문제가 발생했습니다.">
        <PostEditor author={userId} post={post} />
        {postId !== undefined && <PostLoader userId={userId} postId={postId} onLoad={handleLoad} />}
      </ErrorBoundary>
    </>
  );
}

// Subcomponents
interface PostLoaderProps {
  userId: string;
  postId: string;
  onLoad(post: IPost): void;
}

const PostLoader = ({ userId, postId, onLoad }: PostLoaderProps) => {
  const overlay = useOverlay();

  const { data } = useGetPostQuery(postId);
  const { author, ...rest } = data;
  const isAuthor = userId === author?.id;

  assert(isAuthor, '요청하신 게시글에 대한 접근 권한이 없습니다.');

  useEffectOnce(() => {
    const { lastHistory, isPublished } = rest;

    if (isPublished && lastHistory !== null) {
      // 포스트가 발행된 후 임시 저장된 데이터가 존재할 때
      const { savedAt: _savedAt, ...savedData } = lastHistory;

      const handleConfirm = () => onLoad({ ...data, ...savedData });
      const handleCancel = () => onLoad(data);

      overlay.open((props) => (
        <Confirm
          {...props}
          title="임시저장된 글이 있어요"
          description="임시저장된 글을 이어서 작성할까요?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ));
    } else if (!isPublished && lastHistory !== null) {
      // 포스트가 발행되지 않고 임시 저장된 데이터가 존재할 때
      const { savedAt: _savedAt, ...savedData } = lastHistory;

      onLoad({ ...data, ...savedData });
    } else {
      onLoad(data);
    }
  });

  return null;
};

export default Index;
