# Lexique Le Labo IA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public technical glossary of 300+ terms with search, filters, and individual term pages, deployed on Vercel.

**Architecture:** SSG-only Next.js App Router site. Single `data/terms.json` dataset loaded at build time. Client-side search and filtering via native JS. Pages pre-generated with `generateStaticParams`.

**Tech Stack:** Next.js 14+ (App Router), Tailwind CSS, shiki (syntax highlighting), Vercel (deploy)

**Spec:** `docs/superpowers/specs/2026-04-06-lexique-design.md`

---

## File Map

| File                             | Responsibility                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `lib/types.ts`                   | TypeScript types: `Terme`, `Niveau`, `Domaine`, `Statut`                           |
| `lib/terms.ts`                   | Data access: `getAllTerms()`, `getTermBySlug()`, `validateTerms()`                 |
| `data/terms.json`                | Complete dataset of 300+ terms                                                     |
| `app/globals.css`                | CSS variables (design tokens), Tailwind imports, font faces                        |
| `app/layout.tsx`                 | Root layout: fonts, metadata, dark mode body                                       |
| `app/page.tsx`                   | Home: Server Component that loads data, renders `CatalogueClient` + `TermOfTheDay` |
| `app/terme/[slug]/page.tsx`      | Term page: SSG with `generateStaticParams`, renders `TermDetail`                   |
| `components/Header.tsx`          | Logo + "Lexique" title                                                             |
| `components/NiveauBadge.tsx`     | Colored badge for débutant/intermédiaire/avancé                                    |
| `components/DomaineBadge.tsx`    | Outline badge for domain                                                           |
| `components/CodeBlock.tsx`       | Syntax-highlighted code block with copy button (client)                            |
| `components/TermCard.tsx`        | Card in catalogue grid: label, badges, truncated definition                        |
| `components/CatalogueClient.tsx` | Client component: SearchBar + FilterBar + grid + empty state                       |
| `components/TermOfTheDay.tsx`    | Featured term card on home                                                         |
| `components/TermDetail.tsx`      | Full term view: definition, code, external link                                    |
| `components/RelatedTerms.tsx`    | Clickable chips linking to related terms                                           |
| `scripts/validate-terms.ts`      | Standalone validation script runnable via `npx tsx`                                |

---

## Task 1: Project Setup

**Files:**

- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `app/globals.css`, `app/layout.tsx`, `public/` directory

- [ ] **Step 1: Initialize Next.js project**

```bash
cd "/Users/meydeey/Desktop/CODE/PRODUCTION/LE LABO IA/PREMIUM/LEXIQUE_UNIVERSEL"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Select defaults when prompted. This creates the full Next.js scaffold.

- [ ] **Step 2: Install dependencies**

```bash
npm install shiki
```

No other runtime deps needed. shiki handles syntax highlighting.

- [ ] **Step 3: Add fonts — Manrope + JetBrains Mono via next/font**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lexique — Le Labo IA",
  description:
    "Lexique technique complet pour maîtriser le vocabulaire de l'IA, du code et de l'automatisation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-[family-name:var(--font-manrope)] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Write design tokens in globals.css**

Replace `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-code: #1a1a25;
  --text-primary: #f0f0f5;
  --text-secondary: #8a8a9a;
  --accent: #7084ff;
  --accent-hover: #8b9cff;
  --border: #1e1e2a;

  --niveau-debutant-bg: #0d3b2e;
  --niveau-debutant-text: #34d399;
  --niveau-intermediaire-bg: #3b2e0d;
  --niveau-intermediaire-text: #fbbf24;
  --niveau-avance-bg: #3b0d0d;
  --niveau-avance-text: #ef4444;
}
```

- [ ] **Step 5: Configure Tailwind for custom fonts and tokens**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Create placeholder home page**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--accent)]">
        Lexique Le Labo IA
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">Setup OK</p>
    </main>
  );
}
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: Build succeeds, no errors.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "feat: project setup — Next.js, Tailwind, fonts, design tokens"
```

---

## Task 2: Types & Data Layer

**Files:**

