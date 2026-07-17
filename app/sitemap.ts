import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/algorithms", "/research-trail", "/experiments", "/notes", "/engineering", "/projects", "/friends", "/about"];
  const contentRoutes = ([...getAllContent("blog"), ...getAllContent("algorithms"), ...getAllContent("experiments"), ...getAllContent("notes")]).map((entry) => ({
    url: `${siteConfig.url}/${entry.collection}/${entry.slug}`,
    lastModified: new Date(`${entry.date}T00:00:00Z`),
  }));
  return [
    ...staticRoutes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date() })),
    ...contentRoutes,
  ];
}
