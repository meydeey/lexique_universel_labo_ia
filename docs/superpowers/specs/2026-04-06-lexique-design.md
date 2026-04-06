# Spec — Lexique Le Labo IA

> Design validé le 2026-04-06. Source de vérité pour l'implémentation.

---

## 1. Vision

Lexique technique public de 300+ termes, structuré par niveau et domaine, destiné aux élèves Le Labo IA et visiteurs. Contenu statique, zéro backend, zéro auth.

---

## 2. Décisions tranchées

| Décision      | Choix                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Dataset       | 300+ termes, complet au lancement, généré par l'IA                                                                   |
| Slugs         | Mixte naturel — anglais pour les termes universels (API, webhook), français pour les autres (variable-environnement) |
| Liens         | Pas de lien Skool — `lien_externe` vers le site officiel uniquement pour les outils/services                         |
| Terme du jour | Inclus V1, tirage aléatoire côté serveur au build                                                                    |
| Architecture  | Approche A — SSG pur, JSON unique                                                                                    |

---

## 3. Structure de données

### Types

```typescript
type Niveau = "débutant" | "intermédiaire" | "avancé";

type Domaine =
  | "frontend"
  | "backend"
  | "base de données"
  | "workflow"
  | "agents IA"
  | "CLI / terminal"
  | "Claude Code"
  | "sécurité"
  | "DevOps / déploiement";

type Statut = "publié" | "suggéré";

interface Terme {
  slug: string; // unique, URL-safe
  label: string; // nom affiché
  niveau: Niveau;
  domaine: Domaine;
  definition: string; // 1-4 phrases, markdown léger
  exemple_code?: string; // bloc de code optionnel
  langue_code?: string; // "bash", "typescript", "json", etc.
  lien_externe?: string; // URL site officiel (outils/services)
  termes_lies: string[]; // 0-5 slugs existants
  statut: Statut; // V1 = tous "publié"
}
```

### Règles de validation (au build)

1. Slugs uniques — aucun doublon
2. Termes liés existants — chaque slug dans `termes_lies` doit exister
3. Pas d'auto-référence — un terme ne peut pas se lister dans ses propres `termes_lies`
4. Max 5 termes liés
5. Niveaux et domaines valides (dans les enums)
6. Champs requis présents : `slug`, `label`, `niveau`, `domaine`, `definition`, `statut`
7. Build fail avec message explicite si une règle est violée

---

## 4. Architecture fichiers

