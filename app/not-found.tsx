import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <span>404 / NO RECORD</span><h1>这条记录不存在</h1>
      <p>内容可能仍是草稿，或链接已经更新。</p>
      <Link href="/" className="button primary">返回首页</Link>
    </main>
  );
}
