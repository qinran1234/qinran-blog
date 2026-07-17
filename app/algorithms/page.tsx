import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "算法题解",
  description: "基于 LeetCode 题目的思路复盘、题解与复杂度分析。",
};

export default function AlgorithmsPage() {
  const entries = getAllContent("algorithms");
  return (
    <main className="page-shell shell">
      <header className="page-header split-page-header">
        <div><div className="eyebrow">ALGORITHMS / LEETCODE REVIEW</div><h1>算法题解</h1></div>
        <p>记录题目链接、关键思路、复杂度、易错点与可替代方案。重点不是堆题数，而是留下下一次能快速复用的思考过程。</p>
      </header>
      <div className="cards-grid notes-grid">
        {entries.map((entry) => <ContentCard key={entry.slug} entry={entry} />)}
      </div>
    </main>
  );
}