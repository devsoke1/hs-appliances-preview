import type { OpeningHours } from "./types";

export const business = {
  name: "HS Appliances",
  shortName: "HS Appliances",
  legalName: "HS Appliances",
  companyNumber: "[ADD: Companies House number, if limited company]",
  url: "https://www.hsappliances.co.uk",
  legacyUrl: "https://houseandshopappliances.co.uk",
  tagline: "Domestic & commercial appliance repair in West London",
  /** Used in service page H1s: "[Appliance] Repair in {mainArea}" */
  mainArea: "Feltham & West London",
  /**
   * Optional single figure, shown as well as the area fees below.
   * Leave "" when the fee is set per area instead.
   */
  callOutPrice: "" as string,
  /**
   * Call-out fee for each area slug. Fill the amount you charge, e.g. feltham: "£45".
   * Leave "" and the site will not show a figure for that area.
   * The fee is paid only if the customer does not go ahead. If they do, they pay parts and labour only.
   */
  callOutFees: {
    feltham: "",
    hounslow: "",
    twickenham: "",
    ashford: "",
    staines: "",
    isleworth: "",
    hayes: "",
    southall: "",
    richmond: "",
    kingston: "",
    ealing: "",
    heathrow: "",
  } as Record<string, string>,
  callOutNote:
    "The call-out fee depends on your area. You pay it only if you decide not to go ahead with the repair. If you go ahead, you pay for the parts and the labour only.",
  /** Google Maps embed (no API key needed) */
  mapEmbedUrl: "https://www.google.com/maps?q=209+Hounslow+Road,+Feltham+TW13+6AD&output=embed",
  mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=209+Hounslow+Road%2C+Feltham+TW13+6AD",

  phone: {
    display: "07777 372586",
    /** E.164 for tel: links and schema */
    e164: "+447777372586",
  },
  email: "booking@hsappliances.com",

  address: {
    street: "209 Hounslow Road",
    locality: "Feltham",
    region: "Middlesex",
    postcode: "TW13 6AD",
    country: "GB",
  },

  /**
   * Coordinates for LocalBusiness schema. Currently the TW13 6AD postcode centroid (postcodes.io).
   * [CONFIRM] Replace with the exact pin from your Google Business Profile if it differs.
   */
  geo: { lat: 51.440108 as number | null, lng: -0.389958 as number | null },

  /** Confirmed by the business: 7 days, 8am–6pm. */
  hoursConfirmed: true,
  hours: [
    { day: "Monday", opens: "08:00", closes: "18:00" },
    { day: "Tuesday", opens: "08:00", closes: "18:00" },
    { day: "Wednesday", opens: "08:00", closes: "18:00" },
    { day: "Thursday", opens: "08:00", closes: "18:00" },
    { day: "Friday", opens: "08:00", closes: "18:00" },
    { day: "Saturday", opens: "08:00", closes: "18:00" },
    { day: "Sunday", opens: "08:00", closes: "18:00" },
  ] satisfies OpeningHours[],

  /** Short summary used in copy until areas.ts is populated */
  serviceAreaSummary: "Feltham, Hounslow and the surrounding West London, Middlesex and Surrey areas",

  /**
   * Profiles for schema `sameAs` and footer links. Only full https:// URLs are used — empty = omitted.
   * [ADD] Google Business Profile: the share link from Google Maps, e.g. https://maps.app.goo.gl/xxxx
   */
  social: {
    googleBusinessProfile: "" as string,
    facebook: "" as string,
    instagram: "" as string,
  },

  /**
   * Hero photo for the homepage. [ADD] Put the original in /assets/images/, run `npm run images`,
   * then set e.g. { name: "hero-engineer", alt: "HS Appliances engineer repairing a washing machine in Feltham" }
   * (name = the file name in assets/images without extension).
   * Leave null to show the placeholder.
   */
  heroImage: {
    name: "appliance-repair-engineer-washing-machine-motor",
    alt: "Inside a washing machine during a repair, showing the drive motor, belt and wiring",
  } as { name: string; alt: string } | null,

  /** Leave empty until real, verifiable details exist. Rendered only when filled. */
  accreditations: [] as { name: string; id: string; verifyUrl?: string }[],
} as const;

export const fullAddress = `${business.address.street}, ${business.address.locality}, ${business.address.postcode}`;
export const telHref = `tel:${business.phone.e164}`;
export const mailHref = `mailto:${business.email}`;

const fmt = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hr = h % 12 || 12;
  return m ? `${hr}:${String(m).padStart(2, "0")}${suffix}` : `${hr}${suffix}`;
};

/** Compact grouped hours, e.g. ["Mon–Fri 8am–6pm", "Sat 9am–4pm", "Sun Closed"] */
export function groupedHours(): { label: string; value: string }[] {
  const groups: { days: string[]; value: string }[] = [];
  for (const h of business.hours) {
    const value = h.opens && h.closes ? `${fmt(h.opens)}–${fmt(h.closes)}` : "Closed";
    const last = groups[groups.length - 1];
    if (last && last.value === value) last.days.push(h.day);
    else groups.push({ days: [h.day], value });
  }
  return groups.map((g) => ({
    label: g.days.length > 1 ? `${g.days[0].slice(0, 3)}–${g.days[g.days.length - 1].slice(0, 3)}` : g.days[0].slice(0, 3),
    value: g.value,
  }));
}
