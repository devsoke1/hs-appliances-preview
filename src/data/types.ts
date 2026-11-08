export type ServiceCategory = "domestic" | "commercial";

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface ServiceFault {
  name: string;
  detail: string;
}

export interface Service {
  /** URL segment under /services/, e.g. "washing-machine-repair" */
  slug: string;
  /** Appliance name, e.g. "Washing Machine" */
  name: string;
  /** Short service name, e.g. "Washing Machine Repair" (cards, menus, breadcrumbs) */
  title: string;
  category: ServiceCategory;
  /** One sentence for cards and meta descriptions (≤160 chars) */
  shortDescription: string;
  /** Opening paragraphs on the service page */
  intro: string[];
  /** "Common faults we fix", each with a short explanation */
  faults: ServiceFault[];
  /** Topic sections unique to this appliance */
  sections: ContentSection[];
  faqs: FAQ[];
  /** Old WordPress path, used for redirects / url-map */
  legacyPath: string;
  /** Compliance note shown on page (e.g. Gas Safe / F-Gas) — must be confirmed before launch */
  complianceNote?: string;
}

export interface Brand {
  slug: string;
  name: string;
  category: ServiceCategory | "both";
  /** Service slugs this brand is shown on */
  services: string[];
}

export interface Area {
  slug: string;
  name: string;
  /** Council / county, e.g. "London Borough of Hounslow" */
  borough: string;
  /** Postcode districts that belong to this area page */
  postcodes: string[];
  /** Approximate drive from the Feltham base, outside peak traffic */
  travel: { miles: number; minutes: string };
  /** One line for cards */
  summary: string;
  intro: string[];
  neighbourhoods: string[];
  /** Local context: housing, high streets, businesses */
  local: ContentSection;
  /**
   * Services highlighted on the page with a local reason.
   * [CONFIRM] Based on local property/business mix — replace with what your job records show.
   */
  keyServices: { slug: string; reason: string }[];
  /** Nearby area slugs for internal linking */
  nearby: string[];
}

export interface OpeningHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  /** 24h "HH:MM", or null when closed */
  opens: string | null;
  closes: string | null;
}
