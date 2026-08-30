import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { essaySchema, aboutSchema } from './lib/schemas';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: essaySchema,
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: aboutSchema,
});

export const collections = { essays, about };
