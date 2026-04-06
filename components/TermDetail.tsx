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
      <nav className="mb-8 flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          Lexique
        </Link>
        <span className="opacity-30">/</span>
        <span>{term.domaine}</span>
        <span className="opacity-30">/</span>
        <span className="text-[var(--text-secondary)]">{term.label}</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <NiveauBadge niveau={term.niveau} />
          <DomaineBadge domaine={term.domaine} />
          {term.lien_externe && (
            <a
              href={term.lien_externe}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors ml-auto"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Site officiel
            </a>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
          {term.label}
        </h1>
      </div>

      {/* Définition */}
      <div className="mb-8 p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <p className="text-[var(--text-primary)] leading-relaxed text-base sm:text-lg">
          {term.definition}
        </p>
      </div>

      {/* Bloc de code */}
      {term.exemple_code && (
        <div className="mb-8">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
            Exemple
          </h2>
          <CodeBlock code={term.exemple_code} language={term.langue_code} />
        </div>
      )}

      {/* Termes liés */}
      <RelatedTerms terms={relatedTerms} />

      {/* Retour */}
      <div className="mt-12 pt-6 border-t border-[var(--border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour au lexique
        </Link>
      </div>
    </article>
  );
}
