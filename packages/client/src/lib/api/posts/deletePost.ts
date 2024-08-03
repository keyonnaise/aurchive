import client from '../client';

export default async function deletePost(id: string) {
  await client.delete<void>(`posts/${id}`);
}
