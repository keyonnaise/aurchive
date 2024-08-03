import { Children, useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import Br from '~components/atom/Br';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import PostCard, { PostCardSkeleton } from '~components/data-display/PostCard';
import Grid from '~components/layout/Grid';
import Pagination from '~components/navigation/Pagination';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SSRSafeSuspense from '~components/utils/SSRSafeSuspense';
import { useGetPostsQuery } from '~hooks/queries/postQueries';
import { IPost } from '~lib/api/posts/types';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import pipe from '~lib/pipe';
import { useUserContext } from '~pages/user';
import { useStoryContext } from '.';

function Section01() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = pipe(
    searchParams.get('page'),
    (value) => Number(value),
    (value) => (Number.isInteger(value) && value > 1 ? value : 1),
  );

  return (
    <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
      <SSRSafeSuspense fallback={<SuspenseFallback />}>
        <PostsLoader
          page={page}
          prev={() => setSearchParams({ page: `${page - 1}` })}
          next={() => setSearchParams({ page: `${page + 1}` })}
        />
      </SSRSafeSuspense>
    </ErrorBoundary>
  );
}

// Subcomponents
interface PostsLoaderProps {
  page: number;
  prev(): void;
  next(): void;
}

const PostsLoader = ({ page, prev, next }: PostsLoaderProps) => {
  const user = useUserContext();
  const story = useStoryContext();

  const { data } = useGetPostsQuery({
    page,
    author: user.id,
    story: story.id,
    published: true,
    limit: 12,
    sort: 'desc',
  });
  const { list, pageCount } = data;

  return isNonEmptyArray(list) ? (
    <>
      <PostCardList list={list} />
      <Spacer y={4} />
      <Pagination page={page} pageCount={pageCount} prev={prev} next={next} />
    </>
  ) : (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h3" weight="extrabold">
          아직 스토리에 발행된 포스트가 없어요.
        </Typography>
        <Typography variant="body1" color="sub">
          빠른 시일 내에 높은 완성도의 포스트를 작성할게요!
          <Br />
          조금만 기다려주세요. (｡•̀ᴗ-)✨
        </Typography>
      </div>
    </div>
  );
};

const SuspenseFallback = () => {
  return (
    <CardList>
      {[...Array(12)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </CardList>
  );
};

interface ErrorFallbackProps {
  onResolveError(): void;
}

const ErrorFallback = ({ onResolveError }: ErrorFallbackProps) => {
  const handleResolveError = useCallback(() => {
    window.location.reload();
    onResolveError();
  }, [onResolveError]);

  return (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h3" weight="extrabold">
          Opps! ヽ(°〇°)ﾉ
        </Typography>
        <Typography variant="body1" color="sub">
          포스트를 불러오던 도중 문제가 발생했어요.
          <Br />
          페이지를 새로고침 해주세요.
        </Typography>
        <Spacer y={2} />
        <Button as="button" shape="round" inline onClick={handleResolveError}>
          새로고침
        </Button>
      </div>
    </div>
  );
};

interface PostCardListProps {
  list: IPost[];
}

const PostCardList = ({ list }: PostCardListProps) => {
  return (
    <CardList>
      {list.map(({ id, publishedAt, title, tags, thumbnail, body }) => (
        <PostCard
          key={id}
          id={id}
          publishedAt={publishedAt}
          title={title}
          tags={tags}
          thumbnail={thumbnail}
          body={body}
        />
      ))}
    </CardList>
  );
};

interface CardListProps {
  children: React.ReactNode;
}

const CardList = ({ children }: CardListProps) => {
  return (
    <Grid container>
      {Children.map(children, (child, i) => (
        <Grid key={i} item xs={12} sm={6} lg={4} xl={3}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

// Styles
const styledFallbackContainer = (theme: Theme) => css`
  display: flex;
  align-items: center;
  height: 560px;
  background-color: ${theme.netural.alpha(0.1)};
  border-radius: ${theme.radii.sm};
`;

const styledFallbackContent = css`
  padding: 0 16px;
  margin: 0 auto;
  text-align: center;
`;

export default Section01;
