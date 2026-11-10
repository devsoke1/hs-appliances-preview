import Link from "@/components/ui/SiteLink";
import { business } from "@/data/business";
import { acCoverageText, districtSummary } from "@/data/postcodes";
import { pageMeta } from "@/lib/seo";
import { staticPageSeo } from "@/data/seo";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { PostcodeChecker } from "@/components/postcode/PostcodeChecker";
import { CtaBand } from "@/components/CtaBand";
import { AreaLinks } from "@/components/sections";

export const metadata = pageMeta({ ...staticPageSeo.areas, path: "/areas/" });

export default function AreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Areas" }]}
        eyebrow="Areas we cover"
        title="Appliance repair across West London"
        intro={`We're based at ${business.address.street}, ${business.address.locality} ${business.address.postcode}. From here we cover the areas below and the towns and villages in between.`}
        aside={<PostcodeChecker />}
      />
      <Section>
        <SectionHeader eyebrow="Area pages" title="Choose your area" intro="Each page covers local neighbourhoods, postcodes, travel time from our base and the services we offer there." />
        <AreaLinks />
      </Section>
      <Section tone="mist">
        <SectionHeader
          eyebrow="Postcodes"
          title="Domestic postcode districts we cover"
          intro="Online domestic bookings are open to the postcode districts below. Not on the list? Call us — we may still be able to help."
        />
        <ul className="flex flex-wrap gap-2">
          {districtSummary().split(", ").map((p) => (
            <li key={p} className="rounded-lg bg-white px-3.5 py-2 font-display font-bold text-navy-900 ring-1 ring-line">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-base text-muted">
          <strong className="text-ink">Air conditioning:</strong> {acCoverageText}.{" "}
          <Link href="/air-conditioning/" className="font-semibold text-brand-600 underline underline-offset-2">
            Air conditioning services
          </Link>
        </p>
      </Section>
      <CtaBand />
    </>
  );
}
