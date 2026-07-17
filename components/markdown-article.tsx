import Image from "next/image";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentEntry } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { CodeBlock } from "@/components/code-block";

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

function extractTableOfContents(body: string): TocItem[] {
  const items: TocItem[] = [];
  const usedIds = new Map<string, number>();
  let insideCodeBlock = false;

  for (const line of body.split("\n")) {
    if (/^\s*```/u.test(line)) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/u.exec(line);
    if (!match) continue;

    const label = match[2]
      .replace(/`([^`]+)`/gu, "$1")
      .replace(/\[([^\]]+)\]\([^\)]+\)/gu, "$1")
      .trim();
    const baseId = label
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
      .trim()
      .replace(/\s+/gu, "-") || `section-${items.length + 1}`;
    const duplicateIndex = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, duplicateIndex + 1);

    items.push({
      id: duplicateIndex === 0 ? baseId : `${baseId}-${duplicateIndex + 1}`,
      label,
      level: match[1].length as 2 | 3,
    });
  }

  return items;
}

export function MarkdownArticle({ entry, backHref, backLabel }: { entry: ContentEntry; backHref: string; backLabel: string }) {
  const tableOfContents = extractTableOfContents(entry.body);
  let headingIndex = 0;

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
        </div>
        <div className="tag-row">
          {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </header>
      <div className="article-cover">
        <Image src={entry.cover} alt={`${entry.title} 的文章封面`} width={1200} height={640} priority />
      </div>
      <div className="article-body-layout">
        {tableOfContents.length > 0 && (
          <nav className="article-toc" aria-label="文章目录">
            <span>本页目录</span>
            <ol>
              {tableOfContents.map((item) => (
                <li className={`level-${item.level}`} key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <article className="prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 id={tableOfContents[headingIndex++]?.id}>{children}</h2>,
              h3: ({ children }) => <h3 id={tableOfContents[headingIndex++]?.id}>{children}</h3>,
              a: ({ href, children }) => <a href={href}>{children}</a>,
              blockquote: ({ children }) => <blockquote>{children}</blockquote>,
              pre: ({ children }) => {
                const child = isValidElement(children)
                  ? children as ReactElement<{ className?: string; children?: ReactNode }>
                  : null;
                if (!child) return <pre>{children}</pre>;
                const language = child.props.className?.replace(/^language-/u, "") ?? "text";
                const code = String(child.props.children).replace(/\n$/u, "");
                return <CodeBlock code={code} language={language} />;
              },
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
      </div>
    </main>
  );
}