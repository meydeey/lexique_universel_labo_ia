<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Lexique Le Labo IA

## Project Type

Public technical glossary — static content site with 349 terms across 9 domains. No backend, no auth, no database.

## Tech Stack

- Next.js 16 (App Router, SSG via `generateStaticParams`)
- TypeScript 5 (strict)
- Tailwind CSS 4 with custom CSS tokens (dark mode only)
- Shiki 4 (syntax highlighting, lazy-loaded client-side)
- Vercel (hosting, auto-deploy on push)

## Key Files

| File                             | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| `data/terms.json`                | Single source of truth — 349 terms                     |
| `lib/types.ts`                   | `Terme` interface, `Niveau`/`Domaine` enums, constants |
| `lib/terms.ts`                   | Data access + build-time validation                    |
| `components/CatalogueClient.tsx` | Main interactive component (search, filters, grid)     |
| `app/globals.css`                | Design tokens (CSS custom properties)                  |

## Conventions

- **Language**: Code in English, content/definitions in French
- **Components**: All custom — no shadcn/ui, no component library
- **Styling**: CSS custom properties (`var(--token)`) only — no Tailwind `dark:` prefix
- **Data**: Static JSON, validated at build time — no runtime validation needed
- **Build**: Must use `--webpack` flag (Turbopack incompatible with Shiki)

## Commands

```bash
npm run dev      # Dev server (port 3000)
npm run build    # Build SSG (validates data, generates 353 static pages)
npm run lint     # ESLint
vercel --prod    # Deploy to production
```

## Architecture

```
app/
  page.tsx              # Home: catalogue + search + filters
  terme/[slug]/page.tsx # Term detail page (SSG)
components/             # All UI components
data/terms.json         # Dataset (349 terms)
lib/                    # Types + data access
```

## Adding Terms

Edit `data/terms.json`, follow the `Terme` interface from `lib/types.ts`. Run `npm run build` to validate. Build fails on: duplicate slugs, broken `termes_lies` references, invalid `niveau`/`domaine`, self-references, >5 related terms.

## Documentation

- `docs/overview.md` — Project description and setup
- `docs/architecture.md` — Architecture with Mermaid diagrams
- `docs/design-system.md` — Colors, typography, tokens
- `docs/architecture/adrs/` — Architecture Decision Records
