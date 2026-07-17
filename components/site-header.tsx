"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { href: "/blog", label: "日常与文章" },
  { href: "/algorithms", label: "算法题解" },
  { href: "/research-trail", label: "学习与科研" },
  { href: "/projects", label: "项目" },
  { href: "/friends", label: "友链" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header playful-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="半页宇宙首页">
          <span className="brand-cat" aria-hidden="true"><i /><i /><b>·ᴗ·</b></span>
          <span className="brand-copy"><strong>半页宇宙</strong><small>HALF-PAGE</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : undefined}>{item.label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button type="button" className="icon-button menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "关闭导航菜单" : "打开导航菜单"}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${open ? "open" : ""}`} aria-label="移动端主导航">
        <div className="shell">
          {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}
