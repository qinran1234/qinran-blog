export type ProjectKind = "个人项目" | "课程实践";

export type ProjectItem = {
  title: string;
  description: string;
  year: string;
  tags: string[];
  status: "Active" | "Exploring" | "Archived";
  kind: ProjectKind;
  href: string;
  accent: "mint" | "coral" | "blue" | "yellow";
};

export const projects: ProjectItem[] = [
  {
    title: "半页宇宙 · Qinran Blog",
    description: "以文章为主入口，收纳学习记录、项目索引与公开研究档案的个人网站。",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Markdown"],
    status: "Active",
    kind: "个人项目",
    href: "https://github.com/qinran1234/qinran-blog",
    accent: "mint",
  },
  {
    title: "Agent Simple",
    description: "一个用于实践智能对话工作流的全栈项目，前端采用 Vue，后端基于 FastAPI、LangChain 与 DeepSeek API。",
    year: "2025",
    tags: ["Vue", "FastAPI", "LangChain"],
    status: "Archived",
    kind: "个人项目",
    href: "https://github.com/qinran1234/Agent_simple",
    accent: "coral",
  },
  {
    title: "Game Development",
    description: "游戏开发课程的学习资料、课堂笔记与练习整理，保留阶段性的学习轨迹。",
    year: "2024",
    tags: ["Game Development", "Coursework", "HTML"],
    status: "Archived",
    kind: "课程实践",
    href: "https://github.com/qinran1234/GameDevelopment",
    accent: "blue",
  },
];