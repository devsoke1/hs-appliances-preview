import type { Metadata } from "next";
import { business } from "@/data/business";

export const SITE_URL = business.url; // https://hsappliances.co.uk (no trailing slash)
export const BRAND = business.shortName;
export const OG_DEFAULT = "/og/default.png";
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Absolute URL on the canonical host. Paths should already end in "/" (trailingSlash: true). */
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

/** First candidate that fits in 60 characters (search results truncate beyond that). */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((c) => c.length <= TITLE_MAX) ?? candidates[candidates.length - 1];
}

type PageMetaInput = {
  /** Full title, used as-is (no template suffix). Keep ≤ 60 chars. */
  title: string;
  /** Keep ≤ 155 chars. */
  description: string;
  /** Path with trailing slash, e.g. "/services/" */
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  article?: { publishedTime: string; modifiedTime?: string };
  noindex?: boolean;
};

/** Per-page metadata: absolute self-canonical, Open Graph and Twitter card. */
export function pageMeta({ title, description, path, image, article, noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const img = {
    url: absoluteUrl(image?.url ?? OG_DEFAULT),
    width: image?.width ?? 1200,
    height: image?.height ?? 630,
    alt: image?.alt ?? `${business.name} — appliance repair in Feltham & West London`,
  };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: business.name,
      locale: "en_GB",
      images: [img],
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime ?? article.publishedTime }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Google Search Console HTML-tag verification. Set NEXT_PUBLIC_GSC_VERIFICATION at build time. */
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "";
