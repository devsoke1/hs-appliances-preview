import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/services/", "/areas/", "/about/", "/contact/", "/faq/", "/book/", "/privacy-policy/", "/terms/"];
  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), priority: p === "/" ? 1 : 0.6 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}/`), priority: 0.9 })),
    ...areas.map((a) => ({ url: absoluteUrl(`/areas/${a.slug}/`), priority: 0.8 })),
  ];
}
