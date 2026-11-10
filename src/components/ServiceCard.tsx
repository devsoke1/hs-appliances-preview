import Link from "@/components/ui/SiteLink";
import { ArrowRight } from "lucide-react";
import type { ServiceSummary } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { SmartImage } from "@/components/ui/SmartImage";
import { ServiceIcon } from "@/components/ServiceIcon";

/**
 * Service card — 2 cols mobile (compact), 3 tablet, 4 desktop. Equal heights (h-full + flex),
 * fixed 4:3 image ratio, hover lift on hover-capable devices only (Tailwind v4 `hover:`).
 * Mirrored in PHP: public/includes/components.php → service_card().
 */
export function ServiceCard({ s, headingLevel = 3 }: { s: ServiceSummary; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      href={s.url}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {s.image ? (
          <SmartImage src={s.image} alt={s.image_alt ?? ""} className="transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full place-items-center bg-brand-50 text-brand-600">
            <ServiceIcon icon={s.icon} slug={s.slug} className="size-10" />
          </div>
        )}
        <span className="absolute bottom-2 left-2 grid size-9 place-items-center rounded-lg bg-white/95 text-brand-600 shadow-sm sm:bottom-3 sm:left-3 sm:size-10">
          <ServiceIcon icon={s.icon} slug={s.slug} className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <H className="font-display text-base leading-snug font-bold text-ink sm:text-lg">{s.menu_label || s.name}</H>
        <p className="mt-1 line-clamp-1 text-base text-muted sm:line-clamp-2">{s.short_description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 font-display text-sm font-bold text-brand-600">
          <span className="hidden sm:inline">View service</span>
          <span className="sm:hidden">View</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ServiceCardGrid({ services, className }: { services: ServiceSummary[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4", className)}>
      {services.map((s) => (
        <li key={s.slug}>
          <ServiceCard s={s} />
        </li>
      ))}
    </ul>
  );
}
