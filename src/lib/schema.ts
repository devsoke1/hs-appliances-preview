/**
 * schema.org JSON-LD builders. Typed with `schema-dts` (Google's schema.org TypeScript definitions),
 * so property names and value types are checked against the schema.org vocabulary at compile time.
 */
import type {
  BlogPosting,
  BreadcrumbList,
  DayOfWeek,
  FAQPage,
  Graph,
  HomeAndConstructionBusiness,
  OpeningHoursSpecification,
  Service as SchemaService,
  WebSite,
  WithContext,
} from "schema-dts";
import { business } from "@/data/business";
import { areas } from "@/data/areas";
import { services, serviceHref } from "@/data/services";
import type { FAQ, Service } from "@/data/types";
import { absoluteUrl, OG_DEFAULT, SITE_URL } from "./seo";

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const areaServed = () => areas.map((a) => ({ "@type": "Place" as const, name: a.name }));

/** Groups days with identical hours: Mon–Fri 08:00–18:00, Sat 09:00–16:00. */
function openingHours(): OpeningHoursSpecification[] {
  const groups = new Map<string, DayOfWeek[]>();
  for (const h of business.hours) {
    if (!h.opens || !h.closes) continue;
    const key = `${h.opens}-${h.closes}`;
    groups.set(key, [...(groups.get(key) ?? []), `https://schema.org/${h.day}` as DayOfWeek]);
  }
  return [...groups].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

/** Site-wide graph: the business (HomeAndConstructionBusiness ⊂ LocalBusiness) + the website. */
export function siteGraph(): Graph {
  const sameAs = Object.values(business.social).filter((u): u is string => typeof u === "string" && u.startsWith("https://"));

  const org: HomeAndConstructionBusiness = {
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: business.name,
    alternateName: business.shortName,
    description:
      "Repair, installation and maintenance of domestic appliances and commercial refrigeration in Feltham, Hounslow and West London.",
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/images/logo.png"),
    image: absoluteUrl(OG_DEFAULT),
    telephone: business.phone.e164,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    ...(business.geo.lat !== null && business.geo.lng !== null
      ? { geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng } }
      : {}),
    hasMap: business.mapLinkUrl,
    openingHoursSpecification: openingHours(),
    areaServed: areaServed(),
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Appliance repair services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", "@id": `${absoluteUrl(serviceHref(s.slug))}#service`, name: s.title },
      })),
    },
  };

  const site: WebSite = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: business.name,
    alternateName: business.shortName,
    inLanguage: "en-GB",
    publisher: { "@id": BUSINESS_ID },
  };

  return { "@context": "https://schema.org", "@graph": [org, site] };
}

export function serviceSchema(s: Service): WithContext<SchemaService> {
  const url = absoluteUrl(serviceHref(s.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.title,
    serviceType: s.title,
    description: s.shortDescription,
    url,
    category: s.category === "domestic" ? "Domestic appliance repair" : "Commercial refrigeration repair",
    provider: { "@id": BUSINESS_ID },
    areaServed: areaServed(),
    ...(s.category === "commercial" ? { audience: { "@type": "BusinessAudience", name: "Shops, pubs, restaurants, hotels and food businesses" } } : {}),
  };
}

export function faqSchema(faqs: FAQ[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

export function blogPostingSchema(p: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  serviceSlug?: string;
}): WithContext<BlogPosting> {
  const url = absoluteUrl(`/blog/${p.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.description,
    url,
    mainEntityOfPage: url,
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    inLanguage: "en-GB",
    image: absoluteUrl(OG_DEFAULT),
    author: { "@type": "Organization", name: business.name, url: `${SITE_URL}/` },
    publisher: { "@id": BUSINESS_ID },
    ...(p.serviceSlug ? { about: { "@id": `${absoluteUrl(serviceHref(p.serviceSlug))}#service` } } : {}),
  };
}
