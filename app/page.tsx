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
