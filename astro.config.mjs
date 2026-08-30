import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const SITE_URL = process.env.SITE_URL || env.SITE_URL || 'http://localhost:4321';
const BASE_PATH = process.env.BASE_PATH || env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
