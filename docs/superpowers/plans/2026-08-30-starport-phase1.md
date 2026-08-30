# 浮星坞港壳（starport）Phase 1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建起 `starport` —— 一个 Astro 静态港壳，承载「狐狸守港人 Hero + 关于我 + 生活随笔 + 星际导航 + 最新动态」，晨雾星港主题，可通过 microverse 部署为 `foxerw.com` 根域。

**Architecture:** 混合渐进式港壳：轻内容（关于我、随笔、导航、动态）用 Astro content collections + Markdown 收进站内统一主题；重应用（博客、便签）留到 Phase 2 以子域停靠。本计划只做港壳本身。

**Tech Stack:** Astro 5 · Tailwind 4（@tailwindcss/vite）· Content Collections（glob loader + zod）· Vitest · @astrojs/rss · @astrojs/sitemap · Node 18+

**Spec:** `docs/superpowers/specs/2026-08-30-fuxingwu-starport-design.md`

## Global Constraints

- 站点中文名「浮星坞」，化身「狐狸 · 守港人」，视觉 = 晨雾星港（浅色、空气感、低饱和雾蓝/米白 + 星点 + 狐狸橙棕点缀）。
- 仓库名 `starport`，远程 `https://github.com/foXerw/starport.git`，本地工作目录 `D:\code\foxerw-web`（目录名与仓库名不强求一致）。
- `SITE_URL` / `BASE_PATH` 由构建时环境变量注入，默认 `http://localhost:4321` / `/`（与 personal-blog 一致）。
- 部署目标：microverse「npm」类型应用，`npm start` 读取 `PORT` 服务 `dist/`。
- 内容一律 Markdown + git；不做站内评论/后台/CMS。
- 语言：UI 文案用简体中文；代码注释与 commit message 用英文（与 personal-blog 惯例一致）。

---

## 文件结构总览

```
starport/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── .env.example
├── README.md
├── server.mjs                     # 静态服务器（microverse 部署，读 PORT）
├── public/
│   └── favicon.svg                # 星/坞 标记
├── src/
│   ├── content.config.ts          # 内容集合声明
│   ├── lib/
│   │   ├── schemas.ts             # zod schema（可被 vitest 直接导入）
│   │   └── essays.ts              # 排序 / 日期工具
│   ├── data/
│   │   └── nav.ts                 # 星际导航数据
│   ├── content/
│   │   ├── about.md               # 关于我
│   │   └── essays/
│   │       └── hello-fuxingwu.md  # 示例随笔
│   ├── styles/
│   │   └── global.css             # 晨雾星港 tokens + 基础样式
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro             # 狐狸守港人
│   │   ├── NavLinks.astro         # 星际导航
│   │   ├── EssayCard.astro
│   │   └── RecentActivity.astro   # 最新动态占位
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── essays/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── rss.xml.ts
│       └── robots.txt.ts
└── tests/
    ├── schemas.test.ts
    └── essays.test.ts
```

---

### Task 1: 仓库接线 + 提交设计文档

**Files:**
- Create: 无（提交现有文件）
- Modify: 无

**Interfaces:**
- Produces: 本地 git 仓库，远程指向 `origin = https://github.com/foXerw/starport.git`，`main` 分支已推送，含 `docs/superpowers/specs/`。

- [ ] **Step 1: 初始化 git 并连接远程**

```bash
cd /d/code/foxerw-web
git init -b main
git remote add origin https://github.com/foXerw/starport.git
```

- [ ] **Step 2: 提交设计文档**

```bash
git add docs/
git commit -m "docs: add 浮星坞 design spec"
```

- [ ] **Step 3: 推送（若远端有初始提交则先 rebase）**

```bash
# 若远端为空仓库：直接 push
git push -u origin main
# 若远端有初始提交（README/LICENSE 等）：
git pull --rebase origin main
git push -u origin main
```

- [ ] **Step 4: 验证**

Run: `git remote -v` 应显示 `origin`；`git log --oneline` 应有 1 条提交；GitHub 页面应出现 `docs/`。

---

