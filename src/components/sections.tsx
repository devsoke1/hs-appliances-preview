import Link from "next/link";
import { ArrowRight, Building2, Check, ClipboardCheck, Clock, MapPin, ShieldCheck, Star, Tag } from "lucide-react";
import type { Brand, Service } from "@/data/types";
import { areas, areaHref } from "@/data/areas";
import { processSteps, trustPoints, whyChooseUs } from "@/data/content";
import { featuredBrandSlugs } from "@/data/brands";
import { serviceHref } from "@/data/services";
import { cn } from "@/lib/cn";
import { Card, ServiceCard } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { ServiceIcon } from "@/components/ServiceIcon";

/* ── Trust bullets ── */
export function TrustList({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-2.5 sm:grid-cols-2", className)}>
      {trustPoints.map((t) => (
        <li key={t} className={cn("flex items-center gap-2.5 font-semibold", tone === "dark" ? "text-white/90" : "text-ink")}>
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
export function ProcessSteps() {
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

export function WhyChooseUs() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {whyChooseUs.map((w) => {
        const Icon = whyIcons[w.icon];
        return (
          <div key={w.title} className="flex gap-4 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-600 text-white">
              <Icon className="size-6" aria-hidden strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-h3 text-white">{w.title}</h3>
              <p className="mt-1.5 text-white/70">{w.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Brand strip (text wordmarks until licensed logo files are added) ── */
export function BrandStrip({ brands, className }: { brands: Brand[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {brands.map((b) => (
        <li
          key={b.slug}
          className={cn(
            "grid h-16 place-items-center rounded-xl border bg-white px-3 text-center font-display text-lg font-extrabold tracking-tight",
            featuredBrandSlugs.includes(b.slug) ? "border-navy-900/15 text-navy-900" : "border-line text-muted",
          )}
        >
          {b.name}
        </li>
      ))}
    </ul>
  );
}

/* ── Service grid ── */
export function ServiceGrid({ services, columns = 4 }: { services: Service[]; columns?: 3 | 4 }) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", columns === 4 && "xl:grid-cols-4")}>
      {services.map((s) => (
        <ServiceCard key={s.slug} href={serviceHref(s.slug)} title={s.title} description={s.shortDescription} icon={<ServiceIcon slug={s.slug} className="size-6" />} />
      ))}
    </div>
  );
}

/* ── Area links ── */
export function AreaLinks({ exclude, compact = false }: { exclude?: string; compact?: boolean }) {
  const list = areas.filter((a) => a.slug !== exclude);
  if (compact) {
    return (
      <ul className="flex flex-wrap gap-2">
        {list.map((a) => (
          <li key={a.slug}>
            <Link href={areaHref(a.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[0.9375rem] font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600">
              <MapPin className="size-3.5 text-brand-600" aria-hidden /> {a.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((a) => (
        <li key={a.slug}>
          <Link
            href={areaHref(a.slug)}
            className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-brand-200 hover:shadow-[var(--shadow-card)]"
          >
            <span className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">{a.name}</span>
              <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
            <span className="mt-1 text-sm font-semibold text-brand-600">{a.postcodes.join(", ")}</span>
            <span className="mt-2 text-[0.9375rem] text-muted">{a.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── Reviews (placeholders only — never fabricate) ── */
export function ReviewsPlaceholder({ count = 3, context }: { count?: number; context?: string }) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex text-line" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-700">
            [ADD GOOGLE RATING BADGE — real rating + review count, linked to GBP]
          </span>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: count }).map((_, n) => (
          <Placeholder key={n} label={`[ADD REAL GOOGLE REVIEW #${n + 1}${context ? ` — ${context}` : ""}: name, date, text]`} className="min-h-44" />
        ))}
      </div>
    </div>
  );
}
