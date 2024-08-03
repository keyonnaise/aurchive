import client from '../client';

export interface UpdateProfileParams {
  displayName: string;
  photoUrl: string | null;
  bio: string | null;
  about: string | null;
  githubUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
}

export type UpdateProfileResult = void;

export default async function updateProfile(params: UpdateProfileParams) {
  const result = await client.put<UpdateProfileResult>('auth/profile', params);

  return result.data;
}
