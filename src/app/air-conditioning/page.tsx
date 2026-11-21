import { Suspense } from "react";
import Link from "@/components/ui/SiteLink";
import { ArrowDown, ArrowRight, Gauge, Leaf, MapPin, Phone, ShieldCheck, Snowflake, Sun, Thermometer } from "lucide-react";
import { business, telHref } from "@/data/business";
import { FGAS_NOTE } from "@/data/services/compliance";
import { acCoverageText } from "@/data/postcodes";
import { staticPageSeo } from "@/data/seo";
import { pageMeta } from "@/lib/seo";
import { buildServices } from "@/lib/build-data";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { AcIllustration } from "@/components/booking/AcIllustration";
import { AcServicePicker } from "@/components/booking/ServicePickers";
import { BookingSection } from "@/components/booking/BookingSection";

export const metadata = pageMeta({ ...staticPageSeo.airConditioning, path: "/air-conditioning/" });

const benefits = [
  { Icon: Snowflake, title: "Cool in summer", text: "Fast, even cooling on the hottest days, without noisy portable units or open windows." },
  { Icon: Sun, title: "Warm in winter", text: "The same unit runs in reverse as a heat pump, warming the room quickly in cold weather." },
  {
    Icon: Gauge,
    title: "More efficient than central heating",
    text: "It moves heat instead of burning fuel, so it typically gives out around three to four units of heat for every unit of electricity it uses.",
  },
  { Icon: Leaf, title: "Cleaner, comfortable air", text: "Filters catch dust and pollen, and you control the temperature room by room." },
];

const faqs = [
  {
    question: "Can air conditioning really heat my home?",
    answer:
      "Yes. Modern split systems are reversible heat pumps: in heating mode they draw heat from the outside air, even on cold days, and release it indoors. One system gives you cooling in summer and heating in winter.",
  },
  {
    question: "Why is it more efficient than central heating?",
    answer:
      "A boiler or electric heater turns fuel or electricity directly into heat. A heat pump moves heat that already exists outside, so each unit of electricity typically delivers around three to four units of heat. How much you save depends on the system, the room and how you use it.",
  },
  {
    question: "Is the quotation really free?",
    answer: "Yes. We visit, look at the room and your options, and give you a written quote with no charge and no obligation.",
  },
  {
    question: "How often should air conditioning be serviced?",
    answer: "Typically once a year for home systems, and more often for commercial units in heavy use. Regular servicing keeps it efficient and catches problems early.",
  },
  {
    question: "Which areas do you cover for air conditioning?",
    answer: `${acCoverageText}. Enter your postcode in the booking form and it will tell you straight away.`,
  },
];

export default async function AirConditioningPage() {
  const services = await buildServices();

  return (
    <>
      {/* ── Top of page: visual + short description (cooling AND heating, more efficient than central heating) ── */}
      <section className="hero-wash relative overflow-hidden text-white">
        <Container className="relative py-8 sm:py-14 lg:py-16">
          <Breadcrumb items={[{ label: "Air Conditioning" }]} />
          <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-6">
              <Eyebrow tone="dark">Air conditioning · Cooling &amp; heating</Eyebrow>
              <h1 className="text-h1 text-white">
                Cool in summer. <span className="text-accent-500">Warm in winter.</span>
              </h1>
              <p className="text-lead mt-5 max-w-xl text-white/80">
                Air conditioning isn&rsquo;t just for heatwaves. A modern system cools your home or business in summer and heats it in winter — and because it
                moves heat rather than burning fuel, it&rsquo;s a more efficient way to heat than traditional central heating.
              </p>
              <p className="mt-4 max-w-xl text-white/70">
                One quiet wall unit, comfortable all year round. We give free quotations, supply and install, service and repair systems across London, Berkshire
                and Reading.
              </p>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:flex">
                <Button href="/air-conditioning/?service=free-quotation#book" size="lg" className="w-full sm:w-auto">
                  Get a Free Quote <ArrowDown className="size-5" aria-hidden />
                </Button>
                <Button href={telHref} variant="outline-light" size="lg" className="w-full sm:w-auto">
                  <Phone className="size-5" aria-hidden /> {business.phone.display}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <AcIllustration className="h-auto w-full drop-shadow-2xl" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Benefits ── */}
      <Section>
        <SectionHeader eyebrow="Why air conditioning" title="One system, all year round" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => (
            <li key={title} className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-base text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Choose a service → fills the booking reference ── */}
      <Section tone="mist" id="services">
        <SectionHeader
          eyebrow="Our air conditioning services"
          title="What do you need?"
          intro="Choose a service and we'll open the booking form with your booking reference already filled in."
        />
        <Suspense fallback={null}>
          <AcServicePicker />
        </Suspense>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
            <p className="text-base">
              <strong className="text-ink">Coverage:</strong> {acCoverageText}.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
            <p className="text-base text-muted">{FGAS_NOTE}</p>
          </div>
        </div>
        <p className="mt-6 text-base">
          <Link href="/services/air-conditioning-repair/" className="inline-flex min-h-11 items-center gap-1 font-semibold text-brand-600 underline underline-offset-2">
            <Thermometer className="size-4" aria-hidden /> Common air conditioning faults and what causes them <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </Section>

      <BookingSection
        services={services}
        categories={["ac"]}
        title="Book your air conditioning visit"
        intro="Your booking reference (e.g. AC - Free Quotation) is filled in from the service you chose. Pick a 2-hour slot and you're booked."
        coverage={`Air conditioning bookings: ${acCoverageText}.`}
        tone="white"
      />

      <Section tone="mist">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-h2">Air conditioning questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion faqs={faqs} schema />
          </div>
        </div>
      </Section>
    </>
  );
}
