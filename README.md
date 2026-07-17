# 半页宇宙 · Personal Blog

[半页宇宙](https://kiran-ovo.me) 是 qinran 的个人博客，记录代码、学习、项目与偶尔跑偏的灵感。内容以 Markdown 保存在仓库中，构建后发布为静态站点。

## 技术与发布

- Next.js 16、React 19、TypeScript、Tailwind CSS 4
- 本地 Markdown + YAML frontmatter；Zod 负责元数据校验
- React Markdown + GitHub Flavored Markdown 渲染正文
- GitHub Actions 构建静态文件，并发布到 ECS；Caddy 提供 HTTP/HTTPS

发布链路：

```text
push main
  -> GitHub Actions: npm ci / lint / build
  -> 上传 out/ 静态文件到 ECS
  -> Caddy 提供当前发布版本
```

生产环境不需要数据库、CMS、服务端密钥或在 ECS 上执行 `npm install`。

## 本地开发

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。提交前执行：

```bash
npm run lint
npm run build
```

`npm run build` 会生成 `out/` 静态目录；静态导出限制了依赖运行时服务端能力的方案，例如 API Route、Server Actions 和按请求生成的动态页面。

## 内容结构

```text
content/
├─ blog/          # 文章、随笔与项目复盘
├─ experiments/   # 可复现实验记录
├─ notes/         # 概念、论文与阅读笔记
└─ engineering/   # 脱敏后的工程记录
public/covers/    # 文章封面
```

新建文件使用英文 kebab-case slug，例如 `content/blog/my-first-post.md`。所有公开内容都必须有完整 frontmatter：

```yaml
---
title: "文章标题"
description: "一句话说明文章解决的问题或提供的价值"
date: "2026-07-16"
tags:
  - Python
status: "Published"
draft: false
cover: "/covers/my-first-post.svg"
---
```

- `draft: true` 的文件不会出现在页面或 sitemap 中。
- `date` 使用 `YYYY-MM-DD`，不预填未来日期。
- `cover` 使用仓库内的 `/covers/...` 路径；没有合适封面时，先新建草稿，不使用无关图片。
- 不发布私人笔记、密钥、账号信息、未脱敏日志或未经许可的第三方材料。

## Markdown 写作规范

### 通用文章

适合博客文章、技术复盘和项目记录。先写结论与背景，再给出过程和可复用的信息。

```md
---
title: "标题"
description: "摘要"
date: "2026-07-16"
tags: ["Tag A", "Tag B"]
status: "Published"
draft: false
cover: "/covers/slug.svg"
---

> 一句话结论或适用范围。

## 背景与问题

## 做法

## 结果与反思

## 参考与延伸
- [资料名称](https://example.com)
```

### 实验记录

没有真实结果时必须明确写“尚未运行”或“计划中”，不要填写估算指标或伪造表格。实验应让别人能够判断结论是否可信并尝试复现。

```md
---
title: "实验名称"
description: "变量、任务与预期观察"
date: "2026-07-16"
tags: ["PyTorch", "Experiment"]
status: "In progress"
draft: true
cover: "/covers/experiment.svg"
---

## 研究问题

## 数据与设置
- 数据集与划分：
- 模型与版本：
- 随机种子：
- 计算环境：

## 方法与变量

## 结果
| 设置 | 指标 | 备注 |
| --- | --- | --- |

## 复现信息

## 局限与下一步
```

### 阅读与概念笔记

将“资料原意”和“自己的理解”分开，引用给出原始链接、作者或论文信息；笔记不应替代原文。

```md
---
title: "概念或论文标题"
description: "这篇笔记试图回答的问题"
date: "2026-07-16"
tags: ["Concepts"]
status: "Public note"
draft: false
cover: "/covers/note.svg"
---

## 原始资料

## 核心概念

## 我的理解

## 最小示例

## 未解决的问题
```


### 算法题解

算法学习以 LeetCode 复盘为主，题解应保留能复用的思维过程。题目内容只摘录必要约束，完整题面链接回 LeetCode；不要复制整段题目描述。

```md
---
title: "两数之和：哈希表的一次遍历"
description: "从暴力枚举到哈希表查找，解释为什么先查再存。"
date: "2026-07-16"
tags: ["LeetCode", "Hash Table", "Array"]
status: "Solved"
draft: false
cover: "/covers/two-sum.svg"
---

## 题目
- [LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)
- 难度：Easy

## 思路演进
### 方案一：暴力枚举

### 方案二：哈希表

## 正确性说明

## 复杂度
- 时间：O(n)
- 空间：O(n)

## 易错点与变体

## 代码
```python
# 保留能独立运行的核心实现
```
```

### 日常分享

旅行、毕业典礼和生活记录放在 `content/blog/`。日常文章不需要工程化模板，但应交代时间、地点或事件背景，并避免公开他人的敏感身份与未授权照片。

```md
---
title: "毕业典礼那天"
description: "把一个阶段的结束，写成给未来自己的简短记录。"
date: "2026-07-16"
tags: ["日常", "毕业"]
status: "Published"
draft: false
cover: "/covers/graduation.svg"
---

## 那天发生了什么

## 想记住的片段

## 留给以后的一句话
```
## 站点资料

公共资料统一维护在 `lib/site.ts`：GitHub、QQ 邮箱和 B 站主页。项目清单维护在 `data/projects.ts`，按“个人项目”和“课程实践”展示。添加复现或改进项目时，需在说明里写清原项目来源、自己的改动和当前完成度。

`NEXT_PUBLIC_SITE_URL` 用于 sitemap、robots 与 metadata 的绝对 URL。生产环境设置为：

```text
NEXT_PUBLIC_SITE_URL=https://kiran-ovo.me
```

## 部署

工作流位于 `.github/workflows/deploy-static.yml`。它需要以下 GitHub Actions Secrets：

```text
DEPLOY_HOST
DEPLOY_USER
DEPLOY_SSH_KEY
DEPLOY_HOST_FINGERPRINT
```

首次部署和服务器维护见 [DEPLOYMENT.md](./DEPLOYMENT.md)。域名备案完成后，将 `kiran-ovo.me` 和 `www` 的 DNS 解析到 ECS，再将 Caddy 配置切换为域名站点以启用自动 HTTPS。