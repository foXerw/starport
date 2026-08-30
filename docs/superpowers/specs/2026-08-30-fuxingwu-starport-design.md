# 浮星坞（foxerw.com / starport）· 设计文档

> 日期：2026-08-30
> 状态：待评审
> 主题：个人「数字港湾」站点的架构、内容、技术栈与渐进实施路线

---

## 1. 概述

**浮星坞**（备案中文名，域名 `foxerw.com`）是作者 foxerw 的个人「数字港湾」。以「狐狸」为守港人、「星星」为内容、「坞」为容器的意象组织个人网络身份：关于我、生活随笔、博客、便签、社交链接等一切内容在此停靠。

核心架构判断：**不从头造一个大而全的站，而是先有一个「港壳」门面，再让一艘艘船（已有的独立项目）渐进停靠进来**。集成的基础设施（`microverse`）已经存在，本次设计是决定「门面如何组织这些船」。

---

## 2. 目标与非目标

### 目标

- `foxerw.com` 作为「浮星坞」港壳上线，承载：**关于我 · 生活随笔 · 星际导航 · 最新动态**。
- 博客（`personal-blog`）、便签（`sticky-notes`）作为子应用，通过 `microverse` 以子域停靠。
- 建立统一的「晨雾星港」视觉主题。

### 非目标（YAGNI，明确不做）

- 不做统一用户系统 / 站内评论（博客评论沿用 Giscus）。
- 不做自建 CMS / 后台（内容一律 Markdown + git）。
- 不把 `microverse` 重构成微前端框架。
- 不做移动端原生 App。

---

## 3. 身份与命名

| 项 | 值 |
|---|---|
| 域名 | `foxerw.com` |
| 中文名（备案） | 浮星坞 |
| 化身 | 狐狸 · 守港人 |
| 港壳仓库名 | `starport` |
| 视觉气质 | 晨雾星港（浅色、空气感、浮动的港） |

命名由来：ID `foxerw`（喜欢狐狸、无深层含义）→ 备案需中文名，取谐音「浮星坞」。「浮」=轻盈漂移，「星」=独立事物（文章/项目/念头），「坞」=停靠处 / 集散地。`starport` 是其英文传神转写（星星停靠的港口）。

---

## 4. 架构拓扑

集成方式：**混合渐进** —— 港壳聚合轻内容，重应用子域停靠。

```
        foxerw.com  ──  浮星坞 · starport（Astro 港壳）
    ┌────────────────────────────────────────────┐
    │  狐狸守港人 · 关于我 · 生活随笔 · 星际导航    │  ← 晨雾星港主题
    └─────────────────┬──────────────────────────┘
                      │ 子域停靠（microverse 引擎）
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
 blog.foxerw.com  notes.foxerw.com  (未来更多船)
 personal-blog    sticky-notes       ···
 (Astro 长文)      (静态便签)
```

边界原则：

- **收进港壳**（统一 UI）：关于我、生活随笔、导航、最新动态——轻内容，用 Markdown + content collections 管理。
- **子域停靠**（独立 UI）：博客全文、便签等重量级独立应用，保留自身仓库与视觉，仅作为子域挂载。
- **外链聚合**：GitHub、博客园旧链、社交账号收进「星际导航」。

---

## 5. 组件

### 5.1 starport（港壳，新建）

- 定位：`foxerw.com` 根域的 Astro 静态站，是「浮星坞」的门面。
- 职责：首页 hero、关于我、生活随笔、星际导航、最新动态聚合。
- 技术：Astro + Content Collections + Tailwind；晨雾星港主题。

### 5.2 microverse（引擎，已有）

- 定位：部署与管理微型应用的 Web 平台（`kuoluosaigai/microverse`，Organization 下）。
- 能力：创建/上传/部署应用（http-server / npm / nginx），自动分配端口，PM2 进程管理，`*.foxerw.com` 子域反代，自定义域名映射，根域默认应用。
- 在本项目中：作为「坞」的引擎，负责把所有船部署到同一台服务器并暴露子域。

### 5.3 personal-blog（船，已有）

- Astro 5 静态博客，Markdown 长文，已支持部署到 microverse（npm 类型）。
- 停靠：`blog.foxerw.com`。

### 5.4 sticky-notes（船，已有）

- 纯静态便签应用（HTML/CSS/JS + Python 脚本写 JSON）。
- 停靠：`notes.foxerw.com`（http-server 类型）。

---

## 6. 内容泊位图

| 泊位 | 放什么 | 现状 | 归宿 |
|---|---|---|---|
| 港首页 `foxerw.com/` | 关于我 · 生活随笔 · 星际导航 · 最新动态 | `foxerw` 仓库（个人介绍）+ 博客园（随笔） | 新建 `starport` |
| 博客 `blog.foxerw.com` | 长文 / 技术文章 | `personal-blog` | 保持独立，子域停靠 |
| 便签 `notes.foxerw.com` | 便签 | `sticky-notes` | 保持独立，子域停靠 |
| 外链 | GitHub · 博客园 · 社交 | 外部 | 收进「星际导航」 |

