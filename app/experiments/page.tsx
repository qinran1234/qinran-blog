import type { Metadata } from "next";
import { ExperimentFilter } from "@/components/experiment-filter";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "实验记录",
  description: "公开的最小实验、对照设计与复现信息。",
};

export default function ExperimentsPage() {
  const experiments = getAllContent("experiments");
  return (
    <main className="page-shell shell">
      <header className="page-header split-page-header">
        <div><div className="eyebrow">EXPERIMENT LOG / PUBLIC</div><h1>实验记录</h1></div>
        <p>先记录问题和协议，再记录结果。当前条目均为匿名 Demo，用于验证公开流程与页面能力。</p>
      </header>
      <ExperimentFilter experiments={experiments} />
    </main>
  );
}
