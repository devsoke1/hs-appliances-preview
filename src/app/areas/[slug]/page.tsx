import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Car, Landmark, MapPin, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { areaHref, areas, getArea } from "@/data/areas";
import { commercialServices, domesticServices, getService, serviceHref } from "@/data/services";
import { pageMeta } from "@/lib/seo";
import { areaDescription, areaTitle } from "@/data/seo";
import { postsForArea } from "@/lib/blog";
import { PostCards } from "@/components/PostCards";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { ServiceIcon } from "@/components/ServiceIcon";
import { PostcodeChecker } from "@/components/postcode/PostcodeChecker";
import { CtaBand } from "@/components/CtaBand";
import { TrustList } from "@/components/sections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) return {};
  return pageMeta({
    title: areaTitle(a),
    description: areaDescription(a),
    path: areaHref(a.slug),
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const isBase = area.travel.miles === 0;
  const guides = postsForArea(area.slug);
  const nearby = area.nearby.map(getArea).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const key = area.keyServices
    .map((k) => ({ ...k, service: getService(k.slug) }))
    .filter((k): k is typeof k & { service: NonNullable<typeof k.service> } => Boolean(k.service));

  const facts = [
    { icon: MapPin, label: "Postcodes covered", value: area.postcodes.join(", ") },
    {
      icon: Car,
      label: "From our Feltham base",
      value: isBase ? `Our home base · ${area.travel.minutes} min` : `~${area.travel.miles} miles · ${area.travel.minutes} min`,
    },
    { icon: Landmark, label: "Local authority", value: area.borough },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Areas", href: "/areas/" }, { label: area.name }]}
        eyebrow={`Areas we cover · ${area.postcodes.join(", ")}`}
        title={`Appliance Repair in ${area.name}`}
        intro={area.summary}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`/book/?postcode=${area.postcodes[0]}`} size="lg">
            Book a repair in {area.name} <ArrowRight className="size-5" aria-hidden />
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
        <TrustList className="mt-8 max-w-lg" />
      </PageHero>

      {/* Fact strip */}
      <div className="border-b border-line bg-white">
        <Container className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-5 sm:px-6 sm:first:pl-0">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="font-display font-bold text-ink">{value}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <article className="min-w-0 lg:col-span-8">
          <div className="space-y-5">
            {area.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lead text-ink" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <h2 className="text-h3 mt-10 mb-4">Neighbourhoods we cover in {area.name}</h2>
          <ul className="flex flex-wrap gap-2">
            {area.neighbourhoods.map((n) => (
              <li key={n} className="rounded-full bg-mist px-4 py-2 text-[0.9375rem] font-semibold text-navy-900 ring-1 ring-line">
                {n}
              </li>
            ))}
          </ul>

          <section className="mt-14">
            <h2 className="text-h2 mb-5">{area.local.heading}</h2>
            <div className="space-y-4">
              {area.local.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-h2 mb-6">Key services in {area.name}</h2>
            <ul className="space-y-4">
              {key.map(({ service, reason }) => (
                <li key={service.slug}>
                  <Link
                    href={serviceHref(service.slug)}
                    className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-brand-200 hover:shadow-[var(--shadow-card)]"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-navy-900 group-hover:text-white">
                      <ServiceIcon slug={service.slug} className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold text-ink">
                        {service.title} in {area.name}
                      </span>
                      <span className="mt-1 block text-muted">{reason}</span>
                    </span>
                    <ArrowRight className="mt-1 size-5 shrink-0 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="text-h2 mb-6">Everything we repair in {area.name}</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                { title: "Domestic appliances", list: domesticServices },
                { title: "Commercial refrigeration", list: commercialServices },
              ].map((g) => (
                <div key={g.title}>
                  <h3 className="mb-3 border-b border-line pb-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-muted">{g.title}</h3>
                  <ul className="space-y-1">
                    {g.list.map((s) => (
                      <li key={s.slug}>
                        <Link href={serviceHref(s.slug)} className="flex items-center gap-2.5 rounded-lg py-1.5 font-semibold text-navy-900 hover:text-brand-600">
                          <ServiceIcon slug={s.slug} className="size-4 text-brand-600" />
                          {s.title} in {area.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-h2 mb-6">Reviews from {area.name}</h2>
            <Placeholder label={`[ADD REAL GOOGLE REVIEW from a customer in ${area.name} — name, date, text. Leave out until you have one.]`} className="min-h-32" />
          </section>
        </article>

        <aside className="lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            <PostcodeChecker tone="light" />
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <p className="font-display text-xl font-extrabold">Appliance broken in {area.name}?</p>
              <p className="mt-2 text-white/70">
                {isBase ? "We're based right here in Feltham." : `We're around ${area.travel.minutes} minutes away in Feltham.`}
              </p>
              <Button href={telHref} className="mt-5 w-full">
                <Phone className="size-5" aria-hidden /> {business.phone.display}
              </Button>
            </div>
          </div>
        </aside>
      </Container>

      {guides.length > 0 && (
        <Section>
          <SectionHeader eyebrow="Advice" title={`Guides for ${area.name} homes and businesses`} />
          <PostCards posts={guides} />
        </Section>
      )}

      {nearby.length > 0 && (
        <Section tone="mist">
          <SectionHeader eyebrow="Nearby" title={`Areas near ${area.name}`} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={areaHref(n.slug)}
                  className="group flex items-center justify-between rounded-[var(--radius-card)] border border-line bg-white p-5 font-display font-bold text-ink hover:border-brand-200"
                >
                  <span>
                    {n.name}
                    <span className="mt-0.5 block text-sm font-semibold text-brand-600">{n.postcodes.join(", ")}</span>
                  </span>
                  <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title={`Appliance repair in ${area.name}`} bookHref={`/book/?postcode=${area.postcodes[0]}`} />
    </>
  );
}
