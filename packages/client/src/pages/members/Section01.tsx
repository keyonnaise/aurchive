import React, { Children, useCallback } from 'react';
import { Theme, css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import Br from '~components/atom/Br';
import Section from '~components/atom/Section';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import Button from '~components/buttons/Button';
import UserCard, { UserCardSkeleton } from '~components/data-display/UserCard';
import Grid from '~components/layout/Grid';
import Pagination from '~components/navigation/Pagination';
import ErrorBoundary from '~components/utils/ErrorBoundary';
import SSRSafeSuspense from '~components/utils/SSRSafeSuspense';
import { useGetUsersQuery } from '~hooks/queries/userQueries';
import { IUser } from '~lib/api/users/types';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import pipe from '~lib/pipe';

function Section01() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = pipe(
    searchParams.get('page'),
    (value) => Number(value),
    (value) => (Number.isInteger(value) && value > 1 ? value : 1),
  );

  return (
    <Section>
      <ErrorBoundary fallback={({ onResolveError }) => <ErrorFallback onResolveError={onResolveError} />}>
        <SSRSafeSuspense fallback={<SuspenseFallback />}>
          <UsersLoader
            page={page}
            prev={() => setSearchParams({ page: `${page - 1}` })}
            next={() => setSearchParams({ page: `${page + 1}` })}
          />
        </SSRSafeSuspense>
      </ErrorBoundary>
    </Section>
  );
}

// Subcomponents
interface UsersLoaderProps {
  page: number;
  prev(): void;
  next(): void;
}

const UsersLoader = ({ page, prev, next }: UsersLoaderProps) => {
  const { data } = useGetUsersQuery({
    page,
    limit: 12,
    sort: 'desc',
  });
  const { list: users, pageCount } = data;

  return isNonEmptyArray(users) ? (
    <>
      <UserCardList users={users} />
      <Spacer y={4} />
      <Pagination page={page} pageCount={pageCount} prev={prev} next={next} />
    </>
  ) : (
    <div css={styledFallbackContainer}>
      <div css={styledFallbackContent}>
        <Typography variant="h3" weight="extrabold">
          아직 가입된 멤버가 없어요.
        </Typography>
        <Typography variant="body1" color="sub">
          빠른 시일 내에 멤버를 모집해 높은 완성도의 콘텐츠를 제작할게요!
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
        <UserCardSkeleton key={i} />
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
          멤버를 불러오던 도중 문제가 발생했어요.
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

interface UserCardListProps {
  users: IUser[];
}

const UserCardList = ({ users }: UserCardListProps) => {
  return (
    <CardList>
      {users.map((user) => (
        <UserCard key={user.id} {...user} />
      ))}
    </CardList>
  );
};

interface CardListProps {
  children: React.ReactNode;
}

const CardList = ({ children }: CardListProps) => {
  return (
    <Grid container gap={32}>
      {Children.map(children, (child, i) => (
        <Grid key={i} item xs={12} md={6} lg={4}>
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