### Task 2: Astro 脚手架 + 可构建的最小站

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `.env.example`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`

**Interfaces:**
- Produces: `npm run dev` / `npm run build` 可用的 Astro 项目骨架；`SITE_URL`/`BASE_PATH` 注入；Tailwind 4 已接线。

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "starport",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "start": "node server.mjs",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: 写 astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: 写 tsconfig.json / vitest.config.ts / .gitignore / .env.example**

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node' } });
```

```
# .gitignore
node_modules/
dist/
.astro/
.env
```

```
# .env.example
SITE_URL=http://localhost:4321
BASE_PATH=/
```

- [ ] **Step 4: 写最小 global.css（骨架，主题在 Task 4 完善）**

```css
@import "tailwindcss";
```

- [ ] **Step 5: 写 BaseLayout.astro（最小版）**

```astro
---
import '../styles/global.css';
interface Props { title: string; description?: string }
const { title, description } = Astro.props;
const fullTitle = title === '浮星坞' ? title : `${title} · 浮星坞`;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <main><slot /></main>
  </body>
</html>
```

- [ ] **Step 6: 写最小首页 index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="浮星坞">
  <h1 class="text-xl">浮星坞</h1>
</BaseLayout>
```

- [ ] **Step 7: 安装依赖**

```bash
npm install astro@^5 @astrojs/rss @astrojs/sitemap zod@^3
npm install -D tailwindcss @tailwindcss/vite vitest "typescript@^6" @astrojs/check
```

- [ ] **Step 8: 验证构建**

Run: `npm run build`
Expected: 无报错，生成 `dist/index.html`。再 `npm run dev` 打开 http://localhost:4321 可见「浮星坞」。

- [ ] **Step 9: 提交**

```bash
git add .
git commit -m "feat: scaffold astro + tailwind + vitest"
```

---

### Task 3: 内容集合 schema + 示例内容 + 日期工具（TDD）

**Files:**
- Create: `src/lib/schemas.ts`, `src/content.config.ts`, `src/lib/essays.ts`, `src/content/about.md`, `src/content/essays/hello-fuxingwu.md`, `tests/schemas.test.ts`, `tests/essays.test.ts`

**Interfaces:**
- Produces:
  - `essaySchema` / `aboutSchema`（`src/lib/schemas.ts`，从 `'zod'` 导入，可被 vitest 直接测）
  - `sortByDateDesc<T extends { data: { date: Date } }>(items: T[]): T[]`
  - `formatDate(date: Date): string`（返回 `YYYY-MM-DD`）
  - content collections `essays`、`about`

- [ ] **Step 1: 写失败测试（schemas + essays）**

```ts
// tests/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { essaySchema } from '../src/lib/schemas';

describe('essaySchema', () => {
  it('accepts a valid essay', () => {
    const r = essaySchema.safeParse({ title: '你好', date: '2026-08-30', tags: ['随笔'] });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.date).toBeInstanceOf(Date);
  });
  it('rejects a missing title', () => {
    expect(essaySchema.safeParse({ date: '2026-08-30' }).success).toBe(false);
  });
  it('rejects an invalid date', () => {
    expect(essaySchema.safeParse({ title: 'x', date: 'not-a-date' }).success).toBe(false);
  });
});
```

```ts
// tests/essays.test.ts
import { describe, it, expect } from 'vitest';
import { sortByDateDesc, formatDate } from '../src/lib/essays';

describe('sortByDateDesc', () => {
  it('sorts newest first', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-03-01') } };
    const c = { data: { date: new Date('2025-12-01') } };
    expect(sortByDateDesc([a, b, c]).map(x => x.data.date.getTime()))
      .toEqual([b.data.date.getTime(), a.data.date.getTime(), c.data.date.getTime()]);
  });
  it('does not mutate the input', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-03-01') } };
    const input = [a, b];
    sortByDateDesc(input);
    expect(input[0]).toBe(a);
  });
});

