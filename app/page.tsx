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
