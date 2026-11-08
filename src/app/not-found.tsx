import { Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { AreaLinks } from "@/components/sections";
import { commercialServices, domesticServices, serviceHref } from "@/data/services";
import Link from "next/link";

export const metadata = { title: { absolute: "Page Not Found | HS Appliances" }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Page not found" }]}
        eyebrow="Error 404"
        title="Sorry, we can't find that page"
        intro="It may have moved when we updated our website. Try one of the links below, or give us a call."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Go to homepage
          </Button>
          <Button href={telHref} variant="outline-light" size="lg">
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </Button>
        </div>
      </PageHero>
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            { title: "Domestic repairs", list: domesticServices },
            { title: "Commercial refrigeration", list: commercialServices },
          ].map((g) => (
            <div key={g.title}>
              <h2 className="text-h3 mb-4">{g.title}</h2>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {g.list.map((s) => (
                  <li key={s.slug}>
                    <Link href={serviceHref(s.slug)} className="font-semibold text-brand-600 hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h2 className="text-h3 mt-12 mb-4">Areas we cover</h2>
        <AreaLinks compact />
      </Section>
    </>
  );
}
