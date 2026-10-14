import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const root = "https://adjacent-atlas.dev/";
  return ["", "atlas/", "method/", "briefs/", "about/"].map((path, index) => ({
    url: root + path, lastModified: new Date("2026-10-14"), changeFrequency: "monthly" as const, priority: index === 0 ? 1 : 0.7,
  }));
}