- Create: `lib/types.ts`, `lib/terms.ts`
- Create: `data/terms.json` (dev dataset, 10 terms)

- [ ] **Step 1: Define TypeScript types**

Create `lib/types.ts`:

```ts
export type Niveau = "débutant" | "intermédiaire" | "avancé";

export type Domaine =
  | "frontend"
  | "backend"
  | "base de données"
  | "workflow"
  | "agents IA"
  | "CLI / terminal"
  | "Claude Code"
  | "sécurité"
  | "DevOps / déploiement";

export type Statut = "publié" | "suggéré";

export interface Terme {
  slug: string;
  label: string;
  niveau: Niveau;
  domaine: Domaine;
  definition: string;
  exemple_code?: string;
  langue_code?: string;
  lien_externe?: string;
  termes_lies: string[];
  statut: Statut;
}

export const NIVEAUX: Niveau[] = ["débutant", "intermédiaire", "avancé"];

export const DOMAINES: Domaine[] = [
  "frontend",
  "backend",
  "base de données",
  "workflow",
  "agents IA",
  "CLI / terminal",
  "Claude Code",
  "sécurité",
  "DevOps / déploiement",
];
```

- [ ] **Step 2: Create dev dataset with 10 terms**

Create `data/terms.json`:

```json
[
  {
    "slug": "api-rest",
    "label": "API REST",
    "niveau": "intermédiaire",
    "domaine": "backend",
    "definition": "Une API REST est une interface qui permet à deux applications de communiquer via le protocole HTTP. Elle utilise des verbes (GET, POST, PUT, DELETE) pour manipuler des ressources identifiées par des URLs.",
    "exemple_code": "// Appel GET avec fetch\nconst response = await fetch('https://api.example.com/users');\nconst users = await response.json();",
    "langue_code": "typescript",
    "lien_externe": null,
    "termes_lies": ["endpoint", "webhook", "json"],
    "statut": "publié"
  },
  {
    "slug": "endpoint",
    "label": "Endpoint",
    "niveau": "intermédiaire",
    "domaine": "backend",
    "definition": "Un endpoint est une URL précise d'une API qui correspond à une ressource ou une action. Par exemple, `/api/users` est un endpoint qui gère les utilisateurs.",
    "exemple_code": "// Endpoint Next.js App Router\n// app/api/users/route.ts\nexport async function GET() {\n  return Response.json({ users: [] });\n}",
    "langue_code": "typescript",
    "lien_externe": null,
    "termes_lies": ["api-rest", "webhook"],
    "statut": "publié"
  },
  {
    "slug": "webhook",
    "label": "Webhook",
    "niveau": "intermédiaire",
    "domaine": "workflow",
    "definition": "Un webhook est un mécanisme qui envoie automatiquement des données vers une URL quand un événement se produit. C'est l'inverse d'une API classique : au lieu de demander des données, tu les reçois automatiquement.",
    "exemple_code": "// Réception d'un webhook dans n8n\n// Le nœud Webhook écoute sur une URL\n// et déclenche le workflow quand il reçoit un POST",
    "langue_code": "typescript",
    "lien_externe": null,
    "termes_lies": ["api-rest", "n8n", "trigger"],
    "statut": "publié"
  },
  {
    "slug": "json",
    "label": "JSON",
    "niveau": "débutant",
    "domaine": "backend",
    "definition": "JSON (JavaScript Object Notation) est un format de données texte, léger et lisible. C'est le format standard pour échanger des données entre un frontend et un backend, ou entre deux APIs.",
    "exemple_code": "{\n  \"nom\": \"Meydeey\",\n  \"role\": \"architecte IA\",\n  \"outils\": [\"n8n\", \"Claude\", \"Supabase\"]\n}",
    "langue_code": "json",
    "lien_externe": null,
    "termes_lies": ["api-rest", "endpoint"],
    "statut": "publié"
  },
  {
    "slug": "n8n",
    "label": "n8n",
    "niveau": "débutant",
    "domaine": "workflow",
    "definition": "n8n est un outil d'automatisation open-source qui permet de créer des workflows visuels. Tu connectes des nœuds entre eux pour automatiser des tâches sans coder (ou presque).",
    "exemple_code": null,
    "langue_code": null,
    "lien_externe": "https://n8n.io",
    "termes_lies": ["webhook", "trigger", "workflow"],
    "statut": "publié"
  },
  {
    "slug": "trigger",
    "label": "Trigger",
    "niveau": "débutant",
    "domaine": "workflow",
    "definition": "Un trigger est l'événement déclencheur d'un workflow. C'est le premier nœud qui lance l'exécution : un webhook reçu, un horaire (cron), un nouveau fichier détecté, etc.",
    "exemple_code": null,
    "langue_code": null,
    "lien_externe": null,
    "termes_lies": ["webhook", "n8n", "workflow"],
    "statut": "publié"
  },
  {
    "slug": "workflow",
    "label": "Workflow",
    "niveau": "débutant",
    "domaine": "workflow",
    "definition": "Un workflow est une suite d'étapes automatisées qui s'exécutent dans un ordre défini. Dans n8n, c'est une chaîne de nœuds connectés qui transforment et transmettent des données.",
    "exemple_code": null,
    "langue_code": null,
    "lien_externe": null,
    "termes_lies": ["n8n", "trigger", "webhook"],
    "statut": "publié"
  },
  {
    "slug": "composant-react",
    "label": "Composant React",
    "niveau": "intermédiaire",
    "domaine": "frontend",
    "definition": "Un composant React est un bloc d'interface réutilisable. C'est une fonction qui retourne du JSX (du HTML enrichi) et qui peut recevoir des données via ses props. Chaque bouton, carte ou page est un composant.",
    "exemple_code": "function TermCard({ label, niveau }: { label: string; niveau: string }) {\n  return (\n    <div className=\"card\">\n      <h3>{label}</h3>\n      <span>{niveau}</span>\n    </div>\n  );\n}",
    "langue_code": "tsx",
    "lien_externe": "https://react.dev",
    "termes_lies": ["props", "jsx"],
    "statut": "publié"
  },
  {
    "slug": "props",
    "label": "Props",
    "niveau": "débutant",
    "domaine": "frontend",
    "definition": "Les props (propriétés) sont les données qu'un composant parent transmet à un composant enfant. C'est le mécanisme principal de communication entre composants en React.",
    "exemple_code": "// Le parent passe des props\n<TermCard label=\"API REST\" niveau=\"intermédiaire\" />\n\n// L'enfant les reçoit\nfunction TermCard({ label, niveau }: { label: string; niveau: string }) {\n  return <h3>{label} — {niveau}</h3>;\n}",
    "langue_code": "tsx",
    "lien_externe": null,
    "termes_lies": ["composant-react", "jsx"],
    "statut": "publié"
  },
  {
    "slug": "jsx",
    "label": "JSX",
    "niveau": "débutant",
    "domaine": "frontend",
    "definition": "JSX est une syntaxe qui permet d'écrire du HTML directement dans du JavaScript/TypeScript. React l'utilise pour décrire l'interface. Ce n'est pas du vrai HTML — c'est transformé en appels JavaScript au build.",
    "exemple_code": "// JSX ressemble à du HTML mais c'est du JS\nconst element = (\n  <div className=\"card\">\n    <h1>Bonjour {name}</h1>\n  </div>\n);",
    "langue_code": "tsx",
    "lien_externe": null,
    "termes_lies": ["composant-react", "props"],
    "statut": "publié"
  }
]
```