describe('formatDate', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(formatDate(new Date('2026-08-30'))).toBe('2026-08-30');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test`
Expected: 模块 `../src/lib/schemas` 与 `../src/lib/essays` 找不到，FAIL。

- [ ] **Step 3: 写 schemas.ts / essays.ts**

```ts
// src/lib/schemas.ts
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
```

```ts
// src/lib/essays.ts
export function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test`
Expected: 6 个用例全 PASS。

- [ ] **Step 5: 写 content.config.ts**

```ts
// src/content.config.ts
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
```

- [ ] **Step 6: 写示例内容**

```markdown
<!-- src/content/about.md -->
---
title: 关于我
---
你好，我是 foxerw，这艘「浮星坞」的守港人。

喜欢狐狸，喜欢星星，喜欢把想法停靠下来。
```

```markdown
<!-- src/content/essays/hello-fuxingwu.md -->
---
title: 你好，浮星坞
description: 第一篇生活随笔
date: 2026-08-30
tags: [随笔]
---
这里是浮星坞的第一篇随笔，船已靠岸。
```

- [ ] **Step 7: 验证内容可加载 + 构建通过**

Run: `npm run build`
Expected: 构建成功（内容被 glob loader 读入，schema 校验通过）。

- [ ] **Step 8: 提交**

```bash
git add .
git commit -m "feat: content collections with zod schemas and tests"
```

---

### Task 4: 晨雾星港主题基座 + 布局

**Files:**
- Create: `src/components/Header.astro`, `src/components/Footer.astro`, `public/favicon.svg`
- Modify: `src/styles/global.css`, `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: 可复用的 `BaseLayout`（含 Header/Footer）、晨雾星港设计 token（Tailwind 4 `@theme`）、站点 favicon。

- [ ] **Step 1: 写完整 global.css（设计 token）**

```css
@import "tailwindcss";

@theme {
  --color-mist-50: #f6f8fb;
  --color-mist-100: #ecf1f7;
  --color-mist-200: #dbe4ee;
  --color-mist-300: #bcc9d9;
  --color-mist-400: #96a9c0;
  --color-mist-500: #7489a6;
  --color-mist-600: #5c708c;
  --color-mist-700: #4b5b74;
  --color-mist-800: #404d61;
  --color-mist-900: #384252;
  --color-fox: #d97757;
  --color-star: #e0b95a;
  --font-display: "Noto Serif SC", "Songti SC", "STSong", serif;
  --font-body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
}

:root { color-scheme: light; }

body {
  font-family: var(--font-body);
  color: var(--color-mist-900);
  background-color: var(--color-mist-50);
  background-image:
    radial-gradient(1200px 600px at 15% -10%, rgba(224,185,90,0.08), transparent 60%),
    radial-gradient(900px 500px at 90% 0%, rgba(116,137,166,0.10), transparent 55%);
  background-attachment: fixed;
}

a { color: var(--color-mist-700); }
a:hover { color: var(--color-fox); }
```

- [ ] **Step 2: 写 Header.astro**

```astro
---
const nav = [
  { label: '首页', href: '/' },
  { label: '关于我', href: '/about' },
  { label: '生活随笔', href: '/essays' },
];
---
<header class="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
  <a href="/" class="font-display text-lg tracking-widest text-mist-800">浮星坞</a>
  <nav class="flex gap-5 text-sm">
    {nav.map((i) => <a href={i.href}>{i.label}</a>)}
  </nav>
</header>
```

- [ ] **Step 3: 写 Footer.astro**

```astro
---
const year = new Date().getFullYear();
---
<footer class="max-w-3xl mx-auto px-6 py-10 text-center text-xs text-mist-500">
  <p>© {year} 浮星坞 · 狐狸守港人 · foxerw.com</p>
</footer>
```

- [ ] **Step 4: 写 favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#ecf1f7"/>
  <path d="M16 5l2 5.1 5.5.4-4.2 3.6 1.3 5.4-4.6-3-4.6 3 1.3-5.4-4.2-3.6 5.5-.4z" fill="#e0b95a"/>
  <circle cx="16" cy="16" r="1.4" fill="#d97757"/>
</svg>
```

- [ ] **Step 5: 更新 BaseLayout.astro（接入 Header/Footer + favicon）**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
interface Props { title: string; description?: string }
const { title, description } = Astro.props;
const fullTitle = title === '浮星坞' ? title : `${title} · 浮星坞`;
const base = import.meta.env.BASE_URL;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" type="image/svg+xml" href={base + 'favicon.svg'} />
  </head>
  <body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1"><slot /></main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 6: 验证**

Run: `npm run dev`，打开 http://localhost:4321
Expected: 浅雾蓝背景 + 柔和渐变、顶部「浮星坞」导航、底部版权；`npm run build` 无报错。

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: misty-harbor theme tokens and base layout"
```

---

### Task 5: 首页 Hero（狐狸守港人）+ 星际导航

**Files:**
- Create: `src/data/nav.ts`, `src/components/Hero.astro`, `src/components/NavLinks.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces:
  - `navLinks: NavLink[]`（`src/data/nav.ts`，字段 `{ label, href, description?, external?, group: 'main' | 'dock' | 'elsewhere' }`）
  - `Hero`、`NavLinks` 组件；`index.astro` 组装 Hero + NavLinks。

- [ ] **Step 1: 写 nav.ts**

```ts
export interface NavLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  group: 'main' | 'dock' | 'elsewhere';
}

