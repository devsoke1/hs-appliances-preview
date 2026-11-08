import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { SmartImage } from "@/components/ui/SmartImage";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }) : "";

/** Insight cards — 3 desktop / 2 tablet / 1 mobile. Mirrored in PHP: components.php → post_card(). */
export function PostCard({ p, headingLevel = 3 }: { p: PostSummary; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      href={p.url}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="aspect-[16/9] overflow-hidden bg-mist">
        {p.featured_image ? (
          <SmartImage src={p.featured_image} alt={p.image_alt ?? ""} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="h-full bg-navy-900 bg-blueprint" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {p.category && <span className="font-semibold text-brand-600">{p.category}</span>}
          {p.category && p.published_at && <span aria-hidden>·</span>}
          {p.published_at && <time dateTime={p.published_at}>{fmt(p.published_at)}</time>}
        </p>
        <H className="mt-2 font-display text-lg leading-snug font-bold text-ink group-hover:text-brand-600">{p.title}</H>
        <p className="mt-2 line-clamp-3 text-base text-muted">{p.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-sm font-bold text-brand-600">
          Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function PostCards({ posts, className, headingLevel = 3 }: { posts: PostSummary[]; className?: string; headingLevel?: 2 | 3 }) {
  if (!posts.length) return null;
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((p) => (
        <li key={p.slug}>
          <PostCard p={p} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
