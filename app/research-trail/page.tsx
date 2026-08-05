import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, CheckCircle2, CircleDotDashed, GitBranch, ListChecks, RefreshCw } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { researchLoop, researchReadiness, weeklyRhythm } from "@/data/research-practice";
import { researchTrail } from "@/data/research-trail";
import { researchVault } from "@/data/research-vault";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "研究路线",
  description: "从 Python 与数学基础到论文阅读和最小复现的公开训练路径。",
};

export default function ResearchTrailPage() {
  const vaultStageById = new Map<string, (typeof researchVault.stages)[number]>(researchVault.stages.map((stage) => [stage.id, stage]));
  const stageAliases = new Map<string, string>([["machine-learning", "ml-workflow-evaluation"]]);
  const displayTrail = researchTrail.map((stage) => {
    const vaultStage = vaultStageById.get(stageAliases.get(stage.id) ?? stage.id);
    return vaultStage ? { ...stage, status: vaultStage.status, updatedAt: vaultStage.updatedAt, summary: vaultStage.summary, outcome: vaultStage.outcome } : stage;
  });
  const currentStage = displayTrail.find((stage) => stage.status === "Current") ?? displayTrail[0];
  const completedCount = displayTrail.filter((stage) => stage.status === "Completed").length;
  const nextCount = displayTrail.filter((stage) => stage.status === "Next").length;
  const progress = Math.round((completedCount / displayTrail.length) * 100);
  const currentVaultId = stageAliases.get(currentStage.id) ?? currentStage.id;
  const currentEvents = researchVault.events.filter((event) => event.stageId === currentVaultId).slice(-4).reverse();
  const eventsForStage = (stageId: string) => researchVault.events.filter((event) => event.stageId === (stageAliases.get(stageId) ?? stageId)).slice().reverse();
  const treeById = new Map<string, (typeof researchVault.tree)[number]>(researchVault.tree.map((node) => [node.id, node]));
  const treePath: string[] = [];
  const stageTreeAliases = new Map<string, string>([["foundations", "numpy-ml-foundations"], ["machine-learning", "ai-cv-foundations"]]);
  let treeNode = treeById.get(stageTreeAliases.get(currentStage.id) ?? currentVaultId);
  while (treeNode) {
    treePath.unshift(treeNode.label);
    const parentId = "parent" in treeNode ? treeNode.parent : undefined;
    treeNode = parentId ? treeById.get(parentId) : undefined;
  }
  const treeRoots = researchVault.tree.filter((node) => !("parent" in node && node.parent));
  const renderTreeNode = (node: (typeof researchVault.tree)[number]) => {
    const children = researchVault.tree.filter((candidate) => "parent" in candidate && candidate.parent === node.id);
    return (
      <li key={node.id} className={`vault-tree-node ${node.type}`}>
        {children.length > 0 ? (
          <details open={node.type === "root" || node.status === "active"}>
            <summary><span>{node.label}</span><em>{node.type}</em></summary>
            <ul>{children.map(renderTreeNode)}</ul>
          </details>
        ) : <div className="vault-tree-leaf"><span>{node.label}</span><em>{node.type}</em></div>}
      </li>
    );
  };

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
          {displayTrail.map((stage) => (
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
                <details className="trail-stage-details" open={stage.status === "Current"}>
                  <summary><span>阶段内实验与证据</span><em>{eventsForStage(stage.id).length} items</em></summary>
                  <ol>
                    {eventsForStage(stage.id).map((event) => <li key={event.id}><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time><div><strong>{event.title}</strong><p>{event.summary}</p></div></li>)}
                    {eventsForStage(stage.id).length === 0 && <li className="stage-detail-empty">还没有同步到公开实验事件。</li>}
                  </ol>
                </details>
                <div className="trail-outcome">
                  <span>PUBLIC OUTPUT</span>
                  {stage.href ? <Link href={stage.href}>{stage.outcome} <ArrowUpRight size={15} /></Link> : <p>{stage.outcome}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <section className="trail-evidence-section" aria-labelledby="trail-evidence-title">
        <div className="section-heading split-heading">
          <div><div className="eyebrow">VAULT EVIDENCE / PUBLIC MIRROR</div><h2 id="trail-evidence-title">路线后面发生了什么</h2></div>
          <p>路线描述负责说明方向，Vault 的公开事件负责说明最近留下了哪些可验证痕迹。页面只展示公开副本，不读取私人笔记。</p>
        </div>
        <div className="trail-evidence-grid">
          <div className="evidence-panel">
            <div className="panel-kicker"><CalendarDays size={18} /> RECENT EVIDENCE</div>
            <ol className="evidence-list">
              {currentEvents.map((event) => <li key={event.id}><time dateTime={event.occurredAt}>{formatDate(event.occurredAt)}</time><div><strong>{event.title}</strong><p>{event.summary}</p></div></li>)}
              {currentEvents.length === 0 && <li className="evidence-empty">当前阶段还没有同步到公开事件。</li>}
            </ol>
          </div>
          <div className="evidence-panel tree-panel">
            <div className="panel-kicker"><GitBranch size={18} /> LEARNING TREE</div>
            <h3>{currentStage.title}</h3>
            <p>当前阶段在 ResearchVault 树中的公开节点</p>
            <div className="tree-path">{treePath.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
            <small>同步于 {formatDate(researchVault.sourceUpdatedAt)}</small>
          </div>
        </div>
      </section>

      <section className="vault-tree-section" aria-labelledby="vault-tree-title">
        <div className="section-heading split-heading">
          <div><div className="eyebrow">RESEARCHVAULT / ALL BRANCHES</div><h2 id="vault-tree-title">完整学习树</h2></div>
          <p>主研究路线只是其中一条主干。这里保留 Vault 中的根节点、并行学习轨道、主题和实验层级。</p>
        </div>
        <ul className="vault-tree">{treeRoots.map(renderTreeNode)}</ul>
      </section>

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
