import type { Metadata } from "next";
import { business } from "@/data/business";

export const absoluteUrl = (path = "/") => new URL(path, business.url).toString();

/** Per-page metadata with a self-referencing canonical. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "en_GB", siteName: business.name },
  };
}
