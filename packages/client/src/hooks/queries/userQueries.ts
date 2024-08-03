import { UseSuspenseQueryOptions, UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import getUser, { GetUserResult } from '~lib/api/users/getUser';
import { GetUsersQuery, GetUsersResult, getUsers } from '~lib/api/users/getUsers';

const queryKeys = {
  all: ['users'] as const,
  list: (query: GetUsersQuery) => [...queryKeys.all, query] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

export const useGetUserQuery = (
  id: string,
  options: Omit<
    UseSuspenseQueryOptions<GetUserResult, AxiosError, GetUserResult, ReturnType<typeof queryKeys.detail>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetUserResult, AxiosError> => {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.detail(id),

    queryFn() {
      return getUser(id);
    },
  });
};

export const useGetUsersQuery = (
  query: GetUsersQuery,
  options: Omit<
    UseSuspenseQueryOptions<GetUsersResult, AxiosError, GetUsersResult, ReturnType<typeof queryKeys.list>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetUsersResult, AxiosError> => {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.list(query),

    queryFn() {
      return getUsers(query);
    },
  });
};
