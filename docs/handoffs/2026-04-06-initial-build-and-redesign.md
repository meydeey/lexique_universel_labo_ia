# Handoff — 2026-04-06 — Build initial + redesign UI/UX

## Etat du projet

- Lexique technique public avec 349 termes couvrant 9 domaines
- Deploye sur Vercel : https://lexique-le-labo-ia.vercel.app
- GitHub : https://github.com/meydeey/lexique_universel_labo_ia
- Toutes les fonctionnalites V1 livrees : recherche, filtres, fiches termes, terme du jour

## Changements de cette session

### Phase 1 : Build initial (12 tasks)

- Setup Next.js 16 + Tailwind CSS + Manrope/JetBrains Mono
- Types TypeScript + couche data avec validation au build
- 10 composants : Header, NiveauBadge, DomaineBadge, TermCard, CodeBlock, CatalogueClient, TermOfTheDay, TermDetail, RelatedTerms
- Generation de 349 termes par IA (couvrant 9 domaines)
- SSG avec `generateStaticParams` pour 353 pages statiques
- Premier deploy Vercel

### Phase 2 : Redesign UI/UX

- Sidebar filtres sur desktop (niveaux avec couleurs, domaines avec icones)
- Navigation alphabetique (barre de lettres cliquables)
- Termes groupes par premiere lettre avec headers sticky
- Terme du jour compact (barre inline au lieu d'un gros bloc)
- Cartes redesignees : bordure coloree par niveau, animations staggered
- Filtres actifs visibles en tags avec suppression individuelle
- Filtres collapsibles sur mobile
- Recherche avec icone, glow effect, bouton clear
- Palette enrichie (tertiary, elevated, glow, noise texture)

## Architecture rapide

- Stack : Next.js 16 (App Router, SSG) + Tailwind CSS + shiki
- Donnees : `data/terms.json` (349 termes, fichier unique)
- Pages : `/` (catalogue) + `/terme/[slug]` (fiche terme)
- Deploy : Vercel, auto-deploy sur push GitHub

## Fichiers critiques

- `data/terms.json` — dataset complet
- `lib/types.ts` — types Terme, Niveau, Domaine
- `lib/terms.ts` — acces donnees + validation
- `components/CatalogueClient.tsx` — recherche + filtres + grid (le plus gros composant)
- `app/globals.css` — tokens CSS du design system

## Prochaines etapes

- V2 : mode quiz/flashcards (les donnees sont deja structurees pour)
- V2 : toggle light mode (variables CSS en place)
- V2 : contributions eleves (champ `statut` deja dans le schema)
- Enrichir les exemples de code (actuellement 45% des termes, cible 60%)
- Ajouter des termes manquants si besoin

## Contexte perdu si non documente

- Le build script utilise `--webpack` a cause d'une restriction sandbox locale (Google Fonts fetch bloque sous Turbopack). Sur Vercel, le build fonctionne normalement. On pourrait retirer `--webpack` si le dev local n'est pas en sandbox.
- Les slugs suivent une convention mixte : anglais pour les termes universels (api-rest, webhook), francais pour les autres (variable-environnement). Pas de regle stricte, c'est le "naturel" qui prime.
- Le breadcrumb domaine sur la page terme n'est PAS un lien filtrant — c'est juste du texte. Le CatalogueClient ne lit pas les URL params.
