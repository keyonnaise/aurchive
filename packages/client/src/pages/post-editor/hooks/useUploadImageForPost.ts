import { useCallback } from 'react';
import { useUploadImageToCloudStorage } from '~hooks/queries/fileQueries';
import useAsync from '~hooks/useAsync';
import usePersistPost from './usePersistPost';
import { ContextType } from '../PostEditor';

export default function useUploadImageForPost(context: ContextType) {
  const { id, fields, setId, enableAutoSave, disableAutoSave } = context;

  const persistPost = usePersistPost();
  const { mutateAsync: uploadImage } = useUploadImageToCloudStorage();

  const prepareUploadImage = useCallback(async () => {
    let currentId = id;

    if (currentId === undefined) {
      currentId = await persistPost({ fields, id: currentId });
      setId(currentId);
    }

    return currentId;
  }, [id, fields, persistPost, setId]);

  const uploadImageForPost = useCallback(
    async (file: File) => {
      try {
        disableAutoSave();

        const formData = new FormData();
        formData.append('image', file, file.name);

        const directoryName = await prepareUploadImage();
        const data = await uploadImage({ formData, directoryName, usedIn: 'post' });

        return data;
      } finally {
        enableAutoSave();
      }
    },
    [prepareUploadImage, enableAutoSave, disableAutoSave, uploadImage],
  );

  return useAsync(uploadImageForPost);
}
