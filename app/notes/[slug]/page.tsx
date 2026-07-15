import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/markdown-article";
import { getAllContent, getContentBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllContent("notes").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getContentBySlug("notes", slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default async function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getContentBySlug("notes", slug);
  if (!entry) notFound();
  return <MarkdownArticle entry={entry} backHref="/notes" backLabel="返回公开笔记" />;
}
