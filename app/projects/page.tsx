import type { Metadata } from "next";
import { ArrowUpRight, Code2, Compass, GitFork } from "lucide-react";
import { projects, type ProjectKind } from "@/data/projects";

export const metadata: Metadata = {
  title: "项目导航",
  description: "个人项目与课程实践的公开索引。",
};

const projectKinds: ProjectKind[] = ["个人项目", "课程实践"];

export default function ProjectsPage() {
  return (
    <main className="page-shell shell projects-page">
      <header className="page-header project-page-header">
        <div><div className="eyebrow">PROJECTS / BUILDING IN PUBLIC</div><h1>项目导航</h1></div>
        <div className="project-intro-mark"><Compass size={22} /><span>这里收录已经公开的个人项目与课程实践；复现或改进项目会在完成说明后单独标注来源与改动。</span></div>
      </header>
      {projectKinds.map((kind) => {
        const items = projects.filter((project) => project.kind === kind);
        if (items.length === 0) return null;

        return (
          <section className="project-group" key={kind} aria-labelledby={`project-kind-${kind}`}>
            <div className="project-group-heading"><span>{kind === "个人项目" ? "01" : "02"}</span><h2 id={`project-kind-${kind}`}>{kind}</h2></div>
            <div className="project-board">
              {items.map((project) => (
                <article className={`project-tile ${project.accent}`} key={project.title}>
                  <div className="project-tile-top"><span>{project.kind}</span><span>{project.year}</span></div>
                  <div className="project-symbol"><Code2 size={25} /></div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-tile-bottom"><span className={`project-status ${project.status.toLowerCase()}`}>{project.status}</span><a href={project.href} target="_blank" rel="noreferrer" aria-label={`打开 ${project.title} 的 GitHub 仓库`}><GitFork size={17} /> GitHub <ArrowUpRight size={15} /></a></div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}