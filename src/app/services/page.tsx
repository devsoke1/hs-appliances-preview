import { ArrowRight, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { commercialServices, domesticServices } from "@/data/services";
import { pageMeta } from "@/lib/seo";
import { staticPageSeo } from "@/data/seo";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { ProcessSteps, ServiceGrid } from "@/components/sections";

export const metadata = pageMeta({ ...staticPageSeo.services, path: "/services/" });

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services" }]}
        eyebrow="Our services"
        title="Appliance repair, installation & maintenance"
        intro="From the washing machine at home to the cold room your business depends on — choose an appliance below to see common faults, what's involved and answers to frequent questions."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/book/" size="lg">
            Book a Repair <ArrowRight className="size-5" aria-hidden />
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
      </PageHero>

      <Section id="domestic">
        <SectionHeader
          eyebrow="For your home"
          title="Domestic appliance repair"
          intro="Repairs for the appliances you use every day, plus installation of new washing machines, dishwashers and more."
        />
        <ServiceGrid services={domesticServices} />
      </Section>

      <Section tone="mist" id="commercial">
        <SectionHeader
          eyebrow="For your business"
          title="Commercial refrigeration repair"
          intro="Repair and maintenance for shops, restaurants, pubs, hotels and food businesses — where downtime means lost stock."
        />
        <ServiceGrid services={commercialServices} columns={3} />
      </Section>

      <Section>
        <SectionHeader eyebrow="How it works" title="Straightforward from first call to fixed" align="center" />
        <ProcessSteps />
      </Section>

      <CtaBand title="Not sure which service you need?" text="Call us and describe the problem — we'll point you in the right direction." />
    </>
  );
}
