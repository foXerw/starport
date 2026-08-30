import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);
  return rss({
    title: '浮星坞 · 生活随笔',
    description: '一只狐狸守着的星港，想法在此停靠。',
    site: context.site!,
    items: essays.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/essays/${e.id}/`,
    })),
  });
}
