"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("half-page-theme", nextTheme);
  }

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label="切换浅色或深色主题"
      title="切换主题"
    >
      <Moon className="theme-icon-moon" size={18} />
      <Sun className="theme-icon-sun" size={18} />
    </button>
  );
}