- [ ] **Step 3: Create data access + validation layer**

Create `lib/terms.ts`:

```ts
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
```

- [ ] **Step 4: Add JSON import support in tsconfig**

In `tsconfig.json`, ensure `resolveJsonModule` and `esModuleInterop` are `true` (Next.js defaults should have this, verify).

- [ ] **Step 5: Verify build with data layer**

Update `app/page.tsx` to test the data layer:

```tsx
import { getAllTerms } from "@/lib/terms";

export default function Home() {
  const terms = getAllTerms();
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--accent)]">
        Lexique Le Labo IA
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        {terms.length} termes chargés
      </p>
    </main>
  );
}
```

```bash
npm run build
```

Expected: Build succeeds, "10 termes chargés" in output.

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/terms.ts data/terms.json app/page.tsx tsconfig.json
git commit -m "feat: types, data layer with validation, dev dataset (10 terms)"
```

---

## Task 3: Header + Badge Components

**Files:**

- Create: `components/Header.tsx`, `components/NiveauBadge.tsx`, `components/DomaineBadge.tsx`

- [ ] **Step 1: Create Header component**

Create `components/Header.tsx`:

```tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold text-[var(--text-primary)]">
            Le Labo IA
          </span>
          <span className="text-[var(--text-secondary)]">|</span>
          <span className="text-lg font-semibold text-[var(--accent)]">
            Lexique
          </span>
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create NiveauBadge component**

