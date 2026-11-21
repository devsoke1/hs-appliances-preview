import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarCheck, Clock, MapPin, Phone, Wrench } from "lucide-react";
import { business, groupedHours, telHref } from "@/data/business";
import { areaHref, areas } from "@/data/areas";
import { brandsForService } from "@/data/brands";
import { imagePath, postImage, serviceImage } from "@/data/media";
import { serviceDescription, serviceTitle } from "@/data/seo";
import { getService, serviceHref, services } from "@/data/services";
import { buildServices } from "@/lib/build-data";
import { postsForService, postHref } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceIcon } from "@/components/ServiceIcon";
import { ServiceCardGrid } from "@/components/ServiceCard";
import { PostCards } from "@/components/PostCards";
import { BrandStrip, ProcessSteps, TrustList } from "@/components/sections";
import { CtaBand } from "@/components/CtaBand";
import SiteLink from "@/components/ui/SiteLink";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const img = serviceImage(s.slug);
  return pageMeta({
    title: serviceTitle(s),
    description: serviceDescription(s),
    path: serviceHref(s.slug),
    image: img ? { url: imagePath(img.name, 1200), alt: img.alt } : undefined,
  });
}

const article =
  "space-y-4 [&_h2]:text-h2 [&_h2]:mt-14 [&_h2]:mb-5 [&_p]:text-body [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&>p:first-child]:text-lead [&>p:first-child]:text-ink";

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const label = s.name;
  const lower = label.toLowerCase();
  const articleWord = /^[aeiou]/i.test(lower) ? "an" : "a";
  const bookHref = `/book/?service=${encodeURIComponent(s.slug)}`;
  const img = serviceImage(s.slug);
  const brands = brandsForService(s.slug);
  const hours = groupedHours();
  const guides = postsForService(s.slug).slice(0, 3);
  const { services: summaries } = await buildServices();
  const related = summaries.filter((item) => item.category === s.category && item.slug !== s.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      <PageHero
        crumbs={[{ label: "Services", href: "/services/" }, { label: s.name }]}
        eyebrow={s.category === "domestic" ? "Domestic appliances" : "Commercial refrigeration"}
        title={`${s.title} in ${business.mainArea}`}
        intro={s.shortDescription}
        aside={
          img ? (
            <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/15">
              <SmartImage src={imagePath(img.name, 1024)} alt={img.alt} sizes="(min-width: 1024px) 40vw, 100vw" priority />
            </div>
          ) : (
            <div className="hidden justify-end lg:flex">
              <span className="grid size-40 place-items-center rounded-3xl bg-white/[0.06] ring-1 ring-white/15">
                <ServiceIcon slug={s.slug} className="size-20 text-accent-400" />
              </span>
            </div>
          )
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={bookHref} size="lg">
            Book this repair
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
        <TrustList tone="dark" className="mt-8 max-w-lg" />
      </PageHero>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
        <article className="min-w-0 lg:col-span-8">
          <div className={article}>
            {s.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {s.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          {s.complianceNote && (
            <aside className="mt-8 flex gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-accent-400/70 bg-accent-50 p-5 text-[0.9375rem] text-accent-700">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="font-semibold">{s.complianceNote}</p>
            </aside>
          )}

          {s.faults.length > 0 && (
            <>
              <h2 className="text-h2 mt-14 mb-6">Common {lower} faults we fix</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {s.faults.map((fault) => (
                  <li key={fault.name} className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                    <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] font-bold text-ink">
                      <Wrench className="size-4 shrink-0 text-accent-500" aria-hidden />
                      {fault.name}
                    </h3>
                    {fault.detail && <p className="mt-2 text-base text-muted">{fault.detail}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}

          <section className="mt-14">
            <h2 className="text-h2 mb-5">Prices and call-out</h2>
            {business.callOutPrice ? (
              <p className="text-lead text-ink">
                Our call-out charge is <strong>{business.callOutPrice}</strong>. It can differ by area.
              </p>
            ) : null}
            <p className="text-sm leading-relaxed text-muted">{business.callOutNote}</p>
          </section>

          {s.faqs.length > 0 && (
            <section className="mt-14" id="faqs">
              <h2 className="text-h2 mb-6">{label} repair FAQs</h2>
              <FaqAccordion faqs={s.faqs} schema />
            </section>
          )}
        </article>

        <aside className="lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <p className="font-display text-xl font-extrabold">
                Book {articleWord} {lower} repair
              </p>
              <p className="mt-2 text-white/75">Tell us the make, model and fault — we’ll confirm a slot that suits you.</p>
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
                {hours.map((hour) => (
                  <div key={hour.label} className="contents">
                    <dt className="text-muted">{hour.label}</dt>
                    <dd className="font-semibold text-ink">{hour.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </Container>

      {brands.length > 0 && (
        <Section tone="mist">
          <SectionHeader
            eyebrow="Brands"
            title={`${label} brands we repair`}
            intro="Including, but not limited to, the makes below. Not listed? Call us with the make and model."
          />
          <BrandStrip brands={brands} />
        </Section>
      )}

      <Section>
        <SectionHeader eyebrow="How it works" title="From booking to fixed" align="center" />
        <ProcessSteps />
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow="Areas covered"
          title={`${s.name} across West London`}
          intro={`Based in Feltham, we cover ${business.serviceAreaSummary}, including:`}
        />
        <ul className="flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.slug} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <SiteLink
                href={areaHref(area.slug)}
                className="flex h-full min-h-11 items-center gap-2.5 rounded-lg border border-line bg-white px-4 py-3 font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden />
                <span>
                  {label} repair in {area.name}
                  <span className="ml-1.5 text-sm font-normal text-muted">{area.postcodes.join(", ")}</span>
                </span>
              </SiteLink>
            </li>
          ))}
        </ul>
      </Section>

      {guides.length > 0 && (
        <Section>
          <SectionHeader eyebrow="Insights" title={`${label} guides`} />
          <PostCards
            posts={guides.map((post) => {
              const photo = postImage(post.slug);
              return {
                slug: post.slug,
                title: post.title,
                excerpt: post.description,
                featured_image: photo ? imagePath(photo.name, 800) : null,
                image_alt: photo?.alt ?? null,
                category: "Guides",
                published_at: `${post.date}T09:00:00Z`,
                url: postHref(post.slug),
              };
            })}
          />
        </Section>
      )}

      {related.length > 0 && (
        <Section tone={guides.length ? "mist" : "white"}>
          <SectionHeader
            eyebrow="Related services"
            title={s.category === "domestic" ? "Other household appliances we repair" : "Other commercial refrigeration we repair"}
            action={
              <Button href="/services/" variant="outline">
                All services <ArrowRight className="size-4" aria-hidden />
              </Button>
            }
          />
          <ServiceCardGrid services={related} />
        </Section>
      )}

      <CtaBand title={`Need ${articleWord} ${lower} repair?`} text="Call us or book online — tell us the make, model and what it's doing." bookHref={bookHref} />
    </>
  );
}
