import { useCallback } from 'react';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import getByteSize from '~lib/getByteSize';
import openFileSelector from '~lib/openFileSelector';

export default function useFileSelector() {
  const snackbar = useSnackbar();

  return useCallback(
    async ({ accept, maxFileSize }: { accept: string[]; maxFileSize: number }) => {
      try {
        return await openFileSelector({ accept, maxFileSize });
      } catch (error: any) {
        let description: string;

        switch (error.message) {
          case 'invalid-file-type': {
            description = '잘못된 파일 형식이에요. 파일의 확장자를 확인해주세요.';

            break;
          }

          case 'file-size-limit-exceeded': {
            description = `파일 용량은 ${getByteSize(maxFileSize)}를 넘을 수 없어요.`;

            break;
          }

          default: {
            description = '파일 선택 도중 알 수 없는 오류가 발생했어요.';

            break;
          }
        }

        snackbar({
          description,
          severity: 'warning',
          icon: 'system/error-warning-line',
          title: 'Opps! 문제가 발생했어요!',
        });

        throw error;
      }
    },
    [snackbar],
  );
}
