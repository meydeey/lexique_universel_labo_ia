# ADR 0002 — Recherche client-side native

**Date** : 2026-04-06
**Statut** : Accepte
**Decideur** : Meydeey

## Contexte

Le lexique doit offrir une recherche textuelle temps reel sur 349 termes (label + definition).

## Decision

Filtre client-side avec `Array.filter()` + `String.includes()` natif. Normalisation des accents via `normalize("NFD")`. Pas de librairie de recherche.

## Alternatives considerees

- **Fuse.js** : fuzzy search, mais overhead pour 349 termes. Le filtrage natif est instantane a cette echelle.
- **Algolia/MeiliSearch** : solution externe, cout, complexite, latence reseau — disproportionne pour un dataset statique de cette taille.

## Consequences

- Zero dependance supplementaire
- Filtrage instantane (<1ms pour 349 termes)
- Recherche exacte (pas de fuzzy), suffisant pour un lexique technique
- Si le dataset depasse 5000+ termes, migrer vers Fuse.js pour le fuzzy matching
