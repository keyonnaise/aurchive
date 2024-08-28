import client from '../client';

export interface EditPostParams {
  author: string;
  title: string;
  tags: string[];
  story: string | null;
  cover: string | null;
  thumbnail: string | null;
  body: string;
}

export type EditPostResult = string;

export default async function editPost(params: EditPostParams) {
  console.log(params);

  const result = await client.post<EditPostResult>('posts', params);

  return result.data;
}
