import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Confirm from '~components/modals/Confirm';
import useOverlay from '~components/overlay/hooks/useOverlay';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SEO from '~components/utils/SEO';
import { useGetPostQuery } from '~hooks/queries/postQueries';
import useEffectOnce from '~hooks/useEffectOnce';
import { IPost } from '~lib/api/posts/types';
import PostEditor from './PostEditor';

function Index() {
  const [post, setPost] = useState<IPost>();
  const { postId } = useParams();

  const handlePostLoaded = useCallback((post: IPost) => setPost(post), []);

  return (
    <>
      <SEO title="작성 중인 게시글" canonical="post-editor" />
      <ErrorBoundary fallback="에디터 준비 도중 문제가 발생했습니다.">
        <PostEditor post={post} />
        {postId !== undefined && <PostLoader id={postId} onLoaded={handlePostLoaded} />}
      </ErrorBoundary>
    </>
  );
}

// Subcomponents
interface PostLoaderProps {
  id: string;
  onLoaded(post: IPost): void;
}

const PostLoader = ({ id, onLoaded }: PostLoaderProps) => {
  const overlay = useOverlay();

  const { data } = useGetPostQuery(id);

  useEffectOnce(() => {
    const { lastHistory, isPublished } = data;

    if (isPublished && lastHistory !== null) {
      // 포스트가 발행된 후 임시 저장된 데이터가 존재할 때
      const { savedAt: _savedAt, ...savedData } = lastHistory;

      const handleConfirm = () => onLoaded({ ...data, ...savedData });
      const handleCancel = () => onLoaded(data);

      overlay.open((props) => (
        <Confirm
          {...props}
          title="임시저장된 글이 있어요."
          description="임시저장된 글을 계속 이어서 쓸까요?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ));
    } else if (!isPublished && lastHistory !== null) {
      // 포스트가 발행되지 않고 임시 저장된 데이터가 존재할 때
      const { savedAt: _savedAt, ...savedData } = lastHistory;

      onLoaded({ ...data, ...savedData });
    } else {
      onLoaded({ ...data });
    }
  });

  return null;
};

export default Index;
