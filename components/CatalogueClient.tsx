"use client";

import { useState, useMemo } from "react";
import type { Terme, Niveau, Domaine } from "@/lib/types";
import { NIVEAUX, DOMAINES } from "@/lib/types";
import { TermCard } from "./TermCard";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function CatalogueClient({ terms }: { terms: Terme[] }) {
  const [search, setSearch] = useState("");
  const [selectedNiveaux, setSelectedNiveaux] = useState<Set<Niveau>>(
    new Set(),
  );
  const [selectedDomaines, setSelectedDomaines] = useState<Set<Domaine>>(
    new Set(),
  );

  const filtered = useMemo(() => {
    const query = normalize(search);
    return terms
      .filter((t) => {
        if (query) {
          const matchLabel = normalize(t.label).includes(query);
          const matchDef = normalize(t.definition).includes(query);
          if (!matchLabel && !matchDef) return false;
        }
        if (selectedNiveaux.size > 0 && !selectedNiveaux.has(t.niveau))
          return false;
        if (selectedDomaines.size > 0 && !selectedDomaines.has(t.domaine))
          return false;
        return true;
      })
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [terms, search, selectedNiveaux, selectedDomaines]);

  const niveauCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of NIVEAUX) {
      counts[n] = terms.filter((t) => t.niveau === n).length;
    }
    return counts;
  }, [terms]);

  const domaineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of DOMAINES) {
      counts[d] = terms.filter((t) => t.domaine === d).length;
    }
    return counts;
  }, [terms]);

  function toggleNiveau(n: Niveau) {
    setSelectedNiveaux((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function toggleDomaine(d: Domaine) {
    setSelectedDomaines((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function resetFilters() {
    setSearch("");
    setSelectedNiveaux(new Set());
    setSelectedDomaines(new Set());
  }

  const hasActiveFilters =
    search || selectedNiveaux.size > 0 || selectedDomaines.size > 0;

  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un terme..."
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Filtres niveaux */}
      <div className="mb-3 flex flex-wrap gap-2">
        {NIVEAUX.map((n) => (
          <button
            key={n}
            onClick={() => toggleNiveau(n)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold font-mono transition-colors ${
              selectedNiveaux.has(n)
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {n} ({niveauCounts[n]})
          </button>
        ))}
      </div>

      {/* Filtres domaines */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0">
        {DOMAINES.map((d) => (
          <button
            key={d}
            onClick={() => toggleDomaine(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedDomaines.has(d)
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {d} ({domaineCounts[d]})
          </button>
        ))}
      </div>

      {/* Compteur + reset */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">
          {filtered.length} terme{filtered.length !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Grille ou état vide */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)] mb-4">
            Aucun terme trouvé
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
