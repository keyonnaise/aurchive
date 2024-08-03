import { z } from 'zod';

export const GetStorySchema = z.object({
  query: z.object({
    slug: z.string(),
  }),
});

export const GetStoriesSchema = z
  .object({
    query: z.object({
      author: z.string(),
      page: z.string(),
      limit: z.string(),
      sort: z.enum(['desc', 'asc']),
    }),
  })
  .transform((prev) => ({
    query: {
      ...prev.query,
      limit: parseInt(prev.query.limit, 10),
      page: parseInt(prev.query.page, 10),
    },
  }));

export const EditStorySchema = z.object({
  body: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
  }),
});