export const navLinks: NavLink[] = [
  { label: '关于我', href: '/about', group: 'main' },
  { label: '生活随笔', href: '/essays', group: 'main' },
  { label: '博客', href: 'https://blog.foxerw.com', external: true, group: 'dock', description: '长文与技术' },
  { label: '便签', href: 'https://notes.foxerw.com', external: true, group: 'dock', description: '随手记' },
  { label: 'GitHub', href: 'https://github.com/foXerw', external: true, group: 'elsewhere' },
];
```

- [ ] **Step 2: 写 Hero.astro**

```astro
---
---
<section class="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
  <div class="text-6xl mb-6" aria-hidden="true">🦊</div>
  <h1 class="font-display text-4xl md:text-5xl tracking-widest text-mist-800">浮星坞</h1>
  <p class="mt-4 text-mist-600">一只狐狸守着的星港，想法在此停靠。</p>
  <p class="mt-2 text-sm text-mist-400">foxerw.com · 星星是内容，坞是容器</p>
</section>
```

- [ ] **Step 3: 写 NavLinks.astro**

```astro
---
import { navLinks } from '../data/nav';

const groups: Array<{ key: NavLink['group']; title: string }> = [
  { key: 'main', title: '港内' },
  { key: 'dock', title: '停靠的船' },
  { key: 'elsewhere', title: '别处' },
];
---
<section class="max-w-3xl mx-auto px-6 py-8">
  {groups.map((g) => {
    const items = navLinks.filter((l) => l.group === g.key);
    if (items.length === 0) return null;
    return (
      <div class="mb-6">
        <h2 class="text-xs uppercase tracking-widest text-mist-400 mb-3">{g.title}</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          {items.map((l) => (
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener' : undefined}
              class="block rounded-lg border border-mist-200 bg-white/60 px-4 py-3 hover:border-fox/40 transition-colors"
            >
              <span class="font-medium text-mist-800">{l.label}</span>
              {l.description && <span class="ml-2 text-xs text-mist-400">{l.description}</span>}
            </a>
          ))}
        </div>
      </div>
    );
  })}
</section>
```

- [ ] **Step 4: 更新 index.astro（组装）**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import NavLinks from '../components/NavLinks.astro';
---
<BaseLayout title="浮星坞" description="一只狐狸守着的星港，想法在此停靠。">
  <Hero />
  <NavLinks />
</BaseLayout>
```

- [ ] **Step 5: 验证**

Run: `npm run dev`
Expected: 首页呈现狐狸 emoji + 「浮星坞」标题 + 三组导航（港内 / 停靠的船 / 别处），外链新窗口打开。

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: hero and star-dock navigation"
```

---

### Task 6: 关于我页

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `about` collection（`getEntry('about', 'about')`）

- [ ] **Step 1: 写 about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getEntry } from 'astro:content';

const about = await getEntry('about', 'about');
if (!about) throw new Error('about entry not found');
const { Content } = await about.render();
---
<BaseLayout title="关于我">
  <article class="max-w-2xl mx-auto px-6 py-12">
    <h1 class="font-display text-3xl tracking-widest text-mist-800 mb-6">{about.data.title}</h1>
    <div class="leading-7 text-mist-700 space-y-4">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: 验证**

Run: `npm run dev`，访问 http://localhost:4321/about
Expected: 显示 about.md 的标题与正文；`npm run build` 无报错。

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: about page"
```

