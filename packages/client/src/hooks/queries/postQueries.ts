import {
  UseMutationOptions,
  UseMutationResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import deletePost from '~lib/api/posts/deletePost';
import editPost, { EditPostParams, EditPostResult } from '~lib/api/posts/editPost';
import getPost, { GetPostResult } from '~lib/api/posts/getPost';
import getPosts, { GetPostsQuery, GetPostsResult } from '~lib/api/posts/getPosts';
import publishPost, { PublishPostParams, PublishPostResult } from '~lib/api/posts/publishPost';
import savePost, { SavePostParams, SavePostResult } from '~lib/api/posts/savePost';
import updatePost, { UpdatePostParams, UpdatePostResult } from '~lib/api/posts/updatePost';
import { queryClient } from './queryClient';

const queryKeys = {
  all: ['posts'] as const,
  list: (query: GetPostsQuery) => [...queryKeys.all, query] as const,
  detail: (id: string) => [...queryKeys.all, id] as const,
};

export function useGetPostQuery(
  id: string,
  options: Omit<
    UseSuspenseQueryOptions<GetPostResult, AxiosError, GetPostResult, ReturnType<typeof queryKeys.detail>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetPostResult, AxiosError> {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.detail(id),

    queryFn() {
      return getPost(id);
    },
  });
}

export function useGetPostsQuery(
  query: GetPostsQuery,
  options: Omit<
    UseSuspenseQueryOptions<GetPostsResult, AxiosError, GetPostsResult, ReturnType<typeof queryKeys.list>>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<GetPostsResult, AxiosError> {
  return useSuspenseQuery({
    ...options,
    queryKey: queryKeys.list(query),

    queryFn() {
      return getPosts(query);
    },
  });
}

export function useEditPostMutation(
  options: UseMutationOptions<EditPostResult, AxiosError, EditPostParams, unknown> = {},
): UseMutationResult<EditPostResult, AxiosError, EditPostParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return editPost(params);
    },

    onSuccess(data, ...args) {
      queryClient.removeQueries({ queryKey: queryKeys.all });
      options.onSuccess?.(data, ...args);
    },
  });
}

export function usePublishPostMutation(
  options: UseMutationOptions<PublishPostResult, AxiosError, PublishPostParams, unknown> = {},
): UseMutationResult<PublishPostResult, AxiosError, PublishPostParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return publishPost(params);
    },

    onSuccess(data, ...args) {
      queryClient.removeQueries({ queryKey: queryKeys.all });
      options.onSuccess?.(data, ...args);
    },
  });
}

export function useSavePostMutation(
  options: UseMutationOptions<SavePostResult, AxiosError, SavePostParams, unknown> = {},
): UseMutationResult<SavePostResult, AxiosError, SavePostParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return savePost(params);
    },

    onSuccess(data, ...args) {
      queryClient.removeQueries({ queryKey: queryKeys.all });
      options.onSuccess?.(data, ...args);
    },
  });
}

export function useUpdatePostMutation(
  options: UseMutationOptions<UpdatePostResult, AxiosError, UpdatePostParams, unknown> = {},
): UseMutationResult<UpdatePostResult, AxiosError, UpdatePostParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return updatePost(params);
    },

    onSuccess(data, ...args) {
      queryClient.removeQueries({ queryKey: queryKeys.all });
      options.onSuccess?.(data, ...args);
    },
  });
}

export function useDeletePostMutation(
  options: UseMutationOptions<void, AxiosError, string, unknown> = {},
): UseMutationResult<void, AxiosError, string> {
  return useMutation({
    ...options,

    mutationFn(id) {
      return deletePost(id);
    },

    onSuccess(...args) {
      queryClient.resetQueries({ queryKey: queryKeys.all });

      options.onSuccess?.(...args);
    },
  });
}
