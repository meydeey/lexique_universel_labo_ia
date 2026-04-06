import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";

export function TermOfTheDay({ term }: { term: Terme }) {
  return (
    <div className="mb-8 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent)]/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider">
          Terme du jour
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {term.label}
        </h2>
        <div className="flex gap-2 shrink-0">
          <NiveauBadge niveau={term.niveau} />
          <DomaineBadge domaine={term.domaine} />
        </div>
      </div>
      <p className="text-[var(--text-secondary)] line-clamp-2 mb-4">
        {term.definition}
      </p>
      <Link
        href={`/terme/${term.slug}`}
        className="inline-block text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
      >
        Voir la fiche →
      </Link>
    </div>
  );
}
