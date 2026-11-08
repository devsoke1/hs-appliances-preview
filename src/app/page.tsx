import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { commercialServices, domesticServices } from "@/data/services";
import { brands } from "@/data/brands";
import { homepageFaqs } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PostcodeChecker } from "@/components/postcode/PostcodeChecker";
import { ServiceTabs } from "@/components/ServiceTabs";
import { CtaBand } from "@/components/CtaBand";
import { AreaLinks, BrandStrip, ProcessSteps, ReviewsPlaceholder, ServiceGrid, TrustList, WhyChooseUs } from "@/components/sections";

const description =
  "Domestic appliance repair and commercial refrigeration repair across West London, from our base in Feltham. Washing machines, fridges, cookers, dishwashers, cold rooms and more.";

export const metadata: Metadata = {
  title: { absolute: `Appliance Repair in West London & Surrounding Areas | ${business.shortName}` },
  description,
  alternates: { canonical: "/" },
  openGraph: { title: `${business.name} — Appliance Repair in West London`, description, url: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy-900 bg-blueprint text-white">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-brand-600/25 blur-3xl" />
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow tone="dark">Domestic &amp; commercial · Based in Feltham</Eyebrow>
            <h1 className="text-display text-white">
              Appliance Repair in <span className="text-accent-400">West London</span> &amp; Surrounding Areas
            </h1>
            <p className="text-lead mt-6 max-w-xl text-white/75">
              Repair, installation and maintenance for household appliances and commercial refrigeration — from washing
              machines and ovens to cold rooms and bar coolers.
            </p>
            <TrustList className="mt-8 max-w-lg" />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/book/" size="lg">
                Book a Repair <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button href={telHref} variant="outline-light" size="lg">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
          </div>
          <div className="space-y-5 lg:col-span-5">
            <PostcodeChecker />
            <Placeholder tone="dark" label="[ADD REAL PHOTO: engineer at work or branded van — no stock images]" className="aspect-[16/10]" />
          </div>
        </Container>
      </section>

      {/* ── How it works ── */}
      <Section>
        <SectionHeader eyebrow="How it works" title="Three simple steps to a working appliance" align="center" />
        <ProcessSteps />
      </Section>

      {/* ── Services ── */}
      <Section tone="mist" id="services">
        <SectionHeader
          eyebrow="Our services"
          title="What we repair"
          intro="Choose your appliance to see common faults, what's involved and answers to frequent questions."
          action={
            <Button href="/services/" variant="outline">
              All services <ArrowRight className="size-4" aria-hidden />
            </Button>
          }
        />
        <ServiceTabs domestic={<ServiceGrid services={domesticServices} />} commercial={<ServiceGrid services={commercialServices} columns={3} />} />
      </Section>

      {/* ── Why choose us ── */}
      <Section tone="navy" className="bg-blueprint">
        <SectionHeader tone="dark" eyebrow="Why choose us" title="A local repair company you can rely on" />
        <WhyChooseUs />
      </Section>

      {/* ── Brands ── */}
      <Section>
        <SectionHeader eyebrow="Brands" title="We work on most major brands" intro="Including, but not limited to, the makes below. Not listed? Call us with the make and model." />
        <BrandStrip brands={brands.filter((b) => b.category !== "commercial").slice(0, 12)} />
      </Section>

      {/* ── Areas ── */}
      <Section tone="mist">
        <SectionHeader
          eyebrow="Areas we cover"
          title="Across West London, Middlesex and Surrey"
          intro={`From our base at ${business.address.street}, ${business.address.locality}, we cover the areas below and the places in between.`}
          action={
            <Button href="/areas/" variant="outline">
              All areas <ArrowRight className="size-4" aria-hidden />
            </Button>
          }
        />
        <AreaLinks />
      </Section>

      {/* ── Reviews ── */}
      <Section>
        <SectionHeader eyebrow="Reviews" title="What our customers say" />
        <ReviewsPlaceholder />
      </Section>

      {/* ── FAQ ── */}
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-h2">Common questions</h2>
            <p className="text-lead mt-4 text-muted">Can&rsquo;t find your answer? Give us a call — we&rsquo;re happy to help.</p>
            <Button href="/faq/" variant="outline" className="mt-6">
              All FAQs <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion faqs={homepageFaqs} schema />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
