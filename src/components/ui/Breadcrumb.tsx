import Link from "@/components/ui/SiteLink";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { breadcrumbSchema } from "@/lib/schema";
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
                    className={cn("-my-3 inline-block min-w-11 py-3 text-center transition-colors", tone === "dark" ? "text-white/75 hover:text-white" : "text-muted hover:text-brand-600")}
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
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
