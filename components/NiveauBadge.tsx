import type { Niveau } from "@/lib/types";

const NIVEAU_STYLES: Record<Niveau, string> = {
  débutant:
    "bg-[var(--niveau-debutant-bg)] text-[var(--niveau-debutant-text)] border-[var(--niveau-debutant-text)]/20",
  intermédiaire:
    "bg-[var(--niveau-intermediaire-bg)] text-[var(--niveau-intermediaire-text)] border-[var(--niveau-intermediaire-text)]/20",
  avancé:
    "bg-[var(--niveau-avance-bg)] text-[var(--niveau-avance-text)] border-[var(--niveau-avance-text)]/20",
};

export function NiveauBadge({
  niveau,
  size = "sm",
}: {
  niveau: Niveau;
  size?: "sm" | "xs";
}) {
  const sizeClasses =
    size === "xs" ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-block rounded border font-semibold font-mono leading-tight ${sizeClasses} ${NIVEAU_STYLES[niveau]}`}
    >
      {niveau}
    </span>
  );
}
