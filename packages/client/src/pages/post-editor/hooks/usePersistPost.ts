import { useCallback } from 'react';
import { useEditPostMutation, useSavePostMutation } from '~hooks/queries/postQueries';
import { Fields } from '../PostEditor';

export default function usePersistPost() {
  const { mutateAsync: editPost } = useEditPostMutation();
  const { mutateAsync: savePost } = useSavePostMutation();

  return useCallback(
    async ({ id, fields }: { id: string | undefined; fields: Fields }) => {
      const params = {
        title: fields.title,
        tags: fields.tags.split(',').filter((tag) => tag !== ''),
        story: fields.story || null,
        cover: fields.cover || null,
        thumbnail: fields.thumbnail || null,
        body: fields.body,
      };
      let currentId = id;

      if (currentId !== undefined) {
        await savePost({ ...params, id: currentId });
      } else {
        currentId = await editPost(params);
      }

      return currentId;
    },
    [editPost, savePost],
  );
}
