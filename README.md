# 半页宇宙 · Personal Blog

一个基于 Next.js App Router 的个人 Blog。文章是主入口，同时保留经过筛选的学习路线、匿名实验、公开概念笔记、项目导航和友链区域。

当前仓库中的文章、实验结果、项目和友链均包含明确标记的 Demo content，用于验证内容系统和页面能力。上线前需要替换身份、邮箱、项目地址与友链数据。

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- 本地 Markdown + YAML frontmatter
- Zod 内容元数据校验
- React Markdown + GitHub Flavored Markdown

## 本地启动

建议使用 Node.js 24.15 或更新的 LTS 版本，以及随 Node 提供的 npm。

```bash
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

如果依赖没有变化，可以使用锁文件进行确定性安装：

```bash
npm ci
```

## 检查与构建

```bash
npm run lint
npm run build
npm run start
```

`npm run start` 需要先完成 `npm run build`，默认在 `http://localhost:3000` 提供生产构建。

## 内容目录

```text
content/
├─ blog/          # 个人文章与随笔
├─ experiments/   # 学习与科研实验记录
├─ notes/         # 公开阅读与概念笔记
└─ engineering/   # 脱敏工程补充
```

站点只读取以上仓库内目录。内容读取逻辑位于 `lib/content.ts`，会执行 frontmatter 校验、按日期排序，并自动过滤 `draft: true` 的文件。

每篇内容至少包含以下 frontmatter：

```yaml
---
title: "标题"
description: "简短说明"
date: "2026-07-15"
tags:
  - PyTorch
status: "Planned"
draft: false
cover: "/covers/example.svg"
---
```

## 新增文章

1. 在 `content/blog/` 新建以英文 slug 命名的 `.md` 文件，例如 `my-first-post.md`。
2. 填写完整 frontmatter，并把原创封面放到 `public/covers/`。
3. `tags` 会自动成为 `/blog` 的筛选项；标题、摘要和标签均可搜索。
4. 将 `draft` 设为 `false` 后，文章会进入列表、首页和 sitemap。
5. 详情路由会自动生成为 `/blog/my-first-post`。

## 新增实验

1. 在 `content/experiments/` 新建以英文 slug 命名的 `.md` 文件，例如 `small-cnn-ablation.md`。
2. 填写完整 frontmatter，并将封面放到 `public/covers/`。
3. 正文建议依次说明研究问题、设置、方法、结果、复现信息和下一步。
4. 没有真实运行结果时，必须使用 `Demo content`、`尚未运行` 等明确说明，不能填写虚构指标。
5. 运行 `npm run lint` 和 `npm run build`；详情路由会自动生成为 `/experiments/small-cnn-ablation`。

## 新增笔记

1. 在 `content/notes/` 新建 `.md` 文件并填写相同 frontmatter。
2. 使用标签描述概念领域；列表页会自动按年份归档。
3. 将 `draft` 设为 `false` 后才会出现在列表、首页和 sitemap 中。
4. 运行本地开发服务，检查正文、代码块、引用和窄屏排版。

## 站点配置

站点名称、昵称和 GitHub、QQ 邮箱、普通邮箱、B站占位链接位于 `lib/site.ts`。上线前请替换为准备公开的信息。

项目导航位于 `data/projects.ts`，友链数据位于 `data/friends.ts`。根目录中的 `mx-space/` 是独立的本地设计参考仓库，已从主项目 Git 和 ESLint 中忽略，不会参与部署。

学习路线由私人 `ResearchVault` 中的路线文档手工提炼到 `data/research-trail.ts`。网站在开发或运行时都不会自动读取、同步或公开该 Vault；每次更新仍需先人工筛选与脱敏。

生产环境建议设置：

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

该变量用于 metadata、`sitemap.xml` 和 `robots.txt` 中的绝对 URL，不包含任何密钥。

## 部署到 Vercel

1. 将仓库推送到自己的 GitHub、GitLab 或 Bitbucket 私有/公开仓库。
2. 在 Vercel 中选择 **New Project** 并导入该仓库。
3. Framework Preset 保持 **Next.js**，Install/Build/Output 使用自动检测值。
4. 添加 `NEXT_PUBLIC_SITE_URL`，值为最终 Vercel 域名或自定义域名。
5. 首次部署后检查 `/blog` 搜索筛选、Markdown 详情页、项目与友链外链、`/sitemap.xml` 与移动端导航。

本项目不需要数据库、CMS、鉴权、外部内容 API 或服务端密钥。不要在 Vercel 环境变量或仓库中加入私人 Vault 路径。

## 部署到自己的服务器

仓库提供了 `systemd` 服务文件和自动 HTTPS 的 `Caddyfile`，直接使用 Node.js 运行 Next.js，不需要 Docker。Ubuntu 初始化、DNS、启动、更新、回滚和排错命令见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

服务器部署前至少需要：

- Ubuntu 24.04 LTS 服务器，推荐 1 核 2 GB；
- 一个已解析到服务器公网 IP 的域名；
- 根据 `.env.example` 创建的 `.env.production`。
