import { IUser } from './types';
import client from '../client';

export type GetUserResult = IUser;

export default async function getUser(id: string) {
  const result = await client.get<GetUserResult>(`users/${id}`);

  return result.data;
}
