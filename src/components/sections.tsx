import Link from "@/components/ui/SiteLink";
import { ArrowRight, Building2, Check, ClipboardCheck, Clock, MapPin, ShieldCheck, Tag } from "lucide-react";
import type { Brand } from "@/data/types";
import { areas, areaHref } from "@/data/areas";
import { processSteps, trustPoints, whyChooseUs } from "@/data/content";
import { featuredBrandSlugs } from "@/data/brands";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

/* Every block here is mirrored in PHP (public/includes/components.php) with identical classes. */

/** Horizontal scroller on mobile, normal layout from `sm` up. */
export const mobileScroller = "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden";

/* ── Trust bullets ── */
export function TrustList({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.9375rem] sm:gap-x-6 sm:text-base", className)}>
      {trustPoints.map((t) => (
        <li key={t} className={cn("flex items-center gap-2 font-semibold sm:gap-2.5", tone === "dark" ? "text-white/90" : "text-ink")}>
          <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", tone === "dark" ? "bg-accent-600 text-white" : "bg-accent-50 text-accent-600")}>
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ── How it works ── */
export function ProcessSteps({ layout = "row" }: { layout?: "row" | "stack" }) {
  if (layout === "stack") {
    return (
      <ol className="space-y-4">
        {processSteps.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:gap-5 sm:p-6">
            <span className="font-display text-4xl leading-none font-extrabold text-accent-600 sm:text-5xl">0{i + 1}</span>
            <div>
              <h3 className="text-h3">{s.title}</h3>
              <p className="mt-1.5 text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {processSteps.map((s, i) => (
        <li key={s.title} className="relative">
          <Card className="h-full">
            <span className="font-display text-5xl font-extrabold text-accent-600">0{i + 1}</span>
            <h3 className="text-h3 mt-3">{s.title}</h3>
            <p className="mt-2 text-muted">{s.body}</p>
          </Card>
          {i < processSteps.length - 1 && (
            <ArrowRight aria-hidden className="absolute top-1/2 -right-4 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-white p-1 text-accent-500 shadow md:block" />
          )}
        </li>
      ))}
    </ol>
  );
}

/* ── Why choose us ── */
const whyIcons = { clock: Clock, tag: Tag, shield: ShieldCheck, building: Building2, clipboard: ClipboardCheck, pin: MapPin } as const;

export function WhyChooseUs({ columns = 3 }: { columns?: 2 | 3 }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 sm:gap-5", columns === 3 && "lg:grid-cols-3")}>
      {whyChooseUs.map((w) => {
        const Icon = whyIcons[w.icon];
        return (
          <div key={w.title} className="flex gap-4 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-600 text-white">
              <Icon className="size-6" aria-hidden strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-h3 text-white">{w.title}</h3>
              <p className="mt-1.5 text-white/75">{w.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Brand strip: swipeable row on mobile, grid from sm ── */
export function BrandStrip({ brands, className }: { brands: Brand[]; className?: string }) {
  return (
    <ul className={cn(mobileScroller, "sm:grid sm:grid-cols-3 lg:grid-cols-6", className)}>
      {brands.map((b) => (
        <li
          key={b.slug}
          className={cn(
            "grid h-16 w-36 shrink-0 snap-start place-items-center rounded-xl border bg-white px-3 text-center font-display text-lg font-extrabold tracking-tight sm:w-auto",
            featuredBrandSlugs.includes(b.slug) ? "border-navy-900/15 text-navy-900" : "border-line text-muted",
          )}
        >
          {b.name}
        </li>
      ))}
    </ul>
  );
}

/* ── Area links ── */
export function AreaLinks({ exclude, compact = false }: { exclude?: string; compact?: boolean }) {
  const list = areas.filter((a) => a.slug !== exclude);
  if (compact) {
    return (
      <ul className={cn(mobileScroller, "sm:flex-wrap sm:gap-2")}>
        {list.map((a) => (
          <li key={a.slug} className="shrink-0 snap-start">
            <Link
              href={areaHref(a.slug)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[0.9375rem] font-semibold whitespace-nowrap text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
            >
              <MapPin className="size-3.5 text-brand-600" aria-hidden /> {a.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={cn(mobileScroller, "sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4")}>
      {list.map((a) => (
        <li key={a.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
          <Link
            href={areaHref(a.slug)}
            className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-brand-200 hover:shadow-[var(--shadow-card)]"
          >
            <span className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">{a.name}</span>
              <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
            <span className="mt-1 text-sm font-semibold text-brand-600">{a.postcodes.join(", ")}</span>
            <span className="mt-2 text-base text-muted">{a.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