```
LEXIQUE_UNIVERSEL/
├── app/
│   ├── layout.tsx              # Layout racine, fonts, metadata globale
│   ├── page.tsx                # Home = catalogue + recherche + filtres + terme du jour
│   ├── terme/
│   │   └── [slug]/
│   │       └── page.tsx        # Fiche terme individuelle (SSG)
│   └── globals.css             # Variables CSS (tokens), Tailwind
├── components/
│   ├── SearchBar.tsx           # Barre de recherche live
│   ├── FilterBar.tsx           # Filtres niveau + domaine (chips)
│   ├── TermCard.tsx            # Carte terme dans la liste
│   ├── TermDetail.tsx          # Contenu complet fiche terme
│   ├── CodeBlock.tsx           # Bloc de code colorisé (shiki)
│   ├── TermOfTheDay.tsx        # Encart terme du jour
│   ├── RelatedTerms.tsx        # Liste cliquable termes liés
│   ├── NiveauBadge.tsx         # Badge vert/orange/rouge
│   ├── DomaineBadge.tsx        # Badge outline accent
│   └── Header.tsx              # Header logo + titre
├── data/
│   └── terms.json              # Dataset complet 300+ termes
├── lib/
│   ├── terms.ts                # getAll, getBySlug, validation
│   └── types.ts                # Types TypeScript
├── public/
│   └── fonts/                  # Manrope + JetBrains Mono
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Server vs Client Components

- **Server** : `layout.tsx`, `page.tsx` (home), `terme/[slug]/page.tsx`, `Header.tsx`
- **Client** (`"use client"`) : `SearchBar.tsx`, `FilterBar.tsx` (+ les composants qui dépendent de l'état de recherche/filtres)
- Le reste : composants de présentation, rendus côté serveur par défaut

---

## 5. Page d'accueil `/`

### Layout (de haut en bas)

1. **Header** — Logo Le Labo IA + titre "Lexique"
2. **Terme du jour** — Encart : label, NiveauBadge, définition tronquée (~2 lignes), lien "Voir la fiche". Tirage aléatoire au build.
3. **Barre de recherche** — Pleine largeur, filtre sur `label` + `definition`, insensible à la casse, normalisation des accents
4. **Filtres** — Chips cliquables :
   - 3 niveaux (avec compteur)
   - 9 domaines (avec compteur)
   - Sélection multiple, intersection (AND)
   - Bouton "Réinitialiser" si filtre actif
5. **Compteur résultats** — ex: "142 termes" (temps réel)
6. **Grille de cartes** — Triées alphabétiquement. Chaque carte : label, badges, définition tronquée, clic → `/terme/[slug]`
7. **État vide** — "Aucun terme trouvé" + bouton reset

### Technique recherche/filtres

- `filter` + `includes` natif (pas de Fuse.js)
- Normalisation accents via `normalize("NFD").replace(/[\u0300-\u036f]/g, "")`
- État dans `useState` local, pas d'URL params
- Pas de debounce (300 termes = instantané)

---

## 6. Page fiche terme `/terme/[slug]`

### Layout (de haut en bas)

1. **Breadcrumb** — `Lexique > [Domaine] > [Label]` — Lexique et Domaine cliquables (Domaine active le filtre correspondant sur `/`)
2. **En-tête** — Label (h1) + NiveauBadge + DomaineBadge + lien externe si applicable (nouvel onglet)
3. **Définition** — Texte avec markdown léger (gras, italique, backticks inline)
4. **Bloc de code** — Si `exemple_code` existe : indicateur langage, coloration shiki (thème sombre), bouton Copier
5. **Termes liés** — Chips cliquables (label + NiveauBadge). Masqué si vide.
6. **Bouton retour** — "← Retour au lexique"

### Technique

- `generateStaticParams` → toutes les pages pré-générées
- `generateMetadata` → title: `[Label] — Lexique Le Labo IA`, description: définition tronquée
- Slug inexistant → `notFound()`

---

## 7. Design system

### Couleurs (dark mode V1)

| Token              | Valeur    | Usage                 |
| ------------------ | --------- | --------------------- |
| `--bg-primary`     | `#0A0A0F` | Fond principal        |
| `--bg-secondary`   | `#12121A` | Fond cartes, encarts  |
| `--bg-code`        | `#1A1A25` | Fond blocs de code    |
| `--text-primary`   | `#F0F0F5` | Texte principal       |
| `--text-secondary` | `#8A8A9A` | Texte secondaire      |
| `--accent`         | `#7084FF` | Primary, liens, hover |
| `--accent-hover`   | `#8B9CFF` | Hover sur accent      |
| `--border`         | `#1E1E2A` | Bordures, séparateurs |

### Badges niveaux

| Niveau        | Fond      | Texte              |
| ------------- | --------- | ------------------ |
| Débutant      | `#0D3B2E` | `#34D399` (vert)   |
| Intermédiaire | `#3B2E0D` | `#FBBF24` (orange) |
| Avancé        | `#3B0D0D` | `#EF4444` (rouge)  |

### Badges domaines

Outline : bordure `--accent` + texte `--accent`, fond transparent.

### Typographie

- **Manrope** : titres (600-700), corps (400), 14px à 32px
- **JetBrains Mono** : code, blocs de code, slugs, badges techniques

### Responsive

- Desktop : grille 3 colonnes
- Tablette : 2 colonnes
- Mobile : 1 colonne, filtres en scroll horizontal

### Anticipation V2

- Toutes les couleurs via variables CSS → toggle light mode prêt
- Champ `statut` dans le schéma → contributions élèves prêtes
- Données structurées indépendamment de l'affichage → mode quiz/flashcards prêt

---

## 8. Stack technique

| Couche          | Choix                                   |
| --------------- | --------------------------------------- |
| Framework       | Next.js 14+ (App Router, SSG)           |
| Déploiement     | Vercel                                  |
| Données         | `data/terms.json` (statique, versionné) |
| Styles          | Tailwind CSS                            |
| Coloration code | shiki                                   |
| Recherche       | Filtre client-side natif                |
| Typo            | Manrope + JetBrains Mono                |

---

## 9. Génération du dataset

- 300+ termes générés par l'IA, couvrant les 9 domaines
- Définitions contextualisées IA/automation/Le Labo IA
- Exemples de code pertinents quand applicable
- Liens externes pour les outils/services
- Termes liés cross-domaines
- Validation automatique au build

---

## 10. Critères de validation MVP

- [ ] Visiteur sur `/` voit tous les termes, filtre par niveau + domaine, résultats cohérents
- [ ] Recherche "webhook" → terme apparaît en temps réel
- [ ] Fiche terme : définition, code colorisé, termes liés cliquables
- [ ] URL directe `/terme/[slug]` fonctionne (lien partageable)
- [ ] Déployé sur Vercel, accessible publiquement
- [ ] Aucun terme lié cassé dans le dataset
- [ ] 300+ termes dans le dataset
