import type { Metadata } from "next";
import { Suspense } from "react";
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
import { CategoryCards } from "@/components/CategoryCards";
import { BrandStrip, AreaList, ProcessSteps, TrustList, WhyChooseUs } from "@/components/sections";
import { ServicesShowcase } from "@/components/live/ServicesShowcase";
import { ReviewsSection } from "@/components/live/ReviewsSection";
import { LatestInsights } from "@/components/live/LatestInsights";

export const metadata: Metadata = pageMeta({ ...staticPageSeo.home, path: "/" });

export default async function HomePage() {
  const [services, reviews, posts] = await Promise.all([buildServices(), buildReviews(), buildPosts(3)]);

  return (
    <>
      {/* ── Hero: H1, CTAs and trust points fit above the fold on phones ── */}
      <section className="hero-photo relative overflow-hidden text-white">
        {siteImages.hero && (
          <div className="hero-photo-media" aria-hidden>
            <ResponsiveImage name={siteImages.hero.name} alt="" sizes="100vw" priority />
          </div>
        )}
        <div className="hero-photo-shade" aria-hidden />
        <Container className="relative z-[1] grid gap-8 py-8 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow tone="dark">7 years&rsquo; experience · Based in Feltham</Eyebrow>
            <h1 className="text-display text-white">
              Appliance Repair in <span className="text-accent-500">West London</span> &amp; Surrounding Areas
            </h1>
            <p className="text-lead mt-4 max-w-xl text-white/80 sm:mt-6">
              Air conditioning, household appliances and commercial refrigeration — repaired, installed and maintained across Feltham and West London. Seven years on the tools, and open 7 days, 8am to 6pm.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Button href="/book/" size="lg" className="w-full sm:w-auto">
                Book Now <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button href="/air-conditioning/" variant="outline-light" size="lg" className="w-full sm:w-auto">
                Air conditioning
              </Button>
              <Button href={telHref} variant="outline-light" size="lg" className="w-full sm:w-auto">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
            <TrustList className="mt-6 max-w-lg sm:mt-8" />
          </div>
          <div className="lg:col-span-5">
            <PostcodeChecker tone="light" />
          </div>
        </Container>
      </section>

      {/* ── Domestic / Commercial / Air Conditioning ── */}
      <Section tone="mist">
        <SectionHeader eyebrow="How can we help?" title="Domestic, commercial and air conditioning" />
        <CategoryCards />
      </Section>

      <Section>
        <div className="grid items-center gap-8 overflow-hidden rounded-[var(--radius-card)] bg-navy-900 text-white lg:grid-cols-12">
          <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <Eyebrow tone="dark">Air conditioning</Eyebrow>
            <h2 className="text-h2 mt-3 text-white">Cool in summer. Warm in winter.</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Installation, servicing and repair for homes, shops and offices. One system for cooling and heating, with a free quotation before any work is agreed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/air-conditioning/#book">Book air conditioning</Button>
              <Button href="/air-conditioning/" variant="outline-light">
                Air conditioning services
              </Button>
            </div>
          </div>
          <div className="aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-full">
            <ResponsiveImage name="air-conditioning-repair" alt="Outdoor air conditioning unit" sizes="(min-width: 1024px) 40vw, 100vw" className="h-full" />
          </div>
        </div>
      </Section>

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
        <Suspense fallback={null}>
          <ServicesShowcase initial={services} />
        </Suspense>
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
          intro="Every town we cover from the workshop on Hounslow Road. Choose yours for neighbourhoods, postcodes and travel time."
        />
        <AreaList />
      </Section>

      {/* ── Reviews (live, real reviews only) ── */}
      <Suspense fallback={null}>
        <ReviewsSection initial={reviews} fiveStarOnly shuffle />
      </Suspense>

      {/* ── Insights ── */}
      <Suspense fallback={null}>
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
      </Suspense>

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