**内容迁移项**：博客园「生活随笔」需手动搬运进 `starport` 的 content collection（Markdown），作为港壳内的随笔栏。

---

## 7. 技术栈

| 组件 | 栈 | 状态 |
|---|---|---|
| 港壳 `starport` | Astro + Content Collections + Tailwind，晨雾星港主题 | 新建 |
| 引擎 `microverse` | Node/Express + React + SQLite + PM2 + nginx | 已有 |
| `personal-blog` | Astro 5 + Tailwind + React islands + Pagefind + Giscus | 已有 |
| `sticky-notes` | 纯静态 HTML/CSS/JS | 已有 |

---

## 8. 仓库规划

| 仓库 | 动作 |
|---|---|
| `starport` | **新建**，归个人号 `foXerw` |
| `foxerw`（个人介绍） | 归档，README 放跳转链接指向新港 |
| `personal-blog` / `sticky-notes` / `microverse` | 保持不动 |

注：本地目录名与 GitHub 仓库名不强求一致（当前本地目录为 `foxerw-web`，仓库名定为 `starport`）。

---

## 9. 视觉方向

**晨雾星港**：浅色、空气感、浮动的港。区别于 `microverse` 后台的暖纸 editorial 气质，港壳要更轻盈通透。

- 基调：低饱和雾蓝 / 米白 / 淡青，柔和渐变模拟晨雾与海面。
- 意象：散落的星点、海港晨雾、狐狸剪影/标志（守港人）、浮动的船影。
- 排版：轻盈、留白充足，中文优先（衬线标题 + 无衬线正文的平衡）。
- 细节视觉规范（色板、字体、间距、动效）在实现阶段由 frontend-design 流程细化。

---

## 10. 部署与基础设施

- **服务器**：`microverse` 跑在**大陆备案过的服务器**（阿里云 / 腾讯云等），否则 ICP 备案与访问冲突。
- **DNS**：`foxerw.com` A 记录指向服务器；`*.foxerw.com` 通配符记录指向同一服务器（供子域停靠）。
- **microverse 配置**：
  - `PROXY_ENABLED=true`
  - `PROXY_BASE_DOMAIN=foxerw.com`（或 `APP_PUBLIC_URL_TEMPLATE=http://{name}.foxerw.com`）
  - `starport` 标记为 **root-domain default**，服务 `foxerw.com/`。
- **船停靠方式**：
  - `personal-blog` → microverse「npm」类型应用，设 `SITE_URL`，子域 `blog.foxerw.com`。
  - `sticky-notes` → microverse「http-server」类型应用，子域 `notes.foxerw.com`。
- **TLS**：microverse 不自动签发证书，由 `certbot` 等获取后填入 `PROXY_SSL_*` 配置。

---

## 11. 数据流

- **内容链路**：Markdown（content collections）→ git push → Astro 构建 → 静态产物 → microverse 部署。
- **停靠链路**：microverse 分配端口 → nginx 反代 → 子域 / 根域映射 → 浏览器访问。
- **最新动态聚合（Phase 3）**：港首页拉取各船的 RSS / 简版 API，聚合展示。

---

## 12. 渐进路线

- **Phase 0（已完成）**：`microverse` 可部署微应用；`personal-blog` 已支持 microverse 部署。
- **Phase 1（港壳 v1）**：建 `starport` —— 狐狸 hero + 关于我 + 生活随笔 + 星际导航 + 最新动态（先手工维护的简单列表占位，Phase 3 再改为自动聚合），晨雾星港主题，部署为 microverse 根域，`foxerw.com` 上线。
- **Phase 2（船停靠）**：blog / notes 子域映射（microverse `PROXY_ENABLED` + 通配符 DNS）。
- **Phase 3（聚合增强）**：港首页聚合各船「最新动态」；归档旧 `foxerw` 仓库并导流。

---

## 13. 风险与开放问题

1. **生活随笔迁移**：博客园随笔需手动搬为 Markdown，存在格式转换与整理成本。
2. **晨雾星港视觉细节**：具体色板 / 字体 / 动效待实现阶段用 frontend-design 流程定稿。
3. **ICP 备案状态**：需确认服务器是否已完成备案、`foxerw.com` 是否已绑定（备案名「浮星坞」已定，主体与接入商待确认）。
4. **microverse 权限与域名**：子域反代需要 microverse 进程有写 nginx conf 与 `nginx -s reload` 的权限（通常 PM2 以 root 或 nginx 组运行）。
