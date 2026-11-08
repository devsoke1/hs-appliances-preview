import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { brands } from "@/data/brands";
import { homepageFaqs } from "@/data/content";
import { siteImages } from "@/data/media";
import { staticPageSeo } from "@/data/seo";
import { pageMeta } from "@/lib/seo";
import { buildPosts, buildReviews, buildServices } from "@/lib/build-data";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { PostcodeChecker } from "@/components/postcode/PostcodeChecker";
import { CtaBand } from "@/components/CtaBand";
import { AreaLinks, BrandStrip, ProcessSteps, TrustList, WhyChooseUs } from "@/components/sections";
import { ServicesShowcase } from "@/components/live/ServicesShowcase";
import { ReviewsSection } from "@/components/live/ReviewsSection";
import { LatestInsights } from "@/components/live/LatestInsights";

export const metadata: Metadata = pageMeta({ ...staticPageSeo.home, path: "/" });

export default async function HomePage() {
  const [services, reviews, posts] = await Promise.all([buildServices(), buildReviews(), buildPosts(3)]);
  const hero = business.heroImage;

  return (
    <>
      {/* ── Hero: H1, CTAs and trust points fit above the fold on phones ── */}
      <section className="relative overflow-hidden bg-navy-900 bg-blueprint text-white">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-brand-600/25 blur-3xl" />
        <Container className="relative grid gap-8 py-8 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow tone="dark">Domestic &amp; commercial · Based in Feltham</Eyebrow>
            <h1 className="text-display text-white">
              Appliance Repair in <span className="text-accent-400">West London</span> &amp; Surrounding Areas
            </h1>
            <p className="text-lead mt-4 max-w-xl text-white/80 sm:mt-6">
              Repair, installation and maintenance for household appliances and commercial refrigeration — from washing machines and
              ovens to cold rooms and bar coolers.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:flex">
              <Button href="/book/" size="lg" className="w-full sm:w-auto">
                Book a Repair <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button href={telHref} variant="outline-light" size="lg" className="w-full sm:w-auto">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
            <TrustList className="mt-6 max-w-lg sm:mt-8" />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5">
            {/* Phones: postcode checker first, photo just below the fold (so the H1 is the LCP). Desktop: photo first. */}
            {hero && (
              <div className="order-2 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/15 lg:order-1">
                <ResponsiveImage name={hero.name} alt={hero.alt} sizes="(min-width: 1024px) 40vw, 100vw" priority priorityMedia="(min-width: 1024px)" className="h-full" />
              </div>
            )}
            <div className="order-1 lg:order-2">
              <PostcodeChecker />
            </div>
          </div>
        </Container>
      </section>

      {/* ── How it works ── */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="How it works" title="Three simple steps to a working appliance" />
            <ProcessSteps layout="stack" />
          </div>
          {siteImages.howItWorks && (
            <div className="order-first aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] lg:order-last lg:col-span-5 lg:aspect-[4/5]">
              <ResponsiveImage name={siteImages.howItWorks.name} alt={siteImages.howItWorks.alt} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full" />
            </div>
          )}
        </div>
      </Section>

      {/* ── Services ── */}
      <Section tone="mist" id="services">
        <SectionHeader eyebrow="Our services" title="What we repair" intro="Choose your appliance to see common faults, what's involved and answers to frequent questions." />
        <ServicesShowcase initial={services} />
      </Section>

      {/* ── Why choose us ── */}
      <Section tone="navy" className="bg-blueprint">
        <SectionHeader tone="dark" eyebrow="Why choose us" title="A local repair company you can rely on" />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {siteImages.whyUs && (
            <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/10 lg:col-span-4 lg:aspect-auto">
              <ResponsiveImage name={siteImages.whyUs.name} alt={siteImages.whyUs.alt} sizes="(min-width: 1024px) 33vw, 100vw" className="h-full" />
            </div>
          )}
          <div className="lg:col-span-8">
            <WhyChooseUs columns={2} />
          </div>
        </div>
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

      {/* ── Reviews (live, real reviews only) ── */}
      <ReviewsSection initial={reviews} />

      {/* ── Insights ── */}
      <LatestInsights
        initial={posts}
        tone="mist"
        title="Guides from our engineers"
        action={
          <Button href="/insights/" variant="outline">
            All insights <ArrowRight className="size-4" aria-hidden />
          </Button>
        }
      />

      {/* ── FAQ ── */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
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
