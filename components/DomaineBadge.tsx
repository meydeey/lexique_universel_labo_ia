import type { Domaine } from "@/lib/types";

const DOMAINE_ICONS: Record<Domaine, string> = {
  frontend: "{}",
  backend: ">>",
  "base de données": "db",
  workflow: "⚡",
  "agents IA": "🤖",
  "CLI / terminal": "$_",
  "Claude Code": "CC",
  sécurité: "🔒",
  "DevOps / déploiement": "▲",
};

export function DomaineBadge({ domaine }: { domaine: Domaine }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)]">
      <span className="opacity-60">{DOMAINE_ICONS[domaine]}</span>
      {domaine}
    </span>
  );
}
