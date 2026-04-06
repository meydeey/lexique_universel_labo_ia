"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { Terme, Niveau, Domaine } from "@/lib/types";
import { NIVEAUX, DOMAINES } from "@/lib/types";
import { TermCard } from "./TermCard";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const NIVEAU_COLORS: Record<Niveau, { active: string; dot: string }> = {
  débutant: {
    active:
      "bg-[var(--niveau-debutant-bg)] text-[var(--niveau-debutant-text)] border-[var(--niveau-debutant-text)]/30",
    dot: "bg-[var(--niveau-debutant-text)]",
  },
  intermédiaire: {
    active:
      "bg-[var(--niveau-intermediaire-bg)] text-[var(--niveau-intermediaire-text)] border-[var(--niveau-intermediaire-text)]/30",
    dot: "bg-[var(--niveau-intermediaire-text)]",
  },
  avancé: {
    active:
      "bg-[var(--niveau-avance-bg)] text-[var(--niveau-avance-text)] border-[var(--niveau-avance-text)]/30",
    dot: "bg-[var(--niveau-avance-text)]",
  },
};

const DOMAINE_ICONS: Record<Domaine, string> = {
  frontend: "{}",
  backend: ">>",
  "base de données": "db",
  workflow: "⚡",
  "agents IA": "🤖",
  "CLI / terminal": "$_",
  "Claude Code": "CC",
  sécurité: "🔒",
  "DevOps / déploiement": "▲",
};

export function CatalogueClient({ terms }: { terms: Terme[] }) {
  const [search, setSearch] = useState("");
  const [selectedNiveaux, setSelectedNiveaux] = useState<Set<Niveau>>(
    new Set(),
  );
  const [selectedDomaines, setSelectedDomaines] = useState<Set<Domaine>>(
    new Set(),
  );
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Grouper par première lettre
  const grouped = useMemo(() => {
    const groups: Record<string, Terme[]> = {};
    for (const term of filtered) {
      const firstChar = term.label[0].toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }
    return groups;
  }, [filtered]);

  const letters = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Toutes les lettres qui existent dans le dataset complet
  const allLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of terms) {
      const c = t.label[0].toUpperCase();
      set.add(/[A-Z]/.test(c) ? c : "#");
    }
    return Array.from(set).sort();
  }, [terms]);

  const niveauCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of NIVEAUX)
      counts[n] = terms.filter((t) => t.niveau === n).length;
    return counts;
  }, [terms]);

  const domaineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of DOMAINES)
      counts[d] = terms.filter((t) => t.domaine === d).length;
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

  const scrollToLetter = useCallback((letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const hasActiveFilters =
    search || selectedNiveaux.size > 0 || selectedDomaines.size > 0;
  const activeFilterCount =
    selectedNiveaux.size + selectedDomaines.size + (search ? 1 : 0);

  return (
    <div className="flex gap-6">
      {/* Sidebar filtres — desktop */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20 space-y-6">
          {/* Niveaux */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-2.5">
              Niveau
            </h3>
            <div className="space-y-1">
              {NIVEAUX.map((n) => (
                <button
                  key={n}
                  onClick={() => toggleNiveau(n)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedNiveaux.has(n)
                      ? `${NIVEAU_COLORS[n].active} border`
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${NIVEAU_COLORS[n].dot} ${selectedNiveaux.has(n) ? "opacity-100" : "opacity-40"}`}
                  />
                  <span className="capitalize">{n}</span>
                  <span className="ml-auto text-[10px] font-mono opacity-50">
                    {niveauCounts[n]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Domaines */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-2.5">
              Domaine
            </h3>
            <div className="space-y-0.5">
              {DOMAINES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDomaine(d)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    selectedDomaines.has(d)
                      ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <span className="w-4 text-center opacity-50 text-[10px]">
                    {DOMAINE_ICONS[d]}
                  </span>
                  <span className="truncate">{d}</span>
                  <span className="ml-auto text-[10px] font-mono opacity-40">
                    {domaineCounts[d]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors py-1.5"
            >
              Effacer les filtres ({activeFilterCount})
            </button>
          )}
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0" ref={contentRef}>
        {/* Barre de recherche */}
        <div className="search-glow mb-4 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] focus-within:border-[var(--accent)] transition-all">
          <svg
            className="w-4 h-4 text-[var(--text-tertiary)] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un terme, une définition..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filtres mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hasActiveFilters
                ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)]/20"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>

          {showFilters && (
            <div className="mt-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4">
              {/* Niveaux mobile */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-2">
                  Niveau
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {NIVEAUX.map((n) => (
                    <button
                      key={n}
                      onClick={() => toggleNiveau(n)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedNiveaux.has(n)
                          ? `${NIVEAU_COLORS[n].active} border`
                          : "text-[var(--text-secondary)] bg-[var(--bg-tertiary)] border border-transparent"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${NIVEAU_COLORS[n].dot}`}
                      />
                      {n} ({niveauCounts[n]})
                    </button>
                  ))}
                </div>
              </div>
              {/* Domaines mobile */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-2">
                  Domaine
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {DOMAINES.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDomaine(d)}
                      className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                        selectedDomaines.has(d)
                          ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                          : "text-[var(--text-secondary)] bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {d} ({domaineCounts[d]})
                    </button>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[var(--accent)]"
                >
                  Effacer tout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filtres actifs (tags) */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                &quot;{search}&quot;
                <button
                  onClick={() => setSearch("")}
                  className="hover:text-[var(--text-primary)] ml-0.5"
                >
                  &times;
                </button>
              </span>
            )}
            {Array.from(selectedNiveaux).map((n) => (
              <span
                key={n}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${NIVEAU_COLORS[n].active}`}
              >
                {n}
                <button
                  onClick={() => toggleNiveau(n)}
                  className="ml-0.5 opacity-60 hover:opacity-100"
                >
                  &times;
                </button>
              </span>
            ))}
            {Array.from(selectedDomaines).map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-[var(--accent-dim)] text-[var(--accent)]"
              >
                {d}
                <button
                  onClick={() => toggleDomaine(d)}
                  className="ml-0.5 opacity-60 hover:opacity-100"
                >
                  &times;
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)] ml-1 transition-colors"
            >
              tout effacer
            </button>
          </div>
        )}

        {/* Compteur + alphabet */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            {filtered.length} terme{filtered.length !== 1 ? "s" : ""}
            {hasActiveFilters ? ` sur ${terms.length}` : ""}
          </span>
        </div>

        {/* Barre alphabet */}
        {!search && (
          <div className="mb-6 flex flex-wrap gap-0.5">
            {allLetters.map((l) => {
              const exists = letters.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => exists && scrollToLetter(l)}
                  disabled={!exists}
                  className={`w-7 h-7 rounded text-xs font-mono flex items-center justify-center transition-all ${
                    exists
                      ? "text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                      : "text-[var(--text-tertiary)]/30 cursor-default"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        )}

        {/* Résultats groupés par lettre */}
        {filtered.length > 0 ? (
          <div className="space-y-1">
            {letters.map((letter) => (
              <div key={letter} id={`letter-${letter}`}>
                <div className="letter-heading py-1.5 mb-2">
                  <span className="text-lg font-bold text-[var(--accent)] font-mono">
                    {letter}
                  </span>
                  <span className="ml-2 text-[10px] font-mono text-[var(--text-tertiary)]">
                    {grouped[letter].length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mb-6">
                  {grouped[letter].map((term, i) => (
                    <TermCard key={term.slug} term={term} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-20">∅</div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Aucun terme ne correspond
            </p>
            <button
              onClick={resetFilters}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
