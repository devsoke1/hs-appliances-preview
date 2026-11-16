import type { Metadata } from "next";
import { staticPageSeo } from "@/data/seo";
import { pageMeta } from "@/lib/seo";
import { buildServices } from "@/lib/build-data";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ServiceCardGrid } from "@/components/ServiceCard";
import { ProcessSteps } from "@/components/sections";
import { CtaBand } from "@/components/CtaBand";
import { telHref } from "@/data/business";
import { Phone } from "lucide-react";

export const metadata: Metadata = pageMeta({ ...staticPageSeo.services, path: "/services/" });

const groups = [
  {
    category: "domestic" as const,
    eyebrow: "For your home",
    title: "Domestic appliance repair",
    intro: "Repairs for the appliances you use every day, plus installation of new washing machines, dishwashers and more.",
    tone: "white" as const,
  },
  {
    category: "commercial" as const,
    eyebrow: "For your business",
    title: "Commercial refrigeration repair",
    intro: "Repair and maintenance for shops, restaurants, pubs, hotels and food businesses — where downtime means lost stock.",
    tone: "mist" as const,
  },
];

export default async function ServicesPage() {
  const { services } = await buildServices();

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
            Book a repair
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> Call us
          </Button>
        </div>
      </PageHero>

      {groups.map((group) => {
        const list = services.filter((s) => s.category === group.category);
        if (!list.length) return null;
        return (
          <Section key={group.category} id={group.category} tone={group.tone}>
            <SectionHeader eyebrow={group.eyebrow} title={group.title} intro={group.intro} />
            <ServiceCardGrid services={list} />
          </Section>
        );
      })}

      <Section>
        <SectionHeader eyebrow="How it works" title="Straightforward from first call to fixed" align="center" />
        <ProcessSteps />
      </Section>

      <CtaBand title="Not sure which service you need?" text="Call us and describe the problem — we'll point you in the right direction." />
    </>
  );
}
