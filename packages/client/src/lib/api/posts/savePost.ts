import { EditPostParams } from './editPost';
import client from '../client';

export interface SavePostParams extends EditPostParams {
  id: string;
}

export type SavePostResult = string;

export default async function savePost({ id, ...rest }: SavePostParams) {
  const result = await client.put<SavePostResult>(`posts/${id}/save`, rest);

  return result.data;
}
