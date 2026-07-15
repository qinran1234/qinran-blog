import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentEntry } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export function MarkdownArticle({ entry, backHref, backLabel }: { entry: ContentEntry; backHref: string; backLabel: string }) {
  return (
    <main className="article-shell shell">
      <Link href={backHref} className="back-link">← {backLabel}</Link>
      <header className="article-header">
        <div className="article-kicker">{entry.collection.toUpperCase()} / {entry.slug}</div>
        <h1>{entry.title}</h1>
        <p>{entry.description}</p>
        <div className="article-meta">
          <StatusBadge status={entry.status} />
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          <span>{entry.readingTime} 分钟阅读</span>
        </div>
        <div className="tag-row">
          {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </header>
      <div className="article-cover">
        <Image src={entry.cover} alt={`${entry.title} 的原创演示封面`} width={1200} height={640} priority />
      </div>
      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => <h2>{children}</h2>,
            h3: ({ children }) => <h3>{children}</h3>,
            a: ({ href, children }) => <a href={href}>{children}</a>,
            blockquote: ({ children }) => <blockquote>{children}</blockquote>,
            code: ({ className, children }) => <code className={className}>{children}</code>,
            img: ({ src, alt }) => (
              <span className="markdown-figure">
                <Image src={typeof src === "string" ? src : ""} alt={alt ?? "内容插图"} width={1200} height={640} />
              </span>
            ),
          }}
        >
          {entry.body}
        </ReactMarkdown>
      </article>
    </main>
  );
}
