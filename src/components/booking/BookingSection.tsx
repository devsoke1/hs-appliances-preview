import { Suspense } from "react";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import type { BookingCategory } from "@/lib/booking";
import type { ServicesPayload } from "@/lib/live-types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookingForm } from "@/components/forms/BookingForm";
import { RefFromUrl } from "./RefFromUrl";

const steps = [
  "Choose the service, tell us about the problem and pick a 2-hour slot.",
  "You get an on-screen confirmation and a confirmation email straight away.",
  "Our engineer arrives in your slot, diagnoses the fault and quotes before any work.",
];

/** Booking form block (anchor #book) — used on /book/ and on the Domestic, Commercial and Air Conditioning pages. */
export function BookingSection({
  services,
  categories,
  title = "Book your appointment",
  intro = "Pick a service and a time that suits you — the booking is confirmed instantly.",
  coverage,
  tone = "mist",
}: {
  services: ServicesPayload;
  categories?: BookingCategory[];
  title?: string;
  intro?: string;
  /** Short coverage line for the side panel, e.g. "Domestic bookings: TW, SL, HA, UB, KT and parts of SW & W." */
  coverage?: string;
  tone?: "mist" | "white";
}) {
  return (
    <section id="book" aria-labelledby="book-heading" className={tone === "mist" ? "scroll-mt-20 bg-mist py-12 sm:py-20" : "scroll-mt-20 py-12 sm:py-20"}>
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-8">
          <Eyebrow>Online booking</Eyebrow>
          <h2 id="book-heading" tabIndex={-1} className="text-h2 outline-none">
            {title}
          </h2>
          <p className="text-lead mt-3 text-muted">{intro}</p>
          <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
            <Suspense fallback={null}>
              <BookingForm services={services} categories={categories} />
            </Suspense>
            <Suspense fallback={null}>
              <RefFromUrl />
            </Suspense>
          </div>
        </div>
        <aside className="min-w-0 space-y-5 lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <p className="font-display text-xl font-extrabold">How it works</p>
              <ol className="mt-4 space-y-3">
                {steps.map((s) => (
                  <li key={s} className="flex gap-3 text-white/80">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-500" aria-hidden />
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            {coverage && (
              <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <MapPin className="size-5 text-brand-600" aria-hidden /> Where we cover
                </p>
                <p className="mt-2 text-base text-muted">{coverage}</p>
              </div>
            )}
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="font-display text-lg font-bold text-ink">Prefer to talk?</p>
              <p className="mt-1 text-muted">Call us and we&rsquo;ll book you in over the phone.</p>
              <Button href={telHref} className="mt-4 w-full">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}
