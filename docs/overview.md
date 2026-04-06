# Vue d'ensemble

## Description

Lexique Le Labo IA est un glossaire technique public de 349 termes couvrant l'IA, le code et l'automatisation. Chaque terme inclut une définition, un niveau de difficulté, un domaine, un exemple de code optionnel et des termes liés. Le site est entièrement statique — aucun backend, aucune base de données, aucune authentification.

## Stack technique

| Catégorie           | Technologie                          | Version |
| ------------------- | ------------------------------------ | ------- |
| Framework           | Next.js (App Router)                 | 16.2.2  |
| Language            | TypeScript                           | 5.x     |
| Runtime UI          | React                                | 19.2.4  |
| CSS                 | Tailwind CSS                         | 4.x     |
| Fonts               | Manrope + JetBrains Mono (next/font) | —       |
| Syntax highlighting | Shiki                                | 4.x     |
| Hosting             | Vercel                               | —       |
| Build strategy      | SSG (generateStaticParams)           | —       |

## Prérequis

- Node.js >= 20
- npm

Pas de compte cloud, pas de variable d'environnement, pas de `.env`. Le projet fonctionne entièrement en local sans configuration.

## Installation

```bash
git clone <repo>
cd LEXIQUE_UNIVERSEL
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Structure des données

Le dataset est dans `data/terms.json`. Chaque terme suit le type `Terme` défini dans `lib/types.ts` :

```ts
interface Terme {
  slug: string; // identifiant URL unique
  label: string; // nom affiché
  niveau: Niveau; // "débutant" | "intermédiaire" | "avancé"
  domaine: Domaine; // ex: "frontend", "agents IA", "DevOps / déploiement"
  definition: string; // texte principal
  exemple_code?: string; // code optionnel
  langue_code?: string; // langage pour la coloration shiki
  lien_externe?: string; // URL documentation officielle
  termes_lies: string[]; // slugs de termes liés (max 5)
  statut: Statut; // "publié" | "suggéré"
}
```

Seuls les termes avec `statut: "publié"` sont exposés sur le site. La validation du dataset est exécutée au build dans `lib/terms.ts` et plante le build si des erreurs sont trouvées (slug dupliqué, terme lié inexistant, etc.).
