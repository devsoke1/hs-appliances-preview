import type { Area, Service } from "./types";
import { business } from "./business";
import { BRAND, fitTitle } from "@/lib/seo";

/**
 * Titles (≤60) and meta descriptions (≤155) for every page.
 * `npm run audit` fails any page that goes over — keep that in mind when editing.
 *
 * "Same-Day" in titles reflects the trust claim in data/content.ts — remove both if it isn't accurate.
 */
export const SAME_DAY_IN_TITLES = true;

export const staticPageSeo = {
  home: {
    title: `Appliance Repair West London & Feltham | ${BRAND}`,
    description:
      "Domestic appliance & commercial refrigeration repair across West London from our Feltham base. Same/next-day visits. Call 07777 372586 or book online.",
  },
  services: {
    title: `Appliance Repair Services in West London | ${BRAND}`,
    description:
      "Washing machine, fridge, oven, hob, dishwasher & air con repair, plus cold rooms, display fridges and ice machines for businesses in West London.",
  },
  areas: {
    title: `Areas We Cover – West London & Surrey | ${BRAND}`,
    description:
      "Appliance repair in Feltham, Hounslow, Twickenham, Ashford, Staines, Isleworth, Hayes, Southall, Richmond, Kingston, Ealing & Heathrow. Check your area.",
  },
  about: {
    title: `About Us – Appliance Repair in Feltham | ${BRAND}`,
    description:
      "House & Shop Appliances repairs, installs and maintains domestic appliances and commercial refrigeration from 209 Hounslow Road, Feltham TW13 6AD.",
  },
  contact: {
    title: `Contact Us – 209 Hounslow Rd, Feltham | ${BRAND}`,
    description:
      "Call 07777 372586, email or message House & Shop Appliances, 209 Hounslow Road, Feltham TW13 6AD. Appliance repair across West London.",
  },
  faq: {
    title: `Appliance Repair FAQs – Booking & Prices | ${BRAND}`,
    description:
      "Answers on booking an appliance repair, call-out charges, areas covered, brands, parts and commercial refrigeration in Feltham and West London.",
  },
  book: {
    title: `Book an Appliance Repair or AC Visit Online | ${BRAND}`,
    description:
      "Book online: choose the service, describe the problem and pick a 2-hour slot. Instant confirmation by email. Domestic, commercial and air conditioning.",
  },
  domestic: {
    title: `Domestic Appliance Repair West London | ${BRAND}`,
    description:
      "Washing machine, fridge freezer, oven, hob, dishwasher and microwave repairs at home across West London. All major brands. Book a 2-hour slot online.",
  },
  commercial: {
    title: `Commercial Refrigeration Repair London | ${BRAND}`,
    description:
      "Cold room, display fridge, dairy cabinet, bar cooler, cellar cooler and ice machine repairs for London businesses. Book a 2-hour slot online.",
  },
  airConditioning: {
    title: `Air Conditioning London, Berkshire & Reading | ${BRAND}`,
    description:
      "Air conditioning that cools and heats: free quotations, supply & installation, servicing and repair across London, Berkshire and Reading. Book online.",
  },
  // Used by the PHP-rendered /insights/ page (exported via public/includes/generated/site.json)
  insights: {
    title: `Appliance Repair Insights & Guides | ${BRAND}`,
    description:
      "Practical guides from our Feltham engineers: fixing common washing machine, fridge and commercial refrigeration faults, and when to call a pro.",
  },
  privacy: {
    title: `Privacy Policy | ${BRAND}`,
    description: "How House & Shop Appliances collects, uses and protects your personal information, and the cookies used on this website.",
  },
  terms: {
    title: `Terms & Conditions | ${BRAND}`,
    description: "Terms and conditions for appliance repair, installation and maintenance services from House & Shop Appliances in Feltham.",
  },
} as const;

/* ───────────────────────── Services ───────────────────────── */

