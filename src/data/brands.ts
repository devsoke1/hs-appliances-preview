import type { Brand } from "./types";

const domesticCore = [
  "washing-machine-repair",
  "fridge-freezer-repair",
  "dishwasher-repair",
];

/**
 * Brands we work on. Only list brands you genuinely service.
 * We are an independent repairer — never imply manufacturer approval/authorisation.
 */
export const brands: Brand[] = [
  { slug: "beko", name: "Beko", services: [...domesticCore, "electric-cooker-repair"] },
  { slug: "lg", name: "LG", services: [...domesticCore, "american-fridge-repair", "microwave-repair"] },
  { slug: "samsung", name: "Samsung", services: [...domesticCore, "american-fridge-repair", "microwave-repair"] },
  { slug: "bosch", name: "Bosch", services: [...domesticCore, "electric-hob-repair", "electric-cooker-repair"] },
  { slug: "aeg", name: "AEG", services: [...domesticCore, "electric-hob-repair", "electric-cooker-repair"] },
  { slug: "miele", name: "Miele", services: [...domesticCore, "electric-hob-repair"] },
  // [CONFIRM] Add/remove to reflect what you actually repair:
  { slug: "hotpoint", name: "Hotpoint", services: domesticCore },
  { slug: "indesit", name: "Indesit", services: domesticCore },
  { slug: "whirlpool", name: "Whirlpool", services: domesticCore },
  { slug: "siemens", name: "Siemens", services: domesticCore },
  { slug: "neff", name: "Neff", services: [...domesticCore, "electric-hob-repair"] },
  { slug: "zanussi", name: "Zanussi", services: domesticCore },
];

/** The brands named in the brief — shown first / most prominently */
export const featuredBrandSlugs = ["beko", "lg", "samsung", "bosch", "aeg", "miele"];
export const featuredBrands = brands.filter((b) => featuredBrandSlugs.includes(b.slug));

export const brandDisclaimer =
  "Brand names are trademarks of their respective owners. House & Shop Appliances is an independent repair business and is not affiliated with or authorised by these manufacturers.";
