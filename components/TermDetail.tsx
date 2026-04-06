import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";
import { CodeBlock } from "./CodeBlock";
import { RelatedTerms } from "./RelatedTerms";
import { getAllTerms } from "@/lib/terms";

export function TermDetail({ term }: { term: Terme }) {
  const allTerms = getAllTerms();
  const relatedTerms = term.termes_lies
    .map((slug) => allTerms.find((t) => t.slug === slug))
    .filter((t): t is Terme => t !== undefined);

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--text-secondary)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          Lexique
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--text-secondary)]">{term.domaine}</span>
        <span className="mx-2">›</span>
        <span className="text-[var(--text-primary)]">{term.label}</span>
      </nav>

      {/* En-tête */}
      <div className="flex items-start flex-wrap gap-3 mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {term.label}
        </h1>
        <div className="flex items-center gap-2">
          <NiveauBadge niveau={term.niveau} />
          <DomaineBadge domaine={term.domaine} />
        </div>
        {term.lien_externe && (
          <a
            href={term.lien_externe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Site officiel ↗
          </a>
        )}
      </div>

      {/* Définition */}
      <div className="mb-8 text-[var(--text-primary)] leading-relaxed text-lg">
        {term.definition}
      </div>

      {/* Bloc de code */}
      {term.exemple_code && (
        <div className="mb-8">
          <CodeBlock code={term.exemple_code} language={term.langue_code} />
        </div>
      )}

      {/* Termes liés */}
      <RelatedTerms terms={relatedTerms} />

      {/* Retour */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          ← Retour au lexique
        </Link>
      </div>
    </article>
  );
}
