import { ArrowDown, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { brands } from "@/data/brands";
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

export const metadata = pageMeta({ ...staticPageSeo.commercial, path: "/commercial/" });

export default async function CommercialPage() {
  const services = await buildServices();
  const commercialBrands = brands.filter((b) => b.category !== "domestic");

  return (
    <>
      <PageHero
        crumbs={[{ label: "Commercial" }]}
        eyebrow="Commercial refrigeration"
        title="Commercial Refrigeration Repairs"
        intro="Cold rooms, display fridges, dairy cabinets, bar and cellar coolers and ice machines — repaired and maintained for shops, pubs, restaurants and food businesses. Choose your equipment and book online."
        aside={
          <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/15 max-lg:hidden">
            <ResponsiveImage name="commercial-display-freezer" alt="Commercial display freezer in a shop" sizes="(min-width: 1024px) 40vw, 100vw" priority priorityMedia="(min-width: 1024px)" className="h-full" />
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
          eyebrow="Equipment we cover"
          title="Choose your equipment"
          intro="Tap Book and we'll fill in your booking reference — or open Details for common faults and what to do while you wait."
        />
        <Suspense fallback={null}><AppliancePicker initial={services} category="commercial" /></Suspense>
      </Section>

      {commercialBrands.length > 0 && (
        <Section tone="mist">
          <SectionHeader eyebrow="Brands" title="Makes we work on" intro="Including the makes below. Not listed? Call us with the make and model from the rating plate." />
          <BrandStrip brands={commercialBrands} />
        </Section>
      )}

      <BookingSection
        services={services}
        categories={["commercial"]}
        title="Book a commercial repair"
        intro="Choose your equipment above (or in the list below), describe the problem and pick a 2-hour slot."
        coverage={`We cover businesses across London and the surrounding areas from our base in ${business.address.locality}. For an urgent breakdown, calling is fastest.`}
        tone="white"
      />
    </>
  );
}
