export type FriendLink = {
  name: string;
  description: string;
  url: string;
  initials: string;
  tone: "mint" | "coral" | "blue" | "yellow";
};

export const friends: FriendLink[] = [
  { name: "Quiet Forest", description: "前端、生活与安静的长期写作。", url: "https://example.com", initials: "QF", tone: "mint" },
  { name: "Pixel Diary", description: "像素、游戏与独立开发记录。", url: "https://example.com", initials: "PD", tone: "coral" },
  { name: "Paper Boat", description: "论文阅读和机器学习随笔。", url: "https://example.com", initials: "PB", tone: "blue" },
  { name: "Sunday Lab", description: "做一点实验，也收集一点灵感。", url: "https://example.com", initials: "SL", tone: "yellow" },
  { name: "Mori Notes", description: "数字花园与公开学习笔记。", url: "https://example.com", initials: "MN", tone: "mint" },
  { name: "Cloud Window", description: "摄影、设计与缓慢更新的博客。", url: "https://example.com", initials: "CW", tone: "blue" },
];
