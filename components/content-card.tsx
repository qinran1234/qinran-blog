import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ContentMeta } from "@/lib/content";
import { contentHref, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export function ContentCard({ entry, compact = false }: { entry: ContentMeta; compact?: boolean }) {
  return (
    <article className={`content-card ${compact ? "compact" : ""}`}>
      <Link href={contentHref(entry.collection, entry.slug)} className="card-visual" tabIndex={-1} aria-hidden="true">
        <Image src={entry.cover} alt="" width={1200} height={640} sizes="(max-width: 768px) 100vw, 33vw" />
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <StatusBadge status={entry.status} />
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        </div>
        <h3><Link href={contentHref(entry.collection, entry.slug)}>{entry.title}</Link></h3>
        <p>{entry.description}</p>
        <div className="tag-row" aria-label="标签">
          {entry.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <Link href={contentHref(entry.collection, entry.slug)} className="text-link">
          阅读记录 <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
