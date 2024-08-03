export const FILE_SELECT_ERRORS = {
  INVALID_FILE_TYPE: 'invalid-file-type',
  FILE_SIZE_LIMIT_EXCEEDED: 'file-size-limit-exceeded',
} as const;

export default function openFileSelector({ accept, maxFileSize }: { accept: string[]; maxFileSize: number }) {
  return new Promise<File>((resolve, reject) => {
    const timer = setTimeout(reject, 1000 * 60 * 5);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept.join(',');

    input.onchange = () => {
      clearTimeout(timer);

      const error = new Error();
      error.name = 'FileError';

      if (!input.files) return reject();

      const file = input.files[0];

      if (!accept.includes(file.type)) {
        error.message = FILE_SELECT_ERRORS['INVALID_FILE_TYPE'];

        return reject(error);
      }

      if (!(file.size < maxFileSize)) {
        error.message = FILE_SELECT_ERRORS['FILE_SIZE_LIMIT_EXCEEDED'];

        return reject(error);
      }

      input.value = '';

      resolve(file);
    };

    input.click();
  });
}
