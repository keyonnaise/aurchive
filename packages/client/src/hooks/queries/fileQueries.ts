import { UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import uploadImageToCloudStorage, {
  UploadImageParams,
  UploadImageResult,
} from '~lib/api/files/uploadImageToCloudStorage';

export function useUploadImageToCloudStorage(
  options: UseMutationOptions<UploadImageResult, AxiosError, UploadImageParams, unknown> = {},
): UseMutationResult<UploadImageResult, AxiosError, UploadImageParams> {
  return useMutation({
    ...options,

    mutationFn(params) {
      return uploadImageToCloudStorage(params);
    },
  });
}
