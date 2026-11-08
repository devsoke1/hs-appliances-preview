import Link from "next/link";
import { ArrowRight, Building2, Check, Home as HomeIcon, MapPin, Phone, Wrench } from "lucide-react";
import { business, telHref } from "@/data/business";
import { commercialServices, domesticServices, serviceHref } from "@/data/services";
import { brands, featuredBrandSlugs } from "@/data/brands";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ServiceCard, Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { ServiceIcon } from "@/components/ServiceIcon";

const steps = [
  { title: "Tell us the fault", body: "Call or book online with the appliance type, make, model and what it's doing." },
  { title: "We diagnose it", body: "An engineer inspects the appliance and explains the problem in plain English." },
  { title: "Agree the price, then fix", body: "You get a quote before any repair work starts — no surprises." },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy-900 bg-blueprint text-white">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-brand-600/25 blur-3xl" />
        <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="lg:col-span-7">
            <Eyebrow tone="dark">Feltham · Hounslow · West London</Eyebrow>
            <h1 className="text-display text-white">
              Appliance repairs for <span className="text-accent-400">homes</span> and{" "}
              <span className="text-accent-400">businesses</span>.
            </h1>
            <p className="text-lead mt-6 max-w-xl text-white/75">
              Repair, installation and maintenance for washing machines, fridges, cookers, dishwashers and
              commercial refrigeration — from our base at {business.address.street}, {business.address.locality}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/book/" size="lg">
                Book a Repair <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button href={telHref} variant="outline-light" size="lg">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
            <ul className="mt-10 grid gap-3 text-[0.9375rem] text-white/80 sm:grid-cols-3">
              {["Domestic & commercial", "Most major brands", "Clear quote before work"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-accent-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <Placeholder tone="dark" label="[ADD REAL PHOTO: engineer at work / van / workshop — no stock images]" className="aspect-[4/3]" />
          </div>
        </Container>
      </section>

      {/* ── Two audiences ── */}
      <Section tone="mist" className="!py-10 sm:!py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: HomeIcon, title: "For your home", body: "Washing machines, fridge freezers, dishwashers, cookers, hobs, microwaves and air conditioning.", href: "#domestic" },
            { icon: Building2, title: "For your business", body: "Cold rooms, dairy cabinets, display fridges, bar and cellar coolers, and ice machines.", href: "#commercial" },
          ].map(({ icon: Icon, title, body, href }) => (
            <a key={title} href={href} className="group flex items-start gap-5 rounded-[var(--radius-card)] border border-line bg-white p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-navy-900 text-white">
                <Icon className="size-6" aria-hidden />
              </span>
              <span>
                <span className="text-h3 block font-display text-ink">{title}</span>
                <span className="mt-1 block text-muted">{body}</span>
              </span>
              <ArrowRight className="ml-auto mt-1 size-5 shrink-0 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          ))}
        </div>
      </Section>

      {/* ── Domestic ── */}
      <Section id="domestic">
        <SectionHeader
          eyebrow="Domestic appliances"
          title="Household appliance repair"
          intro="We diagnose the fault, explain it clearly and quote before any work starts."
          action={<Button href="/services/" variant="outline">All services <ArrowRight className="size-4" aria-hidden /></Button>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {domesticServices.map((s) => (
            <ServiceCard key={s.slug} href={serviceHref(s.slug)} title={s.title} description={s.shortDescription} icon={<ServiceIcon slug={s.slug} className="size-6" />} />
          ))}
        </div>
      </Section>

      {/* ── Commercial ── */}
      <Section id="commercial" tone="navy" className="bg-blueprint">
        <SectionHeader
          tone="dark"
          eyebrow="Commercial refrigeration"
          title="Keeping shops, pubs and kitchens cold"
          intro="Repair and maintenance for the refrigeration your business depends on."
        />
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {commercialServices.map((s) => (
            <Link key={s.slug} href={serviceHref(s.slug)} className="group flex flex-col gap-3 bg-navy-900 p-7 transition-colors hover:bg-navy-800">
              <span className="flex items-center justify-between">
                <ServiceIcon slug={s.slug} className="size-7 text-accent-400" />
                <ArrowRight className="size-5 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </span>
              <span className="text-h3 font-display text-white">{s.title}</span>
              <span className="text-[0.9375rem] text-white/65">{s.shortDescription}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── Process ── */}
      <Section>
        <SectionHeader eyebrow="How it works" title="Straightforward from first call to fixed" align="center" />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <span className="font-display text-5xl font-extrabold text-brand-100">0{i + 1}</span>
                <h3 className="text-h3 mt-3">{s.title}</h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Brands ── */}
      <Section tone="mist">
        <SectionHeader eyebrow="Brands" title="We work on most major brands" intro="Including, but not limited to:" />
        <ul className="flex flex-wrap gap-3">
          {brands.map((b) => (
            <li
              key={b.slug}
              className={
                featuredBrandSlugs.includes(b.slug)
                  ? "rounded-lg border border-navy-900/15 bg-white px-5 py-3 font-display font-bold text-navy-900"
                  : "rounded-lg border border-line bg-white px-5 py-3 font-display font-semibold text-muted"
              }
            >
              {b.name}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Reviews (placeholders only) ── */}
      <Section>
        <SectionHeader eyebrow="Reviews" title="What customers say" />
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Placeholder key={n} label={`[ADD REAL GOOGLE REVIEW #${n} — name, date, text, link]`} className="min-h-48" />
          ))}
        </div>
        <Placeholder label="[ADD: Google rating + review count from GBP, linked — only once real]" className="mt-5 min-h-16" />
      </Section>

      {/* ── Location ── */}
      <Section tone="mist">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Where we are</Eyebrow>
            <h2 className="text-h2">Based in Feltham, covering West London</h2>
            <p className="text-lead mt-4 text-muted">
              We&rsquo;re at {business.address.street}, {business.address.locality} {business.address.postcode}, serving{" "}
              {business.serviceAreaSummary}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/areas/" variant="secondary"><MapPin className="size-4" aria-hidden /> Areas we cover</Button>
              <Button href="/contact/" variant="outline"><Wrench className="size-4" aria-hidden /> Contact us</Button>
            </div>
          </div>
          <Placeholder label="[ADD: Google Maps embed for 209 Hounslow Road, TW13 6AD]" className="aspect-[16/10]" />
        </div>
      </Section>
    </>
  );
}
