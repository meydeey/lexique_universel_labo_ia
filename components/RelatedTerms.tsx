import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";

export function RelatedTerms({ terms }: { terms: Terme[] }) {
  if (terms.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
        Termes liés
      </h2>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/terme/${t.slug}`}
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {t.label}
            </span>
            <NiveauBadge niveau={t.niveau} size="xs" />
          </Link>
        ))}
      </div>
    </div>
  );
}
