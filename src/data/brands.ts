import type { Brand } from "./types";

const laundryCold = ["washing-machine-repair", "fridge-freezer-repair", "dishwasher-repair"];
const cooking = ["electric-cooker-repair", "electric-hob-repair", "microwave-repair"];
const commercialCold = ["cold-room-repair", "display-fridge-repair", "dairy-cabinet-repair", "bar-cooler-repair"];

/**
 * Brands we work on. Only list brands you genuinely service.
 * We are an independent repairer — never imply manufacturer approval/authorisation.
 * Logos: add SVGs to /public/brands/{slug}.svg later if you have rights to use them.
 */
export const brands: Brand[] = [
  // Named in the brief
  { slug: "beko", name: "Beko", category: "domestic", services: [...laundryCold, "electric-cooker-repair", "gas-cooker-repair"] },
  { slug: "lg", name: "LG", category: "both", services: [...laundryCold, "american-fridge-repair", "microwave-repair", "air-conditioning-repair"] },
  { slug: "samsung", name: "Samsung", category: "both", services: [...laundryCold, "american-fridge-repair", "microwave-repair", "air-conditioning-repair"] },
  { slug: "bosch", name: "Bosch", category: "domestic", services: [...laundryCold, ...cooking, "gas-hob-repair"] },
  { slug: "aeg", name: "AEG", category: "domestic", services: [...laundryCold, ...cooking, "gas-hob-repair"] },
  { slug: "miele", name: "Miele", category: "domestic", services: [...laundryCold, ...cooking] },
  // [CONFIRM] Domestic brands — keep only those you actually repair
  { slug: "hotpoint", name: "Hotpoint", category: "domestic", services: [...laundryCold, "electric-cooker-repair", "gas-cooker-repair"] },
  { slug: "indesit", name: "Indesit", category: "domestic", services: [...laundryCold, "electric-cooker-repair"] },
  { slug: "whirlpool", name: "Whirlpool", category: "domestic", services: [...laundryCold, "american-fridge-repair", "microwave-repair"] },
  { slug: "siemens", name: "Siemens", category: "domestic", services: [...laundryCold, ...cooking] },
  { slug: "neff", name: "Neff", category: "domestic", services: ["dishwasher-repair", ...cooking, "gas-hob-repair"] },
  { slug: "zanussi", name: "Zanussi", category: "domestic", services: [...laundryCold, "electric-cooker-repair"] },
  // [CONFIRM] Commercial / air-con brands — placeholders, edit to what you service
  { slug: "foster", name: "Foster", category: "commercial", services: [...commercialCold, "ice-machine-repair"] },
  { slug: "williams", name: "Williams", category: "commercial", services: commercialCold },
  { slug: "true", name: "True", category: "commercial", services: ["display-fridge-repair", "bar-cooler-repair"] },
  { slug: "hoshizaki", name: "Hoshizaki", category: "commercial", services: ["ice-machine-repair"] },
  { slug: "scotsman", name: "Scotsman", category: "commercial", services: ["ice-machine-repair"] },
  { slug: "daikin", name: "Daikin", category: "commercial", services: ["air-conditioning-repair"] },
  { slug: "mitsubishi-electric", name: "Mitsubishi Electric", category: "commercial", services: ["air-conditioning-repair"] },
];

/** The brands named in the brief — shown first / most prominently */
export const featuredBrandSlugs = ["beko", "lg", "samsung", "bosch", "aeg", "miele"];
export const featuredBrands = brands.filter((b) => featuredBrandSlugs.includes(b.slug));
export const brandsForService = (slug: string) => brands.filter((b) => b.services.includes(slug));

export const brandDisclaimer =
  "Brand names are trademarks of their respective owners. House & Shop Appliances is an independent repair business and is not affiliated with or authorised by these manufacturers.";
