"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ContentMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function BlogBrowser({ posts }: { posts: ContentMeta[] }) {
  const tags = ["全部", ...Array.from(new Set(posts.flatMap((post) => post.tags)))];
  const [activeTag, setActiveTag] = useState("全部");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-CN");
    return posts.filter((post) => {
      const tagMatch = activeTag === "全部" || post.tags.includes(activeTag);
      const queryMatch = !needle || `${post.title} ${post.description} ${post.tags.join(" ")}`.toLocaleLowerCase("zh-CN").includes(needle);
      return tagMatch && queryMatch;
    });
  }, [activeTag, posts, query]);

  return (
    <div>
      <div className="blog-tools">
        <label className="blog-search">
          <Search size={17} />
          <span className="sr-only">搜索文章</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、摘要或标签" />
        </label>
        <div className="blog-tags" aria-label="按标签筛选文章">
          {tags.map((tag) => (
            <button key={tag} type="button" className={activeTag === tag ? "active" : undefined} aria-pressed={activeTag === tag} onClick={() => setActiveTag(tag)}>{tag}</button>
          ))}
        </div>
        <span className="blog-count" aria-live="polite">{filtered.length} 篇</span>
      </div>

      {filtered.length ? (
        <div className="blog-list">
          {filtered.map((post, index) => (
            <article className="blog-row" key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="blog-row-cover" tabIndex={-1} aria-hidden="true">
                <Image src={post.cover} alt="" width={1200} height={640} sizes="(max-width: 760px) 100vw, 360px" priority={index === 0} />
              </Link>
              <div className="blog-row-copy">
                <div className="blog-row-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTime} 分钟</span></div>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.description}</p>
                <div className="blog-row-bottom"><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={`/blog/${post.slug}`} className="round-arrow" aria-label={`阅读 ${post.title}`}><ArrowUpRight size={18} /></Link></div>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state">没有找到匹配的文章，换一个关键词试试。</div>}
    </div>
  );
}
