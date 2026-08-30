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
