---
title: "如何“优雅”地搭建一个静态个人博客"
description: "从一个念头开始，用 Next.js、Markdown、GitHub Actions、ECS 和 Caddy 从零搭建可自动发布的静态个人博客。"
date: "2026-07-16"
tags:
  - Next.js
  - GitHub Actions
  - Caddy
  - 建站记录
status: "Published"
draft: false
cover: "/covers/static-blog-setup.png"
---

> 标题里的“优雅”只是一个有趣的说法。这篇文章真正想留下的，是我从零搭建个人博客的完整流程：以后自己需要重装时能照着做，也希望能给想拥有个人站点的人提供一点参考。

## 写在前面：为什么突然想做一个博客

起因其实很简单。我在 B 站刷到了一个 UP 主的个人博客：[lvy-neko](https://lvyovo-wiki.tech/)。它不像信息流平台里一篇很快被刷走的动态，而更像一个由自己慢慢布置、会一直留在互联网某处的小房间。

我觉得这种形式很有趣，也很有纪念意义，于是开始向往拥有一个自己的站点。

正好那段时间我也在整理本地知识库 `ResearchVault`，尝试建立自己的学习和研究流程。知识库适合保留完整、私人的思考，博客则适合把经过筛选和整理的内容公开出来。两者可以分工：

```text
本地知识库：完整记录、私人上下文、尚未整理的想法
个人博客：公开文章、算法复盘、实验记录、知识笔记与生活片段
```

所以，这个博客不只是一个网页练习。它更像是本地知识库面向公开世界的一扇窗，也用来记录我在不同阶段做过什么、学过什么，以及当时是怎么想的。

## 为什么最后选择静态博客

我一开始并没有很强的技术偏好。选择静态博客，最主要的原因是：**动态网站对我现在的需求来说太复杂，而静态网站设计简单、部署简单、维护也简单。**

我的博客暂时不需要用户登录、评论系统、管理后台或实时数据库。文章本身就是 Markdown 文件，那么最自然的做法就是在发布前把所有页面生成好，服务器只负责把文件发给浏览器。

静态方案还有一些附带优点：

- 服务器不需要常驻 Node.js 应用。
- 不需要数据库、CMS 和后端接口。
- 页面生成后只是普通 HTML、CSS、JavaScript 和图片。
- 低配置服务器也能轻松托管。
- 发布失败不会影响当前正在使用的旧版本。
- 整个站点可以放进 Git，迁移和恢复都比较直接。

这里的“静态”不是说页面设计不能交互。主题切换、文章搜索、标签筛选和响应式布局仍然可以在浏览器里运行；只是线上服务器不需要每次接到请求后再动态生成页面。

## 最终架构与技术栈

我最终采用的技术栈并不复杂：

| 部分 | 选择 | 作用 |
| --- | --- | --- |
| 页面框架 | Next.js App Router | 组织页面、路由、metadata 和静态导出 |
| 语言 | TypeScript + React | 编写页面和内容组件 |
| 样式 | Tailwind CSS 4 + 全局 CSS | 页面布局、主题和响应式设计 |
| 内容 | Markdown + YAML frontmatter | 保存文章与元数据 |
| 内容校验 | gray-matter + Zod | 解析并检查文章字段 |
| 自动构建 | GitHub Actions | 安装依赖、lint、构建静态文件 |
| 云服务器 | Ubuntu ECS | 保存并提供静态发布产物 |
| Web Server | Caddy | 静态文件、压缩、安全响应头和 HTTPS |
| 发布通道 | SSH + SCP | 从 GitHub Actions 上传构建结果 |

最终发布链路是：

```text
本地编写 Markdown / 修改页面
        ↓
git commit + git push
        ↓
GitHub Actions 执行 npm ci、lint、build
        ↓
生成并打包 out/
        ↓
SSH 上传到 ECS 的独立 release 目录
        ↓
切换 current 软链接
        ↓
Caddy 提供静态文件
```

下面从空目录开始，一步步搭建。

## 0. 开始前需要准备什么

你需要准备：

- 一台安装了 Node.js 22 或更新版本的电脑。
- 一个 GitHub 账号。
- 一个 GitHub 仓库。
- 一台 Ubuntu 24.04 云服务器，个人博客使用 2 核 2 GB 已经足够。
- 一个域名；如果服务器在中国大陆，还需要完成域名实名认证和 ICP 备案。
- 能连接服务器的 SSH 客户端。Windows 11 自带的 PowerShell 已经可以使用 `ssh` 和 `scp`。

先检查本机环境：

```powershell
node --version
npm --version
git --version
ssh -V
```

本文中的域名、仓库地址和服务器地址都使用占位符。实际操作时替换成自己的值：

```text
<YOUR_DOMAIN>       例如 blog.example.com
<YOUR_SERVER_IP>    云服务器公网 IPv4
<YOUR_GITHUB_REPO>  GitHub 仓库 HTTPS 地址
```

## 1. 创建本地 Next.js 项目

### 1.1 初始化项目

在准备存放项目的目录中执行：

```powershell
npx create-next-app@latest qinran-blog `
  --typescript `
  --tailwind `
  --eslint `
  --app `
  --import-alias "@/*"

cd qinran-blog
```

安装 Markdown 内容系统需要的依赖：

```powershell
npm install gray-matter zod react-markdown remark-gfm
```

先确认最小项目可以运行：

```powershell
npm run dev
```

打开 `http://127.0.0.1:3000`。看到 Next.js 页面后，说明本地环境没有问题。

### 1.2 配置静态导出

修改 `next.config.ts`：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

关键配置是 `output: "export"`。执行生产构建后，Next.js 会把所有可静态生成的页面输出到 `out/`。

`trailingSlash: true` 会让页面使用目录形式，例如：

```text
/blog/my-first-post/
```

这与后面 Caddy 的静态文件匹配方式比较契合。

### 1.3 设计 Markdown 内容目录

我的内容最终分成四种：

```text
content/
├─ blog/          # 建站、旅行、毕业典礼等文章和日常分享
├─ algorithms/    # LeetCode 题解与算法复盘
├─ experiments/   # 实验设置、结果和复现信息
└─ notes/         # 知识、论文与概念笔记
```

每篇内容使用 YAML frontmatter：

```yaml
---
title: "文章标题"
description: "一句话摘要"
date: "2026-07-16"
tags:
  - Next.js
status: "Published"
draft: false
cover: "/covers/example.png"
---
```

我用 `gray-matter` 读取 frontmatter，用 Zod 校验字段。这样如果漏写日期、标签类型错误或 `draft` 不是布尔值，构建会直接失败，而不会把不完整内容发布出去。

`draft: true` 的文章不会进入列表、详情路由和 sitemap。写作时先保留草稿，准备好后再改为 `false`。

### 1.4 本地检查与构建

每次准备发布前执行：

```powershell
npm run lint
npm run build
```

构建完成后应该看到：

```text
out/
├─ index.html
├─ blog/
├─ projects/
├─ sitemap.xml
└─ ...
```

这整个 `out/` 就是以后上传到服务器的站点，不需要把源码和 `node_modules` 一起放到线上。

## 2. 将项目推送到 GitHub

如果项目还没有 Git 仓库：

```powershell
git init
git add .
git commit -m "Initial blog"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO>
git push -u origin main
```

仓库必须包含：

- `package.json` 和 `package-lock.json`
- `next.config.ts`
- `content/`
- `public/`
- 页面和组件源码

不要提交：

- `.env`、私钥或 API key
- `node_modules/`
- `.next/`
- `out/`
- 本地私人知识库路径或内容

GitHub 只保存源码和公开内容，静态产物由 Actions 每次重新生成。

## 3. 购买并初始化云服务器

### 3.1 服务器怎么选

我选择了阿里云杭州地区的低价 Ubuntu 实例。对纯静态博客，2 核 2 GB、较小系统盘就足够；因为最终服务器不执行 `npm ci` 和 `next build`，它的资源压力很低。

购买时选择：

```text
系统：Ubuntu 24.04 LTS
架构：x86_64
公网 IPv4：需要
带宽：个人博客按实际预算选择
```

创建实例后，在云厂商安全组中开放：

| 端口 | 用途 | 建议来源 |
| --- | --- | --- |
| 22/TCP | SSH | 初期临时使用，稳定后限制为自己的公网 IP |
| 80/TCP | HTTP | `0.0.0.0/0` |
| 443/TCP | HTTPS | `0.0.0.0/0` |

不要把 Next.js 的 `3000` 端口暴露到公网；最终方案也不需要它。

### 3.2 安装服务器软件

用云厂商提供的终端或本机 SSH 登录服务器：

```powershell
ssh root@<YOUR_SERVER_IP>
```

在 Ubuntu 中执行：

```bash
apt update
apt upgrade -y
apt install -y caddy openssh-server tar ca-certificates

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

检查 Caddy：

```bash
systemctl enable --now caddy
systemctl status caddy --no-pager
```

### 3.3 创建专用发布账号和目录

不要让 GitHub Actions 长期使用 root。创建一个只负责上传静态文件的账号：

```bash
id site-deploy >/dev/null 2>&1 || \
  useradd --system \
  --create-home \
  --home-dir /srv/site-deploy \
  --shell /bin/bash \
  site-deploy

install -d -o site-deploy -g site-deploy -m 755 /srv/kiran-blog
install -d -o site-deploy -g site-deploy -m 755 /srv/kiran-blog/releases
```

这里有一个容易踩到的坑：`site-deploy` 不能使用 `/usr/sbin/nologin`。虽然它不需要 sudo 权限，但 GitHub Actions 要通过 SSH 执行 `mkdir`、`tar` 和软链接切换，所以必须有可用 shell。

确认：

```bash
getent passwd site-deploy
```

输出最后应该是：

```text
/bin/bash
```

## 4. 配置 GitHub Actions 使用的 SSH 密钥

### 4.1 在本机生成专用密钥

回到本机 PowerShell：

```powershell
ssh-keygen -t ed25519 `
  -C "github-actions-blog" `
  -f "$env:USERPROFILE\.ssh\blog_github_actions"
```

提示输入 passphrase 时直接按两次回车。无人值守的 GitHub Actions 无法交互输入密码，因此这把专用部署密钥不设置 passphrase。

会生成：

```text
blog_github_actions       # 私钥，只能放进 GitHub Secret
blog_github_actions.pub   # 公钥，放到服务器
```

不要把私钥贴到聊天、提交到仓库或复制到服务器公开目录。

### 4.2 把公钥加入服务器

在本机查看公钥：

```powershell
Get-Content "$env:USERPROFILE\.ssh\blog_github_actions.pub"
```

复制完整的一行。在服务器执行：

```bash
install -d -o site-deploy -g site-deploy -m 700 /srv/site-deploy/.ssh
nano /srv/site-deploy/.ssh/authorized_keys
```

粘贴公钥并保存，然后设置权限：

```bash
chown site-deploy:site-deploy /srv/site-deploy/.ssh/authorized_keys
chmod 600 /srv/site-deploy/.ssh/authorized_keys
```

本机验证登录和目录权限：

```powershell
ssh -i "$env:USERPROFILE\.ssh\blog_github_actions" `
  site-deploy@<YOUR_SERVER_IP> `
  "id; test -w /srv/kiran-blog/releases && echo deployment-write-ok"
```

看到下面这行才继续：

```text
deployment-write-ok
```

### 4.3 固定服务器 SSH 主机指纹

SSH 不只需要确认客户端密钥，还要确认连接的是正确服务器。在服务器执行：

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub -E sha256
```

输出类似：

```text
256 SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx root@server (ED25519)
```

只记录中间的 `SHA256:...`。后面会放入 GitHub Secret。主机指纹不是私钥，但也应通过你已经信任的服务器终端获取，而不是盲目信任网络扫描结果。

## 5. 先用 Caddy 提供静态文件

### 5.1 备案完成前用 IP 测试

如果域名还不能正式使用，可以先配置一个临时 HTTP 站点。编辑服务器文件：

```bash
nano /etc/caddy/Caddyfile
```

写入：

```caddyfile
:80 {
  encode zstd gzip

  root * /srv/kiran-blog/current
  try_files {path} {path}/ {path}.html
  file_server
}
```

第一次发布前 `current` 还不存在，所以暂时访问不到页面是正常的。检查并加载配置：

```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
```

### 5.2 为什么需要 `try_files`

Next.js 静态导出会生成目录页面和 HTML 文件。下面这行会依次尝试原始路径、目录和 `.html`：

```caddyfile
try_files {path} {path}/ {path}.html
```

因此直接打开文章 URL、刷新详情页或访问带尾斜杠的路径都可以正确匹配。

## 6. 配置 GitHub Actions 自动发布

### 6.1 创建四个 Repository Secrets

进入 GitHub 仓库：

```text
Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

依次创建：

| Secret | 内容 |
| --- | --- |
| `DEPLOY_HOST` | 服务器公网 IP，不带 `http://` |
| `DEPLOY_USER` | `site-deploy` |
| `DEPLOY_SSH_KEY` | `blog_github_actions` 私钥的完整内容，包括 BEGIN/END 行 |
| `DEPLOY_HOST_FINGERPRINT` | 上一步取得的 `SHA256:...` |

在 Windows 查看私钥内容：

```powershell
Get-Content "$env:USERPROFILE\.ssh\blog_github_actions"
```

只把它粘贴到 GitHub Secret 文本框，不要贴到其他地方。

### 6.2 添加部署工作流

创建 `.github/workflows/deploy-static.yml`：

```yaml
name: Deploy Static Site

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: static-production-deploy
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_SITE_URL: https://<YOUR_DOMAIN>
      DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
      DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
      DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
      DEPLOY_HOST_FINGERPRINT: ${{ secrets.DEPLOY_HOST_FINGERPRINT }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: tar -C out -czf site.tar.gz .

      - name: Configure deployment SSH key
        run: |
          install -d -m 700 ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/id_ed25519
          actual_host_key="$(ssh-keyscan -T 10 -t ed25519 "$DEPLOY_HOST" 2>/dev/null)"
          actual_fingerprint="$(printf '%s\n' "$actual_host_key" | ssh-keygen -lf - -E sha256 | awk '{print $2}')"
          test -n "$actual_host_key"
          test "$actual_fingerprint" = "$DEPLOY_HOST_FINGERPRINT"
          printf '%s\n' "$actual_host_key" > ~/.ssh/known_hosts
          chmod 600 ~/.ssh/id_ed25519 ~/.ssh/known_hosts

      - name: Upload and activate release
        run: |
          scp -i ~/.ssh/id_ed25519 site.tar.gz "$DEPLOY_USER@$DEPLOY_HOST:/srv/kiran-blog/releases/$GITHUB_SHA.tar.gz"
          ssh -i ~/.ssh/id_ed25519 "$DEPLOY_USER@$DEPLOY_HOST" "\
            set -eu; \
            release_dir=/srv/kiran-blog/releases/$GITHUB_SHA; \
            mkdir -p \"\$release_dir\"; \
            tar -xzf /srv/kiran-blog/releases/$GITHUB_SHA.tar.gz -C \"\$release_dir\"; \
            rm /srv/kiran-blog/releases/$GITHUB_SHA.tar.gz; \
            ln -sfn \"\$release_dir\" /srv/kiran-blog/current; \
            find /srv/kiran-blog/releases -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\\n' | sort -nr | tail -n +6 | cut -d' ' -f2- | xargs -r rm -rf"
```

这段工作流完成四件事：

1. 在 GitHub 的 Ubuntu Runner 中安装依赖并执行检查。
2. 把 `out/` 打包为 `site.tar.gz`。
3. 校验服务器 ed25519 主机指纹，再上传压缩包。
4. 解压到以 Git commit SHA 命名的目录，切换 `current`，并只保留最近五个版本。

### 6.3 为什么使用 release 目录和软链接

服务器目录结构会变成：

```text
/srv/kiran-blog/
├─ releases/
│  ├─ <commit-a>/
│  ├─ <commit-b>/
│  └─ <commit-c>/
└─ current -> releases/<commit-c>
```

上传和解压过程中，Caddy 仍然读取旧的 `current`。新版本准备完整后，`ln -sfn` 一次切换软链接，不会出现页面一半新、一半旧的状态。

## 7. 触发第一次自动部署

提交工作流并推送：

```powershell
git add .github/workflows/deploy-static.yml
git commit -m "Add static deployment workflow"
git push
```

进入 GitHub 仓库的 `Actions` 页面，打开 `Deploy Static Site`。正常情况下会依次看到：

```text
npm ci
npm run lint
npm run build
Configure deployment SSH key
Upload and activate release
```

全部变绿后，先访问：

```text
http://<YOUR_SERVER_IP>
```

如果首页可以打开，说明从 GitHub 构建到 ECS 静态托管的链路已经完整打通。

## 8. 我实际遇到的几个问题

### 8.1 `This account is currently not available`

原因是创建 `site-deploy` 时使用了 `nologin` shell。SCP 上传和远程激活都需要执行命令，因此改成：

```bash
usermod -s /bin/bash site-deploy
```

这个账号仍然没有 sudo 权限，只拥有发布目录，所以不等于给自动化流程开放 root。

### 8.2 `Host key verification failed`

最初尝试把 `ssh-keyscan` 的多行输出直接放进 `DEPLOY_KNOWN_HOSTS`，但 Secret 的换行或格式处理很容易出问题。重复运行时一直出现：

```text
Host key verification failed.
scp: Connection closed
```

最终改为只保存服务器的 SHA256 主机指纹。工作流运行时重新扫描 ed25519 公钥，计算指纹并比对，匹配后才写入 `known_hosts`。

不要为了让部署变绿而设置：

```text
StrictHostKeyChecking=no
```

那会直接跳过服务器身份确认。

### 8.3 在 ECS 上执行构建导致 IOPS 紧张

我曾经尝试过更传统的流程：服务器 `git pull`、`npm ci`、`npm run build`，再通过 systemd 常驻运行 Next.js；也短暂尝试过通过 IP Webhook 自动触发服务器构建。

问题是低价云服务器的系统盘随机读写能力有限。安装依赖和 Next.js 构建会产生大量小文件读写，出现 CPU 和内存没有完全占满，但终端卡顿、构建很慢、系统盘 IOPS 饱和的情况。

这也是最终改为静态发布的直接原因：

```text
旧方案：ECS 拉源码 + 安装依赖 + 构建 + 运行 Node
新方案：GitHub 构建 out/ + ECS 只保存和提供静态文件
```

迁移完成后，可以停用旧应用服务和 Webhook：

```bash
systemctl disable --now qinran-blog
systemctl disable --now kiran-webhook
```

确认新的 Actions 发布连续成功后，再人工清理旧脚本和目录。不要在没有验证静态站点与回滚之前急着删除旧版本。

## 9. 域名、备案与 HTTPS

如果使用中国大陆服务器，推荐顺序是：

```text
购买域名
→ 域名实名认证
→ 购买或绑定云服务器
→ 提交 ICP 备案
→ 备案通过
→ DNS 解析到服务器
→ Caddy 切换域名配置
→ 验证 HTTPS
```

备案等待期间，仍然可以通过 IP 完成页面设计、文章编写、Actions 部署、服务器快照和回滚测试。

备案通过后，在 DNS 中添加：

```text
@     A     <YOUR_SERVER_IP>
www   A     <YOUR_SERVER_IP>
```

把 `/etc/caddy/Caddyfile` 改为：

```caddyfile
<YOUR_DOMAIN>, www.<YOUR_DOMAIN> {
  encode zstd gzip

  root * /srv/kiran-blog/current
  try_files {path} {path}/ {path}.html
  file_server

  header {
    X-Content-Type-Options nosniff
    X-Frame-Options SAMEORIGIN
    Referrer-Policy strict-origin-when-cross-origin
    Permissions-Policy "camera=(), microphone=(), geolocation=()"
    -Server
  }
}
```

验证并重载：

```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
journalctl -u caddy -n 100 --no-pager
```

DNS 已正确解析、80/443 端口可访问时，Caddy 会自动申请和续期 HTTPS 证书。

## 10. 以后如何发布文章

基础设施完成后，日常发布只剩下：

```powershell
# 新建或修改 content/blog/*.md
npm run lint
npm run build

git add content public/covers
git commit -m "Add a new blog post"
git push
```

推送后 GitHub Actions 会自动完成构建、上传和版本切换。服务器不需要再执行 `git pull`、`npm install` 或重启应用。

## 11. 如何验证和回滚

线上验证：

```bash
curl -I https://<YOUR_DOMAIN>
curl -I https://<YOUR_DOMAIN>/blog/
curl -I https://<YOUR_DOMAIN>/sitemap.xml
systemctl status caddy --no-pager
```

查看已有 release：

```bash
ls -lah /srv/kiran-blog/releases
readlink -f /srv/kiran-blog/current
```

需要回滚时，把 `current` 指向之前的完整版本：

```bash
ln -sfn /srv/kiran-blog/releases/<STABLE_COMMIT_SHA> /srv/kiran-blog/current
```

Caddy 直接读取软链接指向的文件，不需要重启 Node.js，也通常不需要重启 Caddy。

## 12. 最终检查清单

本地：

- [ ] `npm ci` 成功。
- [ ] `npm run lint` 成功。
- [ ] `npm run build` 成功并生成 `out/`。
- [ ] Git 仓库没有私钥、`.env` 或私人知识库内容。

服务器：

- [ ] `site-deploy` 可以使用 SSH 密钥登录。
- [ ] `site-deploy` 可以写入 `/srv/kiran-blog/releases`。
- [ ] Caddy 配置验证通过。
- [ ] 云安全组和 UFW 已开放 80/443。
- [ ] 22 端口已尽可能限制来源。

GitHub：

- [ ] 四个 Secrets 名称完全正确。
- [ ] 私钥包含 BEGIN 和 END 行。
- [ ] 主机指纹来自可信服务器终端。
- [ ] Actions 的所有构建和上传步骤为绿色。

上线后：

- [ ] 首页、文章页和刷新后的详情路由正常。
- [ ] `sitemap.xml` 和 `robots.txt` 可以访问。
- [ ] 手机端没有横向溢出。
- [ ] HTTPS 证书正常。
- [ ] 至少保留一个可回滚的旧 release 或服务器快照。

## 写在最后

从第一次在 B 站看到别人的个人博客，到自己的页面真的出现在服务器上，中间经历了设计调整、部署方案变化、服务器构建卡顿和 SSH 校验失败。回头看，真正重要的不是“优雅”地使用了多少技术，而是最后得到了一套自己能够理解、能够复现，也愿意长期维护的流程。

现在，这个站点既可以保存文章，也可以承接本地知识库和研究流程中适合公开的部分。以后再回头看，它记录的不只是当时学会了哪些命令，也记录了我为什么会在那个时间点，想在互联网上拥有这样一个属于自己的小地方。