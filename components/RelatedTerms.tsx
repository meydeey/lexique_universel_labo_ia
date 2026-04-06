import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";

export function RelatedTerms({ terms }: { terms: Terme[] }) {
  if (terms.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
        Termes liés
      </h2>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/terme/${t.slug}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {t.label}
            </span>
            <NiveauBadge niveau={t.niveau} />
          </Link>
        ))}
      </div>
    </div>
  );
}
