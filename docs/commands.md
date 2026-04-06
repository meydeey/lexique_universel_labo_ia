# Commandes

## Développement

| Commande        | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Serveur de développement (port 3000) |
| `npm run build` | Build de production (SSG, 349 pages) |
| `npm run start` | Serveur de production local          |
| `npm run lint`  | Linter ESLint                        |

## Build

Le build utilise webpack explicitement (`next build --webpack`) — Turbopack est désactivé pour compatibilité avec Shiki.

```bash
npm run build
# Génère .next/ avec 349 pages statiques
# La validation du dataset tourne à ce moment — un terme invalide plante le build
```

## Déploiement

| Commande        | Description       |
| --------------- | ----------------- |
| `vercel`        | Deploy preview    |
| `vercel --prod` | Deploy production |

Le déploiement Vercel est automatique sur push vers `main` si le projet est lié.

## Ajouter des termes

1. Éditer `data/terms.json`
2. Respecter le schéma `Terme` (voir `lib/types.ts`)
3. `npm run build` pour valider (la validation est automatique)
4. Si le build passe, les termes sont prêts à être déployés
