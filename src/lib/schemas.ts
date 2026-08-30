import { z } from 'zod';

export const essaySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const aboutSchema = z.object({
  title: z.string(),
  updated: z.coerce.date().optional(),
});
