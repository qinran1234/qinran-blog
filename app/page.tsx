import { ArrowRight, AtSign, BookOpen, CalendarDays, Code2, FileText, FlaskConical, Heart, Orbit, Sigma, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogMascot } from "@/components/blog-mascot";
import { StatusBadge } from "@/components/status-badge";
import { researchTrail } from "@/data/research-trail";
import { getAllContent } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

const modules = [
  { href: "/research-trail", index: "01", title: "学习与科研", description: "路线、阶段和公开产出", icon: Orbit, tone: "mint" },
  { href: "/experiments", index: "02", title: "实验记录", description: "问题、方法与复现信息", icon: FlaskConical, tone: "coral" },
  { href: "/projects", index: "03", title: "项目导航", description: "代码、工具和正在做的事", icon: Code2, tone: "blue" },
  { href: "/friends", index: "04", title: "友链花园", description: "值得慢慢阅读的个人空间", icon: Heart, tone: "yellow" },
];

const siteDays = Math.max(1, Math.floor((Date.now() - Date.parse(`${siteConfig.establishedAt}T00:00:00+08:00`)) / 86_400_000) + 1);

export default function Home() {
  const posts = getAllContent("blog");
  const [featured, ...morePosts] = posts;
  const totalWords = posts.reduce((total, post) => {
    const cjkCount = post.body.match(/[\u3400-\u9fff]/gu)?.length ?? 0;
    const latinCount = post.body.match(/[a-zA-Z0-9]+/gu)?.length ?? 0;
    return total + cjkCount + latinCount;
  }, 0);

  return (
    <main>
      <section className="personal-hero">
        <div className="shell personal-hero-grid">
          <div className="personal-hero-copy">
            <div className="eyebrow"><span /> HALF-PAGE UNIVERSE</div>
            <h1>半页宇宙</h1>
            <p className="hero-lead">记录代码、阅读、实验与仍在延伸的学习轨迹。</p>
            <div className="now-pill"><i /> 当前阶段：Python、数学与 ML 基础复苏</div>
            <div className="hero-actions">
              <Link href="/blog" className="button primary">读最新文章 <ArrowRight size={18} /></Link>
              <Link href="/research-trail" className="button secondary">看看学习路线 <BookOpen size={18} /></Link>
            </div>
            <div className="hero-utility social-links" aria-label="qinran 的社交链接">
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub</a>
              <a href={siteConfig.social.qqMail}><AtSign size={17} /> QQ邮箱</a>
              <a href={siteConfig.social.bilibili} target="_blank" rel="noreferrer"><Video size={17} /> B站主页</a>
            </div>
          </div>
          <BlogMascot />
        </div>
      </section>

      <section className="site-stats-band" aria-label="站点统计">
        <div className="shell site-stats-grid">
          <div className="stats-intro"><span>SITE LOG</span><strong>一些缓慢增长的数字</strong></div>
          <div className="stat-item"><CalendarDays size={20} /><span><small>建站于 {formatDate(siteConfig.establishedAt)}</small><strong>{siteDays}</strong><em>天</em></span></div>
          <div className="stat-item"><FileText size={20} /><span><small>公开文章</small><strong>{posts.length}</strong><em>篇</em></span></div>
          <div className="stat-item"><Sigma size={20} /><span><small>累计字数</small><strong>{totalWords.toLocaleString("zh-CN")}</strong><em>字</em></span></div>
        </div>
      </section>

      <section className="section shell latest-blog-section" aria-labelledby="latest-blog-title">
        <div className="section-heading split-heading">
          <div><div className="eyebrow">LATEST LETTERS</div><h2 id="latest-blog-title">最近写下的</h2></div>
          <p>文章是这个站点的主角。技术、研究、工具和日常观察都会在这里慢慢积累。</p>
        </div>
        {featured && (
          <div className="featured-post-layout">
            <article className="featured-post">
              <Link href={`/blog/${featured.slug}`} className="featured-cover"><Image src={featured.cover} alt={`${featured.title} 的原创封面`} width={1200} height={640} priority /></Link>
              <div className="featured-copy"><div className="blog-row-meta"><span>FEATURED</span><time dateTime={featured.date}>{formatDate(featured.date)}</time></div><h3><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h3><p>{featured.description}</p><Link href={`/blog/${featured.slug}`} className="text-link">继续阅读 <ArrowRight size={16} /></Link></div>
            </article>
            <div className="recent-post-stack">
              {morePosts.slice(0, 2).map((post, index) => (
                <article key={post.slug}><span className="post-stack-index">0{index + 2}</span><div><div className="blog-row-meta"><time dateTime={post.date}>{formatDate(post.date)}</time></div><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>
              ))}
              <Link href="/blog" className="all-posts-link">查看全部文章 <ArrowRight size={17} /></Link>
            </div>
          </div>
        )}
      </section>

      <section className="explore-band" aria-labelledby="explore-title">
        <div className="shell">
          <div className="section-heading"><div className="eyebrow">EXPLORE / SHORTCUTS</div><h2 id="explore-title">从这里继续逛</h2></div>
          <div className="module-grid">
            {modules.map(({ href, index, title, description, icon: Icon, tone }) => (
              <Link href={href} className={`module-item ${tone}`} key={href}><span>{index}</span><div className="module-icon"><Icon size={24} /></div><h3>{title}</h3><p>{description}</p><ArrowRight className="module-arrow" size={18} /></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="research-home-band" aria-labelledby="research-home-title">
        <div className="shell research-home-grid">
          <div className="section-heading"><div className="eyebrow">RESEARCH SIDE QUEST</div><h2 id="research-home-title">学习与科研近况</h2><p>它不再占据整个首页，但会作为一条长期支线保留下来：从基础、实验到最小复现。</p><div className="research-home-actions"><Link href="/research-trail" className="text-link">完整路线 <ArrowRight size={16} /></Link><Link href="/experiments" className="text-link">实验记录 <ArrowRight size={16} /></Link></div></div>
          <ol className="research-home-list">
            {researchTrail.slice(0, 4).map((stage) => <li key={stage.id}><span>{stage.index}</span><div><strong>{stage.title}</strong><small>{stage.summary}</small></div><StatusBadge status={stage.status} /></li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}
