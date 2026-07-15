export const researchLoop = [
  { index: "01", title: "理解", description: "用直觉、小例子和必要公式解释一个明确问题。" },
  { index: "02", title: "实现", description: "写一段能运行的代码，或完成一个单变量小实验。" },
  { index: "03", title: "诊断", description: "区分运行事实与个人推断，记录失败原因和未确认点。" },
  { index: "04", title: "整理", description: "形成概念笔记、实验记录或下一步明确的问题。" },
] as const;

export const weeklyRhythm = [
  "数学或 Machine Learning 概念回顾",
  "代码实现与小型实验",
  "复盘、整理 Concept Note、处理卡点",
  "轻量 Computer Vision 教程或任务地图",
] as const;

export const researchReadiness = [
  { label: "研究笔记结构", state: "Ready", detail: "学习、概念、文献、项目和模板已有清晰边界。" },
  { label: "引用与文献链路", state: "In progress", detail: "基础工具已连接，仍需用真实阅读流程持续验证。" },
  { label: "实验记录模板", state: "Ready", detail: "包含假设、控制变量、配置、结果、解释与下一步。" },
  { label: "完整论文工作流", state: "Next", detail: "等基础阶段稳定后，再推进精读、综合与学习型复现。" },
] as const;
