import { Coffee, Music2, PenLine, Sparkles } from "lucide-react";
import Image from "next/image";

export function BlogMascot() {
  return (
    <div className="hero-studio" aria-label="由文章、便签和音乐播放器组成的个人创作桌面">
      <div className="studio-window">
        <div className="studio-toolbar">
          <span className="window-dots"><i /><i /><i /></span>
          <span>qinran.log / draft</span>
          <PenLine size={15} />
        </div>
        <div className="studio-canvas">
          <div className="studio-cover">
            <Image src="/covers/public-notes.svg" alt="公开笔记的原创封面" width={1200} height={640} priority />
            <span>01 / FIELD NOTES</span>
          </div>
          <div className="studio-copy">
            <span>TODAY&apos;S DRAFT</span>
            <strong>把一个问题<br />写到足够清楚</strong>
            <p>capture · connect · verify</p>
          </div>
        </div>
      </div>

      <div className="studio-note">
        <Sparkles size={17} />
        <span>灵感不是结论</span>
        <small>先记下来，再慢慢验证。</small>
      </div>

      <div className="studio-player">
        <span className="player-icon"><Music2 size={17} /></span>
        <span><small>NOW PLAYING</small><strong>late night study mix</strong></span>
        <i><b /></i>
      </div>

      <div className="studio-cup" aria-hidden="true"><Coffee size={26} /></div>
      <div className="cat-bookmark" aria-hidden="true"><i /><i /><span>·ᴗ·</span></div>
    </div>
  );
}
