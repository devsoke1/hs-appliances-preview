import { CheckCircle2, Clock, Phone } from "lucide-react";
import { business, groupedHours, telHref } from "@/data/business";
import { commercialServices, domesticServices } from "@/data/services";
import { brands } from "@/data/brands";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata = pageMeta({
  title: "Book a Repair",
  description: `Book an appliance repair with ${business.name}. Choose your appliance, describe the fault and pick a morning or afternoon slot — we'll confirm by phone.`,
  path: "/book/",
});

const nextSteps = [
  "We review your request and check engineer availability.",
  "We call or email to confirm the date, time slot and call-out charge.",
  "An engineer visits, diagnoses the fault and quotes before any repair.",
];

export default function BookPage() {
  const toOption = (s: { slug: string; title: string }) => ({ value: s.slug, label: s.title });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Book a Repair" }]}
        eyebrow="Booking"
        title="Book a repair"
        intro="Fill in the form below and we'll confirm your appointment. Prefer to talk? Call us instead."
      />

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8 lg:col-span-8">
          <BookingForm
            domestic={domesticServices.map(toOption)}
            commercial={commercialServices.map(toOption)}
            brands={brands.map((b) => b.name)}
          />
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <p className="font-display text-xl font-extrabold">What happens next?</p>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((s) => (
                  <li key={s} className="flex gap-3 text-white/80">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-400" aria-hidden />
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="font-display text-lg font-bold text-ink">Urgent? Call us</p>
              <p className="mt-1 text-muted">For the earliest available slot, phone is quickest.</p>
              <Button href={telHref} className="mt-4 w-full">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
              <div className="mt-5 border-t border-line pt-4">
                <p className="flex items-center gap-2 font-display font-bold text-ink">
                  <Clock className="size-4 text-brand-600" aria-hidden /> Opening hours
                </p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9375rem]">
                  {groupedHours().map((h) => (
                    <div key={h.label} className="contents">
                      <dt className="text-muted">{h.label}</dt>
                      <dd className="font-semibold text-ink">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
