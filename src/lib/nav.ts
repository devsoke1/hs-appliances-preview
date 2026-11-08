// No data imports here: Header/Footer are client components, and the service menu comes from the live API.
export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Areas", href: "/areas/" },
  { label: "About", href: "/about/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Insights", href: "/insights/" },
  { label: "Contact", href: "/contact/" },
];

export const companyLinks: NavLink[] = [
  { label: "About Us", href: "/about/" },
  { label: "All Services", href: "/services/" },
  { label: "Areas We Cover", href: "/areas/" },
  { label: "FAQs", href: "/faq/" },
  { label: "Insights", href: "/insights/" },
  { label: "Book a Repair", href: "/book/" },
  { label: "Contact", href: "/contact/" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms/" },
];
