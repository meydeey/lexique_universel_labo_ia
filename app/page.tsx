import { getAllTerms } from "@/lib/terms";
import { CatalogueClient } from "@/components/CatalogueClient";
import { TermOfTheDay } from "@/components/TermOfTheDay";

export default function Home() {
  const terms = getAllTerms();

  const dayIndex = Math.floor(Math.random() * terms.length);
  const termOfTheDay = terms[dayIndex];

  return (
    <main className="noise-bg relative max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      <div className="relative z-10">
        <TermOfTheDay term={termOfTheDay} />
        <div className="mt-6">
          <CatalogueClient terms={terms} />
        </div>
      </div>
    </main>
  );
}
