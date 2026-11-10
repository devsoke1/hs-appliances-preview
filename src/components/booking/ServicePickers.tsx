"use client";

import Link from "@/components/ui/SiteLink";
import { AirVent, ArrowRight, CalendarCheck, ClipboardCheck, Settings, Wrench, type LucideIcon } from "lucide-react";
import { AC_OPTIONS, isAcService, OTHER_REFS, selectBookingRef, serviceRef } from "@/lib/booking";
import { useLiveServices } from "@/lib/live";
import type { ServicesPayload, ServiceSummary } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { SmartImage } from "@/components/ui/SmartImage";
import { ServiceIcon } from "@/components/ServiceIcon";

/** Fills the booking reference and scrolls to the booking form (#book) on the same page. */
export function bookNow(ref: string) {
  selectBookingRef(ref);
  const target = document.getElementById("book");
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => (document.getElementById("book-heading") as HTMLElement | null)?.focus({ preventScroll: true }), reduce ? 0 : 450);
}

const bookBtn =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-3 font-display text-sm font-bold text-white transition-colors hover:bg-accent-700 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 sm:text-[0.9375rem]";

function ApplianceCard({ s }: { s: ServiceSummary }) {
  const label = s.menu_label || s.name;
  const ref = serviceRef(s);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {s.image ? (
          <SmartImage src={s.image} alt={s.image_alt ?? ""} />
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
        <h3 className="font-display text-base leading-snug font-bold text-ink sm:text-lg">{label}</h3>
        <p className="mt-1 line-clamp-2 text-base text-muted">{s.short_description}</p>
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
          <button type="button" onClick={() => bookNow(ref)} className={bookBtn} aria-label={`Book: ${ref}`}>
            <CalendarCheck className="size-4" aria-hidden /> Book
          </button>
          <Link
            href={s.url}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-line px-3 font-display text-sm font-bold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600 sm:text-[0.9375rem]"
          >
            Details<span className="sr-only">: {label} faults and FAQs</span> <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Every appliance in a category (live from the admin), each with a "Book" button that fills the booking reference. */
export function AppliancePicker({ initial, category }: { initial: ServicesPayload; category: "domestic" | "commercial" }) {
  const { services } = useLiveServices(initial);
  const list = services.filter((s) => s.category === category && !isAcService(s.slug));
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {list.map((s) => (
          <li key={s.slug}>
            <ApplianceCard s={s} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-base text-muted">
        Something else?{" "}
        <button type="button" onClick={() => bookNow(OTHER_REFS[category])} className="font-semibold text-brand-600 underline underline-offset-2">
          Book &ldquo;{OTHER_REFS[category]}&rdquo;
        </button>{" "}
        and describe it in the note.
      </p>
    </>
  );
}

const AC_ICONS: Record<string, LucideIcon> = { ClipboardCheck, AirVent, Settings, Wrench };

/** The four air conditioning services — choosing one fills the booking reference (e.g. "AC - Servicing"). */
export function AcServicePicker() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {AC_OPTIONS.map((o, i) => {
        const Icon = AC_ICONS[o.icon] ?? Wrench;
        return (
          <li key={o.key} id={o.key} className="scroll-mt-28">
            <button
              type="button"
              onClick={() => bookNow(o.ref)}
              className={cn(
                "group flex h-full w-full flex-col rounded-[var(--radius-card)] border bg-white p-5 text-left shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-[var(--shadow-lift)] focus-visible:ring-2 focus-visible:ring-brand-500 sm:p-6",
                i === 0 ? "border-accent-500" : "border-line",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className={cn("grid size-12 place-items-center rounded-xl", i === 0 ? "bg-accent-50 text-accent-700" : "bg-brand-50 text-brand-600")}>
                  <Icon className="size-6" aria-hidden />
                </span>
                {i === 0 && <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold tracking-wide text-accent-700 uppercase">Free</span>}
              </span>
              <span className="mt-4 font-display text-xl font-extrabold text-ink">{o.title}</span>
              <span className="mt-2 flex-1 text-base text-muted">{o.description}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 font-display font-bold text-accent-700">
                Book {o.title.toLowerCase()} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
