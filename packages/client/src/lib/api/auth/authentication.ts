import { IAccount } from './types';
import client from '../client';

export type AuthenticationResult = IAccount;

export default async function authentication() {
  const result = await client.get<AuthenticationResult>('auth/authentication');

  return result.data;
}
