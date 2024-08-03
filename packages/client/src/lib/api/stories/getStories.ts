import { IStory } from './types';
import client from '../client';

export interface GetStoriesQuery {
  author: string;
  page: number;
  limit: number;
  sort: 'desc' | 'asc';
}

export interface GetStoriesResult {
  list: IStory[];
  pageCount: number;
}

export default async function getStories(query: GetStoriesQuery) {
  const params = new URLSearchParams();

  Object.entries(query)
    .filter(([_, value]) => value !== undefined)
    .forEach(([key, value]) => params.append(key, value.toString()));

  const result = await client.get<GetStoriesResult>(`stories?${params.toString()}`);

  return result.data;
}
