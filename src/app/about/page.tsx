import { ArrowRight, Building2, ClipboardCheck, Home, MapPin } from "lucide-react";
import { business, fullAddress } from "@/data/business";
import { pageMeta } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/CtaBand";
import { AreaLinks, WhyChooseUs } from "@/components/sections";

export const metadata = pageMeta({
  title: "About Us",
  description: `About ${business.name} — a Feltham-based appliance repair company serving homes and businesses across West London from ${fullAddress}.`,
  path: "/about/",
});

const pillars = [
  {
    icon: Home,
    title: "Domestic repairs",
    body: "Washing machines, fridge freezers, American fridges, dishwashers, electric and gas cookers and hobs, microwaves and air conditioning.",
  },
  {
    icon: Building2,
    title: "Commercial refrigeration",
    body: "Cold rooms, dairy cabinets, display fridges, bar coolers, cellar coolers and ice machines for shops, pubs, restaurants and hotels.",
  },
  {
    icon: ClipboardCheck,
    title: "Installation & maintenance",
    body: "Installation of new appliances, plus routine servicing and maintenance to help prevent breakdowns.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About us"
        title={`About ${business.name}`}
        intro="A local appliance repair company based in Feltham, looking after homes and businesses across West London."
      />

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:items-start lg:py-20">
        <div className="space-y-5 lg:col-span-7">
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="text-h2">Local, practical and straight-talking</h2>
          <p className="text-lead text-ink">
            {business.name} — {business.shortName} for short — repairs, installs and maintains domestic appliances and commercial
            refrigeration from our base at {fullAddress}.
          </p>
          <p>
            We work with households that need the washing machine, fridge or oven back up and running, and with businesses — shops,
            pubs, restaurants, takeaways and hotels — where a failed cold room or display fridge means lost stock and lost trade.
          </p>
          <p>
            Our approach is simple: find out what&rsquo;s actually wrong, explain it in plain English, and give you a clear price before any
            work starts. If an appliance isn&rsquo;t worth repairing, we&rsquo;ll tell you.
          </p>
          <Placeholder label="[ADD: your story — when the business started, who runs it, background/experience of the engineers. Real details only.]" className="min-h-36" />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <Placeholder label="[ADD REAL PHOTO: owner / team / van outside 209 Hounslow Road]" className="aspect-[4/3]" />
          <div className="rounded-[var(--radius-card)] border border-line bg-mist p-5">
            <p className="flex items-start gap-2 font-semibold text-ink">
              <MapPin className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden />
              {business.name}, {fullAddress}
            </p>
          </div>
        </div>
      </Container>

      <Section tone="mist">
        <SectionHeader eyebrow="What we do" title="One company for home and business" />
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-navy-900 text-white">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="text-h3 mt-5">{title}</h3>
              <p className="mt-2 text-muted">{body}</p>
            </div>
          ))}
        </div>
        <Button href="/services/" variant="secondary" className="mt-8">
          View all services <ArrowRight className="size-4" aria-hidden />
        </Button>
      </Section>

      <Section tone="navy" className="bg-blueprint">
        <SectionHeader tone="dark" eyebrow="Why choose us" title="What you can expect" />
        <WhyChooseUs />
      </Section>

      <Section>
        <SectionHeader eyebrow="Qualifications" title="Accreditations & insurance" />
        {business.accreditations.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {business.accreditations.map((a) => (
              <li key={a.name} className="rounded-[var(--radius-card)] border border-line p-5">
                <p className="font-display font-bold text-ink">{a.name}</p>
                <p className="text-muted">{a.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder label="[ADD: Gas Safe number, F-Gas certificate, public liability insurance — fill business.accreditations in src/data/business.ts. Only verifiable details.]" />
        )}
      </Section>

      <Section tone="mist">
        <SectionHeader eyebrow="Where we work" title="Areas we cover" />
        <AreaLinks compact />
      </Section>

      <CtaBand />
    </>
  );
}
