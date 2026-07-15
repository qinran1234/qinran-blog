import type { Metadata } from "next";
import { ArrowUpRight, Code2, Compass, GitFork } from "lucide-react";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "项目导航",
  description: "个人项目、实验工具与正在探索的想法。",
};

export default function ProjectsPage() {
  return (
    <main className="page-shell shell projects-page">
      <header className="page-header project-page-header">
        <div><div className="eyebrow">PROJECTS / BUILDING IN PUBLIC</div><h1>项目导航</h1></div>
        <div className="project-intro-mark"><Compass size={22} /><span>这里的链接目前是 Demo 占位，上线前替换为你的真实仓库。</span></div>
      </header>
      <div className="project-board">
        {projects.map((project, index) => (
          <article className={`project-tile ${project.accent}`} key={project.title}>
            <div className="project-tile-top"><span>0{index + 1}</span><span>{project.year}</span></div>
            <div className="project-symbol"><Code2 size={25} /></div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="project-tile-bottom"><span className={`project-status ${project.status.toLowerCase()}`}>{project.status}</span><a href={project.href} target="_blank" rel="noreferrer" aria-label={`打开 ${project.title} 的 GitHub 仓库`}><GitFork size={17} /> GitHub <ArrowUpRight size={15} /></a></div>
          </article>
        ))}
      </div>
    </main>
  );
}
