import { CalendarCheck, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { business, fullAddress, groupedHours, mailHref, telHref } from "@/data/business";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = pageMeta({
  title: "Contact Us",
  description: `Contact ${business.name}, ${fullAddress}. Call ${business.phone.display}, email us or send a message about your appliance repair.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact us"
        title="Get in touch"
        intro="Call us for the quickest response, or send a message and we'll get back to you. To book a repair directly, use our booking form."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={telHref} size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
          <Button href="/book/" variant="outline-light" size="lg">
            <CalendarCheck className="size-5" aria-hidden /> Book a Repair
          </Button>
        </div>
      </PageHero>

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <h2 className="text-h2">Send us a message</h2>
          <p className="mt-3 mb-8 text-muted">Tell us the appliance, make and model, and what&rsquo;s happening. Fields marked * are required.</p>
          <ContactForm />
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-xl font-extrabold text-ink">{business.name}</h2>
            <address className="mt-4 space-y-4 not-italic">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
                <span>
                  {business.address.street}
                  <br />
                  {business.address.locality}
                  <br />
                  {business.address.postcode}
                </span>
              </p>
              <a href={telHref} className="flex items-center gap-3 font-display text-lg font-bold text-navy-900 hover:text-brand-600">
                <Phone className="size-5 shrink-0 text-brand-600" aria-hidden /> {business.phone.display}
              </a>
              <a href={mailHref} className="flex items-center gap-3 break-all font-semibold text-navy-900 hover:text-brand-600">
                <Mail className="size-5 shrink-0 text-brand-600" aria-hidden /> {business.email}
              </a>
            </address>
            <div className="mt-6 border-t border-line pt-5">
              <p className="flex items-center gap-2 font-display font-bold text-ink">
                <Clock className="size-4 text-brand-600" aria-hidden /> Opening hours
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {groupedHours().map((h) => (
                  <div key={h.label} className="contents">
                    <dt className="text-muted">{h.label}</dt>
                    <dd className="font-semibold text-ink">{h.value}</dd>
                  </div>
                ))}
              </dl>
              {!business.hoursConfirmed && <p className="mt-2 font-mono text-xs uppercase text-accent-700">[CONFIRM HOURS]</p>}
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
            <iframe
              title={`Map showing ${business.name}, ${fullAddress}`}
              src={business.mapEmbedUrl}
              className="block aspect-[4/3] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={business.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-mist py-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Open in Google Maps <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        </aside>
      </Container>
    </>
  );
}
