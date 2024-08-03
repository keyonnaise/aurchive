import { EditPostParams } from './editPost';
import client from '../client';

export interface UpdatePostParams extends EditPostParams {
  id: string;
}

export type UpdatePostResult = string;

export default async function updatePost({ id, ...rest }: UpdatePostParams) {
  const result = await client.put<UpdatePostResult>(`posts/${id}`, rest);

  return result.data;
}
