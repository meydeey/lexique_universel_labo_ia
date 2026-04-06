# ADR 0001 — SSG + JSON statique

**Date** : 2026-04-06
**Statut** : Accepte
**Decideur** : Meydeey

## Contexte

Le lexique contient 349 termes techniques. Le contenu est redactionnel, rarement modifie, et ne necessite pas de contribution en temps reel.

## Decision

Utiliser un fichier JSON unique (`data/terms.json`) charge au build par Next.js SSG (`generateStaticParams`). Pas de base de donnees, pas d'API routes.

## Alternatives considerees

- **MDX par terme** (un fichier par terme) : 349 fichiers a gerer, overhead de parsing, plus complexe pour la generation IA en batch.
- **JSON splitte par domaine** : complexite inutile pour 349 termes, validation cross-domaine compliquee.
- **BDD (Supabase/Prisma)** : overhead massif pour du contenu statique, latence runtime, cout serveur.

## Consequences

- Build rapide (~5s pour 353 pages statiques)
- Zero cout runtime (pages servies depuis CDN)
- Modification = modifier le JSON + redeploy
- Le JSON entier est envoye au client pour le filtrage (~150 KB, negligeable)
- Validation des donnees au build time (pas de runtime)
