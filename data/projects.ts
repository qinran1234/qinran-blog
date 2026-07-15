export type ProjectItem = {
  title: string;
  description: string;
  year: string;
  tags: string[];
  status: "Active" | "Exploring" | "Archived";
  href: string;
  accent: "mint" | "coral" | "blue" | "yellow";
};

export const projects: ProjectItem[] = [
  {
    title: "半页宇宙 · Qinran Blog",
    description: "以文章为主入口，收纳随笔、学习记录、项目与公开研究档案。",
    year: "2026",
    tags: ["Next.js", "Markdown"],
    status: "Active",
    href: "https://github.com/your-handle/qinran-blog",
    accent: "mint",
  },
  {
    title: "Experiment Starter",
    description: "用于小规模视觉实验的配置、日志与复现信息模板。",
    year: "2026",
    tags: ["PyTorch", "Tooling"],
    status: "Exploring",
    href: "https://github.com/your-handle/experiment-starter",
    accent: "coral",
  },
  {
    title: "Reading Map",
    description: "把论文、概念和最小实现连接成可浏览的阅读地图。",
    year: "2026",
    tags: ["Knowledge", "Graph"],
    status: "Exploring",
    href: "https://github.com/your-handle/reading-map",
    accent: "blue",
  },
  {
    title: "Tiny Vision Lab",
    description: "收集小型图像任务与单变量消融的匿名演示代码。",
    year: "2025",
    tags: ["CV", "Reproducibility"],
    status: "Archived",
    href: "https://github.com/your-handle/tiny-vision-lab",
    accent: "yellow",
  },
];
