import Link from "@/components/ui/SiteLink";
import { ArrowRight } from "lucide-react";
import { allGeneralFaqs, faqGroups } from "@/data/content";
import { commercialServices, domesticServices, serviceHref } from "@/data/services";
import { pageMeta } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { staticPageSeo } from "@/data/seo";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceIcon } from "@/components/ServiceIcon";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/CtaBand";

export const metadata = pageMeta({ ...staticPageSeo.faq, path: "/faq/" });

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function FaqPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "FAQ" }]}
        eyebrow="Help"
        title="Frequently asked questions"
        intro="Answers to the questions we're asked most. For appliance-specific questions, see the FAQ section on each service page."
      />

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <nav aria-label="FAQ topics" className="lg:col-span-3">
          <ul className="space-y-1 lg:sticky lg:top-28">
            {faqGroups.map((g) => (
              <li key={g.title}>
                <a href={`#${slugify(g.title)}`} className="block rounded-lg px-3 py-2 font-display font-semibold text-navy-900 hover:bg-mist hover:text-brand-600">
                  {g.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#appliances" className="block rounded-lg px-3 py-2 font-display font-semibold text-navy-900 hover:bg-mist hover:text-brand-600">
                By appliance
              </a>
            </li>
          </ul>
        </nav>
        <div className="space-y-12 lg:col-span-9">
          {faqGroups.map((g) => (
            <section key={g.title} id={slugify(g.title)}>
              <h2 className="text-h2 mb-5">{g.title}</h2>
              <FaqAccordion faqs={g.faqs} />
            </section>
          ))}
        </div>
      </Container>

      <Section tone="mist" id="appliances">
        <SectionHeader eyebrow="By appliance" title="Questions about a specific appliance" intro="Each service page has its own FAQs covering common faults and what to do." />
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { title: "Domestic", list: domesticServices },
            { title: "Commercial", list: commercialServices },
          ].map((g) => (
            <div key={g.title}>
              <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-muted">{g.title}</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {g.list.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`${serviceHref(s.slug)}#faqs`}
                      className="group flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 font-semibold text-navy-900 hover:border-brand-200 hover:text-brand-600"
                    >
                      <ServiceIcon slug={s.slug} className="size-5 text-brand-600" />
                      <span className="flex-1">{s.name}</span>
                      <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <JsonLd data={faqSchema(allGeneralFaqs)} />
      <CtaBand title="Still have a question?" text="Call us — we're happy to talk it through." />
    </>
  );
}
