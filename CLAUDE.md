# Lexique Le Labo IA

## Overview

Glossaire technique public de 349 termes (IA, code, automatisation). Next.js 16 App Router, SSG pur, zéro backend. Déployé sur Vercel.

## Stack

- **Framework** : Next.js 16.2.2 App Router
- **Language** : TypeScript 5
- **CSS** : Tailwind CSS 4 + tokens CSS custom (dark-only, `app/globals.css`)
- **Fonts** : Manrope (sans) + JetBrains Mono (`next/font/google`)
- **Syntax highlighting** : Shiki 4 (lazy import côté client)
- **Hosting** : Vercel

## Architecture

- `app/` — Pages SSG, layout, globals.css
- `components/` — Composants React (pas de `components/ui/` — pas de shadcn)
- `lib/types.ts` — Types TypeScript + constantes NIVEAUX/DOMAINES
- `lib/terms.ts` — Fonctions de lecture + validation dataset au build
- `data/terms.json` — Source de vérité des 349 termes

## Commands

- `npm run dev` — Dev server (port 3000)
- `npm run build` — Build SSG (`--webpack`, pas Turbopack)
- `npm run lint` — ESLint
- `vercel --prod` — Deploy production

## Gotchas critiques

- **`--webpack` obligatoire** : `next build --webpack` dans `package.json`. Ne pas passer à Turbopack — incompatibilité Shiki.
- **Validation au build** : `lib/terms.ts` exécute `validateTerms()` à l'import. Un terme invalide (slug dupliqué, terme lié inexistant, niveau/domaine inconnu) fait planter le build avec un message explicite. C'est voulu.
- **Pas de `components/ui/`** : Ce projet n'utilise pas shadcn/ui. Tous les composants sont custom. Ne pas installer shadcn sans raison.
- **Dark-only** : Pas de mode clair, pas de `dark:` préfixe Tailwind. Toutes les couleurs sont des tokens CSS custom `var(--)`.
- **Statut "suggéré"** : Les termes avec `statut: "suggéré"` dans le JSON sont filtrés partout. Ils n'apparaissent pas sur le site.
- **Shiki lazy** : `CodeBlock` importe Shiki dynamiquement dans un `useEffect`. Affiche le code brut pendant le chargement — comportement normal.

## Ajouter des termes

Éditer `data/terms.json`, respecter le type `Terme` (`lib/types.ts`), puis `npm run build` pour valider. Max 5 `termes_lies`, pas d'auto-référence.

## Docs

`docs/` — Vue d'ensemble, architecture, commandes, design system, ADRs.
