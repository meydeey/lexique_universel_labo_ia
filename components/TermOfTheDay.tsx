import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";

export function TermOfTheDay({ term }: { term: Terme }) {
  return (
    <Link
      href={`/terme/${term.slug}`}
      className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--accent-dim)] border border-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all"
    >
      <span className="shrink-0 text-[10px] font-mono text-[var(--accent)] uppercase tracking-widest">
        Terme du jour
      </span>
      <span className="w-px h-4 bg-[var(--accent)]/20" />
      <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
        {term.label}
      </span>
      <NiveauBadge niveau={term.niveau} size="xs" />
      <span className="ml-auto text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        →
      </span>
    </Link>
  );
}
