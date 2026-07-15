import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "公开笔记",
  description: "经过整理的阅读笔记与概念笔记，不包含私人日志。",
};

export default function NotesPage() {
  const notes = getAllContent("notes");
  const years = Array.from(new Set(notes.map((note) => note.date.slice(0, 4))));

  return (
    <main className="page-shell shell">
      <header className="page-header split-page-header">
        <div><div className="eyebrow">PUBLIC NOTES / ARCHIVE</div><h1>公开笔记</h1></div>
        <p>用于建立概念之间的连接，并保存可复用的阅读框架。这里不是私人日记，也不是完整知识库镜像。</p>
      </header>
      {years.map((year) => (
        <section className="archive-year" key={year} aria-labelledby={`year-${year}`}>
          <div className="year-marker"><span id={`year-${year}`}>{year}</span><i /></div>
          <div className="cards-grid notes-grid">
            {notes.filter((note) => note.date.startsWith(year)).map((note) => <ContentCard key={note.slug} entry={note} />)}
          </div>
        </section>
      ))}
    </main>
  );
}
