import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/markdown-article";
import { getAllContent, getContentBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllContent("experiments").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getContentBySlug("experiments", slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getContentBySlug("experiments", slug);
  if (!entry) notFound();
  return <MarkdownArticle entry={entry} backHref="/experiments" backLabel="返回实验记录" />;
}
