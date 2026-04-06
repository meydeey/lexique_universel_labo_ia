# ADR 0003 — Shiki pour la coloration syntaxique

**Date** : 2026-04-06
**Statut** : Accepte
**Decideur** : Meydeey

## Contexte

Les fiches termes contiennent des exemples de code en TypeScript, bash, SQL, JSON, Python, TSX. La coloration syntaxique est necessaire pour la lisibilite.

## Decision

Utiliser shiki (v4), charge dynamiquement cote client via `import("shiki")` dans un composant `CodeBlock` ("use client").

## Alternatives considerees

- **highlight.js** : plus leger mais moins precis, themes moins riches.
- **Prism** : similaire a highlight.js, syntaxe de plugins plus complexe.
- **Coloration au build** : possible avec shiki SSR, mais le composant CodeBlock a besoin du bouton "Copier" (interaction client), donc le chargement client est necessaire de toute facon.

## Consequences

- Rendu initial sans coloration (fallback `<pre>` monochrome), puis coloration apres chargement shiki (~100ms)
- Bundle shiki charge dynamiquement, pas dans le bundle initial
- Theme `github-dark-default` coherent avec le design system dark mode
