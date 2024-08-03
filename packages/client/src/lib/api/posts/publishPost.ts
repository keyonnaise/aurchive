import { EditPostParams } from './editPost';
import client from '../client';

export interface PublishPostParams extends EditPostParams {
  id: string;
}

export type PublishPostResult = string;

export default async function publishPost({ id, ...rest }: PublishPostParams) {
  const result = await client.put<PublishPostResult>(`posts/${id}/publish`, rest);

  return result.data;
}
