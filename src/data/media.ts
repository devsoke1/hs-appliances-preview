/**
 * Which photo goes where. Source of truth: scripts/image-sources.json (credits in docs/image-credits.md).
 * Optimised files live in public/images/{name}-{width}.webp (see src/data/images.json for sizes).
 */
import sources from "../../scripts/image-sources.json";
import manifest from "./images.json";
import { publicPath } from "@/lib/public-path";

type Source = { name: string; alt: string; service?: string; area?: string; post?: string };
export type ImageRef = { name: string; alt: string };

const list = (sources as { images: Source[] }).images;
const images = manifest as Record<string, { width: number; height: number; widths: number[] }>;

const ref = (s?: Source): ImageRef | null => (s && images[s.name] ? { name: s.name, alt: s.alt } : null);
const byName = (name: string) => ref(list.find((i) => i.name === name));

/** Fixed slots on the static pages. Van photos wait for the business's own picture. */
export const siteImages = {
  hero: byName("washing-machine-repair-feltham"),
  howItWorks: byName("electric-oven-repair"),
  whyUs: byName("display-fridge-repair"),
  about: byName("cold-room-repair"),
  cta: byName("engineer-tool-wall"),
} as const;

export const serviceImage = (slug: string) => ref(list.find((i) => i.service === slug));
export const areaImage = (slug: string) => ref(list.find((i) => i.area === slug));
export const postImage = (slug: string) => ref(list.find((i) => i.post === slug));

/** Public path of the closest generated width ≥ `want` (e.g. "/images/x-800.webp"). */
export function imagePath(name: string, want = 800): string {
  const m = images[name];
  if (!m) return "";
  const w = m.widths.find((x) => x >= want) ?? m.widths[m.widths.length - 1];
  return publicPath(`/images/${name}-${w}.webp`);
}
