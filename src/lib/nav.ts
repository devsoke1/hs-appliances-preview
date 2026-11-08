import { commercialServices, domesticServices, serviceHref } from "@/data/services";

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Areas", href: "/areas/" },
  { label: "About", href: "/about/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Advice", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export const serviceMenu = {
  domestic: domesticServices.map((s) => ({ label: s.name, href: serviceHref(s.slug), description: s.title })),
  commercial: commercialServices.map((s) => ({ label: s.name, href: serviceHref(s.slug), description: s.title })),
};

export const companyLinks: NavLink[] = [
  { label: "About Us", href: "/about/" },
  { label: "All Services", href: "/services/" },
  { label: "Areas We Cover", href: "/areas/" },
  { label: "FAQs", href: "/faq/" },
  { label: "Repair Advice", href: "/blog/" },
  { label: "Book a Repair", href: "/book/" },
  { label: "Contact", href: "/contact/" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms/" },
];
