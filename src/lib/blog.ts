/**
 * Markdown blog. Posts live in /content/blog/*.md with YAML frontmatter and are read at BUILD time
 * (server-only — fs is never shipped to the browser).
 *
 * Frontmatter:
 *   title:       H1 on the page
 *   seoTitle:    <title> (≤ 60 chars) — falls back to title
 *   description: meta description (≤ 155 chars) and card text
 *   date:        YYYY-MM-DD
 *   updated:     YYYY-MM-DD (optional)
 *   service:     related service slug (optional) — drives the CTA and cross-links
 *   areas:       [area slugs] (optional) — cross-links to/from area pages
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  updated?: string;
  service?: string;
  areas: string[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

const isoDate = (v: unknown): string | undefined => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return undefined;
};

/** External links open in a new tab; markdown is our own trusted content. */
function postProcess(html: string): string {
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

function load(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const date = isoDate(data.date);
  if (!data.title || !data.description || !date) {
    throw new Error(`Blog post "${file}" needs title, description and date (YYYY-MM-DD) in its frontmatter.`);
  }
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle ?? data.title),
    description: String(data.description),
    date,
    updated: isoDate(data.updated),
    service: typeof data.service === "string" ? data.service : undefined,
    areas: Array.isArray(data.areas) ? data.areas.map(String) : [],
    readingMinutes: Math.max(1, Math.round(words / 220)),
    html: postProcess(marked.parse(content, { async: false, gfm: true })),
  };
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (!cache) {
    const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".md")) : [];
    cache = files.map(load).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  }
  return cache;
}

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
export const postsForService = (slug: string) => getAllPosts().filter((p) => p.service === slug);
export const postsForArea = (slug: string) => getAllPosts().filter((p) => p.areas.includes(slug));
export const postHref = (slug: string) => `/insights/${slug}/`;

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
