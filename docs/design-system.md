# Design System — Lexique Le Labo IA

> Généré le 2026-04-06 par MD-documentation

## Palette de couleurs

Définie en tokens CSS custom dans `app/globals.css`. Dark-only, pas de mode clair.

### Fonds

| Token            | Valeur    | Usage                             |
| ---------------- | --------- | --------------------------------- |
| `--bg-primary`   | `#06060b` | Fond principal (body)             |
| `--bg-secondary` | `#0e0e16` | Cartes, barres de recherche       |
| `--bg-tertiary`  | `#14141f` | Hover sur cartes, filtres mobiles |
| `--bg-code`      | `#1a1a25` | Fond des blocs de code            |
| `--bg-elevated`  | `#18182a` | Surfaces surélevées               |

### Textes

| Token              | Valeur    | Usage                         |
| ------------------ | --------- | ----------------------------- |
| `--text-primary`   | `#eeeef2` | Texte principal               |
| `--text-secondary` | `#6b6b80` | Texte secondaire, métadonnées |
| `--text-tertiary`  | `#45455a` | Labels, placeholders, icônes  |

### Accent

| Token            | Valeur                   | Usage                              |
| ---------------- | ------------------------ | ---------------------------------- |
| `--accent`       | `#7084ff`                | Liens, CTAs, letter headings, logo |
| `--accent-hover` | `#8b9cff`                | Hover sur éléments accent          |
| `--accent-dim`   | `rgba(112,132,255,0.08)` | Fond filtres actifs, TermOfTheDay  |
| `--accent-glow`  | `rgba(112,132,255,0.15)` | Glow animation sur la recherche    |

### Bordures

| Token            | Valeur    | Usage               |
| ---------------- | --------- | ------------------- |
| `--border`       | `#1a1a28` | Bordures par défaut |
| `--border-hover` | `#2a2a3e` | Bordures au hover   |

### Niveaux (badges colorés)

| Niveau        | Background | Texte             | Accent                  |
| ------------- | ---------- | ----------------- | ----------------------- |
| débutant      | `#0d3b2e`  | `#34d399` (vert)  | `rgba(52,211,153,0.12)` |
| intermédiaire | `#3b2e0d`  | `#fbbf24` (jaune) | `rgba(251,191,36,0.12)` |
| avancé        | `#3b0d0d`  | `#ef4444` (rouge) | `rgba(239,68,68,0.12)`  |

## Typographie

Définie dans `tailwind.config.ts` et chargée via `next/font` dans `app/layout.tsx`.

| Famille        | Variable CSS     | Usage                                      |
| -------------- | ---------------- | ------------------------------------------ |
| Manrope        | `--font-manrope` | Corps de texte, UI générale (font-sans)    |
| JetBrains Mono | `--font-mono`    | Labels techniques, badges, compteurs, code |

### Patterns typographiques courants

| Élément          | Classes Tailwind                                    |
| ---------------- | --------------------------------------------------- |
| Titre terme (h1) | `text-3xl sm:text-4xl font-bold tracking-tight`     |
| Label badge      | `text-[10px] font-mono uppercase tracking-widest`   |
| Texte carte      | `text-xs text-[var(--text-secondary)] line-clamp-2` |
| Définition       | `text-base sm:text-lg leading-relaxed`              |
| Compteur/meta    | `text-xs font-mono text-[var(--text-tertiary)]`     |

## Composants

### NiveauBadge

Fichier : `components/NiveauBadge.tsx`

Badge `<span>` avec fond coloré par niveau. Props : `niveau` (requis), `size: "sm" | "xs"` (défaut `"sm"`).

| Size | Classes                    |
| ---- | -------------------------- |
| `sm` | `px-2 py-0.5 text-xs`      |
| `xs` | `px-1.5 py-px text-[10px]` |

### DomaineBadge

Fichier : `components/DomaineBadge.tsx`

Badge `<span>` avec icône mono fixe par domaine. Fond `--bg-tertiary`, texte `--text-secondary`.

| Domaine              | Icône |
| -------------------- | ----- |
| frontend             | `{}`  |
| backend              | `>>`  |
| base de données      | `db`  |
| workflow             | `⚡`  |
| agents IA            | `🤖`  |
| CLI / terminal       | `$_`  |
| Claude Code          | `CC`  |
| sécurité             | `🔒`  |
| DevOps / déploiement | `▲`   |

### TermCard

Fichier : `components/TermCard.tsx`

Lien-carte `<Link>`. Bordure gauche colorée par niveau (`border-l-2`). Animation `animate-fade-in` avec délai staggeré (`index * 20ms`, max 300ms).

### CodeBlock

Fichier : `components/CodeBlock.tsx`

`'use client'`. Shiki chargé en lazy (`import("shiki")`) dans un `useEffect` — affiche le code brut en attendant. Thème : `github-dark-default`. Bouton "Copier" avec état `copied` (reset 2s).

## Animations

Définies dans `app/globals.css` :

| Classe                      | Animation                                   | Durée                   |
| --------------------------- | ------------------------------------------- | ----------------------- |
| `.animate-fade-in`          | `fadeInUp` — opacity 0→1 + translateY 8px→0 | 0.3s ease-out           |
| `.search-glow:focus-within` | `searchGlow` — box-shadow pulsante accent   | 2s ease-in-out infinite |
| `.noise-bg::before`         | Texture bruit SVG (opacity 0.025)           | —                       |
| `.letter-heading`           | Sticky + `backdrop-filter: blur(12px)`      | —                       |

## Layout et responsive

| Breakpoint      | Comportement                                               |
| --------------- | ---------------------------------------------------------- |
| Mobile (défaut) | Filtres masqués, bouton "Filtres" toggle, grille 1 colonne |
| `md` (768px+)   | Grille catalogue 2 colonnes                                |
| `lg` (1024px+)  | Sidebar filtres visible (w-56), sticky top-20              |
| `xl` (1280px+)  | Grille catalogue 3 colonnes                                |

Largeur max globale : `max-w-[1400px]` centré avec `mx-auto px-4 sm:px-6`.

## Do / Don't

| Do                                                                       | Don't                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------- |
| Utiliser les tokens CSS custom (`var(--...)`) pour toutes les couleurs   | Hardcoder des valeurs hex directement dans les classes  |
| `font-mono` pour tous les éléments techniques (slugs, compteurs, labels) | Utiliser la font sans-serif pour du contenu mono        |
| Respecter la hiérarchie de fonds (primary → secondary → tertiary → code) | Mélanger les niveaux de fond sans logique de profondeur |
| Taille `xs` pour les badges dans les cartes, `sm` sur les pages détail   | Utiliser `sm` dans les espaces restreints               |
