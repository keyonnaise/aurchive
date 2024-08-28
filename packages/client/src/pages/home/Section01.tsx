import { Children, useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import Anchor from '~components/atom/Anchor';
import Br from '~components/atom/Br';
import Section from '~components/atom/Section';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Summary from '~components/box/Summary';
import Button from '~components/buttons/Button';
import PostCard, { PostCardSkeleton } from '~components/data-display/PostCard';
import Grid from '~components/layout/Grid';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SSRSafeSuspense from '~components/utils/SSRSafeSuspense';
import { useGetPostsQuery } from '~hooks/queries/postQueries';
import { IPost } from '~lib/api/posts/types';
import isNonEmptyArray from '~lib/isNonEmptyArray';

function Section01() {
  return (
    <Section>
      <Summary icon="document/article-fill" label="최신 글">
        <Anchor css={styledAnchor} to="/posts" underline="hover">
          전체 글 보기
        </Anchor>
      </Summary>
      <Spacer y={4} />
      <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
        <SSRSafeSuspense fallback={<SuspenseFallback />}>
          <PostsLoader />
        </SSRSafeSuspense>
      </ErrorBoundary>
    </Section>
  );
}

// Subcomponents
const PostsLoader = () => {
  const { data } = useGetPostsQuery({
    published: true,
    page: 1,
    limit: 4,
    sort: 'desc',
  });
  const { list } = data;

  return isNonEmptyArray(list) ? (
    <PostCardList list={list} />
  ) : (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h3" weight="extrabold">
          아직 발행된 포스트가 없어요.
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

interface PostCardListProps {
  list: IPost[];
}

const PostCardList = ({ list }: PostCardListProps) => {
  return (
    <CardList>
      {list.map(({ id, author, publishedAt, title, tags, thumbnail, body }) => (
        <PostCard
          key={id}
          id={id}
          displayName={author?.displayName}
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

const SuspenseFallback = () => {
  return (
    <CardList>
      {[...Array(4)].map((_, i) => (
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

const styledAnchor = css`
  font-size: 12px;
`;

export default Section01;
