import { IUser } from './types';
import client from '../client';

export interface GetUsersQuery {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
}

export interface GetUsersResult {
  list: IUser[];
  pageCount: number;
}

export async function getUsers(query: GetUsersQuery) {
  const params = new URLSearchParams();

  Object.entries(query)
    .filter(([_, value]) => value !== undefined)
    .forEach(([key, value]) => params.append(key, value.toString()));

  const result = await client.get<GetUsersResult>(`users?${params.toString()}`);

  return result.data;
}
