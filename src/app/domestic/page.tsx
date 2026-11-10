import { ArrowDown, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { brandDisclaimer, brands } from "@/data/brands";
import { districtSummary } from "@/data/postcodes";
import { staticPageSeo } from "@/data/seo";
import { pageMeta } from "@/lib/seo";
import { buildServices } from "@/lib/build-data";
import { Suspense } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { BrandStrip, TrustList } from "@/components/sections";
import { AppliancePicker } from "@/components/booking/ServicePickers";
import { BookingSection } from "@/components/booking/BookingSection";

export const metadata = pageMeta({ ...staticPageSeo.domestic, path: "/domestic/" });

export default async function DomesticPage() {
  const services = await buildServices();
  const domesticBrands = brands.filter((b) => b.category !== "commercial");

  return (
    <>
      <PageHero
        crumbs={[{ label: "Domestic" }]}
        eyebrow="Domestic appliances"
        title="Domestic Appliance Repairs"
        intro="Washing machines, fridge freezers, ovens, hobs, dishwashers and more — repaired in your home. Choose your appliance below and book a 2-hour slot online in a couple of minutes."
        aside={
          <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/15 max-lg:hidden">
            <ResponsiveImage name="washing-machine-repair-feltham" alt="Engineer's view of a washing machine ready for repair" sizes="(min-width: 1024px) 40vw, 100vw" priority priorityMedia="(min-width: 1024px)" className="h-full" />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:flex">
          <Button href="#book" size="lg" className="w-full sm:w-auto">
            Book Now <ArrowDown className="size-5" aria-hidden />
          </Button>
          <Button href={telHref} variant="outline-light" size="lg" className="w-full sm:w-auto">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
        <TrustList className="mt-6 max-w-lg" />
      </PageHero>

      <Section>
        <SectionHeader
          eyebrow="Appliances we cover"
          title="Choose your appliance"
          intro="Tap Book and we'll fill in your booking reference for you — or open Details for common faults and answers to frequent questions."
        />
        <Suspense fallback={null}><AppliancePicker initial={services} category="domestic" /></Suspense>
      </Section>

      <Section tone="mist">
        <SectionHeader eyebrow="Brands" title="Brands we work on" intro="We repair most makes, including the brands below. Not listed? Call us with the make and model." />
        <BrandStrip brands={domesticBrands} />
        <p className="mt-6 max-w-3xl text-base text-muted">{brandDisclaimer}</p>
      </Section>

      <BookingSection
        services={services}
        categories={["domestic"]}
        title="Book a domestic repair"
        intro="Your booking reference is filled in when you choose an appliance above. Pick a 2-hour slot and you're booked."
        coverage={`Domestic bookings are available for postcodes ${districtSummary()}. Somewhere else? Call us on ${business.phone.display}.`}
        tone="white"
      />
    </>
  );
}