Create `components/NiveauBadge.tsx`:

```tsx
import type { Niveau } from "@/lib/types";

const NIVEAU_STYLES: Record<Niveau, string> = {
  débutant: "bg-[var(--niveau-debutant-bg)] text-[var(--niveau-debutant-text)]",
  intermédiaire:
    "bg-[var(--niveau-intermediaire-bg)] text-[var(--niveau-intermediaire-text)]",
  avancé: "bg-[var(--niveau-avance-bg)] text-[var(--niveau-avance-text)]",
};

export function NiveauBadge({ niveau }: { niveau: Niveau }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono ${NIVEAU_STYLES[niveau]}`}
    >
      {niveau}
    </span>
  );
}
```

- [ ] **Step 3: Create DomaineBadge component**

Create `components/DomaineBadge.tsx`:

```tsx
import type { Domaine } from "@/lib/types";

export function DomaineBadge({ domaine }: { domaine: Domaine }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--accent)] text-[var(--accent)]">
      {domaine}
    </span>
  );
}
```

- [ ] **Step 4: Add Header to layout**

Update `app/layout.tsx` — add `import { Header } from "@/components/Header"` and wrap children:

```tsx
<body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-[family-name:var(--font-manrope)] antialiased min-h-screen">
  <Header />
  {children}
</body>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/Header.tsx components/NiveauBadge.tsx components/DomaineBadge.tsx app/layout.tsx
git commit -m "feat: Header, NiveauBadge, DomaineBadge components"
```

---

## Task 4: TermCard + CodeBlock Components

**Files:**

- Create: `components/TermCard.tsx`, `components/CodeBlock.tsx`

- [ ] **Step 1: Create TermCard component**

Create `components/TermCard.tsx`:

```tsx
import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";

