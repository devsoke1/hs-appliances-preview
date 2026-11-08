import { preload } from "react-dom";
import manifest from "@/data/images.json";
import { cn } from "@/lib/cn";

type Entry = { width: number; height: number; widths: number[] };
const images = manifest as Record<string, Entry>;

export const hasImage = (name: string) => Boolean(images[name]);

/**
 * WebP image from the `npm run images` pipeline.
 * - width/height from the manifest → the browser reserves space (no layout shift)
 * - srcset/sizes → phones download a small file
 * - `priority` (hero only): eager + fetchpriority=high + <link rel="preload"> in <head>
 * - everything else: native lazy-loading
 */
export function ResponsiveImage({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className,
}: {
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const e = images[name];
  if (!e) return null;
  const srcSet = e.widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = `/images/${name}-${e.widths.find((w) => w >= 800) ?? e.widths[e.widths.length - 1]}.webp`;

  if (priority) {
    preload(fallback, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: images are pre-optimised by scripts/optimize-images.mjs
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={e.width}
      height={e.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-auto w-full object-cover", className)}
    />
  );
}
