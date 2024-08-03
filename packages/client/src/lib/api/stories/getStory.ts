import { IStory } from './types';
import client from '../client';

export interface GetStoryQuery {
  author: string;
  slug: string;
}

export type GetStoryResult = IStory;

export default async function getStory({ author, ...query }: GetStoryQuery) {
  const params = new URLSearchParams();

  Object.entries(query)
    .filter(([_, value]) => value !== undefined)
    .forEach(([key, value]) => params.append(key, value.toString()));

  const result = await client.get<GetStoryResult>(`stories/${author}?${params.toString()}`);

  return result.data;
}
