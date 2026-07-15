import type { Metadata } from "next";
import { BlogBrowser } from "@/components/blog-browser";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "文章",
  description: "关于技术、研究、工具和日常灵感的个人文章。",
};

export default function BlogPage() {
  const posts = getAllContent("blog");

  return (
    <main className="page-shell shell blog-page">
      <header className="page-header blog-page-header">
        <div>
          <div className="eyebrow">BLOG / LETTERS FROM MY DESK</div>
          <h1>文章与随笔</h1>
        </div>
        <p>写代码、读论文，也记录偶尔跑偏的灵感。技术文章会尽量严谨，生活随笔允许轻一点。</p>
      </header>
      <BlogBrowser posts={posts} />
    </main>
  );
}
