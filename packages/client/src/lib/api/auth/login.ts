import { IAccount } from './types';
import client from '../client';

export interface LoginParams {
  email: string;
  password: string;
}

export type LoginResult = IAccount;

export default async function login(params: LoginParams) {
  const result = await client.post<LoginResult>('auth/login', params);

  return result.data;
}
