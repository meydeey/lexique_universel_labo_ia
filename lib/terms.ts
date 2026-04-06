import type { Terme, Niveau, Domaine } from "./types";
import { NIVEAUX, DOMAINES } from "./types";
import termsData from "@/data/terms.json";

function validateTerms(terms: Terme[]): void {
  const slugs = new Set<string>();
  const errors: string[] = [];

  for (const term of terms) {
    // Champs requis
    if (
      !term.slug ||
      !term.label ||
      !term.niveau ||
      !term.domaine ||
      !term.definition ||
      !term.statut
    ) {
      errors.push(`[${term.slug || "???"}] Champs requis manquants`);
    }

    // Slug unique
    if (slugs.has(term.slug)) {
      errors.push(`[${term.slug}] Slug dupliqué`);
    }
    slugs.add(term.slug);

    // Niveau valide
    if (!NIVEAUX.includes(term.niveau)) {
      errors.push(`[${term.slug}] Niveau invalide: "${term.niveau}"`);
    }

    // Domaine valide
    if (!DOMAINES.includes(term.domaine)) {
      errors.push(`[${term.slug}] Domaine invalide: "${term.domaine}"`);
    }

    // Termes liés: max 5
    if (term.termes_lies.length > 5) {
      errors.push(
        `[${term.slug}] Plus de 5 termes liés (${term.termes_lies.length})`,
      );
    }

    // Pas d'auto-référence
    if (term.termes_lies.includes(term.slug)) {
      errors.push(`[${term.slug}] Auto-référence dans termes_lies`);
    }
  }

  // Termes liés existants (second pass)
  for (const term of terms) {
    for (const lié of term.termes_lies) {
      if (!slugs.has(lié)) {
        errors.push(`[${term.slug}] Terme lié inexistant: "${lié}"`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation du dataset échouée:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
}

const terms: Terme[] = termsData as Terme[];
validateTerms(terms);

export function getAllTerms(): Terme[] {
  return terms.filter((t) => t.statut === "publié");
}

export function getTermBySlug(slug: string): Terme | undefined {
  return terms.find((t) => t.slug === slug && t.statut === "publié");
}

export function getAllSlugs(): string[] {
  return terms.filter((t) => t.statut === "publié").map((t) => t.slug);
}
