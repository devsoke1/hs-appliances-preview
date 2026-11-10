// No data imports here: Header/Footer are client components, and the service menus come from the live API.
export type NavLink = { label: string; href: string };

/** The three drop-down menus in the header (brief: Domestic, Commercial, Air Conditioning). */
export const categoryNav = [
  { key: "domestic", label: "Domestic", href: "/domestic/", title: "Domestic appliances", all: "All domestic appliances" },
  { key: "commercial", label: "Commercial", href: "/commercial/", title: "Commercial refrigeration", all: "All commercial equipment" },
  { key: "ac", label: "Air Conditioning", href: "/air-conditioning/", title: "Air conditioning", all: "About air conditioning" },
] as const;
export type CategoryKey = (typeof categoryNav)[number]["key"];

/** Secondary links — top bar on desktop, under the menus in the mobile drawer. */
export const mainNav: NavLink[] = [
  { label: "Areas", href: "/areas/" },
  { label: "About", href: "/about/" },
  { label: "Insights", href: "/insights/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

export const companyLinks: NavLink[] = [
  { label: "Domestic Appliances", href: "/domestic/" },
  { label: "Commercial Refrigeration", href: "/commercial/" },
  { label: "Air Conditioning", href: "/air-conditioning/" },
  { label: "About Us", href: "/about/" },
  { label: "Areas We Cover", href: "/areas/" },
  { label: "FAQs", href: "/faq/" },
  { label: "Insights", href: "/insights/" },
  { label: "Book Now", href: "/book/" },
  { label: "Contact", href: "/contact/" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms/" },
];
