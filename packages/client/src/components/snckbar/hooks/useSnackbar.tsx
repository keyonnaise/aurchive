import { useShallow } from 'zustand/react/shallow';
import uniqueId from '~lib/uniqueId';
import useSnackbarGroupStore, { SnackbarData } from '~store/useSnackbarGroupStore';

export default function useSnackbar() {
  const { enqueue, update, remove } = useSnackbarGroupStore(
    useShallow(({ enqueue, update, remove }) => ({ enqueue, update, remove })),
  );

  return Object.assign(
    function (data: SnackbarData) {
      const id = uniqueId();

      enqueue(id, data);

      return id;
    },
    {
      update,

      promise<TData = any>(
        promise: Promise<TData>,
        {
          pending,
          success,
          error,
        }: {
          pending: string;
          success: ((data: TData) => string) | string;
          error: ((error: Error) => string) | string;
        },
      ) {
        const id = uniqueId();

        Promise.resolve()
          .then(() => {
            enqueue(id, {
              icon: 'system/loader',
              severity: 'info',
              title: pending || 'Loading···',
              duration: Infinity,
            });

            return promise;
          })
          .then((data) => {
            update(id, {
              icon: 'system/check',
              severity: 'success',
              title: typeof success === 'function' ? success(data) : typeof success === 'string' ? success : 'Success!',
              action: {
                label: '닫기',

                onClick() {
                  remove(id);
                },
              },
            });
          })
          .catch((e) => {
            update(id, {
              icon: 'system/error-warning-line',
              severity: 'danger',
              title: typeof error === 'function' ? error(e) : typeof error === 'string' ? error : 'Error!',
              action: {
                label: '닫기',

                onClick() {
                  remove(id);
                },
              },
            });
          });
      },
    },
  );
}
