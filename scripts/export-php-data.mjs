/**
 * Exports the site's shared TypeScript data for the PHP-rendered pages (services, insights, sitemap),
 * so both halves of the site use ONE source of truth:
 *   public/includes/generated/site.json   business/NAP, areas, nav, brands, content blocks, SEO flags, images
 *   public/includes/generated/icons.json  Lucide SVG icons (same set the Next.js pages use)
 *   public/fonts/*.woff2                  self-hosted variable fonts for PHP pages
 * Runs automatically before `next build` (prebuild).
 */
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { business, groupedHours, fullAddress } from "../src/data/business.ts";
import { areas, coveredPostcodes } from "../src/data/areas.ts";
import { brands, brandDisclaimer, featuredBrandSlugs } from "../src/data/brands.ts";
import { processSteps, trustPoints, whyChooseUs, faqGroups } from "../src/data/content.ts";
import { mainNav, companyLinks, legalLinks, categoryNav } from "../src/lib/nav.ts";
import { SAME_DAY_IN_TITLES, staticPageSeo } from "../src/data/seo.ts";
import { siteImages, areaImage } from "../src/data/media.ts";
import manifest from "../src/data/images.json" with { type: "json" };
import coverage from "../src/data/coverage.json" with { type: "json" };
import { AC_OPTIONS, OTHER_REFS, TIME_SLOTS } from "../src/lib/booking.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "includes", "generated");
fs.mkdirSync(OUT, { recursive: true });

const site = {
  generatedAt: new Date().toISOString(),
  business: {
    name: business.name,
    shortName: business.shortName,
    legalName: business.legalName,
    companyNumber: business.companyNumber,
    url: business.url,
    mainArea: business.mainArea,
    phone: business.phone,
    email: business.email,
    address: business.address,
    fullAddress,
    geo: business.geo,
    hours: business.hours,
    hoursGrouped: groupedHours(),
    hoursConfirmed: business.hoursConfirmed,
    serviceAreaSummary: business.serviceAreaSummary,
    mapLinkUrl: business.mapLinkUrl,
    callOutPrice: business.callOutPrice,
    social: business.social,
  },
  areas: areas.map((a) => ({ slug: a.slug, name: a.name, postcodes: a.postcodes, summary: a.summary, borough: a.borough, image: areaImage(a.slug) })),
  coveredPostcodes,
  nav: { main: mainNav, company: companyLinks, legal: legalLinks, categories: categoryNav },
  brands,
  featuredBrandSlugs,
  brandDisclaimer,
  trustPoints,
  processSteps,
  whyChooseUs,
  faqGroups,
  seo: { sameDayInTitles: SAME_DAY_IN_TITLES, pages: staticPageSeo },
  images: manifest,
  siteImages,
  analytics: { ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "", gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "" },
};
fs.writeFileSync(path.join(OUT, "site.json"), JSON.stringify(site));

/* ── Booking rules for the PHP booking API (same source as the booking form) ── */
const booking = { coverage, acOptions: AC_OPTIONS, otherRefs: OTHER_REFS, slots: TIME_SLOTS };
fs.writeFileSync(path.join(OUT, "booking.json"), JSON.stringify(booking));
site.booking = booking;
fs.writeFileSync(path.join(OUT, "site.json"), JSON.stringify(site));

/* ── Icons: render Lucide React components to static SVG, keep the inner markup ── */
const ICONS = [
  // services
  "WashingMachine", "Refrigerator", "Container", "UtensilsCrossed", "CookingPot", "Zap", "Flame", "Microwave", "AirVent",
  "Warehouse", "Milk", "Store", "Beer", "Thermometer", "Snowflake", "Wrench",
  // UI
  "Phone", "MapPin", "Clock", "Mail", "ChevronDown", "ChevronRight", "ChevronLeft", "Menu", "X", "ArrowRight", "ArrowLeft",
  "Check", "CircleCheck", "Star", "CalendarCheck", "AlertTriangle", "Home", "Building2", "Tag", "ShieldCheck", "ClipboardCheck",
  "Share2", "Link", "MessageCircle", "Send", "Copy", "Plus", "Car", "Landmark", "Quote", "BookOpen", "List", "ExternalLink",
  "Settings", "Calendar", "Sun", "Leaf", "Gauge",
];
const icons = {};
for (const name of ICONS) {
  const C = lucide[name];
  if (!C) throw new Error(`Unknown lucide icon: ${name}`);
  const svg = renderToStaticMarkup(createElement(C, { size: 24 }));
  icons[name] = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
fs.writeFileSync(path.join(OUT, "icons.json"), JSON.stringify(icons));

/* ── Fonts for PHP pages ── */
const FONTS = path.join(ROOT, "public", "fonts");
fs.mkdirSync(FONTS, { recursive: true });
for (const [pkg, file] of [
  ["@fontsource-variable/plus-jakarta-sans", "plus-jakarta-sans-latin-wght-normal.woff2"],
  ["@fontsource-variable/source-sans-3", "source-sans-3-latin-wght-normal.woff2"],
]) {
  fs.copyFileSync(path.join(ROOT, "node_modules", pkg, "files", file), path.join(FONTS, file));
}

console.log(`✓ PHP data: ${areas.length} areas, ${brands.length} brands, ${Object.keys(icons).length} icons, ${Object.keys(manifest).length} images, fonts`);