export function TermCard({ term }: { term: Terme }) {
  return (
    <Link
      href={`/terme/${term.slug}`}
      className="block p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {term.label}
        </h3>
        <NiveauBadge niveau={term.niveau} />
      </div>
      <DomaineBadge domaine={term.domaine} />
      <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
        {term.definition}
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Create CodeBlock client component**

Create `components/CodeBlock.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function highlight() {
      const { codeToHtml } = await import("shiki");
      const result = await codeToHtml(code, {
        lang: language || "text",
        theme: "github-dark-default",
      });
      setHtml(result);
    }
    highlight();
  }, [code, language]);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-[var(--bg-code)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      {html ? (
        <div
          className="p-4 overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 text-sm font-mono text-[var(--text-secondary)]">
          {code}
        </pre>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/TermCard.tsx components/CodeBlock.tsx
git commit -m "feat: TermCard and CodeBlock components"
```

---

## Task 5: CatalogueClient — Search + Filters + Grid

**Files:**

- Create: `components/CatalogueClient.tsx`

This is the main client-side interactive component. It receives the full terms array from the server component and handles search, filtering, and display.

- [ ] **Step 1: Create CatalogueClient component**

Create `components/CatalogueClient.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import type { Terme, Niveau, Domaine } from "@/lib/types";
import { NIVEAUX, DOMAINES } from "@/lib/types";
import { TermCard } from "./TermCard";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function CatalogueClient({ terms }: { terms: Terme[] }) {
  const [search, setSearch] = useState("");
  const [selectedNiveaux, setSelectedNiveaux] = useState<Set<Niveau>>(
    new Set(),
  );
  const [selectedDomaines, setSelectedDomaines] = useState<Set<Domaine>>(
    new Set(),
  );

  const filtered = useMemo(() => {
    const query = normalize(search);
    return terms
      .filter((t) => {
        if (query) {
          const matchLabel = normalize(t.label).includes(query);
          const matchDef = normalize(t.definition).includes(query);
          if (!matchLabel && !matchDef) return false;
        }
        if (selectedNiveaux.size > 0 && !selectedNiveaux.has(t.niveau))
          return false;
        if (selectedDomaines.size > 0 && !selectedDomaines.has(t.domaine))
          return false;
        return true;
      })
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [terms, search, selectedNiveaux, selectedDomaines]);

  // Compteurs pour les chips
  const niveauCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of NIVEAUX) {
      counts[n] = terms.filter((t) => t.niveau === n).length;
    }
    return counts;
  }, [terms]);

  const domaineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of DOMAINES) {
      counts[d] = terms.filter((t) => t.domaine === d).length;
    }
    return counts;
  }, [terms]);

  function toggleNiveau(n: Niveau) {
    setSelectedNiveaux((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function toggleDomaine(d: Domaine) {
    setSelectedDomaines((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function resetFilters() {
    setSearch("");
    setSelectedNiveaux(new Set());
    setSelectedDomaines(new Set());
  }

  const hasActiveFilters =
    search || selectedNiveaux.size > 0 || selectedDomaines.size > 0;

  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un terme..."
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Filtres niveaux */}
      <div className="mb-3 flex flex-wrap gap-2">
        {NIVEAUX.map((n) => (
          <button
            key={n}
            onClick={() => toggleNiveau(n)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold font-mono transition-colors ${
              selectedNiveaux.has(n)
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {n} ({niveauCounts[n]})
          </button>
        ))}
      </div>

      {/* Filtres domaines */}
      <div className="mb-6 flex flex-wrap gap-2">
        {DOMAINES.map((d) => (
          <button
            key={d}
            onClick={() => toggleDomaine(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedDomaines.has(d)
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {d} ({domaineCounts[d]})
          </button>
        ))}
      </div>

      {/* Compteur + reset */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">
          {filtered.length} terme{filtered.length !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Grille ou état vide */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)] mb-4">
            Aucun terme trouvé
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/CatalogueClient.tsx
git commit -m "feat: CatalogueClient — search, filters, grid with empty state"
```

---

## Task 6: TermOfTheDay Component

**Files:**

- Create: `components/TermOfTheDay.tsx`

- [ ] **Step 1: Create TermOfTheDay component**

Create `components/TermOfTheDay.tsx`:

```tsx
import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";

export function TermOfTheDay({ term }: { term: Terme }) {
  return (
    <div className="mb-8 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent)]/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider">
          Terme du jour
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {term.label}
        </h2>
        <div className="flex gap-2 shrink-0">
          <NiveauBadge niveau={term.niveau} />
          <DomaineBadge domaine={term.domaine} />
        </div>
      </div>
      <p className="text-[var(--text-secondary)] line-clamp-2 mb-4">
        {term.definition}
      </p>
      <Link
        href={`/terme/${term.slug}`}
        className="inline-block text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
      >
        Voir la fiche →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/TermOfTheDay.tsx
git commit -m "feat: TermOfTheDay component"
```

---

## Task 7: Home Page Assembly

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: Assemble the home page**

Replace `app/page.tsx`:

```tsx
import { getAllTerms } from "@/lib/terms";
import { CatalogueClient } from "@/components/CatalogueClient";
import { TermOfTheDay } from "@/components/TermOfTheDay";

export default function Home() {
  const terms = getAllTerms();

  // Terme du jour : tirage pseudo-aléatoire basé sur la date du build
  const dayIndex = Math.floor(Math.random() * terms.length);
  const termOfTheDay = terms[dayIndex];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <TermOfTheDay term={termOfTheDay} />
      <CatalogueClient terms={terms} />
    </main>
  );
}
```

- [ ] **Step 2: Verify build + dev server**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000` — verify:

- Terme du jour shows a random term
- 10 term cards display in a grid
- Search filters by label/definition
- Niveau + domaine chips work and show counts
- Empty state shows when filters match nothing
- Reset button clears all filters

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: home page — terme du jour + catalogue with search and filters"
```

---

## Task 8: RelatedTerms + TermDetail Components

**Files:**

- Create: `components/RelatedTerms.tsx`, `components/TermDetail.tsx`

- [ ] **Step 1: Create RelatedTerms component**

Create `components/RelatedTerms.tsx`:

```tsx
import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";

export function RelatedTerms({ terms }: { terms: Terme[] }) {
  if (terms.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
        Termes liés
      </h2>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/terme/${t.slug}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {t.label}
            </span>
            <NiveauBadge niveau={t.niveau} />
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create TermDetail component**

Create `components/TermDetail.tsx`:

```tsx
import Link from "next/link";
import type { Terme } from "@/lib/types";
import { NiveauBadge } from "./NiveauBadge";
import { DomaineBadge } from "./DomaineBadge";
import { CodeBlock } from "./CodeBlock";
import { RelatedTerms } from "./RelatedTerms";
import { getAllTerms } from "@/lib/terms";

export function TermDetail({ term }: { term: Terme }) {
  // Résoudre les termes liés
  const allTerms = getAllTerms();
  const relatedTerms = term.termes_lies
    .map((slug) => allTerms.find((t) => t.slug === slug))
    .filter((t): t is Terme => t !== undefined);

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--text-secondary)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          Lexique
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/?domaine=${encodeURIComponent(term.domaine)}`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          {term.domaine}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--text-primary)]">{term.label}</span>
      </nav>

      {/* En-tête */}
      <div className="flex items-start flex-wrap gap-3 mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {term.label}
        </h1>
        <div className="flex items-center gap-2">
          <NiveauBadge niveau={term.niveau} />
          <DomaineBadge domaine={term.domaine} />
        </div>
        {term.lien_externe && (
          <a
            href={term.lien_externe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Site officiel ↗
          </a>
        )}
      </div>

      {/* Définition */}
      <div className="mb-8 text-[var(--text-primary)] leading-relaxed text-lg">
        {term.definition}
      </div>

      {/* Bloc de code */}
      {term.exemple_code && (
        <div className="mb-8">
          <CodeBlock code={term.exemple_code} language={term.langue_code} />
        </div>
      )}

      {/* Termes liés */}
      <RelatedTerms terms={relatedTerms} />

      {/* Retour */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          ← Retour au lexique
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/RelatedTerms.tsx components/TermDetail.tsx
git commit -m "feat: TermDetail and RelatedTerms components"
```

---

## Task 9: Term Page — `/terme/[slug]`

**Files:**

- Create: `app/terme/[slug]/page.tsx`

- [ ] **Step 1: Create the term page with SSG**

Create `app/terme/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getTermBySlug } from "@/lib/terms";
import { TermDetail } from "@/components/TermDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) return { title: "Terme introuvable — Lexique Le Labo IA" };

  return {
    title: `${term.label} — Lexique Le Labo IA`,
    description: term.definition.slice(0, 160),
  };
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <TermDetail term={term} />
    </main>
  );
}
```

- [ ] **Step 2: Verify build + navigation**

```bash
npm run build
npm run dev
```

Test:

- `http://localhost:3000/terme/api-rest` — fiche complète avec code colorisé
- `http://localhost:3000/terme/n8n` — fiche avec lien externe
- `http://localhost:3000/terme/inexistant` — page 404
- Click on a related term → navigates to that term's page
- Breadcrumb links work

- [ ] **Step 3: Commit**

```bash
git add app/terme/[slug]/page.tsx
git commit -m "feat: term page /terme/[slug] with SSG, metadata, and 404 handling"
```

---

## Task 10: Generate Full Dataset (300+ Terms)

**Files:**

- Modify: `data/terms.json`

This is the largest task. Generate the complete dataset covering all 9 domains.

- [ ] **Step 1: Plan the term distribution**

Target distribution across domains (minimum):

| Domaine              | Min terms |
| -------------------- | --------- |
| frontend             | 35        |
| backend              | 40        |
| base de données      | 30        |
| workflow             | 30        |
| agents IA            | 40        |
| CLI / terminal       | 30        |
| Claude Code          | 30        |
| sécurité             | 30        |
| DevOps / déploiement | 35        |

Total: ~300+ terms. Mix of niveaux across each domain.

- [ ] **Step 2: Generate the complete `data/terms.json`**

Replace the dev dataset with the full 300+ terms. Each term must:

- Have a unique slug (URL-safe, mixte naturel fr/en)
- Include a clear 1-4 sentence definition contextualized to IA/automation
- Include `exemple_code` + `langue_code` when relevant (aim for ~60% of terms)
- Include `lien_externe` for tools/services only
- Include 1-5 `termes_lies` referencing existing slugs
- Have `statut: "publié"`

- [ ] **Step 3: Validate the dataset**

```bash
npm run build
```

The build-time validation in `lib/terms.ts` will catch:

- Duplicate slugs
- Broken `termes_lies` references
- Invalid niveaux/domaines
- Auto-references
- More than 5 related terms

Fix any validation errors until build passes clean.

- [ ] **Step 4: Verify term count**

Start dev server, check home page shows 300+ terms. Spot-check 5-10 term pages for quality.

- [ ] **Step 5: Commit**

```bash
git add data/terms.json
git commit -m "feat: complete dataset — 300+ terms across 9 domains"
```

---

## Task 11: Responsive Polish + Final UI

**Files:**

- Modify: `app/globals.css`, `components/CatalogueClient.tsx`, `components/TermDetail.tsx`

- [ ] **Step 1: Add responsive refinements to globals.css**

Add to `app/globals.css`:

```css
/* Scrollbar styling for dark mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Code block horizontal scroll on mobile */
pre {
  overflow-x: auto;
}
```

- [ ] **Step 2: Add horizontal scroll for domain filters on mobile**

In `CatalogueClient.tsx`, wrap the domaines filter div:

Change the domaines container class from `mb-6 flex flex-wrap gap-2` to:

```
mb-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0
```

- [ ] **Step 3: Verify responsive on mobile**

```bash
npm run dev
```

Test at 375px width (iPhone SE):

- Cards stack in single column
- Domain filters scroll horizontally
- Term detail page reads well
- Code blocks scroll horizontally without breaking layout

- [ ] **Step 4: Verify full build**

```bash
npm run build
```

Expected: Build succeeds with 300+ static pages generated.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/CatalogueClient.tsx
git commit -m "fix: responsive polish — mobile filters scroll, scrollbar, code overflow"
```

---

## Task 12: Build Validation + Vercel Deploy

**Files:**

- Create: `.gitignore` (if not already present from create-next-app)

- [ ] **Step 1: Final build validation**

```bash
npm run build
```

Verify in build output:

- No errors or warnings
- 300+ static pages generated under `/terme/[slug]`
- Build completes in reasonable time

- [ ] **Step 2: Run dev server and manually validate MVP criteria**

```bash
npm run dev
```

Check all MVP criteria from the spec:

- [ ] Home page shows all terms with filters (niveau "débutant" + domaine "CLI / terminal")
- [ ] Search "webhook" shows the term in real time
- [ ] Term page shows definition, colored code, clickable related terms
- [ ] Direct URL `/terme/api-rest` works
- [ ] No broken related term links

- [ ] **Step 3: Initialize git repo and push to GitHub**

```bash
git remote add origin <github-url>
git push -u origin main
```

(User provides the GitHub repo URL)

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect the GitHub repo to Vercel dashboard for automatic deploys.

- [ ] **Step 5: Verify live URL**

Open the Vercel URL:

- Home page loads, terme du jour visible
- Search + filters work
- Term pages load with correct metadata (check page source for `<title>`)
- External links open in new tab
- No 404 on CSS/JS assets

- [ ] **Step 6: Final commit if any last fixes**

```bash
git add -A
git commit -m "chore: production-ready build verified"
```
