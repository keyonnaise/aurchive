import { z } from 'zod';

export const EditProfileSchema = z.object({
  body: z.object({
    displayName: z.string().max(10),
    photoUrl: z.string().nullable(),
    bio: z.string().max(100).nullable(),
    about: z.string().nullable(),
    githubUrl: z.string().nullable(),
    instagramUrl: z.string().nullable(),
    linkedinUrl: z.string().nullable(),
    twitterUrl: z.string().nullable(),
  }),
});
