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
