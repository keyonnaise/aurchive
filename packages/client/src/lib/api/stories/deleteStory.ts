import client from '../client';

export default async function deleteStory(id: string) {
  await client.delete<void>(`stories/${id}`);
}
