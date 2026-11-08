import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarCheck, Clock, MapPin, Phone, Wrench } from "lucide-react";
import { business, groupedHours, telHref } from "@/data/business";
import { getService, services } from "@/data/services";
import { areaHref, areas } from "@/data/areas";
import { brandsForService } from "@/data/brands";
import { serviceDescription, serviceTitle } from "@/data/seo";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { postsForService } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { PostCards } from "@/components/PostCards";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceIcon } from "@/components/ServiceIcon";
import { CtaBand } from "@/components/CtaBand";
import { BrandStrip, ProcessSteps, ServiceGrid, TrustList } from "@/components/sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMeta({ title: serviceTitle(s), description: serviceDescription(s), path: `/services/${s.slug}/` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const brands = brandsForService(service.slug);
  const guides = postsForService(service.slug);
  const related = services.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);
  const bookHref = `/book/?service=${service.slug}`;
  const lower = service.name.toLowerCase();
  const aLower = `${/^[aeiou]/.test(lower) ? "an" : "a"} ${lower}`; // "an ice machine", "a dishwasher"

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services/" }, { label: service.title }]}
        eyebrow={service.category === "domestic" ? "Domestic appliances" : "Commercial refrigeration"}
        title={`${service.title} in ${business.mainArea}`}
        intro={service.shortDescription}
        aside={
          <div className="hidden justify-end lg:flex">
            <span className="grid size-40 place-items-center rounded-3xl bg-white/[0.06] ring-1 ring-white/15">
              <ServiceIcon slug={service.slug} className="size-20 text-accent-400" strokeWidth={1.25} />
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={bookHref} size="lg">
            Book this repair <ArrowRight className="size-5" aria-hidden />
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
        <TrustList className="mt-8 max-w-lg" />
      </PageHero>

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        {/* ── Main content ── */}
        <article className="min-w-0 lg:col-span-8">
          <div className="space-y-5">
            {service.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lead text-ink" : undefined}>
                {p}
              </p>
            ))}
          </div>

          {service.complianceNote && (
            <aside className="mt-8 flex gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-accent-400/70 bg-accent-50 p-5 text-[0.9375rem] text-accent-700">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="font-semibold">{service.complianceNote}</p>
            </aside>
          )}

          <h2 className="text-h2 mt-14 mb-6">Common {lower} faults we fix</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {service.faults.map((f) => (
              <li key={f.name} className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] font-bold text-ink">
                  <Wrench className="size-4 shrink-0 text-accent-500" aria-hidden />
                  {f.name}
                </h3>
                <p className="mt-2 text-[0.9688rem] text-muted">{f.detail}</p>
              </li>
            ))}
          </ul>

          {service.sections.map((sec) => (
            <section key={sec.heading} className="mt-14">
              <h2 className="text-h2 mb-5">{sec.heading}</h2>
              <div className="space-y-4">
                {sec.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-14">
            <h2 className="text-h2 mb-5">Prices and call-out</h2>
            {business.callOutPrice ? (
              <p className="text-lead text-ink">
                Our call-out charge is <strong>{business.callOutPrice}</strong>.
              </p>
            ) : (
              <Placeholder label="[ADD: call-out price, what it includes (e.g. diagnosis), and typical labour/parts pricing for this appliance]" />
            )}
            <p className="mt-4">
              Once we&rsquo;ve diagnosed the fault, you&rsquo;ll get a quote for the repair, including parts, before any work goes ahead.
            </p>
          </section>

          <section className="mt-14" id="faqs">
            <h2 className="text-h2 mb-6">{service.name} repair FAQs</h2>
            <FaqAccordion faqs={service.faqs} schema />
          </section>
        </article>

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <p className="font-display text-xl font-extrabold">Book {aLower} repair</p>
              <p className="mt-2 text-white/70">Tell us the make, model and fault — we&rsquo;ll confirm a slot that suits you.</p>
              <div className="mt-5 space-y-2.5">
                <Button href={bookHref} className="w-full">
                  <CalendarCheck className="size-5" aria-hidden /> Book online
                </Button>
                <Button href={telHref} variant="outline-light" className="w-full">
                  <Phone className="size-5" aria-hidden /> {business.phone.display}
                </Button>
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="flex items-center gap-2 font-display font-bold text-ink">
                <Clock className="size-4 text-brand-600" aria-hidden /> Opening hours
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9375rem]">
                {groupedHours().map((h) => (
                  <div key={h.label} className="contents">
                    <dt className="text-muted">{h.label}</dt>
                    <dd className="font-semibold text-ink">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </Container>

      <Section tone="mist">
        <SectionHeader eyebrow="Brands" title={`${service.name} brands we repair`} intro="Including, but not limited to, the makes below. Not listed? Call us with the make and model." />
        {brands.length > 0 ? (
          <BrandStrip brands={brands} />
        ) : (
          <p className="text-lead text-muted">We work on most makes — call us with the make and model and we&rsquo;ll let you know.</p>
        )}
      </Section>

      <Section>
        <SectionHeader eyebrow="How it works" title="From booking to fixed" align="center" />
        <ProcessSteps />
      </Section>

      <Section tone="mist">
        <SectionHeader eyebrow="Areas covered" title={`${service.title} across West London`} intro={`Based in Feltham, we cover ${business.serviceAreaSummary}, including:`} />
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a.slug)}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-4 py-3 font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden />
                <span>
                  {service.name} repair in {a.name}
                  <span className="ml-1.5 text-sm font-normal text-muted">{a.postcodes.join(", ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {guides.length > 0 && (
        <Section>
          <SectionHeader eyebrow="Advice" title={`${service.name} guides`} />
          <PostCards posts={guides} />
        </Section>
      )}

      {related.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Related services"
            title={service.category === "domestic" ? "Other household appliances we repair" : "Other commercial refrigeration we repair"}
            action={
              <Button href="/services/" variant="outline">
                All services <ArrowRight className="size-4" aria-hidden />
              </Button>
            }
          />
          <ServiceGrid services={related} columns={3} />
        </Section>
      )}

      <JsonLd data={serviceSchema(service)} />
      <CtaBand title={`Need ${aLower} repair?`} bookHref={bookHref} />
    </>
  );
}
