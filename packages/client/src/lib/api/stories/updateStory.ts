import { EditStoryParams } from './editStory';
import client from '../client';

export interface UpdateStoryParams extends EditStoryParams {
  id: string;
}

export type UpdateStoryResult = string;

export default async function updateStory({ id, ...rest }: UpdateStoryParams) {
  const result = await client.put<UpdateStoryResult>(`/stories/${id}`, rest);

  return result.data;
}
