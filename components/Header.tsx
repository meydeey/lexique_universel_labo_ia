import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
            IA
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[var(--text-primary)] tracking-tight">
              Le Labo IA
            </span>
            <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest group-hover:text-[var(--accent-hover)] transition-colors">
              Lexique
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-mono text-[var(--text-tertiary)]">
            349 termes
          </span>
        </div>
      </div>
    </header>
  );
}
