import { z } from 'zod';

export const GetPostsSchema = z
  .object({
    query: z.object({
      author: z.string().optional(),
      story: z.string().optional(),
      keyword: z.string().optional(),
      published: z.string(),
      page: z.string(),
      limit: z.string(),
      sort: z.enum(['desc', 'asc']),
    }),
  })
  .transform((prev) => ({
    query: {
      ...prev.query,
      published: prev.query.published === 'true',
      limit: parseInt(prev.query.limit, 10),
      page: parseInt(prev.query.page, 10),
    },
  }));

export const EditPostSchema = z.object({
  body: z.object({
    author: z.string(),
    title: z.string(),
    tags: z.string().array(),
    story: z.string().nullable(),
    cover: z.string().nullable(),
    thumbnail: z.string().nullable(),
    body: z.string(),
  }),
});
