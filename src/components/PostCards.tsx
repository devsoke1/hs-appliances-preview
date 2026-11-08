import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate, postHref } from "@/lib/blog";
import { cn } from "@/lib/cn";

export function PostCards({ posts, className, headingLevel = 3 }: { posts: PostMeta[]; className?: string; headingLevel?: 2 | 3 }) {
  if (!posts.length) return null;
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((p) => (
        <li key={p.slug}>
          <Link
            href={postHref(p.slug)}
            className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[box-shadow,border-color] hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
          >
            <p className="flex items-center gap-3 text-sm text-muted">
              <time dateTime={p.date}>{formatDate(p.date)}</time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden /> {p.readingMinutes} min read
              </span>
            </p>
            <H className="mt-3 font-display text-lg leading-snug font-bold text-ink group-hover:text-brand-600">{p.title}</H>
            <p className="mt-2 text-[0.9688rem] text-muted">{p.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-sm font-bold text-brand-600">
              Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
