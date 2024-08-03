import { IPost } from './types';
import client from '../client';

export type GetPostResult = IPost;

export default async function getPost(id: string) {
  const result = await client.get<GetPostResult>(`posts/${id}`);

  return result.data;
}
