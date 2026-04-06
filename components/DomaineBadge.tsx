import type { Domaine } from "@/lib/types";

export function DomaineBadge({ domaine }: { domaine: Domaine }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--accent)] text-[var(--accent)]">
      {domaine}
    </span>
  );
}
