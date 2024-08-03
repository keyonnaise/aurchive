import { z } from 'zod';

export const UploadImageSchema = z.object({
  query: z.object({
    usedIn: z.string(),
    directoryName: z.string(),
  }),
});
