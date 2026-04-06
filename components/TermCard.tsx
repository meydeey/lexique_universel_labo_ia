import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";

const NIVEAU_BORDER: Record<string, string> = {
  débutant: "border-l-[var(--niveau-debutant-text)]",
  intermédiaire: "border-l-[var(--niveau-intermediaire-text)]",
  avancé: "border-l-[var(--niveau-avance-text)]",
};

export function TermCard({ term, index = 0 }: { term: Terme; index?: number }) {
  return (
    <Link
      href={`/terme/${term.slug}`}
      className={`group block p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] border-l-2 ${NIVEAU_BORDER[term.niveau]} hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)] transition-all duration-200 animate-fade-in`}
      style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
          {term.label}
        </h3>
        <NiveauBadge niveau={term.niveau} size="xs" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <DomaineBadge domaine={term.domaine} />
        {term.exemple_code && (
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
            {"</>"}
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
        {term.definition}
      </p>
    </Link>
  );
}
