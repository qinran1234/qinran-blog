import type { Metadata } from "next";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { friends } from "@/data/friends";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "友链",
  description: "一些值得慢慢阅读的个人网站与数字花园。",
};

export default function FriendsPage() {
  return (
    <main className="page-shell shell friends-page">
      <header className="friends-hero">
        <div><div className="eyebrow">FRIENDS / LITTLE WINDOWS</div><h1>去朋友家串门</h1><p>互联网不只有信息流，也可以是一条条认真维护的小路。这里收藏一些愿意反复拜访的个人空间。</p></div>
        <div className="friends-doodle" aria-hidden="true"><i /><i /><i /><Sparkles size={28} /></div>
      </header>
      <div className="friend-grid">
        {friends.map((friend) => (
          <a className="friend-item" href={friend.url} target="_blank" rel="noreferrer" key={friend.name}>
            <span className={`friend-avatar ${friend.tone}`}>{friend.initials}{friend.avatar && <span className="friend-avatar-image" style={{ backgroundImage: `url("${friend.avatar}")` }} />}</span>
            <span className="friend-copy"><strong>{friend.name}</strong><small>{friend.description}</small></span>
            <ArrowUpRight size={18} />
          </a>
        ))}
      </div>
      <section className="friend-apply">
        <div><span>FRIEND LINK</span><h2>也想交换一扇小窗？</h2><p>来信附上站点名称、地址、头像和一句介绍。</p></div>
        <a className="button primary" href={siteConfig.social.qqMail}><Mail size={18} /> 写封邮件</a>
      </section>
    </main>
  );
}
