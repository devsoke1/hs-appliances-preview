import manifest from "@/data/images.json";
import { cn } from "@/lib/cn";
import { publicPath } from "@/lib/public-path";

type Entry = { width: number; height: number; widths: number[] };
const images = manifest as Record<string, Entry>;

/**
 * Renders an image path from the API/DB:
 *  - "/images/{name}-{w}.webp" from the build pipeline → full responsive srcset
 *  - anything else (e.g. admin uploads "/uploads/…") → plain <img>
 * Always lazy unless `priority`. The parent should set the aspect ratio (object-cover fills it),
 * so there is never layout shift.
 */
export function SmartImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const m = src.match(/^\/images\/(.+)-(\d+)\.webp$/);
  const entry = m ? images[m[1]] : undefined;
  const srcSet = entry && m ? entry.widths.map((w) => `${publicPath(`/images/${m[1]}-${w}.webp`)} ${w}w`).join(", ") : undefined;
  const resolvedSrc = publicPath(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; images are pre-optimised
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={entry?.width}
      height={entry?.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
