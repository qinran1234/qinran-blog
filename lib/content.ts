import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const collections = ["blog", "experiments", "notes", "engineering"] as const;
export type ContentCollection = (typeof collections)[number];

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().date(),
  tags: z.array(z.string()).min(1),
  status: z.string().min(1),
  draft: z.boolean(),
  cover: z.string().min(1),
});

export type ContentMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  collection: ContentCollection;
  readingTime: number;
};

export type ContentEntry = ContentMeta & {
  body: string;
};

const contentRoot = path.join(process.cwd(), "content");

function collectionDirectory(collection: ContentCollection) {
  return path.join(contentRoot, collection);
}

function parseEntry(collection: ContentCollection, fileName: string): ContentEntry {
  const filePath = path.join(collectionDirectory(collection), fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const metadata = frontmatterSchema.parse(data);
  const wordCount = content.trim().split(/\s+/u).filter(Boolean).length;

  return {
    ...metadata,
    slug: fileName.replace(/\.mdx?$/u, ""),
    collection,
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    body: content,
  };
}

export function getAllContent(collection: ContentCollection): ContentEntry[] {
  const directory = collectionDirectory(collection);
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((fileName) => /\.mdx?$/u.test(fileName))
    .map((fileName) => parseEntry(collection, fileName))
    .filter((entry) => !entry.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getContentBySlug(
  collection: ContentCollection,
  slug: string,
): ContentEntry | undefined {
  return getAllContent(collection).find((entry) => entry.slug === slug);
}

export function getLatestContent(limit = 3): ContentEntry[] {
  return ([
    ...getAllContent("blog"),
    ...getAllContent("experiments"),
    ...getAllContent("notes"),
  ] as ContentEntry[])
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}
