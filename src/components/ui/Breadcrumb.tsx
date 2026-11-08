import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb + BreadcrumbList schema. "Home" is added automatically. */
export function Breadcrumb({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.href && !last ? (
                  <Link
                    href={c.href}
                    className={cn("transition-colors", tone === "dark" ? "text-white/65 hover:text-white" : "text-muted hover:text-brand-600")}
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={cn("font-semibold", tone === "dark" ? "text-white" : "text-ink")}>
                    {c.label}
                  </span>
                )}
                {!last && <ChevronRight className={cn("size-3.5", tone === "dark" ? "text-white/40" : "text-muted/60")} aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: absoluteUrl(c.href) } : {}),
          })),
        }}
      />
    </>
  );
}
