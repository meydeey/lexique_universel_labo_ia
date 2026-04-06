"use client";

import { useEffect, useState } from "react";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function highlight() {
      const { codeToHtml } = await import("shiki");
      const result = await codeToHtml(code, {
        lang: language || "text",
        theme: "github-dark-default",
      });
      setHtml(result);
    }
    highlight();
  }, [code, language]);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-[var(--bg-code)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      {html ? (
        <div
          className="p-4 overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-sm font-mono text-[var(--text-secondary)]">
          {code}
        </pre>
      )}
    </div>
  );
}
