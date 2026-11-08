import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Generated as /sitemap.xml at build time. Every indexable page — the 404 page and
 * form success states (which are inline, not separate URLs) are deliberately absent.
 * `npm run audit` checks this list against the built pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date().toISOString().slice(0, 10);
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly", lastModified = built) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/services/", 0.9),
    ...services.map((s) => page(`/services/${s.slug}/`, 0.9)),
    page("/areas/", 0.8),
    ...areas.map((a) => page(`/areas/${a.slug}/`, 0.8)),
    page("/blog/", 0.6, "weekly"),
    ...getAllPosts().map((p) => page(`/blog/${p.slug}/`, 0.6, "monthly", p.updated ?? p.date)),
    page("/about/", 0.5),
    page("/contact/", 0.6),
    page("/faq/", 0.5),
    page("/book/", 0.7),
    page("/privacy-policy/", 0.2, "yearly"),
    page("/terms/", 0.2, "yearly"),
  ];
}
