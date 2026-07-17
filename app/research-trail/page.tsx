import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, CheckCircle2, CircleDotDashed, ListChecks, RefreshCw } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { researchLoop, researchReadiness, weeklyRhythm } from "@/data/research-practice";
import { researchTrail } from "@/data/research-trail";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "研究路线",
  description: "从 Python 与数学基础到论文阅读和最小复现的公开训练路径。",
};

export default function ResearchTrailPage() {
  const currentStage = researchTrail.find((stage) => stage.status === "Current") ?? researchTrail[0];
  const completedCount = researchTrail.filter((stage) => stage.status === "Completed").length;
  const nextCount = researchTrail.filter((stage) => stage.status === "Next").length;
  const progress = Math.round((completedCount / researchTrail.length) * 100);

  return (
    <main className="page-shell shell">
      <header className="page-header">
        <div className="eyebrow">RESEARCH TRAIL / ROADMAP</div>
        <h1>研究路线</h1>
        <p>路线不是课程清单，而是一组逐步收紧的证据标准：理解概念、实现最小系统、检查结果，再公开记录。</p>
      </header>
      <div className="trail-layout">
        <aside className="trail-aside">
          <span className="aside-index">{currentStage.index}</span>
          <p>CURRENT STAGE</p>
          <strong>{currentStage.title}</strong>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <small>{completedCount} completed · 1 current · {nextCount} next</small>
          <time className="trail-aside-date" dateTime={currentStage.updatedAt}>更新于 {formatDate(currentStage.updatedAt)}</time>
        </aside>
        <ol className="trail-list">
          {researchTrail.map((stage) => (
            <li key={stage.id} className={`trail-stage ${stage.status.toLowerCase()}`}>
              <div className="trail-marker"><span>{stage.index}</span></div>
              <div className="trail-card">
                <div className="trail-card-heading">
                  <div>
                    <h2>{stage.title}</h2>
                    <time className="trail-stage-date" dateTime={stage.updatedAt}><CalendarDays size={13} /> 更新于 {formatDate(stage.updatedAt)}</time>
                  </div>
                  <StatusBadge status={stage.status} />
                </div>
                <p>{stage.summary}</p>
                <div className="trail-outcome">
                  <span>PUBLIC OUTPUT</span>
                  {stage.href ? <Link href={stage.href}>{stage.outcome} <ArrowUpRight size={15} /></Link> : <p>{stage.outcome}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <section className="research-method-section" aria-labelledby="research-method-title">
        <div className="section-heading split-heading">
          <div><div className="eyebrow">HOW I WORK / VERIFIABLE OUTPUT</div><h2 id="research-method-title">每次学习都留下证据</h2></div>
          <p>不以观看时长或收藏数量判断进度。一次学习至少留下代码、图、实验记录、自己的解释或一个明确问题。</p>
        </div>
        <ol className="research-loop-grid">
          {researchLoop.map((item) => <li key={item.index}><span>{item.index}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}
        </ol>
      </section>

      <section className="research-system-grid" aria-label="研究执行节奏与准备度">
        <div className="rhythm-panel">
          <div className="panel-kicker"><RefreshCw size={18} /> WEEKLY RHYTHM</div>
          <h2>可持续的每周节奏</h2>
          <ol>{weeklyRhythm.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol>
        </div>
        <div className="readiness-panel">
          <div className="panel-kicker"><ListChecks size={18} /> RESEARCH READINESS</div>
          <h2>当前准备度</h2>
          <div className="readiness-list">
            {researchReadiness.map((item) => (
              <div key={item.label}>
                {item.state === "Ready" ? <CheckCircle2 size={18} /> : <CircleDotDashed size={18} />}
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                <em className={item.state.toLowerCase().replace(" ", "-")}>{item.state}</em>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}