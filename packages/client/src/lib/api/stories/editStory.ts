import client from '../client';

export interface EditStoryParams {
  name: string;
  slug: string;
  description: string | null;
}

export type EditStoryResult = string;

export default async function editStory(params: EditStoryParams) {
  const result = await client.post<EditStoryResult>('stories', params);

  return result.data;
}
