/**
 * Booking references and time slots — shared by the booking form, the Domestic / Commercial /
 * Air Conditioning pages and the header. Mirrored in PHP: public/api/_lib/booking.php
 * (the server rebuilds the same list from the database and rejects anything else).
 *
 * No data-file imports here: this module ships to the browser.
 */
import type { ServiceSummary } from "./live-types";

export type BookingCategory = "domestic" | "commercial" | "ac";

export type AcOption = {
  key: string;
  /** Short label for the header drop-down */
  menu: string;
  title: string;
  ref: string;
  description: string;
  icon: string;
};

/** Air conditioning services, in the order of the brief. `key` is used in links: /air-conditioning/?service=<key> */
export const AC_OPTIONS: AcOption[] = [
  {
    key: "free-quotation",
    menu: "Quotation",
    title: "Free Quotation",
    ref: "AC - Free Quotation",
    description: "We visit, look at the room and your options, and give you a clear written quote. No charge and no obligation.",
    icon: "ClipboardCheck",
  },
  {
    key: "installation",
    menu: "Installation",
    title: "Supply & Installation",
    ref: "AC - Supply & Installation",
    description: "We supply and fit a system sized for the room, then commission it and show you how to use it.",
    icon: "AirVent",
  },
  {
    key: "servicing",
    menu: "Servicing",
    title: "Servicing",
    ref: "AC - Servicing",
    description: "Filters, coils and drains cleaned, performance checked and any developing problems found early.",
    icon: "Settings",
  },
  {
    key: "repair",
    menu: "Repair",
    title: "Repair",
    ref: "AC - Repair",
    description: "Not cooling or heating, leaking, noisy or showing an error code? We find the fault and fix it.",
    icon: "Wrench",
  },
];

export const acHref = (key: string) => `/air-conditioning/?service=${key}#book`;

/** Air conditioning services in the database live under /air-conditioning/, not in the Domestic lists. */
export const isAcService = (slug: string) => slug.startsWith("air-conditioning");

export const OTHER_REFS = { domestic: "Domestic - Other appliance", commercial: "Commercial - Other equipment" } as const;

export const serviceRef = (s: Pick<ServiceSummary, "category" | "menu_label" | "name">) =>
  `${s.category === "commercial" ? "Commercial" : "Domestic"} - ${s.menu_label || s.name}`;

export const categoryOfRef = (ref: string): BookingCategory | null =>
  ref.startsWith("Domestic - ") ? "domestic" : ref.startsWith("Commercial - ") ? "commercial" : ref.startsWith("AC - ") ? "ac" : null;

export type RefGroup = { category: BookingCategory; label: string; options: { ref: string; slug?: string }[] };

/** Every booking reference a customer can pick, grouped for the <select>. */
export function bookingGroups(services: ServiceSummary[]): RefGroup[] {
  const pick = (cat: "domestic" | "commercial") =>
    services.filter((s) => s.category === cat && !isAcService(s.slug)).map((s) => ({ ref: serviceRef(s), slug: s.slug }));
  return [
    { category: "domestic", label: "Domestic", options: [...pick("domestic"), { ref: OTHER_REFS.domestic }] },
    { category: "commercial", label: "Commercial", options: [...pick("commercial"), { ref: OTHER_REFS.commercial }] },
    { category: "ac", label: "Air conditioning", options: AC_OPTIONS.map((o) => ({ ref: o.ref, slug: o.key })) },
  ];
}

/** Maps ?service=<slug|ac-key> (used by older links and service pages) to a booking reference. */
export function refForParam(groups: RefGroup[], param: string): string | null {
  if (param === "air-conditioning-repair") return "AC - Repair";
  for (const g of groups) for (const o of g.options) if (o.slug === param || o.ref === param) return o.ref;
  return null;
}

/** Five 2-hour arrival windows inside the 08:00–18:00 working day. The server holds the same list. */
export const TIME_SLOTS = [
  { start: "08:00", end: "10:00" },
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
] as const;

export const slotLabel = (start: string) => {
  const s = TIME_SLOTS.find((t) => t.start === start);
  return s ? `${s.start}–${s.end}` : start;
};

/** Fired by the service pickers on the Domestic / Commercial / AC pages; the booking form listens. */
export const SELECT_REF_EVENT = "hs:select-ref";
export function selectBookingRef(ref: string) {
  window.dispatchEvent(new CustomEvent(SELECT_REF_EVENT, { detail: ref }));
}
