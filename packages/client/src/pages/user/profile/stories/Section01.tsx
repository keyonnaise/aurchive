import { useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import Br from '~components/atom/Br';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button, { UnstyledButton } from '~components/buttons/Button';
import Skeleton from '~components/feedback/Skeleton';
import Pagination from '~components/navigation/Pagination';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SSRSafeSuspense from '~components/utils/SSRSafeSuspense';
import { useGetStoriesQuery } from '~hooks/queries/storyQueries';
import { IStory } from '~lib/api/stories/types';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import pipe from '~lib/pipe';
import { useUserContext } from '~pages/user';
import ellipsis from '~styles/ellipsis';
import { setAlphaToHex } from '~styles/themes';

function Section01() {
  const { id } = useUserContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = pipe(
    searchParams.get('page'),
    (value) => Number(value),
    (value) => (Number.isInteger(value) && value > 1 ? value : 1),
  );

  return (
    <section>
      <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
        <SSRSafeSuspense fallback={<SuspenseFallback />}>
          <StoriesLoader
            author={id}
            page={page}
            prev={() => setSearchParams({ page: `${page - 1}` })}
            next={() => setSearchParams({ page: `${page + 1}` })}
          />
        </SSRSafeSuspense>
      </ErrorBoundary>
    </section>
  );
}

// Subcomponents
interface StoriesLoaderProps {
  author: string;
  page: number;
  prev(): void;
  next(): void;
}

const StoriesLoader = ({ author, page, prev, next }: StoriesLoaderProps) => {
  const { data } = useGetStoriesQuery({
    author,
    page,
    limit: 10,
    sort: 'desc',
  });
  const { list, pageCount } = data;

  return isNonEmptyArray(list) ? (
    <>
      <StoryBlockList list={list} />
      <Spacer y={4} />
      <Pagination page={page} pageCount={pageCount} prev={prev} next={next} />
    </>
  ) : (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h3" weight="extrabold">
          아직 발행된 스토리가 없어요.
        </Typography>
        <Typography variant="body1" color="sub">
          빠른 시일 내에 높은 완성도의 스토리를 작성할게요!
          <Br />
          조금만 기다려주세요. (｡•̀ᴗ-)✨
        </Typography>
      </div>
    </div>
  );
};

const SuspenseFallback = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <div key={i} css={styledStoryBlock}>
          <h2 css={styledStoryName}>
            <Skeleton width="40%" />
          </h2>
          <p css={styledStoryDescription}>
            <Skeleton width="60%" />
          </p>
        </div>
      ))}
    </>
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
          스토리를 불러오던 도중 문제가 발생했어요.
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

interface StoryBlockListProps {
  list: IStory[];
}

const StoryBlockList = ({ list }: StoryBlockListProps) => {
  return (
    <>
      {list.map(({ id, name, slug, description }) => (
        <UnstyledButton key={id} as="anchor" css={styledStoryBlock} to={`${slug}`}>
          <h2 css={styledStoryName}>{name}</h2>
          <p css={styledStoryDescription}>{description}</p>
        </UnstyledButton>
      ))}
    </>
  );
};

// Styles
const styledFallbackContainer = (theme: Theme) => css`
  display: flex;
  align-items: center;
  height: 560px;
  background-color: ${setAlphaToHex(theme.netural.main, 0.1)};
  border-radius: ${theme.radii.sm};
`;

const styledFallbackContent = css`
  padding: 0 16px;
  margin: 0 auto;
  text-align: center;
`;

const styledStoryBlock = (theme: Theme) => css`
  padding: 32px 0;
  border-bottom: 1px solid ${theme.border.netural};

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.4lh;
  }
`;

const styledStoryName = (theme: Theme) => [
  ellipsis,

  css`
    margin-bottom: 0.5lh;
    font-size: 26px;
    font-weight: ${theme.weights.extrabold};
    line-height: 1.6;
  `,
];

const styledStoryDescription = (theme: Theme) => [
  ellipsis,

  css`
    color: ${theme.text.sub};
    font-size: 16px;
    line-height: 1.8;
  `,
];

export default Section01;