---

### Task 7: 生活随笔（列表 + 详情）

**Files:**
- Create: `src/pages/essays/index.astro`, `src/pages/essays/[slug].astro`, `src/components/EssayCard.astro`

**Interfaces:**
- Consumes: `essays` collection + `sortByDateDesc` / `formatDate`（Task 3）
- Produces: `/essays` 列表页与 `/essays/[slug]` 详情页；`EssayCard` 组件。

- [ ] **Step 1: 写 EssayCard.astro**

```astro
---
import { formatDate } from '../lib/essays';
import type { CollectionEntry } from 'astro:content';
interface Props { essay: CollectionEntry<'essays'> }
const { essay } = Astro.props;
const { title, description, date } = essay.data;
---
<a href={`/essays/${essay.id}/`} class="block rounded-lg border border-mist-200 bg-white/60 px-5 py-4 hover:border-fox/40 transition-colors">
  <div class="flex items-baseline justify-between gap-3">
    <span class="font-medium text-mist-800">{title}</span>
    <time datetime={formatDate(date)} class="text-xs text-mist-400 shrink-0">{formatDate(date)}</time>
  </div>
  {description && <p class="mt-1 text-sm text-mist-500">{description}</p>}
</a>
```

- [ ] **Step 2: 写 essays/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import EssayCard from '../../components/EssayCard.astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../../lib/essays';

