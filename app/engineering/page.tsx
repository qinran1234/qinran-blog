import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getAllContent } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "工程补充",
  description: "经过脱敏的工程实践演示，作为研究训练主线的补充。",
};

export default function EngineeringPage() {
  const entries = getAllContent("engineering");
  return (
    <main className="page-shell shell">
      <header className="page-header split-page-header">
        <div><div className="eyebrow">ENGINEERING / SUPPLEMENT</div><h1>工程补充</h1></div>
        <p>这里只保留能支持研究可靠性与公开维护的工程方法，不展示内部工作记录、敏感配置或完整项目资料。</p>
      </header>
      <div className="boundary-note"><ShieldCheck size={20} /><p><strong>公开边界已启用</strong><br />以下条目均为结构演示，不对应真实内部系统或工作经历。</p></div>
      <div className="engineering-list">
        {entries.map((entry, index) => (
          <article className="engineering-item" key={entry.slug}>
            <div className="engineering-number">0{index + 1}</div>
            <div className="engineering-visual"><Image src={entry.cover} alt={`${entry.title} 的原创演示图`} width={1200} height={640} /></div>
            <div className="engineering-copy">
              <div className="card-meta"><StatusBadge status={entry.status} /><time dateTime={entry.date}>{formatDate(entry.date)}</time></div>
              <h2>{entry.title}</h2><p>{entry.description}</p>
              <div className="tag-row">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
