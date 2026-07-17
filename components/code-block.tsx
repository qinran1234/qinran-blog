"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const languageLabels: Record<string, string> = {
  bash: "BASH",
  sh: "SHELL",
  shell: "SHELL",
  powershell: "POWERSHELL",
  ps1: "POWERSHELL",
  python: "PYTHON",
  py: "PYTHON",
  cpp: "C++",
  "c++": "C++",
  c: "C",
  javascript: "JAVASCRIPT",
  js: "JAVASCRIPT",
  typescript: "TYPESCRIPT",
  ts: "TYPESCRIPT",
  tsx: "TSX",
  jsx: "JSX",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  caddyfile: "CADDYFILE",
  text: "TEXT",
  plaintext: "TEXT",
};

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const normalizedLanguage = language.toLowerCase() || "text";
  const label = languageLabels[normalizedLanguage] ?? normalizedLanguage.toUpperCase();

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-block">
      <div className="code-block-toolbar">
        <span>{label}</span>
        <button type="button" onClick={copyCode} aria-label={copied ? "已复制代码" : "复制代码"} title={copied ? "已复制" : "复制代码"}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <pre><code className={`language-${normalizedLanguage}`}>{code}</code></pre>
    </div>
  );
}