const essays = sortByDateDesc(await getCollection('essays', ({ data }) => !data.draft));
---
<BaseLayout title="生活随笔" description="浮星坞里漂着的生活随笔。">
  <section class="max-w-2xl mx-auto px-6 py-12">
    <h1 class="font-display text-3xl tracking-widest text-mist-800 mb-8">生活随笔</h1>
    <div class="space-y-3">
      {essays.length === 0
        ? <p class="text-mist-400">还没有随笔。</p>
        : essays.map((e) => <EssayCard essay={e} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 写 essays/[slug].astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';
import { formatDate } from '../../lib/essays';

export async function getStaticPaths() {
  const essays = await getCollection('essays');
  return essays.map((e) => ({ params: { slug: e.id }, props: { essay: e } }));
}

const { essay } = Astro.props;
const { Content } = await render(essay);
---
<BaseLayout title={essay.data.title} description={essay.data.description}>
  <article class="max-w-2xl mx-auto px-6 py-12">
    <h1 class="font-display text-3xl tracking-wide text-mist-800 mb-3">{essay.data.title}</h1>
    <time datetime={formatDate(essay.data.date)} class="text-sm text-mist-400">{formatDate(essay.data.date)}</time>
    <div class="mt-8 leading-7 text-mist-700 space-y-4">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 4: 验证**

Run: `npm run dev`，访问 http://localhost:4321/essays 与 http://localhost:4321/essays/hello-fuxingwu/
Expected: 列表显示示例随笔，详情页渲染正文；`npm run build` 无报错。

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: essays list and detail pages"
```

---

### Task 8: 最新动态 + RSS / sitemap / robots

**Files:**
- Create: `src/components/RecentActivity.astro`, `src/pages/rss.xml.ts`, `src/pages/robots.txt.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `essays` collection（最新动态先取随笔占位）
- Produces: `/rss.xml`、`/robots.txt`；sitemap 由 `@astrojs/sitemap` 集成自动生成。

- [ ] **Step 1: 写 RecentActivity.astro**

```astro
---
import { formatDate } from '../lib/essays';
import type { CollectionEntry } from 'astro:content';
interface Props { essays: CollectionEntry<'essays'>[] }
const { essays } = Astro.props;
---
<section class="max-w-3xl mx-auto px-6 py-8">
  <h2 class="text-xs uppercase tracking-widest text-mist-400 mb-3">最新动态</h2>
  {essays.length === 0
    ? <p class="text-sm text-mist-400">港里还很安静。</p>
    : (
        <ul class="space-y-2">
          {essays.map((e) => (
            <li class="flex justify-between gap-3 text-sm">
              <a href={`/essays/${e.id}/`} class="text-mist-700 hover:text-fox">{e.data.title}</a>
              <time datetime={formatDate(e.data.date)} class="text-mist-400">{formatDate(e.data.date)}</time>
            </li>
          ))}
        </ul>
      )}
</section>
```

- [ ] **Step 2: 更新 index.astro（加入最新动态）**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import NavLinks from '../components/NavLinks.astro';
import RecentActivity from '../components/RecentActivity.astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../lib/essays';

const essays = sortByDateDesc(await getCollection('essays', ({ data }) => !data.draft)).slice(0, 5);
---
<BaseLayout title="浮星坞" description="一只狐狸守着的星港，想法在此停靠。">
  <Hero />
  <NavLinks />
  <RecentActivity essays={essays} />
</BaseLayout>
```

- [ ] **Step 3: 写 rss.xml.ts**

```ts
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
```

- [ ] **Step 4: 写 robots.txt.ts**

```ts
import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
}
```

- [ ] **Step 5: 验证**

Run: `npm run build`
Expected: `dist/rss.xml`、`dist/robots.txt`、`dist/sitemap-index.xml` 均生成；rss.xml 含示例随笔。

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: recent activity, rss, sitemap, robots"
```

---

### Task 9: microverse 部署配置 + README

**Files:**
- Create: `server.mjs`, `README.md`

**Interfaces:**
- Produces: `npm start` 可读 `PORT` 服务 `dist/`（microverse npm 部署）；README 说明本地开发与部署。

- [ ] **Step 1: 写 server.mjs**

```js
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 4321;
const DIST = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = resolve(DIST, '.' + sep + pathname.replaceAll('/', sep));
    if (!file.startsWith(DIST + sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    const s = await stat(file);
    if (!s.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
}).listen(PORT, () => console.log(`starport serving dist/ on :${PORT}`));
```

- [ ] **Step 2: 写 README.md**

````markdown
# 浮星坞（starport）

`foxerw.com` 的个人数字港湾。一只狐狸守着的星港，想法在此停靠。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321/
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | 构建静态站点到 dist/ |
| `npm start` | 生产静态服务器（读 PORT，microverse 部署用） |
| `npm run check` | TypeScript 类型检查 |
| `npm run test` | 运行 Vitest 单测 |

## 内容

- 关于我：`src/content/about.md`
- 生活随笔：`src/content/essays/*.md`
- 星际导航：`src/data/nav.ts`

## 部署

`site` / `base` 由构建时环境变量注入（见 `astro.config.mjs`）：

| 变量 | 作用 | 默认值 |
|---|---|---|
| `SITE_URL` | 站点绝对地址（RSS / sitemap 的 canonical） | `http://localhost:4321` |
| `BASE_PATH` | 部署子路径前缀 | `/` |

### 部署到 microverse

1. 在 microverse 创建 **npm** 类型应用（名如 `starport`）。
2. 上传源码，设 `SITE_URL=https://foxerw.com`。
3. Start —— 平台会 `npm install` + `npm run build` + `npm start`，并注入 `PORT`。
4. 将该应用标记为 **root-domain default**，使 `foxerw.com/` 指向它。
````

- [ ] **Step 3: 验证部署脚本**

Run:
```bash
npm run build
PORT=4322 node server.mjs
```
Expected: 控制台打印 `starport serving dist/ on :4322`；浏览器访问 http://localhost:4322 正常显示；访问不存在的路径返回 404。

- [ ] **Step 4: 最终提交 + 推送**

```bash
git add .
git commit -m "feat: microverse deploy config and README"
git push origin main
```

---

## 自检结论

- **Spec 覆盖**：spec 的 Phase 1 内容（狐狸 hero、关于我、生活随笔、星际导航、最新动态、晨雾星港主题、microverse 部署）均有对应任务。Phase 2（子域停靠）、Phase 3（聚合/归档）明确不在本计划范围内，留待后续。
- **占位符扫描**：无 TBD/TODO；所有代码块均为可运行的完整实现。
- **类型一致性**：`sortByDateDesc` / `formatDate`（Task 3 定义）在 Task 5/7/8 中调用签名一致；`essays` 集合 id 为文件名 slug（`hello-fuxingwu`），详情页路由 `[slug].astro` 与之对应。
