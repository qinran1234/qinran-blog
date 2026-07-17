import { AtSign, Code2, Video } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer playful-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-title">qinran <span>·</span> 半页宇宙</p>
          <p className="footer-copy">写给未来的自己，也写给偶然路过这里的人。</p>
        </div>
        <div className="footer-links" aria-label="页脚链接">
          <a href={siteConfig.social.github} target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub</a>
          <a href={siteConfig.social.qqMail}><AtSign size={17} /> QQ邮箱</a>
          <a href={siteConfig.social.bilibili} target="_blank" rel="noreferrer"><Video size={17} /> B站</a>
          <Link href="/about">关于</Link>
        </div>
        <p className="footer-meta">© {new Date().getFullYear()} QINRAN · BUILT WITH CURIOSITY AND TOO MUCH TEA</p>
      </div>
    </footer>
  );
}
