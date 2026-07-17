import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/markdown-article";
import { getAllContent, getContentBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllContent("algorithms").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getContentBySlug("algorithms", slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default async function AlgorithmDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getContentBySlug("algorithms", slug);
  if (!entry) notFound();
  return <MarkdownArticle entry={entry} backHref="/algorithms" backLabel="返回算法题解" />;
}