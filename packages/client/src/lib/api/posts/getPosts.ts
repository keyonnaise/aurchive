import { IPost } from './types';
import client from '../client';

export interface GetPostsQuery {
  author?: string;
  story?: string;
  keyword?: string;
  published: boolean;
  page: number;
  limit: number;
  sort: 'desc' | 'asc';
}

export interface GetPostsResult {
  list: IPost[];
  pageCount: number;
}

export default async function getPosts(query: GetPostsQuery) {
  const params = new URLSearchParams();

  Object.entries(query)
    .filter(([_, value]) => value !== undefined)
    .forEach(([key, value]) => params.append(key, value.toString()));

  const result = await client.get<GetPostsResult>(`posts?${params.toString()}`);

  return result.data;
}
