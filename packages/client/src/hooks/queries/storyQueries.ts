import {
  UseMutationOptions,
  UseMutationResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import deleteStory from '~lib/api/stories/deleteStory';
import editStory, { EditStoryParams, EditStoryResult } from '~lib/api/stories/editStory';
import getStories, { GetStoriesQuery, GetStoriesResult } from '~lib/api/stories/getStories';
import getStory, { GetStoryQuery, GetStoryResult } from '~lib/api/stories/getStory';
import updateStory, { UpdateStoryParams, UpdateStoryResult } from '~lib/api/stories/updateStory';
import { queryClient } from './queryClient';

const queryKeys = {
  all: ['stories'] as const,
  list: (query: GetStoriesQuery) => [...queryKeys.all, query] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

export function useGetStoryQuery(
  query: GetStoryQuery,
  options: Omit<
    UseSuspenseQueryOptions<GetStoryResult, AxiosError, GetStoryResult, ReturnType<typeof queryKeys.detail>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetStoryResult, AxiosError> {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.detail(`${query.author}-${query.slug}`),

    queryFn() {
      return getStory(query);
    },
  });
}

export function useGetStoriesQuery(
  query: GetStoriesQuery,
  options: Omit<
    UseSuspenseQueryOptions<GetStoriesResult, AxiosError, GetStoriesResult, ReturnType<typeof queryKeys.list>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetStoriesResult, AxiosError> {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.list(query),

    queryFn() {
      return getStories(query);
    },
  });
}

export function useEditStoryMutation(
  options: UseMutationOptions<EditStoryResult, AxiosError, EditStoryParams, unknown> = {},
): UseMutationResult<EditStoryResult, AxiosError, EditStoryParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return editStory(params);
    },

    onSuccess(data, ...args) {
      queryClient.resetQueries({ queryKey: queryKeys.all });

      options.onSuccess?.(data, ...args);
    },
  });
}

export function useUpdateStoryMutation(
  options: UseMutationOptions<UpdateStoryResult, AxiosError, UpdateStoryParams, unknown> = {},
): UseMutationResult<UpdateStoryResult, AxiosError, UpdateStoryParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return updateStory(params);
    },

    onSuccess(data, ...args) {
      queryClient.resetQueries({ queryKey: queryKeys.all });

      options.onSuccess?.(data, ...args);
    },
  });
}

export function useDeleteStoryMutation(
  options: UseMutationOptions<void, AxiosError, string, unknown> = {},
): UseMutationResult<void, AxiosError, string> {
  return useMutation({
    ...options,

    mutationFn(id) {
      return deleteStory(id);
    },

    onSuccess(...args) {
      queryClient.resetQueries({ queryKey: queryKeys.all });

      options.onSuccess?.(...args);
    },
  });
}
