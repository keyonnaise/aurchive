import { z } from 'zod';

export const GetUsersSchema = z
  .object({
    query: z.object({
      limit: z.string(),
      page: z.string(),
      sort: z.enum(['desc', 'asc']),
    }),
  })
  .transform((prev) => ({
    query: {
      ...prev.query,
      limit: parseInt(prev.query.limit),
      page: parseInt(prev.query.page),
    },
  }));
