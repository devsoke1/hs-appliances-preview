export type ServiceCategory = "domestic" | "commercial";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  /** URL segment under /services/, e.g. "washing-machine-repair" */
  slug: string;
  /** Appliance name, e.g. "Washing Machine" */
  name: string;
  /** Page title / H1, e.g. "Washing Machine Repair" */
  title: string;
  category: ServiceCategory;
  /** One sentence for cards, menus and meta descriptions (≤160 chars) */
  shortDescription: string;
  /** Paragraphs of body copy for the service page */
  longDescription: string[];
  commonFaults: string[];
  faqs: FAQ[];
  /** Old WordPress path, used for redirects / url-map */
  legacyPath: string;
  /** Compliance note shown on page (e.g. Gas Safe / F-Gas) — must be confirmed before launch */
  complianceNote?: string;
}

export interface Brand {
  slug: string;
  name: string;
  /** Appliance types commonly serviced for this brand (service slugs) */
  services: string[];
}

export interface Area {
  slug: string;
  name: string;
  /** e.g. "London Borough of Hounslow" */
  borough?: string;
  postcodes: string[];
  /** Unique local copy — avoid duplicate thin pages */
  intro?: string;
  /** Approx distance from the Feltham base, if you want to show it */
  distanceMiles?: number;
  /** Nearby area slugs for internal linking */
  nearby?: string[];
}

export interface OpeningHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  /** 24h "HH:MM", or null when closed */
  opens: string | null;
  closes: string | null;
}
