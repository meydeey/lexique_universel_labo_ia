import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";

export function TermCard({ term }: { term: Terme }) {
  return (
    <Link
      href={`/terme/${term.slug}`}
      className="block p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {term.label}
        </h3>
        <NiveauBadge niveau={term.niveau} />
      </div>
      <DomaineBadge domaine={term.domaine} />
      <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
        {term.definition}
      </p>
    </Link>
  );
}
