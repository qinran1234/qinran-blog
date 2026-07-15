import type { Metadata } from "next";
import { BookOpenCheck, LockKeyhole, RefreshCw, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "关于",
  description: "半页宇宙的内容方向、公开边界与维护原则。",
};

const principles = [
  { icon: BookOpenCheck, title: "文章先讲清楚", copy: "技术内容区分事实、引用与猜想；生活随笔可以轻，但不故作深刻。" },
  { icon: LockKeyhole, title: "公开不等于搬家", copy: "这里只放经过筛选的内容，不镜像私人 Vault、内部工作记录或敏感配置。" },
  { icon: RefreshCw, title: "允许持续修订", copy: "理解会变化，旧文章可以更新；更正不是瑕疵，也是学习轨迹的一部分。" },
];

export default function AboutPage() {
  return (
    <main className="page-shell shell about-page">
      <header className="about-hero playful-about-hero">
        <div className="eyebrow">ABOUT / HALF-PAGE UNIVERSE</div>
        <h1>你好，我是 qinran。<br />这里是我的半页宇宙。</h1>
        <p>这是一间以文章为主的个人 Blog。这里写技术、研究、工具和日常，也保留一条从基础学习走向可复现实验的长期支线。</p>
        <div className="about-spark"><Sparkles size={22} /><span>本站身份、邮箱与项目链接目前仍使用可替换占位信息。</span></div>
      </header>

      <section className="about-statement">
        <span>01 / WRITING</span>
        <div><h2>这里会写什么</h2><p>文章模块是主入口：既有概念整理、实验手记与工具实践，也会有桌面整理、阅读片段和不太严肃的生活观察。学习与科研页面负责更结构化地保存路线、实验和公开成果。</p></div>
      </section>
      <section className="about-statement boundary-section">
        <span>02 / BOUNDARY</span>
        <div><h2>这里不会公开什么</h2><p>不会公开私人日记、内部工作记录、完整知识库、账号令牌、真实敏感配置或未经授权的第三方内容。演示数据会持续明确标注，不把占位内容包装成个人成就。</p></div>
      </section>
      <section className="principles-section">
        <div className="section-heading"><div className="eyebrow">03 / MAINTENANCE</div><h2>维护原则</h2></div>
        <div className="principles-grid">
          {principles.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={22} /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
    </main>
  );
}
