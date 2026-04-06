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
