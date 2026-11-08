import type { OpeningHours } from "./types";

export const business = {
  name: "House & Shop Appliances",
  shortName: "HS Appliances",
  legalName: "[CONFIRM: registered business / company name]",
  companyNumber: "[ADD: Companies House number, if limited company]",
  url: "https://hsappliances.co.uk",
  legacyUrl: "https://houseandshopappliances.co.uk",
  tagline: "Domestic & commercial appliance repair in West London",

  phone: {
    display: "07777 372586",
    /** E.164 for tel: links and schema */
    e164: "+447777372586",
  },
  email: "house.shopappliances@gmail.com",

  address: {
    street: "209 Hounslow Road",
    locality: "Feltham",
    region: "Middlesex",
    postcode: "TW13 6AD",
    country: "GB",
  },

  /** [CONFIRM] Exact coordinates from Google Business Profile — used in LocalBusiness schema */
  geo: { lat: null as number | null, lng: null as number | null },

  /**
   * [CONFIRM HOURS] Placeholder hours — replace with the hours on your Google Business Profile.
   * They must match GBP exactly (NAP + hours consistency matters for local SEO).
   */
  hoursConfirmed: false,
  hours: [
    { day: "Monday", opens: "08:00", closes: "18:00" },
    { day: "Tuesday", opens: "08:00", closes: "18:00" },
    { day: "Wednesday", opens: "08:00", closes: "18:00" },
    { day: "Thursday", opens: "08:00", closes: "18:00" },
    { day: "Friday", opens: "08:00", closes: "18:00" },
    { day: "Saturday", opens: "09:00", closes: "16:00" },
    { day: "Sunday", opens: null, closes: null },
  ] satisfies OpeningHours[],

  /** Short summary used in copy until areas.ts is populated */
  serviceAreaSummary: "Feltham, Hounslow and surrounding West London & Middlesex areas",

  social: {
    googleBusinessProfile: "[ADD: Google Business Profile URL]",
    facebook: "",
    instagram: "",
  },

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
