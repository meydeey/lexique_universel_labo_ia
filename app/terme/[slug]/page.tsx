import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getTermBySlug } from "@/lib/terms";
import { TermDetail } from "@/components/TermDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) return { title: "Terme introuvable — Lexique Le Labo IA" };

  return {
    title: `${term.label} — Lexique Le Labo IA`,
    description: term.definition.slice(0, 160),
  };
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <TermDetail term={term} />
    </main>
  );
}
