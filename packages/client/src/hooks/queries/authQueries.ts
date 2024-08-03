import {
  UseMutationOptions,
  UseMutationResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import authentication, { AuthenticationResult } from '~lib/api/auth/authentication';
import login, { LoginParams, LoginResult } from '~lib/api/auth/login';
import updateProfile, { UpdateProfileParams, UpdateProfileResult } from '~lib/api/auth/updateProfile';

export function useLoginMutation(
  options: UseMutationOptions<LoginResult, AxiosError, LoginParams, unknown> = {},
): UseMutationResult<LoginResult, AxiosError, LoginParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return login(params);
    },
  });
}

export function useAuthenticationQuery(
  options: Omit<
    UseSuspenseQueryOptions<AuthenticationResult, AxiosError, AuthenticationResult, string[]>,
    'queryKey'
  > = {},
): UseSuspenseQueryResult<AuthenticationResult, AxiosError> {
  return useSuspenseQuery({
    ...options,
    queryKey: ['authentication'],
    gcTime: 0,

    queryFn() {
      return authentication();
    },
  });
}

export function useUpdateProfileMutation(
  options: UseMutationOptions<UpdateProfileResult, AxiosError, UpdateProfileParams, unknown> = {},
): UseMutationResult<UpdateProfileResult, AxiosError, UpdateProfileParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return updateProfile(params);
    },
  });
}