/** "Washing Machine Repair Feltham | Same-Day | HS Appliances" — shortest fallback if > 60. */
export function serviceTitle(s: Service): string {
  const base = `${s.name} Repair ${business.address.locality}`;
  return fitTitle(...(SAME_DAY_IN_TITLES ? [`${base} | Same-Day | ${BRAND}`] : []), `${base} | ${BRAND}`, `${s.name} Repair | ${BRAND}`);
}

const serviceDescriptions: Record<string, string> = {
  "washing-machine-repair":
    "Washing machine repair in Feltham, Hounslow & West London. Not draining, not spinning, leaking or error codes? Same/next-day visits. Call 07777 372586.",
  "fridge-freezer-repair":
    "Fridge freezer repair in Feltham & West London: not cooling, icing up, leaking or noisy. Quote before any work. Same/next-day visits. Call 07777 372586.",
  "american-fridge-repair":
    "American fridge freezer repair in Feltham & West London — cooling faults, ice makers, water dispensers and leaks. Same/next-day visits. 07777 372586.",
  "dishwasher-repair":
    "Dishwasher repair in Feltham & West London: not draining, not cleaning, leaking or not drying. Integrated & freestanding. Call 07777 372586.",
  "electric-cooker-repair":
    "Electric oven & cooker repair in Feltham & West London — not heating, fan faults, tripping electrics, grills and timers. Call 07777 372586.",
  "electric-hob-repair":
    "Induction, ceramic & electric hob repair in Feltham & West London: zones not heating, touch controls, error codes. Call 07777 372586.",
  "gas-cooker-repair":
    "Gas cooker & oven repair in Feltham & West London — burners not lighting, flames going out, ovens not heating. Call 07777 372586.",
  "gas-hob-repair":
    "Gas hob repair in Feltham & West London: burners won't light, constant clicking, weak or yellow flames, stiff knobs. Call 07777 372586.",
  "microwave-repair":
    "Built-in & combination microwave repair in Feltham & West London — not heating, sparking, turntable or door faults. Call 07777 372586.",
  "air-conditioning-repair":
    "Air conditioning repair & servicing in Feltham & West London for homes, shops and offices: not cooling, leaks, noise. Call 07777 372586.",
  "cold-room-repair":
    "Cold room & walk-in freezer repair and maintenance for West London food businesses. Not holding temperature? Call 07777 372586.",
  "dairy-cabinet-repair":
    "Multideck dairy cabinet repair for shops in Feltham, Hounslow & West London — running warm, icing, fans, night blinds. Call 07777 372586.",
  "display-fridge-repair":
    "Display fridge repair for cafés, shops & delis in West London: glass-door merchandisers, serve-overs, cake displays. Call 07777 372586.",
  "bar-cooler-repair":
    "Bar & bottle cooler repair for pubs, bars and restaurants in Feltham & West London — warm drinks, noisy fans, door faults. 07777 372586.",
  "cellar-cooler-repair":
    "Beer cellar cooling repair for pubs in West London: cellar running warm, iced evaporators, condensing unit faults. Call 07777 372586.",
  "ice-machine-repair":
    "Commercial ice machine repair & cleaning in West London — not making ice, small cubes, leaks, scale build-up. Call 07777 372586.",
};

export const serviceDescription = (s: Service) => serviceDescriptions[s.slug] ?? s.shortDescription;

/* ───────────────────────── Areas ───────────────────────── */

export function areaTitle(a: Area): string {
  const base = `Appliance Repair ${a.name}`;
  return fitTitle(...(SAME_DAY_IN_TITLES ? [`${base} | Same-Day | ${BRAND}`] : []), `${base} | ${BRAND}`);
}

export function areaDescription(a: Area): string {
  const travel = a.travel.miles === 0 ? "Our home base." : `~${a.travel.minutes} min from Feltham.`;
  return `Appliance repair in ${a.name} (${a.postcodes.join(", ")}) — washing machines, fridges, ovens & commercial fridges. ${travel} Call 07777 372586.`;
}
